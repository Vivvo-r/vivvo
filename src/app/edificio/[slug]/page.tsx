'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Building, Review } from '@/types'
import { ROUTES } from '@/lib/constants'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function BuildingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const slug = params.slug as string
  
  const [building, setBuilding] = useState<Building | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedReview, setExpandedReview] = useState<string | null>(null)

  useEffect(() => {
    fetchBuildingData()
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchBuildingData = async () => {
    try {
      // Fetch building data
      const { data: buildingData, error: buildingError } = await supabase
        .from('buildings')
        .select('*')
        .eq('slug', slug)
        .single()

      if (buildingError) {
        if (buildingError.code === 'PGRST116') {
          // Building not found
          setError('Edificio no encontrado')
        } else {
          setError(buildingError.message)
        }
        return
      }

      setBuilding(buildingData)

      // Fetch reviews for this building
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('building_id', buildingData.id)
        .order('created_at', { ascending: false })

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError)
        // Don't set error for reviews, just show empty state
      } else {
        setReviews(reviewsData || [])
      }



    } catch {
      setError('Error al cargar la información del edificio')
    } finally {
      setLoading(false)
    }
  }

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0
    const sum = reviews.reduce((acc, review) => acc + review.overall_rating, 0)
    return Math.round((sum / reviews.length) * 10) / 10
  }

  const renderStars = (rating: number, size: string = 'text-lg') => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`${size} ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ))
  }

  const renderDetailedRatings = (review: Review) => {
    const categories = [
      { key: 'rating_building_condition', label: 'Condición del edificio', icon: '🏢' },
      { key: 'rating_security', label: 'Seguridad', icon: '🔐' },
      { key: 'rating_noise_level', label: 'Nivel de ruido', icon: '🔇' },
      { key: 'rating_public_transport', label: 'Transporte público', icon: '🚌' },
      { key: 'rating_shopping_centers', label: 'Centros comerciales', icon: '🛒' },
      { key: 'rating_hospitals', label: 'Hospitales', icon: '🏥' },
      { key: 'rating_gym', label: 'Gimnasios', icon: '💪' },
      { key: 'rating_administration', label: 'Administración', icon: '👥' },
      { key: 'rating_maintenance', label: 'Mantenimiento', icon: '🔧' },
      { key: 'rating_location', label: 'Ubicación', icon: '📍' },
      { key: 'rating_apartment_quality', label: 'Calidad del apartamento', icon: '🏠' },
      { key: 'rating_amenities', label: 'Amenidades', icon: '🌊' }
    ]

    const ratingsWithValues = categories.filter(cat => {
      const value = review[cat.key as keyof Review] as number
      return value && value > 0
    })

    if (ratingsWithValues.length === 0) return null

    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-4">Calificaciones Detalladas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ratingsWithValues.map(category => {
            const rating = review[category.key as keyof Review] as number
            return (
              <div key={category.key} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{category.icon}</span>
                  <span className="text-sm text-gray-700">{category.label}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {renderStars(rating, 'text-sm')}
                  <span className="text-sm text-gray-600 ml-1">({rating})</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const getApartmentTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'studio': 'Studio',
      '1br': '1 recámara',
      '2br': '2 recámaras', 
      '3br': '3 recámaras',
      'penthouse': 'Penthouse'
    }
    return types[type] || type
  }

  const getRentRangeLabel = (range: string) => {
    const ranges: { [key: string]: string } = {
      'under_500': 'Menos de $500',
      '500_1000': '$500 - $1,000',
      '1000_1500': '$1,000 - $1,500',
      '1500_2000': '$1,500 - $2,000',
      '2000_3000': '$2,000 - $3,000',
      'over_3000': 'Más de $3,000'
    }
    return ranges[range] || range
  }

  const handleWriteReview = () => {
    if (user) {
      router.push(ROUTES.writeReview(slug))
    } else {
      router.push(`${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.writeReview(slug))}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando edificio...</p>
        </div>
      </div>
    )
  }

  if (error || !building) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Edificio no encontrado'}
          </h1>
          <Link
            href={ROUTES.home}
            className="text-blue-600 hover:text-blue-500"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  const averageRating = calculateAverageRating()

  return (
    <div className="min-h-screen bg-gray-50 pixel-background">
      <Header />
      
      {/* Breadcrumb */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href="/buildings"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Edificios
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Building Header */}
        <div className="py-8 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {building.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                {reviews.length > 0 && (
                  <>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold text-gray-900">
                        {averageRating}
                      </span>
                    </div>
                    <span className="text-gray-600">·</span>
                    <span className="font-medium text-gray-900 underline">
                      {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                    </span>
                    <span className="text-gray-600">·</span>
                  </>
                )}
                <span className="text-gray-700">{building.neighborhood}, Panamá</span>
              </div>
              
              <p className="text-gray-600">
                {building.address}
              </p>
            </div>
          </div>
        </div>

        {/* Images and Rating Section */}
        <div className="py-6 border-b border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Images Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Main Image */}
              <div className="aspect-[3/2] rounded-lg overflow-hidden">
                {building.main_photo || (building.photos && building.photos.length > 0) ? (
                  <>
                    <img 
                      src={building.main_photo || building.photos![0]} 
                      alt={`${building.name} - Vista Principal`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling!.classList.remove('hidden');
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
                      <div className="text-center text-white">
                        <svg className="w-12 h-12 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0h4" />
                        </svg>
                        <p className="text-sm font-medium">Vista Principal</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <svg className="w-12 h-12 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0h4" />
                      </svg>
                      <p className="text-sm font-medium">Vista Principal</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Secondary Images - Scrollable */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {building.photos && building.photos.length > 0 ? (
                  building.photos.slice(1).map((photo, i) => (
                    <div key={i} className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden">
                      <>
                        <img 
                          src={photo} 
                          alt={`${building.name} - Foto ${i + 2}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling!.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden w-full h-full bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 flex items-center justify-center">
                          <div className="text-center text-white">
                            <svg className="w-6 h-6 mx-auto mb-1 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-xs">Foto {i + 2}</p>
                          </div>
                        </div>
                      </>
                    </div>
                  ))
                ) : (
                  // Fallback placeholder images when no photos are available
                  [1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 flex items-center justify-center">
                      <div className="text-center text-white">
                        <svg className="w-6 h-6 mx-auto mb-1 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs">Foto {i + 1}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Rating Summary Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Reviews Summary Card */}
                {reviews.length > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        {averageRating}
                      </div>
                      <div className="flex items-center justify-center mb-3">
                        {renderStars(Math.round(averageRating))}
                      </div>
                      <div className="text-lg font-semibold text-gray-800 mb-1">
                        Calificación General
                      </div>
                      <div className="text-sm text-gray-600">
                        Basado en {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                      </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-3 mb-6">
                      <h4 className="font-medium text-gray-900 mb-3">Distribución de calificaciones</h4>
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter(r => r.overall_rating === star).length
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                        
                        return (
                          <div key={star} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-12">
                              <span className="text-sm text-gray-700 font-medium">{star}</span>
                              <span className="text-yellow-400 text-sm">★</span>
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="w-12 text-right">
                              <span className="text-sm text-gray-600 font-medium">
                                {count}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <button
                        onClick={handleWriteReview}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          <span>Escribir mi Review</span>
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Empty State for Sidebar */
                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        ¡Sin reviews todavía!
                      </h3>
                      <p className="text-gray-600 mb-6 text-sm">
                        Sé el primero en compartir tu experiencia viviendo aquí
                      </p>
                      <button
                        onClick={handleWriteReview}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span>Escribir primera Review</span>
                        </span>
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Quick Actions Card */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6 mt-6">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Acciones Rápidas
                  </h4>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">Compartir edificio</div>
                          <div className="text-xs text-gray-500">Envía este edificio a amigos</div>
                        </div>
                      </div>
                    </button>
                    
                    <Link href={ROUTES.suggestBuilding} className="block w-full">
                      <div className="p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors group">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 group-hover:bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-600 group-hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">¿Falta un edificio?</div>
                            <div className="text-xs text-gray-500">Sugiere uno nuevo</div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="py-8">
          <div className="space-y-8">


            {/* Building Info */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Acerca de este edificio
              </h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  {building.description || `Ubicado en el corazón de ${building.neighborhood}, ${building.name} ofrece apartamentos modernos con excelentes amenidades y una ubicación privilegiada.`}
                </p>
                
                {/* Building Details */}
                <div className="bg-gray-50 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Información General</h4>
                    <div className="space-y-3">
                      {building.year_built && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Construido en {building.year_built}</span>
                        </div>
                      )}
                      {building.developer && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0h4" />
                          </svg>
                          <span>Desarrollado por {building.developer}</span>
                        </div>
                      )}
                      {building.floors && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 16a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
                          </svg>
                          <span>{building.floors} pisos</span>
                        </div>
                      )}
                      {building.apartments_count && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
                          </svg>
                          <span>{building.apartments_count} apartamentos</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{building.neighborhood}, {building.corregimiento}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Amenidades</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {building.parking && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Estacionamiento</span>
                        </div>
                      )}
                      {building.pool && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Piscina</span>
                        </div>
                      )}
                      {building.gym && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Gimnasio</span>
                        </div>
                      )}
                      {building.security_24_7 && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Seguridad 24/7</span>
                        </div>
                      )}
                      {building.elevator && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Ascensor</span>
                        </div>
                      )}
                      {building.balcony && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Balcón</span>
                        </div>
                      )}
                      {building.playground && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Área de Juegos</span>
                        </div>
                      )}
                      {building.social_area && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Área Social</span>
                        </div>
                      )}
                      {building.concierge && (
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Conserjería</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Reviews de inquilinos
                </h2>
                <button
                  onClick={handleWriteReview}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Escribir review
                </button>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay reviews todavía
                  </h3>
                  <p className="text-gray-600 mb-4">
                    ¡Sé el primero en compartir tu experiencia!
                  </p>
                  <button
                    onClick={handleWriteReview}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Escribir la primera review
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review, index) => {
                    const isBlurred = !user && index > 0; // Show only first review if not logged in
                    
                    return (
                      <div key={review.id} className="pb-6 border-b border-gray-200 last:border-b-0">
                        <div className={`flex items-start space-x-4 ${isBlurred ? 'relative' : ''}`}>
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                            U{review.id.slice(-1)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">
                                Usuario #{review.id.slice(-4)}
                              </h4>
                              <span className="text-gray-400">·</span>
                              <span className="text-sm text-gray-500">
                                {new Date(review.created_at || '').toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            
                            <div className="flex items-center mb-3">
                              {renderStars(review.overall_rating)}
                            </div>
                            
                            {/* Título del review si existe */}
                            {review.review_title && (
                              <h5 className="font-medium text-gray-900 mb-2">{review.review_title}</h5>
                            )}
                            
                            <p className={`text-gray-700 leading-relaxed ${isBlurred ? 'filter blur-sm' : ''}`}>
                              {review.comment}
                            </p>
                            
                            {/* Información adicional básica */}
                            <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-600">
                              {review.apartment_type && (
                                <span className="bg-gray-100 px-2 py-1 rounded-full">
                                  {getApartmentTypeLabel(review.apartment_type)}
                                </span>
                              )}
                              {review.monthly_rent_range && (
                                <span className="bg-gray-100 px-2 py-1 rounded-full">
                                  {getRentRangeLabel(review.monthly_rent_range)}
                                </span>
                              )}
                              {review.living_duration_months && (
                                <span className="bg-gray-100 px-2 py-1 rounded-full">
                                  Vivió {review.living_duration_months} meses
                                </span>
                              )}
                            </div>
                            
                            {/* Botón para expandir/contraer */}
                            <div className="mt-4 flex items-center justify-between">
                              <button
                                onClick={() => setExpandedReview(expandedReview === review.id ? null : review.id)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                              >
                                {expandedReview === review.id ? (
                                  <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                    </svg>
                                    Ver menos
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    Ver detalles completos
                                  </>
                                )}
                              </button>
                              
                              {review.would_recommend !== undefined && (
                                <span className={`text-sm px-3 py-1 rounded-full ${
                                  review.would_recommend 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {review.would_recommend ? '✓ Recomendado' : '✗ No recomendado'}
                                </span>
                              )}
                            </div>
                            
                            {/* Contenido expandido */}
                            {expandedReview === review.id && (
                              <div className="mt-6 border-t pt-6">
                                {/* Pros y Contras */}
                                {(review.pros || review.cons) && (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {review.pros && (
                                      <div>
                                        <h5 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Lo mejor
                                        </h5>
                                        <p className="text-sm text-gray-700 leading-relaxed">{review.pros}</p>
                                      </div>
                                    )}
                                    {review.cons && (
                                      <div>
                                        <h5 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Lo peor
                                        </h5>
                                        <p className="text-sm text-gray-700 leading-relaxed">{review.cons}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {/* Calificaciones detalladas */}
                                {renderDetailedRatings(review)}
                                
                                {/* Información adicional */}
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                  <h5 className="font-medium text-gray-900 mb-3">Información adicional</h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                    {review.apartment_type && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-gray-500">Tipo de apartamento:</span>
                                        <span className="font-medium">{getApartmentTypeLabel(review.apartment_type)}</span>
                                      </div>
                                    )}
                                    {review.monthly_rent_range && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-gray-500">Rango de alquiler:</span>
                                        <span className="font-medium">{getRentRangeLabel(review.monthly_rent_range)}</span>
                                      </div>
                                    )}
                                    {review.living_duration_months && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-gray-500">Tiempo vivido:</span>
                                        <span className="font-medium">{review.living_duration_months} meses</span>
                                      </div>
                                    )}
                                    {review.would_recommend !== undefined && (
                                      <div className="flex items-center gap-2">
                                        <span className="text-gray-500">¿Lo recomendaría?</span>
                                        <span className={`font-medium ${review.would_recommend ? 'text-green-600' : 'text-red-600'}`}>
                                          {review.would_recommend ? 'Sí' : 'No'}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Blur overlay for non-logged users */}
                          {isBlurred && (
                            <div className="absolute inset-0 bg-white/70 rounded-lg flex items-center justify-center">
                              <div className="text-center bg-white p-6 rounded-lg shadow-lg border border-gray-200 max-w-sm">
                                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                  </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                  Ver todas las reviews
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                  Crea tu cuenta gratis para leer todas las reviews detalladas
                                </p>
                                <Link
                                  href={`${ROUTES.signup}?redirect=${encodeURIComponent(window.location.pathname)}`}
                                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                >
                                  Registrarse gratis
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  
                  {/* Additional message for non-logged users */}
                  {!user && reviews.length > 1 && (
                    <div className="text-center pt-8 border-t border-gray-200">
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          ¿Quieres leer {reviews.length - 1} reviews más?
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Únete a nuestra comunidad gratuita y accede a todas las reviews
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Link
                            href={`${ROUTES.signup}?redirect=${encodeURIComponent(window.location.pathname)}`}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                          >
                            Registrarse gratis
                          </Link>
                          <Link
                            href={`${ROUTES.login}?redirect=${encodeURIComponent(window.location.pathname)}`}
                            className="text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          >
                            Iniciar sesión
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
} 