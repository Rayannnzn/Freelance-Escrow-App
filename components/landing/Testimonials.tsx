"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Senior Smart Contract Auditor",
    content: "The cleanest escrow implementation I've seen on Solana. KineTex makes sure freelancers get paid instantly without any centralized custody risk. This is the future of remote work.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    name: "Sarah Chen",
    role: "Founder at Web3 Native",
    content: "We use KineTex to pay all our contractors. The peace of mind knowing funds are locked in a PDA until milestones are met has saved us countless hours of administrative work.",
    avatar: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
  },
  {
    name: "Marcus Johnson",
    role: "Freelance UI/UX Designer",
    content: "No more chasing invoices or paying 20% platform fees. With KineTex, the moment my client approves the design, the SOL hits my Phantom wallet. It's magical.",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 relative z-10 bg-[#121315]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Trusted by <span className="text-solana-purple">Professionals</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            See what freelancers and founders are saying about the KineTex experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              key={i}
              className="cyber-card p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8 italic">
                  "{t.content}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-white/10" />
                <div>
                  <div className="text-white font-bold">{t.name}</div>
                  <div className="text-sm text-solana-purple font-medium">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
