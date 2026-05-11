import { PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, type Idl } from '@coral-xyz/anchor';
import { getConnection } from './connection';
import type { AnchorWallet } from '@solana/wallet-adapter-react';
import idl from './idl/freelance_escrow.json';

// ─── Program ID (read from IDL address field) ───────────────────────────────
export const PROGRAM_ID = new PublicKey(idl.address);

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
  return new Program(idl as Idl, provider);
}

// ─── Read-only provider (no wallet needed) ──────────────────────────────────
export function getReadOnlyProgram(): Program {
  const connection = getConnection();
  // Dummy wallet for fetching accounts without signing
  const dummyWallet = {
    publicKey: PublicKey.default,
    signTransaction: () => Promise.reject(new Error('Read-only')),
    signAllTransactions: () => Promise.reject(new Error('Read-only')),
  } as AnchorWallet;

  const provider = new AnchorProvider(connection, dummyWallet, {
    commitment: 'confirmed',
  });
  return new Program(idl as Idl, provider);
}
