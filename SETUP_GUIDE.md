# WITARA - Setup Guide

Website platform edible cutlery dan marketplace limbah organik

## Prerequisites

- Node.js 18+
- npm/pnpm/yarn
- Supabase account

## 1. Setup Database di Supabase

### Langkah 1: Jalankan SQL Migration

1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Buka SQL Editor
4. Copy dan paste isi dari file `/scripts/01_create_tables.sql`
5. Click "Run"

Ini akan membuat:
- `waste_materials` - Tabel untuk produk limbah
- `user_profiles` - Tabel untuk profil pengguna

### Langkah 2: Setup Storage Bucket

1. Di Supabase Dashboard, buka **Storage**
2. Click **Create a new bucket**
3. Nama: `waste-images`
4. Pilih **Public** untuk akses
5. Click **Create bucket**

### Langkah 3: Disable RLS (untuk development)

Aturan Row Level Security sudah di-disable dalam script SQL, jadi data dapat diakses secara publik untuk development.

## 2. Setup Environment Variables

1. Copy file `.env.example` ke `.env.local`:
```bash
cp .env.example .env.local
```

2. Isi dengan credential Supabase Anda:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Dapatkan dari Supabase Dashboard > Settings > API

## 3. Install Dependencies

```bash
pnpm install
# atau npm install / yarn install
```

## 4. Run Development Server

```bash
pnpm dev
# atau npm run dev / yarn dev
```

Buka http://localhost:3000

## Features

### 🔐 Authentication
- Login/Register otomatis (username & password)
- Data tersimpan di Supabase Auth
- Session management dengan cookies

### 📦 Marketplace
- Browse semua produk limbah organik
- Search dan filter
- Sort by newest/price
- Detail produk lengkap

### 🛒 Seller Dashboard
- Upload produk limbah baru
- Manage produk (edit/delete)
- Lihat statistik penjualan
- Upload foto produk

### 🎨 Design
- Eco-friendly color scheme (green, brown, orange)
- Responsive design (mobile-first)
- Modern UI dengan shadcn/ui
- Smooth animations

## File Structure

```
/app
  /page.tsx              # Landing page
  /login/page.tsx        # Login page
  /dashboard/page.tsx    # User dashboard
  /upload/page.tsx       # Upload produk
  /marketplace/page.tsx  # Marketplace
  /product/[id]/page.tsx # Product detail

/components
  /navbar.tsx            # Navigation bar
  /ui/                   # shadcn components

/lib
  /supabase/
    /client.ts          # Browser client
    /server.ts          # Server client

/scripts
  /01_create_tables.sql  # Database schema
```

## Database Schema

### waste_materials
```sql
- id (UUID)           - Primary key
- user_id (UUID)      - Reference ke auth.users
- name (VARCHAR)      - Nama produk
- description (TEXT)  - Deskripsi detail
- price (DECIMAL)     - Harga
- image_url (TEXT)    - URL foto
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### user_profiles
```sql
- id (UUID)           - Primary key, reference ke auth.users
- username (VARCHAR)  - Username unik
- full_name (VARCHAR) - Nama lengkap
- avatar_url (TEXT)   - URL avatar
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Authentication Flow

1. User input username & password di login page
2. System otomatis membuat email: `{username}@witara.local`
3. Jika user baru → sign up otomatis
4. Jika user existing → sign in
5. User profile dibuat otomatis di `user_profiles` table

## Tips Pengembangan

1. **Testing Login**
   - Username bebas (contoh: "budi", "siti", "agus")
   - Password minimal 6 karakter
   - Akan otomatis terdaftar di Supabase

2. **Upload Gambar**
   - Maksimal 5MB per file
   - Format: JPG, PNG, GIF, WebP
   - Akan tersimpan di storage bucket `waste-images`

3. **Database Testing**
   - Gunakan Supabase Table Editor untuk melihat data
   - Query builder memudahkan testing query

## Troubleshooting

### Error "Supabase URL not found"
- Check environment variables di `.env.local`
- Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY sudah benar

### Gambar tidak upload
- Check bucket `waste-images` sudah dibuat dan public
- Verify storage policies (RLS) di-disable

### Login tidak berhasil
- Check `user_profiles` table permissions (RLS disabled)
- Verify email format: `{username}@witara.local`

### Data tidak muncul di marketplace
- Check `waste_materials` table punya data
- Verify RLS di-disable
- Check user_profiles relation

## Production Deployment

Untuk production:

1. Set RLS policies yang proper
2. Use environment variables dari Vercel
3. Setup domain custom
4. Enable email verification
5. Setup backup database
6. Configure CDN untuk images

## Support

Untuk pertanyaan atau masalah:
1. Check Supabase documentation
2. Review code comments
3. Check console logs di browser dev tools

---

**Created with ❤️ for sustainability**
