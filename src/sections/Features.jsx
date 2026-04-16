import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Zap, Wind, Volume2, Shield } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Energy Efficient',
    description: 'Consumes up to 56% less energy than conventional HVAC systems by leveraging large-diameter, slow-speed airflow across enormous areas.',
    color: '#E52929',
    metric: '56% less energy',
  },
  {
    icon: Wind,
    title: 'Wide Air Coverage',
    description: 'A single HVLS fan effectively circulates air across up to 2,000 m² — replacing dozens of smaller high-speed fans.',
    color: '#007BC9',
    metric: 'Up to 2,000 m²',
  },
  {
    icon: Volume2,
    title: 'Near-Silent Operation',
    description: 'Ultra-low RPM means whisper-quiet performance, even in sensitive environments like offices, showrooms, and livestock facilities.',
    color: '#E52929',
    metric: '< 45 dB',
  },
  {
    icon: Shield,
    title: 'Built to Last',
    description: 'Aircraft-grade aluminium blades, sealed bearings, and IP55-rated motor housing ensure decades of reliable performance in the toughest conditions.',
    color: '#007BC9',
    metric: '10-Year Warranty',
  },
];

function FeatureCard({ feature, index }) {
  const { ref, isInView } = useScrollAnimation();
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12, ease: 'easeOut' }}
      className="group relative rounded-2xl p-8 transition-all duration-400 cursor-default overflow-hidden"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 10% 10%, ${feature.color}0D 0%, transparent 60%)` }}
      />

      {/* Icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
        style={{ background: `${feature.color}14`, border: `1px solid ${feature.color}25` }}
      >
        <Icon size={24} style={{ color: feature.color }} />
      </div>

      {/* Metric */}
      <div
        className="inline-flex text-xs font-semibold px-3 py-1 rounded-full mb-4"
        style={{ background: `${feature.color}14`, color: feature.color }}
      >
        {feature.metric}
      </div>

      <h3
        className="text-xl font-semibold mb-3"
        style={{ color: 'var(--text-primary)' }}
      >
        {feature.title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
      >
        {feature.description}
      </p>

      <div
        className="absolute bottom-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)` }}
      />
    </motion.div>
  );
}

export default function Features() {
  const { ref: headRef, isInView: headInView } = useScrollAnimation();

  return (
    <section
      id="features"
      className="relative py-28"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 glass"
          >
            <span
              className="text-xs tracking-widest uppercase font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              Why HVLS
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Engineering for the{' '}
            <span className="gradient-text">extraordinary</span>
          </h2>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Every SpyroFan is designed with one goal — deliver maximum comfort at minimum cost.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
