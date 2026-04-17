'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { getOrCreateGuestUser } from '@/lib/guest-user'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          setIsGuest(false)
        } else {
          // Create guest user
          const guestUser = getOrCreateGuestUser()
          setUser(guestUser as any)
          setIsGuest(true)
        }
      } catch (error) {
        console.error('Error checking user:', error)
        // Use guest on error
        const guestUser = getOrCreateGuestUser()
        setUser(guestUser as any)
        setIsGuest(true)
      } finally {
        setLoading(false)
      }
    }
    
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        setIsGuest(false)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-emerald-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="font-bold text-xl text-emerald-700 group-hover:text-emerald-600 transition">WITARA</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`transition font-medium ${isActive('/') ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
            >
              Beranda
            </Link>
            {!loading && user && (
              <>
                <Link 
                  href="/marketplace" 
                  className={`transition font-medium ${isActive('/marketplace') ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
                >
                  Marketplace
                </Link>
                <Link 
                  href="/dashboard" 
                  className={`transition font-medium ${isActive('/dashboard') ? 'text-emerald-600' : 'text-gray-700 hover:text-emerald-600'}`}
                >
                  Dashboard
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {!loading && !isGuest ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700">{user.email?.split('@')[0] || 'User'}</span>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                >
                  Keluar
                </Button>
              </div>
            ) : !loading && isGuest ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-700 bg-amber-100 px-3 py-1 rounded">Tamu</span>
                <Link href="/login">
                  <Button 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  )
}
