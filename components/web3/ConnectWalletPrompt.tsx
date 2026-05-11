'use client';

import { Wallet, WifiOff } from 'lucide-react';
import { WalletButton } from './WalletButton';

interface ConnectWalletPromptProps {
  title?: string;
  description?: string;
}

/**
 * Full-section prompt shown when wallet is not connected.
 * Matches the cyberpunk aesthetic.
 */
export function ConnectWalletPrompt({
  title = 'Connect Your Wallet',
  description = 'Connect a Solana wallet to view your escrow contracts and manage transactions on Devnet.',
}: ConnectWalletPromptProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="cyber-card p-10 max-w-md text-center space-y-6 border-[rgba(57,255,20,0.2)]">
        <div className="size-16 rounded-2xl glass flex items-center justify-center mx-auto border border-[rgba(57,255,20,0.3)] shadow-[0_0_20px_rgba(57,255,20,0.1)]">
          <Wallet className="size-8 text-[#39ff14]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>

        <WalletButton />

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <WifiOff className="size-3" />
          <span>Supports Phantom, Solflare, Backpack</span>
        </div>
      </div>
    </div>
  );
}
