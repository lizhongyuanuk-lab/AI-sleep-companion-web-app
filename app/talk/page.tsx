import { TalkShell } from "./talk-shell";

export default async function TalkPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const sceneParam = resolvedSearchParams?.scene;
  const initialSceneParam = Array.isArray(sceneParam) ? sceneParam[0] : sceneParam;

  return <TalkShell initialSceneParam={initialSceneParam} key={initialSceneParam ?? "default"} />;
}
