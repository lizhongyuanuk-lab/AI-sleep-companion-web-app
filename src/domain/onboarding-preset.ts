import type {
  ISODateTimeString,
  OnboardingPreset,
  RouteDecisionActivePresetState,
} from "../contracts";

export function getOnboardingPresetRouteState(
  preset: OnboardingPreset | undefined,
  now: ISODateTimeString,
): RouteDecisionActivePresetState {
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

export function isActiveUnexpiredOnboardingPreset(
  preset: OnboardingPreset | undefined,
  now: ISODateTimeString,
): preset is OnboardingPreset {
  return getOnboardingPresetRouteState(preset, now) === "active";
}
