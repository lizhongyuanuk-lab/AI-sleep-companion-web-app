"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { sceneConfigs, type SceneId } from "@/app/talk/scene-config";
import {
  getInitialSceneId,
  readStoredSceneId,
  sceneQueryParam,
  writeStoredSceneId,
} from "@/lib/scene-selection";
import styles from "./room-page.module.css";

export default function RoomPage() {
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSceneId, setActiveSceneId] = useState<SceneId>(() =>
    getInitialSceneId(readStoredSceneId()),
  );

  useEffect(() => {
    writeStoredSceneId(activeSceneId);
  }, [activeSceneId]);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const activeIndex = sceneConfigs.findIndex((scene) => scene.id === activeSceneId);

    if (activeIndex < 0) {
      return;
    }

    const activeSlide = container.children.item(activeIndex) as HTMLElement | null;

    if (!activeSlide) {
      return;
    }

    activeSlide.scrollIntoView({ block: "nearest" });
  }, [activeSceneId]);

  const handleScroll = () => {
    const container = scrollRef.current;

    if (!container) {
      return;
    }

    const containerCenter = container.scrollTop + container.clientHeight / 2;
    let nearestSceneId = activeSceneId;
    let smallestDistance = Number.POSITIVE_INFINITY;

    Array.from(container.children).forEach((child, index) => {
      const element = child as HTMLElement;
      const elementCenter = element.offsetTop + element.offsetHeight / 2;
      const distance = Math.abs(containerCenter - elementCenter);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        nearestSceneId = sceneConfigs[index]?.id ?? nearestSceneId;
      }
    });

    if (nearestSceneId !== activeSceneId) {
      setActiveSceneId(nearestSceneId);
    }
  };

  const openTalkScene = (sceneId: SceneId) => {
    writeStoredSceneId(sceneId);
    router.push(`/talk?${sceneQueryParam}=${sceneId}`);
  };

  return (
    <section className={styles.page}>
      <div className={styles.topCopy}>
        <span className={styles.eyebrow}>Scene Picker</span>
        <h1 className={styles.title}>Choose the room you want to return to.</h1>
        <p className={styles.description}>
          Scroll vertically, stay with one scene at a time, then tap to enter Talk.
        </p>
      </div>

      <div ref={scrollRef} className={styles.scroller} onScroll={handleScroll}>
        {sceneConfigs.map((scene) => {
          const isActive = scene.id === activeSceneId;

          return (
            <article
              key={scene.id}
              className={[styles.slide, isActive ? styles.slideActive : ""].join(" ")}
            >
              <button
                type="button"
                className={styles.sceneButton}
                onClick={() => {
                  if (!isActive) {
                    setActiveSceneId(scene.id);
                    return;
                  }

                  openTalkScene(scene.id);
                }}
              >
                <div
                  className={styles.sceneImage}
                  style={{ backgroundImage: `url(${scene.image})` }}
                  aria-hidden="true"
                />
                <div className={styles.sceneOverlay} aria-hidden="true" />
                <div className={styles.sceneContent}>
                  <span className={styles.sceneEyebrow}>{scene.eyebrow}</span>
                  <h2 className={styles.sceneTitle}>{scene.title}</h2>
                  <p className={styles.sceneSummary}>{scene.summary}</p>
                  <span className={styles.sceneAction}>
                    {isActive ? "Enter Talk" : "Tap to select"}
                  </span>
                </div>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
