# Guest Access Guide - WITARA Platform

## Overview

WITARA sekarang mendukung **akses tanpa login (guest mode)**! Users bisa langsung mengakses marketplace, upload produk, dan mengelola dashboard tanpa perlu authenticate terlebih dahulu.

## Fitur Guest Access

### ✅ Apa yang Bisa Dilakukan Guest Users?

1. **Jelajahi Marketplace**
   - Lihat semua produk yang tersedia
   - Cari dan filter produk
   - Melihat detail produk lengkap
   - Melihat profil penjual

2. **Upload Produk**
   - Buat listing produk limbah organik baru
   - Upload gambar produk
   - Set harga dan deskripsi
   - Produk langsung tampil di marketplace

3. **Kelola Dashboard**
   - Lihat semua produk yang sudah diupload
   - Edit atau hapus produk sendiri
   - Lihat statistik penjualan
   - Kelola inventory

### ❌ Batasan Guest Users

- **Tidak bisa login** ke akun authenticated
- **Produk tidak bisa ditandai sebagai seller verified**
- **Tidak bisa akses fitur premium** (jika ada di masa depan)
- **Session terbatas ke browser lokal** (localStorage)

## Cara Kerja Guest Mode

### Guest User ID

Setiap guest user mendapatkan **unique ID** yang di-generate dan disimpan di localStorage:
```
guest_[timestamp]_[random-string]
```

Contoh:
```
guest_1713370800000_a1b2c3d4e5
```

### Session Persistence

- Guest ID disimpan di **localStorage** browser
- **Persisten** selama user tidak clear browser data
- **Per-browser**: Jika buka di browser lain, dapatkan ID baru
- **Per-domain**: Setiap domain/port punya guest ID terpisah

### Guest User dalam Database

Guest users disimpan dalam database dengan ID unik:
```sql
-- Contoh guest user record
user_id: "guest_1713370800000_a1b2c3d4e5"
username: "Tamu"
email: "guest_1713370800000_a1b2c3d4e5@guest.witara.local"
is_guest: true
```

## Implementasi Technical

### 1. Guest User Helper (`lib/guest-user.ts`)

```typescript
import { getOrCreateGuestUser } from '@/lib/guest-user'

// Get or create guest user
const guestUser = getOrCreateGuestUser()
// Returns:
// {
//   id: "guest_...",
//   is_guest: true,
//   username: "Tamu",
//   email: "guest_...@guest.witara.local"
// }
```

### 2. Component Usage

**Dashboard Page:**
```typescript
const { data: { session } } = await supabase.auth.getSession()

let currentUser = session?.user
if (!currentUser) {
  currentUser = getOrCreateGuestUser()  // ← Guest mode
}

// Gunakan currentUser.id seperti normal
const { data } = await supabase
  .from('waste_materials')
  .select('*')
  .eq('user_id', currentUser.id)
```

**Upload Page:**
```typescript
// Same pattern - guest can upload
const { error } = await supabase
  .from('waste_materials')
  .insert({
    user_id: user.id,  // ← Works for guest too
    name: formData.name,
    description: formData.description,
    price: parseFloat(formData.price),
    image_url: imageUrl
  })
```

### 3. Navbar Component

Navbar otomatis mendeteksi guest vs authenticated:
```typescript
const [isGuest, setIsGuest] = useState(false)

// Show "Tamu" badge untuk guest users
{isGuest && <span>Tamu</span>}
```

## User Flow

### Scenario 1: First Time Visit (No Login)
```
User buka aplikasi
    ↓
Cek session → Tidak ada authenticated user
    ↓
Create guest user → ID disimpan di localStorage
    ↓
Navbar menampilkan "Tamu" badge
    ↓
User bisa akses Marketplace & Dashboard
```

### Scenario 2: Upload Produk sebagai Guest
```
User klik "Jual Produk"
    ↓
Form upload terbuka (tanpa redirect login)
    ↓
User isi data produk + upload gambar
    ↓
Data disimpan dengan user_id = guest ID
    ↓
Produk tampil di marketplace/dashboard guest
    ↓
User bisa lihat/edit/hapus produk sendiri
```

### Scenario 3: Login sebagai Authenticated User
```
Guest user klik "Login" di navbar
    ↓
Masuk ke login page & authenticate
    ↓
Session berubah dari guest → authenticated
    ↓
Navbar update tampilan (hilang "Tamu" badge)
    ↓
Dashboard sekarang show produk authenticated user
```

## Database Considerations

### RLS Policies dengan Guest Users

Guest users harus bisa akses database tanpa authenticated session. Update RLS policies:

```sql
-- Marketplace: Siapa saja bisa lihat
CREATE POLICY "Public read access on waste_materials"
  ON waste_materials FOR SELECT
  USING (true);  -- ← Allow anonymous

-- Own products: Setiap user (termasuk guest) bisa manage miliknya
CREATE POLICY "Users can manage own products"
  ON waste_materials FOR ALL
  USING (auth.uid() = user_id OR user_id LIKE 'guest_%')
  WITH CHECK (auth.uid() = user_id OR user_id LIKE 'guest_%');
```

### Guest User Database Records

```sql
-- Guest users tidak disimpan di auth.users
-- Hanya disimpan sebagai user_id di tabel lain
-- Tidak ada record khusus untuk guest

-- Contoh: Produk dari guest
SELECT * FROM waste_materials 
WHERE user_id LIKE 'guest_%';
```

## File Changes Summary

| File | Change |
|------|--------|
| `lib/guest-user.ts` | NEW - Guest user helper functions |
| `app/dashboard/page.tsx` | Updated untuk accept guest users |
| `app/upload/page.tsx` | Updated untuk accept guest users |
| `app/page.tsx` | Updated navigation untuk guest-friendly |
| `components/navbar.tsx` | Updated untuk show guest badge |

## Testing Guest Access

### Manual Testing Steps:

1. **Open in Private/Incognito Mode**
   - Buka aplikasi di private window (clear localStorage)
   - Harusnya dapat guest ID baru

2. **Jelajahi Marketplace**
   - Navigate ke `/marketplace`
   - Harusnya lihat semua produk

3. **Upload Produk**
   - Klik "Jual Produk" di home atau navbar
   - Upload produk tanpa login
   - Harusnya redirect ke dashboard setelah upload

4. **Lihat Dashboard**
   - Navigate ke `/dashboard`
   - Harusnya lihat produk yang baru diupload
   - Guest ID harusnya consistent

5. **Login untuk Verify**
   - Klik "Login" di navbar
   - Login dengan authenticated account
   - Dashboard harusnya kosong (produk guest terpisah)

### Check localStorage:

```javascript
// Di browser console
localStorage.getItem('witara_guest_user_id')
// Output: "guest_1713370800000_a1b2c3d4e5"
```

## Troubleshooting

### Guest User Tidak Persist
**Problem:** Setiap refresh, guest mendapat ID baru

**Solution:** Check localStorage settings:
```javascript
// Verify localStorage works
localStorage.setItem('test', 'value')
console.log(localStorage.getItem('test')) // Should output: "value"
```

### Upload Failed sebagai Guest
**Problem:** Produk tidak tersimpan, error message muncul

**Solution:** 
- Cek RLS policies allow guest users
- Cek Supabase anon key configured correctly
- Cek network tab untuk error details

### Can't View Own Products sebagai Guest
**Problem:** Dashboard kosong setelah upload

**Solution:**
- Verify guest ID consistent (check localStorage)
- Check database query untuk user_id matching
- Verify RLS policies allow SELECT untuk guest

## Security Notes

⚠️ **Important Security Considerations:**

1. **Guest Data Public**: Semua produk guest bisa dilihat siapa saja di marketplace
2. **No Authentication**: Guest user tidak authenticated, hanya ID string
3. **LocalStorage Risk**: Clear browser data → Guest ID hilang
4. **No User Privacy**: Tidak ada password/email untuk recover account
5. **Optional Login**: User bisa upgrade ke authenticated account kapanpun

## Future Enhancements

Fitur yang bisa ditambah di masa depan:

- [ ] Guest → Account conversion (simpan products)
- [ ] Guest rating/review system
- [ ] Guest messaging dengan authenticated sellers
- [ ] Guest wishlist (simpan di localStorage)
- [ ] Guest session timeout (auto-logout)
- [ ] Email verification untuk guest (optional)

## Related Documentation

- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Database setup
- [SUPABASE_CODE_REFERENCE.md](SUPABASE_CODE_REFERENCE.md) - Code examples
- [DATABASE_DIAGRAM.md](DATABASE_DIAGRAM.md) - Schema details
- [QUICK_START.md](QUICK_START.md) - Getting started
