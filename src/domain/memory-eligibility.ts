import type {
  ISODateTimeString,
  MemoryFeedback,
  MemoryFeedbackAction,
  MemoryFeedbackEffect,
  MemoryItem,
} from "../contracts";

export function isMemoryEligibleForPersonalization(
  memory: MemoryItem,
): boolean {
  if (memory.excludeFromPersonalization) return false;

  return memory.status === "active" || memory.status === "weakened";
}

export function isMemoryEligibleForHomeContinuity(memory: MemoryItem): boolean {
  return isMemoryEligibleForPersonalization(memory);
}

export function isMemoryVisible(memory: MemoryItem): boolean {
  return memory.status !== "hidden" && memory.status !== "archived";
}

export function isMemoryEligibleForTalkCta(memory: MemoryItem): boolean {
  return isMemoryVisible(memory) && isMemoryEligibleForPersonalization(memory);
}

export function getMemoryFeedbackEffect(
  action: MemoryFeedbackAction,
): MemoryFeedbackEffect {
  if (action === "agree") return "reinforce_memory";
  if (action === "disagree") return "contradict_memory";
  return "hide_from_memory_page_and_personalization";
}

export function buildMemoryFeedback(input: {
  id: string;
  memoryItemId: string;
  action: MemoryFeedbackAction;
  now: ISODateTimeString;
  note?: string;
}): MemoryFeedback {
  return {
    id: input.id,
    memoryItemId: input.memoryItemId,
    action: input.action,
    effect: getMemoryFeedbackEffect(input.action),
    note: input.note,
    createdAt: input.now,
  };
}

export function applyMemoryFeedbackToMemory(input: {
  memory: MemoryItem;
  action: MemoryFeedbackAction;
  now: ISODateTimeString;
}): MemoryItem {
  if (input.action === "agree") {
    return {
      ...input.memory,
      status: "active",
      influenceWeight: Math.min(1, Math.max(input.memory.influenceWeight, 0.7)),
      excludeFromPersonalization: false,
      updatedAt: input.now,
    };
  }

  if (input.action === "disagree") {
    return {
      ...input.memory,
      status: "contradicted",
      influenceWeight: 0,
      excludeFromPersonalization: true,
      updatedAt: input.now,
    };
  }

  return {
    ...input.memory,
    status: "hidden",
    hiddenAt: input.now,
    influenceWeight: 0,
    excludeFromPersonalization: true,
    updatedAt: input.now,
  };
}
