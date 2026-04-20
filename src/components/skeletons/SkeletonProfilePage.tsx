import { Skeleton } from "@/components/ui/skeleton";
import SkeletonProfileHeader from "./SkeletonProfileHeader";
import SkeletonMediaGrid from "./SkeletonMediaGrid";
import { cn } from "@/lib/utils";

type SkeletonProfilePageProps = {
  /** Number of feature tiles to render below the header. */
  featureTileCount?: number;
  /** Whether to render a posts grid below the tabs. */
  withPostsGrid?: boolean;
  className?: string;
};

/**
 * Full-page placeholder for the user profile and visit-profile screens. Stacks
 * a gradient header, a grid of feature tiles, a tab row, and a media grid.
 * Using this instead of a lone spinner keeps the page layout stable while the
 * real content hydrates.
 */
export default function SkeletonProfilePage({
  featureTileCount = 4,
  withPostsGrid = true,
  className,
}: SkeletonProfilePageProps) {
  return (
    <div
      className={cn("max-w-[748px] mx-auto space-y-6", className)}
      aria-hidden
    >
      <SkeletonProfileHeader />

      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: featureTileCount }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-[72px] rounded-xl border border-gray-200 bg-white"
          />
        ))}
      </div>

      <div className="flex items-center gap-2 border-b border-gray-200">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>

      {withPostsGrid ? <SkeletonMediaGrid count={6} className="mt-6" /> : null}
    </div>
  );
}
