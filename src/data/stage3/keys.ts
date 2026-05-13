import type { ContractVersion } from "../../contracts";

export const STAGE3_CONTRACT_VERSION =
  "stage3-canonical-v1" satisfies ContractVersion;

export const STAGE3_LOCAL_DATA_NAMESPACE = "ai-companion-web.stage3";
export const STAGE3_LOCAL_DATA_SCOPE = "local-data";
export const STAGE3_LOCAL_DATA_KEY_VERSION = "v1";
export const STAGE3_LOCAL_DATA_KEY_PREFIX = [
  STAGE3_LOCAL_DATA_NAMESPACE,
  STAGE3_LOCAL_DATA_SCOPE,
  STAGE3_LOCAL_DATA_KEY_VERSION,
].join(".");

export const STAGE3_LOCAL_STORAGE_KEYS = {
  userProfile: `${STAGE3_LOCAL_DATA_KEY_PREFIX}.user-profile`,
  onboarding: `${STAGE3_LOCAL_DATA_KEY_PREFIX}.onboarding`,
  home: `${STAGE3_LOCAL_DATA_KEY_PREFIX}.home`,
  conversation: `${STAGE3_LOCAL_DATA_KEY_PREFIX}.conversation`,
  memory: `${STAGE3_LOCAL_DATA_KEY_PREFIX}.memory`,
  sleep: `${STAGE3_LOCAL_DATA_KEY_PREFIX}.sleep`,
  room: `${STAGE3_LOCAL_DATA_KEY_PREFIX}.room`,
  migration: `${STAGE3_LOCAL_DATA_KEY_PREFIX}.migration`,
} as const;

export const STAGE3_LOCAL_STORAGE_KEY_LIST = Object.values(
  STAGE3_LOCAL_STORAGE_KEYS,
);

export const STAGE3_LEGACY_RUNTIME_KEYS = {
  firstLaunchCompleted: "ai-companion-web.first-launch.completed",
  firstLaunchDraft: "ai-companion-web.first-launch.draft",
  firstLaunchPreset: "ai-companion-web.first-launch.preset",
  firstLaunchGenerationDraft: "ai-companion-web.first-launch.generation-draft",
  firstLaunchGeneratedRoom: "ai-companion-web.first-launch.generated-room",
  firstLaunchTalkEntryContext: "ai-companion-web.first-launch.talk-entry-context",
  authStatus: "ai-companion-web.auth-status",
} as const;

export const STAGE3_LEGACY_RUNTIME_KEY_LIST = Object.values(
  STAGE3_LEGACY_RUNTIME_KEYS,
);
