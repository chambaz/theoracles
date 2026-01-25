import { generateText, tool, stepCountIs } from "ai";
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

// Schema for the prediction output
const PredictionOutputSchema = z.object({
  predictions: z.record(z.string(), z.number()),
  reasoning: z.string(),
  sources: z.array(z.string()),
  confidence: z.number().min(0).max(1),
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
 * Extract JSON from text that might contain markdown code blocks
 */
function extractJson(text: string): string {
  // Try to find JSON in code blocks first
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // Try to find JSON object directly
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }

  return text;
}

/**
 * Run a single council member to generate a prediction for a market
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

  const prompt = `${buildPredictionPrompt(market)}

After completing your research, respond with a JSON object in this exact format:
{
  "predictions": {
    "<option_id>": <probability>,
    ...
  },
  "reasoning": "<your detailed analysis>",
  "sources": ["<url1>", "<url2>", ...],
  "confidence": <0-1>
}

Make sure probabilities sum to 1.0 and use the exact option IDs from the market.`;

  const result = await generateText({
    model,
    system: systemPrompt,
    prompt,
    tools: { webSearch: webSearchTool },
    stopWhen: stepCountIs(10),
  });

  // Parse the final response
  const jsonText = extractJson(result.text);
  let parsed: z.infer<typeof PredictionOutputSchema>;

  try {
    const rawParsed = JSON.parse(jsonText);
    parsed = PredictionOutputSchema.parse(rawParsed);
  } catch (error) {
    console.error(`[${member.name}] Failed to parse response:`, result.text);
    throw new Error(
      `Failed to parse prediction from ${member.name}: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }

  const normalizedPredictions = normalizeProbabilities(parsed.predictions);

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
