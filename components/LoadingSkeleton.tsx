'use client';

import { motion } from 'framer-motion';

/**
 * Componente LoadingSkeleton
 * 
 * Skeleton screen animado para mostrar durante la carga:
 * - Animaciones de pulso con Framer Motion
 * - Grid responsive
 * - Efecto shimmer profesional
 */
export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <SkeletonCard key={index} index={index} />
      ))}
    </div>
  );
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg"
    >
      {/* Skeleton Image */}
      <div className="relative h-56 w-full bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear',
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />
      </div>

      {/* Skeleton Content */}
      <div className="p-5 space-y-4">
        {/* Skeleton Title */}
        <div className="space-y-2">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-6 bg-gray-200 rounded-lg w-3/4"
          />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 }}
            className="h-6 bg-gray-200 rounded-lg w-1/2"
          />
        </div>

        {/* Skeleton Description */}
        <div className="space-y-2">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
            className="h-4 bg-gray-200 rounded w-full"
          />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
            className="h-4 bg-gray-200 rounded w-5/6"
          />
        </div>

        {/* Skeleton Bedrooms */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
          className="h-5 bg-gray-200 rounded w-32"
        />

        {/* Skeleton Amenities */}
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 + i * 0.1 }}
              className="h-7 bg-gray-200 rounded-full w-20"
            />
          ))}
        </div>

        {/* Skeleton Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.7 }}
            className="h-4 bg-gray-200 rounded w-24"
          />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.8 }}
            className="h-5 w-5 bg-gray-200 rounded"
          />
        </div>
      </div>
    </motion.div>
  );
}
