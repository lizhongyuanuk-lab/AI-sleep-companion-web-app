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
  | "recommendation_ready"
  | "fallback_ready";

export type HomeContinuitySource = "memory" | "sleep" | "talk" | "room" | "none";

export type HomeDiagnosticsNavTarget = "talk" | "room" | "memory" | "sleep";

export type HomeState = {
  id: EntityId;
  route: "/home";
  status: HomeStateStatus;
  continuitySource?: HomeContinuitySource;
  entryContextId: EntityId;
  mainRecommendationId: EntityId;
  mainCtaId: EntityId;
  continuitySummary?: string;
  diagnosticsNavTargets?: HomeDiagnosticsNavTarget[];
  createdAt: ISODateTimeString;
};

export type HomeRecommendationType =
  | "review_memory"
  | "start_talk"
  | "sleep_checkin"
  | "tonight_suggestion";

export type HomeRecommendationSource =
  | "memory"
  | "talk_session"
  | "sleep_log"
  | "sleep_insight"
  | "room_session"
  | "system_default";

export type HomeRecommendationSourceDomain =
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

export type HomeCTA = {
  id: EntityId;
  label: string;
  target: "talk";
  targetPath: "/talk";
  homeRecommendationId: EntityId;
  entryContext: TalkEntryContext;
  createdAt: ISODateTimeString;
};

export type HomeEntryContextSourceRecommendationType = HomeRecommendationType;

export type HomeEntryContextMissingDataKey =
  | "route_decision"
  | "latest_talk_session"
  | "latest_room_session"
  | "latest_sleep_log"
  | "latest_sleep_insight"
  | "eligible_memory"
  | "source_recommendation";

export type HomeEntryContextStaleDataKey =
  | "active_onboarding_preset"
  | "latest_sleep_log"
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
  latestSleepLogId?: EntityId;
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
