import { lazy, Suspense, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import ScrollToTop from './components/ScrollToTop';
import Loader from './components/Loader';
import './index.css';

const Hero               = lazy(() => import('./sections/Hero'));
const Features           = lazy(() => import('./sections/Features'));
const FanComparison      = lazy(() => import('./sections/FanComparison'));
const Products           = lazy(() => import('./sections/Products'));
const WhyUs              = lazy(() => import('./sections/WhyUs'));
const AboutUs            = lazy(() => import('./sections/AboutUs'));
const Gallery            = lazy(() => import('./sections/Gallery'));
const VideoShowcase      = lazy(() => import('./sections/VideoShowcase'));
const UseCases           = lazy(() => import('./sections/UseCases'));
const Contact            = lazy(() => import('./sections/Contact'));
const TrustedBy            = lazy(() => import('./sections/TrustedBy'));
const RoofMountedProduct   = lazy(() => import('./sections/RoofMountedProduct'));
const FloorMountedProduct  = lazy(() => import('./sections/FloorMountedProduct'));
const PoleMountedProduct   = lazy(() => import('./sections/PoleMountedProduct'));

function Site() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', transition: 'background 0.35s ease, color 0.35s ease' }}>
      <Navbar />
      <Suspense fallback={null}><Hero /></Suspense>
      <Suspense fallback={null}><TrustedBy /></Suspense>
      <Suspense fallback={null}><Features /></Suspense>
      <Suspense fallback={null}><Products /></Suspense>
      <Suspense fallback={null}><WhyUs /></Suspense>
      <Suspense fallback={null}><AboutUs /></Suspense>
      <Suspense fallback={null}><FanComparison /></Suspense>
      <Suspense fallback={null}><Gallery /></Suspense>
      <Suspense fallback={null}><VideoShowcase /></Suspense>
      <Suspense fallback={null}><UseCases /></Suspense>
      <Suspense fallback={null}><Contact /></Suspense>
      <Footer />
      <FloatingActions />
    </div>
  );
}

function ProductPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', transition: 'background 0.35s ease, color 0.35s ease' }}>
      <Navbar />
      <Suspense fallback={null}><RoofMountedProduct /></Suspense>
      <Footer />
      <FloatingActions />
    </div>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <ThemeProvider>
      <Loader onDone={() => setLoaded(true)} />
      {loaded && <ScrollToTop />}
      {loaded && <Routes>
        <Route path="/" element={<Site />} />
        <Route path="/products/roof-mounted-hvls-fan" element={<ProductPage />} />
        <Route path="/products/pole-mounted-hvls-fan" element={
          <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', transition: 'background 0.35s ease, color 0.35s ease' }}>
            <Navbar />
            <Suspense fallback={null}><PoleMountedProduct /></Suspense>
            <Footer />
            <FloatingActions />
          </div>
        } />
        <Route path="/products/floor-mounted-hvls-fan" element={
          <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', transition: 'background 0.35s ease, color 0.35s ease' }}>
            <Navbar />
            <Suspense fallback={null}><FloorMountedProduct /></Suspense>
            <Footer />
            <FloatingActions />
          </div>
        } />
      </Routes>}
    </ThemeProvider>
  );
}
