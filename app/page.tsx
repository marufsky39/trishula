'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
              <Link href="/" className="text-green-600 font-medium text-sm border-b-2 border-green-600">
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
              <Link href="/distributors" className="text-gray-700 hover:text-green-600 transition text-sm font-medium">
                Distributor
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-green-600 transition text-sm font-medium">
                Kontak
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/marketplace"
                className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition"
              >
                Jelajahi Marketplace
              </Link>
              <Link
                href="/upload"
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
              >
                Jual Produk
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
              <Link href="/" className="block w-full text-left px-4 py-2 text-sm text-green-600 font-medium bg-green-50">
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
              <Link href="/distributors" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Distributor
              </Link>
              <Link href="/contact" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Kontak
              </Link>
              <div className="px-4 py-2 space-y-2 border-t border-gray-200 mt-2 pt-2">
                <Link
                  href="/marketplace"
                  className="block w-full px-4 py-2 text-center text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-50"
                >
                  Jelajahi Marketplace
                </Link>
                <Link
                  href="/upload"
                  className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Jual Produk
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-20 px-4 bg-gradient-to-br from-green-50 via-white to-amber-50">
        <div className="max-w-7xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">
                  🌿 Solusi Limbah Organik Berkelanjutan
                </span>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
                  <span className="text-green-600">Peralatan Makan Edible</span> Ramah Lingkungan
                </h1>
                <p className="text-xl text-gray-600">
                  WITARA menghadirkan inovasi terdepan dalam peralatan makan yang dapat dimakan (edible cutlery) dan solusi limbah organik berkualitas tinggi. Produk kami 100% biodegradable, aman dikonsumsi, dan mendukung ekonomi sirkular.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-block px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition text-center text-lg"
                >
                  Lihat Produk Kami
                </Link>
                <Link
                  href="/contact"
                  className="inline-block px-8 py-4 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition text-center text-lg"
                >
                  Hubungi Kami
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <p className="text-4xl font-bold text-green-600">150+</p>
                  <p className="text-gray-600">Produk Aktif</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-green-600">2.5K+</p>
                  <p className="text-gray-600">Pengguna Aktif</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-green-600">50+</p>
                  <p className="text-gray-600">Distributor</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="hidden md:block">
              <img
                src="/hero-organic.jpg"
                alt="WITARA Platform"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Jelajahi WITARA</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <Link href="/about" className="group">
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-green-400 transition text-center h-full flex flex-col">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Tentang Kami</h3>
                <p className="text-gray-600 flex-grow">Pelajari visi dan misi WITARA dalam mendukung keberlanjutan lingkungan</p>
                <div className="text-green-600 font-medium mt-4 group-hover:translate-x-1 transition">
                  Selengkapnya →
                </div>
              </div>
            </Link>

            {/* Card 2 */}
            <Link href="/products" className="group">
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-green-400 transition text-center h-full flex flex-col">
                <div className="text-5xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Produk</h3>
                <p className="text-gray-600 flex-grow">Temukan berbagai produk limbah organik dan edible cutlery berkualitas</p>
                <div className="text-green-600 font-medium mt-4 group-hover:translate-x-1 transition">
                  Lihat Produk →
                </div>
              </div>
            </Link>

            {/* Card 3 */}
            <Link href="/resources" className="group">
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-green-400 transition text-center h-full flex flex-col">
                <div className="text-5xl mb-4">📰</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Resources</h3>
                <p className="text-gray-600 flex-grow">Event, galeri, dan berita terbaru dari WITARA dan komunitas</p>
                <div className="text-green-600 font-medium mt-4 group-hover:translate-x-1 transition">
                  Jelajahi →
                </div>
              </div>
            </Link>

            {/* Card 4 */}
            <Link href="/contact" className="group">
              <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 hover:shadow-lg hover:border-green-400 transition text-center h-full flex flex-col">
                <div className="text-5xl mb-4">📞</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Kontak</h3>
                <p className="text-gray-600 flex-grow">Hubungi kami dengan pertanyaan atau saran tentang WITARA</p>
                <div className="text-green-600 font-medium mt-4 group-hover:translate-x-1 transition">
                  Hubungi →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Mulai Jual atau Belanja Sekarang</h2>
          <p className="text-xl mb-8 opacity-90">
            Tidak perlu login! Jelajahi marketplace atau mulai jual limbah organik Anda segera
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/marketplace"
              className="inline-block px-10 py-4 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition text-lg"
            >
              Jelajahi Marketplace
            </Link>
            <Link
              href="/upload"
              className="inline-block px-10 py-4 bg-green-700 text-white font-bold rounded-lg hover:bg-green-800 transition text-lg border-2 border-white"
            >
              Jual Produk
            </Link>
          </div>
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
              <p className="text-gray-400 text-sm">Platform limbah organik berkelanjutan untuk masa depan yang lebih baik.</p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Menu Utama</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-white transition">Tentang Kami</Link></li>
                <li><Link href="/products" className="hover:text-white transition">Produk</Link></li>
                <li><Link href="/distributors" className="hover:text-white transition">Distributor</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Kebijakan</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-white transition">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Kontak</h4>
              <p className="text-gray-400 text-sm mb-2">contact@witara.com</p>
              <p className="text-gray-400 text-sm">+62 21 1234 5678</p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 WITARA. Semua hak dilindungi. Solusi Limbah Organik Berkelanjutan untuk Masa Depan.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
