import { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';

const FloorFan3D = lazy(() => import('../components/FloorFan3D'));
const SpeedControlSlider = lazy(() => import('../components/SpeedControlSlider'));

// ─── Spec table data (exact values from reference) ───────────────────────────

const specRows = [
  { label: 'Fan size (dia.)',   sub: null,          value: '6 ft.' },
  { label: 'Motor Power',       sub: null,          value: '1.5 kw (2 Hp)' },
  { label: 'No. of blades',     sub: null,          value: '5' },
  { label: 'RPM',               sub: null,          value: '55' },
  { label: 'Air volume (CMM)',   sub: null,          value: '15,500' },
  { label: 'Coverage area (sq.m)', sub: null,        value: '1700' },
  { label: 'Total weight (kg)', sub: null,          value: '130' },
  { label: 'Noise',             sub: null,          value: '<38dB' },
  { label: 'Frequency (Hz)',    sub: null,          value: '50/60' },
  { label: '3-Phase Drive',     sub: 'Voltage (V)', value: '415' },
  { label: '',                  sub: 'Current (A)', value: '230' },
  { label: '1-Phase Drive',     sub: 'Voltage (V)', value: '14.8' },
  { label: '',                  sub: 'Current (A)', value: '4.7' },
];

const galleryImages = [
  { src: '/images/Gallery 3.jpg', alt: 'Floor fan in facility' },
  { src: '/images/Gallery 7.jpg', alt: 'Floor fan installation' },
  { src: '/images/Gallery 8.jpg', alt: 'Floor fan in use' },
];

const bullets = [
  'Height-adjustable column — 2.2 m to 3.8 m',
  'Heavy-duty lockable casters for easy relocation',
  'Robust powder-coated steel frame',
  'Single-phase 230V supply — plug and go',
  'Protective blade guard cage included',
  'Ideal for loading docks and temporary workspaces',
  'Gearless direct drive — zero maintenance',
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
  return (
    <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid var(--border)' }}>
      <table className="w-full text-sm border-collapse">
        {/* Header */}
        <thead>
          <tr style={{ background: 'var(--bg-surface)', borderBottom: '2px solid var(--border)' }}>
            <th
              colSpan={2}
              className="text-left px-5 py-4 font-semibold text-xs uppercase tracking-widest"
              style={{ color: 'var(--text-muted)', width: '60%' }}
            >
              Specification
            </th>
            <th
              className="px-5 py-4 text-left font-bold text-sm"
              style={{ color: '#E52929' }}
            >
              Spyro Fans
            </th>
          </tr>
        </thead>

        <tbody>
          {specRows.map((row, ri) => {
            const isGroupStart = row.label !== '';
            const isEven = ri % 2 === 0;

            return (
              <tr
                key={ri}
                style={{
                  background: isEven ? 'var(--bg-base)' : 'var(--bg-surface)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {/* Main label — only render cell when label exists; rowspan handled via CSS */}
                <td
                  className="px-5 py-3.5 font-medium text-sm align-middle"
                  style={{
                    color: 'var(--text-secondary)',
                    width: '35%',
                    borderRight: row.sub ? '1px solid var(--border)' : 'none',
                  }}
                >
                  {isGroupStart ? row.label : ''}
                </td>

                {/* Sub-label */}
                <td
                  className="px-5 py-3.5 text-sm align-middle"
                  style={{ color: 'var(--text-muted)', width: '25%' }}
                >
                  {row.sub || ''}
                </td>

                {/* Value */}
                <td
                  className="px-5 py-3.5 text-sm font-semibold align-middle"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {row.value}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FloorMountedProduct() {
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
                <FloorFan3D speed={speed} />
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

            {/* Gallery images */}
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
                style={{ background: '#007BC9', color: '#fff' }}
              >
                Portable
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>02</span>
            </div>

            {/* Title */}
            <div>
              <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                SpyroStand Elite
              </p>
              <h1
                className="text-4xl lg:text-5xl font-bold leading-tight"
                style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}
              >
                Floor Mounted<br />
                <span className="gradient-text">HVLS Fan</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              The SpyroStand Elite gives you industrial-grade airflow without a permanent installation. Perfect for loading docks, temporary workspaces, events, and any facility where flexibility is the priority. Lockable casters for safe repositioning.
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
                {['4 ft', '5 ft'].map((s) => (
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
                onClick={() => handleDownloadAndOpen('/Spyro_fans_Pdfs/Floor_Fans_specs.pdf')}
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
              Complete <span className="gradient-text">specifications</span>
            </h2>
          </div>

          <SpecTable />
        </motion.div>

      </div>
    </div>
  );
}
