import { TitleCard } from './TitleCard';
import type { OmdbSearchItem } from '@/lib/types';

interface TitleGridProps {
  items: OmdbSearchItem[];
}

export function TitleGrid({ items }: TitleGridProps) {
  if (items.length === 0) {
    return <p className="mt-8 text-center text-muted-foreground">No results found.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((item, index) => (
        <TitleCard key={item.imdbID} item={item} priority={index < 5} />
      ))}
    </div>
  );
}