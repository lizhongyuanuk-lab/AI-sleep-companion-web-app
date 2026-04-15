import { PagePlaceholder } from "@/components/page-placeholder";

export default function MemoryPage() {
  return (
    <PagePlaceholder
      eyebrow="Memory"
      title="Memory Page"
      description="Minimal placeholder for memory-related browsing and summary features."
      items={[
        "List and detail experiences are deferred to later work.",
        "The current screen exists to anchor route structure only.",
        "No storage sync or derived state logic is added.",
      ]}
    />
  );
}
