import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Rain } from '@buidlrrr/rain-sdk';
import { useMarketFromDb } from './useMarkets';

interface MarketDetail {
  id: string;
  title: string;
  description: string | null;
  contractAddress: string;
  status: string;
  options: Array<{
    optionIndex: number;
    optionName: string;
    probability: number;
    currentPrice: bigint;
  }>;
  totalLiquidity: number;
  totalVolume: number;
  endTime: number | null;
  imageUrl: string | null;
}

async function fetchMarketDetail(marketId: string): Promise<MarketDetail> {
  const rain = new Rain({ environment: 'production' });
  const details = await rain.getMarketDetails(marketId);
  const prices = await rain.getMarketPrices(marketId);
  const liq = await rain.getMarketLiquidity(marketId);
  const vol = await rain.getMarketVolume(marketId);

  return {
    id: marketId,
    title: details.title,
    description: details.description || null,
    contractAddress: details.contractAddress,
    status: details.status,
    options: (details.options || []).map((opt: any, i: number) => {
      const priceEntry = prices.find((p: any) => p.choiceIndex === i);
      return {
        optionIndex: i,
        optionName: opt.name || opt.optionName,
        currentPrice: priceEntry?.currentPrice ?? 0n,
        probability: priceEntry ? Number(priceEntry.currentPrice) / 1e18 : 0,
      };
    }),
    totalLiquidity: liq.totalLiquidity,
    totalVolume: vol.totalVolume,
    endTime: details.endTime ? Number(details.endTime) : null,
    imageUrl: null,
  };
}

export function useMarketDetail(rainMarketId: string | undefined) {
  const queryClient = useQueryClient();
  const unsubRef = useRef<(() => void) | null>(null);

  const query = useQuery<MarketDetail, Error>({
    queryKey: ['market-detail', rainMarketId],
    queryFn: () => fetchMarketDetail(rainMarketId!),
    enabled: !!rainMarketId,
    staleTime: 60_000,
    retry: 2,
  });

  const { market: dbMarket } = useMarketFromDb(rainMarketId);

  useEffect(() => {
    if (!query.data?.contractAddress) return;

    const rain = new Rain({ environment: 'production' });
    unsubRef.current = rain.subscribePriceUpdates({
      marketAddress: query.data.contractAddress,
      onPriceUpdate: (update) => {
        queryClient.setQueryData<MarketDetail>(['market-detail', rainMarketId], (prev) => {
          if (!prev) return prev;
          const updatedOptions = prev.options.map((opt) => {
            const fresh = update.prices?.find((p: any) => p.choiceIndex === opt.optionIndex);
            if (!fresh) return opt;
            return {
              ...opt,
              currentPrice: fresh.currentPrice,
              probability: Number(fresh.currentPrice) / 1e18,
            };
          });
          return { ...prev, options: updatedOptions };
        });
      },
      onError: (err) => console.warn('WebSocket price error:', err),
    });

    return () => {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
      rain.destroyWebSocket?.();
    };
  }, [query.data?.contractAddress, rainMarketId, queryClient]);

  const enrichedData =
    query.data && dbMarket
      ? {
          ...query.data,
          description: dbMarket.description || query.data.description,
          imageUrl: dbMarket.image_url,
        }
      : query.data;

  return { ...query, data: enrichedData };
}
