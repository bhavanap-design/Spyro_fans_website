import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Product image sets ────────────────────────────────────────────────────────

const GALLERY = {
  hvls: [
    { src: '/images/Gallery 8.jpg',  caption: 'Roof fan installation' },
    { src: '/images/Gallery 2.jpg',  caption: 'Industrial facility' },
    { src: '/images/roof_fan.png',   caption: 'SpyroCeiling Pro' },
    { src: '/images/Gallery 9.png',  caption: 'Overhead view' },
    { src: '/images/Gallery 1.jpg',  caption: 'Warehouse deployment' },
  ],
  floor: [
    { src: '/images/Floor_fan.png',       caption: 'SpyroStand Elite' },
    { src: '/images/FloorFan_Image.png',  caption: 'Floor fan installation' },
    { src: '/images/Gallery 8.jpg',       caption: 'In-facility use' },
  ],
  pole: [
    { src: '/images/Gallery 3.jpg',   caption: 'Pole fan installation' },
    { src: '/images/Pole_fan.jpg',    caption: 'Outdoor deployment' },
    { src: '/images/Pole_fan_1.png',  caption: 'SpyroPole Flex' },
    { src: '/images/Gallery 5.jpg',   caption: 'Open-sided structure' },
  ],
};

// ─── Product titles ───────────────────────────────────────────────────────────

const TITLES = {
  hvls:  'Roof Mounted HVLS Fans',
  floor: 'Floor Mounted HVLS Fans',
  pole:  'Pole Mounted HVLS Fans',
};

// ─── Modal ────────────────────────────────────────────────────────────────────

function ModalContent({ fanType, onClose }) {
  const images = GALLERY[fanType] ?? GALLERY.hvls;
  const [active, setActive] = useState(0);

  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [prev, next, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    /* Full-screen backdrop — fixed, covers entire viewport */
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
    >
      {/* Modal box — fixed dimensions, never changes size */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 900,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 24,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
            {active + 1} / {images.length}
          </span>
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
            {TITLES[fanType] ?? 'Product Gallery'}
          </span>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-base)', color: 'var(--text-primary)',
              border: 'none', cursor: 'pointer', flexShrink: 0,
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Fixed-size image area — NEVER resizes */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 480,          /* fixed height — no layout shift */
            background: 'var(--bg-base)',
            flexShrink: 0,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={active}
              src={images[active].src}
              alt={images[active].caption}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </AnimatePresence>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                style={{
                  position: 'absolute', left: 12,
                  width: 40, height: 40, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', cursor: 'pointer',
                  transition: 'transform 0.2s', flexShrink: 0,
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                style={{
                  position: 'absolute', right: 12,
                  width: 40, height: 40, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-surface)', border: '1px solid var(--border)',
                  color: 'var(--text-primary)', cursor: 'pointer',
                  transition: 'transform 0.2s', flexShrink: 0,
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div
            style={{
              display: 'flex',
              gap: 8,
              padding: '10px 16px',
              overflowX: 'auto',
              borderTop: '1px solid var(--border)',
              flexShrink: 0,
            }}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                style={{
                  flexShrink: 0,
                  width: 72, height: 52,
                  borderRadius: 10,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  padding: 0,
                  border: i === active ? '2px solid #007BC9' : '2px solid transparent',
                  opacity: i === active ? 1 : 0.45,
                  transition: 'opacity 0.2s, border-color 0.2s',
                }}
              >
                <img
                  src={img.src}
                  alt={img.caption}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function GalleryModal({ fanType, onClose }) {
  return createPortal(
    <AnimatePresence>
      <ModalContent key="gallery-modal" fanType={fanType} onClose={onClose} />
    </AnimatePresence>,
    document.body
  );
}
