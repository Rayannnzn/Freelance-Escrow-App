'use client';

import { Escrow } from '@/types/escrow.types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatSol, formatRelativeTime } from '@/lib/format';
import { Progress } from '@/components/ui/progress';
import { Users, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface EscrowCardProps {
  escrow: Escrow;
  className?: string;
}

export function EscrowCard({ escrow, className }: EscrowCardProps) {
  const completedMilestones = escrow.milestones.filter(
    (m) => m.status === 'released' || m.status === 'approved'
  ).length;
  const totalMilestones = escrow.milestones.length;
  const progressPct = totalMilestones > 0
    ? Math.round((completedMilestones / totalMilestones) * 100)
    : 0;

  const isActive = escrow.status === 'active';
  const isDisputed = escrow.status === 'disputed';

  return (
    <Link href={`/escrow/${escrow.id}`}>
      <div
        className={cn(
          'cyber-card p-5 cursor-pointer group animate-fade-up',
          isActive && 'cyber-card-active',
          isDisputed && 'border-[rgba(255,74,107,0.3)] hover:border-[rgba(255,74,107,0.5)]',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-[#39ff14] transition-colors">
              {escrow.title}
            </h3>
            <div className="label-caps text-[10px] mt-0.5">{escrow.contractId}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <StatusBadge status={escrow.status} />
            <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-[#39ff14] transition-colors" />
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xl font-bold text-foreground">{formatSol(escrow.totalAmount)}</div>
            <div className="label-caps text-[10px]">Total Locked</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-foreground">
              {completedMilestones}/{totalMilestones}
            </div>
            <div className="label-caps text-[10px]">Milestones</div>
          </div>
        </div>

        {/* Progress bar — laser effect */}
        <div className="mb-3">
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPct}%`,
                background: isDisputed
                  ? 'linear-gradient(90deg, #ff4a6b, rgba(255,74,107,0.3))'
                  : 'linear-gradient(90deg, #39ff14, rgba(57,255,20,0.3))',
                boxShadow: isDisputed
                  ? '0 0 6px rgba(255,74,107,0.5)'
                  : '0 0 6px rgba(57,255,20,0.5)',
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="label-caps text-[10px]">{progressPct}% complete</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3" />
            <span className="truncate max-w-[100px]">{escrow.client.displayName}</span>
            <span>→</span>
            <span className="truncate max-w-[100px]">{escrow.freelancer.displayName}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            <span>{formatRelativeTime(escrow.updatedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
