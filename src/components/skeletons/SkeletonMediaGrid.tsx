import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonMediaGridProps = {
  /** Number of square tiles to render. */
  count?: number;
  className?: string;
};

/**
 * Placeholder for a photo/video grid (square aspect-ratio tiles). Matches the
 * posts grid in `visitProfile`, the memories page, and any other 2/3-column
 * square-thumbnail grid.
 */
export default function SkeletonMediaGrid({
  count = 6,
  className,
}: SkeletonMediaGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 max-[700px]:grid-cols-2 max-[420px]:grid-cols-1 gap-1",
        className
      )}
      aria-hidden
    >
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-square w-full rounded-none" />
      ))}
    </div>
  );
}
