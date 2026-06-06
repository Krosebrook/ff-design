interface SystemPanelProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function SystemPanel({ children, className = '', as: Tag = 'div' }: SystemPanelProps) {
  return (
    <Tag className={`rounded-3xl border border-white/10 bg-[#0B0F1A]/78 p-6 shadow-2xl backdrop-blur-xl ${className}`}>
      {children}
    </Tag>
  );
}
