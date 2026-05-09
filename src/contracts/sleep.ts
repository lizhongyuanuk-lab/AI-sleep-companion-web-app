import type { EntityId, ISODateString, ISODateTimeString } from "./shared";
import type { TalkEntryContext } from "./conversation";

export type SleepGoal = {
  id: EntityId;
  status: "future_only";
  isActive: false;
  reason: "not_defined_in_stage3_product_logic";
};

export type Ritual = {
  id: EntityId;
  status: "future_only";
  isActive: false;
  reason: "not_defined_in_stage3_product_logic";
};

export type SleepSessionContinuityState = "none" | "partial" | "complete";

export type SleepSession = {
  id: EntityId;
  sleepDate: ISODateString;
  latestSleepCheckInId?: EntityId;
  latestSleepInsightId?: EntityId;
  preSleepTalkSessionId?: EntityId;
  preSleepRoomSessionId?: EntityId;
  continuityState: SleepSessionContinuityState;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};

export type SleepCheckInSource =
  | "manual_morning_checkin"
  | "talk_followup"
  | "room_followup";

export type SleepRating = 1 | 2 | 3 | 4 | 5;

export type SleepCheckIn = {
  id: EntityId;
  sleepDate: ISODateString;
  checkInDate: ISODateString;
  timezone: string;
  intendedBedtime?: string;
  actualBedtime?: string;
  wakeTime?: string;
  sleepQuality?: SleepRating;
  easeOfFallingAsleep?: SleepRating;
  nightAwakenings?: number;
  morningEnergy?: SleepRating;
  preSleepTalkSessionId?: EntityId;
  preSleepRoomSessionId?: EntityId;
  notes?: string;
  source: SleepCheckInSource;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};

export type SleepInsightPeriod =
  | "single_night"
  | "3_day"
  | "7_day"
  | "14_day";

export type SleepInsightConfidence = "low" | "medium" | "high";

export type SleepInsightSuggestionType =
  | "keep_consistent_bedtime"
  | "try_gentler_talk"
  | "use_quiet_room"
  | "reduce_late_stimulation"
  | "short_checkin"
  | "no_change_needed"
  | "collect_more_data";

export type SleepInsightCta = {
  label: string;
  target: "talk" | "room" | "sleep_checkin";
  entryContext?: TalkEntryContext;
};

export type SleepInsight = {
  id: EntityId;
  period: SleepInsightPeriod;
  startDate: ISODateString;
  endDate: ISODateString;
  title: string;
  body: string;
  confidence: SleepInsightConfidence;
  basedOn: {
    sleepCheckInIds: EntityId[];
    sleepSessionId?: EntityId;
    talkSessionIds?: EntityId[];
    roomSessionIds?: EntityId[];
    memoryItemIds?: EntityId[];
    memoryFeedbackIds?: EntityId[];
  };
  suggestionType: SleepInsightSuggestionType;
  cta?: SleepInsightCta;
  homeEligible: boolean;
  createdAt: ISODateTimeString;
};
