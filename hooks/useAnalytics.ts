'use client';

import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEnrichedEscrows } from './useEnrichedEscrows';
import { useProjectsByWallet } from './useProjectMetadata';

export interface AnalyticsData {
  totalEscrows: number;
  activeCount: number;
  submittedCount: number;
  completedCount: number;
  timeoutCount: number;
  totalVolumeSol: number;
  completedVolumeSol: number;
  activeVolumeSol: number;
  completionRate: number;      // 0-100
  avgContractSol: number;
  chartData: ChartPoint[];
}

export interface ChartPoint {
  month: string;
  volume: number;
  contracts: number;
}

/** Groups escrow creations by month for the activity chart (last 6 months). */
function buildChartData(
  createdAts: string[],
  amountSols: number[]
): ChartPoint[] {
  const now = new Date();
  const months: ChartPoint[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      month: d.toLocaleString('default', { month: 'short' }),
      volume: 0,
      contracts: 0,
    });
  }

  createdAts.forEach((iso, idx) => {
    const date = new Date(iso);
    const monthOffset =
      (now.getFullYear() - date.getFullYear()) * 12 +
      (now.getMonth() - date.getMonth());
    const slotIndex = 5 - monthOffset;
    if (slotIndex >= 0 && slotIndex < 6) {
      months[slotIndex].contracts += 1;
      months[slotIndex].volume = parseFloat(
        (months[slotIndex].volume + (amountSols[idx] ?? 0)).toFixed(3)
      );
    }
  });

  return months;
}

export function useAnalytics() {
  const { publicKey } = useWallet();
  const { data: escrows, isLoading: escrowsLoading } = useEnrichedEscrows();
  const { data: projects, isLoading: projectsLoading } = useProjectsByWallet(
    publicKey?.toBase58()
  );

  const analytics = useMemo((): AnalyticsData => {
    const active    = escrows.filter((e) => e.status === 'initialized');
    const submitted = escrows.filter((e) => e.status === 'submitted');
    const completed = escrows.filter((e) => e.status === 'completed');
    const timeouts  = escrows.filter((e) => e.status === 'timeout_claimable');

    const totalVolume    = escrows.reduce((s, e) => s + e.amountSol, 0);
    const completedVol   = completed.reduce((s, e) => s + e.amountSol, 0);
    const activeVol      = [...active, ...submitted].reduce((s, e) => s + e.amountSol, 0);
    const completionRate = escrows.length > 0
      ? Math.round((completed.length / escrows.length) * 100)
      : 0;
    const avg = escrows.length > 0 ? totalVolume / escrows.length : 0;

    // Build chart from Supabase metadata created_at (richer than on-chain)
    const createdAts = (projects ?? []).map((p) => p.created_at ?? new Date().toISOString());
    const amounts    = (projects ?? []).map((p) => p.amount_sol ?? 0);
    const chartData  = buildChartData(createdAts, amounts);

    return {
      totalEscrows:       escrows.length,
      activeCount:        active.length,
      submittedCount:     submitted.length,
      completedCount:     completed.length,
      timeoutCount:       timeouts.length,
      totalVolumeSol:     parseFloat(totalVolume.toFixed(4)),
      completedVolumeSol: parseFloat(completedVol.toFixed(4)),
      activeVolumeSol:    parseFloat(activeVol.toFixed(4)),
      completionRate,
      avgContractSol:     parseFloat(avg.toFixed(4)),
      chartData,
    };
  }, [escrows, projects]);

  return {
    data: analytics,
    isLoading: escrowsLoading || projectsLoading,
  };
}
