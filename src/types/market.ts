export interface MarketOption {
  id: string;
  name: string;
  description?: string;
}

export interface Market {
  id: string;
  title: string;
  description: string;
  category: string;
  options: MarketOption[];
  resolutionDate?: string;
  source?: string;
  status: "active" | "resolved" | "paused";
  createdAt: string;
  updatedAt: string;
}
