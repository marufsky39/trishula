'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleLoginRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!username || !password) {
        setError('Username dan password harus diisi')
        setLoading(false)
        return
      }

      if (password.length < 6) {
        setError('Password minimal 6 karakter')
        setLoading(false)
        return
      }

      // Generate valid email format
      const emailToUse = `${username.toLowerCase()}${Date.now()}@witara.local`

      console.log('[v0] Attempting login/register with email:', emailToUse)

      // Try to sign in first
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: password
      })

      if (!signInError) {
        // Login successful
        console.log('[v0] Login successful for user:', username)
        setSuccess('Login berhasil! Mengalihkan...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
        return
      }

      // If login fails, try to register
      console.log('[v0] Sign in error, attempting to register. Error:', signInError?.message)
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: emailToUse,
        password: password,
        options: {
          data: {
            username: username
          }
        }
      })

      if (signUpError) {
        console.log('[v0] Sign up error:', signUpError)
        setError(signUpError.message || 'Terjadi kesalahan saat mendaftar')
        setLoading(false)
        return
      }

      if (signUpData.user) {
        console.log('[v0] User registered successfully:', signUpData.user.id)
        
        // Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: signUpData.user.id,
            username: username,
            full_name: username
          })

        if (profileError) {
          console.error('[v0] Error creating profile:', profileError)
        } else {
          console.log('[v0] User profile created successfully')
        }

        setSuccess('Pendaftaran berhasil! Mengalihkan ke dashboard...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-amber-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">W</span>
              </div>
              <h1 className="font-bold text-2xl text-green-700">WITARA</h1>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang</h2>
            <p className="text-gray-600">Masuk atau Daftar Akun Baru</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLoginRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                placeholder="Username Anda (3+ karakter)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Password Anda (minimal 6 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span> Sedang memproses...
                </span>
              ) : (
                'Masuk / Daftar'
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <span className="font-medium">💡 Info:</span> Jika username belum terdaftar, akun akan otomatis dibuat. Gunakan username yang sama di lain waktu untuk login.
            </p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Dengan masuk, Anda setuju dengan{' '}
              <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                Kebijakan Privasi
              </a>
            </p>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-green-600 hover:text-green-700 font-medium text-sm inline-flex items-center gap-1">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-gray-600 text-xs">
          <p>Butuh bantuan? Hubungi support@witara.com</p>
        </div>
      </div>
    </div>
  )
}
