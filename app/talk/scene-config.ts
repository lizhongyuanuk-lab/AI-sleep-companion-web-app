export type OverlayMode = "light" | "dark";

export type SceneId =
  | "seaside_night"
  | "seaside_day"
  | "rainforest_day"
  | "snow_mountain_day";

export type SceneConfig = {
  id: SceneId;
  title: string;
  eyebrow: string;
  summary: string;
  roomFocus: string;
  image: string;
  overlayMode: OverlayMode;
};

export const sceneConfigs: SceneConfig[] = [
  {
    id: "seaside_night",
    title: "Seaside Night",
    eyebrow: "Moon Tide",
    summary: "Soft moonlight, cool walls, and still water at the window.",
    roomFocus: "Night retreat with a quiet shoreline glow.",
    image: "/scenes/seaside-night.svg",
    overlayMode: "dark",
  },
  {
    id: "seaside_day",
    title: "Seaside Day",
    eyebrow: "Sea Light",
    summary: "Warm plaster, pale floor, and a bright ocean line beyond the room.",
    roomFocus: "Airy daytime room with a calm coastal horizon.",
    image: "/scenes/seaside-day.svg",
    overlayMode: "light",
  },
  {
    id: "rainforest_day",
    title: "Rainforest Day",
    eyebrow: "Canopy Mist",
    summary: "Arched window, quiet stone walls, and soft jungle haze.",
    roomFocus: "Grounded room framed by misty rainforest light.",
    image: "/scenes/rainforest-day.svg",
    overlayMode: "dark",
  },
  {
    id: "snow_mountain_day",
    title: "Snow Mountain Day",
    eyebrow: "Alpine Quiet",
    summary: "Pale room tones and a distant mountain peak held inside the frame.",
    roomFocus: "Bright alpine room with a crisp mountain focal point.",
    image: "/scenes/snow-mountain-day.svg",
    overlayMode: "light",
  },
];

export const defaultSceneId: SceneId = "seaside_day";

export const sceneIds = sceneConfigs.map((scene) => scene.id);

export const sceneConfigMap = Object.fromEntries(
  sceneConfigs.map((scene) => [scene.id, scene]),
) as Record<SceneId, SceneConfig>;
