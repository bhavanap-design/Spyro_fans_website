import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const MIN_MS = 1300;

export default function Loader({ onDone }) {
  const [visible, setVisible] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
    }, MIN_MS);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence onExitComplete={onDone}>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isDark ? '#0D0D14' : '#F4F5F7',
          }}
        >
          {/* Radial glow behind logo */}
          <div
            style={{
              position: 'absolute',
              width: 260,
              height: 260,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(229,41,41,0.12) 0%, rgba(0,123,201,0.10) 50%, transparent 75%)',
              filter: 'blur(28px)',
              pointerEvents: 'none',
            }}
          />

          {/* Logo + wordmark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, position: 'relative' }}
          >
            {/* Spinning icon */}
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              viewBox="0 0 46 50"
              style={{ width: 72, height: 72 }}
            >
              <path
                d="M17.5176 22.0271C17.5967 21.8435 17.6108 21.8217 17.7552 21.6837C18.0858 21.5545 18.6005 21.6214 18.9689 21.6435C19.2373 21.8273 19.5513 22.0877 19.8646 22.1006C20.4568 22.2638 21.6772 22.2929 22.3224 22.3083C23.2995 23.2433 24.2631 23.0861 25.4826 23.7009C27.7968 24.8677 30.3494 26.5387 32.0159 28.5455C32.4705 29.0929 33.2149 30.7519 33.3673 31.4077C33.6072 32.4396 34.0846 32.215 34.0865 33.2121C34.0877 33.8047 34.0889 34.3671 34.0833 34.946C33.4539 35.7822 33.6549 36.1456 33.2784 36.9281C32.6588 38.2157 31.4331 40.0512 30.3899 41.0267C30.208 41.1969 29.0831 41.811 28.7407 42.0736C27.8396 42.7048 26.4911 43.7232 25.4478 44.0099C24.7116 44.2123 24.0689 44.3976 23.3548 44.6217C22.4269 44.9129 21.8961 44.7282 21.0531 45.3918C18.9898 45.4998 15.3172 45.6571 13.3123 45.4298C10.5607 45.1177 7.02365 44.0167 4.65083 42.6734C3.79899 42.1595 3.01586 41.1956 2.21018 40.6098C2.10984 39.5766 2.05154 39.1395 2.23121 38.1143C2.69978 37.7046 2.90228 37.4186 3.45072 37.0901C7.61235 34.5971 17.4386 33.2974 17.9058 27.3398C18.0235 25.839 16.6999 24.5154 16.6458 23.439L16.7012 22.276C17.1159 22.2997 17.2821 22.3773 17.5176 22.0271Z"
                fill="#007BC9"
              />
              <path
                d="M12.5399 0H21.8085L21.6499 0.29793L21.7518 0.414708C22.3994 0.448991 23.5699 0.44221 24.1904 0.607606C26.373 1.1894 29.4504 2.43027 30.9765 4.15607C31.8646 5.16031 31.9978 5.67405 31.9588 6.86168C31.6395 7.18461 31.0779 7.92819 30.7612 8.13817C29.2753 9.12354 27.387 9.51717 25.908 10.1553C22.6887 11.5443 16.1368 13.7477 16.0037 17.973C15.9767 18.8302 16.6431 20.4941 17.0969 21.2511C17.1431 21.3281 17.3695 21.3511 17.5001 21.4802L17.5175 22.0267C17.282 22.377 17.1158 22.2994 16.701 22.2757L16.6457 23.4387C16.4345 23.3604 16.1873 23.3955 15.9591 23.4092C15.6454 23.341 15.1013 23.1268 14.8224 23.1138C9.58083 22.869 4.39768 19.8627 1.25718 15.7115C0.755248 15.0481 0.888902 14.1473 0 13.4791V9.21317C0.614373 8.90074 0.619386 8.29889 0.946885 7.70142C1.5205 6.65494 2.49202 5.15594 3.43395 4.41436C4.89782 3.26183 6.60412 2.22025 8.26828 1.39826C9.10077 1.01691 9.30497 1.43087 10.3762 0.599312C11.1724 0.551922 11.8291 0.507036 12.6171 0.39655C12.5511 0.242151 12.5435 0.210755 12.5404 0.0408182L12.5399 0Z"
                fill="#E52929"
              />
            </motion.svg>

            {/* Wordmark */}
            <img
              src={isDark ? '/images/Spyro_text_logo_dark.svg' : '/images/Spyro_text_logo_light.svg'}
              alt="SpyroFans"
              style={{ height: 22, width: 'auto' }}
            />

            {/* Animated progress bar */}
            <div
              style={{
                width: 64,
                height: 2,
                borderRadius: 1,
                overflow: 'hidden',
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              }}
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '0%' }}
                transition={{ duration: MIN_MS / 1000, ease: 'easeInOut' }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #E52929, #007BC9)',
                  borderRadius: 1,
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
