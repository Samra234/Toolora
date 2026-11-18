import React, { createContext, useCallback, useContext, useState } from 'react';

interface RecentToolsContextValue {
  recentSlugs: string[];
  recordToolUsage: (slug: string) => void;
  clearRecentTools: () => void;
}

const RecentToolsContext = createContext<RecentToolsContextValue | undefined>(undefined);

const STORAGE_KEY = 'toolora-recent-tools';
const MAX_RECENT = 6;

export function RecentToolsProvider({ children }: { children: React.ReactNode }) {
  const [recentSlugs, setRecentSlugs] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string').slice(0, MAX_RECENT) : [];
    } catch {
      return [];
    }
  });

  const recordToolUsage = useCallback((slug: string) => {
    setRecentSlugs((prev) => {
      const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  }, []);

  const clearRecentTools = useCallback(() => {
    setRecentSlugs([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  return (
    <RecentToolsContext.Provider value={{ recentSlugs, recordToolUsage, clearRecentTools }}>
      {children}
    </RecentToolsContext.Provider>
  );
}

export function useRecentTools() {
  const ctx = useContext(RecentToolsContext);
  if (!ctx) {
    throw new Error('useRecentTools must be used within a RecentToolsProvider');
  }
  return ctx;
}
