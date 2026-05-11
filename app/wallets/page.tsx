'use client';

import { WalletCard } from '@/components/dashboard/WalletCard';
import { MOCK_WALLET } from '@/constants/mock-data';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';


export default function WalletsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Connected Wallets</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="border-white/[0.12] hover:bg-white/[0.04]">
            <RefreshCw data-icon="inline-start" className="size-3.5" />
            Refresh
          </Button>
          <Button size="sm" className="bg-[#39ff14] text-[#053900] hover:bg-[#2ae500] font-semibold">
            <Plus data-icon="inline-start" className="size-3.5" />
            Connect Wallet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <WalletCard wallet={MOCK_WALLET} />

        {/* Placeholder for additional wallets */}
        <div className="cyber-card p-6 flex flex-col items-center justify-center gap-3 border-dashed border-white/[0.12] hover:border-[rgba(57,255,20,0.2)] transition-colors cursor-pointer group">
          <div className="size-12 rounded-2xl glass flex items-center justify-center group-hover:border-[rgba(57,255,20,0.3)] transition-colors">
            <Plus className="size-5 text-muted-foreground group-hover:text-[#39ff14] transition-colors" />
          </div>
          <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            Connect Wallet
          </div>
          <div className="label-caps text-[10px] text-center">
            Phantom, Solflare, Backpack, Ledger
          </div>
        </div>
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
