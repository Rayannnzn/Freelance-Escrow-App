'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useAllWalletEscrows } from './useEscrows';
import { useProjectsByWallet } from './useProjectMetadata';
import type { EscrowDisplay } from '@/lib/solana/types';
import type { EscrowMetadataRow } from '@/lib/supabase/types';

/**
 * Enriched escrow — on-chain data merged with Supabase metadata.
 * metadata may be null for legacy escrows created before Supabase integration.
 */
export interface EnrichedEscrow extends EscrowDisplay {
  metadata: EscrowMetadataRow | null;
}

/**
 * Merges live on-chain escrows with Supabase project metadata.
 * Falls back gracefully when metadata is unavailable.
 */
export function useEnrichedEscrows() {
  const { publicKey } = useWallet();
  const { data: escrows, isLoading: escrowsLoading, ...rest } = useAllWalletEscrows();
  const { data: metadataRows, isLoading: metaLoading } = useProjectsByWallet(
    publicKey?.toBase58()
  );

  // Build a fast lookup map: pda → metadata row
  const metaByPda = new Map<string, EscrowMetadataRow>(
    (metadataRows ?? []).map((m) => [m.escrow_pda, m])
  );

  const enriched: EnrichedEscrow[] = escrows.map((escrow) => ({
    ...escrow,
    metadata: metaByPda.get(escrow.pdaAddress) ?? null,
  }));

  return {
    data: enriched,
    isLoading: escrowsLoading || metaLoading,
    ...rest,
  };
}
