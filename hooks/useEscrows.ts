'use client';

import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { getReadOnlyProgram, PROGRAM_ID } from '@/lib/solana/program';
import { deriveEscrowStatus, type OnChainEscrowAccount, type EscrowDisplay } from '@/lib/solana/types';
import { lamportsToSol } from '@/lib/solana/utils';
import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

// ─── Parse raw on-chain account to display-ready format ─────────────────────
function toEscrowDisplay(
  pdaAddress: PublicKey,
  raw: OnChainEscrowAccount
): EscrowDisplay {
  return {
    pdaAddress: pdaAddress.toBase58(),
    client: raw.client.toBase58(),
    freelancer: raw.freelancer.toBase58(),
    amountSol: lamportsToSol(raw.amount.toNumber()),
    createdAt: new Date(raw.createdAt.toNumber() * 1000),
    timeoutAt: new Date(raw.timeoutAt.toNumber() * 1000),
    workSubmitted: raw.workSubmitted,
    approved: raw.approved,
    status: deriveEscrowStatus(raw),
    bump: raw.bump,
  };
}

// ─── Fetch all escrows where connected wallet is the CLIENT ─────────────────
export function useClientEscrows() {
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ['escrows', 'client', publicKey?.toBase58()],
    queryFn: async (): Promise<EscrowDisplay[]> => {
      if (!publicKey) return [];
      const program = getReadOnlyProgram();
      const accounts = await (program.account as any).escrowAccount.all([
        {
          memcmp: {
            offset: 8,  // 8 byte discriminator
            bytes: publicKey.toBase58(),
          },
        },
      ]);

      return accounts.map((a: any) =>
        toEscrowDisplay(a.publicKey, a.account as unknown as OnChainEscrowAccount)
      );
    },
    enabled: !!publicKey,
    staleTime: 15_000,
  });
}

// ─── Fetch all escrows where connected wallet is the FREELANCER ─────────────
export function useFreelancerEscrows() {
  const { publicKey } = useWallet();

  return useQuery({
    queryKey: ['escrows', 'freelancer', publicKey?.toBase58()],
    queryFn: async (): Promise<EscrowDisplay[]> => {
      if (!publicKey) return [];
      const program = getReadOnlyProgram();
      const accounts = await (program.account as any).escrowAccount.all([
        {
          memcmp: {
            offset: 8 + 32, // 8 discriminator + 32 client pubkey
            bytes: publicKey.toBase58(),
          },
        },
      ]);

      return accounts.map((a: any) =>
        toEscrowDisplay(a.publicKey, a.account as unknown as OnChainEscrowAccount)
      );
    },
    enabled: !!publicKey,
    staleTime: 15_000,
  });
}

// ─── All escrows for connected wallet (both roles) ──────────────────────────
export function useAllWalletEscrows() {
  const clientQuery = useClientEscrows();
  const freelancerQuery = useFreelancerEscrows();

  const data = [
    ...(clientQuery.data || []),
    ...(freelancerQuery.data || []),
  ];

  // Deduplicate by PDA address
  const unique = Array.from(
    new Map(data.map((e) => [e.pdaAddress, e])).values()
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return {
    data: unique,
    isLoading: clientQuery.isLoading || freelancerQuery.isLoading,
    isFetching: clientQuery.isFetching || freelancerQuery.isFetching,
    error: clientQuery.error || freelancerQuery.error,
    refetch: () => {
      clientQuery.refetch();
      freelancerQuery.refetch();
    },
  };
}
