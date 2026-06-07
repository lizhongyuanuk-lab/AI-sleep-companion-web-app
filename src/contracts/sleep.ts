export const localSleepStorageKeys = {
  onboardingCompleted: "ai_sleep_has_completed_onboarding",
  userProfile: "ai_sleep_user_profile",
  companionProfile: "ai_sleep_companion_profile",
  roomState: "ai_sleep_room_state",
  memories: "ai_sleep_memories",
  sessions: "ai_sleep_sessions",
} as const;

export type SleepGoal =
  | "fall_asleep"
  | "reduce_anxiety"
  | "build_routine"
  | "companionship";

export type CompanionTone = "gentle" | "quiet" | "warm" | "playful";
export type RelationshipStage = "new" | "familiar" | "trusted";
export type CompanionMood = "calm" | "attentive" | "sleepy";
export type RoomPhase = "day" | "evening" | "pre_sleep" | "sleep";
export type SuggestedAction =
  | "talk"
  | "start_sleep"
  | "reflect"
  | "review_memory";
export type MemoryItemType =
  | "preference"
  | "routine"
  | "emotion_pattern"
  | "companion_note";
export type MemorySource = "onboarding" | "chat" | "sleep_session";
export type SleepMoodBefore = "calm" | "anxious" | "tired" | "restless";
export type SleepRoutine =
  | "breathing"
  | "story"
  | "ambient"
  | "companion_chat";
export type SleepSessionStatus = "active" | "completed" | "abandoned";

export type UserSleepProfile = {
  id: string;
  sleepGoal: SleepGoal;
  usualSleepTime: string;
  wakeTime: string;
  mainDifficulty: string[];
  preferredCompanionTone: CompanionTone;
  createdAt: string;
  updatedAt: string;
};

export type CompanionProfile = {
  id: string;
  name: string;
  tone: CompanionTone;
  relationshipStage: RelationshipStage;
  greeting: string;
  createdAt: string;
  updatedAt: string;
};

export type RoomState = {
  id: string;
  companionMood: CompanionMood;
  currentPhase: RoomPhase;
  suggestedAction: SuggestedAction;
  lastUpdatedAt: string;
};

export type MemoryItem = {
  id: string;
  type: MemoryItemType;
  content: string;
  confidence: number;
  source: MemorySource;
  createdAt: string;
  updatedAt: string;
};

export type SleepSession = {
  id: string;
  startedAt: string;
  endedAt?: string;
  moodBefore?: SleepMoodBefore;
  selectedRoutine?: SleepRoutine;
  status: SleepSessionStatus;
};

export type SleepCompanionSeed = {
  userProfile: UserSleepProfile;
  companionProfile: CompanionProfile;
  roomState: RoomState;
  memories: MemoryItem[];
};

export type Stage3OnboardingInput = {
  q1State?:
    | "tired_but_awake"
    | "mind_racing"
    | "anxious_or_irritated"
    | "lonely_needing_company"
    | null;
  q2SupportStyle?:
    | "help_me_sleep_fast"
    | "soothe_and_chat"
    | "meditation_practice"
    | "quiet_company"
    | null;
  selectedVisualTheme?:
    | "forest_nature"
    | "rainy_window"
    | "starry_open"
    | "warm_indoor"
    | null;
  nowIso?: string;
};

export type MockTalkMessage = {
  id: string;
  role: "user" | "companion";
  content: string;
  createdAt: string;
};

