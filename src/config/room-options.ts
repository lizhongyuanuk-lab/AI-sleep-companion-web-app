import type { RoomOption } from "../contracts";

export const fixedRoomOptions: [RoomOption, RoomOption, RoomOption] = [
  {
    id: "room_quiet_01",
    title: "Quiet Room",
    description: "Low stimulation and a steadier pace.",
    preset: "quiet",
    stimulationLevel: "low",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "room_warm_01",
    title: "Warm Room",
    description: "A little more warmth and conversational presence.",
    preset: "warm",
    stimulationLevel: "medium",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "room_minimal_01",
    title: "Minimal Room",
    description: "Reduced visual and conversational noise.",
    preset: "minimal",
    stimulationLevel: "low",
    isActive: true,
    sortOrder: 3,
  },
];
