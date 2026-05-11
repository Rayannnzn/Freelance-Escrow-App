'use client';

import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { WalletCard } from '@/components/dashboard/WalletCard';
import { EscrowCard } from '@/components/escrow/EscrowCard';
import { ConnectWalletPrompt } from '@/components/web3/ConnectWalletPrompt';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useAllWalletEscrows } from '@/hooks/useEscrows';
import { useWallet } from '@solana/wallet-adapter-react';
import { MOCK_TRANSACTIONS } from '@/constants/mock-data';
import {
  Wallet,
  TrendingUp,
  CheckSquare,
  Clock,
} from 'lucide-react';

export default function DashboardPage() {
  const { connected } = useWallet();
  const { data: escrows, isLoading } = useAllWalletEscrows();

  if (!connected) {
    return <ConnectWalletPrompt />;
  }

  const activeEscrows = escrows.filter((e) => e.status === 'initialized' || e.status === 'submitted');
  const completedEscrows = escrows.filter((e) => e.status === 'completed');
  const totalVolume = escrows.reduce((sum, e) => sum + e.amountSol, 0);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Escrows"
          value={activeEscrows.length.toString()}
          icon={Wallet}
          accent="neon"
        />
        <StatCard
          title="Total Volume (SOL)"
          value={totalVolume.toFixed(2)}
          icon={TrendingUp}
          accent="blue"
        />
        <StatCard
          title="Completed"
          value={completedEscrows.length.toString()}
          icon={CheckSquare}
          accent="purple"
        />
        <StatCard
          title="All Contracts"
          value={escrows.length.toString()}
          icon={Clock}
          accent="amber"
        />
      </div>

      {/* Chart + Wallet */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <ActivityChart />
        <WalletCard />
      </div>

      {/* Recent Activity + Active Escrows */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
        <RecentActivity transactions={MOCK_TRANSACTIONS.slice(0, 4)} />

        <div className="cyber-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">Active Contracts</h2>
            <a href="/escrow" className="text-xs text-[#39ff14] hover:text-[#79ff5b] transition-colors font-medium">
              View all →
            </a>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                <LoadingSkeleton className="h-32 rounded-xl" />
                <LoadingSkeleton className="h-32 rounded-xl" />
              </div>
            ) : activeEscrows.length > 0 ? (
              activeEscrows.slice(0, 3).map((escrow) => (
                <EscrowCard key={escrow.pdaAddress} escrow={escrow} />
              ))
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No active escrows yet. Create one to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
