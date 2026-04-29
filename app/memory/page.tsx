import Link from "next/link";
import { ShellTopNav } from "@/components/shell-top-nav";
import { memoryPageMockData } from "./memory-page-data";
import styles from "./memory-page.module.css";

export default function MemoryPage() {
  const data = memoryPageMockData;
  const displayedThemes = data.recurring_topics
    .filter((topic) => !topic.is_deleted)
    .slice(0, 3);
  const displayedActions = data.continue_actions.slice(0, 3);

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.backdropBase} aria-hidden="true" />
        <div className={styles.backdropHaze} aria-hidden="true" />
        <div className={styles.backdropVignette} aria-hidden="true" />

        <header className={styles.topBand}>
          <ShellTopNav />
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
                    {displayedThemes.map((topic) => {
                      return (
                        <article
                          key={topic.memory_id}
                          className={styles.recurringItem}
                        >
                          <h2 className={styles.recurringTitle}>
                            {topic.display_text}
                          </h2>
                          {topic.continuation_hint ? (
                            <p className={styles.recurringSupport}>
                              {topic.continuation_hint}
                            </p>
                          ) : null}
                        </article>
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
