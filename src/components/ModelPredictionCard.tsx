"use client";

import { useState } from "react";
import type { ModelPrediction, MarketOption } from "@/types";
import { PredictionBar } from "./PredictionBar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{prediction.modelName}</h3>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{(prediction.confidence * 100).toFixed(0)}% confident</span>
            <span>{prediction.searchQueries.length} searches</span>
            <span>{(prediction.durationMs / 1000).toFixed(1)}s</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-1">
        {sortedPredictions
          .slice(0, 5)
          .map(([optionId, probability], index) => (
            <PredictionBar
              key={optionId}
              name={getOptionName(optionId)}
              probability={probability}
              rank={index}
            />
          ))}
        {sortedPredictions.length > 5 && !expanded && (
          <Button
            variant="link"
            size="sm"
            onClick={() => setExpanded(true)}
            className="px-0 text-xs"
          >
            Show {sortedPredictions.length - 5} more
          </Button>
        )}
        {expanded &&
          sortedPredictions
            .slice(5)
            .map(([optionId, probability], index) => (
              <PredictionBar
                key={optionId}
                name={getOptionName(optionId)}
                probability={probability}
                rank={index + 5}
              />
            ))}

        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="px-0 text-muted-foreground hover:text-foreground"
          >
            {expanded ? "Hide" : "Show"} reasoning
          </Button>

          {expanded && (
            <div className="mt-3 space-y-3">
              <div className="text-sm leading-relaxed whitespace-pre-wrap bg-muted rounded-md p-3">
                {prediction.reasoning}
              </div>

              {prediction.sources.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Sources:
                  </p>
                  <ul className="text-xs space-y-1">
                    {prediction.sources.map((source, i) => (
                      <li key={i}>
                        <a
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline break-all"
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
                  <p className="text-xs text-muted-foreground mb-1">
                    Search queries:
                  </p>
                  <ul className="text-xs text-muted-foreground list-disc list-inside">
                    {prediction.searchQueries.map((query, i) => (
                      <li key={i}>{query}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
