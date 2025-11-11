import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Casas Rurales Andalucía | Búsqueda Inteligente con IA',
  description:
    'Encuentra tu casa rural perfecta en Andalucía. Búsqueda potenciada por IA con Gemini. Descubre alojamientos con piscina, wifi y vistas espectaculares.',
  keywords: [
    'casas rurales',
    'Andalucía',
    'alquiler',
    'turismo rural',
    'Granada',
    'Málaga',
    'Sevilla',
    'Córdoba',
  ],
  authors: [{ name: 'RAF-AI' }],
  openGraph: {
    title: 'Casas Rurales Andalucía | Búsqueda Inteligente',
    description: 'Encuentra tu casa rural perfecta en Andalucía con búsqueda potenciada por IA',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
