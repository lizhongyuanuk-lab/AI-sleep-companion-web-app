export type WhiteNoiseType = "room_default" | "rain" | "ocean" | "wind";

export type SoundMixPreset = "balanced" | "voice_focus" | "deep_sleep";

export type SoundDefaults = {
  voiceVolume: number;
  bgmVolume: number;
  whiteNoiseVolume: number;
  whiteNoiseType: WhiteNoiseType;
  soundMixPreset: SoundMixPreset;
};

export type SceneId =
  | "seaside_night"
  | "seaside_day"
  | "rainforest_day"
  | "snow_mountain_day";

export type SceneConfig = {
  id: SceneId;
  image: string;
  eyebrow: string;
  title: string;
  summary: string;
  roomName: string;
  backgroundAsset: string;
  voiceProfileId: string;
  soundDefaults: SoundDefaults;
  uiShellTokenSetId?: string;
};

export const sceneConfigs: SceneConfig[] = [
  {
    id: "seaside_night",
    image: "/scenes/seaside-night.svg",
    eyebrow: "Moon Tide",
    title: "Seaside Night",
    summary: "Soft moonlight, cool walls, and a shoreline horizon that keeps the room slow.",
    roomName: "Seaside Night",
    backgroundAsset: "/scenes/seaside-night.svg",
    voiceProfileId: "luna-whisper",
    soundDefaults: {
      voiceVolume: 70,
      bgmVolume: 35,
      whiteNoiseVolume: 45,
      whiteNoiseType: "ocean",
      soundMixPreset: "balanced",
    },
    uiShellTokenSetId: "warm-single-mode",
  },
  {
    id: "seaside_day",
    image: "/scenes/seaside-day.svg",
    eyebrow: "Sea Light",
    title: "Seaside Day",
    summary: "Warm plaster, pale linen, and a bright horizon that keeps the page breathable.",
    roomName: "Seaside Day",
    backgroundAsset: "/scenes/seaside-day.svg",
    voiceProfileId: "sola-warm",
    soundDefaults: {
      voiceVolume: 70,
      bgmVolume: 35,
      whiteNoiseVolume: 45,
      whiteNoiseType: "room_default",
      soundMixPreset: "balanced",
    },
    uiShellTokenSetId: "warm-single-mode",
  },
  {
    id: "rainforest_day",
    image: "/scenes/rainforest-day.svg",
    eyebrow: "Canopy Mist",
    title: "Rainforest Day",
    summary: "Muted stone, green fog, and a low canopy hush that makes the shell feel grounded.",
    roomName: "Rainforest Day",
    backgroundAsset: "/scenes/rainforest-day.svg",
    voiceProfileId: "moss-calm",
    soundDefaults: {
      voiceVolume: 70,
      bgmVolume: 30,
      whiteNoiseVolume: 48,
      whiteNoiseType: "rain",
      soundMixPreset: "deep_sleep",
    },
    uiShellTokenSetId: "warm-single-mode",
  },
  {
    id: "snow_mountain_day",
    image: "/scenes/snow-mountain-day.svg",
    eyebrow: "Alpine Quiet",
    title: "Snow Mountain Day",
    summary: "Pale room tones and a distant ridge that keeps the atmosphere crisp and uncluttered.",
    roomName: "Snow Mountain Day",
    backgroundAsset: "/scenes/snow-mountain-day-room.png",
    voiceProfileId: "alba-soft",
    soundDefaults: {
      voiceVolume: 70,
      bgmVolume: 32,
      whiteNoiseVolume: 40,
      whiteNoiseType: "wind",
      soundMixPreset: "voice_focus",
    },
    uiShellTokenSetId: "warm-single-mode",
  },
];

export const defaultSceneId: SceneId = "snow_mountain_day";

export const sceneIds = sceneConfigs.map((scene) => scene.id);

export const sceneConfigMap = Object.fromEntries(
  sceneConfigs.map((scene) => [scene.id, scene]),
) as Record<SceneId, SceneConfig>;
