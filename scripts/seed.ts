import "dotenv/config";
import { db } from "../src/db";
import { markets } from "../src/db/schema";
import type { Market } from "../src/types";

const sampleMarkets: Market[] = [
  // ── Politics ────────────────────────────────────────────────────────
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
      { id: "pete-hegseth", name: "Pete Hegseth" },
      { id: "tulsi-gabbard", name: "Tulsi Gabbard" },
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
    id: "us-gov-shutdown-feb-2026",
    title: "US government shutdown by February 2026?",
    description:
      "This market resolves to YES if a lapse in federal government funding (government shutdown) occurs at any point before March 1, 2026. A shutdown is defined as the expiration of funding authority resulting in a lapse in appropriations.",
    category: "Politics",
    options: [
      { id: "yes", name: "Yes" },
      { id: "no", name: "No" },
    ],
    resolutionDate: "2026-03-01",
    source:
      "https://polymarket.com/event/will-there-be-another-us-government-shutdown-by-january-31",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── Geopolitics ─────────────────────────────────────────────────────
  {
    id: "us-strikes-iran-2026",
    title: "US strikes Iran by June 30, 2026?",
    description:
      "This market resolves to YES if the US initiates a drone, missile, or air strike on Iranian soil or any official Iranian embassy or consulate by June 30, 2026. Intercepted missiles or ground operations do not qualify.",
    category: "Geopolitics",
    options: [
      { id: "yes", name: "Yes" },
      { id: "no", name: "No" },
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
  {
    id: "us-acquires-greenland-2026",
    title: "Will the US acquire part of Greenland in 2026?",
    description:
      "This market resolves to YES if the United States acquires sovereignty, ownership, or administrative control over any part of Greenland by December 31, 2026. This includes purchase, lease, or treaty-based transfer.",
    category: "Geopolitics",
    options: [
      { id: "yes", name: "Yes" },
      { id: "no", name: "No" },
    ],
    resolutionDate: "2026-12-31",
    source:
      "https://polymarket.com/event/will-the-us-acquire-any-part-of-greenland-in-2026",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── Finance ─────────────────────────────────────────────────────────
  {
    id: "fed-decision-march-2026",
    title: "Fed decision in March 2026",
    description:
      "This market resolves to the change in the upper bound of the target federal funds rate after the FOMC meeting scheduled for March 17-18, 2026. If no statement is released by the end date of the next scheduled meeting, resolves to No change.",
    category: "Finance",
    options: [
      { id: "50-bps-decrease", name: "50+ bps decrease" },
      { id: "25-bps-decrease", name: "25 bps decrease" },
      { id: "no-change", name: "No change" },
      { id: "25-bps-increase", name: "25+ bps increase" },
    ],
    resolutionDate: "2026-03-18",
    source: "https://polymarket.com/event/fed-decision-in-march-885",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "largest-company-june-2026",
    title: "Largest company by market cap end of June 2026?",
    description:
      "This market resolves to the publicly traded company with the highest market capitalization at market close on the last trading day of June 2026, based on data from Bloomberg or equivalent.",
    category: "Finance",
    options: [
      { id: "nvidia", name: "NVIDIA" },
      { id: "apple", name: "Apple" },
      { id: "microsoft", name: "Microsoft" },
      { id: "amazon", name: "Amazon" },
      { id: "alphabet", name: "Alphabet" },
      { id: "saudi-aramco", name: "Saudi Aramco" },
      { id: "other", name: "Other" },
    ],
    resolutionDate: "2026-06-30",
    source: "https://polymarket.com/event/largest-company-end-of-june-712",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── Technology ──────────────────────────────────────────────────────
  {
    id: "openai-ipo-2026",
    title: "Will OpenAI IPO by December 31, 2026?",
    description:
      "This market resolves to YES if OpenAI completes an initial public offering (IPO) and begins trading on a public stock exchange by December 31, 2026.",
    category: "Technology",
    options: [
      { id: "yes", name: "Yes" },
      { id: "no", name: "No" },
    ],
    resolutionDate: "2026-12-31",
    source: "https://polymarket.com/event/openai-ipo-by",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "openai-ipo-market-cap",
    title: "OpenAI IPO Closing Market Cap",
    description:
      "This market resolves based on OpenAI's market capitalization at the closing price on its first day of trading. If no IPO occurs by December 31, 2026, resolves to No IPO.",
    category: "Technology",
    options: [
      { id: "under-500b", name: "<$500B" },
      { id: "500b-750b", name: "$500B-$750B" },
      { id: "750b-1t", name: "$750B-$1T" },
      { id: "1t-1-25t", name: "$1T-$1.25T" },
      { id: "1-25t-1-5t", name: "$1.25T-$1.5T" },
      { id: "over-1-5t", name: "$1.5T+" },
      { id: "no-ipo", name: "No IPO by Dec 2026" },
    ],
    resolutionDate: "2026-12-31",
    source: "https://polymarket.com/event/openai-ipo-closing-market-cap",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tesla-fsd-june-2026",
    title: "Tesla launches unsupervised FSD by June 30, 2026?",
    description:
      "This market resolves to YES if Tesla launches unsupervised full self driving (FSD) — meaning no human driver required — in any US market by June 30, 2026.",
    category: "Technology",
    options: [
      { id: "yes", name: "Yes" },
      { id: "no", name: "No" },
    ],
    resolutionDate: "2026-06-30",
    source:
      "https://polymarket.com/event/tesla-launches-unsupervised-full-self-driving-fsd-by",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "companies-acquired-2027",
    title: "Which companies will be acquired before 2027?",
    description:
      "Each option resolves independently to YES if credible reporting confirms that any entity enters into an agreement to acquire the listed company by December 31, 2026. Mergers where the listed company is subsumed by another entity also qualify.",
    category: "Technology",
    options: [
      { id: "nebius-group", name: "Nebius Group" },
      { id: "ubisoft", name: "Ubisoft" },
      { id: "lovable", name: "Lovable" },
      { id: "gitlab", name: "GitLab" },
      { id: "perplexity-ai", name: "Perplexity AI" },
      { id: "pizza-hut", name: "Pizza Hut" },
      { id: "viking-therapeutics", name: "Viking Therapeutics" },
      { id: "snapchat", name: "Snapchat" },
      { id: "other", name: "Other" },
    ],
    resolutionDate: "2026-12-31",
    source:
      "https://polymarket.com/event/which-companies-will-be-acquired-before-2027",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "anthropic-500b-valuation-2026",
    title: "Anthropic reaches $500B+ valuation in 2026?",
    description:
      "This market resolves to YES if Anthropic achieves a valuation of $500 billion or higher through a funding round, secondary sale, or public listing by December 31, 2026. Valuation must be reported by a credible source such as Bloomberg, Reuters, or the Financial Times.",
    category: "Technology",
    options: [
      { id: "yes", name: "Yes" },
      { id: "no", name: "No" },
    ],
    resolutionDate: "2026-12-31",
    source: "https://polymarket.com/event/anthropic-500b-valuation-in-2026",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── AI ──────────────────────────────────────────────────────────────
  {
    id: "ai-video-oscars-2027",
    title: "Will an AI-generated film win an Oscar by 2027?",
    description:
      "This market resolves to YES if a film that is primarily AI-generated (including AI-generated visuals, script, or direction) wins any Academy Award at the 2027 Oscars ceremony or earlier.",
    category: "AI",
    options: [
      { id: "yes", name: "Yes" },
      { id: "no", name: "No" },
    ],
    resolutionDate: "2027-03-01",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "best-ai-model-march-2026",
    title: "Which company has the best AI model end of March?",
    description:
      "This market resolves to the company whose AI model scores highest on the Chatbot Arena overall leaderboard (lmarena.ai) at market close on March 31, 2026. Only the default leaderboard ranking (without style control) is used.",
    category: "AI",
    options: [
      { id: "google", name: "Google" },
      { id: "openai", name: "OpenAI" },
      { id: "anthropic", name: "Anthropic" },
      { id: "xai", name: "xAI" },
      { id: "meta", name: "Meta" },
      { id: "deepseek", name: "DeepSeek" },
      { id: "other", name: "Other" },
    ],
    resolutionDate: "2026-03-31",
    source:
      "https://polymarket.com/event/which-company-has-the-best-ai-model-end-of-march-751",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── Entertainment ───────────────────────────────────────────────────
  {
    id: "oscars-best-picture-2026",
    title: "Oscars 2026: Best Picture Winner",
    description:
      "This market resolves to the film that wins the Academy Award for Best Picture at the 98th Academy Awards ceremony on March 15, 2026.",
    category: "Entertainment",
    options: [
      { id: "one-battle-after-another", name: "One Battle After Another" },
      { id: "sinners", name: "Sinners" },
      { id: "hamnet", name: "Hamnet" },
      { id: "marty-supreme", name: "Marty Supreme" },
      { id: "frankenstein", name: "Frankenstein" },
      { id: "sentimental-value", name: "Sentimental Value" },
      { id: "the-secret-agent", name: "The Secret Agent" },
      { id: "bugonia", name: "Bugonia" },
      { id: "train-dreams", name: "Train Dreams" },
      { id: "f1", name: "F1" },
      { id: "other", name: "Other" },
    ],
    resolutionDate: "2026-03-15",
    source: "https://polymarket.com/event/oscars-2026-best-picture-winner",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "grammys-song-of-year-2026",
    title: "Grammys 2026: Song of the Year",
    description:
      "This market resolves to the song that wins Song of the Year at the 68th Annual Grammy Awards ceremony on February 1, 2026.",
    category: "Entertainment",
    options: [
      { id: "golden", name: "Golden - Ejae and Mark Sonnenblick" },
      { id: "luther", name: "luther - Kendrick Lamar and SZA" },
      { id: "abracadabra", name: "Abracadabra - Lady Gaga" },
      { id: "dtmf", name: "DTMF - Bad Bunny" },
      { id: "wildflower", name: "Wildflower - Billie Eilish" },
      { id: "atp", name: "ATP. - Rose and Bruno Mars" },
      { id: "anxiety", name: "Anxiety - Doechii" },
      { id: "manchild", name: "Manchild - Sabrina Carpenter" },
    ],
    resolutionDate: "2026-02-01",
    source: "https://polymarket.com/event/grammys-song-of-the-year-winner",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // ── Crypto ──────────────────────────────────────────────────────────
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
      { id: "down-75k", name: "Drops to $75,000" },
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
      .onConflictDoNothing();

    if (result.rowCount && result.rowCount > 0) {
      inserted++;
      console.log(`  + ${market.id}: ${market.title}`);
    } else {
      console.log(`  - ${market.id}: already exists, skipped`);
    }
  }

  console.log(
    `\nInserted ${inserted} new markets (${sampleMarkets.length - inserted} skipped).`,
  );
  console.log("Done!");
}

main().catch(console.error);
