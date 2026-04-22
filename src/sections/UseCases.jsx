import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

// Images mapped to use-case IDs placed in /public/images/
// User should add: usecase-warehouse.jpg, usecase-factory.jpg, etc.
// Falls back to a gradient placeholder if image is missing.
const cases = [
  {
    id: 'warehouse',
    title: 'Warehouses',
    description: 'Maintain consistent airflow across large spaces while reducing heat buildup and improving efficiency.',
    image: '/Spyro_Application_Images/image 18.png',
    tag: 'Industrial',
  },
  {
    id: 'factory',
    title: 'Factories',
    description: 'Enhance worker comfort and productivity by delivering steady airflow that minimizes heat stress in demanding environments.',
    image: '/images/Gallery 2.jpg',
    tag: 'Manufacturing',
  },
  {
    id: 'commercial',
    title: 'Commercial Spaces',
    description: 'Create a comfortable environment for customers and staff with quiet, efficient airflow across large open areas.',
    image: '/images/Gallery 3.jpg',
    tag: 'Commercial',
  },
  {
    id: 'holyplaces',
    title: 'Holy Places',
    description: 'Create a peaceful and calming atmosphere with consistent, silent air circulation across large prayer spaces.',
    image: '/Spyro_Application_Images/image 19.png',
    tag: 'Religious',
  },
  {
    id: 'sports',
    title: 'Sports Facilities',
    description: 'Maintain optimal airflow to ensure consistent comfort during play, training sessions, and high-activity environments.',
    image: '/images/Gallery 6.jpg',
    tag: 'Sports',
  },
  {
    id: 'Stadium',
    title: 'Stadiums',
    description: 'Provide wide coverage airflow for massive, high-volume spaces while ensuring efficient and uniform air distribution.',
    image: '/Spyro_Application_Images/fan_side_angle.png',
    tag: 'stadium',
  },
];

function CaseCard({ item, index }) {
  const { ref, isInView } = useScrollAnimation({ once: true, amount: 0.12 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      // Effect 2: card lifts + shadow grows
      whileHover={{ y: -8, transition: { duration: 0.28, ease: 'easeOut' } }}
      className="group relative overflow-hidden rounded-2xl cursor-default flex flex-col"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
        transition: 'box-shadow 0.30s ease',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 24px 56px rgba(0,0,0,0.20)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
    >
      {/* ── Image area ── */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        {/* Effect 1: image zooms on hover */}
        <motion.img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
          loading="lazy"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.50, ease: 'easeOut' }}
        />

        {/* Effect 1 (cont.): dark overlay fades in */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-350"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.45) 100%)' }}
        />

        {/* Tag badge */}
        <div
          className="absolute top-4 left-4 text-xs font-medium px-3 py-1 rounded-full"
          style={{
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(8px)',
            color: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {item.tag}
        </div>
      </div>

      {/* ── Text area ── */}
      <div className="p-6 flex flex-col flex-1">
        {/* Effect 3: text slides slightly up on hover */}
        <motion.div
          initial={false}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.25 }}
        >
          <h3
            className="font-semibold text-lg mb-2 leading-snug"
            style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}
          >
            {item.title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {item.description}
          </p>
        </motion.div>

        {/* Spacer — no bottom bar */}
        <div className="mt-auto" />
      </div>
    </motion.div>
  );
}

export default function UseCases() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section
      id="applications"
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
            <span className="w-1.5 h-1.5 rounded-full bg-[#007BC9]" />
            <span className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
              Applications
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}
          >
            <span className="gradient-text">Airflow Solutions</span> {' '}
            Across Industries
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            From large-scale facilities to open spaces, Spyro fans provide efficient airflow solutions.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((item, i) => (
            <CaseCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
