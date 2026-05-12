/**
 * Off-chain metadata service for escrow projects.
 * All writes use the Supabase anon key (no RLS in dev — wallet-filtered at query level).
 * Each operation returns typed results and throws on unexpected errors.
 */

import { supabase } from '@/lib/supabase/client';
import type {
  EscrowMetadataRow,
  EscrowMetadataInsert,
  EscrowDeliverableUpdate,
  EscrowStatusUpdate,
} from '@/lib/supabase/types';

// ─── Create ──────────────────────────────────────────────────────────────────

/**
 * Save escrow metadata immediately after the on-chain tx confirms.
 * Idempotent: if row already exists (duplicate PDA), returns the existing row.
 */
export async function saveEscrowMetadata(
  payload: EscrowMetadataInsert
): Promise<EscrowMetadataRow> {
  const { data, error } = await supabase
    .from('escrow_metadata')
    .upsert(payload, { onConflict: 'escrow_pda', ignoreDuplicates: false })
    .select()
    .single();

  if (error) throw new Error(`Supabase insert error: ${error.message}`);
  return data as EscrowMetadataRow;
}

// ─── Read ────────────────────────────────────────────────────────────────────

/**
 * Fetch metadata for a single escrow by its PDA address.
 * Returns null if no row exists (e.g. legacy escrow with no metadata).
 */
export async function getMetadataByPda(
  pdaAddress: string
): Promise<EscrowMetadataRow | null> {
  const { data, error } = await supabase
    .from('escrow_metadata')
    .select('*')
    .eq('escrow_pda', pdaAddress)
    .maybeSingle();

  if (error) throw new Error(`Supabase fetch error: ${error.message}`);
  return data as EscrowMetadataRow | null;
}

/**
 * Fetch all escrow metadata where the wallet is either the client or freelancer.
 * Used by the dashboard to show full project history.
 */
export async function getMetadataByWallet(
  walletAddress: string
): Promise<EscrowMetadataRow[]> {
  const { data, error } = await supabase
    .from('escrow_metadata')
    .select('*')
    .or(`client_wallet.eq.${walletAddress},freelancer_wallet.eq.${walletAddress}`)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Supabase fetch error: ${error.message}`);
  return (data ?? []) as EscrowMetadataRow[];
}

// ─── Update — Deliverables ────────────────────────────────────────────────────

/**
 * Freelancer attaches deliverable links to a project.
 * Only non-null values overwrite existing links.
 */
export async function updateDeliverables(
  pdaAddress: string,
  links: EscrowDeliverableUpdate
): Promise<EscrowMetadataRow> {
  // Filter out undefined values so we don't accidentally null out existing links
  const patch = Object.fromEntries(
    Object.entries(links).filter(([, v]) => v !== undefined)
  );

  const { data, error } = await supabase
    .from('escrow_metadata')
    .update(patch)
    .eq('escrow_pda', pdaAddress)
    .select()
    .single();

  if (error) throw new Error(`Supabase update error: ${error.message}`);
  return data as EscrowMetadataRow;
}

// ─── Update — Status ──────────────────────────────────────────────────────────

/**
 * Sync on-chain status back into Supabase.
 * Called after submitWork, approveWork, claimTimeout mutations succeed.
 */
export async function updateEscrowStatus(
  pdaAddress: string,
  update: EscrowStatusUpdate
): Promise<void> {
  const patch: Record<string, unknown> = { status: update.status };
  if (update.completed_at) patch['completed_at'] = update.completed_at;

  const { error } = await supabase
    .from('escrow_metadata')
    .update(patch)
    .eq('escrow_pda', pdaAddress);

  if (error) throw new Error(`Supabase status update error: ${error.message}`);
}
