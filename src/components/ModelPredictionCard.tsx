"use client";

import { useState } from "react";
import type { ModelPrediction, MarketOption } from "@/types";
import { PredictionBar } from "./PredictionBar";

interface ModelPredictionCardProps {
  prediction: ModelPrediction;
  options: MarketOption[];
}

export function ModelPredictionCard({
  prediction,
  options,
}: ModelPredictionCardProps) {
  const [expanded, setExpanded] = useState(false);

  const sortedPredictions = Object.entries(prediction.predictions).sort(
    ([, a], [, b]) => b - a
  );

  const getOptionName = (optionId: string) => {
    return options.find((o) => o.id === optionId)?.name || optionId;
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg overflow-hidden">
      <div className="p-4 border-b border-[var(--card-border)]">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{prediction.modelName}</h3>
          <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
            <span>{(prediction.confidence * 100).toFixed(0)}% confident</span>
            <span>{prediction.searchQueries.length} searches</span>
            <span>{(prediction.durationMs / 1000).toFixed(1)}s</span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-1">
        {sortedPredictions.slice(0, 5).map(([optionId, probability], index) => (
          <PredictionBar
            key={optionId}
            name={getOptionName(optionId)}
            probability={probability}
            rank={index}
          />
        ))}
        {sortedPredictions.length > 5 && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-[var(--accent)] hover:underline mt-2"
          >
            Show {sortedPredictions.length - 5} more
          </button>
        )}
        {expanded &&
          sortedPredictions.slice(5).map(([optionId, probability], index) => (
            <PredictionBar
              key={optionId}
              name={getOptionName(optionId)}
              probability={probability}
              rank={index + 5}
            />
          ))}
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          {expanded ? "Hide" : "Show"} reasoning
        </button>

        {expanded && (
          <div className="mt-3 space-y-3">
            <div className="text-sm text-[var(--foreground)] leading-relaxed whitespace-pre-wrap bg-[var(--background)] rounded-md p-3">
              {prediction.reasoning}
            </div>

            {prediction.sources.length > 0 && (
              <div>
                <p className="text-xs text-[var(--muted)] mb-1">Sources:</p>
                <ul className="text-xs space-y-1">
                  {prediction.sources.map((source, i) => (
                    <li key={i}>
                      <a
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline break-all"
                      >
                        {source}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {prediction.searchQueries.length > 0 && (
              <div>
                <p className="text-xs text-[var(--muted)] mb-1">
                  Search queries:
                </p>
                <ul className="text-xs text-[var(--muted)] list-disc list-inside">
                  {prediction.searchQueries.map((query, i) => (
                    <li key={i}>{query}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
