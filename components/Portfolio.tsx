'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  type: 'image' | 'video';
  thumbnail: string;
  fullImage?: string;
  videoUrl?: string;
  description: string;
}

const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = ['all', 'wedding', 'portrait', 'event', 'commercial', 'nature'];

  useEffect(() => {
    // Fetch portfolio data from API
    const fetchPortfolioData = async () => {
      try {
        const response = await fetch('/api/portfolio');
        if (response.ok) {
          const data = await response.json();
          setPortfolioData(data);
        } else {
          // Fallback data for demo
          setPortfolioData([
            {
              id: 1,
              title: 'Romantic Wedding Ceremony',
              category: 'wedding',
              type: 'image',
              thumbnail: '/images/portfolio/wedding-1-thumb.svg',
      fullImage: '/images/portfolio/wedding-1.jpg',
              description: 'Beautiful outdoor wedding ceremony captured in golden hour light.'
            },
            {
              id: 2,
              title: 'Corporate Headshots',
              category: 'portrait',
              type: 'image',
              thumbnail: '/images/portfolio/portrait-1-thumb.svg',
      fullImage: '/images/portfolio/portrait-1.jpg',
              description: 'Professional corporate headshots with modern lighting.'
            },
            {
              id: 3,
              title: 'Wedding Highlights Video',
              category: 'wedding',
              type: 'video',
              thumbnail: '/images/portfolio/wedding-video-thumb.svg',
              videoUrl: '/videos/wedding-highlights.mp4',
              description: 'Cinematic wedding highlights showcasing the couples special day.'
            },
            {
              id: 4,
              title: 'Product Photography',
              category: 'commercial',
              type: 'image',
              thumbnail: '/images/portfolio/product-1-thumb.svg',
      fullImage: '/images/portfolio/product-1.jpg',
              description: 'High-end product photography for luxury brand.'
            },
            {
              id: 5,
              title: 'Nature Landscape',
              category: 'nature',
              type: 'image',
              thumbnail: '/images/portfolio/nature-1-thumb.svg',
      fullImage: '/images/portfolio/nature-1.jpg',
              description: 'Breathtaking landscape photography during sunrise.'
            },
            {
              id: 6,
              title: 'Corporate Event',
              category: 'event',
              type: 'video',
              thumbnail: '/images/portfolio/event-video-thumb.svg',
              videoUrl: '/videos/corporate-event.mp4',
              description: 'Dynamic coverage of corporate conference and networking event.'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      }
    };

    fetchPortfolioData();
  }, []);

  const filteredItems = selectedCategory === 'all' 
    ? portfolioData 
    : portfolioData.filter(item => item.category === selectedCategory);

  const openLightbox = (item: PortfolioItem) => {
    setSelectedItem(item);
    const index = filteredItems.findIndex(i => i.id === item.id);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedItem(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % filteredItems.length
      : (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    
    setCurrentIndex(newIndex);
    setSelectedItem(filteredItems[newIndex] || null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="portfolio" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            My Portfolio
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore my collection of photography and videography work, showcasing moments that matter most.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                layout
                className="group cursor-pointer"
                onClick={() => openLightbox(item)}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="aspect-w-4 aspect-h-3 relative">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        className="text-white"
                      >
                        {item.type === 'video' ? (
                          <PlayIcon className="h-16 w-16" />
                        ) : (
                          <div className="text-center">
                            <div className="text-2xl font-bold mb-2">View</div>
                            <div className="text-sm">Click to enlarge</div>
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 bg-white">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {item.description}
                    </p>
                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-600 text-sm font-medium rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
                >
                  <XMarkIcon className="h-8 w-8" />
                </button>

                {/* Navigation Buttons */}
                {filteredItems.length > 1 && (
                  <>
                    <button
                      onClick={() => navigateLightbox('prev')}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
                    >
                      <ChevronLeftIcon className="h-8 w-8" />
                    </button>
                    <button
                      onClick={() => navigateLightbox('next')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors"
                    >
                      <ChevronRightIcon className="h-8 w-8" />
                    </button>
                  </>
                )}

                {/* Content */}
                <div className="bg-white rounded-lg overflow-hidden">
                  {selectedItem.type === 'image' ? (
                    <Image
                      src={selectedItem.fullImage || selectedItem.thumbnail}
                      alt={selectedItem.title}
                      width={800}
                      height={600}
                      className="w-full h-auto max-h-[70vh] object-contain"
                    />
                  ) : (
                    <video
                      src={selectedItem.videoUrl}
                      controls
                      className="w-full h-auto max-h-[70vh]"
                      autoPlay
                    />
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedItem.title}
                    </h3>
                    <p className="text-gray-600">
                      {selectedItem.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Portfolio;