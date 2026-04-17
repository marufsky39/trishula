'use client'

import Link from 'next/link'
import { Menu, X, Search } from 'lucide-react'
import { useState } from 'react'

const products = [
  { id: 1, name: 'Edible Spoon - Sendok Makan', price: 'Hubungi Kami', image: '/edible-cutlery.jpg', category: 'Edible Cutlery', desc: 'Sendok makan ramah lingkungan yang dapat dimakan, 100% biodegradable dan aman untuk dikonsumsi' },
  { id: 2, name: 'Edible Fork - Garpu Makan', price: 'Hubungi Kami', image: '/edible-cutlery.jpg', category: 'Edible Cutlery', desc: 'Garpu makan inovatif berbahan organik, dapat dimakan dan sepenuhnya dapat terurai' },
  { id: 3, name: 'Edible Spork - Sendok Garpu Kombo', price: 'Hubungi Kami', image: '/edible-cutlery.jpg', category: 'Edible Cutlery', desc: 'Kombinasi sendok dan garpu dalam satu produk, sempurna untuk acara dan penggunaan sehari-hari' },
  { id: 4, name: 'Edible Sedotan - Straw Makan', price: 'Hubungi Kami', image: '/edible-cutlery.jpg', category: 'Edible Cutlery', desc: 'Sedotan yang dapat dimakan sebagai pengganti plastik, ramah lingkungan dan dapat didaur ulang' },
  { id: 5, name: 'Edible Plate - Piring Makan', price: 'Hubungi Kami', image: '/edible-cutlery.jpg', category: 'Edible Cutlery', desc: 'Piring yang dapat dimakan untuk hidangan, mengurangi limbah dan mendukung zero waste' },
  { id: 6, name: 'Edible Bowl - Mangkuk Makan', price: 'Hubungi Kami', image: '/edible-cutlery.jpg', category: 'Edible Cutlery', desc: 'Mangkuk yang dapat dimakan dengan tekstur sempurna untuk sup dan hidangan lainnya' },
]

export default function ProductsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['Semua', 'Edible Cutlery']

  const filteredProducts = products.filter(product => {
    const matchCategory = selectedCategory === 'Semua' || product.category === selectedCategory
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchCategory && matchSearch
  })

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
              <Link href="/products" className="text-green-600 font-medium text-sm border-b-2 border-green-600">
                Produk
              </Link>
              <Link href="/resources" className="text-gray-700 hover:text-green-600 transition text-sm font-medium">
                Resources
              </Link>
              <Link href="/distributors" className="text-gray-700 hover:text-green-600 transition text-sm font-medium">
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
              <Link href="/products" className="block w-full text-left px-4 py-2 text-sm text-green-600 font-medium bg-green-50">
                Produk
              </Link>
              <Link href="/resources" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Resources
              </Link>
              <Link href="/distributors" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Produk Kami</h1>
          <p className="text-lg text-gray-600">Temukan berbagai produk limbah organik dan edible cutlery berkualitas tinggi</p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Link href={`/product/${product.id}`} key={product.id}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition border border-gray-200 cursor-pointer h-full flex flex-col">
                    <div className="h-48 bg-gray-200 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded w-fit mb-2">
                        {product.category}
                      </span>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-lg font-bold text-green-600 mt-auto">{product.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Produk tidak ditemukan</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Mulai Berjualan Limbah Organik Anda</h2>
          <p className="text-lg mb-8 opacity-90">Dapatkan pembeli dari seluruh Indonesia</p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Upload Produk Sekarang
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
