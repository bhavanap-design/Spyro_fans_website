import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

// ─── Custom video player ─────────────────────────────────────────────────────

function VideoPlayer() {
  const videoRef  = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted,   setMuted]   = useState(true);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); setPlaying(false); }
    else         { videoRef.current.play();  setPlaying(true);  }
  };

  const onTimeUpdate = () => {
    if (!videoRef.current) return;
    const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(isNaN(pct) ? 0 : pct);
  };

  const onEnded = () => setPlaying(false);

  const seek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * videoRef.current.duration;
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden group"
      style={{
        background: '#0A0A0F',
        border: '1px solid #007BC9',
        boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
        aspectRatio: '16/9',
      }}
    >
      <video
        ref={videoRef}
        src="/images/About_us_videoMain.mp4"
        className="w-full h-full object-cover"
        muted={muted}
        playsInline
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />

      {/* Controls overlay — always visible on mobile, hover on desktop */}
      <div
        className="absolute inset-0 flex flex-col justify-end transition-opacity duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }}
      >
        {/* Big centre play button when paused */}
        {!playing && (
          <button
            onClick={toggle}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
          >
            <div
              className="w-18 h-18 rounded-full flex items-center justify-center transition-transform hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '2px solid rgba(255,255,255,0.3)', width: 72, height: 72 }}
            >
              <Play size={28} fill="white" color="white" style={{ marginLeft: 4 }} />
            </div>
          </button>
        )}

        {/* Bottom bar */}
        <div className="px-5 pb-4 flex flex-col gap-2">
          {/* Progress bar */}
          <div
            className="w-full h-1 rounded-full cursor-pointer overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.2)' }}
            onClick={seek}
          >
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #E52929, #007BC9)' }}
            />
          </div>

          {/* Buttons row */}
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="text-white cursor-pointer hover:opacity-80 transition-opacity">
              {playing ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <button
              onClick={() => { setMuted(!muted); if (videoRef.current) videoRef.current.muted = !muted; }}
              className="text-white cursor-pointer hover:opacity-80 transition-opacity"
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── About section ───────────────────────────────────────────────────────────

const stats = [
  { value: '2020', label: 'Founded' },
  { value: '40+',  label: 'Engineers' },
  { value: '1,000+', label: 'Installations' },
];

export default function AboutUs() {
  const { ref, isInView } = useScrollAnimation({ once: true, amount: 0.15 });

  return (
    <section
      id="about"
      className="relative py-28"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Accent glow */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl opacity-[0.07] pointer-events-none"
        style={{ background: '#E52929' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT: text */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E52929]" />
              <span className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
                About SpyroFans
              </span>
            </div>

            <h2
              className="text-4xl lg:text-5xl font-bold leading-tight mb-6"
              style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}
            >
              Years of Engineering{' '}
              <span className="gradient-text">Airflow Excellence</span>
            </h2>

            <p className="text-base leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>
              Our HVLS fan solutions for industrial environments are designed to improve airflow, regulate temperature, and enhance comfort across large manufacturing and production spaces. By circulating massive volumes of air efficiently, they help reduce heat stress, improve working conditions, and lower overall energy consumption.
            </p>

            <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
              Our team of 40 engineers consists of experts in  electromechanics, mechanical, electronics, and thermal engineering. Before deploying our fans we do FEA simulation to make sure our product meets the promises.
            </p>

            {/* Stats */}
            <div className="flex gap-6 mb-10">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex-1 rounded-2xl p-5 text-center"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
                >
                  <div className="text-2xl font-bold gradient-text">{s.value}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* <button
              className="font-semibold px-7 py-3.5 rounded-full text-sm text-white transition-all duration-300 hover:opacity-90 hover:scale-105 cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #E52929, #007BC9)' }}
            >
              Our Story →
            </button> */}
          </motion.div>

          {/* RIGHT: video */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <VideoPlayer />

            {/* Caption */}
            <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
              See Spyro Fans in action with real installations and proven results.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
