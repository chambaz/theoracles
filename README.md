# The Oracles

An LLM-powered prediction market where a council of AI models independently research questions via web search and provide probability estimates, aggregated into a consensus prediction.

Inspired by [Karpathy's LLM council idea](https://x.com/kaborafode/status/1886518584568619434) and [Polymarket](https://polymarket.com).

## How It Works

1. A market is defined with a question and a set of possible outcomes
2. Three AI models (GPT-4.1, Claude Sonnet 4, Grok 3) independently research the question using web search
3. Each model produces calibrated probability estimates for every outcome
4. The council's predictions are aggregated into a consensus via mean averaging

## Tech Stack

- **Framework:** Next.js 16, React 19, TypeScript 5
- **Styling:** Tailwind CSS 4, shadcn/ui
- **AI:** Vercel AI SDK 6 (OpenAI, Anthropic, xAI), Tavily web search
- **Database:** Neon (serverless Postgres) + Drizzle ORM

## Setup

```bash
npm install
cp .env.example .env  # Add your API keys
npm run db:push        # Push schema to Neon
npm run seed           # Seed markets
npm run dev            # Start dev server
```

### Environment Variables

```
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
XAI_API_KEY=xai-...
TAVILY_API_KEY=tvly-...
DATABASE_URL=postgresql://...
```

## Running the Council

```bash
npm run council <market-id>    # Run prediction for a specific market
npm run council -- --all       # Run predictions for all active markets
```

## License

MIT
