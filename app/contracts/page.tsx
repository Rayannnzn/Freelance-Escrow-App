'use client';

import { MOCK_ESCROWS } from '@/constants/mock-data';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AddressDisplay } from '@/components/common/AddressDisplay';
import { formatSol } from '@/lib/format';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';


export default function ContractsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Smart Contracts</h1>

      <div className="cyber-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/[0.06] hover:bg-transparent">
              <TableHead className="label-caps text-muted-foreground">Contract</TableHead>
              <TableHead className="label-caps text-muted-foreground">PDA Address</TableHead>
              <TableHead className="label-caps text-muted-foreground">Amount</TableHead>
              <TableHead className="label-caps text-muted-foreground">Status</TableHead>
              <TableHead className="label-caps text-muted-foreground">Network</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_ESCROWS.map((e) => (
              <TableRow key={e.id} className="border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <TableCell>
                  <div className="text-sm font-medium text-foreground">{e.title}</div>
                  <div className="label-caps text-[10px] mt-0.5">{e.contractId}</div>
                </TableCell>
                <TableCell>
                  <AddressDisplay address={e.pdaAddress} chars={6} showCopy showExplorer />
                </TableCell>
                <TableCell>
                  <span className="text-sm font-bold text-[#39ff14]">{formatSol(e.totalAmount)}</span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={e.status} />
                </TableCell>
                <TableCell>
                  <span className="label-caps text-[#00eefc]">{e.network}</span>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/escrow/${e.id}`}
                    className="text-muted-foreground hover:text-[#39ff14] transition-colors"
                    aria-label="View contract details"
                  >
                    <ExternalLink className="size-3.5" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
