"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Security", href: "#security" },
  { name: "Analytics", href: "#analytics" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-deep py-3 border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group relative z-50">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon to-cyber-blue flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.4)]">
            <Zap className="w-5 h-5 text-[#053900]" fill="currentColor" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-neon transition-colors">
            KineTex
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-neon after:transition-all hover:after:w-full py-1"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-4 z-50">
          <Link href="/dashboard" className="hidden sm:block">
            <Button className="bg-neon text-[#053900] hover:bg-neon/90 hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all duration-300 font-semibold border border-neon/50 rounded-full px-6 h-10">
              Launch Dapp <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-[#0d0e10]/95 backdrop-blur-xl border-b border-white/10 p-4 md:hidden shadow-2xl flex flex-col gap-4"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-white/80 hover:text-neon py-2 border-b border-white/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link href="/dashboard" className="mt-4" onClick={() => setMobileMenuOpen(false)}>
              <Button className="w-full bg-neon text-[#053900] hover:bg-neon/90 hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all font-semibold rounded-full">
                Launch Dapp <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
