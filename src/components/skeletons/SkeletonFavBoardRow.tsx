import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonFavBoardRowProps = {
  className?: string;
};

/** Favorites row: thumb + lines + trailing icon. */
export default function SkeletonFavBoardRow({ className }: SkeletonFavBoardRowProps) {
  return (
    <div
      className={cn("flex items-center gap-3 rounded-lg border border-neutral-200/70 bg-white p-3", className)}
      aria-hidden
    >
      <Skeleton tone="steel" className="h-[70px] w-[100px] shrink-0 rounded" />
      <div className="min-w-0 flex-1 space-y-2">
        <SkeletonText tone="steel" className="h-4 w-2/3" />
        <SkeletonText tone="steelMuted" className="h-3 w-1/2" />
        <SkeletonText tone="steelMuted" className="h-3 w-1/3" />
      </div>
      <Skeleton tone="steel" className="h-8 w-8 shrink-0 rounded-full" />
    </div>
  );
}
