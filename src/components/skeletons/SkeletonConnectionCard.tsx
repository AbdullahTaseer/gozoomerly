import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonConnectionCardProps = {
  className?: string;
};

/** Placeholder for connection list rows. */
export default function SkeletonConnectionCard({ className }: SkeletonConnectionCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border border-neutral-200/70 bg-white p-3",
        className,
      )}
      aria-hidden
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SkeletonCircle tone="steel" className="h-11 w-11 shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonText tone="steel" className="h-5 max-w-[60%]" />
          <SkeletonText tone="steelMuted" className="h-3 max-w-[40%]" />
        </div>
      </div>
      <Skeleton tone="steel" className="h-9 w-20 shrink-0 rounded-full" />
    </div>
  );
}
