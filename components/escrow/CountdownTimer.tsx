'use client';

import { useEffect, useState } from 'react';
import { getTimeUntil } from '@/lib/format';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function UnitBox({ value, label, urgent }: { value: number; label: string; urgent?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center border transition-colors duration-300',
          urgent
            ? 'border-[rgba(255,74,107,0.3)] bg-[rgba(255,74,107,0.07)]'
            : 'border-white/[0.08] bg-white/[0.03]'
        )}
      >
        <span
          className={cn(
            'text-xl font-bold tabular-nums',
            urgent ? 'text-[#ff4a6b]' : 'text-foreground'
          )}
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="label-caps text-[10px]">{label}</span>
    </div>
  );
}

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
  // Null on first render prevents SSR/client hydration mismatch
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    // Compute immediately on mount (client only)
    setTime(getTimeUntil(targetDate));

    const interval = setInterval(() => {
      setTime(getTimeUntil(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Server render / pre-hydration: show static placeholder
  if (time === null) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {['--', '--', '--', '--'].map((_, i) => (
          <div key={i} className="w-14 h-14 rounded-xl border border-white/[0.06] bg-white/[0.02] animate-pulse" />
        ))}
      </div>
    );
  }

  if (time.expired) {
    return (
      <div className={cn('flex items-center gap-2 text-[#ff4a6b]', className)}>
        <AlertTriangle className="size-4" />
        <span className="text-sm font-semibold">Timeout Expired</span>
      </div>
    );
  }

  // Warn when < 24 hours remaining
  const isUrgent = time.days === 0;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <UnitBox value={time.days} label="Days" urgent={isUrgent} />
      <span className="text-muted-foreground/40 text-lg font-light pb-5">:</span>
      <UnitBox value={time.hours} label="Hrs" urgent={isUrgent} />
      <span className="text-muted-foreground/40 text-lg font-light pb-5">:</span>
      <UnitBox value={time.minutes} label="Mins" urgent={isUrgent} />
      <span className="text-muted-foreground/40 text-lg font-light pb-5">:</span>
      <UnitBox value={time.seconds} label="Secs" urgent={isUrgent} />
    </div>
  );
}
