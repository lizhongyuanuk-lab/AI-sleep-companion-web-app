import type {
  MemoryFeedback,
  MemoryItem,
  OnboardingDraft,
  OnboardingPreset,
  RoomSession,
  RoomView,
  SleepInsight,
  SleepLog,
  TalkEntryContext,
} from "../contracts";

export const stage5LocalDataNotice =
  "Stage 5 local data is browser-local compatibility wiring. It is not backend, database, auth, production analytics, wearable, or real LLM behavior.";

const stage5Namespace = "ai-companion-web.stage5.local-data.v1";

export const stage5LocalDataKeys = {
  onboardingCompleted: `${stage5Namespace}.onboarding-completed`,
  onboardingDraft: `${stage5Namespace}.onboarding-draft`,
  activeOnboardingPreset: `${stage5Namespace}.active-onboarding-preset`,
  talkEntryContext: `${stage5Namespace}.talk-entry-context`,
  memoryItems: `${stage5Namespace}.memory-items`,
  memoryFeedback: `${stage5Namespace}.memory-feedback`,
  sleepLogs: `${stage5Namespace}.sleep-logs`,
  sleepInsights: `${stage5Namespace}.sleep-insights`,
  roomViews: `${stage5Namespace}.room-views`,
  roomSessions: `${stage5Namespace}.room-sessions`,
  talkSoundSettings: `${stage5Namespace}.talk-sound-settings`,
} as const;

export const legacyCompatibilityKeys = {
  firstLaunchCompleted: "ai-companion-web.first-launch.completed",
  firstLaunchDraft: "ai-companion-web.first-launch.draft",
  firstLaunchPreset: "ai-companion-web.first-launch.preset",
  firstLaunchTalkEntryContext:
    "ai-companion-web.first-launch.talk-entry-context",
} as const;

type LegacyFirstLaunchPreset = {
  preset_id: string;
  q1_state: string;
  q2_support_style: string;
  base_mode: string;
  state_modifier: string;
  opening_copy_id: string;
  reply_length_default: string;
  question_budget_first_3_turns: number;
  sleep_transition_enabled: boolean;
  fallback_chain: string[];
  created_at: string;
  status: "active" | "consumed" | "expired";
};

type LegacyFirstLaunchDraft = {
  current_step?: string;
  q1_state?: string | null;
  q2_support_style?: string | null;
  updated_at?: string;
};

type LocalStorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

const legacyPresetTtlMs = 30 * 60 * 1000;
const legacyDraftTtlMs = 12 * 60 * 60 * 1000;

const q1Map: Record<string, OnboardingPreset["q1State"]> = {
  tired_but_awake: "sleep_blocked",
  mind_racing: "overthinking",
  anxious_or_irritated: "anxious_irritated",
  lonely_needing_company: "lonely_need_presence",
};

const q2Map: Record<string, OnboardingPreset["q2SupportStyle"]> = {
  help_me_sleep_fast: "sleep_guide",
  soothe_and_chat: "comfort_talk",
  meditation_practice: "mindfulness_guide",
  quiet_company: "quiet_presence",
};

const baseModeMap: Record<string, OnboardingPreset["baseMode"]> = {
  sleep_settling: "sleep_guide",
  gentle_grounding: "comfort_talk",
  meditative: "mindfulness_guide",
  quiet_presence: "quiet_presence",
};

const stateModifierMap: Record<string, OnboardingPreset["stateModifier"]> = {
  low_energy: "sleep_blocked",
  overthinking: "overthinking",
  emotionally_full: "anxious_irritated",
  needs_company: "lonely_need_presence",
};

function getBrowserStorage(): LocalStorageLike | null {
  if (typeof window === "undefined") return null;
  return window.localStorage;
}

function readJson<T>(storageKey: string): T | null {
  const storage = getBrowserStorage();
  if (!storage) return null;

  const rawValue = storage.getItem(storageKey);
  if (!rawValue) return null;

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    storage.removeItem(storageKey);
    return null;
  }
}

function writeJson(storageKey: string, value: unknown): boolean {
  const storage = getBrowserStorage();
  if (!storage) return false;

  try {
    storage.setItem(storageKey, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function removeItem(storageKey: string): boolean {
  const storage = getBrowserStorage();
  if (!storage) return false;

  try {
    storage.removeItem(storageKey);
    return true;
  } catch {
    return false;
  }
}

function readBoolean(storageKey: string): boolean | null {
  const storage = getBrowserStorage();
  if (!storage) return null;

  const rawValue = storage.getItem(storageKey);
  if (rawValue === "true") return true;
  if (rawValue === "false") return false;
  return null;
}

function mapLegacyPreset(
  legacyPreset: LegacyFirstLaunchPreset | null,
): OnboardingPreset | null {
  if (!legacyPreset) return null;

  const createdAt = new Date(legacyPreset.created_at);
  if (Number.isNaN(createdAt.getTime())) return null;

  const q1State = q1Map[legacyPreset.q1_state];
  const q2SupportStyle = q2Map[legacyPreset.q2_support_style];
  const baseMode = baseModeMap[legacyPreset.base_mode];
  const stateModifier = stateModifierMap[legacyPreset.state_modifier];

  if (!q1State || !q2SupportStyle || !baseMode || !stateModifier) return null;

  const expiresAt = new Date(
    createdAt.getTime() + legacyPresetTtlMs,
  ).toISOString();

  return {
    id: legacyPreset.preset_id,
    presetId: legacyPreset.preset_id,
    q1State,
    q2SupportStyle,
    baseMode,
    stateModifier,
    openingCopyId: legacyPreset.opening_copy_id,
    replyLengthDefault:
      legacyPreset.reply_length_default === "medium" ? "medium" : "short",
    questionBudgetFirst3Turns:
      legacyPreset.question_budget_first_3_turns === 2
        ? 2
        : legacyPreset.question_budget_first_3_turns === 1
        ? 1
        : 0,
    sleepTransitionEnabled: legacyPreset.sleep_transition_enabled,
    fallbackChain: legacyPreset.fallback_chain,
    status: legacyPreset.status,
    createdAt: legacyPreset.created_at,
    expiresAt,
  };
}

function mapLegacyDraft(
  legacyDraft: LegacyFirstLaunchDraft | null,
): OnboardingDraft | null {
  if (!legacyDraft?.updated_at) return null;

  const updatedAt = new Date(legacyDraft.updated_at);
  if (Number.isNaN(updatedAt.getTime())) return null;

  const q1State = legacyDraft.q1_state
    ? q1Map[legacyDraft.q1_state]
    : undefined;
  const q2SupportStyle = legacyDraft.q2_support_style
    ? q2Map[legacyDraft.q2_support_style]
    : undefined;

  const stepIndex: OnboardingDraft["stepIndex"] =
    legacyDraft.current_step === "onboarding_q1"
      ? 1
      : legacyDraft.current_step === "onboarding_q2"
      ? 2
      : legacyDraft.current_step === "session_result" ||
        legacyDraft.current_step === "create_room_entry" ||
        legacyDraft.current_step === "select_room_theme" ||
        legacyDraft.current_step === "room_generating" ||
        legacyDraft.current_step === "room_generation_preview" ||
        legacyDraft.current_step === "room_page"
      ? 3
      : 0;

  return {
    stepIndex,
    q1State,
    q2SupportStyle,
    draftUpdatedAt: legacyDraft.updated_at,
    expiresAt: new Date(updatedAt.getTime() + legacyDraftTtlMs).toISOString(),
  };
}

export function readLocalOnboardingCompleted(): boolean {
  return (
    readBoolean(stage5LocalDataKeys.onboardingCompleted) ??
    readBoolean(legacyCompatibilityKeys.firstLaunchCompleted) ??
    false
  );
}

export function writeLocalOnboardingCompleted(completed: boolean): boolean {
  const storage = getBrowserStorage();
  if (!storage) return false;

  try {
    storage.setItem(
      stage5LocalDataKeys.onboardingCompleted,
      completed ? "true" : "false",
    );
    return true;
  } catch {
    return false;
  }
}

export function readLocalOnboardingDraft(): OnboardingDraft | null {
  return (
    readJson<OnboardingDraft>(stage5LocalDataKeys.onboardingDraft) ??
    mapLegacyDraft(
      readJson<LegacyFirstLaunchDraft>(legacyCompatibilityKeys.firstLaunchDraft),
    )
  );
}

export function writeLocalOnboardingDraft(draft: OnboardingDraft): boolean {
  return writeJson(stage5LocalDataKeys.onboardingDraft, draft);
}

export function clearLocalOnboardingDraft(): boolean {
  return removeItem(stage5LocalDataKeys.onboardingDraft);
}

export function readLocalActiveOnboardingPreset(): OnboardingPreset | null {
  return (
    readJson<OnboardingPreset>(stage5LocalDataKeys.activeOnboardingPreset) ??
    mapLegacyPreset(
      readJson<LegacyFirstLaunchPreset>(legacyCompatibilityKeys.firstLaunchPreset),
    )
  );
}

export function writeLocalActiveOnboardingPreset(
  preset: OnboardingPreset,
): boolean {
  return writeJson(stage5LocalDataKeys.activeOnboardingPreset, preset);
}

export function readLocalTalkEntryContext(): TalkEntryContext | null {
  // The legacy first-launch Talk handoff lacks roomSessionId, so Stage 5 does
  // not adapt it into a canonical room-origin TalkEntryContext.
  return readJson<TalkEntryContext>(stage5LocalDataKeys.talkEntryContext);
}

export function writeLocalTalkEntryContext(
  context: TalkEntryContext,
): boolean {
  const written = writeJson(stage5LocalDataKeys.talkEntryContext, context);
  removeItem(legacyCompatibilityKeys.firstLaunchTalkEntryContext);
  return written;
}

export function clearLocalTalkEntryContext(): boolean {
  const clearedCanonical = removeItem(stage5LocalDataKeys.talkEntryContext);
  removeItem(legacyCompatibilityKeys.firstLaunchTalkEntryContext);
  return clearedCanonical;
}

export function markLocalActiveOnboardingPresetConsumed(
  now: string,
): boolean {
  const preset = readLocalActiveOnboardingPreset();
  if (!preset || preset.status !== "active") return false;

  return writeLocalActiveOnboardingPreset({
    ...preset,
    status: "consumed",
    consumedAt: now,
  });
}

export function readLocalMemoryItems(): MemoryItem[] {
  return readJson<MemoryItem[]>(stage5LocalDataKeys.memoryItems) ?? [];
}

export function writeLocalMemoryItems(memories: MemoryItem[]): boolean {
  return writeJson(stage5LocalDataKeys.memoryItems, memories);
}

export function readLocalMemoryFeedback(): MemoryFeedback[] {
  return readJson<MemoryFeedback[]>(stage5LocalDataKeys.memoryFeedback) ?? [];
}

export function writeLocalMemoryFeedback(
  feedback: MemoryFeedback[],
): boolean {
  return writeJson(stage5LocalDataKeys.memoryFeedback, feedback);
}

export function appendLocalMemoryFeedback(feedback: MemoryFeedback): boolean {
  return writeLocalMemoryFeedback([...readLocalMemoryFeedback(), feedback]);
}

export function readLocalSleepLogs(): SleepLog[] {
  return readJson<SleepLog[]>(stage5LocalDataKeys.sleepLogs) ?? [];
}

export function writeLocalSleepLogs(logs: SleepLog[]): boolean {
  return writeJson(stage5LocalDataKeys.sleepLogs, logs);
}

export function readLocalSleepInsights(): SleepInsight[] {
  return readJson<SleepInsight[]>(stage5LocalDataKeys.sleepInsights) ?? [];
}

export function writeLocalSleepInsights(insights: SleepInsight[]): boolean {
  return writeJson(stage5LocalDataKeys.sleepInsights, insights);
}

export function readLocalRoomViews(): RoomView[] {
  return readJson<RoomView[]>(stage5LocalDataKeys.roomViews) ?? [];
}

export function writeLocalRoomViews(roomViews: RoomView[]): boolean {
  return writeJson(stage5LocalDataKeys.roomViews, roomViews);
}

export function readLocalRoomSessions(): RoomSession[] {
  return readJson<RoomSession[]>(stage5LocalDataKeys.roomSessions) ?? [];
}

export function writeLocalRoomSessions(roomSessions: RoomSession[]): boolean {
  return writeJson(stage5LocalDataKeys.roomSessions, roomSessions);
}

export function readLocalTalkSoundSettings<T>(
  fallback: T,
  normalize: (candidate: unknown, fallback: T) => T,
): T {
  const candidate = readJson<unknown>(stage5LocalDataKeys.talkSoundSettings);
  return candidate ? normalize(candidate, fallback) : fallback;
}

export function writeLocalTalkSoundSettings(settings: unknown): boolean {
  return writeJson(stage5LocalDataKeys.talkSoundSettings, settings);
}
