import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Disable browser scroll restoration so it never overrides our position reset
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

export default function ScrollToTop() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}
