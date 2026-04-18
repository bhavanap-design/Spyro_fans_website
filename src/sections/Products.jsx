import { useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

const FloorFan3D = lazy(() => import('../components/FloorFan3D'));
const HVLSFan3D  = lazy(() => import('../components/HVLSFan3D'));
const PoleFan3D  = lazy(() => import('../components/PoleFan3D'));
const SpeedControlSlider = lazy(() => import('../components/SpeedControlSlider'));

// ─── PDF helper ────────────────────────────────────────────────────────────

const handleDownloadAndOpen = (filePath) => {
  window.open(filePath, '_blank');
  const link = document.createElement('a');
  link.href = filePath;
  link.setAttribute('download', '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ─── Product data ──────────────────────────────────────────────────────────

const products = [
  {
    id: 'roof',
    imageRight: false,
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
    sizes: ['8 ft', '10 ft', '12 ft', '14 ft', '16 ft', '18 ft', '20 ft', '24 ft'],
    image: '/images/fan_roof.png',
    is3D: true,
    fanType: 'hvls',
    specPdf: '/Spyro_fans_Pdfs/Roof_Fans_specs.pdf',
  },
  {
    id: 'floor',
    imageRight: true,
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
    sizes: ['4 ft', '5 ft'],
    image: '/images/Floor_fan.png',
    is3D: true,
    fanType: 'floor',
    specPdf: '/Spyro_fans_Pdfs/Floor_Fans_specs.pdf',
  },
  {
    id: 'pole',
    imageRight: false,
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
    sizes: ['8 ft', '10 ft', '12 ft', '14 ft', '16 ft'],
    image: '/images/Pole_fan.png',
    is3D: true,
    fanType: 'pole',
    specPdf: '/Spyro_fans_Pdfs/Pole_Fans_specs.pdf',
  },
];

// ─── Static image panel ────────────────────────────────────────────────────

function ImagePanel({ src, alt }) {
  const webpSrc = src.replace(/\.png$/i, '.webp');

  return (
    <div
      className="rounded-3xl overflow-hidden flex items-center justify-center p-8 relative"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
        minHeight: 360,
      }}
    >
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'none',
        }}
      />
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          width={768}
          height={573}
          className="relative w-full max-w-sm object-contain drop-shadow-2xl"
          style={{ maxHeight: 340 }}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </picture>
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
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Fan sizes">
        {sizes.map((s) => (
          <button
            key={s}
            onClick={() => setSelected(s)}
            role="radio"
            aria-checked={selected === s}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
            style={
              selected === s
                ? { background: '#007BC9', color: '#fff' }
                : { background: 'var(--bg-base)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }
            }
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 3D panel with speed slider ────────────────────────────────────────────

function Fan3DPanel({ fanType }) {
  const [speed, setSpeed] = useState(90);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      {/* 3D fan container */}
      <div
        className="rounded-3xl overflow-hidden flex items-center justify-center relative"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
          minHeight: 360,
          height: 420,
        }}
      >
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: 'none',
          }}
        />
        <Suspense
          fallback={
            <div className="flex items-center justify-center w-full h-full">
              <div
                className="w-8 h-8 rounded-full animate-spin"
                style={{ border: '2px solid var(--border)', borderTopColor: 'var(--accent-blue)' }}
              />
            </div>
          }
        >
          {fanType === 'hvls' ? (
            <HVLSFan3D mode="product" speed={speed} />
          ) : fanType === 'pole' ? (
            <PoleFan3D speed={speed} />
          ) : (
            <FloorFan3D speed={speed} />
          )}
        </Suspense>
      </div>

      {/* Speed control slider */}
      <div
        className="rounded-2xl px-6 py-5"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
        }}
      >
        <Suspense fallback={null}>
          <SpeedControlSlider
            speed={speed}
            onChange={setSpeed}
            isDragging={isDragging}
          />
        </Suspense>
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
      role="article"
      aria-labelledby={`product-title-${product.id}`}
    >
      <div
        className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-start ${
          isImageRight ? 'lg:[&>*:first-child]:order-last' : ''
        }`}
      >
        {/* Visual panel */}
        <motion.div
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay: 0.2 }}
        >
          {product.is3D ? (
            <Fan3DPanel fanType={product.fanType} />
          ) : (
            <ImagePanel src={product.image} alt={product.title} />
          )}
        </motion.div>

        {/* Details panel */}
        <div className="flex flex-col gap-7">
          {/* Tag + number */}
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: product.tagColor, color: '#fff' }}
            >
              {product.tag}
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              0{index + 1}
            </span>
          </div>

          {/* Title */}
          <div>
            <p
              className="text-xs uppercase tracking-widest mb-1.5"
              style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
            >
              {product.subtitle}
            </p>
            <h3
              id={`product-title-${product.id}`}
              className="text-3xl lg:text-4xl font-bold leading-tight"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
            >
              {product.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {product.description}
          </p>

          {/* Bullet points — collapsible */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <button
              onClick={() => setBulletsOpen((prev) => !prev)}
              aria-expanded={bulletsOpen}
              className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold cursor-pointer transition-colors"
              style={{ color: 'var(--text-primary)', background: 'var(--bg-surface)' }}
            >
              Key Features
              {bulletsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {bulletsOpen && (
              <ul className="px-5 pt-3 pb-4 flex flex-col gap-2.5" style={{ background: 'var(--bg-base)' }}>
                {product.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm">
                    <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#007BC9' }} aria-hidden="true" />
                    <span style={{ color: 'var(--text-secondary)' }}>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Size selector */}
          <SizesRow sizes={product.sizes} />

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              className="px-7 py-3 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-105 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #E52929, #007BC9)' }}
            >
              Request Quote
            </button>
            <button
              onClick={() => handleDownloadAndOpen(product.specPdf)}
              className="px-7 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
            >
              Download Spec Sheet
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────

export default function Products() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section
      id="products"
      className="relative py-16"
      style={{ background: 'var(--bg-base)' }}
      aria-labelledby="products-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end gap-8 mb-4"
        >
          <div className="flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-0.5 rounded-full"
                style={{ background: 'var(--accent-blue)' }}
              />
              <span
                className="text-xs tracking-widest uppercase font-medium"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}
              >
                Product Range
              </span>
            </div>
            <h2
              id="products-heading"
              className="text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
            >
              The right fan for{' '}
              <span style={{ color: 'var(--accent-blue)' }}>every space</span>
            </h2>
            <p className="text-lg max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              From massive warehouses to covered outdoor venues — SpyroFans has
              a solution engineered for your exact application.
            </p>
          </div>
          <div className="hidden lg:block flex-grow h-px mb-4" style={{ background: 'var(--border)' }} />
        </motion.div>

        {/* Individual product sections */}
        {products.map((p, i) => (
          <ProductSection key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
