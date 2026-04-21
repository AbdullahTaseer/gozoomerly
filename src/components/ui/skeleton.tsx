import * as React from "react";
import { cn } from "@/lib/utils";

/** Named fills so screens don’t repeat long `bg-…` class strings. */
const SKELETON_TONES = {
  default: "bg-neutral-200/70 dark:bg-neutral-700/50",
  soft: "bg-neutral-200/50 dark:bg-neutral-700/40",
  panel: "bg-neutral-200/60 dark:bg-neutral-700/45",
  /** Light “pills” on neutral cards (category row, etc.). */
  inset: "bg-white/60",
  insetMuted: "bg-white/50",
  insetDim: "bg-white/40",
  insetFaint: "bg-white/30",
  insetStrong: "bg-white/70",
  /** Stat / footer rows on dark bars. */
  onDark: "bg-white/20",
  onDarkFaint: "bg-white/10",
  /** List rows / chips on gray rails. */
  steel: "bg-neutral-300/70",
  steelMuted: "bg-neutral-300/50",
  steelSoft: "bg-neutral-300/60",
  /** Outgoing chat bubble hint. */
  blush: "bg-pink-200/50",
} as const;

export type SkeletonTone = keyof typeof SKELETON_TONES;

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: keyof React.JSX.IntrinsicElements;
  /** Preset fill; omit and set `className` for one-offs. */
  tone?: SkeletonTone;
};

function Skeleton({ className, as: Tag = "div", tone = "default", ...props }: SkeletonProps) {
  const Component = Tag as React.ElementType;
  return (
    <Component
      data-slot="skeleton"
      aria-hidden
      className={cn("animate-pulse rounded-md", SKELETON_TONES[tone], className)}
      {...props}
    />
  );
}

export type SkeletonCircleProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: SkeletonTone;
};

function SkeletonCircle({ className, tone = "default", ...props }: SkeletonCircleProps) {
  return <Skeleton tone={tone} className={cn("h-10 w-10 rounded-full", className)} {...props} />;
}

export type SkeletonTextProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: SkeletonTone;
};

function SkeletonText({ className, tone = "default", ...props }: SkeletonTextProps) {
  return <Skeleton tone={tone} className={cn("h-3.5 w-full rounded", className)} {...props} />;
}

export type SkeletonRepeatProps = {
  count: number;
  children: (index: number) => React.ReactNode;
  /** Wrapper element for each item (e.g. `li` inside a `ul`). */
  as?: keyof React.JSX.IntrinsicElements;
  /** Tailwind classes applied to each `as` wrapper. */
  itemClassName?: string;
};

/**
 * Renders `count` skeleton cells without manual `Array.from` noise.
 * Use `as="li"` + `itemClassName` when the parent is a list.
 */
function SkeletonRepeat({ count, children, as, itemClassName }: SkeletonRepeatProps) {
  const Tag = as;
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const node = children(i);
        if (!Tag) {
          return <React.Fragment key={i}>{node}</React.Fragment>;
        }
        return React.createElement(Tag, { key: i, className: itemClassName }, node);
      })}
    </>
  );
}

export { Skeleton, SkeletonCircle, SkeletonRepeat, SkeletonText, SKELETON_TONES };
