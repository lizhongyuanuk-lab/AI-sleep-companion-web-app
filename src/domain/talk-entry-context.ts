import type { TalkEntryContext } from "../contracts";

export type TalkEntryContextValidationResult = {
  valid: boolean;
  missingFields: string[];
};

export function validateTalkEntryContext(
  context: TalkEntryContext,
): TalkEntryContextValidationResult {
  const missingFields: string[] = [];

  if (context.source === "room") {
    if (!context.roomId) missingFields.push("roomId");
    if (!context.roomSessionId) missingFields.push("roomSessionId");
  }

  if (context.source === "home" && !context.homeRecommendationId) {
    missingFields.push("homeRecommendationId");
  }

  if (context.source === "memory") {
    if (!context.sourceId) missingFields.push("sourceId");
    if (!context.memoryId) missingFields.push("memoryId");
  }

  if (
    context.source === "sleep" &&
    context.intent === "tonight_suggestion" &&
    !context.sleepInsightId
  ) {
    missingFields.push("sleepInsightId");
  }

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}

export function buildDirectTalkEntryContext(input: {
  now: TalkEntryContext["createdAt"];
  intent?: Extract<TalkEntryContext["intent"], "open_chat" | "gentle_start">;
}): TalkEntryContext {
  return {
    source: "direct",
    intent: input.intent ?? "open_chat",
    createdAt: input.now,
  };
}
