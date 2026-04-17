# Supabase Setup Guide untuk WITARA Platform

## 📋 Daftar Isi
1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [Authentication](#authentication)
4. [Storage Setup](#storage-setup)
5. [Row Level Security (RLS)](#row-level-security)
6. [Kode Implementasi](#kode-implementasi)
7. [Testing & Troubleshooting](#testing--troubleshooting)

---

## Overview

WITARA adalah platform marketplace untuk menjual dan membeli limbah organik (waste materials). Platform ini menggunakan:
- **Supabase Authentication** untuk login/register
- **Supabase PostgreSQL Database** untuk menyimpan data
- **Supabase Storage** untuk menyimpan gambar produk

### Fitur Utama Platform:
- ✅ Login/Register dengan username dan password
- ✅ User dapat upload produk limbah organik
- ✅ User dapat browse marketplace dengan search & filter
- ✅ User dapat melihat detail produk dan info penjual
- ✅ Image upload untuk setiap produk
- ✅ Dashboard user dengan statistik produk

---

## Database Schema

### Tabel 1: `user_profiles`

Menyimpan informasi profil pengguna yang lebih lengkap dari Supabase Auth.

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY -- Link ke auth.users
  username VARCHAR(50) UNIQUE -- Username unik untuk login (3+ karakter)
  full_name VARCHAR(100) -- Nama lengkap penjual
  bio TEXT -- Deskripsi profil
  phone VARCHAR(20) -- Nomor telpon
  address TEXT -- Alamat lengkap
  city VARCHAR(50) -- Kota
  province VARCHAR(50) -- Provinsi
  postal_code VARCHAR(10) -- Kode pos
  avatar_url TEXT -- URL foto profil
  created_at TIMESTAMP -- Waktu membuat profil
  updated_at TIMESTAMP -- Waktu update profil
)
```

**Kegunaan:**
- Menyimpan data panjang user yang tidak cocok di auth.users
- Username digunakan untuk identifikasi user di platform
- Informasi alamat & kontak untuk komunikasi penjual-pembeli

---

### Tabel 2: `waste_materials`

Menyimpan data produk limbah organik yang dijual di marketplace.

```sql
CREATE TABLE waste_materials (
  id UUID PRIMARY KEY -- ID unik produk
  user_id UUID -- ID user/penjual (relasi ke user_profiles)
  
  -- Informasi Produk
  name VARCHAR(200) -- Nama produk
  description TEXT -- Deskripsi lengkap
  price DECIMAL(12, 2) -- Harga dalam Rp
  
  -- Media
  image_url TEXT -- URL gambar produk dari Storage
  
  -- Status
  status VARCHAR(20) -- active / sold / inactive
  
  -- Timestamps
  created_at TIMESTAMP -- Waktu upload produk
  updated_at TIMESTAMP -- Waktu edit produk terakhir
)
```

**Kegunaan:**
- Menyimpan semua produk limbah organik yang dijual
- Gambar disimpan di Storage, URL disimpan di database
- Status untuk menandai apakah produk masih aktif/terjual/dinonaktifkan

---

### Relasi Antar Tabel

```
auth.users (Supabase Auth)
    |
    | (1:1) - Link ke user profile
    v
user_profiles
    |
    | (1:N) - User punya banyak produk
    v
waste_materials
```

---

## Authentication

### Proses Login/Register di WITARA

Platform menggunakan **Username + Password** (bukan email) sebagai login method.

#### 1. Alur Login/Register

```typescript
// 1. User masukkan username dan password
const username = "johndoe"
const password = "password123"

// 2. Generate valid email (email diperlukan Supabase Auth, tapi dikonversi dari username)
const emailToUse = `${username.toLowerCase()}${Date.now()}@witara.local`

// 3. Coba login dengan email yang di-generate
const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
  email: emailToUse,
  password: password
})

// 4. Jika gagal (user baru), daftar user baru
if (signInError) {
  const { data: signUpData } = await supabase.auth.signUp({
    email: emailToUse,
    password: password,
    options: {
      data: { username: username }
    }
  })
  
  // 5. Buat profile user baru di user_profiles table
  await supabase.from('user_profiles').insert({
    id: signUpData.user.id,
    username: username,
    full_name: username
  })
}
```

**Catatan Penting:**
- Email digenerate otomatis dari username + timestamp
- User tidak perlu tahu tentang email - hanya butuh username & password
- Profile user buat otomatis saat signup di user_profiles table
- Username harus unik (UNIQUE constraint di database)

---

### Middleware untuk Proteksi Route

Tambahkan di `/middleware.ts` untuk proteksi halaman yang memerlukan login:

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

---

## Storage Setup

### Membuat Storage Bucket untuk Gambar

Supabase Storage digunakan untuk menyimpan gambar produk.

#### 1. Setup di Supabase Dashboard

1. Buka **Supabase Dashboard** → Project Anda
2. Klik **Storage** di sidebar kiri
3. Klik **New Bucket** untuk membuat bucket baru
4. Buat bucket dengan nama: **`waste-images`**
5. **Jangan check "Public"** untuk sekarang (akan set RLS)

#### 2. Mengatur Storage RLS Policies

Di Supabase Dashboard → Storage → waste-images → Policies:

```sql
-- Allow public read
CREATE POLICY "Public Read" ON storage.objects
FOR SELECT USING (bucket_id = 'waste-images')

-- Allow authenticated users upload
CREATE POLICY "Allow uploads for authenticated users" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'waste-images' AND
  auth.role() = 'authenticated'
)

-- Allow users delete their own files
CREATE POLICY "Allow delete for own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'waste-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
)
```

#### 3. Upload & Get Image URL di Kode

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// Upload image
const { error: uploadError } = await supabase.storage
  .from('waste-images')
  .upload(`waste-materials/${userId}/${fileName}`, imageFile)

// Get public URL
const { data } = supabase.storage
  .from('waste-images')
  .getPublicUrl(`waste-materials/${userId}/${fileName}`)

const publicUrl = data.publicUrl // URL untuk <img src>
```

---

## Row Level Security (RLS)

### Apa itu RLS?

Row Level Security (RLS) adalah fitur keamanan PostgreSQL/Supabase yang membatasi akses baris data berdasarkan user yang login. Artinya, setiap user hanya bisa melihat/edit data yang seharusnya mereka akses.

### RLS Policies di WITARA

#### 1. user_profiles Table

| Policy | Operation | Rule |
|--------|-----------|------|
| "Enable read access for all users" | SELECT | Semua orang bisa lihat profile user manapun |
| "Enable update for users based on id" | UPDATE | User hanya bisa edit profile mereka sendiri |
| "Enable insert for authenticated users" | INSERT | User baru bisa membuat profile sendiri |

**Contoh:**
```typescript
// User A login
const { data: profileA } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('username', 'userB') // Bisa lihat profile user B
  .single()

// Tapi UPDATE hanya bisa ke profile sendiri
const { error } = await supabase
  .from('user_profiles')
  .update({ full_name: 'Nama Baru' })
  // RLS akan return error jika auth.uid() != id
```

#### 2. waste_materials Table

| Policy | Operation | Rule |
|--------|-----------|------|
| "Enable read access for all users" | SELECT | Semua bisa lihat produk status='active' |
| "Users can view their own products" | SELECT | User bisa lihat produk mereka sendiri (any status) |
| "Users can create their own products" | INSERT | User hanya bisa insert produk mereka sendiri |
| "Users can update their own products" | UPDATE | User hanya bisa update produk mereka sendiri |
| "Users can delete their own products" | DELETE | User hanya bisa delete produk mereka sendiri |

**Contoh:**
```typescript
// Marketplace - Semua orang lihat produk aktif
const { data: products } = await supabase
  .from('waste_materials')
  .select(`*`)
  .eq('status', 'active')
  // RLS otomatis filter hanya produk active

// User dashboard - Lihat semua produk sendiri
const { data: myProducts } = await supabase
  .from('waste_materials')
  .select('*')
  .eq('user_id', session.user.id)
  // RLS allow karena auth.uid() == user_id
```

---

## Kode Implementasi

### 1. File Supabase Client (`/lib/supabase/client.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 2. Login Implementation (`/app/login/page.tsx`)

File sudah ada di repo - system ini:
- Terima username & password dari form
- Generate email unik dari username
- Coba login, jika gagal maka signup
- Create user profile otomatis

### 3. Dashboard - Fetch User Products (`/app/dashboard/page.tsx`)

```typescript
useEffect(() => {
  const fetchProducts = async () => {
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession()
    
    // Get user profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('id', session.user.id)
      .single()
    
    // Fetch user's products
    const { data: products } = await supabase
      .from('waste_materials')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
  }
}, [])
```

### 4. Upload Product (`/app/upload/page.tsx`)

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // 1. Upload image to Storage
  const { data } = supabase.storage
    .from('waste-images')
    .getPublicUrl(`waste-materials/${userId}/${fileName}`)
  
  // 2. Insert product ke database
  const { error } = await supabase
    .from('waste_materials')
    .insert({
      user_id: userId,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image_url: data.publicUrl
    })
}
```

### 5. Marketplace - Search & Browse (`/app/marketplace/page.tsx`)

```typescript
useEffect(() => {
  const fetchProducts = async () => {
    // Fetch semua produk active dengan join ke user_profiles
    const { data } = await supabase
      .from('waste_materials')
      .select(`
        *,
        user_profiles!inner(username)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    
    setProducts(data || [])
  }
}, [])

// Client-side filtering
const filtered = products
  .filter(p => p.name.includes(searchQuery))
  .sort((a, b) => b.created_at - a.created_at)
```

### 6. Product Detail - Join dengan Penjual (`/app/product/[id]/page.tsx`)

```typescript
const { data: product } = await supabase
  .from('waste_materials')
  .select(`
    *,
    user_profiles!inner(username, full_name)
  `)
  .eq('id', productId)
  .single()

// Render product detail + seller info
<div>
  <h1>{product.name}</h1>
  <p>Penjual: {product.user_profiles.username}</p>
  <p>Rp {product.price.toLocaleString()}</p>
</div>
```

---

## Testing & Troubleshooting

### Checklist Setup Supabase

- [ ] Supabase project dibuat
- [ ] Environment variables set (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, dll)
- [ ] Migration SQL sudah dijalankan (tabel user_profiles & waste_materials)
- [ ] RLS enabled untuk kedua tabel
- [ ] Storage bucket "waste-images" dibuat
- [ ] Storage RLS policies sudah di-set

### Testing Login/Register

1. **Buka `/login` page**
2. **Masukkan:**
   - Username: `testuser1`
   - Password: `password123`
3. **Klik "Masuk / Daftar"**
4. Expected: Redirect ke dashboard, user baru tercreate

### Testing Upload Produk

1. **Login terlebih dahulu**
2. **Klik "Tambah Produk" di dashboard**
3. **Isi form:**
   - Nama: "Limbah Beras Organik"
   - Deskripsi: "Limbah beras berkualitas tinggi..."
   - Harga: 50000
   - Upload gambar
4. **Klik "Publikasikan"**
5. Expected: Produk muncul di marketplace & dashboard user

### Testing Marketplace

1. **Buka `/marketplace`**
2. **Lihat produk yang diupload oleh user lain**
3. **Klik produk untuk lihat detail + info penjual**
4. **Test search & filter**

### Troubleshooting Umum

#### Error: "NEXT_PUBLIC_SUPABASE_URL is undefined"
**Solusi:** Check `.env.local` file - pastikan variabel environment sudah set

#### Error: "No rows found" di product detail
**Solusi:** Check:
- Produk id ada di database
- RLS policy allow SELECT (status='active' atau user sendiri)

#### Gambar tidak muncul di marketplace
**Solusi:** 
- Check apakah upload berhasil (error handling di console)
- Check bucket "waste-images" exists di Supabase Storage
- Check storage RLS allow public read

#### Cannot signup - duplicate username error
**Solusi:** Username sudah ada di database (UNIQUE constraint)
- Gunakan username berbeda
- Atau buka Supabase Dashboard → SQL Editor → delete dari user_profiles

#### Produk user tidak muncul di dashboard user
**Solusi:**
- Check apakah user_id sama dengan session user id
- Check product status tidak "inactive"
- Check RLS policy allow user lihat produk sendiri

---

## API Reference

### Auth Operations

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Get session
const { data: { session } } = await supabase.auth.getSession()

// Sign out
await supabase.auth.signOut()
```

### Database Operations

```typescript
// Select data
const { data, error } = await supabase
  .from('table_name')
  .select('column1, column2')
  .eq('column', 'value')

// Insert data
const { data, error } = await supabase
  .from('table_name')
  .insert({ column1: 'value1' })

// Update data
const { data, error } = await supabase
  .from('table_name')
  .update({ column1: 'new_value' })
  .eq('id', id_value)

// Delete data
const { error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', id_value)
```

### Storage Operations

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('bucket_name')
  .upload('file_path/filename', file)

// Get public URL
const { data } = supabase.storage
  .from('bucket_name')
  .getPublicUrl('file_path/filename')

// Delete file
const { error } = await supabase.storage
  .from('bucket_name')
  .remove(['file_path/filename'])
```

---

## Referensi Dokumentasi

- **Supabase Official Docs:** https://supabase.com/docs
- **Supabase Auth:** https://supabase.com/docs/guides/auth
- **Row Level Security:** https://supabase.com/docs/guides/auth/row-level-security
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Next.js Docs:** https://nextjs.org/docs

---

**Setup Terakhir Diupdate:** April 2024
**Untuk pertanyaan:** support@witara.com
