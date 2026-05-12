'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { useAnchorProgram } from './useAnchorProgram';
import { getEscrowPDA, PROGRAM_ID } from '@/lib/solana/program';
import { parseEscrowError } from '@/lib/solana/errors';
import { getExplorerTxUrl } from '@/lib/solana/explorer';
import { saveCompletedEscrow } from '@/lib/escrow-cache';
import { useNotifications } from './useNotifications';
import { toast } from 'sonner';

// ─── Initialize Escrow ──────────────────────────────────────────────────────
export function useInitializeEscrow() {
  const program = useAnchorProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: async ({
      freelancerAddress,
      amountSol,
      timeoutAt,
    }: {
      freelancerAddress: string;
      amountSol: number;
      timeoutAt: number;
    }) => {
      if (!program || !publicKey) throw new Error('Wallet not connected');

      const freelancer = new PublicKey(freelancerAddress);
      const [escrowPDA] = getEscrowPDA(publicKey, freelancer);
      const amountLamports = new BN(Math.round(amountSol * LAMPORTS_PER_SOL));
      const timeout = new BN(timeoutAt);

      const tx = await program.methods
        .initializeEscrow(amountLamports, timeout)
        .accounts({
          client: publicKey,
          freelancer: freelancer,
          escrow: escrowPDA,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { signature: tx, pdaAddress: escrowPDA.toBase58() };
    },
    onSuccess: (data) => {
      addNotification(
        'escrow_created',
        'Escrow Created',
        `New escrow locked on-chain. PDA: ${data.pdaAddress.slice(0, 8)}…`,
        data.pdaAddress
      );
      toast.success('Escrow created!', {
        description: `PDA: ${data.pdaAddress.slice(0, 8)}...${data.pdaAddress.slice(-6)}`,
        action: {
          label: 'View TX',
          onClick: () => window.open(getExplorerTxUrl(data.signature), '_blank'),
        },
        duration: 8000,
      });
      queryClient.invalidateQueries({ queryKey: ['escrows'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
    },
    onError: (error) => {
      const parsed = parseEscrowError(error);
      toast.error(parsed.title, { description: parsed.description });
    },
  });
}

// ─── Submit Work (freelancer) ───────────────────────────────────────────────
export function useSubmitWork() {
  const program = useAnchorProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: async ({
      clientAddress,
      pdaAddress,
    }: {
      clientAddress: string;
      pdaAddress: string;
    }) => {
      if (!program || !publicKey) throw new Error('Wallet not connected');

      const tx = await program.methods
        .submitWork()
        .accounts({
          escrow: new PublicKey(pdaAddress),
          client: new PublicKey(clientAddress),
          freelancer: publicKey,
        })
        .rpc();

      return { signature: tx, pdaAddress };
    },
    onSuccess: (data) => {
      addNotification(
        'work_submitted',
        'Work Submitted',
        'Work has been submitted and is awaiting client approval.',
        data.pdaAddress
      );
      toast.success('Work submitted!', {
        description: 'Waiting for client approval.',
        action: {
          label: 'View TX',
          onClick: () => window.open(getExplorerTxUrl(data.signature), '_blank'),
        },
        duration: 6000,
      });
      queryClient.invalidateQueries({ queryKey: ['escrows'] });
      queryClient.invalidateQueries({ queryKey: ['escrow-detail'] });
    },
    onError: (error) => {
      const parsed = parseEscrowError(error);
      toast.error(parsed.title, { description: parsed.description });
    },
  });
}

// ─── Approve Work (client) ──────────────────────────────────────────────────
export function useApproveWork() {
  const program = useAnchorProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: async ({
      freelancerAddress,
      pdaAddress,
      snapshot,
    }: {
      freelancerAddress: string;
      pdaAddress: string;
      snapshot: { client: string; freelancer: string; amountSol: number };
    }) => {
      if (!program || !publicKey) throw new Error('Wallet not connected');

      const tx = await program.methods
        .approveWork()
        .accounts({
          client: publicKey,
          freelancer: new PublicKey(freelancerAddress),
          escrow: new PublicKey(pdaAddress),
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      saveCompletedEscrow({
        pdaAddress,
        client: snapshot.client,
        freelancer: snapshot.freelancer,
        amountSol: snapshot.amountSol,
        completedAt: new Date().toISOString(),
        approvalSignature: tx,
        closedReason: 'approved',
      });

      return {
        signature: tx,
        pdaAddress,
        client: snapshot.client,
        freelancer: snapshot.freelancer,
        amountSol: snapshot.amountSol,
        completedAt: new Date().toISOString(),
      };
    },
    onSuccess: (data) => {
      addNotification(
        'funds_released',
        'Funds Released',
        `${data.amountSol} SOL released to the freelancer. Contract complete.`,
        data.pdaAddress
      );
    },
    onError: (error) => {
      const parsed = parseEscrowError(error);
      toast.error(parsed.title, { description: parsed.description });
    },
    // Note: onSuccess is NOT the primary handler — the detail page handles the modal.
  });
}

// ─── Claim Timeout (client gets refund) ─────────────────────────────────────
export function useClaimTimeout() {
  const program = useAnchorProgram();
  const { publicKey } = useWallet();
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  return useMutation({
    mutationFn: async ({
      clientAddress,
      pdaAddress,
    }: {
      clientAddress: string;
      pdaAddress: string;
    }) => {
      if (!program || !publicKey) throw new Error('Wallet not connected');

      const tx = await program.methods
        .claimTimeout()
        .accounts({
          freelancer: publicKey,
          client: new PublicKey(clientAddress),
          escrow: new PublicKey(pdaAddress),
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      return { signature: tx, pdaAddress };
    },
    onSuccess: (data) => {
      addNotification(
        'timeout_claimed',
        'Timeout Claimed',
        'The escrow timed out and funds have been returned to the client.',
        data.pdaAddress
      );
      toast.success('Timeout claimed!', {
        description: 'Funds returned to the client.',
        action: {
          label: 'View TX',
          onClick: () => window.open(getExplorerTxUrl(data.signature), '_blank'),
        },
        duration: 8000,
      });
      queryClient.invalidateQueries({ queryKey: ['escrows'] });
      queryClient.invalidateQueries({ queryKey: ['escrow-detail'] });
      queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
    },
    onError: (error) => {
      const parsed = parseEscrowError(error);
      toast.error(parsed.title, { description: parsed.description });
    },
  });
}
