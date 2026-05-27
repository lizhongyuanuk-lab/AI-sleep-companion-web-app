import type { EntityId, ISODateTimeString, RoomEntrySource } from "./shared";

export type RoomOptionPreset =
  | "quiet"
  | "warm"
  | "minimal"
  | "ambient"
  | "soft_focus";

export type RoomOptionStimulationLevel = "low" | "medium";

export type RoomOption = {
  id: EntityId;
  title: string;
  description?: string;
  preset: RoomOptionPreset;
  stimulationLevel: RoomOptionStimulationLevel;
  isActive: boolean;
  sortOrder: number;
};

export type RoomView = {
  id: EntityId;
  source: RoomEntrySource;
  onboardingPresetId?: EntityId;
  homeRecommendationId?: EntityId;
  memoryItemId?: EntityId;
  sleepInsightId?: EntityId;
  viewedAt: ISODateTimeString;
};

export type RoomSessionExitReason =
  | "tap_to_talk"
  | "leave_page"
  | "app_background"
  | "timeout";

export type RoomSession = {
  id: EntityId;
  roomId: EntityId;
  source: RoomEntrySource;
  roomViewId?: EntityId;
  onboardingPresetId?: EntityId;
  homeRecommendationId?: EntityId;
  memoryItemId?: EntityId;
  sleepInsightId?: EntityId;
  startedAt: ISODateTimeString;
  endedAt?: ISODateTimeString;
  durationSeconds?: number;
  exitReason?: RoomSessionExitReason;
  followedByTalkSessionId?: EntityId;
  followedBySleepLogId?: EntityId;
};

export type RoomStateOnboardingPresetStatus =
  | "active"
  | "consumed"
  | "expired"
  | "stale";

export type RoomState = {
  id: EntityId;
  route: "/room";
  roomOptionIds: [EntityId, EntityId, EntityId];
  roomViewId: EntityId;
  activeRoomId?: EntityId;
  roomSessionId?: EntityId;
  continuityReason: RoomEntrySource;
  onboardingPresetId?: EntityId;
  onboardingPresetStatus?: RoomStateOnboardingPresetStatus;
  talkEntryReady: boolean;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};
