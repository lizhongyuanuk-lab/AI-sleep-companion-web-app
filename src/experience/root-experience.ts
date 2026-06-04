import type {
  ISODateTimeString,
  OnboardingDraft,
  OnboardingPreset,
  RouteDecision,
  RouteDecisionRuntimeObservedPath,
} from "../contracts";
import { resolveInitialRoute } from "../domain";
import { stage5LocalDataNotice } from "../local-data";

export type FirstLaunchCompatibilityExperience = {
  routeDecision: RouteDecision;
  draft: OnboardingDraft | null;
  activePreset: OnboardingPreset | null;
  canonicalHomePath: "/home";
  runtimeObservedPath: RouteDecisionRuntimeObservedPath;
  localDataBoundaryLabel: string;
};

export function buildFirstLaunchCompatibilityExperience(input: {
  id: string;
  hasCompletedOnboarding: boolean;
  activeOnboardingPreset?: OnboardingPreset | null;
  draft?: OnboardingDraft | null;
  now: ISODateTimeString;
  runtimeObservedPath?: RouteDecisionRuntimeObservedPath;
}): FirstLaunchCompatibilityExperience {
  const runtimeObservedPath = input.runtimeObservedPath ?? "/";

  return {
    routeDecision: resolveInitialRoute({
      id: input.id,
      hasCompletedOnboarding: input.hasCompletedOnboarding,
      activeOnboardingPreset: input.activeOnboardingPreset ?? undefined,
      now: input.now,
      runtimeObservedPath,
    }),
    draft: input.draft ?? null,
    activePreset: input.activeOnboardingPreset ?? null,
    canonicalHomePath: "/home",
    runtimeObservedPath,
    localDataBoundaryLabel: stage5LocalDataNotice,
  };
}
