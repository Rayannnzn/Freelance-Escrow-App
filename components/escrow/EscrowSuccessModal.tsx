'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ExternalLink,
  LayoutDashboard,
  Copy,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatSol, formatUsd } from '@/lib/format';
import { truncatePubkey } from '@/lib/solana/utils';
import { getExplorerTxUrl } from '@/lib/solana/explorer';
import { toast } from 'sonner';
import Link from 'next/link';

export interface EscrowCompletionData {
  signature: string;
  pdaAddress: string;
  client: string;
  freelancer: string;
  amountSol: number;
  completedAt: string;
}

interface EscrowSuccessModalProps {
  data: EscrowCompletionData | null;
  onClose: () => void;
}

export function EscrowSuccessModal({ data, onClose }: EscrowSuccessModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const copyTx = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(data.signature);
    toast.success('Transaction signature copied');
  };

  return (
    <AnimatePresence>
      {data && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.target === overlayRef.current && onClose()}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={false}
          >
            <motion.div
              className="relative w-full max-w-md pointer-events-auto overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(15,16,18,0.98) 0%, rgba(20,22,26,0.98) 100%)',
                border: '1px solid rgba(57,255,20,0.25)',
                borderRadius: '24px',
                boxShadow: '0 0 80px rgba(57,255,20,0.12), 0 40px 80px rgba(0,0,0,0.6)',
              }}
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            >
              {/* Animated glow sweep */}
              <motion.div
                className="absolute inset-x-0 -top-px h-px"
                style={{ background: 'linear-gradient(90deg, transparent, #39ff14, transparent)' }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />

              <div className="p-8 text-center">
                {/* Animated checkmark ring */}
                <div className="relative flex items-center justify-center mb-6">
                  {/* Outer pulsing ring */}
                  <motion.div
                    className="absolute rounded-full"
                    style={{ width: 100, height: 100, border: '2px solid rgba(57,255,20,0.3)' }}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.2, 0.6] }}
                    transition={{ delay: 0.4, duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  {/* Inner ring */}
                  <motion.div
                    className="absolute rounded-full"
                    style={{ width: 76, height: 76, border: '1px solid rgba(57,255,20,0.5)' }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                  />

                  {/* Check icon */}
                  <motion.div
                    className="relative z-10 flex items-center justify-center rounded-full"
                    style={{
                      width: 64,
                      height: 64,
                      background: 'linear-gradient(135deg, rgba(57,255,20,0.18), rgba(57,255,20,0.06))',
                    }}
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 18 }}
                  >
                    <CheckCircle2 className="size-8" style={{ color: '#39ff14' }} />
                  </motion.div>

                  {/* Sparkle particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: 4,
                        height: 4,
                        background: i % 2 === 0 ? '#39ff14' : '#00eefc',
                        top: '50%',
                        left: '50%',
                      }}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                      animate={{
                        x: Math.cos((i / 6) * Math.PI * 2) * 55,
                        y: Math.sin((i / 6) * Math.PI * 2) * 55,
                        scale: [0, 1.5, 0],
                        opacity: [1, 1, 0],
                      }}
                      transition={{ delay: 0.35 + i * 0.05, duration: 0.7, ease: 'easeOut' }}
                    />
                  ))}
                </div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Sparkles className="size-3.5 text-[#39ff14]" />
                    <span className="text-[10px] font-bold tracking-widest uppercase text-[#39ff14]">
                      Contract Fulfilled
                    </span>
                    <Sparkles className="size-3.5 text-[#39ff14]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1.5">
                    Escrow Completed
                  </h2>
                  <p className="text-sm text-[#39ff14] font-semibold">
                    Funds Released Successfully
                  </p>
                </motion.div>

                {/* Amount badge */}
                <motion.div
                  className="my-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
                  style={{
                    background: 'rgba(57,255,20,0.08)',
                    border: '1px solid rgba(57,255,20,0.2)',
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 260 }}
                >
                  <Zap className="size-4 text-[#39ff14]" />
                  <span className="text-xl font-bold text-white">{formatSol(data.amountSol)}</span>
                  <span className="text-xs text-[rgba(57,255,20,0.7)]">≈ {formatUsd(data.amountSol)}</span>
                </motion.div>

                {/* Details grid */}
                <motion.div
                  className="rounded-2xl p-4 space-y-2.5 text-left mb-5"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-wider font-semibold">Freelancer Paid</span>
                    <span className="text-xs font-mono text-[rgba(255,255,255,0.75)]">{truncatePubkey(data.freelancer, 5)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-wider font-semibold">Client</span>
                    <span className="text-xs font-mono text-[rgba(255,255,255,0.75)]">{truncatePubkey(data.client, 5)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-wider font-semibold">Completed</span>
                    <span className="text-xs text-[rgba(255,255,255,0.75)]">
                      {new Date(data.completedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[rgba(255,255,255,0.4)] uppercase tracking-wider font-semibold">TX Hash</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#00eefc]">{data.signature.slice(0, 8)}…{data.signature.slice(-6)}</span>
                      <button onClick={copyTx} className="text-[rgba(255,255,255,0.3)] hover:text-[#39ff14] transition-colors">
                        <Copy className="size-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div
                  className="flex gap-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <a
                    href={getExplorerTxUrl(data.signature)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: 'rgba(0,238,252,0.08)',
                      border: '1px solid rgba(0,238,252,0.2)',
                      color: '#00eefc',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,238,252,0.14)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,238,252,0.08)')}
                  >
                    <ExternalLink className="size-3.5" />
                    Explorer
                  </a>
                  <Link href="/dashboard" className="flex-1" onClick={onClose}>
                    <button
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: 'linear-gradient(135deg, #39ff14, #2ae500)',
                        color: '#053900',
                        boxShadow: '0 0 20px rgba(57,255,20,0.25)',
                      }}
                      onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 30px rgba(57,255,20,0.45)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(57,255,20,0.25)')}
                    >
                      <LayoutDashboard className="size-3.5" />
                      Dashboard
                    </button>
                  </Link>
                </motion.div>
              </div>

              {/* Bottom glow sweep */}
              <motion.div
                className="absolute inset-x-0 -bottom-px h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(0,238,252,0.6), transparent)' }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
