'use client';

import { cn } from '@/lib/utils';
import { truncateAddress } from '@/lib/format';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface AddressDisplayProps {
  address: string;
  chars?: number;
  showCopy?: boolean;
  showExplorer?: boolean;
  className?: string;
}

export function AddressDisplay({
  address,
  chars = 4,
  showCopy = true,
  showExplorer = false,
  className,
}: AddressDisplayProps) {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    toast.success('Address copied to clipboard');
  };

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="hash-display">{truncateAddress(address, chars)}</span>
      {showCopy && (
        <button
          onClick={handleCopy}
          aria-label="Copy address"
          className="text-muted-foreground hover:text-neon transition-colors"
        >
          <Copy className="size-3" />
        </button>
      )}
      {showExplorer && (
        <a
          href={`https://explorer.solana.com/address/${address}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View on explorer"
          className="text-muted-foreground hover:text-cyber-blue transition-colors"
        >
          <ExternalLink className="size-3" />
        </a>
      )}
    </span>
  );
}
