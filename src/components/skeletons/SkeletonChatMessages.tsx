import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type SkeletonChatMessagesProps = {
  /** How many message bubbles to render. Defaults to 6. */
  count?: number;
  className?: string;
};

/**
 * Placeholder for a chat message list. Renders an alternating stack of
 * message "bubbles" so the transcript has visible structure while the real
 * messages load.
 */
export default function SkeletonChatMessages({
  count = 6,
  className,
}: SkeletonChatMessagesProps) {
  return (
    <div className={cn("flex flex-col gap-3 p-3", className)} aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const isOutgoing = i % 2 === 0;
        const width = 40 + ((i * 17) % 40);
        return (
          <div
            key={i}
            className={cn(
              "flex",
              isOutgoing ? "justify-end" : "justify-start"
            )}
          >
            <Skeleton
              className={cn(
                "h-10 rounded-2xl",
                isOutgoing
                  ? "bg-pink-200/50 rounded-br-sm"
                  : "bg-neutral-200/70 rounded-bl-sm"
              )}
              style={{ width: `${width}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}
