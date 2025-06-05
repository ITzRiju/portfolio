'use client';

import { motion } from 'framer-motion';
import { CameraIcon } from '@heroicons/react/24/outline';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <CameraIcon className="w-full h-full text-primary-600" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900">PhotoStudio</h1>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          {/* Progress Bar */}
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
            />
          </div>

          {/* Loading Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-gray-600"
          >
            Loading your visual experience...
          </motion.p>

          {/* Dots Animation */}
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0.3 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 0.2,
                }}
                className="w-2 h-2 bg-primary-500 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingSpinner;