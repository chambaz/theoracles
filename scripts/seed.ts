import { saveMarkets } from "../src/lib/storage/markets";
import type { Market } from "../src/types";

const sampleMarkets: Market[] = [
  {
    id: "fed-chair-2026",
    title: "Who will Trump nominate as Fed Chair?",
    description:
      "This market resolves to the person Donald Trump officially nominates to serve as the next Chair of the Federal Reserve. Current Fed Chair Jerome Powell's term expires in May 2026.",
    category: "Politics",
    options: [
      { id: "kevin-warsh", name: "Kevin Warsh" },
      { id: "rick-rieder", name: "Rick Rieder" },
      { id: "christopher-waller", name: "Christopher Waller" },
      { id: "kevin-hassett", name: "Kevin Hassett" },
      { id: "scott-bessent", name: "Scott Bessent" },
      { id: "judy-shelton", name: "Judy Shelton" },
      { id: "michelle-bowman", name: "Michelle Bowman" },
      { id: "other", name: "Other" },
    ],
    resolutionDate: "2026-12-31",
    source: "https://polymarket.com/event/who-will-trump-nominate-as-fed-chair",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "btc-200k-2026",
    title: "Will Bitcoin reach $200,000 in 2026?",
    description:
      "This market resolves to YES if Bitcoin (BTC) reaches a price of $200,000 USD or higher on any major exchange (Coinbase, Binance, Kraken) at any point during 2026.",
    category: "Crypto",
    options: [
      { id: "yes", name: "Yes" },
      { id: "no", name: "No" },
    ],
    resolutionDate: "2026-12-31",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ai-video-oscars-2027",
    title: "Will an AI-generated film win an Oscar by 2027?",
    description:
      "This market resolves to YES if a film that is primarily AI-generated (including AI-generated visuals, script, or direction) wins any Academy Award at the 2027 Oscars ceremony or earlier.",
    category: "Technology",
    options: [
      { id: "yes", name: "Yes" },
      { id: "no", name: "No" },
    ],
    resolutionDate: "2027-03-01",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function main() {
  console.log("Seeding markets...");
  await saveMarkets(sampleMarkets);
  console.log(`Created ${sampleMarkets.length} markets:`);
  for (const market of sampleMarkets) {
    console.log(`  - ${market.id}: ${market.title}`);
  }
  console.log("\nDone!");
}

main().catch(console.error);
