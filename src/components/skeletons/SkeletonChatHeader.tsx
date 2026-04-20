import { SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonChatHeaderProps = {
  className?: string;
};

/**
 * Placeholder used in the chat pane header while the selected conversation's
 * metadata (avatar/name/status) is being fetched.
 */
export default function SkeletonChatHeader({
  className,
}: SkeletonChatHeaderProps) {
  return (
    <div className={cn("flex items-center gap-3", className)} aria-hidden>
      <SkeletonCircle className="h-10 w-10" />
      <div className="min-w-0 flex-1 space-y-2 py-0.5">
        <SkeletonText className="h-4 max-w-[10rem]" />
        <SkeletonText className="h-3 max-w-[5rem] bg-neutral-200/50" />
      </div>
    </div>
  );
}
