import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonFavBoardRowProps = {
  className?: string;
};

/**
 * Placeholder for `FavoriteBoardRow` (and the similar compact rows used in
 * `u/boards`): rectangular cover thumbnail on the left + two stacked text
 * lines + trailing star button on the right.
 */
export default function SkeletonFavBoardRow({
  className,
}: SkeletonFavBoardRowProps) {
  return (
    <div
      className={cn(
        "flex w-full items-start gap-3 rounded-xl bg-gray-100 p-3",
        className
      )}
      aria-hidden
    >
      <Skeleton className="h-[70px] w-[100px] shrink-0 rounded bg-neutral-300/70" />
      <div className="flex-1 min-w-0 space-y-2 py-0.5">
        <SkeletonText className="h-4 w-2/3 bg-neutral-300/70" />
        <SkeletonText className="h-3 w-1/2 bg-neutral-300/50" />
        <SkeletonText className="h-3 w-1/3 bg-neutral-300/50" />
      </div>
      <Skeleton className="h-8 w-8 rounded-full bg-neutral-300/70" />
    </div>
  );
}
