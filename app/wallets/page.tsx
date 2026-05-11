'use client';

import { WalletCard } from '@/components/dashboard/WalletCard';
import { ConnectWalletPrompt } from '@/components/web3/ConnectWalletPrompt';
import { useWallet } from '@solana/wallet-adapter-react';

export default function WalletsPage() {
  const { connected } = useWallet();

  if (!connected) {
    return <ConnectWalletPrompt />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Connected Wallets</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <WalletCard />
      </div>

      {/* Wallet adapters info */}
      <div className="cyber-card p-6 border-[rgba(0,238,252,0.15)]">
        <h2 className="text-sm font-semibold text-foreground mb-2">Supported Wallet Adapters</h2>
        <p className="text-xs text-muted-foreground mb-4">
          KineTex supports all major Solana wallets via the Solana Wallet Adapter standard.
          Connect your preferred wallet to start creating and managing escrows.
        </p>
        <div className="flex items-center gap-3 flex-wrap">
          {['Phantom', 'Solflare', 'Backpack', 'Ledger', 'Trezor'].map((w) => (
            <span key={w} className="glass px-3 py-1.5 rounded-lg text-xs font-medium text-foreground border border-white/[0.08]">
              {w}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
