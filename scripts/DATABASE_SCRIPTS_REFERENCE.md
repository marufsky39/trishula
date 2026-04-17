# Database Scripts Reference - WITARA Marketplace

Dokumentasi lengkap untuk semua script database yang tersedia di folder `/scripts`.

## Overview

Aplikasi WITARA menggunakan Supabase PostgreSQL untuk menyimpan data. Folder `scripts/` berisi SQL migration files dan Python scripts untuk setup dan seeding database.

---

## File Scripts

### 1. `01-init-database.sql` ⭐ Main Database Schema

**Tujuan:** Membuat struktur database awal (initial setup)

**Apa yang dilakukan:**
- Membuat table `user_profiles` - menyimpan profil pengguna
- Membuat table `waste_materials` - menyimpan produk limbah organik
- Setup Row Level Security (RLS) policies untuk keamanan
- Membuat indexes untuk optimasi query

**Jalankan kapan:**
- Pertama kali setup project
- Reset database ke state awal

**Cara menjalankan:**

**Via Supabase Dashboard SQL Editor:**
```
1. Login ke Supabase Dashboard
2. Buka project WITARA
3. Go to SQL Editor
4. Click "New Query"
5. Copy-paste seluruh isi file 01-init-database.sql
6. Click "Run"
```

**Via Python Script:**
```bash
cd scripts
python run-migration.py
```

---

### 2. `02-seed-marketplace.sql` 🌱 Sample Data/Demo Products

**Tujuan:** Menambahkan data sample agar marketplace tidak kosong

**Apa yang dilakukan:**
- Membuat 4 user profiles sample (penjual)
- Membuat 8 produk sample (waste materials)
- Produk sample mencakup berbagai kategori limbah organik
- Menggunakan gambar dari Unsplash untuk preview

**Jalankan kapan:**
- Setelah `01-init-database.sql` berhasil
- Saat testing/demo aplikasi
- Untuk populate marketplace dengan data awal

**Penting!**
⚠️ UUID di script ini adalah dummy untuk demo saja. 
Jika Anda ingin menggunakan user yang sebenarnya:
1. Buat user baru di Supabase Auth
2. Copy UUID user dari `auth.users` table
3. Replace UUID di script `02-seed-marketplace.sql` dengan UUID yang sebenarnya

**Contoh cara mendapatkan user UUID:**
```sql
-- Di Supabase SQL Editor, jalankan:
SELECT id, email FROM auth.users;

-- Copy UUID yang muncul, contoh:
-- 123e4567-e89b-12d3-a456-426614174000

-- Ganti di 02-seed-marketplace.sql:
INSERT INTO user_profiles (id, ...) VALUES (
  '123e4567-e89b-12d3-a456-426614174000'::uuid,
  ...
)
```

**Cara menjalankan:**

**Via Supabase Dashboard:**
```
1. Login ke Supabase Dashboard
2. Go to SQL Editor
3. Click "New Query"
4. Copy-paste isi file 02-seed-marketplace.sql (SETELAH edit UUID!)
5. Click "Run"
```

---

### 3. `run-migration.py` 🐍 Python Migration Runner

**Tujuan:** Script Python untuk menjalankan SQL migrations otomatis

**Fitur:**
- Membaca file SQL dari folder scripts/
- Menjalankan migrations ke Supabase
- Error handling dan connection management
- Tracking migration status

**Prerequisites:**
```bash
pip install python-dotenv supabase
```

**Setup Environment Variables:**
```bash
# Pastikan .env project sudah memiliki:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Cara menggunakan:**
```bash
cd /vercel/share/v0-project
python scripts/run-migration.py
```

**Expected Output:**
```
Supabase Connected Successfully!
Running migration: 01-init-database.sql
Migration 01-init-database.sql completed successfully!
Running migration: 02-seed-marketplace.sql
Migration 02-seed-marketplace.sql completed successfully!
```

---

## Database Schema Details

### Table: `user_profiles`

Menyimpan informasi profil pengguna yang lebih lengkap dari `auth.users`.

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  bio TEXT,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(50),
  province VARCHAR(50),
  postal_code VARCHAR(10),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `id` - User ID dari Supabase Auth (primary key)
- `username` - Nama unik pengguna (required, min 3 chars)
- `full_name` - Nama lengkap pengguna
- `bio` - Bio/deskripsi singkat
- `phone` - Nomor telepon
- `address` - Alamat lengkap
- `city` - Kota
- `province` - Provinsi
- `postal_code` - Kode pos
- `avatar_url` - URL ke foto profil

**Indexes:**
- `idx_user_profiles_username` - Untuk pencarian username cepat
- `idx_user_profiles_created_at` - Untuk sorting berdasarkan waktu

**RLS Policies:**
- SELECT: Semua orang bisa lihat profil user
- INSERT: User baru bisa membuat profil sendiri
- UPDATE: User hanya bisa update profil sendiri

---

### Table: `waste_materials`

Menyimpan data produk limbah organik yang dijual.

```sql
CREATE TABLE waste_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**
- `id` - Product ID (auto-generated UUID)
- `user_id` - ID penjual (foreign key ke user_profiles)
- `name` - Nama produk (required)
- `description` - Deskripsi lengkap (required)
- `price` - Harga produk dalam Rupiah (required, harus > 0)
- `image_url` - URL ke gambar produk
- `status` - Status produk: 'active', 'sold', 'inactive'
- `created_at` - Waktu pembuatan
- `updated_at` - Waktu update terakhir

**Indexes:**
- `idx_waste_materials_user_id` - Untuk query produk per user
- `idx_waste_materials_created_at` - Untuk sorting terbaru
- `idx_waste_materials_status` - Untuk filter by status
- `idx_waste_materials_name` - Full text search untuk nama produk
- `idx_waste_materials_description` - Full text search untuk deskripsi

**RLS Policies:**
- SELECT: Semua orang bisa lihat produk dengan status 'active'
- INSERT: User authenticated bisa membuat produk
- UPDATE: User hanya bisa update produk mereka sendiri
- DELETE: User hanya bisa delete produk mereka sendiri

---

## Common Operations

### 1. Melihat semua produk di marketplace

```sql
SELECT 
  w.id,
  w.name,
  w.price,
  w.description,
  u.username as seller_username,
  w.created_at
FROM waste_materials w
LEFT JOIN user_profiles u ON w.user_id = u.id
WHERE w.status = 'active'
ORDER BY w.created_at DESC;
```

### 2. Melihat produk spesifik dengan seller info

```sql
SELECT 
  w.*,
  u.username,
  u.full_name,
  u.phone,
  u.city
FROM waste_materials w
LEFT JOIN user_profiles u ON w.user_id = u.id
WHERE w.id = 'YOUR_PRODUCT_ID'::uuid;
```

### 3. Melihat semua produk dari seller tertentu

```sql
SELECT * FROM waste_materials
WHERE user_id = 'USER_ID_UUID'::uuid
AND status = 'active'
ORDER BY created_at DESC;
```

### 4. Update status produk menjadi "sold"

```sql
UPDATE waste_materials
SET status = 'sold', updated_at = NOW()
WHERE id = 'PRODUCT_ID'::uuid
AND user_id = 'USER_ID'::uuid;
```

### 5. Hapus produk

```sql
DELETE FROM waste_materials
WHERE id = 'PRODUCT_ID'::uuid
AND user_id = 'USER_ID'::uuid;
```

### 6. Search produk berdasarkan keyword

```sql
SELECT * FROM waste_materials
WHERE to_tsvector('indonesian', name || ' ' || description) 
      @@ plainto_tsquery('indonesian', 'tepung organik')
AND status = 'active'
ORDER BY created_at DESC;
```

---

## Troubleshooting

### Error: "permission denied for schema public"
**Solusi:** Pastikan user Supabase punya akses. Gunakan service role key untuk migrations.

### Error: "duplicate key value violates unique constraint"
**Solusi:** UUID sudah ada. Ganti UUID di script dengan yang baru.

### Products tidak muncul di marketplace
**Periksa:**
1. Products sudah di-insert ke table waste_materials
2. Status produk = 'active' (bukan 'sold' atau 'inactive')
3. User profiles sudah created (FK constraint)
4. RLS policies sudah enabled dan tidak blocking SELECT

### Images tidak tampil
**Solusi:** 
- Pastikan image_url adalah URL valid (dari Unsplash, CDN, atau Supabase Storage)
- Jika menggunakan Supabase Storage, pastikan file sudah uploaded
- Check browser console untuk error messages

---

## Best Practices

1. **Always backup sebelum drop tables:**
   ```sql
   -- Backup data sebelum migrasi
   CREATE TABLE waste_materials_backup AS 
   SELECT * FROM waste_materials;
   ```

2. **Use transactions untuk operasi penting:**
   ```sql
   BEGIN;
   -- Multiple operations
   UPDATE waste_materials SET status = 'sold' WHERE id = '...';
   DELETE FROM user_profiles WHERE id = '...';
   COMMIT;
   ```

3. **Monitor RLS policies:**
   - Selalu enable RLS untuk table yang menyimpan user data
   - Test RLS policies setelah membuat table baru
   - Dokumentasikan setiap policy apa tujuannya

4. **Optimize queries dengan indexes:**
   - Check explain plan sebelum produksi: `EXPLAIN ANALYZE SELECT ...`
   - Pastikan query menggunakan index
   - Monitor slow queries di Supabase dashboard

5. **Validate data sebelum insert:**
   - Check constraints sudah set di table definition
   - Validate email, phone format di application layer
   - Sanitize input untuk prevent SQL injection

---

## Next Steps

1. ✅ Jalankan `01-init-database.sql` - setup database
2. ✅ Jalankan `02-seed-marketplace.sql` - tambah sample data
3. ✅ Test marketplace di aplikasi
4. ✅ Buat user baru via UI login/signup
5. ✅ Upload produk pertama via marketplace
6. ✅ Lihat di marketplace apakah muncul dengan benar

---

## References

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- [Full Text Search](https://supabase.com/docs/guides/database/full-text-search)
- [API Documentation](https://supabase.com/docs/reference/javascript)

---

Last Updated: April 17, 2024
Maintainer: WITARA Dev Team
