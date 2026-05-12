'use client';

import { use, useState, useCallback } from 'react';
import { useEscrowDetailState } from '@/hooks/useEscrowDetail';
import { useSubmitWork, useApproveWork, useClaimTimeout } from '@/hooks/useEscrowActions';
import { useProjectByPda, useSyncEscrowStatus } from '@/hooks/useProjectMetadata';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQueryClient } from '@tanstack/react-query';
import { EscrowProgress } from '@/components/escrow/EscrowProgress';
import { CountdownTimer } from '@/components/escrow/CountdownTimer';
import { EscrowCompletedView } from '@/components/escrow/EscrowCompletedView';
import { EscrowSuccessModal, type EscrowCompletionData } from '@/components/escrow/EscrowSuccessModal';
import { DeliverableLinks } from '@/components/escrow/DeliverableLinks';
import { ConnectWalletPrompt } from '@/components/web3/ConnectWalletPrompt';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatSol, formatUsd } from '@/lib/format';
import { truncatePubkey } from '@/lib/solana/utils';
import { getExplorerAddressUrl, getExplorerTxUrl } from '@/lib/solana/explorer';
import { PROGRAM_ID } from '@/lib/solana/program';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Shield,
  User,
  ExternalLink,
  Loader2,
  Copy,
  Lock,
  Send,
  Clock,
  Wifi,
  FileText,
} from 'lucide-react';

interface EscrowDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EscrowDetailPage({ params }: EscrowDetailPageProps) {
  const { id: pdaAddress } = use(params);
  const { publicKey, connected } = useWallet();
  const queryClient = useQueryClient();

  // Discriminated union — 5 possible states
  const state = useEscrowDetailState(pdaAddress);

  // Off-chain Supabase metadata (non-blocking — null if not yet created)
  const { data: metadata } = useProjectByPda(pdaAddress);

  const submitWork = useSubmitWork();
  const approveWork = useApproveWork();
  const claimTimeout = useClaimTimeout();
  const syncStatus = useSyncEscrowStatus(pdaAddress);

  // Modal state — shown immediately after approveWork succeeds
  const [completionData, setCompletionData] = useState<EscrowCompletionData | null>(null);

  const closeModal = useCallback(() => setCompletionData(null), []);

  if (!connected) return <ConnectWalletPrompt />;

  // ─── Loading ────────────────────────────────────────────────────────────────
  if (state.kind === 'loading') {
    return (
      <div className="space-y-6">
        <LoadingSkeleton className="h-8 w-48 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LoadingSkeleton className="h-32 rounded-2xl" />
          <LoadingSkeleton className="h-32 rounded-2xl" />
          <LoadingSkeleton className="h-32 rounded-2xl" />
        </div>
        <LoadingSkeleton className="h-24 rounded-2xl" />
      </div>
    );
  }

  // ─── Network / parse error ────────────────────────────────────────────────
  if (state.kind === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="cyber-card p-10 max-w-md text-center space-y-4">
          <AlertOctagon className="size-12 text-[#ffb14a] mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Network Error</h2>
          <p className="text-sm text-muted-foreground">
            Could not fetch this escrow. Check your connection and try again.
          </p>
          <p className="text-xs font-mono text-[rgba(255,177,74,0.7)] bg-[rgba(255,177,74,0.05)] rounded p-2">
            {state.error.message}
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              className="border-white/[0.12]"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['escrow-detail', pdaAddress] })}
            >
              <Wifi className="size-3.5 mr-1.5" /> Retry
            </Button>
            <Link href="/escrow">
              <Button variant="outline" className="border-white/[0.12]">
                <ArrowLeft className="size-3.5 mr-1.5" /> Back
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Completed (PDA closed, cache hit) ───────────────────────────────────
  if (state.kind === 'completed') {
    const walletAddr = publicKey?.toBase58() || '';
    return (
      <>
        <EscrowSuccessModal data={completionData} onClose={closeModal} />
        <EscrowCompletedView
          record={state.record}
          isClient={walletAddr === state.record.client}
          isFreelancer={walletAddr === state.record.freelancer}
        />
      </>
    );
  }

  // ─── Truly not found (invalid PDA, never existed) ────────────────────────
  if (state.kind === 'not_found') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="cyber-card p-10 max-w-md text-center space-y-4">
          <AlertTriangle className="size-12 text-[#ff4a6b] mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Escrow Not Found</h2>
          <p className="text-sm text-muted-foreground">
            This address doesn&apos;t contain an active escrow account and has no recorded completion history.
          </p>
          <p className="text-xs font-mono text-[rgba(255,74,107,0.7)] bg-[rgba(255,74,107,0.05)] rounded p-2 break-all">
            {pdaAddress}
          </p>
          <Link href="/escrow">
            <Button variant="outline" className="border-white/[0.12]">
              <ArrowLeft className="size-3.5 mr-1.5" />
              Back to Escrows
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ─── Live escrow ─────────────────────────────────────────────────────────
  const escrow = state.data;
  const walletAddress = publicKey?.toBase58() || '';
  const isClient = walletAddress === escrow.client;
  const isFreelancer = walletAddress === escrow.freelancer;

  const currentStep = escrow.approved
    ? 'released'
    : escrow.workSubmitted
    ? 'submitted'
    : 'initialized';

  const handleSubmitWork = () => {
    submitWork.mutate(
      {
        clientAddress: escrow.client,
        pdaAddress: escrow.pdaAddress,
      },
      {
        onSuccess: () => {
          // Sync status to Supabase (non-blocking)
          syncStatus.mutate({ status: 'submitted' });
        },
      }
    );
  };

  const handleApproveWork = () => {
    approveWork.mutate(
      {
        freelancerAddress: escrow.freelancer,
        pdaAddress: escrow.pdaAddress,
        // Snapshot current escrow state so it can be persisted after PDA closes
        snapshot: {
          client: escrow.client,
          freelancer: escrow.freelancer,
          amountSol: escrow.amountSol,
        },
      },
      {
        onSuccess: (data) => {
          // Invalidate queries AFTER cache is written (mutation writes first)
          queryClient.invalidateQueries({ queryKey: ['escrows'] });
          queryClient.invalidateQueries({ queryKey: ['escrow-detail', pdaAddress] });
          queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });

          // Sync status to Supabase
          syncStatus.mutate({ status: 'completed', completed_at: data.completedAt });

          // Show the animated success modal immediately
          setCompletionData({
            signature: data.signature,
            pdaAddress: data.pdaAddress,
            client: data.client,
            freelancer: data.freelancer,
            amountSol: data.amountSol,
            completedAt: data.completedAt,
          });

          toast.success('Escrow completed! Funds released.', {
            description: 'SOL has been transferred to the freelancer.',
            action: {
              label: 'View TX',
              onClick: () => window.open(getExplorerTxUrl(data.signature), '_blank'),
            },
            duration: 8000,
          });
        },
      }
    );
  };

  const handleClaimTimeout = () => {
    claimTimeout.mutate({
      clientAddress: escrow.client,
      pdaAddress: escrow.pdaAddress,
    });
  };

  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  const isMutating = submitWork.isPending || approveWork.isPending || claimTimeout.isPending;

  return (
    <>
      {/* Success modal — shown immediately after approval, before PDA query refreshes */}
      <EscrowSuccessModal data={completionData} onClose={closeModal} />

      <div className="space-y-6">
        {/* Back + Header */}
        <div>
          <Link
            href="/escrow"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 w-fit"
          >
            <ArrowLeft className="size-3.5" />
            Back to Escrows
          </Link>

          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-1 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">
                  {metadata?.project_name ?? 'Escrow Contract'}
                </h1>
                <span
                  className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold"
                  style={{
                    color: escrow.status === 'completed' ? '#79ff5b'
                      : escrow.status === 'submitted' ? '#ffb14a'
                      : escrow.status === 'timeout_claimable' ? '#ff4a6b'
                      : '#39ff14',
                    backgroundColor: escrow.status === 'completed' ? 'rgba(121,255,91,0.12)'
                      : escrow.status === 'submitted' ? 'rgba(255,177,74,0.12)'
                      : escrow.status === 'timeout_claimable' ? 'rgba(255,74,107,0.12)'
                      : 'rgba(57,255,20,0.12)',
                  }}
                >
                  {escrow.status === 'initialized' ? 'Active'
                    : escrow.status === 'submitted' ? 'Work Submitted'
                    : escrow.status === 'completed' ? 'Completed'
                    : 'Timeout Claimable'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="label-caps">{truncatePubkey(escrow.pdaAddress, 6)}</span>
                <span>·</span>
                <a
                  href={getExplorerAddressUrl(escrow.pdaAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[#00eefc] transition-colors"
                >
                  View on Explorer <ExternalLink className="size-3" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isClient && (
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-[rgba(0,238,252,0.12)] text-[#00eefc] border border-[rgba(0,238,252,0.2)]">
                  You are the Client
                </span>
              )}
              {isFreelancer && (
                <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-[rgba(57,255,20,0.12)] text-[#39ff14] border border-[rgba(57,255,20,0.2)]">
                  You are the Freelancer
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Top Grid: Amount + Timer + Parties */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="cyber-card p-5 cyber-card-active">
            <div className="label-caps mb-2">Amount Locked</div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {formatSol(escrow.amountSol)}
            </div>
            <div className="text-sm text-muted-foreground">≈ {formatUsd(escrow.amountSol)}</div>
          </div>

          <div className="cyber-card p-5">
            <div className="label-caps mb-3">Timeout Countdown</div>
            <CountdownTimer targetDate={escrow.timeoutAt.toISOString()} />
          </div>

          <div className="cyber-card p-5 space-y-3">
            <div className="label-caps mb-1">Parties</div>

            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg glass flex items-center justify-center">
                <User className="size-4 text-[#00eefc]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-foreground">
                  {isClient ? 'You (Client)' : 'Client'}
                </div>
                <div className="hash-display text-[10px]">{truncatePubkey(escrow.client, 4)}</div>
              </div>
              <span className="label-caps text-[10px] text-[#00eefc]">Client</span>
            </div>

            <div className="h-px bg-white/[0.04]" />

            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg glass flex items-center justify-center">
                <User className="size-4 text-[#39ff14]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-foreground">
                  {isFreelancer ? 'You (Freelancer)' : 'Freelancer'}
                </div>
                <div className="hash-display text-[10px]">{truncatePubkey(escrow.freelancer, 4)}</div>
              </div>
              <span className="label-caps text-[10px] text-[#39ff14]">Freelancer</span>
            </div>
          </div>
        </div>

        {/* Progress Lifecycle */}
        <div className="cyber-card p-6">
          <h2 className="text-sm font-semibold text-foreground mb-6">Escrow Progress Lifecycle</h2>
          <EscrowProgress
            currentStep={currentStep as 'initialized' | 'submitted' | 'approved' | 'released'}
            dates={{ initialized: escrow.createdAt.toISOString() }}
          />
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="controls" className="space-y-4">
          <TabsList className="glass rounded-xl p-1 h-auto gap-1">
            <TabsTrigger
              value="controls"
              className="data-[state=active]:bg-[rgba(57,255,20,0.1)] data-[state=active]:text-[#39ff14] rounded-lg"
            >
              Contract Actions
            </TabsTrigger>
            <TabsTrigger
              value="deliverables"
              className="data-[state=active]:bg-[rgba(57,255,20,0.1)] data-[state=active]:text-[#39ff14] rounded-lg"
            >
              <FileText className="size-3.5 mr-1.5" />
              Deliverables
            </TabsTrigger>
            <TabsTrigger
              value="pda"
              className="data-[state=active]:bg-[rgba(57,255,20,0.1)] data-[state=active]:text-[#39ff14] rounded-lg"
            >
              PDA Details
            </TabsTrigger>
          </TabsList>

          <TabsContent value="controls">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="cyber-card p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="size-4 text-[#39ff14]" />
                  <h3 className="text-sm font-semibold text-foreground">Contract Actions</h3>
                </div>

                <div className="space-y-3">
                  {isFreelancer && !escrow.workSubmitted && (
                    <Button
                      className="w-full bg-[#39ff14] text-[#053900] hover:bg-[#2ae500] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] font-semibold"
                      onClick={handleSubmitWork}
                      disabled={isMutating}
                    >
                      {submitWork.isPending ? (
                        <><Loader2 className="size-4 animate-spin mr-1.5" /> Submitting...</>
                      ) : (
                        <><Send className="size-4 mr-1.5" /> Submit Work</>
                      )}
                    </Button>
                  )}

                  {isClient && escrow.workSubmitted && !escrow.approved && (
                    <Button
                      className="w-full bg-[#39ff14] text-[#053900] hover:bg-[#2ae500] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] font-semibold"
                      onClick={handleApproveWork}
                      disabled={isMutating}
                    >
                      {approveWork.isPending ? (
                        <><Loader2 className="size-4 animate-spin mr-1.5" /> Approving & Releasing...</>
                      ) : (
                        <><CheckCircle2 className="size-4 mr-1.5" /> Approve &amp; Release Funds</>
                      )}
                    </Button>
                  )}

                  {isFreelancer && escrow.status === 'timeout_claimable' && !escrow.approved && (
                    <Button
                      variant="outline"
                      className="w-full border-[rgba(255,74,107,0.3)] text-[#ff4a6b] hover:bg-[rgba(255,74,107,0.08)]"
                      onClick={handleClaimTimeout}
                      disabled={isMutating}
                    >
                      {claimTimeout.isPending ? (
                        <><Loader2 className="size-4 animate-spin mr-1.5" /> Claiming...</>
                      ) : (
                        <><Clock className="size-4 mr-1.5" /> Claim Timeout Refund</>
                      )}
                    </Button>
                  )}

                  {escrow.approved && (
                    <div className="glass rounded-xl p-4 border border-[rgba(121,255,91,0.2)]">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-[#79ff5b]" />
                        <span className="text-sm font-medium text-[#79ff5b]">Contract Complete</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Funds have been released to the freelancer.
                      </p>
                    </div>
                  )}

                  {isClient && escrow.status === 'initialized' && (
                    <div className="glass rounded-xl p-4 border border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <Loader2 className="size-3.5 text-[#ffb14a] animate-spin" />
                        <span className="text-xs text-muted-foreground">
                          Waiting for the freelancer to submit work.
                        </span>
                      </div>
                    </div>
                  )}

                  {isFreelancer && escrow.workSubmitted && !escrow.approved && (
                    <div className="glass rounded-xl p-4 border border-[rgba(255,177,74,0.2)]">
                      <div className="flex items-center gap-2">
                        <Clock className="size-3.5 text-[#ffb14a]" />
                        <span className="text-xs text-muted-foreground">
                          Work submitted. Waiting for client approval.
                        </span>
                      </div>
                    </div>
                  )}

                  {!isClient && !isFreelancer && (
                    <div className="glass rounded-xl p-4 border border-white/[0.06]">
                      <p className="text-xs text-muted-foreground text-center">
                        You are not a participant in this escrow.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="cyber-card p-6 border-[rgba(153,69,255,0.2)]">
                <h3 className="text-sm font-semibold text-foreground mb-2">How this escrow works</h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Funds are locked in a Program Derived Address (PDA). The freelancer submits
                  work, the client approves, and SOL is automatically released. If the timeout
                  is reached without approval, the client can claim their funds back.
                </p>
                <div className="mt-4 pt-4 border-t border-white/[0.04]">
                  <div className="flex items-start gap-2">
                    <Shield className="size-3.5 text-[#39ff14] mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Secured by the Solana blockchain — all transactions are verifiable on-chain.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="deliverables">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DeliverableLinks
                pdaAddress={pdaAddress}
                metadata={metadata ?? null}
                isFreelancer={isFreelancer}
              />

              {/* Project info panel */}
              {metadata && (
                <div
                  className="rounded-2xl p-5 space-y-4"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[rgba(255,255,255,0.35)]">
                    Project Info
                  </h3>
                  <div>
                    <div className="label-caps mb-1 text-[#00eefc]">Project Name</div>
                    <div className="text-sm font-semibold text-foreground">{metadata.project_name}</div>
                  </div>
                  {metadata.project_description && (
                    <div>
                      <div className="label-caps mb-1">Description</div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {metadata.project_description}
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/[0.05]">
                    <div>
                      <div className="label-caps mb-1">Amount</div>
                      <div className="text-sm font-bold text-[#39ff14]">{metadata.amount_sol} SOL</div>
                    </div>
                    <div>
                      <div className="label-caps mb-1">Timeout</div>
                      <div className="text-sm font-medium text-foreground">{metadata.timeout_days} days</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pda">
            <div className="glass rounded-2xl p-5 border border-[rgba(57,255,20,0.15)]">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="size-4 text-[#39ff14]" />
                <h3 className="text-sm font-semibold text-foreground">On-Chain Account Data</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="label-caps mb-1">PDA Address</div>
                  <div className="flex items-center gap-2">
                    <span className="hash-display flex-1 truncate text-xs">{escrow.pdaAddress}</span>
                    <button onClick={() => copyToClipboard(escrow.pdaAddress, 'PDA address')} className="text-muted-foreground hover:text-[#39ff14] transition-colors">
                      <Copy className="size-3" />
                    </button>
                    <a href={getExplorerAddressUrl(escrow.pdaAddress)} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#00eefc] transition-colors">
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                </div>

                <div>
                  <div className="label-caps mb-1">Program ID</div>
                  <span className="hash-display text-xs">{PROGRAM_ID.toBase58()}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.04]">
                  <div>
                    <div className="label-caps mb-1">Amount (Lamports)</div>
                    <span className="text-xs text-foreground font-mono">
                      {(escrow.amountSol * 1e9).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <div className="label-caps mb-1">Bump Seed</div>
                    <span className="text-xs text-foreground font-mono">{escrow.bump}</span>
                  </div>
                  <div>
                    <div className="label-caps mb-1">Work Submitted</div>
                    <span className={`text-xs font-medium ${escrow.workSubmitted ? 'text-[#39ff14]' : 'text-muted-foreground'}`}>
                      {escrow.workSubmitted ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <div className="label-caps mb-1">Approved</div>
                    <span className={`text-xs font-medium ${escrow.approved ? 'text-[#39ff14]' : 'text-muted-foreground'}`}>
                      {escrow.approved ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/[0.04]">
                  <Lock className="size-3 text-[#39ff14]" />
                  <span className="text-xs text-muted-foreground">
                    Escrow secured by Solana Anchor on-chain program.
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
