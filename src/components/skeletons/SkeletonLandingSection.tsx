import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonLandingSectionProps = {
  /** Minimum height of the placeholder area. Defaults to 400px. */
  minHeightPx?: number;
  className?: string;
  /** When true, render the header/body block (title + lead paragraph). */
  withCopy?: boolean;
};

/**
 * Placeholder for large marketing/landing sections that are loaded via
 * `next/dynamic`. Keeps layout height stable so the page doesn't jump when
 * the real section hydrates in.
 */
export default function SkeletonLandingSection({
  minHeightPx = 400,
  className,
  withCopy = true,
}: SkeletonLandingSectionProps) {
  return (
    <div
      className={cn("w-full py-12 md:py-16", className)}
      aria-hidden
    >
      <div className="mx-auto max-w-6xl px-4">
        {withCopy && (
          <>
            <Skeleton className="mb-6 h-8 w-48" />
            <SkeletonText className="mb-4 h-4 max-w-2xl bg-neutral-200/50" />
          </>
        )}
        <Skeleton
          className="w-full rounded-2xl bg-neutral-200/60"
          style={{ minHeight: minHeightPx }}
        />
      </div>
    </div>
  );
}
