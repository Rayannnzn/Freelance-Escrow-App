'use client';

import { use } from 'react';
import { useEscrowDetail } from '@/hooks/useEscrowDetail';
import { useSubmitWork, useApproveWork, useClaimTimeout } from '@/hooks/useEscrowActions';
import { useWallet } from '@solana/wallet-adapter-react';
import { EscrowProgress } from '@/components/escrow/EscrowProgress';
import { CountdownTimer } from '@/components/escrow/CountdownTimer';
import { ConnectWalletPrompt } from '@/components/web3/ConnectWalletPrompt';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatSol, formatUsd } from '@/lib/format';
import { truncatePubkey } from '@/lib/solana/utils';
import { getExplorerAddressUrl } from '@/lib/solana/explorer';
import { PROGRAM_ID } from '@/lib/solana/program';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Shield,
  User,
  ExternalLink,
  Loader2,
  Copy,
  Lock,
  Send,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface EscrowDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function EscrowDetailPage({ params }: EscrowDetailPageProps) {
  const { id: pdaAddress } = use(params);
  const { publicKey, connected } = useWallet();
  const { data: escrow, isLoading, error } = useEscrowDetail(pdaAddress);

  const submitWork = useSubmitWork();
  const approveWork = useApproveWork();
  const claimTimeout = useClaimTimeout();

  if (!connected) return <ConnectWalletPrompt />;

  if (isLoading) {
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

  if (!escrow) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="cyber-card p-10 max-w-md text-center space-y-4">
          <AlertTriangle className="size-12 text-[#ff4a6b] mx-auto" />
          <h2 className="text-xl font-bold text-foreground">Escrow Not Found</h2>
          <p className="text-sm text-muted-foreground">
            This PDA address doesn&apos;t contain a valid escrow account.
          </p>
          <Link href="/escrow">
            <Button variant="outline" className="border-white/[0.12]">
              <ArrowLeft data-icon="inline-start" className="size-3.5" />
              Back to Escrows
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const walletAddress = publicKey?.toBase58() || '';
  const isClient = walletAddress === escrow.client;
  const isFreelancer = walletAddress === escrow.freelancer;

  // Determine lifecycle step for progress bar
  const currentStep = escrow.approved
    ? 'released'
    : escrow.workSubmitted
    ? 'submitted'
    : 'initialized';

  const handleSubmitWork = () => {
    submitWork.mutate({
      clientAddress: escrow.client,
      pdaAddress: escrow.pdaAddress,
    });
  };

  const handleApproveWork = () => {
    approveWork.mutate({
      freelancerAddress: escrow.freelancer,
      pdaAddress: escrow.pdaAddress,
    });
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
              <h1 className="text-2xl font-bold text-foreground">Escrow Contract</h1>
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

          {/* Role badge */}
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
        {/* Amount Locked */}
        <div className="cyber-card p-5 cyber-card-active">
          <div className="label-caps mb-2">Amount Locked</div>
          <div className="text-3xl font-bold text-foreground mb-1">
            {formatSol(escrow.amountSol)}
          </div>
          <div className="text-sm text-muted-foreground">≈ {formatUsd(escrow.amountSol)}</div>
        </div>

        {/* Timeout Countdown */}
        <div className="cyber-card p-5">
          <div className="label-caps mb-3">Timeout Countdown</div>
          <CountdownTimer targetDate={escrow.timeoutAt.toISOString()} />
        </div>

        {/* Parties */}
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
          dates={{
            initialized: escrow.createdAt.toISOString(),
          }}
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
            value="pda"
            className="data-[state=active]:bg-[rgba(57,255,20,0.1)] data-[state=active]:text-[#39ff14] rounded-lg"
          >
            PDA Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="controls">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Actions */}
            <div className="cyber-card p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="size-4 text-[#39ff14]" />
                <h3 className="text-sm font-semibold text-foreground">Contract Actions</h3>
              </div>

              <div className="space-y-3">
                {/* Submit Work — freelancer only, when not yet submitted */}
                {isFreelancer && !escrow.workSubmitted && (
                  <Button
                    className="w-full bg-[#39ff14] text-[#053900] hover:bg-[#2ae500] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] font-semibold"
                    onClick={handleSubmitWork}
                    disabled={isMutating}
                  >
                    {submitWork.isPending ? (
                      <><Loader2 data-icon="inline-start" className="size-4 animate-spin" /> Submitting...</>
                    ) : (
                      <><Send data-icon="inline-start" className="size-4" /> Submit Work</>
                    )}
                  </Button>
                )}

                {/* Approve — client only, when work is submitted */}
                {isClient && escrow.workSubmitted && !escrow.approved && (
                  <Button
                    className="w-full bg-[#39ff14] text-[#053900] hover:bg-[#2ae500] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] font-semibold"
                    onClick={handleApproveWork}
                    disabled={isMutating}
                  >
                    {approveWork.isPending ? (
                      <><Loader2 data-icon="inline-start" className="size-4 animate-spin" /> Approving...</>
                    ) : (
                      <><CheckCircle2 data-icon="inline-start" className="size-4" /> Approve &amp; Release Funds</>
                    )}
                  </Button>
                )}

                {/* Claim Timeout — freelancer, when timeout reached */}
                {isFreelancer && escrow.status === 'timeout_claimable' && !escrow.approved && (
                  <Button
                    variant="outline"
                    className="w-full border-[rgba(255,74,107,0.3)] text-[#ff4a6b] hover:bg-[rgba(255,74,107,0.08)]"
                    onClick={handleClaimTimeout}
                    disabled={isMutating}
                  >
                    {claimTimeout.isPending ? (
                      <><Loader2 data-icon="inline-start" className="size-4 animate-spin" /> Claiming...</>
                    ) : (
                      <><Clock data-icon="inline-start" className="size-4" /> Claim Timeout Refund</>
                    )}
                  </Button>
                )}

                {/* Status messages */}
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

            {/* Info panel */}
            <div className="cyber-card p-6 border-[rgba(153,69,255,0.2)]">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                How this escrow works
              </h3>
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

        <TabsContent value="pda">
          <div className="space-y-4">
            {/* PDA Details Card */}
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
                    <button
                      onClick={() => copyToClipboard(escrow.pdaAddress, 'PDA address')}
                      className="text-muted-foreground hover:text-[#39ff14] transition-colors"
                    >
                      <Copy className="size-3" />
                    </button>
                    <a
                      href={getExplorerAddressUrl(escrow.pdaAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-[#00eefc] transition-colors"
                    >
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
