import { z } from "zod";

interface TavilyResult {
  title: string;
  url: string;
  content: string;
}

interface TavilyResponse {
  answer?: string;
  results: TavilyResult[];
}

export const webSearchSchema = z.object({
  query: z.string().describe("The search query to find relevant information"),
});

export type WebSearchInput = z.infer<typeof webSearchSchema>;

export interface WebSearchResult {
  answer: string | null;
  results: { title: string; url: string; snippet: string }[];
}

export async function executeWebSearch(
  input: WebSearchInput
): Promise<WebSearchResult> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not set");
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      query: input.query,
      search_depth: "basic",
      include_answer: true,
      include_raw_content: false,
      max_results: 5,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Tavily API error: ${response.status} - ${error}`);
  }

  const data: TavilyResponse = await response.json();

  return {
    answer: data.answer || null,
    results: data.results.map((r) => ({
      title: r.title,
      url: r.url,
      snippet: r.content,
    })),
  };
}

export const webSearchToolDescription =
  "Search the web for current information about news, events, people, and data relevant to the prediction question. Use this to find recent developments, expert opinions, and factual information.";
