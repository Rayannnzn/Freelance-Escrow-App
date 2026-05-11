import { cn } from '@/lib/utils';
import { FileX2, AlertTriangle, WifiOff } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'empty' | 'error' | 'offline';
  className?: string;
}

const ICONS = {
  empty:   FileX2,
  error:   AlertTriangle,
  offline: WifiOff,
};

export function EmptyState({
  title = 'No data found',
  description = 'Nothing to display here yet.',
  action,
  variant = 'empty',
  className,
}: EmptyStateProps) {
  const Icon = ICONS[variant];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-8 text-center',
        className
      )}
    >
      <div className="size-16 rounded-2xl flex items-center justify-center mb-4 glass">
        <Icon className="size-7 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
