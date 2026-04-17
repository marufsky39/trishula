# Supabase Code Reference untuk WITARA Platform

Dokumentasi ini menyajikan kode-kode Supabase yang digunakan di aplikasi, dengan penjelasan detail.

---

## 1. Setup Supabase Client

### File: `/lib/supabase/client.ts`

```typescript
'use client' // Browser client component

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/supabase/database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Penjelasan:**
- `createBrowserClient` = Buat Supabase client untuk digunakan di browser
- `NEXT_PUBLIC_SUPABASE_URL` = URL Supabase project (public, boleh di-expose)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = API key untuk browser (hanya read/write own data)
- Client ini digunakan di semua client components

**Import dan Gunakan:**
```typescript
import { createClient } from '@/lib/supabase/client'

export default function MyComponent() {
  const supabase = createClient()
  
  useEffect(() => {
    const { data: { session } } = await supabase.auth.getSession()
    console.log(session?.user) // Current user
  }, [])
}
```

---

## 2. Authentication

### 2.1 Login/Register Form

**File:** `/app/login/page.tsx`

```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLoginRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validasi input
      if (!username || !password) {
        setError('Username dan password harus diisi')
        return
      }

      if (password.length < 6) {
        setError('Password minimal 6 karakter')
        return
      }

      // PENTING: Generate email unik untuk setiap username
      // Supabase auth memerlukan email, tapi user login dengan username
      const emailToUse = `${username.toLowerCase()}${Date.now()}@witara.local`

      console.log('[v0] Attempting login with email:', emailToUse)

      // Step 1: Coba login dengan credential yang ada
      const { data: signInData, error: signInError } = await supabase.auth
        .signInWithPassword({
          email: emailToUse,
          password: password
        })

      if (!signInError && signInData.user) {
        // Login berhasil!
        console.log('[v0] Login successful')
        router.push('/dashboard')
        return
      }

      // Step 2: Jika login gagal, coba daftar user baru
      console.log('[v0] Login failed, attempting signup...')
      
      const { data: signUpData, error: signUpError } = await supabase.auth
        .signUp({
          email: emailToUse,
          password: password,
          options: {
            data: {
              username: username // Simpan username di auth metadata
            }
          }
        })

      if (signUpError) {
        setError(signUpError.message || 'Terjadi kesalahan saat mendaftar')
        return
      }

      // Step 3: Buat profile user di user_profiles table
      if (signUpData.user) {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: signUpData.user.id, // Use auth user id
            username: username,
            full_name: username
          })

        if (profileError) {
          console.error('[v0] Error creating profile:', profileError)
        }
      }

      router.push('/dashboard')

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLoginRegister}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Memproses...' : 'Masuk / Daftar'}
      </button>
      {error && <p>{error}</p>}
    </form>
  )
}
```

**Penting:**
- Platform menggunakan username (bukan email) sebagai login
- Email digenerate otomatis: `{username}{timestamp}@witara.local`
- Setelah signup berhasil, selalu create profile di `user_profiles` table
- Jangan biarkan user login tanpa profile di user_profiles

---

### 2.2 Check Current User Session

```typescript
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Dashboard() {
  const supabase = createClient()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        // Get current session (sudah login atau belum)
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          setUser(session.user)
          console.log('[v0] User logged in:', session.user.id)
        } else {
          console.log('[v0] No user logged in')
          // Redirect ke login
        }
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [supabase])

  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please login</div>

  return <div>Welcome, {user.email}</div>
}
```

**Catatan:**
- `getSession()` = Check apakah user sudah login (read dari localStorage)
- Selalu check user session di awal component yang memerlukan login
- Redirect ke login page jika user belum login

---

### 2.3 Sign Out

```typescript
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login') // Redirect ke login
  }

  return <button onClick={handleLogout}>Logout</button>
}
```

---

## 3. Database Operations

### 3.1 Select (Baca Data)

#### Baca semua data
```typescript
const { data, error } = await supabase
  .from('waste_materials')
  .select('*')

// Result: Array of all waste_materials
```

#### Baca dengan filter
```typescript
const { data: products, error } = await supabase
  .from('waste_materials')
  .select('*')
  .eq('status', 'active') // WHERE status = 'active'

// Result: Hanya produk dengan status active
```

#### Baca satu baris
```typescript
const { data: product, error } = await supabase
  .from('waste_materials')
  .select('*')
  .eq('id', productId)
  .single() // Hanya ambil 1 baris, error jika 0 atau >1

// Result: Single object atau null
```

#### Baca dengan join ke tabel lain
```typescript
const { data, error } = await supabase
  .from('waste_materials')
  .select(`
    *,
    user_profiles!inner(username, full_name)
  `)
  .eq('status', 'active')

// Result: waste_materials dengan data user_profiles di-join
// Format: { id, name, price, ..., user_profiles: { username, full_name } }
```

**Join Syntax:**
- `user_profiles!inner(username, full_name)` = Inner join (harus ada match)
- `user_profiles(username, full_name)` = Left join (match atau null)
- Relasi di-refer ke foreign key di table

---

### 3.2 Insert (Tambah Data)

#### Insert satu baris
```typescript
const { data, error } = await supabase
  .from('user_profiles')
  .insert({
    id: userId,
    username: 'johndoe',
    full_name: 'John Doe',
    city: 'Jakarta'
  })

if (error) {
  console.error('Insert error:', error.message)
} else {
  console.log('Insert success:', data)
}
```

#### Insert banyak baris
```typescript
const { data, error } = await supabase
  .from('products')
  .insert([
    { name: 'Product 1', price: 10000 },
    { name: 'Product 2', price: 20000 }
  ])
```

**Error Handling:**
```typescript
const { error } = await supabase
  .from('user_profiles')
  .insert({ id: userId, username: 'john' })

if (error) {
  if (error.code === '23505') {
    console.log('Duplicate username')
  } else {
    console.log('Other error:', error.message)
  }
}
```

---

### 3.3 Update (Edit Data)

```typescript
const { data, error } = await supabase
  .from('waste_materials')
  .update({
    name: 'New Name',
    price: 75000,
    status: 'sold'
  })
  .eq('id', productId)

// Result: Updated rows
```

**Update dengan check UID (RLS):**
```typescript
// Hanya update produk user sendiri (RLS akan enforce ini)
const { data, error } = await supabase
  .from('waste_materials')
  .update({ status: 'sold' })
  .eq('id', productId)
  .eq('user_id', currentUserId)
```

---

### 3.4 Delete (Hapus Data)

```typescript
const { error } = await supabase
  .from('waste_materials')
  .delete()
  .eq('id', productId)

if (error) {
  console.error('Delete failed:', error)
}
```

---

## 4. Storage Operations

### 4.1 Upload File

```typescript
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()
const imageFile = /* File object dari <input type="file"> */

// Generate unique filename
const fileExt = imageFile.name.split('.').pop()
const fileName = `${Date.now()}.${fileExt}`
const filePath = `waste-materials/${userId}/${fileName}`

// Upload ke storage
const { data, error } = await supabase.storage
  .from('waste-images') // Bucket name
  .upload(filePath, imageFile, {
    upsert: false // Jangan overwrite file yang sudah ada
  })

if (error) {
  console.error('Upload error:', error)
} else {
  console.log('Upload success:', data)
}
```

**File dari Input Element:**
```typescript
const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  
  if (file) {
    console.log('File selected:', file.name, file.size)
    // Use file untuk upload
  }
}

// Dalam JSX
<input type="file" onChange={handleFileSelect} />
```

---

### 4.2 Get Public URL

```typescript
// Setelah upload, dapatkan public URL
const { data } = supabase.storage
  .from('waste-images')
  .getPublicUrl(filePath)

const publicUrl = data.publicUrl
console.log('Image URL:', publicUrl)

// Simpan ke database
await supabase.from('waste_materials').insert({
  name: 'Product',
  image_url: publicUrl // Save public URL
})

// Gunakan di <img>
<img src={publicUrl} alt="Product" />
```

**Format URL:**
```
https://[PROJECT].supabase.co/storage/v1/object/public/waste-images/waste-materials/[USER_ID]/[FILENAME]
```

---

### 4.3 Delete File

```typescript
const { error } = await supabase.storage
  .from('waste-images')
  .remove(['waste-materials/userId/filename.jpg'])

if (error) {
  console.error('Delete error:', error)
}
```

---

## 5. Real-world Examples

### 5.1 Upload Product dengan Image

```typescript
// Data dari form
const formData = {
  name: 'Limbah Tepung Beras',
  description: 'Limbah berkualitas tinggi dari pengolahan beras',
  price: 50000,
  image: File // dari <input type="file">
}

// Proses
try {
  let imageUrl = null

  // Step 1: Upload image jika ada
  if (formData.image) {
    const fileExt = formData.image.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `waste-materials/${userId}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('waste-images')
      .upload(filePath, formData.image)

    if (uploadError) {
      console.warn('Image upload warning:', uploadError)
    } else {
      // Get public URL
      const { data } = supabase.storage
        .from('waste-images')
        .getPublicUrl(filePath)
      imageUrl = data.publicUrl
    }
  }

  // Step 2: Insert product ke database
  const { error: insertError } = await supabase
    .from('waste_materials')
    .insert({
      user_id: userId,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      image_url: imageUrl
    })

  if (insertError) {
    setError(insertError.message)
  } else {
    router.push('/dashboard')
  }
} catch (err: any) {
  setError(err.message)
}
```

---

### 5.2 Fetch User Dashboard Data

```typescript
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Dashboard() {
  const router = useRouter()
  const supabase = createClient()
  
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Step 1: Check authentication
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          router.push('/login')
          return
        }

        setUser(session.user)

        // Step 2: Fetch user profile
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setProfile(profileData)

        // Step 3: Fetch user's products
        const { data: productsData } = await supabase
          .from('waste_materials')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        setProducts(productsData || [])

      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [supabase, router])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Welcome, {profile?.full_name}</h1>
      <p>Total products: {products.length}</p>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - Rp {product.price.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

### 5.3 Marketplace dengan Search & Sort

```typescript
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Marketplace() {
  const supabase = createClient()
  const [allProducts, setAllProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  // Fetch semua produk
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from('waste_materials')
        .select(`
          *,
          user_profiles!inner(username)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      setAllProducts(data || [])
    }

    fetchProducts()
  }, [supabase])

  // Filter dan sort di client
  const filteredProducts = allProducts
    .filter(product => {
      const searchLower = searchQuery.toLowerCase()
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          return a.price - b.price
        case 'priceDesc':
          return b.price - a.price
        case 'newest':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="newest">Newest</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
      </select>

      <div>
        <p>Found: {filteredProducts.length} products</p>
        {filteredProducts.map(product => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>Rp {product.price.toLocaleString()}</p>
            <p>by {product.user_profiles.username}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

### 5.4 Product Detail dengan Owner Check

```typescript
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  
  const productId = params.id as string
  const [product, setProduct] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      // Check current user
      const { data: { session } } = await supabase.auth.getSession()
      setCurrentUser(session?.user || null)

      // Fetch product dengan seller info (join)
      const { data } = await supabase
        .from('waste_materials')
        .select(`
          *,
          user_profiles!inner(username, full_name)
        `)
        .eq('id', productId)
        .single()

      setProduct(data)

      // Check if current user is owner
      if (session?.user && data?.user_id === session.user.id) {
        setIsOwner(true)
      }
    }

    loadProduct()
  }, [productId, supabase])

  const handleDelete = async () => {
    if (!confirm('Delete this product?')) return

    const { error } = await supabase
      .from('waste_materials')
      .delete()
      .eq('id', productId)

    if (!error) {
      router.push('/dashboard')
    }
  }

  if (!product) return <div>Loading...</div>

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.image_url} alt={product.name} />
      <p>Rp {product.price.toLocaleString()}</p>
      <p>Seller: {product.user_profiles.username}</p>
      
      {isOwner ? (
        <div>
          <button>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      ) : (
        <button>Contact Seller</button>
      )}
    </div>
  )
}
```

---

## 6. Error Handling Patterns

### Common Errors

```typescript
const { error } = await supabase.from('table').select()

// Type checking errors
if (error?.code === '23505') {
  console.log('Unique constraint violation (duplicate key)')
} else if (error?.code === '23503') {
  console.log('Foreign key constraint violation')
} else if (error?.code === '42P01') {
  console.log('Table does not exist')
} else if (error?.code === '42703') {
  console.log('Column does not exist')
} else if (error?.code === 'PGRST301') {
  console.log('Result not found')
}
```

### RLS Errors

```typescript
// RLS akan return error jika user tidak punya akses
const { error } = await supabase
  .from('waste_materials')
  .update({ name: 'New Name' })
  .eq('id', productId)

if (error?.message.includes('RLS')) {
  console.log('You do not have permission to update this product')
}
```

---

## 7. Performance Tips

### 1. Limit rows
```typescript
const { data } = await supabase
  .from('waste_materials')
  .select('*')
  .limit(20) // Ambil hanya 20 baris

// Pagination
const page = 1
const pageSize = 20
const { data } = await supabase
  .from('waste_materials')
  .select('*')
  .range((page - 1) * pageSize, page * pageSize - 1)
```

### 2. Select specific columns
```typescript
// ❌ Bad: Select semua column
const { data } = await supabase
  .from('waste_materials')
  .select('*')

// ✅ Good: Select hanya column yang dibutuhkan
const { data } = await supabase
  .from('waste_materials')
  .select('id, name, price, image_url')
```

### 3. Use indexes
Ensure database columns yang sering di-filter punya index (sudah set di migration SQL)

---

## 8. Testing Tips

### Test di Browser Console

```javascript
// Get Supabase client (jika import sudah tersedia)
const { createClient } = await import('./lib/supabase/client.js')
const supabase = createClient()

// Check session
const { data: { session } } = await supabase.auth.getSession()
console.log(session)

// Fetch products
const { data } = await supabase.from('waste_materials').select()
console.log(data)
```

---

**Dokumentasi ini last updated: April 2024**
**Untuk error atau pertanyaan, cek SUPABASE_SETUP.md**
