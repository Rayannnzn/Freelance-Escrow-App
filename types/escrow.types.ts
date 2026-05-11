export type EscrowStatus =
  | 'active'
  | 'pending'
  | 'completed'
  | 'disputed'
  | 'cancelled'
  | 'initialized';

export type MilestoneStatus =
  | 'pending'
  | 'in_progress'
  | 'submitted'
  | 'approved'
  | 'released';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number; // in SOL
  dueDate: string;
  status: MilestoneStatus;
  submittedAt?: string;
  approvedAt?: string;
}

export interface EscrowParty {
  address: string;
  displayName: string;
  avatarUrl?: string;
  rating?: number;
}

export interface AuditLogEntry {
  id: string;
  event: string;
  timestamp: string;
  txHash?: string;
  details?: string;
}

export interface Escrow {
  id: string;
  contractId: string;
  title: string;
  description: string;
  status: EscrowStatus;
  totalAmount: number; // in SOL
  lockedAmount: number;
  client: EscrowParty;
  freelancer: EscrowParty;
  pdaAddress: string;
  programId: string;
  milestones: Milestone[];
  auditLog: AuditLogEntry[];
  createdAt: string;
  updatedAt: string;
  timeoutDate: string;
  network: 'devnet' | 'mainnet' | 'testnet';
}

export interface CreateEscrowFormData {
  title: string;
  description: string;
  freelancerAddress: string;
  totalAmount: string;
  timeoutDays: string;
  milestones: {
    title: string;
    description: string;
    amount: string;
    dueDate: string;
  }[];
}
