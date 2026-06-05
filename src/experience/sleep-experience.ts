import type {
  EntityId,
  ISODateTimeString,
  SleepInsight,
  SleepLog,
  SuggestionRuleResult,
  TalkEntryContext,
} from "../contracts";
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

export type SleepSuggestionAction = {
  targetRoute: "/room" | "/talk";
  recommendedRoomId?: EntityId;
  sleepInsightId?: EntityId;
  talkEntryContext?: TalkEntryContext;
  localDataBoundaryLabel: string;
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

export function buildSleepSuggestionAction(input: {
  now: ISODateTimeString;
  targetRoute: "/room" | "/talk";
  recommendedRoomId?: EntityId;
  sleepInsightId?: EntityId;
  intent?: Extract<
    TalkEntryContext["intent"],
    "tonight_suggestion" | "sleep_reflection"
  >;
}): SleepSuggestionAction {
  return {
    targetRoute: input.targetRoute,
    recommendedRoomId: input.recommendedRoomId,
    sleepInsightId: input.sleepInsightId,
    talkEntryContext:
      input.targetRoute === "/talk"
        ? {
            source: "sleep",
            sourceId: input.sleepInsightId,
            intent: input.intent ?? "sleep_reflection",
            sleepInsightId: input.sleepInsightId,
            createdAt: input.now,
          }
        : undefined,
    localDataBoundaryLabel: stage5LocalDataNotice,
  };
}
