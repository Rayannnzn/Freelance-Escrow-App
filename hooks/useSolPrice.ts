'use client';

import { useQuery } from '@tanstack/react-query';

const FALLBACK_SOL_PRICE = 97;

async function fetchSolPrice(): Promise<number> {
  const res = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
    {
      headers: { Accept: 'application/json' },
      // 5-minute cache at the HTTP level
      next: { revalidate: 300 },
    }
  );

  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
  const json = await res.json();
  const price = json?.solana?.usd;
  if (typeof price !== 'number' || price <= 0) throw new Error('Invalid price payload');
  return price;
}

/**
 * Fetches the live SOL/USD price from CoinGecko.
 * - Caches for 5 minutes (staleTime)
 * - Refetches every 10 minutes in the background
 * - Falls back to FALLBACK_SOL_PRICE on any error
 */
export function useSolPrice() {
  const query = useQuery({
    queryKey: ['sol-price'],
    queryFn: fetchSolPrice,
    staleTime: 5 * 60 * 1000,        // 5 min
    refetchInterval: 10 * 60 * 1000, // 10 min background refetch
    retry: 2,
    // Don't throw — fall back gracefully
    throwOnError: false,
  });

  return {
    price: query.data ?? FALLBACK_SOL_PRICE,
    isLoading: query.isLoading,
    isStale: query.isStale,
    error: query.error,
  };
}
