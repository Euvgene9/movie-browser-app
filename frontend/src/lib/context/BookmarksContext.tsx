'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { apiFetch, ApiError } from '@/lib/api';
import { useAuth } from '@/lib/context/AuthContext';
import type { Bookmark, MediaType } from '@/lib/types';

interface BookmarksContextValue {
  bookmarks: Bookmark[];
  loading: boolean;
  isBookmarked: (imdbId: string) => boolean;
  toggleBookmark: (imdbId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const BookmarksContext = createContext<BookmarksContextValue | undefined>(undefined);

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setBookmarks([]);
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch<Bookmark[]>('/bookmarks');
      setBookmarks(data);
    } catch {
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isBookmarked = useCallback(
    (imdbId: string) => bookmarks.some((b) => b.imdbId === imdbId),
    [bookmarks],
  );

  const toggleBookmark = useCallback(
    async (imdbId: string) => {
      const already = bookmarks.some((b) => b.imdbId === imdbId);

      
      if (already) {
        setBookmarks((prev) => prev.filter((b) => b.imdbId !== imdbId));
      }

      try {
        if (already) {
          await apiFetch(`/bookmarks/${imdbId}`, { method: 'DELETE' });
        } else {
          const created = await apiFetch<Bookmark>('/bookmarks', {
            method: 'POST',
            body: JSON.stringify({ imdbId }),
          });
          setBookmarks((prev) => [created, ...prev]);
        }
      } catch (err) {
        
        refresh();
        throw err instanceof ApiError ? err : new Error('Failed to update bookmark');
      }
    },
    [bookmarks, refresh],
  );

  return (
    <BookmarksContext.Provider
      value={{ bookmarks, loading, isBookmarked, toggleBookmark, refresh }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarksContext);
  if (!ctx) throw new Error('useBookmarks must be used within BookmarksProvider');
  return ctx;
}