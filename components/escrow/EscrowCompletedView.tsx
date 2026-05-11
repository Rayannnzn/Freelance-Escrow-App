'use client';

import { motion, type Variants } from 'framer-motion';
import {
  CheckCircle2,
  ExternalLink,
  LayoutDashboard,
  Copy,
  Sparkles,
  User,
  Zap,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { formatSol, formatUsd } from '@/lib/format';
import { truncatePubkey } from '@/lib/solana/utils';
import { getExplorerTxUrl, getExplorerAddressUrl } from '@/lib/solana/explorer';
import type { CompletedEscrowRecord } from '@/lib/escrow-cache';

interface EscrowCompletedViewProps {
  record: CompletedEscrowRecord;
  isClient: boolean;
  isFreelancer: boolean;
}



const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: 'easeOut' },
  }),
};

export function EscrowCompletedView({ record, isClient, isFreelancer }: EscrowCompletedViewProps) {
  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  return (
    <div className="space-y-6">
      {/* Back link */}
      <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}>
        <Link
          href="/escrow"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="size-3.5" />
          Back to Escrows
        </Link>
      </motion.div>

      {/* Hero success card */}
      <motion.div
        initial="hidden"
        animate="show"
        custom={1}
        variants={fadeUp}
        className="relative overflow-hidden rounded-3xl p-8 text-center"
        style={{
          background: 'linear-gradient(145deg, rgba(57,255,20,0.05) 0%, rgba(0,238,252,0.03) 50%, rgba(15,16,18,0.9) 100%)',
          border: '1px solid rgba(57,255,20,0.2)',
          boxShadow: '0 0 60px rgba(57,255,20,0.06)',
        }}
      >
        {/* Background grid glow */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 0%, #39ff14 0%, transparent 60%)',
          }}
        />

        {/* Animated check icon */}
        <div className="relative flex items-center justify-center mx-auto mb-6">
          {[100, 76].map((size, i) => (
            <motion.div
              key={size}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                border: `${i === 0 ? 2 : 1}px solid rgba(57,255,20,${i === 0 ? 0.2 : 0.4})`,
              }}
              animate={{ scale: [1, 1.08, 1], opacity: [0.5 - i * 0.1, 0.15, 0.5 - i * 0.1] }}
              transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
            />
          ))}

          <motion.div
            className="relative z-10 flex items-center justify-center rounded-full"
            style={{
              width: 72,
              height: 72,
              background: 'linear-gradient(135deg, rgba(57,255,20,0.15), rgba(57,255,20,0.05))',
              border: '1px solid rgba(57,255,20,0.35)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
          >
            <CheckCircle2 className="size-9" style={{ color: '#39ff14' }} />
          </motion.div>
        </div>

        <motion.div initial="hidden" animate="show" custom={2} variants={fadeUp}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="size-3.5 text-[#39ff14]" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#39ff14]">
              Contract Fulfilled
            </span>
            <Sparkles className="size-3.5 text-[#39ff14]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Escrow Completed</h1>
          <p className="text-[#39ff14] font-semibold text-base mb-4">
            Funds Released to Freelancer
          </p>

          {/* Amount */}
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
            style={{
              background: 'rgba(57,255,20,0.08)',
              border: '1px solid rgba(57,255,20,0.22)',
            }}
          >
            <Zap className="size-4 text-[#39ff14]" />
            <span className="text-2xl font-bold text-white">{formatSol(record.amountSol)}</span>
            <span className="text-sm text-[rgba(57,255,20,0.7)]">≈ {formatUsd(record.amountSol)}</span>
          </div>
        </motion.div>

        {/* Role badge */}
        {(isClient || isFreelancer) && (
          <motion.div initial="hidden" animate="show" custom={3} variants={fadeUp} className="mt-4">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold"
              style={{
                background: isClient ? 'rgba(0,238,252,0.1)' : 'rgba(57,255,20,0.1)',
                border: `1px solid ${isClient ? 'rgba(0,238,252,0.25)' : 'rgba(57,255,20,0.25)'}`,
                color: isClient ? '#00eefc' : '#39ff14',
              }}
            >
              {isClient ? '✓ You were the Client' : '✓ You were the Freelancer'}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Parties */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={4}
          variants={fadeUp}
          className="rounded-2xl p-5 space-y-4"
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <h2 className="text-xs font-bold uppercase tracking-widest text-[rgba(255,255,255,0.35)]">
            Parties
          </h2>

          {[
            { label: 'Client', addr: record.client, color: '#00eefc', isSelf: isClient },
            { label: 'Freelancer', addr: record.freelancer, color: '#39ff14', isSelf: isFreelancer },
          ].map(({ label, addr, color, isSelf }) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="size-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `rgba(${color === '#00eefc' ? '0,238,252' : '57,255,20'},0.08)` }}
              >
                <User className="size-4" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold" style={{ color }}>
                    {isSelf ? `You (${label})` : label}
                  </span>
                </div>
                <div className="font-mono text-[11px] text-[rgba(255,255,255,0.5)] truncate">
                  {truncatePubkey(addr, 6)}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => copy(addr, label)}
                  className="p-1 rounded text-[rgba(255,255,255,0.25)] hover:text-white transition-colors"
                >
                  <Copy className="size-3" />
                </button>
                <a
                  href={getExplorerAddressUrl(addr)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded text-[rgba(255,255,255,0.25)] hover:text-[#00eefc] transition-colors"
                >
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Transaction details */}
        <motion.div
          initial="hidden"
          animate="show"
          custom={5}
          variants={fadeUp}
          className="rounded-2xl p-5 space-y-4"
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <h2 className="text-xs font-bold uppercase tracking-widest text-[rgba(255,255,255,0.35)]">
            Transaction
          </h2>

          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-1.5 shrink-0">
                <Calendar className="size-3.5 text-[rgba(255,255,255,0.3)]" />
                <span className="text-xs text-[rgba(255,255,255,0.4)]">Completed</span>
              </div>
              <span className="text-xs text-right text-[rgba(255,255,255,0.75)]">
                {new Date(record.completedAt).toLocaleString()}
              </span>
            </div>

            <div className="h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

            <div className="flex items-start justify-between gap-3">
              <span className="text-xs text-[rgba(255,255,255,0.4)] shrink-0">TX Signature</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-[#00eefc]">
                  {record.approvalSignature.slice(0, 8)}…{record.approvalSignature.slice(-6)}
                </span>
                <button
                  onClick={() => copy(record.approvalSignature, 'Signature')}
                  className="text-[rgba(255,255,255,0.25)] hover:text-white transition-colors"
                >
                  <Copy className="size-3" />
                </button>
              </div>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-xs text-[rgba(255,255,255,0.4)] shrink-0">Escrow PDA</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-[rgba(255,255,255,0.55)]">
                  {truncatePubkey(record.pdaAddress, 5)}
                </span>
                <button
                  onClick={() => copy(record.pdaAddress, 'PDA address')}
                  className="text-[rgba(255,255,255,0.25)] hover:text-white transition-colors"
                >
                  <Copy className="size-3" />
                </button>
              </div>
            </div>

            <div className="flex items-start justify-between gap-3">
              <span className="text-xs text-[rgba(255,255,255,0.4)] shrink-0">Status</span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-md"
                style={{ background: 'rgba(57,255,20,0.1)', color: '#39ff14' }}
              >
                Account Closed
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* CTAs */}
      <motion.div
        initial="hidden"
        animate="show"
        custom={6}
        variants={fadeUp}
        className="flex gap-3 flex-wrap"
      >
        <a
          href={getExplorerTxUrl(record.approvalSignature)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{
            background: 'rgba(0,238,252,0.07)',
            border: '1px solid rgba(0,238,252,0.2)',
            color: '#00eefc',
          }}
        >
          <ExternalLink className="size-3.5" />
          View Transaction on Explorer
        </a>

        <Link href="/dashboard">
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg, #39ff14, #2ae500)',
              color: '#053900',
              boxShadow: '0 0 20px rgba(57,255,20,0.2)',
            }}
          >
            <LayoutDashboard className="size-3.5" />
            Back to Dashboard
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
