import { MOCK_ESCROWS, MOCK_TRANSACTIONS, MOCK_STATS } from '@/constants/mock-data';
import { Escrow, CreateEscrowFormData } from '@/types/escrow.types';

// These functions simulate async blockchain calls.
// Replace implementations with real Solana program calls when ready.

export const escrowService = {
  async getAll(): Promise<Escrow[]> {
    await new Promise((r) => setTimeout(r, 400));
    return MOCK_ESCROWS;
  },

  async getById(id: string): Promise<Escrow | undefined> {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_ESCROWS.find((e) => e.id === id);
  },

  async create(data: CreateEscrowFormData): Promise<{ id: string; pdaAddress: string }> {
    await new Promise((r) => setTimeout(r, 1500));
    return {
      id: `esc_${Date.now()}`,
      pdaAddress: '7xAbCdEfGhIjKlMnOpQrStUvWxYz123456',
    };
  },

  async approveMilestone(escrowId: string, milestoneId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 800));
  },

  async releaseFunds(escrowId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 1000));
  },

  async raiseDispute(escrowId: string, reason: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 800));
  },

  async getStats() {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_STATS;
  },

  async getTransactions() {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_TRANSACTIONS;
  },
};
