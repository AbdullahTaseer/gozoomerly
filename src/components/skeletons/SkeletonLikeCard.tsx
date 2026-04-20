import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonLikeCardProps = {
  className?: string;
};

/**
 * Placeholder for `LikesCommentsGiftsCard` used on `/u/likes`. Mirrors: large
 * image at the top, then a row with avatar + name + time and a trailing heart
 * button, with an optional two-line wish message beneath.
 */
export default function SkeletonLikeCard({ className }: SkeletonLikeCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[5px] bg-white",
        className
      )}
      aria-hidden
    >
      <Skeleton className="aspect-square w-full rounded-[5px]" />

      <div className="flex items-center justify-between gap-2 p-2 mt-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <SkeletonCircle className="h-11 w-11 shrink-0" />
          <div className="flex-1 min-w-0 space-y-2">
            <SkeletonText className="h-3.5 w-1/2" />
            <SkeletonText className="h-2.5 w-1/3" />
          </div>
        </div>
        <Skeleton className="h-9 w-9 rounded-full shrink-0" />
      </div>

      <div className="px-2 pb-3 space-y-2">
        <SkeletonText className="h-3 w-full" />
        <SkeletonText className="h-3 w-2/3" />
      </div>
    </div>
  );
}
