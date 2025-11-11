'use client';

import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import SearchForm from '@/components/SearchForm';
import ListingCard from '@/components/ListingCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';

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

interface SearchResponse {
  success: boolean;
  query: string;
  enhancedQuery: string;
  results: Listing[];
  timestamp: string;
}

// Fetcher para SWR
const fetcher = async (url: string): Promise<SearchResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Error al buscar');
  }
  return response.json();
};

/**
 * Página Principal
 *
 * Integra todos los componentes:
 * - SearchForm con debounce
 * - SWR para gestión de datos y caché
 * - ListingCard para cada resultado
 * - LoadingSkeleton para estados de carga
 * - Animaciones con Framer Motion
 */
export default function Home() {
  const [searchUrl, setSearchUrl] = useState<string>('');

  // SWR hook para búsqueda con revalidación automática
  const { data, error, isLoading } = useSWR<SearchResponse>(searchUrl ? searchUrl : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000,
  });

  const handleSearch = useCallback(
    (payload: {
      q: string;
      guests?: number | null;
      priceMin?: number | null;
      priceMax?: number | null;
      location?: string | null;
    }) => {
      const params = new URLSearchParams();
      params.set('q', payload.q);
      if (payload.guests) params.set('guests', String(payload.guests));
      if (payload.priceMin) params.set('priceMin', String(payload.priceMin));
      if (payload.priceMax) params.set('priceMax', String(payload.priceMax));
      if (payload.location) params.set('location', payload.location);

      setSearchUrl(`/api/search?${params.toString()}`);
    },
    []
  );

  const hasResults = data?.results && data.results.length > 0;
  const showEmpty = !isLoading && searchUrl && !hasResults;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4 shadow-xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">🏡 Casas Rurales Andalucía</h1>
          <p className="text-xl text-blue-100">
            Encuentra tu escape perfecto en el corazón de Andalucía
          </p>
        </motion.div>
      </header>

      {/* Search Section */}
      <section className="py-10 px-4">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      </section>

      {/* Results Section */}
      <main className="max-w-7xl mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          {/* Loading State */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingSkeleton />
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <div className="inline-block bg-red-50 border border-red-200 rounded-2xl px-8 py-6">
                <svg
                  className="w-16 h-16 text-red-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Error en la búsqueda</h3>
                <p className="text-gray-600">
                  No pudimos completar tu búsqueda. Por favor, intenta de nuevo.
                </p>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {showEmpty && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-20"
            >
              <div className="inline-block bg-amber-50 border border-amber-200 rounded-2xl px-8 py-6">
                <svg
                  className="w-16 h-16 text-amber-500 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No encontramos resultados</h3>
                <p className="text-gray-600">
                  Intenta con otros términos de búsqueda o prueba una de nuestras sugerencias.
                </p>
              </div>
            </motion.div>
          )}

          {/* Results Grid */}
          {hasResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Results Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {data.results.length} resultados encontrados
                </h2>
                {data.enhancedQuery && (
                  <p className="text-sm text-gray-600">
                    Búsqueda optimizada: <span className="italic">{data.enhancedQuery}</span>
                  </p>
                )}
              </motion.div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {data.results.map((listing, index) => (
                  <ListingCard key={listing.id} listing={listing} index={index} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Welcome State */}
          {!searchUrl && !isLoading && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="inline-block mb-6"
              >
                <svg
                  className="w-24 h-24 text-blue-500"
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
              </motion.div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Comienza tu búsqueda</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Descubre las mejores casas rurales en Andalucía. Usa el buscador arriba para
                encontrar tu alojamiento ideal con piscina, wifi, vistas espectaculares y mucho más.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            Powered by <span className="font-semibold text-white">Gemini AI</span> +{' '}
            <span className="font-semibold text-white">Next.js</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            © {new Date().getFullYear()} RAF-AI. Búsqueda inteligente de alojamientos rurales.
          </p>
        </div>
      </footer>
    </div>
  );
}
