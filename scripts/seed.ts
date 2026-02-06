import "dotenv/config";
import { notInArray } from "drizzle-orm";
import { db } from "../src/db";
import { markets, predictions } from "../src/db/schema";
import type { Market } from "../src/types";

const sampleMarkets: Market[] = [
  // ── Politics ────────────────────────────────────────────────────────
  {
    id: "dem-nominee-2028",
    title: "Democratic Presidential Nominee 2028",
    description:
      "This market resolves to the individual who wins and accepts the 2028 nomination of the Democratic Party for U.S. president. If no nominee is selected by the end date, resolves to the closest equivalent.",
    category: "Politics",
    options: [
      { id: "gavin-newsom", name: "Gavin Newsom" },
      { id: "aoc", name: "Alexandria Ocasio-Cortez" },
      { id: "josh-shapiro", name: "Josh Shapiro" },
      { id: "kamala-harris", name: "Kamala Harris" },
      { id: "pete-buttigieg", name: "Pete Buttigieg" },
      { id: "jon-ossoff", name: "Jon Ossoff" },
      { id: "andy-beshear", name: "Andy Beshear" },
      { id: "jb-pritzker", name: "J.B. Pritzker" },
      { id: "gretchen-whitmer", name: "Gretchen Whitmer" },
      { id: "other", name: "Other" },
    ],
    resolutionDate: "2028-11-07",
    source:
      "https://polymarket.com/event/democratic-presidential-nominee-2028",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "presidential-election-2028",
    title: "Presidential Election Winner 2028",
    description:
      "This market resolves to the person who wins the 2028 US Presidential Election, based on the Associated Press, Fox News, and NBC all calling the race for the same candidate. If all three haven't called it by inauguration (January 20, 2029), resolves based on who is inaugurated.",
    category: "Politics",
    options: [
      { id: "jd-vance", name: "JD Vance" },
      { id: "gavin-newsom", name: "Gavin Newsom" },
      { id: "marco-rubio", name: "Marco Rubio" },
      { id: "aoc", name: "Alexandria Ocasio-Cortez" },
      { id: "josh-shapiro", name: "Josh Shapiro" },
      { id: "kamala-harris", name: "Kamala Harris" },
      { id: "donald-trump", name: "Donald Trump" },
      { id: "pete-buttigieg", name: "Pete Buttigieg" },
      { id: "ron-desantis", name: "Ron DeSantis" },
      { id: "other", name: "Other" },
    ],
    resolutionDate: "2028-11-07",
    source:
      "https://polymarket.com/event/presidential-election-winner-2028",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "first-leave-trump-cabinet",
    title: "Who will be the first to leave the Trump Cabinet?",
    description:
      "This market resolves to the first individual announced to leave the Trump Cabinet, or who otherwise ceases to be a member of the administration. If no one leaves by December 31, 2026, resolves to None before 2027.",
    category: "Politics",
    options: [
      { id: "kristi-noem", name: "Kristi Noem" },
      { id: "pam-bondi", name: "Pam Bondi" },
      { id: "none-before-2027", name: "None before 2027" },
      { id: "stephen-miran", name: "Stephen Miran" },
      { id: "lori-chavez-deremer", name: "Lori Chavez-DeRemer" },
      { id: "scott-bessent", name: "Scott Bessent" },
      { id: "howard-lutnick", name: "Howard Lutnick" },
      { id: "other", name: "Other" },
    ],
    resolutionDate: "2026-12-31",
    source:
      "https://polymarket.com/event/who-will-be-the-first-to-leave-the-trump-cabinet-828",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  {
    id: "republican-nominee-2028",
    title: "Republican Presidential Nominee 2028",
    description:
      "This market resolves to the individual who wins and accepts the 2028 nomination of the Republican Party for U.S. president. If no nominee is selected by the end date, resolves to the closest equivalent.",
    category: "Politics",
    options: [
      { id: "jd-vance", name: "JD Vance" },
      { id: "marco-rubio", name: "Marco Rubio" },
      { id: "donald-trump", name: "Donald Trump" },
      { id: "ron-desantis", name: "Ron DeSantis" },
      { id: "donald-trump-jr", name: "Donald Trump Jr." },
      { id: "tucker-carlson", name: "Tucker Carlson" },
      { id: "ted-cruz", name: "Ted Cruz" },
      { id: "glenn-youngkin", name: "Glenn Youngkin" },
      { id: "vivek-ramaswamy", name: "Vivek Ramaswamy" },
      { id: "other", name: "Other" },
    ],
    resolutionDate: "2028-11-07",
    source:
      "https://polymarket.com/event/republican-presidential-nominee-2028",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── Geopolitics ─────────────────────────────────────────────────────
  {
    id: "us-strikes-iran",
    title: "US strikes Iran by...?",
    description:
      "This market resolves to YES if the US initiates a drone, missile, or air strike on Iranian soil or any official Iranian embassy or consulate by the listed date. Intercepted missiles, ground operations, cyberattacks, or naval actions do not qualify.",
    category: "Geopolitics",
    options: [
      { id: "feb-28", name: "By February 28" },
      { id: "mar-31", name: "By March 31" },
      { id: "jun-30", name: "By June 30" },
      { id: "not-by-jun-30", name: "Not by June 30" },
    ],
    resolutionDate: "2026-06-30",
    source: "https://polymarket.com/event/us-strikes-iran-by",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "russia-ukraine-ceasefire-2026",
    title: "Russia x Ukraine ceasefire by end of 2026?",
    description:
      "This market resolves to YES if Russia and Ukraine agree to and implement a bilateral ceasefire of any duration by December 31, 2026. A ceasefire must be officially announced by both governments or confirmed by a major international organization.",
    category: "Geopolitics",
    options: [
      { id: "yes", name: "Yes" },
      { id: "no", name: "No" },
    ],
    resolutionDate: "2026-12-31",
    source: "https://polymarket.com/event/russia-x-ukraine-ceasefire-before-2027",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // ── Finance ─────────────────────────────────────────────────────────
  {
    id: "fed-rate-cuts-2026",
    title: "How many Fed rate cuts in 2026?",
    description:
      "This market resolves according to the exact number of 25 basis point rate cuts made by the Fed in 2026, including any cuts made during the December meeting. A 50 bps cut counts as 2 cuts. Emergency rate cuts outside of scheduled FOMC meetings also count.",
    category: "Finance",
    options: [
      { id: "0-cuts", name: "0 cuts" },
      { id: "1-cut", name: "1 cut (25 bps)" },
      { id: "2-cuts", name: "2 cuts (50 bps)" },
      { id: "3-cuts", name: "3 cuts (75 bps)" },
      { id: "4-cuts", name: "4 cuts (100 bps)" },
      { id: "5-cuts", name: "5+ cuts (125+ bps)" },
    ],
    resolutionDate: "2026-12-31",
    source: "https://polymarket.com/event/how-many-fed-rate-cuts-in-2026",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "us-recession-2026",
    title: "US recession by end of 2026?",
    description:
      "This market resolves to YES if U.S. real GDP declines for two consecutive quarters (Q2 2025 through Q4 2026), or if the NBER publicly announces a recession occurred during 2025-2026 by the time the BEA releases the Q4 2026 advance estimate.",
    category: "Finance",
    options: [
      { id: "yes", name: "Yes" },
      { id: "no", name: "No" },
    ],
    resolutionDate: "2027-01-31",
    source: "https://polymarket.com/event/us-recession-by-end-of-2026",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── Sports ───────────────────────────────────────────────────────────
  {
    id: "nba-champion-2026",
    title: "2026 NBA Champion",
    description:
      "This market resolves to the team that wins the 2026 NBA Finals. Resolution source is the NBA.",
    category: "Sports",
    options: [
      { id: "okc-thunder", name: "Oklahoma City Thunder" },
      { id: "denver-nuggets", name: "Denver Nuggets" },
      { id: "detroit-pistons", name: "Detroit Pistons" },
      { id: "boston-celtics", name: "Boston Celtics" },
      { id: "new-york-knicks", name: "New York Knicks" },
      { id: "san-antonio-spurs", name: "San Antonio Spurs" },
      { id: "houston-rockets", name: "Houston Rockets" },
      { id: "cleveland-cavaliers", name: "Cleveland Cavaliers" },
      { id: "minnesota-timberwolves", name: "Minnesota Timberwolves" },
      { id: "other", name: "Other" },
    ],
    resolutionDate: "2026-07-01",
    source: "https://polymarket.com/event/2026-nba-champion",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "fifa-world-cup-2026",
    title: "2026 FIFA World Cup Winner",
    description:
      "This market resolves to the nation that wins the 2026 FIFA World Cup, hosted by the United States, Canada, and Mexico. The final is scheduled for July 19, 2026 at MetLife Stadium in New Jersey.",
    category: "Sports",
    options: [
      { id: "spain", name: "Spain" },
      { id: "england", name: "England" },
      { id: "france", name: "France" },
      { id: "argentina", name: "Argentina" },
      { id: "brazil", name: "Brazil" },
      { id: "portugal", name: "Portugal" },
      { id: "germany", name: "Germany" },
      { id: "netherlands", name: "Netherlands" },
      { id: "other", name: "Other" },
    ],
    resolutionDate: "2026-07-19",
    source: "https://polymarket.com/event/2026-fifa-world-cup-winner-595",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── Crypto ──────────────────────────────────────────────────────────
  {
    id: "btc-price-feb-2026",
    title: "What price will Bitcoin hit in February?",
    description:
      "Each option resolves independently based on whether any Binance 1-minute candle for BTC/USDT reaches the specified high or low price at any point during February 2026.",
    category: "Crypto",
    options: [
      { id: "up-100k", name: "Hits $100,000" },
      { id: "up-95k", name: "Hits $95,000" },
      { id: "up-90k", name: "Hits $90,000" },
      { id: "up-85k", name: "Hits $85,000" },
      { id: "down-60k", name: "Drops to $60,000" },
      { id: "down-55k", name: "Drops to $55,000" },
      { id: "down-50k", name: "Drops to $50,000" },
    ],
    resolutionDate: "2026-03-01",
    source:
      "https://polymarket.com/event/what-price-will-bitcoin-hit-in-february-2026",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "btc-price-2026",
    title: "What price will Bitcoin hit in 2026?",
    description:
      "Each option resolves independently based on whether any Binance 1-minute candle for BTC/USDT reaches the specified high or low price at any point during 2026.",
    category: "Crypto",
    options: [
      { id: "up-250k", name: "Hits $250,000" },
      { id: "up-200k", name: "Hits $200,000" },
      { id: "up-150k", name: "Hits $150,000" },
      { id: "up-100k", name: "Hits $100,000" },
      { id: "down-65k", name: "Drops to $65,000" },
      { id: "down-55k", name: "Drops to $55,000" },
      { id: "down-35k", name: "Drops to $35,000" },
    ],
    resolutionDate: "2026-12-31",
    source: "https://polymarket.com/event/what-price-will-bitcoin-hit-before-2027",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function main() {
  console.log("Seeding markets...");

  let inserted = 0;
  for (const market of sampleMarkets) {
    const result = await db
      .insert(markets)
      .values({
        id: market.id,
        title: market.title,
        description: market.description,
        category: market.category,
        options: market.options,
        resolutionDate: market.resolutionDate
          ? new Date(market.resolutionDate)
          : null,
        source: market.source ?? null,
        status: market.status,
        createdAt: new Date(market.createdAt),
        updatedAt: new Date(market.updatedAt),
      })
      .onConflictDoUpdate({
        target: markets.id,
        set: {
          title: market.title,
          description: market.description,
          category: market.category,
          options: market.options,
          resolutionDate: market.resolutionDate
            ? new Date(market.resolutionDate)
            : null,
          source: market.source ?? null,
          status: market.status,
          updatedAt: new Date(market.updatedAt),
        },
      });

    if (result.rowCount && result.rowCount > 0) {
      inserted++;
      console.log(`  ✓ ${market.id}: ${market.title}`);
    }
  }

  console.log(`\nUpserted ${inserted} markets.`);

  // Remove markets (and their predictions) no longer in the seed file
  const seedIds = sampleMarkets.map((m) => m.id);
  const removedPredictions = await db
    .delete(predictions)
    .where(notInArray(predictions.marketId, seedIds));

  if (removedPredictions.rowCount && removedPredictions.rowCount > 0) {
    console.log(
      `Removed ${removedPredictions.rowCount} predictions for stale markets.`,
    );
  }

  const removedMarkets = await db
    .delete(markets)
    .where(notInArray(markets.id, seedIds));

  if (removedMarkets.rowCount && removedMarkets.rowCount > 0) {
    console.log(`Removed ${removedMarkets.rowCount} stale markets.`);
  }

  console.log("Done!");
}

main().catch(console.error);
