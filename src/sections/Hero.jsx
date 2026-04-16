import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const HVLSFan3D = lazy(() => import('../components/HVLSFan3D'));
const ParticleField = lazy(() => import('../components/ParticleField'));

const fadeUp = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 } };

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const scrollToProducts = () => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToContact  = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      className="relative w-full min-h-screen flex items-center overflow-hidden transition-colors duration-500"
      style={{ background: isDark ? '#0A0A0F' : '#F0F4F8' }}
    >
      {/* Background gradient blobs */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(0,123,201,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 20% 70%, rgba(229,41,41,0.08) 0%, transparent 50%)'
            : 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(0,123,201,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 20% 70%, rgba(229,41,41,0.06) 0%, transparent 50%)',
        }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'} 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Particles — dark mode only */}
      {isDark && (
        <Suspense fallback={null}>
          <div className="absolute inset-0 z-0">
            <ParticleField />
          </div>
        </Suspense>
      )}

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

          {/* Left: text */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 w-fit"
            >
              <span className="w-2 h-2 rounded-full bg-[#E52929] animate-pulse" />
              <span
                className="text-xs font-medium tracking-widest uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                Industrial HVLS Technology
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              Powerful
              <br />
              <span className="gradient-text">Airflow.</span>
              <br />
              Maximum
              <br />
              Efficiency.
            </motion.h1>

            <motion.p
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-lg lg:text-xl leading-relaxed mb-10 max-w-md"
              style={{ color: 'var(--text-secondary)' }}
            >
              Industrial-grade HVLS fans engineered for large spaces — warehouses, factories, and commercial environments.
            </motion.p>

            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.65 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={scrollToProducts}
                className="text-white font-semibold px-8 py-4 rounded-full text-sm tracking-wide hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #E52929, #007BC9)',
                  boxShadow: '0 6px 28px rgba(229,41,41,0.25)',
                }}
              >
                Explore Products
              </button>
              <button
                onClick={scrollToContact}
                className="font-semibold px-8 py-4 rounded-full text-sm tracking-wide hover:scale-105 transition-all duration-300 cursor-pointer glass"
                style={{ color: 'var(--text-primary)' }}
              >
                Get Quote →
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex gap-8 mt-14 pt-10"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              {[
                { value: '24m', label: 'Blade Diameter' },
                { value: '∼56%', label: 'Energy Savings' },
                { value: '10yr', label: 'Warranty' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    {stat.value}
                  </div>
                  <div className="text-xs mt-1 tracking-wide" style={{ color: 'var(--text-muted)' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: 3D fan */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
            className="order-1 lg:order-2 relative"
            style={{ height: '560px' }}
          >
            <div
              className="absolute rounded-full blur-3xl opacity-25 pointer-events-none"
              style={{
                width: '60%', height: '60%', top: '20%', left: '20%',
                background: 'radial-gradient(circle, #007BC9 0%, #E52929 100%)',
              }}
            />
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full animate-spin" style={{ border: '2px solid #007BC9', borderTopColor: '#E52929' }}/>
                </div>
              }
            >
              <HVLSFan3D />
            </Suspense>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          <ChevronDown size={18} style={{ color: 'var(--text-muted)' }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
