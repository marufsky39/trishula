'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
    full_name?: string
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const productId = params.id as string

  const [product, setProduct] = useState<WasteMaterial | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Check user
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
        }

        // Fetch product
        const { data, error } = await supabase
          .from('waste_materials')
          .select(`
            *,
            user_profiles!inner(username, full_name)
          `)
          .eq('id', productId)
          .single()

        if (error) {
          console.error('Error fetching product:', error)
        } else {
          setProduct(data)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId, supabase])

  const isOwner = user && product && user.id === product.user_id

  const handleDelete = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return

    try {
      const { error } = await supabase
        .from('waste_materials')
        .delete()
        .eq('id', productId)

      if (error) {
        alert('Gagal menghapus produk')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleCopyContact = () => {
    navigator.clipboard.writeText((product?.user_profiles as any)?.username || 'username')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-700">Memuat produk...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produk Tidak Ditemukan</h2>
          <Link href="/marketplace">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6">
              Kembali ke Marketplace
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/marketplace" className="text-emerald-600 hover:text-emerald-700 font-medium mb-8 inline-block">
          ← Kembali ke Marketplace
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <div className="h-96 md:h-full bg-gradient-to-br from-emerald-200 via-amber-100 to-orange-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-8xl">♻️</div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600">
                Ditambahkan {new Date(product.created_at).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {/* Price */}
            <Card className="p-6 bg-emerald-50 border-2 border-emerald-200">
              <p className="text-gray-600 text-sm mb-2">Harga</p>
              <p className="text-4xl font-bold text-emerald-600">
                Rp {product.price.toLocaleString('id-ID')}
              </p>
            </Card>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Deskripsi</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Seller Info */}
            <Card className="p-6 border-l-4 border-l-amber-600">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Informasi Penjual</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Username</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {(product.user_profiles as any)?.username || 'Penjual'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            {isOwner ? (
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link href={`/dashboard`} className="flex-1">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg">
                    Edit Produk
                  </Button>
                </Link>
                <Button 
                  onClick={handleDelete}
                  variant="outline"
                  className="flex-1 border-red-300 text-red-700 hover:bg-red-50 font-semibold py-3"
                >
                  Hapus Produk
                </Button>
              </div>
            ) : (
              <div className="space-y-3 pt-4">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg">
                  Hubungi Penjual
                </Button>
                <Button 
                  onClick={handleCopyContact}
                  variant="outline"
                  className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold py-3"
                >
                  {copied ? '✓ Username Disalin' : 'Salin Username'}
                </Button>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                💡 <strong>Catatan:</strong> Silakan hubungi penjual untuk negosiasi harga, jumlah pesanan, dan pengiriman.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Produk Serupa</h2>
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600">Fitur rekomendasi produk akan segera tersedia</p>
          </div>
        </section>
      </main>
    </div>
  )
}
