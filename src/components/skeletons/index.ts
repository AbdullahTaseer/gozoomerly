/**
 * Screen-level skeletons + primitives.
 *
 * Primitives (`Skeleton`, `tone`, `SkeletonRepeat`, …) live in
 * `@/components/ui/skeleton` and are re-exported here for convenience.
 *
 * Prefer `tone="inset"` / `tone="steel"` over long `bg-…` strings, and
 * `<SkeletonRepeat count={n}>{(i) => …}</SkeletonRepeat>` over `Array.from`.
 */
export {
  Skeleton,
  SkeletonCircle,
  SkeletonRepeat,
  SkeletonText,
  SKELETON_TONES,
} from "@/components/ui/skeleton";
export type { SkeletonTone } from "@/components/ui/skeleton";

export { default as SkeletonGrid } from "./SkeletonGrid";

export { default as SkeletonBoardCard } from "./SkeletonBoardCard";
export { default as SkeletonFollowingCard } from "./SkeletonFollowingCard";
export { default as SkeletonInvitationCard } from "./SkeletonInvitationCard";
export { default as SkeletonSpotlightCard } from "./SkeletonSpotlightCard";
export { default as SkeletonExploreCard } from "./SkeletonExploreCard";
export { default as SkeletonBoardCategoryCard } from "./SkeletonBoardCategoryCard";
export { default as SkeletonListItem } from "./SkeletonListItem";
export { default as SkeletonNotificationsPage } from "./SkeletonNotificationsPage";
export { default as SkeletonChatHeader } from "./SkeletonChatHeader";
export { default as SkeletonLandingSection } from "./SkeletonLandingSection";

export { default as SkeletonConnectionCard } from "./SkeletonConnectionCard";
export { default as SkeletonCircleCard } from "./SkeletonCircleCard";
export { default as SkeletonProfileHeader } from "./SkeletonProfileHeader";
export { default as SkeletonProfilePage } from "./SkeletonProfilePage";
export { default as SkeletonBioPage } from "./SkeletonBioPage";
export { default as SkeletonFavBoardRow } from "./SkeletonFavBoardRow";
export { default as SkeletonPlanCard } from "./SkeletonPlanCard";
export { default as SkeletonComment } from "./SkeletonComment";
export { default as SkeletonFeedCard } from "./SkeletonFeedCard";
export { default as SkeletonChatMessages } from "./SkeletonChatMessages";
export { default as SkeletonMediaGrid } from "./SkeletonMediaGrid";
export { default as SkeletonParticipantRow } from "./SkeletonParticipantRow";
export { default as SkeletonPageCenter } from "./SkeletonPageCenter";
export { default as SkeletonLikeCard } from "./SkeletonLikeCard";
