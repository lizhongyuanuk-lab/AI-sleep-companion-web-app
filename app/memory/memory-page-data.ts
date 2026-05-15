export type MemoryPageData = {
  user_id: string;
  memory_page_available: boolean;
  recent_memory_summary: {
    headline_summary: string;
    time_window_label: string;
    summary_confidence: "low" | "medium" | "high";
    source_session_count: number;
    supporting_line?: string | null;
  } | null;
  recurring_topics: Array<{
    memory_id: string;
    display_text: string;
    supporting_session_count: number;
    time_window_label: string;
    status: "active" | "hidden";
    exclude_from_personalization: boolean;
    continuation_hint?: string | null;
  }>;
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
  memory_hide_capability: boolean;
  last_memory_refresh_at: string;
};

// Mock contract mirrors the approved Memory spec until backend wiring exists.
export const memoryPageMockData: MemoryPageData = {
  user_id: "user_demo_night_01",
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
      memory_id: "memory_topic_unfinished_evenings",
      display_text: "Mentally busy evenings",
      supporting_session_count: 3,
      time_window_label: "This week",
      continuation_hint:
        "You settle more easily when the conversation starts softly.",
      status: "active",
      exclude_from_personalization: false,
    },
    {
      memory_id: "memory_topic_sleep_entry_pressure",
      display_text: "Gentler evening starts",
      supporting_session_count: 4,
      time_window_label: "This week",
      continuation_hint:
        "A softer opening works better than trying to solve everything first.",
      status: "active",
      exclude_from_personalization: false,
    },
    {
      memory_id: "memory_topic_quiet_company",
      display_text: "Quiet company first",
      supporting_session_count: 2,
      time_window_label: "Last few sessions",
      continuation_hint:
        "You often stay longer when the tone feels calm and unhurried.",
      status: "active",
      exclude_from_personalization: false,
    },
    {
      memory_id: "memory_topic_softer_openings",
      display_text: "Softer openings help",
      supporting_session_count: 3,
      time_window_label: "This week",
      continuation_hint:
        "Gentle first minutes seem to lower the pressure to explain everything at once.",
      status: "active",
      exclude_from_personalization: false,
    },
    {
      memory_id: "memory_topic_quieter_room_returns",
      display_text: "Quieter rooms help",
      supporting_session_count: 2,
      time_window_label: "Recent nights",
      continuation_hint:
        "Lower stimulation seems to make it easier to stay present and come back again.",
      status: "active",
      exclude_from_personalization: false,
    },
    {
      memory_id: "memory_topic_briefer_loops",
      display_text: "Brief check-ins help",
      supporting_session_count: 3,
      time_window_label: "Recent nights",
      continuation_hint:
        "Shorter conversations have felt easier to carry into the following night.",
      status: "active",
      exclude_from_personalization: false,
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
  memory_hide_capability: true,
  last_memory_refresh_at: "2026-04-28T10:30:00+08:00",
};
