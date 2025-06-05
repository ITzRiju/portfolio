'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, CameraIcon, VideoCameraIcon, HeartIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const About = () => {
  const [aboutData, setAboutData] = useState({
    title: 'About Me',
    subtitle: 'Passionate Visual Storyteller',
    description: 'With over 8 years of experience in photography and videography, I specialize in capturing authentic moments that tell your unique story. My approach combines technical expertise with artistic vision to create timeless memories.',
    image: '/images/photographer.svg',
    experience: '8+',
    projects: '500+',
    clients: '200+',
    skills: [
      { name: 'Wedding Photography', percentage: 95 },
      { name: 'Portrait Photography', percentage: 90 },
      { name: 'Event Videography', percentage: 88 },
      { name: 'Commercial Photography', percentage: 85 },
      { name: 'Photo Editing', percentage: 92 },
      { name: 'Video Editing', percentage: 87 }
    ],
    achievements: [
      'Award-winning photographer',
      'Featured in top photography magazines',
      'Certified drone pilot',
      'International wedding photographer'
    ]
  });

  useEffect(() => {
    // Fetch about data from API
    const fetchAboutData = async () => {
      try {
        const response = await fetch('/api/content/about');
        if (response.ok) {
          const data = await response.json();
          setAboutData(data);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      }
    };

    fetchAboutData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column - Image and Stats */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-2xl shadow-2xl"
              >
                <Image
                  src={aboutData.image}
                  alt="Photographer"
                  width={600}
                  height={700}
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </motion.div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-gray-50 rounded-xl"
              >
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {aboutData.experience}
                </div>
                <div className="text-gray-600 font-medium">Years Experience</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-gray-50 rounded-xl"
              >
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {aboutData.projects}
                </div>
                <div className="text-gray-600 font-medium">Projects Done</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-center p-6 bg-gray-50 rounded-xl"
              >
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {aboutData.clients}
                </div>
                <div className="text-gray-600 font-medium">Happy Clients</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {aboutData.title}
              </h2>
              <h3 className="text-xl text-primary-600 font-semibold mb-6">
                {aboutData.subtitle}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {aboutData.description}
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">Skills & Expertise</h4>
              {aboutData.skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{skill.name}</span>
                    <span className="text-primary-600 font-semibold">{skill.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Achievements */}
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-gray-900 mb-6">Achievements</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aboutData.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{achievement}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Service Icons */}
            <div className="flex space-x-8 pt-6">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center space-y-2"
              >
                <CameraIcon className="h-12 w-12 text-primary-600" />
                <span className="text-sm font-medium text-gray-600">Photography</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center space-y-2"
              >
                <VideoCameraIcon className="h-12 w-12 text-primary-600" />
                <span className="text-sm font-medium text-gray-600">Videography</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex flex-col items-center space-y-2"
              >
                <HeartIcon className="h-12 w-12 text-primary-600" />
                <span className="text-sm font-medium text-gray-600">Passion</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;