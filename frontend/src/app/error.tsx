'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
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
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-lg font-semibold text-gray-900">Something went wrong</h2>
          <Button onClick={reset}>Try again</Button>
        </div>
      </body>
    </html>
  );
}