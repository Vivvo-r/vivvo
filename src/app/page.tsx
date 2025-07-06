import { VIVVO, ROUTES } from '@/lib/constants'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          {VIVVO.name}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {VIVVO.tagline}
        </p>
        <p className="text-lg text-gray-500 mb-12">
          {VIVVO.description}
        </p>
        
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            href="/buildings"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Ver Edificios
          </Link>
          <Link
            href={ROUTES.login}
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm">
            Encuentra el apartamento perfecto en Panamá
          </p>
        </div>
      </div>
    </div>
  )
}
