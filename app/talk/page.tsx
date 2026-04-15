import { PagePlaceholder } from "@/components/page-placeholder";

export default function TalkPage() {
  return (
    <PagePlaceholder
      eyebrow="Talk"
      title="Talk Page"
      description="Minimal placeholder for the conversation screen in the Next.js mainline app."
      items={[
        "Entry point reserved for future conversation UI.",
        "No voice integration is wired in this placeholder.",
        "No analytics or cross-page state is introduced here.",
      ]}
    />
  );
}
