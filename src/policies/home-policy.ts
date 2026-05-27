import type { HomeRecommendation } from "../contracts";

export const homeRecommendationPriorityOrder: HomeRecommendation["type"][] = [
  "review_memory",
  "sleep_checkin",
  "tonight_suggestion",
  "start_talk",
];

export function selectPrimaryHomeRecommendation(
  recommendations: HomeRecommendation[],
): HomeRecommendation | undefined {
  return [...recommendations].sort(compareHomeRecommendations)[0];
}

function compareHomeRecommendations(
  left: HomeRecommendation,
  right: HomeRecommendation,
): number {
  if (right.priority !== left.priority) {
    return right.priority - left.priority;
  }

  return (
    homeRecommendationPriorityOrder.indexOf(left.type) -
    homeRecommendationPriorityOrder.indexOf(right.type)
  );
}
