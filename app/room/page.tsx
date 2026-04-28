"use client";

import {
  startTransition,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MutableRefObject,
} from "react";
import { useRouter } from "next/navigation";
import { sceneQueryParam, writeStoredSceneId } from "@/lib/scene-selection";
import {
  getInitialRoomId,
  readLastEnteredRoomId,
  readStoredRoomId,
  readSwipeHintDismissed,
  writeLastEnteredRoomId,
  writeStoredRoomId,
  writeSwipeHintDismissed,
} from "@/lib/room-selection";
import {
  activeRoomConfigs,
  defaultRoomId,
  roomConfigMap,
  type RoomId,
  type RoomMotionVariant,
} from "./room-config";
import styles from "./room-page.module.css";

const SCROLL_SETTLE_DELAY_MS = 160;
const TALK_ENTER_DELAY_MS = 140;
const AUDIO_CROSSFADE_DURATION_MS = 640;
const AUDIO_STEP_INTERVAL_MS = 64;
const TARGET_AMBIENCE_VOLUME = 0.38;

type RoomUiState =
  | "page_loaded_first_entry"
  | "idle_room_preview"
  | "dwell_ready_to_enter"
  | "room_switching"
  | "talk_enter_transition"
  | "asset_audio_failed"
  | "asset_visual_failed";

const motionBandClassMap: Record<RoomMotionVariant, string> = {
  moon: styles.motionBandMoon,
  shore: styles.motionBandShore,
  canopy: styles.motionBandCanopy,
  alpine: styles.motionBandAlpine,
  harbor: styles.motionBandHarbor,
  snowfall: styles.motionBandSnowfall,
};

const motionGlowClassMap: Record<RoomMotionVariant, string> = {
  moon: styles.motionGlowMoon,
  shore: styles.motionGlowShore,
  canopy: styles.motionGlowCanopy,
  alpine: styles.motionGlowAlpine,
  harbor: styles.motionGlowHarbor,
  snowfall: styles.motionGlowSnowfall,
};

function clearTimer(timerRef: MutableRefObject<number | null>) {
  if (timerRef.current === null) {
    return;
  }

  window.clearTimeout(timerRef.current);
  timerRef.current = null;
}

function getClosestRoomId(container: HTMLDivElement): RoomId {
  const pageHeight = Math.max(container.clientHeight, 1);
  const nextIndex = Math.min(
    activeRoomConfigs.length - 1,
    Math.max(0, Math.round(container.scrollTop / pageHeight)),
  );

  return activeRoomConfigs[nextIndex]?.id ?? defaultRoomId;
}

export default function RoomPage() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const settleTimerRef = useRef<number | null>(null);
  const enterTimerRef = useRef<number | null>(null);
  const hydrateTimerRef = useRef<number | null>(null);
  const audioIntervalIdsRef = useRef<number[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const hasAlignedInitialRoomRef = useRef(false);

  const [activeRoomId, setActiveRoomId] = useState<RoomId>(defaultRoomId);
  const [initialRoomId, setInitialRoomId] = useState<RoomId>(defaultRoomId);
  const [uiState, setUiState] = useState<RoomUiState>("idle_room_preview");
  const [isHydrated, setIsHydrated] = useState(false);
  const [isFirstEntry, setIsFirstEntry] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [swipeHintDismissed, setSwipeHintDismissed] = useState(false);
  const [visualFailed, setVisualFailed] = useState(false);

  const activeRoom = roomConfigMap[activeRoomId];
  const showSwipeHint =
    isHydrated &&
    isFirstEntry &&
    !swipeHintDismissed &&
    activeRoomId === initialRoomId;
  const showTapHint = isHydrated && uiState !== "talk_enter_transition";

  const clearAudioIntervals = () => {
    audioIntervalIdsRef.current.forEach((intervalId) => {
      window.clearInterval(intervalId);
    });

    audioIntervalIdsRef.current = [];
  };

  const rampAudioVolume = (
    audio: HTMLAudioElement | null,
    from: number,
    to: number,
    durationMs: number,
    onComplete?: () => void,
  ) => {
    if (!audio) {
      onComplete?.();
      return;
    }

    const totalSteps = Math.max(1, Math.round(durationMs / AUDIO_STEP_INTERVAL_MS));
    let currentStep = 0;

    audio.volume = from;

    const intervalId = window.setInterval(() => {
      currentStep += 1;
      const progress = currentStep / totalSteps;

      audio.volume = from + (to - from) * progress;

      if (currentStep >= totalSteps) {
        window.clearInterval(intervalId);
        audioIntervalIdsRef.current = audioIntervalIdsRef.current.filter(
          (id) => id !== intervalId,
        );

        audio.volume = to;
        onComplete?.();
      }
    }, AUDIO_STEP_INTERVAL_MS);

    audioIntervalIdsRef.current.push(intervalId);
  };

  const alignInitialRoom = (roomId: RoomId) => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const roomIndex = activeRoomConfigs.findIndex((room) => room.id === roomId);

    if (roomIndex < 0) {
      return;
    }

    container.scrollTo({
      top: container.clientHeight * roomIndex,
      behavior: "auto",
    });
  };

  const getPreviewUiState = (
    roomId: RoomId,
    initialRoomIdValue: RoomId,
    firstEntryValue: boolean,
    swipeHintDismissedValue: boolean,
  ): RoomUiState =>
    firstEntryValue &&
    !swipeHintDismissedValue &&
    roomId === initialRoomIdValue
      ? "page_loaded_first_entry"
      : "idle_room_preview";

  useEffect(() => {
    hydrateTimerRef.current = window.setTimeout(() => {
      const lastEnteredRoomId = readLastEnteredRoomId();
      const storedRoomId = readStoredRoomId();
      const nextInitialRoomId = getInitialRoomId({
        lastEnteredRoomId,
        storedRoomId,
      });

      setInitialRoomId(nextInitialRoomId);
      setSwipeHintDismissed(readSwipeHintDismissed());
      setIsFirstEntry(!lastEnteredRoomId && !storedRoomId);
      setActiveRoomId(nextInitialRoomId);
      setUiState(
        getPreviewUiState(
          nextInitialRoomId,
          nextInitialRoomId,
          !lastEnteredRoomId && !storedRoomId,
          readSwipeHintDismissed(),
        ),
      );
      setIsHydrated(true);
    }, 0);

    return () => {
      clearTimer(hydrateTimerRef);
    };
  }, []);

  useEffect(() => {
    if (!isHydrated || hasAlignedInitialRoomRef.current) {
      return;
    }

    alignInitialRoom(activeRoomId);
    hasAlignedInitialRoomRef.current = true;
  }, [activeRoomId, isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    writeStoredRoomId(activeRoomId);
  }, [activeRoomId, isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    let cancelled = false;
    const image = new Image();

    image.onload = () => {
      if (cancelled) {
        return;
      }

      setVisualFailed(false);
    };

    image.onerror = () => {
      if (cancelled) {
        return;
      }

      setVisualFailed(true);
      setUiState("asset_visual_failed");
    };

    image.src = activeRoom.backgroundAsset;

    return () => {
      cancelled = true;
    };
  }, [activeRoom.backgroundAsset, isHydrated]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    clearAudioIntervals();

    if (!activeRoom.ambienceAsset) {
      if (currentAudioRef.current) {
        const previousAudio = currentAudioRef.current;
        currentAudioRef.current = null;

        rampAudioVolume(
          previousAudio,
          previousAudio.volume,
          0,
          AUDIO_CROSSFADE_DURATION_MS,
          () => {
            previousAudio.pause();
            previousAudio.src = "";
          },
        );
      }

      return;
    }

    const nextAudio = new Audio(activeRoom.ambienceAsset);
    const previousAudio = currentAudioRef.current;

    nextAudio.loop = true;
    nextAudio.preload = "auto";
    nextAudio.volume = 0;

    currentAudioRef.current = nextAudio;

    nextAudio
      .play()
      .then(() => {
        rampAudioVolume(
          nextAudio,
          0,
          TARGET_AMBIENCE_VOLUME,
          AUDIO_CROSSFADE_DURATION_MS,
        );

        if (previousAudio) {
          rampAudioVolume(
            previousAudio,
            previousAudio.volume,
            0,
            AUDIO_CROSSFADE_DURATION_MS,
            () => {
              previousAudio.pause();
              previousAudio.src = "";
            },
          );
        }
      })
      .catch(() => {
        currentAudioRef.current = previousAudio;
        nextAudio.src = "";
        setUiState("asset_audio_failed");
      });
  }, [activeRoom.ambienceAsset, isHydrated]);

  useEffect(() => {
    return () => {
      clearTimer(settleTimerRef);
      clearTimer(enterTimerRef);
      clearTimer(hydrateTimerRef);
      clearAudioIntervals();

      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.src = "";
      }
    };
  }, []);

  const dismissSwipeHint = () => {
    if (swipeHintDismissed) {
      return;
    }

    writeSwipeHintDismissed(true);
    setSwipeHintDismissed(true);
  };

  const handleScroll = () => {
    const container = scrollRef.current;

    if (!container || !isHydrated) {
      return;
    }

    clearTimer(settleTimerRef);
    setIsSwitching(true);
    setUiState("room_switching");
    dismissSwipeHint();

    settleTimerRef.current = window.setTimeout(() => {
      const nextRoomId = getClosestRoomId(container);

      setActiveRoomId(nextRoomId);
      setUiState(
        getPreviewUiState(
          nextRoomId,
          initialRoomId,
          isFirstEntry,
          readSwipeHintDismissed(),
        ),
      );
      setIsSwitching(false);
    }, SCROLL_SETTLE_DELAY_MS);
  };

  const enterTalk = (roomId: RoomId) => {
    if (
      !isHydrated ||
      isSwitching ||
      uiState === "talk_enter_transition" ||
      roomId !== activeRoomId
    ) {
      return;
    }

    const room = roomConfigMap[roomId];

    clearTimer(settleTimerRef);
    clearTimer(enterTimerRef);
    setUiState("talk_enter_transition");
    writeStoredRoomId(roomId);
    writeLastEnteredRoomId(roomId);
    writeStoredSceneId(room.talkSceneId);

    enterTimerRef.current = window.setTimeout(() => {
      startTransition(() => {
        router.push(`/talk?${sceneQueryParam}=${room.talkSceneId}`);
      });
    }, TALK_ENTER_DELAY_MS);
  };

  const handleSurfaceKeyDown = (
    roomId: RoomId,
    event: KeyboardEvent<HTMLElement>,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    enterTalk(roomId);
  };

  return (
    <section className={styles.page}>
      <div
        ref={scrollRef}
        className={styles.scrollViewport}
        onScroll={handleScroll}
        aria-label="Room preview"
      >
        {activeRoomConfigs.map((room) => {
          const isActive = room.id === activeRoomId;
          const canEnterRoom =
            isActive &&
            isHydrated &&
            !isSwitching &&
            uiState !== "talk_enter_transition";

          return (
            <article
              key={room.id}
              className={[
                styles.roomSection,
                canEnterRoom ? styles.roomSectionEnterable : "",
              ].join(" ")}
              role={isActive ? "button" : undefined}
              tabIndex={isActive ? 0 : -1}
              aria-label={
                canEnterRoom
                  ? `${room.title}. Tap to enter Talk.`
                  : `${room.title}. Swipe to continue exploring rooms.`
              }
              onClick={() => {
                enterTalk(room.id);
              }}
              onKeyDown={(event) => {
                handleSurfaceKeyDown(room.id, event);
              }}
            >
              <div className={styles.sceneFrame}>
                <div
                  className={[
                    styles.sceneVisual,
                    visualFailed && isActive ? styles.sceneVisualFallback : "",
                  ].join(" ")}
                  style={
                    visualFailed && isActive
                      ? undefined
                      : { backgroundImage: `url(${room.backgroundAsset})` }
                  }
                  aria-hidden="true"
                />

                <div className={styles.sceneShade} aria-hidden="true" />

                <div className={styles.motionLayer} aria-hidden="true">
                  <span
                    className={[
                      styles.motionBand,
                      motionBandClassMap[room.motionVariant],
                    ].join(" ")}
                  />
                  <span
                    className={[
                      styles.motionGlow,
                      motionGlowClassMap[room.motionVariant],
                    ].join(" ")}
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className={styles.bottomScrim} aria-hidden="true" />

      <div className={styles.infoLayer}>
        <div className={styles.infoCluster}>
          <div className={styles.titlePill}>
            <div className={styles.roomTitle}>{activeRoom.title}</div>
          </div>

          <div className={styles.ambienceTagRow}>
            {activeRoom.ambienceLabel.split(",").map((label) => (
              <span key={label.trim()} className={styles.ambienceTag}>
                {label.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.hintStack}>
          {showSwipeHint ? (
            <div className={styles.swipeHint}>
              <span className={styles.swipeChevron} />
              <span>Swipe to explore rooms</span>
            </div>
          ) : null}

          {showTapHint ? (
            <div className={styles.tapHintWrap}>
              <span className={styles.tapHintHighlight} aria-hidden="true" />
              <div className={styles.tapHint}>
                <span className={styles.tapHintBars} aria-hidden="true">
                  <span className={styles.tapHintBarShort} />
                  <span className={styles.tapHintBarTall} />
                  <span className={styles.tapHintBarMid} />
                </span>
                <span>Tap to enter</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
