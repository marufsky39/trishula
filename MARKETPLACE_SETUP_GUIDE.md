# WITARA Marketplace - Complete Setup Guide

Panduan lengkap untuk setup dan menggunakan marketplace di aplikasi WITARA.

## Quick Start (5 Menit)

### 1. Setup Database

```bash
# Option A: Menggunakan Supabase Dashboard SQL Editor
# 1. Login ke Supabase Dashboard
# 2. Go to Project > SQL Editor
# 3. Create New Query
# 4. Copy-paste dari scripts/01-init-database.sql
# 5. Click Run

# Option B: Menggunakan Python Script
cd scripts
python run-migration.py
```

### 2. Seed Sample Data

```sql
-- Copy-paste scripts/02-seed-marketplace.sql ke Supabase SQL Editor
-- SEBELUM itu, ganti UUID di script dengan UUID user yang sebenarnya
-- Atau gunakan UUID dummy untuk testing
```

### 3. Test Marketplace

```bash
# 1. Run development server
npm run dev

# 2. Open browser: http://localhost:3000/marketplace
# 3. Harusnya terlihat products sample yang sudah di-seed
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    WITARA Application                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Frontend (React / Next.js 15)                │  │
│  │  ┌──────────────┐  ┌──────────────┐                 │  │
│  │  │  Marketplace │  │   Upload     │                 │  │
│  │  │    Page      │  │   Page       │                 │  │
│  │  └──────────────┘  └──────────────┘                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      Supabase Client (@/lib/supabase/client)        │  │
│  │  - Auth Management                                   │  │
│  │  - Database Queries (waste_materials)               │  │
│  │  - Image Upload (Supabase Storage)                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
└─────────────────────────┼───────────────────────────────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
   ┌─────────────────┐          ┌──────────────────────┐
   │ Supabase Auth   │          │ Supabase Database    │
   │ (JWT Session)   │          │ PostgreSQL           │
   └─────────────────┘          ├──────────────────────┤
                                │ user_profiles        │
                                │ waste_materials      │
                                └──────────────────────┘
```

---

## Frontend: Marketplace Page (`app/marketplace/page.tsx`)

### Features

✅ **Browse Products**
- List semua produk dengan status 'active'
- Tampil info: nama, harga, deskripsi, seller
- Card-based layout yang responsive

✅ **Search & Filter**
- Real-time search by name & description
- Sort: Newest, Price Low-High, Price High-Low
- Category filter (planning)

✅ **Product Detail**
- Click produk untuk lihat detail lengkap
- Seller info (username, city, contact)
- Related products

✅ **Upload Product**
- Link ke page /upload untuk penjual
- Only visible untuk authenticated users

### Code Structure

```typescript
// marketplace/page.tsx - Main Marketplace Page

interface WasteMaterial {
  id: string
  name: string
  description: string
  price: number
  image_url: string | null
  created_at: string
  user_id: string
  user_profiles?: {
    username: string
  }
}

export default function MarketplacePage() {
  // States
  const [products, setProducts] = useState<WasteMaterial[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  // Effects
  useEffect(() => {
    fetchProducts()
  }, [])

  // Database Query
  const fetchProducts = async () => {
    const { data } = await supabase
      .from('waste_materials')
      .select(`
        *,
        user_profiles!inner(username)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
  }

  // Render
  return (
    <div>
      <SearchBar />
      <SortDropdown />
      <ProductGrid products={filteredProducts} />
    </div>
  )
}
```

### API Query Examples

**Get all active products with seller info:**
```typescript
const { data: products } = await supabase
  .from('waste_materials')
  .select(`
    *,
    user_profiles!inner(username)
  `)
  .eq('status', 'active')
  .order('created_at', { ascending: false })
```

**Search products by name:**
```typescript
const { data: products } = await supabase
  .from('waste_materials')
  .select('*')
  .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
  .eq('status', 'active')
```

**Get product by ID with seller info:**
```typescript
const { data: product } = await supabase
  .from('waste_materials')
  .select(`
    *,
    user_profiles(username, phone, city, full_name)
  `)
  .eq('id', productId)
  .single()
```

---

## Frontend: Upload Page (`app/upload/page.tsx`)

### Features

✅ **Form Validation**
- Input validation untuk semua field
- File size check (max 5MB)
- Image preview

✅ **Image Upload**
- Upload ke Supabase Storage
- Auto-generate storage URL
- Fallback emoji jika tidak ada gambar

✅ **Product Creation**
- Create waste_materials record di database
- Automatic timestamps
- Status default: 'active'

### Code Structure

```typescript
// upload/page.tsx - Upload Product Page

interface FormData {
  name: string
  description: string
  price: string
  image: File | null
}

export default function UploadPage() {
  // States
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    image: null
  })

  // Image handling
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // Validate file size
    // Generate preview
  }

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    // Validate all fields
    // Upload image to Storage
    // Insert product record
    // Redirect to marketplace
  }

  // Render form
  return (
    <form onSubmit={handleSubmit}>
      <Input name="name" />
      <Textarea name="description" />
      <Input name="price" type="number" />
      <FileInput onChange={handleImageChange} />
      <Button type="submit">Publish</Button>
    </form>
  )
}
```

### API: Upload Image to Storage

```typescript
const uploadImage = async (file: File, userId: string) => {
  // Generate unique filename
  const filename = `${userId}/${Date.now()}-${file.name}`

  // Upload ke Supabase Storage bucket 'product-images'
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) throw error

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('product-images')
    .getPublicUrl(filename)

  return publicUrl
}
```

### API: Create Product

```typescript
const createProduct = async (
  userId: string,
  formData: FormData,
  imageUrl: string | null
) => {
  const { data, error } = await supabase
    .from('waste_materials')
    .insert({
      user_id: userId,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image_url: imageUrl,
      status: 'active'
    })
    .select()

  if (error) throw error
  return data[0]
}
```

---

## Database: Complete Schema

### user_profiles Table

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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### waste_materials Table

```sql
CREATE TABLE waste_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL CHECK (price > 0),
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sample Data (Seeded Products)

```
8 products sudah di-seed dengan:
- 4 seller profiles
- Various waste material types
- Sample images dari Unsplash
- Realistic pricing
```

---

## Testing Checklist

### Setup Phase
- [ ] Database migrations berjalan tanpa error
- [ ] Tables created: user_profiles, waste_materials
- [ ] RLS policies active
- [ ] Sample data seeded (8 products visible)

### Marketplace Page
- [ ] Load products dari database
- [ ] Display products dengan gambar
- [ ] Seller info terlihat dengan benar
- [ ] Search functionality bekerja
- [ ] Sort options berfungsi
- [ ] Product count menunjukkan angka benar

### Upload Page
- [ ] Form validation bekerja
- [ ] Image preview display
- [ ] Image upload ke Storage berhasil
- [ ] Product insert ke database berhasil
- [ ] Redirect ke marketplace setelah upload
- [ ] Product baru terlihat di marketplace

### Product Detail Page
- [ ] Load product by ID
- [ ] Display seller info lengkap
- [ ] Related products menampil
- [ ] Contact seller berfungsi (future)

---

## Common Issues & Solutions

### Issue #1: Products not showing in marketplace
**Debug:**
1. Check database: `SELECT COUNT(*) FROM waste_materials WHERE status = 'active'`
2. Check RLS policy: Must allow SELECT for public
3. Check user_profiles: FK constraint needed

**Fix:**
```sql
-- Verify products exist
SELECT * FROM waste_materials LIMIT 5;

-- Verify RLS policy
SELECT * FROM pg_policies WHERE tablename = 'waste_materials';

-- Check FK relationships
SELECT w.id, w.name, u.username 
FROM waste_materials w
LEFT JOIN user_profiles u ON w.user_id = u.id;
```

### Issue #2: Images not displaying
**Check:**
1. image_url is valid URL (not null)
2. Image file exists (jika Supabase Storage)
3. CORS enabled untuk image source
4. Browser console error messages

**Fix:**
```typescript
// Fallback image handling
<img 
  src={product.image_url || 'placeholder.png'} 
  onError={(e) => e.currentTarget.src = 'fallback.png'}
/>
```

### Issue #3: Upload fails silently
**Debug steps:**
1. Open browser DevTools (F12)
2. Check Network tab untuk failed requests
3. Check Console untuk error messages
4. Check Supabase dashboard untuk logs

**Solution:**
```typescript
// Better error handling
try {
  const result = await uploadImage(file)
  console.log('Upload successful:', result)
} catch (error) {
  console.error('Upload failed:', error.message)
  setError(error.message)
}
```

---

## Performance Optimization

### Database Indexes (Already Created)
```sql
-- Full text search index
CREATE INDEX idx_waste_materials_name 
ON waste_materials USING GIN(to_tsvector('indonesian', name))

CREATE INDEX idx_waste_materials_description 
ON waste_materials USING GIN(to_tsvector('indonesian', description))

-- Lookup indexes
CREATE INDEX idx_waste_materials_user_id ON waste_materials(user_id)
CREATE INDEX idx_waste_materials_created_at ON waste_materials(created_at DESC)
CREATE INDEX idx_waste_materials_status ON waste_materials(status)
```

### Frontend Optimization
```typescript
// Use SWR untuk caching & revalidation
import useSWR from 'swr'

const { data: products, isLoading } = useSWR(
  'waste_materials',
  () => fetchProducts(),
  { revalidateOnFocus: false, dedupingInterval: 60000 }
)

// Pagination untuk large datasets
const [page, setPage] = useState(1)
const limit = 20
const offset = (page - 1) * limit
```

### Image Optimization
```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image 
  src={product.image_url}
  alt={product.name}
  width={400}
  height={300}
  style={{ objectFit: 'cover' }}
/>
```

---

## Deployment Checklist

- [ ] Database migrations run di production
- [ ] Environment variables set:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] RLS policies enabled & tested
- [ ] Storage bucket created & public access configured
- [ ] SSL certificate valid
- [ ] CORS properly configured
- [ ] Backups scheduled
- [ ] Monitoring set up

---

## References

- Database Schema: `/scripts/DATABASE_SCRIPTS_REFERENCE.md`
- Supabase Docs: https://supabase.com/docs
- PostgreSQL Full Text Search: https://www.postgresql.org/docs/current/textsearch.html
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security
- Storage: https://supabase.com/docs/guides/storage

---

Last Updated: April 17, 2024
Version: 1.0.0
