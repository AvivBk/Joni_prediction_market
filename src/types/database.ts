export interface MarketOption {
  name: string;
  index: number;
  color?: string;
}

export interface MarketRecord {
  id: string;
  workflow_id: string;
  rain_market_id: string;
  title: string;
  description: string | null;
  options: MarketOption[];
  image_url: string | null;
  status: 'live' | 'resolved' | 'closed';
  end_time: number | null;
  created_at: string;
}

export interface EnrichedMarket extends MarketRecord {
  prices?: Array<{
    choiceIndex: number;
    optionName: string;
    currentPrice: bigint;
  }>;
  totalLiquidity?: number;
  totalVolume?: number;
}
