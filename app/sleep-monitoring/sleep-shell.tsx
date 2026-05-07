"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { roomConfigMap } from "@/app/room/room-config";
import { ShellTopNav } from "@/components/shell-top-nav";
import { sceneQueryParam, writeStoredSceneId } from "@/lib/scene-selection";
import { resolveRoomId, writeStoredRoomId } from "@/lib/room-selection";
import {
  fullRhythmPoints,
  partialRhythmPoints,
  sleepLoadingState,
  type SleepPageData,
} from "./sleep-page-data";
import type { SleepRoutine, SleepSession, UserSleepProfile } from "@/src/contracts/sleep";
import { createDefaultSleepCompanionSeed } from "@/src/mocks/createDefaultSleepCompanionSeed";
import {
  getCompanionProfile,
  getRoomState as getLocalRoomState,
  getSleepSessions,
  getUserProfile,
  setRoomState as setLocalRoomState,
  setSleepSessions,
} from "@/src/mocks/localSleepStore";
import styles from "./sleep-page.module.css";

const RHYTHM_FILTERS = [
  { key: "awake", label: "Awake" },
  { key: "light", label: "Light" },
  { key: "deep", label: "Deep" },
  { key: "dream", label: "Dream" },
] as const;

type RhythmFilterKey = (typeof RHYTHM_FILTERS)[number]["key"];
type RhythmPoint = {
  x: number;
  y: number;
  emphasis?: "base" | "highlight";
};

const CHART_WIDTH = 320;
const CHART_HEIGHT = 126;
const CHART_PADDING_X = 6;
const CHART_PADDING_Y = 10;
const INITIAL_LOADING_MS = 180;
const RETRY_LOADING_MS = 240;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildSmoothPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const deltaX = current.x - previous.x;
    const controlPointA = previous.x + deltaX / 3;
    const controlPointB = current.x - deltaX / 3;

    path += ` C ${controlPointA} ${previous.y}, ${controlPointB} ${current.y}, ${current.x} ${current.y}`;
  }

  return path;
}

function getRhythmPointsForFilter(
  points: RhythmPoint[],
  filter: RhythmFilterKey,
) {
  return points.map((point, index) => {
    const wave = Math.sin(point.x * Math.PI * 2.2 + index * 0.18);

    switch (filter) {
      case "awake":
        return {
          x: point.x,
          y: clamp(point.y - 0.08 + wave * 0.024, 0.18, 0.86),
        };
      case "deep":
        return {
          x: point.x,
          y: clamp(point.y + 0.12 - Math.abs(0.5 - point.x) * 0.06, 0.2, 0.88),
        };
      case "dream":
        return {
          x: point.x,
          y: clamp(point.y - wave * 0.05 - 0.02, 0.18, 0.84),
        };
      case "light":
      default:
        return {
          x: point.x,
          y: clamp(0.5 + (point.y - 0.5) * 0.9, 0.18, 0.86),
        };
    }
  });
}

function getChartCoordinates(points: Array<{ x: number; y: number }>) {
  return points.map((point) => ({
    x: CHART_PADDING_X + point.x * (CHART_WIDTH - CHART_PADDING_X * 2),
    y: CHART_PADDING_Y + point.y * (CHART_HEIGHT - CHART_PADDING_Y * 2),
  }));
}

function buildSleepHint(pageData: SleepPageData) {
  if (pageData.page_state === "partial_record") {
    return "We only have a partial reflection from last night.";
  }

  if (pageData.page_state === "companion_only") {
    return "There wasn't enough signal to estimate sleep, but your session is still saved.";
  }

  return null;
}

function formatDuration(minutes: number) {
  const safeMinutes = Math.max(1, minutes);
  const hours = Math.floor(safeMinutes / 60);
  const remainderMinutes = safeMinutes % 60;

  if (hours === 0) {
    return `${remainderMinutes}m`;
  }

  return `${hours}h ${remainderMinutes}m`;
}

function formatClock(isoValue: string | undefined) {
  if (!isoValue) {
    return null;
  }

  const date = new Date(isoValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatSessionContextLabel(isoValue: string) {
  const date = new Date(isoValue);

  if (Number.isNaN(date.getTime())) {
    return "Last sleep session";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function getSessionDurationMinutes(session: SleepSession) {
  const startedAt = Date.parse(session.startedAt);
  const endedAt = Date.parse(session.endedAt ?? new Date().toISOString());

  if (Number.isNaN(startedAt) || Number.isNaN(endedAt)) {
    return 0;
  }

  return Math.max(1, Math.round((endedAt - startedAt) / 60000));
}

function getDefaultRoutine(profile: UserSleepProfile): SleepRoutine {
  switch (profile.sleepGoal) {
    case "build_routine":
      return "breathing";
    case "reduce_anxiety":
      return "ambient";
    case "companionship":
      return "companion_chat";
    case "fall_asleep":
    default:
      return "story";
  }
}

function getDefaultMood(profile: UserSleepProfile): SleepSession["moodBefore"] {
  switch (profile.sleepGoal) {
    case "reduce_anxiety":
      return "anxious";
    case "build_routine":
      return "calm";
    case "companionship":
      return "restless";
    case "fall_asleep":
    default:
      return "tired";
  }
}

function getSuggestedRoomId(sleepGoal: UserSleepProfile["sleepGoal"]) {
  switch (sleepGoal) {
    case "reduce_anxiety":
      return "harbor_hush";
    case "build_routine":
      return "moon_tide";
    case "companionship":
      return "sea_light";
    case "fall_asleep":
    default:
      return "alpine_quiet";
  }
}

function buildTrendBars(completedSessions: SleepSession[]) {
  const sourceSessions = completedSessions.slice(0, 7).reverse();

  if (sourceSessions.length === 0) {
    return null;
  }

  const durations = sourceSessions.map(getSessionDurationMinutes);
  const maxDuration = Math.max(...durations, 1);

  return {
    title: "Last 7 nights" as const,
    supporting_line: "Your local sleep sessions are starting to form a calmer pattern.",
    bars: sourceSessions.map((session, index) => ({
      night_id: session.id,
      day_label: new Intl.DateTimeFormat("en-US", {
        weekday: "short",
      }).format(new Date(session.startedAt)),
      height: clamp(durations[index] / maxDuration, 0.24, 1),
      emphasis: index === sourceSessions.length - 1 ? ("highlight" as const) : ("base" as const),
    })),
  };
}

function buildLocalSleepPageData({
  sessions,
  userProfile,
  companionName,
}: {
  sessions: SleepSession[];
  userProfile: UserSleepProfile;
  companionName: string;
}): {
  activeSession: SleepSession | null;
  pageData: SleepPageData;
} {
  const sortedSessions = [...sessions].sort(
    (left, right) =>
      Date.parse(right.startedAt || "") - Date.parse(left.startedAt || ""),
  );
  const activeSession =
    sortedSessions.find((session) => session.status === "active") ?? null;
  const completedSessions = sortedSessions.filter(
    (session) => session.status === "completed" && session.endedAt,
  );
  const suggestedRoomId = getSuggestedRoomId(userProfile.sleepGoal);
  const suggestedRoomName = roomConfigMap[suggestedRoomId].title;

  if (activeSession) {
    const activeDuration = getSessionDurationMinutes(activeSession);

    return {
      activeSession,
      pageData: {
        user_id: userProfile.id,
        page_state: "companion_only",
        record_confidence: "low",
        record_type: "companion_only",
        record_context_label: "Tonight · Active now",
        hero_insight: {
          eyebrow: "Sleep mode is active",
          title: `${companionName} is keeping tonight slow and quiet.`,
          supporting_line: "End the session when you're ready to save a local reflection.",
        },
        summary_card: {
          status_label: "Companion only",
          duration_label: "Companion session",
          companion_session_duration_display: formatDuration(activeDuration),
          quiet_time_display: formatDuration(Math.max(1, activeDuration - 4)),
        },
        rhythm_card: null,
        trend_card: buildTrendBars(completedSessions),
        suggestion_card: {
          title: "Session in progress",
          body: "This mock sleep session is running locally on this device only.",
          cta_label: "End session",
          target_route: "/room",
        },
        retry_available: false,
        last_updated_at: activeSession.startedAt,
      },
    };
  }

  if (completedSessions.length === 0) {
    return {
      activeSession: null,
      pageData: {
        user_id: userProfile.id,
        page_state: "empty_state",
        record_confidence: "low",
        record_type: "empty",
        record_context_label: "No reflection yet",
        hero_insight: null,
        summary_card: null,
        rhythm_card: null,
        trend_card: null,
        suggestion_card: {
          title: "Sleep mode is ready",
          body: `Start a local session with ${companionName} tonight and your reflection will appear here afterward.`,
          cta_label: "Start sleep mode",
          target_route: "/room",
        },
        retry_available: false,
        last_updated_at: null,
      },
    };
  }

  const latestSession = completedSessions[0];
  const durationMinutes = getSessionDurationMinutes(latestSession);
  const isPartial = durationMinutes < 240;
  const recordContext = formatSessionContextLabel(latestSession.startedAt);
  const rhythmPoints = isPartial ? partialRhythmPoints : fullRhythmPoints;
  const pageState = isPartial ? "partial_record" : "full_record";
  const statusLabel = isPartial ? "Partial record" : "Estimated";

  return {
    activeSession: null,
    pageData: {
      user_id: userProfile.id,
      page_state: pageState,
      record_confidence: isPartial ? "low" : "medium",
      record_type: isPartial ? "partial" : "full",
      record_context_label: `Last session · ${recordContext}`,
      hero_insight: {
        eyebrow: "From your latest local session",
        title: isPartial
          ? `${companionName} still helped the night feel a little quieter.`
          : "Your sleep found a steadier rhythm after a softer start.",
        supporting_line: isPartial
          ? "Even a shorter wind-down can still leave a calmer trace."
          : "The last completed local session settled into a calmer pace.",
      },
      summary_card: {
        status_label: statusLabel,
        duration_display: formatDuration(durationMinutes),
        duration_label: "Estimated sleep",
        fell_asleep_at: formatClock(latestSession.startedAt),
        woke_up_at: formatClock(latestSession.endedAt),
        quiet_time_display: formatDuration(Math.max(1, durationMinutes - 18)),
      },
      rhythm_card: {
        title: "Sleep rhythm",
        status_label: statusLabel,
        available: true,
        active_filter: isPartial ? "awake" : "light",
        points: rhythmPoints,
        time_labels: [
          formatClock(latestSession.startedAt) ?? "Start",
          "2 AM",
          "4 AM",
          formatClock(latestSession.endedAt) ?? "End",
        ],
      },
      trend_card: buildTrendBars(completedSessions),
      suggestion_card: {
        title: "Tonight's suggestion",
        body: `${suggestedRoomName} may help you keep that quieter pace going tonight.`,
        cta_label: `Use ${suggestedRoomName} Tonight`,
        target_route: "/room",
        target_payload: {
          continuation_source: "sleep",
          recommended_room_id: suggestedRoomId,
          recommended_room_name: suggestedRoomName,
          recommendation_type: "room",
          sleep_context_label: userProfile.sleepGoal,
        },
      },
      retry_available: false,
      last_updated_at: latestSession.endedAt ?? latestSession.startedAt,
    },
  };
}

function DetailIcon({
  variant,
}: {
  variant: "sleep" | "wake" | "quiet";
}) {
  if (variant === "wake") {
    return (
      <svg viewBox="0 0 24 24" className={styles.detailIcon} aria-hidden="true">
        <path
          d="M6 13.2a6 6 0 1 0 12 0M12 4.8v2.1M18.4 7.2l-1.6 1.4M5.6 7.2l1.6 1.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === "quiet") {
    return (
      <svg viewBox="0 0 24 24" className={styles.detailIcon} aria-hidden="true">
        <path
          d="M8.2 10.1a3.8 3.8 0 1 1 6.6 2.7c-.8.9-1.3 1.4-1.3 2.3v.5M12 18.5h.01"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={styles.detailIcon} aria-hidden="true">
      <path
        d="M12 5.2a6.8 6.8 0 1 0 0 13.6 6.8 6.8 0 0 0 0-13.6Zm0 0v6.2l3.6 2.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SummaryCard({ pageData }: { pageData: SleepPageData }) {
  const summary = pageData.summary_card;

  if (!summary) {
    return null;
  }

  const stateHint = buildSleepHint(pageData);
  const primaryMetric =
    pageData.page_state === "companion_only"
      ? summary.companion_session_duration_display
      : summary.duration_display;
  const primaryLabel =
    pageData.page_state === "companion_only"
      ? "Companion session"
      : summary.duration_label;
  const rows = [
    summary.fell_asleep_at
      ? { label: "Fell asleep", value: summary.fell_asleep_at, icon: "sleep" as const }
      : null,
    summary.woke_up_at
      ? { label: "Woke up", value: summary.woke_up_at, icon: "wake" as const }
      : null,
    summary.quiet_time_display
      ? { label: "Quiet time", value: summary.quiet_time_display, icon: "quiet" as const }
      : null,
  ].filter(Boolean) as Array<{
    label: string;
    value: string;
    icon: "sleep" | "wake" | "quiet";
  }>;

  return (
    <section className={styles.cardLarge}>
      <div className={styles.cardAccent} aria-hidden="true" />
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardEyebrow}>Last night</p>
          {summary.status_label ? (
            <span className={styles.inlinePill}>{summary.status_label}</span>
          ) : null}
        </div>
      </div>

      {primaryMetric ? <p className={styles.primaryMetric}>{primaryMetric}</p> : null}
      {primaryLabel ? <p className={styles.metricLabel}>{primaryLabel}</p> : null}

      {stateHint ? <p className={styles.inlineSupport}>{stateHint}</p> : null}

      {rows.length > 0 ? (
        <div className={styles.detailList}>
          {rows.map((row) => (
            <div key={row.label} className={styles.detailRow}>
              <span className={styles.detailIconCircle}>
                <DetailIcon variant={row.icon} />
              </span>
              <span className={styles.detailLabel}>{row.label}</span>
              <span className={styles.detailValue}>{row.value}</span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function RhythmCard({
  pageData,
  activeFilter,
  onFilterChange,
}: {
  pageData: SleepPageData;
  activeFilter: RhythmFilterKey;
  onFilterChange: (filter: RhythmFilterKey) => void;
}) {
  const rhythm = pageData.rhythm_card;

  if (!rhythm || !rhythm.available) {
    return null;
  }

  const filteredPoints = getRhythmPointsForFilter(rhythm.points, activeFilter);
  const coordinates = getChartCoordinates(filteredPoints);
  const chartPath = buildSmoothPath(coordinates);

  return (
    <section className={styles.cardLarge}>
      <div className={styles.cardHeader}>
        <div>
          <p className={styles.cardTitle}>Sleep rhythm</p>
          {rhythm.status_label ? (
            <span className={styles.inlinePill}>{rhythm.status_label}</span>
          ) : null}
        </div>
      </div>

      <div className={styles.chartWrap}>
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className={styles.chart}
          role="img"
          aria-label="Sleep rhythm line"
        >
          {[0.22, 0.5, 0.78].map((offset) => (
            <line
              key={offset}
              x1={0}
              x2={CHART_WIDTH}
              y1={offset * CHART_HEIGHT}
              y2={offset * CHART_HEIGHT}
              className={styles.chartGuide}
            />
          ))}
          <path d={chartPath} className={styles.chartGlowPath} />
          <path d={chartPath} className={styles.chartPath} />
          {coordinates.map((point, index) => (
            <circle
              key={`${point.x}-${point.y}-${index}`}
              cx={point.x}
              cy={point.y}
              r={rhythm.points[index]?.emphasis === "highlight" ? 2.2 : 1.7}
              className={styles.chartPoint}
            />
          ))}
        </svg>

        <div className={styles.timeLabelRow} aria-hidden="true">
          {rhythm.time_labels.map((label) => (
            <span key={label} className={styles.timeLabel}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.chipRow}>
        {RHYTHM_FILTERS.map((filter) => {
          const isActive = filter.key === activeFilter;

          return (
            <button
              key={filter.key}
              type="button"
              className={[
                styles.filterChip,
                isActive ? styles.filterChipActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                onFilterChange(filter.key);
              }}
            >
              <span className={styles.filterDot} aria-hidden="true" />
              {filter.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TrendCard({ pageData }: { pageData: SleepPageData }) {
  const trend = pageData.trend_card;

  if (!trend) {
    return null;
  }

  return (
    <section className={styles.cardMedium}>
      <div className={styles.cardHeader}>
        <p className={styles.cardTitle}>{trend.title}</p>
      </div>
      <p className={styles.trendSupport}>{trend.supporting_line}</p>
      <div className={styles.barChart}>
        {trend.bars.map((bar) => (
          <div key={bar.night_id} className={styles.barColumn}>
            <div
              className={[
                styles.barValue,
                bar.emphasis === "highlight" ? styles.barValueHighlight : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{ height: `${Math.round(bar.height * 100)}%` }}
            />
            <span className={styles.barLabel}>{bar.day_label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SuggestionCard({
  suggestion,
  onAction,
}: {
  suggestion: NonNullable<SleepPageData["suggestion_card"]>;
  onAction: (suggestion: NonNullable<SleepPageData["suggestion_card"]>) => void;
}) {
  return (
    <section className={styles.cardMedium}>
      <div className={styles.cardHeader}>
        <p className={styles.cardTitle}>{suggestion.title}</p>
      </div>
      <p className={styles.suggestionBody}>{suggestion.body}</p>
      <button
        type="button"
        className={styles.primaryCta}
        onClick={() => {
          onAction(suggestion);
        }}
      >
        {suggestion.cta_label}
      </button>
    </section>
  );
}

function EmptyStateCard({
  suggestion,
  onAction,
}: {
  suggestion: NonNullable<SleepPageData["suggestion_card"]>;
  onAction: (suggestion: NonNullable<SleepPageData["suggestion_card"]>) => void;
}) {
  return (
    <section className={styles.cardLarge}>
      <div className={styles.emptyGlow} aria-hidden="true" />
      <span className={styles.inlinePill}>No sleep record yet</span>
      <p className={styles.emptyTitle}>Tonight can start softly here.</p>
      <p className={styles.emptyBody}>{suggestion.body}</p>
      <button
        type="button"
        className={styles.primaryCta}
        onClick={() => {
          onAction(suggestion);
        }}
      >
        {suggestion.cta_label}
      </button>
    </section>
  );
}

function ErrorStateCard({
  onRetry,
  onStartTonight,
  retryAvailable,
}: {
  onRetry: () => void;
  onStartTonight: () => void;
  retryAvailable: boolean;
}) {
  return (
    <section className={[styles.cardLarge, styles.errorCard].join(" ")}>
      <span className={styles.errorPill}>Reflection unavailable</span>
      <p className={styles.errorTitle}>
        We couldn&rsquo;t finish last night&rsquo;s reflection yet.
      </p>
      <p className={styles.errorBody}>
        Your companion session is still saved. You can try again now or head back
        into tonight&rsquo;s flow.
      </p>
      <button
        type="button"
        className={styles.primaryCta}
        onClick={() => {
          if (retryAvailable) {
            onRetry();
            return;
          }

          onStartTonight();
        }}
      >
        {retryAvailable ? "Retry" : "Start tonight"}
      </button>
    </section>
  );
}

function LoadingState() {
  return (
    <>
      <section className={styles.heroBlock}>
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className={[styles.skeletonLine, styles.skeletonShort].join(" ")} />
        <div className={[styles.skeletonLine, styles.skeletonHero].join(" ")} />
        <div className={[styles.skeletonLine, styles.skeletonHeroMedium].join(" ")} />
      </section>
      <section className={styles.cardLarge}>
        <div className={[styles.skeletonLine, styles.skeletonHeader].join(" ")} />
        <div className={[styles.skeletonLine, styles.skeletonMetric].join(" ")} />
        <div className={[styles.skeletonLine, styles.skeletonSupport].join(" ")} />
        <div className={styles.skeletonDetailList}>
          <div className={styles.skeletonDetailRow} />
          <div className={styles.skeletonDetailRow} />
          <div className={styles.skeletonDetailRow} />
        </div>
      </section>
      <section className={styles.cardLarge}>
        <div className={[styles.skeletonLine, styles.skeletonHeader].join(" ")} />
        <div className={styles.skeletonChart} />
        <div className={styles.skeletonChipRow}>
          <span className={styles.skeletonChip} />
          <span className={styles.skeletonChip} />
          <span className={styles.skeletonChip} />
          <span className={styles.skeletonChip} />
        </div>
      </section>
    </>
  );
}

export function SleepShell() {
  const router = useRouter();
  const [activeFilterOverride, setActiveFilterOverride] =
    useState<RhythmFilterKey | null>(null);
  const [pageData, setPageData] = useState<SleepPageData>(sleepLoadingState);
  const [activeSession, setActiveSession] = useState<SleepSession | null>(null);
  const activeFilter =
    activeFilterOverride ?? pageData.rhythm_card?.active_filter ?? "light";
  const suggestion = pageData.suggestion_card;
  const showHero =
    pageData.page_state !== "loading" &&
    pageData.page_state !== "empty_state" &&
    pageData.page_state !== "error_state" &&
    pageData.hero_insight;
  const showSummary =
    pageData.page_state === "full_record" ||
    pageData.page_state === "partial_record" ||
    pageData.page_state === "companion_only";
  const showRhythm =
    pageData.page_state === "full_record" ||
    pageData.page_state === "partial_record";
  const showTrend = Boolean(pageData.trend_card);
  const showSuggestion =
    Boolean(suggestion) &&
    pageData.page_state !== "empty_state" &&
    !(pageData.page_state === "error_state" && pageData.retry_available);

  const refreshSleepView = () => {
    const fallbackSeed = createDefaultSleepCompanionSeed();
    const userProfile = getUserProfile() ?? fallbackSeed.userProfile;
    const companionProfile =
      getCompanionProfile() ?? fallbackSeed.companionProfile;
    const nextView = buildLocalSleepPageData({
      sessions: getSleepSessions(),
      userProfile,
      companionName: companionProfile.name,
    });

    setPageData(nextView.pageData);
    setActiveSession(nextView.activeSession);
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      refreshSleepView();
    }, INITIAL_LOADING_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const handleSuggestionAction = (
    nextSuggestion: NonNullable<SleepPageData["suggestion_card"]>,
  ) => {
    if (activeSession) {
      const nowIso = new Date().toISOString();
      const nextSessions = getSleepSessions().map((session) =>
        session.id === activeSession.id
          ? {
              ...session,
              endedAt: nowIso,
              status: "completed" as const,
            }
          : session,
      );
      const currentRoomState = getLocalRoomState();

      setSleepSessions(nextSessions);

      if (currentRoomState) {
        setLocalRoomState({
          ...currentRoomState,
          companionMood: "calm",
          currentPhase: "pre_sleep",
          suggestedAction: "review_memory",
          lastUpdatedAt: nowIso,
        });
      }

      refreshSleepView();
      return;
    }

    if (pageData.page_state === "empty_state") {
      const fallbackSeed = createDefaultSleepCompanionSeed();
      const userProfile = getUserProfile() ?? fallbackSeed.userProfile;
      const nowIso = new Date().toISOString();
      const nextSession: SleepSession = {
        id: `sleep_session_${Date.now()}`,
        startedAt: nowIso,
        moodBefore: getDefaultMood(userProfile),
        selectedRoutine: getDefaultRoutine(userProfile),
        status: "active",
      };
      const currentRoomState = getLocalRoomState() ?? fallbackSeed.roomState;

      setSleepSessions([...getSleepSessions(), nextSession]);
      setLocalRoomState({
        ...currentRoomState,
        companionMood: "sleepy",
        currentPhase: "sleep",
        suggestedAction: "start_sleep",
        lastUpdatedAt: nowIso,
      });
      refreshSleepView();
      return;
    }

    const roomId = resolveRoomId(nextSuggestion.target_payload?.recommended_room_id);

    if (roomId) {
      writeStoredRoomId(roomId);
    }

    if (nextSuggestion.target_route === "/room") {
      startTransition(() => {
        router.push("/room");
      });
      return;
    }

    if (nextSuggestion.target_route === "/talk") {
      const room = roomId ? roomConfigMap[roomId] : null;

      if (room) {
        writeStoredSceneId(room.talkSceneId);
        startTransition(() => {
          router.push(`/talk?${sceneQueryParam}=${room.talkSceneId}`);
        });
        return;
      }

      startTransition(() => {
        router.push("/talk");
      });
      return;
    }

    startTransition(() => {
      router.push("/room");
    });
  };

  const handleRetry = () => {
    setPageData(sleepLoadingState);
    setActiveSession(null);
    setActiveFilterOverride(null);

    window.setTimeout(() => {
      refreshSleepView();
    }, RETRY_LOADING_MS);
  };

  const handleStartTonight = () => {
    startTransition(() => {
      router.push("/room");
    });
  };

  return (
    <section className={styles.page}>
      <div className={styles.backdropBase} aria-hidden="true" />
      <div className={styles.backdropHaze} aria-hidden="true" />
      <div className={styles.backdropWarmth} aria-hidden="true" />
      <div className={styles.backdropNoise} aria-hidden="true" />
      <div className={styles.backdropVignette} aria-hidden="true" />

      <header className={styles.topBand}>
        <ShellTopNav tone="memory" />
      </header>

      <main className={styles.scrollContent}>
        <div className={styles.contentColumn}>
          {pageData.page_state === "loading" ? (
            <LoadingState />
          ) : (
            <>
              {showHero ? (
                <section className={styles.heroBlock}>
                  <div className={styles.heroGlow} aria-hidden="true" />
                  <p className={styles.contextLine}>{pageData.record_context_label}</p>
                  <p className={styles.heroEyebrow}>{pageData.hero_insight?.eyebrow}</p>
                  <h2 className={styles.heroTitle}>
                    {pageData.hero_insight?.title.split("\n").map((line, index, lines) => (
                      <span key={`${line}-${index}`}>
                        {line}
                        {index < lines.length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </h2>
                  {pageData.hero_insight?.supporting_line ? (
                    <p className={styles.heroSupport}>
                      {pageData.hero_insight.supporting_line}
                    </p>
                  ) : null}
                </section>
              ) : null}

              {!showHero ? (
                <p className={styles.contextLineStandalone}>
                  {pageData.record_context_label}
                </p>
              ) : null}

              {showSummary ? <SummaryCard pageData={pageData} /> : null}

              {showRhythm ? (
                <RhythmCard
                  pageData={pageData}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilterOverride}
                />
              ) : null}

              {showTrend ? <TrendCard pageData={pageData} /> : null}

              {pageData.page_state === "empty_state" && suggestion ? (
                <EmptyStateCard
                  suggestion={suggestion}
                  onAction={handleSuggestionAction}
                />
              ) : null}

              {pageData.page_state === "error_state" ? (
                <ErrorStateCard
                  retryAvailable={pageData.retry_available}
                  onRetry={handleRetry}
                  onStartTonight={handleStartTonight}
                />
              ) : null}

              {showSuggestion && suggestion ? (
                <SuggestionCard
                  suggestion={suggestion}
                  onAction={handleSuggestionAction}
                />
              ) : null}
            </>
          )}
        </div>
      </main>
    </section>
  );
}
