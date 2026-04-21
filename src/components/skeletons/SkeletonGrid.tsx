import type { ReactNode } from "react";
import { SkeletonRepeat } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonGridProps = {
  /**
   * A render function that returns a skeleton for a single cell. Called `count`
   * times with the zero-based index of each cell.
   */
  renderItem: (index: number) => ReactNode;
  /** Number of skeleton cells to render. */
  count: number;
  /** Extra classes for the grid container (Tailwind `grid-cols-*`, gaps, etc.). */
  className?: string;
};

/**
 * Renders a grid of skeleton cells. Use this whenever you'd otherwise map
 * `[1,2,3,4]` to placeholder divs.
 *
 * @example
 * <SkeletonGrid
 *   count={6}
 *   className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
 *   renderItem={() => <SkeletonFollowingCard />}
 * />
 */
export default function SkeletonGrid({
  renderItem,
  count,
  className,
}: SkeletonGridProps) {
  return (
    <div className={cn("grid", className)} aria-hidden>
      <SkeletonRepeat count={count}>{(i) => renderItem(i)}</SkeletonRepeat>
    </div>
  );
}
