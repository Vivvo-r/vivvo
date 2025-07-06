'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleResetPasswordCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hashFragment = window.location.hash
        
        if (hashFragment) {
          // Parse the hash fragment to extract tokens
          const params = new URLSearchParams(hashFragment.substring(1))
          const accessToken = params.get('access_token')
          const refreshToken = params.get('refresh_token')
          const tokenType = params.get('type')
          
          if (accessToken && tokenType === 'recovery') {
            // Set the session with the tokens
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            })
            
            if (error) {
              console.error('Error setting session:', error)
              router.push('/auth/reset-password?error=invalid_token')
            } else {
              // Success - redirect to reset password form
              router.push('/auth/reset-password?verified=true')
            }
          } else {
            // Invalid or missing tokens
            router.push('/auth/reset-password?error=invalid_token')
          }
        } else {
          // No hash fragment
          router.push('/auth/reset-password?error=missing_token')
        }
      } catch (error) {
        console.error('Error in reset password callback:', error)
        router.push('/auth/reset-password?error=callback_error')
      }
    }

    handleResetPasswordCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Verificando enlace de recuperación...
        </h2>
        <p className="text-gray-600">
          Por favor espera mientras verificamos tu enlace de recuperación.
        </p>
      </div>
    </div>
  )
} 