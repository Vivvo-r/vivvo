import { VIVVO, ROUTES } from '@/lib/constants'
import Link from 'next/link'
import Header from '@/components/layout/Header'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20 lg:py-32">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            La Fuente Más Grande de<br/>
            <span className="text-green-500">Reviews Verificadas de Apartamentos</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
            {VIVVO.name} está reinventando las reviews de apartamentos en Panamá. 
            Encuentra el hogar perfecto con reviews auténticas de inquilinos reales.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              ✨ 100% Gratis
            </span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              🚀 Beta Pública
            </span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              🤝 Comunidad
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/buildings"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Explorar Edificios
            </Link>
            <Link
              href={ROUTES.signup}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Escribir Review
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Edificios Verificados
              </h3>
              <p className="text-gray-600">
                Todos los edificios en nuestra plataforma son verificados y auténticos
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Reviews Auténticas
              </h3>
              <p className="text-gray-600">
                Solo reviews de inquilinos reales que han vivido en estos edificios
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🇵🇦</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Enfoque en Panamá
              </h3>
              <p className="text-gray-600">
                Especializados en el mercado inmobiliario panameño
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-center text-white mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-blue-100">Edificios Listados</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Reviews de Inquilinos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Satisfacción de Usuarios</div>
            </div>
          </div>
        </div>

        {/* Beta Notice & Suggestions Section */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-8 md:p-12 mb-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-full mb-6">
              <span className="text-2xl text-white">🚀</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Estamos en Beta
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              {VIVVO.name} está en fase preliminar. Estamos construyendo la mejor plataforma 
              de reviews de apartamentos en Panamá con tu ayuda.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">
                  💡 Sugerencias y Feedback
                </h3>
                <p className="text-gray-600 mb-4">
                  ¿Tienes ideas para mejorar? ¿Encontraste un bug? ¡Nos encantaría escucharte!
                </p>
                <a 
                  href="mailto:info.vivvo@gmail.com?subject=Feedback para Vivvo&body=Hola equipo Vivvo,%0A%0ATengo el siguiente feedback:%0A%0A"
                  className="inline-block bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                >
                  Enviar Feedback
                </a>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-lg text-gray-900 mb-3">
                  🏢 Agregar Edificios
                </h3>
                <p className="text-gray-600 mb-4">
                  ¿Falta tu edificio? ¿Conoces uno que deberíamos agregar? Ayúdanos a crecer.
                </p>
                <Link
                  href={ROUTES.suggestBuilding}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sugerir Edificio
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-12 text-gray-500 border-t border-gray-200">
          <p>© 2024 {VIVVO.name}. Hecho con ❤️ para los buscadores de apartamentos en Panamá.</p>
          <p className="mt-2 text-sm">
            Fase Beta - Construyendo el futuro de las reviews de apartamentos
          </p>
        </footer>
      </main>
    </div>
  )
}
