import { PagePlaceholder } from "@/components/page-placeholder";

export default function RoomPage() {
  return (
    <PagePlaceholder
      eyebrow="Room"
      title="Room Page"
      description="Minimal placeholder for the room scene shell inside the current Next.js repo."
      items={[
        "Layout space reserved for future room content.",
        "Only static structure is present in this iteration.",
        "No complex orchestration or live session state is attached.",
      ]}
    />
  );
}
