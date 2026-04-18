import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const images = [
  { src: '/images/Gallery 1.jpg', label: 'Warehouse Installation' },
  { src: '/images/Gallery 2.jpg', label: 'Factory Deployment' },
  { src: '/images/Gallery 3.jpg', label: 'Commercial Space' },
  { src: '/images/Gallery 5.jpg', label: 'Large Facility' },
  { src: '/images/Gallery 6.jpg', label: 'Industrial Complex' },
  { src: '/images/Gallery 7.jpg', label: 'Sports Arena' },
  { src: '/images/Gallery 8.jpg', label: 'Logistics Centre' },
];

// ─── Lightbox ─────────────────────────────────────────────────────────────

function Lightbox({ image, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
          style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(14px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={image.src}
              alt={image.label}
              className="w-full max-h-[80vh] object-contain rounded-2xl"
              style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 rounded-b-2xl"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}>
              <p className="text-white font-semibold">{image.label}</p>
            </div>
            <button
              onClick={onClose}
              className="absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <X size={16} color="white" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Carousel ─────────────────────────────────────────────────────────────
//
// Track-based sliding: all cards sit in a flex row; the whole track
// translates left/right so the active card is always centered.
// Active card: 460px wide, full opacity, scale 1.
// Adjacent cards: 340px, 70% opacity. Further cards: 280px, 40% opacity.

// All cards share the same layout width; scale controls visual size.
// SLOT_X = center-to-center distance from the container midpoint.
// Chosen so that ±1 cards overlap center slightly and ±2 cards peek ~35% in from each edge.
const CARD_W  = 460;
const SLOT1_X = 370;  // center ↔ adjacent card center
const SLOT2_X = 650;  // center ↔ outer card center (partially clipped by overflow:hidden)

function GalleryCarousel({ onOpen, onActiveChange }) {
  const [active, setActive] = useState(0);
  const autoRef = useRef(null);
  const containerRef = useRef(null);
  const [containerW, setContainerW] = useState(0);
  const n = images.length;

  // ── carousel logic (unchanged) ──────────────────────────────────────────
  const go = useCallback((dir) => {
    setActive((prev) => {
      const next = (prev + dir + n) % n;
      onActiveChange(next);
      return next;
    });
  }, [n, onActiveChange]);

  useEffect(() => {
    autoRef.current = setInterval(() => go(1), 4000);
    return () => clearInterval(autoRef.current);
  }, [go]);

  const pauseAuto = () => clearInterval(autoRef.current);
  const resumeAuto = () => { autoRef.current = setInterval(() => go(1), 4000); };

  // ── container width (for absolute slot-x calculation) ───────────────────
  useLayoutEffect(() => {
    if (containerRef.current) setContainerW(containerRef.current.offsetWidth);
  }, []);
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((e) => setContainerW(e[0].contentRect.width));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // ── slot helpers ─────────────────────────────────────────────────────────
  const slotMagnitude = [0, SLOT1_X, SLOT2_X]; // indexed by abs(offset)

  const getSlotX = (offset) => {
    const abs = Math.abs(offset);
    if (abs === 0) return 0;
    const mag = abs <= 2 ? slotMagnitude[abs] : SLOT2_X + 420; // off-screen
    return offset > 0 ? mag : -mag;
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ height: 380, perspective: '1400px' }}
      onMouseEnter={pauseAuto}
      onMouseLeave={resumeAuto}
    >
      {images.map((img, i) => {
        // shortest-path circular offset so wrapping always feels natural
        let offset = ((i - active) % n + n) % n;
        if (offset > Math.floor(n / 2)) offset -= n;

        const abs     = Math.abs(offset);
        const visible = abs <= 2;
        const isCenter = abs === 0;

        const slotX   = getSlotX(offset);
        // card left = container-center + slotX - half-card-width
        const cardX   = containerW / 2 + slotX - CARD_W / 2;

        const opacity   = !visible ? 0 : abs === 0 ? 1    : abs === 1 ? 0.80 : 0.50;
        const scale     = abs === 0 ? 1.05 : abs === 1 ? 0.88 : 0.74;
        // slight rotateY gives 3-D depth: left cards tilt right, right cards tilt left
        const rotateY   = abs === 0 ? 0 : offset > 0 ? -10 : 10;
        const zIndex    = abs === 0 ? 30  : abs === 1 ? 20  : 10;
        const boxShadow = isCenter
          ? 'none'
          : '0 8px 22px rgba(0,0,0,0.10)';

        return (
          <motion.div
            key={i}
            initial={false}
            animate={{ x: cardX, opacity, scale, rotateY, zIndex }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="absolute overflow-hidden"
            style={{
              width: CARD_W,
              height: 300,
              top: '50%',
              left: 0,
              marginTop: -150,
              borderRadius: '16px',
              boxShadow,
              transformOrigin: 'center center',
              cursor: isCenter ? 'zoom-in' : visible ? 'pointer' : 'default',
              pointerEvents: visible ? 'auto' : 'none',
            }}
            onClick={() => {
              if (!visible) return;
              if (isCenter) onOpen(img);
              else go(offset > 0 ? 1 : -1);
            }}
          >
            <img
              src={img.src}
              alt={img.label}
              className="w-full h-full object-cover"
              loading="lazy"
              style={{ display: 'block' }}
            />

            {/* Side cards: soft light wash so they recede behind center */}
            {!isCenter && visible && (
              <div className="absolute inset-0" style={{ background: 'rgba(255,255,255,0.22)' }} />
            )}

            {/* Center card: hover-reveal gradient + label */}
            {isCenter && (
              <>
                <div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  // style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)' }}
                />
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-semibold text-base">{img.label}</p>
                </div>
              </>
            )}
          </motion.div>
        );
      })}

      {/* Edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-40 pointer-events-none"
        style={{ background: 'linear-gradient(to right, var(--bg-base) 0%, transparent 100%)' }} />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-40 pointer-events-none"
        style={{ background: 'linear-gradient(to left, var(--bg-base) 0%, transparent 100%)' }} />

      {/* Arrows */}
      <button
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.18)' }}
      >
        <ChevronLeft size={20} color="white" />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110"
        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.18)' }}
      >
        <ChevronRight size={20} color="white" />
      </button>
    </div>
  );
}

// ─── Dot indicators ───────────────────────────────────────────────────────

function Dots({ total, active, onDot }) {
  return (
    <div className="flex justify-center gap-2 mt-6">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDot(i)}
          className="transition-all duration-300 rounded-full cursor-pointer"
          style={{
            width: i === active ? 24 : 8,
            height: 8,
            background: i === active
              ? 'linear-gradient(90deg, #E52929, #007BC9)'
              : 'var(--border)',
          }}
        />
      ))}
    </div>
  );
}

// ─── Instagram icon ───────────────────────────────────────────────────────

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────

export default function Gallery() {
  const { ref, isInView } = useScrollAnimation();
  const [lightbox, setLightbox] = useState(null);
  const [dotActive, setDotActive] = useState(0);

  return (
    <section id="gallery" className="relative py-28 overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      {/* Top separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #007BC9, #E52929, transparent)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#007BC9]" />
            <span className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
              Our Work
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}
          >
            Our{' '}
            <span className="gradient-text">Gallery</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Explore real installations and product details from our projects.
          </p>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <GalleryCarousel onOpen={setLightbox} onActiveChange={setDotActive} />
          <Dots total={images.length} active={dotActive} onDot={setDotActive} />
        </motion.div>

        {/* Instagram CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center mt-10"
        >
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 text-sm font-semibold px-7 py-3 rounded-full transition-all duration-300 hover:opacity-90 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #E52929, #007BC9)',
              color: 'white',
              boxShadow: 'none',
            }}
          >
            <InstagramIcon />
            View More on Instagram
          </a>
        </motion.div>
      </div>

      <Lightbox image={lightbox} onClose={() => setLightbox(null)} />
    </section>
  );
}
