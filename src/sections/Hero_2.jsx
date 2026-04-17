import { lazy, Suspense, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HVLSFan3D = lazy(() => import('../components/HVLSFan3D'));

const ROTATING_WORDS = ['Warehouses', 'Factories', 'Hangars', 'Arenas', 'Farms'];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const STATS = [
  { value: '24ft', label: 'Blade Diameter' },
  { value: '~56%', label: 'Energy Savings' },
  { value: '10yr', label: 'Warranty' },
];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const scrollToProducts = () =>
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });

  const scrollToContact = () =>
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      className="relative w-full min-h-screen flex items-center overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Animated gradient mesh background */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(0,123,201,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 20% 80%, rgba(229,41,41,0.04) 0%, transparent 60%)',
        }}
      />
      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(var(--text-muted) 1px, transparent 1px), linear-gradient(90deg, var(--text-muted) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[75vh]">
          {/* Left column: Text content */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 mb-8 w-fit"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                boxShadow: '0 0 20px rgba(0,123,201,0.08)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  background: 'var(--accent-blue)',
                  boxShadow: '0 0 8px rgba(0,123,201,0.5)',
                }}
              />
              <span
                className="text-xs font-medium tracking-widest uppercase"
                style={{
                  color: 'var(--text-muted)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Industrial HVLS Technology
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-[5.5rem] font-bold leading-[1.05] tracking-tight mb-6 heading"
              style={{
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
              }}
            >
              Industrial{' '}
              <span
                style={{
                  background:
                    'linear-gradient(135deg, #007BC9 0%, #00A3E0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                HVLS Fans
              </span>
              <br />
              for Every{' '}
              <span
                className="inline-block relative"
                style={{ minWidth: '280px' }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={ROTATING_WORDS[wordIndex]}
                    initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -30, filter: 'blur(4px)' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="inline-block"
                    style={{ color: 'var(--accent-blue)' }}
                  >
                    {ROTATING_WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-lg lg:text-xl leading-relaxed mb-10 max-w-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              Engineered for warehouses, factories, and commercial
              environments. Maximum airflow, minimal energy consumption.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={scrollToProducts}
                className="text-white font-semibold px-8 py-4 rounded-full text-sm tracking-wide transition-all duration-300 hover:brightness-110 hover:scale-[1.03] hover:shadow-lg cursor-pointer focus-ring"
                style={{
                  background:
                    'linear-gradient(135deg, #007BC9 0%, #0091E0 100%)',
                  boxShadow: '0 4px 24px rgba(0,123,201,0.35)',
                }}
              >
                Explore Products
              </button>
              <button
                onClick={scrollToContact}
                className="font-semibold px-8 py-4 rounded-full text-sm tracking-wide transition-all duration-300 hover:scale-[1.03] cursor-pointer focus-ring"
                style={{
                  color: 'var(--text-primary)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                }}
              >
                Get Quote &rarr;
              </button>
            </motion.div>

            {/* Enhanced Stats row */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex gap-10 mt-14 pt-10"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="group">
                  <div
                    className="text-3xl lg:text-4xl font-bold tracking-tight"
                    style={{
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs mt-1.5 tracking-wide uppercase"
                    style={{
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right column: 3D Fan Model */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
            className="order-1 lg:order-2 relative flex items-center justify-center"
          >
            <div className="relative w-full h-[400px] lg:h-[520px]">
              {/* Glowing backdrop for 3D model */}
              <div
                className="absolute inset-0 pointer-events-none rounded-3xl"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(0,123,201,0.08) 0%, transparent 65%)',
                }}
              />
              {/* Subtle ring decoration */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full pointer-events-none"
                style={{
                  border: '1px solid var(--border)',
                  opacity: 0.3,
                }}
              />
              <Suspense
                fallback={
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-10 h-10 rounded-full animate-spin"
                      style={{
                        border: '2px solid var(--border)',
                        borderTopColor: 'var(--accent-blue)',
                      }}
                    />
                  </div>
                }
              >
                <HVLSFan3D />
              </Suspense>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Elegant scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <span
          className="text-[10px] tracking-[0.25em] uppercase font-medium"
          style={{ color: 'var(--text-muted)' }}
        >
          Scroll
        </span>
        <motion.div
          className="w-px h-8"
          style={{ background: 'var(--border)' }}
        >
          <motion.div
            className="w-full rounded-full"
            style={{ background: 'var(--accent-blue)' }}
            animate={{ height: ['0%', '100%', '0%'] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
