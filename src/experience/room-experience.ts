import type {
  EntityId,
  ISODateTimeString,
  OnboardingPreset,
  RoomEntrySource,
  RoomOption,
  RoomSession,
  RoomState,
  RoomView,
  TalkEntryContext,
} from "../contracts";
import { fixedRoomOptions } from "../config";
import {
  buildRoomTalkEntryContext,
  buildRoomSession,
  buildRoomView,
  getOnboardingPresetRouteState,
} from "../domain";
import { stage5LocalDataNotice } from "../local-data";

export type RoomExperience = {
  route: "/room";
  options: [RoomOption, RoomOption, RoomOption];
  roomView: RoomView;
  state: RoomState;
  activePresetState: RoomState["onboardingPresetStatus"] | "none";
  localDataBoundaryLabel: string;
};

export type RoomSelectionExperience = {
  roomSession: RoomSession;
  talkEntryContext: TalkEntryContext;
  localDataBoundaryLabel: string;
};

export function buildRoomExperience(input: {
  id: EntityId;
  roomViewId: EntityId;
  now: ISODateTimeString;
  source?: RoomEntrySource;
  activeOnboardingPreset?: OnboardingPreset | null;
}): RoomExperience {
  const source = input.source ?? "manual";
  const activePresetState = getOnboardingPresetRouteState(
    input.activeOnboardingPreset ?? undefined,
    input.now,
  );
  const roomView = buildRoomView({
    id: input.roomViewId,
    source,
    now: input.now,
    onboardingPresetId:
      activePresetState === "active" ? input.activeOnboardingPreset?.id : undefined,
  });

  return {
    route: "/room",
    options: fixedRoomOptions,
    roomView,
    state: {
      id: input.id,
      route: "/room",
      roomOptionIds: fixedRoomOptions.map((option) => option.id) as [
        EntityId,
        EntityId,
        EntityId,
      ],
      roomViewId: roomView.id,
      continuityReason: source,
      onboardingPresetId: roomView.onboardingPresetId,
      onboardingPresetStatus:
        activePresetState === "none" ? undefined : activePresetState,
      talkEntryReady: false,
      createdAt: input.now,
      updatedAt: input.now,
    },
    activePresetState,
    localDataBoundaryLabel: stage5LocalDataNotice,
  };
}

export function buildRoomSelectionTalkEntry(input: {
  roomId: EntityId;
  roomSessionId: EntityId;
  now: ISODateTimeString;
  roomViewId?: EntityId;
  activeOnboardingPreset?: OnboardingPreset | null;
}): TalkEntryContext {
  return buildRoomTalkEntryContext({
    roomId: input.roomId,
    roomSessionId: input.roomSessionId,
    now: input.now,
    roomViewId: input.roomViewId,
    onboardingPreset: input.activeOnboardingPreset ?? undefined,
  });
}

export function buildRoomSelectionExperience(input: {
  roomId: EntityId;
  roomSessionId: EntityId;
  now: ISODateTimeString;
  source?: RoomEntrySource;
  roomViewId?: EntityId;
  activeOnboardingPreset?: OnboardingPreset | null;
}): RoomSelectionExperience {
  const activeOnboardingPreset = input.activeOnboardingPreset ?? undefined;
  const roomSession = buildRoomSession({
    id: input.roomSessionId,
    roomId: input.roomId,
    source: input.source ?? "manual",
    now: input.now,
    roomViewId: input.roomViewId,
    onboardingPresetId: activeOnboardingPreset?.id,
  });

  return {
    roomSession,
    talkEntryContext: buildRoomSelectionTalkEntry({
      roomId: input.roomId,
      roomSessionId: roomSession.id,
      now: input.now,
      roomViewId: input.roomViewId,
      activeOnboardingPreset,
    }),
    localDataBoundaryLabel: stage5LocalDataNotice,
  };
}
