'use client';

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { TitleGrid } from '@/components/TitleGrid';
import { FilterBar, TypeFilter } from '@/components/FilterBar';
import { InfiniteScrollSentinel } from '@/components/InfiniteScrollSentinel';
import { Skeleton } from '@/components/ui/skeleton';
import { useInfiniteSearch } from '@/lib/hooks/useInfiniteSearch';
import { useAuth } from '@/lib/context/AuthContext';
import { ApiError, apiFetch } from '@/lib/api';
import { GridSkeleton } from '@/components/GridSkeleton';
import { ErrorMessage } from '@/components/ErrorMessage';
import { OmdbSearchItem, OmdbTitleDetails } from '@/lib/types';

const FEATURED_IDS = ['tt0111161', 'tt0068646', 'tt0468569', 'tt0110912', 'tt0133093'];

export default function SearchPage() {
  const [inputValue, setInputValue] = useState('');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const { items, loading, error, hasMore, loadMore, totalResults } = useInfiniteSearch(query);
  
  const { isAuthenticated } = useAuth();


  const [featured, setFeatured] = useState<OmdbSearchItem[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [featuredError, setFeaturedError] = useState<string | null>(null);

  function loadFeatured() {
    setFeaturedLoading(true);
    setFeaturedError(null);
    Promise.all(
      FEATURED_IDS.map((id) =>
        apiFetch<OmdbTitleDetails>(`/media/details?imdbId=${id}`, { auth: false }),
      ),
    )
      .then((details) => {
        setFeatured(
          details.map((d) => ({
            Title: d.Title,
            Year: d.Year,
            imdbID: d.imdbID,
            Type: d.Type,
            Poster: d.Poster,
          })),
        );
      })
      .catch((err) => {
        setFeaturedError(err instanceof ApiError ? err.message : 'Failed to load featured titles');
      })
      .finally(() => setFeaturedLoading(false));
  }
  useEffect(() => {
    loadFeatured();
  }, []);


  const filteredItems = useMemo(
    () => (typeFilter === 'all' ? items : items.filter((i) => i.Type === typeFilter)),
    [items, typeFilter],
  );


  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    setQuery(trimmed);
    if (isAuthenticated && trimmed) {
        apiFetch('/search-history', {
            method: 'POST',
            body: JSON.stringify({ query: trimmed }),
        }).catch(() => {}); 
    }
  }

  const isSearching = query.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Search movies or series..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="max-w-md"
        />
      </form>

      {isSearching ? (
        <>
          <div className="flex items-center justify-between">
            <FilterBar value={typeFilter} onChange={setTypeFilter} />
            {totalResults > 0 && (
              <p className="text-sm text-muted-foreground">{totalResults} results</p>
            )}
          </div>

          {error && <ErrorMessage message={error} />}

          {!error && <TitleGrid items={filteredItems} />}

          {loading && items.length === 0 && <GridSkeleton count={5} />}
          {loading && items.length > 0 && (
            <p className="text-center text-sm text-muted-foreground">Loading more...</p>
          )}

          {!loading && !error && (
            <InfiniteScrollSentinel onIntersect={loadMore} disabled={!hasMore} />
          )}
        </>
      ) : (
        <>
          <h2 className="text-sm font-medium text-muted-foreground">Featured</h2>
          {featuredError && <ErrorMessage message={featuredError} onRetry={loadFeatured} />}
          {!featuredError && featuredLoading && <GridSkeleton count={5} />}
          {!featuredError && !featuredLoading && <TitleGrid items={featured} />}
        </>
      )}
    </div>
  );
}