import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonBoardCategoryCardProps = {
  className?: string;
};

/**
 * Placeholder for `BoardCategoryCard` — the gradient tile with a circular
 * count badge and label, used on the All Boards landing grid.
 */
export default function SkeletonBoardCategoryCard({
  className,
}: SkeletonBoardCategoryCardProps) {
  return (
    <div
      className={cn(
        "flex h-48 flex-col items-center justify-center gap-4 rounded-2xl bg-neutral-200/70 p-6 shadow-lg",
        className
      )}
      aria-hidden
    >
      <Skeleton className="h-20 w-20 rounded-full bg-white/60" />
      <Skeleton className="h-4 w-28 bg-white/60" />
    </div>
  );
}
