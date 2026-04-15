import { PagePlaceholder } from "@/components/page-placeholder";

export default function SleepMonitoringPage() {
  return (
    <PagePlaceholder
      eyebrow="Sleep"
      title="Sleep Monitoring Page"
      description="Minimal placeholder for the sleep monitoring route in the mainline Next.js app."
      items={[
        "Visual shell only for future monitoring modules.",
        "No hardware, audio, or data reporting connections exist yet.",
        "This route is intentionally static to keep the first pass simple.",
      ]}
    />
  );
}
