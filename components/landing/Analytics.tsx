"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "$10M+", label: "Total Escrow Volume" },
  { value: "400ms", label: "Average Settlement Time" },
  { value: "0%", label: "Platform Custody Risk" },
  { value: "15,000+", label: "Completed Contracts" },
];

export function Analytics() {
  return (
    <section id="analytics" className="py-24 relative z-10 border-t border-white/5 bg-[#0d0e10]/80">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              key={i}
              className="flex flex-col items-center text-center group"
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:text-neon transition-colors duration-300 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
