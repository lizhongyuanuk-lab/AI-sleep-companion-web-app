import type { SceneId } from "@/app/talk/scene-config";

export type RoomId =
  | "moon_tide"
  | "sea_light"
  | "canopy_mist"
  | "alpine_quiet"
  | "harbor_hush"
  | "snowfall_hush";

export type RoomAmbienceType =
  | "white_noise"
  | "light_music"
  | "nature"
  | "mixed";

export type RoomStimulationLevel = "very_low" | "low" | "medium_low";

export type RoomMoodProfile =
  | "calming"
  | "safe"
  | "quiet"
  | "companion_like";

export type RoomVisualTone = "dark" | "warm" | "cool" | "neutral";

export type RoomMotionVariant =
  | "moon"
  | "shore"
  | "canopy"
  | "alpine"
  | "harbor"
  | "snowfall";

export type RoomConfig = {
  id: RoomId;
  title: string;
  ambienceLabel: string;
  backgroundAsset: string;
  ambienceAsset: string | null;
  ambienceType: RoomAmbienceType;
  stimulationLevel: RoomStimulationLevel;
  moodProfile: RoomMoodProfile;
  visualTone: RoomVisualTone;
  recommendedFor: string[];
  sortOrder: number;
  isActive: boolean;
  motionVariant: RoomMotionVariant;
  talkSceneId: SceneId;
};

// Audio assets are intentionally nullable for the current placeholder phase.
// The runtime treats null as a silent fallback while preserving the preview flow.
export const roomConfigs: RoomConfig[] = [
  {
    id: "moon_tide",
    title: "Moon Tide",
    ambienceLabel: "Night tide, soft waves",
    backgroundAsset: "/scenes/seaside-night-room.png",
    ambienceAsset: null,
    ambienceType: "nature",
    stimulationLevel: "very_low",
    moodProfile: "quiet",
    visualTone: "cool",
    recommendedFor: ["night", "ocean", "quiet"],
    sortOrder: 1,
    isActive: true,
    motionVariant: "moon",
    talkSceneId: "seaside_night",
  },
  {
    id: "sea_light",
    title: "Sea Light",
    ambienceLabel: "Sea air, light shimmer",
    backgroundAsset: "/scenes/seaside-day-room.png",
    ambienceAsset: null,
    ambienceType: "light_music",
    stimulationLevel: "low",
    moodProfile: "safe",
    visualTone: "warm",
    recommendedFor: ["bright", "airy", "morning"],
    sortOrder: 2,
    isActive: true,
    motionVariant: "shore",
    talkSceneId: "seaside_day",
  },
  {
    id: "canopy_mist",
    title: "Canopy Mist",
    ambienceLabel: "Leaf hush, mist rain",
    backgroundAsset: "/scenes/rainforest-day-room.png",
    ambienceAsset: null,
    ambienceType: "nature",
    stimulationLevel: "low",
    moodProfile: "calming",
    visualTone: "neutral",
    recommendedFor: ["forest", "grounded", "soft rain"],
    sortOrder: 3,
    isActive: true,
    motionVariant: "canopy",
    talkSceneId: "rainforest_day",
  },
  {
    id: "alpine_quiet",
    title: "Alpine Quiet",
    ambienceLabel: "Cold wind, soft white noise",
    backgroundAsset: "/scenes/snow-mountain-day-room.png",
    ambienceAsset: null,
    ambienceType: "white_noise",
    stimulationLevel: "very_low",
    moodProfile: "quiet",
    visualTone: "cool",
    recommendedFor: ["snow", "clarity", "wind"],
    sortOrder: 4,
    isActive: true,
    motionVariant: "alpine",
    talkSceneId: "snow_mountain_day",
  },
  {
    id: "harbor_hush",
    title: "Harbor Hush",
    ambienceLabel: "Harbor air, distant water",
    backgroundAsset: "/scenes/seaside-night-room.png",
    ambienceAsset: null,
    ambienceType: "mixed",
    stimulationLevel: "very_low",
    moodProfile: "companion_like",
    visualTone: "dark",
    recommendedFor: ["night", "safe", "harbor"],
    sortOrder: 5,
    isActive: true,
    motionVariant: "harbor",
    talkSceneId: "seaside_night",
  },
  {
    id: "snowfall_hush",
    title: "Snowfall Hush",
    ambienceLabel: "Snow drift, low wind",
    backgroundAsset: "/scenes/snow-mountain-day-room.png",
    ambienceAsset: null,
    ambienceType: "mixed",
    stimulationLevel: "very_low",
    moodProfile: "safe",
    visualTone: "neutral",
    recommendedFor: ["winter", "soft", "stillness"],
    sortOrder: 6,
    isActive: true,
    motionVariant: "snowfall",
    talkSceneId: "snow_mountain_day",
  },
];

export const defaultRoomId: RoomId = "alpine_quiet";

export const activeRoomConfigs = roomConfigs
  .filter((room) => room.isActive)
  .sort((left, right) => left.sortOrder - right.sortOrder);

export const roomConfigMap = Object.fromEntries(
  activeRoomConfigs.map((room) => [room.id, room]),
) as Record<RoomId, RoomConfig>;
