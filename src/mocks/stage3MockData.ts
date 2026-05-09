import type {
  CompanionConversation,
  ConversationMessage,
  HomeCTA,
  HomeEntryContext,
  HomeRecommendation,
  HomeState,
  MemoryFeedbackEvent,
  MemoryItem,
  OnboardingPreset,
  OnboardingState,
  Recommendation,
  Ritual,
  RoomOption,
  RoomSession,
  RoomState,
  RoomView,
  RouteDecision,
  SleepCheckIn,
  SleepGoal,
  SleepInsight,
  SleepSession,
  TalkEntryContext,
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
  sourceId: "conv_home_001",
  type: "support_style",
  title: "A gentler opening helps you settle",
  body: "Short, steady openings seem to help you stay engaged without pressure.",
  evidence: {
    sourceSummary: "User responded more positively to a gentle opening in the last evening talk.",
    sourceSessionId: "conv_home_001",
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
  sourceId: "conv_old_001",
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
  sourceId: "conv_old_002",
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
      sourceId: "conv_expired_like_001",
    },
    eligibleForHomeContinuity: false,
    derivedReason: "expired_derived",
  },
  {
    memory: {
      ...eligibleVisibleMemory,
      id: "mem_blocked_derived_001",
      sourceId: "conv_blocked_like_001",
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

export const lightweightSleepCheckIn: SleepCheckIn = {
  id: "sleep_checkin_001",
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
  preSleepTalkSessionId: "conv_home_001",
  preSleepRoomSessionId: "room_session_001",
  notes: "I took longer to settle than I wanted.",
  source: "manual_morning_checkin",
  createdAt: "2026-05-09T06:40:00.000Z",
  updatedAt: "2026-05-09T06:42:00.000Z",
};

export const lightweightSleepSession: SleepSession = {
  id: "sleep_session_001",
  sleepDate: MOCK_SLEEP_DATE,
  latestSleepCheckInId: lightweightSleepCheckIn.id,
  latestSleepInsightId: "sleep_insight_001",
  preSleepTalkSessionId: "conv_home_001",
  preSleepRoomSessionId: "room_session_001",
  continuityState: "complete",
  createdAt: "2026-05-09T06:42:00.000Z",
  updatedAt: "2026-05-09T07:10:00.000Z",
};

export const lightweightSleepInsight: SleepInsight = {
  id: "sleep_insight_001",
  period: "single_night",
  startDate: MOCK_SLEEP_DATE,
  endDate: MOCK_SLEEP_DATE,
  title: "Keep tonight a little gentler",
  body: "Last night's check-in suggests a lighter start could help you settle more easily tonight.",
  confidence: "medium",
  basedOn: {
    sleepCheckInIds: [lightweightSleepCheckIn.id],
    sleepSessionId: lightweightSleepSession.id,
    talkSessionIds: ["conv_home_001"],
    roomSessionIds: ["room_session_001"],
    memoryItemIds: [eligibleVisibleMemory.id],
  },
  suggestionType: "try_gentler_talk",
  cta: {
    label: "Start with a gentle check-in",
    target: "talk",
    entryContext: {
      source: "sleep",
      sourceId: "sleep_insight_001",
      intent: "tonight_suggestion",
      sleepInsightId: "sleep_insight_001",
      tonePreset: "gentle",
      interactionIntensity: "low",
      createdAt: MOCK_CREATED_AT,
    },
  },
  homeEligible: true,
  createdAt: "2026-05-09T07:10:00.000Z",
};

export const staleSleepCheckIn: SleepCheckIn = {
  id: "sleep_checkin_stale_001",
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
  id: "room_view_001",
  source: "after_onboarding",
  onboardingPresetId: activeOnboardingPreset.id,
  viewedAt: "2026-05-08T22:42:00.000Z",
};

export const roomSessionAfterOnboarding: RoomSession = {
  id: "room_session_001",
  roomId: "room_quiet_01",
  source: "after_onboarding",
  roomViewId: roomViewAfterOnboarding.id,
  onboardingPresetId: activeOnboardingPreset.id,
  startedAt: "2026-05-08T22:44:00.000Z",
  endedAt: "2026-05-08T22:45:00.000Z",
  durationSeconds: 60,
  exitReason: "tap_to_talk",
  followedByTalkSessionId: "conv_home_001",
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
  continuityReason: "after_onboarding",
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
  latestTalkSessionId: "conv_home_001",
  latestRoomSessionId: roomSessionAfterOnboarding.id,
  latestSleepInsightId: lightweightSleepInsight.id,
  latestSleepCheckInId: lightweightSleepCheckIn.id,
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
  latestTalkSessionId: "conv_home_001",
  latestRoomSessionId: roomSessionAfterOnboarding.id,
  missingDataKeys: ["latest_sleep_check_in", "eligible_memory"],
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
  latestTalkSessionId: "conv_home_001",
  latestRoomSessionId: roomSessionAfterOnboarding.id,
  latestSleepInsightId: lightweightSleepInsight.id,
  latestSleepCheckInId: staleSleepCheckIn.id,
  missingDataKeys: [],
  staleDataKeys: ["latest_sleep_check_in"],
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
  sourceRecommendationType: "enter_room",
  missingDataKeys: ["route_decision", "source_recommendation"],
  staleDataKeys: ["active_onboarding_preset", "source_recommendation"],
  activePresetState: "stale",
  createdAt: MOCK_CREATED_AT,
};

export const conversationContinuity: CompanionConversation = {
  id: "conv_home_001",
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
  latestMemoryExtractionRunId: "mem_run_001",
  completedMemoryExtractionRunId: "mem_run_001",
  memoryExtractionStatus: "completed",
  generatedMemoryItemIds: [eligibleVisibleMemory.id],
};

export const conversationMessages: ConversationMessage[] = [
  {
    id: "msg_001",
    conversationId: conversationContinuity.id,
    role: "assistant",
    contentText: "We can start gently with what felt most noticeable last night.",
    createdAt: "2026-05-08T21:30:00.000Z",
  },
  {
    id: "msg_002",
    conversationId: conversationContinuity.id,
    role: "user",
    contentText: "A softer start helped me stay with the conversation longer.",
    createdAt: "2026-05-08T21:31:00.000Z",
  },
];

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
  sourceId: conversationContinuity.id,
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
  sourceId: conversationContinuity.id,
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

export const disagreedMemoryFeedbackEvent: MemoryFeedbackEvent = {
  id: "memory_feedback_001",
  memoryItemId: contradictedMemoryExcluded.id,
  action: "disagree",
  previousStatus: "active",
  resultingStatus: "contradicted",
  excludeFromPersonalization: false,
  source: "memory_page",
  createdAt: "2026-05-04T08:00:00.000Z",
};

export const hiddenMemoryFeedbackEvent: MemoryFeedbackEvent = {
  id: "memory_feedback_002",
  memoryItemId: hiddenMemoryExcluded.id,
  action: "hide",
  previousStatus: "active",
  resultingStatus: "hidden",
  excludeFromPersonalization: true,
  source: "memory_page",
  createdAt: "2026-05-05T07:30:00.000Z",
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
    errorFallbackEntryContext,
    homeRecommendationFromMemory,
    homeRecommendationFromMemoryCta,
    systemDefaultFallbackRecommendation,
    dataPartialFallbackRecommendation,
    errorSafeFallbackRecommendation,
    returningUserHomeState,
    systemDefaultFallbackHomeState,
    dataPartialFallbackHomeState,
    errorSafeFallbackHomeState,
  },
  talk: {
    homeToTalkEntryContext,
    conversationContinuity,
    conversationMessages,
  },
  memory: {
    eligibleVisibleMemory,
    weakenedVisibleMemory,
    contradictedMemoryExcluded,
    hiddenMemoryExcluded,
    archivedMemoryExcluded,
    disagreedMemoryFeedbackEvent,
    hiddenMemoryFeedbackEvent,
    memoryEligibilityScenarios,
  },
  sleep: {
    futureOnlySleepGoal,
    lightweightSleepCheckIn,
    staleSleepCheckIn,
    lightweightSleepInsight,
    lightweightSleepSession,
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
};
