'use client';

import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { StatCard } from '@/components/dashboard/StatCard';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ConnectWalletPrompt } from '@/components/web3/ConnectWalletPrompt';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useSolPrice } from '@/hooks/useSolPrice';
import { useWallet } from '@solana/wallet-adapter-react';
import { formatUsdWithRate } from '@/lib/format';
import {
  TrendingUp,
  CheckSquare,
  Clock,
  BarChart3,
  Wallet,
  AlertTriangle,
} from 'lucide-react';

const STATUS_BARS = [
  { key: 'activeCount',    label: 'Active',    color: '#39ff14' },
  { key: 'submittedCount', label: 'Pending',   color: '#ffb14a' },
  { key: 'completedCount', label: 'Completed', color: '#79ff5b' },
  { key: 'timeoutCount',   label: 'Timeout',   color: '#ff4a6b' },
] as const;

export default function AnalyticsPage() {
  const { connected } = useWallet();
  const { data: analytics, isLoading } = useAnalytics();
  const { price: solPrice } = useSolPrice();

  if (!connected) return <ConnectWalletPrompt />;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <LoadingSkeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <LoadingSkeleton className="h-72 rounded-2xl" />
          <LoadingSkeleton className="h-72 rounded-2xl" />
        </div>
      </div>
    );
  }

  const { data: a } = analytics
    ? { data: analytics }
    : { data: null };

  if (!a || a.totalEscrows === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <div className="cyber-card p-12 text-center">
          <BarChart3 className="size-12 text-muted-foreground/30 mx-auto mb-4" />
          <div className="text-base font-semibold text-foreground mb-2">No Data Yet</div>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Analytics will populate once you create your first escrow contract.
          </p>
        </div>
      </div>
    );
  }

  const totalUsd = formatUsdWithRate(a.totalVolumeSol, solPrice);
  const completedUsd = formatUsdWithRate(a.completedVolumeSol, solPrice);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Based on {a.totalEscrows} contract{a.totalEscrows !== 1 ? 's' : ''} across your wallet
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Volume"
          value={`${a.totalVolumeSol} SOL`}
          subtitle={totalUsd}
          icon={TrendingUp}
          accent="neon"
        />
        <StatCard
          title="Completion Rate"
          value={`${a.completionRate}%`}
          subtitle={`${a.completedCount} of ${a.totalEscrows} complete`}
          icon={CheckSquare}
          accent="blue"
        />
        <StatCard
          title="Avg Contract"
          value={`${a.avgContractSol} SOL`}
          subtitle={formatUsdWithRate(a.avgContractSol, solPrice)}
          icon={Wallet}
          accent="purple"
        />
        <StatCard
          title="Active / Pending"
          value={`${a.activeCount + a.submittedCount}`}
          subtitle={`${a.activeVolumeSol} SOL locked`}
          icon={Clock}
          accent="amber"
        />
      </div>

      {/* Chart + Distribution */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ActivityChart data={a.chartData} />

        <div className="cyber-card p-6">
          <h2 className="text-base font-semibold text-foreground mb-2">
            Contract Status Distribution
          </h2>
          <p className="text-xs text-muted-foreground mb-5">
            {a.totalEscrows} total contracts · {completedUsd} released
          </p>

          <div className="space-y-4">
            {STATUS_BARS.map(({ key, label, color }) => {
              const count = a[key];
              const pct = a.totalEscrows > 0
                ? Math.round((count / a.totalEscrows) * 100)
                : 0;
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full" style={{ background: color }} />
                      <span className="text-sm text-foreground">{label}</span>
                    </div>
                    <span className="label-caps text-[10px]">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: color,
                        boxShadow: pct > 0 ? `0 0 6px ${color}60` : 'none',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Released volume callout */}
          {a.completedVolumeSol > 0 && (
            <div
              className="mt-6 p-4 rounded-xl"
              style={{ background: 'rgba(57,255,20,0.05)', border: '1px solid rgba(57,255,20,0.15)' }}
            >
              <div className="label-caps text-[10px] text-muted-foreground mb-1">
                Total Released
              </div>
              <div className="text-xl font-bold text-[#39ff14]">
                {a.completedVolumeSol} SOL
              </div>
              <div className="text-xs text-muted-foreground">{completedUsd}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
