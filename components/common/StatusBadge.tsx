'use client';

import { cn } from '@/lib/utils';
import { EscrowStatus, MilestoneStatus } from '@/types/escrow.types';

type StatusVariant = EscrowStatus | MilestoneStatus | 'finalized' | 'processing' | 'failed';

const STATUS_CONFIG: Record<
  StatusVariant,
  { label: string; className: string }
> = {
  active:       { label: 'Active',       className: 'bg-[rgba(57,255,20,0.15)] text-[#39ff14] border border-[rgba(57,255,20,0.3)]' },
  initialized:  { label: 'Initialized',  className: 'bg-[rgba(0,238,252,0.12)] text-[#00eefc] border border-[rgba(0,238,252,0.25)]' },
  pending:      { label: 'Pending',      className: 'bg-[rgba(255,177,74,0.15)] text-[#ffb14a] border border-[rgba(255,177,74,0.3)]' },
  completed:    { label: 'Completed',    className: 'bg-[rgba(57,255,20,0.1)] text-[#79ff5b] border border-[rgba(57,255,20,0.2)]' },
  disputed:     { label: 'Disputed',     className: 'bg-[rgba(255,74,107,0.15)] text-[#ff4a6b] border border-[rgba(255,74,107,0.3)]' },
  cancelled:    { label: 'Cancelled',    className: 'bg-[rgba(255,255,255,0.08)] text-[#baccb0] border border-[rgba(255,255,255,0.1)]' },
  in_progress:  { label: 'In Progress',  className: 'bg-[rgba(0,238,252,0.12)] text-[#00eefc] border border-[rgba(0,238,252,0.25)]' },
  submitted:    { label: 'Submitted',    className: 'bg-[rgba(255,177,74,0.15)] text-[#ffb14a] border border-[rgba(255,177,74,0.3)]' },
  approved:     { label: 'Approved',     className: 'bg-[rgba(57,255,20,0.15)] text-[#39ff14] border border-[rgba(57,255,20,0.3)]' },
  released:     { label: 'Released',     className: 'bg-[rgba(57,255,20,0.1)] text-[#79ff5b] border border-[rgba(57,255,20,0.2)]' },
  finalized:    { label: 'Finalized',    className: 'bg-[rgba(57,255,20,0.1)] text-[#79ff5b] border border-[rgba(57,255,20,0.2)]' },
  processing:   { label: 'Processing',   className: 'bg-[rgba(255,177,74,0.15)] text-[#ffb14a] border border-[rgba(255,177,74,0.3)]' },
  failed:       { label: 'Failed',       className: 'bg-[rgba(255,74,107,0.15)] text-[#ff4a6b] border border-[rgba(255,74,107,0.3)]' },
};

interface StatusBadgeProps {
  status: StatusVariant;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: 'bg-muted text-muted-foreground border border-border',
  };

  return (
    <span
      className={cn(
        'label-caps inline-flex items-center px-2.5 py-0.5 rounded-full',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
