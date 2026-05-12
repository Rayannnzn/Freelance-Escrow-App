export const SOLANA_NETWORK = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as
  | 'devnet'
  | 'mainnet-beta'
  | 'testnet';

export const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

export const PROGRAM_ID =
  process.env.NEXT_PUBLIC_PROGRAM_ID || 'AErMH45vvaUGaSngNFmhyDeCXfBUfiduiWuZjAbeTUrG';

export const SOL_TO_USD_RATE = 97; // Fallback — useSolPrice fetches live from CoinGecko

export const MIN_ESCROW_AMOUNT = 0.01; // SOL — matches contract validation

export const ESCROW_STATUS_LABELS: Record<string, string> = {
  initialized: 'Active',
  submitted: 'Work Submitted',
  completed: 'Completed',
  timeout_claimable: 'Timeout Claimable',
};
