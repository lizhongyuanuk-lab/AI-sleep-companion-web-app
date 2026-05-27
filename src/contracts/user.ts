import type { EntityId, ISODateTimeString } from "./shared";

export type UserProfile = {
  userId?: EntityId;
  anonymousId: EntityId;
  hasCompletedOnboarding: boolean;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
};
