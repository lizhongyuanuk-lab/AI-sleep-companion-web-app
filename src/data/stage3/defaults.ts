import type {
  CompanionConversation,
  ContractVersion,
  EntityId,
  HomeCTA,
  HomeEntryContext,
  HomeRecommendation,
  HomeState,
  MemoryFeedbackEvent,
  MemoryItem,
  OnboardingPreset,
  OnboardingState,
  RoomSession,
  RoomState,
  RoomView,
  RouteDecision,
  SleepCheckIn,
  SleepInsight,
  SleepSession,
  TalkEntryContext,
  UserProfile,
} from "../../contracts";
import { STAGE3_CONTRACT_VERSION } from "./keys";

export const DEFAULT_STAGE3_TIMESTAMP = "1970-01-01T00:00:00.000Z";
export const DEFAULT_STAGE3_ANONYMOUS_ID = "anon_stage3_local_uninitialized";
export const DEFAULT_ROUTE_DECISION_ID = "route_default";
export const DEFAULT_HOME_ENTRY_CONTEXT_ID = "home_entry_default";
export const DEFAULT_HOME_RECOMMENDATION_ID = "home_rec_default";
export const DEFAULT_HOME_CTA_ID = "home_cta_default";
export const DEFAULT_HOME_STATE_ID = "home_state_default";

export type Stage3OnboardingStore = {
  state: OnboardingState;
  activePreset?: OnboardingPreset;
  latestConsumedPreset?: OnboardingPreset;
  latestExpiredPreset?: OnboardingPreset;
};

export type Stage3HomeStore = {
  routeDecision?: RouteDecision;
  entryContext?: HomeEntryContext;
  homeState?: HomeState;
  recommendation?: HomeRecommendation;
};

export type Stage3ConversationStore = {
  currentConversationId?: EntityId;
  latestConversation?: CompanionConversation;
};

export type Stage3MemoryStore = {
  items: MemoryItem[];
  feedbackEvents: MemoryFeedbackEvent[];
};

export type Stage3SleepStore = {
  latestCheckIn?: SleepCheckIn;
  latestInsight?: SleepInsight;
  latestSession?: SleepSession;
};

export type Stage3RoomStore = {
  latestRoomState?: RoomState;
  latestRoomView?: RoomView;
  latestRoomSession?: RoomSession;
};

export type Stage3MigrationMetadata = {
  localDataVersion: number;
  contractVersion: ContractVersion;
  migratedAt: string;
  lastNormalizedAt: string;
  legacyKeysSeen: string[];
};

export type Stage3LocalDataState = {
  userProfile: UserProfile;
  onboarding: Stage3OnboardingStore;
  home: Stage3HomeStore;
  conversation: Stage3ConversationStore;
  memory: Stage3MemoryStore;
  sleep: Stage3SleepStore;
  room: Stage3RoomStore;
  migration: Stage3MigrationMetadata;
};

export function createDefaultUserProfile(
  now = DEFAULT_STAGE3_TIMESTAMP,
): UserProfile {
  return {
    anonymousId: DEFAULT_STAGE3_ANONYMOUS_ID,
    hasCompletedOnboarding: false,
    createdAt: now,
    updatedAt: now,
  };
}

export function createDefaultOnboardingState(
  now = DEFAULT_STAGE3_TIMESTAMP,
): OnboardingState {
  return {
    status: "not_started",
    updatedAt: now,
  };
}

export function createDefaultTalkEntryContext(
  now = DEFAULT_STAGE3_TIMESTAMP,
  homeRecommendationId = DEFAULT_HOME_RECOMMENDATION_ID,
): TalkEntryContext {
  return {
    source: "home",
    intent: "gentle_start",
    homeRecommendationId,
    createdAt: now,
  };
}

export function createDefaultRouteDecision(
  now = DEFAULT_STAGE3_TIMESTAMP,
): RouteDecision {
  return {
    id: DEFAULT_ROUTE_DECISION_ID,
    canonicalRoute: "/onboarding",
    reason: "onboarding_incomplete",
    hasCompletedOnboarding: false,
    activePresetState: "none",
    shouldRedirect: true,
    createdAt: now,
  };
}

export function createDefaultHomeEntryContext(
  now = DEFAULT_STAGE3_TIMESTAMP,
  routeDecision: RouteDecision = createDefaultRouteDecision(now),
): HomeEntryContext {
  return {
    id: DEFAULT_HOME_ENTRY_CONTEXT_ID,
    routeDecisionId: routeDecision.id,
    routeDecisionReason: routeDecision.reason,
    canonicalHomePath: "/home",
    missingDataKeys: [
      "latest_talk_session",
      "latest_room_session",
      "latest_sleep_check_in",
      "latest_sleep_insight",
      "eligible_memory",
      "source_recommendation",
    ],
    staleDataKeys: [],
    activePresetState: "none",
    createdAt: now,
  };
}

export function createDefaultHomeCTA(
  now = DEFAULT_STAGE3_TIMESTAMP,
  homeRecommendationId = DEFAULT_HOME_RECOMMENDATION_ID,
): HomeCTA {
  return {
    id: DEFAULT_HOME_CTA_ID,
    label: "Start with a gentle check-in",
    target: "talk",
    targetPath: "/talk",
    homeRecommendationId,
    entryContext: createDefaultTalkEntryContext(now, homeRecommendationId),
    createdAt: now,
  };
}

export function createDefaultHomeRecommendation(
  now = DEFAULT_STAGE3_TIMESTAMP,
): HomeRecommendation {
  return {
    id: DEFAULT_HOME_RECOMMENDATION_ID,
    type: "start_talk",
    title: "Start with a gentle check-in",
    body: "A safe default is available when stronger continuity is missing.",
    priority: 0,
    source: "system_default",
    sourceDomain: "system",
    surface: "home_main",
    fallbackKind: "system_default_fallback",
    cta: createDefaultHomeCTA(now, DEFAULT_HOME_RECOMMENDATION_ID),
    createdAt: now,
  };
}

export function createDefaultHomeState(
  now = DEFAULT_STAGE3_TIMESTAMP,
  entryContextId = DEFAULT_HOME_ENTRY_CONTEXT_ID,
  recommendationId = DEFAULT_HOME_RECOMMENDATION_ID,
  ctaId = DEFAULT_HOME_CTA_ID,
): HomeState {
  return {
    id: DEFAULT_HOME_STATE_ID,
    route: "/home",
    status: "entry_guard_redirect",
    continuitySource: "none",
    entryContextId,
    mainRecommendationId: recommendationId,
    mainCtaId: ctaId,
    createdAt: now,
  };
}

export function createDefaultConversationState(): Stage3ConversationStore {
  return {};
}

export function createDefaultMemoryState(): Stage3MemoryStore {
  return {
    items: [],
    feedbackEvents: [],
  };
}

export function createDefaultSleepContinuity(): Stage3SleepStore {
  return {};
}

export function createDefaultRoomContinuity(): Stage3RoomStore {
  return {};
}

export function createDefaultOnboardingStore(
  now = DEFAULT_STAGE3_TIMESTAMP,
): Stage3OnboardingStore {
  return {
    state: createDefaultOnboardingState(now),
  };
}

export function createDefaultHomeStore(): Stage3HomeStore {
  return {};
}

export function createDefaultMigrationMetadata(
  localDataVersion: number,
  now = DEFAULT_STAGE3_TIMESTAMP,
  contractVersion: ContractVersion = STAGE3_CONTRACT_VERSION,
): Stage3MigrationMetadata {
  return {
    localDataVersion,
    contractVersion,
    migratedAt: now,
    lastNormalizedAt: now,
    legacyKeysSeen: [],
  };
}

export function createDefaultStage3AppState(
  localDataVersion: number,
  now = DEFAULT_STAGE3_TIMESTAMP,
): Stage3LocalDataState {
  return {
    userProfile: createDefaultUserProfile(now),
    onboarding: createDefaultOnboardingStore(now),
    home: createDefaultHomeStore(),
    conversation: createDefaultConversationState(),
    memory: createDefaultMemoryState(),
    sleep: createDefaultSleepContinuity(),
    room: createDefaultRoomContinuity(),
    migration: createDefaultMigrationMetadata(localDataVersion, now),
  };
}
