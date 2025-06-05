'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDownIcon, PlayIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroData, setHeroData] = useState({
    title: 'Capturing Life\'s Beautiful Moments',
    subtitle: 'Professional Photography & Videography Services',
    description: 'Transform your special moments into timeless memories with our expert photography and videography services.',
    backgroundImages: [
      '/images/hero-1.jpg',
      '/images/hero-2.jpg',
      '/images/hero-3.jpg'
    ],
    videoUrl: '/videos/hero-video.mp4'
  });

  useEffect(() => {
    // Fetch hero data from API
    const fetchHeroData = async () => {
      try {
        const response = await fetch('/api/content/hero');
        if (response.ok) {
          const data = await response.json();
          setHeroData(data);
        }
      } catch (error) {
        console.error('Error fetching hero data:', error);
      }
    };

    fetchHeroData();

    // Auto-slide functionality
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroData.backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroData.backgroundImages.length]);

  const scrollToNext = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroData.backgroundImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${image})`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
        >
          {heroData.title}
        </motion.h1>
        
        <motion.h2
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl sm:text-2xl lg:text-3xl font-light mb-8 text-gray-200"
        >
          {heroData.subtitle}
        </motion.h2>
        
        <motion.p
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl mb-12 text-gray-300 max-w-2xl mx-auto"
        >
          {heroData.description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/booking">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Book Your Session
            </motion.button>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToNext()}
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center gap-2"
          >
            <PlayIcon className="h-5 w-5" />
            View Portfolio
          </motion.button>
        </motion.div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroData.backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Scroll Down Indicator */}
      <motion.button
        initial={{ y: 0 }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white hover:text-primary-300 transition-colors duration-300"
      >
        <ChevronDownIcon className="h-8 w-8" />
      </motion.button>
    </section>
  );
};

export default Hero;