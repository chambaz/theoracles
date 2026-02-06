import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getMarket } from "@/lib/storage/markets";
import { getLatestPrediction } from "@/lib/storage/predictions";
import { PredictionBar, CouncilBreakdown, LocalTime } from "@/components";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { sortPredictions } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const market = await getMarket(id);

  if (!market) {
    return {};
  }

  const title = `${market.title} | The Oracles`;

  return {
    title,
    openGraph: {
      title,
      images: [
        {
          url: "/theoracles.png",
          width: 1536,
          height: 1024,
          alt: "The Oracles",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: ["/theoracles.png"],
    },
  };
}

export default async function MarketPage({ params }: PageProps) {
  const { id } = await params;
  const market = await getMarket(id);

  if (!market) {
    notFound();
  }

  const prediction = await getLatestPrediction(id);

  const sortedPredictions = prediction
    ? sortPredictions(Object.entries(prediction.aggregatedPredictions))
    : [];

  const getOptionName = (optionId: string) => {
    return market.options.find((o) => o.id === optionId)?.name || optionId;
  };

  return (
    <div className="pb-4">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/">
          <span>&larr;</span> Back to markets
        </Link>
      </Button>

      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold">{market.title}</h1>
          <Badge variant="secondary">{market.category}</Badge>
        </div>
        <p className="text-muted-foreground mb-4">{market.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground items-center">
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
          {market.source && market.source.startsWith("https://") && (
            <a
              href={market.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Source
            </a>
          )}
          <Badge
            variant={
              market.status === "active"
                ? "default"
                : market.status === "resolved"
                  ? "secondary"
                  : "outline"
            }
          >
            {market.status}
          </Badge>
        </div>
      </div>

      {prediction ? (
        <>
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Council Prediction</h2>
                <LocalTime
                  timestamp={prediction.timestamp}
                  className="text-sm text-muted-foreground"
                />
              </div>
            </CardHeader>

            <CardContent>
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
            </CardContent>

            <CardFooter className="border-t pt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                Council: {prediction.metadata.successfulMembers}/
                {prediction.metadata.councilSize} members
              </span>
              <span>
                Completed in{" "}
                {(prediction.metadata.totalDurationMs / 1000).toFixed(1)}s
              </span>
            </CardFooter>
          </Card>

          <CouncilBreakdown prediction={prediction} options={market.options} />
        </>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No predictions yet for this market.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Run{" "}
              <code className="bg-muted px-2 py-1 rounded">
                npm run council {market.id}
              </code>{" "}
              to generate a prediction.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
