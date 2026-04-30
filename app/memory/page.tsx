"use client";

import Link from "next/link";
import { useState } from "react";
import { ShellTopNav } from "@/components/shell-top-nav";
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
  agreed,
  canDelete,
  onToggle,
  onAgree,
  onDelete,
}: {
  topic: RecurringTopic;
  detail: RecurringMemoryDetail;
  expanded: boolean;
  agreed?: boolean;
  canDelete?: boolean;
  onToggle: () => void;
  onAgree: (id: string) => void;
  onDelete: (id: string) => void;
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
            <h2 className={styles.recurringTitle}>{topic.display_text}</h2>
            {topic.continuation_hint ? (
              <p className={styles.recurringSupport}>{topic.continuation_hint}</p>
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
                    agreed ? styles.recurringMemoryActionSelected : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={(event) => {
                    event.stopPropagation();
                    onAgree(topic.memory_id);
                  }}
                >
                  {agreed ? "Agreed" : "Agree"}
                </button>
                {canDelete ? (
                  <button
                    type="button"
                    className={[
                      styles.recurringMemoryAction,
                      styles.recurringMemoryActionDestructive,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(topic.memory_id);
                    }}
                  >
                    Delete
                  </button>
                ) : null}
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
  const [agreedTopics, setAgreedTopics] = useState<Record<string, boolean>>({});
  const displayedThemes = topics.filter((topic) => !topic.is_deleted);
  const visibleThemes = showAllMemories
    ? displayedThemes
    : displayedThemes.slice(0, 3);
  const hasMoreThemes = displayedThemes.length > 3;
  const displayedActions = data.continue_actions.slice(0, 3);

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
                        recurringMemoryDetails[topic.memory_id] ?? {
                          seenWhen: "Seen in a recent evening check-in",
                          appearedIn: `Seen in ${topic.supporting_session_count} recent sessions`,
                          patternNote: "This memory keeps returning gently over time",
                        };

                      return (
                        <ExpandableRecurringItem
                          key={topic.memory_id}
                          topic={topic}
                          detail={detail}
                          expanded={expandedTopicId === topic.memory_id}
                          agreed={Boolean(agreedTopics[topic.memory_id])}
                          canDelete={data.memory_delete_capability}
                          onToggle={() => {
                            setExpandedTopicId((current) =>
                              current === topic.memory_id ? null : topic.memory_id,
                            );
                          }}
                          onAgree={(memoryId) => {
                            setAgreedTopics((current) => ({
                              ...current,
                              [memoryId]: !current[memoryId],
                            }));
                          }}
                          onDelete={(memoryId) => {
                            setTopics((current) =>
                              current.map((currentTopic) =>
                                currentTopic.memory_id === memoryId
                                  ? { ...currentTopic, is_deleted: true }
                                  : currentTopic,
                              ),
                            );
                            setExpandedTopicId((current) =>
                              current === memoryId ? null : current,
                            );
                          }}
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
                                  .map((topic) => topic.memory_id);

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
