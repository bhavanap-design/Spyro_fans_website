import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const clients = [
  { name: 'Tata Steel',         abbr: 'TS' },
  { name: 'Mahindra Logistics', abbr: 'ML' },
  { name: 'Amazon India',       abbr: 'AMZ' },
  { name: 'Flipkart',           abbr: 'FK' },
  { name: 'JSW Steel',          abbr: 'JSW' },
  { name: 'Reliance Industries',abbr: 'RIL' },
  { name: 'DHL Express',        abbr: 'DHL' },
  { name: 'Blue Dart',          abbr: 'BD' },
  { name: 'Godrej & Boyce',     abbr: 'G&B' },
  { name: 'Larsen & Toubro',    abbr: 'L&T' },
  { name: 'Hero MotoCorp',      abbr: 'HMC' },
  { name: 'Hindustan Unilever', abbr: 'HUL' },
];

// Duplicate for seamless infinite loop
const track = [...clients, ...clients];

function LogoCard({ name, abbr }) {
  return (
    <div
      className="group flex-shrink-0 flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      {/* Monogram badge */}
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300"
        style={{
          background: 'var(--bg-base)',
          color: 'var(--text-muted)',
          border: '1px solid var(--border)',
          // on hover via group — handled with inline onMouseEnter below
        }}
      >
        {abbr}
      </div>
      <span
        className="text-sm font-medium whitespace-nowrap transition-colors duration-300"
        style={{ color: 'var(--text-muted)' }}
      >
        {name}
      </span>
    </div>
  );
}

export default function TrustedBy() {
  const { ref, isInView } = useScrollAnimation({ once: true, amount: 0.3 });

  return (
    <section
      className="relative py-16 overflow-hidden"
      style={{ background: 'var(--bg-surface)' }}
    >
      {/* Top edge fade */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }}
      />
      {/* Bottom edge fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--border), transparent)' }}
      />

      {/* Left / right edge masks so logos fade out */}
      <div
        className="absolute inset-y-0 left-0 w-24 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to right, var(--bg-surface), transparent)' }}
      />
      <div
        className="absolute inset-y-0 right-0 w-24 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to left, var(--bg-surface), transparent)' }}
      />

      {/* Heading */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 px-6"
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          What Our
        </p>
        <h2
          className="text-2xl lg:text-3xl font-bold"
          style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}
        >
          1000+ Clients <span className="gradient-text">Across India</span>
        </h2>
      </motion.div>

      {/* Marquee track */}
      <div className="relative" style={{ overflow: 'hidden' }}>
        <div
          className="flex gap-4"
          style={{
            animation: 'marquee 36s linear infinite',
            width: 'max-content',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
          onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
        >
          {track.map((c, i) => (
            <LogoCard key={`${c.name}-${i}`} name={c.name} abbr={c.abbr} />
          ))}
        </div>
      </div>

      {/* Keyframe injected via style tag */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
