'use client';

import { ActivityChart } from '@/components/dashboard/ActivityChart';
import { StatCard } from '@/components/dashboard/StatCard';
import { MOCK_STATS, MOCK_ESCROWS } from '@/constants/mock-data';
import { TrendingUp, CheckSquare, DollarSign, BarChart3 } from 'lucide-react';



export default function AnalyticsPage() {
  const totalValue = MOCK_ESCROWS.reduce((sum, e) => sum + e.totalAmount, 0);
  const completedCount = MOCK_ESCROWS.filter((e) => e.status === 'completed').length;
  const disputedCount = MOCK_ESCROWS.filter((e) => e.status === 'disputed').length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Analytics Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Volume (SOL)" value={totalValue.toFixed(2)} icon={TrendingUp} accent="neon" />
        <StatCard title="Success Rate" value={`${MOCK_STATS.successRate}%`} icon={CheckSquare} accent="blue" />
        <StatCard title="Avg Contract (SOL)" value={(totalValue / MOCK_ESCROWS.length).toFixed(2)} icon={DollarSign} accent="purple" />
        <StatCard title="Disputes" value={disputedCount} icon={BarChart3} accent="amber" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ActivityChart />
        <div className="cyber-card p-6">
          <h2 className="text-base font-semibold text-foreground mb-4">Contract Status Distribution</h2>
          <div className="space-y-3">
            {[
              { label: 'Active', count: MOCK_ESCROWS.filter((e) => e.status === 'active').length, color: '#39ff14' },
              { label: 'Pending', count: MOCK_ESCROWS.filter((e) => e.status === 'pending').length, color: '#ffb14a' },
              { label: 'Completed', count: completedCount, color: '#79ff5b' },
              { label: 'Disputed', count: disputedCount, color: '#ff4a6b' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{item.label}</span>
                    <span className="label-caps">{item.count} / {MOCK_ESCROWS.length}</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(item.count / MOCK_ESCROWS.length) * 100}%`,
                        background: item.color,
                        boxShadow: `0 0 6px ${item.color}80`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
