import { generateText, Output, tool, stepCountIs } from "ai";
import { z } from "zod";
import type { CouncilMember } from "@/config/council";
import type { Market, ModelPrediction } from "@/types";
import { getModel } from "@/lib/providers";
import {
  webSearchSchema,
  executeWebSearch,
  webSearchToolDescription,
} from "@/lib/tools/web-search";
import { buildPredictionPrompt, systemPrompt } from "./prompts";

// Schema for the structured prediction output.
// Uses an array of { optionId, probability } instead of z.record()
// because OpenAI's strict JSON schema does not support propertyNames.
const PredictionOutputSchema = z.object({
  predictions: z
    .array(
      z.object({
        optionId: z.string().describe("The option ID from the market"),
        probability: z
          .number()
          .describe("Probability between 0 and 1 for this option"),
      })
    )
    .describe("Probability for each option, must sum to 1.0"),
  reasoning: z
    .string()
    .describe("Detailed analysis explaining the prediction"),
  sources: z
    .array(z.string())
    .describe("URLs of sources used in the analysis"),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("Confidence level in the prediction, 0 to 1"),
});

/**
 * Normalize probabilities to ensure they sum to 1.0
 */
function normalizeProbabilities(
  predictions: Record<string, number>
): Record<string, number> {
  const total = Object.values(predictions).reduce((sum, p) => sum + p, 0);

  if (total === 0) {
    const count = Object.keys(predictions).length;
    const equal = 1 / count;
    return Object.fromEntries(
      Object.keys(predictions).map((k) => [k, equal])
    );
  }

  return Object.fromEntries(
    Object.entries(predictions).map(([k, v]) => [k, v / total])
  );
}

/**
 * Run a single council member to generate a prediction for a market.
 *
 * Two-phase approach for maximum provider compatibility:
 * 1. Research: generateText with web search tools (no structured output)
 * 2. Predict: generateText with Output.object() (no tools)
 *
 * This avoids provider limitations where tools + json_schema cannot be
 * combined in a single request (e.g. xAI/Grok).
 */
export async function runCouncilMember(
  member: CouncilMember,
  market: Market
): Promise<ModelPrediction> {
  const startTime = Date.now();
  const searchQueries: string[] = [];

  const model = getModel(member.provider, member.model);

  const webSearchTool = tool({
    description: webSearchToolDescription,
    inputSchema: webSearchSchema,
    execute: async (args) => {
      searchQueries.push(args.query);
      return executeWebSearch(args);
    },
  });

  // Phase 1: Research with web search tools
  const researchController = new AbortController();
  const researchTimeout = setTimeout(
    () => researchController.abort(),
    120000
  );

  let researchResult;
  try {
    researchResult = await generateText({
      model,
      system: systemPrompt,
      prompt: buildPredictionPrompt(market),
      tools: { webSearch: webSearchTool },
      stopWhen: stepCountIs(5),
      maxOutputTokens: 4096,
      abortSignal: researchController.signal,
    });
  } finally {
    clearTimeout(researchTimeout);
  }

  // Aggregate research from all steps.
  // researchResult.text only contains the FINAL step's text, which is often
  // empty when stepCountIs() triggers after a tool-call step. We need to
  // collect text from every step plus the raw tool results.
  const researchText = researchResult.steps
    .map((step) => step.text)
    .filter((text) => text.length > 0)
    .join("\n\n");

  const searchResultsText = researchResult.steps
    .flatMap((step) => step.toolResults)
    .map((tr) => JSON.stringify(tr.output))
    .join("\n\n");

  const fullResearch = [researchText, searchResultsText]
    .filter((t) => t.length > 0)
    .join("\n\n---\nRaw search results:\n");

  console.log(
    `[${member.name}] Phase 1 complete: ${researchResult.steps.length} steps, ` +
      `researchText=${researchText.length} chars, ` +
      `searchResults=${searchResultsText.length} chars, ` +
      `fullResearch=${fullResearch.length} chars`,
  );

  // Phase 2: Generate structured prediction from research
  const optionIds = market.options.map((o) => o.id);

  const predictionController = new AbortController();
  const predictionTimeout = setTimeout(
    () => predictionController.abort(),
    30000
  );

  let predictionResult;
  try {
    predictionResult = await generateText({
      model,
      output: Output.object({
        name: "PredictionOutput",
        description:
          "Structured prediction with probabilities, reasoning, sources, and confidence",
        schema: PredictionOutputSchema,
      }),
      system:
        "You are an expert prediction market analyst. Based on the research provided, generate a structured prediction. Use the exact option IDs specified. Probabilities must sum to 1.0.",
      prompt: `Based on the following research, generate your prediction.

The option IDs are: ${optionIds.join(", ")}

Research:
${fullResearch}`,
      maxOutputTokens: 1024,
      abortSignal: predictionController.signal,
    });
  } finally {
    clearTimeout(predictionTimeout);
  }

  const parsed = predictionResult.output;

  if (!parsed) {
    throw new Error(
      `${member.name} failed to generate a structured prediction`
    );
  }

  // Convert array of { optionId, probability } to Record and validate
  const validOptionIds = new Set(optionIds);
  const validPredictions: Record<string, number> = {};
  for (const { optionId, probability } of parsed.predictions) {
    if (validOptionIds.has(optionId)) {
      validPredictions[optionId] = probability;
    } else {
      console.warn(
        `[${member.name}] Ignoring unknown option ID: "${optionId}"`
      );
    }
  }

  if (Object.keys(validPredictions).length === 0) {
    throw new Error(
      `${member.name} returned no valid option IDs. Expected: ${[...validOptionIds].join(", ")}`
    );
  }

  const normalizedPredictions = normalizeProbabilities(validPredictions);

  return {
    model: member.model,
    modelName: member.name,
    predictions: normalizedPredictions,
    reasoning: parsed.reasoning,
    sources: parsed.sources,
    searchQueries,
    confidence: parsed.confidence,
    timestamp: new Date().toISOString(),
    durationMs: Date.now() - startTime,
  };
}
