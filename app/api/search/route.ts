import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Tipos para los resultados de búsqueda
interface SearchResult {
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

// Helper para inicializar Gemini de forma segura (lazy import).
async function getGenAIClient() {
  if (!process.env.GEMINI_API_KEY) return null;
  try {
    const mod = await import('@google/generative-ai');
    const GoogleGenerativeAI = (mod as any).GoogleGenerativeAI || (mod as any).default;
    if (!GoogleGenerativeAI) {
      console.warn('Gemini package loaded but client not found.');
      return null;
    }
    return new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  } catch (err) {
    console.warn(
      'Gemini client not available (skipping):',
      err instanceof Error ? err.message : err
    );
    return null;
  }
}

/**
 * API Route: /api/search
 *
 * Endpoint serverless que:
 * 1. Recibe una query de búsqueda
 * 2. Usa Gemini para analizar y enriquecer la búsqueda
 * 3. Consulta SerpApi o Bing para obtener resultados reales
 * 4. Procesa y estructura los resultados
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    const guestsParam = searchParams.get('guests');
    const priceMinParam = searchParams.get('priceMin');
    const priceMaxParam = searchParams.get('priceMax');
    const locationParam = searchParams.get('location');

    const guests = guestsParam ? Number(guestsParam) : undefined;
    const priceMin = priceMinParam ? Number(priceMinParam) : undefined;
    const priceMax = priceMaxParam ? Number(priceMaxParam) : undefined;
    const location = locationParam ? locationParam : undefined;

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    // Paso 1: Usar Gemini para analizar y enriquecer la búsqueda (si está disponible)
    const enhancedQuery = await enhanceSearchWithGemini(query, {
      guests,
      priceMin,
      priceMax,
      location,
    });

    // Paso 2: Buscar en SerpApi o usar datos simulados
    const searchResults = await performSearch(enhancedQuery, query);

    // Paso 3: Procesar resultados con Gemini para extraer información estructurada (si está disponible)
    const processedResults = await processResultsWithGemini(searchResults, query);

    return NextResponse.json({
      success: true,
      query,
      enhancedQuery,
      results: processedResults,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in search API:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Usa Gemini para analizar y enriquecer la búsqueda del usuario
 */
async function enhanceSearchWithGemini(
  query: string,
  options?: { guests?: number; priceMin?: number; priceMax?: number; location?: string }
): Promise<string> {
  try {
    const genAI = await getGenAIClient();
    if (!genAI) {
      // No hay cliente Gemini: retornar una query sensata por defecto
      console.info('Gemini not configured — using fallback enhanced query.');
      const parts = ['casa rural', 'alquiler'];
      if (options?.location) parts.push(options.location);
      // Prioriza la sierra cuando corresponda
      parts.push('sierra', query);
      if (options?.priceMin || options?.priceMax) {
        const pmin = options.priceMin ?? '';
        const pmax = options.priceMax ?? '';
        parts.push(`precio ${pmin}-${pmax} por noche`);
      }
      if (options?.guests) parts.push(`para ${options.guests} personas`);
      return parts.filter(Boolean).join(' ');
    }
    const model = genAI.getGenerativeModel({ model: process.env.GOOGLE_MODEL || 'gemini-pro' });
    // Construir prompt incluyendo opciones (guests, price, location) y solicitando prioridad por sierra y actividades
    const prompt = `Eres un experto en búsquedas de alojamientos rurales en Andalucía, España.
Analiza esta búsqueda del usuario: "${query}"

Ten en cuenta estas restricciones/opciones del usuario:
- Provincia o zona preferida: ${options?.location ?? 'cualquiera en Andalucía'}
- Número de personas: ${options?.guests ?? 'no especificado'}
- Rango de precio por noche: ${options?.priceMin ?? '-'} a ${options?.priceMax ?? '-'}

Prioriza resultados que:
- Estén en la sierra o zonas montañosas y permitan actividades en el entorno (senderismo, rutas, miradores, pueblos cercanos).
- Ofrezcan opciones y servicios para disfrutar tanto del alojamiento como del entorno.
Genera una consulta de búsqueda optimizada para Google que incluya:
- Términos relevantes para alquileres rurales en la sierra (ej. "casa rural sierra", "cortijo sierra", "alojamiento rural montaña").
- La provincia o ciudad si está especificada.
- Filtro aproximado de precio y capacidad cuando sean relevantes.

Responde SOLO con la consulta optimizada (una sola línea), sin explicaciones adicionales.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Error enhancing search with Gemini:', error);
    return `casa rural alquiler Andalucía ${query}`;
  }
}

/**
 * Realiza la búsqueda usando SerpApi, Bing o datos simulados
 */
async function performSearch(enhancedQuery: string, originalQuery: string): Promise<any[]> {
  // Intentar SerpApi primero (si está configurado)
  if (process.env.SERPAPI_KEY) {
    try {
      const response = await axios.get('https://serpapi.com/search', {
        params: {
          q: enhancedQuery,
          api_key: process.env.SERPAPI_KEY,
          engine: 'google',
          gl: 'es',
          hl: 'es',
          num: 10,
        },
        timeout: 5000,
      });

      console.info('Using SerpApi for search');
      return response.data.organic_results || [];
    } catch (error) {
      console.warn(
        'Error with SerpApi, falling back to other sources or mock:',
        error instanceof Error ? error.message : error
      );
    }
  }

  // Intentar Bing Search API (opcional)
  if (process.env.BING_SEARCH_KEY && process.env.BING_SEARCH_ENDPOINT) {
    try {
      const response = await axios.get(`${process.env.BING_SEARCH_ENDPOINT}`, {
        params: {
          q: enhancedQuery,
          mkt: 'es-ES',
          count: 10,
        },
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.BING_SEARCH_KEY,
        },
        timeout: 5000,
      });

      console.info('Using Bing Search API for search');
      return response.data.webPages?.value || [];
    } catch (error) {
      console.warn(
        'Error with Bing Search, falling back to mock:',
        error instanceof Error ? error.message : error
      );
    }
  }

  // Ninguna API configurada o fallaron: usar datos simulados
  console.info('No external search API available — returning mock results');
  return generateMockResults(originalQuery);
}

/**
 * Genera resultados simulados para demostración
 */
function generateMockResults(query: string): any[] {
  const locations = [
    'Granada',
    'Málaga',
    'Sevilla',
    'Córdoba',
    'Cádiz',
    'Almería',
    'Jaén',
    'Huelva',
  ];
  const types = ['Casa Rural', 'Cortijo', 'Villa', 'Finca', 'Chalet'];

  return Array.from({ length: 8 }, (_, i) => {
    const t = types[i % types.length] ?? 'Casa Rural';
    const loc = locations[i % locations.length] ?? 'Andalucía';
    return {
      title: `${t} en ${loc} - Alquiler Rural`,
      snippet: `Hermosa ${t.toLowerCase()} en ${loc} con todas las comodidades. Piscina, wifi, jardín y vistas espectaculares. Ideal para familias y grupos.`,
      link: `https://ejemplo${i + 1}.com/casa-rural-${loc.toLowerCase()}`,
      position: i + 1,
    };
  });
}

/**
 * Procesa los resultados con Gemini para extraer información estructurada
 */
async function processResultsWithGemini(
  searchResults: any[],
  originalQuery: string
): Promise<SearchResult[]> {
  try {
    const genAI = await getGenAIClient();
    if (!genAI) {
      console.info('Gemini not configured — generating structured results locally');
      return generateStructuredResults(searchResults.slice(0, 8));
    }
    const model = genAI.getGenerativeModel({ model: process.env.GOOGLE_MODEL || 'gemini-pro' });

    const resultsText = searchResults
      .slice(0, 8)
      .map(
        (r, i) =>
          `${i + 1}. ${r.title || r.name}\n${r.snippet || r.description || 'Sin descripción'}\n${r.link || r.url}`
      )
      .join('\n\n');

    const prompt = `Eres un experto en alojamientos rurales en Andalucía.
Analiza estos resultados de búsqueda para la consulta: "${originalQuery}"

RESULTADOS:
${resultsText}

Extrae y estructura la información en formato JSON. Para cada resultado, incluye:
- id: número único
- title: título descriptivo
- description: descripción breve (max 150 caracteres)
- url: enlace web
- price: precio estimado (genera uno realista entre 60-250€/noche si no aparece)
- location: ciudad/zona en Andalucía
- bedrooms: número de habitaciones (estima entre 2-6 si no aparece)
- amenities: array con 3-5 servicios típicos (piscina, wifi, jardín, aire acondicionado, chimenea, parking, bbq, etc)
- image: URL de imagen (usa placeholder: https://images.unsplash.com/photo-[random-id]?w=800)

Responde SOLO con un array JSON válido, sin explicaciones adicionales.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Limpiar el texto para obtener solo el JSON
    text = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    try {
      const parsed = JSON.parse(text);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // Si falla el parsing, generar resultados estructurados manualmente
      return generateStructuredResults(searchResults.slice(0, 8));
    }
  } catch (error) {
    console.error('Error processing results with Gemini:', error);
    return generateStructuredResults(searchResults.slice(0, 8));
  }
}

/**
 * Genera resultados estructurados de forma manual
 */
function generateStructuredResults(rawResults: any[]): SearchResult[] {
  const locations = [
    'Granada',
    'Málaga',
    'Sevilla',
    'Córdoba',
    'Cádiz',
    'Almería',
    'Jaén',
    'Huelva',
  ];
  const amenities = [
    ['Piscina', 'Wifi', 'Jardín', 'BBQ', 'Parking'],
    ['Aire acondicionado', 'Chimenea', 'Terraza', 'Wifi', 'Cocina equipada'],
    ['Piscina privada', 'Wifi', 'Vistas montaña', 'Parking', 'Jardín'],
    ['Jacuzzi', 'Wifi', 'Aire acondicionado', 'BBQ', 'Terraza'],
    ['Piscina', 'Wifi', 'Chimenea', 'Jardín', 'Parking gratuito'],
  ];

  const images = [
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
  ];

  return rawResults.map((result, index) => {
    const title =
      result.title || result.name || `Casa Rural en ${locations[index % locations.length]}`;
    const description =
      result.snippet ||
      result.description ||
      `Alquiler de casa rural en ${locations[index % locations.length]}. Amplia, confortable y bien equipada.`;

    return {
      id: `listing-${index + 1}`,
      title: title.slice(0, 80),
      description: description.slice(0, 150),
      url: result.link || result.url || '#',
      price: `${Math.floor(Math.random() * 150) + 80}€`,
      location: locations[index % locations.length],
      image: images[index % images.length],
      bedrooms: Math.floor(Math.random() * 4) + 2,
      amenities: amenities[index % amenities.length],
    };
  });
}
