import { Skeleton } from "@/components/ui/skeleton";
import SkeletonProfileHeader from "./SkeletonProfileHeader";
import SkeletonMediaGrid from "./SkeletonMediaGrid";
import { cn } from "@/lib/utils";

type SkeletonProfilePageProps = {
  featureTileCount?: number;
  withPostsGrid?: boolean;
  className?: string;
};

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
