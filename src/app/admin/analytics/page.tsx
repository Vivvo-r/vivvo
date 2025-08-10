'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '@/contexts/AdminContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface AnalyticsData {
  totalBuildings: number
  totalReviews: number
  totalSuggestions: number
  totalUsers: number
  avgRating: number
  ratingsDistribution: { rating: number; count: number }[]
  topRatedBuildings: { name: string; rating: number; reviews: number }[]
  reviewsByMonth: { month: string; count: number }[]
  corregimientoStats: { name: string; buildings: number; reviews: number }[]
  recentActivity: { type: string; description: string; date: string }[]
}

export default function AdminAnalyticsPage() {
  const { isAdmin, loading: authLoading } = useAdmin()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalBuildings: 0,
    totalReviews: 0,
    totalSuggestions: 0,
    totalUsers: 0,
    avgRating: 0,
    ratingsDistribution: [],
    topRatedBuildings: [],
    reviewsByMonth: [],
    corregimientoStats: [],
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/admin')
      return
    }

    if (isAdmin) {
      fetchAnalytics()
    }
  }, [isAdmin, authLoading, router])

  const fetchAnalytics = async () => {
    try {
      // Basic counts
      const { count: buildingsCount } = await supabase
        .from('buildings')
        .select('*', { count: 'exact', head: true })

      const { count: reviewsCount } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })

      const { count: suggestionsCount } = await supabase
        .from('building_suggestions')
        .select('*', { count: 'exact', head: true })

      // Unique users count (approximate)
      const { data: uniqueUsers } = await supabase
        .from('reviews')
        .select('user_id', { count: 'exact' })
        .not('user_id', 'is', null)

      const totalUsers = uniqueUsers ? new Set(uniqueUsers.map(r => r.user_id)).size : 0

      // Average rating
      const { data: allRatings } = await supabase
        .from('reviews')
        .select('overall_rating')
        .not('overall_rating', 'is', null)

      const avgRating = allRatings && allRatings.length > 0
        ? allRatings.reduce((sum, r) => sum + (r.overall_rating || 0), 0) / allRatings.length
        : 0

      // Ratings distribution
      const ratingsDistribution = [1, 2, 3, 4, 5].map(rating => {
        const count = allRatings?.filter(r => r.overall_rating === rating).length || 0
        return { rating, count }
      })

      // Top rated buildings
      const { data: buildingRatings } = await supabase
        .from('building_ratings')
        .select('name, average_rating, total_reviews')
        .gt('total_reviews', 0)
        .order('average_rating', { ascending: false })
        .limit(5)

      const topRatedBuildings = buildingRatings?.map(b => ({
        name: b.name,
        rating: b.average_rating,
        reviews: b.total_reviews
      })) || []

      // Reviews by month (last 12 months)
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())

      const reviewsByMonth = Array.from({ length: 12 }, (_, i) => {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthStr = date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })
        const count = reviewsData?.filter(r => {
          const reviewDate = new Date(r.created_at || '')
          return reviewDate.getMonth() === date.getMonth() && reviewDate.getFullYear() === date.getFullYear()
        }).length || 0
        return { month: monthStr, count }
      }).reverse()

      // Corregimiento stats
      const { data: buildings } = await supabase
        .from('buildings')
        .select('corregimiento')

      const { data: reviews } = await supabase
        .from('reviews')
        .select('building_id')
        .not('building_id', 'is', null)

      const { data: buildingsWithReviews } = await supabase
        .from('buildings')
        .select('id, corregimiento')

      const corregimientoStats: { [key: string]: { buildings: number; reviews: number } } = {}
      
      buildings?.forEach(b => {
        if (b.corregimiento) {
          if (!corregimientoStats[b.corregimiento]) {
            corregimientoStats[b.corregimiento] = { buildings: 0, reviews: 0 }
          }
          corregimientoStats[b.corregimiento].buildings++
        }
      })

      buildingsWithReviews?.forEach(b => {
        const reviewCount = reviews?.filter(r => r.building_id === b.id).length || 0
        if (b.corregimiento && corregimientoStats[b.corregimiento]) {
          corregimientoStats[b.corregimiento].reviews += reviewCount
        }
      })

      const corregimientoStatsArray = Object.entries(corregimientoStats)
        .map(([name, stats]) => ({ name, buildings: stats.buildings, reviews: stats.reviews }))
        .sort((a, b) => b.buildings - a.buildings)
        .slice(0, 10)

      // Recent activity
      const { data: recentReviews } = await supabase
        .from('reviews')
        .select('id, overall_rating, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      const { data: recentSuggestions } = await supabase
        .from('building_suggestions')
        .select('id, building_name, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      const recentActivity = [
        ...(recentReviews?.map(r => ({
          type: 'review',
          description: `Nueva reseña (${r.overall_rating}/5 estrellas)`,
          date: r.created_at || ''
        })) || []),
        ...(recentSuggestions?.map(s => ({
          type: 'suggestion',
          description: `Sugerencia: ${s.building_name}`,
          date: s.created_at || ''
        })) || [])
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10)

      setAnalytics({
        totalBuildings: buildingsCount || 0,
        totalReviews: reviewsCount || 0,
        totalSuggestions: suggestionsCount || 0,
        totalUsers,
        avgRating: Math.round(avgRating * 10) / 10,
        ratingsDistribution,
        topRatedBuildings,
        reviewsByMonth,
        corregimientoStats: corregimientoStatsArray,
        recentActivity
      })

    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando analytics...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Admin
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                Analytics Dashboard
              </h1>
            </div>
            <button
              onClick={fetchAnalytics}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Edificios</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.totalBuildings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reseñas</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.totalReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuarios</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sugerencias</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.totalSuggestions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rating Promedio</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.avgRating}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Ratings Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Ratings</h3>
            <div className="space-y-3">
              {analytics.ratingsDistribution.map(({ rating, count }) => {
                const percentage = analytics.totalReviews > 0 ? (count / analytics.totalReviews) * 100 : 0
                return (
                  <div key={rating} className="flex items-center">
                    <div className="flex items-center w-16">
                      <span className="text-sm text-gray-600">{rating}</span>
                      <svg className="w-4 h-4 text-yellow-400 fill-current ml-1" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 w-16 text-right">
                      {count} ({percentage.toFixed(1)}%)
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top Rated Buildings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edificios Mejor Calificados</h3>
            <div className="space-y-3">
              {analytics.topRatedBuildings.length > 0 ? analytics.topRatedBuildings.map((building, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{building.name}</p>
                    <p className="text-xs text-gray-600">{building.reviews} reseñas</p>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-yellow-400 fill-current mr-1" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-900">{building.rating}</span>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">No hay edificios con reseñas aún</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Reviews by Month */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reseñas por Mes</h3>
            <div className="space-y-2">
              {analytics.reviewsByMonth.map(({ month, count }) => {
                const maxCount = Math.max(...analytics.reviewsByMonth.map(r => r.count))
                const width = maxCount > 0 ? (count / maxCount) * 100 : 0
                return (
                  <div key={month} className="flex items-center">
                    <div className="w-16 text-sm text-gray-600">{month}</div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${width}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-900 w-8 text-right">{count}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Corregimiento Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas por Corregimiento</h3>
            <div className="space-y-2">
              {analytics.corregimientoStats.length > 0 ? analytics.corregimientoStats.map((corr) => (
                <div key={corr.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{corr.name}</p>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <span>{corr.buildings} edificios</span>
                    <span>{corr.reviews} reseñas</span>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">No hay datos de corregimientos</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            {analytics.recentActivity.length > 0 ? analytics.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'review' ? 'bg-green-500' : 'bg-orange-500'
                }`}></div>
                <span className="text-gray-600">{activity.description}</span>
                <span className="text-gray-400 text-xs">
                  {new Date(activity.date).toLocaleDateString()}
                </span>
              </div>
            )) : (
              <p className="text-gray-500 text-sm">No hay actividad reciente</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}