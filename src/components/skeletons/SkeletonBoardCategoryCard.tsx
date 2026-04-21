import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonBoardCategoryCardProps = {
  className?: string;
};

/** Placeholder for `BoardCategoryCard` on All Boards. */
export default function SkeletonBoardCategoryCard({ className }: SkeletonBoardCategoryCardProps) {
  return (
    <div
      className={cn(
        "flex h-48 flex-col items-center justify-center gap-4 rounded-2xl bg-neutral-200/70 p-6 shadow-lg",
        className,
      )}
      aria-hidden
    >
      <Skeleton tone="inset" className="h-20 w-20 rounded-full" />
      <Skeleton tone="inset" className="h-4 w-28" />
    </div>
  );
}
