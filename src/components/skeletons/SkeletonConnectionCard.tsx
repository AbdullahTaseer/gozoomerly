import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonConnectionCardProps = {
  className?: string;
};

/**
 * Placeholder for `ConnectionCard` (also a good fit for follower / following /
 * chat-contact / circle-member rows). Mirrors: grey rounded row with avatar,
 * two stacked lines, and an action button on the right.
 */
export default function SkeletonConnectionCard({
  className,
}: SkeletonConnectionCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-[8px] bg-[#F7F7F7] p-4",
        className
      )}
      aria-hidden
    >
      <SkeletonCircle className="h-11 w-11 shrink-0 bg-neutral-300/70" />
      <div className="flex-1 min-w-0 space-y-2">
        <SkeletonText className="h-5 max-w-[60%] bg-neutral-300/70" />
        <SkeletonText className="h-3 max-w-[40%] bg-neutral-300/50" />
      </div>
      <Skeleton className="h-9 w-20 rounded-full bg-neutral-300/70" />
    </div>
  );
}
