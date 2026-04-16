import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const cases = [
  { title: 'Warehouses', description: 'Keep workers comfortable across massive distribution centres while reducing stratification energy loss.', icon: '🏭', tag: 'Industrial' },
  { title: 'Factories', description: 'Improve worker productivity and reduce heat stress in manufacturing environments with continuous gentle airflow.', icon: '⚙️', tag: 'Manufacturing' },
  { title: 'Commercial Spaces', description: 'Enhance the customer experience in retail, showrooms, and leisure facilities with silent, invisible comfort.', icon: '🏪', tag: 'Commercial' },
  { title: 'Agricultural', description: 'Improve animal welfare and reduce mortality rates in livestock buildings with perfectly calibrated airflow.', icon: '🌾', tag: 'Agricultural' },
  { title: 'Sports Facilities', description: 'From indoor arenas to covered training grounds — maintain comfortable playing conditions all year round.', icon: '🏟️', tag: 'Sports' },
  { title: 'Aviation Hangars', description: 'Massive open-span structures with strict air quality requirements — HVLS is the only practical solution.', icon: '✈️', tag: 'Aviation' },
];

function CaseCard({ item, index }) {
  const { ref, isInView } = useScrollAnimation({ once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group relative rounded-2xl overflow-hidden cursor-default transition-all duration-300 hover:shadow-xl"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      {/* Hover accent overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, rgba(229,41,41,0.04) 0%, rgba(0,123,201,0.06) 100%)' }}
      />

      <div className="relative p-8">
        <div
          className="inline-flex text-xs font-medium px-3 py-1 rounded-full mb-4"
          style={{ background: 'var(--bg-base)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          {item.tag}
        </div>

        <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110 inline-block">
          {item.icon}
        </div>

        <h3
          className="text-lg font-bold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {item.title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-secondary)' }}
        >
          {item.description}
        </p>

        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left"
          style={{ background: 'linear-gradient(90deg, #E52929, #007BC9)' }}
        />
      </div>
    </motion.div>
  );
}

export default function UseCases() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section
      id="use-cases"
      className="relative py-28"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <span
              className="text-xs tracking-widest uppercase font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              Applications
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Wherever people{' '}
            <span className="gradient-text">work and live</span>
          </h2>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            SpyroFans are trusted across dozens of industries — anywhere large-space comfort matters.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cases.map((item, i) => (
            <CaseCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
