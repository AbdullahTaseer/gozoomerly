import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonInvitationCardProps = {
  className?: string;
};

/** Placeholder for `InvitationBoardCard`. */
export default function SkeletonInvitationCard({ className }: SkeletonInvitationCardProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[13px] bg-neutral-200/70 p-4",
        className,
      )}
      aria-hidden
    >
      <Skeleton tone="inset" className="h-7 w-2/3" />

      <div className="flex items-center gap-4">
        <SkeletonCircle tone="inset" className="h-14 w-14" />
        <div className="space-y-2">
          <SkeletonText tone="inset" className="h-4 w-36" />
          <Skeleton tone="insetMuted" className="h-5 w-20 rounded-full" />
        </div>
      </div>

      <div className="flex gap-3">
        <Skeleton tone="insetStrong" className="h-11 flex-1 rounded-full" />
        <Skeleton tone="insetDim" className="h-11 flex-1 rounded-full" />
      </div>
    </div>
  );
}
