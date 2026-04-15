"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./talk-page.module.css";
import { defaultSceneId, sceneConfigs } from "./scene-config";
import {
  ChatIcon,
  ImageIcon,
  MemoryIcon,
  MicIcon,
  RoomIcon,
  SleepIcon,
} from "./talk-icons";

type TalkState =
  | "default"
  | "listening"
  | "listeningHint"
  | "typing"
  | "aiReply";

type StateCopy = {
  inputLabel: string;
  whisper: string;
};

const topTabs = [
  { href: "/talk", label: "Talk", icon: ChatIcon, isActive: true },
  { href: "/room", label: "Room", icon: RoomIcon, isActive: false },
  { href: "/memory", label: "Memory", icon: MemoryIcon, isActive: false },
  { href: "/sleep-monitoring", label: "Sleep", icon: SleepIcon, isActive: false },
] as const;

const stateCopy: Record<TalkState, StateCopy> = {
  default: {
    inputLabel: "Tap to speak",
    whisper: "The room is quiet and ready.",
  },
  listening: {
    inputLabel: "Listening...",
    whisper: "I'm listening.",
  },
  listeningHint: {
    inputLabel: "Tap to write",
    whisper: "You can switch to text whenever you want.",
  },
  typing: {
    inputLabel: "Tap to write",
    whisper: "A typing state can live here next.",
  },
  aiReply: {
    inputLabel: "Tap to speak",
    whisper: "A gentle voice reply would return here.",
  },
};

const sceneClassById = {
  seaside_day: styles.sceneSeasideDay,
  seaside_night: styles.sceneSeasideNight,
  rainforest_day: styles.sceneRainforestDay,
  snow_mountain_day: styles.sceneSnowMountainDay,
} as const;

const overlayClassByMode = {
  light: styles.sceneOverlayLight,
  dark: styles.sceneOverlayDark,
} as const;

export function TalkShell() {
  const [talkState, setTalkState] = useState<TalkState>("default");
  const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([]);
  const activeScene =
    sceneConfigs.find((scene) => scene.id === defaultSceneId) ?? sceneConfigs[0];

  const clearSequence = () => {
    timeoutIds.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    timeoutIds.current = [];
  };

  useEffect(() => {
    return () => {
      clearSequence();
    };
  }, []);

  const queueState = (nextState: TalkState, delayMs: number) => {
    const timeoutId = setTimeout(() => {
      setTalkState(nextState);
    }, delayMs);

    timeoutIds.current.push(timeoutId);
  };

  const enterListeningFlow = () => {
    clearSequence();
    setTalkState("listening");
    queueState("listeningHint", 1200);
    queueState("typing", 2800);
    queueState("aiReply", 4300);
  };

  const handlePrimaryAction = () => {
    if (talkState === "listeningHint") {
      clearSequence();
      setTalkState("typing");
      return;
    }

    enterListeningFlow();
  };

  const activeCopy = stateCopy[talkState];
  const isListening = talkState === "listening";

  return (
    <section className={styles.page}>
      <div
        className={[
          styles.sceneShell,
          sceneClassById[activeScene.id],
          overlayClassByMode[activeScene.overlayMode],
          isListening ? styles.sceneListening : "",
        ].join(" ")}
      >
        <h1 className={styles.srOnly}>Talk</h1>

        <nav aria-label="Primary navigation" className={styles.topTabs}>
          <ul className={styles.tabList}>
            {topTabs.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.href} className={styles.tabItem}>
                  <Link
                    href={item.href}
                    aria-label={item.label}
                    aria-current={item.isActive ? "page" : undefined}
                    className={[
                      styles.tabLink,
                      item.isActive ? styles.tabLinkActive : "",
                    ].join(" ")}
                  >
                    <Icon className={styles.tabIcon} />
                    <span aria-hidden="true" className={styles.tabLabel}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.roomScene} aria-hidden="true">
          <div className={styles.roomFrame}>
            <div className={styles.sceneWindow}>
              <div className={styles.sceneVista}>
                <div className={styles.sceneHaze} />
                <div className={styles.sceneAccentArc} />
                <div className={styles.sceneMountain} />
                <div className={styles.sceneWater} />
                <div className={styles.sceneWaveFront} />
                <div className={styles.sceneWaveBack} />
                <div className={styles.sceneForest} />
                <div className={styles.sceneMist} />
                <div className={styles.sceneMoonGlow} />
              </div>
            </div>

            <div className={styles.sceneBench} />
            <div className={styles.sceneDaybed} />
            <div className={styles.sceneSpeaker}>
              <div className={styles.sceneSpeakerFace} />
            </div>
            <div className={styles.sceneGlow} />
          </div>
        </div>

        <div className={styles.controlsWrap}>
          <p className={styles.whisperText}>{activeCopy.whisper}</p>

          <div className={styles.promptBar}>
            <button
              type="button"
              className={[
                styles.micButton,
                isListening ? styles.micButtonListening : "",
              ].join(" ")}
              aria-label="Start local listening demo"
              onClick={enterListeningFlow}
            >
              <MicIcon className={styles.micIcon} />
            </button>

            <button
              type="button"
              className={styles.promptPrimary}
              aria-label={activeCopy.inputLabel}
              onClick={handlePrimaryAction}
            >
              <span className={styles.promptText}>{activeCopy.inputLabel}</span>
            </button>

            <button
              type="button"
              className={styles.imageButton}
              aria-label="Image upload placeholder"
              title="Image upload placeholder"
            >
              <ImageIcon className={styles.imageIcon} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
