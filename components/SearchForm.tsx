'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface SearchFormProps {
  onSearch: (payload: {
    q: string;
    guests?: number | null;
    priceMin?: number | null;
    priceMax?: number | null;
    location?: string | null;
  }) => void;
  isLoading?: boolean;
}

/**
 * Componente SearchForm
 *
 * Formulario de búsqueda con:
 * - Debounce de 500ms para evitar llamadas excesivas
 * - Animaciones con Framer Motion
 * - Diseño responsive y colorido
 * - Validación básica
 */
export default function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [guests, setGuests] = useState<number | ''>('');
  const [priceMin, setPriceMin] = useState<number | ''>('');
  const [priceMax, setPriceMax] = useState<number | ''>('');
  const [location, setLocation] = useState<string>('');

  // Debounce effect: actualiza debouncedQuery después de 500ms de inactividad
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  // Ejecutar búsqueda cuando cambie el debouncedQuery
  useEffect(() => {
    if (debouncedQuery.trim().length >= 3) {
      onSearch({
        q: debouncedQuery,
        guests: typeof guests === 'number' ? guests : null,
        priceMin: typeof priceMin === 'number' ? priceMin : null,
        priceMax: typeof priceMax === 'number' ? priceMax : null,
        location: location || null,
      });
    }
  }, [debouncedQuery, onSearch, guests, priceMin, priceMax, location]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim().length >= 3) {
        onSearch({
          q: query,
          guests: typeof guests === 'number' ? guests : null,
          priceMin: typeof priceMin === 'number' ? priceMin : null,
          priceMax: typeof priceMax === 'number' ? priceMax : null,
          location: location || null,
        });
      }
    },
    [query, onSearch, guests, priceMin, priceMax, location]
  );

  const suggestions = [
    '🏖️ Casa con piscina en Málaga',
    '🏔️ Cortijo en la Sierra de Granada',
    '🌅 Villa cerca de la playa en Cádiz',
    '🌳 Finca con jardín en Córdoba',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <motion.div
            animate={{
              boxShadow: query
                ? '0 20px 25px -5px rgb(59 130 246 / 0.2), 0 8px 10px -6px rgb(59 130 246 / 0.2)'
                : '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            }}
            className="relative rounded-2xl bg-white"
          >
            <div className="flex items-center gap-3 px-6 py-4">
              <svg
                className={`w-6 h-6 flex-shrink-0 transition-colors ${
                  query ? 'text-blue-500' : 'text-gray-400'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca tu casa rural ideal en Andalucía..."
                className="flex-1 text-lg outline-none text-gray-800 placeholder-gray-400"
                disabled={isLoading}
              />

              {/* Filters: guests, price and location */}
              <div className="ml-4 flex items-center gap-3">
                <select
                  value={String(guests)}
                  onChange={(e) => setGuests(e.target.value === '' ? '' : Number(e.target.value))}
                  className="bg-white border rounded px-2 py-1 text-sm"
                  disabled={isLoading}
                  aria-label="Número de personas"
                >
                  <option value="">Personas</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n}>
                      {n} pax
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min={0}
                  placeholder="€ min"
                  value={String(priceMin)}
                  onChange={(e) => setPriceMin(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-20 border rounded px-2 py-1 text-sm"
                  disabled={isLoading}
                  aria-label="Precio mínimo por noche"
                />

                <input
                  type="number"
                  min={0}
                  placeholder="€ max"
                  value={String(priceMax)}
                  onChange={(e) => setPriceMax(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-20 border rounded px-2 py-1 text-sm"
                  disabled={isLoading}
                  aria-label="Precio máximo por noche"
                />

                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-white border rounded px-2 py-1 text-sm"
                  disabled={isLoading}
                  aria-label="Provincia / Zona"
                >
                  <option value="">Provincia</option>
                  <option value="Sevilla">Sevilla</option>
                  <option value="Huelva">Huelva</option>
                  <option value="Cádiz">Cádiz</option>
                  <option value="Málaga">Málaga</option>
                  <option value="Granada">Granada</option>
                  <option value="Córdoba">Córdoba</option>
                  <option value="Almería">Almería</option>
                  <option value="Jaén">Jaén</option>
                </select>
              </div>

              {query && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  type="button"
                  onClick={() => setQuery('')}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.button>
              )}

              {isLoading && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ rotate: { duration: 1, repeat: Infinity, ease: 'linear' } }}
                  className="flex-shrink-0"
                >
                  <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </motion.div>
              )}
            </div>
          </motion.div>

          {query.trim().length > 0 && query.trim().length < 3 && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-6 -bottom-6 text-sm text-amber-600"
            >
              ⚠️ Escribe al menos 3 caracteres
            </motion.p>
          )}
        </div>

        {/* Sugerencias */}
        {!query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <p className="text-sm text-gray-500 mb-3 font-medium">Búsquedas sugeridas:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={suggestion}
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuery(suggestion.replace(/^.+\s/, ''))}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 text-sm text-gray-700 hover:from-blue-100 hover:to-purple-100 transition-all border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
}
