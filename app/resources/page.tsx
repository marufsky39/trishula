'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function ResourcesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const events = [
    { id: 1, title: 'Webinar Sustainability 2024', date: '25 Mei 2024', desc: 'Pembahasan mendalam tentang praktik keberlanjutan di industri limbah organik' },
    { id: 2, title: 'Workshop Komposting Organik', date: '30 Mei 2024', desc: 'Belajar cara membuat kompos berkualitas tinggi dari limbah organik' },
    { id: 3, title: 'Expo Limbah Organik Indonesia', date: '10 Juni 2024', desc: 'Pertemuan antara penjual dan pembeli limbah organik se-Indonesia' },
    { id: 4, title: 'Training Edible Cutlery', date: '15 Juni 2024', desc: 'Pelatihan tentang produksi dan manfaat edible cutlery' },
  ]

  const news = [
    { id: 1, title: 'WITARA Capai 2.5K Pengguna Aktif', date: '10 Mei 2024', desc: 'Milestone penting dalam perjalanan kami menuju ekosistem limbah organik yang berkelanjutan' },
    { id: 2, title: 'Bermitra dengan 50+ Distributor Indonesia', date: '5 Mei 2024', desc: 'Jaringan distribusi kami kini menjangkau lebih dari 50 mitra di seluruh negara' },
    { id: 3, title: 'Peluncuran Edible Cutlery Premium', date: '1 Mei 2024', desc: 'Produk terbaru kami dengan rasa alami dan kualitas premium siap hadir' },
  ]

  const galleryImages = [
    { id: 1, title: 'Webinar Keberlanjutan', image: '/gallery-1.jpg' },
    { id: 2, title: 'Expo Limbah Organik', image: '/gallery-2.jpg' },
    { id: 3, title: 'Kemitraan Distributor', image: '/gallery-3.jpg' },
    { id: 4, title: 'Fasilitas Produksi', image: '/gallery-4.jpg' },
  ]

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
              <Link href="/resources" className="text-green-600 font-medium text-sm border-b-2 border-green-600">
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
              <Link href="/products" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Produk
              </Link>
              <Link href="/resources" className="block w-full text-left px-4 py-2 text-sm text-green-600 font-medium bg-green-50">
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Resources</h1>
          <p className="text-lg text-gray-600">Event, Galeri, dan Berita Terkini</p>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Event Mendatang</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📅</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{event.title}</h3>
                    <p className="text-sm text-green-600 font-medium mb-2">{event.date}</p>
                    <p className="text-gray-600 text-sm">{event.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Galeri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryImages.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedImage(item.image)}
                className="relative h-64 rounded-lg overflow-hidden cursor-pointer group"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
                  <span className="text-white text-center opacity-0 group-hover:opacity-100 transition font-semibold px-4">
                    {item.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Berita & Update Terbaru</h2>
          <div className="space-y-6">
            {news.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📰</div>
                  <div className="flex-grow">
                    <p className="text-sm text-gray-500 mb-2">{item.date}</p>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-4">{item.desc}</p>
                    <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                      Baca Selengkapnya →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-2xl w-full">
            <img
              src={selectedImage}
              alt="Gallery"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}

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
