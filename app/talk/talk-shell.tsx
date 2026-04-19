"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { startTransition, useEffect, useRef, useState } from "react";
import { defaultSceneId, sceneConfigMap, type SceneId } from "./scene-config";
import styles from "./talk-page.module.css";
import {
  ChatIcon,
  CloseIcon,
  ImageIcon,
  MemoryIcon,
  MicIcon,
  PlayIcon,
  RoomIcon,
  SleepIcon,
  TypingIcon,
} from "./talk-icons";
import {
  getInitialSceneId,
  readStoredSceneId,
  writeStoredSceneId,
} from "@/lib/scene-selection";

type ConversationState =
  | "opening"
  | "standby"
  | "listening"
  | "processing"
  | "ai_speaking"
  | "typing"
  | "quiet_mode"
  | "error";

type SessionMode = "continuous_voice" | "typing" | "quiet_mode";

type ErrorSurface = "permission" | "network" | null;

const topTabs = [
  { href: "/talk", label: "Talk", icon: ChatIcon },
  { href: "/memory", label: "Memory", icon: MemoryIcon },
  { href: "/sleep-monitoring", label: "Sleep", icon: SleepIcon },
  { href: "/room", label: "Room", icon: RoomIcon },
] as const;

function getStateHint(
  conversationState: ConversationState,
  voiceSessionActive: boolean,
  errorSurface: ErrorSurface,
) {
  if (errorSurface === "permission") {
    return "麦克风还没有打开";
  }

  if (errorSurface === "network") {
    return "刚刚网络有点不稳定";
  }

  switch (conversationState) {
    case "opening":
      return "今晚我在。";
    case "standby":
      return voiceSessionActive ? "你可以继续说。" : "我在。";
    case "listening":
      return "我在听。";
    case "processing":
      return "稍等一下。";
    case "ai_speaking":
      return "我在说。";
    case "typing":
      return "你也可以慢慢写。";
    case "quiet_mode":
      return "现在先这样也可以。";
    case "error":
      return "再试一次就好。";
    default:
      return "我在。";
  }
}

function getHintTone(
  conversationState: ConversationState,
  errorSurface: ErrorSurface,
) {
  if (errorSurface) {
    return "error";
  }

  if (conversationState === "quiet_mode") {
    return "quiet";
  }

  return "normal";
}

export function TalkShell({
  initialSceneParam,
}: {
  initialSceneParam?: string;
}) {
  const pathname = usePathname();
  const timersRef = useRef<number[]>([]);
  const audioTimerRef = useRef<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [conversationState, setConversationState] =
    useState<ConversationState>("opening");
  const [, setSessionMode] = useState<SessionMode>("continuous_voice");
  const [voiceSessionActive, setVoiceSessionActive] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [lastUserText, setLastUserText] = useState("今天脑子停不下来。");
  const [imageAttached, setImageAttached] = useState(false);
  const [manualAudioPlaying, setManualAudioPlaying] = useState(false);
  const [errorSurface, setErrorSurface] = useState<ErrorSurface>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeSceneId] = useState<SceneId>(() =>
    initialSceneParam
      ? getInitialSceneId(initialSceneParam)
      : readStoredSceneId() ?? defaultSceneId,
  );
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const activeScene = sceneConfigMap[activeSceneId];
  const stateHint = getStateHint(
    conversationState,
    voiceSessionActive,
    errorSurface,
  );
  const hintTone = getHintTone(conversationState, errorSurface);
  const isTyping = conversationState === "typing";
  const isListening = conversationState === "listening";
  const isProcessing = conversationState === "processing";
  const isAiSpeaking = conversationState === "ai_speaking";
  const isAudioActive = isAiSpeaking || manualAudioPlaying;

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

  const queueQuietMode = () => {
    queueTransition(() => {
      setConversationState("quiet_mode");
      setSessionMode("quiet_mode");
    }, 9000);
  };

  const enterStandby = (keepVoiceSessionActive: boolean) => {
    clearQueuedTransitions();
    setErrorSurface(null);
    setConversationState("standby");
    setSessionMode("continuous_voice");
    setVoiceSessionActive(keepVoiceSessionActive);
    queueQuietMode();
  };

  const beginProcessingFlow = (keepVoiceSessionActive: boolean) => {
    clearQueuedTransitions();
    setErrorSurface(null);
    setConversationState("processing");
    setSessionMode("continuous_voice");
    setVoiceSessionActive(keepVoiceSessionActive);
    queueTransition(() => {
      setConversationState("ai_speaking");
    }, 900);
    queueTransition(() => {
      enterStandby(true);
    }, 3600);
  };

  const startVoiceFlow = () => {
    clearQueuedTransitions();
    setManualAudioPlaying(false);
    setErrorSurface(null);
    setConversationState("listening");
    setSessionMode("continuous_voice");
    setVoiceSessionActive(true);
    queueTransition(() => {
      setConversationState("processing");
    }, 1500);
    queueTransition(() => {
      setConversationState("ai_speaking");
    }, 2500);
    queueTransition(() => {
      enterStandby(true);
    }, 5200);
  };

  const activateTyping = () => {
    clearQueuedTransitions();
    setErrorSurface(null);
    setConversationState("typing");
    setSessionMode("typing");
  };

  const submitTyping = () => {
    const trimmedText = typedText.trim();

    if (!trimmedText && !imageAttached) {
      enterStandby(voiceSessionActive);
      return;
    }

    if (trimmedText) {
      setLastUserText(trimmedText);
    }

    setTypedText("");
    beginProcessingFlow(true);
  };

  const handlePrimaryAction = () => {
    if (isTyping) {
      submitTyping();
      return;
    }

    startVoiceFlow();
  };

  const handleMicAction = () => {
    if (isListening) {
      beginProcessingFlow(true);
      return;
    }

    if (isAiSpeaking) {
      startVoiceFlow();
      return;
    }

    startVoiceFlow();
  };

  const handleImageAttach = () => {
    clearQueuedTransitions();

    if (isListening) {
      setConversationState("standby");
      setSessionMode("continuous_voice");
    }

    setErrorSurface(null);
    setImageAttached(true);
  };

  const handleRemoveAttachment = () => {
    setImageAttached(false);

    if (!typedText.trim() && isTyping) {
      enterStandby(voiceSessionActive);
    }
  };

  const handleAudioStripClick = () => {
    if (isAiSpeaking) {
      return;
    }

    if (audioTimerRef.current) {
      window.clearTimeout(audioTimerRef.current);
      audioTimerRef.current = null;
    }

    const nextPlayingState = !manualAudioPlaying;
    setManualAudioPlaying(nextPlayingState);

    if (!nextPlayingState) {
      return;
    }

    audioTimerRef.current = window.setTimeout(() => {
      setManualAudioPlaying(false);
      audioTimerRef.current = null;
    }, 2400);
  };

  const handlePreviewOpen = () => {
    startTransition(() => {
      setPreviewOpen(true);
    });
  };

  const handlePreviewClose = () => {
    startTransition(() => {
      setPreviewOpen(false);
    });
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (isTyping) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const xRatio = (event.clientX - rect.left) / rect.width - 0.5;
    const yRatio = (event.clientY - rect.top) / rect.height - 0.5;

    setPanOffset({
      x: Number((xRatio * 12).toFixed(2)),
      y: Number((yRatio * 8).toFixed(2)),
    });
  };

  const resetPan = () => {
    setPanOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    writeStoredSceneId(activeSceneId);
  }, [activeSceneId]);

  useEffect(() => {
    const clearTimers = () => {
      timersRef.current.forEach((timerId) => {
        window.clearTimeout(timerId);
      });
      timersRef.current = [];
    };

    const openingTimer = window.setTimeout(() => {
      setErrorSurface(null);
      setConversationState("standby");
      setSessionMode("continuous_voice");
      setVoiceSessionActive(false);

      const quietTimer = window.setTimeout(() => {
        setConversationState("quiet_mode");
        setSessionMode("quiet_mode");
      }, 9000);

      timersRef.current.push(quietTimer);
    }, 1400);

    timersRef.current.push(openingTimer);

    return () => {
      clearTimers();

      if (audioTimerRef.current) {
        window.clearTimeout(audioTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const contentNode = contentRef.current;

    if (!contentNode) {
      return;
    }

    contentNode.scrollTo({
      top: contentNode.scrollHeight,
      behavior: "smooth",
    });
  }, [conversationState, imageAttached, lastUserText]);

  return (
    <section
      className={styles.page}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPan}
      onPointerCancel={resetPan}
    >
      <div
        className={[
          styles.shell,
          activeScene.overlayMode === "light"
            ? styles.shellLight
            : styles.shellDark,
        ].join(" ")}
      >
        <div
          className={styles.backdropImage}
          style={{
            backgroundImage: `url(${activeScene.image})`,
            transform: `translate3d(${panOffset.x}px, ${panOffset.y}px, 0) scale(1.08)`,
          }}
          aria-hidden="true"
        />
        <div className={styles.backdropGlow} aria-hidden="true" />
        <div className={styles.backdropNoise} aria-hidden="true" />
        <div className={styles.backdropFade} aria-hidden="true" />

        <h1 className={styles.srOnly}>Talk</h1>

        <nav aria-label="Primary navigation" className={styles.topTabs}>
          <ul className={styles.tabList}>
            {topTabs.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href} className={styles.tabItem}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      styles.tabLink,
                      isActive ? styles.tabLinkActive : "",
                    ].join(" ")}
                  >
                    <Icon className={styles.tabIcon} />
                    <span className={styles.tabLabel}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div ref={contentRef} className={styles.contentArea}>
          <div className={styles.contentInner}>
            <div className={styles.roomStamp}>
              <span className={styles.roomStampEyebrow}>{activeScene.eyebrow}</span>
              <strong className={styles.roomStampTitle}>{activeScene.title}</strong>
              <p className={styles.roomStampSummary}>{activeScene.roomFocus}</p>
            </div>

            <div className={styles.dateChip}>Tonight</div>

            <article className={`${styles.turn} ${styles.turnStart}`}>
              <div className={`${styles.bubble} ${styles.bubbleAssistant}`}>
                <p className={styles.bubbleText}>今晚我在，你不用急着开始。</p>
                <span className={styles.bubbleMeta}>23:08</span>
              </div>
            </article>

            <article className={`${styles.turn} ${styles.turnEnd}`}>
              <div className={`${styles.bubble} ${styles.bubbleUser}`}>
                <p className={styles.bubbleText}>{lastUserText}</p>
                <span className={styles.bubbleMeta}>23:10</span>
              </div>
            </article>

            {imageAttached ? (
              <article className={`${styles.turn} ${styles.turnEnd}`}>
                <button
                  type="button"
                  className={styles.imageCard}
                  onClick={handlePreviewOpen}
                >
                  <div
                    className={styles.imageCardMedia}
                    style={{ backgroundImage: `url(${activeScene.image})` }}
                    aria-hidden="true"
                  />
                  <div className={styles.imageCardFooter}>
                    <span className={styles.imageCardLabel}>Room snapshot</span>
                    <span className={styles.imageCardMeta}>Tap to preview</span>
                  </div>
                </button>
              </article>
            ) : null}

            <article className={`${styles.turn} ${styles.turnStart}`}>
              <button
                type="button"
                className={[
                  styles.audioStrip,
                  isAudioActive ? styles.audioStripActive : "",
                ].join(" ")}
                onClick={handleAudioStripClick}
              >
                <span className={styles.audioPlay}>
                  <PlayIcon className={styles.audioPlayIcon} />
                </span>
                <span className={styles.audioTrack}>
                  <span className={styles.audioTrackLabel}>
                    我会陪你把节奏慢下来。
                  </span>
                  <span className={styles.audioTrackLine}>
                    <span className={styles.audioTrackProgress} />
                  </span>
                </span>
                <span className={styles.audioDuration}>0:24</span>
              </button>
            </article>
          </div>
        </div>

        <div className={styles.bottomLayer}>
          <button
            type="button"
            className={[
              styles.stateHint,
              hintTone === "error" ? styles.stateHintError : "",
              hintTone === "quiet" ? styles.stateHintQuiet : "",
            ].join(" ")}
            onClick={() => {
              if (hintTone !== "error") {
                return;
              }

              enterStandby(voiceSessionActive);
            }}
          >
            {stateHint}
          </button>

          {imageAttached ? (
            <div className={styles.attachmentTray}>
              <button
                type="button"
                className={styles.attachmentThumb}
                onClick={handlePreviewOpen}
              >
                <span
                  className={styles.attachmentThumbMedia}
                  style={{ backgroundImage: `url(${activeScene.image})` }}
                  aria-hidden="true"
                />
              </button>
              <div className={styles.attachmentMeta}>
                <span className={styles.attachmentTitle}>Image attached</span>
                <p className={styles.attachmentSummary}>
                  {typedText.trim()
                    ? "会和你写下的这段话一起发送。"
                    : "你也可以继续说，或者改成打字。"}
                </p>
              </div>
              <button
                type="button"
                className={styles.attachmentRemove}
                aria-label="Remove attached image"
                onClick={handleRemoveAttachment}
              >
                <CloseIcon className={styles.attachmentRemoveIcon} />
              </button>
            </div>
          ) : null}

          <div
            className={[
              styles.dock,
              isTyping ? styles.dockTyping : "",
              isListening ? styles.dockRecording : "",
            ].join(" ")}
          >
            <button
              type="button"
              className={[
                styles.dockIconButton,
                styles.typingEntry,
                isTyping ? styles.typingEntryActive : "",
              ].join(" ")}
              aria-label="Activate typing"
              onClick={activateTyping}
            >
              <TypingIcon className={styles.secondaryIcon} />
            </button>

            {isTyping ? (
              <label className={styles.inputWrap}>
                <span className={styles.srOnly}>Write your message</span>
                <input
                  autoFocus
                  type="text"
                  maxLength={200}
                  value={typedText}
                  placeholder="Write instead"
                  className={styles.dockInput}
                  onBlur={() => {
                    if (!typedText.trim() && !imageAttached) {
                      enterStandby(voiceSessionActive);
                    }
                  }}
                  onChange={(event) => {
                    setTypedText(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      submitTyping();
                    }
                  }}
                />
              </label>
            ) : (
              <button
                type="button"
                className={styles.primaryZone}
                aria-label="Tap to speak"
                onClick={handlePrimaryAction}
              >
                <span className={styles.primaryLabel}>Tap to speak</span>
              </button>
            )}

            <button
              type="button"
              className={[
                styles.dockIconButton,
                styles.imageAttach,
                imageAttached ? styles.imageAttachActive : "",
              ].join(" ")}
              aria-label="Attach image"
              onClick={handleImageAttach}
            >
              <ImageIcon className={styles.secondaryIcon} />
            </button>

            <button
              type="button"
              className={[
                styles.micButton,
                voiceSessionActive ? styles.micReady : "",
                isListening ? styles.micRecording : "",
                isProcessing ? styles.micWaiting : "",
              ].join(" ")}
              aria-label={isListening ? "Stop recording" : "Start voice session"}
              onClick={handleMicAction}
            >
              <MicIcon className={styles.micIcon} />
            </button>
          </div>
        </div>

        {previewOpen ? (
          <div className={styles.previewLayer}>
            <button
              type="button"
              className={styles.previewClose}
              aria-label="Close image preview"
              onClick={handlePreviewClose}
            >
              <CloseIcon className={styles.previewCloseIcon} />
            </button>
            <div className={styles.previewSheet}>
              <div
                className={styles.previewMedia}
                style={{ backgroundImage: `url(${activeScene.image})` }}
                aria-hidden="true"
              />
              <div className={styles.previewContent}>
                <span className={styles.previewEyebrow}>Room snapshot</span>
                <h2 className={styles.previewTitle}>{activeScene.title}</h2>
                <p className={styles.previewSummary}>{activeScene.summary}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
