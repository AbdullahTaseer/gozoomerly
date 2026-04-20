import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonPageCenterProps = {
  /** Minimum height; defaults to the viewport. */
  minHeightClass?: string;
  /** Extra classes for the outer wrapper. */
  className?: string;
};

/**
 * Generic centered page-level skeleton for Suspense boundaries and other
 * top-level "wait for everything" states (e.g. auth bootstrap). Stacks a few
 * placeholder blocks that evoke a title + content card without committing
 * to a specific layout.
 */
export default function SkeletonPageCenter({
  minHeightClass = "min-h-screen",
  className,
}: SkeletonPageCenterProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 px-6",
        minHeightClass,
        className
      )}
      aria-hidden
    >
      <Skeleton className="h-8 w-48" />
      <SkeletonText className="h-4 w-64" />
      <Skeleton className="h-48 w-full max-w-md rounded-2xl" />
    </div>
  );
}
