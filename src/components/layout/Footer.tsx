import Link from 'next/link'
import { VIVVO } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-400 mb-2">
            Busca. Reseña. Ayuda.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            © 2025 {VIVVO.name}. Reseñas reales de apartamentos en Panamá.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
              Sobre nosotros
            </Link>
            <a 
              href="mailto:info.vivvo@gmail.com" 
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 