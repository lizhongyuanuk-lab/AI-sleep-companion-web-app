import type {
  ISODateTimeString,
  OnboardingPreset,
  RouteDecision,
  RouteDecisionRuntimeObservedPath,
} from "../contracts";

export type ResolveInitialRouteInput = {
  id: string;
  hasCompletedOnboarding: boolean;
  activeOnboardingPreset?: OnboardingPreset;
  now: ISODateTimeString;
  runtimeObservedPath?: RouteDecisionRuntimeObservedPath;
};

export function resolveInitialRoute(
  input: ResolveInitialRouteInput,
): RouteDecision {
  if (!input.hasCompletedOnboarding) {
    return {
      id: input.id,
      canonicalRoute: "/onboarding",
      reason: "onboarding_incomplete",
      runtimeObservedPath: input.runtimeObservedPath,
      hasCompletedOnboarding: false,
      activePresetState: "none",
      shouldRedirect: input.runtimeObservedPath !== "/onboarding",
      createdAt: input.now,
    };
  }

  const preset = input.activeOnboardingPreset;
  const activePresetState = getActivePresetState(preset, input.now);

  if (activePresetState === "active" && preset) {
    return {
      id: input.id,
      canonicalRoute: "/room",
      reason: "active_preset_redirect",
      runtimeObservedPath: input.runtimeObservedPath,
      hasCompletedOnboarding: true,
      activePresetId: preset.id,
      activePresetState,
      shouldRedirect: input.runtimeObservedPath !== "/room",
      createdAt: input.now,
    };
  }

  return {
    id: input.id,
    canonicalRoute: "/home",
    reason:
      activePresetState === "none"
        ? "returning_user_home"
        : "consumed_or_expired_preset_home",
    runtimeObservedPath: input.runtimeObservedPath,
    hasCompletedOnboarding: true,
    activePresetId: preset?.id,
    activePresetState,
    shouldRedirect: input.runtimeObservedPath !== "/home",
    createdAt: input.now,
  };
}

function getActivePresetState(
  preset: OnboardingPreset | undefined,
  now: ISODateTimeString,
): RouteDecision["activePresetState"] {
  if (!preset) return "none";
  if (preset.status === "consumed") return "consumed";
  if (preset.status === "expired") return "expired";

  const expiresAt = new Date(preset.expiresAt).getTime();
  const nowTime = new Date(now).getTime();

  if (!Number.isFinite(expiresAt) || expiresAt <= nowTime) {
    return "stale";
  }

  return "active";
}
