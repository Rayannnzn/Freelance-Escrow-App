'use client';

import { Bell, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NeonDot } from '@/components/common/NeonDot';
import Link from 'next/link';

interface TopNavProps {
  title?: string;
  subtitle?: string;
}

export function TopNav({ title = 'Dashboard', subtitle }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-4 px-6 glass border-b border-white/[0.06]">
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
          placeholder="Search escrows, contracts..."
          className="pl-9 w-64 h-8 text-sm bg-white/[0.04] border-white/[0.08] placeholder:text-muted-foreground/60 focus:border-[rgba(57,255,20,0.4)] focus:ring-1 focus:ring-[rgba(57,255,20,0.2)]"
          aria-label="Search"
        />
      </div>

      {/* Notifications */}
      <Button
        variant="ghost"
        size="icon"
        className="relative size-8 hover:bg-white/[0.06]"
        aria-label="Notifications"
      >
        <Bell className="size-4 text-muted-foreground" />
        <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#39ff14] shadow-[0_0_6px_#39ff14]" />
      </Button>

      {/* New Escrow CTA */}
      <Link href="/create-escrow">
        <Button
          size="sm"
          className="h-8 bg-[#39ff14] text-[#053900] hover:bg-[#2ae500] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] font-semibold text-xs transition-all duration-200"
        >
          <Plus data-icon="inline-start" className="size-3.5" />
          New Escrow
        </Button>
      </Link>

      {/* Wallet mini */}
      <button
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 glass rounded-xl border border-[rgba(57,255,20,0.2)] hover:border-[rgba(57,255,20,0.4)] transition-colors"
        aria-label="Wallet status"
      >
        <NeonDot />
        <span className="text-xs font-medium text-[#39ff14]">48.24 SOL</span>
      </button>
    </header>
  );
}
