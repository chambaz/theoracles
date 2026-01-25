import { z } from "zod";

const envSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  ANTHROPIC_API_KEY: z.string().min(1, "ANTHROPIC_API_KEY is required"),
  TAVILY_API_KEY: z.string().min(1, "TAVILY_API_KEY is required"),
});

export type Env = z.infer<typeof envSchema>;

export function getEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const missing = result.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Missing environment variables: ${missing}`);
  }

  return result.data;
}

export const config = {
  maxSearchSteps: 10,
  predictionTimeout: 120000, // 2 minutes per model
} as const;
