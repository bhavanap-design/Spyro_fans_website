import { motion } from 'framer-motion';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

function AirflowSVG() {
  return (
    <svg viewBox="0 0 800 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
      <rect x="60" y="390" width="680" height="2" rx="1" fill="rgba(128,128,128,0.15)"/>
      <rect x="60" y="50" width="680" height="2" rx="1" fill="rgba(128,128,128,0.15)"/>
      <rect x="60" y="50" width="2" height="342" rx="1" fill="rgba(128,128,128,0.08)"/>
      <rect x="738" y="50" width="2" height="342" rx="1" fill="rgba(128,128,128,0.08)"/>

      {/* Fan at ceiling */}
      <g transform="translate(400,52)">
        <rect x="-4" y="0" width="8" height="28" rx="4" fill="#777f8c"/>
        <circle cx="0" cy="32" r="12" fill="#a0a8b8"/>
        <circle cx="0" cy="32" r="5" fill="#E52929"/>
        {[0,72,144,216,288].map((a) => (
          <g key={a} transform={`rotate(${a} 0 32)`}>
            <ellipse cx="0" cy="11" rx="7" ry="18" fill="#c0c8d0" opacity="0.7"/>
          </g>
        ))}
      </g>

      {/* Outer loops */}
      <path d="M 400 95 Q 220 100 140 200 Q 80 290 130 370 Q 180 420 280 400 Q 360 385 400 340"
        stroke="#007BC9" strokeWidth="2" strokeDasharray="12 8" strokeLinecap="round" fill="none" opacity="0.7">
        <animate attributeName="stroke-dashoffset" from="0" to="-100" dur="3s" repeatCount="indefinite"/>
      </path>
      <path d="M 400 95 Q 580 100 660 200 Q 720 290 670 370 Q 620 420 520 400 Q 440 385 400 340"
        stroke="#007BC9" strokeWidth="2" strokeDasharray="12 8" strokeLinecap="round" fill="none" opacity="0.7">
        <animate attributeName="stroke-dashoffset" from="0" to="-100" dur="3s" repeatCount="indefinite"/>
      </path>

      {/* Inner loops */}
      <path d="M 400 120 Q 290 130 230 210 Q 180 285 220 350 Q 260 390 330 370 Q 380 355 400 310"
        stroke="#007BC9" strokeWidth="1.5" strokeDasharray="8 6" strokeLinecap="round" fill="none" opacity="0.5">
        <animate attributeName="stroke-dashoffset" from="0" to="-70" dur="2.4s" repeatCount="indefinite"/>
      </path>
      <path d="M 400 120 Q 510 130 570 210 Q 620 285 580 350 Q 540 390 470 370 Q 420 355 400 310"
        stroke="#007BC9" strokeWidth="1.5" strokeDasharray="8 6" strokeLinecap="round" fill="none" opacity="0.5">
        <animate attributeName="stroke-dashoffset" from="0" to="-70" dur="2.4s" repeatCount="indefinite"/>
      </path>

      {/* Center column */}
      <path d="M 400 95 L 400 340" stroke="url(#colGrad)" strokeWidth="2" strokeDasharray="6 5" strokeLinecap="round" opacity="0.6">
        <animate attributeName="stroke-dashoffset" from="0" to="22" dur="1.2s" repeatCount="indefinite"/>
      </path>

      {/* Floor spread */}
      <path d="M 400 370 Q 310 375 230 368" stroke="#007BC9" strokeWidth="1.5" strokeDasharray="6 5" strokeLinecap="round" opacity="0.5">
        <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="1.8s" repeatCount="indefinite"/>
      </path>
      <polygon points="225,363 220,368 225,373" fill="#007BC9" opacity="0.6"/>
      <path d="M 400 370 Q 490 375 570 368" stroke="#007BC9" strokeWidth="1.5" strokeDasharray="6 5" strokeLinecap="round" opacity="0.5">
        <animate attributeName="stroke-dashoffset" from="0" to="-40" dur="1.8s" repeatCount="indefinite"/>
      </path>
      <polygon points="575,363 580,368 575,373" fill="#007BC9" opacity="0.6"/>

      <ellipse cx="250" cy="385" rx="80" ry="8" fill="#007BC9" opacity="0.06"/>
      <ellipse cx="550" cy="385" rx="80" ry="8" fill="#007BC9" opacity="0.06"/>

      <text x="102" y="225" fill="rgba(128,128,128,0.5)" fontSize="11" fontFamily="Inter,sans-serif">Circulation</text>
      <text x="102" y="240" fill="rgba(128,128,128,0.5)" fontSize="11" fontFamily="Inter,sans-serif">Zone</text>
      <text x="628" y="225" fill="rgba(128,128,128,0.5)" fontSize="11" fontFamily="Inter,sans-serif">Circulation</text>
      <text x="628" y="240" fill="rgba(128,128,128,0.5)" fontSize="11" fontFamily="Inter,sans-serif">Zone</text>
      <text x="370" y="45" fill="rgba(128,128,128,0.6)" fontSize="11" fontFamily="Inter,sans-serif">Fan</text>

      <defs>
        <linearGradient id="colGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#007BC9"/>
          <stop offset="100%" stopColor="#E52929" stopOpacity="0.3"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function AirflowVisual() {
  const { ref, isInView } = useScrollAnimation();

  return (
    <section
      id="airflow"
      className="relative py-28"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Subtle separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(229,41,41,0.3), rgba(0,123,201,0.3), transparent)' }}/>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
              <span className="text-xs tracking-widest uppercase font-medium" style={{ color: 'var(--text-muted)' }}>
                Airflow Science
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{ color: 'var(--text-primary)' }}>
              See the air <span className="gradient-text">move</span>
            </h2>
            <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
              HVLS fans create a column of air that flows downward and outward — a phenomenon called the floor jet. This continuous circulation eliminates hot and cold spots, reducing reliance on HVAC systems.
            </p>

            <div className="space-y-5">
              {[
                { label: 'Destratification', desc: 'Mixes warm ceiling air with cooler floor air, reducing heating costs by up to 30%.' },
                { label: 'Evaporative Cooling', desc: 'Gentle air movement increases perspiration evaporation for a 4–8°C perceived cooling effect.' },
                { label: 'Uniform Temperature', desc: 'Less than 1°C variance from floor to ceiling across the entire coverage zone.' },
              ].map((item) => (
                <div key={item.label} className="flex gap-4">
                  <div className="w-1 rounded-full flex-shrink-0 mt-1" style={{ background: 'linear-gradient(to bottom, #E52929, #007BC9)' }}/>
                  <div>
                    <div className="font-semibold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>{item.label}</div>
                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-3xl p-6 overflow-hidden"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
          >
            <p className="text-xs uppercase tracking-widest mb-4 text-center" style={{ color: 'var(--text-muted)' }}>
              Airflow Distribution Diagram
            </p>
            <AirflowSVG />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
