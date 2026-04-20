import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonFeedCardProps = {
  className?: string;
};

/**
 * Placeholder for `FeedCard` (memory / wish feed). Mirrors: user row, large
 * media area, action row (like/comment/share/save), and a description line.
 */
export default function SkeletonFeedCard({ className }: SkeletonFeedCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-neutral-200/70 bg-white",
        className
      )}
      aria-hidden
    >
      <div className="flex items-center gap-3 p-3">
        <SkeletonCircle className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <SkeletonText className="h-3.5 w-32" />
          <SkeletonText className="h-2.5 w-20" />
        </div>
      </div>
      <Skeleton className="h-64 w-full rounded-none" />
      <div className="flex items-center gap-4 p-3">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      <div className="space-y-2 px-3 pb-4">
        <SkeletonText className="h-3 w-2/3" />
      </div>
    </div>
  );
}
