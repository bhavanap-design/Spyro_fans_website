import { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

const HVLSFan3D = lazy(() => import('../components/HVLSFan3D'));
const SpeedControlSlider = lazy(() => import('../components/SpeedControlSlider'));

// ─── Spec table data ──────────────────────────────────────────────────────────

const specRows = [
  { label: 'Fan Size (diameter)',        values: ['24 ft. (7.3m)', '20 ft. (6.1m)', '18 ft. (5.5m)', '16 ft. (4.9m)', '14 ft. (4.3m)', '12 ft. (3.7m)', '10ft. (3m)', '8 ft. (2.5m)'] },
  { label: 'Motor Power',               values: ['1.5 kw (2Hp)', '1.1 kw (1.5Hp)', '1.1 kw (1.5Hp)', '0.75 kw (1Hp)', '0.75 kw (1Hp)', '0.56 kw (0.75Hp)', '0.56 kw (0.75Hp)', '0.37 kw (0.5Hp)'] },
  { label: 'No. of Blades',             values: ['5', '5', '5', '5', '5', '5', '5', '5'] },
  { label: 'RPM',                       values: ['54', '60', '70', '70', '80', '92', '110', '125'] },
  { label: 'Air Volume (CMM)',           values: ['15,500', '11900', '11,000', '7,250', '6,650', '5,700', '5,100', '3,250'] },
  { label: 'Coverage Area (m²)',         values: ['1018', '707', '573', '452', '346', '254', '177', '113'] },
  { label: 'Total weight (kg)',          values: ['160', '130', '120', '110', '102', '95', '90', '90'] },
  { label: 'Noise',                     values: ['<45 db', '<45 db', '<45 db', '<45 db', '<45 db', '<45 db', '<45 db', '<45 db'] },
  { label: '3-Phase Drive Voltage (v)', values: ['410', '410', '410', '410', '410', '410', '410', '410'] },
  { label: '3-Phase Drive Amphere (A)', values: ['4.1', '3.2', '3.1', '2.4', '2.3', '1.9', '1.8', '1.4'] },
  { label: '1-Phase Drive Voltage (v)', values: ['235', '235', '235', '235', '235', '235', '235', '235'] },
  { label: '1-Phase Drive Amphere (A)', values: ['12.4', '9.7', '9.4', '7.3', '7', '5.8', '5.5', '4.3'] },
  { label: 'Frequency (Hz)',            values: ['50/60', '50/60', '50/60', '50/60', '50/60', '50/60', '50/60', '50/60'] },
];

const models = ['Spyro 24', 'Spyro 20', 'Spyro 18', 'Spyro 16', 'Spyro 14', 'Spyro 12', 'Spyro 10', 'Spyro 8'];

const galleryImages = [
  { src: '/images/Gallery 1.jpg', alt: 'SpyroFans installation in warehouse' },
  { src: '/images/Gallery 2.jpg', alt: 'SpyroFans in industrial facility' },
  { src: '/images/Gallery 5.jpg', alt: 'Roof mounted fan overhead view' },
  { src: '/images/Gallery 6.jpg', alt: 'SpyroFans installation detail' },
];

const bullets = [
  'Covers up to 2,000 m² with a single unit',
  'Aircraft-grade aluminium blades — zero corrosion',
  'Precision-balanced for vibration-free operation',
  'IP55 motor rated for dusty, humid environments',
  'Integrated variable-speed controller included',
  'Gearless direct drive — zero maintenance',
  '10-year structural warranty',
];

const handleDownloadAndOpen = (filePath) => {
  window.open(filePath, '_blank');
  const link = document.createElement('a');
  link.href = filePath;
  link.setAttribute('download', '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ─── Spec Table ───────────────────────────────────────────────────────────────

function SpecTable() {
  const [highlight, setHighlight] = useState(null);

  return (
    <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid var(--border)' }}>
      <table className="w-full min-w-[720px] text-sm border-collapse">
        <thead>
          <tr style={{ background: 'var(--bg-surface)', borderBottom: '2px solid var(--border)' }}>
            <th
              className="text-left px-5 py-4 font-semibold text-xs uppercase tracking-widest w-52"
              style={{ color: 'var(--text-muted)' }}
            >
              Specification
            </th>
            {models.map((m, i) => (
              <th
                key={m}
                onMouseEnter={() => setHighlight(i)}
                onMouseLeave={() => setHighlight(null)}
                className="px-4 py-4 text-center font-bold text-xs uppercase tracking-wide cursor-default transition-colors"
                style={{
                  color: highlight === i ? '#fff' : 'var(--text-primary)',
                  background: highlight === i ? 'linear-gradient(135deg, #E52929, #007BC9)' : 'transparent',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {m}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specRows.map((row, ri) => (
            <tr
              key={row.label}
              style={{
                background: ri % 2 === 0 ? 'var(--bg-base)' : 'var(--bg-surface)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <td className="px-5 py-3.5 font-medium text-xs" style={{ color: 'var(--text-secondary)' }}>
                {row.label}
              </td>
              {row.values.map((v, ci) => (
                <td
                  key={ci}
                  className="px-4 py-3.5 text-center text-sm font-semibold transition-colors"
                  style={{
                    color: highlight === ci ? '#007BC9' : 'var(--text-primary)',
                  }}
                >
                  {v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RoofMountedProduct() {
  const [speed, setSpeed] = useState(90);
  const navigate = useNavigate();

  return (
    <div className="pb-20" style={{ background: 'var(--bg-base)', paddingTop: '7rem' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-medium mb-10 transition-opacity hover:opacity-70 cursor-pointer"
          style={{ color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={16} />
          Back to Products
        </button>

        {/* ── SECTION 1: Hero layout ── */}
        <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">

          {/* LEFT — 3D model + gallery images */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5"
          >
            {/* 3D viewer */}
            <div
              className="rounded-3xl overflow-hidden flex items-center justify-center relative"
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                height: 420,
              }}
            >
              <Suspense
                fallback={
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="w-8 h-8 rounded-full animate-spin"
                      style={{ border: '2px solid var(--border)', borderTopColor: '#007BC9' }} />
                  </div>
                }
              >
                <HVLSFan3D mode="product" speed={speed} />
              </Suspense>
            </div>

            {/* Speed slider */}
            <div
              className="rounded-2xl px-6 py-5"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              <Suspense fallback={null}>
                <SpeedControlSlider speed={speed} onChange={setSpeed} />
              </Suspense>
            </div>

            {/* Gallery images — 2×2 grid */}
            <div className="grid grid-cols-2 gap-4">
              {galleryImages.map((img) => (
                <div
                  key={img.src}
                  className="rounded-2xl overflow-hidden"
                  style={{ border: '1px solid var(--border)', aspectRatio: '4/3' }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Product info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-7 lg:sticky lg:top-28"
          >
            {/* Badge */}
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: '#E52929', color: '#fff' }}
              >
                Bestseller
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>01</span>
            </div>

            {/* Title */}
            <div>
              <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                SpyroCeiling Pro
              </p>
              <h1
                className="text-4xl lg:text-5xl font-bold leading-tight"
                style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}
              >
                Roof Mounted<br />
                <span className="gradient-text">HVLS Fan</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Permanently suspended from the structural ceiling, the SpyroCeiling Pro delivers uniform airflow across your entire facility. Designed for warehouses, distribution centres, and large manufacturing plants where floor space is sacred.
            </p>

            {/* Bullets */}
            <ul className="flex flex-col gap-3">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm">
                  <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#007BC9' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{b}</span>
                </li>
              ))}
            </ul>

            {/* Available sizes */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                Available Sizes
              </p>
              <div className="flex flex-wrap gap-2">
                {['8 ft', '10 ft', '12 ft', '14 ft', '16 ft', '18 ft', '20 ft', '24 ft'].map((s) => (
                  <span
                    key={s}
                    className="px-4 py-1.5 rounded-full text-sm font-medium"
                    style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                className="px-8 py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:scale-105 cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #E52929, #007BC9)' }}
              >
                Request Quote
              </button>
              <button
                onClick={() => handleDownloadAndOpen('/Spyro_fans_Pdfs/Roof_Fans_specs.pdf')}
                className="px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              >
                Download Spec Sheet
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── SECTION 2: Full spec table ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {/* Section header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E52929]" />
              <span className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
                Technical Specifications
              </span>
            </div>
            <h2
              className="text-3xl lg:text-4xl font-bold"
              style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}
            >
              Full model <span className="gradient-text">comparison</span>
            </h2>
          </div>

          <SpecTable />
        </motion.div>

      </div>
    </div>
  );
}
