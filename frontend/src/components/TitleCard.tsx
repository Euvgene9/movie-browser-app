'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PosterImage } from '@/components/PosterImage';
import type { OmdbSearchItem } from '@/lib/types';
import { useAuth } from '@/lib/context/AuthContext';
import { useBookmarks } from '@/lib/context/BookmarksContext';
import { Bookmark } from 'lucide-react';
import { Button } from './ui/button';

interface TitleCardProps {
  item: OmdbSearchItem;
  priority?: boolean;
}

export function TitleCard({ item, priority = false }: TitleCardProps) {

  const { isAuthenticated } = useAuth();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(item.imdbID);

  function handleBookmarkClick(e: React.MouseEvent) {
    e.preventDefault(); // don't navigate to the details page
    e.stopPropagation();
    toggleBookmark(item.imdbID).catch(() => {
    });
  }

  return (
    <Link href={`/title/${item.imdbID}`}>
      <Card className="group relative overflow-hidden transition-shadow hover:shadow-md">
        <PosterImage src={item.Poster} alt={item.Title} priority={priority} />

        {isAuthenticated && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-2 top-2 h-8 w-8 rounded-full opacity-90 hover:opacity-100"
            onClick={handleBookmarkClick}
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Bookmark
              className={`h-4 w-4 ${bookmarked ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
            />
          </Button>
        )}

        <CardContent className="p-3">
          <p className="line-clamp-1 text-sm font-medium text-foreground">
            {item.Title}
          </p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{item.Year}</span>
            <Badge variant="secondary" className="text-[10px] capitalize">
              {item.Type}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}