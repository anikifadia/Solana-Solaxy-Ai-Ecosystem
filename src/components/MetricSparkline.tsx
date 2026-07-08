import React, { useState, useRef, useMemo } from 'react';

interface MetricSparklineProps {
  metricId: 'tvl' | 'trades' | 'tps' | 'volume';
  currentValue: number;
}

// Fixed baseline offsets to generate realistic 24h trend percentages relative to current value
const TREND_FACTORS: Record<string, number[]> = {
  tvl: [0.89, 0.90, 0.92, 0.91, 0.93, 0.94, 0.93, 0.95, 0.97, 0.96, 0.98, 0.97, 0.99, 1.00, 0.98, 0.99, 1.01, 1.02, 1.01, 1.03, 1.02, 1.04, 1.05, 1.00],
  trades: [0.78, 0.81, 0.83, 0.80, 0.84, 0.87, 0.85, 0.88, 0.91, 0.89, 0.92, 0.94, 0.93, 0.96, 0.95, 0.97, 0.99, 0.98, 1.01, 1.03, 1.01, 1.04, 1.06, 1.00],
  tps: [0.85, 0.88, 0.91, 0.89, 0.90, 0.93, 0.96, 0.94, 0.92, 0.95, 0.98, 0.97, 0.99, 1.01, 1.02, 1.00, 1.02, 1.03, 1.01, 1.04, 1.03, 1.05, 1.06, 1.00],
  volume: [0.72, 0.75, 0.79, 0.77, 0.81, 0.84, 0.82, 0.85, 0.89, 0.87, 0.90, 0.92, 0.91, 0.94, 0.93, 0.96, 0.98, 0.97, 0.99, 1.02, 1.01, 1.04, 1.05, 1.00]
};

export default function MetricSparkline({ metricId, currentValue }: MetricSparklineProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Generate 24-hour datapoints based on the trending factor multiplier & currentValue
  const data = useMemo(() => {
    const factors = TREND_FACTORS[metricId] || Array(24).fill(1);
    return factors.map((factor, index) => {
      // Last element (index 23) represents 'Now' and should equal exactly currentValue
      const val = currentValue * factor;
      // Format hour labels nicely e.g. -24h to Now
      const hourDiff = 23 - index;
      const label = hourDiff === 0 ? 'NOW' : `-${hourDiff}h`;
      return { value: val, label };
    });
  }, [metricId, currentValue]);

  // Dimensions for SVG
  const width = 360;
  const height = 90;
  const paddingX = 10;
  const paddingY = 15;

  // Min and Max for scaling
  const values = data.map(d => d.value);
  const minVal = Math.min(...values) * 0.99; // slight padding under min
  const maxVal = Math.max(...values) * 1.01; // slight padding over max
  const range = maxVal - minVal || 1;

  // Generate SVG coordinates for each point
  const points = useMemo(() => {
    return data.map((d, i) => {
      const x = paddingX + (i / 23) * (width - paddingX * 2);
      // Invert Y because SVG coordinates start from top-left
      const y = height - paddingY - ((d.value - minVal) / range) * (height - paddingY * 2);
      return { x, y, ...d };
    });
  }, [data, minVal, range]);

  // Construct smooth path using cubic bezier segments (simulating D3 curveMonotoneX / cardinal spline)
  const pathD = useMemo(() => {
    if (points.length === 0) return '';
    let dStr = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      // Control points for a smooth transition
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cpY2 = p1.y;
      dStr += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return dStr;
  }, [points]);

  // Fill path closing the loop back to bottom-left/right to make a gorgeous Area chart
  const fillD = useMemo(() => {
    if (points.length === 0) return '';
    const lastPoint = points[points.length - 1];
    return `${pathD} L ${lastPoint.x} ${height} L ${points[0].x} ${height} Z`;
  }, [points, pathD]);

  // Handle Mouse Hover relative coordinates mapping to the closest of 24 points
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    // Map mouse X back to 24 indices
    const normalizedX = (clientX - paddingX) / (rect.width - paddingX * 2);
    let index = Math.round(normalizedX * 23);
    if (index < 0) index = 0;
    if (index > 23) index = 23;
    setHoverIndex(index);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Hover point details
  const activePoint = hoverIndex !== null ? points[hoverIndex] : null;

  // Format Helper for tooltip depending on metric
  const formatMetricValue = (val: number) => {
    if (metricId === 'tvl') return `$${val.toFixed(2)}B`;
    if (metricId === 'trades') return `${val.toFixed(2)}M`;
    if (metricId === 'tps') return `${Math.round(val).toLocaleString()} TPS`;
    if (metricId === 'volume') return `$${Math.round(val)}M`;
    return val.toFixed(1);
  };

  return (
    <div className="w-full mt-3 bg-black/40 border border-g/10 rounded p-2.5 relative select-none animate-fade-in">
      {/* Sparkline Top Header Details */}
      <div className="flex justify-between items-center text-[10px] text-white/40 mb-1.5 font-mono px-1">
        <div>
          {activePoint ? (
            <span className="text-g font-bold">{activePoint.label} TREND</span>
          ) : (
            <span>24H LIVE TRACKER</span>
          )}
        </div>
        <div className="text-right">
          {activePoint ? (
            <span className="text-cyan font-bold text-shadow-[0_0_8px_rgba(0,238,255,0.4)]">
              {formatMetricValue(activePoint.value)}
            </span>
          ) : (
            <span className="text-white/60">Hover chart for details</span>
          )}
        </div>
      </div>

      {/* SVG Canvas Sparkline */}
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="overflow-visible cursor-crosshair"
      >
        <defs>
          {/* Cyber green gradient fill under the line */}
          <linearGradient id={`area-grad-${metricId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00ff88" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00ff88" stopOpacity="0.0" />
          </linearGradient>

          {/* Glowing stroke gradient */}
          <linearGradient id={`stroke-grad-${metricId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#00eeff" />
            <stop offset="50%" stopColor="#00ff88" />
            <stop offset="100%" stopColor="#00ff88" />
          </linearGradient>

          {/* Dotted line mask / styling pattern */}
          <pattern id="grid-dots" width="12" height="12" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgba(0, 255, 136, 0.08)" />
          </pattern>
        </defs>

        {/* Background Grid Pattern */}
        <rect width={width} height={height} fill="url(#grid-dots)" />

        {/* Baseline & Grid lines */}
        <line x1={0} y1={height - 2} x2={width} y2={height - 2} stroke="rgba(0, 255, 136, 0.15)" strokeWidth={1} />
        <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="rgba(0, 255, 136, 0.04)" strokeWidth={1} strokeDasharray="3 3" />
        <line x1={0} y1={paddingY} x2={width} y2={paddingY} stroke="rgba(0, 255, 136, 0.04)" strokeWidth={1} strokeDasharray="3 3" />

        {/* Area Gradient Fill under trend */}
        <path d={fillD} fill={`url(#area-grad-${metricId})`} />

        {/* Main trend line path */}
        <path
          d={pathD}
          fill="none"
          stroke={`url(#stroke-grad-${metricId})`}
          strokeWidth={2}
          strokeLinecap="round"
          className="shadow-[0_0_10px_rgba(0,255,136,0.3)]"
        />

        {/* Hover Crosshair vertical dotted tracking line */}
        {activePoint && (
          <>
            <line
              x1={activePoint.x}
              y1={0}
              x2={activePoint.x}
              y2={height}
              stroke="rgba(0, 238, 255, 0.4)"
              strokeWidth={1.2}
              strokeDasharray="2 2"
            />
            {/* Glowing active point dot on the line */}
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r={4}
              fill="#00eeff"
              stroke="var(--color-b)"
              strokeWidth={1.5}
              className="animate-ping"
            />
            <circle
              cx={activePoint.x}
              cy={activePoint.y}
              r={3.5}
              fill="#00ff88"
              stroke="var(--color-b)"
              strokeWidth={1.5}
            />
          </>
        )}

        {/* Pulse indicator on the very last (current) node when not hovering */}
        {!activePoint && points.length > 0 && (
          <>
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r={3}
              fill="#00ff88"
              className="animate-pulse"
            />
          </>
        )}
      </svg>
      
      {/* Minimalist Legend labels */}
      <div className="flex justify-between text-[7px] text-white/30 tracking-[1.5px] font-mono mt-1 px-1">
        <span>24 HOURS AGO</span>
        <span>12 HOURS AGO</span>
        <span>CURRENT STATUS</span>
      </div>
    </div>
  );
}
