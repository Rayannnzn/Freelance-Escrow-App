'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMetadataByPda,
  getMetadataByWallet,
  updateDeliverables,
  updateEscrowStatus,
} from '@/services/metadata.service';
import type { EscrowDeliverableUpdate, EscrowStatusUpdate } from '@/lib/supabase/types';
import { toast } from 'sonner';

// ─── Fetch metadata for a single escrow by PDA ───────────────────────────────

export function useProjectByPda(pdaAddress: string | undefined) {
  return useQuery({
    queryKey: ['project-metadata', pdaAddress],
    queryFn: () => getMetadataByPda(pdaAddress!),
    enabled: !!pdaAddress,
    staleTime: 30_000,
  });
}

// ─── Fetch all projects for a wallet address ─────────────────────────────────

export function useProjectsByWallet(walletAddress: string | undefined) {
  return useQuery({
    queryKey: ['projects-by-wallet', walletAddress],
    queryFn: () => getMetadataByWallet(walletAddress!),
    enabled: !!walletAddress,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

// ─── Save deliverable links (freelancer) ─────────────────────────────────────

export function useUpdateDeliverables(pdaAddress: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (links: EscrowDeliverableUpdate) =>
      updateDeliverables(pdaAddress, links),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-metadata', pdaAddress] });
      toast.success('Deliverables saved!');
    },
    onError: (err: Error) => {
      toast.error('Failed to save deliverables', { description: err.message });
    },
  });
}

// ─── Sync on-chain status to Supabase ────────────────────────────────────────

export function useSyncEscrowStatus(pdaAddress: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (update: EscrowStatusUpdate) =>
      updateEscrowStatus(pdaAddress, update),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-metadata', pdaAddress] });
      queryClient.invalidateQueries({ queryKey: ['projects-by-wallet'] });
    },
    onError: (err: Error) => {
      // Status sync failure is non-blocking — just warn
      console.warn('[useSyncEscrowStatus] Failed:', err.message);
    },
  });
}
