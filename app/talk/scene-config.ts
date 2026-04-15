export type OverlayMode = "light" | "dark";

export type SceneConfig = {
  id:
    | "seaside_night"
    | "seaside_day"
    | "rainforest_day"
    | "snow_mountain_day";
  title: string;
  image: string;
  overlayMode: OverlayMode;
};

export const sceneConfigs: SceneConfig[] = [
  {
    id: "seaside_night",
    title: "Seaside Night",
    image: "/scenes/seaside-night.jpg",
    overlayMode: "dark",
  },
  {
    id: "seaside_day",
    title: "Seaside Day",
    image: "/scenes/seaside-day.jpg",
    overlayMode: "light",
  },
  {
    id: "rainforest_day",
    title: "Rainforest Day",
    image: "/scenes/rainforest-day.jpg",
    overlayMode: "dark",
  },
  {
    id: "snow_mountain_day",
    title: "Snow Mountain Day",
    image: "/scenes/snow-mountain-day.jpg",
    overlayMode: "light",
  },
];

export const defaultSceneId = "seaside_day";
