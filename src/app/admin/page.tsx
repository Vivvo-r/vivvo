'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '@/contexts/AdminContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Footer from '@/components/layout/Footer'

function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetMessage, setResetMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdmin()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (login(username, password)) {
      router.refresh()
    } else {
      setError('Credenciales incorrectas')
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Simular envío de email - en realidad enviará credenciales por email
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Por ahora mostrar las credenciales directamente
      setResetMessage('Credenciales: admin / vivvo2024 (normalmente se enviaría por email)')
      setShowForgotPassword(false)
      setTimeout(() => setResetMessage(''), 10000)
    } catch (error) {
      console.error('Error:', error)
      setError('Error al procesar la solicitud. Intenta más tarde.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Admin Panel
          </h1>
          <p className="text-gray-600">
            Acceso al panel de administración de Vivvo
          </p>
        </div>

        {!showForgotPassword ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            {resetMessage && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm text-center">
                {resetMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Recuperar Contraseña</h3>
              <p className="text-gray-600 text-sm mb-6">
                Se mostrarán las credenciales de acceso (normalmente se enviarían por email).
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">info.vivvo@gmail.com</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Procesando...' : 'Mostrar Credenciales'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false)
                  setError('')
                }}
                className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm font-medium transition-colors"
              >
                Volver al login
              </button>
            </form>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}

function AdminDashboard() {
  const { logout } = useAdmin()
  const [stats, setStats] = useState({
    buildings: 0,
    reviews: 0,
    suggestions: 0,
    pendingSuggestions: 0,
    recentBuildings: 0,
    avgRating: 0,
    totalUsers: 0
  })
  const [recentActivity, setRecentActivity] = useState<{ id: string; type: string; description: string; timestamp: string }[]>([])

  useEffect(() => {
    fetchStats()
  }, [])

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

      // Get suggestions count
      const { count: suggestionsCount } = await supabase
        .from('building_suggestions')
        .select('*', { count: 'exact', head: true })

      // Get pending suggestions
      const { count: pendingSuggestionsCount } = await supabase
        .from('building_suggestions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      // Get recent buildings (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      const { count: recentBuildingsCount } = await supabase
        .from('buildings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo)

      // Get average rating
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('overall_rating')
        .not('overall_rating', 'is', null)

      const avgRating = reviewsData && reviewsData.length > 0 
        ? reviewsData.reduce((sum, review) => sum + (review.overall_rating || 0), 0) / reviewsData.length
        : 0

      // Get recent activity
      const { data: recentSuggestions } = await supabase
        .from('building_suggestions')
        .select('id, building_name, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5)

      const { data: recentReviews } = await supabase
        .from('reviews')
        .select('id, overall_rating, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      // Transform activity to match the expected interface
      const activity = [
        ...(recentSuggestions || []).map(s => ({
          id: s.id,
          type: 'suggestion',
          description: `Nueva sugerencia: ${s.building_name}`,
          timestamp: s.created_at || ''
        })),
        ...(recentReviews || []).map(r => ({
          id: r.id,
          type: 'review',
          description: `Nueva review (${r.overall_rating}/5 estrellas)`,
          timestamp: r.created_at || ''
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 8)

      setStats({
        buildings: buildingsCount || 0,
        reviews: reviewsCount || 0,
        suggestions: suggestionsCount || 0,
        pendingSuggestions: pendingSuggestionsCount || 0,
        recentBuildings: recentBuildingsCount || 0,
        avgRating: Math.round(avgRating * 10) / 10,
        totalUsers: Math.floor((reviewsCount || 0) * 0.7) // Aproximación
      })
      setRecentActivity(activity)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Vivvo Admin
              </h1>
            </div>
            <button
              onClick={logout}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Edificios</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.buildings}</p>
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
                <p className="text-sm font-medium text-gray-600">Reviews</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.reviews}</p>
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
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900">{stats.suggestions}</p>
                  {stats.pendingSuggestions > 0 && (
                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                      {stats.pendingSuggestions} pendientes
                    </span>
                  )}
                </div>
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
                <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Rating Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Rating Promedio</h3>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-2xl font-bold text-gray-900">{stats.avgRating}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">Basado en {stats.reviews} reseñas</p>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {recentActivity.length > 0 ? recentActivity.map((item, index) => (
                <div key={index} className="flex items-center space-x-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    item.type === 'suggestion' ? 'bg-orange-500' : 'bg-green-500'
                  }`}></div>
                  <span className="text-gray-600">
                    {item.description}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
              )) : (
                <p className="text-gray-500 text-sm">No hay actividad reciente</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="/admin/buildings"
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m11 0v-5a2 2 0 00-2-2h-2a2 2 0 00-2 2v5m-4 0V9a2 2 0 012-2h2a2 2 0 012 2v12m-6 0h4" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Gestionar Edificios</p>
                <p className="text-xs text-gray-600">Agregar, editar y eliminar</p>
              </div>
            </a>

            <a
              href="/admin/reviews"
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-700 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Gestionar Reviews</p>
                <p className="text-xs text-gray-600">Moderar y eliminar</p>
              </div>
            </a>

            <a
              href="/admin/suggestions"
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center group-hover:bg-orange-700 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Ver Sugerencias</p>
                <p className="text-xs text-gray-600">Edificios sugeridos</p>
              </div>
            </a>

            <a
              href="/admin/analytics"
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
            >
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-700 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Analytics</p>
                <p className="text-xs text-gray-600">Estadísticas generales</p>
              </div>
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default function AdminPage() {
  const { isAdmin, loading } = useAdmin()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return isAdmin ? <AdminDashboard /> : <AdminLogin />
} 