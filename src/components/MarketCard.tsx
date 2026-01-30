import Link from "next/link";
import type { Market, CouncilPrediction } from "@/types";
import { PredictionBar } from "./PredictionBar";

interface MarketCardProps {
  market: Market;
  prediction?: CouncilPrediction | null;
}

export function MarketCard({ market, prediction }: MarketCardProps) {
  // Sort predictions by probability descending
  const sortedPredictions = prediction
    ? Object.entries(prediction.aggregatedPredictions)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
    : [];

  const getOptionName = (optionId: string) => {
    return market.options.find((o) => o.id === optionId)?.name || optionId;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Link href={`/market/${market.id}`} className="h-full">
      <div className="h-full flex flex-col bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-5 hover:border-[var(--muted)] transition-colors cursor-pointer">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 className="font-semibold text-lg leading-tight">{market.title}</h2>
          <span className="text-xs px-2 py-1 bg-[var(--card-border)] rounded-full text-[var(--muted)] whitespace-nowrap">
            {market.category}
          </span>
        </div>

        <div className="flex-1">
          {sortedPredictions.length > 0 ? (
            <div className="space-y-1">
              {sortedPredictions.map(([optionId, probability], index) => (
                <PredictionBar
                  key={optionId}
                  name={getOptionName(optionId)}
                  probability={probability}
                  rank={index}
                />
              ))}
              {market.options.length > 3 && (
                <p className="text-xs text-[var(--muted)] mt-2">
                  +{market.options.length - 3} more options
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-[var(--muted)] italic">
              No predictions yet
            </p>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--muted)]">
          {market.resolutionDate && (
            <span>Resolves {new Date(market.resolutionDate).toLocaleDateString()}</span>
          )}
          {prediction && (
            <span>Updated {formatDate(prediction.timestamp)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
