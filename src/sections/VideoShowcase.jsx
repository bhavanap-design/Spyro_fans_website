import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const VIDEO_ID = 'cUojTYS9_nI';
const THUMBNAIL = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`;
const EMBED_URL  = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0`;
const WATCH_URL  = `https://www.youtube.com/watch?v=${VIDEO_ID}`;

export default function VideoShowcase() {
  const [playing, setPlaying] = useState(false);
  const { ref, isInView } = useScrollAnimation({ once: true, amount: 0.2 });

  return (
    <section className="relative py-28" style={{ background: 'var(--bg-base)' }}>
      {/* Top separator */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #E52929, #007BC9, transparent)' }}
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E52929]" />
            <span
              className="text-xs tracking-widest uppercase font-medium"
              style={{ color: 'var(--text-muted)' }}
            >
              See It In Action
            </span>
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}
          >
            Watch <span className="gradient-text">SpyroFans</span> perform
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            See how our HVLS fans transform airflow in real industrial environments.
          </p>
        </motion.div>

        {/* Video container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: '16/9',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
              background: '#0A0A0F',
            }}
          >
            {playing ? (
              <motion.iframe
                key="iframe"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                src={EMBED_URL}
                title="SpyroFans product video"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                style={{ border: 'none' }}
              />
            ) : (
              <motion.button
                key="thumbnail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => setPlaying(true)}
                className="absolute inset-0 w-full h-full cursor-pointer group"
                aria-label="Play video"
              >
                {/* Thumbnail image */}
                <img
                  src={THUMBNAIL}
                  alt="SpyroFans video thumbnail"
                  className="w-full h-full object-cover"
                  style={{ borderRadius: '20px' }}
                />

                {/* Dark overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-60"
                  style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '20px' }}
                />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #E52929, #007BC9)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}
                  >
                    {/* Play triangle */}
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                      <polygon points="5,3 19,12 5,21" />
                    </svg>
                  </div>
                </div>
              </motion.button>
            )}
          </div>

          {/* CTA */}
          <div className="flex justify-center mt-8">
            <a
              href={WATCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 text-sm font-semibold px-7 py-3 rounded-full transition-all duration-300 hover:opacity-90 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #E52929, #007BC9)',
                color: 'white',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.2 2.8 12 2.8 12 2.8s-4.2 0-6.8.2c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.3v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.3 21.7 12 21.7 12 21.7s4.2 0 6.8-.3c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z"/>
              </svg>
              View More on YouTube
            </a>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
