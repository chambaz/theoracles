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
    "dem-nominee-2028",
    "republican-nominee-2028",
    "presidential-election-2028",
    "us-strikes-iran",
    "nba-champion-2026",
    "fifa-world-cup-2026",
    "btc-price-feb-2026",
    "btc-price-2026",
    "fed-rate-cuts-2026",
    "us-recession-2026",
    "russia-ukraine-ceasefire-2026",
    "first-leave-trump-cabinet",
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
