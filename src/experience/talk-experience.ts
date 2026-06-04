import type {
  ISODateTimeString,
  MemoryItem,
  TalkEntryContext,
} from "../contracts";
import {
  buildDirectTalkEntryContext,
  validateTalkEntryContext,
  type TalkEntryContextValidationResult,
} from "../domain";
import { selectTalkCtaEligibleMemories } from "../policies";
import { stage5LocalDataNotice } from "../local-data";

export type TalkExperience = {
  entryContext: TalkEntryContext;
  entryContextValidation: TalkEntryContextValidationResult;
  entryContextUiSupport: TalkEntryContextUiSupport;
  eligibleMemoryIds: string[];
  localDataBoundaryLabel: string;
  realLlmStatus: "not_wired_stage5";
};

export type TalkEntryContextUiSupport = {
  source: TalkEntryContext["source"];
  handling:
    | "room_first_launch_adapter"
    | "room_voice_presence_default"
    | "non_room_context_hint_only"
    | "direct_default"
    | "unsupported_invalid_context";
  initialHint: string | null;
  fallbackNote?: string;
};

function buildTalkEntryContextUiSupport(
  entryContext: TalkEntryContext,
  validation: TalkEntryContextValidationResult,
): TalkEntryContextUiSupport {
  if (!validation.valid) {
    return {
      source: entryContext.source,
      handling: "unsupported_invalid_context",
      initialHint: null,
      fallbackNote: `Missing required TalkEntryContext fields: ${validation.missingFields.join(
        ", ",
      )}`,
    };
  }

  if (entryContext.source === "room") {
    return {
      source: "room",
      handling: entryContext.onboardingPreset
        ? "room_first_launch_adapter"
        : "room_voice_presence_default",
      initialHint: entryContext.onboardingPreset
        ? null
        : "The room is ready when you are.",
    };
  }

  if (entryContext.source === "sleep") {
    return {
      source: "sleep",
      handling: "non_room_context_hint_only",
      initialHint:
        entryContext.intent === "tonight_suggestion"
          ? "Tonight's local sleep suggestion is here when you want to continue softly."
          : "We can stay close to that sleep reflection, gently.",
    };
  }

  if (entryContext.source === "memory") {
    return {
      source: "memory",
      handling: "non_room_context_hint_only",
      initialHint: "We can stay with that memory without rushing it.",
    };
  }

  if (entryContext.source === "home") {
    return {
      source: "home",
      handling: "non_room_context_hint_only",
      initialHint:
        "You came from the local recommendation, and we can begin quietly.",
      fallbackNote:
        'Runtime / remains current entry; canonical /home remains unresolved product/runtime follow-up.',
    };
  }

  return {
    source: "direct",
    handling: "direct_default",
    initialHint: null,
  };
}

export function buildTalkExperience(input: {
  now: ISODateTimeString;
  entryContext?: TalkEntryContext | null;
  memories?: MemoryItem[];
}): TalkExperience {
  const entryContext =
    input.entryContext ?? buildDirectTalkEntryContext({ now: input.now });
  const entryContextValidation = validateTalkEntryContext(entryContext);

  return {
    entryContext,
    entryContextValidation,
    entryContextUiSupport: buildTalkEntryContextUiSupport(
      entryContext,
      entryContextValidation,
    ),
    eligibleMemoryIds: selectTalkCtaEligibleMemories(input.memories ?? []).map(
      (memory) => memory.id,
    ),
    localDataBoundaryLabel: stage5LocalDataNotice,
    realLlmStatus: "not_wired_stage5",
  };
}
