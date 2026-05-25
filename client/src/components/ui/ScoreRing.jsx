export default function ScoreRing({ score = 0, max = 10, size = 120, stroke = 8 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = score / max;
  const color = score >= 8 ? '#10d98c' : score >= 6 ? '#f59e0b' : '#f87171';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#212128" strokeWidth={stroke} />
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
        <span className="font-display font-bold text-2xl" style={{ color }}>
          {score.toFixed(1)}
        </span>
        <span className="text-[11px] text-[#7a7a8a]">/ {max}</span>
      </div>
    </div>
  );
}