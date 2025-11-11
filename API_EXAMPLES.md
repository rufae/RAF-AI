# 🔌 API Examples - RAF-AI

## Endpoint Principal

```
GET /api/search?q={query}
```

## 📋 Ejemplos de Requests

### 1. Búsqueda Simple

```bash
curl "http://localhost:3000/api/search?q=casa%20rural%20Granada"
```

```javascript
// JavaScript/TypeScript
const response = await fetch('/api/search?q=casa rural Granada');
const data = await response.json();
```

### 2. Búsqueda Específica

```bash
curl "http://localhost:3000/api/search?q=villa%20con%20piscina%20Málaga"
```

### 3. Con SWR (Recomendado)

```typescript
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

function SearchComponent() {
  const { data, error, isLoading } = useSWR(
    `/api/search?q=${encodeURIComponent(query)}`,
    fetcher
  );

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage />;

  return <ResultsGrid results={data.results} />;
}
```

## 📤 Response Schema

### Success Response (200)

```json
{
  "success": true,
  "query": "casa con piscina Granada",
  "enhancedQuery": "casa rural alquiler piscina Granada Andalucía vacaciones",
  "results": [
    {
      "id": "listing-1",
      "title": "Casa Rural en Granada - Alquiler Rural",
      "description": "Hermosa casa rural en Granada con todas las comodidades. Piscina, wifi, jardín y vistas espectaculares.",
      "url": "https://ejemplo1.com/casa-rural-granada",
      "price": "120€",
      "location": "Granada",
      "image": "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800",
      "bedrooms": 3,
      "amenities": ["Piscina", "Wifi", "Jardín", "BBQ", "Parking"]
    }
  ],
  "timestamp": "2025-11-10T10:30:00.000Z"
}
```

### Error Response (400)

```json
{
  "error": "Query parameter \"q\" is required"
}
```

### Error Response (500)

```json
{
  "error": "Internal server error",
  "message": "Failed to process search"
}
```

## 🔍 Query Parameters

| Parámetro | Tipo   | Requerido | Descripción                          |
| --------- | ------ | --------- | ------------------------------------ |
| `q`       | string | ✅ Sí     | Término de búsqueda (min 1 carácter) |

## 💡 Ejemplos de Queries Efectivas

### Por Ubicación

```
Granada
Málaga
Costa del Sol
Sierra Nevada
Alpujarras
```

### Por Características

```
con piscina
con wifi
cerca de la playa
en la montaña
con jardín
con chimenea
```

### Combinadas

```
casa rural piscina Granada
villa playa Málaga
cortijo Sierra Nevada wifi
finca jardín Córdoba
```

## 🧪 Testing en Postman

### 1. Crear Request

```
GET http://localhost:3000/api/search
```

### 2. Añadir Query Params

```
q: casa rural Granada
```

### 3. Send → Ver Response

## 🐛 Debugging

### Logs en Servidor

```typescript
// app/api/search/route.ts
console.log('Query received:', query);
console.log('Enhanced query:', enhancedQuery);
console.log('Results count:', searchResults.length);
```

### Inspeccionar en Browser DevTools

```javascript
// Console
fetch('/api/search?q=test')
  .then((r) => r.json())
  .then(console.log);
```

## ⚡ Rate Limiting (Futuro)

```typescript
// Ejemplo de implementación
import { ratelimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  // ... resto del código
}
```

## 🔐 Authentication (Futuro)

```typescript
// Ejemplo con API Key
export async function GET(request: NextRequest) {
  const apiKey = request.headers.get('x-api-key');

  if (!apiKey || apiKey !== process.env.API_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ... resto del código
}
```

## 📊 Response Times

| Escenario                    | Tiempo Estimado |
| ---------------------------- | --------------- |
| Con cache (SWR)              | ~10ms           |
| Sin cache + Gemini + SerpApi | ~2-4s           |
| Sin cache + Solo Gemini      | ~1-2s           |
| Modo offline (mock)          | ~100ms          |

## 🌐 CORS (Si usas desde otro dominio)

```typescript
// app/api/search/route.ts
export async function GET(request: NextRequest) {
  const response = NextResponse.json(data);

  // Permitir CORS
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET');

  return response;
}
```

## 📦 SDK Client (Ejemplo)

```typescript
// lib/raf-ai-client.ts
export class RAFAIClient {
  private baseUrl: string;

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  async search(query: string) {
    const response = await fetch(`${this.baseUrl}/api/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    return response.json();
  }
}

// Uso
const client = new RAFAIClient();
const results = await client.search('casa rural Granada');
```

## 🔄 Retry Logic

```typescript
async function searchWithRetry(query: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((r) => setTimeout(r, 1000 * (i + 1))); // Exponential backoff
    }
  }
}
```

## 📈 Analytics

```typescript
// Tracking de búsquedas
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q');

  // Log para analytics
  await fetch('https://analytics.example.com/track', {
    method: 'POST',
    body: JSON.stringify({
      event: 'search',
      query,
      timestamp: new Date().toISOString(),
    }),
  });

  // ... resto del código
}
```

## 🧪 Unit Tests (Ejemplo)

```typescript
// __tests__/api/search.test.ts
import { GET } from '@/app/api/search/route';
import { NextRequest } from 'next/server';

describe('Search API', () => {
  it('returns results for valid query', async () => {
    const request = new NextRequest('http://localhost:3000/api/search?q=Granada');

    const response = await GET(request);
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.results).toHaveLength(8);
  });

  it('returns error for missing query', async () => {
    const request = new NextRequest('http://localhost:3000/api/search');
    const response = await GET(request);

    expect(response.status).toBe(400);
  });
});
```

## 🚀 Production Tips

1. **Cache Responses**: Usa Vercel Edge Cache
2. **Monitor Errors**: Sentry o similar
3. **Log Searches**: BigQuery o Postgres
4. **Rate Limit**: Protege contra abuse
5. **API Versioning**: `/api/v1/search`

---

**Última actualización**: Noviembre 2025
