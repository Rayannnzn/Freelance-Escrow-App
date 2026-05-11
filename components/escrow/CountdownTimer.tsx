'use client';

import { useEffect, useState } from 'react';
import { getTimeUntil } from '@/lib/format';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate: string;
  className?: string;
}

interface TimeUnit {
  value: number;
  label: string;
}

function UnitDisplay({ value, label }: TimeUnit) {
  return (
    <div className="flex flex-col items-center">
      <div className="glass rounded-xl w-16 h-16 flex items-center justify-center border border-white/[0.08] mb-1.5">
        <span className="text-2xl font-bold text-foreground tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="label-caps text-[10px]">{label}</span>
    </div>
  );
}

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
  const [time, setTime] = useState(() => getTimeUntil(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeUntil(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (time.expired) {
    return (
      <div className={cn('text-center', className)}>
        <span className="label-caps text-[#ff4a6b]">Timeout Expired</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <UnitDisplay value={time.days} label="Days" />
      <div className="text-muted-foreground text-xl font-light mb-5">:</div>
      <UnitDisplay value={time.hours} label="Hours" />
      <div className="text-muted-foreground text-xl font-light mb-5">:</div>
      <UnitDisplay value={time.minutes} label="Mins" />
    </div>
  );
}
