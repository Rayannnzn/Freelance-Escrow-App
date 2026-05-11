'use client';

import { useQuery } from '@tanstack/react-query';
import { PublicKey } from '@solana/web3.js';
import { getReadOnlyProgram } from '@/lib/solana/program';
import { deriveEscrowStatus, type OnChainEscrowAccount, type EscrowDisplay } from '@/lib/solana/types';
import { lamportsToSol } from '@/lib/solana/utils';

/**
 * Fetch a single escrow by its PDA address.
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
        return null;
      }
    },
    enabled: !!pdaAddress,
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}
