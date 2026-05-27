import type { MemoryItem } from "../contracts";

export function isMemoryEligibleForPersonalization(
  memory: MemoryItem,
): boolean {
  if (memory.excludeFromPersonalization) return false;

  return memory.status === "active" || memory.status === "weakened";
}

export function isMemoryEligibleForHomeContinuity(memory: MemoryItem): boolean {
  return isMemoryEligibleForPersonalization(memory);
}
