import {
  localSleepStorageKeys,
  type CompanionProfile,
  type MemoryItem,
  type RoomState,
  type SleepSession,
  type UserSleepProfile,
} from "@/src/contracts/sleep";

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readBoolean(key: string, fallback = false) {
  const storage = getStorage();

  if (!storage) {
    return fallback;
  }

  try {
    const value = storage.getItem(key);

    if (value === null) {
      return fallback;
    }

    return value === "true";
  } catch {
    return fallback;
  }
}

function writeBoolean(key: string, value: boolean) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(key, value ? "true" : "false");
  } catch {}
}

function readJson<T>(key: string, fallback: T): T {
  const storage = getStorage();

  if (!storage) {
    return fallback;
  }

  try {
    const rawValue = storage.getItem(key);

    if (!rawValue) {
      return fallback;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    try {
      storage.removeItem(key);
    } catch {}

    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {}
}

function removeItem(key: string) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    storage.removeItem(key);
  } catch {}
}

export function getOnboardingCompleted() {
  return readBoolean(localSleepStorageKeys.onboardingCompleted, false);
}

export function setOnboardingCompleted(value: boolean) {
  writeBoolean(localSleepStorageKeys.onboardingCompleted, value);
}

export function getUserProfile() {
  return readJson<UserSleepProfile | null>(
    localSleepStorageKeys.userProfile,
    null,
  );
}

export function setUserProfile(profile: UserSleepProfile) {
  writeJson(localSleepStorageKeys.userProfile, profile);
}

export function getCompanionProfile() {
  return readJson<CompanionProfile | null>(
    localSleepStorageKeys.companionProfile,
    null,
  );
}

export function setCompanionProfile(profile: CompanionProfile) {
  writeJson(localSleepStorageKeys.companionProfile, profile);
}

export function getRoomState() {
  return readJson<RoomState | null>(localSleepStorageKeys.roomState, null);
}

export function setRoomState(roomState: RoomState) {
  writeJson(localSleepStorageKeys.roomState, roomState);
}

export function getMemories() {
  return readJson<MemoryItem[]>(localSleepStorageKeys.memories, []);
}

export function setMemories(memories: MemoryItem[]) {
  writeJson(localSleepStorageKeys.memories, memories);
}

export function getSleepSessions() {
  return readJson<SleepSession[]>(localSleepStorageKeys.sessions, []);
}

export function setSleepSessions(sessions: SleepSession[]) {
  writeJson(localSleepStorageKeys.sessions, sessions);
}

export function resetLocalSleepData() {
  removeItem(localSleepStorageKeys.onboardingCompleted);
  removeItem(localSleepStorageKeys.userProfile);
  removeItem(localSleepStorageKeys.companionProfile);
  removeItem(localSleepStorageKeys.roomState);
  removeItem(localSleepStorageKeys.memories);
  removeItem(localSleepStorageKeys.sessions);
}
