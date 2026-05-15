import type { OnboardingPreset } from "./onboarding";
import type { EntityId, ISODateTimeString } from "./shared";

export type TalkEntryContextSource =
  | "home"
  | "memory"
  | "sleep"
  | "room"
  | "direct";

export type TalkEntryContextIntent =
  | "open_chat"
  | "discuss_memory"
  | "gentle_start"
  | "quiet_company"
  | "sleep_reflection"
  | "tonight_suggestion"
  | "tap_from_room_after_onboarding";

export type TalkTonePreset =
  | "neutral"
  | "gentle"
  | "quiet"
  | "reflective"
  | "direct";

export type TalkInteractionIntensity = "low" | "medium" | "high";

export type TalkEntryContext = {
  source: TalkEntryContextSource;
  sourceId?: EntityId;
  intent: TalkEntryContextIntent;
  roomId?: EntityId;
  roomViewId?: EntityId;
  roomSessionId?: EntityId;
  onboardingPresetId?: EntityId;
  onboardingPreset?: OnboardingPreset;
  memoryId?: EntityId;
  sleepInsightId?: EntityId;
  homeRecommendationId?: EntityId;
  suggestedOpening?: string;
  tonePreset?: TalkTonePreset;
  interactionIntensity?: TalkInteractionIntensity;
  createdAt: ISODateTimeString;
};

export type TalkSessionMode =
  | "open_chat"
  | "sleep_checkin"
  | "gentle_start"
  | "quiet_company"
  | "memory_reflection"
  | "onboarding_first_session";

export type MemoryExtractionStatus =
  | "not_started"
  | "running"
  | "skipped"
  | "completed"
  | "failed";

export type TalkSessionEmotionalTone =
  | "calm"
  | "anxious"
  | "sad"
  | "neutral"
  | "restless";

export type TalkSession = {
  id: EntityId;
  entryContext: TalkEntryContext;
  mode: TalkSessionMode;
  startedAt: ISODateTimeString;
  endedAt?: ISODateTimeString;
  durationSeconds?: number;
  messageCount: number;
  userMessageCount: number;
  assistantMessageCount: number;
  sessionSummary?: string;
  emotionalTone?: TalkSessionEmotionalTone;
  sleepRelated?: boolean;
  latestMemoryExtractionRunId?: EntityId;
  completedMemoryExtractionRunId?: EntityId;
  memoryExtractionStatus: MemoryExtractionStatus;
  generatedMemoryItemIds?: EntityId[];
};

export type MemoryExtractionRunStatus =
  | "running"
  | "skipped"
  | "completed"
  | "failed";

export type MemoryExtractionRun = {
  id: EntityId;
  talkSessionId: EntityId;
  status: MemoryExtractionRunStatus;
  reason?: string;
  startedAt: ISODateTimeString;
  completedAt?: ISODateTimeString;
  generatedMemoryItemIds?: EntityId[];
};

export type ConversationMessageRole = "user" | "assistant" | "system";

export type ConversationMessage = {
  id: EntityId;
  talkSessionId: EntityId;
  role: ConversationMessageRole;
  contentText: string;
  createdAt: ISODateTimeString;
};
