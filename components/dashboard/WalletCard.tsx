'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { formatSol, formatUsd, truncateAddress } from '@/lib/format';
import { NeonDot } from '@/components/common/NeonDot';
import { WalletButton } from '@/components/web3/WalletButton';
import { Copy, ExternalLink, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { getExplorerAddressUrl } from '@/lib/solana/explorer';
import { getSolanaNetwork } from '@/lib/solana/connection';

export function WalletCard() {
  const { publicKey, connected } = useWallet();
  const { data: balance, isLoading } = useWalletBalance();
  const network = getSolanaNetwork();
  const address = publicKey?.toBase58() || '';

  const handleCopy = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    toast.success('Address copied');
  };

  if (!connected || !publicKey) {
    return (
      <div className="relative cyber-card p-6 overflow-hidden flex flex-col items-center justify-center gap-4">
        <div className="size-12 rounded-2xl glass flex items-center justify-center border border-[rgba(57,255,20,0.3)]">
          <Wallet className="size-6 text-[#39ff14]" />
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-foreground mb-1">No Wallet Connected</div>
          <p className="text-xs text-muted-foreground mb-3">
            Connect your wallet to view balance and manage escrows
          </p>
          <WalletButton />
        </div>
      </div>
    );
  }

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
            <div className="label-caps text-[10px]">{network}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <NeonDot />
          <span className="text-xs text-[#39ff14] font-medium">Live</span>
        </div>
      </div>

      {/* Balance */}
      <div className="relative mb-4">
        <div className="text-3xl font-bold text-foreground">
          {isLoading ? (
            <span className="inline-block w-24 h-8 bg-white/[0.06] rounded animate-pulse" />
          ) : (
            formatSol(balance ?? 0, 2)
          )}
        </div>
        <div className="text-sm text-muted-foreground mt-0.5">
          ≈ {formatUsd(balance ?? 0)}
        </div>
      </div>

      {/* Address */}
      <div className="relative flex items-center gap-2 glass rounded-xl px-3 py-2.5">
        <div className="label-caps text-[10px] shrink-0">WALLET</div>
        <div className="flex-1 min-w-0">
          <div className="hash-display truncate">{truncateAddress(address, 6)}</div>
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
            href={getExplorerAddressUrl(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-muted-foreground hover:text-[#00eefc] transition-colors"
            aria-label="View on explorer"
          >
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>

      {/* Network pill */}
      <div className="relative mt-3 flex items-center gap-2">
        <span className="label-caps text-[10px] text-muted-foreground">Connected to {network}</span>
      </div>
    </div>
  );
}
