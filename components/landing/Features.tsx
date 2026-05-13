"use client";

import { motion } from "framer-motion";
import { Lock, Zap, Shield, Globe, LayoutDashboard, Wallet } from "lucide-react";

const FEATURES = [
  {
    title: "Non-Custodial Escrow",
    description: "Funds are locked in a Program Derived Address (PDA). Nobody, not even us, can access your SOL.",
    icon: Lock,
    color: "text-neon",
    bg: "bg-neon/10",
  },
  {
    title: "Instant Settlement",
    description: "Once work is approved, payment is instantly routed to the freelancer's wallet. No waiting periods.",
    icon: Zap,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    title: "On-Chain Security",
    description: "Every contract state change is cryptographically verified and recorded on the Solana blockchain.",
    icon: Shield,
    color: "text-cyber-blue",
    bg: "bg-cyber-blue/10",
  },
  {
    title: "Global Payments",
    description: "Hire or work from anywhere in the world. No currency conversion fees or banking restrictions.",
    icon: Globe,
    color: "text-solana-purple",
    bg: "bg-solana-purple/10",
  },
  {
    title: "Real-Time Analytics",
    description: "Track your earnings, active contracts, and completion rates directly from your dashboard.",
    icon: LayoutDashboard,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
  {
    title: "Wallet Authentication",
    description: "No passwords to remember or lose. Connect your Phantom or Solflare wallet and start instantly.",
    icon: Wallet,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Institutional-Grade <span className="text-neon">Infrastructure</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            KineTex is built on Solana to provide unparalleled speed, security, and transparency for professional freelancers and clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              key={feature.title}
              className="cyber-card p-6 flex flex-col items-start text-left group"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${feature.bg}`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
