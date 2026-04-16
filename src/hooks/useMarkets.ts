import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Rain } from '@buidlrrr/rain-sdk';
import { getSupabaseClient, getSiteWorkflowId } from '../core/supabase/client';
import type { MarketRecord, EnrichedMarket } from '../types/database';

async function fetchSiteMarkets(): Promise<EnrichedMarket[]> {
  const [client, workflowId] = await Promise.all([getSupabaseClient(), getSiteWorkflowId()]);

  const { data, error } = await client
    .from('markets')
    .select('*')
    .eq('workflow_id', workflowId)
    .eq('status', 'live')
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!data || data.length === 0) return [];

  const rain = new Rain({ environment: 'production' });

  const results = await Promise.allSettled(
    (data as MarketRecord[]).map(async (market): Promise<EnrichedMarket> => {
      try {
        const [prices, liq, vol] = await Promise.all([
          rain.getMarketPrices(market.rain_market_id),
          rain.getMarketLiquidity(market.rain_market_id),
          rain.getMarketVolume(market.rain_market_id),
        ]);
        return {
          ...market,
          prices,
          totalLiquidity: liq.totalLiquidity,
          totalVolume: vol.totalVolume,
        };
      } catch {
        return market as EnrichedMarket;
      }
    }),
  );

  return results
    .filter((r): r is PromiseFulfilledResult<EnrichedMarket> => r.status === 'fulfilled')
    .map((r) => r.value);
}

export function useMarkets() {
  return useQuery<EnrichedMarket[], Error>({
    queryKey: ['site-markets'],
    queryFn: fetchSiteMarkets,
    staleTime: 30_000,
    retry: 2,
  });
}

export function useMarketFromDb(rainMarketId: string | undefined) {
  const { data: markets, isLoading } = useMarkets();
  return {
    market: rainMarketId ? markets?.find((m) => m.rain_market_id === rainMarketId) : undefined,
    isLoading,
  };
}

export function useInvalidateMarkets() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['site-markets'] });
}
