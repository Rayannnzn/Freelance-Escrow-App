import { Connection, clusterApiUrl } from '@solana/web3.js';

const RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl('devnet');

/** Singleton connection for the app — reuse everywhere to avoid socket sprawl. */
let _connection: Connection | null = null;

export function getConnection(): Connection {
  if (!_connection) {
    _connection = new Connection(RPC_URL, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 60_000,
    });
  }
  return _connection;
}

export function getSolanaNetwork(): 'devnet' | 'mainnet-beta' | 'testnet' {
  const net = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  if (net === 'mainnet' || net === 'mainnet-beta') return 'mainnet-beta';
  if (net === 'testnet') return 'testnet';
  return 'devnet';
}

export function getRpcUrl(): string {
  return RPC_URL;
}
