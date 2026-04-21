import { Skeleton, SkeletonRepeat, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonPlanCardProps = {
  className?: string;
};

/** Placeholder for subscription `PlanCard`. */
export default function SkeletonPlanCard({ className }: SkeletonPlanCardProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-[600px]:w-[320px] max-[350px]:w-[95%] rounded-2xl border-2 border-gray-200 p-[15px] shadow-sm",
        className,
      )}
      aria-hidden
    >
      <Skeleton className="mx-auto h-10 w-24" />
      <SkeletonText className="mx-auto mt-3 h-5 w-32" />

      <ul className="mt-6 space-y-3 pl-4">
        <SkeletonRepeat count={5} as="li" itemClassName="flex items-center gap-3">
          {() => (
            <>
              <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
              <SkeletonText className="h-4 max-w-[80%] flex-1" />
            </>
          )}
        </SkeletonRepeat>
      </ul>

      <Skeleton className="mt-6 h-11 w-full rounded-full" />
    </div>
  );
}
