import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const links = ['Products', 'Features', 'Airflow', 'Use Cases', 'Contact'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id.toLowerCase().replace(' ', '-'));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? isDark
            ? 'rgba(10,10,15,0.85)'
            : 'rgba(255,255,255,0.88)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid var(--border)` : '1px solid transparent',
        boxShadow: scrolled ? 'var(--shadow)' : 'none',
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <svg width="34" height="34" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="4" fill="#E52929"/>
            {[0,72,144,216,288].map((angle, i) => (
              <g key={i} transform={`rotate(${angle} 18 18)`}>
                <ellipse cx="18" cy="8" rx="5" ry="9" fill="url(#navGrad)" opacity="0.9"/>
              </g>
            ))}
            <defs>
              <linearGradient id="navGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E52929"/>
                <stop offset="100%" stopColor="#007BC9"/>
              </linearGradient>
            </defs>
          </svg>
          <span className="font-bold text-xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Spyro<span className="gradient-text">Fans</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <li key={link}>
              <button
                onClick={() => scrollTo(link)}
                className="text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer hover:opacity-100"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
              >
                {link}
              </button>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => scrollTo('Contact')}
            className="text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:opacity-90 hover:scale-105 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #E52929, #007BC9)',
              boxShadow: '0 4px 18px rgba(229,41,41,0.25)',
            }}
          >
            Get Quote
          </button>
        </div>

        {/* Mobile right */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2 rounded-lg transition-colors cursor-pointer"
            style={{ color: 'var(--text-primary)' }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: isDark ? 'rgba(10,10,15,0.95)' : 'rgba(255,255,255,0.95)',
              borderTop: `1px solid var(--border)`,
            }}
          >
            <ul className="flex flex-col px-6 py-4 gap-4">
              {links.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => scrollTo(link)}
                    className="text-sm font-medium w-full text-left py-2 cursor-pointer"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {link}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => scrollTo('Contact')}
                  className="text-white text-sm font-semibold px-6 py-2.5 rounded-full w-full cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #E52929, #007BC9)' }}
                >
                  Get Quote
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
