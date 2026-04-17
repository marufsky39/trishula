'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getOrCreateGuestUser } from '@/lib/guest-user'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function UploadPage() {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isGuest, setIsGuest] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null as File | null
  })

  useEffect(() => {
    const checkUser = async () => {
      try {
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
      } catch (error) {
        console.error('Error:', error)
        // Use guest user on error
        setUser(getOrCreateGuestUser() as any)
        setIsGuest(true)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [supabase])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Ukuran file terlalu besar (maksimal 5MB)')
        return
      }

      setFormData({ ...formData, image: file })

      // Preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setError('')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name || !formData.description || !formData.price) {
      setError('Semua field harus diisi')
      return
    }

    if (parseFloat(formData.price) <= 0) {
      setError('Harga harus lebih dari 0')
      return
    }

    setSubmitting(true)

    try {
      let imageUrl = null

      // Upload image if provided
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop()
        const fileName = `${Date.now()}.${fileExt}`
        const filePath = `waste-materials/${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('waste-images')
          .upload(filePath, formData.image, { upsert: false })

        if (uploadError) {
          console.warn('Image upload warning:', uploadError)
          // Continue without image if upload fails
        } else {
          const { data } = supabase.storage
            .from('waste-images')
            .getPublicUrl(filePath)
          imageUrl = data.publicUrl
        }
      }

      // Insert product
      const { error: insertError } = await supabase
        .from('waste_materials')
        .insert({
          user_id: user.id,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          image_url: imageUrl
        })

      if (insertError) {
        setError(insertError.message)
      } else {
        // Redirect to dashboard or show success message
        alert('Produk berhasil dipublikasikan!')
        // Reload dashboard
        window.location.href = '/dashboard'
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-700">Memuat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="text-emerald-600 hover:text-emerald-700 font-medium mb-4 inline-block">
            ← Kembali ke Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Jual Limbah Organik</h1>
          <p className="text-gray-700">Buat postingan untuk menjual bahan limbah organik berkualitas Anda</p>
        </div>

        {/* Form Card */}
        <Card className="p-8 lg:p-12">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Nama Produk *
              </label>
              <Input
                type="text"
                name="name"
                placeholder="Contoh: Limbah Tepung Beras Organik"
                value={formData.name}
                onChange={handleInputChange}
                disabled={submitting}
                className="w-full"
              />
              <p className="text-gray-600 text-xs mt-1">Berikan nama produk yang deskriptif</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Deskripsi *
              </label>
              <textarea
                name="description"
                placeholder="Jelaskan detail produk, kualitas, asal-usul, dan kegunaan..."
                value={formData.description}
                onChange={handleInputChange}
                disabled={submitting}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50"
              />
              <p className="text-gray-600 text-xs mt-1">Berikan informasi lengkap tentang produk Anda</p>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Harga (Rp) *
              </label>
              <Input
                type="number"
                name="price"
                placeholder="Contoh: 50000"
                value={formData.price}
                onChange={handleInputChange}
                disabled={submitting}
                min="1"
                className="w-full"
              />
              <p className="text-gray-600 text-xs mt-1">Harga per unit atau per kilogram</p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Foto Produk
              </label>

              {imagePreview ? (
                <div className="relative w-full">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full max-h-96 object-cover rounded-lg border-2 border-emerald-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null)
                      setFormData({ ...formData, image: null })
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Ubah
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center cursor-pointer hover:bg-emerald-50 transition"
                >
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-gray-700 font-medium mb-1">Klik atau drag untuk upload foto</p>
                  <p className="text-gray-600 text-sm">Maksimal 5MB (JPG, PNG)</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={submitting}
                className="hidden"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition"
              >
                {submitting ? 'Sedang Memproses...' : 'Publikasikan Produk'}
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3"
                >
                  Batal
                </Button>
              </Link>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="font-semibold text-emerald-900 mb-2">💡 Tips untuk Penjualan Lebih Baik:</p>
            <ul className="text-emerald-800 text-sm space-y-1">
              <li>✓ Gunakan foto berkualitas yang menunjukkan produk dengan jelas</li>
              <li>✓ Berikan deskripsi detail tentang kualitas dan kegunaan limbah</li>
              <li>✓ Tentukan harga yang kompetitif</li>
              <li>✓ Semakin lengkap info, semakin tinggi peluang penjualan</li>
            </ul>
          </div>
        </Card>
      </main>
    </div>
  )
}
