import { useState } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, Headphones, FileDown, Video, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const handleDownloadAndOpen = (filePath) => {
  window.open(filePath, '_blank');
  const link = document.createElement('a');
  link.href = filePath;
  link.setAttribute('download', '');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const WHATSAPP_NUMBER = '919876543210';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%27m%20interested%20in%20SpyroFans%20products.`;
const BROCHURE_URL = '/Spyro_fans_Pdfs/Spyro_Fans_Brochure.pdf';

// ─── Schedule Modal ────────────────────────────────────────────────────────────

function ScheduleModal({ onClose }) {
  const [form, setForm] = useState({ name: '', contact: '', date: '', time: '' });
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid var(--border)',
    background: 'var(--bg-base)',
    color: 'var(--text-primary)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    color: 'var(--text-muted)',
    marginBottom: 6,
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 20 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 440,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #E52929, #007BC9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Video size={16} color="#fff" />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}>
                Schedule a Video Call
              </p>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
                Our team will confirm within 24 hrs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 6 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px 24px' }}>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '24px 0' }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
              <p style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', margin: '0 0 6px', fontFamily: 'Poppins, sans-serif' }}>
                Request Received!
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                We'll reach out to confirm your video call.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Your Name</label>
                <input
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={set('name')}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#007BC9')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone or Email</label>
                <input
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={form.contact}
                  onChange={set('contact')}
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = '#007BC9')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Preferred Date</label>
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={set('date')}
                    min={new Date().toISOString().split('T')[0]}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#007BC9')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Preferred Time</label>
                  <input
                    required
                    type="time"
                    value={form.time}
                    onChange={set('time')}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = '#007BC9')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{
                  marginTop: 4,
                  padding: '12px',
                  borderRadius: 12,
                  border: 'none',
                  background: 'linear-gradient(135deg, #E52929, #007BC9)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'opacity 0.2s',
                  fontFamily: 'Poppins, sans-serif',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Confirm Booking
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

// ─── WhatsApp icon ─────────────────────────────────────────────────────────────

function WhatsAppIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

// ─── Single action button ──────────────────────────────────────────────────────

function ActionButton({ action, onSchedule }) {
  const [hovered, setHovered] = useState(false);
  const Icon = action.icon;

  const buttonClass =
    'w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 cursor-pointer';
  const buttonStyle = { background: action.color, color: '#fff' };

  const label = (
    <span
      className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shadow-md pointer-events-none"
      style={{
        background: 'var(--bg-surface)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)',
        opacity: hovered ? 1 : 0,
        transform: hovered ? 'translateX(0)' : 'translateX(8px)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}
    >
      {action.label}
    </span>
  );

  const handleClick = () => {
    if (action.id === 'schedule') { onSchedule(); return; }
    if (action.onAction) { action.onAction(); return; }
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="flex items-center gap-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
      {action.href ? (
        <a
          href={action.href}
          target={action.external ? '_blank' : undefined}
          rel={action.external ? 'noopener noreferrer' : undefined}
          aria-label={action.label}
          className={buttonClass}
          style={buttonStyle}
        >
          <Icon size={18} />
        </a>
      ) : (
        <button
          onClick={handleClick}
          aria-label={action.label}
          className={buttonClass}
          style={buttonStyle}
        >
          <Icon size={18} />
        </button>
      )}
    </div>
  );
}

// ─── Actions list ──────────────────────────────────────────────────────────────

const actions = [
  {
    id: 'brochure',
    label: 'Download Brochure',
    icon: FileDown,
    color: '#007BC9',
    onAction: () => handleDownloadAndOpen(BROCHURE_URL),
  },
  {
    id: 'support',
    label: 'Customer Support',
    icon: Headphones,
    color: '#E52929',
    href: 'tel:+919876543210',
  },
  {
    id: 'schedule',
    label: 'Schedule Video Call',
    icon: Video,
    color: '#007BC9',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: WhatsAppIcon,
    color: '#25D366',
    href: WHATSAPP_URL,
    external: true,
  },
];

// ─── Main export ───────────────────────────────────────────────────────────────

export default function FloatingActions() {
  const [scheduleOpen, setScheduleOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {actions.map((action) => (
          <ActionButton
            key={action.id}
            action={action}
            onSchedule={() => setScheduleOpen(true)}
          />
        ))}
      </div>

      <AnimatePresence>
        {scheduleOpen && <ScheduleModal onClose={() => setScheduleOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
