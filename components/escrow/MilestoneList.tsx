'use client';

import { Milestone } from '@/types/escrow.types';
import { StatusBadge } from '@/components/common/StatusBadge';
import { formatSol, formatRelativeTime } from '@/lib/format';
import { CheckCircle2, Clock, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MilestoneListProps {
  milestones: Milestone[];
  onApprove?: (milestoneId: string) => void;
  isClient?: boolean;
  className?: string;
}

export function MilestoneList({
  milestones,
  onApprove,
  isClient = false,
  className,
}: MilestoneListProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {milestones.map((m, idx) => (
        <div
          key={m.id}
          className={cn(
            'glass rounded-2xl p-4 border transition-all duration-200',
            m.status === 'submitted' && 'border-[rgba(255,177,74,0.3)]',
            m.status === 'approved' || m.status === 'released'
              ? 'border-[rgba(57,255,20,0.2)]'
              : 'border-white/[0.06]',
          )}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="size-5 rounded-md bg-white/[0.06] flex items-center justify-center text-xs font-bold text-muted-foreground">
                {idx + 1}
              </span>
              <h4 className="text-sm font-semibold text-foreground">{m.title}</h4>
            </div>
            <StatusBadge status={m.status} />
          </div>

          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{m.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-sm font-bold text-[#39ff14]">{formatSol(m.amount)}</div>
                <div className="label-caps text-[10px]">Milestone Value</div>
              </div>
              {m.dueDate && (
                <div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />
                    {new Date(m.dueDate).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric',
                    })}
                  </div>
                  <div className="label-caps text-[10px]">Due Date</div>
                </div>
              )}
            </div>

            {isClient && m.status === 'submitted' && onApprove && (
              <Button
                size="sm"
                onClick={() => onApprove(m.id)}
                className="h-7 text-xs bg-[#39ff14] text-[#053900] hover:bg-[#2ae500] hover:shadow-[0_0_16px_rgba(57,255,20,0.3)] font-semibold"
              >
                <CheckCircle2 data-icon="inline-start" className="size-3" />
                Approve
              </Button>
            )}

            {(m.status === 'released' || m.status === 'approved') && (
              <div className="flex items-center gap-1 text-xs text-[#39ff14]">
                <CheckCircle2 className="size-3" />
                {m.status === 'released' ? 'Funds Released' : 'Approved'}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
