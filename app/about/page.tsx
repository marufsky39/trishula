'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
              <Link href="/about" className="text-green-600 font-medium text-sm border-b-2 border-green-600">
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
              <Link href="/about" className="block w-full text-left px-4 py-2 text-sm text-green-600 font-medium bg-green-50">
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

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Tentang WITARA</h1>
            <p className="text-xl text-gray-600">Inovasi Peralatan Makan Ramah Lingkungan</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <img
                src="/edible-cutlery.jpg"
                alt="Edible cutlery products"
                className="rounded-xl shadow-lg w-full h-96 object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Visi Kami</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                WITARA adalah perusahaan inovatif yang mengembangkan dan memproduksi peralatan makan yang dapat dimakan (edible cutlery). Produk kami 100% biodegradable, aman dikonsumsi, dan dirancang untuk mengurangi sampah plastik dalam kehidupan sehari-hari.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Kami percaya bahwa setiap produk yang kami hasilkan berkontribusi pada masa depan yang lebih berkelanjutan. Dengan teknologi terdepan, kami menciptakan solusi praktis yang tidak mengorbankan lingkungan.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Melalui marketplace kami, limbah organik yang biasanya dianggap sampah dapat diubah menjadi sumber daya berharga untuk industri, pertanian, dan kehidupan sehari-hari.
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🌍</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Keberlanjutan Lingkungan</h3>
                    <p className="text-sm text-gray-600">Mengurangi limbah dan mendukung ekonomi sirkular</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🤝</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Kepercayaan & Transparansi</h3>
                    <p className="text-sm text-gray-600">Transaksi aman dengan penjual dan pembeli terpercaya</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🚀</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">Inovasi Teknologi</h3>
                    <p className="text-sm text-gray-600">Platform digital yang mudah digunakan dan terpercaya</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-white rounded-xl p-12 shadow-lg border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Nilai-Nilai Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">♻️</div>
                <h3 className="font-bold text-gray-900 mb-2">Sirkular</h3>
                <p className="text-gray-600 text-sm">Mengubah limbah menjadi sumber daya</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🌱</div>
                <h3 className="font-bold text-gray-900 mb-2">Berkelanjutan</h3>
                <p className="text-gray-600 text-sm">Produk ramah lingkungan untuk masa depan</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="font-bold text-gray-900 mb-2">Aman</h3>
                <p className="text-gray-600 text-sm">Transaksi dan kualitas terjamin</p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">💡</div>
                <h3 className="font-bold text-gray-900 mb-2">Inovatif</h3>
                <p className="text-gray-600 text-sm">Solusi terdepan untuk masa depan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Tim Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center border border-gray-200">
              <div className="w-24 h-24 bg-gradient-to-br from-green-300 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                👨‍💼
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Budi Santoso</h3>
              <p className="text-green-600 font-medium mb-2">Founder & CEO</p>
              <p className="text-gray-600 text-sm">Visioner dalam ekonomi sirkular dan sustainability</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center border border-gray-200">
              <div className="w-24 h-24 bg-gradient-to-br from-green-300 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                👩‍💻
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Siti Nurhaliza</h3>
              <p className="text-green-600 font-medium mb-2">CTO</p>
              <p className="text-gray-600 text-sm">Ahli teknologi platform e-commerce</p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center border border-gray-200">
              <div className="w-24 h-24 bg-gradient-to-br from-green-300 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                👨‍🌾
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Ahmad Wijaya</h3>
              <p className="text-green-600 font-medium mb-2">Head of Operations</p>
              <p className="text-gray-600 text-sm">Berpengalaman dalam logistik limbah organik</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Jadilah Bagian dari Solusi Berkelanjutan</h2>
          <p className="text-lg mb-8 opacity-90">Gunakan produk WITARA dan bantu kurangi sampah plastik</p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Hubungi Kami
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
              <p className="text-gray-400 text-sm">Platform limbah organik berkelanjutan untuk masa depan.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Menu</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-white transition">Beranda</Link></li>
                <li><Link href="/products" className="hover:text-white transition">Produk</Link></li>
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
