"use client";

import { motion } from "framer-motion";
import { FileText, Lock, Upload, CheckCircle } from "lucide-react";

const STEPS = [
  {
    title: "Create Escrow",
    description: "Client defines the milestone, amount, and freelancer wallet address.",
    icon: FileText,
  },
  {
    title: "Lock SOL",
    description: "Client funds the escrow. SOL is securely locked in a smart contract.",
    icon: Lock,
  },
  {
    title: "Submit Work",
    description: "Freelancer completes the deliverable and submits a proof link.",
    icon: Upload,
  },
  {
    title: "Release Payment",
    description: "Client approves the work. Funds are instantly released to the freelancer.",
    icon: CheckCircle,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 relative bg-[#0d0e10]/50 border-y border-white/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            How It <span className="text-cyber-blue">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            A seamless, trustless workflow designed for modern digital work.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-white/10 z-0">
            <motion.div
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-neon via-cyber-blue to-solana-purple shadow-[0_0_15px_rgba(57,255,20,0.5)]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-6 relative z-10">
            {STEPS.map((step, i) => (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                key={step.title}
                className="flex flex-col items-center text-center relative"
              >
                <div className="w-24 h-24 rounded-full bg-[#121315] border border-white/10 flex items-center justify-center mb-6 shadow-xl relative group">
                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-neon transition-colors duration-500" />
                  <step.icon className="w-10 h-10 text-white group-hover:text-neon transition-colors duration-300" />
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-neon text-[#053900] font-bold flex items-center justify-center text-sm shadow-[0_0_10px_rgba(57,255,20,0.5)]">
                    {i + 1}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm max-w-[200px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
