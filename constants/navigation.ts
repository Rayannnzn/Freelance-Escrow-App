import {
  LayoutDashboard,
  Wallet,
  FileText,
  GitBranch,
  BarChart3,
} from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Escrow', href: '/escrow', icon: Wallet },
  { label: 'Contracts', href: '/contracts', icon: FileText },
  { label: 'Wallets', href: '/wallets', icon: GitBranch },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
] as const;

export const APP_NAME = 'KineTex';
export const APP_SUBTITLE = 'Solana Freelance';
