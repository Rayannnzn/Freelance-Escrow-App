'use client';

import { useState, useCallback, useEffect } from 'react';

export type NotificationType =
  | 'escrow_created'
  | 'work_submitted'
  | 'approved'
  | 'timeout_claimed'
  | 'funds_released'
  | 'tx_confirmed';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string; // ISO
  escrowPda?: string;
  read: boolean;
}

const STORAGE_KEY = 'kinetex_notifications_v1';
const MAX_NOTIFICATIONS = 50;

function loadFromStorage(): AppNotification[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppNotification[]) : [];
  } catch {
    return [];
  }
}

function saveToStorage(notifications: AppNotification[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch {
    // Quota exceeded or private mode — ignore silently
  }
}

/**
 * Application-wide notification store backed by localStorage.
 * Use this hook anywhere — it syncs via storage events across tabs.
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    setNotifications(loadFromStorage());
  }, []);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setNotifications(loadFromStorage());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addNotification = useCallback(
    (
      type: NotificationType,
      title: string,
      message: string,
      escrowPda?: string
    ) => {
      const next: AppNotification = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        title,
        message,
        timestamp: new Date().toISOString(),
        escrowPda,
        read: false,
      };

      setNotifications((prev) => {
        const updated = [next, ...prev].slice(0, MAX_NOTIFICATIONS);
        saveToStorage(updated);
        return updated;
      });
    },
    []
  );

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    saveToStorage([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, addNotification, markRead, markAllRead, clearAll };
}
