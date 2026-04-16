export default function Footer() {
  return (
    <footer
      className="relative py-12"
      style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-surface)' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="4" fill="#E52929"/>
              {[0,72,144,216,288].map((angle, i) => (
                <g key={i} transform={`rotate(${angle} 18 18)`}>
                  <ellipse cx="18" cy="8" rx="5" ry="9" fill="url(#footerG)" opacity="0.9"/>
                </g>
              ))}
              <defs>
                <linearGradient id="footerG" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#E52929"/>
                  <stop offset="100%" stopColor="#007BC9"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="font-bold" style={{ color: 'var(--text-primary)' }}>SpyroFans</span>
          </div>

          <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
            © 2024 SpyroFans. All rights reserved. Engineered for excellence.
          </p>

          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Careers'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm transition-colors hover:opacity-80"
                style={{ color: 'var(--text-muted)' }}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
