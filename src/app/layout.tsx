import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Vivvo - Reseñas reales de apartamentos en Panamá',
  description: 'Encuentra reseñas reales de inquilinos reales sobre edificios de apartamentos en Panamá. Más de 500 reseñas auténticas para ayudarte a tomar la mejor decisión.',
  keywords: ['apartamentos panama', 'reseñas edificios panama', 'alquiler panama', 'torre del mar', 'costa del este', 'punta pacifica', 'san francisco', 'vivir en panama'],
  authors: [{ name: 'Vivvo Team' }],
  creator: 'Vivvo',
  publisher: 'Vivvo',
  openGraph: {
    title: 'Vivvo - Reseñas reales de apartamentos en Panamá',
    description: 'Encuentra reseñas reales de inquilinos verificados sobre edificios de apartamentos en Panamá. Más de 500 reseñas auténticas.',
    type: 'website',
    url: 'https://vivvo.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vivvo - Reseñas reales de apartamentos en Panamá',
    description: 'Encuentra reseñas reales de inquilinos reales sobre edificios de apartamentos en Panamá.',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="pixel-city"></div>
        <AuthProvider>
          <AdminProvider>
            {children}
          </AdminProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
