import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonBoardCardProps = {
  className?: string;
};

/**
 * Placeholder for `DynamicBoardCard` — used by `BoardsList` and any grid that
 * renders board cards. Mirrors the real card: warm gradient header with
 * avatar/title/progress, dark footer with stat columns.
 */
export default function SkeletonBoardCard({ className }: SkeletonBoardCardProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-xl bg-white shadow-lg",
        className
      )}
      aria-hidden
    >
      <div className="relative bg-neutral-200/70 p-6">
        <Skeleton className="mb-4 h-5 w-2/3 bg-white/60" />

        <div className="mb-4 flex items-start gap-3">
          <SkeletonCircle className="h-14 w-14 bg-white/60" />
          <div className="flex-1 space-y-2 py-1">
            <SkeletonText className="h-4 w-1/2 bg-white/60" />
            <SkeletonText className="h-3 w-4/5 bg-white/50" />
          </div>
        </div>

        <div className="mb-4 space-y-2">
          <SkeletonText className="h-3 w-full bg-white/50" />
          <SkeletonText className="h-3 w-11/12 bg-white/50" />
          <SkeletonText className="h-3 w-3/4 bg-white/50" />
        </div>

        <Skeleton className="h-3 w-full rounded-full bg-white/60" />
        <div className="mt-2 flex justify-between">
          <SkeletonText className="h-3 w-20 bg-white/50" />
          <SkeletonText className="h-3 w-20 bg-white/50" />
        </div>
      </div>

      <div className="flex flex-1 items-center justify-around gap-4 bg-[#2A2A2A] p-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="h-5 w-8 bg-white/20" />
            <Skeleton className="h-2.5 w-14 bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
