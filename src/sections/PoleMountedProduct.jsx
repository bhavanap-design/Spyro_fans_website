import { useState, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import AirflowGraph from '../components/AirflowGraph';
import AirflowCoverageGraph from '../components/AirflowCoverageGraph';
import GalleryModal from '../components/GalleryModal';
import VideoModal from '../components/VideoModal';

const VIDEO_ID = 'MwybkzSCgV0';

const PoleFan3D = lazy(() => import('../components/PoleFan3D'));
const SpeedControlSlider = lazy(() => import('../components/SpeedControlSlider'));

// ─── Spec table data (exact values from reference) ───────────────────────────

const models = ['Spyro 16', 'Spyro 14', 'Spyro 12', 'Spyro 10', 'Spyro 8'];

const specRows = [
  { label: 'Fan Size (diameter)',        values: ['16 ft. (4.9m)', '14 ft. (4.3m)', '12 ft. (3.7m)', '10ft. (3m)', '8 ft. (2.5m)'] },
  { label: 'Motor Power',               values: ['0.75 kw (1Hp)', '0.75 kw (1Hp)', '0.56 kw (0.75Hp)', '0.56 kw (0.75Hp)', '0.37 kw (0.5Hp)'] },
  { label: 'No. of Blades',             values: ['5', '5', '5', '5', '5'] },
  { label: 'RPM',                       values: ['70', '80', '92', '110', '125'] },
  { label: 'Air Volume (CMM)',           values: ['7,250', '6,650', '5,700', '5,100', '3,250'] },
  { label: 'Coverage Area (sq.m)',       values: ['452', '346', '254', '177', '113'] },
  { label: 'Total weight (kg)',          values: ['110', '102', '95', '90', '90'] },
  { label: 'Noise',                     values: ['<45 db', '<45 db', '<45 db', '<45 db', '<45 db'] },
  { label: '3-Phase Drive Voltage (v)', values: ['410', '410', '410', '410', '410'] },
  { label: '3-Phase Drive Amphere (A)', values: ['2.4', '2.3', '1.9', '1.8', '1.4'] },
  { label: '1-Phase Drive Voltage (v)', values: ['235', '235', '235', '235', '235'] },
  { label: '1-Phase Drive Amphere (A)', values: ['7.3', '7', '5.8', '5.5', '4.3'] },
  { label: 'Frequency (Hz)',            values: ['50/60', '50/60', '50/60', '50/60', '50/60'] },
];

const galleryImages = [
  { src: '/images/Gallery 3.jpg', alt: 'Pole fan installation' },
  { src: '/images/Pole_fan.jpg', alt: 'Pole fan outdoor' },
  { src: '/images/Pole_fan_1.png', alt: 'Pole fan detail' },
];

const bullets = [
  'Hot-dip galvanised pole — corrosion-proof for outdoor use',
  'Adjustable blade tilt up to 15° for directional airflow',
  'Wind-rated to 120 km/h when stationary',
  'Remote speed control with 10-preset memory',
  'Available with anti-condensation motor heater option',
  'Ideal for open-sided buildings and aircraft hangars',
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
  const [highlight, setHighlight] = useState(null);

  return (
    <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid var(--border)' }}>
      <table className="w-full min-w-[640px] text-sm border-collapse">
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
                className="px-4 py-4 text-center font-bold text-xs uppercase tracking-wide cursor-default transition-all"
                style={{
                  color: highlight === i ? '#fff' : '#E52929',
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
                  style={{ color: highlight === ci ? '#007BC9' : 'var(--text-primary)' }}
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

export default function PoleMountedProduct() {
  const [speed, setSpeed] = useState(90);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [videoId, setVideoId] = useState(null);
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
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">

          {/* ── LEFT — 3D model + slider ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5 lg:sticky lg:top-28"
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
                <PoleFan3D speed={speed} />
              </Suspense>

              {/* View Gallery / Watch Video buttons */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4 z-10">
                <button
                  onClick={() => setGalleryOpen(true)}
                  className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
                  style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', border: '1px solid var(--border)', backdropFilter: 'blur(8px)' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  View Gallery
                </button>
                <button
                  onClick={() => setVideoId(VIDEO_ID)}
                  className="flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold text-white transition-all duration-300 hover:scale-105 hover:opacity-90 cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #E52929, #007BC9)' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                  Watch Video
                </button>
              </div>
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
          </motion.div>

          {/* ── RIGHT — graphs + product info ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Graphs block */}
            <AirflowGraph speed={speed} fanType="pole" />
            <AirflowCoverageGraph speed={speed} />

            {/* Divider */}
            <div className="h-px" style={{ background: 'var(--border)' }} />

            {/* Product info */}
            <div className="flex flex-col gap-6">
            {/* Badge */}
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: '#E52929', color: '#fff' }}
              >
                Outdoor Ready
              </span>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>03</span>
            </div>

            {/* Title */}
            <div>
              {/* <p className="text-xs uppercase tracking-widest mb-1.5" style={{ color: 'var(--text-muted)' }}>
                SpyroPole Flex
              </p> */}
              <h1
                className="text-4xl lg:text-5xl font-bold leading-tight"
                style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}
              >
                Pole Mounted<br />
                <span className="gradient-text">HVLS Fan</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              When there is no roof for installation, pole-mounted HVLS fans provide elevated airflow solutions, delivering uniform air distribution and efficient ventilation across large open and semi-outdoor spaces.
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
                {['8 ft', '10 ft', '12 ft', '14 ft', '16 ft'].map((s) => (
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
                onClick={() => handleDownloadAndOpen('/Spyro_fans_Pdfs/Pole_Fans_specs.pdf')}
                className="px-8 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 cursor-pointer"
                style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              >
                Download Spec Sheet
              </button>
            </div>
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
              Variant <span className="gradient-text">comparison</span>
            </h2>
          </div>

          <SpecTable />
        </motion.div>

      </div>

      {galleryOpen && <GalleryModal fanType="pole" onClose={() => setGalleryOpen(false)} />}
      <VideoModal videoId={videoId} onClose={() => setVideoId(null)} />
    </div>
  );
}
