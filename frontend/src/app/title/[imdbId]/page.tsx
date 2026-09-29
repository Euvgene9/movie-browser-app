import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TitleBookmarkButton } from '@/components/TitleBookmarkButton';
import { RatingForm } from '@/components/RatingForm';
import type { OmdbTitleDetails } from '@/lib/types';
import { BackButton } from '@/components/BackButton';

async function getDetails(imdbId: string): Promise<OmdbTitleDetails | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/media/details?imdbId=${imdbId}`,
    { cache: 'no-store' },
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function TitleDetailsPage({
  params,
}: {
  params: Promise<{ imdbId: string }>;
}) {
  const { imdbId } = await params;
  const details = await getDetails(imdbId);

  if (!details || details.Response === 'False') {
    notFound();
  }

  const hasPoster = details.Poster && details.Poster !== 'N/A';
  const genres = details.Genre.split(',').map((g) => g.trim());

  return (
     <div>
      <BackButton />

    <div className="flex flex-col gap-8 md:flex-row">
      <div className="w-full shrink-0 md:w-72">
        {hasPoster ? (
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
            <Image
              src={details.Poster}
              alt={details.Title}
              fill
              sizes="(max-width: 768px) 100vw, 288px"
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="flex aspect-[2/3] w-full items-center justify-center rounded-lg bg-muted text-muted-foreground">
            No poster
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{details.Title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {details.Year} · {details.Runtime} · {details.Rated}
            </p>
          </div>
          <TitleBookmarkButton imdbId={details.imdbID} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Badge key={genre} variant="secondary">
              {genre}
            </Badge>
          ))}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-foreground/90">{details.Plot}</p>

        <Separator className="my-6" />

        <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Director</dt>
            <dd className="text-foreground">{details.Director}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Actors</dt>
            <dd className="text-foreground">{details.Actors}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">IMDb Rating</dt>
            <dd className="text-foreground">{details.imdbRating}/10</dd>
          </div>
        </dl>

        <Separator className="my-6" />

        <RatingForm imdbId={details.imdbID} />
      </div>
    </div>
   </div>
  );
}