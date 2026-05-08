import { type RoomId } from "@/app/room/room-config";
import {
  getWeakLandingRoomIdFromPreset,
  getWeakLandingRoomIdFromTheme,
  readGeneratedPersonalRoomRecord,
  readHasCompletedFirstLaunchFlow,
  readPostOnboardingSessionPreset,
  type PostOnboardingSessionPreset,
} from "@/lib/first-launch";
import { readLastEnteredRoomId, readStoredRoomId } from "@/lib/room-selection";

export type AppEntryTarget = "/onboarding" | "/room" | "/home";

export type AppEntrySnapshot = {
  hasCompletedFlow: boolean;
  preset: PostOnboardingSessionPreset | null;
  primaryRoomId: RoomId | null;
  target: AppEntryTarget;
};

function derivePrimaryRoomId(
  preset: PostOnboardingSessionPreset | null,
): RoomId | null {
  return (
    readLastEnteredRoomId() ??
    readStoredRoomId() ??
    getWeakLandingRoomIdFromTheme(readGeneratedPersonalRoomRecord()?.visual_theme) ??
    getWeakLandingRoomIdFromPreset(preset) ??
    null
  );
}

function resolveAppEntryTarget(
  hasCompletedFlow: boolean,
  preset: PostOnboardingSessionPreset | null,
): AppEntryTarget {
  if (!hasCompletedFlow) {
    return "/onboarding";
  }

  if (preset?.status === "active") {
    return "/room";
  }

  return "/home";
}

export function readAppEntrySnapshot(): AppEntrySnapshot {
  const hasCompletedFlow = readHasCompletedFirstLaunchFlow();
  const preset = readPostOnboardingSessionPreset();

  return {
    hasCompletedFlow,
    preset,
    primaryRoomId: derivePrimaryRoomId(preset),
    target: resolveAppEntryTarget(hasCompletedFlow, preset),
  };
}
