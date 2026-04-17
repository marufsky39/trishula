'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getOrCreateGuestUser, getUsername } from '@/lib/guest-user'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

interface WasteMaterial {
  id: string
  name: string
  description: string
  price: number
  image_url: string | null
  created_at: string
  user_id: string
}

export default function DashboardPage() {
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<WasteMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    const checkUserAndFetchProducts = async () => {
      try {
        // Try to get authenticated user
        const { data: { session } } = await supabase.auth.getSession()
        
        let currentUser = session?.user
        let isGuestMode = false

        // If no authenticated user, use guest user
        if (!currentUser) {
          currentUser = getOrCreateGuestUser() as any
          isGuestMode = true
          setIsGuest(true)
        }

        setUser(currentUser)

        // Only fetch profile if authenticated (not guest)
        if (!isGuestMode && currentUser) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('username')
            .eq('id', currentUser.id)
            .single()

          if (profile) {
            setUsername(profile.username)
          }
        } else {
          setUsername('Tamu')
        }

        // Fetch user's products
        const { data, error } = await supabase
          .from('waste_materials')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching products:', error)
        } else {
          setProducts(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUserAndFetchProducts()
  }, [supabase])

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return

    try {
      const { error } = await supabase
        .from('waste_materials')
        .delete()
        .eq('id', id)

      if (error) {
        alert('Gagal menghapus produk')
      } else {
        setProducts(products.filter(p => p.id !== id))
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-700">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Selamat datang, <span className="text-emerald-600">{username || 'Pengguna'}</span>!
            </h1>
            <p className="text-gray-700">Kelola produk limbah organik Anda dengan mudah</p>
          </div>
          <Link href="/upload">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg">
              + Tambah Produk
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 border-l-4 border-l-emerald-600">
            <p className="text-gray-600 text-sm font-medium mb-2">Total Produk</p>
            <p className="text-4xl font-bold text-emerald-600">{products.length}</p>
          </Card>
          <Card className="p-6 border-l-4 border-l-amber-600">
            <p className="text-gray-600 text-sm font-medium mb-2">Harga Total</p>
            <p className="text-4xl font-bold text-amber-600">
              Rp {products.reduce((sum, p) => sum + p.price, 0).toLocaleString('id-ID')}
            </p>
          </Card>
          <Card className="p-6 border-l-4 border-l-orange-600">
            <p className="text-gray-600 text-sm font-medium mb-2">Produk Aktif</p>
            <p className="text-4xl font-bold text-orange-600">{products.filter(p => p).length}</p>
          </Card>
        </div>

        {/* Products List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Produk Saya</h2>

          {products.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Produk</h3>
              <p className="text-gray-700 mb-6">Mulai jual limbah organik Anda dengan membuat postingan pertama</p>
              <Link href="/upload">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6">
                  Buat Produk Pertama
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition group">
                  {/* Product Image */}
                  <div className="h-48 bg-gradient-to-br from-emerald-200 via-amber-100 to-orange-200 flex items-center justify-center group-hover:scale-105 transition overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-6xl">♻️</div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                    <div className="mb-4">
                      <p className="text-emerald-600 font-bold text-lg">
                        Rp {product.price.toLocaleString('id-ID')}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(product.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link href={`/product/${product.id}`} className="flex-1">
                        <Button 
                          variant="outline" 
                          className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                        >
                          Lihat
                        </Button>
                      </Link>
                      <Button 
                        variant="outline"
                        onClick={() => handleDelete(product.id)}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        Hapus
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
