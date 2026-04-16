import { lazy, Suspense, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import SpeedControlSlider from '../components/SpeedControlSlider';

// Lazy-load the heavy interactive 3D fan
const InteractiveFan3D = lazy(() => import('../components/InteractiveFan3D'));

// ─── Product data ──────────────────────────────────────────────────────────

const products = [
  {
    id: 'roof',
    imageRight: false, // image/3D on LEFT
    tag: 'Bestseller',
    tagColor: '#E52929',
    title: 'Roof Mounted HVLS Fan',
    subtitle: 'SpyroCeiling Pro',
    description:
      'Permanently suspended from the structural ceiling, the SpyroCeiling Pro delivers uniform airflow across your entire facility. Designed for warehouses, distribution centres, and large manufacturing plants where floor space is sacred.',
    bullets: [
      'Covers up to 2,000 m² with a single unit',
      'Aircraft-grade aluminium blades — zero corrosion',
      'Precision-balanced for vibration-free operation',
      'IP55 motor rated for dusty, humid environments',
      'Integrated variable-speed controller included',
    ],
    sizes: ['8 ft', '10 ft', '12 ft', '16 ft', '20 ft', '24 ft'],
    is3D: true, // show interactive 3D model
  },
  {
    id: 'floor',
    imageRight: true,  // image on RIGHT
    tag: 'Portable',
    tagColor: '#007BC9',
    title: 'Floor Mounted HVLS Fan',
    subtitle: 'SpyroStand Elite',
    description:
      'The SpyroStand Elite gives you industrial-grade airflow without a permanent installation. Perfect for loading docks, temporary workspaces, events, and any facility where flexibility is the priority. Lockable casters for safe repositioning.',
    bullets: [
      'Height-adjustable column — 2.2 m to 3.8 m',
      'Heavy-duty lockable casters for easy relocation',
      'Robust powder-coated steel frame',
      'Single-phase 230V supply — plug and go',
      'Protective blade guard cage included',
    ],
    sizes: ['3 ft', '4 ft', '5 ft', '6 ft'],
    image: '/images/Floor_fan.png',
    is3D: false,
  },
  {
    id: 'pole',
    imageRight: false, // image on LEFT
    tag: 'Outdoor Ready',
    tagColor: '#E52929',
    title: 'Pole Mounted HVLS Fan',
    subtitle: 'SpyroPole Flex',
    description:
      'When there is no roof to hang from, the SpyroPole Flex is your answer. Mounted on a structural steel pole, it serves open-sided buildings, aircraft hangars, covered sports facilities, and outdoor loading areas with the same industrial-grade performance.',
    bullets: [
      'Hot-dip galvanised pole — corrosion-proof for outdoor use',
      'Adjustable blade tilt up to 15° for directional airflow',
      'Wind-rated to 120 km/h when stationary',
      'Remote speed control with 10-preset memory',
      'Available with anti-condensation motor heater option',
    ],
    sizes: ['8 ft', '10 ft', '12 ft', '16 ft', '20 ft'],
    image: '/images/Pole_fan.png',
    is3D: false,
  },
];

// ─── Interactive 3D panel (Roof fan) ──────────────────────────────────────

function RoofFan3DPanel() {
  const [speed, setSpeed] = useState(45);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragChange = useCallback((v) => setIsDragging(v), []);

  return (
    <div className="flex flex-col gap-5">
      {/* 3D Canvas */}
      <div
        className="rounded-3xl overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, #0D1520 0%, #0A0F18 50%, #0D0A10 100%)',
          border: '1px solid rgba(0,123,201,0.15)',
          boxShadow: '0 0 60px rgba(0,123,201,0.08)',
        }}
      >
        {/* Hint label */}
        <div
          className="absolute top-4 left-4 z-10 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)' }}
        >
          <span>Drag to rotate</span>
        </div>

        <Suspense
          fallback={
            <div className="flex items-center justify-center" style={{ height: 420 }}>
              <div
                className="w-10 h-10 rounded-full animate-spin"
                style={{ border: '2px solid #007BC9', borderTopColor: '#E52929' }}
              />
            </div>
          }
        >
          <InteractiveFan3D
            speed={speed}
            onDragChange={handleDragChange}
            height="420px"
          />
        </Suspense>
      </div>

      {/* Speed control */}
      <div
        className="rounded-2xl px-6 py-5"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
        }}
      >
        <SpeedControlSlider
          speed={speed}
          onChange={setSpeed}
          isDragging={isDragging}
        />
      </div>
    </div>
  );
}

// ─── Static image panel ────────────────────────────────────────────────────

function ImagePanel({ src, alt }) {
  return (
    <div
      className="rounded-3xl overflow-hidden flex items-center justify-center p-8 relative"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-lg)',
        minHeight: 360,
      }}
    >
      {/* Subtle radial glow behind image */}
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,123,201,0.15) 0%, transparent 70%)' }}
      />
      <motion.img
        src={src}
        alt={alt}
        className="relative w-full max-w-sm object-contain drop-shadow-2xl"
        style={{ maxHeight: 340 }}
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
}

// ─── Sizes selector ────────────────────────────────────────────────────────

function SizesRow({ sizes }) {
  const [selected, setSelected] = useState(sizes[0]);
  return (
    <div>
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: 'var(--text-muted)' }}
      >
        Available Sizes
      </p>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => (
          <button
            key={s}
            onClick={() => setSelected(s)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
            style={
              selected === s
                ? { background: '#007BC9', color: '#fff', boxShadow: '0 0 16px rgba(0,123,201,0.35)' }
                : {
                    background: 'var(--bg-base)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border)',
                  }
            }
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Single product section ────────────────────────────────────────────────

function ProductSection({ product, index }) {
  const { ref, isInView } = useScrollAnimation({ once: true, amount: 0.15 });
  const [bulletsOpen, setBulletsOpen] = useState(true);
  const isImageRight = product.imageRight;

  return (
    <motion.div
      ref={ref}
      id={`product-${product.id}`}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="py-16 lg:py-24 border-t"
      style={{ borderColor: 'var(--border)' }}
    >
      <div
        className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${
          isImageRight ? 'lg:[&>*:first-child]:order-last' : ''
        }`}
      >
        {/* ── Visual panel (3D or image) ── */}
        <div>
          {product.is3D ? (
            <RoofFan3DPanel />
          ) : (
            <ImagePanel src={product.image} alt={product.title} />
          )}
        </div>

        {/* ── Details panel ── */}
        <div className="flex flex-col gap-7">
          {/* Tag + number */}
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: `${product.tagColor}18`, color: product.tagColor }}
            >
              {product.tag}
            </span>
            <span
              className="text-xs font-mono"
              style={{ color: 'var(--text-muted)' }}
            >
              0{index + 1}
            </span>
          </div>

          {/* Title */}
          <div>
            <p
              className="text-xs uppercase tracking-widest mb-1.5"
              style={{ color: 'var(--text-muted)' }}
            >
              {product.subtitle}
            </p>
            <h3
              className="text-3xl lg:text-4xl font-bold leading-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {product.title}
            </h3>
          </div>

          {/* Description */}
          <p
            className="text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {product.description}
          </p>

          {/* Bullet points — collapsible */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: '1px solid var(--border)' }}
          >
            <button
              onClick={() => setBulletsOpen(!bulletsOpen)}
              className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold cursor-pointer transition-colors"
              style={{
                color: 'var(--text-primary)',
                background: 'var(--bg-surface)',
              }}
            >
              Key Features
              {bulletsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {bulletsOpen && (
              <ul
                className="px-5 pb-4 flex flex-col gap-2.5"
                style={{ background: 'var(--bg-base)' }}
              >
                {product.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm">
                    <Check
                      size={14}
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: '#007BC9' }}
                    />
                    <span style={{ color: 'var(--text-secondary)' }}>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Size selector */}
          <SizesRow sizes={product.sizes} />

          {/* CTA */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              className="px-7 py-3 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-105 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #E52929, #007BC9)',
                boxShadow: '0 4px 20px rgba(229,41,41,0.25)',
              }}
            >
              Request Quote
            </button>
            <button
              className="px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              }}
            >
              Download Spec Sheet
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section header ────────────────────────────────────────────────────────

export default function Products() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section id="products" className="relative py-16" style={{ background: 'var(--bg-base)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 glass"
            style={{ border: '1px solid var(--border)' }}
          >
            <span
              className="text-xs tracking-widest uppercase font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              Product Range
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            The right fan for{' '}
            <span className="gradient-text">every space</span>
          </h2>
          <p
            className="text-lg max-w-xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            From massive warehouses to covered outdoor venues — SpyroFans has a solution engineered for your exact application.
          </p>
        </motion.div>

        {/* Individual product sections */}
        {products.map((p, i) => (
          <ProductSection key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
