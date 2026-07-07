export default function ScoreRing({ score = 0, max = 10, size = 120, stroke = 8 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = score / max;
  const color = score >= 8 ? '#10b981' : score >= 6 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-border" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ - circ * pct}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-2xl" style={{ color }}>
          {score.toFixed(1)}
        </span>
        <span className="text-[11px] text-muted-foreground">/ {max}</span>
      </div>
    </div>
  );
}