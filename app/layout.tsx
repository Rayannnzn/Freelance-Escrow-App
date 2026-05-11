import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SolanaProvider } from '@/providers/SolanaProvider';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'KineTex — Solana Freelance Escrow',
  description:
    'Secure, trustless freelance escrow on Solana Devnet. Lock funds in a PDA, track milestones, and release payments with confidence.',
  keywords: ['Solana', 'escrow', 'freelance', 'Web3', 'blockchain', 'DeFi'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">
        <SolanaProvider>
          <TooltipProvider>
            {children}
            <Toaster
              theme="dark"
              toastOptions={{
                style: {
                  background: 'rgba(31, 32, 34, 0.95)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#e3e2e5',
                },
              }}
            />
          </TooltipProvider>
        </SolanaProvider>
      </body>
    </html>
  );
}
