import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { X, Check } from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

const normalPoints = [
  { icon: X, text: 'Limited coverage suitable for small spaces only' },
  { icon: X, text: 'Requires multiple fans to cover large areas' },
  { icon: X, text: 'Inconsistent air distribution across the space' },
  { icon: X, text: 'Higher maintenance due to multiple installations' },
];

const hvlsPoints = [
  { icon: Check, text: 'Wide, uniform air distribution covering large spaces' },
  { icon: Check, text: 'Single fan replaces multiple conventional fans & AC’s' },
  { icon: Check, text: 'Uniform air circulation ensuring consistent comfort' },
  { icon: Check, text: 'Low maintenance with fewer units and robust design' },
];

// ─── Card ─────────────────────────────────────────────────────────────────────

function ComparisonCard({ side, badge, badgeColor, title, subtitle, image, points, pointColor, borderAccent, isInView, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col rounded-3xl overflow-hidden group"
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${borderAccent}`,
        boxShadow: 'var(--shadow)',
        transition: 'transform 0.35s ease, box-shadow 0.35s ease',
      }}
      whileHover={{ y: -4 }}
    >
      {/* Image panel */}
      <div
        className="relative"
        style={{ background: 'var(--bg-base)', padding: '16px 16px 0' }}
      >
        <img
          src={image}
          alt={title}
          className="w-full object-contain rounded-2xl transition-transform duration-700 group-hover:scale-[1.02]"
          style={{ maxHeight: 320, display: 'block' }}
        />
        {/* Badge */}
        <div className="absolute top-8 left-8">
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-full tracking-wide uppercase"
            style={{ background: badgeColor, color: '#fff' }}
          >
            {badge}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-7 gap-5">
        {/* Title */}
        <div>
          <h3
            className="text-2xl font-bold leading-tight"
            style={{
              color: pointColor,
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            {title}
          </h3>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: 'var(--border)' }} />

        {/* Points */}
        <ul className="flex flex-col gap-3">
          {points.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-sm">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{
                  background: `${pointColor}18`,
                  color: pointColor,
                }}
              >
                <Icon size={11} strokeWidth={3} />
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function FanComparison() {
  const { ref, isInView } = useScrollAnimation({ once: true, amount: 0.15 });

  return (
    <section
      id="comparison"
      className="relative py-28"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Top separator */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #E52929, #007BC9, transparent)' }}
      />

      {/* Ambient glow */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: '#007BC9', opacity: 0.05 }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E52929]" />
            <span className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
              The Difference Is Clear
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}
          >
            Why <span className="gradient-text">HVLS</span> beats conventional fans
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            One SpyroFans HVLS unit replaces up to 18 conventional fans — at a fraction of the running cost.
          </p>
        </motion.div>

        {/* Comparison grid */}
        <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-10 items-stretch max-w-5xl mx-auto">

          {/* Normal fans card */}
          <ComparisonCard
            side="normal"
            badge="Traditional"
            badgeColor="#6B7280"
            title="Normal Fans"
            subtitle="Conventional pedestal & ceiling fans"
            image="/images/Normal_fans.png"
            points={normalPoints}
            pointColor="#E52929"
            borderAccent="#E52929"
            isInView={isInView}
            delay={0.1}
          />

          {/* VS badge — centred between cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:flex items-center justify-center"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-black text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #E52929, #007BC9)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}
            >
              VS
            </div>
          </motion.div>

          {/* HVLS fans card */}
          <ComparisonCard
            side="hvls"
            badge="Advanced HVLS Technology"
            badgeColor="#007BC9"
            title="Spyro HVLS Fans"
            subtitle="High Volume Low Speed industrial fans"
            image="/images/Hvls_fans.png"
            points={hvlsPoints}
            pointColor="#007BC9"
            borderAccent="#007BC9"
            isInView={isInView}
            delay={0.2}
          />
        </div>

        {/* Mobile VS label */}
        <div className="flex lg:hidden items-center justify-center my-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-black text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #E52929, #007BC9)' }}
          >
            VS
          </div>
        </div>

      </div>
    </section>
  );
}
