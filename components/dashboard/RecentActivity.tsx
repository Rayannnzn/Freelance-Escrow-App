'use client';

import { Transaction } from '@/types/transaction.types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatRelativeTime, formatSol } from '@/lib/format';
import { ArrowUpRight, ArrowDownLeft, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const TYPE_CONFIG = {
  escrow_funded:     { icon: ArrowDownLeft, color: 'text-[#00eefc]' },
  work_submitted:    { icon: Clock,         color: 'text-[#ffb14a]' },
  funds_released:    { icon: ArrowUpRight,  color: 'text-[#39ff14]' },
  dispute_raised:    { icon: AlertTriangle, color: 'text-[#ff4a6b]' },
  refund_issued:     { icon: ArrowUpRight,  color: 'text-[#ffb14a]' },
  milestone_approved:{ icon: CheckCircle2,  color: 'text-[#39ff14]' },
};

interface RecentActivityProps {
  transactions: Transaction[];
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  return (
    <div className="cyber-card p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
        <a href="/escrow" className="text-xs text-[#39ff14] hover:text-[#79ff5b] transition-colors font-medium">
          View all →
        </a>
      </div>

      <div className="space-y-2">
        {transactions.map((tx) => {
          const config = TYPE_CONFIG[tx.type];
          const Icon = config?.icon ?? Clock;

          return (
            <div
              key={tx.id}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
            >
              <div className={cn(
                'size-8 rounded-lg flex items-center justify-center shrink-0 glass',
                config?.color
              )}>
                <Icon className="size-3.5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  {tx.description}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(tx.timestamp)}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="hash-display text-[11px]">{tx.txHash}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                {tx.amount !== undefined ? (
                  <span className={cn(
                    'text-sm font-semibold',
                    tx.amount > 0 ? 'text-[#39ff14]' : 'text-[#ff4a6b]'
                  )}>
                    {tx.amount > 0 ? '+' : ''}{formatSol(tx.amount)}
                  </span>
                ) : null}
                <StatusBadge status={tx.status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
