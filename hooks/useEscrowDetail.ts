'use client';

import { useQuery } from '@tanstack/react-query';
import { PublicKey } from '@solana/web3.js';
import { getReadOnlyProgram } from '@/lib/solana/program';
import { deriveEscrowStatus, type OnChainEscrowAccount, type EscrowDisplay } from '@/lib/solana/types';
import { lamportsToSol } from '@/lib/solana/utils';
import { getCompletedEscrow, type CompletedEscrowRecord } from '@/lib/escrow-cache';

export type EscrowDetailState =
  | { kind: 'live';      data: EscrowDisplay }
  | { kind: 'completed'; record: CompletedEscrowRecord }
  | { kind: 'not_found' }
  | { kind: 'loading' }
  | { kind: 'error';    error: Error };

/**
 * Fetch a single escrow by its PDA address.
 * Differentiates between three closed states:
 *   1. "live"      — account exists on-chain → show normal detail
 *   2. "completed" — PDA closed, record found in localStorage cache → show success screen
 *   3. "not_found" — never existed / invalid address → show 404
 */
export function useEscrowDetail(pdaAddress: string | undefined) {
  return useQuery({
    queryKey: ['escrow-detail', pdaAddress],
    queryFn: async (): Promise<EscrowDisplay | null> => {
      if (!pdaAddress) return null;

      const program = getReadOnlyProgram();
      const pda = new PublicKey(pdaAddress);

      try {
        const raw = await (program.account as any).escrowAccount.fetch(pda);
        const account = raw as unknown as OnChainEscrowAccount;

        return {
          pdaAddress: pda.toBase58(),
          client: account.client.toBase58(),
          freelancer: account.freelancer.toBase58(),
          amountSol: lamportsToSol(account.amount.toNumber()),
          createdAt: new Date(account.createdAt.toNumber() * 1000),
          timeoutAt: new Date(account.timeoutAt.toNumber() * 1000),
          workSubmitted: account.workSubmitted,
          approved: account.approved,
          status: deriveEscrowStatus(account),
          bump: account.bump,
        };
      } catch {
        // Account not found on-chain — returns null (caller checks cache)
        return null;
      }
    },
    enabled: !!pdaAddress,
    staleTime: 10_000,
    // Don't auto-refetch once a completion is confirmed — the PDA is gone
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data === null) return false; // account closed, stop polling
      return 15_000;
    },
  });
}

/**
 * Composite hook that merges on-chain query + localStorage cache into
 * a typed discriminated union so the UI never shows a generic 404.
 */
export function useEscrowDetailState(pdaAddress: string | undefined): EscrowDetailState {
  const query = useEscrowDetail(pdaAddress);

  if (query.isLoading) return { kind: 'loading' };
  if (query.isError)   return { kind: 'error', error: query.error as Error };

  if (query.data) return { kind: 'live', data: query.data };

  // data is null → account doesn't exist on-chain.
  // Check the cache to tell apart "completed" from "never existed".
  if (pdaAddress) {
    const cached = getCompletedEscrow(pdaAddress);
    if (cached) return { kind: 'completed', record: cached };
  }

  return { kind: 'not_found' };
}
