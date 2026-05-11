'use client';

import { WalletInfo } from '@/types/wallet.types';
import { formatSol, formatUsd, truncateAddress } from '@/lib/format';
import { NeonDot } from '@/components/common/NeonDot';
import { Copy, ExternalLink, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface WalletCardProps {
  wallet: WalletInfo;
}

export function WalletCard({ wallet }: WalletCardProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(wallet.address);
    toast.success('Address copied');
  };

  return (
    <div className="relative cyber-card p-6 overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 80% at 50% 50%, #39ff14 0%, #00eefc 60%, transparent 100%)',
          animation: 'neon-pulse 3s ease-in-out infinite',
        }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg glass flex items-center justify-center border border-[rgba(57,255,20,0.3)]">
            <Wallet className="size-4 text-[#39ff14]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">Connected Wallet</div>
            <div className="label-caps text-[10px]">{wallet.network}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <NeonDot />
          <span className="text-xs text-[#39ff14] font-medium">Live</span>
        </div>
      </div>

      {/* Balance */}
      <div className="relative mb-4">
        <div className="text-3xl font-bold text-foreground">{formatSol(wallet.balance, 2)}</div>
        <div className="text-sm text-muted-foreground mt-0.5">
          ≈ {formatUsd(wallet.balance)}
        </div>
      </div>

      {/* Address */}
      <div className="relative flex items-center gap-2 glass rounded-xl px-3 py-2.5">
        <div className="label-caps text-[10px] shrink-0">WALLET</div>
        <div className="flex-1 min-w-0">
          <div className="hash-display truncate">{truncateAddress(wallet.address, 6)}</div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1 text-muted-foreground hover:text-[#39ff14] transition-colors"
            aria-label="Copy address"
          >
            <Copy className="size-3" />
          </button>
          <a
            href={`https://explorer.solana.com/address/${wallet.address}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-muted-foreground hover:text-[#00eefc] transition-colors"
            aria-label="View on explorer"
          >
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>

      {/* Connected to Devnet pill */}
      <div className="relative mt-3 flex items-center gap-2">
        <span className="label-caps text-[10px] text-muted-foreground">Connected to Devnet</span>
      </div>
    </div>
  );
}
