'use client';

import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { WalletCard } from '@/components/dashboard/WalletCard';
import { EscrowCard } from '@/components/escrow/EscrowCard';
import { ConnectWalletPrompt } from '@/components/web3/ConnectWalletPrompt';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useEnrichedEscrows } from '@/hooks/useEnrichedEscrows';
import { useProjectsByWallet } from '@/hooks/useProjectMetadata';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useWallet } from '@solana/wallet-adapter-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Wallet,
  TrendingUp,
  CheckSquare,
  Clock,
  Plus,
} from 'lucide-react';

export default function DashboardPage() {
  const { connected, publicKey } = useWallet();
  const { data: escrows, isLoading } = useEnrichedEscrows();
  const { data: allProjects } = useProjectsByWallet(publicKey?.toBase58());
  const { data: analytics } = useAnalytics();

  if (!connected) {
    return <ConnectWalletPrompt />;
  }

  const activeEscrows = escrows.filter(
    (e) => e.status === 'initialized' || e.status === 'submitted'
  );
  const completedEscrows = escrows.filter((e) => e.status === 'completed');
  const totalVolume = escrows.reduce((sum, e) => sum + e.amountSol, 0);

  // Build recent activity from Supabase metadata (sorted by created_at)
  const recentProjects = (allProjects ?? []).slice(0, 4);

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
        <ActivityChart data={analytics?.chartData} />
        <WalletCard />
      </div>

      {/* Recent Projects (from Supabase) + Active Escrows */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">
        {/* Recent Projects panel */}
        <div className="cyber-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">Recent Projects</h2>
            <Link
              href="/create-escrow"
              className="flex items-center gap-1 text-xs text-[#39ff14] hover:text-[#79ff5b] transition-colors font-medium"
            >
              <Plus className="size-3" />
              New
            </Link>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <>
                <LoadingSkeleton className="h-14 rounded-xl" />
                <LoadingSkeleton className="h-14 rounded-xl" />
                <LoadingSkeleton className="h-14 rounded-xl" />
              </>
            ) : recentProjects.length > 0 ? (
              recentProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link href={`/escrow/${project.escrow_pda}`}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all group cursor-pointer border border-transparent hover:border-white/[0.06]">
                      <div
                        className="size-9 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-bold"
                        style={{
                          background: project.status === 'completed'
                            ? 'rgba(57,255,20,0.1)'
                            : project.status === 'submitted'
                            ? 'rgba(255,177,74,0.1)'
                            : 'rgba(0,238,252,0.1)',
                          color: project.status === 'completed'
                            ? '#39ff14'
                            : project.status === 'submitted'
                            ? '#ffb14a'
                            : '#00eefc',
                          border: `1px solid ${project.status === 'completed'
                            ? 'rgba(57,255,20,0.2)'
                            : project.status === 'submitted'
                            ? 'rgba(255,177,74,0.2)'
                            : 'rgba(0,238,252,0.2)'}`,
                        }}
                      >
                        {project.project_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate group-hover:text-[#39ff14] transition-colors">
                          {project.project_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {project.amount_sol} SOL · {project.status}
                        </div>
                      </div>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0"
                        style={{
                          color: project.status === 'completed' ? '#79ff5b'
                            : project.status === 'submitted' ? '#ffb14a'
                            : '#39ff14',
                          background: project.status === 'completed' ? 'rgba(121,255,91,0.1)'
                            : project.status === 'submitted' ? 'rgba(255,177,74,0.1)'
                            : 'rgba(57,255,20,0.1)',
                        }}
                      >
                        {project.status === 'initialized' ? 'Active'
                          : project.status === 'submitted' ? 'Review'
                          : 'Done'}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <p>No projects yet.</p>
                <Link
                  href="/create-escrow"
                  className="mt-2 inline-block text-[#39ff14] hover:underline text-xs"
                >
                  Create your first escrow →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Active Contracts panel */}
        <div className="cyber-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-foreground">Active Contracts</h2>
            <Link href="/escrow" className="text-xs text-[#39ff14] hover:text-[#79ff5b] transition-colors font-medium">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                <LoadingSkeleton className="h-32 rounded-xl" />
                <LoadingSkeleton className="h-32 rounded-xl" />
              </div>
            ) : activeEscrows.length > 0 ? (
              activeEscrows.slice(0, 3).map((escrow) => (
                <EscrowCard
                  key={escrow.pdaAddress}
                  escrow={escrow}
                  metadata={escrow.metadata}
                />
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
