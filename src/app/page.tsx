'use client'

import { ROUTES } from '@/lib/constants'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Building } from '@/types'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [heroAnimation, setHeroAnimation] = useState(false)
  const [suggestions, setSuggestions] = useState<Building[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    totalBuildings: 0,
    totalReviews: 0,
    avgRating: 0,
    neighborhoods: 0
  })
  const [topNeighborhoods, setTopNeighborhoods] = useState<Array<{
    name: string
    buildings: number
    rating: number
  }>>([])
  const [currentBuildingIndex, setCurrentBuildingIndex] = useState(0)
  const router = useRouter()

  // Building names for dynamic hero
  const featuredBuildings = [
    'Torre del Mar',
    'Ocean One', 
    'Sortis Hotel',
    'Marina Park',
    'Ocean Sky',
    'Pacific Bay',
    'Grand Bay Tower'
  ]

  useEffect(() => {
    setHeroAnimation(true)
    fetchStats()

    // Rotate building names every 1.5 seconds
    const interval = setInterval(() => {
      setCurrentBuildingIndex((prev) => (prev + 1) % featuredBuildings.length)
    }, 1500)

    return () => clearInterval(interval)
  }, [featuredBuildings.length])

  const fetchStats = async () => {
    try {
      // Get buildings count
      const { count: buildingsCount } = await supabase
        .from('buildings')
        .select('*', { count: 'exact', head: true })

      // Get reviews count
      const { count: reviewsCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })

      // Get average rating
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('overall_rating')
        .not('overall_rating', 'is', null)

      const avgRating = reviewsData && reviewsData.length > 0 
        ? reviewsData.reduce((sum, review) => sum + (review.overall_rating || 0), 0) / reviewsData.length
        : 0

      // Get unique neighborhoods count
      const { data: buildingsData } = await supabase
        .from('buildings')
        .select('corregimiento')
        .not('corregimiento', 'is', null)

      const uniqueNeighborhoods = new Set(buildingsData?.map(b => b.corregimiento) || []).size

      // Get neighborhoods with building counts and ratings
      const { data: neighborhoodsWithBuildings } = await supabase
        .from('buildings')
        .select(`
          corregimiento,
          id,
          reviews:reviews(overall_rating)
        `)

      // Process neighborhoods data
      const neighborhoodStats = (neighborhoodsWithBuildings || []).reduce((acc: Record<string, {buildings: number, ratings: number[]}>, building) => {
        if (!acc[building.corregimiento]) {
          acc[building.corregimiento] = { buildings: 0, ratings: [] }
        }
        acc[building.corregimiento].buildings++
        
        // Add all ratings for this building
        const buildingRatings = building.reviews || []
        buildingRatings.forEach((review: { overall_rating?: number }) => {
          if (review.overall_rating) {
            acc[building.corregimiento].ratings.push(review.overall_rating)
          }
        })
        
        return acc
      }, {})

      // Convert to array and calculate averages
      const topNeighborhoodsData = Object.entries(neighborhoodStats)
        .map(([name, data]) => ({
          name,
          buildings: data.buildings,
          rating: data.ratings.length > 0 
            ? Math.round((data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length) * 10) / 10
            : 0
        }))
        .filter(n => n.buildings > 0) // Only show neighborhoods with buildings
        .sort((a, b) => b.buildings - a.buildings) // Sort by building count
        .slice(0, 8) // Top 8

      setStats({
        totalBuildings: buildingsCount || 0,
        totalReviews: reviewsCount || 0,
        avgRating: Math.round(avgRating * 10) / 10,
        neighborhoods: uniqueNeighborhoods
      })
      
      setTopNeighborhoods(topNeighborhoodsData)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/buildings?search=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      router.push('/buildings')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const fetchSuggestions = async (term: string) => {
    if (!term.trim() || term.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .or(`name.ilike.%${term}%,corregimiento.ilike.%${term}%`)
        .limit(5)

      if (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
      } else {
        setSuggestions(data || [])
        setShowSuggestions(true)
      }
    } catch (err) {
      console.error('Error:', err)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // Debounce the search
    const timeoutId = setTimeout(() => {
      fetchSuggestions(value)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  const handleSuggestionClick = (building: Building) => {
    setSearchTerm(building.name)
    setShowSuggestions(false)
    router.push(ROUTES.building(building.slug))
  }

  const handleSearchNotFound = () => {
    setShowSuggestions(false)
    router.push(`${ROUTES.suggestBuilding}?building=${encodeURIComponent(searchTerm)}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Focused on immediate value */}
      <div className="relative bg-gray-50 overflow-hidden">
        {/* Pixel background pattern */}
        <div className="absolute inset-0 opacity-[0.03] pixel-background"></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-white/80 to-purple-50/70"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            {/* Immediate value proposition */}
            <div className={`inline-flex items-center px-4 py-2 bg-green-100 border border-green-200 rounded-full text-green-700 text-sm font-medium mb-8 shadow-sm transition-all duration-700 ${heroAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {stats.totalReviews > 0 ? `${stats.totalReviews}+ reseñas reales` : 'Reseñas 100% reales'}
            </div>

            <h1 className={`text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight transition-all duration-700 delay-200 ${heroAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              ¿Vale la pena vivir en
              <span className="block text-blue-600 transition-all duration-500 ease-in-out">
                {featuredBuildings[currentBuildingIndex]}?
              </span>
            </h1>
            
            <p className={`text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-400 ${heroAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Conoce la <strong>experiencia real</strong> de quienes viven ahí. 
              <br className="hidden md:block" />
              Sin filtros. Sin marketing. Solo la verdad.
            </p>

            {/* Quick demo with actual building examples */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto transition-all duration-700 delay-600 ${heroAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold text-sm">A</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Torre del Mar</div>
                    <div className="flex text-yellow-400 text-xs">★★★★★</div>
                  </div>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed">"Excelente seguridad y amenidades. La administración responde rápido."</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold text-sm">M</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Ocean One</div>
                    <div className="flex text-yellow-400 text-xs">★★★★☆</div>
                  </div>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed">"Hermosa vista pero el ascensor falla seguido. Ubicación perfecta."</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold text-sm">C</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Sortis Hotel</div>
                    <div className="flex text-yellow-400 text-xs">★★★☆☆</div>
                  </div>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed">"Amenidades increíbles pero muy caro el mantenimiento mensual."</p>
              </div>
            </div>

            {/* Visual indicator for dynamic text */}
            <div className={`text-center mb-8 transition-all duration-700 delay-650 ${heroAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex justify-center items-center gap-2">
                {featuredBuildings.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentBuildingIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">Cualquier edificio en Panamá</p>
            </div>

            {/* Clear call to action */}
            <div className={`mb-12 transition-all duration-700 delay-700 ${heroAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Busca cualquier edificio en Panamá
              </h2>
              <p className="text-gray-600 mb-8">
                Más de {stats.totalBuildings || '50'} edificios evaluados • {stats.neighborhoods || '20'} corregimientos cubiertos
              </p>
            </div>
            
            {/* Clean Search Bar */}
            <div className={`max-w-2xl mx-auto mb-8 transition-all duration-700 delay-800 ${heroAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <form onSubmit={handleSearch} className="relative">
                <div className="bg-white border-2 border-blue-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
                  <div className="flex items-center">
                    <div className="flex items-center px-6">
                      <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      placeholder="Busca tu edificio aquí..."
                      className="flex-1 py-5 px-2 text-lg text-gray-900 bg-transparent focus:outline-none placeholder-gray-500"
                      autoComplete="off"
                    />
                    <button
                      type="submit"
                      className="m-2 px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Ver Reseñas
                    </button>
                  </div>
                </div>
                
                {/* Autocomplete Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-[100] max-h-64 overflow-y-auto backdrop-blur-sm">
                    {loading ? (
                      <div className="px-4 py-3 text-center text-gray-500">
                        <div className="animate-spin inline-block w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full mr-2"></div>
                        Buscando...
                      </div>
                    ) : suggestions.length > 0 ? (
                      <>
                        {suggestions.map((building) => (
                          <button
                            key={building.id}
                            onClick={() => handleSuggestionClick(building)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0h4" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{building.name}</div>
                              <div className="text-sm text-gray-500">{building.corregimiento}</div>
                            </div>
                            <div className="text-xs text-gray-400">
                              Ver reseñas
                            </div>
                          </button>
                        ))}
                        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                          <button
                            onClick={handleSearchNotFound}
                            className="w-full text-left text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            ¿No encuentras tu edificio? Sugerirlo aquí
                          </button>
                        </div>
                      </>
                    ) : searchTerm.length >= 2 ? (
                      <div className="px-4 py-4 text-center">
                        <div className="w-10 h-10 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-600 mb-2 text-sm">No encontramos &ldquo;<span className="font-medium">{searchTerm}</span>&rdquo;</p>
                        <button
                          onClick={handleSearchNotFound}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Sugerir este edificio
                        </button>
                      </div>
                    ) : null}
                  </div>
                )}
              </form>
            </div>

            {/* Popular building suggestions - hide when search suggestions are active */}
            {!showSuggestions && (
              <div className={`max-w-4xl mx-auto transition-all duration-300 ${heroAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="text-sm text-gray-500 mb-4">Edificios populares:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Torre del Mar', 'Ocean One', 'Sortis Hotel', 'Ph Marina Park', 'Ocean Sky'].map((building) => (
                    <button
                      key={building}
                      onClick={() => {
                        setSearchTerm(building)
                        router.push(`/buildings?search=${encodeURIComponent(building)}`)
                      }}
                      className="px-4 py-2 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 text-gray-700 rounded-full text-sm font-medium transition-colors duration-200"
                    >
                      {building}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Simple value proposition */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            ¿Cómo funciona Vivvo?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">1. Busca</h3>
              <p className="text-gray-600">Cualquier edificio en Panamá</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">2. Lee</h3>
              <p className="text-gray-600">Reseñas 100% reales de inquilinos</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">3. Decide</h3>
              <p className="text-gray-600">Con información honesta y confiable</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Reviews - Enhanced */}
      <div className="bg-white py-20 relative">
        <div className="absolute inset-0 opacity-[0.02] pixel-pattern"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-gray-600">
              Reseñas reales de personas que han encontrado su hogar ideal
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium mr-4">
                  A
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Torre del Mar</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(5)}
                    </div>
                    <span className="ml-2 text-sm text-gray-500 font-medium">5.0</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                &ldquo;Excelente ubicación y edificio muy bien mantenido. La seguridad es de primera y las amenidades están siempre limpias. Lo recomiendo 100%.&rdquo;
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-600 font-medium">Costa del Este</span>
                <span className="text-gray-500">hace 2 horas</span>
              </div>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium mr-4">
                  M
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Sortis Hotel</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(4)}{'☆'.repeat(1)}
                    </div>
                    <span className="ml-2 text-sm text-gray-500 font-medium">4.2</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                &ldquo;Muy buen edificio, pero la administración podría mejorar. Las amenidades son increíbles y la vista es espectacular.&rdquo;
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-600 font-medium">Punta Pacífica</span>
                <span className="text-gray-500">hace 1 día</span>
              </div>
            </div>
            
            <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium mr-4">
                  C
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Ocean View</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(5)}
                    </div>
                    <span className="ml-2 text-sm text-gray-500 font-medium">4.8</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                &ldquo;Perfecto para jóvenes profesionales. La ubicación es inmejorable y el edificio tiene todo lo que necesitas para vivir cómodo.&rdquo;
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-600 font-medium">San Francisco</span>
                <span className="text-gray-500">hace 3 días</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/buildings"
              className="inline-flex items-center px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Explorar Todas las Reseñas
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Neighborhoods */}
      <div className="py-20 bg-white border-t border-gray-100 pixel-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Zonas Más Buscadas
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cada zona de Panamá tiene su personalidad. Descubre qué las hace especiales según quienes viven ahí.
            </p>
          </div>

          {/* Clean neighborhood cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                name: 'Costa del Este',
                buildings: topNeighborhoods.find(n => n.name === 'Costa del Este')?.buildings || 12,
                rating: topNeighborhoods.find(n => n.name === 'Costa del Este')?.rating || 4.2
              },
              {
                name: 'San Francisco',
                buildings: topNeighborhoods.find(n => n.name === 'San Francisco')?.buildings || 15,
                rating: topNeighborhoods.find(n => n.name === 'San Francisco')?.rating || 4.1
              },
              {
                name: 'Punta Pacífica',
                buildings: topNeighborhoods.find(n => n.name === 'Punta Pacífica')?.buildings || 8,
                rating: topNeighborhoods.find(n => n.name === 'Punta Pacífica')?.rating || 4.5
              },
              {
                name: 'Bella Vista',
                buildings: topNeighborhoods.find(n => n.name === 'Bella Vista')?.buildings || 10,
                rating: topNeighborhoods.find(n => n.name === 'Bella Vista')?.rating || 3.8
              },
              {
                name: 'El Cangrejo',
                buildings: topNeighborhoods.find(n => n.name === 'El Cangrejo')?.buildings || 7,
                rating: topNeighborhoods.find(n => n.name === 'El Cangrejo')?.rating || 4.0
              },
              {
                name: 'Obarrio',
                buildings: topNeighborhoods.find(n => n.name === 'Obarrio')?.buildings || 6,
                rating: topNeighborhoods.find(n => n.name === 'Obarrio')?.rating || 3.9
              },
              {
                name: 'Coco del Mar',
                buildings: topNeighborhoods.find(n => n.name === 'Coco del Mar')?.buildings || 4,
                rating: topNeighborhoods.find(n => n.name === 'Coco del Mar')?.rating || 4.1
              },
              {
                name: 'Marbella',
                buildings: topNeighborhoods.find(n => n.name === 'Marbella')?.buildings || 5,
                rating: topNeighborhoods.find(n => n.name === 'Marbella')?.rating || 3.9
              }
            ].map((zone) => (
              <div 
                key={zone.name}
                onClick={() => router.push(`/buildings?corregimiento=${encodeURIComponent(zone.name)}`)}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1 group"
              >
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {zone.name}
                </h3>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{zone.buildings} {zone.buildings === 1 ? 'edificio' : 'edificios'}</span>
                  {zone.rating > 0 ? (
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1">{zone.rating}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">Sin reseñas</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Call to action */}
          <div className="text-center mt-12">
            <Link
              href="/buildings"
              className="inline-flex items-center px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Explorar Todas las Zonas
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-20 relative">
        <div className="absolute inset-0 opacity-[0.03] pixel-pattern"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-light text-white mb-6">
            ¿Tienes una experiencia que compartir?
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed font-light">
            Ayuda a otros panameños a encontrar su hogar ideal. Comparte tu experiencia viviendo en tu edificio actual o anterior.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={ROUTES.suggestBuilding}
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0h4" />
              </svg>
              Sugerir Edificio
            </Link>
            <a 
              href="mailto:info.vivvo@gmail.com?subject=Feedback para Vivvo&body=Hola equipo Vivvo,%0A%0ATengo el siguiente feedback:%0A%0A"
              className="inline-flex items-center px-8 py-4 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-800 hover:border-gray-500 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m-7 8l4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4v-4z" />
              </svg>
              Enviar Feedback
            </a>
          </div>
          
          {/* Beta badge */}
          <div className="mt-12 inline-flex items-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-gray-400 text-sm font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Plataforma en Beta • Mejorando constantemente con tu feedback
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}