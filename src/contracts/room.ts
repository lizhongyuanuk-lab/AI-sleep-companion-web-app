import type { EntityId, ISODateTimeString } from "./shared";

export type RoomStateContinuityReason =
  | "after_onboarding"
  | "returning_entry"
  | "home_handoff"
  | "sleep_handoff"
  | "memory_handoff"
  | "direct";

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
  continuityReason: RoomStateContinuityReason;
  onboardingPresetId?: EntityId;
  onboardingPresetStatus?: RoomStateOnboardingPresetStatus;
  talkEntryReady: boolean;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};
