interface SectionHeadProps {
  eyebrow: string;
  title: string;
  sub?: string;
  right?: React.ReactNode;
}

export function SectionHead({ eyebrow, title, sub, right }: SectionHeadProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-200/70">{eyebrow}</p>
        <h1 className="mt-1 text-2xl font-semibold text-white md:text-3xl">{title}</h1>
        {sub && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{sub}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
