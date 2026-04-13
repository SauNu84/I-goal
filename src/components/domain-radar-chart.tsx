"use client";

interface DomainData {
  domainName: string;
  score: number;
  color: string;
}

interface DomainRadarChartProps {
  domains: DomainData[];
  size?: number;
}

export function DomainRadarChart({
  domains,
  size = 300,
}: DomainRadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size * 0.38;
  const levels = [20, 40, 60, 80, 100];
  const n = domains.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2; // start from top

  function polarToCart(angle: number, radius: number) {
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  }

  // Build polygon points for the data
  const dataPoints = domains.map((d, i) => {
    const angle = startAngle + i * angleStep;
    const radius = (d.score / 100) * maxRadius;
    return polarToCart(angle, radius);
  });

  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full max-w-[300px] mx-auto"
    >
      {/* Grid levels */}
      {levels.map((level) => {
        const r = (level / 100) * maxRadius;
        const pts = Array.from({ length: n }, (_, i) => {
          const angle = startAngle + i * angleStep;
          const p = polarToCart(angle, r);
          return `${p.x},${p.y}`;
        }).join(" ");
        return (
          <polygon
            key={level}
            points={pts}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={1}
          />
        );
      })}

      {/* Axis lines */}
      {domains.map((_, i) => {
        const angle = startAngle + i * angleStep;
        const end = polarToCart(angle, maxRadius);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke="#d1d5db"
            strokeWidth={1}
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={dataPolygon}
        fill="rgba(99, 102, 241, 0.15)"
        stroke="#6366f1"
        strokeWidth={2}
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={4}
          fill={domains[i].color}
          stroke="white"
          strokeWidth={2}
        />
      ))}

      {/* Labels */}
      {domains.map((d, i) => {
        const angle = startAngle + i * angleStep;
        const labelR = maxRadius + 28;
        const pos = polarToCart(angle, labelR);
        return (
          <g key={d.domainName}>
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[11px] font-semibold fill-gray-700"
            >
              {d.domainName}
            </text>
            <text
              x={pos.x}
              y={pos.y + 14}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[10px] fill-gray-400"
            >
              {d.score}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
