'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { VIVVO, ROUTES } from '@/lib/constants'
import { useState } from 'react'

export default function Header() {
  const { user, loading, signOut } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setDropdownOpen(false)
  }

  const getUserDisplayName = () => {
    if (!user) return ''
    
    // Try to get name from metadata first
    const name = user.user_metadata?.name || user.user_metadata?.full_name
    if (name) return name
    
    // Otherwise use email and extract first part
    if (user.email) {
      const emailName = user.email.split('@')[0]
      return emailName.charAt(0).toUpperCase() + emailName.slice(1)
    }
    
    return 'Usuario'
  }

  const getInitials = () => {
    const name = getUserDisplayName()
    return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">{VIVVO.name}</span>
            </Link>
            <div className="flex space-x-4">
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">{VIVVO.name}</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <Link
              href="/buildings"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors hidden sm:block"
            >
              Edificios
            </Link>
            
            <Link
              href={ROUTES.suggestBuilding}
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors border border-gray-300 rounded-md hover:border-blue-600 hidden sm:block"
            >
              + Sugerir Edificio
            </Link>

            {user ? (
              // User is logged in
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {getInitials()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {getUserDisplayName()}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                      <div className="font-medium">{getUserDisplayName()}</div>
                      <div className="text-gray-500">{user.email}</div>
                    </div>
                    
                    {/* Mobile Navigation */}
                    <div className="sm:hidden border-b border-gray-200">
                      <Link
                        href="/buildings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        📋 Ver Edificios
                      </Link>
                      <Link
                        href={ROUTES.suggestBuilding}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        ➕ Sugerir Edificio
                      </Link>
                    </div>
                    
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      👤 Mi Perfil
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      🚪 Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // User is not logged in
              <>
                {/* Desktop Auth Links */}
                <Link
                  href={ROUTES.login}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors hidden sm:block"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href={ROUTES.signup}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors hidden sm:block"
                >
                  Registrarse
                </Link>
                
                {/* Mobile Menu Button */}
                <div className="relative sm:hidden">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-center w-8 h-8 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <Link
                        href="/buildings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        📋 Ver Edificios
                      </Link>
                      <Link
                        href={ROUTES.suggestBuilding}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        ➕ Sugerir Edificio
                      </Link>
                      <div className="border-t border-gray-200 my-1"></div>
                      <Link
                        href={ROUTES.login}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        🔑 Iniciar Sesión
                      </Link>
                      <Link
                        href={ROUTES.signup}
                        className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                        onClick={() => setDropdownOpen(false)}
                      >
                        ✨ Registrarse
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop to close dropdown */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </header>
  )
} 