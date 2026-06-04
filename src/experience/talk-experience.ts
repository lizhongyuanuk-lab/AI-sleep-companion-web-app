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
  eligibleMemoryIds: string[];
  localDataBoundaryLabel: string;
  realLlmStatus: "not_wired_stage5";
};

export function buildTalkExperience(input: {
  now: ISODateTimeString;
  entryContext?: TalkEntryContext | null;
  memories?: MemoryItem[];
}): TalkExperience {
  const entryContext =
    input.entryContext ?? buildDirectTalkEntryContext({ now: input.now });

  return {
    entryContext,
    entryContextValidation: validateTalkEntryContext(entryContext),
    eligibleMemoryIds: selectTalkCtaEligibleMemories(input.memories ?? []).map(
      (memory) => memory.id,
    ),
    localDataBoundaryLabel: stage5LocalDataNotice,
    realLlmStatus: "not_wired_stage5",
  };
}
