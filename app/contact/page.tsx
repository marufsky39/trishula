'use client'

import Link from 'next/link'
import { Menu, X, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitted(false)
    }, 2000)
  }

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
              <Link href="/distributors" className="text-gray-700 hover:text-green-600 transition text-sm font-medium">
                Distributor
              </Link>
              <Link href="/contact" className="text-green-600 font-medium text-sm border-b-2 border-green-600">
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
              <Link href="/distributors" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Distributor
              </Link>
              <Link href="/contact" className="block w-full text-left px-4 py-2 text-sm text-green-600 font-medium bg-green-50">
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Hubungi Kami</h1>
          <p className="text-lg text-gray-600">Kami siap membantu Anda. Hubungi kami dengan pertanyaan apapun</p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Email */}
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600 mb-1">Hubungi kami melalui email:</p>
              <a href="mailto:contact@witara.com" className="text-green-600 hover:text-green-700 font-medium">
                contact@witara.com
              </a>
              <p className="text-gray-600 mt-3 text-sm">Kami akan merespon dalam 24 jam</p>
            </div>

            {/* Phone */}
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Telepon</h3>
              <p className="text-gray-600 mb-1">Hubungi kami langsung:</p>
              <a href="tel:+622112345678" className="text-green-600 hover:text-green-700 font-medium">
                +62 21 1234 5678
              </a>
              <p className="text-gray-600 text-sm mt-3">Senin-Jumat, 09:00-17:00 WIB</p>
            </div>

            {/* Address */}
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Alamat</h3>
              <p className="text-gray-600">
                Jl. Sustainability No. 123<br />
                Jakarta 12345<br />
                Indonesia
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-lg shadow-md border border-gray-200 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Kirim Pesan</h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">Terima kasih! Pesan Anda telah terkirim.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nama Anda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subjek</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Subjek pesan Anda"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Tulis pesan Anda di sini..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 transition"
              >
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Ikuti Kami</h2>
          <div className="flex justify-center gap-6">
            <a href="#" className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition hover:text-blue-600 border border-gray-200">
              <Facebook size={24} />
            </a>
            <a href="#" className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition hover:text-pink-600 border border-gray-200">
              <Instagram size={24} />
            </a>
            <a href="#" className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition hover:text-blue-400 border border-gray-200">
              <Twitter size={24} />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Pertanyaan Umum (FAQ)</h2>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Bagaimana cara mendaftar?</h3>
              <p className="text-gray-600">Klik tombol Masuk/Daftar, isi username dan password, kemudian akun Anda akan otomatis terdaftar.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Berapa biaya untuk menjual produk?</h3>
              <p className="text-gray-600">Saat ini WITARA masih dalam fase pengembangan. Hubungi kami untuk informasi biaya terbaru.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Apakah produk berkualitas terjamin?</h3>
              <p className="text-gray-600">Ya, semua produk yang dijual di WITARA melalui verifikasi kualitas dari distributor terpercaya kami.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-2">Bagaimana proses pengiriman?</h3>
              <p className="text-gray-600">Kami bekerja sama dengan kurir terpercaya. Pengiriman dapat disesuaikan dengan kebutuhan Anda.</p>
            </div>
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
              <p className="text-gray-400 text-sm">Platform limbah organik berkelanjutan untuk masa depan.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Menu</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-white transition">Beranda</Link></li>
                <li><Link href="/about" className="hover:text-white transition">Tentang</Link></li>
                <li><Link href="/products" className="hover:text-white transition">Produk</Link></li>
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
