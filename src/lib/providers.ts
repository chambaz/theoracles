import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import type { LanguageModel } from "ai";

let openaiClient: ReturnType<typeof createOpenAI> | null = null;
let anthropicClient: ReturnType<typeof createAnthropic> | null = null;

function getOpenAI() {
  if (!openaiClient) {
    openaiClient = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

function getAnthropic() {
  if (!anthropicClient) {
    anthropicClient = createAnthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

export function getModel(
  provider: "openai" | "anthropic",
  model: string
): LanguageModel {
  switch (provider) {
    case "openai":
      return getOpenAI()(model);
    case "anthropic":
      return getAnthropic()(model);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
