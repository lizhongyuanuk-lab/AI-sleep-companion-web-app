import type { TalkEntryContext } from "./conversation";
import type { EntityId, ISODateTimeString } from "./shared";

export type RouteDecisionReason =
  | "onboarding_incomplete"
  | "active_preset_redirect"
  | "returning_user_home"
  | "consumed_or_expired_preset_home";

export type RouteDecisionCanonicalRoute = "/onboarding" | "/room" | "/home";

export type RouteDecisionRuntimeObservedPath =
  | "/"
  | "/onboarding"
  | "/room"
  | "/home";

export type RouteDecisionActivePresetState =
  | "none"
  | "active"
  | "consumed"
  | "expired"
  | "stale";

export type RouteDecision = {
  id: EntityId;
  canonicalRoute: RouteDecisionCanonicalRoute;
  reason: RouteDecisionReason;
  runtimeObservedPath?: RouteDecisionRuntimeObservedPath;
  hasCompletedOnboarding: boolean;
  activePresetId?: EntityId;
  activePresetState: RouteDecisionActivePresetState;
  shouldRedirect: boolean;
  createdAt: ISODateTimeString;
};

export type HomeStateStatus =
  | "entry_guard_redirect"
  | "default_recommendation_ready"
  | "continuity_available"
  | "memory_eligible_continuity"
  | "sleep_eligible_continuity"
  | "system_default_fallback"
  | "data_partial_fallback"
  | "error_safe_fallback";

export type HomeNavTarget = "talk" | "room" | "memory" | "sleep";

export type HomeState = {
  id: EntityId;
  route: "/home";
  status: HomeStateStatus;
  entryContextId: EntityId;
  mainRecommendationId: EntityId;
  mainCtaId: EntityId;
  continuitySummary?: string;
  availableNavTargets: HomeNavTarget[];
  createdAt: ISODateTimeString;
};

export type HomeRecommendationType =
  | "complete_onboarding"
  | "enter_room"
  | "review_memory"
  | "start_talk"
  | "sleep_checkin"
  | "tonight_suggestion";

export type HomeRecommendationSource =
  | "onboarding_preset"
  | "memory"
  | "talk_session"
  | "sleep_log"
  | "sleep_insight"
  | "room_session"
  | "system_default";

export type HomeRecommendationSourceDomain =
  | "onboarding"
  | "memory"
  | "talk"
  | "sleep"
  | "room"
  | "system";

export type HomeRecommendationFallbackKind =
  | "none"
  | "system_default_fallback"
  | "data_partial_fallback"
  | "error_safe_fallback";

export type HomeCtaTarget = "onboarding" | "room" | "talk" | "memory" | "sleep";

export type HomeCtaTargetPath =
  | "/onboarding"
  | "/room"
  | "/talk"
  | "/memory"
  | "/sleep-monitoring";

export type HomeCTA = {
  id: EntityId;
  label: string;
  target: HomeCtaTarget;
  targetPath: HomeCtaTargetPath;
  homeRecommendationId: EntityId;
  entryContext?: TalkEntryContext;
  createdAt: ISODateTimeString;
};

export type HomeEntryContextSourceRecommendationType = HomeRecommendationType;

export type HomeEntryContextMissingDataKey =
  | "route_decision"
  | "latest_talk_session"
  | "latest_room_session"
  | "latest_sleep_check_in"
  | "latest_sleep_insight"
  | "eligible_memory"
  | "source_recommendation";

export type HomeEntryContextStaleDataKey =
  | "active_onboarding_preset"
  | "latest_sleep_check_in"
  | "latest_sleep_insight"
  | "eligible_memory"
  | "source_recommendation";

export type HomeEntryContextActivePresetState =
  | "none"
  | "active_redirect"
  | "consumed"
  | "expired"
  | "stale";

export type HomeEntryContext = {
  id: EntityId;
  routeDecisionId: EntityId;
  routeDecisionReason: RouteDecision["reason"];
  canonicalHomePath: "/home";
  runtimeObservedPath?: "/" | "/home";
  sourceRecommendationId?: EntityId;
  sourceRecommendationType?: HomeEntryContextSourceRecommendationType;
  latestTalkSessionId?: EntityId;
  latestRoomSessionId?: EntityId;
  latestSleepInsightId?: EntityId;
  latestSleepCheckInId?: EntityId;
  eligibleMemoryId?: EntityId;
  missingDataKeys: HomeEntryContextMissingDataKey[];
  staleDataKeys: HomeEntryContextStaleDataKey[];
  activePresetState: HomeEntryContextActivePresetState;
  createdAt: ISODateTimeString;
};

export type HomeRecommendation = {
  id: EntityId;
  type: HomeRecommendationType;
  title: string;
  body?: string;
  priority: number;
  source: HomeRecommendationSource;
  sourceId?: EntityId;
  sourceDomain: HomeRecommendationSourceDomain;
  surface: "home_main";
  fallbackKind: HomeRecommendationFallbackKind;
  cta: HomeCTA;
  createdAt: ISODateTimeString;
};

export type Recommendation = HomeRecommendation;
