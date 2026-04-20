import { SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonCommentProps = {
  className?: string;
};

/**
 * Placeholder for a single comment/reply row. Mirrors: circular avatar, a
 * bold author line, a 1-2 line comment body, and a small meta-line
 * (timestamp + reply action).
 */
export default function SkeletonComment({ className }: SkeletonCommentProps) {
  return (
    <div className={cn("flex gap-3", className)} aria-hidden>
      <SkeletonCircle className="h-9 w-9 shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="rounded-2xl bg-neutral-100 p-3 space-y-2">
          <SkeletonText className="h-3 max-w-[30%] bg-neutral-300/60" />
          <SkeletonText className="h-3 w-full bg-neutral-300/50" />
          <SkeletonText className="h-3 max-w-[70%] bg-neutral-300/50" />
        </div>
        <div className="flex items-center gap-4 pl-2">
          <SkeletonText className="h-2.5 w-16" />
          <SkeletonText className="h-2.5 w-12" />
        </div>
      </div>
    </div>
  );
}
