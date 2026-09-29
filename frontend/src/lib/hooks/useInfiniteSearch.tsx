'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '@/lib/api';
import type { OmdbSearchResponse, OmdbSearchItem } from '@/lib/types';

const RESULTS_PER_PAGE = 10; 

export function useInfiniteSearch(query: string) {
  const [items, setItems] = useState<OmdbSearchItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const requestId = useRef(0);

  const hasMore = items.length < totalResults;

  const loadPage = useCallback(
    async (pageToLoad: number, isNewQuery: boolean) => {
      if (!query.trim()) {
        setItems([]);
        setTotalResults(0);
        return;
      }

      const currentRequestId = ++requestId.current;
      setLoading(true);
      setError(null);

      try {
        const data = await apiFetch<OmdbSearchResponse>(
          `/media/search?q=${encodeURIComponent(query)}&page=${pageToLoad}`,
          { auth: false },
        );

        if (currentRequestId !== requestId.current) return; 

        const results = data.Search ?? [];
        setItems((prev) => (isNewQuery ? results : [...prev, ...results]));
        setTotalResults(parseInt(data.totalResults, 10) || 0);
        setPage(pageToLoad);
      } catch (err) {
        if (currentRequestId !== requestId.current) return;
        setError('No results found, or something went wrong.');
        setItems([]);
        setTotalResults(0);
      } finally {
        if (currentRequestId === requestId.current) setLoading(false);
      }
    },
    [query],
  );

  
  useEffect(() => {
    loadPage(1, true);
    
  }, [query]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    loadPage(page + 1, false);
  }, [loading, hasMore, page, loadPage]);

  return { items, loading, error, hasMore, loadMore, totalResults, resultsPerPage: RESULTS_PER_PAGE };
}