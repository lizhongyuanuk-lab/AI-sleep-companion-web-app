"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ShellTopNav } from "@/components/shell-top-nav";
import { memoryPageMockData, type MemoryPageData } from "./memory-page-data";
import styles from "./memory-page.module.css";

const ACTION_RESTING_OFFSET = 32;
const ACTION_DRAG_LIMIT = 44;

type SwipeDirection = "left" | "right";
type OpenSwipeState =
  | {
      id: string;
      direction: SwipeDirection;
    }
  | null;

type RecurringTopic = MemoryPageData["recurring_topics"][number];

function clampOffset(value: number) {
  return Math.max(-ACTION_DRAG_LIMIT, Math.min(ACTION_DRAG_LIMIT, value));
}

function SwipeableRecurringItem({
  topic,
  openSwipe,
  agreed,
  onOpenChange,
  onDelete,
  onAgree,
}: {
  topic: RecurringTopic;
  openSwipe: OpenSwipeState;
  agreed?: boolean;
  onOpenChange: (next: OpenSwipeState) => void;
  onDelete: (id: string) => void;
  onAgree: (id: string) => void;
}) {
  const dragStateRef = useRef<{
    active: boolean;
    locked: boolean;
    pointerId: number | null;
    startX: number;
    startY: number;
    baseOffset: number;
  } | null>(null);
  const [dragOffset, setDragOffset] = useState<number | null>(null);

  const isOpen = openSwipe?.id === topic.memory_id;
  const restingOffset = isOpen
    ? openSwipe.direction === "right"
      ? ACTION_RESTING_OFFSET
      : -ACTION_RESTING_OFFSET
    : 0;
  const currentOffset = dragOffset ?? restingOffset;
  const activeDirection =
    currentOffset < -2 ? "left" : currentOffset > 2 ? "right" : null;
  const dragging = dragOffset !== null;

  const finishSwipe = () => {
    const nextOffset = dragOffset ?? restingOffset;

    if (nextOffset <= -18) {
      onOpenChange({ id: topic.memory_id, direction: "left" });
    } else if (nextOffset >= 18) {
      onOpenChange({ id: topic.memory_id, direction: "right" });
    } else {
      onOpenChange(null);
    }

    setDragOffset(null);
    dragStateRef.current = null;
  };

  return (
    <article
      className={[
        styles.recurringSwipeRow,
        activeDirection === "left" ? styles.recurringSwipeRowRevealLeft : "",
        activeDirection === "right" ? styles.recurringSwipeRowRevealRight : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onPointerDown={(event) => {
        if (event.pointerType === "mouse" && event.button !== 0) {
          return;
        }

        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        dragStateRef.current = {
          active: true,
          locked: false,
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          baseOffset: isOpen ? restingOffset : 0,
        };

        if (openSwipe && openSwipe.id !== topic.memory_id) {
          onOpenChange(null);
        }
      }}
      onPointerMove={(event) => {
        const state = dragStateRef.current;

        if (!state?.active || state.pointerId !== event.pointerId) {
          return;
        }

        const deltaX = event.clientX - state.startX;
        const deltaY = event.clientY - state.startY;

        if (!state.locked) {
          if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) {
            return;
          }

          if (Math.abs(deltaY) > Math.abs(deltaX)) {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }

            dragStateRef.current = null;
            setDragOffset(null);
            return;
          }

          state.locked = true;
        }

        setDragOffset(clampOffset(state.baseOffset + deltaX));
      }}
      onPointerUp={(event) => {
        const state = dragStateRef.current;

        if (!state?.active || state.pointerId !== event.pointerId) {
          return;
        }

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }

        finishSwipe();
      }}
      onPointerCancel={(event) => {
        const state = dragStateRef.current;

        if (!state?.active || state.pointerId !== event.pointerId) {
          return;
        }

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }

        setDragOffset(null);
        dragStateRef.current = null;
      }}
    >
      <div
        className={styles.rowActionsLeft}
        aria-hidden={activeDirection !== "left"}
      >
        <button
          type="button"
          className={[
            styles.rowActionButton,
            styles.rowActionDestructive,
          ]
            .filter(Boolean)
            .join(" ")}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => {
            onDelete(topic.memory_id);
            onOpenChange(null);
          }}
        >
          Delete
        </button>
      </div>

      <div
        className={styles.rowActionsRight}
        aria-hidden={activeDirection !== "right"}
      >
        <button
          type="button"
          className={[
            styles.rowActionButton,
            styles.rowActionPositive,
            agreed ? styles.rowActionSelected : "",
          ]
            .filter(Boolean)
            .join(" ")}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={() => {
            onAgree(topic.memory_id);
            onOpenChange(null);
          }}
        >
          Agree
        </button>
      </div>

      <div
        className={[
          styles.recurringItem,
          dragging ? styles.recurringItemDragging : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          transform: `translateX(${currentOffset}px)`,
        }}
      >
        <h2 className={styles.recurringTitle}>{topic.display_text}</h2>
        {topic.continuation_hint ? (
          <p className={styles.recurringSupport}>{topic.continuation_hint}</p>
        ) : null}
      </div>
    </article>
  );
}

export default function MemoryPage() {
  const data = memoryPageMockData;
  const [topics, setTopics] = useState(data.recurring_topics);
  const [openSwipe, setOpenSwipe] = useState<OpenSwipeState>(null);
  const [agreedTopics, setAgreedTopics] = useState<Record<string, boolean>>({});
  const displayedThemes = topics.filter((topic) => !topic.is_deleted);
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

        <main
          className={styles.scrollContent}
          onPointerDown={() => {
            if (openSwipe) {
              setOpenSwipe(null);
            }
          }}
        >
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
                    {displayedThemes.map((topic) => {
                      return (
                        <SwipeableRecurringItem
                          key={topic.memory_id}
                          topic={topic}
                          openSwipe={openSwipe}
                          agreed={Boolean(agreedTopics[topic.memory_id])}
                          onOpenChange={setOpenSwipe}
                          onDelete={(memoryId) => {
                            setTopics((current) =>
                              current.map((currentTopic) =>
                                currentTopic.memory_id === memoryId
                                  ? { ...currentTopic, is_deleted: true }
                                  : currentTopic,
                              ),
                            );
                          }}
                          onAgree={(memoryId) => {
                            setAgreedTopics((current) => ({
                              ...current,
                              [memoryId]: !current[memoryId],
                            }));
                          }}
                        />
                      );
                    })}
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
