"use client";

import Link from "next/link";
import { ArrowRight, Code, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#0d0e10] overflow-hidden pt-24 pb-12">
      {/* Footer Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-neon/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Final CTA */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to <span className="text-neon">Escrow?</span>
          </h2>
          <p className="text-muted-foreground text-xl mb-10 max-w-2xl mx-auto">
            Join the decentralized network of freelancers and clients experiencing zero-fee, trustless payments on Solana.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto bg-neon text-[#053900] hover:bg-neon/90 hover:shadow-[0_0_30px_rgba(57,255,20,0.4)] transition-all duration-300 font-bold text-base h-14 px-8 rounded-full">
                Launch Dapp <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="https://github.com" target="_blank" rel="noreferrer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/5 border-white/10 hover:bg-white/10 text-white transition-all h-14 px-8 rounded-full">
                <Code className="w-5 h-5 mr-2" /> Read Documentation
              </Button>
            </Link>
          </div>
        </div>

        {/* Links & Legal */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 border-t border-white/5 pt-16">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-neon to-cyber-blue flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#053900]" fill="currentColor" />
              </div>
              <span className="font-bold text-lg text-white">KineTex</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Trustless freelance escrow built on Solana.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-neon transition-colors">Features</Link></li>
              <li><Link href="#security" className="hover:text-neon transition-colors">Security</Link></li>
              <li><Link href="#how-it-works" className="hover:text-neon transition-colors">How It Works</Link></li>
              <li><Link href="/dashboard" className="hover:text-neon transition-colors">Launch App</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Developers</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-neon transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-neon transition-colors">GitHub</Link></li>
              <li><Link href="#" className="hover:text-neon transition-colors">Smart Contracts</Link></li>
              <li><Link href="#" className="hover:text-neon transition-colors">Audits</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-neon transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-neon transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} KineTex. All rights reserved.</div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <span className="w-2 h-2 rounded-full bg-neon neon-pulse" />
            Built on Solana Devnet
          </div>
        </div>
      </div>
    </footer>
  );
}
