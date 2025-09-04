import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SignupPage from './pages/SignupPage';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import WhyFieldCall from './components/WhyFieldCall';
import DemoBanner from './components/DemoBanner';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import StickyMobileCTA from './components/StickyMobileCTA';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/" element={
              <>
                <Header />
                <Hero />
                <HowItWorks />
                <WhyFieldCall />
                <DemoBanner />
                <Pricing />
                <Testimonials />
                <FAQ />
                <FinalCTA />
                <Footer />
                <StickyMobileCTA />
              </>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;