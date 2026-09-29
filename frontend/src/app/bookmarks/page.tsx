'use client';

import { useEffect, useMemo, useState } from 'react';
import { useBookmarks } from '@/lib/context/BookmarksContext';
import { TitleGrid } from '@/components/TitleGrid';
import { Skeleton } from '@/components/ui/skeleton';
import type { OmdbSearchItem, OmdbTitleDetails } from '@/lib/types';
import { ApiError, apiFetch } from '@/lib/api';
import Link from 'next/link';
import { GridSkeleton } from '@/components/GridSkeleton';
import { ErrorMessage } from '@/components/ErrorMessage';

export default function BookmarksPage() {
  const { bookmarks, loading: bookmarksLoading } = useBookmarks();
  const [items, setItems] = useState<OmdbSearchItem[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  function loadDetails() {
    if (bookmarks.length === 0) {
      setItems([]);
      setDetailsLoading(false);
      return;
    }
    setDetailsLoading(true);
    setError(null);

    Promise.all(
      bookmarks.map((b) =>
        apiFetch<OmdbTitleDetails>(`/media/details?imdbId=${b.imdbId}`, { auth: false }),
      ),
    )
      .then((details) => {
        setItems(
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
        setError(err instanceof ApiError ? err.message : 'Failed to load your bookmarks');
      })
      .finally(() => setDetailsLoading(false));
  }

  useEffect(() => {
    if (bookmarksLoading) return;

    if (bookmarks.length === 0) {
      setItems([]);
      setDetailsLoading(false);
      return;
    }

    setDetailsLoading(true);
    Promise.all(
      bookmarks.map((b) =>
        apiFetch<OmdbTitleDetails>(`/media/details?imdbId=${b.imdbId}`, { auth: false }),
      ),
    )
      .then((details) => {
        setItems(
          details.map((d) => ({
            Title: d.Title,
            Year: d.Year,
            imdbID: d.imdbID,
            Type: d.Type,
            Poster: d.Poster,
          })),
        );
      })
      .finally(() => setDetailsLoading(false));
  }, [bookmarks, bookmarksLoading]);

  const loading = bookmarksLoading || detailsLoading;

  if (loading) return <GridSkeleton />;
  if (error) return <ErrorMessage message={error} onRetry={loadDetails} />;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-foreground">Your bookmarks</h1>
      {items.length === 0 ? (
        <p className="text-muted-foreground">
          You haven&apos;t bookmarked anything yet. Find something in{' '}
          <Link href="/search" className="text-primary hover:underline">
            search
          </Link>
          .
        </p>
      ) : (
        <TitleGrid items={items} />
      )}
    </div>
  );
}