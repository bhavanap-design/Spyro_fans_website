import { useLayoutEffect, useRef } from 'react';

/**
 * Fan speed slider — range 55–125 RPM.
 * Updates a CSS custom property for the blue fill track.
 *
 * Props:
 *   speed        {number}   current speed value (55–125)
 *   onChange     {fn}       called with new number on change
 *   isDragging   {boolean}  shows "Manual" indicator when user drags the 3D fan
 */
export default function SpeedControlSlider({ speed, onChange, isDragging }) {
  const sliderRef = useRef(null);
  const min = 55;
  const max = 125;

  // Keep the CSS gradient track in sync with the slider value
  useLayoutEffect(() => {
    if (!sliderRef.current) return;
    const pct = ((speed - min) / (max - min)) * 100;
    sliderRef.current.style.setProperty('--pct', `${pct}%`);
  }, [speed]);

  // Labels for tick marks
  const ticks = [55, 70, 85, 100, 115, 125];

  return (
    <div className="w-full select-none">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-muted)' }}
        >
          Fan Speed
        </span>
        <div className="flex items-center gap-2">
          {isDragging && (
            <span className="text-xs" style={{ color: '#E52929' }}>
              Manual
            </span>
          )}
          <span
            className="text-sm font-bold tabular-nums"
            style={{ color: '#007BC9' }}
          >
            {speed}
            <span className="text-xs font-normal ml-0.5" style={{ color: 'var(--text-muted)' }}>
              RPM
            </span>
          </span>
        </div>
      </div>

      {/* Slider track */}
      <input
        ref={sliderRef}
        type="range"
        min={min}
        max={max}
        step={1}
        value={speed}
        onChange={(e) => onChange(Number(e.target.value))}
        className="speed-slider"
        aria-label={`Fan speed: ${speed} RPM`}
      />

      {/* Tick labels */}
      <div className="flex justify-between mt-1.5">
        {ticks.map((t) => (
          <span
            key={t}
            className="text-[10px] tabular-nums"
            style={{ color: 'var(--text-muted)' }}
          >
            {t}
          </span>
        ))}
      </div>

      {/* Speed description */}
      <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
        {speed <= 70
          ? 'Gentle circulation — destratification mode'
          : speed <= 100
          ? 'Comfort cooling — recommended for occupied spaces'
          : 'High performance — maximum airflow output'}
      </p>

      {/* Dynamic performance stats */}
      <DerivedStats speed={speed} />
    </div>
  );
}

function DerivedStats({ speed }) {
  const airflow = Math.round(speed * 50);
  const torque  = (speed * 0.2).toFixed(1);
  const energy  = (speed * 0.01).toFixed(1);

  const stats = [
    { label: 'Airflow',  value: airflow.toLocaleString(), unit: 'CFM',  color: '#007BC9' },
    { label: 'Torque',   value: torque,                   unit: 'Nm',   color: '#E52929' },
    { label: 'Energy',   value: energy,                   unit: 'kW',   color: '#007BC9' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 mt-6">
      {stats.map(({ label, value, unit, color }) => (
        <div
          key={label}
          className="flex flex-col items-center rounded-xl py-3.5 px-1"
          style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}
        >
          <span
            className="text-base font-bold tabular-nums leading-none"
            style={{ color }}
          >
            {value}
            <span className="text-[11px] font-normal ml-0.5" style={{ color: 'var(--text-muted)' }}>
              {unit}
            </span>
          </span>
          <span className="text-[10px] mt-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
