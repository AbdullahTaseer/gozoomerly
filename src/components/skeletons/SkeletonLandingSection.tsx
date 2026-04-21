import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonLandingSectionProps = {
  minHeightPx?: number;
  className?: string;
  withCopy?: boolean;
};

/** Large marketing block placeholder for dynamic sections. */
export default function SkeletonLandingSection({
  minHeightPx = 400,
  className,
  withCopy = true,
}: SkeletonLandingSectionProps) {
  return (
    <div className={cn("w-full py-12 md:py-16", className)} aria-hidden>
      <div className="mx-auto max-w-6xl px-4">
        {withCopy && (
          <>
            <Skeleton className="mb-6 h-8 w-48" />
            <SkeletonText tone="soft" className="mb-4 h-4 max-w-2xl" />
          </>
        )}
        <Skeleton tone="panel" className="w-full rounded-2xl" style={{ minHeight: minHeightPx }} />
      </div>
    </div>
  );
}
