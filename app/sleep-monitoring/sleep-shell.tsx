"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { roomConfigMap } from "@/app/room/room-config";
import { ShellTopNav } from "@/components/shell-top-nav";
import { sceneQueryParam, writeStoredSceneId } from "@/lib/scene-selection";
import { resolveRoomId, writeStoredRoomId } from "@/lib/room-selection";
import {
  defaultSleepMockCase,
  sleepLoadingState,
  sleepMockCases,
  type SleepMockCaseKey,
  type SleepPageData,
} from "./sleep-page-data";
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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" className={styles.ctaIcon} aria-hidden="true">
      <path
        d="M4.5 10h9m0 0-3.3-3.3M13.5 10l-3.3 3.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RetryIcon() {
  return (
    <svg viewBox="0 0 20 20" className={styles.ctaIcon} aria-hidden="true">
      <path
        d="M15.1 7.4A5.8 5.8 0 0 0 4.6 9.7m.3 3A5.8 5.8 0 0 0 15.4 10M4.6 9.7V5.6m0 4.1h4.1M15.4 10h-4.1m4.1 0v4.1"
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
        <span>{suggestion.cta_label}</span>
        <ArrowIcon />
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
        <span>{suggestion.cta_label}</span>
        <ArrowIcon />
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
        <span>{retryAvailable ? "Retry" : "Start tonight"}</span>
        {retryAvailable ? <RetryIcon /> : <ArrowIcon />}
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
  const [activeMockKey, setActiveMockKey] =
    useState<SleepMockCaseKey>(defaultSleepMockCase);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilterOverride, setActiveFilterOverride] =
    useState<RhythmFilterKey | null>(null);

  const pageData = isLoading ? sleepLoadingState : sleepMockCases[activeMockKey];
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

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false);
    }, INITIAL_LOADING_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const handleSuggestionAction = (
    nextSuggestion: NonNullable<SleepPageData["suggestion_card"]>,
  ) => {
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
    setIsLoading(true);
    setActiveFilterOverride(null);

    window.setTimeout(() => {
      setActiveMockKey(defaultSleepMockCase);
      setIsLoading(false);
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
