'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, CheckCheck, Trash2, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications, type AppNotification, type NotificationType } from '@/hooks/useNotifications';
import { formatRelativeTime } from '@/lib/format';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// ─── Icon + color per notification type ──────────────────────────────────────
const TYPE_CONFIG: Record<NotificationType, { emoji: string; color: string; bgColor: string }> = {
  escrow_created:  { emoji: '🔒', color: '#39ff14',  bgColor: 'rgba(57,255,20,0.1)'   },
  work_submitted:  { emoji: '📤', color: '#ffb14a',  bgColor: 'rgba(255,177,74,0.1)'  },
  approved:        { emoji: '✅', color: '#79ff5b',  bgColor: 'rgba(121,255,91,0.1)'  },
  timeout_claimed: { emoji: '⏱️', color: '#ff4a6b',  bgColor: 'rgba(255,74,107,0.1)' },
  funds_released:  { emoji: '💸', color: '#00eefc',  bgColor: 'rgba(0,238,252,0.1)'   },
  tx_confirmed:    { emoji: '⛓️', color: '#a78bfa',  bgColor: 'rgba(167,139,250,0.1)' },
};

function NotificationItem({
  notification,
  onRead,
}: {
  notification: AppNotification;
  onRead: (id: string) => void;
}) {
  const cfg = TYPE_CONFIG[notification.type];
  return (
    <div
      className={cn(
        'flex items-start gap-3 p-3 rounded-xl transition-colors group cursor-default',
        !notification.read && 'bg-white/[0.03]',
        'hover:bg-white/[0.05]'
      )}
      onClick={() => !notification.read && onRead(notification.id)}
    >
      {/* Type icon */}
      <div
        className="size-8 rounded-lg flex items-center justify-center shrink-0 text-base"
        style={{ background: cfg.bgColor, border: `1px solid ${cfg.color}22` }}
      >
        {cfg.emoji}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="text-xs font-semibold text-foreground leading-tight">
            {notification.title}
          </div>
          {!notification.read && (
            <span
              className="size-1.5 rounded-full shrink-0 mt-1"
              style={{ background: cfg.color, boxShadow: `0 0 4px ${cfg.color}` }}
            />
          )}
        </div>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
          {notification.message}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-muted-foreground/60">
            {formatRelativeTime(notification.timestamp)}
          </span>
          {notification.escrowPda && (
            <Link
              href={`/escrow/${notification.escrowPda}`}
              className="flex items-center gap-0.5 text-[10px] text-[#00eefc] hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              View escrow <ExternalLink className="size-2.5" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function NotificationDropdown() {
  const { notifications, unreadCount, markRead, markAllRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="relative size-8 hover:bg-white/[0.06]"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        onClick={() => setOpen((o) => !o)}
      >
        <Bell className="size-4 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[14px] h-[14px] rounded-full bg-[#39ff14] text-[#053900] text-[8px] font-bold flex items-center justify-center px-0.5 shadow-[0_0_6px_rgba(57,255,20,0.6)]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-10 w-80 rounded-2xl border border-white/[0.08] shadow-2xl z-50 overflow-hidden"
            style={{ background: 'rgba(8,12,8,0.96)', backdropFilter: 'blur(24px)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-[rgba(57,255,20,0.1)] text-[#39ff14]">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 hover:bg-white/[0.06]"
                    onClick={markAllRead}
                    title="Mark all read"
                  >
                    <CheckCheck className="size-3.5 text-muted-foreground" />
                  </Button>
                )}
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 hover:bg-white/[0.06]"
                    onClick={clearAll}
                    title="Clear all"
                  >
                    <Trash2 className="size-3.5 text-muted-foreground" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 hover:bg-white/[0.06]"
                  onClick={() => setOpen(false)}
                >
                  <X className="size-3.5 text-muted-foreground" />
                </Button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="size-8 text-muted-foreground/30 mb-3" />
                  <div className="text-sm font-medium text-muted-foreground">All caught up</div>
                  <p className="text-xs text-muted-foreground/60 mt-1 max-w-[200px]">
                    Notifications will appear here when escrow activity occurs.
                  </p>
                </div>
              ) : (
                <div className="p-2 space-y-0.5">
                  {notifications.map((n) => (
                    <NotificationItem key={n.id} notification={n} onRead={markRead} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
