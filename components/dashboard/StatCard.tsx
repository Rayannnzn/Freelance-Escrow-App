'use client';

import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: { value: number; direction: 'up' | 'down' };
  icon: LucideIcon;
  iconColor?: string;
  accent?: 'neon' | 'blue' | 'purple' | 'amber';
  className?: string;
}

const ACCENT_MAP = {
  neon:   { bg: 'rgba(57,255,20,0.1)',   icon: 'text-[#39ff14]',  border: 'hover:border-[rgba(57,255,20,0.3)]' },
  blue:   { bg: 'rgba(0,238,252,0.1)',   icon: 'text-[#00eefc]',  border: 'hover:border-[rgba(0,238,252,0.3)]' },
  purple: { bg: 'rgba(153,69,255,0.1)',  icon: 'text-[#9945ff]',  border: 'hover:border-[rgba(153,69,255,0.3)]' },
  amber:  { bg: 'rgba(255,177,74,0.1)',  icon: 'text-[#ffb14a]',  border: 'hover:border-[rgba(255,177,74,0.3)]' },
};

export function StatCard({
  title,
  value,
  trend,
  icon: Icon,
  accent = 'neon',
  className,
}: StatCardProps) {
  const colors = ACCENT_MAP[accent];

  return (
    <div className={cn('cyber-card p-6 animate-fade-up', className)}>
      <div className="flex items-start justify-between mb-4">
        <div
          className="size-10 rounded-xl flex items-center justify-center"
          style={{ background: colors.bg }}
        >
          <Icon className={cn('size-5', colors.icon)} />
        </div>
        {trend && (
          <span
            className={cn(
              'flex items-center gap-0.5 text-xs font-medium',
              trend.direction === 'up' ? 'text-[#39ff14]' : 'text-[#ff4a6b]'
            )}
          >
            {trend.direction === 'up' ? (
              <ArrowUp className="size-3" />
            ) : (
              <ArrowDown className="size-3" />
            )}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
      <div className="label-caps">{title}</div>
    </div>
  );
}
