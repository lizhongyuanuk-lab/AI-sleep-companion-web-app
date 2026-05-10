import type { Stage3LocalDataState } from "./defaults";
import {
  STAGE3_LEGACY_RUNTIME_KEY_LIST,
  STAGE3_LEGACY_RUNTIME_KEYS,
  STAGE3_LOCAL_STORAGE_KEY_LIST,
  STAGE3_LOCAL_STORAGE_KEYS,
} from "./keys";
import {
  migrateStage3State,
  STAGE3_LOCAL_DATA_VERSION,
  type Stage3LegacyRuntimeSnapshot,
} from "./migration";
import { createDefaultStage3AppState } from "./defaults";

type ClearStage3LocalDataOptions = {
  includeLegacyRuntimeKeys?: boolean;
};

type LoadStage3StateOptions = {
  includeLegacyRuntimeKeys?: boolean;
  now?: string;
};

function getBrowserStorage(): Storage | null {
  if (!isBrowserStorageAvailable()) {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readRawValue(key: string): string | undefined {
  const storage = getBrowserStorage();

  if (!storage) {
    return undefined;
  }

  try {
    const value = storage.getItem(key);
    return value === null ? undefined : value;
  } catch {
    return undefined;
  }
}

function parseStoredBoolean(raw: string | undefined): boolean | undefined {
  if (raw === undefined) {
    return undefined;
  }

  if (raw === "true") {
    return true;
  }

  if (raw === "false") {
    return false;
  }

  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === "boolean" ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function loadLegacyRuntimeSnapshot(
  includeLegacyRuntimeKeys = true,
): Stage3LegacyRuntimeSnapshot | undefined {
  if (!includeLegacyRuntimeKeys) {
    return undefined;
  }

  const completed = parseStoredBoolean(
    readRawValue(STAGE3_LEGACY_RUNTIME_KEYS.firstLaunchCompleted),
  );
  const preset = readJson<unknown | undefined>(
    STAGE3_LEGACY_RUNTIME_KEYS.firstLaunchPreset,
    undefined,
  );
  const legacyKeysSeen = STAGE3_LEGACY_RUNTIME_KEY_LIST.filter(
    (key) => readRawValue(key) !== undefined,
  );

  if (completed === undefined && preset === undefined && legacyKeysSeen.length === 0) {
    return undefined;
  }

  return {
    hasCompletedFirstLaunchFlow: completed,
    postOnboardingSessionPreset: preset,
    legacyKeysSeen,
  };
}

export function isBrowserStorageAvailable(): boolean {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

export function readJson<T>(key: string, fallback: T): T {
  const rawValue = readRawValue(key);

  if (rawValue === undefined || rawValue === "") {
    return fallback;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): boolean {
  const storage = getBrowserStorage();

  if (!storage) {
    return false;
  }

  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string): boolean {
  const storage = getBrowserStorage();

  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function clearStage3LocalData(
  options: ClearStage3LocalDataOptions = {},
): boolean {
  const targets = [
    ...STAGE3_LOCAL_STORAGE_KEY_LIST,
    ...(options.includeLegacyRuntimeKeys ? STAGE3_LEGACY_RUNTIME_KEY_LIST : []),
  ];

  return targets.every((key) => removeKey(key));
}

export function loadStage3State(
  options: LoadStage3StateOptions = {},
): Stage3LocalDataState {
  const now = options.now ?? new Date().toISOString();

  if (!isBrowserStorageAvailable()) {
    return createDefaultStage3AppState(STAGE3_LOCAL_DATA_VERSION, now);
  }

  const rawState = {
    userProfile: readJson<unknown | undefined>(
      STAGE3_LOCAL_STORAGE_KEYS.userProfile,
      undefined,
    ),
    onboarding: readJson<unknown | undefined>(
      STAGE3_LOCAL_STORAGE_KEYS.onboarding,
      undefined,
    ),
    home: readJson<unknown | undefined>(STAGE3_LOCAL_STORAGE_KEYS.home, undefined),
    conversation: readJson<unknown | undefined>(
      STAGE3_LOCAL_STORAGE_KEYS.conversation,
      undefined,
    ),
    memory: readJson<unknown | undefined>(STAGE3_LOCAL_STORAGE_KEYS.memory, undefined),
    sleep: readJson<unknown | undefined>(STAGE3_LOCAL_STORAGE_KEYS.sleep, undefined),
    room: readJson<unknown | undefined>(STAGE3_LOCAL_STORAGE_KEYS.room, undefined),
    migration: readJson<unknown | undefined>(
      STAGE3_LOCAL_STORAGE_KEYS.migration,
      undefined,
    ),
  };

  return migrateStage3State(rawState, {
    now,
    legacyRuntime: loadLegacyRuntimeSnapshot(
      options.includeLegacyRuntimeKeys !== false,
    ),
  });
}

export function saveStage3State(
  state: Stage3LocalDataState,
  now = new Date().toISOString(),
): boolean {
  const normalized = migrateStage3State(state, { now });

  return [
    writeJson(STAGE3_LOCAL_STORAGE_KEYS.userProfile, normalized.userProfile),
    writeJson(STAGE3_LOCAL_STORAGE_KEYS.onboarding, normalized.onboarding),
    writeJson(STAGE3_LOCAL_STORAGE_KEYS.home, normalized.home),
    writeJson(STAGE3_LOCAL_STORAGE_KEYS.conversation, normalized.conversation),
    writeJson(STAGE3_LOCAL_STORAGE_KEYS.memory, normalized.memory),
    writeJson(STAGE3_LOCAL_STORAGE_KEYS.sleep, normalized.sleep),
    writeJson(STAGE3_LOCAL_STORAGE_KEYS.room, normalized.room),
    writeJson(STAGE3_LOCAL_STORAGE_KEYS.migration, normalized.migration),
  ].every(Boolean);
}
