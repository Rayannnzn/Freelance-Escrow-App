import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  variant?: 'card' | 'row' | 'stat' | 'chart';
  count?: number;
  className?: string;
}

export function LoadingSkeleton({
  variant = 'card',
  count = 1,
  className,
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count });

  if (variant === 'stat') {
    return (
      <div className={cn('grid grid-cols-2 lg:grid-cols-4 gap-4', className)}>
        {items.map((_, i) => (
          <div key={i} className="cyber-card p-6 space-y-3">
            <Skeleton className="h-4 w-24 bg-white/5" />
            <Skeleton className="h-8 w-32 bg-white/5" />
            <Skeleton className="h-3 w-20 bg-white/5" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className={cn('cyber-card p-6', className)}>
        <Skeleton className="h-5 w-36 mb-6 bg-white/5" />
        <Skeleton className="h-48 w-full bg-white/5 rounded-lg" />
      </div>
    );
  }

  if (variant === 'row') {
    return (
      <div className={cn('space-y-2', className)}>
        {items.map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02]">
            <Skeleton className="size-10 rounded-full bg-white/5" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48 bg-white/5" />
              <Skeleton className="h-3 w-32 bg-white/5" />
            </div>
            <Skeleton className="h-4 w-20 bg-white/5" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4', className)}>
      {items.map((_, i) => (
        <div key={i} className="cyber-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40 bg-white/5" />
            <Skeleton className="h-5 w-16 bg-white/5 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full bg-white/5" />
          <Skeleton className="h-3 w-3/4 bg-white/5" />
          <div className="flex items-center gap-2 pt-2">
            <Skeleton className="h-4 w-24 bg-white/5" />
            <Skeleton className="h-4 w-24 bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
