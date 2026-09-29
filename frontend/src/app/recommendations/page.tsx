'use client';

import { useEffect, useState } from 'react';
import { TitleGrid } from '@/components/TitleGrid';
import { Skeleton } from '@/components/ui/skeleton';
import { apiFetch, ApiError } from '@/lib/api';
import type { OmdbSearchItem, OmdbTitleDetails } from '@/lib/types';
import { GridSkeleton } from '@/components/GridSkeleton';
import { ErrorMessage } from '@/components/ErrorMessage';

export default function RecommendationsPage() {
  const [items, setItems] = useState<OmdbSearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  function fetchRecommendations() {
    setLoading(true);
    setError(null);

    apiFetch<OmdbTitleDetails[]>('/recommendations')
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
        setError(err instanceof ApiError ? err.message : 'Failed to load recommendations');
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    apiFetch<OmdbTitleDetails[]>('/recommendations')
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
        setError(err instanceof ApiError ? err.message : 'Failed to load recommendations');
      })
      .finally(() => setLoading(false));
  }, []);

   if (loading) return <GridSkeleton />;
  if (error) return <ErrorMessage message={error} onRetry={fetchRecommendations} />;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-foreground">Recommended for you</h1>
      <TitleGrid items={items} />
    </div>
  );
}