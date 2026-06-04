import type { MemoryFeedbackAction, MemoryItem } from "@/src/contracts";

export type MemoryPageTopic = MemoryItem & {
  supportingSessionCount: number;
  timeWindowLabel: string;
  continuationHint?: string | null;
};

export type MemoryPageData = {
  user_id: string;
  mock_boundary_label: string;
  memory_page_available: boolean;
  recent_memory_summary: {
    headline_summary: string;
    time_window_label: string;
    summary_confidence: "low" | "medium" | "high";
    source_session_count: number;
    supporting_line?: string | null;
  } | null;
  recurring_topics: MemoryPageTopic[];
  helpful_patterns: Array<{
    pattern_id: string;
    display_text: string;
    pattern_type:
      | "pacing"
      | "tone"
      | "room_preference"
      | "conversation_shape"
      | "general";
    evidence_strength: "light" | "medium" | "strong";
    supporting_line?: string | null;
  }>;
  continue_actions: Array<{
    action_id: string;
    action_type: "general" | "topic" | "style" | "deep_history";
    label: string;
    target_route: "/talk" | "/memory/history";
    target_payload?: {
      continuation_source: "memory";
      selected_memory_item_id?: string;
      continuation_mode?: "general" | "topic" | "style";
      soft_prefill_context?: string;
    };
    visual_priority: "primary" | "secondary" | "weak";
  }>;
  memory_items_version: string;
  deep_history_available: boolean;
  supported_feedback_actions: MemoryFeedbackAction[];
  last_memory_refresh_at: string;
};

// Local mock contract mirrors the approved Memory spec until real data wiring exists.
export const memoryPageMockData: MemoryPageData = {
  user_id: "user_demo_night_01",
  mock_boundary_label:
    "Memory data on this page is local mock data, not backend or real AI memory wiring.",
  memory_page_available: true,
  recent_memory_summary: {
    headline_summary: "Lately, your nights have been asking for a gentler pace.",
    time_window_label: "From the last 7 nights",
    summary_confidence: "medium",
    source_session_count: 5,
    supporting_line: "Shorter check-ins seemed to help.",
  },
  recurring_topics: [
    {
      id: "memory_topic_unfinished_evenings",
      source: "talk_session",
      sourceId: "talk_mock_recent_01",
      type: "emotional_pattern",
      title: "Mentally busy evenings",
      body:
        "You settle more easily when the conversation starts softly.",
      confidence: "medium",
      influenceWeight: 0.54,
      status: "active",
      excludeFromPersonalization: false,
      supportingSessionCount: 3,
      timeWindowLabel: "This week",
      continuationHint:
        "You settle more easily when the conversation starts softly.",
      createdAt: "2026-04-24T22:15:00+08:00",
      updatedAt: "2026-04-28T10:30:00+08:00",
    },
    {
      id: "memory_topic_sleep_entry_pressure",
      source: "talk_session",
      sourceId: "talk_mock_recent_02",
      type: "support_style",
      title: "Gentler evening starts",
      body:
        "A softer opening works better than trying to solve everything first.",
      confidence: "medium",
      influenceWeight: 0.62,
      status: "active",
      excludeFromPersonalization: false,
      supportingSessionCount: 4,
      timeWindowLabel: "This week",
      continuationHint:
        "A softer opening works better than trying to solve everything first.",
      createdAt: "2026-04-25T22:20:00+08:00",
      updatedAt: "2026-04-28T10:30:00+08:00",
    },
    {
      id: "memory_topic_quiet_company",
      source: "talk_session",
      sourceId: "talk_mock_recent_03",
      type: "support_style",
      title: "Quiet company first",
      body:
        "You often stay longer when the tone feels calm and unhurried.",
      confidence: "low",
      influenceWeight: 0.44,
      status: "active",
      excludeFromPersonalization: false,
      supportingSessionCount: 2,
      timeWindowLabel: "Last few sessions",
      continuationHint:
        "You often stay longer when the tone feels calm and unhurried.",
      createdAt: "2026-04-25T22:40:00+08:00",
      updatedAt: "2026-04-28T10:30:00+08:00",
    },
    {
      id: "memory_topic_softer_openings",
      source: "talk_session",
      sourceId: "talk_mock_recent_04",
      type: "routine",
      title: "Softer openings help",
      body:
        "Gentle first minutes seem to lower the pressure to explain everything at once.",
      confidence: "medium",
      influenceWeight: 0.5,
      status: "active",
      excludeFromPersonalization: false,
      supportingSessionCount: 3,
      timeWindowLabel: "This week",
      continuationHint:
        "Gentle first minutes seem to lower the pressure to explain everything at once.",
      createdAt: "2026-04-26T21:50:00+08:00",
      updatedAt: "2026-04-28T10:30:00+08:00",
    },
    {
      id: "memory_topic_quieter_room_returns",
      source: "room_session",
      sourceId: "room_session_mock_recent_01",
      type: "preference",
      title: "Quieter rooms help",
      body:
        "Lower stimulation seems to make it easier to stay present and come back again.",
      confidence: "low",
      influenceWeight: 0.42,
      status: "active",
      excludeFromPersonalization: false,
      supportingSessionCount: 2,
      timeWindowLabel: "Recent nights",
      continuationHint:
        "Lower stimulation seems to make it easier to stay present and come back again.",
      createdAt: "2026-04-27T22:05:00+08:00",
      updatedAt: "2026-04-28T10:30:00+08:00",
    },
    {
      id: "memory_topic_briefer_loops",
      source: "talk_session",
      sourceId: "talk_mock_recent_05",
      type: "routine",
      title: "Brief check-ins help",
      body:
        "Shorter conversations have felt easier to carry into the following night.",
      confidence: "medium",
      influenceWeight: 0.48,
      status: "active",
      excludeFromPersonalization: false,
      supportingSessionCount: 3,
      timeWindowLabel: "Recent nights",
      continuationHint:
        "Shorter conversations have felt easier to carry into the following night.",
      createdAt: "2026-04-28T07:40:00+08:00",
      updatedAt: "2026-04-28T10:30:00+08:00",
    },
  ],
  helpful_patterns: [
    {
      pattern_id: "pattern_slower_openings",
      display_text: "Slower openings seem to help more than jumping straight into problem-solving.",
      pattern_type: "pacing",
      evidence_strength: "strong",
      supporting_line: "You tended to stay longer when the first minutes felt unhurried.",
    },
    {
      pattern_id: "pattern_quieter_rooms",
      display_text: "Quieter room settings seem to fit better on the nights you want less stimulation.",
      pattern_type: "room_preference",
      evidence_strength: "medium",
      supporting_line: "The softer scenes showed up repeatedly alongside longer sessions.",
    },
    {
      pattern_id: "pattern_shorter_loops",
      display_text: "Shorter unwinding conversations seem easier to return to consistently.",
      pattern_type: "conversation_shape",
      evidence_strength: "light",
      supporting_line: "Brief check-ins were easier to restart on the following night.",
    },
  ],
  continue_actions: [
    {
      action_id: "continue_general_tonight",
      action_type: "general",
      label: "Talk about this",
      target_route: "/talk",
      target_payload: {
        continuation_source: "memory",
        continuation_mode: "general",
        soft_prefill_context: "Talk about what has been staying with me lately.",
      },
      visual_priority: "secondary",
    },
    {
      action_id: "continue_topic_quiet_company",
      action_type: "topic",
      label: "Try a gentler start",
      target_route: "/talk",
      target_payload: {
        continuation_source: "memory",
        selected_memory_item_id: "memory_topic_sleep_entry_pressure",
        continuation_mode: "topic",
        soft_prefill_context: "Begin with a softer opening tonight.",
      },
      visual_priority: "secondary",
    },
    {
      action_id: "continue_style_slow_pacing",
      action_type: "style",
      label: "Stay with quiet company",
      target_route: "/talk",
      target_payload: {
        continuation_source: "memory",
        continuation_mode: "style",
        soft_prefill_context: "Keep the tone calm and unhurried.",
      },
      visual_priority: "secondary",
    },
  ],
  memory_items_version: "mock-v1",
  deep_history_available: true,
  supported_feedback_actions: ["agree", "disagree", "hide"],
  last_memory_refresh_at: "2026-04-28T10:30:00+08:00",
};
