// ─── Database type definitions (matches Supabase schema exactly) ─────────────

export type EscrowStatus =
  | 'initialized'
  | 'submitted'
  | 'approved'
  | 'timeout_claimed'
  | 'completed';

// ─── Row shape returned from SELECT * ────────────────────────────────────────
export interface EscrowMetadataRow {
  id: string;
  escrow_pda: string;
  project_name: string;
  project_description: string | null;
  client_wallet: string;
  freelancer_wallet: string;
  amount_sol: number;
  timeout_days: number;
  tx_signature: string | null;
  status: EscrowStatus;
  github_link: string | null;
  loom_link: string | null;
  live_url: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

// ─── Insert payload (what we send on creation) ────────────────────────────────
export interface EscrowMetadataInsert {
  escrow_pda: string;
  project_name: string;
  project_description?: string | null;
  client_wallet: string;
  freelancer_wallet: string;
  amount_sol: number;
  timeout_days: number;
  tx_signature?: string | null;
}

// ─── Update payloads ─────────────────────────────────────────────────────────
export interface EscrowDeliverableUpdate {
  github_link?: string | null;
  loom_link?: string | null;
  live_url?: string | null;
}

export interface EscrowStatusUpdate {
  status: EscrowStatus;
  completed_at?: string | null;
}

// ─── Typed Database schema for createClient<Database> ────────────────────────
export interface Database {
  public: {
    Tables: {
      escrow_metadata: {
        Row: EscrowMetadataRow;
        Insert: EscrowMetadataInsert & { id?: string };
        Update: Partial<EscrowMetadataRow>;
      };
    };
    Enums: {
      escrow_status: EscrowStatus;
    };
  };
}
