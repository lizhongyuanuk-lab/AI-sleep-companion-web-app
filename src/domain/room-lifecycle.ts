import type {
  EntityId,
  ISODateTimeString,
  OnboardingPreset,
  RoomEntrySource,
  RoomSession,
  RoomView,
  TalkEntryContext,
} from "../contracts";

export function buildRoomView(input: {
  id: EntityId;
  source: RoomEntrySource;
  now: ISODateTimeString;
  onboardingPresetId?: EntityId;
  homeRecommendationId?: EntityId;
  memoryItemId?: EntityId;
  sleepInsightId?: EntityId;
}): RoomView {
  return {
    id: input.id,
    source: input.source,
    onboardingPresetId: input.onboardingPresetId,
    homeRecommendationId: input.homeRecommendationId,
    memoryItemId: input.memoryItemId,
    sleepInsightId: input.sleepInsightId,
    viewedAt: input.now,
  };
}

export function buildRoomSession(input: {
  id: EntityId;
  roomId: EntityId;
  source: RoomEntrySource;
  now: ISODateTimeString;
  roomViewId?: EntityId;
  onboardingPresetId?: EntityId;
  homeRecommendationId?: EntityId;
  memoryItemId?: EntityId;
  sleepInsightId?: EntityId;
}): RoomSession {
  return {
    id: input.id,
    roomId: input.roomId,
    source: input.source,
    roomViewId: input.roomViewId,
    onboardingPresetId: input.onboardingPresetId,
    homeRecommendationId: input.homeRecommendationId,
    memoryItemId: input.memoryItemId,
    sleepInsightId: input.sleepInsightId,
    startedAt: input.now,
  };
}

export function buildRoomTalkEntryContext(input: {
  roomId: EntityId;
  roomSessionId: EntityId;
  now: ISODateTimeString;
  roomViewId?: EntityId;
  onboardingPreset?: OnboardingPreset;
}): TalkEntryContext {
  return {
    source: "room",
    sourceId: input.roomSessionId,
    intent: input.onboardingPreset
      ? "tap_from_room_after_onboarding"
      : "open_chat",
    roomId: input.roomId,
    roomViewId: input.roomViewId,
    roomSessionId: input.roomSessionId,
    onboardingPresetId: input.onboardingPreset?.id,
    onboardingPreset: input.onboardingPreset,
    createdAt: input.now,
  };
}
