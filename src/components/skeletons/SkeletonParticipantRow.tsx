import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonParticipantRowProps = {
  className?: string;
};

/**
 * Placeholder for a participant / invitee row used in board-slug tabs
 * (`BoardSlugParticipants`, `BoardSlugInvited`). Mirrors: light-gray pill row
 * with avatar, name + meta lines, and a trailing follow/view button.
 */
export default function SkeletonParticipantRow({
  className,
}: SkeletonParticipantRowProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-[12px] bg-[#F4F4F4] px-4 py-3",
        className
      )}
      aria-hidden
    >
      <div className="flex flex-1 min-w-0 items-center gap-3">
        <SkeletonCircle className="h-12 w-12 shrink-0 bg-neutral-300/70" />
        <div className="flex-1 min-w-0 space-y-2">
          <SkeletonText className="h-4 max-w-[50%] bg-neutral-300/70" />
          <SkeletonText className="h-3 max-w-[70%] bg-neutral-300/50" />
        </div>
      </div>
      <Skeleton className="h-8 w-24 rounded-full bg-neutral-300/70" />
    </div>
  );
}
