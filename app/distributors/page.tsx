'use client'

import Link from 'next/link'
import { Menu, X, MapPin, Phone, Mail } from 'lucide-react'
import { useState } from 'react'

const distributors = [
  { id: 1, name: 'PT. Organik Indonesia', region: 'Jakarta', address: 'Jl. Sustainability No. 123', phone: '+62 21 1234 5678', email: 'contact@organik.id', products: 'Jerami, Kompos, Edible Cutlery' },
  { id: 2, name: 'CV. Hijau Nusantara', region: 'Bandung', address: 'Jl. Green Way No. 45', phone: '+62 22 9876 5432', email: 'info@hijaunusantara.id', products: 'Edible Cutlery, Kompos' },
  { id: 3, name: 'UD. Sumber Alam', region: 'Surabaya', address: 'Jl. Eco Lane No. 67', phone: '+62 31 5555 6666', email: 'support@sumberalam.id', products: 'Limbah Organik, Kompos' },
  { id: 4, name: 'Koperasi Petani Maju', region: 'Yogyakarta', address: 'Jl. Pertanian No. 89', phone: '+62 274 4444 3333', email: 'kpm@petanimaju.id', products: 'Limbah Pertanian, Jerami' },
  { id: 5, name: 'PT. Eco Products', region: 'Medan', address: 'Jl. Eco Green No. 11', phone: '+62 61 2222 1111', email: 'sales@ecoproducts.id', products: 'Semua Produk' },
  { id: 6, name: 'CV. Bumi Hijau', region: 'Makassar', address: 'Jl. Sustainability No. 34', phone: '+62 411 8888 9999', email: 'contact@bumihijau.id', products: 'Edible Cutlery, Kompos' },
]

export default function DistributorsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState('Semua')

  const regions = ['Semua', 'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan', 'Makassar']

  const filteredDistributors = selectedRegion === 'Semua'
    ? distributors
    : distributors.filter(d => d.region === selectedRegion)

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <span className="font-bold text-xl text-green-700 hidden sm:inline">WITARA</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-green-600 transition text-sm font-medium">
                Beranda
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-green-600 transition text-sm font-medium">
                Tentang Kami
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-green-600 transition text-sm font-medium">
                Produk
              </Link>
              <Link href="/resources" className="text-gray-700 hover:text-green-600 transition text-sm font-medium">
                Resources
              </Link>
              <Link href="/distributors" className="text-green-600 font-medium text-sm border-b-2 border-green-600">
                Distributor
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-green-600 transition text-sm font-medium">
                Kontak
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition"
              >
                Masuk / Daftar
              </Link>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200">
              <Link href="/" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Beranda
              </Link>
              <Link href="/about" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Tentang Kami
              </Link>
              <Link href="/products" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Produk
              </Link>
              <Link href="/resources" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Resources
              </Link>
              <Link href="/distributors" className="block w-full text-left px-4 py-2 text-sm text-green-600 font-medium bg-green-50">
                Distributor
              </Link>
              <Link href="/contact" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Kontak
              </Link>
              <div className="px-4 py-2 border-t border-gray-200 mt-2 pt-2">
                <Link
                  href="/login"
                  className="block w-full px-4 py-2 text-center text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-50"
                >
                  Masuk / Daftar
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-green-50 to-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Distributor Kami</h1>
          <p className="text-lg text-gray-600">Jaringan distributor terpercaya di seluruh Indonesia</p>
        </div>
      </section>

      {/* Region Filter */}
      <section className="py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-gray-700 mb-4">Filter berdasarkan wilayah:</p>
          <div className="flex flex-wrap gap-2">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedRegion === region
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Distributors Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDistributors.map((distributor) => (
              <div key={distributor.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-300 to-green-600 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    🏢
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{distributor.name}</h3>
                    <p className="text-sm text-green-600 font-medium">{distributor.region}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-start gap-2">
                    <MapPin size={18} className="text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-sm text-gray-600">{distributor.address}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone size={18} className="text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-sm text-gray-600">{distributor.phone}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail size={18} className="text-green-600 flex-shrink-0 mt-1" />
                    <p className="text-sm text-gray-600">{distributor.email}</p>
                  </div>
                </div>

                {/* Products */}
                <div className="mb-6">
                  <p className="text-xs font-medium text-gray-600 mb-2">Produk:</p>
                  <p className="text-sm text-gray-700">{distributor.products}</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <a
                    href={`tel:${distributor.phone.replace(/\s/g, '')}`}
                    className="flex-1 px-4 py-2 text-sm border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition font-medium text-center"
                  >
                    Hubungi
                  </a>
                  <a
                    href={`mailto:${distributor.email}`}
                    className="flex-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-center"
                  >
                    Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Jadilah Distributor WITARA</h2>
          <p className="text-lg mb-8 opacity-90">Bergabunglah dengan jaringan distribusi kami dan kembangkan bisnis Anda</p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Hubungi Tim Kami
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">W</span>
                </div>
                <span className="font-bold text-xl">WITARA</span>
              </div>
              <p className="text-gray-400 text-sm">Platform limbah organik berkelanjutan.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Menu</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-white transition">Beranda</Link></li>
                <li><Link href="/about" className="hover:text-white transition">Tentang</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Kontak</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Kebijakan</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privasi</a></li>
                <li><a href="#" className="hover:text-white transition">Syarat & Ketentuan</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Kontak</h4>
              <p className="text-gray-400 text-sm">contact@witara.com</p>
              <p className="text-gray-400 text-sm">+62 21 1234 5678</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 WITARA. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
