import type { MemoryItem } from "../contracts";
import {
  isMemoryEligibleForHomeContinuity,
  isMemoryEligibleForTalkCta,
  isMemoryVisible,
} from "../domain";

export function selectVisibleMemories(memories: MemoryItem[]): MemoryItem[] {
  return memories.filter(isMemoryVisible);
}

export function selectHomeEligibleMemories(memories: MemoryItem[]): MemoryItem[] {
  return memories.filter(isMemoryEligibleForHomeContinuity);
}

export function selectTalkCtaEligibleMemories(
  memories: MemoryItem[],
): MemoryItem[] {
  return memories.filter(isMemoryEligibleForTalkCta);
}
