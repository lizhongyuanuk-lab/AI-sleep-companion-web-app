import Link from "next/link";

export default function Home() {
  return (
    <section className="flex min-h-full flex-col gap-8">
      <div className="space-y-3">
        <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
          Mainline
        </span>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            AI Companion Web
          </h1>
          <p className="text-sm leading-7 text-slate-600">
            This Next.js repo is the only active mainline for the current web
            work. The four feature routes below are placeholder-only and do not
            include voice, analytics, or complex state.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {[
          {
            href: "/talk",
            title: "Talk",
            description: "Conversation entry placeholder",
          },
          {
            href: "/room",
            title: "Room",
            description: "Room shell placeholder",
          },
          {
            href: "/memory",
            title: "Memory",
            description: "Memory overview placeholder",
          },
          {
            href: "/sleep-monitoring",
            title: "Sleep",
            description: "Night tracking placeholder",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-[0_18px_50px_rgba(148,163,184,0.12)] transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  {item.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {item.description}
                </p>
              </div>
              <span className="text-sm font-medium text-slate-400">Open</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
