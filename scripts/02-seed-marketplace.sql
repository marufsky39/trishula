-- ============================================================================
-- WITARA Marketplace - Seed Data untuk Demo
-- ============================================================================
-- Script ini membuat user profile sample dan produk sample
-- untuk demo marketplace agar tidak terlihat kosong
-- 
-- PENTING: User profiles di bawah HARUS memiliki user_id yang sesuai dengan
-- user yang sudah ada di auth.users table. 
-- Jika ingin test dengan UUID dummy, pastikan RLS policies sudah dienable.
-- ============================================================================

-- ============================================================================
-- STEP 1: Insert Sample User Profiles (jika belum ada)
-- ============================================================================
-- NOTE: Ganti UUID di bawah dengan actual user IDs dari auth.users table
-- Atau uncomment dan modifikasi sesuai kebutuhan

-- User #1: Penjual Tepung Organik
INSERT INTO user_profiles (
  id, 
  username, 
  full_name, 
  bio, 
  phone, 
  address, 
  city, 
  province, 
  postal_code
) VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  'penjual_tepung',
  'PT Organik Sejati',
  'Supplier terpercaya tepung organik berkualitas tinggi dari Jawa Tengah',
  '081234567890',
  'Jln. Merdeka No. 123',
  'Semarang',
  'Jawa Tengah',
  '50123'
) ON CONFLICT (id) DO NOTHING;

-- User #2: Penjual Limbah Pangan
INSERT INTO user_profiles (
  id, 
  username, 
  full_name, 
  bio, 
  phone, 
  address, 
  city, 
  province, 
  postal_code
) VALUES (
  '22222222-2222-2222-2222-222222222222'::uuid,
  'limbah_pangan_jogja',
  'Tani Jaya Indonesia',
  'Bahan limbah pangan organik berkualitas dari perkebunan dan pertanian organik',
  '082345678901',
  'Jln. Ahmad Yani No. 456',
  'Yogyakarta',
  'Daerah Istimewa Yogyakarta',
  '55123'
) ON CONFLICT (id) DO NOTHING;

-- User #3: Penjual Biji-bijian Organik
INSERT INTO user_profiles (
  id, 
  username, 
  full_name, 
  bio, 
  phone, 
  address, 
  city, 
  province, 
  postal_code
) VALUES (
  '33333333-3333-3333-3333-333333333333'::uuid,
  'organik_bandung',
  'CV Biji Organik Nusantara',
  'Distributor resmi biji-bijian organik dengan sertifikat internasional',
  '083456789012',
  'Jln. Sudirman No. 789',
  'Bandung',
  'Jawa Barat',
  '40123'
) ON CONFLICT (id) DO NOTHING;

-- User #4: Penjual Kompos Organik
INSERT INTO user_profiles (
  id, 
  username, 
  full_name, 
  bio, 
  phone, 
  address, 
  city, 
  province, 
  postal_code
) VALUES (
  '44444444-4444-4444-4444-444444444444'::uuid,
  'kompos_jakarta',
  'PT Hijau Lestari',
  'Produsen kompos berkualitas premium dari limbah organik terfermentasi',
  '084567890123',
  'Jln. Gatot Subroto No. 100',
  'Jakarta',
  'DKI Jakarta',
  '12950'
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- STEP 2: Insert Sample Products (Waste Materials)
-- ============================================================================
-- Produk sample dengan deskripsi detail dan harga realistis

-- Product #1: Tepung Tapioka Organik
INSERT INTO waste_materials (
  id,
  user_id,
  name,
  description,
  price,
  image_url,
  status,
  created_at
) VALUES (
  '51111111-1111-1111-1111-111111111111'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  'Tepung Tapioka Organik 25kg',
  'Tepung tapioka berkualitas tinggi dari singkong organik pilihan. Cocok untuk berbagai industri makanan, tekstil, dan kosmetik. Telah tersertifikasi organik internasional. Kemasan premium dengan standar food grade.',
  125000,
  'https://images.unsplash.com/photo-1585707572537-9d69a447a0be?w=500&h=500&fit=crop',
  'active',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Product #2: Dedak Padi Organik
INSERT INTO waste_materials (
  id,
  user_id,
  name,
  description,
  price,
  image_url,
  status,
  created_at
) VALUES (
  '52222222-2222-2222-2222-222222222222'::uuid,
  '11111111-1111-1111-1111-111111111111'::uuid,
  'Dedak Padi Organik 50kg',
  'Limbah penggilingan padi organik yang kaya serat dan nutrisi. Sangat baik untuk pakan ternak dan pupuk organik. Harga murah dengan kualitas terjamin. Dapat dikirim dalam jumlah besar.',
  85000,
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=500&fit=crop',
  'active',
  NOW() - INTERVAL '2 days'
) ON CONFLICT (id) DO NOTHING;

-- Product #3: Ampas Kopi Organik
INSERT INTO waste_materials (
  id,
  user_id,
  name,
  description,
  price,
  image_url,
  status,
  created_at
) VALUES (
  '53333333-3333-3333-3333-333333333333'::uuid,
  '22222222-2222-2222-2222-222222222222'::uuid,
  'Ampas Kopi Organik 10kg',
  'Sisa produksi kopi arabika organik berkualitas tinggi. Sempurna untuk vermikompos, pupuk organik, dan bahan pengolahan limbah. Aromatik alami dan ramah lingkungan. Stok terbatas!',
  45000,
  'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=500&h=500&fit=crop',
  'active',
  NOW() - INTERVAL '5 days'
) ON CONFLICT (id) DO NOTHING;

-- Product #4: Kulit Kacang Organik
INSERT INTO waste_materials (
  id,
  user_id,
  name,
  description,
  price,
  image_url,
  status,
  created_at
) VALUES (
  '54444444-4444-4444-4444-444444444444'::uuid,
  '22222222-2222-2222-2222-222222222222'::uuid,
  'Kulit Kacang Organik 20kg',
  'Limbah pengolahan kacang organik pilihan. Cocok untuk bahan baku biofuel, pupuk, dan pakan ternak. Efisien dari segi biaya dan ramah lingkungan. Supplier terpercaya untuk kebutuhan industri.',
  55000,
  'https://images.unsplash.com/photo-1585518419759-bff2c0dfd7a3?w=500&h=500&fit=crop',
  'active',
  NOW() - INTERVAL '7 days'
) ON CONFLICT (id) DO NOTHING;

-- Product #5: Biji Bunga Matahari Organik
INSERT INTO waste_materials (
  id,
  user_id,
  name,
  description,
  price,
  image_url,
  status,
  created_at
) VALUES (
  '55555555-5555-5555-5555-555555555555'::uuid,
  '33333333-3333-3333-3333-333333333333'::uuid,
  'Biji Bunga Matahari Organik 15kg',
  'Biji bunga matahari berkualitas premium dari perkebunan organik. Tinggi kandungan protein dan lemak sehat. Ideal untuk minyak nabati, pakan ternak, dan makanan kesehatan. Sertifikat organik internasional lengkap.',
  165000,
  'https://images.unsplash.com/photo-1585518419759-bff2c0dfd7a3?w=500&h=500&fit=crop',
  'active',
  NOW() - INTERVAL '3 days'
) ON CONFLICT (id) DO NOTHING;

-- Product #6: Kompos Matang Organik
INSERT INTO waste_materials (
  id,
  user_id,
  name,
  description,
  price,
  image_url,
  status,
  created_at
) VALUES (
  '56666666-6666-6666-6666-666666666666'::uuid,
  '44444444-4444-4444-4444-444444444444'::uuid,
  'Kompos Matang Premium 50kg',
  'Kompos matang berkualitas premium dari limbah organik terfermentasi sempurna. Kaya nutrisi dengan kandungan C/N ratio optimal. Cocok untuk pertanian organik dan perkebunan profesional. Bau minimal, siap pakai.',
  95000,
  'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&h=500&fit=crop',
  'active',
  NOW() - INTERVAL '4 days'
) ON CONFLICT (id) DO NOTHING;

-- Product #7: Serbuk Gergaji Organik
INSERT INTO waste_materials (
  id,
  user_id,
  name,
  description,
  price,
  image_url,
  status,
  created_at
) VALUES (
  '57777777-7777-7777-7777-777777777777'::uuid,
  '44444444-4444-4444-4444-444444444444'::uuid,
  'Serbuk Gergaji Organik 30kg',
  'Limbah kayu dari penggergajian proses organik. Sangat baik sebagai bahan mulsa, bedding hewan, dan kompos. Hemat biaya dengan kualitas terjamin. Pengiriman cepat untuk area Jabodetabek dan sekitarnya.',
  35000,
  'https://images.unsplash.com/photo-1559056199-641a0ac8b3f4?w=500&h=500&fit=crop',
  'active',
  NOW() - INTERVAL '1 day'
) ON CONFLICT (id) DO NOTHING;

-- Product #8: Cangkang Kacang Tanah Organik
INSERT INTO waste_materials (
  id,
  user_id,
  name,
  description,
  price,
  image_url,
  status,
  created_at
) VALUES (
  '58888888-8888-8888-8888-888888888888'::uuid,
  '33333333-3333-3333-3333-333333333333'::uuid,
  'Cangkang Kacang Tanah Organik 25kg',
  'Limbah kulit kacang tanah organik berkualitas premium. Berguna sebagai bahan bakar biomassa, pupuk, dan bahan pengisi. Harga kompetitif dengan volume besar. Dapat dipesan dalam jumlah ton untuk kebutuhan industri besar.',
  42000,
  'https://images.unsplash.com/photo-1585707572537-9d69a447a0be?w=500&h=500&fit=crop',
  'active',
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- RESULT
-- ============================================================================
-- Script selesai! Database sekarang memiliki:
-- - 4 user profiles sample
-- - 8 waste materials (produk) untuk marketplace
-- - Semua produk dalam status 'active'
-- 
-- Untuk testing:
-- 1. Sesuaikan UUID di atas dengan user yang sebenarnya
-- 2. Atau buat user baru dulu di Supabase Auth
-- 3. Jalankan script ini melalui SQL Editor di Supabase Dashboard
-- 4. Refresh marketplace page untuk melihat produk baru
-- ============================================================================

SELECT 'Seed data berhasil diinsert! Jumlah produk: ' || COUNT(*)::text FROM waste_materials;
