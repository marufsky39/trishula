# WITARA Database Diagram & Schema

Visual representation dan penjelasan struktur database WITARA.

---

## 📊 Entity Relationship Diagram (ERD)

```
┌─────────────────────┐
│   auth.users        │
│  (Supabase Auth)    │
│                     │
│ id (UUID) PK        │
│ email               │
│ password_hash       │
│ created_at          │
└──────────┬──────────┘
           │
           │ (1:1) FK id
           │
           ▼
┌─────────────────────────────────┐
│    user_profiles                │
│  (Profil Data Pengguna)         │
│                                 │
│ id (UUID) PK                    │
│ username (UNIQUE)               │
│ full_name                       │
│ bio                             │
│ phone                           │
│ address, city, province         │
│ postal_code                     │
│ avatar_url                      │
│ created_at                      │
│ updated_at                      │
└──────────┬──────────────────────┘
           │
           │ (1:N) user_id FK
           │
           ▼
┌─────────────────────────────────┐
│    waste_materials              │
│  (Produk Limbah Organik)        │
│                                 │
│ id (UUID) PK                    │
│ user_id (UUID) FK               │
│ name                            │
│ description                     │
│ price (DECIMAL)                 │
│ image_url (→ Storage)           │
│ status (active/sold/inactive)   │
│ created_at                      │
│ updated_at                      │
└─────────────────────────────────┘


Storage Bucket:
┌─────────────────────────────────┐
│    waste-images (bucket)        │
│  (Penyimpanan Gambar Produk)    │
│                                 │
│ waste-materials/                │
│   ├── {user_id}/                │
│   │   ├── 1234567890.jpg        │
│   │   └── 1234567891.png        │
│   └── {user_id}/                │
│       └── 1234567892.jpg        │
└─────────────────────────────────┘
```

---

## 🗄️ Detailed Table Schemas

### Table 1: `user_profiles`

**Purpose:** Menyimpan data profil pengguna WITARA

```sql
CREATE TABLE user_profiles (
  -- PRIMARY KEY
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- UNIQUE CONSTRAINTS
  username VARCHAR(50) UNIQUE NOT NULL,
  
  -- PROFILE DATA
  full_name VARCHAR(100),
  bio TEXT,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(50),
  province VARCHAR(50),
  postal_code VARCHAR(10),
  avatar_url TEXT,
  
  -- TIMESTAMPS
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PK, FK to auth.users | Link ke Supabase auth user |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | Username unik untuk login (3+ chars) |
| `full_name` | VARCHAR(100) | - | Nama lengkap user |
| `bio` | TEXT | - | Biografi/deskripsi user |
| `phone` | VARCHAR(20) | - | Nomor telpon kontak |
| `address` | TEXT | - | Alamat lengkap |
| `city` | VARCHAR(50) | - | Kota |
| `province` | VARCHAR(50) | - | Provinsi |
| `postal_code` | VARCHAR(10) | - | Kode pos |
| `avatar_url` | TEXT | - | URL foto profil (di Storage) |
| `created_at` | TIMESTAMP | - | Waktu pembuatan profil |
| `updated_at` | TIMESTAMP | - | Waktu update terakhir |

**Indexes:**
- `idx_user_profiles_username` → Cepat lookup by username
- `idx_user_profiles_created_at` → Cepat filter by date

**RLS Policies:**
| Operation | Policy | Rule |
|-----------|--------|------|
| SELECT | "Enable read for all" | Semua orang bisa baca profile |
| UPDATE | "Update own profile" | Hanya user sendiri bisa edit |
| INSERT | "Create own profile" | Hanya user baru bisa insert |

---

### Table 2: `waste_materials`

**Purpose:** Menyimpan data produk limbah organik yang dijual

```sql
CREATE TABLE waste_materials (
  -- PRIMARY KEY
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- FOREIGN KEYS
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- PRODUCT DATA
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  image_url TEXT,
  
  -- STATUS
  status VARCHAR(20) DEFAULT 'active',
  
  -- TIMESTAMPS
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

**Columns:**

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | UUID | PK | ID unik produk (auto-generate) |
| `user_id` | UUID | FK, NOT NULL | ID penjual (link ke user_profiles) |
| `name` | VARCHAR(200) | NOT NULL | Nama produk |
| `description` | TEXT | NOT NULL | Deskripsi detail produk |
| `price` | DECIMAL(12,2) | NOT NULL, >0 | Harga dalam Rp |
| `image_url` | TEXT | - | URL gambar (dari Storage bucket) |
| `status` | VARCHAR(20) | DEFAULT 'active' | active / sold / inactive |
| `created_at` | TIMESTAMP | - | Waktu upload produk |
| `updated_at` | TIMESTAMP | - | Waktu edit terakhir |

**Indexes:**
- `idx_waste_materials_user_id` → Cepat cari produk user
- `idx_waste_materials_created_at` → Cepat sort by date
- `idx_waste_materials_status` → Cepat filter by status
- `idx_waste_materials_name` → Full-text search di name
- `idx_waste_materials_description` → Full-text search di description

**RLS Policies:**

| Operation | Policy | Rule |
|-----------|--------|------|
| SELECT | "Read active products" | Semua bisa lihat produk active |
| SELECT | "View own products" | User bisa lihat produk mereka (any status) |
| INSERT | "Create own" | User hanya insert produk mereka |
| UPDATE | "Update own" | User hanya update produk mereka |
| DELETE | "Delete own" | User hanya delete produk mereka |

---

## 🔗 Relationships

### 1:1 Relationship: `auth.users` ↔ `user_profiles`

```
One auth.users has exactly ONE user_profiles

Example:
┌─────────────────────┐
│ auth.users          │
│ id: uuid-123        │
│ email: user@ex.com  │
└─────────────┬───────┘
              │ (FK: id)
              │
              ▼
┌──────────────────────────┐
│ user_profiles            │
│ id: uuid-123             │
│ username: johndoe        │
│ full_name: John Doe      │
└──────────────────────────┘
```

---

### 1:N Relationship: `user_profiles` ↔ `waste_materials`

```
One user_profiles has MANY waste_materials

Example:
┌──────────────────────┐
│ user_profiles        │
│ id: uuid-123         │
│ username: johndoe    │
└────────┬─────────────┘
         │ (FK: user_id)
         │
    ┌────┴────┬─────────┐
    ▼         ▼         ▼
┌────────┐ ┌────────┐ ┌────────┐
│ prod 1 │ │ prod 2 │ │ prod 3 │
└────────┘ └────────┘ └────────┘
```

**Query:**
```sql
-- Dapatkan semua produk user tertentu
SELECT * FROM waste_materials
WHERE user_id = 'uuid-123'
ORDER BY created_at DESC;

-- Dapatkan produk dengan info penjual (join)
SELECT 
  wm.*,
  up.username,
  up.full_name
FROM waste_materials wm
JOIN user_profiles up ON wm.user_id = up.id
WHERE wm.status = 'active';
```

---

## 📦 Storage Structure

### Bucket: `waste-images`

Menyimpan gambar produk dengan struktur folder:

```
waste-images/
└── waste-materials/
    ├── {user_id_1}/
    │   ├── 1705001234567.jpg      ← Produk 1
    │   ├── 1705001234568.png      ← Produk 2
    │   └── 1705001234569.webp     ← Produk 3
    │
    ├── {user_id_2}/
    │   ├── 1705002345678.jpg
    │   └── 1705002345679.png
    │
    └── {user_id_3}/
        └── 1705003456789.jpg
```

**File Path Formula:**
```
waste-materials/{user_id}/{timestamp}.{extension}
```

**Example:**
```
waste-materials/uuid-123/1705020123456.jpg
```

**Public URL:**
```
https://[PROJECT_ID].supabase.co/storage/v1/object/public/waste-images/waste-materials/uuid-123/1705020123456.jpg
```

---

## 🔐 Row Level Security (RLS) Summary

### RLS untuk `user_profiles`

```
┌─────────────────────────────────────┐
│ user_profiles RLS Policies          │
├─────────────────────────────────────┤
│ SELECT: ALL USERS CAN READ          │
│ └─ Anyone can see any profile       │
│                                     │
│ UPDATE: ONLY OWN PROFILE            │
│ └─ auth.uid() = id                  │
│                                     │
│ INSERT: ONLY SELF                   │
│ └─ auth.uid() = id                  │
│                                     │
│ DELETE: DENIED                      │
│ └─ User account delete hanya via    │
│    auth.admin API                   │
└─────────────────────────────────────┘
```

### RLS untuk `waste_materials`

```
┌──────────────────────────────────────┐
│ waste_materials RLS Policies         │
├──────────────────────────────────────┤
│ SELECT: ACTIVE PRODUCTS ONLY (public)│
│ └─ status = 'active'                 │
│                                      │
│ SELECT: OWN PRODUCTS (any status)    │
│ └─ auth.uid() = user_id              │
│                                      │
│ INSERT: ONLY OWN PRODUCTS            │
│ └─ auth.uid() = user_id              │
│                                      │
│ UPDATE: ONLY OWN PRODUCTS            │
│ └─ auth.uid() = user_id              │
│                                      │
│ DELETE: ONLY OWN PRODUCTS            │
│ └─ auth.uid() = user_id              │
└──────────────────────────────────────┘
```

---

## 📊 Database Views

### View 1: `marketplace_products`

Menampilkan semua produk active dengan info penjual (untuk marketplace).

```sql
CREATE VIEW marketplace_products AS
SELECT 
  wm.id,
  wm.name,
  wm.description,
  wm.price,
  wm.image_url,
  wm.created_at,
  wm.user_id,
  up.username as seller_username,
  up.full_name as seller_name,
  up.city,
  up.province
FROM waste_materials wm
JOIN user_profiles up ON wm.user_id = up.id
WHERE wm.status = 'active'
ORDER BY wm.created_at DESC;
```

**Usage:**
```typescript
// Di marketplace page
const { data: products } = await supabase
  .from('marketplace_products')
  .select('*')
```

---

### View 2: `user_products_summary`

Menampilkan ringkasan produk per user.

```sql
CREATE VIEW user_products_summary AS
SELECT 
  up.id as user_id,
  up.username,
  up.full_name,
  COUNT(wm.id)::INTEGER as total_products,
  COUNT(CASE WHEN wm.status = 'active' THEN 1 END)::INTEGER as active_products,
  COALESCE(SUM(wm.price), 0)::DECIMAL as total_value
FROM user_profiles up
LEFT JOIN waste_materials wm ON up.id = wm.user_id
GROUP BY up.id, up.username, up.full_name;
```

**Usage:**
```typescript
// Di user dashboard untuk statistik
const { data: summary } = await supabase
  .from('user_products_summary')
  .select('*')
  .eq('user_id', userId)
  .single()
```

---

## ⚙️ Database Functions & Triggers

### Function: `update_updated_at_column()`

Otomatis update field `updated_at` setiap kali ada UPDATE.

```sql
CREATE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Triggers:**
```sql
-- Trigger untuk user_profiles
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Trigger untuk waste_materials
CREATE TRIGGER update_waste_materials_updated_at
BEFORE UPDATE ON waste_materials
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

## 📈 Data Flow Diagram

### Login/Register Flow

```
User Input (username, password)
        │
        ▼
  Check auth.users
        │
    ┌───┴───┐
    │       │
   YES      NO
    │       │
    ▼       ▼
  Login   Create New User
    │       │
    └───┬───┘
        │
        ▼
  Create user_profiles
        │
        ▼
  Set Session
        │
        ▼
  Redirect to Dashboard
```

### Upload Product Flow

```
User Submit Form
   (name, desc, price, image)
        │
        ▼
Upload Image to Storage
        │
        ▼
Get Public URL
        │
        ▼
Insert to waste_materials
   (with image_url, user_id)
        │
        ▼
✅ Product Live in Marketplace
```

### Marketplace Browse Flow

```
User Open /marketplace
        │
        ▼
Fetch waste_materials WHERE status='active'
    (join user_profiles)
        │
        ▼
Client-side Filter & Sort
        │
        ▼
Display Products Grid
        │
        ▼
User Click Product
        │
        ▼
Fetch Single Product (join user)
        │
        ▼
Show Detail Page
```

---

## 🔢 Typical Data Amounts

Untuk performance planning:

| Entity | Typical Amount | Storage |
|--------|----------------|---------|
| User Profiles | 100-10K | ~1-10 MB |
| Products | 1K-100K | ~10-100 MB |
| Images | 1K-100K | ~100 MB-1 GB |

**Indexes** memastikan query cepat bahkan dengan:
- Millions of products
- Thousands of active users
- Full-text search

---

## 🚀 Future Schema Extensions

Jika ingin menambah fitur:

### Option 1: Messaging System
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  user1_id UUID REFERENCES user_profiles,
  user2_id UUID REFERENCES user_profiles,
  created_at TIMESTAMP
);

CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations,
  sender_id UUID REFERENCES user_profiles,
  content TEXT,
  created_at TIMESTAMP
);
```

### Option 2: Orders & Transactions
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  buyer_id UUID REFERENCES user_profiles,
  product_id UUID REFERENCES waste_materials,
  quantity INTEGER,
  total_price DECIMAL,
  status VARCHAR(20), -- pending, paid, shipped, delivered
  created_at TIMESTAMP
);
```

### Option 3: Reviews & Ratings
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES waste_materials,
  reviewer_id UUID REFERENCES user_profiles,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP
);
```

---

## 📚 Quick Reference

**Dapatkan user products:**
```sql
SELECT * FROM waste_materials 
WHERE user_id = $1 
ORDER BY created_at DESC;
```

**Marketplace search:**
```sql
SELECT * FROM waste_materials
WHERE status = 'active'
  AND (name ILIKE $1 OR description ILIKE $1)
ORDER BY created_at DESC;
```

**User summary:**
```sql
SELECT * FROM user_products_summary 
WHERE user_id = $1;
```

**Count by user:**
```sql
SELECT user_id, COUNT(*) as product_count
FROM waste_materials
WHERE status = 'active'
GROUP BY user_id;
```

---

**Last Updated:** April 2024
**Database Version:** PostgreSQL 14+
**Supabase Compatibility:** ✅ Fully Compatible
