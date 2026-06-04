import type { MemoryItem, SleepInsight, SleepLog } from "../contracts";

export function isSleepLogEligibleForLocalMockInsight(log: SleepLog): boolean {
  return Boolean(log.sleepDate && log.checkInDate && log.source);
}

export function isSleepInsightEligibleForHome(
  insight: SleepInsight,
): boolean {
  return insight.homeEligible && insight.basedOn.sleepLogIds.length > 0;
}

export function canUseMemoryForSleepSuggestion(memory: MemoryItem): boolean {
  return memory.status !== "hidden" && !memory.excludeFromPersonalization;
}
