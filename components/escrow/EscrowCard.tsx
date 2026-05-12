'use client';

import type { EscrowDisplay, OnChainEscrowStatus } from '@/lib/solana/types';
import type { EscrowMetadataRow } from '@/lib/supabase/types';
import { formatSol, formatRelativeTime } from '@/lib/format';
import { truncatePubkey } from '@/lib/solana/utils';
import {
  Users,
  Clock,
  ChevronRight,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  GitBranch,
  Video,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface EscrowCardProps {
  escrow: EscrowDisplay;
  metadata?: EscrowMetadataRow | null;
  className?: string;
}

const STATUS_CONFIG: Record<OnChainEscrowStatus, { label: string; color: string; bgColor: string }> = {
  initialized: { label: 'Active', color: '#39ff14', bgColor: 'rgba(57,255,20,0.12)' },
  submitted: { label: 'Submitted', color: '#ffb14a', bgColor: 'rgba(255,177,74,0.12)' },
  completed: { label: 'Completed', color: '#79ff5b', bgColor: 'rgba(121,255,91,0.12)' },
  timeout_claimable: { label: 'Timeout', color: '#ff4a6b', bgColor: 'rgba(255,74,107,0.12)' },
};

export function EscrowCard({ escrow, metadata, className }: EscrowCardProps) {
  const config = STATUS_CONFIG[escrow.status];
  const isActive = escrow.status === 'initialized';
  const isTimeout = escrow.status === 'timeout_claimable';

  const projectName = metadata?.project_name ?? 'Escrow Contract';
  const projectDesc = metadata?.project_description;
  const hasDeliverables = metadata?.github_link || metadata?.loom_link || metadata?.live_url;

  return (
    <Link href={`/escrow/${escrow.pdaAddress}`}>
      <div
        className={cn(
          'cyber-card p-5 cursor-pointer group animate-fade-up',
          isActive && 'cyber-card-active',
          isTimeout && 'border-[rgba(255,74,107,0.3)] hover:border-[rgba(255,74,107,0.5)]',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-[#39ff14] transition-colors">
              {projectName}
            </h3>
            <div className="label-caps text-[10px] mt-0.5">{truncatePubkey(escrow.pdaAddress, 6)}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="px-2 py-0.5 rounded-md text-[11px] font-semibold"
              style={{ color: config.color, backgroundColor: config.bgColor }}
            >
              {config.label}
            </span>
            <ChevronRight className="size-3.5 text-muted-foreground group-hover:text-[#39ff14] transition-colors" />
          </div>
        </div>

        {/* Description */}
        {projectDesc && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{projectDesc}</p>
        )}

        {/* Amount + Status */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xl font-bold text-foreground">{formatSol(escrow.amountSol)}</div>
            <div className="label-caps text-[10px]">Locked Amount</div>
          </div>
          <div className="text-right">
            {escrow.status === 'initialized' && (
              <div className="flex items-center gap-1 text-[#39ff14]">
                <Loader2 className="size-3 animate-spin" />
                <span className="text-xs font-medium">Awaiting Work</span>
              </div>
            )}
            {escrow.status === 'submitted' && (
              <div className="flex items-center gap-1 text-[#ffb14a]">
                <Clock className="size-3" />
                <span className="text-xs font-medium">Awaiting Approval</span>
              </div>
            )}
            {escrow.status === 'completed' && (
              <div className="flex items-center gap-1 text-[#79ff5b]">
                <CheckCircle2 className="size-3" />
                <span className="text-xs font-medium">Funds Released</span>
              </div>
            )}
            {escrow.status === 'timeout_claimable' && (
              <div className="flex items-center gap-1 text-[#ff4a6b]">
                <AlertTriangle className="size-3" />
                <span className="text-xs font-medium">Claimable</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width:
                  escrow.status === 'completed'
                    ? '100%'
                    : escrow.status === 'submitted'
                    ? '66%'
                    : escrow.status === 'timeout_claimable'
                    ? '100%'
                    : '33%',
                background: isTimeout
                  ? 'linear-gradient(90deg, #ff4a6b, rgba(255,74,107,0.3))'
                  : `linear-gradient(90deg, ${config.color}, ${config.color}40)`,
                boxShadow: `0 0 6px ${config.color}80`,
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3" />
            <span className="truncate max-w-[80px]">{truncatePubkey(escrow.client, 4)}</span>
            <span>→</span>
            <span className="truncate max-w-[80px]">{truncatePubkey(escrow.freelancer, 4)}</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Deliverable indicators */}
            {hasDeliverables && (
              <div className="flex items-center gap-1">
                {metadata?.github_link && <GitBranch className="size-3 text-[rgba(255,255,255,0.3)]" />}
                {metadata?.loom_link && <Video className="size-3 text-[rgba(0,238,252,0.5)]" />}
                {metadata?.live_url && <Globe className="size-3 text-[rgba(57,255,20,0.5)]" />}
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              <span>{formatRelativeTime(escrow.createdAt.toISOString())}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
