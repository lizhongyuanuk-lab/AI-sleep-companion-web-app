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
    is_deleted: boolean;
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
  memory_delete_capability: boolean;
  last_memory_refresh_at: string;
};

import type {
  CompanionProfile,
  MemoryItem,
  UserSleepProfile,
} from "@/src/contracts/sleep";

function getHeroHeadline(profile: UserSleepProfile, companion: CompanionProfile) {
  switch (profile.sleepGoal) {
    case "reduce_anxiety":
      return "Lately, your nights seem to settle more easily with less pressure.";
    case "build_routine":
      return "A steadier rhythm has been asking for the same softer return.";
    case "companionship":
      return `${companion.name}'s quieter company seems to help the night feel less lonely.`;
    case "fall_asleep":
    default:
      return "Lately, your nights have been asking for a gentler pace.";
  }
}

function getSupportingLine(memories: MemoryItem[]) {
  return memories[0]?.content ?? "The softer openings still seem to matter most.";
}

function getPatternType(memory: MemoryItem["type"]) {
  switch (memory) {
    case "routine":
      return "pacing" as const;
    case "companion_note":
      return "tone" as const;
    case "preference":
      return "room_preference" as const;
    case "emotion_pattern":
    default:
      return "general" as const;
  }
}

function getContinuationHint(memory: MemoryItem["type"], companionName: string) {
  switch (memory) {
    case "routine":
      return "A steadier nightly return seems easier to stay with.";
    case "companion_note":
      return `${companionName} can keep this tone soft again tonight.`;
    case "emotion_pattern":
      return "A lower-pressure opening still seems to help most.";
    case "preference":
    default:
      return "This still looks like something worth carrying into tonight.";
  }
}

export function buildMemoryPageData({
  userProfile,
  companionProfile,
  memories,
}: {
  userProfile: UserSleepProfile;
  companionProfile: CompanionProfile;
  memories: MemoryItem[];
}): MemoryPageData {
  const recurringTopics = memories.map((memory, index) => ({
    memory_id: memory.id,
    display_text: memory.content,
    supporting_session_count: Math.max(2, 4 - index),
    time_window_label: index < 2 ? "From onboarding" : "Recent pattern",
    is_deleted: false,
    continuation_hint: getContinuationHint(memory.type, companionProfile.name),
  }));

  return {
    user_id: userProfile.id,
    memory_page_available: true,
    recent_memory_summary: {
      headline_summary: getHeroHeadline(userProfile, companionProfile),
      time_window_label: "From your first companion setup",
      summary_confidence: "medium",
      source_session_count: Math.max(memories.length, 1),
      supporting_line: getSupportingLine(memories),
    },
    recurring_topics: recurringTopics,
    helpful_patterns: memories.slice(0, 3).map((memory, index) => ({
      pattern_id: `pattern_${memory.id}`,
      display_text: memory.content,
      pattern_type: getPatternType(memory.type),
      evidence_strength: index === 0 ? "strong" : index === 1 ? "medium" : "light",
      supporting_line: getContinuationHint(memory.type, companionProfile.name),
    })),
    continue_actions: [
      {
        action_id: "continue_general_tonight",
        action_type: "general",
        label: "Talk about this",
        target_route: "/talk",
        target_payload: {
          continuation_source: "memory",
          continuation_mode: "general",
          soft_prefill_context: `Talk with ${companionProfile.name} about what has been staying with me lately.`,
        },
        visual_priority: "secondary",
      },
      {
        action_id: "continue_topic_memory",
        action_type: "topic",
        label: "Try a gentler start",
        target_route: "/talk",
        target_payload: {
          continuation_source: "memory",
          selected_memory_item_id: recurringTopics[0]?.memory_id,
          continuation_mode: "topic",
          soft_prefill_context: "Begin with a softer opening tonight.",
        },
        visual_priority: "secondary",
      },
      {
        action_id: "continue_style_companion",
        action_type: "style",
        label: `Stay with ${companionProfile.name}`,
        target_route: "/talk",
        target_payload: {
          continuation_source: "memory",
          continuation_mode: "style",
          soft_prefill_context: companionProfile.greeting,
        },
        visual_priority: "secondary",
      },
    ],
    memory_items_version: "stage3-local-v1",
    deep_history_available: false,
    memory_delete_capability: true,
    last_memory_refresh_at:
      memories[0]?.updatedAt ?? companionProfile.updatedAt ?? userProfile.updatedAt,
  };
}
