import type { EntityId, ISODateTimeString } from "./shared";

export type OnboardingStateStatus =
  | "not_started"
  | "in_progress"
  | "completed";

export type OnboardingPresetQ1State =
  | "sleep_blocked"
  | "overthinking"
  | "anxious_irritated"
  | "lonely_need_presence";

export type OnboardingPresetQ2SupportStyle =
  | "sleep_guide"
  | "comfort_talk"
  | "mindfulness_guide"
  | "quiet_presence";

export type OnboardingPresetBaseMode =
  | "sleep_guide"
  | "comfort_talk"
  | "mindfulness_guide"
  | "quiet_presence";

export type OnboardingPresetStateModifier =
  | "sleep_blocked"
  | "overthinking"
  | "anxious_irritated"
  | "lonely_need_presence"
  | "neutral_modifier";

export type OnboardingPresetReplyLengthDefault = "short" | "medium";

export type OnboardingPresetQuestionBudgetFirst3Turns = 0 | 1 | 2;

export type OnboardingPresetStatus = "active" | "consumed" | "expired";

export type OnboardingDraft = {
  stepIndex: 0 | 1 | 2 | 3;
  q1State?: OnboardingPresetQ1State;
  q2SupportStyle?: OnboardingPresetQ2SupportStyle;
  draftUpdatedAt: ISODateTimeString;
  expiresAt: ISODateTimeString;
};

export type OnboardingState = {
  status: OnboardingStateStatus;
  q1State?: OnboardingPreset["q1State"];
  q2SupportStyle?: OnboardingPreset["q2SupportStyle"];
  activePresetId?: EntityId;
  latestConsumedPresetId?: EntityId;
  latestExpiredPresetId?: EntityId;
  completedAt?: ISODateTimeString;
  updatedAt: ISODateTimeString;
};

export type OnboardingPreset = {
  id: EntityId;
  presetId: EntityId;
  q1State: OnboardingPresetQ1State;
  q2SupportStyle: OnboardingPresetQ2SupportStyle;
  baseMode: OnboardingPresetBaseMode;
  stateModifier: OnboardingPresetStateModifier;
  openingCopyId: EntityId;
  replyLengthDefault: OnboardingPresetReplyLengthDefault;
  questionBudgetFirst3Turns: OnboardingPresetQuestionBudgetFirst3Turns;
  sleepTransitionEnabled: boolean;
  fallbackChain: string[];
  status: OnboardingPresetStatus;
  createdAt: ISODateTimeString;
  expiresAt: ISODateTimeString;
  consumedAt?: ISODateTimeString;
};

export type OnboardingContextCard = {
  sourcePresetId: EntityId;
  title: string;
  body: string;
  allowedConsumers: ["memory_preview"];
  disallowedConsumers: [
    "talk_personalization",
    "sleep_recommendation",
    "home_recommendation",
    "long_term_profile",
  ];
  expiresAt: ISODateTimeString;
};
