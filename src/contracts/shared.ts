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
  | "after_onboarding"
  | "home_handoff"
  | "memory_handoff"
  | "sleep_handoff"
  | "direct";

export type TraceabilityStatus = "traceable" | "system_default";

export type DataFreshnessStatus = "fresh" | "missing" | "stale";
