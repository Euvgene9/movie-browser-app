'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Film } from 'lucide-react';

interface PosterImageProps {
  src: string;
  alt: string;
  priority?: boolean; // set true only for above-the-fold cards
}

export function PosterImage({ src, alt, priority = false }: PosterImageProps) {
  const [errored, setErrored] = useState(false);
  const isMissing = !src || src === 'N/A' || errored;

  if (isMissing) {
    return (
      <div className="flex aspect-[2/3] w-full items-center justify-center rounded-t-lg bg-muted">
        <Film className="h-10 w-10 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-lg bg-muted">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover"
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        onError={() => setErrored(true)}
      />
    </div>
  );
}