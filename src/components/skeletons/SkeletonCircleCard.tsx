import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonCircleCardProps = {
  className?: string;
};

/**
 * Placeholder for `CircleCard`. Mirrors the image card with a title, member
 * count, and stacked avatar cluster overlayed on the bottom.
 */
export default function SkeletonCircleCard({
  className,
}: SkeletonCircleCardProps) {
  return (
    <div
      className={cn(
        "relative h-[200px] w-full overflow-hidden rounded-2xl bg-neutral-200/70",
        className
      )}
      aria-hidden
    >
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3 bg-white/60" />
          <SkeletonText className="h-3 w-1/3 bg-white/50" />
        </div>
        <div className="flex -space-x-2">
          <SkeletonCircle className="h-7 w-7 border-2 border-white/80 bg-white/60" />
          <SkeletonCircle className="h-7 w-7 border-2 border-white/80 bg-white/60" />
          <SkeletonCircle className="h-7 w-7 border-2 border-white/80 bg-white/60" />
        </div>
      </div>
    </div>
  );
}
