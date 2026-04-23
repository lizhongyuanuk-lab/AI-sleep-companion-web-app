import {
  defaultRoomId,
  roomConfigMap,
  type RoomId,
} from "@/app/room/room-config";

export const roomStorageKey = "ai-companion-web.active-room";
export const lastEnteredRoomStorageKey = "ai-companion-web.last-entered-room";
export const roomSwipeHintDismissedStorageKey =
  "ai-companion-web.room-swipe-hint-dismissed";

export function resolveRoomId(value: string | null | undefined): RoomId | null {
  if (!value) {
    return null;
  }

  return value in roomConfigMap ? (value as RoomId) : null;
}

export function getInitialRoomId({
  lastEnteredRoomId,
  storedRoomId,
}: {
  lastEnteredRoomId?: string | null;
  storedRoomId?: string | null;
}) {
  return (
    resolveRoomId(lastEnteredRoomId) ??
    resolveRoomId(storedRoomId) ??
    defaultRoomId
  );
}

export function readStoredRoomId(): RoomId | null {
  if (typeof window === "undefined") {
    return null;
  }

  return resolveRoomId(window.localStorage.getItem(roomStorageKey));
}

export function writeStoredRoomId(roomId: RoomId) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(roomStorageKey, roomId);
}

export function readLastEnteredRoomId(): RoomId | null {
  if (typeof window === "undefined") {
    return null;
  }

  return resolveRoomId(window.localStorage.getItem(lastEnteredRoomStorageKey));
}

export function writeLastEnteredRoomId(roomId: RoomId) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(lastEnteredRoomStorageKey, roomId);
}

export function readSwipeHintDismissed() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(roomSwipeHintDismissedStorageKey) === "true";
}

export function writeSwipeHintDismissed(dismissed: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    roomSwipeHintDismissedStorageKey,
    dismissed ? "true" : "false",
  );
}
