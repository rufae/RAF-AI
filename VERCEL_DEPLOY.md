# 🚀 Vercel Deployment Guide

## Opción 1: Deploy desde GitHub (Recomendado)

### Paso 1: Subir a GitHub

```bash
# Inicializar repo si no existe
git init
git add .
git commit -m "feat: initial commit - RAF-AI casas rurales"

# Crear repo en GitHub y conectar
git remote add origin https://github.com/rufae/RAF-AI.git
git branch -M main
git push -u origin main
```

### Paso 2: Conectar con Vercel

1. Ve a https://vercel.com
2. Haz login con GitHub
3. Click en "Add New Project"
4. Selecciona el repositorio `RAF-AI`
5. Click en "Import"

### Paso 3: Configurar Environment Variables

En la página de configuración de Vercel:

```
GEMINI_API_KEY=tu_gemini_api_key_aqui
SERPAPI_KEY=tu_serpapi_key_aqui (opcional)
BING_SEARCH_KEY=tu_bing_key_aqui (opcional)
```

### Paso 4: Deploy

1. Click en "Deploy"
2. Espera 1-2 minutos
3. ✅ Tu app estará en: `https://raf-ai.vercel.app`

### Auto-Deploy

Cada push a `main` desplegará automáticamente.

---

## Opción 2: Deploy con Vercel CLI

### Instalación

```bash
npm i -g vercel
```

### Login

```bash
vercel login
```

### Deploy Preview

```bash
vercel
```

### Deploy Production

```bash
vercel --prod
```

### Configurar Environment Variables

```bash
# Añadir variable
vercel env add GEMINI_API_KEY

# Listar variables
vercel env ls

# Remover variable
vercel env rm GEMINI_API_KEY
```

---

## ⚙️ Configuración de Vercel

### vercel.json (Opcional)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["cdg1"],
  "env": {
    "NEXT_PUBLIC_APP_NAME": "RAF-AI Casas Rurales"
  }
}
```

### Build Settings en Dashboard

```
Framework Preset: Next.js
Build Command: npm run build
Output Directory: (Leave blank)
Install Command: npm install
Development Command: npm run dev
```

---

## 🌍 Custom Domain

### Añadir Dominio

1. Ve a tu proyecto en Vercel
2. Settings → Domains
3. Añade tu dominio: `casas-andalucia.com`
4. Sigue las instrucciones DNS

### Configuración DNS

```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

```
Type: A
Name: @
Value: 76.76.21.21
```

---

## 📊 Monitoreo

### Analytics (Incluido en Vercel)

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Speed Insights

```bash
npm i @vercel/speed-insights
```

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';

<SpeedInsights />
```

---

## 🔍 Logs y Debugging

### Ver Logs en Tiempo Real

```bash
vercel logs --follow
```

### Ver Logs de Deployment Específico

```bash
vercel logs [deployment-url]
```

### Ver Logs en Dashboard

1. Ve a tu proyecto
2. Click en "Deployments"
3. Click en un deployment
4. Tab "Runtime Logs"

---

## 🔐 Environment Variables Best Practices

### Production vs Development

```bash
# Production
vercel env add GEMINI_API_KEY production

# Development
vercel env add GEMINI_API_KEY development

# Preview
vercel env add GEMINI_API_KEY preview
```

### Sincronizar Local

```bash
vercel env pull
# Crea .env.local con las variables de Vercel
```

---

## ⚡ Optimizaciones

### Edge Functions

Las API routes se despliegan automáticamente como Edge Functions:

- Latencia < 50ms globalmente
- Escalado automático
- No cold starts

### Edge Config (Avanzado)

```bash
# Crear edge config
vercel edge-config create

# Usar en código
import { get } from '@vercel/edge-config';

const value = await get('key');
```

### CDN Caching

```typescript
// app/api/search/route.ts
export const runtime = 'edge';
export const revalidate = 3600; // Cache 1 hora
```

---

## 🚨 Troubleshooting

### Build Falla

```bash
# Limpiar cache
vercel build --debug

# Ver errores detallados en Dashboard → Deployment → Build Logs
```

### Environment Variables No Funcionan

```bash
# Verificar que están configuradas
vercel env ls

# Re-deploy después de añadir
vercel --prod
```

### Timeout en API Routes

```typescript
// Aumentar timeout (máx 60s en Pro)
export const config = {
  maxDuration: 30,
};
```

### Imagen No Carga

Verifica `next.config.js`:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
  ],
}
```

---

## 📈 Escalabilidad

### Pricing Tiers

- **Hobby**: Gratis
  - 100 GB bandwidth/mes
  - Sin límite de proyectos
  - Deploy ilimitados

- **Pro**: $20/mes
  - 1 TB bandwidth/mes
  - Analytics avanzado
  - Colaboración en equipo

### Límites Hobby Plan

- Serverless Function Size: 50 MB
- Serverless Function Duration: 10s
- Edge Function Size: 1 MB
- Edge Function Duration: No límite

### Optimizar Costos

```bash
# Reducir tamaño de bundle
npm run build
# Revisa el output para identificar bundles grandes

# Lazy loading de componentes
const Component = dynamic(() => import('./Component'));

# Optimizar imágenes
<Image src="..." sizes="..." priority />
```

---

## 🔄 CI/CD Avanzado

### Preview Deployments

Cada branch y PR obtiene su propia URL de preview:

```
feature/nueva-feature → https://raf-ai-xyz123.vercel.app
```

### Proteger Production

```bash
# Requerir aprobación para production
vercel settings --protect-production
```

### Webhooks

```bash
# Notificar en Slack cuando hay deploy
Vercel Dashboard → Settings → Git → Deploy Hooks
```

---

## 📱 PWA en Vercel

```bash
npm i next-pwa
```

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  // ... config
});
```

---

## ✅ Checklist Pre-Deploy

- [ ] `.env.local` NO está en Git
- [ ] Variables de entorno configuradas en Vercel
- [ ] `npm run build` pasa sin errores
- [ ] Imágenes optimizadas
- [ ] Meta tags configurados
- [ ] Analytics instalado
- [ ] Custom domain (opcional)
- [ ] SSL certificate (automático)

---

## 🎉 Post-Deploy

### Verificar Funcionamiento

```bash
curl https://raf-ai.vercel.app/api/search?q=Granada
```

### Monitorear Performance

- Vercel Analytics
- Google PageSpeed Insights
- Lighthouse CI

### Compartir

```
🎉 ¡RAF-AI ya está en vivo!
🔗 https://raf-ai.vercel.app
```

---

**Happy Deploying! 🚀**
