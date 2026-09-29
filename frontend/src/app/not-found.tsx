import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h2 className="text-lg font-semibold text-gray-900">Not found</h2>
      <p className="text-sm text-gray-500">
        That title doesn&apos;t exist, or the page you&apos;re looking for isn&apos;t here.
      </p>
      <Button>
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}