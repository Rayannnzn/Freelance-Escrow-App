import { cn } from '@/lib/utils';

interface NeonDotProps {
  color?: 'green' | 'blue' | 'purple' | 'amber' | 'red';
  className?: string;
  pulse?: boolean;
}

const COLOR_MAP = {
  green:  { dot: '#39ff14', glow: 'rgba(57,255,20,0.5)' },
  blue:   { dot: '#00eefc', glow: 'rgba(0,238,252,0.5)' },
  purple: { dot: '#9945ff', glow: 'rgba(153,69,255,0.5)' },
  amber:  { dot: '#ffb14a', glow: 'rgba(255,177,74,0.5)' },
  red:    { dot: '#ff4a6b', glow: 'rgba(255,74,107,0.5)' },
};

export function NeonDot({ color = 'green', className, pulse = true }: NeonDotProps) {
  const { dot, glow } = COLOR_MAP[color];

  return (
    <span
      className={cn('inline-block rounded-full shrink-0', pulse && 'neon-pulse', className)}
      style={{
        width: 8,
        height: 8,
        background: dot,
        boxShadow: `0 0 6px ${dot}, 0 0 12px ${glow}`,
      }}
      aria-hidden="true"
    />
  );
}
