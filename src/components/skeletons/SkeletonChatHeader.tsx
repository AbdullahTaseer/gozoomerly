import { SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonChatHeaderProps = {
  className?: string;
};

/** Chat thread header (avatar + title + subtitle). */
export default function SkeletonChatHeader({ className }: SkeletonChatHeaderProps) {
  return (
    <div className={cn("flex items-center gap-3", className)} aria-hidden>
      <SkeletonCircle className="h-10 w-10" />
      <div className="min-w-0 flex-1 space-y-2">
        <SkeletonText className="h-4 max-w-[10rem]" />
        <SkeletonText tone="soft" className="h-3 max-w-[5rem]" />
      </div>
    </div>
  );
}
