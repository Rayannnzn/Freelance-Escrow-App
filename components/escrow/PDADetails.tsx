'use client';

import { Shield, Copy, ExternalLink, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { NeonDot } from '@/components/common/NeonDot';

interface PDADetailsProps {
  pdaAddress: string;
  programId: string;
  auditLog: Array<{
    id: string;
    event: string;
    timestamp: string;
    txHash?: string;
    details?: string;
  }>;
}

export function PDADetails({ pdaAddress, programId, auditLog }: PDADetailsProps) {
  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  return (
    <div className="space-y-4">
      {/* Secure PDA Details Card */}
      <div className="glass rounded-2xl p-5 border border-[rgba(57,255,20,0.15)]">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="size-4 text-[#39ff14]" />
          <h3 className="text-sm font-semibold text-foreground">Secure PDA Details</h3>
        </div>

        <div className="space-y-3">
          <div>
            <div className="label-caps mb-1">PDA Address</div>
            <div className="flex items-center gap-2">
              <span className="hash-display flex-1 truncate text-xs">{pdaAddress}</span>
              <button
                onClick={() => copyToClipboard(pdaAddress, 'PDA address')}
                className="text-muted-foreground hover:text-[#39ff14] transition-colors"
                aria-label="Copy PDA address"
              >
                <Copy className="size-3" />
              </button>
              <a
                href={`https://explorer.solana.com/address/${pdaAddress}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#00eefc] transition-colors"
                aria-label="View on explorer"
              >
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>

          <div>
            <div className="label-caps mb-1">Program ID</div>
            <span className="hash-display text-xs">{programId}</span>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
            <Lock className="size-3 text-[#39ff14]" />
            <span className="text-xs text-muted-foreground">
              Escrow is encrypted and secured by Solana Anchor.
            </span>
          </div>
        </div>
      </div>

      {/* PDA Audit Log */}
      <div className="glass rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">PDA Audit Log</h3>

        <div className="space-y-0">
          {auditLog.map((entry, idx) => (
            <div key={entry.id} className="relative flex gap-3">
              {/* Timeline line */}
              {idx < auditLog.length - 1 && (
                <div className="absolute left-[11px] top-6 bottom-0 w-px bg-white/[0.06]" />
              )}

              <div className="shrink-0 mt-0.5">
                <NeonDot color={entry.details === 'Timer Running' ? 'amber' : 'green'} pulse={idx === auditLog.length - 1} />
              </div>

              <div className="pb-4 flex-1 min-w-0">
                <div className="text-xs font-medium text-foreground">{entry.event}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {new Date(entry.timestamp).toLocaleString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </div>
                {entry.txHash && (
                  <span className="hash-display text-[10px] mt-0.5 inline-block">{entry.txHash}</span>
                )}
                {entry.details && (
                  <span className="label-caps text-[10px] mt-1 inline-block text-[#ffb14a]">
                    {entry.details}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
