'use client';

import { useState } from 'react';
import { EscrowCard } from '@/components/escrow/EscrowCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ConnectWalletPrompt } from '@/components/web3/ConnectWalletPrompt';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useEnrichedEscrows } from '@/hooks/useEnrichedEscrows';
import { useWallet } from '@solana/wallet-adapter-react';
import type { OnChainEscrowStatus } from '@/lib/solana/types';

const FILTER_TABS: { label: string; value: OnChainEscrowStatus | 'all' }[] = [
  { label: 'All',        value: 'all' },
  { label: 'Active',     value: 'initialized' },
  { label: 'Submitted',  value: 'submitted' },
  { label: 'Completed',  value: 'completed' },
  { label: 'Timeout',    value: 'timeout_claimable' },
];

export default function EscrowPage() {
  const { connected } = useWallet();
  const { data: escrows, isLoading } = useEnrichedEscrows();
  const [filter, setFilter] = useState<OnChainEscrowStatus | 'all'>('all');

  if (!connected) {
    return <ConnectWalletPrompt />;
  }

  const filtered = escrows.filter((e) =>
    filter === 'all' ? true : e.status === filter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Escrow Contracts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {escrows.length} contracts · {escrows.filter((e) => e.status === 'initialized').length} active
          </p>
        </div>
        <Link href="/create-escrow">
          <Button className="bg-[#39ff14] text-[#053900] hover:bg-[#2ae500] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] font-semibold">
            <Plus data-icon="inline-start" className="size-4" />
            New Escrow
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 glass rounded-xl p-1 w-fit">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150',
              filter === tab.value
                ? 'bg-[rgba(57,255,20,0.15)] text-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.1)]'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
            <span className="ml-1.5 label-caps text-[10px]">
              ({tab.value === 'all'
                ? escrows.length
                : escrows.filter((e) => e.status === tab.value).length})
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <LoadingSkeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((escrow) => (
            <EscrowCard key={escrow.pdaAddress} escrow={escrow} metadata={escrow.metadata} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No contracts found"
          description={`No ${filter === 'all' ? '' : filter} escrow contracts. Create your first one to get started.`}
          action={
            <Link href="/create-escrow">
              <Button className="bg-[#39ff14] text-[#053900] hover:bg-[#2ae500] font-semibold">
                <Plus data-icon="inline-start" className="size-4" />
                Create Escrow
              </Button>
            </Link>
          }
        />
      )}
    </div>
  );
}
