'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error during auth callback:', error)
          router.push('/login?error=callback_error')
        } else {
          // Redirect to home or where user was trying to go
          const redirectTo = localStorage.getItem('redirectTo')
          if (redirectTo) {
            localStorage.removeItem('redirectTo')
            router.push(redirectTo)
          } else {
            router.push('/')
          }
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
        router.push('/login?error=callback_error')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completando autenticación...</p>
      </div>
    </div>
  )
} 