import type {
  ConversationMessage,
  HomeCTA,
  HomeEntryContext,
  HomeRecommendation,
  HomeState,
  MemoryExtractionRun,
  MemoryFeedback,
  MemoryItem,
  OnboardingContextCard,
  OnboardingDraft,
  OnboardingPreset,
  OnboardingState,
  ProductEvent,
  Recommendation,
  Ritual,
  RoomOption,
  RoomSession,
  RoomState,
  RoomView,
  RouteDecision,
  SleepGoal,
  SleepInsight,
  SleepLog,
  SleepSession,
  SuggestionRuleResult,
  TalkEntryContext,
  TalkSession,
  UserProfile,
} from "../contracts";

const MOCK_CREATED_AT = "2026-05-09T12:00:00.000Z";
const MOCK_UPDATED_AT = "2026-05-09T12:15:00.000Z";
const MOCK_SLEEP_DATE = "2026-05-08";
const MOCK_CHECKIN_DATE = "2026-05-09";

type MemoryEligibilityScenario = {
  memory: MemoryItem;
  eligibleForHomeContinuity: boolean;
  derivedReason?:
    | "eligible"
    | "contradicted_disagree_equivalent"
    | "hidden"
    | "archived"
    | "expired_derived"
    | "blocked_derived";
};

export const firstLaunchUserProfile: UserProfile = {
  anonymousId: "anon_stage3_first_launch",
  hasCompletedOnboarding: false,
  createdAt: MOCK_CREATED_AT,
  updatedAt: MOCK_UPDATED_AT,
};

export const returningUserProfile: UserProfile = {
  anonymousId: "anon_stage3_returning",
  hasCompletedOnboarding: true,
  createdAt: "2026-05-01T08:00:00.000Z",
  updatedAt: MOCK_UPDATED_AT,
};

export const onboardingStateIncomplete: OnboardingState = {
  status: "in_progress",
  q1State: "overthinking",
  updatedAt: MOCK_UPDATED_AT,
};

export const onboardingStateCompleted: OnboardingState = {
  status: "completed",
  q1State: "sleep_blocked",
  q2SupportStyle: "sleep_guide",
  activePresetId: "obp_active_001",
  latestConsumedPresetId: "obp_consumed_001",
  latestExpiredPresetId: "obp_expired_001",
  completedAt: "2026-05-08T22:40:00.000Z",
  updatedAt: MOCK_UPDATED_AT,
};

export const onboardingDraftInProgress: OnboardingDraft = {
  stepIndex: 2,
  q1State: "overthinking",
  q2SupportStyle: "mindfulness_guide",
  draftUpdatedAt: MOCK_UPDATED_AT,
  expiresAt: "2026-05-09T23:59:00.000Z",
};

export const activeOnboardingPreset: OnboardingPreset = {
  id: "obp_active_001",
  presetId: "preset_active_001",
  q1State: "sleep_blocked",
  q2SupportStyle: "sleep_guide",
  baseMode: "sleep_guide",
  stateModifier: "sleep_blocked",
  openingCopyId: "copy_opening_001",
  replyLengthDefault: "short",
  questionBudgetFirst3Turns: 1,
  sleepTransitionEnabled: true,
  fallbackChain: ["sleep_guide_retry", "quiet_presence_soften"],
  status: "active",
  createdAt: "2026-05-08T22:40:00.000Z",
  expiresAt: "2026-05-08T23:10:00.000Z",
};

export const staleOnboardingPreset: OnboardingPreset = {
  id: "obp_stale_001",
  presetId: "preset_stale_001",
  q1State: "anxious_irritated",
  q2SupportStyle: "comfort_talk",
  baseMode: "comfort_talk",
  stateModifier: "anxious_irritated",
  openingCopyId: "copy_opening_002",
  replyLengthDefault: "medium",
  questionBudgetFirst3Turns: 1,
  sleepTransitionEnabled: true,
  fallbackChain: ["comfort_retry", "quiet_presence_soften"],
  status: "active",
  createdAt: "2026-05-08T20:00:00.000Z",
  expiresAt: "2026-05-08T20:30:00.000Z",
};

export const expiredOnboardingPreset: OnboardingPreset = {
  id: "obp_expired_001",
  presetId: "preset_expired_001",
  q1State: "lonely_need_presence",
  q2SupportStyle: "quiet_presence",
  baseMode: "quiet_presence",
  stateModifier: "lonely_need_presence",
  openingCopyId: "copy_opening_003",
  replyLengthDefault: "medium",
  questionBudgetFirst3Turns: 0,
  sleepTransitionEnabled: false,
  fallbackChain: ["quiet_presence_retry"],
  status: "expired",
  createdAt: "2026-05-08T18:00:00.000Z",
  expiresAt: "2026-05-08T18:30:00.000Z",
};

export const consumedOnboardingPreset: OnboardingPreset = {
  id: "obp_consumed_001",
  presetId: "preset_consumed_001",
  q1State: "overthinking",
  q2SupportStyle: "mindfulness_guide",
  baseMode: "mindfulness_guide",
  stateModifier: "overthinking",
  openingCopyId: "copy_opening_004",
  replyLengthDefault: "short",
  questionBudgetFirst3Turns: 2,
  sleepTransitionEnabled: true,
  fallbackChain: ["mindfulness_retry"],
  status: "consumed",
  createdAt: "2026-05-07T22:00:00.000Z",
  expiresAt: "2026-05-07T22:30:00.000Z",
  consumedAt: "2026-05-07T22:18:00.000Z",
};

export const onboardingContextCardPreview: OnboardingContextCard = {
  sourcePresetId: activeOnboardingPreset.id,
  title: "Your first-night starting point",
  body: "This onboarding preset only shaped the first session opening and does not become a long-term profile.",
  allowedConsumers: ["memory_preview"],
  disallowedConsumers: [
    "talk_personalization",
    "sleep_recommendation",
    "home_recommendation",
    "long_term_profile",
  ],
  expiresAt: "2026-05-09T23:10:00.000Z",
};

export const firstLaunchRouteDecision: RouteDecision = {
  id: "route_first_launch_001",
  canonicalRoute: "/onboarding",
  reason: "onboarding_incomplete",
  runtimeObservedPath: "/",
  hasCompletedOnboarding: false,
  activePresetState: "none",
  shouldRedirect: true,
  createdAt: MOCK_CREATED_AT,
};

export const onboardingIncompleteRouteDecision: RouteDecision = {
  id: "route_onboarding_incomplete_001",
  canonicalRoute: "/onboarding",
  reason: "onboarding_incomplete",
  runtimeObservedPath: "/",
  hasCompletedOnboarding: false,
  activePresetState: "none",
  shouldRedirect: true,
  createdAt: MOCK_CREATED_AT,
};

export const activePresetRedirectRouteDecision: RouteDecision = {
  id: "route_active_preset_001",
  canonicalRoute: "/room",
  reason: "active_preset_redirect",
  runtimeObservedPath: "/",
  hasCompletedOnboarding: true,
  activePresetId: activeOnboardingPreset.id,
  activePresetState: "active",
  shouldRedirect: true,
  createdAt: MOCK_CREATED_AT,
};

export const returningUserHomeRouteDecision: RouteDecision = {
  id: "route_returning_home_001",
  canonicalRoute: "/home",
  reason: "returning_user_home",
  runtimeObservedPath: "/",
  hasCompletedOnboarding: true,
  activePresetState: "none",
  shouldRedirect: true,
  createdAt: MOCK_CREATED_AT,
};

export const consumedPresetHomeRouteDecision: RouteDecision = {
  id: "route_consumed_home_001",
  canonicalRoute: "/home",
  reason: "consumed_or_expired_preset_home",
  runtimeObservedPath: "/home",
  hasCompletedOnboarding: true,
  activePresetId: consumedOnboardingPreset.id,
  activePresetState: "consumed",
  shouldRedirect: false,
  createdAt: MOCK_CREATED_AT,
};

export const stalePresetHomeRouteDecision: RouteDecision = {
  id: "route_stale_home_001",
  canonicalRoute: "/home",
  reason: "consumed_or_expired_preset_home",
  runtimeObservedPath: "/",
  hasCompletedOnboarding: true,
  activePresetId: staleOnboardingPreset.id,
  activePresetState: "stale",
  shouldRedirect: true,
  createdAt: MOCK_CREATED_AT,
};

export const eligibleVisibleMemory: MemoryItem = {
  id: "mem_active_001",
  source: "talk_session",
  sourceId: "ts_memory_001",
  type: "support_style",
  title: "A gentler opening helps you settle",
  body: "Short, steady openings seem to help you stay engaged without pressure.",
  evidence: {
    sourceSummary: "User responded more positively to a gentle opening in the last evening talk.",
    sourceSessionId: "ts_memory_001",
  },
  confidence: "medium",
  influenceWeight: 0.7,
  status: "active",
  excludeFromPersonalization: false,
  impactRules: {
    talkTone: "gentle",
    talkIntensity: "low",
    sleepSuggestionWeight: 0.4,
  },
  createdAt: "2026-05-08T21:20:00.000Z",
  updatedAt: "2026-05-09T08:00:00.000Z",
};

export const weakenedVisibleMemory: MemoryItem = {
  id: "mem_weakened_001",
  source: "memory_feedback",
  sourceId: "feedback_001",
  type: "routine",
  title: "A shorter wind-down still seems useful",
  body: "This pattern still appears relevant, but with lower confidence than before.",
  confidence: "low",
  influenceWeight: 0.25,
  status: "weakened",
  excludeFromPersonalization: false,
  createdAt: "2026-05-06T21:00:00.000Z",
  updatedAt: "2026-05-08T08:00:00.000Z",
};

export const contradictedMemoryExcluded: MemoryItem = {
  id: "mem_contradicted_001",
  source: "talk_session",
  sourceId: "ts_old_001",
  type: "preference",
  title: "Late-night advice is helpful",
  body: "This was later contradicted by user feedback and cannot drive Home continuity.",
  confidence: "medium",
  influenceWeight: 0.1,
  status: "contradicted",
  excludeFromPersonalization: false,
  createdAt: "2026-05-01T22:10:00.000Z",
  updatedAt: "2026-05-04T08:00:00.000Z",
};

export const hiddenMemoryExcluded: MemoryItem = {
  id: "mem_hidden_001",
  source: "talk_session",
  sourceId: "ts_old_002",
  type: "emotional_pattern",
  title: "User feels observed at bedtime",
  body: "This memory was hidden and must not power Home recommendations.",
  confidence: "high",
  influenceWeight: 0,
  status: "hidden",
  excludeFromPersonalization: true,
  hiddenAt: "2026-05-05T07:30:00.000Z",
  createdAt: "2026-05-03T22:10:00.000Z",
  updatedAt: "2026-05-05T07:30:00.000Z",
};

export const archivedMemoryExcluded: MemoryItem = {
  id: "mem_archived_001",
  source: "system_inference",
  sourceId: "system_batch_001",
  type: "sleep_pattern",
  title: "Older pattern kept for history only",
  body: "Archived memories are retained historically but not used as active continuity.",
  confidence: "low",
  influenceWeight: 0,
  status: "archived",
  excludeFromPersonalization: false,
  createdAt: "2026-04-01T09:00:00.000Z",
  updatedAt: "2026-05-01T09:00:00.000Z",
};

export const memoryEligibilityScenarios: MemoryEligibilityScenario[] = [
  {
    memory: eligibleVisibleMemory,
    eligibleForHomeContinuity: true,
    derivedReason: "eligible",
  },
  {
    memory: weakenedVisibleMemory,
    eligibleForHomeContinuity: true,
    derivedReason: "eligible",
  },
  {
    memory: contradictedMemoryExcluded,
    eligibleForHomeContinuity: false,
    derivedReason: "contradicted_disagree_equivalent",
  },
  {
    memory: hiddenMemoryExcluded,
    eligibleForHomeContinuity: false,
    derivedReason: "hidden",
  },
  {
    memory: archivedMemoryExcluded,
    eligibleForHomeContinuity: false,
    derivedReason: "archived",
  },
  {
    memory: {
      ...weakenedVisibleMemory,
      id: "mem_expired_derived_001",
      sourceId: "ts_expired_like_001",
    },
    eligibleForHomeContinuity: false,
    derivedReason: "expired_derived",
  },
  {
    memory: {
      ...eligibleVisibleMemory,
      id: "mem_blocked_derived_001",
      sourceId: "ts_blocked_like_001",
    },
    eligibleForHomeContinuity: false,
    derivedReason: "blocked_derived",
  },
];

export const homeToTalkEntryContext: TalkEntryContext = {
  source: "home",
  sourceId: eligibleVisibleMemory.id,
  intent: "discuss_memory",
  memoryId: eligibleVisibleMemory.id,
  homeRecommendationId: "home_rec_memory_001",
  suggestedOpening: "We can start gently with what felt most noticeable last night.",
  tonePreset: "reflective",
  interactionIntensity: "medium",
  createdAt: MOCK_CREATED_AT,
};

export const homeRecommendationFromMemoryCta: HomeCTA = {
  id: "home_cta_memory_001",
  label: "Talk about this",
  target: "talk",
  targetPath: "/talk",
  homeRecommendationId: "home_rec_memory_001",
  entryContext: homeToTalkEntryContext,
  createdAt: MOCK_CREATED_AT,
};

export const homeRecommendationFromMemory: HomeRecommendation = {
  id: "home_rec_memory_001",
  type: "review_memory",
  title: "Review what I noticed",
  body: "There is one recent observation that still looks useful to revisit.",
  priority: 100,
  source: "memory",
  sourceId: eligibleVisibleMemory.id,
  sourceDomain: "memory",
  surface: "home_main",
  fallbackKind: "none",
  cta: homeRecommendationFromMemoryCta,
  createdAt: MOCK_CREATED_AT,
};

export const homeSleepLogEntryContext: TalkEntryContext = {
  source: "home",
  sourceId: "sl_001",
  intent: "sleep_reflection",
  homeRecommendationId: "home_rec_sleep_checkin_001",
  suggestedOpening: "We can reflect on last night for a minute and keep it light.",
  tonePreset: "gentle",
  interactionIntensity: "low",
  createdAt: MOCK_CREATED_AT,
};

export const homeSleepLogRecommendationCta: HomeCTA = {
  id: "home_cta_sleep_checkin_001",
  label: "Check in about last night",
  target: "talk",
  targetPath: "/talk",
  homeRecommendationId: "home_rec_sleep_checkin_001",
  entryContext: homeSleepLogEntryContext,
  createdAt: MOCK_CREATED_AT,
};

export const homeSleepLogRecommendation: HomeRecommendation = {
  id: "home_rec_sleep_checkin_001",
  type: "sleep_checkin",
  title: "Check in about last night",
  body: "A quick reflection could help keep tonight's support more grounded.",
  priority: 90,
  source: "sleep_log",
  sourceId: "sl_001",
  sourceDomain: "sleep",
  surface: "home_main",
  fallbackKind: "none",
  cta: homeSleepLogRecommendationCta,
  createdAt: MOCK_CREATED_AT,
};

export const lightweightSleepLog: SleepLog = {
  id: "sl_001",
  sleepDate: MOCK_SLEEP_DATE,
  checkInDate: MOCK_CHECKIN_DATE,
  timezone: "Asia/Makassar",
  intendedBedtime: "22:30",
  actualBedtime: "23:10",
  wakeTime: "06:50",
  sleepQuality: 3,
  easeOfFallingAsleep: 2,
  nightAwakenings: 2,
  morningEnergy: 2,
  preSleepTalkSessionId: "ts_memory_001",
  preSleepRoomSessionId: "rs_001",
  notes: "I took longer to settle than I wanted.",
  source: "manual_morning_checkin",
  createdAt: "2026-05-09T06:40:00.000Z",
  updatedAt: "2026-05-09T06:42:00.000Z",
};

export const lightweightSleepSession: SleepSession = {
  id: "sleep_session_001",
  sleepDate: MOCK_SLEEP_DATE,
  latestSleepLogId: lightweightSleepLog.id,
  latestSleepInsightId: "si_001",
  preSleepTalkSessionId: "ts_memory_001",
  preSleepRoomSessionId: "rs_001",
  continuityState: "complete",
  createdAt: "2026-05-09T06:42:00.000Z",
  updatedAt: "2026-05-09T07:10:00.000Z",
};

export const lightweightSleepInsight: SleepInsight = {
  id: "si_001",
  period: "single_night",
  startDate: MOCK_SLEEP_DATE,
  endDate: MOCK_SLEEP_DATE,
  title: "Keep tonight a little gentler",
  body: "Last night's check-in suggests a lighter start could help you settle more easily tonight.",
  confidence: "medium",
  basedOn: {
    sleepLogIds: [lightweightSleepLog.id],
    sleepSessionId: lightweightSleepSession.id,
    talkSessionIds: ["ts_memory_001"],
    roomSessionIds: ["rs_001"],
    memoryItemIds: [eligibleVisibleMemory.id],
  },
  suggestionType: "try_gentler_talk",
  cta: {
    label: "Start with a gentle check-in",
    target: "talk",
    entryContext: {
      source: "sleep",
      sourceId: "si_001",
      intent: "tonight_suggestion",
      sleepInsightId: "si_001",
      tonePreset: "gentle",
      interactionIntensity: "low",
      createdAt: MOCK_CREATED_AT,
    },
  },
  homeEligible: true,
  createdAt: "2026-05-09T07:10:00.000Z",
};

export const homeTonightSuggestionEntryContext: TalkEntryContext = {
  source: "home",
  sourceId: lightweightSleepInsight.id,
  intent: "tonight_suggestion",
  sleepInsightId: lightweightSleepInsight.id,
  homeRecommendationId: "home_rec_tonight_suggestion_001",
  suggestedOpening: "We can try tonight's gentler suggestion together.",
  tonePreset: "gentle",
  interactionIntensity: "low",
  createdAt: MOCK_CREATED_AT,
};

export const homeTonightSuggestionRecommendationCta: HomeCTA = {
  id: "home_cta_tonight_suggestion_001",
  label: "Try tonight's suggestion",
  target: "talk",
  targetPath: "/talk",
  homeRecommendationId: "home_rec_tonight_suggestion_001",
  entryContext: homeTonightSuggestionEntryContext,
  createdAt: MOCK_CREATED_AT,
};

export const homeTonightSuggestionRecommendation: HomeRecommendation = {
  id: "home_rec_tonight_suggestion_001",
  type: "tonight_suggestion",
  title: "Tonight's suggestion",
  body: "A gentler start looks like the strongest sleep-linked next step tonight.",
  priority: 80,
  source: "sleep_insight",
  sourceId: lightweightSleepInsight.id,
  sourceDomain: "sleep",
  surface: "home_main",
  fallbackKind: "none",
  cta: homeTonightSuggestionRecommendationCta,
  createdAt: MOCK_CREATED_AT,
};

export const staleSleepLog: SleepLog = {
  id: "sl_stale_001",
  sleepDate: "2026-04-29",
  checkInDate: "2026-04-30",
  timezone: "Asia/Makassar",
  sleepQuality: 2,
  source: "manual_morning_checkin",
  createdAt: "2026-04-30T06:30:00.000Z",
  updatedAt: "2026-04-30T06:30:00.000Z",
};

export const roomOptions: [RoomOption, RoomOption, RoomOption] = [
  {
    id: "room_quiet_01",
    title: "Quiet Room",
    description: "Low stimulation and a steadier pace.",
    preset: "quiet",
    stimulationLevel: "low",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "room_warm_01",
    title: "Warm Room",
    description: "A little more warmth and conversational presence.",
    preset: "warm",
    stimulationLevel: "medium",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "room_minimal_01",
    title: "Minimal Room",
    description: "Reduced visual and conversational noise.",
    preset: "minimal",
    stimulationLevel: "low",
    isActive: true,
    sortOrder: 3,
  },
];

export const roomViewAfterOnboarding: RoomView = {
  id: "rv_001",
  source: "onboarding",
  onboardingPresetId: activeOnboardingPreset.id,
  viewedAt: "2026-05-08T22:42:00.000Z",
};

export const roomSessionAfterOnboarding: RoomSession = {
  id: "rs_001",
  roomId: "room_quiet_01",
  source: "onboarding",
  roomViewId: roomViewAfterOnboarding.id,
  onboardingPresetId: activeOnboardingPreset.id,
  startedAt: "2026-05-08T22:44:00.000Z",
  endedAt: "2026-05-08T22:45:00.000Z",
  durationSeconds: 60,
  exitReason: "tap_to_talk",
  followedByTalkSessionId: "ts_first_night_001",
};

export const roomContinuityState: RoomState = {
  id: "room_state_001",
  route: "/room",
  roomOptionIds: [
    roomOptions[0].id,
    roomOptions[1].id,
    roomOptions[2].id,
  ],
  roomViewId: roomViewAfterOnboarding.id,
  roomSessionId: roomSessionAfterOnboarding.id,
  continuityReason: "onboarding",
  onboardingPresetId: activeOnboardingPreset.id,
  onboardingPresetStatus: "active",
  talkEntryReady: true,
  createdAt: "2026-05-08T22:42:00.000Z",
  updatedAt: "2026-05-08T22:45:00.000Z",
};

export const returningHomeEntryContext: HomeEntryContext = {
  id: "home_entry_001",
  routeDecisionId: returningUserHomeRouteDecision.id,
  routeDecisionReason: returningUserHomeRouteDecision.reason,
  canonicalHomePath: "/home",
  runtimeObservedPath: "/",
  latestTalkSessionId: "ts_memory_001",
  latestRoomSessionId: roomSessionAfterOnboarding.id,
  latestSleepInsightId: lightweightSleepInsight.id,
  latestSleepLogId: lightweightSleepLog.id,
  eligibleMemoryId: eligibleVisibleMemory.id,
  missingDataKeys: [],
  staleDataKeys: [],
  activePresetState: "none",
  createdAt: MOCK_CREATED_AT,
};

export const partialFallbackEntryContext: HomeEntryContext = {
  id: "home_entry_partial_001",
  routeDecisionId: consumedPresetHomeRouteDecision.id,
  routeDecisionReason: consumedPresetHomeRouteDecision.reason,
  canonicalHomePath: "/home",
  runtimeObservedPath: "/",
  latestTalkSessionId: "ts_memory_001",
  latestRoomSessionId: roomSessionAfterOnboarding.id,
  missingDataKeys: ["latest_sleep_log", "eligible_memory"],
  staleDataKeys: ["latest_sleep_insight"],
  activePresetState: "consumed",
  createdAt: MOCK_CREATED_AT,
};

export const staleSleepFallbackEntryContext: HomeEntryContext = {
  id: "home_entry_stale_sleep_001",
  routeDecisionId: returningUserHomeRouteDecision.id,
  routeDecisionReason: returningUserHomeRouteDecision.reason,
  canonicalHomePath: "/home",
  runtimeObservedPath: "/",
  latestTalkSessionId: "ts_memory_001",
  latestRoomSessionId: roomSessionAfterOnboarding.id,
  latestSleepInsightId: lightweightSleepInsight.id,
  latestSleepLogId: staleSleepLog.id,
  missingDataKeys: [],
  staleDataKeys: ["latest_sleep_log"],
  activePresetState: "none",
  createdAt: MOCK_CREATED_AT,
};

export const errorFallbackEntryContext: HomeEntryContext = {
  id: "home_entry_error_001",
  routeDecisionId: stalePresetHomeRouteDecision.id,
  routeDecisionReason: stalePresetHomeRouteDecision.reason,
  canonicalHomePath: "/home",
  runtimeObservedPath: "/",
  sourceRecommendationId: "home_rec_error_001",
  sourceRecommendationType: "start_talk",
  missingDataKeys: ["route_decision", "source_recommendation"],
  staleDataKeys: ["active_onboarding_preset", "source_recommendation"],
  activePresetState: "stale",
  createdAt: MOCK_CREATED_AT,
};

export const roomToTalkEntryContext: TalkEntryContext = {
  source: "room",
  sourceId: roomSessionAfterOnboarding.id,
  intent: "tap_from_room_after_onboarding",
  roomId: roomSessionAfterOnboarding.roomId,
  roomViewId: roomViewAfterOnboarding.id,
  roomSessionId: roomSessionAfterOnboarding.id,
  onboardingPresetId: activeOnboardingPreset.id,
  onboardingPreset: activeOnboardingPreset,
  createdAt: "2026-05-08T22:45:00.000Z",
};

export const firstNightTalkSession: TalkSession = {
  id: "ts_first_night_001",
  entryContext: roomToTalkEntryContext,
  mode: "onboarding_first_session",
  startedAt: "2026-05-08T22:45:00.000Z",
  endedAt: "2026-05-08T22:57:00.000Z",
  durationSeconds: 720,
  messageCount: 6,
  userMessageCount: 3,
  assistantMessageCount: 3,
  sessionSummary: "A short first-night session grounded by the onboarding preset and quiet room handoff.",
  emotionalTone: "restless",
  sleepRelated: true,
  latestMemoryExtractionRunId: "mer_first_night_001",
  completedMemoryExtractionRunId: "mer_first_night_001",
  memoryExtractionStatus: "completed",
  generatedMemoryItemIds: ["mem_first_night_001"],
};

export const talkSessionContinuity: TalkSession = {
  id: "ts_memory_001",
  entryContext: homeToTalkEntryContext,
  mode: "memory_reflection",
  startedAt: "2026-05-08T21:30:00.000Z",
  endedAt: "2026-05-08T21:42:00.000Z",
  durationSeconds: 720,
  messageCount: 10,
  userMessageCount: 5,
  assistantMessageCount: 5,
  sessionSummary: "A calm reflection about what helped the user settle earlier in the week.",
  emotionalTone: "calm",
  sleepRelated: true,
  latestMemoryExtractionRunId: "mer_memory_001",
  completedMemoryExtractionRunId: "mer_memory_001",
  memoryExtractionStatus: "completed",
  generatedMemoryItemIds: [eligibleVisibleMemory.id],
};

export const silentTalkSession: TalkSession = {
  id: "ts_silent_001",
  entryContext: {
    source: "direct",
    intent: "open_chat",
    createdAt: "2026-05-09T00:10:00.000Z",
  },
  mode: "open_chat",
  startedAt: "2026-05-09T00:10:00.000Z",
  endedAt: "2026-05-09T00:11:00.000Z",
  durationSeconds: 60,
  messageCount: 1,
  userMessageCount: 0,
  assistantMessageCount: 1,
  memoryExtractionStatus: "skipped",
  latestMemoryExtractionRunId: "mer_silent_001",
};

export const completedMemoryExtractionRun: MemoryExtractionRun = {
  id: "mer_memory_001",
  talkSessionId: talkSessionContinuity.id,
  status: "completed",
  startedAt: "2026-05-08T21:42:10.000Z",
  completedAt: "2026-05-08T21:42:13.000Z",
  generatedMemoryItemIds: [eligibleVisibleMemory.id],
};

export const skippedMemoryExtractionRun: MemoryExtractionRun = {
  id: "mer_silent_001",
  talkSessionId: silentTalkSession.id,
  status: "skipped",
  reason: "user_message_count_zero",
  startedAt: "2026-05-09T00:11:00.000Z",
  completedAt: "2026-05-09T00:11:00.000Z",
};

export const sleepSuggestionRuleResult: SuggestionRuleResult = {
  suggestionType: lightweightSleepInsight.suggestionType,
  priority: 80,
  confidence: lightweightSleepInsight.confidence,
  basedOn: lightweightSleepInsight.basedOn,
  target: "talk",
};

export const talkSessionMessages: ConversationMessage[] = [
  {
    id: "msg_001",
    talkSessionId: talkSessionContinuity.id,
    role: "assistant",
    contentText: "We can start gently with what felt most noticeable last night.",
    createdAt: "2026-05-08T21:30:00.000Z",
  },
  {
    id: "msg_002",
    talkSessionId: talkSessionContinuity.id,
    role: "user",
    contentText: "A softer start helped me stay with the conversation longer.",
    createdAt: "2026-05-08T21:31:00.000Z",
  },
];

export const homeTalkContinuityEntryContext: TalkEntryContext = {
  source: "home",
  sourceId: talkSessionContinuity.id,
  intent: "open_chat",
  homeRecommendationId: "home_rec_conversation_001",
  suggestedOpening: "We can pick up gently from the tone that worked last time.",
  tonePreset: "gentle",
  interactionIntensity: "low",
  createdAt: MOCK_CREATED_AT,
};

export const homeTalkContinuityRecommendationCta: HomeCTA = {
  id: "home_cta_conversation_001",
  label: "Start gently",
  target: "talk",
  targetPath: "/talk",
  homeRecommendationId: "home_rec_conversation_001",
  entryContext: homeTalkContinuityEntryContext,
  createdAt: MOCK_CREATED_AT,
};

export const homeTalkContinuityRecommendation: HomeRecommendation = {
  id: "home_rec_conversation_001",
  type: "start_talk",
  title: "Continue with a gentle start",
  body: "Recent conversation continuity suggests a low-pressure return to Talk.",
  priority: 70,
  source: "talk_session",
  sourceId: talkSessionContinuity.id,
  sourceDomain: "talk",
  surface: "home_main",
  fallbackKind: "none",
  cta: homeTalkContinuityRecommendationCta,
  createdAt: MOCK_CREATED_AT,
};

export const homeRoomContinuityEntryContext: TalkEntryContext = {
  source: "home",
  sourceId: roomSessionAfterOnboarding.id,
  intent: "quiet_company",
  roomId: roomSessionAfterOnboarding.roomId,
  roomSessionId: roomSessionAfterOnboarding.id,
  homeRecommendationId: "home_rec_room_001",
  suggestedOpening: "We can keep the calmer room pace as we re-enter Talk.",
  tonePreset: "quiet",
  interactionIntensity: "low",
  createdAt: MOCK_CREATED_AT,
};

export const homeRoomContinuityRecommendationCta: HomeCTA = {
  id: "home_cta_room_001",
  label: "Continue with quiet company",
  target: "talk",
  targetPath: "/talk",
  homeRecommendationId: "home_rec_room_001",
  entryContext: homeRoomContinuityEntryContext,
  createdAt: MOCK_CREATED_AT,
};

export const homeRoomContinuityRecommendation: HomeRecommendation = {
  id: "home_rec_room_001",
  type: "start_talk",
  title: "Continue with quiet company",
  body: "Room continuity is available and can hand off directly into Talk.",
  priority: 60,
  source: "room_session",
  sourceId: roomSessionAfterOnboarding.id,
  sourceDomain: "room",
  surface: "home_main",
  fallbackKind: "none",
  cta: homeRoomContinuityRecommendationCta,
  createdAt: MOCK_CREATED_AT,
};

export const systemDefaultFallbackCta: HomeCTA = {
  id: "home_cta_system_001",
  label: "Start a simple check-in",
  target: "talk",
  targetPath: "/talk",
  homeRecommendationId: "home_rec_system_001",
  entryContext: {
    source: "home",
    intent: "open_chat",
    homeRecommendationId: "home_rec_system_001",
    tonePreset: "neutral",
    interactionIntensity: "low",
    createdAt: MOCK_CREATED_AT,
  },
  createdAt: MOCK_CREATED_AT,
};

export const systemDefaultFallbackRecommendation: HomeRecommendation = {
  id: "home_rec_system_001",
  type: "start_talk",
  title: "Start with a simple check-in",
  body: "There is no stronger continuity signal right now, so a short talk is the safest next step.",
  priority: 10,
  source: "system_default",
  sourceDomain: "system",
  surface: "home_main",
  fallbackKind: "system_default_fallback",
  cta: systemDefaultFallbackCta,
  createdAt: MOCK_CREATED_AT,
};

export const dataPartialFallbackCta: HomeCTA = {
  id: "home_cta_partial_001",
  label: "Start a gentle chat",
  target: "talk",
  targetPath: "/talk",
  homeRecommendationId: "home_rec_partial_001",
  entryContext: {
    source: "home",
    intent: "open_chat",
    homeRecommendationId: "home_rec_partial_001",
    tonePreset: "gentle",
    interactionIntensity: "low",
    createdAt: MOCK_CREATED_AT,
  },
  createdAt: MOCK_CREATED_AT,
};

export const dataPartialFallbackRecommendation: HomeRecommendation = {
  id: "home_rec_partial_001",
  type: "start_talk",
  title: "Start gently tonight",
  body: "Some continuity inputs are missing, but a low-pressure start is still safe.",
  priority: 20,
  source: "talk_session",
  sourceId: talkSessionContinuity.id,
  sourceDomain: "talk",
  surface: "home_main",
  fallbackKind: "data_partial_fallback",
  cta: dataPartialFallbackCta,
  createdAt: MOCK_CREATED_AT,
};

export const errorSafeFallbackCta: HomeCTA = {
  id: "home_cta_error_001",
  label: "Start gently",
  target: "talk",
  targetPath: "/talk",
  homeRecommendationId: "home_rec_error_001",
  entryContext: {
    source: "home",
    intent: "gentle_start",
    homeRecommendationId: "home_rec_error_001",
    tonePreset: "gentle",
    interactionIntensity: "low",
    createdAt: MOCK_CREATED_AT,
  },
  createdAt: MOCK_CREATED_AT,
};

export const errorSafeFallbackRecommendation: HomeRecommendation = {
  id: "home_rec_error_001",
  type: "start_talk",
  title: "Start gently",
  body: "A safer, traceable talk entry is available while other continuity inputs are not.",
  priority: 5,
  source: "talk_session",
  sourceId: talkSessionContinuity.id,
  sourceDomain: "talk",
  surface: "home_main",
  fallbackKind: "error_safe_fallback",
  cta: errorSafeFallbackCta,
  createdAt: MOCK_CREATED_AT,
};

export const staleSleepFallbackCta: HomeCTA = {
  id: "home_cta_stale_sleep_001",
  label: "Start a gentle check-in",
  target: "talk",
  targetPath: "/talk",
  homeRecommendationId: "home_rec_stale_sleep_001",
  entryContext: {
    source: "home",
    intent: "open_chat",
    homeRecommendationId: "home_rec_stale_sleep_001",
    tonePreset: "gentle",
    interactionIntensity: "low",
    createdAt: MOCK_CREATED_AT,
  },
  createdAt: MOCK_CREATED_AT,
};

export const staleSleepFallbackRecommendation: HomeRecommendation = {
  id: "home_rec_stale_sleep_001",
  type: "start_talk",
  title: "Start gently tonight",
  body: "Your latest sleep check-in looks stale, so Home falls back to a lightweight talk entry.",
  priority: 15,
  source: "system_default",
  sourceDomain: "system",
  surface: "home_main",
  fallbackKind: "data_partial_fallback",
  cta: staleSleepFallbackCta,
  createdAt: MOCK_CREATED_AT,
};

export const normalHomePriorityRecommendations: [
  HomeRecommendation,
  HomeRecommendation,
  HomeRecommendation,
  HomeRecommendation,
] = [
  homeRecommendationFromMemory,
  homeSleepLogRecommendation,
  homeTonightSuggestionRecommendation,
  homeTalkContinuityRecommendation,
];

export const returningUserHomeState: HomeState = {
  id: "home_state_001",
  route: "/home",
  status: "recommendation_ready",
  continuitySource: "memory",
  entryContextId: returningHomeEntryContext.id,
  mainRecommendationId: homeRecommendationFromMemory.id,
  mainCtaId: homeRecommendationFromMemoryCta.id,
  continuitySummary: "One recent memory and one valid sleep check-in are available.",
  diagnosticsNavTargets: ["talk", "room", "memory", "sleep"],
  createdAt: MOCK_CREATED_AT,
};

export const systemDefaultFallbackHomeState: HomeState = {
  id: "home_state_system_001",
  route: "/home",
  status: "fallback_ready",
  continuitySource: "none",
  entryContextId: partialFallbackEntryContext.id,
  mainRecommendationId: systemDefaultFallbackRecommendation.id,
  mainCtaId: systemDefaultFallbackCta.id,
  continuitySummary: "No stronger continuity source is currently available.",
  diagnosticsNavTargets: ["talk", "room", "memory", "sleep"],
  createdAt: MOCK_CREATED_AT,
};

export const dataPartialFallbackHomeState: HomeState = {
  id: "home_state_partial_001",
  route: "/home",
  status: "fallback_ready",
  continuitySource: "talk",
  entryContextId: partialFallbackEntryContext.id,
  mainRecommendationId: dataPartialFallbackRecommendation.id,
  mainCtaId: dataPartialFallbackCta.id,
  continuitySummary: "Some continuity inputs are missing or stale, but Home remains usable.",
  diagnosticsNavTargets: ["talk", "room", "memory", "sleep"],
  createdAt: MOCK_CREATED_AT,
};

export const errorSafeFallbackHomeState: HomeState = {
  id: "home_state_error_001",
  route: "/home",
  status: "fallback_ready",
  continuitySource: "talk",
  entryContextId: errorFallbackEntryContext.id,
  mainRecommendationId: errorSafeFallbackRecommendation.id,
  mainCtaId: errorSafeFallbackCta.id,
  continuitySummary: "Unsafe continuity inputs were suppressed in favor of a safer entry point.",
  diagnosticsNavTargets: ["talk", "room", "memory", "sleep"],
  createdAt: MOCK_CREATED_AT,
};

export const staleSleepFallbackHomeState: HomeState = {
  id: "home_state_stale_sleep_001",
  route: "/home",
  status: "fallback_ready",
  continuitySource: "sleep",
  entryContextId: staleSleepFallbackEntryContext.id,
  mainRecommendationId: staleSleepFallbackRecommendation.id,
  mainCtaId: staleSleepFallbackCta.id,
  continuitySummary: "A stale sleep check-in was excluded before deriving the Home fallback.",
  diagnosticsNavTargets: ["talk", "room", "memory", "sleep"],
  createdAt: MOCK_CREATED_AT,
};

export const agreedMemoryFeedback: MemoryFeedback = {
  id: "mf_001",
  memoryItemId: eligibleVisibleMemory.id,
  action: "agree",
  effect: "reinforce_memory",
  note: "This still feels accurate.",
  createdAt: "2026-05-09T08:10:00.000Z",
};

export const disagreedMemoryFeedback: MemoryFeedback = {
  id: "mf_002",
  memoryItemId: contradictedMemoryExcluded.id,
  action: "disagree",
  effect: "contradict_memory",
  note: "This does not fit and should not be reused as a positive signal.",
  createdAt: "2026-05-04T08:00:00.000Z",
};

export const hiddenMemoryFeedback: MemoryFeedback = {
  id: "mf_003",
  memoryItemId: hiddenMemoryExcluded.id,
  action: "hide",
  effect: "hide_from_memory_page_and_personalization",
  createdAt: "2026-05-05T07:30:00.000Z",
};

export const homeRecommendationViewedEvent: ProductEvent = {
  id: "evt_001",
  anonymousId: returningUserProfile.anonymousId,
  eventName: "home_recommendation_viewed",
  page: "home",
  entityType: "home_recommendation",
  entityId: homeRecommendationFromMemory.id,
  properties: {
    source: homeRecommendationFromMemory.source,
    priority: homeRecommendationFromMemory.priority,
  },
  createdAt: MOCK_CREATED_AT,
};

export const futureOnlySleepGoal: SleepGoal = {
  id: "sleep_goal_future_001",
  status: "future_only",
  isActive: false,
  reason: "not_defined_in_stage3_product_logic",
};

export const futureOnlyRitual: Ritual = {
  id: "ritual_future_001",
  status: "future_only",
  isActive: false,
  reason: "not_defined_in_stage3_product_logic",
};

export const canonicalRecommendationAlias: Recommendation =
  homeRecommendationFromMemory;

export const stage3MockData = {
  userProfiles: {
    firstLaunchUserProfile,
    returningUserProfile,
  },
  onboarding: {
    onboardingDraftInProgress,
    onboardingContextCardPreview,
    onboardingStateIncomplete,
    onboardingStateCompleted,
    activeOnboardingPreset,
    staleOnboardingPreset,
    expiredOnboardingPreset,
    consumedOnboardingPreset,
  },
  routeDecisions: {
    firstLaunchRouteDecision,
    onboardingIncompleteRouteDecision,
    activePresetRedirectRouteDecision,
    returningUserHomeRouteDecision,
    consumedPresetHomeRouteDecision,
    stalePresetHomeRouteDecision,
  },
  home: {
    returningHomeEntryContext,
    partialFallbackEntryContext,
    staleSleepFallbackEntryContext,
    errorFallbackEntryContext,
    homeRecommendationFromMemory,
    homeSleepLogRecommendation,
    homeTonightSuggestionRecommendation,
    homeTalkContinuityRecommendation,
    homeRoomContinuityRecommendation,
    homeRecommendationFromMemoryCta,
    homeSleepLogRecommendationCta,
    homeTonightSuggestionRecommendationCta,
    homeTalkContinuityRecommendationCta,
    homeRoomContinuityRecommendationCta,
    normalHomePriorityRecommendations,
    systemDefaultFallbackRecommendation,
    dataPartialFallbackRecommendation,
    errorSafeFallbackRecommendation,
    staleSleepFallbackRecommendation,
    returningUserHomeState,
    systemDefaultFallbackHomeState,
    dataPartialFallbackHomeState,
    errorSafeFallbackHomeState,
    staleSleepFallbackHomeState,
  },
  talk: {
    roomToTalkEntryContext,
    homeToTalkEntryContext,
    firstNightTalkSession,
    talkSessionContinuity,
    silentTalkSession,
    completedMemoryExtractionRun,
    skippedMemoryExtractionRun,
    talkSessionMessages,
  },
  memory: {
    eligibleVisibleMemory,
    weakenedVisibleMemory,
    contradictedMemoryExcluded,
    hiddenMemoryExcluded,
    archivedMemoryExcluded,
    agreedMemoryFeedback,
    disagreedMemoryFeedback,
    hiddenMemoryFeedback,
    memoryEligibilityScenarios,
  },
  sleep: {
    futureOnlySleepGoal,
    lightweightSleepLog,
    staleSleepLog,
    lightweightSleepInsight,
    lightweightSleepSession,
    sleepSuggestionRuleResult,
  },
  room: {
    roomOptions,
    roomViewAfterOnboarding,
    roomSessionAfterOnboarding,
    roomContinuityState,
  },
  ritual: {
    futureOnlyRitual,
  },
  aliases: {
    canonicalRecommendationAlias,
  },
  analytics: {
    homeRecommendationViewedEvent,
  },
};
