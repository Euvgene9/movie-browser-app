'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TitleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <h2 className="text-lg font-semibold text-gray-900">Couldn&apos;t load this title</h2>
      <p className="text-sm text-gray-500">
        The backend might be unreachable, or something went wrong fetching this title.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline">
          <Link href="/search">Back to search</Link>
        </Button>
      </div>
    </div>
  );
}