'use client';

import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NeonDot } from '@/components/common/NeonDot';
import { WalletButton } from '@/components/web3/WalletButton';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';

interface TopNavProps {
  title?: string;
  subtitle?: string;
}

export function TopNav({ title = 'Dashboard', subtitle }: TopNavProps) {
  const { publicKey, connected } = useWallet();
  const { data: balance, isLoading } = useWalletBalance();

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-3 px-6 glass border-b border-white/[0.06]">
      {/* Page Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-foreground truncate">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>

      {/* Search */}
      <div className="hidden md:flex relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
        <Input
          placeholder="Search escrows..."
          className="pl-9 w-56 h-8 text-sm bg-white/[0.04] border-white/[0.08] placeholder:text-muted-foreground/60 focus:border-[rgba(57,255,20,0.4)] focus:ring-1 focus:ring-[rgba(57,255,20,0.2)]"
          aria-label="Search"
        />
      </div>

      {/* Notifications — real dynamic dropdown */}
      <NotificationDropdown />

      {/* New Escrow CTA */}
      <Link href="/create-escrow">
        <Button
          size="sm"
          className="h-8 bg-[#39ff14] text-[#053900] hover:bg-[#2ae500] hover:shadow-[0_0_16px_rgba(57,255,20,0.35)] font-semibold text-xs transition-all duration-200"
        >
          <Plus className="size-3.5 mr-1" />
          New Escrow
        </Button>
      </Link>

      {/* Wallet — balance pill + connect button */}
      {connected && publicKey ? (
        <div className="hidden lg:flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-xl border border-white/[0.1]">
            <NeonDot />
            <span className="text-xs font-medium text-foreground">
              {isLoading ? '···' : `${(balance ?? 0).toFixed(2)} SOL`}
            </span>
          </div>
          <WalletButton />
        </div>
      ) : (
        <WalletButton />
      )}
    </header>
  );
}
