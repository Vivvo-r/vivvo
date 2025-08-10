'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '@/contexts/AdminContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { BuildingSuggestion } from '@/types'
import Link from 'next/link'

export default function AdminSuggestionsPage() {
  const { isAdmin, loading: authLoading } = useAdmin()
  const router = useRouter()
  const [suggestions, setSuggestions] = useState<BuildingSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/admin')
      return
    }

    if (isAdmin) {
      fetchSuggestions()
    }
  }, [isAdmin, authLoading, router])

  const fetchSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('building_suggestions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setSuggestions(data || [])
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateSuggestionStatus = async (id: string, status: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('building_suggestions')
        .update({ 
          status, 
          admin_notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) throw error
      fetchSuggestions()
    } catch (error) {
      console.error('Error updating suggestion:', error)
      alert('Error al actualizar la sugerencia')
    }
  }

  const handleStatusChange = async (suggestion: BuildingSuggestion, newStatus: string) => {
    let notes = ''
    if (newStatus === 'rejected') {
      notes = prompt('Motivo del rechazo (opcional):') || ''
    }
    
    await updateSuggestionStatus(suggestion.id, newStatus, notes)
  }

  const convertToBuilding = async (suggestion: BuildingSuggestion) => {
    if (!confirm(`¿Convertir "${suggestion.building_name}" en edificio oficial?`)) {
      return
    }

    try {
      // Generate slug
      const slug = suggestion.building_name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      // Create building
      const { data: newBuilding, error: buildingError } = await supabase
        .from('buildings')
        .insert({
          name: suggestion.building_name,
          slug,
          address: suggestion.building_address,
          corregimiento: suggestion.corregimiento,
          developer: suggestion.developer || null,
          year_built: suggestion.year_built || null,
          description: suggestion.additional_info || null,
          // Default amenities - can be edited later
          parking: false,
          pool: false,
          gym: false,
          security_24_7: false,
          elevator: false,
          balcony: false
        })
        .select()
        .single()

      if (buildingError) throw buildingError

      // Update suggestion status
      await updateSuggestionStatus(suggestion.id, 'approved', 'Convertido a edificio oficial')

      alert(`✅ Edificio "${newBuilding.name}" creado exitosamente!`)
      
    } catch (error) {
      console.error('Error converting suggestion to building:', error)
      alert('Error al convertir la sugerencia en edificio')
    }
  }

  const filteredSuggestions = suggestions.filter(suggestion => {
    if (filter === 'all') return true
    return suggestion.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'reviewing':
        return 'bg-blue-100 text-blue-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'reviewing':
        return 'Revisando'
      case 'approved':
        return 'Aprobado'
      case 'rejected':
        return 'Rechazado'
      default:
        return status
    }
  }

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
                Sugerencias de Edificios
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Todas</option>
                <option value="pending">Pendientes</option>
                <option value="reviewing">Revisando</option>
                <option value="approved">Aprobadas</option>
                <option value="rejected">Rechazadas</option>
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
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 font-semibold">
                  {suggestions.filter(s => s.status === 'pending').length}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {suggestions.filter(s => s.status === 'reviewing').length}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Revisando</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-semibold">
                  {suggestions.filter(s => s.status === 'approved').length}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Aprobadas</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 font-semibold">
                  {suggestions.filter(s => s.status === 'rejected').length}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Rechazadas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Sugerencias ({filteredSuggestions.length})
            </h2>
          </div>

          {filteredSuggestions.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No hay sugerencias {filter !== 'all' ? `con estado "${getStatusText(filter)}"` : ''}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {suggestion.building_name}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(suggestion.status)}`}>
                          {getStatusText(suggestion.status)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Ubicación:</span> {suggestion.building_address}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Email:</span> {suggestion.submitter_email}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Fecha:</span> {new Date(suggestion.created_at || '').toLocaleDateString()}
                          </p>
                        </div>
                        
                        {suggestion.additional_info && (
                          <div>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Información adicional:</span>
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                              {suggestion.additional_info}
                            </p>
                          </div>
                        )}
                      </div>

                      {suggestion.admin_notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Notas del admin:</span>
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            {suggestion.admin_notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {suggestion.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(suggestion, 'reviewing')}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            Revisar
                          </button>
                          <button
                            onClick={() => convertToBuilding(suggestion)}
                            className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors"
                          >
                            Crear Edificio
                          </button>
                          <button
                            onClick={() => handleStatusChange(suggestion, 'approved')}
                            className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleStatusChange(suggestion, 'rejected')}
                            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                          >
                            Rechazar
                          </button>
                        </>
                      )}

                      {suggestion.status === 'reviewing' && (
                        <>
                          <button
                            onClick={() => convertToBuilding(suggestion)}
                            className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-md hover:bg-purple-200 transition-colors"
                          >
                            Crear Edificio
                          </button>
                          <button
                            onClick={() => handleStatusChange(suggestion, 'approved')}
                            className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200 transition-colors"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleStatusChange(suggestion, 'rejected')}
                            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
                          >
                            Rechazar
                          </button>
                          <button
                            onClick={() => handleStatusChange(suggestion, 'pending')}
                            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition-colors"
                          >
                            Pendiente
                          </button>
                        </>
                      )}

                      {(suggestion.status === 'approved' || suggestion.status === 'rejected') && (
                        <button
                          onClick={() => handleStatusChange(suggestion, 'pending')}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          Reabrir
                        </button>
                      )}
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