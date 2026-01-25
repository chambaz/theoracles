export interface CouncilMember {
  id: string;
  name: string;
  model: string;
  provider: "openai" | "anthropic";
  enabled: boolean;
}

export const COUNCIL_MEMBERS: CouncilMember[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    model: "gpt-4o",
    provider: "openai",
    enabled: true,
  },
  {
    id: "claude-sonnet",
    name: "Claude Sonnet 4",
    model: "claude-sonnet-4-20250514",
    provider: "anthropic",
    enabled: true,
  },
];

export function getEnabledMembers(): CouncilMember[] {
  return COUNCIL_MEMBERS.filter((m) => m.enabled);
}
