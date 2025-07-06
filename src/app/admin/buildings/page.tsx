'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '@/contexts/AdminContext'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Building, Corregimiento } from '@/types'
import Link from 'next/link'


export default function AdminBuildingsPage() {
  const { isAdmin, loading: authLoading } = useAdmin()
  const router = useRouter()
  const [buildings, setBuildings] = useState<Building[]>([])
  const [corregimientos, setCorregimientos] = useState<Corregimiento[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    neighborhood: '',
    corregimiento: '',
    description: '',
    year_built: '',
    floors: '',
    apartments_count: '',
    parking: false,
    pool: false,
    gym: false,
    security_24_7: false,
    elevator: false,
    balcony: false
  })

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/admin')
      return
    }

    if (isAdmin) {
      fetchData()
    }
  }, [isAdmin, authLoading, router])

  const fetchData = async () => {
    try {
      // Fetch buildings
      const { data: buildingsData, error: buildingsError } = await supabase
        .from('buildings')
        .select('*')
        .order('created_at', { ascending: false })

      if (buildingsError) throw buildingsError

      // Fetch corregimientos
      const { data: corregimientosData, error: corregimientosError } = await supabase
        .from('corregimientos')
        .select('*')
        .eq('active', true)
        .order('name')

      if (corregimientosError) throw corregimientosError

      setBuildings(buildingsData || [])
      setCorregimientos(corregimientosData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const slug = generateSlug(formData.name)
      
      const buildingData = {
        name: formData.name,
        slug,
        address: formData.address,
        neighborhood: formData.neighborhood,
        corregimiento: formData.corregimiento,
        description: formData.description || null,
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
        floors: formData.floors ? parseInt(formData.floors) : null,
        apartments_count: formData.apartments_count ? parseInt(formData.apartments_count) : null,
        parking: formData.parking,
        pool: formData.pool,
        gym: formData.gym,
        security_24_7: formData.security_24_7,
        elevator: formData.elevator,
        balcony: formData.balcony
      }

      if (editingBuilding) {
        // Update existing building
        const { error } = await supabase
          .from('buildings')
          .update(buildingData)
          .eq('id', editingBuilding.id)

        if (error) throw error
        
        // Refresh data to show updated building
        fetchData()
      } else {
        // Create new building
        const { data: newBuilding, error } = await supabase
          .from('buildings')
          .insert(buildingData)
          .select()
          .single()

        if (error) throw error
        
        // Refresh data to show new building in list
        fetchData()
        
        // Show success message
        alert(`✅ Edificio "${newBuilding.name}" creado exitosamente.`)
        
        // Close form after creating
        setFormData({
          name: '',
          address: '',
          neighborhood: '',
          corregimiento: '',
          description: '',
          year_built: '',
          floors: '',
          apartments_count: '',
          parking: false,
          pool: false,
          gym: false,
          security_24_7: false,
          elevator: false,
          balcony: false
        })
        setEditingBuilding(null)
        setShowForm(false)
        return
      }

      // Reset form and close (only for updates)
      setFormData({
        name: '',
        address: '',
        neighborhood: '',
        corregimiento: '',
        description: '',
        year_built: '',
        floors: '',
        apartments_count: '',
        parking: false,
        pool: false,
        gym: false,
        security_24_7: false,
        elevator: false,
        balcony: false
      })
      setEditingBuilding(null)
      setShowForm(false)
      
    } catch (error) {
      console.error('Error saving building:', error)
      alert('Error al guardar el edificio')
    }
  }



  const handleEdit = (building: Building) => {
    setEditingBuilding(building)
    setFormData({
      name: building.name,
      address: building.address,
      neighborhood: building.neighborhood,
      corregimiento: building.corregimiento,
      description: building.description || '',
      year_built: building.year_built?.toString() || '',
      floors: building.floors?.toString() || '',
      apartments_count: building.apartments_count?.toString() || '',
      parking: building.parking || false,
      pool: building.pool || false,
      gym: building.gym || false,
      security_24_7: building.security_24_7 || false,
      elevator: building.elevator || false,
      balcony: building.balcony || false
    })
    
    setShowForm(true)
  }

  const handleDelete = async (building: Building) => {
    if (confirm(`¿Estás seguro de que quieres eliminar "${building.name}"?`)) {
      try {
        const { error } = await supabase
          .from('buildings')
          .delete()
          .eq('id', building.id)

        if (error) throw error
        fetchData()
      } catch (error) {
        console.error('Error deleting building:', error)
        alert('Error al eliminar el edificio')
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
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
                Gestión de Edificios
              </h1>
            </div>
            <button
              onClick={() => {
                setShowForm(true)
                setEditingBuilding(null)
                setFormData({
                  name: '',
                  address: '',
                  neighborhood: '',
                  corregimiento: '',
                  description: '',
                  year_built: '',
                  floors: '',
                  apartments_count: '',
                  parking: false,
                  pool: false,
                  gym: false,
                  security_24_7: false,
                  elevator: false,
                  balcony: false
                })
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Agregar Edificio
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {editingBuilding ? 
                    (editingBuilding.created_at && new Date(editingBuilding.created_at).getTime() > Date.now() - 60000 ? 
                      'Edificio Creado - Agregar Fotos' : 
                      'Editar Edificio'
                    ) : 
                    'Agregar Edificio'
                  }
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setEditingBuilding(null)
                    setFormData({
                      name: '',
                      address: '',
                      neighborhood: '',
                      corregimiento: '',
                      description: '',
                      year_built: '',
                      floors: '',
                      apartments_count: '',
                      parking: false,
                      pool: false,
                      gym: false,
                      security_24_7: false,
                      elevator: false,
                      balcony: false
                    })
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre del Edificio *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Barrio *
                    </label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Corregimiento *
                    </label>
                    <select
                      name="corregimiento"
                      value={formData.corregimiento}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      {corregimientos.map(corr => (
                        <option key={corr.id} value={corr.name}>
                          {corr.name} ({corr.distrito})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Año de Construcción
                    </label>
                    <input
                      type="number"
                      name="year_built"
                      value={formData.year_built}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número de Pisos
                    </label>
                    <input
                      type="number"
                      name="floors"
                      value={formData.floors}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total de Apartamentos
                    </label>
                    <input
                      type="number"
                      name="apartments_count"
                      value={formData.apartments_count}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descripción
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amenidades
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { key: 'parking', label: 'Estacionamiento' },
                        { key: 'pool', label: 'Piscina' },
                        { key: 'gym', label: 'Gimnasio' },
                        { key: 'security_24_7', label: 'Seguridad 24/7' },
                        { key: 'elevator', label: 'Ascensor' },
                        { key: 'balcony', label: 'Balcón' }
                      ].map(amenity => (
                        <label key={amenity.key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name={amenity.key}
                            checked={formData[amenity.key as keyof typeof formData] as boolean}
                            onChange={handleChange}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{amenity.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>


                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingBuilding(null)
                      setFormData({
                        name: '',
                        address: '',
                        neighborhood: '',
                        corregimiento: '',
                        description: '',
                        year_built: '',
                        floors: '',
                        apartments_count: '',
                        parking: false,
                        pool: false,
                        gym: false,
                        security_24_7: false,
                        elevator: false,
                        balcony: false
                      })
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    {editingBuilding ? 'Finalizar' : 'Cancelar'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingBuilding ? 'Actualizar' : 'Crear'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Buildings List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Edificios ({buildings.length})
            </h2>
          </div>

          {buildings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No hay edificios registrados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Edificio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amenidades
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {buildings.map((building) => (
                    <tr key={building.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {building.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {building.apartments_count ? `${building.apartments_count} apartamentos` : 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{building.corregimiento}</div>
                        <div className="text-sm text-gray-500">{building.neighborhood}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {building.parking && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Parking</span>}
                          {building.pool && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Piscina</span>}
                          {building.gym && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Gym</span>}
                          {building.security_24_7 && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">24/7</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {building.created_at ? new Date(building.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(building)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(building)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 