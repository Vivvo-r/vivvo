'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Building } from '@/types'
import { ROUTES, VIVVO } from '@/lib/constants'

export default function BuildingsPage() {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBuildings()
  }, [])

  const fetchBuildings = async () => {
    try {
      const { data, error } = await supabase
        .from('buildings')
        .select('*')
        .order('name')

      if (error) {
        setError(error.message)
      } else {
        setBuildings(data || [])
      }
    } catch {
      setError('Error al cargar los edificios')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando edificios...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchBuildings}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Edificios en {VIVVO.name}
          </h1>
          <p className="mt-2 text-gray-600">
            Encuentra y revisa apartamentos en los mejores edificios de Panamá
          </p>
        </div>

        <div className="mb-6">
          <Link
            href={ROUTES.home}
            className="inline-flex items-center text-blue-600 hover:text-blue-500"
          >
            ← Volver al inicio
          </Link>
        </div>

        {buildings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No hay edificios disponibles en este momento.
            </p>
            <p className="text-gray-400 mt-2">
              ¡Vuelve pronto para ver las nuevas opciones!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings.map((building) => (
              <div
                key={building.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {building.name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    📍 {building.address}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    {building.neighborhood}
                  </p>
                  <Link
                    href={ROUTES.building(building.slug)}
                    className="inline-block w-full text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Ver Detalles
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 