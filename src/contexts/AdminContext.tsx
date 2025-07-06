'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AdminContextType {
  isAdmin: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
  loading: boolean
}

const AdminContext = createContext<AdminContextType | null>(null)

// Credenciales de admin simples - en producción estas deberían estar en variables de entorno
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'vivvo2024'
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si ya está logueado
    const adminSession = localStorage.getItem('vivvo_admin_session')
    if (adminSession === 'authenticated') {
      setIsAdmin(true)
    }
    setLoading(false)
  }, [])

  const login = (username: string, password: string) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      setIsAdmin(true)
      localStorage.setItem('vivvo_admin_session', 'authenticated')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    localStorage.removeItem('vivvo_admin_session')
  }

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin debe usarse dentro de AdminProvider')
  }
  return context
} 