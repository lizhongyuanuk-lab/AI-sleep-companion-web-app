import type { SleepInsight, SleepLog } from "../contracts";
import {
  isSleepInsightEligibleForHome,
  isSleepLogEligibleForLocalMockInsight,
} from "../domain";

export type SleepLocalMockEligibility =
  | "collect_more_data"
  | "single_night_mock_eligible"
  | "insight_mock_eligible";

export function getSleepLocalMockEligibility(input: {
  logs: SleepLog[];
  insights: SleepInsight[];
}): SleepLocalMockEligibility {
  if (input.insights.some(isSleepInsightEligibleForHome)) {
    return "insight_mock_eligible";
  }

  if (input.logs.some(isSleepLogEligibleForLocalMockInsight)) {
    return "single_night_mock_eligible";
  }

  return "collect_more_data";
}
