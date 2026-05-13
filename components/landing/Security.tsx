"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Key, Code2, Link as LinkIcon } from "lucide-react";

const SECURITY_ITEMS = [
  {
    title: "Program Derived Addresses (PDAs)",
    description: "Escrow accounts are dynamically generated PDAs without private keys. Only the smart contract can authorize transfers, ensuring funds cannot be rug-pulled or accessed externally.",
    icon: Key,
  },
  {
    title: "Open-Source Verification",
    description: "Our Anchor smart contracts are completely open-source. Anyone can audit the logic and verify that KineTex is non-custodial and secure.",
    icon: Code2,
  },
  {
    title: "Cryptographic Signatures",
    description: "Every action—creating escrows, submitting work, or releasing funds—requires cryptographic signatures directly from the connected wallet.",
    icon: LinkIcon,
  },
];

export function Security() {
  return (
    <section id="security" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-cyber-blue/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left Side: Content */}
          <div className="flex-1 w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyber-blue/10 border border-cyber-blue/20 mb-6 text-cyber-blue text-sm font-medium">
                <ShieldCheck className="w-4 h-4" /> Institutional Grade
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Trust the Code, <br />
                <span className="text-cyber-blue">Not the Middleman.</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-10">
                Traditional escrow platforms require you to trust a centralized entity with your money. 
                KineTex replaces human intermediaries with immutable Solana smart contracts.
              </p>

              <div className="flex flex-col gap-8">
                {SECURITY_ITEMS.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-6 h-6 text-cyber-blue" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Side: Visual/Code Snippet Mock */}
          <div className="flex-1 w-full max-w-xl lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative rounded-2xl border border-white/10 bg-[#0d0e10] overflow-hidden shadow-2xl group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="h-10 bg-[#1b1c1e] border-b border-white/5 flex items-center px-4 justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="text-xs text-muted-foreground font-mono">lib.rs</div>
              </div>

              <div className="p-6 overflow-x-auto">
                <pre className="text-sm font-mono leading-relaxed text-gray-300">
                  <code className="language-rust">
                    <span className="text-purple-400">pub fn</span> <span className="text-blue-400">initialize_escrow</span>(
                    <br />
                    {"    "}ctx: Context&lt;InitializeEscrow&gt;,
                    <br />
                    {"    "}amount: <span className="text-yellow-300">u64</span>,
                    <br />
                    ) -&gt; <span className="text-green-400">Result</span>&lt;()&gt; {"{"}
                    <br />
                    {"    "}<span className="text-purple-400">let</span> escrow = &amp;<span className="text-purple-400">mut</span> ctx.accounts.escrow;
                    <br />
                    {"    "}escrow.client = ctx.accounts.client.key();
                    <br />
                    {"    "}escrow.freelancer = ctx.accounts.freelancer.key();
                    <br />
                    {"    "}escrow.amount = amount;
                    <br />
                    {"    "}escrow.status = EscrowStatus::<span className="text-orange-400">Funded</span>;
                    <br />
                    <br />
                    {"    "}<span className="text-gray-500">// Transfer SOL to PDA</span>
                    <br />
                    {"    "}system_program::<span className="text-blue-400">transfer</span>(
                    <br />
                    {"        "}CpiContext::<span className="text-blue-400">new</span>(
                    <br />
                    {"            "}ctx.accounts.system_program.to_account_info(),
                    <br />
                    {"            "}system_program::Transfer {"{"}
                    <br />
                    {"                "}from: ctx.accounts.client.to_account_info(),
                    <br />
                    {"                "}to: ctx.accounts.escrow.to_account_info(),
                    <br />
                    {"            "}{"}"},
                    <br />
                    {"        "}),
                    <br />
                    {"        "}amount,
                    <br />
                    {"    "})?;
                    <br />
                    {"    "}<span className="text-green-400">Ok</span>(())
                    <br />
                    {"}"}
                  </code>
                </pre>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
