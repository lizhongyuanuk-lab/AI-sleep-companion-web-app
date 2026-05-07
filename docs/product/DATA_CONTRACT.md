# AI Sleep Companion Stage 3 Data Contract

## localStorage keys

- `ai_sleep_has_completed_onboarding`
- `ai_sleep_user_profile`
- `ai_sleep_companion_profile`
- `ai_sleep_room_state`
- `ai_sleep_memories`
- `ai_sleep_sessions`

## TypeScript models

```ts
type UserSleepProfile = {
  id: string;
  sleepGoal: "fall_asleep" | "reduce_anxiety" | "build_routine" | "companionship";
  usualSleepTime: string;
  wakeTime: string;
  mainDifficulty: string[];
  preferredCompanionTone: "gentle" | "quiet" | "warm" | "playful";
  createdAt: string;
  updatedAt: string;
};

type CompanionProfile = {
  id: string;
  name: string;
  tone: "gentle" | "quiet" | "warm" | "playful";
  relationshipStage: "new" | "familiar" | "trusted";
  greeting: string;
  createdAt: string;
  updatedAt: string;
};

type RoomState = {
  id: string;
  companionMood: "calm" | "attentive" | "sleepy";
  currentPhase: "day" | "evening" | "pre_sleep" | "sleep";
  suggestedAction: "talk" | "start_sleep" | "reflect" | "review_memory";
  lastUpdatedAt: string;
};

type MemoryItem = {
  id: string;
  type: "preference" | "routine" | "emotion_pattern" | "companion_note";
  content: string;
  confidence: number;
  source: "onboarding" | "chat" | "sleep_session";
  createdAt: string;
  updatedAt: string;
};

type SleepSession = {
  id: string;
  startedAt: string;
  endedAt?: string;
  moodBefore?: "calm" | "anxious" | "tired" | "restless";
  selectedRoutine?: "breathing" | "story" | "ambient" | "companion_chat";
  status: "active" | "completed" | "abandoned";
};
```

## Contract notes

- All Stage 3 data is local-only and deterministic.
- The contract is resettable and must tolerate missing or malformed persisted values.
- Talk mock messages are runtime-only for this stage and are not part of the persisted contract above.

