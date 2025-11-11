# ⚡ Quick Start Guide - RAF-AI

## 🚀 Instalación Rápida (5 minutos)

### Opción 1: PowerShell (Windows)

```powershell
.\setup.ps1
```

### Opción 2: Bash (Linux/Mac)

```bash
chmod +x setup.sh
./setup.sh
```

### Opción 3: Manual

```bash
npm install
cp .env.example .env.local
# Editar .env.local con tus API keys
npm run dev
```

## 🔑 API Keys (Gratis)

### 1. Gemini API (OBLIGATORIO)

1. Ve a https://makersuite.google.com/app/apikey
2. Haz login con Google
3. Click en "Create API Key"
4. Copia la key
5. Pega en `.env.local`:
   ```
   GEMINI_API_KEY=tu_key_aqui
   ```

### 2. SerpApi (OPCIONAL - 100 búsquedas gratis/mes)

1. Ve a https://serpapi.com/users/sign_up
2. Regístrate gratis
3. Copia tu API key desde el dashboard
4. Pega en `.env.local`:
   ```
   SERPAPI_KEY=tu_key_aqui
   ```

> ⚠️ **Sin SerpApi**: La app usa datos simulados realistas

## 📁 Estructura de Archivos

```
RAF-AI/
├── app/
│   ├── api/search/route.ts    # ← API con Gemini + SerpApi
│   ├── layout.tsx             # ← Layout y metadata
│   ├── page.tsx               # ← Página principal
│   └── globals.css            # ← Estilos Tailwind
├── components/
│   ├── SearchForm.tsx         # ← Input con debounce
│   ├── ListingCard.tsx        # ← Card de resultado
│   └── LoadingSkeleton.tsx    # ← Loading state
├── .env.local                 # ← TUS API KEYS (crear)
└── README.md                  # ← Documentación
```

## 🎯 Flujo de Trabajo

### 1. Desarrollo

```bash
npm run dev
# → http://localhost:3000
```

### 2. Hacer Cambios

```
1. Edita archivos en app/ o components/
2. Guarda (hot reload automático)
3. Verifica en navegador
```

### 3. Build Producción

```bash
npm run build
npm run start
```

### 4. Deploy a Vercel

```bash
npm i -g vercel
vercel login
vercel
```

## 🎨 Personalización Rápida

### Cambiar Colores

**Archivo**: `app/globals.css` y componentes

```css
/* De azul-púrpura a verde-azul */
from-blue-600 to-purple-600
→
from-green-600 to-teal-600
```

### Cambiar Título

**Archivo**: `app/layout.tsx`

```typescript
title: 'Tu Título Aquí';
```

### Añadir Más Sugerencias

**Archivo**: `components/SearchForm.tsx`

```typescript
const suggestions = [
  '🏖️ Tu sugerencia 1',
  '🏔️ Tu sugerencia 2',
  // ...
];
```

### Cambiar Número de Resultados

**Archivo**: `app/api/search/route.ts`

```typescript
// Línea 106 (SerpApi)
num: 10; // → cambia a 20

// Línea 149 (Mock data)
Array.from({ length: 8 }); // → cambia a 16
```

## 🐛 Troubleshooting

### Error: "Cannot find module '@google/generative-ai'"

```bash
npm install
```

### Error: "GEMINI_API_KEY is not defined"

```bash
# Verifica que existe .env.local
# Y que contiene GEMINI_API_KEY=...
```

### Puerto 3000 ocupado

```bash
# Usa otro puerto
npm run dev -- -p 3001
```

### Imágenes no cargan

```bash
# Verifica next.config.js
# remotePatterns debe incluir el dominio
```

### Build falla

```bash
# Limpia y reinstala
rm -rf node_modules .next
npm install
npm run build
```

## 📊 Comandos Útiles

```bash
# Desarrollo
npm run dev          # Servidor desarrollo
npm run build        # Build producción
npm run start        # Servidor producción
npm run lint         # ESLint

# Vercel
vercel               # Deploy preview
vercel --prod        # Deploy producción
vercel env ls        # Listar env vars

# Git
git add .
git commit -m "feat: nueva feature"
git push
```

## 🎓 Aprender Más

- **Next.js**: https://nextjs.org/docs
- **Tailwind**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **SWR**: https://swr.vercel.app/
- **Gemini API**: https://ai.google.dev/docs

## 💡 Tips Pro

### 1. Debugging

```typescript
// En cualquier componente
console.log('Debug:', data);

// En API route
console.error('Error:', error);
```

### 2. Performance

```bash
# Analizar bundle
npm run build
# Verifica el output en consola
```

### 3. SEO

```typescript
// Edita app/layout.tsx metadata
export const metadata = {
  title: '...',
  description: '...',
  keywords: [...],
};
```

### 4. Analytics (Futuro)

```typescript
// app/layout.tsx
<Script src="https://analytics.vercel.com/..." />
```

## 🔥 Features Avanzadas (Próximamente)

- [ ] Filtros (precio, habitaciones, ubicación)
- [ ] Mapa interactivo con pins
- [ ] Favoritos guardados
- [ ] Comparador de propiedades
- [ ] Modo oscuro
- [ ] i18n (inglés, francés)
- [ ] PWA (instalable)
- [ ] Notificaciones push

## 🤝 Contribuir

```bash
# 1. Fork el repo
# 2. Crea rama
git checkout -b feature/mi-feature

# 3. Haz commits
git commit -m "feat: mi feature"

# 4. Push
git push origin feature/mi-feature

# 5. Abre Pull Request en GitHub
```

## 📞 Soporte

- **Issues**: https://github.com/rufae/RAF-AI/issues
- **Discussions**: https://github.com/rufae/RAF-AI/discussions
- **Email**: tu_email@ejemplo.com

---

**¡Happy Coding! 🚀**
