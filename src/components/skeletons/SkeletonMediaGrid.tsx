import { Skeleton, SkeletonRepeat } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonMediaGridProps = {
  count?: number;
  className?: string;
};

/** Square tiles for profile posts, memories, etc. */
export default function SkeletonMediaGrid({ count = 6, className }: SkeletonMediaGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-3 max-[700px]:grid-cols-2 max-[420px]:grid-cols-1 gap-1",
        className,
      )}
      aria-hidden
    >
      <SkeletonRepeat count={count}>
        {() => <Skeleton className="aspect-square w-full rounded-none" />}
      </SkeletonRepeat>
    </div>
  );
}
