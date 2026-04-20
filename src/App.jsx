import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import './index.css';

const Hero               = lazy(() => import('./sections/Hero'));
const Features           = lazy(() => import('./sections/Features'));
const Products           = lazy(() => import('./sections/Products'));
const WhyUs              = lazy(() => import('./sections/WhyUs'));
const AboutUs            = lazy(() => import('./sections/AboutUs'));
const Gallery            = lazy(() => import('./sections/Gallery'));
const VideoShowcase      = lazy(() => import('./sections/VideoShowcase'));
const UseCases           = lazy(() => import('./sections/UseCases'));
const Contact            = lazy(() => import('./sections/Contact'));
const RoofMountedProduct   = lazy(() => import('./sections/RoofMountedProduct'));
const FloorMountedProduct  = lazy(() => import('./sections/FloorMountedProduct'));
const PoleMountedProduct   = lazy(() => import('./sections/PoleMountedProduct'));

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 rounded-full animate-spin"
        style={{ border: '2px solid #007BC9', borderTopColor: '#E52929' }} />
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
      <Suspense fallback={<SectionLoader />}><WhyUs /></Suspense>
      <Suspense fallback={<SectionLoader />}><AboutUs /></Suspense>
      <Suspense fallback={<SectionLoader />}><Gallery /></Suspense>
      <Suspense fallback={<SectionLoader />}><VideoShowcase /></Suspense>
      <Suspense fallback={<SectionLoader />}><UseCases /></Suspense>
      <Suspense fallback={<SectionLoader />}><Contact /></Suspense>

      <Footer />
      <FloatingActions />
    </div>
  );
}

function ProductPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', transition: 'background 0.35s ease, color 0.35s ease' }}>
      <Navbar />
      <Suspense fallback={<SectionLoader />}><RoofMountedProduct /></Suspense>
      <Footer />
      <FloatingActions />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Site />} />
        <Route path="/products/roof-mounted-hvls-fan" element={<ProductPage />} />
        <Route path="/products/pole-mounted-hvls-fan" element={
          <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', transition: 'background 0.35s ease, color 0.35s ease' }}>
            <Navbar />
            <Suspense fallback={<SectionLoader />}><PoleMountedProduct /></Suspense>
            <Footer />
            <FloatingActions />
          </div>
        } />
        <Route path="/products/floor-mounted-hvls-fan" element={
          <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', transition: 'background 0.35s ease, color 0.35s ease' }}>
            <Navbar />
            <Suspense fallback={<SectionLoader />}><FloorMountedProduct /></Suspense>
            <Footer />
            <FloatingActions />
          </div>
        } />
      </Routes>
    </ThemeProvider>
  );
}
