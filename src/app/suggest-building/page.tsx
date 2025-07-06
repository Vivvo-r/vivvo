'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'
import Header from '@/components/layout/Header'

export default function SuggestBuildingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    neighborhood: '',
    email: '',
    comments: '',
    hasAmenities: false,
    amenitiesList: '',
    hasParking: false,
    approximateUnits: '',
    yearBuilt: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const steps = [
    { id: 1, title: 'Información Básica', description: 'Datos principales del edificio' },
    { id: 2, title: 'Ubicación', description: 'Dirección y zona' },
    { id: 3, title: 'Detalles Opcionales', description: 'Información adicional' },
    { id: 4, title: 'Contacto', description: 'Tus datos para seguimiento' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Prepare email content
    const emailSubject = `Nueva Sugerencia de Edificio: ${formData.name}`
    const emailBody = `
Hola equipo Vivvo,

Se ha recibido una nueva sugerencia de edificio:

INFORMACIÓN BÁSICA:
• Nombre: ${formData.name}

UBICACIÓN:
• Dirección: ${formData.address}
• Corregimiento/Área: ${formData.neighborhood}

DETALLES OPCIONALES:
• Año de construcción: ${formData.yearBuilt || 'No especificado'}
• Número de unidades: ${formData.approximateUnits || 'No especificado'}
• Tiene estacionamiento: ${formData.hasParking ? 'Sí' : 'No'}
• Tiene amenidades: ${formData.hasAmenities ? 'Sí' : 'No'}
${formData.hasAmenities && formData.amenitiesList ? `• Amenidades: ${formData.amenitiesList}` : ''}

CONTACTO:
• Email: ${formData.email}

COMENTARIOS ADICIONALES:
${formData.comments || 'Ninguno'}

---
Enviado desde vivvo.com
    `.trim()

    // Create mailto link
    const mailtoLink = `mailto:info.vivvo@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
    
    // Open email client
    window.open(mailtoLink, '_blank')

    console.log('Building suggestion submitted:', formData)
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name.trim() !== ''
      case 2:
        return formData.address.trim() !== '' && formData.neighborhood.trim() !== ''
      case 3:
        return true // Optional step
      case 4:
        return formData.email.trim() !== '' && formData.email.includes('@')
      default:
        return false
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">¡Sugerencia enviada!</h1>
            <p className="text-gray-600 mb-6">
              Gracias por ayudarnos a mejorar nuestra plataforma. Revisaremos tu sugerencia y nos pondremos en contacto contigo pronto.
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
                  setCurrentStep(1)
                  setFormData({
                    name: '',
                    address: '',
                    neighborhood: '',
                    email: '',
                    comments: '',
                    hasAmenities: false,
                    amenitiesList: '',
                    hasParking: false,
                    approximateUnits: '',
                    yearBuilt: ''
                  })
                }}
                className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Sugerir Otro
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sugerir Edificio
            </h1>
            <p className="text-gray-600">
              Completa los {steps.length} pasos para sugerir un nuevo edificio
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    step.id === currentStep ? 'bg-blue-600 text-white' :
                    step.id < currentStep ? 'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {step.id < currentStep ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xs font-medium text-gray-900">{step.title}</div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    step.id < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0h4" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Información Básica</h2>
                  <p className="text-gray-600 mt-2">¿Cómo se llama el edificio?</p>
                </div>

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
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    placeholder="Ej: Torre Empresarial Ocean Business Plaza"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Ubicación</h2>
                  <p className="text-gray-600 mt-2">¿Dónde está ubicado el edificio?</p>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección completa *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Calle 50 y Ave. Federico Boyd, Bella Vista"
                  />
                </div>

                <div>
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                    Corregimiento/Área *
                  </label>
                  <input
                    type="text"
                    id="neighborhood"
                    name="neighborhood"
                    value={formData.neighborhood}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Bella Vista, San Francisco, Punta Pacifica"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Optional Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Detalles Opcionales</h2>
                  <p className="text-gray-600 mt-2">Información adicional que puedas conocer</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-2">
                      Año de construcción (aprox.)
                    </label>
                    <input
                      type="text"
                      id="yearBuilt"
                      name="yearBuilt"
                      value={formData.yearBuilt}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: 2015"
                    />
                  </div>

                  <div>
                    <label htmlFor="approximateUnits" className="block text-sm font-medium text-gray-700 mb-2">
                      Número aproximado de unidades
                    </label>
                    <input
                      type="text"
                      id="approximateUnits"
                      name="approximateUnits"
                      value={formData.approximateUnits}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: 150"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasParking"
                      name="hasParking"
                      checked={formData.hasParking}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hasParking" className="ml-3 text-sm font-medium text-gray-700">
                      Tiene estacionamiento
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasAmenities"
                      name="hasAmenities"
                      checked={formData.hasAmenities}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="hasAmenities" className="ml-3 text-sm font-medium text-gray-700">
                      Tiene amenidades (piscina, gimnasio, etc.)
                    </label>
                  </div>

                  {formData.hasAmenities && (
                    <div>
                      <label htmlFor="amenitiesList" className="block text-sm font-medium text-gray-700 mb-2">
                        ¿Qué amenidades tiene?
                      </label>
                      <input
                        type="text"
                        id="amenitiesList"
                        name="amenitiesList"
                        value={formData.amenitiesList}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Piscina, gimnasio, sala de reuniones, área de juegos"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Contact */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Información de Contacto</h2>
                  <p className="text-gray-600 mt-2">Para contactarte cuando agreguemos el edificio</p>
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
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ejemplo@email.com"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Te contactaremos cuando agreguemos el edificio
                  </p>
                </div>

                <div>
                  <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                    Comentarios adicionales (opcional)
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Cualquier información adicional que consideres útil..."
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStep === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                ← Anterior
              </button>

              <div className="text-sm text-gray-500">
                Paso {currentStep} de {steps.length}
              </div>

              {currentStep === steps.length ? (
                <button
                  type="submit"
                  disabled={!canProceed() || isSubmitting}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    canProceed() && !isSubmitting
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Sugerencia'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    canProceed()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Siguiente →
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 