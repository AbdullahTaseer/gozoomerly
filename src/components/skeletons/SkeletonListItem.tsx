import { SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonListItemProps = {
  /** Number of text lines under the avatar. Defaults to 2. */
  lines?: 1 | 2 | 3;
  className?: string;
};

/**
 * Generic row skeleton: circular avatar + 1-3 stacked text lines. Useful for
 * chat lists, notification lists, connections, followers/following, etc.
 */
export default function SkeletonListItem({
  lines = 2,
  className,
}: SkeletonListItemProps) {
  return (
    <div
      className={cn("flex items-center gap-3", className)}
      aria-hidden
    >
      <SkeletonCircle className="h-12 w-12" />
      <div className="flex-1 space-y-2">
        <SkeletonText className="h-4 max-w-[60%]" />
        {lines >= 2 && <SkeletonText className="h-4 max-w-[40%]" />}
        {lines >= 3 && <SkeletonText className="h-4 max-w-[30%]" />}
      </div>
    </div>
  );
}
