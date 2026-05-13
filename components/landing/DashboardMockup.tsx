"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Wallet, ArrowUpRight } from "lucide-react";

export function DashboardMockup() {
  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-xl border border-white/10 bg-[#0d0e10]/80 backdrop-blur-2xl shadow-2xl overflow-hidden cyber-card">
      {/* Mac-like Header */}
      <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar Mock */}
        <div className="hidden md:flex flex-col gap-4 border-r border-white/5 pr-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon to-solana-purple" />
            <div className="flex-1">
              <div className="h-3 w-20 bg-white/20 rounded mb-1" />
              <div className="h-2 w-12 bg-white/10 rounded" />
            </div>
          </div>
          <div className="h-8 w-full bg-neon/10 rounded border border-neon/20" />
          <div className="h-8 w-full bg-white/5 rounded" />
          <div className="h-8 w-full bg-white/5 rounded" />
          <div className="h-8 w-full bg-white/5 rounded" />
        </div>

        {/* Main Content Mock */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-20"><Wallet className="w-8 h-8 text-neon" /></div>
              <div className="text-sm text-muted-foreground mb-1">Locked in Escrow</div>
              <div className="text-2xl font-bold text-white flex items-center gap-2">
                45.20 <span className="text-sm text-neon font-normal">SOL</span>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-20"><CheckCircle2 className="w-8 h-8 text-cyber-blue" /></div>
              <div className="text-sm text-muted-foreground mb-1">Completed Contracts</div>
              <div className="text-2xl font-bold text-white">12</div>
            </div>
          </div>

          {/* Active Escrows Mock */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Active Contracts</h3>
            <div className="flex flex-col gap-3">
              {[
                { title: "Landing Page Redesign", amount: "15.0", status: "In Progress", icon: Clock, color: "text-yellow-400" },
                { title: "Smart Contract Audit", amount: "25.5", status: "Awaiting Approval", icon: CheckCircle2, color: "text-neon" },
              ].map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2, duration: 0.5 }}
                  key={i} 
                  className="flex items-center justify-between p-4 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div>
                      <div className="text-white font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.status}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-semibold">{item.amount} SOL</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      <ArrowUpRight className="w-3 h-3" /> View
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
