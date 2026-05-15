import type {
  ContractVersion,
  HomeEntryContext,
  HomeRecommendation,
  HomeState,
  MemoryFeedback,
  MemoryItem,
  OnboardingPreset,
  OnboardingState,
  RoomSession,
  RoomState,
  RoomView,
  RouteDecision,
  SleepLog,
  SleepInsight,
  SleepSession,
  TalkSession,
  UserProfile,
} from "../../contracts";
import {
  createDefaultConversationState,
  createDefaultHomeStore,
  createDefaultMemoryState,
  createDefaultMigrationMetadata,
  createDefaultOnboardingState,
  createDefaultOnboardingStore,
  createDefaultRoomContinuity,
  createDefaultSleepContinuity,
  createDefaultStage3AppState,
  createDefaultUserProfile,
  DEFAULT_STAGE3_TIMESTAMP,
  type Stage3ConversationStore,
  type Stage3HomeStore,
  type Stage3LocalDataState,
  type Stage3MemoryStore,
  type Stage3MigrationMetadata,
  type Stage3OnboardingStore,
  type Stage3RoomStore,
  type Stage3SleepStore,
} from "./defaults";
import {
  STAGE3_CONTRACT_VERSION,
  STAGE3_LEGACY_RUNTIME_KEY_LIST,
} from "./keys";

export const STAGE3_LOCAL_DATA_VERSION = 1 as const;

type LegacyQ1State =
  | "tired_but_awake"
  | "mind_racing"
  | "anxious_or_irritated"
  | "lonely_needing_company";
type LegacyQ2SupportStyle =
  | "help_me_sleep_fast"
  | "soothe_and_chat"
  | "meditation_practice"
  | "quiet_company";
type LegacyBaseMode =
  | "sleep_settling"
  | "gentle_grounding"
  | "meditative"
  | "quiet_presence";
type LegacyStateModifier =
  | "low_energy"
  | "overthinking"
  | "emotionally_full"
  | "needs_company";

type LegacyPostOnboardingSessionPreset = {
  preset_id?: unknown;
  q1_state?: unknown;
  q2_support_style?: unknown;
  base_mode?: unknown;
  state_modifier?: unknown;
  opening_copy_id?: unknown;
  reply_length_default?: unknown;
  question_budget_first_3_turns?: unknown;
  sleep_transition_enabled?: unknown;
  fallback_chain?: unknown;
  created_at?: unknown;
  status?: unknown;
};

export type Stage3LegacyRuntimeSnapshot = {
  hasCompletedFirstLaunchFlow?: boolean;
  postOnboardingSessionPreset?: unknown;
  legacyKeysSeen?: string[];
};

type MigrationOptions = {
  now?: string;
  legacyRuntime?: Stage3LegacyRuntimeSnapshot;
};

type Stage3LocalDataSource =
  | Partial<Stage3LocalDataState>
  | Record<string, unknown>;

const HOME_ENTRY_CONTEXT_MISSING_KEYS = [
  "route_decision",
  "latest_talk_session",
  "latest_room_session",
  "latest_sleep_log",
  "latest_sleep_insight",
  "eligible_memory",
  "source_recommendation",
] as const;

const HOME_ENTRY_CONTEXT_STALE_KEYS = [
  "active_onboarding_preset",
  "latest_sleep_log",
  "latest_sleep_insight",
  "eligible_memory",
  "source_recommendation",
] as const;

const HOME_DIAGNOSTICS_NAV_TARGETS = [
  "talk",
  "room",
  "memory",
  "sleep",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function asEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return isString(value) && allowed.includes(value as T) ? (value as T) : fallback;
}

function asOptionalEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
): T | undefined {
  return isString(value) && allowed.includes(value as T) ? (value as T) : undefined;
}

function asOptionalString(value: unknown): string | undefined {
  return isString(value) ? value : undefined;
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

function addMinutes(timestamp: string, minutes: number): string {
  const baseTime = Date.parse(timestamp);
  if (Number.isNaN(baseTime)) {
    return DEFAULT_STAGE3_TIMESTAMP;
  }

  return new Date(baseTime + minutes * 60_000).toISOString();
}

function normalizeUserProfile(
  raw: unknown,
  now: string,
): UserProfile {
  const fallback = createDefaultUserProfile(now);

  if (!isRecord(raw)) {
    return fallback;
  }

  return {
    userId: asOptionalString(raw.userId),
    anonymousId: asOptionalString(raw.anonymousId) ?? fallback.anonymousId,
    hasCompletedOnboarding: isBoolean(raw.hasCompletedOnboarding)
      ? raw.hasCompletedOnboarding
      : fallback.hasCompletedOnboarding,
    createdAt: asOptionalString(raw.createdAt) ?? fallback.createdAt,
    updatedAt: asOptionalString(raw.updatedAt) ?? fallback.updatedAt,
  };
}

function normalizeOnboardingPreset(raw: unknown): OnboardingPreset | undefined {
  if (!isRecord(raw)) {
    return undefined;
  }

  const id = asOptionalString(raw.id);
  const presetId = asOptionalString(raw.presetId);
  const q1State = asOptionalEnum(raw.q1State, [
    "sleep_blocked",
    "overthinking",
    "anxious_irritated",
    "lonely_need_presence",
  ] as const);
  const q2SupportStyle = asOptionalEnum(raw.q2SupportStyle, [
    "sleep_guide",
    "comfort_talk",
    "mindfulness_guide",
    "quiet_presence",
  ] as const);
  const baseMode = asOptionalEnum(raw.baseMode, [
    "sleep_guide",
    "comfort_talk",
    "mindfulness_guide",
    "quiet_presence",
  ] as const);
  const stateModifier = asOptionalEnum(raw.stateModifier, [
    "sleep_blocked",
    "overthinking",
    "anxious_irritated",
    "lonely_need_presence",
    "neutral_modifier",
  ] as const);
  const openingCopyId = asOptionalString(raw.openingCopyId);
  const replyLengthDefault = asOptionalEnum(raw.replyLengthDefault, [
    "short",
    "medium",
  ] as const);
  const questionBudgetFirst3Turns =
    raw.questionBudgetFirst3Turns === 0 ||
    raw.questionBudgetFirst3Turns === 1 ||
    raw.questionBudgetFirst3Turns === 2
      ? raw.questionBudgetFirst3Turns
      : undefined;
  const sleepTransitionEnabled = isBoolean(raw.sleepTransitionEnabled)
    ? raw.sleepTransitionEnabled
    : undefined;
  const fallbackChain = isStringArray(raw.fallbackChain)
    ? raw.fallbackChain
    : undefined;
  const status = asOptionalEnum(raw.status, [
    "active",
    "consumed",
    "expired",
  ] as const);
  const createdAt = asOptionalString(raw.createdAt);
  const expiresAt = asOptionalString(raw.expiresAt);

  if (
    !id ||
    !presetId ||
    !q1State ||
    !q2SupportStyle ||
    !baseMode ||
    !stateModifier ||
    !openingCopyId ||
    !replyLengthDefault ||
    questionBudgetFirst3Turns === undefined ||
    sleepTransitionEnabled === undefined ||
    !fallbackChain ||
    !status ||
    !createdAt ||
    !expiresAt
  ) {
    return undefined;
  }

  return {
    id,
    presetId,
    q1State,
    q2SupportStyle,
    baseMode,
    stateModifier,
    openingCopyId,
    replyLengthDefault,
    questionBudgetFirst3Turns,
    sleepTransitionEnabled,
    fallbackChain,
    status,
    createdAt,
    expiresAt,
    consumedAt: asOptionalString(raw.consumedAt),
  };
}

function normalizeOnboardingState(raw: unknown, now: string): OnboardingState {
  const fallback = createDefaultOnboardingState(now);

  if (!isRecord(raw)) {
    return fallback;
  }

  return {
    status: asEnum(raw.status, ["not_started", "in_progress", "completed"], fallback.status),
    q1State: asOptionalEnum(raw.q1State, [
      "sleep_blocked",
      "overthinking",
      "anxious_irritated",
      "lonely_need_presence",
    ] as const),
    q2SupportStyle: asOptionalEnum(raw.q2SupportStyle, [
      "sleep_guide",
      "comfort_talk",
      "mindfulness_guide",
      "quiet_presence",
    ] as const),
    activePresetId: asOptionalString(raw.activePresetId),
    latestConsumedPresetId: asOptionalString(raw.latestConsumedPresetId),
    latestExpiredPresetId: asOptionalString(raw.latestExpiredPresetId),
    completedAt: asOptionalString(raw.completedAt),
    updatedAt: asOptionalString(raw.updatedAt) ?? fallback.updatedAt,
  };
}

function normalizeOnboardingStore(
  raw: unknown,
  now: string,
): Stage3OnboardingStore {
  const fallback = createDefaultOnboardingStore(now);

  if (!isRecord(raw)) {
    return fallback;
  }

  return {
    state: normalizeOnboardingState(raw.state, now),
    activePreset: normalizeOnboardingPreset(raw.activePreset),
    latestConsumedPreset: normalizeOnboardingPreset(raw.latestConsumedPreset),
    latestExpiredPreset: normalizeOnboardingPreset(raw.latestExpiredPreset),
  };
}

function normalizeRouteDecision(raw: unknown): RouteDecision | undefined {
  if (!isRecord(raw)) {
    return undefined;
  }

  const id = asOptionalString(raw.id);
  const canonicalRoute = asOptionalEnum(raw.canonicalRoute, [
    "/onboarding",
    "/room",
    "/home",
  ] as const);
  const reason = asOptionalEnum(raw.reason, [
    "onboarding_incomplete",
    "active_preset_redirect",
    "returning_user_home",
    "consumed_or_expired_preset_home",
  ] as const);
  const hasCompletedOnboarding = isBoolean(raw.hasCompletedOnboarding)
    ? raw.hasCompletedOnboarding
    : undefined;
  const activePresetState = asOptionalEnum(raw.activePresetState, [
    "none",
    "active",
    "consumed",
    "expired",
    "stale",
  ] as const);
  const shouldRedirect = isBoolean(raw.shouldRedirect)
    ? raw.shouldRedirect
    : undefined;
  const createdAt = asOptionalString(raw.createdAt);

  if (
    !id ||
    !canonicalRoute ||
    !reason ||
    hasCompletedOnboarding === undefined ||
    !activePresetState ||
    shouldRedirect === undefined ||
    !createdAt
  ) {
    return undefined;
  }

  return {
    id,
    canonicalRoute,
    reason,
    runtimeObservedPath: asOptionalEnum(raw.runtimeObservedPath, [
      "/",
      "/onboarding",
      "/room",
      "/home",
    ] as const),
    hasCompletedOnboarding,
    activePresetId: asOptionalString(raw.activePresetId),
    activePresetState,
    shouldRedirect,
    createdAt,
  };
}

function normalizeHomeEntryContext(raw: unknown): HomeEntryContext | undefined {
  if (!isRecord(raw)) {
    return undefined;
  }

  const id = asOptionalString(raw.id);
  const routeDecisionId = asOptionalString(raw.routeDecisionId);
  const routeDecisionReason = asOptionalEnum(raw.routeDecisionReason, [
    "onboarding_incomplete",
    "active_preset_redirect",
    "returning_user_home",
    "consumed_or_expired_preset_home",
  ] as const);
  const canonicalHomePath = raw.canonicalHomePath === "/home" ? "/home" : undefined;
  const missingDataKeys = Array.isArray(raw.missingDataKeys)
    ? raw.missingDataKeys.filter(
        (value): value is (typeof HOME_ENTRY_CONTEXT_MISSING_KEYS)[number] =>
          HOME_ENTRY_CONTEXT_MISSING_KEYS.includes(
            String(value) as (typeof HOME_ENTRY_CONTEXT_MISSING_KEYS)[number],
          ),
      )
    : undefined;
  const staleDataKeys = Array.isArray(raw.staleDataKeys)
    ? raw.staleDataKeys.filter(
        (value): value is (typeof HOME_ENTRY_CONTEXT_STALE_KEYS)[number] =>
          HOME_ENTRY_CONTEXT_STALE_KEYS.includes(
            String(value) as (typeof HOME_ENTRY_CONTEXT_STALE_KEYS)[number],
          ),
      )
    : undefined;
  const activePresetState = asOptionalEnum(raw.activePresetState, [
    "none",
    "active_redirect",
    "consumed",
    "expired",
    "stale",
  ] as const);
  const createdAt = asOptionalString(raw.createdAt);

  if (
    !id ||
    !routeDecisionId ||
    !routeDecisionReason ||
    !canonicalHomePath ||
    !missingDataKeys ||
    !staleDataKeys ||
    !activePresetState ||
    !createdAt
  ) {
    return undefined;
  }

  return {
    id,
    routeDecisionId,
    routeDecisionReason,
    canonicalHomePath,
    runtimeObservedPath: asOptionalEnum(raw.runtimeObservedPath, ["/", "/home"] as const),
    sourceRecommendationId: asOptionalString(raw.sourceRecommendationId),
    sourceRecommendationType: asOptionalEnum(raw.sourceRecommendationType, [
      "review_memory",
      "start_talk",
      "sleep_checkin",
      "tonight_suggestion",
    ] as const),
    latestTalkSessionId: asOptionalString(raw.latestTalkSessionId),
    latestRoomSessionId: asOptionalString(raw.latestRoomSessionId),
    latestSleepInsightId: asOptionalString(raw.latestSleepInsightId),
    latestSleepLogId:
      // Legacy compatibility: older local data stored the canonical SleepLog id
      // under the pre-normalization latestSleepCheckInId key.
      asOptionalString(raw.latestSleepLogId) ??
      asOptionalString(raw.latestSleepCheckInId),
    eligibleMemoryId: asOptionalString(raw.eligibleMemoryId),
    missingDataKeys,
    staleDataKeys,
    activePresetState,
    createdAt,
  };
}

function normalizeHomeRecommendation(raw: unknown): HomeRecommendation | undefined {
  if (!isRecord(raw)) {
    return undefined;
  }

  if (!isRecord(raw.cta) || !isRecord(raw.cta.entryContext)) {
    return undefined;
  }

  const id = asOptionalString(raw.id);
  const type = asOptionalEnum(raw.type, [
    "review_memory",
    "start_talk",
    "sleep_checkin",
    "tonight_suggestion",
  ] as const);
  const title = asOptionalString(raw.title);
  const priority = isNumber(raw.priority) ? raw.priority : undefined;
  const source = asOptionalEnum(raw.source, [
    "memory",
    "talk_session",
    "sleep_log",
    "sleep_insight",
    "room_session",
    "system_default",
  ] as const);
  const sourceDomain = asOptionalEnum(raw.sourceDomain, [
    "memory",
    "talk",
    "sleep",
    "room",
    "system",
  ] as const);
  const surface = raw.surface === "home_main" ? "home_main" : undefined;
  const fallbackKind = asOptionalEnum(raw.fallbackKind, [
    "none",
    "system_default_fallback",
    "data_partial_fallback",
    "error_safe_fallback",
  ] as const);
  const sourceId = asOptionalString(raw.sourceId);
  const createdAt = asOptionalString(raw.createdAt);
  const ctaId = asOptionalString(raw.cta.id);
  const ctaLabel = asOptionalString(raw.cta.label);
  const ctaTarget = raw.cta.target === "talk" ? "talk" : undefined;
  const ctaTargetPath = raw.cta.targetPath === "/talk" ? "/talk" : undefined;
  const ctaRecommendationId = asOptionalString(raw.cta.homeRecommendationId);
  const entryContextSource = asOptionalEnum(raw.cta.entryContext.source, [
    "home",
    "memory",
    "sleep",
    "room",
    "direct",
  ] as const);
  const entryContextIntent = asOptionalEnum(raw.cta.entryContext.intent, [
    "open_chat",
    "discuss_memory",
    "gentle_start",
    "quiet_company",
    "sleep_reflection",
    "tonight_suggestion",
    "tap_from_room_after_onboarding",
  ] as const);
  const entryContextCreatedAt = asOptionalString(raw.cta.entryContext.createdAt);

  if (
    !id ||
    !type ||
    !title ||
    priority === undefined ||
    !source ||
    (source !== "system_default" && !sourceId) ||
    !sourceDomain ||
    !surface ||
    !fallbackKind ||
    !createdAt ||
    !ctaId ||
    !ctaLabel ||
    !ctaTarget ||
    !ctaTargetPath ||
    !ctaRecommendationId ||
    !entryContextSource ||
    !entryContextIntent ||
    !entryContextCreatedAt
  ) {
    return undefined;
  }

  return raw as HomeRecommendation;
}

function normalizeHomeState(raw: unknown): HomeState | undefined {
  if (!isRecord(raw)) {
    return undefined;
  }

  const id = asOptionalString(raw.id);
  const route = raw.route === "/home" ? "/home" : undefined;
  const status = asOptionalEnum(raw.status, [
    "entry_guard_redirect",
    "recommendation_ready",
    "fallback_ready",
  ] as const);
  const entryContextId = asOptionalString(raw.entryContextId);
  const mainRecommendationId = asOptionalString(raw.mainRecommendationId);
  const mainCtaId = asOptionalString(raw.mainCtaId);
  const createdAt = asOptionalString(raw.createdAt);

  if (
    !id ||
    !route ||
    !status ||
    !entryContextId ||
    !mainRecommendationId ||
    !mainCtaId ||
    !createdAt
  ) {
    return undefined;
  }

  return {
    id,
    route,
    status,
    continuitySource: asOptionalEnum(raw.continuitySource, [
      "memory",
      "sleep",
      "talk",
      "room",
      "none",
    ] as const),
    entryContextId,
    mainRecommendationId,
    mainCtaId,
    continuitySummary: asOptionalString(raw.continuitySummary),
    diagnosticsNavTargets: Array.isArray(raw.diagnosticsNavTargets)
      ? raw.diagnosticsNavTargets.filter(
          (value): value is (typeof HOME_DIAGNOSTICS_NAV_TARGETS)[number] =>
            HOME_DIAGNOSTICS_NAV_TARGETS.includes(
              String(value) as (typeof HOME_DIAGNOSTICS_NAV_TARGETS)[number],
            ),
        )
      : undefined,
    createdAt,
  };
}

function normalizeHomeStore(raw: unknown): Stage3HomeStore {
  const fallback = createDefaultHomeStore();

  if (!isRecord(raw)) {
    return fallback;
  }

  return {
    routeDecision: normalizeRouteDecision(raw.routeDecision),
    entryContext: normalizeHomeEntryContext(raw.entryContext),
    homeState: normalizeHomeState(raw.homeState),
    recommendation: normalizeHomeRecommendation(raw.recommendation),
  };
}

function normalizeConversationStore(raw: unknown): Stage3ConversationStore {
  const fallback = createDefaultConversationState();

  if (!isRecord(raw)) {
    return fallback;
  }

  return {
    currentTalkSessionId:
      // Legacy compatibility: older local data used conversation naming.
      asOptionalString(raw.currentTalkSessionId) ??
      asOptionalString(raw.currentConversationId),
    latestTalkSession: isRecord(raw.latestTalkSession)
      ? (raw.latestTalkSession as Stage3ConversationStore["latestTalkSession"])
      // Legacy compatibility: older local data stored latestConversation.
      : isRecord(raw.latestConversation)
        ? (raw.latestConversation as TalkSession)
      : undefined,
  };
}

function normalizeMemoryStore(raw: unknown): Stage3MemoryStore {
  const fallback = createDefaultMemoryState();

  if (!isRecord(raw)) {
    return fallback;
  }

  return {
    items: Array.isArray(raw.items)
      ? raw.items.filter(isRecord) as MemoryItem[]
      : fallback.items,
    feedback: Array.isArray(raw.feedback)
      ? raw.feedback.filter(isRecord) as MemoryFeedback[]
      // Legacy compatibility: older local data used feedbackEvents.
      : Array.isArray(raw.feedbackEvents)
        ? raw.feedbackEvents.filter(isRecord) as MemoryFeedback[]
        : fallback.feedback,
  };
}

function normalizeSleepStore(raw: unknown): Stage3SleepStore {
  const fallback = createDefaultSleepContinuity();

  if (!isRecord(raw)) {
    return fallback;
  }

  return {
    latestSleepLog: isRecord(raw.latestSleepLog)
      ? (raw.latestSleepLog as SleepLog)
      // Legacy compatibility: older local data used latestCheckIn.
      : isRecord(raw.latestCheckIn)
        ? (raw.latestCheckIn as SleepLog)
      : undefined,
    latestInsight: isRecord(raw.latestInsight)
      ? (raw.latestInsight as SleepInsight)
      : undefined,
    latestSession: isRecord(raw.latestSession)
      ? (raw.latestSession as SleepSession)
      : undefined,
  };
}

function normalizeRoomStore(raw: unknown): Stage3RoomStore {
  const fallback = createDefaultRoomContinuity();

  if (!isRecord(raw)) {
    return fallback;
  }

  return {
    latestRoomState: isRecord(raw.latestRoomState)
      ? (raw.latestRoomState as RoomState)
      : undefined,
    latestRoomView: isRecord(raw.latestRoomView)
      ? (raw.latestRoomView as RoomView)
      : undefined,
    latestRoomSession: isRecord(raw.latestRoomSession)
      ? (raw.latestRoomSession as RoomSession)
      : undefined,
  };
}

function normalizeMigrationMetadata(
  raw: unknown,
  now: string,
): Stage3MigrationMetadata {
  const fallback = createDefaultMigrationMetadata(STAGE3_LOCAL_DATA_VERSION, now);

  if (!isRecord(raw)) {
    return fallback;
  }

  const localDataVersion = isNumber(raw.localDataVersion)
    ? raw.localDataVersion
    : fallback.localDataVersion;
  const contractVersion = asEnum(
    raw.contractVersion,
    [STAGE3_CONTRACT_VERSION] as readonly ContractVersion[],
    STAGE3_CONTRACT_VERSION,
  );

  return {
    localDataVersion,
    contractVersion,
    migratedAt: asOptionalString(raw.migratedAt) ?? fallback.migratedAt,
    lastNormalizedAt:
      asOptionalString(raw.lastNormalizedAt) ?? fallback.lastNormalizedAt,
    legacyKeysSeen: isStringArray(raw.legacyKeysSeen) ? raw.legacyKeysSeen : [],
  };
}

function mapLegacyQ1State(value: LegacyQ1State): OnboardingPreset["q1State"] {
  switch (value) {
    case "tired_but_awake":
      return "sleep_blocked";
    case "mind_racing":
      return "overthinking";
    case "anxious_or_irritated":
      return "anxious_irritated";
    case "lonely_needing_company":
      return "lonely_need_presence";
  }
}

function mapLegacyQ2SupportStyle(
  value: LegacyQ2SupportStyle,
): OnboardingPreset["q2SupportStyle"] {
  switch (value) {
    case "help_me_sleep_fast":
      return "sleep_guide";
    case "soothe_and_chat":
      return "comfort_talk";
    case "meditation_practice":
      return "mindfulness_guide";
    case "quiet_company":
      return "quiet_presence";
  }
}

function mapLegacyBaseMode(
  value: LegacyBaseMode,
): OnboardingPreset["baseMode"] {
  switch (value) {
    case "sleep_settling":
      return "sleep_guide";
    case "gentle_grounding":
      return "comfort_talk";
    case "meditative":
      return "mindfulness_guide";
    case "quiet_presence":
      return "quiet_presence";
  }
}

function mapLegacyStateModifier(
  value: LegacyStateModifier,
): OnboardingPreset["stateModifier"] {
  switch (value) {
    case "low_energy":
      return "sleep_blocked";
    case "overthinking":
      return "overthinking";
    case "emotionally_full":
      return "anxious_irritated";
    case "needs_company":
      return "lonely_need_presence";
  }
}

function normalizeLegacyPreset(raw: unknown): LegacyPostOnboardingSessionPreset | undefined {
  if (!isRecord(raw)) {
    return undefined;
  }

  return raw;
}

function migrateLegacyPreset(raw: unknown): OnboardingPreset | undefined {
  const legacyPreset = normalizeLegacyPreset(raw);

  if (!legacyPreset) {
    return undefined;
  }

  const presetId = asOptionalString(legacyPreset.preset_id);
  const q1State = asOptionalEnum(legacyPreset.q1_state, [
    "tired_but_awake",
    "mind_racing",
    "anxious_or_irritated",
    "lonely_needing_company",
  ] as const);
  const q2SupportStyle = asOptionalEnum(legacyPreset.q2_support_style, [
    "help_me_sleep_fast",
    "soothe_and_chat",
    "meditation_practice",
    "quiet_company",
  ] as const);
  const baseMode = asOptionalEnum(legacyPreset.base_mode, [
    "sleep_settling",
    "gentle_grounding",
    "meditative",
    "quiet_presence",
  ] as const);
  const stateModifier = asOptionalEnum(legacyPreset.state_modifier, [
    "low_energy",
    "overthinking",
    "emotionally_full",
    "needs_company",
  ] as const);
  const openingCopyId = asOptionalString(legacyPreset.opening_copy_id);
  const replyLengthDefault = asOptionalEnum(legacyPreset.reply_length_default, [
    "short",
    "medium",
  ] as const);
  const questionBudget =
    legacyPreset.question_budget_first_3_turns === 0 ||
    legacyPreset.question_budget_first_3_turns === 1
      ? legacyPreset.question_budget_first_3_turns
      : undefined;
  const sleepTransitionEnabled = isBoolean(legacyPreset.sleep_transition_enabled)
    ? legacyPreset.sleep_transition_enabled
    : undefined;
  const fallbackChain = isStringArray(legacyPreset.fallback_chain)
    ? legacyPreset.fallback_chain
    : undefined;
  const createdAt = asOptionalString(legacyPreset.created_at);
  const status = asOptionalEnum(legacyPreset.status, [
    "active",
    "consumed",
    "expired",
  ] as const);

  if (
    !presetId ||
    !q1State ||
    !q2SupportStyle ||
    !baseMode ||
    !stateModifier ||
    !openingCopyId ||
    !replyLengthDefault ||
    questionBudget === undefined ||
    sleepTransitionEnabled === undefined ||
    !fallbackChain ||
    !createdAt ||
    !status
  ) {
    return undefined;
  }

  return {
    id: presetId,
    presetId,
    q1State: mapLegacyQ1State(q1State),
    q2SupportStyle: mapLegacyQ2SupportStyle(q2SupportStyle),
    baseMode: mapLegacyBaseMode(baseMode),
    stateModifier: mapLegacyStateModifier(stateModifier),
    openingCopyId,
    replyLengthDefault,
    questionBudgetFirst3Turns: questionBudget,
    sleepTransitionEnabled,
    fallbackChain,
    status,
    createdAt,
    expiresAt: addMinutes(createdAt, 30),
  };
}

function applyLegacyRuntimeMigration(
  state: Stage3LocalDataState,
  legacyRuntime: Stage3LegacyRuntimeSnapshot | undefined,
  now: string,
): Stage3LocalDataState {
  if (!legacyRuntime) {
    return state;
  }

  const seenLegacyKeys = unique([
    ...state.migration.legacyKeysSeen,
    ...(legacyRuntime.legacyKeysSeen ?? []),
  ]);

  const migratedPreset = state.onboarding.activePreset
    ? state.onboarding.activePreset
    : migrateLegacyPreset(legacyRuntime.postOnboardingSessionPreset);
  const completedFromLegacy =
    legacyRuntime.hasCompletedFirstLaunchFlow === true ||
    migratedPreset !== undefined;

  const nextUserProfile: UserProfile = completedFromLegacy
    ? {
        ...state.userProfile,
        hasCompletedOnboarding: true,
        updatedAt: now,
      }
    : state.userProfile;

  const nextOnboardingState: OnboardingState = completedFromLegacy
    ? {
        ...state.onboarding.state,
        status: "completed",
        q1State: state.onboarding.state.q1State ?? migratedPreset?.q1State,
        q2SupportStyle:
          state.onboarding.state.q2SupportStyle ?? migratedPreset?.q2SupportStyle,
        activePresetId:
          state.onboarding.state.activePresetId ?? migratedPreset?.id,
        completedAt:
          state.onboarding.state.completedAt ??
          migratedPreset?.createdAt ??
          now,
        updatedAt: now,
      }
    : state.onboarding.state;

  return {
    ...state,
    userProfile: nextUserProfile,
    onboarding: {
      ...state.onboarding,
      state: nextOnboardingState,
      activePreset: state.onboarding.activePreset ?? migratedPreset,
    },
    migration: {
      ...state.migration,
      legacyKeysSeen: seenLegacyKeys,
    },
  };
}

export function getStoredVersion(
  source?: Partial<Stage3MigrationMetadata> | Partial<Stage3LocalDataState> | null,
): number | null {
  if (!source) {
    return null;
  }

  if ("localDataVersion" in source && isNumber(source.localDataVersion)) {
    return source.localDataVersion;
  }

  if ("migration" in source && isRecord(source.migration)) {
    return isNumber(source.migration.localDataVersion)
      ? source.migration.localDataVersion
      : null;
  }

  return null;
}

export function needsMigration(
  source?: Partial<Stage3MigrationMetadata> | Partial<Stage3LocalDataState> | null,
): boolean {
  const storedVersion = getStoredVersion(source);

  if (storedVersion === null) {
    return true;
  }

  if (storedVersion !== STAGE3_LOCAL_DATA_VERSION) {
    return true;
  }

  if (source && "contractVersion" in source) {
    return source.contractVersion !== STAGE3_CONTRACT_VERSION;
  }

  if (source && "migration" in source && isRecord(source.migration)) {
    return source.migration.contractVersion !== STAGE3_CONTRACT_VERSION;
  }

  return false;
}

export function normalizeStage3State(
  rawState?: Stage3LocalDataSource | null,
  options: Pick<MigrationOptions, "now"> = {},
): Stage3LocalDataState {
  const now = options.now ?? new Date().toISOString();
  const fallback = createDefaultStage3AppState(STAGE3_LOCAL_DATA_VERSION, now);

  if (!rawState || !isRecord(rawState)) {
    return fallback;
  }

  return {
    userProfile: normalizeUserProfile(rawState.userProfile, now),
    onboarding: normalizeOnboardingStore(rawState.onboarding, now),
    home: normalizeHomeStore(rawState.home),
    conversation: normalizeConversationStore(rawState.conversation),
    memory: normalizeMemoryStore(rawState.memory),
    sleep: normalizeSleepStore(rawState.sleep),
    room: normalizeRoomStore(rawState.room),
    migration: normalizeMigrationMetadata(rawState.migration, now),
  };
}

export function migrateStage3State(
  rawState?: Stage3LocalDataSource | null,
  options: MigrationOptions = {},
): Stage3LocalDataState {
  const now = options.now ?? new Date().toISOString();
  const storedVersion = getStoredVersion(rawState);

  if (storedVersion !== null && storedVersion > STAGE3_LOCAL_DATA_VERSION) {
    const safeFallback = createDefaultStage3AppState(STAGE3_LOCAL_DATA_VERSION, now);
    const seenLegacyKeys = unique(options.legacyRuntime?.legacyKeysSeen ?? []);

    return {
      ...safeFallback,
      migration: {
        ...safeFallback.migration,
        legacyKeysSeen: seenLegacyKeys,
      },
    };
  }

  const normalized = normalizeStage3State(rawState, { now });
  const migrated = applyLegacyRuntimeMigration(normalized, options.legacyRuntime, now);
  const mergedLegacyKeys = unique([
    ...migrated.migration.legacyKeysSeen,
    ...(options.legacyRuntime?.legacyKeysSeen ?? []),
  ]).filter(
    (key) =>
      STAGE3_LEGACY_RUNTIME_KEY_LIST.includes(
        key as (typeof STAGE3_LEGACY_RUNTIME_KEY_LIST)[number],
      ),
  );

  return {
    ...migrated,
    migration: {
      localDataVersion: STAGE3_LOCAL_DATA_VERSION,
      contractVersion: STAGE3_CONTRACT_VERSION,
      migratedAt: now,
      lastNormalizedAt: now,
      legacyKeysSeen: mergedLegacyKeys,
    },
  };
}
