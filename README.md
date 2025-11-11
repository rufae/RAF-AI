# 🏡 RAF-AI: Casas Rurales Andalucía

Mini-aplicación Next.js con búsqueda inteligente de alquileres de casas rurales en Andalucía, potenciada por **Gemini AI**.

## ✨ Características

- 🔍 **Búsqueda en tiempo real** con debounce (500ms)
- 🤖 **Inteligencia Artificial**: Gemini optimiza las búsquedas y estructura resultados
- 🎨 **UI moderna y colorida** con Tailwind CSS
- ⚡ **Animaciones fluidas** con Framer Motion
- 📱 **Completamente responsive**
- 🔄 **Cache inteligente** con SWR
- 🌐 **API Serverless** (Next.js Route Handlers)
- 🎯 **TypeScript** para type-safety

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Animaciones**: Framer Motion
- **Data Fetching**: SWR
- **IA**: Google Generative AI (Gemini)
- **APIs**: SerpApi / Bing Search API
- **TypeScript**: Type-safe codebase

## 📁 Estructura del Proyecto

```
RAF-AI/
├── app/
│   ├── api/
│   │   └── search/
│   │       └── route.ts          # API serverless con Gemini + SerpApi
│   ├── globals.css               # Estilos globales Tailwind
│   ├── layout.tsx                # Layout principal con metadata
│   └── page.tsx                  # Página principal con SWR
├── components/
│   ├── SearchForm.tsx            # Formulario con debounce
│   ├── ListingCard.tsx           # Card de cada resultado
│   └── LoadingSkeleton.tsx       # Skeleton screen animado
├── .env.example                  # Template de variables de entorno
├── next.config.js                # Configuración de Next.js
├── tailwind.config.js            # Configuración de Tailwind
├── tsconfig.json                 # Configuración de TypeScript
└── package.json                  # Dependencias del proyecto
```

## 🚀 Setup e Instalación

### 1. Clonar y instalar dependencias

```bash
# Clonar el repositorio
git clone https://github.com/rufae/RAF-AI.git
cd RAF-AI

# Instalar dependencias
npm install
```

### 2. Configurar variables de entorno

```bash
# Copiar el template
cp .env.example .env.local

# Editar .env.local con tus credenciales
```

**Obtener API Keys:**

- **Gemini API**: https://makersuite.google.com/app/apikey (GRATIS)
- **SerpApi** (opcional): https://serpapi.com/ (100 búsquedas gratis/mes)
- **Bing Search** (alternativa): https://portal.azure.com/

```env
GEMINI_API_KEY=tu_clave_aqui
SERPAPI_KEY=tu_clave_opcional
BING_SEARCH_KEY=tu_clave_opcional
```

> ⚠️ **Sin API keys externas**: La app funcionará con datos simulados realistas.

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Explicación de Archivos Clave

### `app/api/search/route.ts`
**API Route Serverless** que:
- Recibe la query de búsqueda
- Usa Gemini para optimizar la búsqueda
- Consulta SerpApi/Bing o genera datos simulados
- Procesa resultados con Gemini para estructurar la información
- Retorna JSON con listings de casas rurales

### `components/SearchForm.tsx`
**Formulario de búsqueda** con:
- Debounce automático de 500ms
- Validación mínima de 3 caracteres
- Sugerencias de búsqueda predefinidas
- Animaciones de entrada con Framer Motion
- Estados de loading y error

### `components/ListingCard.tsx`
**Tarjeta visual** para cada resultado con:
- Imagen con fallback
- Badges animados (precio, ubicación)
- Información estructurada (habitaciones, amenities)
- Hover effects suaves
- Iconos contextuales según amenities

### `components/LoadingSkeleton.tsx`
**Skeleton screen** con:
- 8 cards animadas con efecto shimmer
- Pulso de opacidad
- Grid responsive

### `app/page.tsx`
**Página principal** que:
- Integra todos los componentes
- Gestiona estado de búsqueda con SWR
- Maneja estados: loading, error, empty, results
- Animaciones de transición entre estados

### `app/layout.tsx`
**Layout global** con:
- Metadata SEO optimizada
- Font Inter de Google
- Configuración de idioma español

### `app/globals.css`
**Estilos globales** con:
- Utilities de Tailwind personalizadas
- Efectos de gradiente
- Custom scrollbar
- Clases reutilizables

### `next.config.js`
**Configuración de Next.js**:
- Dominios permitidos para imágenes (Unsplash)
- Optimizaciones de producción
- Variables de entorno públicas

### `tsconfig.json`
**TypeScript config**:
- Module resolution para Next.js
- Paths aliases (@/*)
- Strict mode habilitado

## 🌐 Desplegar en Vercel

### Opción 1: Deploy desde GitHub

1. Sube el proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com) y conecta tu repositorio
3. Configura las variables de entorno en Vercel Dashboard
4. Deploy automático en cada push

### Opción 2: Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Production
vercel --prod
```

### Variables de Entorno en Vercel

En el dashboard de Vercel:
1. Settings → Environment Variables
2. Añadir: `GEMINI_API_KEY`, `SERPAPI_KEY`, etc.
3. Redeploy el proyecto

## 🎯 Uso de la Aplicación

1. **Buscar**: Escribe en el buscador (ej: "casa con piscina en Granada")
2. **Esperar 500ms**: El debounce lanza la búsqueda automática
3. **Ver resultados**: Cards animadas con información detallada
4. **Click en card**: Abre la URL del alquiler en nueva pestaña

### Búsquedas de ejemplo:
- "Villa con piscina en Málaga"
- "Cortijo en Sierra Nevada"
- "Casa rural cerca de Sevilla con wifi"
- "Finca con jardín en Córdoba"

## 🔧 Scripts Disponibles

```bash
npm run dev      # Desarrollo (localhost:3000)
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Ejecutar ESLint
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/amazing`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a la rama (`git push origin feature/amazing`)
5. Abre un Pull Request

## 📝 Licencia

ISC License - Ver archivo LICENSE para más detalles

## 👨‍💻 Autor

**Rafael (rufae)**
- GitHub: [@rufae](https://github.com/rufae)

## 🙏 Agradecimientos

- Google Gemini AI por la capacidad de procesamiento de lenguaje natural
- Next.js team por el excelente framework
- Vercel por el hosting gratuito
- SerpApi por la API de búsqueda

---

**Hecho con ❤️ y ☕ en Andalucía**
