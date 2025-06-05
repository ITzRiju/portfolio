'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Portfolio from '@/components/Portfolio';
import Services from '@/components/Services';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <Portfolio />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}