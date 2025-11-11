#!/bin/bash

# 🚀 Setup Script - RAF-AI

echo "🏡 Configurando RAF-AI - Casas Rurales Andalucía..."
echo ""

# Verificar Node.js
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node -v)
echo "✅ Node.js detectado: $NODE_VERSION"
echo ""

# Instalar dependencias
echo "📥 Instalando dependencias..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Error al instalar dependencias"
    exit 1
fi
echo "✅ Dependencias instaladas correctamente"
echo ""

# Crear .env.local si no existe
if [ ! -f ".env.local" ]; then
    echo "🔐 Creando archivo .env.local..."
    cp .env.example .env.local
    echo "✅ Archivo .env.local creado desde template"
    echo "⚠️  IMPORTANTE: Edita .env.local con tus API keys"
    echo "   - GEMINI_API_KEY: https://makersuite.google.com/app/apikey"
    echo "   - SERPAPI_KEY (opcional): https://serpapi.com/"
    echo ""
else
    echo "✅ Archivo .env.local ya existe"
    echo ""
fi

# Resumen
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Setup completado exitosamente!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Próximos pasos:"
echo "  1️⃣  Edita .env.local con tus API keys"
echo "  2️⃣  Ejecuta: npm run dev"
echo "  3️⃣  Abre: http://localhost:3000"
echo ""
echo "📚 Comandos disponibles:"
echo "  • npm run dev     - Modo desarrollo"
echo "  • npm run build   - Build producción"
echo "  • npm run start   - Servidor producción"
echo "  • npm run lint    - Linter"
echo ""
echo "🌐 Deploy en Vercel:"
echo "  • vercel          - Deploy rápido"
echo "  • vercel --prod   - Deploy producción"
echo ""
echo "¡Que disfrutes desarrollando! 🚀"
