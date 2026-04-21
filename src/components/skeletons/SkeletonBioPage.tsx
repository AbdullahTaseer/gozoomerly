import { Skeleton, SkeletonCircle, SkeletonRepeat, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonBioPageProps = {
  className?: string;
};

/** Full-page placeholder for `/u/bio`. */
export default function SkeletonBioPage({ className }: SkeletonBioPageProps) {
  return (
    <div className={cn("space-y-6", className)} aria-hidden>
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-8 w-24" />
      </div>

      <div className="relative overflow-hidden rounded-[24px] bg-[#1B1D26]/90 px-6 py-16 max-[1100px]:py-10">
        <div className="grid grid-cols-4 max-[1300px]:grid-cols-2 max-[900px]:grid-cols-1 gap-4">
          <SkeletonRepeat count={4}>
            {() => (
              <div className="flex items-center max-[900px]:flex-col gap-3">
                <SkeletonCircle tone="onDark" className="h-14 w-14 shrink-0" />
                <div className="flex-1 space-y-2 max-[900px]:text-center">
                  <SkeletonText tone="onDark" className="h-3 w-20" />
                  <SkeletonText tone="insetFaint" className="h-4 w-28" />
                </div>
              </div>
            )}
          </SkeletonRepeat>
        </div>
      </div>

      <div className="space-y-3">
        <SkeletonRepeat count={3}>
          {() => <Skeleton className="h-24 w-full rounded-2xl" />}
        </SkeletonRepeat>
      </div>
    </div>
  );
}
