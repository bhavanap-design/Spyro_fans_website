import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Award, Headphones, Settings, Truck, Globe, Star } from 'lucide-react';

const reasons = [
  {
    icon: Award,
    title: 'Industry-Leading Quality',
    description: 'ISO 9001:2015 certified manufacturing with aircraft-grade aluminium alloys and precision-engineered components exceeding global safety standards.',
  },
  {
    icon: Settings,
    title: 'Bespoke Engineering',
    description: "Each installation is custom-designed to your facility's unique dimensions, air requirements, and structural constraints by our in-house engineers.",
  },
  {
    icon: Headphones,
    title: '24/7 Expert Support',
    description: 'From design consultation to post-installation maintenance, our dedicated support team is available around the clock to ensure peak performance.',
  },
  {
    icon: Truck,
    title: 'Nationwide Installation',
    description: 'Certified installation teams covering all major cities with a guaranteed commissioning timeline from order to first spin.',
  },
  {
    icon: Globe,
    title: 'Proven Globally',
    description: 'Trusted by Fortune 500 companies, leading logistics firms, and government infrastructure projects across 40+ countries.',
  },
  {
    icon: Star,
    title: '10-Year Warranty',
    description: 'Every SpyroFan ships with a comprehensive decade-long warranty covering motor, blades, and all structural components — zero compromise.',
  },
];

function ReasonCard({ reason, index }) {
  const { ref, isInView } = useScrollAnimation();
  const Icon = reason.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className="group flex gap-5 p-6 rounded-2xl transition-all duration-300"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      <div
        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(229,41,41,0.12), rgba(0,123,201,0.12))',
          border: '1px solid var(--border)',
        }}
      >
        <Icon size={20} style={{ color: 'var(--text-secondary)' }} />
      </div>
      <div>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {reason.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {reason.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function WhyUs() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section
      id="why-choose-us"
      className="relative py-28"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
              <span
                className="text-xs tracking-widest uppercase font-medium"
                style={{ color: 'var(--text-muted)' }}
              >
                Why SpyroFans
              </span>
            </div>
            <h2
              className="text-4xl lg:text-5xl font-bold mb-6 leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Built different.{' '}
              <span className="gradient-text">Trusted everywhere.</span>
            </h2>
            <p
              className="text-lg leading-relaxed mb-10"
              style={{ color: 'var(--text-secondary)' }}
            >
              We don't just sell fans — we engineer airflow solutions. From initial site survey to post-installation support, SpyroFans delivers a complete, turnkey experience.
            </p>

            <div className="grid grid-cols-3 gap-6">
              {[
                { value: '2,400+', label: 'Installations' },
                { value: '40+', label: 'Countries' },
                { value: '98%', label: 'Client retention' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl p-5 text-center"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                >
                  <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div
                    className="text-xs tracking-wide"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {reasons.map((reason, i) => (
              <ReasonCard key={reason.title} reason={reason} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
