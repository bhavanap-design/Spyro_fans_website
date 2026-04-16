import { lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './index.css';

const Hero         = lazy(() => import('./sections/Hero'));
const Features     = lazy(() => import('./sections/Features'));
const Products     = lazy(() => import('./sections/Products'));
const AirflowVisual = lazy(() => import('./sections/AirflowVisual'));
const WhyUs        = lazy(() => import('./sections/WhyUs'));
const UseCases     = lazy(() => import('./sections/UseCases'));
const Contact      = lazy(() => import('./sections/Contact'));

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <div
        className="w-8 h-8 rounded-full animate-spin"
        style={{ border: '2px solid #007BC9', borderTopColor: '#E52929' }}
      />
    </div>
  );
}

function Site() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', transition: 'background 0.35s ease, color 0.35s ease' }}>
      <Navbar />

      <Suspense fallback={<SectionLoader />}><Hero /></Suspense>
      <Suspense fallback={<SectionLoader />}><Features /></Suspense>
      <Suspense fallback={<SectionLoader />}><Products /></Suspense>
      <Suspense fallback={<SectionLoader />}><AirflowVisual /></Suspense>
      <Suspense fallback={<SectionLoader />}><WhyUs /></Suspense>
      <Suspense fallback={<SectionLoader />}><UseCases /></Suspense>
      <Suspense fallback={<SectionLoader />}><Contact /></Suspense>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Site />
    </ThemeProvider>
  );
}
