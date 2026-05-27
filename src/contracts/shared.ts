export type EntityId = string;

export type ISODateString = string;

export type ISODateTimeString = string;

export type ContractVersion = "stage3-canonical-v1";

export type RoutePath =
  | "/"
  | "/onboarding"
  | "/room"
  | "/home"
  | "/talk"
  | "/memory"
  | "/sleep-monitoring";

export type RoomEntrySource =
  | "onboarding"
  | "home"
  | "manual"
  | "memory_cta"
  | "sleep_suggestion";

export type TraceabilityStatus = "traceable" | "system_default";

export type DataFreshnessStatus = "fresh" | "missing" | "stale";
