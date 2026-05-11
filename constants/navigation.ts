import {
  LayoutDashboard,
  Wallet,
  FileText,
  GitBranch,
  BarChart3,
  HelpCircle,
  Settings,
  LogOut,
} from 'lucide-react';

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Escrow', href: '/escrow', icon: Wallet },
  { label: 'Contracts', href: '/contracts', icon: FileText },
  { label: 'Wallets', href: '/wallets', icon: GitBranch },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
] as const;

export const NAV_BOTTOM_ITEMS = [
  { label: 'Support', href: '/support', icon: HelpCircle },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Logout', href: '/logout', icon: LogOut },
] as const;

export const APP_NAME = 'KineTex';
export const APP_SUBTITLE = 'Solana Freelance';
