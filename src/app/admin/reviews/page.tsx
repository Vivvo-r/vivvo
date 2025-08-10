'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '@/contexts/AdminContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Review, Building } from '@/types'
import Link from 'next/link'

interface ReviewWithBuilding extends Review {
  building: Building
}

export default function AdminReviewsPage() {
  const { isAdmin, loading: authLoading } = useAdmin()
  const router = useRouter()
  const [reviews, setReviews] = useState<ReviewWithBuilding[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/admin')
      return
    }

    if (isAdmin) {
      fetchReviews()
    }
  }, [isAdmin, authLoading, router])

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          building:buildings(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteReview = async (reviewId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      try {
        const { error } = await supabase
          .from('reviews')
          .delete()
          .eq('id', reviewId)

        if (error) throw error
        fetchReviews() // Refresh the list
      } catch (error) {
        console.error('Error deleting review:', error)
        alert('Error al eliminar la reseña')
      }
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ))
  }

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true
    if (filter === 'recent') {
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      return new Date(review.created_at || '') > oneWeekAgo
    }
    if (filter === 'high') return review.overall_rating >= 4
    if (filter === 'low') return review.overall_rating <= 2
    return true
  })

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
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
                Gestión de Reviews
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas las reseñas</option>
                <option value="recent">Recientes (7 días)</option>
                <option value="high">Calificación alta (4-5★)</option>
                <option value="low">Calificación baja (1-2★)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-lg">
                  {reviews.length}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold text-lg">
                  {reviews.filter(r => r.overall_rating >= 4).length}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Positivas (4-5★)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 font-semibold text-lg">
                  {reviews.filter(r => r.overall_rating === 3).length}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Neutras (3★)</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-semibold text-lg">
                  {reviews.filter(r => r.overall_rating <= 2).length}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Negativas (1-2★)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Reviews ({filteredReviews.length})
            </h2>
          </div>

          {filteredReviews.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No hay reviews{filter !== 'all' ? ` con el filtro "${filter}"` : ''}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <div key={review.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Review Header */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                          U{review.user_id.slice(-1)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Usuario #{review.user_id.slice(-4)}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(review.created_at || '').toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Building Info */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0h4" />
                          </svg>
                          <Link
                            href={`/edificio/${review.building.slug}`}
                            className="font-medium text-blue-600 hover:text-blue-800"
                          >
                            {review.building.name}
                          </Link>
                          <span className="text-gray-500">•</span>
                          <span className="text-sm text-gray-600">{review.building.corregimiento}</span>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <div className="flex items-center mr-3">
                          {renderStars(review.overall_rating)}
                        </div>
                        <span className="font-semibold text-gray-900">
                          {review.overall_rating}/5
                        </span>
                      </div>

                      {/* Comment */}
                      <div className="mb-4">
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>

                      {/* Review ID for reference */}
                      <div className="text-xs text-gray-400">
                        ID: {review.id}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 ml-4">
                      <Link
                        href={`/edificio/${review.building.slug}`}
                        className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors text-center"
                      >
                        Ver Edificio
                      </Link>
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 