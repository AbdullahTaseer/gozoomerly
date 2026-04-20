import * as React from "react";
import { cn } from "@/lib/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: keyof React.JSX.IntrinsicElements;
};

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
