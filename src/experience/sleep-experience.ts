import type { SleepInsight, SleepLog, SuggestionRuleResult } from "../contracts";
import {
  getSleepLocalMockEligibility,
  type SleepLocalMockEligibility,
} from "../policies";
import { stage5LocalDataNotice } from "../local-data";

export type SleepExperience = {
  route: "/sleep-monitoring";
  logs: SleepLog[];
  insights: SleepInsight[];
  suggestionRuleResult?: SuggestionRuleResult;
  localMockEligibility: SleepLocalMockEligibility;
  localDataBoundaryLabel: string;
  passiveMonitoringStatus: "not_wired_stage5";
};

export function buildSleepExperience(input: {
  logs?: SleepLog[];
  insights?: SleepInsight[];
  suggestionRuleResult?: SuggestionRuleResult;
}): SleepExperience {
  const logs = input.logs ?? [];
  const insights = input.insights ?? [];

  return {
    route: "/sleep-monitoring",
    logs,
    insights,
    suggestionRuleResult: input.suggestionRuleResult,
    localMockEligibility: getSleepLocalMockEligibility({ logs, insights }),
    localDataBoundaryLabel: stage5LocalDataNotice,
    passiveMonitoringStatus: "not_wired_stage5",
  };
}
