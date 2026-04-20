import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonInvitationCardProps = {
  className?: string;
};

/**
 * Placeholder for `InvitationBoardCard`. Mirrors the card's shape: background
 * image area, title, inviter row with avatar, and two action buttons.
 */
export default function SkeletonInvitationCard({
  className,
}: SkeletonInvitationCardProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-[13px] bg-neutral-200/70 p-4",
        className
      )}
      aria-hidden
    >
      <Skeleton className="h-7 w-2/3 bg-white/60" />

      <div className="flex items-center gap-4">
        <SkeletonCircle className="h-13 w-13 bg-white/60" />
        <div className="space-y-2">
          <SkeletonText className="h-4 w-36 bg-white/60" />
          <Skeleton className="h-5 w-20 rounded-full bg-white/50" />
        </div>
      </div>

      <div className="flex gap-3">
        <Skeleton className="h-11 flex-1 rounded-full bg-white/70" />
        <Skeleton className="h-11 flex-1 rounded-full bg-white/40" />
      </div>
    </div>
  );
}
