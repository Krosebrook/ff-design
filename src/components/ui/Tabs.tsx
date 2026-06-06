import { useEffect, useRef, useState } from 'react';

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  value: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, value, onChange }: TabsProps) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [bar, setBar] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const el = refs.current[value];
    if (!el) return;
    setBar({ left: el.offsetLeft, width: el.offsetWidth });
  }, [value, tabs.length]);

  return (
    <div className="ff-tabs relative flex items-center gap-1 border-b border-white/8 px-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          ref={(el) => { refs.current[t.id] = el; }}
          onClick={() => onChange(t.id)}
          className={`relative px-3 py-2.5 text-[13px] font-medium transition ${value === t.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
        >
          {t.label}
          {t.count != null && (
            <span className="ml-1.5 rounded-full bg-white/8 px-1.5 py-0.5 text-[10px] text-slate-300">{t.count}</span>
          )}
        </button>
      ))}
      <span
        className="ff-tab-indicator"
        style={{ transform: `translateX(${bar.left}px)`, width: bar.width }}
      />
    </div>
  );
}
