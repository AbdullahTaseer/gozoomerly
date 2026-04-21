import { Skeleton, SkeletonCircle, SkeletonRepeat, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonBoardCardProps = {
  className?: string;
};

/** Placeholder for `DynamicBoardCard` — gradient header + dark stat footer. */
export default function SkeletonBoardCard({ className }: SkeletonBoardCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl bg-white shadow-lg",
        className,
      )}
      aria-hidden
    >
      <div className="relative bg-neutral-200/70 p-6">
        <Skeleton tone="inset" className="mb-4 h-5 w-2/3" />

        <div className="mb-4 flex items-start gap-3">
          <SkeletonCircle tone="inset" className="h-14 w-14" />
          <div className="flex-1 space-y-2 py-1">
            <SkeletonText tone="inset" className="h-4 w-1/2" />
            <SkeletonText tone="insetMuted" className="h-3 w-4/5" />
          </div>
        </div>

        <div className="mb-4 space-y-2">
          <SkeletonText tone="insetMuted" className="h-3 w-full" />
          <SkeletonText tone="insetMuted" className="h-3 w-11/12" />
          <SkeletonText tone="insetMuted" className="h-3 w-3/4" />
        </div>

        <Skeleton tone="inset" className="h-3 w-full rounded-full" />
        <div className="mt-2 flex justify-between">
          <SkeletonText tone="insetMuted" className="h-3 w-20" />
          <SkeletonText tone="insetMuted" className="h-3 w-20" />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-around gap-4 bg-[#2A2A2A] p-6">
        <SkeletonRepeat count={4}>
          {() => (
            <div className="flex flex-col items-center gap-2">
              <Skeleton tone="onDark" className="h-5 w-8" />
              <Skeleton tone="onDarkFaint" className="h-2.5 w-14" />
            </div>
          )}
        </SkeletonRepeat>
      </div>
    </div>
  );
}
