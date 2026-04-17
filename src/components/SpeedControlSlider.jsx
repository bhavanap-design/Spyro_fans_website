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
    </div>
  );
}
