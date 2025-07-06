'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { supabase } from '@/lib/supabase'

export default function SuggestBuildingPage() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    email: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Insertar en la base de datos
      const { error } = await supabase
        .from('building_suggestions')
        .insert({
          name: formData.name,
          location: formData.location,
          email: formData.email
        })

      if (error) throw error
      
      console.log('Building suggestion submitted:', formData)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Error al enviar sugerencia:', error)
      alert('Error al enviar la sugerencia. Por favor intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const isValid = formData.name.trim() && formData.location.trim() && formData.email.includes('@')

  if (isSubmitted) {
    return (
      <>
        <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">¡Sugerencia enviada!</h1>
            <p className="text-gray-600 mb-6">
              Gracias por ayudarnos a crecer. Revisaremos <strong>{formData.name}</strong> y lo agregaremos pronto a la plataforma.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href={ROUTES.buildings}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Ver Edificios
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false)
                  setFormData({ name: '', location: '', email: '' })
                }}
                className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Sugerir Otro
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sugerir Edificio
            </h1>
            <p className="text-gray-600">
              Solo necesitamos el nombre y ubicación. Nosotros nos encargamos del resto.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del edificio *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Torre del Mar, Ocean View, Sortis Hotel..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ej: Costa del Este, Punta Pacifica, San Francisco..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Tu email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Para notificarte cuando agreguemos el edificio
              </p>
            </div>

            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                isValid && !isSubmitting
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Enviando...' : 'Sugerir Edificio'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href={ROUTES.buildings}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← Volver a edificios
            </Link>
          </div>
        </div>
      </div>
    </div>
    
    <Footer />
  </>
  )
} 