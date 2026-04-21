import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonParticipantRowProps = {
  className?: string;
};

/** Board participant list row. */
export default function SkeletonParticipantRow({ className }: SkeletonParticipantRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-xl border border-neutral-200/70 bg-white p-3",
        className,
      )}
      aria-hidden
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SkeletonCircle tone="steel" className="h-12 w-12 shrink-0" />
        <div className="min-w-0 flex-1 space-y-2">
          <SkeletonText tone="steel" className="h-4 max-w-[50%]" />
          <SkeletonText tone="steelMuted" className="h-3 max-w-[70%]" />
        </div>
      </div>
      <Skeleton tone="steel" className="h-8 w-24 shrink-0 rounded-full" />
    </div>
  );
}
