import {
  defaultSceneId,
  sceneConfigMap,
  type SceneId,
} from "@/app/talk/scene-config";

export const sceneQueryParam = "scene";
export const sceneStorageKey = "ai-companion-web.active-scene";

export function resolveSceneId(value: string | null | undefined): SceneId | null {
  if (!value) {
    return null;
  }

  return value in sceneConfigMap ? (value as SceneId) : null;
}

export function getInitialSceneId(value: string | null | undefined): SceneId {
  return resolveSceneId(value) ?? defaultSceneId;
}

export function readStoredSceneId(): SceneId | null {
  if (typeof window === "undefined") {
    return null;
  }

  return resolveSceneId(window.localStorage.getItem(sceneStorageKey));
}

export function writeStoredSceneId(sceneId: SceneId) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(sceneStorageKey, sceneId);
}
