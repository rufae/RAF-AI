# 🏗️ Arquitectura del Proyecto RAF-AI

## 📊 Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO                                  │
│                    (Navegador Web)                               │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js App Router)                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  app/page.tsx (Página Principal)                           │ │
│  │  - Gestión de estado con useState                          │ │
│  │  - Data fetching con SWR                                   │ │
│  │  - Animaciones con Framer Motion                           │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  components/SearchForm.tsx                                 │ │
│  │  - Debounce 500ms                                          │ │
│  │  - Validación de input                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  components/ListingCard.tsx                                │ │
│  │  - Renderizado de resultados                               │ │
│  │  - Hover effects y animaciones                             │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP GET /api/search?q=...
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│              API SERVERLESS (Next.js Route Handler)              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  app/api/search/route.ts                                   │ │
│  │                                                             │ │
│  │  1️⃣ Validar query                                          │ │
│  │  2️⃣ Optimizar búsqueda con Gemini                          │ │
│  │  3️⃣ Consultar APIs externas o generar mock                 │ │
│  │  4️⃣ Procesar resultados con Gemini                         │ │
│  │  5️⃣ Estructurar JSON de respuesta                          │ │
│  └────────────────────────────────────────────────────────────┘ │
└───────┬─────────────────────────┬───────────────────────────────┘
        │                         │
        ▼                         ▼
┌──────────────────┐    ┌──────────────────────┐
│  Google Gemini   │    │  SerpApi / Bing API  │
│     (IA)         │    │  (Búsqueda Web)      │
└──────────────────┘    └──────────────────────┘
```

## 🎯 Componentes Principales

### 1. **Frontend (React/Next.js)**

#### `app/page.tsx`

- **Responsabilidad**: Página principal y orquestador
- **Hooks usados**:
  - `useState`: Gestión de query de búsqueda
  - `useSWR`: Fetching de datos con cache y revalidación
- **Estados manejados**:
  - Loading (skeleton screen)
  - Error (mensaje de error)
  - Empty (sin resultados)
  - Success (grid de cards)
- **Performance**:
  - Debounce implementado en SearchForm
  - Cache de SWR reduce llamadas duplicadas
  - Lazy loading de imágenes con Next/Image

#### `components/SearchForm.tsx`

- **Responsabilidad**: Input de búsqueda con UX optimizada
- **Features**:
  - Debounce de 500ms (reduce llamadas API)
  - Validación mínima de 3 caracteres
  - Sugerencias predefinidas
  - Animaciones de entrada
- **Patrón**: Controlled Component con useEffect para debounce

#### `components/ListingCard.tsx`

- **Responsabilidad**: Renderizado de cada resultado
- **Features**:
  - Optimización de imágenes con Next/Image
  - Stagger animation (delay progresivo)
  - Hover effects suaves
  - Iconos contextuales
- **Accesibilidad**: Links semánticos con rel="noopener noreferrer"

#### `components/LoadingSkeleton.tsx`

- **Responsabilidad**: Estado de carga visual
- **Técnica**: Skeleton screens con shimmer effect
- **UX**: Reduce percepción de tiempo de espera

### 2. **API Backend (Serverless)**

#### `app/api/search/route.ts`

- **Tipo**: Next.js Route Handler (API Serverless)
- **Ventajas**:
  - Desplegado automáticamente en Vercel Edge Functions
  - Escalado automático
  - No requiere servidor dedicado
  - Cold start mínimo

#### Flujo de Procesamiento:

1. **Validación** (`line 30-37`)
   - Verifica query parameter
   - Retorna error 400 si falta

2. **Enhancement con Gemini** (`line 70-93`)
   - Envía query del usuario a Gemini
   - Gemini optimiza la búsqueda para Google
   - Añade contexto de Andalucía y alquileres rurales

3. **Búsqueda Externa** (`line 98-142`)
   - **Opción A**: SerpApi (resultados reales de Google)
   - **Opción B**: Bing Search API (alternativa)
   - **Fallback**: Datos simulados realistas

4. **Procesamiento con Gemini** (`line 170-207`)
   - Extrae información estructurada de snippets
   - Infiere datos faltantes (precio, habitaciones)
   - Genera JSON estructurado
   - Manejo de errores con fallback manual

5. **Respuesta Estructurada** (`line 44-51`)
   ```typescript
   {
     success: boolean,
     query: string,           // Original
     enhancedQuery: string,   // Optimizada por IA
     results: Listing[],      // Array de alojamientos
     timestamp: string
   }
   ```

## 🔐 Seguridad

### Variables de Entorno

- ✅ API keys en `.env.local` (nunca en cliente)
- ✅ `.env.local` en `.gitignore`
- ✅ Template `.env.example` para referencia
- ✅ Variables accesibles solo en servidor (API routes)

### Protección de Credenciales

```typescript
// ❌ MAL: Exponer en cliente
const apiKey = 'sk-...';

// ✅ BIEN: Solo en servidor
const apiKey = process.env.GEMINI_API_KEY;
```

## ⚡ Optimizaciones de Performance

### 1. **Debounce en Búsqueda**

```typescript
// Reduce llamadas API de 10/seg a 2/seg
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(query);
  }, 500);
  return () => clearTimeout(timer);
}, [query]);
```

### 2. **Cache con SWR**

```typescript
useSWR(url, fetcher, {
  revalidateOnFocus: false, // No refetch al cambiar de pestaña
  dedupingInterval: 2000, // Dedup requests dentro de 2s
});
```

### 3. **Optimización de Imágenes**

```tsx
<Image
  src={listing.image}
  alt={listing.title}
  fill
  sizes="(max-width: 768px) 100vw, 33vw" // Responsive
  className="object-cover"
/>
```

### 4. **Animaciones Eficientes**

```tsx
// Framer Motion con GPU acceleration
<motion.div
  animate={{ y: -8 }} // Transform usa GPU
  transition={{ duration: 0.2 }}
/>
```

## 📦 Gestión de Dependencias

### Core

- `next@16`: Framework principal
- `react@19`: UI library
- `typescript@5`: Type safety

### Data Fetching

- `swr@2`: Client-side data fetching con cache
- `axios@1`: HTTP client (alternativa a fetch)

### UI/UX

- `tailwindcss@4`: Utility-first CSS
- `framer-motion@12`: Animaciones declarativas

### IA/APIs

- `@google/generative-ai`: Cliente oficial de Gemini

## 🚀 Deployment

### Vercel (Recomendado)

```bash
# 1. Deploy automático desde GitHub
vercel

# 2. Configurar env vars en dashboard
GEMINI_API_KEY=...
SERPAPI_KEY=...

# 3. Push a main → auto-deploy
```

### Edge Functions

- API routes se despliegan como Edge Functions
- Latencia < 50ms globalmente
- Escalado automático a millones de requests

## 📊 Flujo de Datos

```
Usuario escribe "casa con piscina Granada"
         ↓
SearchForm captura input
         ↓
Debounce espera 500ms sin cambios
         ↓
Trigger onSearch callback
         ↓
SWR detecta nueva URL: /api/search?q=casa+con+piscina+Granada
         ↓
SWR chequea cache → MISS
         ↓
Fetch a /api/search
         ↓
API Route recibe request
         ↓
Gemini optimiza: "casa rural alquiler piscina Granada Andalucía"
         ↓
SerpApi busca en Google
         ↓
Gemini estructura resultados
         ↓
Retorna JSON con 8 listings
         ↓
SWR cachea respuesta
         ↓
page.tsx recibe data
         ↓
Render ListingCard x8 con stagger animation
         ↓
Usuario ve resultados
```

## 🎨 Sistema de Diseño

### Colores

- **Primary**: Blue 600 → Purple 600 (gradient)
- **Secondary**: Gray scales
- **Accent**: Amber (warnings), Red (errors), Green (success)

### Espaciado

- Tailwind default scale (4px base unit)
- Consistent margins: `mb-2`, `mb-4`, `mb-6`
- Padding cards: `p-5`

### Tipografía

- Font: Inter (Google Fonts)
- Scales: `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-4xl`

### Animaciones

- **Entrada**: `opacity 0→1`, `y 20→0`
- **Hover**: `scale 1→1.05`, `y 0→-8`
- **Loading**: `rotate 360°`, `opacity pulse`

## 🔄 Estados de la Aplicación

1. **Inicial**: Welcome message con animación flotante
2. **Typing**: Usuario escribe en SearchForm
3. **Validating**: Query < 3 caracteres → warning
4. **Loading**: Skeleton screen durante fetch
5. **Success**: Grid de cards con resultados
6. **Empty**: No se encontraron resultados
7. **Error**: Mensaje de error con opción de retry

## 📈 Escalabilidad

### Frontend

- **Componentes**: Modulares y reutilizables
- **Typing**: TypeScript previene errores
- **Performance**: React 19 optimizaciones automáticas

### Backend

- **Serverless**: Sin límite de escalado horizontal
- **Cache**: Reduce carga en APIs externas
- **Fallbacks**: Mock data si APIs fallan

### Base de Datos (Futura Expansión)

```typescript
// Posible integración con Supabase/Prisma
interface User {
  id: string;
  favoriteListings: string[];
  searches: Search[];
}
```

## 🧪 Testing (Futuro)

```typescript
// Jest + React Testing Library
describe('SearchForm', () => {
  it('debounces input', async () => {
    // ...
  });
});

// Cypress E2E
describe('Search flow', () => {
  it('searches and displays results', () => {
    // ...
  });
});
```

---

**Última actualización**: Noviembre 2025  
**Autor**: Rafael (rufae)
