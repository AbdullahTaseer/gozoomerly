import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonPlanCardProps = {
  className?: string;
};

/**
 * Placeholder for `PlanCard` on the subscription plans page. Mirrors: price,
 * plan name, a list of features with checkmarks, and a CTA button.
 */
export default function SkeletonPlanCard({
  className,
}: SkeletonPlanCardProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-[600px]:w-[320px] max-[350px]:w-[95%] rounded-2xl border-2 border-gray-200 p-[15px] shadow-sm",
        className
      )}
      aria-hidden
    >
      <Skeleton className="mx-auto h-10 w-24" />
      <SkeletonText className="mx-auto mt-3 h-5 w-32" />

      <ul className="mt-6 space-y-3 pl-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full shrink-0" />
            <SkeletonText className="h-4 flex-1 max-w-[80%]" />
          </li>
        ))}
      </ul>

      <Skeleton className="mt-6 h-11 w-full rounded-full" />
    </div>
  );
}
