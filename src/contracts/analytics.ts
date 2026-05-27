import type { EntityId, ISODateTimeString } from "./shared";

export type ProductEventName =
  | "app_opened"
  | "onboarding_view"
  | "onboarding_start_click"
  | "onboarding_q1_select"
  | "onboarding_q1_next_click"
  | "onboarding_q2_select"
  | "onboarding_result_view"
  | "onboarding_enter_room_click"
  | "onboarding_enter_room_success"
  | "onboarding_enter_room_fail"
  | "room_view"
  | "room_view_after_onboarding"
  | "room_option_viewed"
  | "room_session_started"
  | "room_session_ended"
  | "room_enter_talk_after_onboarding"
  | "talk_started"
  | "talk_message_sent"
  | "talk_ended"
  | "memory_item_created"
  | "memory_item_viewed"
  | "memory_feedback_submitted"
  | "memory_cta_clicked"
  | "sleep_checkin_started"
  | "sleep_checkin_completed"
  | "sleep_insight_viewed"
  | "tonight_suggestion_viewed"
  | "tonight_suggestion_clicked"
  | "home_recommendation_viewed"
  | "home_recommendation_clicked";

export type ProductEventPage =
  | "home"
  | "onboarding"
  | "room"
  | "talk"
  | "memory"
  | "sleep";

export type ProductEventEntityType =
  | "onboarding_preset"
  | "room_option"
  | "room_view"
  | "room_session"
  | "talk_session"
  | "memory_item"
  | "sleep_log"
  | "sleep_insight"
  | "home_recommendation";

export type ProductEventProperties = Record<string, string | number | boolean>;

export type ProductEvent = {
  id: EntityId;
  userId?: EntityId;
  anonymousId?: EntityId;
  eventName: ProductEventName;
  page: ProductEventPage;
  sessionId?: EntityId;
  entityType?: ProductEventEntityType;
  entityId?: EntityId;
  properties?: ProductEventProperties;
  createdAt: ISODateTimeString;
};
