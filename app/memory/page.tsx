import Link from "next/link";
import { ShellTopNav } from "@/components/shell-top-nav";
import { memoryPageMockData } from "./memory-page-data";
import styles from "./memory-page.module.css";

export default function MemoryPage() {
  const data = memoryPageMockData;
  const displayedActions = data.continue_actions.slice(0, 3);

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.backdropImage} aria-hidden="true" />
        <div className={styles.backdropScrim} aria-hidden="true" />
        <div className={styles.backdropVignette} aria-hidden="true" />

        <header className={styles.topBand}>
          <ShellTopNav />
        </header>

        <main className={styles.scrollContent}>
          <section className={styles.header}>
            <h1 className={styles.pageTitle}>Memory</h1>
            <p className={styles.pageSubtitle}>
              Things that have stayed with you lately.
            </p>
          </section>

          {data.recent_memory_summary ? (
            <section className={styles.heroSection}>
              <div className={styles.heroPanel}>
                <span className={styles.heroTime}>
                  {data.recent_memory_summary.time_window_label}
                </span>
                <p className={styles.heroInsight}>
                  {data.recent_memory_summary.headline_summary}
                </p>
                {data.recent_memory_summary.supporting_line ? (
                  <p className={styles.heroSupport}>
                    {data.recent_memory_summary.supporting_line}
                  </p>
                ) : null}
              </div>
            </section>
          ) : null}

          {data.recurring_topics.length > 0 ? (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Things that came up more than once</h2>
                <p className={styles.sectionDescription}>
                  A few themes that have been returning lately.
                </p>
              </div>

              <div className={styles.themesGroup}>
                {data.recurring_topics.map((topic) => {
                  return (
                    <article key={topic.memory_id} className={styles.themeItem}>
                      <p className={styles.themeTitle}>{topic.display_text}</p>
                      {topic.continuation_hint ? (
                        <p className={styles.themeSupport}>
                          {topic.continuation_hint}
                        </p>
                      ) : null}
                      <p className={styles.themeMeta}>
                        {topic.time_window_label} · {topic.supporting_session_count} sessions
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section className={styles.actionsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Take action</h2>
            </div>

            {displayedActions.length > 0 ? (
              <div className={styles.actionList}>
                {displayedActions.map((action) => (
                  <Link
                    key={action.action_id}
                    href={action.target_route}
                    className={styles.actionLink}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </section>

          {!data.memory_page_available ? (
            <section className={styles.emptyState}>
              <p>
                Memory will build gradually through companionship. You can head
                back into Talk whenever you want to start tonight softly.
              </p>
            </section>
          ) : null}

          <div className={styles.spacer} aria-hidden="true" />
        </main>
      </div>
    </section>
  );
}
