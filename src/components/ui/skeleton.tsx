import * as React from "react";
import { cn } from "@/lib/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: keyof React.JSX.IntrinsicElements;
};

/**
 * Low-level skeleton primitive. Renders an animated placeholder block that
 * inherits its size from the surrounding layout or from utility classes.
 *
 * Prefer composing these inside the higher-level skeletons under
 * `@/components/skeletons/*` when representing a real UI element.
 */
function Skeleton({
  className,
  as: Tag = "div",
  ...props
}: SkeletonProps) {
  const Component = Tag as React.ElementType;
  return (
    <Component
      data-slot="skeleton"
      aria-hidden
      className={cn(
        "animate-pulse rounded-md bg-neutral-200/70 dark:bg-neutral-700/50",
        className
      )}
      {...props}
    />
  );
}

/**
 * Circle-shaped skeleton. Handy for avatars and icon slots.
 * Sizes default to a 40px circle — override with `className` (e.g. `h-12 w-12`).
 */
function SkeletonCircle({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      className={cn("h-10 w-10 rounded-full", className)}
      {...props}
    />
  );
}

/**
 * Single text-line skeleton. Defaults to a 14px-tall rounded bar.
 * Use `className` to control width (e.g. `w-1/2`, `max-w-[10rem]`).
 */
function SkeletonText({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Skeleton
      className={cn("h-3.5 w-full rounded", className)}
      {...props}
    />
  );
}

export { Skeleton, SkeletonCircle, SkeletonText };
export type { SkeletonProps };
