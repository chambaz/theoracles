import { pgTable, text, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import type { MarketOption, ModelPrediction } from "@/types";

export const markets = pgTable("markets", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  options: jsonb("options").notNull().$type<MarketOption[]>(),
  resolutionDate: timestamp("resolution_date", { withTimezone: true }),
  source: text("source"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const predictions = pgTable(
  "predictions",
  {
    id: text("id").primaryKey(),
    marketId: text("market_id")
      .notNull()
      .references(() => markets.id),
    timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),
    memberPredictions: jsonb("member_predictions")
      .notNull()
      .$type<ModelPrediction[]>(),
    aggregatedPredictions: jsonb("aggregated_predictions")
      .notNull()
      .$type<Record<string, number>>(),
    metadata: jsonb("metadata")
      .notNull()
      .$type<{
        councilSize: number;
        successfulMembers: number;
        failedMembers: string[];
        aggregationMethod: "mean";
        totalDurationMs: number;
      }>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_predictions_market_timestamp").on(
      table.marketId,
      table.timestamp
    ),
  ]
);
