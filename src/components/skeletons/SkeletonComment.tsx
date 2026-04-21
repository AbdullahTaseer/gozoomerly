import { SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonCommentProps = {
  className?: string;
};

/** Single comment thread row. */
export default function SkeletonComment({ className }: SkeletonCommentProps) {
  return (
    <div className={cn("flex gap-3", className)} aria-hidden>
      <SkeletonCircle className="h-9 w-9 shrink-0" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="space-y-2 rounded-2xl bg-neutral-100 p-3">
          <SkeletonText tone="steel" className="h-3 max-w-[30%]" />
          <SkeletonText tone="steelMuted" className="h-3 w-full" />
          <SkeletonText tone="steelMuted" className="h-3 max-w-[70%]" />
        </div>
        <div className="flex gap-3 pl-1">
          <SkeletonText className="h-2.5 w-16" />
          <SkeletonText className="h-2.5 w-12" />
        </div>
      </div>
    </div>
  );
}
