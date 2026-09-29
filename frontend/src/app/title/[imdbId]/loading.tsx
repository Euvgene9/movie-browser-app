import { Skeleton } from '@/components/ui/skeleton';

export default function TitleLoading() {
  return (
    <div className="flex flex-col gap-8 md:flex-row">
      <Skeleton className="aspect-[2/3] w-full shrink-0 rounded-lg md:w-72" />
      <div className="flex-1 space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  );
}