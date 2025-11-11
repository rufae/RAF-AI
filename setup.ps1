# 🚀 Setup Script - RAF-AI

Write-Host "🏡 Configurando RAF-AI - Casas Rurales Andalucía..." -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "📦 Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node -v 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
Write-Host ""

# Instalar dependencias
Write-Host "📥 Instalando dependencias..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencias instaladas correctamente" -ForegroundColor Green
Write-Host ""

# Crear .env.local si no existe
if (!(Test-Path ".env.local")) {
    Write-Host "🔐 Creando archivo .env.local..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✅ Archivo .env.local creado desde template" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANTE: Edita .env.local con tus API keys" -ForegroundColor Magenta
    Write-Host "   - GEMINI_API_KEY: https://makersuite.google.com/app/apikey" -ForegroundColor Cyan
    Write-Host "   - SERPAPI_KEY (opcional): https://serpapi.com/" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "✅ Archivo .env.local ya existe" -ForegroundColor Green
    Write-Host ""
}

# Resumen
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🎉 Setup completado exitosamente!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
Write-Host "  1️⃣  Edita .env.local con tus API keys" -ForegroundColor White
Write-Host "  2️⃣  Ejecuta: npm run dev" -ForegroundColor White
Write-Host "  3️⃣  Abre: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "📚 Comandos disponibles:" -ForegroundColor Yellow
Write-Host "  • npm run dev     - Modo desarrollo" -ForegroundColor White
Write-Host "  • npm run build   - Build producción" -ForegroundColor White
Write-Host "  • npm run start   - Servidor producción" -ForegroundColor White
Write-Host "  • npm run lint    - Linter" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Deploy en Vercel:" -ForegroundColor Yellow
Write-Host "  • vercel          - Deploy rápido" -ForegroundColor White
Write-Host "  • vercel --prod   - Deploy producción" -ForegroundColor White
Write-Host ""
Write-Host "¡Que disfrutes desarrollando! 🚀" -ForegroundColor Cyan
