import type {
  HomeCTA,
  HomeEntryContext,
  HomeRecommendation,
  MemoryItem,
  RoomState,
  RouteDecision,
  SleepCheckIn,
  CompanionConversation,
} from "../../contracts";
import {
  createDefaultHomeEntryContext,
  createDefaultHomeRecommendation,
  createDefaultRouteDecision,
  type Stage3LocalDataState,
} from "./defaults";

function isPresetStale(expiresAt: string, now: string): boolean {
  const expiresAtMs = Date.parse(expiresAt);
  const nowMs = Date.parse(now);

  if (Number.isNaN(expiresAtMs) || Number.isNaN(nowMs)) {
    return true;
  }

  return expiresAtMs <= nowMs;
}

function getDerivedPresetState(
  state: Stage3LocalDataState,
  now: string,
): RouteDecision["activePresetState"] {
  const preset = state.onboarding.activePreset;

  if (!preset) {
    return "none";
  }

  if (preset.status === "consumed") {
    return "consumed";
  }

  if (preset.status === "expired") {
    return "expired";
  }

  return isPresetStale(preset.expiresAt, now) ? "stale" : "active";
}

function getHomePresetState(
  state: Stage3LocalDataState,
  now: string,
): HomeEntryContext["activePresetState"] {
  const presetState = getDerivedPresetState(state, now);
  return presetState === "active" ? "active_redirect" : presetState;
}

function isEligibleMemory(memory: MemoryItem): boolean {
  return (
    (memory.status === "active" || memory.status === "weakened") &&
    memory.excludeFromPersonalization !== true
  );
}

function byNewestUpdatedAt(a: { updatedAt?: string }, b: { updatedAt?: string }): number {
  const left = a.updatedAt ?? "";
  const right = b.updatedAt ?? "";
  return right.localeCompare(left);
}

export function isFirstLaunch(state: Stage3LocalDataState): boolean {
  return (
    !hasCompletedOnboarding(state) &&
    state.onboarding.state.status === "not_started"
  );
}

export function hasCompletedOnboarding(state: Stage3LocalDataState): boolean {
  return (
    state.userProfile.hasCompletedOnboarding ||
    state.onboarding.state.status === "completed"
  );
}

export function hasActivePreset(
  state: Stage3LocalDataState,
  now = new Date().toISOString(),
): boolean {
  return getDerivedPresetState(state, now) === "active";
}

export function getRouteDecision(
  state: Stage3LocalDataState,
  now = new Date().toISOString(),
): RouteDecision {
  const existing = state.home.routeDecision ?? createDefaultRouteDecision(now);
  const completedOnboarding = hasCompletedOnboarding(state);
  const activePresetState = getDerivedPresetState(state, now);

  if (!completedOnboarding) {
    return {
      ...existing,
      canonicalRoute: "/onboarding",
      reason: "onboarding_incomplete",
      hasCompletedOnboarding: false,
      activePresetId: undefined,
      activePresetState: "none",
      shouldRedirect: existing.runtimeObservedPath !== "/onboarding",
    };
  }

  if (activePresetState === "active") {
    return {
      ...existing,
      canonicalRoute: "/room",
      reason: "active_preset_redirect",
      hasCompletedOnboarding: true,
      activePresetId: state.onboarding.activePreset?.id,
      activePresetState,
      shouldRedirect: existing.runtimeObservedPath !== "/room",
    };
  }

  return {
    ...existing,
    canonicalRoute: "/home",
    reason:
      activePresetState === "consumed" ||
      activePresetState === "expired" ||
      activePresetState === "stale"
        ? "consumed_or_expired_preset_home"
        : "returning_user_home",
    hasCompletedOnboarding: true,
    activePresetId:
      activePresetState === "none" ? undefined : state.onboarding.activePreset?.id,
    activePresetState,
    shouldRedirect: existing.runtimeObservedPath !== "/home",
  };
}

export function getEligibleVisibleMemory(
  state: Stage3LocalDataState,
): MemoryItem | undefined {
  return [...state.memory.items].filter(isEligibleMemory).sort(byNewestUpdatedAt)[0];
}

export function getLatestSleepCheckIn(
  state: Stage3LocalDataState,
): SleepCheckIn | undefined {
  return state.sleep.latestCheckIn;
}

export function getHomeEntryContext(
  state: Stage3LocalDataState,
  now = new Date().toISOString(),
): HomeEntryContext {
  const routeDecision = getRouteDecision(state, now);
  const existing = state.home.entryContext ?? createDefaultHomeEntryContext(now, routeDecision);
  const recommendation = state.home.recommendation;
  const missingDataKeys = getMissingDataKeys(state);
  const staleDataKeys = getStaleDataKeys(state, now);

  return {
    ...existing,
    routeDecisionId: routeDecision.id,
    routeDecisionReason: routeDecision.reason,
    canonicalHomePath: "/home",
    runtimeObservedPath:
      existing.runtimeObservedPath ??
      (routeDecision.runtimeObservedPath === "/" ||
      routeDecision.runtimeObservedPath === "/home"
        ? routeDecision.runtimeObservedPath
        : undefined),
    sourceRecommendationId: recommendation?.id,
    sourceRecommendationType: recommendation?.type,
    latestTalkSessionId: state.conversation.latestConversation?.id,
    latestRoomSessionId: state.room.latestRoomSession?.id,
    latestSleepInsightId: state.sleep.latestInsight?.id,
    latestSleepCheckInId: state.sleep.latestCheckIn?.id,
    eligibleMemoryId: getEligibleVisibleMemory(state)?.id,
    missingDataKeys,
    staleDataKeys,
    activePresetState: getHomePresetState(state, now),
  };
}

export function getPrimaryHomeRecommendation(
  state: Stage3LocalDataState,
  now = new Date().toISOString(),
): HomeRecommendation {
  const recommendation = state.home.recommendation;

  if (!recommendation) {
    return createDefaultHomeRecommendation(now);
  }

  if (
    recommendation.source === "memory" &&
    !getEligibleVisibleMemory(state)
  ) {
    return createDefaultHomeRecommendation(now);
  }

  if (
    recommendation.source === "sleep_insight" &&
    !state.sleep.latestInsight?.homeEligible
  ) {
    return createDefaultHomeRecommendation(now);
  }

  if (recommendation.source === "sleep_log" && !state.sleep.latestCheckIn) {
    return createDefaultHomeRecommendation(now);
  }

  if (recommendation.source === "room_session" && !state.room.latestRoomSession) {
    return createDefaultHomeRecommendation(now);
  }

  if (
    recommendation.source === "talk_session" &&
    !state.conversation.latestConversation
  ) {
    return createDefaultHomeRecommendation(now);
  }

  return recommendation;
}

export function getHomeCTA(
  state: Stage3LocalDataState,
  now = new Date().toISOString(),
): HomeCTA {
  return getPrimaryHomeRecommendation(state, now).cta;
}

export function getRoomContinuity(
  state: Stage3LocalDataState,
): RoomState | undefined {
  return state.room.latestRoomState;
}

export function getConversationContinuity(
  state: Stage3LocalDataState,
): CompanionConversation | undefined {
  return state.conversation.latestConversation;
}

export function getMissingDataKeys(
  state: Stage3LocalDataState,
): HomeEntryContext["missingDataKeys"] {
  const existing = state.home.entryContext?.missingDataKeys ?? [];
  const derived = [...existing];

  if (!state.conversation.latestConversation) {
    derived.push("latest_talk_session");
  }

  if (!state.room.latestRoomSession) {
    derived.push("latest_room_session");
  }

  if (!state.sleep.latestCheckIn) {
    derived.push("latest_sleep_check_in");
  }

  if (!state.sleep.latestInsight) {
    derived.push("latest_sleep_insight");
  }

  if (!getEligibleVisibleMemory(state)) {
    derived.push("eligible_memory");
  }

  if (!state.home.recommendation) {
    derived.push("source_recommendation");
  }

  if (!state.home.routeDecision && !state.userProfile.anonymousId) {
    derived.push("route_decision");
  }

  return Array.from(new Set(derived));
}

export function getStaleDataKeys(
  state: Stage3LocalDataState,
  now = new Date().toISOString(),
): HomeEntryContext["staleDataKeys"] {
  const derived = [...(state.home.entryContext?.staleDataKeys ?? [])];

  if (getDerivedPresetState(state, now) === "stale") {
    derived.push("active_onboarding_preset");
  }

  return Array.from(new Set(derived));
}
