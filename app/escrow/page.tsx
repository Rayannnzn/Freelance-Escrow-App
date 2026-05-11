'use client';

import { useState } from 'react';
import { MOCK_ESCROWS } from '@/constants/mock-data';
import { EscrowCard } from '@/components/escrow/EscrowCard';
import { EscrowStatus } from '@/types/escrow.types';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const FILTER_TABS: { label: string; value: EscrowStatus | 'all' }[] = [
  { label: 'All',       value: 'all' },
  { label: 'Active',    value: 'active' },
  { label: 'Pending',   value: 'pending' },
  { label: 'Completed', value: 'completed' },
  { label: 'Disputed',  value: 'disputed' },
];

export default function EscrowPage() {
  const [filter, setFilter] = useState<EscrowStatus | 'all'>('all');

  const filtered = MOCK_ESCROWS.filter((e) =>
    filter === 'all' ? true : e.status === filter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Escrow Contracts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {MOCK_ESCROWS.length} contracts · {MOCK_ESCROWS.filter((e) => e.status === 'active').length} active
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
                ? MOCK_ESCROWS.length
                : MOCK_ESCROWS.filter((e) => e.status === tab.value).length})
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((escrow) => (
            <EscrowCard key={escrow.id} escrow={escrow} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No contracts found"
          description={`No ${filter} escrow contracts. Create your first one to get started.`}
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
