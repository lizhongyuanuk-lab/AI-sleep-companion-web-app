"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./talk-page.module.css";
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
  eyebrow: string;
  title: string;
  body: string;
  prompt: string;
};

const topTabs = [
  { href: "/talk", label: "Chat", icon: ChatIcon, isActive: true },
  { href: "/memory", label: "Memory", icon: MemoryIcon, isActive: false },
  {
    href: "/sleep-monitoring",
    label: "Sleep Monitoring",
    icon: SleepIcon,
    isActive: false,
  },
  { href: "/room", label: "Room", icon: RoomIcon, isActive: false },
] as const;

const demoStates: TalkState[] = [
  "default",
  "listening",
  "listeningHint",
  "typing",
  "aiReply",
];

const stateCopy: Record<TalkState, StateCopy> = {
  default: {
    eyebrow: "Ready",
    title: "A quiet opening moment",
    body: "The page is idle and waiting. Tap the microphone to begin the local demo flow.",
    prompt: "Tap to speak",
  },
  listening: {
    eyebrow: "Listening",
    title: "Holding space for your voice",
    body: "This is a local shell state only. The room softens and the microphone becomes active while we simulate listening.",
    prompt: "Listening...",
  },
  listeningHint: {
    eyebrow: "Hint",
    title: "A gentle speaking cue",
    body: "Use this moment for a short hint or prompt. No transcript is stored and no service call is made.",
    prompt: "Tell me how your day felt",
  },
  typing: {
    eyebrow: "Thinking",
    title: "Companion is composing",
    body: "The interface is simulating a lightweight thinking state before an eventual reply shell appears.",
    prompt: "Companion is thinking...",
  },
  aiReply: {
    eyebrow: "Reply",
    title: "Response shell is ready",
    body: "A future version can render structured reply content here. For now we only surface a calm ready state.",
    prompt: "Tap to continue",
  },
};

export function TalkShell() {
  const [talkState, setTalkState] = useState<TalkState>("default");
  const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([]);

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

  const runListeningSequence = () => {
    clearSequence();
    setTalkState("listening");
    queueState("listeningHint", 1700);
    queueState("typing", 3300);
    queueState("aiReply", 5000);
  };

  const setManualState = (nextState: TalkState) => {
    clearSequence();
    setTalkState(nextState);
  };

  const activeCopy = stateCopy[talkState];
  const isListening = talkState === "listening";
  const isTyping = talkState === "typing";
  const isReply = talkState === "aiReply";

  return (
    <section className={styles.page}>
      <div
        className={[
          styles.sceneShell,
          isListening ? styles.sceneListening : "",
          isTyping ? styles.sceneTyping : "",
          isReply ? styles.sceneReply : "",
        ].join(" ")}
      >
        <h1 className={styles.srOnly}>Talk</h1>

        <nav aria-label="Talk tabs" className={styles.topTabs}>
          <ul className={styles.tabList}>
            {topTabs.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.href} className={styles.tabItem}>
                  <Link
                    href={item.href}
                    aria-current={item.isActive ? "page" : undefined}
                    className={[
                      styles.tabLink,
                      item.isActive ? styles.tabLinkActive : "",
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

        <div className={styles.statusCard}>
          <span className={styles.statusEyebrow}>{activeCopy.eyebrow}</span>
          <div className={styles.statusTextBlock}>
            <p className={styles.statusTitle}>{activeCopy.title}</p>
            <p className={styles.statusBody}>{activeCopy.body}</p>
          </div>
        </div>

        <div className={styles.roomScene} aria-hidden="true">
          <div className={styles.windowFrame}>
            <div className={styles.windowInner}>
              <div className={styles.sky} />
              <div className={styles.horizonGlow} />
              <div className={styles.sea} />
              <div className={styles.waveFront} />
              <div className={styles.waveBack} />
              <div className={styles.shoreline} />
            </div>
          </div>

          <div className={styles.windowSeat}>
            <div className={styles.speaker}>
              <div className={styles.speakerHandle} />
              <div className={styles.speakerDial} />
            </div>
          </div>

          <div className={styles.floorGlow} />
          <div className={styles.daybed} />
        </div>

        <div className={styles.controlsWrap}>
          <div className={styles.demoControls}>
            <span className={styles.demoLabel}>Demo</span>
            <div className={styles.demoButtons}>
              {demoStates.map((demoState) => (
                <button
                  key={demoState}
                  type="button"
                  className={[
                    styles.demoButton,
                    talkState === demoState ? styles.demoButtonActive : "",
                  ].join(" ")}
                  onClick={() => setManualState(demoState)}
                >
                  {demoState}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.promptBar}>
            <button
              type="button"
              className={[
                styles.promptIconButton,
                isListening ? styles.promptIconButtonActive : "",
              ].join(" ")}
              aria-label="Start local listening demo"
              onClick={runListeningSequence}
            >
              <MicIcon className={styles.promptIcon} />
            </button>
            <span className={styles.promptText}>{activeCopy.prompt}</span>
            <button
              type="button"
              className={styles.promptIconButton}
              aria-label="Reset talk state"
              onClick={() => setManualState("default")}
            >
              <ImageIcon className={styles.promptIcon} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
