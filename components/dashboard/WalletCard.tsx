'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useSolPrice } from '@/hooks/useSolPrice';
import { formatSol, formatUsdWithRate, truncateAddress } from '@/lib/format';
import { NeonDot } from '@/components/common/NeonDot';
import { WalletButton } from '@/components/web3/WalletButton';
import { Copy, ExternalLink, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { getExplorerAddressUrl } from '@/lib/solana/explorer';
import { getSolanaNetwork } from '@/lib/solana/connection';

export function WalletCard() {
  const { publicKey, connected } = useWallet();
  const { data: balance, isLoading: balanceLoading } = useWalletBalance();
  const { price: solPrice, isLoading: priceLoading } = useSolPrice();
  const network = getSolanaNetwork();
  const address = publicKey?.toBase58() || '';

  const handleCopy = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    toast.success('Address copied');
  };

  if (!connected || !publicKey) {
    return (
      <div className="cyber-card p-6 flex flex-col items-center justify-center gap-4 min-h-[180px]">
        <div className="size-11 rounded-2xl glass flex items-center justify-center border border-white/[0.1]">
          <Wallet className="size-5 text-muted-foreground" />
        </div>
        <div className="text-center">
          <div className="text-sm font-semibold text-foreground mb-1">No Wallet Connected</div>
          <p className="text-xs text-muted-foreground mb-4">
            Connect your wallet to view balance and manage escrows
          </p>
          <WalletButton />
        </div>
      </div>
    );
  }

  return (
    <div className="relative cyber-card p-5 overflow-hidden">
      {/* Subtle top-edge accent — no animation, no glow overload */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(57,255,20,0.35), transparent)' }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg glass flex items-center justify-center border border-white/[0.1]">
            <Wallet className="size-4 text-foreground/70" />
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
      <div className="mb-4">
        <div className="text-2xl font-bold text-foreground tracking-tight">
          {balanceLoading ? (
            <span className="inline-block w-28 h-7 bg-white/[0.06] rounded-lg animate-pulse" />
          ) : (
            formatSol(balance ?? 0, 4)
          )}
        </div>
        <div className="text-sm text-muted-foreground mt-0.5">
          {balanceLoading || priceLoading ? (
            <span className="inline-block w-20 h-4 bg-white/[0.04] rounded animate-pulse" />
          ) : (
            <>≈ {formatUsdWithRate(balance ?? 0, solPrice)}</>
          )}
        </div>
      </div>

      {/* Address row */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-lg"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="label-caps text-[10px] shrink-0 text-muted-foreground/60">ADDR</div>
        <div className="flex-1 min-w-0 font-mono text-xs text-foreground/80 truncate">
          {truncateAddress(address, 6)}
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-colors"
            aria-label="Copy address"
          >
            <Copy className="size-3" />
          </button>
          <a
            href={getExplorerAddressUrl(address)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md text-muted-foreground hover:text-[#00eefc] hover:bg-white/[0.06] transition-colors"
            aria-label="View on explorer"
          >
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
