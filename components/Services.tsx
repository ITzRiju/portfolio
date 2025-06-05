'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, CameraIcon, VideoCameraIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
  icon: string;
  category: 'photography' | 'videography' | 'combo';
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'photography' | 'videography' | 'combo'>('all');

  useEffect(() => {
    // Fetch services data from API
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          // Fallback data for demo
          setServices([
            {
              id: 1,
              name: 'Wedding Photography',
              description: 'Complete wedding day coverage with professional editing and online gallery.',
              price: 75000,
              duration: '8-10 hours',
              features: [
                'Pre-wedding consultation',
                '8-10 hours coverage',
                '500+ edited photos',
                'Online gallery',
                'USB with high-res images',
                'Print release included'
              ],
              popular: true,
              icon: 'camera',
              category: 'photography'
            },
            {
              id: 2,
              name: 'Portrait Session',
              description: 'Professional portrait photography for individuals, families, or corporate headshots.',
              price: 15000,
              duration: '1-2 hours',
              features: [
                '1-2 hours session',
                'Multiple outfit changes',
                '25+ edited photos',
                'Online gallery',
                'Print release',
                'Makeup consultation'
              ],
              icon: 'camera',
              category: 'photography'
            },
            {
              id: 3,
              name: 'Wedding Videography',
              description: 'Cinematic wedding film capturing your special day in stunning detail.',
              price: 85000,
              duration: '8-10 hours',
              features: [
                'Full day coverage',
                'Cinematic highlight reel (3-5 min)',
                'Ceremony footage',
                'Reception coverage',
                '4K video quality',
                'Professional audio'
              ],
              icon: 'video',
              category: 'videography'
            },
            {
              id: 4,
              name: 'Event Photography',
              description: 'Professional coverage for corporate events, parties, and special occasions.',
              price: 25000,
              duration: '4-6 hours',
              features: [
                '4-6 hours coverage',
                '200+ edited photos',
                'Same day preview',
                'Online gallery',
                'Social media ready images',
                'Event timeline planning'
              ],
              icon: 'camera',
              category: 'photography'
            },
            {
              id: 5,
              name: 'Commercial Video',
              description: 'Professional video production for businesses, products, and promotional content.',
              price: 45000,
              duration: '2-4 hours',
              features: [
                'Concept development',
                'Professional lighting',
                'Multiple camera angles',
                'Professional editing',
                'Color grading',
                'Music licensing'
              ],
              icon: 'video',
              category: 'videography'
            },
            {
              id: 6,
              name: 'Wedding Complete Package',
              description: 'Ultimate wedding package combining photography and videography services.',
              price: 125000,
              duration: 'Full day',
              features: [
                'Photography + Videography',
                'Pre-wedding shoot',
                '500+ edited photos',
                'Cinematic wedding film',
                'Drone footage (if permitted)',
                'Same day highlights',
                'Premium album',
                'USB + Online gallery'
              ],
              popular: true,
              icon: 'heart',
              category: 'combo'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'camera':
        return <CameraIcon className="h-8 w-8" />;
      case 'video':
        return <VideoCameraIcon className="h-8 w-8" />;
      case 'heart':
        return <HeartIcon className="h-8 w-8" />;
      default:
        return <CameraIcon className="h-8 w-8" />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
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
    <section id="services" className="py-20 bg-white">
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
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our comprehensive range of photography and videography services, 
            tailored to capture your most precious moments.
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
          {['all', 'photography', 'videography', 'combo'].map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category as any)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-primary-50 hover:text-primary-600'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredServices.map((service) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden ${
                service.popular ? 'ring-2 ring-primary-500' : ''
              }`}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute top-4 right-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <StarIcon className="h-4 w-4" />
                  Popular
                </div>
              )}

              <div className="p-8">
                {/* Icon */}
                <div className="flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6 text-primary-600">
                  {getIcon(service.icon)}
                </div>

                {/* Service Info */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {service.name}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-bold text-primary-600">
                    {formatPrice(service.price)}
                  </span>
                  <span className="text-gray-500 ml-2">/ {service.duration}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Link href={`/booking?service=${service.id}`}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                      service.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-primary-50 hover:text-primary-600'
                    }`}
                  >
                    Book This Service
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Custom Service CTA */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need Something Custom?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Every event is unique. Let's discuss your specific requirements and create a 
              custom package that perfectly fits your needs and budget.
            </p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-700 transition-colors duration-300"
              >
                Get Custom Quote
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;