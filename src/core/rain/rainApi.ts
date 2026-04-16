import { Rain } from '@buidlrrr/rain-sdk';

export interface Market {
  id: string;
  title: string;
  options: string[];
  barValues: number[];
  description: string;
  tags: string[];
}

const env = (import.meta as { env?: Record<string, string> }).env || {};
const rainInstance = new Rain({ environment: (env.VITE_RAIN_ENVIRONMENT as string) || 'production' });

export async function getMarkets(marketIds: string[]): Promise<Market[]> {
  if (!marketIds || marketIds.length === 0) return [];
  const out: Market[] = [];
  for (const id of marketIds) {
    try {
      const details = await rainInstance.getMarketDetails(id);
      const options = (details.options || []).map((o: any) => o.optionName);
      const n = options.length || 1;
      const barValues = options.map(() => Math.floor(100 / n));
      if (barValues.length) {
        const drift = 100 - barValues.reduce((a: number, b: number) => a + b, 0);
        barValues[barValues.length - 1] += drift;
      }
      out.push({ id, title: details.title, options, barValues, description: '', tags: [] });
    } catch { /* skip missing */ }
  }
  return out;
}

export async function getMarketPrices(marketId: string) {
  return rainInstance.getMarketPrices(marketId);
}

export async function getMarketDetails(marketId: string) {
  return rainInstance.getMarketDetails(marketId);
}
