type PagePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
};

export function PagePlaceholder({
  eyebrow,
  title,
  description,
  items,
}: PagePlaceholderProps) {
  return (
    <section className="flex min-h-full flex-col gap-6">
      <div className="space-y-3">
        <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700">
          {eyebrow}
        </span>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            {title}
          </h1>
          <p className="text-sm leading-7 text-slate-600">{description}</p>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-[0_18px_50px_rgba(148,163,184,0.14)]">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5">
          <p className="text-sm font-medium text-slate-900">
            Minimal placeholder only
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            This screen is intentionally limited to structure and navigation so
            we can iterate on the Next.js mainline safely.
          </p>
        </div>

        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate-600 ring-1 ring-slate-200"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
