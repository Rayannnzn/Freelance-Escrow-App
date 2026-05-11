'use client';

import { useMemo } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { getProgram } from '@/lib/solana/program';
import type { Program } from '@coral-xyz/anchor';

/**
 * Returns the typed Anchor program instance.
 * Returns null when wallet is not connected.
 */
export function useAnchorProgram(): Program | null {
  const wallet = useAnchorWallet();

  return useMemo(() => {
    if (!wallet) return null;
    return getProgram(wallet);
  }, [wallet]);
}
