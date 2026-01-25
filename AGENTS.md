# AGENTS.md - The Oracles

This document provides guidelines for AI coding agents working in this repository.

## Project Overview

The Oracles is an LLM-powered prediction market where a council of AI models (GPT-4o, Claude Sonnet 4) independently research questions via web search and provide probability estimates, which are then aggregated into a consensus prediction.

**Tech Stack:** Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Vercel AI SDK 6, Zod 4

## Commands

### Development
```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Council Operations
```bash
npm run council <market-id>    # Run prediction for specific market
npm run council -- --all       # Run predictions for all active markets
npm run seed                   # Seed sample markets to data/markets.json
```

### Type Checking
```bash
npx tsc --noEmit               # Check TypeScript without emitting
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (read-only for MVP)
│   ├── market/[id]/       # Market detail page
│   ├── layout.tsx         # Root layout with dark theme
│   └── page.tsx           # Home page (market list)
├── components/            # React components
├── config/                # Configuration (council members, env)
├── lib/
│   ├── council/           # Council engine (orchestrator, member runner)
│   ├── storage/           # JSON file storage (markets, predictions)
│   ├── tools/             # AI tools (web search via Tavily)
│   └── providers.ts       # AI SDK provider setup
└── types/                 # TypeScript type definitions

scripts/                   # CLI scripts (run with tsx)
data/                      # JSON storage (markets.json, predictions/)
```

## Code Style Guidelines

### Imports
- Use `@/` path alias for all internal imports (maps to `./src/*`)
- Order: external packages → internal `@/` imports → relative imports
- Use `import type` for type-only imports
- Prefer named exports over default exports

```typescript
// Good
import { nanoid } from "nanoid";
import type { Market, CouncilPrediction } from "@/types";
import { runCouncilMember } from "./member";

// Avoid
import Market from "@/types/market";  // Don't use default exports
import { Market } from "../../types"; // Don't use relative paths for src/
```

### TypeScript
- Strict mode is enabled - no `any` types without justification
- Define interfaces for all data structures in `src/types/`
- Use `Record<string, T>` for string-keyed objects
- Prefer `interface` over `type` for object shapes
- Use union types for status fields: `"active" | "resolved" | "paused"`

```typescript
// Good
interface MarketOption {
  id: string;
  name: string;
  description?: string;  // Optional with ?
}

// Avoid
type MarketOption = {
  id: any;  // No any
}
```

### Naming Conventions
- **Files:** kebab-case (`web-search.ts`, `market-card.tsx`)
- **Components:** PascalCase (`MarketCard.tsx` → `export function MarketCard`)
- **Functions:** camelCase (`runCouncilMember`, `getMarkets`)
- **Interfaces:** PascalCase, no `I` prefix (`Market`, not `IMarket`)
- **Constants:** UPPER_SNAKE_CASE for config (`COUNCIL_MEMBERS`)

### React Components
- Use function components with explicit return types when complex
- Props interface named `{ComponentName}Props`
- Mark client components with `"use client"` directive when using hooks
- Server components are the default (no directive needed)

```typescript
interface MarketCardProps {
  market: Market;
  prediction?: CouncilPrediction | null;
}

export function MarketCard({ market, prediction }: MarketCardProps) {
  // ...
}
```

### Error Handling
- Use try/catch in API routes and async functions
- Log errors with `console.error` including context
- Return structured error responses from API routes
- Use `Promise.allSettled` for parallel operations that can partially fail

```typescript
// API route pattern
export async function GET() {
  try {
    const data = await fetchData();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
```

### Styling
- Use Tailwind CSS classes
- Use CSS variables for theme colors: `var(--card-bg)`, `var(--muted)`, etc.
- Dark theme is default (defined in `globals.css`)
- Avoid inline styles; use Tailwind utilities

### Zod Schemas
- Define schemas near where they're used
- Use `.describe()` for AI-facing schemas
- Validate external data at boundaries (API responses, user input)

```typescript
const PredictionSchema = z.object({
  predictions: z.record(z.string(), z.number()),
  reasoning: z.string(),
  confidence: z.number().min(0).max(1),
});
```

## AI SDK Patterns

### Tool Definition (Vercel AI SDK v6)
```typescript
import { tool } from "ai";
import { z } from "zod";

const myTool = tool({
  description: "Description for the LLM",
  inputSchema: z.object({
    query: z.string(),
  }),
  execute: async (args) => {
    // Implementation
    return result;
  },
});
```

### generateText with Tools
```typescript
import { generateText, stepCountIs } from "ai";

const result = await generateText({
  model,
  system: "System prompt",
  prompt: "User prompt",
  tools: { webSearch: webSearchTool },
  stopWhen: stepCountIs(10),  // Max 10 tool calls
});
```

## Data Storage

- **Markets:** `data/markets.json` - manually edited, committed to repo
- **Predictions:** `data/predictions/{marketId}/{timestamp}.json` - generated by CLI
- Latest prediction also saved as `latest.json` for quick access

## Environment Variables

Required in `.env.local`:
```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
TAVILY_API_KEY=tvly-...
```

## Key Files to Understand

- `src/lib/council/index.ts` - Council orchestrator (parallel execution)
- `src/lib/council/member.ts` - Single member runner (research + predict)
- `src/lib/tools/web-search.ts` - Tavily web search tool
- `src/config/council.ts` - Council member definitions
- `data/markets.json` - Market definitions
