import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonSpotlightCardProps = {
  className?: string;
};

/**
 * Placeholder for `SpotLightCard`. Mirrors: full-bleed dark image with title,
 * 3-line description, organizer row on the bottom left, and a stacked
 * participant avatar cluster on the right.
 */
export default function SkeletonSpotlightCard({
  className,
}: SkeletonSpotlightCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-[230px] w-full min-w-[280px] shrink-0 flex-col justify-between overflow-hidden rounded-[12px] bg-neutral-300/70 p-5 shadow-lg",
        className
      )}
      aria-hidden
    >
      <div className="space-y-2">
        <Skeleton className="h-6 w-2/3 bg-white/60" />
        <SkeletonText className="h-3 w-full bg-white/50" />
        <SkeletonText className="h-3 w-11/12 bg-white/50" />
        <SkeletonText className="h-3 w-3/4 bg-white/50" />
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <SkeletonCircle className="h-8 w-8 bg-white/60" />
          <SkeletonText className="h-4 w-28 bg-white/50" />
        </div>
        <div className="flex -space-x-2">
          <SkeletonCircle className="h-6 w-6 border-2 border-white/70 bg-white/60" />
          <SkeletonCircle className="h-6 w-6 border-2 border-white/70 bg-white/60" />
          <SkeletonCircle className="h-6 w-6 border-2 border-white/70 bg-white/60" />
        </div>
      </div>
    </div>
  );
}
