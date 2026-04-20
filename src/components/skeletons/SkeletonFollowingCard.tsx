import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonFollowingCardProps = {
  className?: string;
};

/**
 * Placeholder for `FollowingCard`. Mirrors: user row (avatar + name + menu),
 * big media area, row of action icons, a footer line of stats.
 */
export default function SkeletonFollowingCard({
  className,
}: SkeletonFollowingCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-neutral-200/70 bg-white",
        className
      )}
      aria-hidden
    >
      <div className="flex items-center justify-between gap-3 p-3">
        <div className="flex items-center gap-3">
          <SkeletonCircle className="h-10 w-10" />
          <div className="space-y-1.5">
            <SkeletonText className="h-3.5 w-28" />
            <SkeletonText className="h-2.5 w-20" />
          </div>
        </div>
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>

      <Skeleton className="h-60 w-full rounded-none" />

      <div className="flex items-center justify-between gap-4 p-3">
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>

      <div className="px-3 pb-4 space-y-2">
        <SkeletonText className="h-3 w-1/3" />
        <SkeletonText className="h-3 w-2/3" />
      </div>
    </div>
  );
}
