import { notFound } from "next/navigation";
import Link from "next/link";
import { getMarket } from "@/lib/storage/markets";
import { getLatestPrediction } from "@/lib/storage/predictions";
import { PredictionBar, CouncilBreakdown } from "@/components";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MarketPage({ params }: PageProps) {
  const { id } = await params;
  const market = await getMarket(id);

  if (!market) {
    notFound();
  }

  const prediction = await getLatestPrediction(id);

  // Sort predictions by probability descending
  const sortedPredictions = prediction
    ? Object.entries(prediction.aggregatedPredictions).sort(
        ([, a], [, b]) => b - a
      )
    : [];

  const getOptionName = (optionId: string) => {
    return market.options.find((o) => o.id === optionId)?.name || optionId;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--foreground)] mb-6"
      >
        <span>&larr;</span> Back to markets
      </Link>

      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold">{market.title}</h1>
          <span className="text-xs px-2 py-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full text-[var(--muted)]">
            {market.category}
          </span>
        </div>
        <p className="text-[var(--muted)] mb-4">{market.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
          {market.resolutionDate && (
            <span>
              Resolves:{" "}
              {new Date(market.resolutionDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
          {market.source && (
            <a
              href={market.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline"
            >
              Source
            </a>
          )}
          <span
            className={`px-2 py-0.5 rounded text-xs ${
              market.status === "active"
                ? "bg-green-500/20 text-green-400"
                : market.status === "resolved"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-yellow-500/20 text-yellow-400"
            }`}
          >
            {market.status}
          </span>
        </div>
      </div>

      {prediction ? (
        <>
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Council Prediction</h2>
              <span className="text-sm text-[var(--muted)]">
                {formatDate(prediction.timestamp)}
              </span>
            </div>

            <div className="space-y-2">
              {sortedPredictions.map(([optionId, probability], index) => (
                <PredictionBar
                  key={optionId}
                  name={getOptionName(optionId)}
                  probability={probability}
                  rank={index}
                />
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[var(--card-border)] flex items-center gap-4 text-xs text-[var(--muted)]">
              <span>
                Council: {prediction.metadata.successfulMembers}/
                {prediction.metadata.councilSize} members
              </span>
              <span>
                Completed in {(prediction.metadata.totalDurationMs / 1000).toFixed(1)}s
              </span>
            </div>
          </div>

          <CouncilBreakdown prediction={prediction} options={market.options} />
        </>
      ) : (
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6 text-center">
          <p className="text-[var(--muted)]">No predictions yet for this market.</p>
          <p className="text-sm text-[var(--muted)] mt-2">
            Run{" "}
            <code className="bg-[var(--background)] px-2 py-1 rounded">
              npm run council {market.id}
            </code>{" "}
            to generate a prediction.
          </p>
        </div>
      )}
    </div>
  );
}
