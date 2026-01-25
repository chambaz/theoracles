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
    })
  );

  // Sort: active markets first, then by most recent prediction
  return results.sort((a, b) => {
    if (a.market.status !== b.market.status) {
      return a.market.status === "active" ? -1 : 1;
    }
    if (a.prediction && b.prediction) {
      return (
        new Date(b.prediction.timestamp).getTime() -
        new Date(a.prediction.timestamp).getTime()
      );
    }
    return a.prediction ? -1 : 1;
  });
}

export default async function HomePage() {
  const marketsWithPredictions = await getMarketsWithPredictions();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Markets</h1>
        <p className="text-[var(--muted)]">
          AI council predictions on current events and future outcomes
        </p>
      </div>

      {marketsWithPredictions.length === 0 ? (
        <div className="text-center py-12 text-[var(--muted)]">
          <p>No markets yet.</p>
          <p className="text-sm mt-2">
            Run <code className="bg-[var(--card-bg)] px-2 py-1 rounded">npm run seed</code> to create sample markets.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
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
