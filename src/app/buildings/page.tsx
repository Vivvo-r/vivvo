'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Building } from '@/types'
import { ROUTES } from '@/lib/constants'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

function BuildingsContent() {
  const searchParams = useSearchParams()
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredBuildings, setFilteredBuildings] = useState<Building[]>([])
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        console.log('Starting to fetch buildings...')
        
        const { data, error } = await supabase
          .from('buildings')
          .select('*')
          .order('name')

        console.log('Supabase response:', { data, error })

        if (error) {
          console.error('Supabase error:', error)
          // If it's a network/DNS error, show a more helpful message
          if (error.message.includes('fetch failed') || error.message.includes('Could not resolve host')) {
            setError('Problema de conectividad con la base de datos. Esto puede ser temporal - por favor intenta más tarde.')
          } else {
            setError(error.message)
          }
          setLoading(false)
          return
        }

        console.log('Buildings loaded successfully:', data?.length || 0)
        setBuildings(data || [])
        setLoading(false)

      } catch (err) {
        console.error('Network error:', err)
        // Enhanced error handling for network issues
        if (err instanceof Error) {
          if (err.message.includes('fetch failed') || err.message.includes('ENOTFOUND')) {
            setError('No se puede conectar a la base de datos. Verifica tu conexión a internet o intenta más tarde.')
          } else {
            setError(`Error de conexión: ${err.message}`)
          }
        } else {
          setError('Error de conexión desconocido. Por favor intenta de nuevo.')
        }
        setLoading(false)
      }
    }

    fetchBuildings()
  }, [])

  // Handle filtering based on URL params
  useEffect(() => {
    const neighborhoodParam = searchParams.get('neighborhood')
    const searchParam = searchParams.get('search')
    
    let filtered = buildings
    
    if (searchParam) {
      filtered = filtered.filter(building =>
        building.name.toLowerCase().includes(searchParam.toLowerCase()) ||
        building.corregimiento.toLowerCase().includes(searchParam.toLowerCase()) ||
        building.address.toLowerCase().includes(searchParam.toLowerCase())
      )
    }
    
    if (neighborhoodParam) {
      filtered = filtered.filter(building =>
        building.corregimiento.toLowerCase() === neighborhoodParam.toLowerCase()
      )
      setActiveFilter(neighborhoodParam)
    } else {
      setActiveFilter(null)
    }
    
    setFilteredBuildings(filtered)
  }, [buildings, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando edificios...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="mb-4">
              <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error de Conexión</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-yellow-800">
                  <strong>Posibles causas:</strong> Problema temporal del servidor, conexión a internet, o mantenimiento de la base de datos.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Intentar de nuevo
              </button>
              <a
                href="mailto:info.vivvo@gmail.com?subject=Problema de conexión en Vivvo"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reportar problema
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Page Header */}
      <div className="bg-gray-50 border-b border-gray-100 pixel-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4 drop-shadow-sm">
              Todos los Edificios
            </h1>
            <p className="text-xl text-gray-600 font-light">
              {filteredBuildings.length || buildings.length} edificios disponibles
              {activeFilter && (
                <span className="block mt-2 text-base">
                  Mostrando resultados para: <span className="font-medium text-gray-900">{activeFilter}</span>
                  <Link 
                    href="/buildings" 
                    className="ml-2 text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Ver todos
                  </Link>
                </span>
              )}
              {!activeFilter && (
                <>• Reseñas verificadas • Información actualizada</>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="absolute inset-0 opacity-[0.02] pixel-pattern"></div>
        <div className="relative">
        {(filteredBuildings.length === 0 && buildings.length > 0) ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              No se encontraron edificios
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {activeFilter 
                ? `No hay edificios disponibles en ${activeFilter}. Intenta con otra ubicación.`
                : 'No se encontraron edificios que coincidan con tu búsqueda.'
              }
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/buildings"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Ver todos los edificios
              </Link>
              <Link
                href={ROUTES.suggestBuilding}
                className="inline-flex items-center px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Sugerir Edificio
              </Link>
            </div>
          </div>
        ) : (filteredBuildings.length === 0 && buildings.length === 0) ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0h4" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              No hay edificios disponibles
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Estamos trabajando para agregar edificios a nuestra plataforma. ¡Vuelve pronto para ver las nuevas opciones!
            </p>
            <Link
              href={ROUTES.suggestBuilding}
              className="inline-flex items-center px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Sugerir Edificio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {(filteredBuildings.length > 0 ? filteredBuildings : buildings).map((building) => {
              // Use real data from database or show N/A
              const rating = building.average_rating || 0
              const reviewCount = building.total_reviews || 0
              
              return (
                <div key={building.id} className="group">
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {/* Building Image */}
                      {building.main_photo || (building.photos && building.photos.length > 0) ? (
                        <>
                          <img 
                            src={building.main_photo || building.photos![0]} 
                            alt={building.name}
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling!.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden absolute inset-0 bg-gray-100 flex items-center justify-center">
                            <div className="text-center text-gray-600">
                              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0h4" />
                              </svg>
                              <p className="text-sm font-medium">{building.name}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                          <div className="text-center text-gray-600">
                            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0h4" />
                            </svg>
                            <p className="text-sm font-medium">{building.name}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Rating Badge */}
                      {rating > 0 ? (
                        <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-lg px-3 py-1 flex items-center gap-1 shadow-sm">
                          <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-900">{rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-lg px-3 py-1 flex items-center gap-1 shadow-sm">
                          <span className="text-sm font-medium text-gray-500">Sin reseñas</span>
                        </div>
                      )}
                    </div>
                    
                    <Link href={ROUTES.building(building.slug)} className="block p-6">
                      <div className="mb-4">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-700 transition-colors mb-2">
                          {building.name}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-500 mb-3">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-sm">{building.corregimiento}</span>
                        </div>
                      </div>
                      
                      {/* Amenities */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {building.pool && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">Piscina</span>
                        )}
                        {building.gym && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">Gym</span>
                        )}
                        {building.security_24_7 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">Seguridad 24/7</span>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>{reviewCount > 0 ? `${reviewCount} reseña${reviewCount > 1 ? 's' : ''}` : 'Sin reseñas'}</span>
                        </div>
                        <div className="text-right">
                          {building.year_built && (
                            <div className="text-sm text-gray-500 mb-1">
                              Año: {building.year_built}
                            </div>
                          )}
                          {building.apartments_count && (
                            <div className="text-sm font-medium text-gray-900">
                              {building.apartments_count} apartamentos
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20">
          <div className="bg-gray-900 rounded-xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04] pixel-pattern"></div>
            <div className="relative max-w-2xl mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 bg-gray-800 rounded-lg flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-light mb-4 drop-shadow-sm">
                ¿No encuentras tu edificio?
              </h3>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed font-light">
                Ayúdanos a hacer crecer nuestra comunidad. Comparte información sobre tu edificio y sé el primero en reseñarlo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href={ROUTES.suggestBuilding}
                  className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Sugerir Edificio
                </Link>
                <a 
                  href="mailto:info.vivvo@gmail.com?subject=Información sobre edificio"
                  className="inline-flex items-center px-8 py-4 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 hover:border-gray-500 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contactar por Email
                </a>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default function BuildingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando edificios...</p>
        </div>
      </div>
    }>
      <BuildingsContent />
    </Suspense>
  )
}