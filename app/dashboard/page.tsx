'use client';

import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { WalletCard } from '@/components/dashboard/WalletCard';
import { EscrowCard } from '@/components/escrow/EscrowCard';
import { MOCK_STATS, MOCK_TRANSACTIONS, MOCK_WALLET, MOCK_ESCROWS } from '@/constants/mock-data';
import {
  Wallet,
  TrendingUp,
  CheckSquare,
  Clock,
} from 'lucide-react';

export default function DashboardPage() {
  const activeEscrows = MOCK_ESCROWS.filter((e) => e.status === 'active' || e.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Escrows"
          value={MOCK_STATS.activeEscrows.toLocaleString()}
          icon={Wallet}
          accent="neon"
          trend={{ value: 12.4, direction: 'up' }}
        />
        <StatCard
          title="Total Volume (SOL)"
          value={MOCK_STATS.totalVolumeSol.toLocaleString()}
          icon={TrendingUp}
          accent="blue"
          trend={{ value: 8.2, direction: 'up' }}
        />
        <StatCard
          title="Completed Contracts"
          value={MOCK_STATS.completedContracts.toLocaleString()}
          icon={CheckSquare}
          accent="purple"
          trend={{ value: 5.1, direction: 'up' }}
        />
        <StatCard
          title="Pending Approvals"
          value={MOCK_STATS.pendingApprovals}
          icon={Clock}
          accent="amber"
          trend={{ value: 2.3, direction: 'down' }}
        />
      </div>

      {/* Chart + Wallet */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <ActivityChart />
        <WalletCard wallet={MOCK_WALLET} />
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
            {activeEscrows.slice(0, 3).map((escrow) => (
              <EscrowCard key={escrow.id} escrow={escrow} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
