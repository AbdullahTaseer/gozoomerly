import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonProfileHeaderProps = {
  className?: string;
};

/**
 * Placeholder for the gradient profile header used in `/u/profile` and
 * `/u/visitProfile/[id]`. Mirrors: gradient banner + avatar + name + birthday
 * + follower/following counters.
 */
export default function SkeletonProfileHeader({
  className,
}: SkeletonProfileHeaderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#845CBA]/70 to-[#F43C83]/70 p-10 max-[500px]:p-4",
        className
      )}
      aria-hidden
    >
      <div className="relative z-10 flex max-[630px]:items-start items-center max-[630px]:flex-col justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <SkeletonCircle className="h-20 w-20 bg-white/40" />
          <div className="min-w-0 space-y-2">
            <Skeleton className="h-5 w-40 bg-white/60" />
            <SkeletonText className="h-3 w-28 bg-white/50" />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-6 max-[630px]:w-full max-[630px]:justify-center">
          <div className="space-y-2 text-center">
            <Skeleton className="mx-auto h-5 w-10 bg-white/60" />
            <Skeleton className="mx-auto h-3 w-14 bg-white/40" />
          </div>
          <div className="space-y-2 text-center">
            <Skeleton className="mx-auto h-5 w-10 bg-white/60" />
            <Skeleton className="mx-auto h-3 w-14 bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
}
