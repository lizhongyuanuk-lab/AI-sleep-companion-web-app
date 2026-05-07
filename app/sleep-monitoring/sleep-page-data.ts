export type SleepPageState =
  | "full_record"
  | "partial_record"
  | "companion_only"
  | "empty_state"
  | "loading"
  | "error_state";

export type SleepPageData = {
  user_id: string;
  page_state: SleepPageState;
  record_confidence: "low" | "medium" | "high";
  record_type: "full" | "partial" | "companion_only" | "empty";
  record_context_label: string;
  hero_insight: {
    eyebrow: string;
    title: string;
    supporting_line?: string | null;
  } | null;
  summary_card: {
    status_label?: "Estimated" | "Partial record" | "Companion only" | null;
    duration_display?: string | null;
    duration_label?: string | null;
    companion_session_duration_display?: string | null;
    fell_asleep_at?: string | null;
    woke_up_at?: string | null;
    quiet_time_display?: string | null;
  } | null;
  rhythm_card: {
    title: "Sleep rhythm";
    status_label?: "Estimated" | "Partial record" | "Companion only" | null;
    available: boolean;
    active_filter: "awake" | "light" | "deep" | "dream";
    points: Array<{
      x: number;
      y: number;
      emphasis?: "base" | "highlight";
    }>;
    time_labels: string[];
  } | null;
  trend_card: {
    title: "Last 7 nights";
    supporting_line: string;
    bars: Array<{
      night_id: string;
      day_label: string;
      height: number;
      emphasis?: "base" | "highlight";
    }>;
  } | null;
  suggestion_card: {
    title: string;
    body: string;
    cta_label: string;
    target_route: "/room" | "/talk";
    target_payload?: {
      continuation_source: "sleep";
      recommended_room_id?: string;
      recommended_room_name?: string;
      recommendation_type?: "room" | "talk";
      suggested_strategy?: string;
      sleep_context_label?: string;
    };
  } | null;
  retry_available: boolean;
  last_updated_at?: string | null;
};

export type SleepMockCaseKey =
  | "full_record"
  | "partial_record"
  | "companion_only"
  | "empty_state"
  | "error_state";

export const defaultSleepMockCase: SleepMockCaseKey = "full_record";

export const fullRhythmPoints = [
  { x: 0, y: 0.72, emphasis: "base" as const },
  { x: 0.09, y: 0.58, emphasis: "highlight" as const },
  { x: 0.18, y: 0.64, emphasis: "base" as const },
  { x: 0.27, y: 0.42, emphasis: "highlight" as const },
  { x: 0.36, y: 0.52, emphasis: "base" as const },
  { x: 0.45, y: 0.37, emphasis: "highlight" as const },
  { x: 0.54, y: 0.49, emphasis: "base" as const },
  { x: 0.63, y: 0.34, emphasis: "highlight" as const },
  { x: 0.72, y: 0.45, emphasis: "base" as const },
  { x: 0.81, y: 0.4, emphasis: "highlight" as const },
  { x: 0.9, y: 0.57, emphasis: "base" as const },
  { x: 1, y: 0.47, emphasis: "highlight" as const },
];

export const partialRhythmPoints = [
  { x: 0, y: 0.78, emphasis: "base" as const },
  { x: 0.11, y: 0.67, emphasis: "highlight" as const },
  { x: 0.22, y: 0.61, emphasis: "base" as const },
  { x: 0.33, y: 0.52, emphasis: "highlight" as const },
  { x: 0.44, y: 0.58, emphasis: "base" as const },
  { x: 0.55, y: 0.46, emphasis: "highlight" as const },
  { x: 0.66, y: 0.51, emphasis: "base" as const },
  { x: 0.77, y: 0.63, emphasis: "highlight" as const },
  { x: 0.88, y: 0.69, emphasis: "base" as const },
  { x: 1, y: 0.62, emphasis: "highlight" as const },
];

export const sleepMockCases: Record<SleepMockCaseKey, SleepPageData> = {
  full_record: {
    user_id: "user_demo_night_01",
    page_state: "full_record",
    record_confidence: "medium",
    record_type: "full",
    record_context_label: "Last night · Apr 29",
    hero_insight: {
      eyebrow: "From the last 7 nights",
      title: "Your sleep found\na softer rhythm\nlast night.",
      supporting_line: "Shorter check-ins seemed to help.",
    },
    summary_card: {
      status_label: "Estimated",
      duration_display: "7h 24m",
      duration_label: "Estimated sleep",
      fell_asleep_at: "12:42 AM",
      woke_up_at: "8:06 AM",
      quiet_time_display: "6h 50m",
    },
    rhythm_card: {
      title: "Sleep rhythm",
      status_label: "Estimated",
      available: true,
      active_filter: "light",
      points: fullRhythmPoints,
      time_labels: ["12:30 AM", "3 AM", "6 AM", "8:06 AM"],
    },
    trend_card: {
      title: "Last 7 nights",
      supporting_line: "You settled faster on 4 of the last 7 nights.",
      bars: [
        { night_id: "night_01", day_label: "Thu", height: 0.44, emphasis: "base" },
        { night_id: "night_02", day_label: "Fri", height: 0.6, emphasis: "highlight" },
        { night_id: "night_03", day_label: "Sat", height: 0.53, emphasis: "base" },
        { night_id: "night_04", day_label: "Sun", height: 0.78, emphasis: "highlight" },
        { night_id: "night_05", day_label: "Mon", height: 0.68, emphasis: "base" },
        { night_id: "night_06", day_label: "Tue", height: 0.58, emphasis: "base" },
        { night_id: "night_07", day_label: "Wed", height: 0.73, emphasis: "highlight" },
      ],
    },
    suggestion_card: {
      title: "Tonight's suggestion",
      body: "Moon Tide may help you keep that softer pace going tonight.",
      cta_label: "Use Moon Tide Tonight",
      target_route: "/room",
      target_payload: {
        continuation_source: "sleep",
        recommended_room_id: "moon_tide",
        recommended_room_name: "Moon Tide",
        recommendation_type: "room",
        sleep_context_label: "gentler pace",
      },
    },
    retry_available: false,
    last_updated_at: "2026-04-30T08:40:00+08:00",
  },
  partial_record: {
    user_id: "user_demo_night_01",
    page_state: "partial_record",
    record_confidence: "low",
    record_type: "partial",
    record_context_label: "Last night · Apr 30",
    hero_insight: {
      eyebrow: "From the last 3 nights",
      title: "Even with a shorter record, the quieter minutes still seemed to matter.",
      supporting_line: "A calmer opening looked easier to stay with.",
    },
    summary_card: {
      status_label: "Partial record",
      duration_display: "5h 18m",
      duration_label: "Estimated sleep",
      fell_asleep_at: "1:08 AM",
      woke_up_at: null,
      quiet_time_display: "42 min",
    },
    rhythm_card: {
      title: "Sleep rhythm",
      status_label: "Partial record",
      available: true,
      active_filter: "awake",
      points: partialRhythmPoints,
      time_labels: ["1 AM", "3 AM", "5 AM", "6:24 AM"],
    },
    trend_card: null,
    suggestion_card: {
      title: "Tonight's suggestion",
      body: "Alpine Quiet could give you a steadier place to start tonight.",
      cta_label: "Enter Alpine Quiet",
      target_route: "/room",
      target_payload: {
        continuation_source: "sleep",
        recommended_room_id: "alpine_quiet",
        recommended_room_name: "Alpine Quiet",
        recommendation_type: "room",
        sleep_context_label: "partial reflection",
      },
    },
    retry_available: false,
    last_updated_at: "2026-04-30T08:40:00+08:00",
  },
  companion_only: {
    user_id: "user_demo_night_01",
    page_state: "companion_only",
    record_confidence: "low",
    record_type: "companion_only",
    record_context_label: "Last night · Apr 30",
    hero_insight: {
      eyebrow: "From your last session",
      title: "Quiet company still seemed easier to stay with than pushing the night too fast.",
      supporting_line: "There wasn't enough signal to estimate sleep, but the calmer minutes still count.",
    },
    summary_card: {
      status_label: "Companion only",
      duration_label: "Companion session",
      companion_session_duration_display: "34 min",
      quiet_time_display: "26 min",
    },
    rhythm_card: null,
    trend_card: null,
    suggestion_card: {
      title: "Tonight's suggestion",
      body: "Harbor Hush could be a gentle place to continue with quiet company tonight.",
      cta_label: "Continue with Quiet Company",
      target_route: "/talk",
      target_payload: {
        continuation_source: "sleep",
        recommended_room_id: "harbor_hush",
        recommended_room_name: "Harbor Hush",
        recommendation_type: "talk",
        suggested_strategy: "quiet_company",
        sleep_context_label: "quiet company",
      },
    },
    retry_available: false,
    last_updated_at: "2026-04-30T08:40:00+08:00",
  },
  empty_state: {
    user_id: "user_demo_night_01",
    page_state: "empty_state",
    record_confidence: "low",
    record_type: "empty",
    record_context_label: "No reflection yet",
    hero_insight: null,
    summary_card: null,
    rhythm_card: null,
    trend_card: null,
    suggestion_card: {
      title: "Tonight can start gently",
      body: "Start a companion session tonight and your reflection will appear here tomorrow.",
      cta_label: "Start tonight",
      target_route: "/room",
      target_payload: {
        continuation_source: "sleep",
        recommended_room_id: "alpine_quiet",
        recommended_room_name: "Alpine Quiet",
        recommendation_type: "room",
        sleep_context_label: "first reflection",
      },
    },
    retry_available: false,
    last_updated_at: null,
  },
  error_state: {
    user_id: "user_demo_night_01",
    page_state: "error_state",
    record_confidence: "low",
    record_type: "empty",
    record_context_label: "Last night · Apr 30",
    hero_insight: null,
    summary_card: null,
    rhythm_card: null,
    trend_card: null,
    suggestion_card: null,
    retry_available: true,
    last_updated_at: null,
  },
};

export const sleepLoadingState: SleepPageData = {
  user_id: "user_demo_night_01",
  page_state: "loading",
  record_confidence: "low",
  record_type: "empty",
  record_context_label: "Loading last night",
  hero_insight: null,
  summary_card: null,
  rhythm_card: null,
  trend_card: null,
  suggestion_card: null,
  retry_available: false,
  last_updated_at: null,
};
