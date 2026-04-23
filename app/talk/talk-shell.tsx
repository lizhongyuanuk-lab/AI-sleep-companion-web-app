"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { startTransition, useEffect, useRef, useState } from "react";
import {
  defaultSceneId,
  sceneConfigMap,
  type SceneId,
  type SoundDefaults,
  type SoundMixPreset,
  type WhiteNoiseType,
} from "./scene-config";
import styles from "./talk-page.module.css";
import {
  ImageIcon,
  MicIcon,
  SettingsIcon,
} from "./talk-icons";
import {
  getInitialSceneId,
  readStoredSceneId,
  writeStoredSceneId,
} from "@/lib/scene-selection";

type TalkUiState =
  | "idle_default"
  | "standby_for_voice"
  | "voice_recording"
  | "processing"
  | "ai_speaking"
  | "error_permission"
  | "error_network"
  | "quiet_mode";

type HintTone = "normal" | "error";

const soundSettingsStorageKey = "ai-companion-web.talk-sound-settings";

const topTabs = [
  { href: "/talk", label: "Talk", icon: "/nav-icons/talk-shell-black.png" },
  { href: "/room", label: "Room", icon: "/nav-icons/room-shell-black.png" },
  { href: "/memory", label: "Memory", icon: "/nav-icons/memory-shell-black.png" },
  { href: "/sleep-monitoring", label: "Sleep", icon: "/nav-icons/sleep-shell-black.png" },
] as const;

const whiteNoiseOptions: { value: WhiteNoiseType; label: string }[] = [
  { value: "room_default", label: "Room default" },
  { value: "rain", label: "Rain" },
  { value: "ocean", label: "Ocean" },
  { value: "wind", label: "Wind" },
];

const soundMixOptions: { value: SoundMixPreset; label: string }[] = [
  { value: "balanced", label: "Balanced" },
  { value: "voice_focus", label: "Voice focus" },
  { value: "deep_sleep", label: "Deep sleep" },
];

function clampVolume(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalizeSoundSettings(
  candidate: Partial<SoundDefaults> | null | undefined,
  defaults: SoundDefaults,
): SoundDefaults {
  const whiteNoiseType = whiteNoiseOptions.some(
    (option) => option.value === candidate?.whiteNoiseType,
  )
    ? (candidate?.whiteNoiseType as WhiteNoiseType)
    : defaults.whiteNoiseType;

  const soundMixPreset = soundMixOptions.some(
    (option) => option.value === candidate?.soundMixPreset,
  )
    ? (candidate?.soundMixPreset as SoundMixPreset)
    : defaults.soundMixPreset;

  return {
    voiceVolume: clampVolume(candidate?.voiceVolume ?? defaults.voiceVolume),
    bgmVolume: clampVolume(candidate?.bgmVolume ?? defaults.bgmVolume),
    whiteNoiseVolume: clampVolume(
      candidate?.whiteNoiseVolume ?? defaults.whiteNoiseVolume,
    ),
    whiteNoiseType,
    soundMixPreset,
  };
}

function readStoredSoundSettings(defaults: SoundDefaults) {
  if (typeof window === "undefined") {
    return defaults;
  }

  const rawSettings = window.localStorage.getItem(soundSettingsStorageKey);

  if (!rawSettings) {
    return defaults;
  }

  try {
    return normalizeSoundSettings(
      JSON.parse(rawSettings) as Partial<SoundDefaults>,
      defaults,
    );
  } catch {
    return defaults;
  }
}

function formatVoiceProfileLabel(voiceProfileId: string) {
  return voiceProfileId
    .split("-")
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(" ");
}

function getPrimaryLabel(uiState: TalkUiState) {
  switch (uiState) {
    case "voice_recording":
      return "Listening...";
    case "processing":
      return "Responding...";
    default:
      return "Tap to speak";
  }
}

function getHint(
  uiState: TalkUiState,
  imageAttached: boolean,
  settingsOpen: boolean,
) {
  if (uiState === "error_permission") {
    return "Microphone access is unavailable";
  }

  if (uiState === "error_network") {
    return "Connection is unstable right now";
  }

  if (settingsOpen) {
    return "Sound changes apply instantly";
  }

  if (imageAttached && uiState !== "voice_recording") {
    return "Image attached";
  }

  return null;
}

function getHintTone(uiState: TalkUiState): HintTone {
  if (uiState === "error_network" || uiState === "error_permission") {
    return "error";
  }

  return "normal";
}

export function TalkShell({
  initialSceneParam,
}: {
  initialSceneParam?: string;
}) {
  const pathname = usePathname();
  const initialSceneId = initialSceneParam
    ? getInitialSceneId(initialSceneParam)
    : defaultSceneId;
  const timersRef = useRef<number[]>([]);
  const settingsPanelRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const skipNextSoundPersistRef = useRef(true);

  const [activeSceneId, setActiveSceneId] = useState<SceneId>(initialSceneId);
  const activeScene = sceneConfigMap[activeSceneId];
  const [uiState, setUiState] = useState<TalkUiState>("idle_default");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [imageAttached, setImageAttached] = useState(false);
  const [sceneStorageReady, setSceneStorageReady] = useState(
    Boolean(initialSceneParam),
  );
  const [soundSettings, setSoundSettings] = useState<SoundDefaults>(
    sceneConfigMap[initialSceneId].soundDefaults,
  );

  const stateHint = getHint(uiState, imageAttached, settingsOpen);
  const hintTone = getHintTone(uiState);
  const primaryLabel = getPrimaryLabel(uiState);
  const settingsUnavailable = uiState === "voice_recording";
  const recordingActive = uiState === "voice_recording";
  const processingActive = uiState === "processing";
  const speakingActive = uiState === "ai_speaking";
  const quietActive = uiState === "quiet_mode";

  const clearQueuedTransitions = () => {
    timersRef.current.forEach((timerId) => {
      window.clearTimeout(timerId);
    });

    timersRef.current = [];
  };

  const queueTransition = (callback: () => void, delayMs: number) => {
    const timerId = window.setTimeout(callback, delayMs);
    timersRef.current.push(timerId);
  };

  const scheduleQuietMode = (delayMs = 9000) => {
    queueTransition(() => {
      setUiState("quiet_mode");
    }, delayMs);
  };

  const enterStandby = () => {
    clearQueuedTransitions();
    setUiState("standby_for_voice");
    scheduleQuietMode();
  };

  const ensureVoiceRuntime = () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      clearQueuedTransitions();
      setUiState("error_permission");
      setSettingsOpen(false);
      return false;
    }

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      clearQueuedTransitions();
      setUiState("error_network");
      setSettingsOpen(false);
      return false;
    }

    return true;
  };

  const beginProcessingFlow = () => {
    clearQueuedTransitions();
    setSettingsOpen(false);
    setUiState("processing");
    queueTransition(() => {
      setUiState("ai_speaking");
    }, 1200);
    queueTransition(() => {
      enterStandby();
    }, 4600);
  };

  const startVoiceFlow = () => {
    if (!ensureVoiceRuntime()) {
      return;
    }

    clearQueuedTransitions();
    setSettingsOpen(false);
    setUiState("voice_recording");
    queueTransition(() => {
      beginProcessingFlow();
    }, 1800);
  };

  const handlePrimaryAction = () => {
    if (processingActive) {
      return;
    }

    if (recordingActive) {
      beginProcessingFlow();
      return;
    }

    startVoiceFlow();
  };

  const handleImageAttach = () => {
    if (recordingActive) {
      return;
    }

    setSettingsOpen(false);
    setImageAttached((current) => !current);
  };

  const handleSettingsToggle = () => {
    if (settingsUnavailable) {
      return;
    }

    startTransition(() => {
      setSettingsOpen((open) => !open);
    });
  };

  const updateVolume = (
    field: "voiceVolume" | "bgmVolume" | "whiteNoiseVolume",
    nextValue: number,
  ) => {
    setSoundSettings((current) => ({
      ...current,
      [field]: clampVolume(nextValue),
    }));
  };

  const updateWhiteNoiseType = (whiteNoiseType: WhiteNoiseType) => {
    setSoundSettings((current) => ({
      ...current,
      whiteNoiseType,
    }));
  };

  const updateSoundMixPreset = (soundMixPreset: SoundMixPreset) => {
    setSoundSettings((current) => ({
      ...current,
      soundMixPreset,
    }));
  };

  useEffect(() => {
    if (initialSceneParam) {
      startTransition(() => {
        setActiveSceneId(getInitialSceneId(initialSceneParam));
        setSceneStorageReady(true);
      });
      return;
    }

    const storedSceneId = readStoredSceneId();

    startTransition(() => {
      if (storedSceneId) {
        setActiveSceneId(getInitialSceneId(storedSceneId));
      }

      setSceneStorageReady(true);
    });
  }, [initialSceneParam]);

  useEffect(() => {
    if (!sceneStorageReady) {
      return;
    }

    writeStoredSceneId(activeSceneId);
  }, [activeSceneId, sceneStorageReady]);

  useEffect(() => {
    clearQueuedTransitions();

    const hasMicrophoneSupport = Boolean(navigator.mediaDevices?.getUserMedia);

    if (!hasMicrophoneSupport) {
      startTransition(() => {
        setUiState("error_permission");
      });
      return () => {
        clearQueuedTransitions();
      };
    }

    if (!navigator.onLine) {
      startTransition(() => {
        setUiState("error_network");
      });
    } else {
      queueTransition(() => {
        setUiState("standby_for_voice");
      }, 1400);
      queueTransition(() => {
        setUiState("quiet_mode");
      }, 9000);
    }

    const handleOffline = () => {
      clearQueuedTransitions();
      setUiState("error_network");
      setSettingsOpen(false);
    };

    const handleOnline = () => {
      clearQueuedTransitions();
      setUiState("standby_for_voice");
      queueTransition(() => {
        setUiState("quiet_mode");
      }, 9000);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      clearQueuedTransitions();
    };
  }, []);

  useEffect(() => {
    skipNextSoundPersistRef.current = true;
    startTransition(() => {
      setSoundSettings(
        readStoredSoundSettings(sceneConfigMap[activeSceneId].soundDefaults),
      );
    });
  }, [activeSceneId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (skipNextSoundPersistRef.current) {
      skipNextSoundPersistRef.current = false;
      return;
    }

    window.localStorage.setItem(
      soundSettingsStorageKey,
      JSON.stringify(soundSettings),
    );
  }, [soundSettings]);

  useEffect(() => {
    if (!settingsOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (
        settingsPanelRef.current?.contains(target) ||
        settingsButtonRef.current?.contains(target)
      ) {
        return;
      }

      setSettingsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [settingsOpen]);

  useEffect(() => {
    if (!settingsOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSettingsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [settingsOpen]);

  return (
    <section className={styles.page}>
      <div className={styles.shell}>
        <div
          className={styles.backdropImage}
          style={{ backgroundImage: `url(${activeScene.backgroundAsset})` }}
          aria-hidden="true"
        />
        <div className={styles.backdropScrim} aria-hidden="true" />
        <div className={styles.backdropVignette} aria-hidden="true" />

        <h1 className={styles.srOnly}>Talk</h1>

        <div className={styles.topBand}>
          <button
            ref={settingsButtonRef}
            type="button"
            aria-label="Open sound settings"
            aria-expanded={settingsOpen}
            disabled={settingsUnavailable}
            className={[
              styles.settingsButton,
              settingsOpen ? styles.settingsButtonActive : "",
              settingsUnavailable ? styles.settingsButtonDisabled : "",
            ].join(" ")}
            onClick={handleSettingsToggle}
          >
            <SettingsIcon className={styles.utilityIcon} />
          </button>

          <nav aria-label="Primary navigation" className={styles.navCapsule}>
            <ul className={styles.navList}>
              {topTabs.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <li key={item.href} className={styles.navItem}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      aria-label={item.label}
                      title={item.label}
                      className={[
                        styles.navLink,
                        isActive ? styles.navLinkActive : "",
                      ].join(" ")}
                    >
                      <span
                        className={styles.navIconAsset}
                        style={{ backgroundImage: `url(${item.icon})` }}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {settingsOpen ? (
          <div ref={settingsPanelRef} className={styles.settingsPanel}>
            <div className={styles.settingsHeader}>
              <span className={styles.settingsEyebrow}>Sound mix</span>
              <h2 className={styles.settingsTitle}>Talk settings</h2>
              <p className={styles.settingsMeta}>
                Voice profile: {formatVoiceProfileLabel(activeScene.voiceProfileId)}
              </p>
            </div>

            <div className={styles.settingsGroup}>
              <label className={styles.settingBlock}>
                <span className={styles.settingHead}>
                  <span className={styles.settingLabel}>Companion voice</span>
                  <span className={styles.settingValue}>
                    {soundSettings.voiceVolume}%
                  </span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soundSettings.voiceVolume}
                  className={styles.slider}
                  onChange={(event) => {
                    updateVolume("voiceVolume", Number(event.target.value));
                  }}
                />
              </label>

              <label className={styles.settingBlock}>
                <span className={styles.settingHead}>
                  <span className={styles.settingLabel}>Background music</span>
                  <span className={styles.settingValue}>
                    {soundSettings.bgmVolume}%
                  </span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soundSettings.bgmVolume}
                  className={styles.slider}
                  onChange={(event) => {
                    updateVolume("bgmVolume", Number(event.target.value));
                  }}
                />
              </label>

              <label className={styles.settingBlock}>
                <span className={styles.settingHead}>
                  <span className={styles.settingLabel}>White noise</span>
                  <span className={styles.settingValue}>
                    {soundSettings.whiteNoiseVolume}%
                  </span>
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soundSettings.whiteNoiseVolume}
                  className={styles.slider}
                  onChange={(event) => {
                    updateVolume("whiteNoiseVolume", Number(event.target.value));
                  }}
                />
              </label>

              <div className={styles.settingBlock}>
                <span className={styles.settingHead}>
                  <span className={styles.settingLabel}>White noise type</span>
                  <span className={styles.settingValue}>Instant apply</span>
                </span>
                <div className={styles.segmentRow}>
                  {whiteNoiseOptions.map((option) => {
                    const isActive = soundSettings.whiteNoiseType === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={[
                          styles.segmentButton,
                          isActive ? styles.segmentButtonActive : "",
                        ].join(" ")}
                        onClick={() => {
                          updateWhiteNoiseType(option.value);
                        }}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={styles.settingBlock}>
                <span className={styles.settingHead}>
                  <span className={styles.settingLabel}>Sound mix preset</span>
                  <span className={styles.settingValue}>Global</span>
                </span>
                <div className={styles.segmentRow}>
                  {soundMixOptions.map((option) => {
                    const isActive = soundSettings.soundMixPreset === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={[
                          styles.segmentButton,
                          isActive ? styles.segmentButtonActive : "",
                        ].join(" ")}
                        onClick={() => {
                          updateSoundMixPreset(option.value);
                        }}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <main className={styles.contentArea} aria-hidden="true">
          <div className={styles.scenePresenceHalo} />
        </main>

        <div className={styles.bottomLayer}>
          <div className={styles.roomAnchor}>{activeScene.roomName}</div>

          {stateHint ? (
            <div
              className={[
                styles.stateHint,
                hintTone === "error" ? styles.stateHintError : "",
              ].join(" ")}
            >
              {stateHint}
            </div>
          ) : null}

          <div
            className={[
              styles.dock,
              recordingActive ? styles.dockRecording : "",
              processingActive ? styles.dockProcessing : "",
              speakingActive ? styles.dockSpeaking : "",
              quietActive ? styles.dockQuiet : "",
            ].join(" ")}
          >
            <button
              type="button"
              aria-label={recordingActive ? "Stop recording" : "Start voice session"}
              className={styles.primaryZone}
              onClick={handlePrimaryAction}
            >
              <div className={styles.waveCluster} aria-hidden="true">
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
              </div>

              <span className={styles.primaryCore}>
                <span className={styles.micCircle}>
                  <MicIcon className={styles.micIcon} />
                </span>
                <span className={styles.primaryLabel}>{primaryLabel}</span>
              </span>

              <div className={styles.waveCluster} aria-hidden="true">
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
                <span className={styles.waveBar} />
              </div>
            </button>

            <button
              type="button"
              aria-label={imageAttached ? "Remove image attachment" : "Attach image"}
              className={[
                styles.imageButton,
                imageAttached ? styles.imageButtonActive : "",
                recordingActive ? styles.imageButtonDisabled : "",
              ].join(" ")}
              onClick={handleImageAttach}
            >
              <ImageIcon className={styles.secondaryIcon} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
