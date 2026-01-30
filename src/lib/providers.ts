import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createXai } from "@ai-sdk/xai";
import type { LanguageModel } from "ai";

let openaiClient: ReturnType<typeof createOpenAI> | null = null;
let anthropicClient: ReturnType<typeof createAnthropic> | null = null;
let xaiClient: ReturnType<typeof createXai> | null = null;

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

function getXai() {
  if (!xaiClient) {
    xaiClient = createXai({
      apiKey: process.env.XAI_API_KEY,
    });
  }
  return xaiClient;
}

export function getModel(
  provider: "openai" | "anthropic" | "xai",
  model: string
): LanguageModel {
  switch (provider) {
    case "openai":
      return getOpenAI()(model);
    case "anthropic":
      return getAnthropic()(model);
    case "xai":
      return getXai()(model);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}
