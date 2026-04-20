import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// ─── Testimonial data ─────────────────────────────────────────────────────

const col1 = [
  {
    quote: "SpyroFans transformed our 40,000 sq ft warehouse. Workers noticed the difference from day one — cooler, more comfortable, and our energy bill dropped by nearly 50%.",
    name: "Rajesh Mehta",
    title: "Operations Director",
    company: "Mehta Logistics Pvt. Ltd.",
    rating: 5,
    initial: "R",
    accent: '#E52929',
  },
  {
    quote: "Running 24/7 in a harsh foundry environment for 2 years without a single service call. The 10-year warranty gave us confidence, but the build quality speaks for itself.",
    name: "Deepak Sharma",
    title: "Plant Manager",
    company: "Bharat Steel Works",
    rating: 5,
    initial: "D",
    accent: '#007BC9',
  },
  {
    quote: "Replaced 18 conventional fans with 4 SpyroFans in our aircraft hangar. Uniform temperature, quiet operation, and the space looks far more professional.",
    name: "Col. Vikram Singh (Retd.)",
    title: "Facilities Head",
    company: "AeroBase Services",
    rating: 5,
    initial: "V",
    accent: '#E52929',
  },
  {
    quote: "Installation was seamless and the team was incredibly professional. Our logistics hub has never been more comfortable. Staff productivity is up noticeably.",
    name: "Ananya Krishnan",
    title: "VP Operations",
    company: "SwiftMove Logistics",
    rating: 5,
    initial: "A",
    accent: '#007BC9',
  },
];

const col2 = [
  {
    quote: "The engineering consultation was incredibly thorough. They designed the perfect placement plan for our 3 facilities. Best vendor we've worked with in a decade.",
    name: "Sarah Williams",
    title: "Head of Facilities",
    company: "GlobalTech Manufacturing",
    rating: 5,
    initial: "S",
    accent: '#007BC9',
  },
  {
    quote: "We installed SpyroCeiling Pro units across our poultry farm. Mortality rates dropped significantly and animal welfare scores improved. ROI was clear within the first season.",
    name: "Amit Patel",
    title: "Farm Manager",
    company: "Patel AgriFarms",
    rating: 5,
    initial: "A",
    accent: '#E52929',
  },
  {
    quote: "Silent, powerful, and virtually maintenance-free after 3 years of continuous use. Our retail showroom feels fresh without any noticeable airflow. Clients always comment.",
    name: "Priya Nair",
    title: "Store Operations Manager",
    company: "Nair Group Retail",
    rating: 5,
    initial: "P",
    accent: '#007BC9',
  },
  {
    quote: "Our sports complex stays at a perfect temperature year-round. Athletes perform better and visitors are always impressed by the comfort. SpyroFans is the real deal.",
    name: "Sanjay Kulkarni",
    title: "Stadium Manager",
    company: "Indore Sports Complex",
    rating: 5,
    initial: "S",
    accent: '#E52929',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24"
          fill={i < count ? '#F59E0B' : 'none'}
          stroke={i < count ? '#F59E0B' : '#ccc'}
          strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }) {
  return (
    <div
      className="rounded-2xl p-5 mb-4 flex-shrink-0"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      {/* Opening quote */}
      <div className="text-3xl leading-none mb-2 font-serif"
        style={{ color: t.accent, opacity: 0.55, fontFamily: 'Georgia, serif' }}>
        "
      </div>

      <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
        {t.quote}
      </p>

      <Stars count={t.rating} />

      <div className="flex items-center gap-3 mt-4">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.accent === '#E52929' ? '#007BC9' : '#E52929'})` }}
        >
          {t.initial}
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight"
            style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}>
            {t.name}
          </p>
          <p className="text-xs leading-tight mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {t.title}{t.company && `, ${t.company}`}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Single scrolling column ─────────────────────────────────────────────
//
// `direction`: 'up' (-1) or 'down' (+1)
// Content is tripled so the loop is invisible even at height extremes.

function MarqueeColumn({ items, direction = 'up', duration = 30 }) {
  const tripled = [...items, ...items, ...items];

  // For 'up': animate from 0 → -33.333%  (one copy height)
  // For 'down': animate from -33.333% → 0
  const from = direction === 'up' ? '0%'       : '-33.333%';
  const to   = direction === 'up' ? '-33.333%' : '0%';

  return (
    <div className="relative overflow-hidden flex-1" style={{ height: 560 }}>
      {/* Top gradient fade */}
      <div className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, var(--bg-base) 0%, transparent 100%)' }} />
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--bg-base) 0%, transparent 100%)' }} />

      {/* Scrolling track */}
      <div
        style={{
          animation: `marquee-${direction}-${Math.round(duration)}s ${duration}s linear infinite`,
          animationName: `marqueeCol`,
          // CSS custom props passed inline aren't easily animatable; use style tag below
        }}
      >
        <div
          style={{
            animation: `marqueeCol_${direction} ${duration}s linear infinite`,
          }}
        >
          {tripled.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marqueeCol_up {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-33.333%); }
        }
        @keyframes marqueeCol_down {
          0%   { transform: translateY(-33.333%); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────

const stats = [
  { value: '1,000+', label: 'Installations' },
  { value: '1000+',    label: 'Clients' },
  { value: '98%',    label: 'Client retention' },
];

export default function WhyUs() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="why-choose-us" className="relative py-28" style={{ background: 'var(--bg-base)' }}>
      {/* Ambient glow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-[0.07] pointer-events-none"
        style={{ background: '#E52929' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* LEFT — heading + stats (sticky) */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-28"
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E52929]" />
              <span className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
                Client Stories
              </span>
            </div>

            <h2
              className="text-4xl lg:text-5xl font-bold mb-5 leading-tight"
              style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}
            >
              Trusted by{' '}
              <span className="gradient-text">industry leaders</span>
            </h2>

            <p className="text-base leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
              From logistics giants to precision manufacturers — SpyroFans is the choice of operations professionals who demand the best.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl p-5 text-center"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                  <div className="text-2xl font-bold gradient-text mb-1">{s.value}</div>
                  <div className="text-xs tracking-wide" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Overall rating badge */}
            <div className="inline-flex items-center gap-3 rounded-2xl px-5 py-4"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <Stars count={5} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>4.9 / 5.0</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>from 240+ verified clients</span>
            </div>
          </motion.div>

          {/* RIGHT — two-column independent marquee */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex gap-4"
          >
            {/* Left column — scrolls UP */}
            <MarqueeColumn items={col1} direction="up"   duration={32} />
            {/* Right column — scrolls DOWN (counter-motion) */}
            <MarqueeColumn items={col2} direction="down" duration={36} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
