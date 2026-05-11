'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { MOCK_ESCROWS } from '@/constants/mock-data';
import { EscrowProgress } from '@/components/escrow/EscrowProgress';
import { MilestoneList } from '@/components/escrow/MilestoneList';
import { CountdownTimer } from '@/components/escrow/CountdownTimer';
import { PDADetails } from '@/components/escrow/PDADetails';
import { StatusBadge } from '@/components/common/StatusBadge';
import { AddressDisplay } from '@/components/common/AddressDisplay';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatSol, formatUsd } from '@/lib/format';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Shield,
  User,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EscrowDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EscrowDetailPage({ params }: EscrowDetailPageProps) {
  const { id } = use(params);
  const escrow = MOCK_ESCROWS.find((e) => e.id === id);

  if (!escrow) notFound();

  // Determine current lifecycle step
  const hasSubmitted = escrow.milestones.some((m) => ['submitted', 'approved', 'released'].includes(m.status));
  const hasApproved = escrow.milestones.some((m) => m.status === 'approved');
  const allReleased = escrow.milestones.every((m) => m.status === 'released');

  const currentStep = allReleased
    ? 'released'
    : hasApproved
    ? 'approved'
    : hasSubmitted
    ? 'submitted'
    : 'initialized';

  const handleApprove = async (milestoneId: string) => {
    toast.success('Milestone approved', { description: 'Funds will be released shortly.' });
  };

  const handleDispute = () => {
    toast.error('Dispute raised', { description: 'An arbitrator will review your case.' });
  };

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div>
        <Link
          href="/escrow"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 w-fit"
        >
          <ArrowLeft className="size-3.5" />
          Back to Escrow
        </Link>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 mb-1 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{escrow.title}</h1>
              <StatusBadge status={escrow.status} />
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="label-caps">{escrow.contractId}</span>
              <span>·</span>
              <a
                href={`https://explorer.solana.com/address/${escrow.pdaAddress}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-[#00eefc] transition-colors"
              >
                View on Explorer <ExternalLink className="size-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {escrow.status !== 'completed' && escrow.status !== 'disputed' && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDispute}
                className="border-[rgba(255,74,107,0.3)] text-[#ff4a6b] hover:bg-[rgba(255,74,107,0.08)]"
              >
                <AlertTriangle data-icon="inline-start" className="size-3.5" />
                Raise Dispute
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Top Grid: Amount + Timer + Parties */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Amount Locked */}
        <div className="cyber-card p-5 cyber-card-active">
          <div className="label-caps mb-2">Amount Locked</div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {formatSol(escrow.lockedAmount)}
          </div>
          <div className="text-sm text-muted-foreground">≈ {formatUsd(escrow.lockedAmount)}</div>
        </div>

        {/* Timeout Countdown */}
        <div className="cyber-card p-5">
          <div className="label-caps mb-3">Timeout Countdown</div>
          <CountdownTimer targetDate={escrow.timeoutDate} />
        </div>

        {/* Parties */}
        <div className="cyber-card p-5 space-y-3">
          <div className="label-caps mb-1">Parties</div>

          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg glass flex items-center justify-center">
              <User className="size-4 text-[#00eefc]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-foreground">{escrow.client.displayName}</div>
              <AddressDisplay address={escrow.client.address} chars={4} />
            </div>
            <span className="label-caps text-[10px] text-[#00eefc]">Client</span>
          </div>

          <div className="h-px bg-white/[0.04]" />

          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg glass flex items-center justify-center">
              <User className="size-4 text-[#39ff14]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-foreground">{escrow.freelancer.displayName}</div>
              <AddressDisplay address={escrow.freelancer.address} chars={4} />
            </div>
            <span className="label-caps text-[10px] text-[#39ff14]">Freelancer</span>
          </div>
        </div>
      </div>

      {/* Progress Lifecycle */}
      <div className="cyber-card p-6">
        <h2 className="text-sm font-semibold text-foreground mb-6">Escrow Progress Lifecycle</h2>
        <EscrowProgress
          currentStep={currentStep}
          dates={{
            initialized: escrow.createdAt,
            submitted: escrow.milestones.find((m) =>
              ['submitted', 'approved', 'released'].includes(m.status)
            )?.submittedAt,
          }}
        />
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="milestones" className="space-y-4">
        <TabsList className="glass rounded-xl p-1 h-auto gap-1">
          <TabsTrigger
            value="milestones"
            className="data-[state=active]:bg-[rgba(57,255,20,0.1)] data-[state=active]:text-[#39ff14] rounded-lg"
          >
            Milestones
          </TabsTrigger>
          <TabsTrigger
            value="pda"
            className="data-[state=active]:bg-[rgba(57,255,20,0.1)] data-[state=active]:text-[#39ff14] rounded-lg"
          >
            PDA & Audit Log
          </TabsTrigger>
          <TabsTrigger
            value="controls"
            className="data-[state=active]:bg-[rgba(57,255,20,0.1)] data-[state=active]:text-[#39ff14] rounded-lg"
          >
            Contract Controls
          </TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-4">
          <MilestoneList
            milestones={escrow.milestones}
            onApprove={handleApprove}
            isClient
          />
        </TabsContent>

        <TabsContent value="pda">
          <PDADetails
            pdaAddress={escrow.pdaAddress}
            programId={escrow.programId}
            auditLog={escrow.auditLog}
          />
        </TabsContent>

        <TabsContent value="controls">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Control Actions */}
            <div className="cyber-card p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="size-4 text-[#39ff14]" />
                <h3 className="text-sm font-semibold text-foreground">Contract Controls</h3>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full bg-[#39ff14] text-[#053900] hover:bg-[#2ae500] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] font-semibold"
                  disabled={escrow.status === 'completed'}
                >
                  <CheckCircle2 data-icon="inline-start" className="size-4" />
                  Approve & Release Funds
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-[rgba(0,238,252,0.3)] text-[#00eefc] hover:bg-[rgba(0,238,252,0.08)]"
                >
                  Request Work Submission
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-[rgba(255,74,107,0.3)] text-[#ff4a6b] hover:bg-[rgba(255,74,107,0.08)]"
                  onClick={handleDispute}
                  disabled={escrow.status === 'disputed'}
                >
                  <AlertTriangle data-icon="inline-start" className="size-4" />
                  Raise Dispute
                </Button>
              </div>
            </div>

            {/* Support */}
            <div className="cyber-card p-6 border-[rgba(153,69,255,0.2)]">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Need help with this contract?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                Our specialized arbitrators are ready to review your proof of work.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-[rgba(153,69,255,0.3)] text-[#9945ff] hover:bg-[rgba(153,69,255,0.08)]"
              >
                Contact Arbitrator
              </Button>

              <div className="mt-4 pt-4 border-t border-white/[0.04]">
                <div className="flex items-start gap-2">
                  <Shield className="size-3.5 text-[#39ff14] mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    End-to-End Escrow Encryption — Your funds and intellectual property are
                    protected by multi-signature validation and automated timeout resolution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
