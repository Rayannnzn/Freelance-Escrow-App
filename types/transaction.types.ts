export type TransactionType =
  | 'escrow_funded'
  | 'work_submitted'
  | 'funds_released'
  | 'dispute_raised'
  | 'refund_issued'
  | 'milestone_approved';

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount?: number; // in SOL, positive = credit, negative = debit
  timestamp: string;
  txHash: string;
  status: 'finalized' | 'processing' | 'failed';
  escrowId?: string;
}
