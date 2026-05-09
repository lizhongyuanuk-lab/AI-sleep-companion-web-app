import type { EntityId, ISODateString, ISODateTimeString } from "./shared";

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
