'use client'

import { ROUTES } from '@/lib/constants'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/buildings?search=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      router.push('/buildings')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  return (
    <>
      <Head>
        <title>Vivvo - Reseñas reales de apartamentos en Panamá</title>
        <meta name="description" content="Encuentra reseñas reales de inquilinos reales sobre edificios de apartamentos en Panamá. Más de 500 reseñas auténticas para ayudarte a tomar la mejor decisión." />
        <meta name="keywords" content="apartamentos panama, reseñas edificios panama, alquiler panama, torre del mar, costa del este, punta pacifica, san francisco, vivir en panama" />
        <meta name="author" content="Vivvo" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Vivvo - Reseñas reales de apartamentos en Panamá" />
        <meta property="og:description" content="Encuentra reseñas reales de inquilinos verificados sobre edificios de apartamentos en Panamá. Más de 500 reseñas auténticas." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vivvo.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vivvo - Reseñas reales de apartamentos en Panamá" />
        <meta name="twitter:description" content="Encuentra reseñas reales de inquilinos reales sobre edificios de apartamentos en Panamá." />
        <link rel="canonical" href="https://vivvo.com" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Hero Section with Background */}
        <div className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          
          {/* Hero Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-4">
              Encuentra <span className="text-blue-200">reseñas reales</span><br/>
              vive en <span className="text-blue-200">cualquier lugar</span>
            </h1>
            
            {/* Search Bar */}
            <div className="w-full max-w-2xl mt-8">
              <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="torre del mar, costa del este, punta pacifica..."
                  className="w-full pl-12 pr-4 py-4 text-lg text-gray-900 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center font-medium"
                >
                  Buscar
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Trusted By Section */}
        <div className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <p className="text-gray-600 text-lg mb-4">
                ¿Buscas apartamento en Panamá? Encuentra <strong>reseñas reales</strong> de <strong>inquilinos verificados</strong> antes de tomar tu decisión.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="bg-white py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Reseñas Recientes</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Torre del Mar</h3>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="ml-2 text-sm text-gray-500">5.0</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  &quot;Excelente ubicación, edificio muy bien mantenido. La seguridad es de primera y las amenidades están siempre limpias...&quot;
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Costa del Este</span>
                  <span>hace 2 horas</span>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Sortis Hotel</h3>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★★★★☆</span>
                    <span className="ml-2 text-sm text-gray-500">4.2</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  &quot;Muy buen edificio, pero la administración podría mejorar. Las amenidades son increíbles y la vista es espectacular...&quot;
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Punta Pacifica</span>
                  <span>hace 1 día</span>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Ocean View</h3>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="ml-2 text-sm text-gray-500">4.8</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  &quot;Apartamento perfecto para jóvenes profesionales. La ubicación es inmejorable y el edificio tiene todo lo que necesitas...&quot;
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>San Francisco</span>
                  <span>hace 3 días</span>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link 
                href="/buildings"
                className="inline-flex items-center px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Ver todas las reseñas
              </Link>
            </div>
          </div>
        </div>

        {/* Beta Notice */}
        <div className="bg-blue-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-4">🚀</span>
                <div>
                  <h3 className="font-semibold text-gray-900">Estamos en Beta</h3>
                  <p className="text-gray-600 text-sm">Tu feedback nos ayuda a mejorar la plataforma</p>
                </div>
              </div>
              <div className="flex gap-3">
                <a 
                  href="mailto:info.vivvo@gmail.com?subject=Feedback para Vivvo&body=Hola equipo Vivvo,%0A%0ATengo el siguiente feedback:%0A%0A"
                  className="px-4 py-2 text-sm border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Enviar Feedback
                </a>
                <Link
                  href={ROUTES.suggestBuilding}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sugerir Edificio
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
