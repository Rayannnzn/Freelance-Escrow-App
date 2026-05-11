import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

/**
 * Convert lamports (u64) to SOL.
 */
export function lamportsToSol(lamports: number | bigint): number {
  return Number(lamports) / LAMPORTS_PER_SOL;
}

/**
 * Convert SOL to lamports.
 */
export function solToLamports(sol: number): number {
  return Math.round(sol * LAMPORTS_PER_SOL);
}

/**
 * Convert "days from now" into a Unix timestamp (seconds).
 */
export function daysToUnixTimeout(days: number): number {
  return Math.floor(Date.now() / 1000) + days * 86400;
}

/**
 * Check if a string is a valid Solana public key.
 */
export function isValidPublicKey(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Truncate a Solana address for display.
 */
export function truncatePubkey(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
