import type {
  HomeEntryContext,
  HomeRecommendation,
  HomeState,
  ISODateTimeString,
} from "../contracts";
import { selectPrimaryHomeRecommendation } from "../policies";

export type BuildHomeExperienceInput = {
  id: string;
  entryContext: HomeEntryContext;
  recommendations: HomeRecommendation[];
  now: ISODateTimeString;
};

export type HomeExperience = {
  state: HomeState;
  recommendation: HomeRecommendation;
};

export function buildHomeExperience(
  input: BuildHomeExperienceInput,
): HomeExperience {
  const recommendation = selectPrimaryHomeRecommendation(input.recommendations);

  if (!recommendation) {
    throw new Error(
      "buildHomeExperience requires an explicit fallback recommendation.",
    );
  }

  return {
    state: {
      id: input.id,
      route: "/home",
      status:
        recommendation.fallbackKind === "none"
          ? "recommendation_ready"
          : "fallback_ready",
      continuitySource:
        recommendation.sourceDomain === "system"
          ? "none"
          : recommendation.sourceDomain,
      entryContextId: input.entryContext.id,
      mainRecommendationId: recommendation.id,
      mainCtaId: recommendation.cta.id,
      createdAt: input.now,
    },
    recommendation,
  };
}
