import { useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DISTANCES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

function buildCurve(speed, fanType) {
  // Peak velocity and reach vary slightly per fan type
  const peakFactor = fanType === 'floor' ? 4.5 : fanType === 'pole' ? 5.5 : 6.5;
  const reachBase  = fanType === 'floor' ? 20  : fanType === 'pole' ? 25  : 30;
  const reachScale = fanType === 'floor' ? 0.6 : fanType === 'pole' ? 0.75 : 0.9;

  const peak  = speed * peakFactor;
  const reach = reachBase + speed * reachScale;
  const sigma = reach / 2.5;

  return DISTANCES.map((d) => ({
    distance: d,
    velocity: d <= reach
      ? Math.max(0, Math.round(peak * Math.exp(-(d * d) / (2 * sigma * sigma))))
      : 0,
  }));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs"
      style={{
        background: 'var(--bg-elevated, var(--bg-surface))',
        border: '1px solid var(--border)',
        color: 'var(--text-primary)',
      }}
    >
      <p style={{ color: 'var(--text-muted)' }}>{label} ft from fan</p>
      <p className="font-bold" style={{ color: '#007BC9' }}>{payload[0].value} fpm</p>
    </div>
  );
};

export default function AirflowGraph({ speed, fanType = 'hvls' }) {
  const data = useMemo(() => buildCurve(speed, fanType), [speed, fanType]);
  const peakFactor = fanType === 'floor' ? 4.5 : fanType === 'pole' ? 5.5 : 6.5;
  const peak = Math.round(speed * peakFactor);

  return (
    <div
      className="rounded-2xl px-5 pt-5 pb-4"
      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Airflow Distribution
          </p>
          <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Velocity vs. distance from fan centre
          </p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold" style={{ color: '#007BC9' }}>{peak}</span>
          <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>fpm peak</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id={`airflowGrad-${fanType}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#007BC9" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#007BC9" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="distance"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            tickFormatter={(v) => `${v}ft`}
            interval={2}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
            width={38}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: '#E52929', strokeWidth: 1, strokeDasharray: '4 2' }}
          />
          <Area
            type="monotone"
            dataKey="velocity"
            stroke="#007BC9"
            strokeWidth={2.5}
            fill={`url(#airflowGrad-${fanType})`}
            dot={false}
            activeDot={{ r: 4, fill: '#E52929', strokeWidth: 0 }}
            isAnimationActive={true}
            animationDuration={400}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>

      <p className="text-center text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
        Distance from fan centre (ft)
      </p>
    </div>
  );
}
