"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./first-launch-flow.module.css";
import {
  FIRST_LAUNCH_ONBOARDING_OPTIONS_V1,
  PERSONAL_ROOM_THEME_OPTIONS_V1,
  buildGeneratedPersonalRoomRecord,
  buildPostOnboardingSessionPreset,
  clearFirstLaunchFlowStorage,
  clearFirstLaunchDraft,
  clearPersonalRoomGenerationDraft,
  createEmptyFirstLaunchDraft,
  createPersonalRoomGenerationDraft,
  ensureGuestAuthStatus,
  readFirstLaunchDraft,
  readGeneratedPersonalRoomRecord,
  readHasCompletedFirstLaunchFlow,
  readPersonalRoomGenerationDraft,
  readPostOnboardingSessionPreset,
  writeFirstLaunchDraft,
  writeGeneratedPersonalRoomRecord,
  writeHasCompletedFirstLaunchFlow,
  writePersonalRoomGenerationDraft,
  writePostOnboardingSessionPreset,
  type FirstLaunchDraft,
  type FirstLaunchStep,
  type PersonalRoomTheme,
  type PostOnboardingSessionPreset,
  type Q1State,
  type Q2SupportStyle,
} from "@/lib/first-launch";

const generationSuccessDelayMs = 1700;

const progressStepOrder: FirstLaunchStep[] = [
  "onboarding_q1",
  "onboarding_q2",
  "session_result",
  "create_room_entry",
  "select_room_theme",
];

function getNextDraftState(
  draft: FirstLaunchDraft,
  patch: Partial<FirstLaunchDraft>,
): FirstLaunchDraft {
  return {
    ...draft,
    ...patch,
    updated_at: new Date().toISOString(),
  };
}

function getProgressIndex(step: FirstLaunchStep) {
  const visibleIndex = progressStepOrder.indexOf(step);
  return visibleIndex < 0 ? -1 : visibleIndex;
}

function getThemePreviewClass(theme: PersonalRoomTheme | null) {
  switch (theme) {
    case "forest_nature":
      return styles.previewThemeForest;
    case "rainy_window":
      return styles.previewThemeRain;
    case "starry_open":
      return styles.previewThemeStar;
    case "warm_indoor":
    default:
      return styles.previewThemeWarm;
  }
}

function getResultHeadline(preset: PostOnboardingSessionPreset) {
  switch (preset.base_mode) {
    case "sleep_settling":
      return "Tonight stays lighter.";
    case "meditative":
      return "We can narrow the room first.";
    case "quiet_presence":
      return "You do not have to carry this out loud.";
    case "gentle_grounding":
    default:
      return "We can settle this gently.";
  }
}

function getResultSupportingCopy(preset: PostOnboardingSessionPreset) {
  switch (preset.base_mode) {
    case "sleep_settling":
      return "Shorter prompts. Less friction. An easier slide toward sleep.";
    case "meditative":
      return "Less explanation, more breath, and a steadier pace.";
    case "quiet_presence":
      return "More presence, fewer words, and no pressure to perform a mood.";
    case "gentle_grounding":
    default:
      return "A softer pace first, then a little more room to exhale.";
  }
}

function getRoomBridgeCopy(preset: PostOnboardingSessionPreset) {
  switch (preset.state_modifier) {
    case "overthinking":
      return "Pick a room first. Let the environment do some of the quieting.";
    case "emotionally_full":
      return "You still keep the choice. The room only gives the feeling somewhere to land.";
    case "needs_company":
      return "Choose a room that feels close enough to stay in for a while.";
    case "low_energy":
    default:
      return "Start with a room that feels easy to stay inside.";
  }
}

export function FirstLaunchFlow() {
  const router = useRouter();
  const generationTimerRef = useRef<number | null>(null);
  const hydrationTimerRef = useRef<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasCompletedFlow, setHasCompletedFlow] = useState(false);
  const [authStatus, setAuthStatus] = useState<"guest" | "authenticated">("guest");
  const [draft, setDraft] = useState<FirstLaunchDraft>(createEmptyFirstLaunchDraft());
  const [preset, setPreset] = useState<PostOnboardingSessionPreset | null>(null);

  useEffect(() => {
    hydrationTimerRef.current = window.setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);

      if (searchParams.get("reset-first-launch") === "1") {
        clearFirstLaunchFlowStorage();
        writeHasCompletedFirstLaunchFlow(false);
        window.history.replaceState({}, "", window.location.pathname);
      }

      const nextAuthStatus = ensureGuestAuthStatus();

      setAuthStatus(nextAuthStatus);
      setDraft(readFirstLaunchDraft());
      setPreset(readPostOnboardingSessionPreset());
      readGeneratedPersonalRoomRecord();
      readPersonalRoomGenerationDraft();
      setHasCompletedFlow(readHasCompletedFirstLaunchFlow());
      setIsHydrated(true);
    }, 0);

    return () => {
      if (hydrationTimerRef.current !== null) {
        window.clearTimeout(hydrationTimerRef.current);
        hydrationTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isHydrated || !hasCompletedFlow) {
      return;
    }

    startTransition(() => {
      router.replace("/room");
    });
  }, [hasCompletedFlow, isHydrated, router]);

  useEffect(() => {
    if (!isHydrated || draft.current_step !== "room_generating") {
      return;
    }

    generationTimerRef.current = window.setTimeout(() => {
      if (!draft.selected_visual_theme) {
        const generationDraft = createPersonalRoomGenerationDraft({
          visual_theme: null,
          generation_status: "failed",
        });

        writePersonalRoomGenerationDraft(generationDraft);
        setDraft((currentDraft) =>
          getNextDraftState(currentDraft, {
            current_step: "select_room_theme",
          }),
        );
        return;
      }

      const generationDraft = createPersonalRoomGenerationDraft({
        visual_theme: draft.selected_visual_theme,
        generation_seed_id: `seed-${Date.now()}`,
        generation_job_id: `job-${Date.now()}`,
        generation_status: "ready",
        preview_asset_id:
          PERSONAL_ROOM_THEME_OPTIONS_V1.find(
            (option) => option.value === draft.selected_visual_theme,
          )?.previewAssetId ?? null,
      });

      writePersonalRoomGenerationDraft(generationDraft);
      writeGeneratedPersonalRoomRecord(
        buildGeneratedPersonalRoomRecord(draft.selected_visual_theme),
      );
      setDraft((currentDraft) =>
        getNextDraftState(currentDraft, {
          current_step: "room_generation_preview",
        }),
      );
    }, generationSuccessDelayMs);

    return () => {
      if (generationTimerRef.current !== null) {
        window.clearTimeout(generationTimerRef.current);
        generationTimerRef.current = null;
      }
    };
  }, [draft.current_step, draft.selected_visual_theme, isHydrated]);

  useEffect(() => {
    if (!isHydrated || hasCompletedFlow) {
      return;
    }

    writeFirstLaunchDraft(draft);
  }, [draft, hasCompletedFlow, isHydrated]);

  const activeTheme = useMemo(
    () =>
      PERSONAL_ROOM_THEME_OPTIONS_V1.find(
        (option) => option.value === draft.selected_visual_theme,
      ) ?? null,
    [draft.selected_visual_theme],
  );
  const progressIndex = getProgressIndex(draft.current_step);
  const shouldRedirectToRoom = isHydrated && hasCompletedFlow;

  const updateDraft = (patch: Partial<FirstLaunchDraft>) => {
    setDraft((currentDraft) => getNextDraftState(currentDraft, patch));
  };

  const handleStart = () => {
    updateDraft({
      current_step: "onboarding_q1",
    });
  };

  const handleSelectQ1 = (value: Q1State) => {
    updateDraft({
      q1_state: value,
    });
  };

  const handleContinueToQ2 = () => {
    if (!draft.q1_state) {
      return;
    }

    updateDraft({
      current_step: "onboarding_q2",
    });
  };

  const handleSelectQ2 = (value: Q2SupportStyle) => {
    updateDraft({
      q2_support_style: value,
    });
  };

  const handleBackToQ1 = () => {
    updateDraft({
      current_step: "onboarding_q1",
    });
  };

  const handleContinueToResult = () => {
    if (!draft.q1_state || !draft.q2_support_style) {
      return;
    }

    const nextPreset = buildPostOnboardingSessionPreset({
      q1State: draft.q1_state,
      q2SupportStyle: draft.q2_support_style,
    });

    writePostOnboardingSessionPreset(nextPreset);
    setPreset(nextPreset);
    updateDraft({
      current_step: "session_result",
    });
  };

  const handleOpenCreateRoomEntry = () => {
    updateDraft({
      current_step: "create_room_entry",
    });
  };

  const completeAndEnterRoom = () => {
    writeHasCompletedFirstLaunchFlow(true);
    clearFirstLaunchDraft();
    clearPersonalRoomGenerationDraft();
    setHasCompletedFlow(true);
    updateDraft({
      current_step: "room_page",
    });
  };

  const handleSeeExistingRooms = () => {
    completeAndEnterRoom();
  };

  const handleEnterCreateRoomBranch = () => {
    updateDraft({
      current_step: "select_room_theme",
      entered_create_room_branch: true,
    });
  };

  const handleSelectTheme = (theme: PersonalRoomTheme) => {
    updateDraft({
      selected_visual_theme: theme,
    });
  };

  const handleGenerateRoom = () => {
    if (!draft.selected_visual_theme) {
      return;
    }

    writePersonalRoomGenerationDraft(
      createPersonalRoomGenerationDraft({
        visual_theme: draft.selected_visual_theme,
        generation_status: "generating",
        generation_seed_id: `seed-${Date.now()}`,
        generation_job_id: `job-${Date.now()}`,
      }),
    );
    updateDraft({
      current_step: "room_generating",
    });
  };

  const handleRegenerateRoom = () => {
    handleGenerateRoom();
  };

  const handleUseGeneratedRoom = () => {
    completeAndEnterRoom();
  };

  const handlePreviewSkip = () => {
    completeAndEnterRoom();
  };

  if (!isHydrated || shouldRedirectToRoom) {
    return (
      <section className={styles.shell}>
        <div className={styles.backgroundGlow} />
        <div className={styles.backgroundGlowSecondary} />
        <div className={styles.redirectState}>
          <div className={styles.redirectCard}>
            <h1 className={styles.redirectTitle}>Heading back to Room</h1>
            <p className={styles.redirectCopy}>Your first entry is already set.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.shell}>
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGlowSecondary} />
      <div className={styles.content}>
        <div className={styles.topMeta}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            First launch
          </span>
          <span className={styles.authPill}>
            {authStatus === "authenticated" ? "Signed in" : "Guest first"}
          </span>
        </div>

        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Start softly tonight.</h1>
          <p className={styles.heroDescription}>Two quick steps. Then Room.</p>
          {progressIndex >= 0 ? (
            <div className={styles.progress} aria-label="Flow progress">
              {progressStepOrder.map((step, index) => (
                <span key={step} className={styles.progressTrack}>
                  <span
                    className={styles.progressFill}
                    style={{
                      width:
                        index < progressIndex
                          ? "100%"
                          : index === progressIndex
                          ? "64%"
                          : "0%",
                    }}
                  />
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className={styles.panelWrap}>
          {draft.current_step === "welcome" ? (
            <article className={styles.panel}>
              <div className={styles.panelHeader}>
                <p className={styles.panelKicker}>Welcome</p>
                <h2 className={styles.panelTitle}>A gentler way in.</h2>
                <p className={styles.panelDescription}>
                  No sign-up. No chat wall. Just a quick read on what you need tonight.
                </p>
              </div>
              <div className={styles.buttonStack}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleStart}
                >
                  Begin
                </button>
              </div>
            </article>
          ) : null}

          {draft.current_step === "onboarding_q1" ? (
            <article className={styles.panel}>
              <div className={styles.panelHeader}>
                <p className={styles.panelKicker}>Question 1</p>
                <h2 className={styles.panelTitle}>
                  {FIRST_LAUNCH_ONBOARDING_OPTIONS_V1.q1.title}
                </h2>
                <p className={styles.panelDescription}>
                  Pick the closest one. No need to explain everything.
                </p>
              </div>
              <div className={styles.optionList}>
                {FIRST_LAUNCH_ONBOARDING_OPTIONS_V1.q1.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={[
                      styles.optionButton,
                      draft.q1_state === option.value ? styles.optionButtonSelected : "",
                    ].join(" ")}
                    onClick={() => handleSelectQ1(option.value)}
                  >
                    <p className={styles.optionTitle}>{option.label}</p>
                  </button>
                ))}
              </div>
              <div className={styles.buttonStack}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleContinueToQ2}
                  disabled={!draft.q1_state}
                >
                  Continue
                </button>
              </div>
            </article>
          ) : null}

          {draft.current_step === "onboarding_q2" ? (
            <article className={styles.panel}>
              <div className={styles.panelHeader}>
                <p className={styles.panelKicker}>Question 2</p>
                <h2 className={styles.panelTitle}>
                  {FIRST_LAUNCH_ONBOARDING_OPTIONS_V1.q2.title}
                </h2>
                <p className={styles.panelDescription}>
                  This shapes the pace, not the room.
                </p>
              </div>
              <div className={styles.optionList}>
                {FIRST_LAUNCH_ONBOARDING_OPTIONS_V1.q2.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={[
                      styles.optionButton,
                      draft.q2_support_style === option.value
                        ? styles.optionButtonSelected
                        : "",
                    ].join(" ")}
                    onClick={() => handleSelectQ2(option.value)}
                  >
                    <p className={styles.optionTitle}>{option.label}</p>
                  </button>
                ))}
              </div>
              <div className={styles.buttonStack}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleContinueToResult}
                  disabled={!draft.q2_support_style}
                >
                  Continue
                </button>
                <button
                  type="button"
                  className={styles.ghostButton}
                  onClick={handleBackToQ1}
                >
                  Back
                </button>
              </div>
            </article>
          ) : null}

          {draft.current_step === "session_result" && preset ? (
            <article className={styles.panel}>
              <div className={styles.panelHeader}>
                <p className={styles.panelKicker}>Result</p>
                <h2 className={styles.panelTitle}>{getResultHeadline(preset)}</h2>
                <p className={styles.panelDescription}>
                  {getResultSupportingCopy(preset)}
                </p>
              </div>
              <div className={styles.resultInfoBlock}>
                <p className={styles.resultInfoLine}>
                  This shapes tonight&apos;s session preset. It does not drop you into Talk.
                </p>
                <p className={styles.resultInfoLine}>
                  Next you can browse rooms, or make one that feels a little more personal.
                </p>
              </div>
              <div className={styles.buttonStack}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleOpenCreateRoomEntry}
                >
                  Continue
                </button>
              </div>
            </article>
          ) : null}

          {draft.current_step === "create_room_entry" && preset ? (
            <article className={styles.panel}>
              <div className={styles.panelHeader}>
                <p className={styles.panelKicker}>Create personal room</p>
                <h2 className={styles.panelTitle}>I can make a room for tonight too.</h2>
                <p className={styles.panelDescription}>
                  {getRoomBridgeCopy(preset)}
                </p>
              </div>
              <div className={styles.buttonStack}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleEnterCreateRoomBranch}
                >
                  Create my room
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={handleSeeExistingRooms}
                >
                  Browse rooms
                </button>
              </div>
            </article>
          ) : null}

          {draft.current_step === "select_room_theme" ? (
            <article className={styles.panel}>
              <div className={styles.panelHeader}>
                <p className={styles.panelKicker}>Theme selection</p>
                <h2 className={styles.panelTitle}>What kind of room feels right tonight?</h2>
                <p className={styles.panelDescription}>
                  This is only a visual direction.
                </p>
              </div>
              <div className={styles.optionList}>
                {PERSONAL_ROOM_THEME_OPTIONS_V1.map((theme) => (
                  <button
                    key={theme.value}
                    type="button"
                    className={[
                      styles.optionButton,
                      draft.selected_visual_theme === theme.value
                        ? styles.optionButtonSelected
                        : "",
                    ].join(" ")}
                    onClick={() => handleSelectTheme(theme.value)}
                  >
                    <p className={styles.optionTitle}>{theme.title}</p>
                    <p className={styles.optionMeta}>{theme.description}</p>
                  </button>
                ))}
              </div>
              <div className={styles.buttonStack}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleGenerateRoom}
                  disabled={!draft.selected_visual_theme}
                >
                  Generate this room
                </button>
                <button
                  type="button"
                  className={styles.ghostButton}
                  onClick={handleSeeExistingRooms}
                >
                  Browse rooms instead
                </button>
              </div>
            </article>
          ) : null}

          {draft.current_step === "room_generating" ? (
            <article className={styles.panel}>
              <div className={styles.panelHeader}>
                <p className={styles.panelKicker}>Preparing room</p>
                <h2 className={styles.panelTitle}>Preparing your room.</h2>
              </div>
              <div className={styles.loadingView}>
                <div className={styles.loadingHalo} />
                <p className={styles.loadingCopy}>
                  Soft light, more quiet, and a little more shelter.
                </p>
                <p className={styles.loadingMeta}>
                  No progress bar. No system noise.
                </p>
              </div>
            </article>
          ) : null}

          {draft.current_step === "room_generation_preview" && activeTheme ? (
            <article className={styles.panel}>
              <div className={styles.panelHeader}>
                <p className={styles.panelKicker}>Preview</p>
                <h2 className={styles.panelTitle}>A room for tonight.</h2>
                <p className={styles.panelDescription}>
                  Use it, regenerate it, or keep browsing.
                </p>
              </div>
              <div className={styles.previewFrame}>
                <div className={getThemePreviewClass(activeTheme.value)} />
                <div className={styles.previewGlow} />
                <div className={styles.previewWindow} />
                <div className={styles.previewInterior} />
                <div className={styles.previewCopy}>
                  <span className={styles.previewPill}>{activeTheme.label}</span>
                  <h3 className={styles.previewTitle}>Your Room</h3>
                  <p className={styles.previewDescription}>{activeTheme.description}</p>
                </div>
              </div>
              <div className={styles.buttonStack}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleUseGeneratedRoom}
                >
                  Use this room
                </button>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={handleRegenerateRoom}
                >
                  Regenerate
                </button>
                <button
                  type="button"
                  className={styles.ghostButton}
                  onClick={handlePreviewSkip}
                >
                  See other rooms
                </button>
              </div>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}
