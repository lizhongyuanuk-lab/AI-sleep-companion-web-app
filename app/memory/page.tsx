"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShellTopNav } from "@/components/shell-top-nav";
import type { MemoryFeedbackAction } from "@/src/contracts";
import {
  applyMemoryExperienceFeedback,
  buildMemoryExperience,
} from "@/src/experience";
import {
  appendLocalMemoryFeedback,
  readLocalMemoryFeedback,
  readLocalMemoryItems,
  writeLocalMemoryItems,
} from "@/src/local-data";
import { memoryPageMockData, type MemoryPageData } from "./memory-page-data";
import styles from "./memory-page.module.css";

type RecurringTopic = MemoryPageData["recurring_topics"][number];

type RecurringMemoryDetail = {
  seenWhen: string;
  appearedIn: string;
  patternNote: string;
};

const recurringMemoryDetails: Record<string, RecurringMemoryDetail> = {
  memory_topic_unfinished_evenings: {
    seenWhen: "Most often after 10:30 PM",
    appearedIn: "Seen in 3 of the last 7 nights",
    patternNote: "More likely when your mind is still switching off",
  },
  memory_topic_sleep_entry_pressure: {
    seenWhen: "Usually near the start of the night",
    appearedIn: "Seen in 4 of the last 7 nights",
    patternNote: "More common when the first minutes feel pressured",
  },
  memory_topic_quiet_company: {
    seenWhen: "Most often once the room feels settled",
    appearedIn: "Seen across the last few sessions",
    patternNote: "More common when the tone stays calm and unhurried",
  },
  memory_topic_softer_openings: {
    seenWhen: "Most visible in the first few exchanges",
    appearedIn: "Seen in 3 recent sessions",
    patternNote: "A gentler opening lowers the pressure to explain everything",
  },
  memory_topic_quieter_room_returns: {
    seenWhen: "More often on lower-stimulation nights",
    appearedIn: "Seen in 2 recent nights",
    patternNote: "Quieter room energy seems to make returning feel easier",
  },
  memory_topic_briefer_loops: {
    seenWhen: "Often after shorter nightly check-ins",
    appearedIn: "Seen in 3 recent nights",
    patternNote: "Brief loops seem easier to carry into the following night",
  },
};

function ExpandableRecurringItem({
  topic,
  detail,
  expanded,
  selectedFeedback,
  onToggle,
  onFeedback,
}: {
  topic: RecurringTopic;
  detail: RecurringMemoryDetail;
  expanded: boolean;
  selectedFeedback?: MemoryFeedbackAction;
  onToggle: () => void;
  onFeedback: (id: string, action: MemoryFeedbackAction) => void;
}) {
  return (
    <article className={styles.recurringMemoryItem}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        className={[
          styles.recurringMemoryButton,
          expanded ? styles.recurringMemoryButtonExpanded : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onToggle();
          }
        }}
      >
        <div className={styles.recurringMemoryContent}>
          <div className={styles.recurringMemorySummary}>
            <h2 className={styles.recurringTitle}>{topic.title}</h2>
            {topic.continuationHint ? (
              <p className={styles.recurringSupport}>{topic.continuationHint}</p>
            ) : null}
          </div>

          {expanded ? (
            <div className={styles.recurringMemoryDetails} aria-live="polite">
              <div className={styles.recurringMemoryDetailGroup}>
                <p className={styles.recurringMemoryDetailLabel}>Seen when</p>
                <p className={styles.recurringMemoryDetailValue}>
                  {detail.seenWhen}
                </p>
              </div>
              <div className={styles.recurringMemoryDetailGroup}>
                <p className={styles.recurringMemoryDetailLabel}>Appeared in</p>
                <p className={styles.recurringMemoryDetailValue}>
                  {detail.appearedIn}
                </p>
              </div>
              <div className={styles.recurringMemoryDetailGroup}>
                <p className={styles.recurringMemoryDetailLabel}>Pattern note</p>
                <p className={styles.recurringMemoryDetailValue}>
                  {detail.patternNote}
                </p>
              </div>

              <div className={styles.recurringMemoryActions}>
                <button
                  type="button"
                  className={[
                    styles.recurringMemoryAction,
                    selectedFeedback === "agree"
                      ? styles.recurringMemoryActionSelected
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={(event) => {
                    event.stopPropagation();
                    onFeedback(topic.id, "agree");
                  }}
                >
                  {selectedFeedback === "agree" ? "Agreed" : "Agree"}
                </button>
                <button
                  type="button"
                  className={[
                    styles.recurringMemoryAction,
                    selectedFeedback === "disagree"
                      ? styles.recurringMemoryActionSelected
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={(event) => {
                    event.stopPropagation();
                    onFeedback(topic.id, "disagree");
                  }}
                >
                  {selectedFeedback === "disagree" ? "Disagreed" : "Disagree"}
                </button>
                <button
                  type="button"
                  className={[
                    styles.recurringMemoryAction,
                    styles.recurringMemoryActionQuiet,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={(event) => {
                    event.stopPropagation();
                    onFeedback(topic.id, "hide");
                  }}
                >
                  Hide
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function MemoryPage() {
  const data = memoryPageMockData;
  const [topics, setTopics] = useState(data.recurring_topics);
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [showAllMemories, setShowAllMemories] = useState(false);
  const [feedbackByTopic, setFeedbackByTopic] = useState<
    Record<string, MemoryFeedbackAction>
  >({});
  const memoryExperience = buildMemoryExperience({ memories: topics });
  const visibleThemeIds = new Set(
    memoryExperience.visibleMemories.map((memory) => memory.id),
  );
  const displayedThemes = topics.filter((topic) => visibleThemeIds.has(topic.id));
  const visibleThemes = showAllMemories
    ? displayedThemes
    : displayedThemes.slice(0, 3);
  const hasMoreThemes = displayedThemes.length > 3;
  const displayedActions = data.continue_actions
    .filter((action) => {
      const memoryId = action.target_payload?.selected_memory_item_id;
      return !memoryId || visibleThemeIds.has(memoryId);
    })
    .slice(0, 3);

  useEffect(() => {
    const persistedMemories =
      readLocalMemoryItems() as MemoryPageData["recurring_topics"];
    const persistedFeedback = readLocalMemoryFeedback();

    if (persistedMemories.length > 0) {
      setTopics(persistedMemories);
    }

    if (persistedFeedback.length > 0) {
      setFeedbackByTopic(
        persistedFeedback.reduce<Record<string, MemoryFeedbackAction>>(
          (feedbackMap, feedback) => ({
            ...feedbackMap,
            [feedback.memoryItemId]: feedback.action,
          }),
          {},
        ),
      );
    }
  }, []);

  const handleFeedback = (
    memoryId: string,
    action: MemoryFeedbackAction,
  ) => {
    const now = new Date().toISOString();
    const selectedTopic = topics.find((topic) => topic.id === memoryId);

    if (!selectedTopic) {
      return;
    }

    const result = applyMemoryExperienceFeedback({
      memory: selectedTopic,
      action,
      now,
      feedbackId: `memory_feedback_local_${memoryId}_${Date.now()}`,
    });
    const nextTopics = topics.map((topic) =>
      topic.id === memoryId
        ? {
            ...topic,
            ...result.memory,
          }
        : topic,
    );

    setTopics(nextTopics);
    writeLocalMemoryItems(nextTopics);
    appendLocalMemoryFeedback(result.feedback);
    setFeedbackByTopic((current) => ({
      ...current,
      [memoryId]: action,
    }));

    if (action === "hide") {
      setExpandedTopicId((current) => (current === memoryId ? null : current));
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.backdropBase} aria-hidden="true" />
        <div className={styles.backdropHaze} aria-hidden="true" />
        <div className={styles.backdropVignette} aria-hidden="true" />

        <header className={styles.topBand}>
          <ShellTopNav tone="memory" />
        </header>

        <main className={styles.scrollContent}>
          <div className={styles.contentColumn}>
            {data.memory_page_available && data.recent_memory_summary ? (
              <>
                <section className={styles.heroBlock}>
                  <div className={styles.heroGlow} aria-hidden="true" />
                  <p className={styles.contextLine}>
                    {data.recent_memory_summary.time_window_label}
                  </p>
                  <h1 className={styles.heroInsight}>
                    {data.recent_memory_summary.headline_summary}
                  </h1>
                  {data.recent_memory_summary.supporting_line ? (
                    <p className={styles.heroSupport}>
                      {data.recent_memory_summary.supporting_line}
                    </p>
                  ) : null}
                </section>

                {displayedThemes.length > 0 ? (
                  <section className={styles.recurringList}>
                    {visibleThemes.map((topic) => {
                      const detail =
                        recurringMemoryDetails[topic.id] ?? {
                          seenWhen: "Seen in a recent evening check-in",
                          appearedIn: `Seen in ${topic.supportingSessionCount} recent sessions`,
                          patternNote: "This memory keeps returning gently over time",
                        };

                      return (
                        <ExpandableRecurringItem
                          key={topic.id}
                          topic={topic}
                          detail={detail}
                          expanded={expandedTopicId === topic.id}
                          selectedFeedback={feedbackByTopic[topic.id]}
                          onToggle={() => {
                            setExpandedTopicId((current) =>
                              current === topic.id ? null : topic.id,
                            );
                          }}
                          onFeedback={handleFeedback}
                        />
                      );
                    })}

                    {hasMoreThemes ? (
                      <div className={styles.viewAllRow}>
                        <button
                          type="button"
                          className={styles.viewAllButton}
                          onClick={() => {
                            setShowAllMemories((current) => {
                              const next = !current;

                              if (!next) {
                                const firstVisibleIds = displayedThemes
                                  .slice(0, 3)
                                  .map((topic) => topic.id);

                                setExpandedTopicId((expandedId) =>
                                  expandedId && !firstVisibleIds.includes(expandedId)
                                    ? null
                                    : expandedId,
                                );
                              }

                              return next;
                            });
                          }}
                        >
                          {showAllMemories ? "Show less" : "View all memories"}
                        </button>
                      </div>
                    ) : null}
                  </section>
                ) : null}
              </>
            ) : (
              <section className={styles.emptyState}>
                <p className={styles.emptyLead}>
                  Memory builds gently through the conversations you return to.
                </p>
                <p className={styles.emptySupport}>
                  Talk is still the best place to start softly tonight.
                </p>
              </section>
            )}

            {displayedActions.length > 0 ? (
              <section className={styles.actionsArea}>
                {displayedActions.map((action) => (
                  <Link
                    key={action.action_id}
                    href={action.target_route}
                    className={styles.actionLink}
                  >
                    {action.label}
                  </Link>
                ))}
              </section>
            ) : null}
          </div>
        </main>
      </div>
    </section>
  );
}
