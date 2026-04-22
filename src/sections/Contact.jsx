import { useState } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Phone, Mail, MapPin, ArrowRight, CheckCircle } from 'lucide-react';

const contactDetails = [
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919949465932' },
  { icon: Mail,  label: 'Email', value: 'info@spyrofan.com', href: 'mailto:info@spyrofan.com' },
  { icon: MapPin, label: 'Address', value: '#6-2-982, 3rd Floor, GNR Arcade, Khairatabad, Hyderabad – 500 004', href: '#' },
];

export default function Contact() {
  const { ref, isInView } = useScrollAnimation();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', type: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-base)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '12px 16px',
    color: 'var(--text-primary)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <section
      id="contact"
      className="relative py-28"
      style={{ background: 'var(--bg-base)' }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px" style={{ background: 'linear-gradient(90deg, transparent, #E52929, #007BC9, transparent)' }}/>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <span className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
              Contact Us
            </span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Let's build something{' '}
            <span className="gradient-text">extraordinary</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Tell us about your space and we’ll recommend the right airflow solution.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="space-y-4 mb-10">
              {contactDetails.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-4 rounded-2xl p-5 transition-all duration-300 group hover:scale-[1.01]"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}
                  >
                    <Icon size={18} style={{ color: 'var(--text-secondary)' }} />
                  </div>
                  <div>
                    <div className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</div>
                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{value}</div>
                  </div>
                  <ArrowRight size={16} className="ml-auto opacity-30 group-hover:opacity-60 transition-opacity" style={{ color: 'var(--text-secondary)' }} />
                </a>
              ))}
            </div>

            <div className="rounded-2xl p-6" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <p className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>What to expect:</p>
              <ul className="space-y-3">
                {[
                  'Response within 2 business hours',
                  'Free site assessment & airflow analysis',
                  'Custom proposal within 3 days',
                  'No pressure, transparent pricing',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <CheckCircle size={14} style={{ color: '#007BC9', flexShrink: 0 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {submitted ? (
              <div
                className="rounded-3xl p-10 flex flex-col items-center justify-center text-center"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', minHeight: 400 }}
              >
                <CheckCircle size={48} style={{ color: '#007BC9' }} className="mb-4" />
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Message Received!</h3>
                <p style={{ color: 'var(--text-secondary)' }}>Our team will get back to you within 2 business hours.</p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-3xl p-8 space-y-5"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Full Name *</label>
                    <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="John Smith" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#007BC9'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  </div>
                  <div>
                    <label className="block text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Phone Number</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#007BC9'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Email Address *</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="john@company.com" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#007BC9'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                </div>

                <div>
                  <label className="block text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Fan Type Interested In</label>
                  <select name="type" value={form.type} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer', paddingRight: 40, appearance: 'none', WebkitAppearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238888A0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                    <option value="">Select fan type…</option>
                    <option value="roof">Roof Mounted HVLS Fan</option>
                    <option value="floor">Floor Mounted HVLS Fan</option>
                    <option value="pole">Pole Mounted HVLS Fan</option>
                    {/* <option value="unsure">Not sure yet</option> */}
                  </select>
                </div>

                <div>
                  <label className="block text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Project Details *</label>
                  <textarea name="message" required value={form.message} onChange={handleChange} rows={4}
                    placeholder="Tell us about your space — dimensions, usage, number of fans needed…"
                    style={{ ...inputStyle, resize: 'none' }}
                    onFocus={e => e.target.style.borderColor = '#007BC9'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                </div>

                <button
                  type="submit"
                  className="w-full text-white font-semibold py-4 rounded-xl text-sm tracking-wide transition-all duration-300 hover:opacity-90 hover:scale-[1.01] cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, #E52929, #007BC9)' }}
                >
                  Send Enquiry →
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
