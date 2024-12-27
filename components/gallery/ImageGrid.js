import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Expand from './Expand';

export default function ImageGrid({ images }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <AnimatePresence>
        {images.map((image) => (
          <motion.div
            key={image.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="relative group"
          >
            <img
              src={image.url}
              alt={image.name}
              className="w-full h-48 object-cover rounded-lg transition-transform group-hover:scale-105"
            />
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg"
            >
              <button
                onClick={() => {}}
                className="p-2 bg-white rounded-full transform hover:scale-110 transition-transform"
              >
                <Expand size={20} className="text-gray-900" />
              </button>
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
