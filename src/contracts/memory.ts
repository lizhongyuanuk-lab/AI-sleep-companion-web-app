import type { EntityId, ISODateTimeString } from "./shared";

export type MemoryItemSource =
  | "talk_session"
  | "sleep_log"
  | "room_session"
  | "memory_feedback"
  | "system_inference";

export type MemoryItemType =
  | "preference"
  | "support_style"
  | "sleep_pattern"
  | "emotional_pattern"
  | "routine"
  | "avoidance";

export type MemoryItemConfidence = "low" | "medium" | "high";

export type MemoryItemStatus =
  | "active"
  | "weakened"
  | "contradicted"
  | "hidden"
  | "archived";

export type MemoryItemEvidence = {
  sourceText?: string;
  sourceSummary?: string;
  sourceSessionId?: EntityId;
};

export type MemoryItemImpactRules = {
  talkTone?: "gentle" | "quiet" | "reflective" | "direct";
  talkIntensity?: "low" | "medium" | "high";
  roomPreset?: "quiet" | "warm" | "minimal" | "ambient" | "soft_focus";
  sleepSuggestionWeight?: number;
};

export type MemoryItem = {
  id: EntityId;
  source: MemoryItemSource;
  sourceId: EntityId;
  type: MemoryItemType;
  title: string;
  body: string;
  evidence?: MemoryItemEvidence;
  confidence: MemoryItemConfidence;
  influenceWeight: number;
  status: MemoryItemStatus;
  excludeFromPersonalization: boolean;
  hiddenAt?: ISODateTimeString;
  impactRules?: MemoryItemImpactRules;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};

export type MemoryFeedbackEventAction = "agree" | "disagree" | "hide" | "unhide";

export type MemoryFeedbackEventSource = "memory_page" | "talk" | "home";

export type MemoryFeedbackEvent = {
  id: EntityId;
  memoryItemId: EntityId;
  action: MemoryFeedbackEventAction;
  previousStatus: MemoryItem["status"];
  resultingStatus: MemoryItem["status"];
  excludeFromPersonalization: boolean;
  source: MemoryFeedbackEventSource;
  createdAt: ISODateTimeString;
};
