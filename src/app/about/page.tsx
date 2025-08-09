import { VIVVO } from '@/lib/constants'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Head from 'next/head'

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>Sobre nosotros - Vivvo</title>
        <meta name="description" content="Conoce la historia de Vivvo, creada por extranjeros que llegaron a Panamá con las mismas preguntas sobre dónde vivir. Nuestra misión es ayudar a miles de personas a encontrar el apartamento perfecto." />
        <meta name="keywords" content="vivvo historia, apartamentos panama, extranjeros panama, reseñas edificios, comunidad inquilinos panama" />
        <meta name="author" content="Vivvo" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Sobre nosotros - Vivvo" />
        <meta property="og:description" content="Conoce la historia de Vivvo, creada por extranjeros que llegaron a Panamá con las mismas preguntas sobre dónde vivir." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vivvo.com/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sobre nosotros - Vivvo" />
        <meta name="twitter:description" content="Conoce la historia de Vivvo, creada por extranjeros que llegaron a Panamá con las mismas preguntas sobre dónde vivir." />
        <link rel="canonical" href="https://vivvo.com/about" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 pixel-background">
        <Header />
        
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Sobre nosotros
            </h1>
            <p className="text-xl text-blue-100">
              La historia detrás de {VIVVO.name}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose prose-lg max-w-none">
            <div className="text-center mb-12">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>

            <div className="space-y-8 text-gray-700">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Éramos extranjeros con las mismas preguntas
                </h2>
              </div>

              <p className="text-lg leading-relaxed">
                Somos un par de extranjeros que llegamos a Panamá con las mismas preguntas que se hace todo el mundo: 
                <strong> ¿Dónde vivir? ¿Qué edificio es mejor? ¿Cómo es realmente la vida ahí?</strong>
              </p>

              <p className="text-lg leading-relaxed">
                Nos dimos cuenta de que buscar apartamento en Panamá era frustrante. Había muchos anuncios bonitos, 
                pero muy poca información real sobre cómo era vivir en estos lugares. Las reseñas eran escasas, 
                poco confiables, o simplemente no existían.
              </p>

              <p className="text-lg leading-relaxed">
                Después de meses de búsqueda, visitas y algunas experiencias no tan buenas, decidimos crear algo 
                que nos hubiera ayudado desde el principio: <strong>un lugar donde la gente pueda compartir 
                experiencias reales sobre vivir en edificios de apartamentos</strong>.
              </p>

              <div className="bg-blue-50 p-8 rounded-lg my-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Nuestra misión es simple
                </h3>
                <p className="text-lg text-gray-700">
                  Ayudar a miles de personas más a tomar decisiones informadas sobre dónde vivir, 
                  basándose en experiencias reales de otros inquilinos.
                </p>
              </div>

              <p className="text-lg leading-relaxed">
                {VIVVO.name} no es una empresa inmobiliaria ni un marketplace. Somos una plataforma hecha 
                por y para inquilinos. Queremos que tu próxima mudanza sea la correcta.
              </p>

              <div className="border-t border-gray-200 pt-8 mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ¿Por qué gratis?
                </h3>
                <p className="text-lg leading-relaxed">
                  Creemos que la información sobre vivienda debe ser accesible para todos. Nuestro objetivo es construir una comunidad que se ayude mutuamente.
                </p>
              </div>

              <div className="text-center pt-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Únete a la comunidad
                </h3>
                <p className="text-lg text-gray-700 mb-6">
                  Comparte tu experiencia, ayuda a otros y encuentra tu próximo hogar con confianza.
                </p>
                <div className="flex justify-center space-x-4">
                  <Link
                    href="/buildings"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Explorar edificios
                  </Link>
                  <Link
                    href="/suggest-building"
                    className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                  >
                    Sugerir edificio
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  )
} 