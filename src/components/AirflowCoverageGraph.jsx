import { useMemo } from 'react';

// ─── SVG layout constants ────────────────────────────────────────────────────

const W = 560;
const H = 260;
const PAD = { l: 68, r: 18, t: 24, b: 48 };
const PLOT_W = W - PAD.l - PAD.r;      // 474
const PLOT_H = H - PAD.t - PAD.b;      // 188
const OX = PAD.l;                       // origin X (fan position)
const OY = PAD.t + PLOT_H / 2;         // origin Y (fan centre)

// At speed = 100:  max reach 120 ft,  max half-spread 20 ft
// Axis ticks (fixed scale)
const X_TICKS = [20, 40, 60, 80, 100, 120];   // ft
const Y_TICKS = [-20, -10, 0, 10, 20];         // ft from centre

// Map ft → SVG px
const ftToX = (ft) => OX + (ft / 120) * PLOT_W;
const ftToY = (ft) => OY - (ft / 20) * (PLOT_H / 2);

// ─── Teardrop cone path ───────────────────────────────────────────────────────
// length & spread are in SVG px; origin at (OX, OY)
function conePath(length, spread) {
  if (length < 2) return '';
  const x = OX;
  const y = OY;
  const l = length;
  const s = spread;
  // Upper half: origin → wide body → tapered tip
  // Lower half: mirror
  return [
    `M ${x} ${y}`,
    `C ${x + l * 0.10} ${y - s * 0.30},`,
    `  ${x + l * 0.42} ${y - s * 1.00},`,
    `  ${x + l * 0.80} ${y - s * 0.88}`,
    `Q ${x + l} ${y - s * 0.22}  ${x + l} ${y}`,
    `Q ${x + l} ${y + s * 0.22}  ${x + l * 0.80} ${y + s * 0.88}`,
    `C ${x + l * 0.42} ${y + s * 1.00},`,
    `  ${x + l * 0.10} ${y + s * 0.30},`,
    `  ${x} ${y} Z`,
  ].join(' ');
}

// ─── Fan icon ─────────────────────────────────────────────────────────────────
function FanIcon({ cx, cy }) {
  return (
    <g transform={`translate(${cx},${cy})`}>
      {/* body */}
      <circle r={9} fill="none" stroke="currentColor" strokeWidth={1.5} />
      {/* blades */}
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <line
          key={deg}
          x1={0} y1={0}
          x2={Math.cos((deg * Math.PI) / 180) * 7}
          y2={Math.sin((deg * Math.PI) / 180) * 7}
          stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"
        />
      ))}
      <circle r={2.5} fill="currentColor" />
    </g>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AirflowCoverageGraph({ speed }) {
  const { outerL, outerS, midL, midS, innerL, innerS, maxFt, maxSpread } = useMemo(() => {
    const t = speed / 100;               // 0 → 1
    // Lengths in SVG px: outer reaches up to full PLOT_W
    const outerL = PLOT_W * t;
    const outerS = (PLOT_H / 2) * 0.88 * t;
    const midL   = outerL * 0.66;
    const midS   = outerS * 0.70;
    const innerL = outerL * 0.36;
    const innerS = outerS * 0.42;
    // Human-readable labels for legend
    const maxFt     = Math.round(t * 120);
    const maxSpread = Math.round(t * 20);
    return { outerL, outerS, midL, midS, innerL, innerS, maxFt, maxSpread };
  }, [speed]);

  const outer = conePath(outerL, outerS);
  const mid   = conePath(midL, midS);
  const inner = conePath(innerL, innerS);

  return (
    <div
      className="rounded-2xl px-2 pt-5 pb-4"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      {/* Title row */}
      <div className="flex items-start justify-between px-3 mb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Airflow Coverage
          </p>
          <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Shaded area = active cooling zone
          </p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold" style={{ color: '#007BC9' }}>{maxFt}</span>
          <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>ft reach</span>
        </div>
      </div>

      {/* SVG chart */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        style={{ display: 'block', overflow: 'visible' }}
        aria-label="Airflow coverage cone diagram"
      >
        <defs>
          {/* Gradient fills for each zone */}
          <radialGradient id="cov-outer" cx="30%" cy="50%" r="70%">
            <stop offset="0%"   stopColor="#007BC9" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#007BC9" stopOpacity="0.04" />
          </radialGradient>
          <radialGradient id="cov-mid" cx="30%" cy="50%" r="70%">
            <stop offset="0%"   stopColor="#007BC9" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#007BC9" stopOpacity="0.10" />
          </radialGradient>
          <radialGradient id="cov-inner" cx="30%" cy="50%" r="70%">
            <stop offset="0%"   stopColor="#007BC9" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#007BC9" stopOpacity="0.22" />
          </radialGradient>
          {/* Clip to plot area */}
          <clipPath id="plot-clip">
            <rect x={PAD.l} y={PAD.t} width={PLOT_W} height={PLOT_H} />
          </clipPath>
        </defs>

        {/* ── Grid lines ── */}
        <g stroke="var(--border)" strokeWidth={0.6} opacity={0.7}>
          {/* Vertical */}
          {X_TICKS.map((ft) => (
            <line key={`vg-${ft}`} x1={ftToX(ft)} y1={PAD.t} x2={ftToX(ft)} y2={PAD.t + PLOT_H} />
          ))}
          {/* Horizontal */}
          {Y_TICKS.map((ft) => (
            <line key={`hg-${ft}`} x1={OX} y1={ftToY(ft)} x2={OX + PLOT_W} y2={ftToY(ft)} />
          ))}
        </g>

        {/* ── Cone zones (clipped to plot) ── */}
        <g clipPath="url(#plot-clip)" style={{ transition: 'd 0.45s ease-out' }}>
          {outer  && <path d={outer}  fill="url(#cov-outer)"  style={{ transition: 'd 0.45s ease-out' }} />}
          {mid    && <path d={mid}    fill="url(#cov-mid)"    style={{ transition: 'd 0.45s ease-out' }} />}
          {inner  && <path d={inner}  fill="url(#cov-inner)"  style={{ transition: 'd 0.45s ease-out' }} />}
          {/* Outline stroke on outer cone */}
          {outer  && <path d={outer}  fill="none" stroke="#007BC9" strokeWidth={1} opacity={0.35} style={{ transition: 'd 0.45s ease-out' }} />}
        </g>

        {/* ── X-axis labels ── */}
        {X_TICKS.map((ft) => (
          <text
            key={`xl-${ft}`}
            x={ftToX(ft)} y={PAD.t + PLOT_H + 14}
            textAnchor="middle" fontSize={9}
            fill="var(--text-muted)"
          >
            {ft} ft
          </text>
        ))}
        {/* X-axis title */}
        <text
          x={OX + PLOT_W / 2} y={H - 4}
          textAnchor="middle" fontSize={9} fontWeight={600}
          fill="var(--text-muted)" letterSpacing={0.5} textTransform="uppercase"
        >
          Distance from Fan
        </text>

        {/* ── Y-axis labels ── */}
        {Y_TICKS.filter((ft) => ft !== 0).map((ft) => (
          <text
            key={`yl-${ft}`}
            x={OX - 6} y={ftToY(ft) + 3.5}
            textAnchor="end" fontSize={8.5}
            fill="var(--text-muted)"
          >
            {ft > 0 ? `+${ft}` : ft} ft
          </text>
        ))}
        {/* Y-axis rotated title */}
        <text
          transform={`translate(${12}, ${OY}) rotate(-90)`}
          textAnchor="middle" fontSize={8.5} fontWeight={600}
          fill="var(--text-muted)" letterSpacing={0.3}
        >
          Side spread
        </text>

        {/* ── Centre line ── */}
        <line
          x1={OX} y1={OY} x2={OX + PLOT_W} y2={OY}
          stroke="var(--border)" strokeWidth={1} strokeDasharray="4 3"
        />

        {/* ── Fan icon ── */}
        <FanIcon cx={OX} cy={OY} />
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-5 px-3 mt-2 flex-wrap">
        {[
          { label: 'Strong airflow', opacity: 0.55 },
          { label: 'Moderate airflow', opacity: 0.28 },
          { label: 'Light airflow', opacity: 0.12 },
        ].map(({ label, opacity }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
              style={{ background: `rgba(0,123,201,${opacity})`, border: '1px solid rgba(0,123,201,0.3)' }}
            />
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
          </div>
        ))}
        {maxFt > 0 && (
          <span className="text-[10px] ml-auto" style={{ color: 'var(--text-muted)' }}>
            Coverage up to {maxFt} ft ({Math.round(maxFt * 0.3048)} m) · ±{maxSpread} ft wide
          </span>
        )}
      </div>
    </div>
  );
}
