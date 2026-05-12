'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, APP_NAME, APP_SUBTITLE } from '@/constants/navigation';
import { NeonDot } from '@/components/common/NeonDot';
import { Zap } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] z-40 flex flex-col glass-deep border-r border-white/[0.06]">
      {/* Logo */}
      <div className="p-5 border-b border-white/[0.06]">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="size-9 rounded-xl glass flex items-center justify-center border border-[rgba(57,255,20,0.2)]">
            <Zap className="size-5 text-[#39ff14]" fill="#39ff14" />
          </div>
          <div>
            <div className="text-[15px] font-bold tracking-tight text-foreground group-hover:text-[#39ff14] transition-colors">
              {APP_NAME}
            </div>
            <div className="label-caps text-[10px]">{APP_SUBTITLE}</div>
          </div>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-[rgba(57,255,20,0.08)] text-[#39ff14] border border-[rgba(57,255,20,0.2)]'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04] border border-transparent'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Active indicator */}
              {isActive && (
                <span className="absolute left-0 w-0.5 h-5 rounded-r-full bg-[#39ff14] shadow-[0_0_6px_#39ff14]" />
              )}
              <Icon
                className={cn(
                  'size-4 shrink-0',
                  isActive && 'drop-shadow-[0_0_4px_rgba(57,255,20,0.6)]'
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Network Status */}
      <div className="p-4 border-t border-white/[0.06]">
        <div className="glass rounded-xl px-3 py-2.5 flex items-center gap-2">
          <NeonDot />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-foreground">Devnet</div>
            <div className="label-caps text-[10px] truncate">Solana Blockchain</div>
          </div>
          <span className="label-caps text-[#39ff14] text-[10px] font-semibold">LIVE</span>
        </div>
      </div>
    </aside>
  );
}
