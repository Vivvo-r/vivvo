'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Building } from '@/types'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function WriteReviewPage() {
  const params = useParams()
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const slug = params.slug as string
  
  const [building, setBuilding] = useState<Building | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  // Form state
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  
  // Detailed ratings
  const [detailedRatings, setDetailedRatings] = useState({
    building_condition: 0,
    security: 0,
    noise_level: 0,
    public_transport: 0,
    shopping_centers: 0,
    hospitals: 0,
    gym: 0,
    administration: 0,
    maintenance: 0,
    location: 0,
    apartment_quality: 0,
    amenities: 0
  })
  
  // Additional form fields
  const [reviewTitle, setReviewTitle] = useState('')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [livingDuration, setLivingDuration] = useState('')
  const [apartmentType, setApartmentType] = useState('')
  const [rentRange, setRentRange] = useState('')
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null)
  
  const [showDetailedRatings, setShowDetailedRatings] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`${ROUTES.login}?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    
    if (slug) {
      fetchBuilding()
    }
  }, [slug, user, authLoading, router])

  const fetchBuilding = async () => {
    try {
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        setError('Edificio no encontrado')
      } else {
        setBuilding(data)
      }
    } catch {
      setError('Error al cargar el edificio')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !building) return
    
    if (rating === 0) {
      setError('Por favor selecciona una calificación')
      return
    }
    
    if (comment.trim().length < 10) {
      setError('La reseña debe tener al menos 10 caracteres')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // Check if user already reviewed this building
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('building_id', building.id)
        .eq('user_id', user.id)
        .single()

      if (existingReview) {
        setError('Ya has escrito una reseña para este edificio')
        setSubmitting(false)
        return
      }

      // Insert new review - Start with basic fields first
      console.log('Attempting to insert review with data:', {
        building_id: building.id,
        user_id: user.id,
        rating,
        comment: comment.trim()
      })

      const { data: insertData, error: insertError } = await supabase
        .from('reviews')
        .insert({
          building_id: building.id,
          user_id: user.id,
          rating,
          comment: comment.trim()
        })
        .select()

      console.log('Insert result:', { data: insertData, error: insertError })

      if (insertError) {
        console.error('Insert error details:', insertError)
        setError(`Error al guardar la reseña: ${insertError.message}`)
      } else {
        console.log('Review saved successfully:', insertData)
        setSuccess(true)
        // Redirect to building page after 2 seconds
        setTimeout(() => {
          router.push(ROUTES.building(slug))
        }, 2000)
      }
    } catch {
      setError('Error al guardar la reseña')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = (currentRating: number, interactive: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < currentRating
      
      return (
        <button
          key={i}
          type="button"
          onClick={() => interactive && setRating(i + 1)}
          onMouseEnter={() => interactive && setHoverRating(i + 1)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          disabled={!interactive}
          className={`text-3xl transition-colors ${
            interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
          } ${
            filled ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </button>
      )
    })
  }

  const renderDetailedStars = (category: string, currentRating: number, hoverRating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < (hoverRating || currentRating)
      
      return (
        <button
          key={i}
          type="button"
          onClick={() => setDetailedRatings(prev => ({ ...prev, [category]: i + 1 }))}
          onMouseEnter={() => setHoverRating(i + 1)}
          onMouseLeave={() => setHoverRating(0)}
          className={`text-xl transition-colors hover:scale-110 cursor-pointer ${
            filled ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </button>
      )
    })
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (error && !building) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error}</h1>
          <Link
            href="/buildings"
            className="text-blue-600 hover:text-blue-500"
          >
            ← Volver a edificios
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Reseña enviada!</h1>
          <p className="text-gray-600 mb-4">
            Gracias por compartir tu experiencia. Te redirigiremos en un momento...
          </p>
          <Link
            href={ROUTES.building(slug)}
            className="text-blue-600 hover:text-blue-500"
          >
            Ver edificio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Page Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href={ROUTES.building(slug)}
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-2"
              >
                ← Volver al edificio
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Escribir reseña
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {building && (
          <div className="bg-white">
            {/* Building Info Card */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0h4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {building.name}
                  </h2>
                  <p className="text-gray-600">
                    📍 {building.corregimiento} • {building.address}
                  </p>
                  <p className="text-sm text-blue-700 mt-2">
                    ✨ Tu experiencia ayudará a otros a tomar mejores decisiones
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    rating > 0 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {rating > 0 ? '✓' : '1'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">Calificación</span>
                </div>
                <div className={`flex-1 h-1 rounded ${rating > 0 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    comment.trim().length >= 10 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {comment.trim().length >= 10 ? '✓' : '2'}
                  </div>
                  <span className="text-sm font-medium text-gray-700">Experiencia</span>
                </div>
              </div>
            </div>

            {/* Review Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Rating */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    ¿Cómo calificarías tu experiencia general?
                  </h3>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {renderStars(hoverRating || rating, true)}
                  </div>
                  <div className="text-lg font-medium text-gray-800 mb-2">
                    {rating === 0 && '👆 Selecciona tu calificación'}
                    {rating === 1 && '😞 Muy malo - No lo recomendaría'}
                    {rating === 2 && '😕 Malo - Tiene varios problemas'}
                    {rating === 3 && '😐 Regular - Cumple lo básico'}
                    {rating === 4 && '😊 Bueno - Lo recomendaría'}
                    {rating === 5 && '🤩 Excelente - ¡Perfecto para vivir!'}
                  </div>
                  
                  {rating > 0 && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      ¡Perfecto! Ahora cuéntanos más detalles
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Detailed Experience */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Comparte tu experiencia detallada
                  </h3>
                </div>

                {/* Quick Tips */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">💡 ¿Qué incluir en tu review?</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-800">
                    <div className="flex items-center space-x-2">
                      <span>🏢</span>
                      <span>Condición del edificio</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🔐</span>
                      <span>Seguridad y acceso</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🌊</span>
                      <span>Amenidades (piscina, gym)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🚗</span>
                      <span>Estacionamiento</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>👥</span>
                      <span>Administración</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🔧</span>
                      <span>Mantenimiento</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>📍</span>
                      <span>Ubicación y accesos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>🏠</span>
                      <span>Calidad del apartamento</span>
                    </div>
                  </div>
                </div>

                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
                  placeholder="Ejemplo: 'Viví 2 años en este edificio. La ubicación es excelente, cerca del metro y centros comerciales. La piscina siempre está limpia y el gimnasio tiene buen equipo. La administración es muy atenta y resuelve los problemas rápido. El único punto negativo es que a veces hay ruido del tráfico...'"
                />
                
                <div className="mt-3 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    {comment.length < 10 ? (
                      <span className="text-orange-600">
                        ⚠️ Mínimo 10 caracteres ({10 - comment.length} restantes)
                      </span>
                    ) : comment.length < 50 ? (
                      <span className="text-blue-600">
                        👍 ¡Buen inicio! Puedes agregar más detalles
                      </span>
                    ) : (
                      <span className="text-green-600">
                        ✨ ¡Excelente! Review muy completa
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    {comment.length} caracteres
                  </div>
                </div>
              </div>

              {/* Step 3: Detailed Ratings (Optional) */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">3</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Calificaciones Detalladas (Opcional)
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDetailedRatings(!showDetailedRatings)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {showDetailedRatings ? 'Ocultar' : 'Mostrar'} detalles
                  </button>
                </div>

                {showDetailedRatings && (
                  <div className="space-y-4">
                    <p className="text-gray-600 text-sm mb-6">
                      Ayuda a otros residentes calificando aspectos específicos del edificio
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Building & Physical */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">🏢 Edificio & Estructura</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Condición del edificio</span>
                            <div className="flex items-center space-x-1">
                              {renderDetailedStars('building_condition', detailedRatings.building_condition, 0)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Mantenimiento</span>
                            <div className="flex items-center space-x-1">
                              {renderDetailedStars('maintenance', detailedRatings.maintenance, 0)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Calidad del apartamento</span>
                            <div className="flex items-center space-x-1">
                              {renderDetailedStars('apartment_quality', detailedRatings.apartment_quality, 0)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Security & Services */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">🔐 Seguridad & Servicios</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Seguridad</span>
                            <div className="flex items-center space-x-1">
                              {renderDetailedStars('security', detailedRatings.security, 0)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Administración</span>
                            <div className="flex items-center space-x-1">
                              {renderDetailedStars('administration', detailedRatings.administration, 0)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Amenidades</span>
                            <div className="flex items-center space-x-1">
                              {renderDetailedStars('amenities', detailedRatings.amenities, 0)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Location & Environment */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">📍 Ubicación & Entorno</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Ubicación</span>
                            <div className="flex items-center space-x-1">
                              {renderDetailedStars('location', detailedRatings.location, 0)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Nivel de ruido</span>
                            <div className="flex items-center space-x-1">
                              {renderDetailedStars('noise_level', detailedRatings.noise_level, 0)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Transporte público</span>
                            <div className="flex items-center space-x-1">
                              {renderDetailedStars('public_transport', detailedRatings.public_transport, 0)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Nearby Services */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-4">🏪 Servicios Cercanos</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Centros comerciales</span>
                            <div className="flex items-center space-x-1">
                              {renderDetailedStars('shopping_centers', detailedRatings.shopping_centers, 0)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Hospitales</span>
                            <div className="flex items-center space-x-1">
                              {renderDetailedStars('hospitals', detailedRatings.hospitals, 0)}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Gimnasios</span>
                            <div className="flex items-center space-x-1">
                              {renderDetailedStars('gym', detailedRatings.gym, 0)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 4: Additional Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">4</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Información Adicional (Opcional)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título de tu review
                    </label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Ej: Excelente ubicación, pero ruidoso"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ¿Cuánto tiempo viviste allí?
                    </label>
                    <select
                      value={livingDuration}
                      onChange={(e) => setLivingDuration(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="3">Menos de 6 meses</option>
                      <option value="6">6 meses a 1 año</option>
                      <option value="12">1 a 2 años</option>
                      <option value="24">2 a 3 años</option>
                      <option value="36">Más de 3 años</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de apartamento
                    </label>
                    <select
                      value={apartmentType}
                      onChange={(e) => setApartmentType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="studio">Studio</option>
                      <option value="1br">1 recámara</option>
                      <option value="2br">2 recámaras</option>
                      <option value="3br">3 recámaras</option>
                      <option value="penthouse">Penthouse</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rango de alquiler mensual
                    </label>
                    <select
                      value={rentRange}
                      onChange={(e) => setRentRange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="under_500">Menos de $500</option>
                      <option value="500_1000">$500 - $1,000</option>
                      <option value="1000_1500">$1,000 - $1,500</option>
                      <option value="1500_2000">$1,500 - $2,000</option>
                      <option value="2000_3000">$2,000 - $3,000</option>
                      <option value="over_3000">Más de $3,000</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aspectos positivos
                    </label>
                    <textarea
                      value={pros}
                      onChange={(e) => setPros(e.target.value)}
                      rows={3}
                      placeholder="Ej: Buena ubicación, amenidades completas, administración eficiente..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Aspectos negativos
                    </label>
                    <textarea
                      value={cons}
                      onChange={(e) => setCons(e.target.value)}
                      rows={3}
                      placeholder="Ej: Ruido del tráfico, estacionamiento limitado, elevadores lentos..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      ¿Recomendarías este edificio?
                    </label>
                    <div className="flex items-center space-x-6">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="recommend"
                          checked={wouldRecommend === true}
                          onChange={() => setWouldRecommend(true)}
                          className="text-blue-600"
                        />
                        <span className="text-sm text-gray-700">Sí, lo recomendaría</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="recommend"
                          checked={wouldRecommend === false}
                          onChange={() => setWouldRecommend(false)}
                          className="text-blue-600"
                        />
                        <span className="text-sm text-gray-700">No lo recomendaría</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-red-600 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Section */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    🎉 ¡Listo para publicar tu review!
                  </h4>
                  <p className="text-gray-600">
                    Tu experiencia ayudará a cientos de personas a tomar mejores decisiones
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    type="submit"
                    disabled={submitting || rating === 0 || comment.trim().length < 10}
                    className={`px-8 py-3 rounded-lg font-medium transition-all transform ${
                      submitting || rating === 0 || comment.trim().length < 10
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-lg'
                    }`}
                  >
                    {submitting ? (
                      <span className="flex items-center space-x-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Publicando...</span>
                      </span>
                    ) : (
                      '🚀 Publicar mi review'
                    )}
                  </button>
                  
                  <Link
                    href={ROUTES.building(slug)}
                    className="px-8 py-3 text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </Link>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
} 