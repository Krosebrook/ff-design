type Tone = 'violet' | 'cyan' | 'amber' | 'pink' | 'emerald' | 'slate';

const TONE_CLASSES: Record<Tone, string> = {
  violet:  'border-violet-300/30 bg-violet-500/10 text-violet-100',
  cyan:    'border-cyan-300/30   bg-cyan-500/10   text-cyan-100',
  amber:   'border-amber-300/30  bg-amber-500/10  text-amber-100',
  pink:    'border-pink-300/30   bg-pink-500/10   text-pink-100',
  emerald: 'border-emerald-300/30 bg-emerald-500/10 text-emerald-100',
  slate:   'border-white/10      bg-white/[0.04]  text-slate-300',
};

interface PillProps {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}

export function Pill({ tone = 'slate', children, className = '' }: PillProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${TONE_CLASSES[tone]} ${className}`}>
      {children}
    </span>
  );
}
