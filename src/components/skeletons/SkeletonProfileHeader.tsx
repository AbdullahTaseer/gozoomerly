import { Skeleton, SkeletonCircle, SkeletonRepeat, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonProfileHeaderProps = {
  className?: string;
};

/** Gradient profile header (visit profile / own profile). */
export default function SkeletonProfileHeader({ className }: SkeletonProfileHeaderProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#845CBA]/70 to-[#F43C83]/70 p-10 max-[500px]:p-4",
        className,
      )}
      aria-hidden
    >
      <div className="relative z-10 flex max-[630px]:items-start items-center max-[630px]:flex-col justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <SkeletonCircle tone="insetDim" className="h-20 w-20" />
          <div className="min-w-0 space-y-2">
            <Skeleton tone="inset" className="h-5 w-40" />
            <SkeletonText tone="insetMuted" className="h-3 w-28" />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-6 max-[630px]:w-full max-[630px]:justify-center">
          <SkeletonRepeat count={2}>
            {() => (
              <div className="space-y-2 text-center">
                <Skeleton tone="inset" className="mx-auto h-5 w-10" />
                <Skeleton tone="insetDim" className="mx-auto h-3 w-14" />
              </div>
            )}
          </SkeletonRepeat>
        </div>
      </div>
    </div>
  );
}
