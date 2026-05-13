"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardMockup } from "./DashboardMockup";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon/10 rounded-full blur-[120px] opacity-50 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-neon neon-pulse" />
            <span className="text-sm font-medium text-white/80 label-caps">Live on Solana Devnet</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]"
          >
            Trustless Freelance <br className="hidden md:block" />
            <span className="gradient-text-neon">Payments on Solana</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
          >
            Lock SOL into on-chain escrow, submit work, and get paid instantly without middlemen. The premium standard for decentralized freelance contracts.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto bg-neon text-[#053900] hover:bg-neon/90 hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] transition-all duration-300 font-bold text-base h-14 px-8 rounded-full">
                Launch Dapp <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="https://github.com/Rayannnzn/Freelance-Escrow-App" target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/5 border-white/10 hover:bg-white/10 text-white transition-all h-14 px-8 rounded-full">
                <Code className="w-5 h-5 mr-2" /> View Docs
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative perspective-1000"
        >
          {/* Decorative elements behind mockup */}
          <div className="absolute -inset-1 bg-gradient-to-r from-neon/20 via-cyber-blue/20 to-solana-purple/20 rounded-2xl blur-xl opacity-50" />

          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}
