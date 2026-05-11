import { PublicKey } from '@solana/web3.js';
import type { BN } from '@coral-xyz/anchor';

// ─── On-chain EscrowAccount (matches IDL exactly) ───────────────────────────
export interface OnChainEscrowAccount {
  client: PublicKey;
  freelancer: PublicKey;
  amount: BN;
  createdAt: BN;
  timeoutAt: BN;
  workSubmitted: boolean;
  approved: boolean;
  bump: number;
}

// ─── Derived escrow status from on-chain fields ─────────────────────────────
export type OnChainEscrowStatus =
  | 'initialized'    // workSubmitted=false, approved=false
  | 'submitted'      // workSubmitted=true,  approved=false
  | 'completed'      // approved=true (funds released)
  | 'timeout_claimable'; // timeoutAt reached and !approved

export function deriveEscrowStatus(
  account: OnChainEscrowAccount,
  now: number = Math.floor(Date.now() / 1000)
): OnChainEscrowStatus {
  if (account.approved) return 'completed';
  if (account.workSubmitted) return 'submitted';
  if (account.timeoutAt.toNumber() > 0 && now >= account.timeoutAt.toNumber()) {
    return 'timeout_claimable';
  }
  return 'initialized';
}

// ─── Enriched escrow for UI consumption ─────────────────────────────────────
export interface EscrowDisplay {
  pdaAddress: string;
  client: string;
  freelancer: string;
  amountSol: number;
  createdAt: Date;
  timeoutAt: Date;
  workSubmitted: boolean;
  approved: boolean;
  status: OnChainEscrowStatus;
  bump: number;
}

// ─── Program error codes ────────────────────────────────────────────────────
export enum EscrowErrorCode {
  AmountTooSmall = 6000,
  InvalidTimeout = 6001,
  AlreadySubmitted = 6002,
  AlreadyApproved = 6003,
  WorkNotSubmitted = 6004,
  NoTimeoutSet = 6005,
  TimeoutNotReached = 6006,
}
