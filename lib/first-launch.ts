export type FirstLaunchStep =
  | "welcome"
  | "onboarding_q1"
  | "onboarding_q2"
  | "session_result"
  | "create_room_entry"
  | "select_room_theme"
  | "room_generating"
  | "room_generation_preview"
  | "room_page";

export type Q1State =
  | "tired_but_awake"
  | "mind_racing"
  | "anxious_or_irritated"
  | "lonely_needing_company";

export type Q2SupportStyle =
  | "help_me_sleep_fast"
  | "soothe_and_chat"
  | "meditation_practice"
  | "quiet_company";

export type PersonalRoomTheme =
  | "forest_nature"
  | "rainy_window"
  | "starry_open"
  | "warm_indoor";

export type WeakLandingRoomId =
  | "moon_tide"
  | "sea_light"
  | "canopy_mist"
  | "alpine_quiet"
  | "harbor_hush"
  | "snowfall_hush";

export type PresetStatus = "active" | "consumed" | "expired";
export type GenerationStatus = "not_started" | "generating" | "ready" | "failed";
export type AuthStatus = "guest" | "authenticated";

export type FirstLaunchDraft = {
  current_step: FirstLaunchStep;
  q1_state: Q1State | null;
  q2_support_style: Q2SupportStyle | null;
  entered_create_room_branch: boolean;
  selected_visual_theme: PersonalRoomTheme | null;
  updated_at: string;
};

export type PostOnboardingSessionPreset = {
  preset_id: string;
  q1_state: Q1State;
  q2_support_style: Q2SupportStyle;
  base_mode: "sleep_settling" | "gentle_grounding" | "meditative" | "quiet_presence";
  state_modifier: "low_energy" | "overthinking" | "emotionally_full" | "needs_company";
  opening_copy_id:
    | "sleep_soft_landing"
    | "slow_the_room"
    | "steady_the_breath"
    | "stay_with_you";
  reply_length_default: "short" | "medium";
  question_budget_first_3_turns: 0 | 1;
  sleep_transition_enabled: boolean;
  fallback_chain: string[];
  created_at: string;
  status: PresetStatus;
  result_headline: string;
  result_supporting_copy: string;
  room_bridge_copy: string;
};

export type PersonalRoomGenerationDraft = {
  visual_theme: PersonalRoomTheme | null;
  generation_seed_id: string | null;
  generation_job_id: string | null;
  generation_status: GenerationStatus;
  preview_asset_id: string | null;
  updated_at: string;
};

export type GeneratedPersonalRoomRecord = {
  room_id: string;
  background_asset_id: string;
  room_source: "generated";
  visual_theme: PersonalRoomTheme;
  created_from_onboarding: boolean;
  created_at: string;
  guest_saved_until: string;
};

export type FirstLaunchTalkEntryContext = {
  preset_id: string;
  q1_state: Q1State;
  q2_support_style: Q2SupportStyle;
  base_mode: PostOnboardingSessionPreset["base_mode"];
  state_modifier: PostOnboardingSessionPreset["state_modifier"];
  opening_copy_id: PostOnboardingSessionPreset["opening_copy_id"];
  reply_length_default: PostOnboardingSessionPreset["reply_length_default"];
  question_budget_first_3_turns: PostOnboardingSessionPreset["question_budget_first_3_turns"];
  sleep_transition_enabled: boolean;
  fallback_chain: string[];
  room_id: string;
  room_source: string;
  background_asset_id: string;
  room_theme: string;
  room_entry_action: string;
};

type OnboardingOption<TValue extends string> = {
  value: TValue;
  label: string;
};

type OnboardingQuestion<TValue extends string> = {
  id: "q1_state" | "q2_support_style";
  title: string;
  options: OnboardingOption<TValue>[];
};

type ThemeOption = {
  value: PersonalRoomTheme;
  title: string;
  label: string;
  description: string;
  previewAssetId: string;
};

const FIRST_LAUNCH_PRESET_TTL_MS = 30 * 60 * 1000;
const GUEST_ROOM_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;

const roomThemeMap: Record<PersonalRoomTheme, WeakLandingRoomId> = {
  forest_nature: "canopy_mist",
  rainy_window: "harbor_hush",
  starry_open: "moon_tide",
  warm_indoor: "alpine_quiet",
};

const presetRoomRecommendationMap: Record<
  Q1State,
  Record<Q2SupportStyle, WeakLandingRoomId>
> = {
  tired_but_awake: {
    help_me_sleep_fast: "alpine_quiet",
    soothe_and_chat: "harbor_hush",
    meditation_practice: "snowfall_hush",
    quiet_company: "harbor_hush",
  },
  mind_racing: {
    help_me_sleep_fast: "snowfall_hush",
    soothe_and_chat: "harbor_hush",
    meditation_practice: "moon_tide",
    quiet_company: "moon_tide",
  },
  anxious_or_irritated: {
    help_me_sleep_fast: "alpine_quiet",
    soothe_and_chat: "sea_light",
    meditation_practice: "canopy_mist",
    quiet_company: "harbor_hush",
  },
  lonely_needing_company: {
    help_me_sleep_fast: "harbor_hush",
    soothe_and_chat: "sea_light",
    meditation_practice: "moon_tide",
    quiet_company: "harbor_hush",
  },
};

export const hasCompletedFirstLaunchFlowStorageKey =
  "ai-companion-web.first-launch.completed";
export const firstLaunchFlowDraftStorageKey =
  "ai-companion-web.first-launch.draft";
export const postOnboardingSessionPresetStorageKey =
  "ai-companion-web.first-launch.preset";
export const personalRoomGenerationDraftStorageKey =
  "ai-companion-web.first-launch.generation-draft";
export const generatedPersonalRoomRecordStorageKey =
  "ai-companion-web.first-launch.generated-room";
export const authStatusStorageKey = "ai-companion-web.auth-status";
export const firstLaunchTalkEntryContextStorageKey =
  "ai-companion-web.first-launch.talk-entry-context";

export const FIRST_LAUNCH_ONBOARDING_OPTIONS_V1: {
  q1: OnboardingQuestion<Q1State>;
  q2: OnboardingQuestion<Q2SupportStyle>;
} = {
  q1: {
    id: "q1_state",
    title: "What feels closest right now?",
    options: [
      { value: "tired_but_awake", label: "Sleepy, but still awake" },
      { value: "mind_racing", label: "My mind will not slow down" },
      { value: "anxious_or_irritated", label: "I feel tense or overstimulated" },
      { value: "lonely_needing_company", label: "I do not want to be alone" },
    ],
  },
  q2: {
    id: "q2_support_style",
    title: "How should I stay with you?",
    options: [
      { value: "help_me_sleep_fast", label: "Help me drift off" },
      { value: "soothe_and_chat", label: "Soothe me first" },
      { value: "meditation_practice", label: "Guide me into stillness" },
      { value: "quiet_company", label: "Stay quiet with me" },
    ],
  },
};

export const PERSONAL_ROOM_THEME_OPTIONS_V1: ThemeOption[] = [
  {
    value: "forest_nature",
    title: "Forest / hush",
    label: "Moss light",
    description: "Damp air, soft leaf noise, and a quieter kind of shelter.",
    previewAssetId: "theme-preview::forest",
  },
  {
    value: "rainy_window",
    title: "Rain / window",
    label: "Window rain",
    description: "Indoor rain, softened edges, and less mental noise.",
    previewAssetId: "theme-preview::rain",
  },
  {
    value: "starry_open",
    title: "Night sky / open",
    label: "Open sky",
    description: "More air, more distance, more room for your breath to widen.",
    previewAssetId: "theme-preview::star",
  },
  {
    value: "warm_indoor",
    title: "Warm room / safe",
    label: "Warm room",
    description: "Soft light, wrapped textures, and a gentler sense of being held.",
    previewAssetId: "theme-preview::warm",
  },
];

const presetBlueprints: Record<
  Q1State,
  Record<
    Q2SupportStyle,
    Pick<
      PostOnboardingSessionPreset,
      | "base_mode"
      | "state_modifier"
      | "opening_copy_id"
      | "reply_length_default"
      | "question_budget_first_3_turns"
      | "sleep_transition_enabled"
      | "fallback_chain"
      | "result_headline"
      | "result_supporting_copy"
      | "room_bridge_copy"
    >
  >
> = {
  tired_but_awake: {
    help_me_sleep_fast: {
      base_mode: "sleep_settling",
      state_modifier: "low_energy",
      opening_copy_id: "sleep_soft_landing",
      reply_length_default: "short",
      question_budget_first_3_turns: 0,
      sleep_transition_enabled: true,
      fallback_chain: ["quiet_presence", "gentle_grounding"],
      result_headline: "今晚我会更直接地帮你往睡意里靠。",
      result_supporting_copy: "先减少信息密度，把陪伴做得更短、更轻、更容易接住困意。",
      room_bridge_copy: "进到 Room 以后，你还是可以自己选今晚想停留的空间。",
    },
    soothe_and_chat: {
      base_mode: "gentle_grounding",
      state_modifier: "low_energy",
      opening_copy_id: "slow_the_room",
      reply_length_default: "medium",
      question_budget_first_3_turns: 1,
      sleep_transition_enabled: true,
      fallback_chain: ["quiet_presence", "sleep_settling"],
      result_headline: "今晚我会先把节奏放慢，再慢慢带你靠近睡意。",
      result_supporting_copy: "我们先用几句低压力的陪伴把心收回来，不急着把你推向对话感。",
      room_bridge_copy: "你可以先看看现成空间，再决定从哪一个房间开始。",
    },
    meditation_practice: {
      base_mode: "meditative",
      state_modifier: "low_energy",
      opening_copy_id: "steady_the_breath",
      reply_length_default: "short",
      question_budget_first_3_turns: 0,
      sleep_transition_enabled: true,
      fallback_chain: ["sleep_settling", "quiet_presence"],
      result_headline: "今晚我会用更收束的节奏，帮你把注意力安放下来。",
      result_supporting_copy: "会优先使用更少的语言，把呼吸、停顿和入睡过渡放在前面。",
      room_bridge_copy: "接下来你可以选一个空间，让这份节奏先有一个落点。",
    },
    quiet_company: {
      base_mode: "quiet_presence",
      state_modifier: "low_energy",
      opening_copy_id: "stay_with_you",
      reply_length_default: "short",
      question_budget_first_3_turns: 0,
      sleep_transition_enabled: true,
      fallback_chain: ["sleep_settling", "gentle_grounding"],
      result_headline: "今晚我会更安静地陪着你，不把这段时间变成聊天任务。",
      result_supporting_copy: "重点会放在陪伴感和停留感，而不是让你继续组织很多话。",
      room_bridge_copy: "先走进一个你愿意停留的空间，再决定要不要开口就好。",
    },
  },
  mind_racing: {
    help_me_sleep_fast: {
      base_mode: "sleep_settling",
      state_modifier: "overthinking",
      opening_copy_id: "sleep_soft_landing",
      reply_length_default: "short",
      question_budget_first_3_turns: 0,
      sleep_transition_enabled: true,
      fallback_chain: ["gentle_grounding", "quiet_presence"],
      result_headline: "今晚我会优先帮你降噪，不让脑子继续被内容推着走。",
      result_supporting_copy: "会尽量减少展开式对话，用更短的回应把注意力慢慢带离那些还在转的念头。",
      room_bridge_copy: "你先选一个空间停下来，剩下的节奏我再接住。",
    },
    soothe_and_chat: {
      base_mode: "gentle_grounding",
      state_modifier: "overthinking",
      opening_copy_id: "slow_the_room",
      reply_length_default: "medium",
      question_budget_first_3_turns: 1,
      sleep_transition_enabled: true,
      fallback_chain: ["quiet_presence", "sleep_settling"],
      result_headline: "今晚我会先陪你把思绪落地，再慢慢把房间安静下来。",
      result_supporting_copy: "我们不会把它做成长对话，而是只留够用的几句，让你慢慢松手。",
      room_bridge_copy: "接下来你可以先看看空间，让节奏先从环境开始变轻。",
    },
    meditation_practice: {
      base_mode: "meditative",
      state_modifier: "overthinking",
      opening_copy_id: "steady_the_breath",
      reply_length_default: "short",
      question_budget_first_3_turns: 0,
      sleep_transition_enabled: true,
      fallback_chain: ["gentle_grounding", "sleep_settling"],
      result_headline: "今晚我会帮你把注意力从脑内转向身体和呼吸。",
      result_supporting_copy: "比起解释很多，我们更适合先让节奏变稳，再把睡意找回来。",
      room_bridge_copy: "你可以先选一个视觉方向，让它成为今晚收束的起点。",
    },
    quiet_company: {
      base_mode: "quiet_presence",
      state_modifier: "overthinking",
      opening_copy_id: "stay_with_you",
      reply_length_default: "short",
      question_budget_first_3_turns: 0,
      sleep_transition_enabled: true,
      fallback_chain: ["gentle_grounding", "sleep_settling"],
      result_headline: "今晚我会让陪伴更轻，不再给那些念头新的推力。",
      result_supporting_copy: "重点不是继续把想法讲完整，而是让你感到有人在场，房间也在慢下来。",
      room_bridge_copy: "先去挑一个空间停住，再决定今晚想不想开口。",
    },
  },
  anxious_or_irritated: {
    help_me_sleep_fast: {
      base_mode: "sleep_settling",
      state_modifier: "emotionally_full",
      opening_copy_id: "sleep_soft_landing",
      reply_length_default: "short",
      question_budget_first_3_turns: 0,
      sleep_transition_enabled: true,
      fallback_chain: ["gentle_grounding", "quiet_presence"],
      result_headline: "今晚我会先降低刺激，再帮你慢慢往能睡的方向靠。",
      result_supporting_copy: "不会把这段时间做成分析和拆解，而是先给情绪留一点可呼吸的空间。",
      room_bridge_copy: "你仍然可以自己选房间，主动权不会被拿走。",
    },
    soothe_and_chat: {
      base_mode: "gentle_grounding",
      state_modifier: "emotionally_full",
      opening_copy_id: "slow_the_room",
      reply_length_default: "medium",
      question_budget_first_3_turns: 1,
      sleep_transition_enabled: true,
      fallback_chain: ["quiet_presence", "sleep_settling"],
      result_headline: "今晚我会先接住你，再把节奏慢慢拉回到更稳的地方。",
      result_supporting_copy: "我们保留一点说话空间，但不会把你推回高刺激的来回对话里。",
      room_bridge_copy: "先看看空间，也许你会更容易知道今晚想待在哪种氛围里。",
    },
    meditation_practice: {
      base_mode: "meditative",
      state_modifier: "emotionally_full",
      opening_copy_id: "steady_the_breath",
      reply_length_default: "short",
      question_budget_first_3_turns: 0,
      sleep_transition_enabled: true,
      fallback_chain: ["gentle_grounding", "quiet_presence"],
      result_headline: "今晚我会把注意力从外界拉回身体，让情绪先有地方落下来。",
      result_supporting_copy: "重点是减轻紧绷感，而不是把你继续留在需要解释和组织的状态里。",
      room_bridge_copy: "如果你愿意，我们也可以先为今晚挑一个更合适的空间方向。",
    },
    quiet_company: {
      base_mode: "quiet_presence",
      state_modifier: "emotionally_full",
      opening_copy_id: "stay_with_you",
      reply_length_default: "short",
      question_budget_first_3_turns: 0,
      sleep_transition_enabled: true,
      fallback_chain: ["gentle_grounding", "sleep_settling"],
      result_headline: "今晚我会先把陪伴感放在前面，不要求你马上把情绪整理好。",
      result_supporting_copy: "不用多说也可以，我会优先让房间和回应都保持低刺激、可停留。",
      room_bridge_copy: "你先选空间，剩下的节奏我们再一起慢慢往里走。",
    },
  },
  lonely_needing_company: {
    help_me_sleep_fast: {
      base_mode: "sleep_settling",
      state_modifier: "needs_company",
      opening_copy_id: "sleep_soft_landing",
      reply_length_default: "short",
      question_budget_first_3_turns: 0,
      sleep_transition_enabled: true,
      fallback_chain: ["quiet_presence", "gentle_grounding"],
      result_headline: "今晚我会在不打扰你的前提下，陪你更快靠近睡意。",
      result_supporting_copy: "重点会是有人在场的安心感，而不是把你再带进复杂的聊天节奏里。",
      room_bridge_copy: "先去选一个今晚想停留的空间，再决定要不要开口。",
    },
    soothe_and_chat: {
      base_mode: "gentle_grounding",
      state_modifier: "needs_company",
      opening_copy_id: "slow_the_room",
      reply_length_default: "medium",
      question_budget_first_3_turns: 1,
      sleep_transition_enabled: true,
      fallback_chain: ["quiet_presence", "sleep_settling"],
      result_headline: "今晚我会更像是先陪你待一会儿，再让夜晚慢慢安静下来。",
      result_supporting_copy: "我们会保留一点温度和回应，但不会让它变成很重的社交负担。",
      room_bridge_copy: "接下来可以先看看现成空间，或为自己做一个更私人的房间。",
    },
    meditation_practice: {
      base_mode: "meditative",
      state_modifier: "needs_company",
      opening_copy_id: "steady_the_breath",
      reply_length_default: "short",
      question_budget_first_3_turns: 0,
      sleep_transition_enabled: true,
      fallback_chain: ["quiet_presence", "gentle_grounding"],
      result_headline: "今晚我会用更柔和的节奏陪你收回来，让你不是一个人去面对安静。",
      result_supporting_copy: "重点不是技巧感，而是让你的注意力有人一起托住，再慢慢放松。",
      room_bridge_copy: "如果你愿意，也可以顺手为今晚挑一个更像自己的空间方向。",
    },
    quiet_company: {
      base_mode: "quiet_presence",
      state_modifier: "needs_company",
      opening_copy_id: "stay_with_you",
      reply_length_default: "short",
      question_budget_first_3_turns: 0,
      sleep_transition_enabled: true,
      fallback_chain: ["gentle_grounding", "sleep_settling"],
      result_headline: "今晚我会把“有人在”的感觉放在最前面。",
      result_supporting_copy: "不需要急着说很多，我会优先把陪伴做得更轻、更稳定、更容易停留。",
      room_bridge_copy: "你可以先走进一个让你愿意待下来的空间，再决定接下来怎么继续。",
    },
  },
};

const defaultDraftValue: FirstLaunchDraft = {
  current_step: "welcome",
  q1_state: null,
  q2_support_style: null,
  entered_create_room_branch: false,
  selected_visual_theme: null,
  updated_at: "",
};

const defaultGenerationDraftValue: PersonalRoomGenerationDraft = {
  visual_theme: null,
  generation_seed_id: null,
  generation_job_id: null,
  generation_status: "not_started",
  preview_asset_id: null,
  updated_at: "",
};

function readJson<T>(storageKey: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(storageKey);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

function writeJson(storageKey: string, value: unknown) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(value));
}

function removeStorageItem(storageKey: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(storageKey);
}

export function createEmptyFirstLaunchDraft(
  currentStep: FirstLaunchStep = "welcome",
): FirstLaunchDraft {
  return {
    ...defaultDraftValue,
    current_step: currentStep,
    updated_at: new Date().toISOString(),
  };
}

export function readHasCompletedFirstLaunchFlow() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(hasCompletedFirstLaunchFlowStorageKey) === "true";
}

export function writeHasCompletedFirstLaunchFlow(completed: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    hasCompletedFirstLaunchFlowStorageKey,
    completed ? "true" : "false",
  );
}

export function readFirstLaunchDraft(): FirstLaunchDraft {
  const draft = readJson<FirstLaunchDraft>(firstLaunchFlowDraftStorageKey);

  return draft ?? createEmptyFirstLaunchDraft();
}

export function writeFirstLaunchDraft(draft: FirstLaunchDraft) {
  writeJson(firstLaunchFlowDraftStorageKey, draft);
}

export function clearFirstLaunchDraft() {
  removeStorageItem(firstLaunchFlowDraftStorageKey);
}

export function clearPersonalRoomGenerationDraft() {
  removeStorageItem(personalRoomGenerationDraftStorageKey);
}

export function readPostOnboardingSessionPreset() {
  const preset = readJson<PostOnboardingSessionPreset>(
    postOnboardingSessionPresetStorageKey,
  );

  if (!preset) {
    return null;
  }

  const createdTime = Date.parse(preset.created_at);

  if (
    Number.isNaN(createdTime) ||
    Date.now() - createdTime > FIRST_LAUNCH_PRESET_TTL_MS
  ) {
    const expiredPreset = {
      ...preset,
      status: "expired" as const,
    };

    writeJson(postOnboardingSessionPresetStorageKey, expiredPreset);
    return expiredPreset;
  }

  return preset;
}

export function writePostOnboardingSessionPreset(
  preset: PostOnboardingSessionPreset,
) {
  writeJson(postOnboardingSessionPresetStorageKey, preset);
}

export function markPostOnboardingSessionPresetConsumed() {
  const preset = readPostOnboardingSessionPreset();

  if (!preset || preset.status !== "active") {
    return;
  }

  writePostOnboardingSessionPreset({
    ...preset,
    status: "consumed",
  });
}

export function createPersonalRoomGenerationDraft(
  generationDraft?: Partial<PersonalRoomGenerationDraft>,
): PersonalRoomGenerationDraft {
  return {
    ...defaultGenerationDraftValue,
    ...generationDraft,
    updated_at: new Date().toISOString(),
  };
}

export function readPersonalRoomGenerationDraft() {
  return (
    readJson<PersonalRoomGenerationDraft>(personalRoomGenerationDraftStorageKey) ??
    createPersonalRoomGenerationDraft()
  );
}

export function writePersonalRoomGenerationDraft(
  generationDraft: PersonalRoomGenerationDraft,
) {
  writeJson(personalRoomGenerationDraftStorageKey, generationDraft);
}

export function readGeneratedPersonalRoomRecord() {
  const record = readJson<GeneratedPersonalRoomRecord>(
    generatedPersonalRoomRecordStorageKey,
  );

  if (!record) {
    return null;
  }

  const retentionEndsAt = Date.parse(record.guest_saved_until);

  if (Number.isNaN(retentionEndsAt) || retentionEndsAt <= Date.now()) {
    removeStorageItem(generatedPersonalRoomRecordStorageKey);
    return null;
  }

  return record;
}

export function writeGeneratedPersonalRoomRecord(
  generatedRoom: GeneratedPersonalRoomRecord,
) {
  writeJson(generatedPersonalRoomRecordStorageKey, generatedRoom);
}

export function readAuthStatus(): AuthStatus {
  if (typeof window === "undefined") {
    return "guest";
  }

  return window.localStorage.getItem(authStatusStorageKey) === "authenticated"
    ? "authenticated"
    : "guest";
}

export function writeAuthStatus(authStatus: AuthStatus) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(authStatusStorageKey, authStatus);
}

export function ensureGuestAuthStatus() {
  if (typeof window === "undefined") {
    return "guest" as const;
  }

  const currentAuthStatus = window.localStorage.getItem(authStatusStorageKey);

  if (currentAuthStatus === "authenticated") {
    return "authenticated" as const;
  }

  if (currentAuthStatus === "guest") {
    return "guest" as const;
  }

  window.localStorage.setItem(authStatusStorageKey, "guest");
  return "guest" as const;
}

export function readFirstLaunchTalkEntryContext() {
  return readJson<FirstLaunchTalkEntryContext>(firstLaunchTalkEntryContextStorageKey);
}

export function writeFirstLaunchTalkEntryContext(
  talkEntryContext: FirstLaunchTalkEntryContext,
) {
  writeJson(firstLaunchTalkEntryContextStorageKey, talkEntryContext);
}

export function clearFirstLaunchTalkEntryContext() {
  removeStorageItem(firstLaunchTalkEntryContextStorageKey);
}

export function buildPostOnboardingSessionPreset({
  q1State,
  q2SupportStyle,
}: {
  q1State: Q1State;
  q2SupportStyle: Q2SupportStyle;
}): PostOnboardingSessionPreset {
  const blueprint = presetBlueprints[q1State][q2SupportStyle];

  return {
    preset_id: `preset-${Date.now()}`,
    q1_state: q1State,
    q2_support_style: q2SupportStyle,
    ...blueprint,
    created_at: new Date().toISOString(),
    status: "active",
  };
}

export function buildGeneratedPersonalRoomRecord(
  visualTheme: PersonalRoomTheme,
): GeneratedPersonalRoomRecord {
  const theme = PERSONAL_ROOM_THEME_OPTIONS_V1.find(
    (option) => option.value === visualTheme,
  );
  const now = Date.now();

  return {
    room_id: `generated-room-${now}`,
    background_asset_id: theme?.previewAssetId ?? "theme-preview::fallback",
    room_source: "generated",
    visual_theme: visualTheme,
    created_from_onboarding: true,
    created_at: new Date(now).toISOString(),
    guest_saved_until: new Date(now + GUEST_ROOM_RETENTION_MS).toISOString(),
  };
}

// This mapping only influences the first room the user lands on.
// It must not surface as visible recommendation UI or lock later exploration.
export function getWeakLandingRoomIdFromTheme(
  visualTheme: PersonalRoomTheme | null | undefined,
) {
  if (!visualTheme) {
    return null;
  }

  return roomThemeMap[visualTheme] ?? null;
}

// This mapping is intentionally private to routing/hydration logic.
// It should remain a low-key initial landing hint, not a recommendation system.
export function getWeakLandingRoomIdFromPreset(
  preset:
    | Pick<PostOnboardingSessionPreset, "q1_state" | "q2_support_style">
    | null
    | undefined,
) {
  if (!preset) {
    return null;
  }

  return (
    presetRoomRecommendationMap[preset.q1_state]?.[preset.q2_support_style] ?? null
  );
}

export function clearFirstLaunchFlowStorage() {
  removeStorageItem(firstLaunchFlowDraftStorageKey);
  removeStorageItem(postOnboardingSessionPresetStorageKey);
  removeStorageItem(personalRoomGenerationDraftStorageKey);
  removeStorageItem(generatedPersonalRoomRecordStorageKey);
  removeStorageItem(firstLaunchTalkEntryContextStorageKey);
}
