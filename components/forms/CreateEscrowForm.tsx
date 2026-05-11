'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { escrowService } from '@/services/escrow.service';
import { toast } from 'sonner';
import { Plus, Trash2, Loader2, Rocket, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NeonDot } from '@/components/common/NeonDot';

const STEPS = ['Contract Parameters', 'Milestone Setup', 'Review & Deploy'];

interface MilestoneField {
  title: string;
  description: string;
  amount: string;
  dueDate: string;
}

export function CreateEscrowForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [params, setParams] = useState({
    title: '',
    description: '',
    freelancerAddress: '',
    totalAmount: '',
    timeoutDays: '30',
  });

  const [milestones, setMilestones] = useState<MilestoneField[]>([
    { title: '', description: '', amount: '', dueDate: '' },
  ]);

  const addMilestone = () =>
    setMilestones((m) => [...m, { title: '', description: '', amount: '', dueDate: '' }]);

  const removeMilestone = (idx: number) =>
    setMilestones((m) => m.filter((_, i) => i !== idx));

  const updateMilestone = (idx: number, field: keyof MilestoneField, value: string) => {
    setMilestones((m) =>
      m.map((ms, i) => (i === idx ? { ...ms, [field]: value } : ms))
    );
  };

  const handleDeploy = async () => {
    setLoading(true);
    try {
      const result = await escrowService.create({
        ...params,
        milestones,
      });
      toast.success('Escrow deployed!', {
        description: `PDA: ${result.pdaAddress.slice(0, 16)}...`,
      });
      router.push(`/escrow/${result.id}`);
    } catch {
      toast.error('Deployment failed', { description: 'Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const totalMilestoneAmount = milestones
    .reduce((acc, m) => acc + (parseFloat(m.amount) || 0), 0)
    .toFixed(2);

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
                  Set up your secure freelance contract on the Solana network.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="label-caps block mb-1.5" htmlFor="title">Contract Title</label>
                  <Input
                    id="title"
                    value={params.title}
                    onChange={(e) => setParams({ ...params, title: e.target.value })}
                    placeholder="e.g. Solana NFT Marketplace UI Kit"
                    className="bg-white/[0.04] border-white/[0.08] focus:border-[rgba(57,255,20,0.4)]"
                  />
                </div>

                <div>
                  <label className="label-caps block mb-1.5" htmlFor="description">Description</label>
                  <Textarea
                    id="description"
                    value={params.description}
                    onChange={(e) => setParams({ ...params, description: e.target.value })}
                    placeholder="Describe the work scope and deliverables..."
                    rows={3}
                    className="bg-white/[0.04] border-white/[0.08] focus:border-[rgba(57,255,20,0.4)] resize-none"
                  />
                </div>

                <div>
                  <label className="label-caps block mb-1.5" htmlFor="freelancerAddress">
                    Freelancer Wallet Address
                  </label>
                  <Input
                    id="freelancerAddress"
                    value={params.freelancerAddress}
                    onChange={(e) => setParams({ ...params, freelancerAddress: e.target.value })}
                    placeholder="e.g. 7xAbCdEf..."
                    className="font-mono bg-white/[0.04] border-white/[0.08] focus:border-[rgba(57,255,20,0.4)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-caps block mb-1.5" htmlFor="totalAmount">
                      Total Amount (SOL)
                    </label>
                    <Input
                      id="totalAmount"
                      type="number"
                      value={params.totalAmount}
                      onChange={(e) => setParams({ ...params, totalAmount: e.target.value })}
                      placeholder="0.00"
                      min="0"
                      step="0.1"
                      className="bg-white/[0.04] border-white/[0.08] focus:border-[rgba(57,255,20,0.4)]"
                    />
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-1">Milestone Setup</h2>
                  <p className="text-sm text-muted-foreground">
                    Break down the work into trackable milestones.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addMilestone}
                  className="border-[rgba(57,255,20,0.3)] text-[#39ff14] hover:bg-[rgba(57,255,20,0.08)]"
                >
                  <Plus data-icon="inline-start" className="size-3.5" />
                  Add Milestone
                </Button>
              </div>

              <div className="space-y-4">
                {milestones.map((ms, idx) => (
                  <div key={idx} className="glass rounded-2xl p-4 border border-white/[0.06] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="label-caps">Milestone {idx + 1}</span>
                      {milestones.length > 1 && (
                        <button
                          onClick={() => removeMilestone(idx)}
                          className="text-muted-foreground hover:text-[#ff4a6b] transition-colors"
                          aria-label="Remove milestone"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      )}
                    </div>

                    <Input
                      value={ms.title}
                      onChange={(e) => updateMilestone(idx, 'title', e.target.value)}
                      placeholder="Milestone title"
                      className="bg-white/[0.04] border-white/[0.08] focus:border-[rgba(57,255,20,0.4)]"
                    />
                    <Input
                      value={ms.description}
                      onChange={(e) => updateMilestone(idx, 'description', e.target.value)}
                      placeholder="Description of deliverables"
                      className="bg-white/[0.04] border-white/[0.08] focus:border-[rgba(57,255,20,0.4)]"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="number"
                        value={ms.amount}
                        onChange={(e) => updateMilestone(idx, 'amount', e.target.value)}
                        placeholder="Amount (SOL)"
                        className="bg-white/[0.04] border-white/[0.08] focus:border-[rgba(57,255,20,0.4)]"
                      />
                      <Input
                        type="date"
                        value={ms.dueDate}
                        onChange={(e) => updateMilestone(idx, 'dueDate', e.target.value)}
                        className="bg-white/[0.04] border-white/[0.08] focus:border-[rgba(57,255,20,0.4)]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
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
                    <div className="label-caps mb-1">Contract Title</div>
                    <div className="text-sm font-medium text-foreground">{params.title || '—'}</div>
                  </div>
                  <div>
                    <div className="label-caps mb-1">Total Amount</div>
                    <div className="text-sm font-bold text-[#39ff14]">{params.totalAmount || '0'} SOL</div>
                  </div>
                  <div>
                    <div className="label-caps mb-1">Freelancer</div>
                    <div className="hash-display text-xs">{params.freelancerAddress || '—'}</div>
                  </div>
                  <div>
                    <div className="label-caps mb-1">Timeout</div>
                    <div className="text-sm font-medium text-foreground">{params.timeoutDays} days</div>
                  </div>
                </div>

                <div className="border-t border-white/[0.04] pt-4">
                  <div className="label-caps mb-2">Milestones ({milestones.length})</div>
                  <div className="space-y-1.5">
                    {milestones.map((ms, i) => (
                      <div key={i} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{ms.title || `Milestone ${i + 1}`}</span>
                        <span className="font-medium text-foreground">{ms.amount || '0'} SOL</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between text-xs font-bold border-t border-white/[0.04] pt-1.5 mt-1.5">
                      <span className="text-foreground">Total</span>
                      <span className="text-[#39ff14]">{totalMilestoneAmount} SOL</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-xl p-4 border border-[rgba(255,177,74,0.2)]">
                <div className="text-xs text-[#ffb14a] font-medium mb-1">⚡ Devnet Transaction</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Funds will be locked in a Program Derived Address (PDA) until the freelancer
                  completes the milestone or the timeout period is reached.
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
                className="bg-[#39ff14] text-[#053900] hover:bg-[#2ae500] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] font-semibold"
              >
                Continue
                <ChevronRight data-icon="inline-end" className="size-4" />
              </Button>
            ) : (
              <Button
                onClick={handleDeploy}
                disabled={loading}
                className="bg-[#39ff14] text-[#053900] hover:bg-[#2ae500] hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] font-semibold min-w-[160px]"
              >
                {loading ? (
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
              {/* Node visualization */}
              <div className="flex flex-col items-center gap-2">
                <div className="glass rounded-xl p-3 w-full text-center border border-white/[0.08]">
                  <div className="label-caps text-[10px] mb-1">Program</div>
                  <div className="hash-display text-[11px]">KnE...72pA...sL1x</div>
                </div>

                <div className="flex items-center gap-1">
                  <div className="h-6 w-px bg-[rgba(57,255,20,0.3)]" />
                </div>

                <div className="glass rounded-xl p-3 w-full text-center border border-[rgba(57,255,20,0.3)] shadow-[0_0_12px_rgba(57,255,20,0.1)]">
                  <div className="label-caps text-[10px] mb-1 text-[#39ff14]">PDA Vault</div>
                  <div className="text-xs text-muted-foreground">Derived from seeds: ['escrow', seed_v1]</div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="h-6 w-px bg-white/[0.1] mx-6" />
                  <div className="h-6 w-px bg-white/[0.1] mx-6" />
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="glass rounded-xl p-3 text-center border border-white/[0.06]">
                    <div className="label-caps text-[10px] mb-1">Client</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {params.freelancerAddress ? 'You' : '...'}
                    </div>
                  </div>
                  <div className="glass rounded-xl p-3 text-center border border-white/[0.06]">
                    <div className="label-caps text-[10px] mb-1">Freelancer</div>
                    <div className="hash-display text-[10px] truncate">
                      {params.freelancerAddress
                        ? params.freelancerAddress.slice(0, 8) + '...'
                        : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats preview */}
          <div className="cyber-card p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Network Health</h3>
            <div className="flex items-center gap-2">
              <NeonDot />
              <span className="text-sm font-bold text-foreground">3,482 TPS</span>
              <span className="label-caps text-[10px] text-[#39ff14]">Healthy</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-lg p-2.5">
                <div className="label-caps text-[10px] mb-0.5">Auto-Refund</div>
                <div className="text-xs font-medium text-foreground">Enabled</div>
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
