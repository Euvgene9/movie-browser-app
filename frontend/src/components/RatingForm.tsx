'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/lib/context/AuthContext';
import { apiFetch, ApiError } from '@/lib/api';
import type { Rating } from '@/lib/types';

export function RatingForm({ imdbId }: { imdbId: string }) {
  const { isAuthenticated } = useAuth();
  const [score, setScore] = useState(0);
  const [review, setReview] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiFetch<Rating[]>('/ratings')
      .then((ratings) => {
        const existing = ratings.find((r) => r.imdbId === imdbId);
        if (existing) {
          setScore(existing.score);
          setReview(existing.review ?? '');
        }
      })
      .catch(() => {});
  }, [imdbId, isAuthenticated]);

  if (!isAuthenticated) {
    return <p className="text-sm text-muted-foreground">Log in to rate this title.</p>;
  }

  async function handleSubmit() {
    if (score === 0) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await apiFetch('/ratings', {
        method: 'POST',
        body: JSON.stringify({ imdbId, score, review: review || undefined }),
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save rating');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium text-foreground">Your rating</h2>
      <div className="flex gap-1">
        {Array.from({ length: 10 }).map((_, i) => {
          const value = i + 1;
          return (
            <button key={value} onClick={() => setScore(value)} aria-label={`Rate ${value}`}>
              <Star
                className={`h-5 w-5 ${
                  value <= score ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/40'
                }`}
              />
            </button>
          );
        })}
      </div>
      <Textarea
        placeholder="Write a review (optional)"
        value={review}
        onChange={(e) => setReview(e.target.value)}
        rows={3}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && <p className="text-sm text-green-600 dark:text-green-400">Saved!</p>}
      <Button onClick={handleSubmit} disabled={saving || score === 0} className="w-fit">
        {saving ? 'Saving...' : 'Save rating'}
      </Button>
    </div>
  );
}