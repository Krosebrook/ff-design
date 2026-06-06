interface DataFlowLineProps {
  intensity?: number;
}

export function DataFlowLine({ intensity = 1 }: DataFlowLineProps) {
  const duration = Math.max(1.1, 2.5 - intensity);
  return (
    <svg width="100%" height="90" viewBox="0 0 900 90" className="overflow-visible" role="img" aria-label="FlashFusion execution data flow">
      <path d="M18 45 C185 5 270 88 440 45 S710 5 882 45" stroke="rgba(124,58,237,0.22)" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path
        className="ff-dashflow"
        style={{ ['--ff-flow-duration' as string]: `${duration}s` }}
        d="M18 45 C185 5 270 88 440 45 S710 5 882 45"
        stroke="#22D3EE"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="18 28"
      />
    </svg>
  );
}
