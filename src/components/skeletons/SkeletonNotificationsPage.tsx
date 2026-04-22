import { SkeletonCircle, SkeletonRepeat, SkeletonText } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonNotificationsPageProps = {
  rowCount?: number;
  className?: string;
};

function Row() {
  return (
    <div className="mt-4 flex w-full items-center gap-4 rounded-[8px] bg-[#F7F7F7] p-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white p-2">
        <SkeletonCircle className="h-10 w-10" />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <SkeletonText className="h-5 max-w-[min(100%,280px)] rounded-sm max-[768px]:h-4" />
        <SkeletonText className="h-3.5 max-w-full" />
        <SkeletonText className="h-3.5 max-w-[72%]" />
        <SkeletonText className="mt-1 h-3 w-28" />
      </div>
    </div>
  );
}

export default function SkeletonNotificationsPage({
  rowCount = 6,
  className,
}: SkeletonNotificationsPageProps) {
  return (
    <div className={cn("space-y-0", className)} aria-hidden>
      <SkeletonRepeat count={rowCount}>
        {() => <Row />}
      </SkeletonRepeat>
    </div>
  );
}
