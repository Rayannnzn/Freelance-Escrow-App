'use client';

import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { key: 'initialized',  label: 'Initialized' },
  { key: 'submitted',    label: 'Work Submitted' },
  { key: 'approved',     label: 'Approved' },
  { key: 'released',     label: 'Funds Released' },
] as const;

type LifecycleStep = (typeof STEPS)[number]['key'];

interface EscrowProgressProps {
  currentStep: LifecycleStep;
  dates?: Partial<Record<LifecycleStep, string>>;
  className?: string;
}

const STEP_ORDER: LifecycleStep[] = ['initialized', 'submitted', 'approved', 'released'];

export function EscrowProgress({ currentStep, dates, className }: EscrowProgressProps) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-start justify-between relative">
        {/* Connecting line */}
        <div className="absolute top-4 left-4 right-4 h-px bg-white/[0.06] z-0" />
        {/* Active fill */}
        <div
          className="absolute top-4 left-4 h-px z-0 transition-all duration-700"
          style={{
            width: `${(currentIndex / (STEPS.length - 1)) * 100}%`,
            background: 'linear-gradient(90deg, #39ff14, rgba(57,255,20,0.3))',
            boxShadow: '0 0 6px rgba(57,255,20,0.5)',
            right: 'auto',
          }}
        />

        {STEPS.map((step, idx) => {
          const stepIndex = STEP_ORDER.indexOf(step.key);
          const isCompleted = stepIndex < currentIndex;
          const isCurrent = stepIndex === currentIndex;
          const isPending = stepIndex > currentIndex;

          return (
            <div key={step.key} className="flex flex-col items-center gap-2 z-10 flex-1">
              <div
                className={cn(
                  'size-8 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  isCompleted && 'bg-[#39ff14] border-[#39ff14] shadow-[0_0_12px_rgba(57,255,20,0.5)]',
                  isCurrent && 'bg-transparent border-[#39ff14] shadow-[0_0_12px_rgba(57,255,20,0.3)]',
                  isPending && 'bg-transparent border-white/10'
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="size-4 text-[#053900]" fill="#053900" />
                ) : isCurrent ? (
                  <Loader2 className="size-3.5 text-[#39ff14] animate-spin" />
                ) : (
                  <Circle className="size-3.5 text-white/20" />
                )}
              </div>

              <div className="text-center">
                <div className={cn(
                  'text-xs font-medium',
                  isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {step.label}
                </div>
                {dates?.[step.key] && (
                  <div className="label-caps text-[10px] mt-0.5">
                    {new Date(dates[step.key]!).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: '2-digit',
                    })}
                  </div>
                )}
                {isCurrent && !dates?.[step.key] && (
                  <div className="label-caps text-[10px] mt-0.5 text-[#39ff14]">Active</div>
                )}
                {isPending && (
                  <div className="label-caps text-[10px] mt-0.5 text-muted-foreground/50">Pending</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
