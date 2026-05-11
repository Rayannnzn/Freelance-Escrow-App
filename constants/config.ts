export const SOLANA_NETWORK = 'devnet';
export const SOLANA_RPC_URL = 'https://api.devnet.solana.com';
export const PROGRAM_ID = 'kinetex_v2_pda_v1';

export const SOL_TO_USD_RATE = 170; // Mock rate

export const ESCROW_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  pending: 'Pending',
  completed: 'Completed',
  disputed: 'Disputed',
  cancelled: 'Cancelled',
  initialized: 'Initialized',
};

export const MILESTONE_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  approved: 'Approved',
  released: 'Released',
};
