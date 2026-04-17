# Database Scripts - WITARA Marketplace

Quick reference untuk semua script database di folder ini.

## Files Overview

### SQL Scripts (SQL Migrations)

| File | Purpose | When to Run |
|------|---------|------------|
| **01-init-database.sql** | Create database schema & tables | First time setup |
| **02-seed-marketplace.sql** | Add sample products & sellers | After database init, for demo |

### Python Scripts (Automation)

| File | Purpose | Usage |
|------|---------|-------|
| **run-migration.py** | Auto-run SQL migrations | `python run-migration.py` |

---

## Quick Start (Copy-Paste Ready)

### Step 1: Setup Database Schema

**Option A - Using Supabase Dashboard:**

1. Login to [Supabase Dashboard](https://app.supabase.com)
2. Select your WITARA project
3. Go to **SQL Editor** → **New Query**
4. Copy-paste entire content of `01-init-database.sql`
5. Click **RUN**

**Result:** ✅ Tables created: `user_profiles`, `waste_materials`

### Step 2: Seed Sample Data

**⚠️ IMPORTANT:** Edit UUID in script first!

1. In Supabase Dashboard, go to **SQL Editor** → **New Query**
2. Copy-paste entire content of `02-seed-marketplace.sql`
3. Find & Replace UUIDs:
   - `11111111-1111-1111-1111-111111111111` → Real user UUID #1
   - `22222222-2222-2222-2222-222222222222` → Real user UUID #2
   - etc.

**How to get real UUIDs:**
```sql
-- Run this in SQL Editor to get actual user IDs:
SELECT id, email FROM auth.users;
```

4. Click **RUN**

**Result:** ✅ 8 sample products added to marketplace

### Step 3: Verify & Test

```bash
# Start dev server
npm run dev

# Open in browser
http://localhost:3000/marketplace

# Should see 8 products with images!
```

---

## Detailed File Documentation

### 01-init-database.sql ⭐

**What it does:**
- Creates `user_profiles` table
- Creates `waste_materials` table  
- Sets up Row Level Security (RLS)
- Creates indexes for performance

**Tables created:**
```
✓ user_profiles
  - id, username, full_name, bio, phone, address, city, province, postal_code, avatar_url
  - Unique constraints: username must be unique
  - Min length: 3 characters

✓ waste_materials
  - id, user_id, name, description, price, image_url, status, created_at, updated_at
  - Relations: user_id references user_profiles(id)
  - Constraints: price > 0, name/desc not empty
```

**Security:**
- RLS enabled for both tables
- SELECT: Anyone can view (for marketplace)
- INSERT/UPDATE/DELETE: Only authenticated users can modify their own data

**Performance:**
- Full-text search indexes on name & description
- B-tree indexes on user_id, created_at, status
- Index on username for fast lookup

---

### 02-seed-marketplace.sql 🌱

**What it does:**
- Inserts 4 sample seller profiles
- Inserts 8 sample products
- Uses real Unsplash image URLs
- Products have realistic pricing & descriptions

**Sample Data:**
```
Sellers: 4
  1. penjual_tepung (Organik Sejati) - Semarang, Jawa Tengah
  2. limbah_pangan_jogja (Tani Jaya Indonesia) - Yogyakarta
  3. organik_bandung (CV Biji Organik Nusantara) - Bandung, Jawa Barat
  4. kompos_jakarta (PT Hijau Lestari) - Jakarta, DKI Jakarta

Products: 8
  1. Tepung Tapioka Organik - Rp 125.000
  2. Dedak Padi Organik - Rp 85.000
  3. Ampas Kopi Organik - Rp 45.000
  4. Kulit Kacang Organik - Rp 55.000
  5. Biji Bunga Matahari Organik - Rp 165.000
  6. Kompos Matang Premium - Rp 95.000
  7. Serbuk Gergaji Organik - Rp 35.000
  8. Cangkang Kacang Tanah Organik - Rp 42.000
```

**Before running:**
- ⚠️ Replace dummy UUIDs with real user IDs from `auth.users`
- Or use UUIDs as-is for testing (if RLS allows dummy users)
- Check database has created user_profiles first

---

### run-migration.py 🐍

**What it does:**
- Reads SQL files from scripts/ folder
- Executes them in Supabase
- Handles errors gracefully
- Reports status

**Requirements:**
```bash
pip install python-dotenv supabase
```

**Environment Setup:**
```bash
# Add to .env.local (root of project)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Usage:**
```bash
# From project root
python scripts/run-migration.py

# Expected output:
# Connected to Supabase!
# Running: 01-init-database.sql...
# ✓ Completed successfully
# Running: 02-seed-marketplace.sql...
# ✓ Completed successfully
```

---

## Common Operations

### View all products
```sql
SELECT * FROM waste_materials 
WHERE status = 'active'
ORDER BY created_at DESC;
```

### View seller info with products
```sql
SELECT 
  u.username,
  u.full_name,
  u.city,
  COUNT(w.id) as product_count,
  SUM(w.price) as total_value
FROM user_profiles u
LEFT JOIN waste_materials w ON u.id = w.user_id
GROUP BY u.id, u.username, u.full_name, u.city;
```

### Search products by name
```sql
SELECT * FROM waste_materials
WHERE to_tsvector('indonesian', name || ' ' || description) 
      @@ plainto_tsquery('indonesian', 'tepung')
AND status = 'active';
```

### Update product status
```sql
UPDATE waste_materials
SET status = 'sold', updated_at = NOW()
WHERE id = 'YOUR-PRODUCT-UUID'::uuid;
```

---

## Troubleshooting

### "ERROR: duplicate key value violates unique constraint"
**Problem:** UUID already exists in database
**Solution:** Edit script, replace that UUID with a new one

### "ERROR: permission denied for schema public"  
**Problem:** User doesn't have permissions
**Solution:** Use `SUPABASE_SERVICE_ROLE_KEY` instead of anon key

### Products don't show in marketplace
**Checklist:**
- [ ] status = 'active' (not 'sold' or 'inactive')
- [ ] user_profiles exist (FK constraint)
- [ ] RLS policy allows SELECT
- [ ] Run both migration scripts in order

### Images not displaying
**Check:**
- [ ] image_url is not null
- [ ] URL is valid (can access in browser)
- [ ] CORS enabled if using external CDN

---

## Full Documentation

For complete guides, see:
- **DATABASE_SCRIPTS_REFERENCE.md** - Detailed schema & queries
- **MARKETPLACE_SETUP_GUIDE.md** - Frontend integration guide
- **SUPABASE_SETUP.md** - Supabase configuration

---

## Production Checklist

Before deploying to production:

- [ ] Run migrations in production database
- [ ] Verify RLS policies are enabled
- [ ] Backup production data
- [ ] Test marketplace functionality
- [ ] Monitor error logs
- [ ] Set up regular backups
- [ ] Configure monitoring & alerts
- [ ] Document any custom changes

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Read MARKETPLACE_SETUP_GUIDE.md
3. Check Supabase dashboard logs
4. Run SQL queries to verify data

---

**Last Updated:** April 17, 2024  
**Version:** 1.0.0  
**Maintained by:** WITARA Dev Team
