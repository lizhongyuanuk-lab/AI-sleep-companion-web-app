import type { MemoryFeedback, MemoryFeedbackAction, MemoryItem } from "../contracts";
import {
  applyMemoryFeedbackToMemory,
  buildMemoryFeedback,
} from "../domain";
import { selectTalkCtaEligibleMemories, selectVisibleMemories } from "../policies";
import { stage5LocalDataNotice } from "../local-data";

export type MemoryExperience = {
  visibleMemories: MemoryItem[];
  talkCtaEligibleMemoryIds: string[];
  supportedFeedbackActions: MemoryFeedbackAction[];
  hiddenMemoryIds: string[];
  localDataBoundaryLabel: string;
};

export function buildMemoryExperience(input: {
  memories: MemoryItem[];
}): MemoryExperience {
  const visibleMemories = selectVisibleMemories(input.memories);

  return {
    visibleMemories,
    talkCtaEligibleMemoryIds: selectTalkCtaEligibleMemories(
      visibleMemories,
    ).map((memory) => memory.id),
    supportedFeedbackActions: ["agree", "disagree", "hide"],
    hiddenMemoryIds: input.memories
      .filter((memory) => memory.status === "hidden")
      .map((memory) => memory.id),
    localDataBoundaryLabel: stage5LocalDataNotice,
  };
}

export function applyMemoryExperienceFeedback(input: {
  memory: MemoryItem;
  action: MemoryFeedbackAction;
  now: string;
  feedbackId: string;
}): { memory: MemoryItem; feedback: MemoryFeedback } {
  return {
    memory: applyMemoryFeedbackToMemory({
      memory: input.memory,
      action: input.action,
      now: input.now,
    }),
    feedback: buildMemoryFeedback({
      id: input.feedbackId,
      memoryItemId: input.memory.id,
      action: input.action,
      now: input.now,
    }),
  };
}
