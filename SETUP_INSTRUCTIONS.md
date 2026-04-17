# 🚀 Setup Instructions untuk WITARA Platform

Panduan step-by-step untuk setup Supabase dan menjalankan aplikasi.

---

## ✅ Checklist Setup

### Step 1: Verifikasi Environment Variables

```bash
# Buka file .env.local di root project
# Pastikan ada variable-variable ini:

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
POSTGRES_URL=postgresql://postgres:xxxxx@db.xxxxx.supabase.co:5432/postgres
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

**Jika belum ada, dapatkan dari Supabase Dashboard:**
1. Buka https://supabase.com/dashboard
2. Pilih project WITARA
3. Settings → API
4. Copy `Project URL` dan `anon public key`
5. Settings → Database
6. Copy connection string (POSTGRES_URL)

---

### Step 2: Setup Database (Create Tables)

**Option A: Menggunakan Python Script (Recommended)**

```bash
# Install dependencies
pip install psycopg2 python-dotenv

# Run migration
python scripts/run-migration.py

# Expected output:
# ✅ Connected to Supabase database
# ⏳ Running migration...
# ✅ Migration completed successfully!
```

**Option B: Menggunakan Supabase Dashboard**

1. Buka Supabase Dashboard → SQL Editor
2. Buka file `/scripts/01-init-database.sql`
3. Copy seluruh isi file
4. Paste ke SQL Editor di Supabase
5. Klik "Run" untuk execute SQL

**Expected Result:**
- Tabel `user_profiles` dibuat
- Tabel `waste_materials` dibuat
- RLS policies di-set otomatis
- Views & functions di-buat

---

### Step 3: Setup Storage Bucket

1. **Buka Supabase Dashboard**
2. Klik **Storage** di sidebar kiri
3. Klik **New Bucket**
4. Isi nama bucket: `waste-images`
5. **JANGAN** check "Public" untuk sekarang
6. Klik **Create Bucket**

---

### Step 4: Setup Storage RLS Policies

1. **Di Supabase Dashboard:**
   - Storage → waste-images → Policies
2. **Klik "New Policy"** → **Create a policy from scratch**
3. **Buat 3 policies:**

**Policy 1: Public Read**
```sql
CREATE POLICY "Public Read" ON storage.objects
FOR SELECT USING (bucket_id = 'waste-images')
```

**Policy 2: Authenticated Upload**
```sql
CREATE POLICY "Allow uploads for authenticated" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'waste-images' AND
  auth.role() = 'authenticated'
)
```

**Policy 3: Own File Delete**
```sql
CREATE POLICY "Delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'waste-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
```

---

### Step 5: Run Aplikasi

```bash
# Install dependencies (jika belum)
npm install

# Start dev server
npm run dev

# Application akan berjalan di:
# http://localhost:3000
```

---

## 🧪 Testing Aplikasi

### Test 1: Login/Register

1. **Buka** http://localhost:3000/login
2. **Isi form:**
   - Username: `testuser1`
   - Password: `password123`
3. **Klik "Masuk / Daftar"**
4. **Expected:** Redirect ke dashboard, user baru tercreate

**Verify di Supabase Dashboard:**
- SQL Editor → `SELECT * FROM user_profiles` → User baru muncul ✓
- SQL Editor → `SELECT * FROM auth.users` → User auth ada ✓

---

### Test 2: Upload Product

1. **Di dashboard user** → Klik **"Tambah Produk"**
2. **Isi form:**
   - Nama: "Limbah Beras Organik"
   - Deskripsi: "Limbah berkualitas tinggi dari pengolahan beras, siap diproses"
   - Harga: `50000`
   - Upload foto: (pilih foto dari komputer)
3. **Klik "Publikasikan Produk"**
4. **Expected:** Redirect ke dashboard, produk muncul di list

**Verify di Supabase:**
- SQL Editor → `SELECT * FROM waste_materials` → Produk muncul ✓
- Storage → waste-images → Foto tersimpan ✓

---

### Test 3: Browse Marketplace

1. **Buka** http://localhost:3000/marketplace
2. **Expected:** Lihat produk yang diupload user lain
3. **Test search:**
   - Cari "Beras"
   - Expected: Produk dengan "Beras" di nama atau deskripsi muncul
4. **Test sort:**
   - Sort by "Harga Terendah"
   - Expected: Produk diurutkan dari harga terendah
5. **Klik produk** → Lihat detail + info penjual

---

### Test 4: Product Detail & Seller Info

1. **Di marketplace** → Klik produk apapun
2. **Expected:**
   - Lihat gambar produk
   - Lihat deskripsi lengkap
   - Lihat info penjual (username, nama, kota)
   - Jika user sendiri: Tombol "Edit" & "Hapus"
   - Jika user lain: Tombol "Hubungi Penjual" & "Salin Username"

---

## 🐛 Troubleshooting

### Error: "POSTGRES_URL is not defined"

**Solusi:**
```bash
# Check .env.local file
cat .env.local

# Jika kosong, set env var manually:
export POSTGRES_URL="postgresql://..."
python scripts/run-migration.py
```

---

### Error: "Table does not exist"

**Sebab:** Migration SQL belum dijalankan

**Solusi:**
1. Buka Supabase Dashboard
2. SQL Editor
3. Jalankan script dari `/scripts/01-init-database.sql`

---

### Error: "Username sudah terdaftar"

**Sebab:** Username sudah ada di database (constraint UNIQUE)

**Solusi:** Gunakan username berbeda saat test

---

### Error: "Gambar tidak muncul di marketplace"

**Sebab:** Bucket atau storage policy tidak disetup

**Checklist:**
- [ ] Bucket "waste-images" sudah di-buat di Supabase Storage?
- [ ] Storage RLS policy "Public Read" sudah ada?
- [ ] Gambar ada di Storage → waste-images folder?

**Debug:**
```typescript
// Di browser console:
const { data: { session } } = await supabase.auth.getSession()

// List semua file di storage
const { data, error } = await supabase.storage
  .from('waste-images')
  .list()

console.log(data) // Lihat list file
```

---

### Error: "RLS policy denies this operation"

**Sebab:** User tidak punya permission untuk operasi tersebut (RLS enforce)

**Examples:**
- Update produk user lain → Denied
- Delete produk user lain → Denied
- Edit profile user lain → Denied

**Check:**
- Apakah user yang login = owner produk?
- Jika tidak, RLS akan block operasi

---

### Error: "No rows found"

**Sebab:** Query tidak menghasilkan data

**Checklist:**
- [ ] Apakah produk status='active'?
- [ ] Apakah product id benar?
- [ ] Apakah user sudah upload produk?

**Debug:**
```sql
-- Di Supabase SQL Editor
SELECT * FROM waste_materials;
SELECT * FROM user_profiles;
```

---

## 📚 Dokumentasi Lengkap

Baca dokumentasi ini untuk info lebih detail:

- **SUPABASE_SETUP.md** → Penjelasan database schema & RLS
- **SUPABASE_CODE_REFERENCE.md** → Contoh kode untuk setiap fitur
- **scripts/01-init-database.sql** → Database migration SQL

---

## 🎯 Fitur yang Sudah Siap

✅ Authentication (Login/Register dengan username)
✅ User Dashboard (Lihat produk sendiri)
✅ Upload Product (Dengan image upload ke Storage)
✅ Marketplace (Browse semua produk)
✅ Product Detail (Lihat detail + info penjual)
✅ Search & Filter (Cari & sort produk)
✅ Delete Product (User bisa hapus produk sendiri)
✅ RLS Protection (Data aman, user hanya akses data mereka)

---

## 🚀 Next Steps

Setelah setup selesai:

1. **Test semua fitur** dengan flow yang ada
2. **Add more features:**
   - Contact seller (messaging)
   - Favorite/wishlist
   - Product ratings & reviews
   - Payment integration
3. **Deploy ke Vercel:**
   ```bash
   # Push ke GitHub
   git add .
   git commit -m "feat: add supabase setup and database"
   git push origin main
   
   # Deploy via Vercel Dashboard
   ```

---

## 💬 Support

- **Error tidak terdaftar?** Buka `/user_read_only_context/v0_debug_logs.log`
- **Butuh help?** Hubungi support@witara.com

---

**Last Updated:** April 2024
**Status:** ✅ Ready for Development
