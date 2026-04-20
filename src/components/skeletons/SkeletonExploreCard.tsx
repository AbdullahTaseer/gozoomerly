import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonExploreCardProps = {
  /** Pixel height for the image block. Matches the real `ExploreCard`. */
  heightPx?: number;
  className?: string;
};

/**
 * Placeholder for `ExploreCard` items rendered in the round-robin column
 * layout on the Home → Explore tab.
 */
export default function SkeletonExploreCard({
  heightPx = 210,
  className,
}: SkeletonExploreCardProps) {
  return (
    <div
      className={cn("flex flex-col gap-2", className)}
      aria-hidden
    >
      <Skeleton
        className="w-full shrink-0 rounded-lg"
        style={{ height: heightPx }}
      />
    </div>
  );
}
