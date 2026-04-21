import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonChatMessagesProps = {
  count?: number;
  className?: string;
};

const OUTGOING_WIDTHS = ["w-[58%]", "w-[72%]", "w-[48%]", "w-[65%]", "w-[52%]", "w-[68%]"] as const;
const INCOMING_WIDTHS = ["w-[55%]", "w-[70%]", "w-[50%]", "w-[62%]", "w-[45%]", "w-[66%]"] as const;

/** Alternating chat bubbles while messages load. */
export default function SkeletonChatMessages({
  count = 6,
  className,
}: SkeletonChatMessagesProps) {
  return (
    <div className={cn("flex flex-col gap-3 p-3", className)} aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const outgoing = i % 2 === 0;
        const widthClass = outgoing
          ? OUTGOING_WIDTHS[i % OUTGOING_WIDTHS.length]
          : INCOMING_WIDTHS[i % INCOMING_WIDTHS.length];
        return (
          <div
            key={i}
            className={cn("flex", outgoing ? "justify-end" : "justify-start")}
          >
            <Skeleton
              tone={outgoing ? "blush" : "default"}
              className={cn(
                "h-10 rounded-2xl",
                widthClass,
                outgoing ? "rounded-br-sm" : "rounded-bl-sm",
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
