import type {
  HomeCTA,
  HomeEntryContext,
  HomeRecommendation,
  MemoryItem,
  OnboardingPreset,
  UserProfile,
} from "../contracts";

export const stage4MockDataNotice =
  "Stage 4 mock data is local-only scaffold data. It is not backend, database, auth, analytics, or real AI memory wiring.";

const MOCK_NOW = "2026-05-27T00:00:00.000Z";

export const mockReturningUser: UserProfile = {
  anonymousId: "anon_stage4_returning",
  hasCompletedOnboarding: true,
  createdAt: "2026-05-01T08:00:00.000Z",
  updatedAt: MOCK_NOW,
};

export const mockActiveOnboardingPreset: OnboardingPreset = {
  id: "obp_stage4_active",
  presetId: "preset_stage4_active",
  q1State: "overthinking",
  q2SupportStyle: "quiet_presence",
  baseMode: "quiet_presence",
  stateModifier: "overthinking",
  openingCopyId: "copy_stage4_quiet_start",
  replyLengthDefault: "short",
  questionBudgetFirst3Turns: 1,
  sleepTransitionEnabled: true,
  fallbackChain: ["quiet_presence_retry"],
  status: "active",
  createdAt: MOCK_NOW,
  expiresAt: "2026-05-27T00:30:00.000Z",
};

export const mockEligibleMemory: MemoryItem = {
  id: "mem_stage4_eligible",
  source: "talk_session",
  sourceId: "ts_stage4",
  type: "support_style",
  title: "A quiet opening may help",
  body: "Local mock memory used to verify Stage 4 architecture boundaries.",
  confidence: "medium",
  influenceWeight: 0.5,
  status: "active",
  excludeFromPersonalization: false,
  createdAt: MOCK_NOW,
  updatedAt: MOCK_NOW,
};

export const mockHomeEntryContext: HomeEntryContext = {
  id: "home_entry_stage4",
  routeDecisionId: "route_stage4_home",
  routeDecisionReason: "returning_user_home",
  canonicalHomePath: "/home",
  runtimeObservedPath: "/",
  eligibleMemoryId: mockEligibleMemory.id,
  missingDataKeys: [],
  staleDataKeys: [],
  activePresetState: "none",
  createdAt: MOCK_NOW,
};

export const mockHomeCta: HomeCTA = {
  id: "home_cta_stage4",
  label: "Talk about this",
  target: "talk",
  targetPath: "/talk",
  homeRecommendationId: "home_rec_stage4",
  entryContext: {
    source: "home",
    sourceId: mockEligibleMemory.id,
    intent: "discuss_memory",
    memoryId: mockEligibleMemory.id,
    homeRecommendationId: "home_rec_stage4",
    createdAt: MOCK_NOW,
  },
  createdAt: MOCK_NOW,
};

export const mockHomeRecommendation: HomeRecommendation = {
  id: "home_rec_stage4",
  type: "review_memory",
  title: "Review what I noticed",
  body: "This is a local mock recommendation with traceable source data.",
  priority: 100,
  source: "memory",
  sourceId: mockEligibleMemory.id,
  sourceDomain: "memory",
  surface: "home_main",
  fallbackKind: "none",
  cta: mockHomeCta,
  createdAt: MOCK_NOW,
};

export const unresolvedStage4Dependencies = [
  "real backend API",
  "persistent memory storage",
  "persistent sleep check-in storage",
  "production analytics provider",
  "auth/account merge",
];
