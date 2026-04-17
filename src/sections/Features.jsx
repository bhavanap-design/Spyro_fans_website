import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Inline SVG icons — clean minimal line style, consistent duotone treatment
const icons = {
  energy: (color) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  wind: (color) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
    </svg>
  ),
  silent: (color) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ),
  maintenance: (color) => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
};

const features = [
  {
    key: 'energy',
    title: 'Energy Efficient',
    description: 'Consumes up to 56% less energy than conventional HVAC systems by leveraging large-diameter, slow-speed airflow across enormous areas.',
    color: '#E52929',
    metric: '56% less energy',
    gradient: 'radial-gradient(ellipse at top left, rgba(229,41,41,0.07) 0%, transparent 65%)',
    hoverShadow: '0 16px 40px rgba(229,41,41,0.14)',
    hoverBorder: 'rgba(229,41,41,0.25)',
  },
  {
    key: 'wind',
    title: 'Wide Air Coverage',
    description: 'A single HVLS fan effectively circulates air across up to 2,000 m² — replacing dozens of smaller high-speed fans.',
    color: '#007BC9',
    metric: 'Up to 2,000 m²',
    gradient: 'radial-gradient(ellipse at top left, rgba(0,123,201,0.07) 0%, transparent 65%)',
    hoverShadow: '0 16px 40px rgba(0,123,201,0.14)',
    hoverBorder: 'rgba(0,123,201,0.25)',
  },
  {
    key: 'silent',
    title: 'Near-Silent Operation',
    description: 'Ultra-low RPM means whisper-quiet performance, even in sensitive environments like offices, showrooms, and livestock facilities.',
    color: '#E52929',
    metric: '< 45 dB',
    gradient: 'radial-gradient(ellipse at top left, rgba(229,41,41,0.07) 0%, transparent 65%)',
    hoverShadow: '0 16px 40px rgba(229,41,41,0.14)',
    hoverBorder: 'rgba(229,41,41,0.25)',
  },
  {
    key: 'maintenance',
    title: 'Zero Maintenance',
    description: 'Our gearless direct drive motor completely eliminates the gearbox — eliminating wear and tear for decades of maintenance-free operation.',
    color: '#007BC9',
    metric: '10-Year Warranty',
    gradient: 'radial-gradient(ellipse at top left, rgba(0,123,201,0.07) 0%, transparent 65%)',
    hoverShadow: '0 16px 40px rgba(0,123,201,0.14)',
    hoverBorder: 'rgba(0,123,201,0.25)',
  },
];

function FeatureCard({ feature, index }) {
  const { ref, isInView } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.11, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        scale: 1.025,
        y: -4,
        transition: { duration: 0.25, ease: 'easeOut' },
      }}
      className="group relative rounded-2xl overflow-hidden cursor-default flex flex-col"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
        padding: '36px 32px',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = feature.hoverShadow;
        e.currentTarget.style.borderColor = feature.hoverBorder;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      {/* Subtle gradient bg */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-400 opacity-60 group-hover:opacity-100"
        style={{ background: feature.gradient }}
      />

      {/* Icon container */}
      <div
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-7 transition-transform duration-300 group-hover:scale-110"
        style={{
          background: `${feature.color}12`,
          border: `1.5px solid ${feature.color}22`,
        }}
      >
        {icons[feature.key](feature.color)}
      </div>

      {/* Badge metric */}
      <div
        className="relative inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit"
        style={{
          background: `${feature.color}12`,
          color: feature.color,
          border: `1px solid ${feature.color}20`,
          letterSpacing: '0.03em',
        }}
      >
        {feature.metric}
      </div>

      {/* Title */}
      <h3
        className="relative text-lg font-semibold mb-3 leading-snug"
        style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}
      >
        {feature.title}
      </h3>

      {/* Description */}
      <p
        className="relative text-sm leading-relaxed flex-1"
        style={{ color: 'var(--text-secondary)' }}
      >
        {feature.description}
      </p>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-b-2xl"
        style={{ background: `linear-gradient(90deg, ${feature.color}, transparent)` }}
      />
    </motion.div>
  );
}

export default function Features() {
  const { ref: headRef, isInView: headInView } = useScrollAnimation();

  return (
    <section id="features" className="relative py-28" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E52929]" />
            <span className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
              Why HVLS
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}
          >
            Engineering for the{' '}
            <span className="gradient-text">extraordinary</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Every SpyroFan is designed with one goal — deliver maximum comfort at minimum cost.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.key} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
