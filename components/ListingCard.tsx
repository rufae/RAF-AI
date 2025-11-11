'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface Listing {
  id: string;
  title: string;
  description: string;
  url: string;
  price?: string;
  location?: string;
  image?: string;
  bedrooms?: number;
  amenities?: string[];
}

interface ListingCardProps {
  listing: Listing;
  index: number;
}

/**
 * Componente ListingCard
 * 
 * Tarjeta visual para cada resultado de búsqueda con:
 * - Animaciones de entrada con Framer Motion
 * - Diseño responsive y colorido
 * - Hover effects suaves
 * - Información estructurada del alquiler
 */
export default function ListingCard({ listing, index }: ListingCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group"
    >
      <a
        href={listing.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
      >
        {/* Imagen */}
        <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
          {listing.image ? (
            <Image
              src={listing.image}
              alt={listing.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <svg
                className="w-20 h-20 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
          )}

          {/* Badge de precio */}
          {listing.price && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-bold shadow-lg"
            >
              {listing.price}
              <span className="text-xs ml-1 opacity-90">/noche</span>
            </motion.div>
          )}

          {/* Badge de ubicación */}
          {listing.location && (
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium shadow-md flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              {listing.location}
            </motion.div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-5">
          {/* Título */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {listing.title}
          </h3>

          {/* Descripción */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>

          {/* Habitaciones */}
          {listing.bedrooms && (
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-700">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="font-medium">{listing.bedrooms} habitaciones</span>
            </div>
          )}

          {/* Amenities */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {listing.amenities.slice(0, 3).map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-gray-700 border border-blue-200"
                >
                  {getAmenityIcon(amenity)}
                  <span className="ml-1.5">{amenity}</span>
                </span>
              ))}
              {listing.amenities.length > 3 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{listing.amenities.length - 3} más
                </span>
              )}
            </div>
          )}

          {/* Call to action */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Ver detalles</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-blue-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </a>
    </motion.article>
  );
}

/**
 * Helper: retorna un emoji según el amenity
 */
function getAmenityIcon(amenity: string): string {
  const lower = amenity.toLowerCase();
  
  if (lower.includes('piscina')) return '🏊';
  if (lower.includes('wifi')) return '📶';
  if (lower.includes('jardín') || lower.includes('jardin')) return '🌳';
  if (lower.includes('parking') || lower.includes('aparcamiento')) return '🅿️';
  if (lower.includes('aire') || lower.includes('acondicionado')) return '❄️';
  if (lower.includes('chimenea')) return '🔥';
  if (lower.includes('bbq') || lower.includes('barbacoa')) return '🍖';
  if (lower.includes('terraza')) return '🌅';
  if (lower.includes('jacuzzi')) return '🛁';
  if (lower.includes('vista')) return '👁️';
  
  return '✨';
}
