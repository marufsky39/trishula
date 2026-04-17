'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
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
  user_profiles?: {
    username: string
  }
}

export default function MarketplacePage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<WasteMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedCategory, setSelectedCategory] = useState('semua')

  useEffect(() => {
    const checkUserAndFetchProducts = async () => {
      try {
        // Check authentication
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
        }

        // Fetch all products with user info
        const { data, error } = await supabase
          .from('waste_materials')
          .select(`
            *,
            user_profiles!inner(username)
          `)
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

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else if (sortBy === 'priceAsc') {
        return a.price - b.price
      } else if (sortBy === 'priceDesc') {
        return b.price - a.price
      }
      return 0
    })

  const categories = ['semua', 'tepung', 'limbah pangan', 'biji-bijian', 'lainnya']

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-700">Memuat marketplace...</p>
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Marketplace Limbah Organik</h1>
            <p className="text-gray-700">Temukan bahan limbah organik berkualitas dari penjual terpercaya</p>
          </div>
          {user && (
            <Link href="/upload">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg">
                + Jual Limbah
              </Button>
            </Link>
          )}
        </div>

        {/* Filter Section */}
        <Card className="p-6 mb-12 bg-white">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Search */}
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Cari limbah organik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="newest">Terbaru</option>
                <option value="priceAsc">Harga Terendah</option>
                <option value="priceDesc">Harga Tertinggi</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Belum Ada Produk</h3>
            <p className="text-gray-700 mb-6">Mulai jual limbah organik Anda atau coba pencarian lain</p>
            {user && (
              <Link href="/upload">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6">
                  Jual Limbah Sekarang
                </Button>
              </Link>
            )}
          </Card>
        ) : (
          <div>
            <p className="text-gray-600 mb-6 font-medium">
              Menampilkan {filteredProducts.length} produk
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Link key={product.id} href={`/product/${product.id}`}>
                  <Card className="h-full overflow-hidden hover:shadow-xl transition group cursor-pointer">
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
                      <div className="mb-2">
                        <p className="text-xs text-emerald-600 font-semibold">
                          Penjual: {(product.user_profiles as any)?.username || 'Anonim'}
                        </p>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-emerald-600 font-bold text-xl">
                          Rp {product.price.toLocaleString('id-ID')}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {new Date(product.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>

                      <Button 
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition"
                      >
                        Lihat Detail
                      </Button>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
