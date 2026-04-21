import { Skeleton, SkeletonCircle, SkeletonRepeat, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonSpotlightCardProps = {
  className?: string;
};

/** Placeholder for `SpotLightCard`. */
export default function SkeletonSpotlightCard({ className }: SkeletonSpotlightCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-[230px] w-full min-w-[280px] shrink-0 flex-col justify-between overflow-hidden rounded-[12px] bg-neutral-300/70 p-5 shadow-lg",
        className,
      )}
      aria-hidden
    >
      <div className="space-y-2">
        <Skeleton tone="inset" className="h-6 w-2/3" />
        <SkeletonText tone="insetMuted" className="h-3 w-full" />
        <SkeletonText tone="insetMuted" className="h-3 w-11/12" />
        <SkeletonText tone="insetMuted" className="h-3 w-3/4" />
      </div>

      <div className="flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <SkeletonCircle tone="inset" className="h-8 w-8" />
          <SkeletonText tone="insetMuted" className="h-4 w-28" />
        </div>
        <div className="flex -space-x-2">
          <SkeletonRepeat count={3}>
            {() => (
              <SkeletonCircle
                tone="inset"
                className="h-6 w-6 border-2 border-white/70"
              />
            )}
          </SkeletonRepeat>
        </div>
      </div>
    </div>
  );
}
