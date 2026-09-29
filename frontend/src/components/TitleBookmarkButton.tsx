'use client';

import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/context/AuthContext';
import { useBookmarks } from '@/lib/context/BookmarksContext';

export function TitleBookmarkButton({ imdbId }: { imdbId: string }) {
  const { isAuthenticated } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  if (!isAuthenticated) return null;

  const bookmarked = isBookmarked(imdbId);

  return (
    <Button
      variant={bookmarked ? 'default' : 'outline'}
      onClick={() => toggleBookmark(imdbId).catch(() => {})}
    >
      <Bookmark className={`mr-2 h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
      {bookmarked ? 'Bookmarked' : 'Bookmark'}
    </Button>
  );
}