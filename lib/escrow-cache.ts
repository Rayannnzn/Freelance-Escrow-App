/**
 * Client-side cache for completed escrow records.
 * When the approve_work instruction runs, the PDA account is closed on-chain.
 * We persist the final state in localStorage so the UI can show a completion
 * screen instead of an "Escrow Not Found" error.
 */

export interface CompletedEscrowRecord {
  pdaAddress: string;
  client: string;
  freelancer: string;
  amountSol: number;
  completedAt: string;       // ISO timestamp
  approvalSignature: string;
  closedReason: 'approved' | 'timeout';
}

const STORAGE_KEY = 'kinetex:completed_escrows';

function readAll(): Record<string, CompletedEscrowRecord> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeAll(records: Record<string, CompletedEscrowRecord>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Quota exceeded — silently ignore
  }
}

/** Persist a completed escrow so we can show it after the PDA is closed. */
export function saveCompletedEscrow(record: CompletedEscrowRecord): void {
  const all = readAll();
  all[record.pdaAddress] = record;
  writeAll(all);
}

/** Look up a completed escrow by PDA address. Returns null if not found. */
export function getCompletedEscrow(pdaAddress: string): CompletedEscrowRecord | null {
  return readAll()[pdaAddress] ?? null;
}

/** Remove a record (optional clean-up). */
export function removeCompletedEscrow(pdaAddress: string): void {
  const all = readAll();
  delete all[pdaAddress];
  writeAll(all);
}
