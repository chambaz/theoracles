import { getMarkets } from "@/lib/storage/markets";
import { getLatestPrediction } from "@/lib/storage/predictions";
import { MarketCard } from "@/components";
import type { Market, CouncilPrediction } from "@/types";

export const dynamic = "force-dynamic";

async function getMarketsWithPredictions(): Promise<
  { market: Market; prediction: CouncilPrediction | null }[]
> {
  const markets = await getMarkets();

  const results = await Promise.all(
    markets.map(async (market) => {
      const prediction = await getLatestPrediction(market.id);
      return { market, prediction };
    }),
  );

  // Popularity order (based on Polymarket volume)
  const popularityOrder = [
    "fed-chair-2026",
    "us-strikes-iran-2026",
    "us-gov-shutdown-feb-2026",
    "fed-decision-march-2026",
    "oscars-best-picture-2026",
    "tesla-fsd-june-2026",
    "btc-price-2026",
    "companies-acquired-2027",
    "russia-ukraine-ceasefire-2026",
    "us-acquires-greenland-2026",
    "first-leave-trump-cabinet",
    "best-ai-model-march-2026",
    "largest-company-june-2026",
    "openai-ipo-market-cap",
    "openai-ipo-2026",
    "grammys-song-of-year-2026",
    "anthropic-500b-valuation-2026",
    "ai-video-oscars-2027",
  ];

  return results.sort((a, b) => {
    // Active markets first
    if (a.market.status !== b.market.status) {
      return a.market.status === "active" ? -1 : 1;
    }
    // Then by popularity
    const aIdx = popularityOrder.indexOf(a.market.id);
    const bIdx = popularityOrder.indexOf(b.market.id);
    return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx);
  });
}

export default async function HomePage() {
  const marketsWithPredictions = await getMarketsWithPredictions();

  return (
    <div>
      {marketsWithPredictions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No markets yet.</p>
          <p className="text-sm mt-2">
            Run <code className="bg-muted px-2 py-1 rounded">npm run seed</code>{" "}
            to create sample markets.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {marketsWithPredictions.map(({ market, prediction }) => (
            <MarketCard
              key={market.id}
              market={market}
              prediction={prediction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
