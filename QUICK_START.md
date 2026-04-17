# ⚡ WITARA Platform - Quick Start Guide

Mulai dari 0 sampai aplikasi running dalam 5 menit.

---

## 🎯 Tujuan

Setelah panduan ini, Anda akan memiliki:
- ✅ Database dengan 2 tabel siap pakai
- ✅ Aplikasi running di localhost:3000
- ✅ Bisa login/register
- ✅ Bisa upload & browse produk
- ✅ Marketplace fully functional

---

## 📝 Prerequisite

- Node.js 16+ (check: `node --version`)
- Python 3.8+ (check: `python --version`)
- Supabase account & project sudah setup
- Git (untuk version control)

---

## 🚀 Step-by-Step Setup (5 menit)

### 1️⃣ Prepare Environment Variables (1 menit)

```bash
# Di folder root project, buat/edit file .env.local

# Isi dengan nilai dari Supabase Dashboard:
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...
POSTGRES_URL=postgresql://postgres:xxxxx@db.xxxxx.supabase.co:5432/postgres
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx...
```

**Cara dapat values:**
1. Buka https://supabase.com/dashboard
2. Select project WITARA
3. Settings → API → Copy URL & anon key
4. Settings → Database → Copy connection string

---

### 2️⃣ Run Database Migration (2 menit)

**Option A: Python Script (Recommended)**

```bash
# Install Python deps (jika belum)
pip install psycopg2 python-dotenv

# Run migration
python scripts/run-migration.py

# Expected: ✅ Migration completed successfully!
```

**Option B: Supabase Dashboard**

1. Buka Supabase SQL Editor
2. Copy semua isi `/scripts/01-init-database.sql`
3. Paste & Run

---

### 3️⃣ Create Storage Bucket (1 menit)

1. Supabase Dashboard → Storage
2. Click "New Bucket" → Name it `waste-images`
3. Create

**Add RLS Policies (copy-paste di SQL Editor):**

```sql
-- Policy 1: Public Read
CREATE POLICY "Public Read" ON storage.objects
FOR SELECT USING (bucket_id = 'waste-images');

-- Policy 2: Authenticated Upload
CREATE POLICY "Allow uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'waste-images' AND auth.role() = 'authenticated');

-- Policy 3: Delete Own
CREATE POLICY "Delete own" ON storage.objects
FOR DELETE USING (bucket_id = 'waste-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

### 4️⃣ Install & Run App (1 menit)

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser → http://localhost:3000
```

✅ **Done!** Aplikasi running.

---

## 🧪 Quick Test (2 menit)

### Test 1: Login
1. Buka http://localhost:3000/login
2. Username: `testuser123` Password: `password123`
3. Klik "Masuk / Daftar"
4. Expected: ✅ Redirect ke dashboard

### Test 2: Upload Product
1. Klik "Tambah Produk"
2. Isi: Name: "Test Limbah", Desc: "Test", Price: "10000", Foto: (upload gambar)
3. Klik "Publikasikan"
4. Expected: ✅ Produk muncul di dashboard

### Test 3: Browse Marketplace
1. Buka http://localhost:3000/marketplace
2. Expected: ✅ Lihat produk yang diupload
3. Klik produk: ✅ Lihat detail + seller info

---

## 📂 Project Structure

```
witara/
├── app/
│   ├── page.tsx              # Home page
│   ├── login/page.tsx        # Login/Register
│   ├── dashboard/page.tsx    # User dashboard
│   ├── upload/page.tsx       # Upload product
│   ├── marketplace/page.tsx  # Browse products
│   └── product/[id]/page.tsx # Product detail
├── lib/
│   └── supabase/
│       └── client.ts         # Supabase client setup
├── scripts/
│   ├── 01-init-database.sql  # Database migration
│   └── run-migration.py      # Python runner
├── SUPABASE_SETUP.md         # Full documentation
├── SUPABASE_CODE_REFERENCE.md # Code examples
└── SETUP_INSTRUCTIONS.md     # Detailed setup
```

---

## 🎬 Workflow Aplikasi

```
User Story Flow:
1. User buka http://localhost:3000
2. User klik "Masuk / Daftar"
3. User isi username & password → Register (auto membuat profile)
4. User redirect ke dashboard
5. User klik "Tambah Produk" → Upload image & details
6. Produk muncul di dashboard & marketplace
7. User/orang lain bisa browse di marketplace
8. Klik produk → Lihat detail + seller info
```

---

## ⚡ Environment Variables

| Variable | Dari | Kegunaan |
|----------|------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Settings | URL project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings | API key (public) |
| `POSTGRES_URL` | Supabase Database | Connect ke PostgreSQL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings | Admin access (server-side) |

---

## 🐛 Most Common Errors & Fixes

| Error | Fix |
|-------|-----|
| "POSTGRES_URL undefined" | Check .env.local file |
| "Table does not exist" | Run migration script |
| "Bucket not found" | Create storage bucket |
| "RLS denies access" | Check if user = owner |
| "Image not showing" | Check storage policies |

---

## 📚 Documentation Map

Need more info? Baca file-file ini:

- **SETUP_INSTRUCTIONS.md** → Detailed setup dengan troubleshooting
- **SUPABASE_SETUP.md** → Database schema & RLS explanation
- **SUPABASE_CODE_REFERENCE.md** → Code examples untuk setiap fitur

---

## ✨ What's Included

### Database Tables
- `user_profiles` → User data
- `waste_materials` → Products

### Fitur yang Ready
- ✅ Login/Register (username-based)
- ✅ User profiles
- ✅ Upload products
- ✅ Image storage
- ✅ Marketplace browse
- ✅ Search & filter
- ✅ Product detail
- ✅ Owner actions (edit/delete)
- ✅ RLS security

### Not Included (Add Later)
- ❌ Messaging system
- ❌ Cart & checkout
- ❌ Payment
- ❌ Reviews & ratings
- ❌ Admin dashboard

---

## 🎯 Next: Feature Development

Setelah quick start, Anda bisa:

1. **Add Messaging:**
   - Create `conversations` table
   - Add chat interface

2. **Add Payment:**
   - Integrate Stripe
   - Create orders table

3. **Add Admin Dashboard:**
   - View all users
   - View all products
   - Moderate content

---

## 💡 Tips

- **Development:** `npm run dev` → Hot reload on file changes
- **Build:** `npm run build` → Production build
- **Debug:** Open browser DevTools → Console untuk melihat logs
- **Database:** Supabase Dashboard → SQL Editor untuk query langsung

---

## 🚀 Deploy ke Production

```bash
# 1. Push ke GitHub
git add .
git commit -m "Initial WITARA setup"
git push origin main

# 2. Connect di Vercel
# Buka vercel.com → New Project → Select GitHub repo

# 3. Add Environment Variables di Vercel
# Settings → Environment Variables → Add semua NEXT_PUBLIC_* dan POSTGRES_* vars

# 4. Deploy
# Vercel auto deploy from GitHub
```

---

## ✅ Completion Checklist

- [ ] Environment variables di .env.local
- [ ] Database migration dijalankan
- [ ] Storage bucket dibuat
- [ ] Storage RLS policies disetup
- [ ] App running di localhost:3000
- [ ] Login/Register berfungsi
- [ ] Upload product berfungsi
- [ ] Marketplace menampilkan produk
- [ ] Product detail page berfungsi

---

## 📞 Support

- **Error?** Check console logs
- **Stuck?** Baca SETUP_INSTRUCTIONS.md
- **Questions?** See SUPABASE_SETUP.md

---

**Total Setup Time: ~5 minutes** ⏱️

**Ready to code?** Start with file `/app/login/page.tsx` untuk understand flow.

Good luck! 🚀
