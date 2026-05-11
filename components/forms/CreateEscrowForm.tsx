'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInitializeEscrow } from '@/hooks/useEscrowActions';
import { ConnectWalletPrompt } from '@/components/web3/ConnectWalletPrompt';
import { isValidPublicKey, daysToUnixTimeout, truncatePubkey } from '@/lib/solana/utils';
import { getEscrowPDA, PROGRAM_ID } from '@/lib/solana/program';
import { PublicKey } from '@solana/web3.js';
import { toast } from 'sonner';
import { Loader2, Rocket, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NeonDot } from '@/components/common/NeonDot';

const STEPS = ['Contract Parameters', 'Review & Deploy'];

export function CreateEscrowForm() {
  const router = useRouter();
  const { publicKey, connected } = useWallet();
  const initializeEscrow = useInitializeEscrow();
  const [step, setStep] = useState(0);

  const [params, setParams] = useState({
    freelancerAddress: '',
    totalAmount: '',
    timeoutDays: '30',
  });

  // Validation
  const validFreelancer = params.freelancerAddress ? isValidPublicKey(params.freelancerAddress) : false;
  const validAmount = parseFloat(params.totalAmount) >= 0.01;
  const validTimeout = parseInt(params.timeoutDays) >= 1;
  const isStep1Valid = validFreelancer && validAmount && validTimeout;

  // PDA preview
  const pdaPreview = useMemo(() => {
    if (!publicKey || !validFreelancer) return null;
    try {
      const [pda] = getEscrowPDA(publicKey, new PublicKey(params.freelancerAddress));
      return pda.toBase58();
    } catch {
      return null;
    }
  }, [publicKey, params.freelancerAddress, validFreelancer]);

  const handleDeploy = async () => {
    if (!isStep1Valid || !publicKey) return;

    const amountSol = parseFloat(params.totalAmount);
    const timeoutAt = daysToUnixTimeout(parseInt(params.timeoutDays));

    initializeEscrow.mutate(
      {
        freelancerAddress: params.freelancerAddress,
        amountSol,
        timeoutAt,
      },
      {
        onSuccess: (data) => {
          router.push(`/escrow/${data.pdaAddress}`);
        },
      }
    );
  };

  if (!connected) {
    return (
      <ConnectWalletPrompt
        title="Connect Wallet to Create Escrow"
        description="You need a connected Solana wallet to create and fund an escrow contract."
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                'size-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                i < step && 'bg-[#39ff14] text-[#053900] shadow-[0_0_10px_rgba(57,255,20,0.4)]',
                i === step && 'border-2 border-[#39ff14] text-[#39ff14] shadow-[0_0_10px_rgba(57,255,20,0.2)]',
                i > step && 'border border-white/10 text-muted-foreground'
              )}
            >
              {i + 1}
            </div>
            <span
              className={cn(
                'text-sm font-medium',
                i === step ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <ChevronRight className="size-3.5 text-muted-foreground mx-1" />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        {/* Form Panel */}
        <div className="cyber-card p-8">
          {step === 0 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Escrow Parameters</h2>
                <p className="text-sm text-muted-foreground">
                  Configure your escrow contract to deploy on Solana Devnet.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label-caps block mb-1.5" htmlFor="freelancerAddress">
                    Freelancer Wallet Address
                  </label>
                  <Input
                    id="freelancerAddress"
                    value={params.freelancerAddress}
                    onChange={(e) => setParams({ ...params, freelancerAddress: e.target.value })}
                    placeholder="Enter Solana address (e.g. 7xAbCd...)"
                    className={cn(
                      'font-mono bg-white/[0.04] border-white/[0.08] focus:border-[rgba(57,255,20,0.4)]',
                      params.freelancerAddress && !validFreelancer && 'border-[rgba(255,74,107,0.5)]'
                    )}
                  />
                  {params.freelancerAddress && !validFreelancer && (
                    <p className="text-xs text-[#ff4a6b] mt-1 flex items-center gap-1">
                      <AlertCircle className="size-3" /> Invalid Solana address
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-caps block mb-1.5" htmlFor="totalAmount">
                      Amount (SOL)
                    </label>
                    <Input
                      id="totalAmount"
                      type="number"
                      value={params.totalAmount}
                      onChange={(e) => setParams({ ...params, totalAmount: e.target.value })}
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      className="bg-white/[0.04] border-white/[0.08] focus:border-[rgba(57,255,20,0.4)]"
                    />
                    {params.totalAmount && !validAmount && (
                      <p className="text-xs text-[#ff4a6b] mt-1">Min 0.01 SOL</p>
                    )}
                  </div>
                  <div>
                    <label className="label-caps block mb-1.5" htmlFor="timeoutDays">
                      Timeout (Days)
                    </label>
                    <Input
                      id="timeoutDays"
                      type="number"
                      value={params.timeoutDays}
                      onChange={(e) => setParams({ ...params, timeoutDays: e.target.value })}
                      placeholder="30"
                      min="1"
                      className="bg-white/[0.04] border-white/[0.08] focus:border-[rgba(57,255,20,0.4)]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5 animate-fade-up">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Review & Deploy</h2>
                <p className="text-sm text-muted-foreground">
                  Confirm your escrow parameters before deploying to Solana.
                </p>
              </div>

              <div className="glass rounded-2xl p-5 space-y-4 border border-[rgba(57,255,20,0.15)]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="label-caps mb-1">Amount</div>
                    <div className="text-sm font-bold text-[#39ff14]">{params.totalAmount || '0'} SOL</div>
                  </div>
                  <div>
                    <div className="label-caps mb-1">Timeout</div>
                    <div className="text-sm font-medium text-foreground">{params.timeoutDays} days</div>
                  </div>
                  <div className="col-span-2">
                    <div className="label-caps mb-1">Freelancer</div>
                    <div className="hash-display text-xs break-all">{params.freelancerAddress}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="label-caps mb-1">Client (You)</div>
                    <div className="hash-display text-xs break-all">{publicKey?.toBase58()}</div>
                  </div>
                  {pdaPreview && (
                    <div className="col-span-2 pt-2 border-t border-white/[0.04]">
                      <div className="label-caps mb-1 text-[#39ff14]">Escrow PDA (Vault)</div>
                      <div className="hash-display text-xs break-all">{pdaPreview}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="glass rounded-xl p-4 border border-[rgba(255,177,74,0.2)]">
                <div className="text-xs text-[#ffb14a] font-medium mb-1">⚡ Devnet Transaction</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This will send <strong className="text-foreground">{params.totalAmount} SOL</strong> from your wallet
                  to a Program Derived Address. Funds will be locked until the freelancer
                  submits work and you approve it, or until the timeout period is reached.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.04]">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="border-white/[0.12] hover:bg-white/[0.04]"
            >
              <ChevronLeft data-icon="inline-start" className="size-4" />
              Back
            </Button>

            {step < STEPS.length - 1 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={!isStep1Valid}
                className="bg-[#39ff14] text-[#053900] hover:bg-[#2ae500] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] font-semibold"
              >
                Continue
                <ChevronRight data-icon="inline-end" className="size-4" />
              </Button>
            ) : (
              <Button
                onClick={handleDeploy}
                disabled={initializeEscrow.isPending || !isStep1Valid}
                className="bg-[#39ff14] text-[#053900] hover:bg-[#2ae500] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] font-semibold min-w-[160px]"
              >
                {initializeEscrow.isPending ? (
                  <>
                    <Loader2 data-icon="inline-start" className="size-4 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket data-icon="inline-start" className="size-4" />
                    Deploy Escrow
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="space-y-4">
          <div className="cyber-card p-5 border-[rgba(57,255,20,0.15)]">
            <h3 className="text-sm font-semibold text-foreground mb-4">Contract Architecture</h3>

            <div className="space-y-3">
              <div className="flex flex-col items-center gap-2">
                <div className="glass rounded-xl p-3 w-full text-center border border-white/[0.08]">
                  <div className="label-caps text-[10px] mb-1">Program</div>
                  <div className="hash-display text-[11px]">{truncatePubkey(PROGRAM_ID.toBase58(), 6)}</div>
                </div>

                <div className="h-6 w-px bg-[rgba(57,255,20,0.3)]" />

                <div className="glass rounded-xl p-3 w-full text-center border border-[rgba(57,255,20,0.3)] shadow-[0_0_12px_rgba(57,255,20,0.1)]">
                  <div className="label-caps text-[10px] mb-1 text-[#39ff14]">PDA Vault</div>
                  <div className="text-xs text-muted-foreground">
                    {pdaPreview ? truncatePubkey(pdaPreview, 6) : 'Enter freelancer address...'}
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="h-6 w-px bg-white/[0.1] mx-6" />
                  <div className="h-6 w-px bg-white/[0.1] mx-6" />
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="glass rounded-xl p-3 text-center border border-white/[0.06]">
                    <div className="label-caps text-[10px] mb-1">Client</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {publicKey ? truncatePubkey(publicKey.toBase58(), 4) : 'You'}
                    </div>
                  </div>
                  <div className="glass rounded-xl p-3 text-center border border-white/[0.06]">
                    <div className="label-caps text-[10px] mb-1">Freelancer</div>
                    <div className="hash-display text-[10px] truncate">
                      {validFreelancer ? truncatePubkey(params.freelancerAddress, 4) : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="cyber-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Network Health</h3>
            <div className="flex items-center gap-2">
              <NeonDot />
              <span className="text-sm font-bold text-foreground">Devnet</span>
              <span className="label-caps text-[10px] text-[#39ff14]">Connected</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-lg p-2.5">
                <div className="label-caps text-[10px] mb-0.5">Auto-Refund</div>
                <div className="text-xs font-medium text-foreground">Timeout</div>
              </div>
              <div className="glass rounded-lg p-2.5">
                <div className="label-caps text-[10px] mb-0.5">Network</div>
                <div className="text-xs font-medium text-[#00eefc]">Devnet</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
