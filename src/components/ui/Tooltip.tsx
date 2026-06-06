interface TooltipProps {
  label: string;
  children: React.ReactNode;
}

export function Tooltip({ label, children }: TooltipProps) {
  return (
    <span className="ff-tip-host relative inline-flex">
      {children}
      <span className="ff-tip" role="tooltip">{label}</span>
    </span>
  );
}
