import type {
  CompanionMood,
  CompanionProfile,
  CompanionTone,
  MemoryItem,
  RoomPhase,
  RoomState,
  SleepCompanionSeed,
  SleepGoal,
  Stage3OnboardingInput,
  SuggestedAction,
  UserSleepProfile,
} from "@/src/contracts/sleep";

const fallbackNowIso = "2026-05-07T21:30:00.000Z";

function createStableId(prefix: string, rawValue: string) {
  let hash = 0;

  for (let index = 0; index < rawValue.length; index += 1) {
    hash = (hash * 31 + rawValue.charCodeAt(index)) >>> 0;
  }

  return `${prefix}_${hash.toString(16).padStart(8, "0")}`;
}

function toSleepGoal(
  q2SupportStyle: Stage3OnboardingInput["q2SupportStyle"],
): SleepGoal {
  switch (q2SupportStyle) {
    case "soothe_and_chat":
      return "reduce_anxiety";
    case "meditation_practice":
      return "build_routine";
    case "quiet_company":
      return "companionship";
    case "help_me_sleep_fast":
    default:
      return "fall_asleep";
  }
}

function toTone(
  q2SupportStyle: Stage3OnboardingInput["q2SupportStyle"],
): CompanionTone {
  switch (q2SupportStyle) {
    case "soothe_and_chat":
      return "warm";
    case "meditation_practice":
      return "quiet";
    case "quiet_company":
      return "gentle";
    case "help_me_sleep_fast":
    default:
      return "gentle";
  }
}

function getCompanionName(tone: CompanionTone) {
  switch (tone) {
    case "warm":
      return "Mira";
    case "quiet":
      return "Lune";
    case "playful":
      return "Pip";
    case "gentle":
    default:
      return "Aster";
  }
}

function getDifficultyList(
  q1State: Stage3OnboardingInput["q1State"],
): string[] {
  switch (q1State) {
    case "mind_racing":
      return ["mind_racing", "slowing_down_at_night"];
    case "anxious_or_irritated":
      return ["high_stimulation", "nighttime_anxiety"];
    case "lonely_needing_company":
      return ["loneliness", "settling_without_company"];
    case "tired_but_awake":
    default:
      return ["falling_asleep", "staying_unpressured"];
  }
}

function getGreeting(tone: CompanionTone, sleepGoal: SleepGoal) {
  if (sleepGoal === "companionship") {
    return "I’m here with you tonight, and we can keep this soft.";
  }

  switch (tone) {
    case "warm":
      return "We can take this one slow breath at a time tonight.";
    case "quiet":
      return "We can let the room get quieter before we ask anything of you.";
    case "playful":
      return "We can keep tonight light and easy.";
    case "gentle":
    default:
      return "We can settle into sleep gently tonight.";
  }
}

function getRoomPhase(sleepGoal: SleepGoal): RoomPhase {
  switch (sleepGoal) {
    case "build_routine":
      return "evening";
    case "companionship":
    case "reduce_anxiety":
      return "pre_sleep";
    case "fall_asleep":
    default:
      return "pre_sleep";
  }
}

function getSuggestedAction(sleepGoal: SleepGoal): SuggestedAction {
  switch (sleepGoal) {
    case "fall_asleep":
    case "build_routine":
      return "start_sleep";
    case "reduce_anxiety":
      return "reflect";
    case "companionship":
    default:
      return "talk";
  }
}

function getCompanionMood(
  sleepGoal: SleepGoal,
  q1State: Stage3OnboardingInput["q1State"],
): CompanionMood {
  if (sleepGoal === "fall_asleep") {
    return "sleepy";
  }

  if (q1State === "mind_racing" || q1State === "anxious_or_irritated") {
    return "attentive";
  }

  return "calm";
}

function getUsualSleepTime(
  q1State: Stage3OnboardingInput["q1State"],
): string {
  if (q1State === "mind_racing" || q1State === "lonely_needing_company") {
    return "23:30";
  }

  return "23:00";
}

function getWakeTime(sleepGoal: SleepGoal): string {
  if (sleepGoal === "build_routine") {
    return "07:00";
  }

  return "07:30";
}

export function createDefaultSleepCompanionSeed(
  input: Stage3OnboardingInput = {},
): SleepCompanionSeed {
  const q1State = input.q1State ?? "tired_but_awake";
  const q2SupportStyle = input.q2SupportStyle ?? "help_me_sleep_fast";
  const nowIso = input.nowIso ?? fallbackNowIso;
  const sleepGoal = toSleepGoal(q2SupportStyle);
  const tone = toTone(q2SupportStyle);
  const companionName = getCompanionName(tone);
  const seedIdentity = `${q1State}:${q2SupportStyle}:${input.selectedVisualTheme ?? "default"}`;

  const userProfile: UserSleepProfile = {
    id: createStableId("user_sleep", seedIdentity),
    sleepGoal,
    usualSleepTime: getUsualSleepTime(q1State),
    wakeTime: getWakeTime(sleepGoal),
    mainDifficulty: getDifficultyList(q1State),
    preferredCompanionTone: tone,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const companionProfile: CompanionProfile = {
    id: createStableId("companion", seedIdentity),
    name: companionName,
    tone,
    relationshipStage: "new",
    greeting: getGreeting(tone, sleepGoal),
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  const roomState: RoomState = {
    id: createStableId("room_state", seedIdentity),
    companionMood: getCompanionMood(sleepGoal, q1State),
    currentPhase: getRoomPhase(sleepGoal),
    suggestedAction: getSuggestedAction(sleepGoal),
    lastUpdatedAt: nowIso,
  };

  const memories: MemoryItem[] = [
    {
      id: createStableId("memory_pref", seedIdentity),
      type: "preference",
      content: `You tend to settle best with a ${tone} companion tone.`,
      confidence: 0.9,
      source: "onboarding",
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: createStableId("memory_routine", seedIdentity),
      type: "routine",
      content: `Your usual sleep window starts around ${userProfile.usualSleepTime}.`,
      confidence: 0.82,
      source: "onboarding",
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: createStableId("memory_emotion", seedIdentity),
      type: "emotion_pattern",
      content:
        q1State === "mind_racing"
          ? "Busy thoughts tend to be the hardest part of your evenings."
          : q1State === "anxious_or_irritated"
            ? "Lower stimulation helps when the night feels tense or full."
            : q1State === "lonely_needing_company"
              ? "Feeling less alone helps you stay with the night longer."
              : "You usually need less pressure and a gentler slide toward sleep.",
      confidence: 0.84,
      source: "onboarding",
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: createStableId("memory_companion", seedIdentity),
      type: "companion_note",
      content: companionProfile.greeting,
      confidence: 0.78,
      source: "onboarding",
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ];

  return {
    userProfile,
    companionProfile,
    roomState,
    memories,
  };
}

