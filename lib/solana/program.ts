import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, type Idl } from '@coral-xyz/anchor';
import { getConnection } from './connection';
import type { AnchorWallet } from '@solana/wallet-adapter-react';
import idl from './idl/freelance_escrow.json';

// ─── Program ID (from env or fallback to IDL metadata) ──────────────────────
export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID ||
    'AErMH45vvaUGaSngNFmhyDeCXfBUfiduiWuZjAbeTUrG'
);

// ─── PDA Derivation ─────────────────────────────────────────────────────────
// Seeds: ["escrow", client_pubkey, freelancer_pubkey]
export function getEscrowPDA(
  client: PublicKey,
  freelancer: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from('escrow'),
      client.toBuffer(),
      freelancer.toBuffer(),
    ],
    PROGRAM_ID
  );
}

// ─── Anchor Program (requires connected wallet) ────────────────────────────
export function getProgram(wallet: AnchorWallet): Program {
  const connection = getConnection();
  const provider = new AnchorProvider(connection, wallet, {
    commitment: 'confirmed',
    preflightCommitment: 'confirmed',
  });
  return new Program(idl as unknown as Idl, provider);
}

// ─── Read-only provider (no wallet needed) ──────────────────────────────────
export function getReadOnlyProgram(): Program {
  const connection = getConnection();
  // Use a dummy wallet that will never sign — only for fetching accounts
  const dummyWallet = {
    publicKey: PublicKey.default,
    signTransaction: () => Promise.reject(new Error('Read-only')),
    signAllTransactions: () => Promise.reject(new Error('Read-only')),
  } as AnchorWallet;

  const provider = new AnchorProvider(connection, dummyWallet, {
    commitment: 'confirmed',
  });
  return new Program(idl as unknown as Idl, provider);
}
