# Setup Verification Checklist

Gunakan checklist ini untuk memverifikasi bahwa marketplace sudah terimplementasi dengan benar.

## Phase 1: Database Setup

### Prerequisites
- [ ] Supabase project aktif
- [ ] Environment variables set:
  - [ ] NEXT_PUBLIC_SUPABASE_URL
  - [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
  - [ ] SUPABASE_SERVICE_ROLE_KEY

### Database Migrations
- [ ] Script `scripts/01-init-database.sql` sudah dijalankan
  - [ ] Table `user_profiles` exists
  - [ ] Table `waste_materials` exists
  - [ ] Indexes created
  - [ ] RLS policies enabled

- [ ] Script `scripts/02-seed-marketplace.sql` sudah dijalankan
  - [ ] 4 seller profiles created
  - [ ] 8 sample products created
  - [ ] All products with status = 'active'

### Verification Query

Run in Supabase SQL Editor:
```sql
-- Check user profiles
SELECT COUNT(*) as user_count FROM user_profiles;
-- Expected: 4

-- Check products
SELECT COUNT(*) as product_count FROM waste_materials WHERE status = 'active';
-- Expected: 8

-- Check with seller info
SELECT w.name, w.price, u.username 
FROM waste_materials w
LEFT JOIN user_profiles u ON w.user_id = u.id
LIMIT 3;
-- Should see products with seller names
```

---

## Phase 2: Frontend Setup

### Dependencies
- [ ] All npm packages installed: `npm install` (or `npm ci`)
- [ ] No missing peer dependencies
- [ ] Dev server can start: `npm run dev`

### Environment Setup
- [ ] .env.local file exists in project root
- [ ] Contains all required variables:
  ```
  NEXT_PUBLIC_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY
  SUPABASE_SERVICE_ROLE_KEY (if using Python migration)
  ```

### Page Verification
- [ ] `/` (home) page loads
- [ ] `/marketplace` page loads
- [ ] `/upload` page loads
- [ ] `/dashboard` page loads
- [ ] Navbar displays correctly

---

## Phase 3: Marketplace Functionality

### Marketplace Page (`/marketplace`)

**Visual Elements:**
- [ ] Page title: "Marketplace Limbah Organik"
- [ ] Search input visible
- [ ] Sort dropdown visible
- [ ] Product grid loads without errors

**Product Display:**
- [ ] Shows 8 products
- [ ] Each product card displays:
  - [ ] Product image (from Unsplash)
  - [ ] Product name
  - [ ] Price in Rupiah format
  - [ ] Short description
  - [ ] Seller username
  - [ ] Created date

**Search Functionality:**
- [ ] Type in search: "tepung"
- [ ] See filtered results (at least 1 product)
- [ ] Clear search: shows all 8 products again
- [ ] Search "xyzabc": shows empty state correctly

**Sort Functionality:**
- [ ] Sort "Terbaru": newest products first
- [ ] Sort "Harga Terendah": lowest price first (Rp 35.000)
- [ ] Sort "Harga Tertinggi": highest price first (Rp 165.000)

**Product Links:**
- [ ] Click product card → goes to product detail page
- [ ] URL changes to `/product/[id]`
- [ ] Back button works

---

## Phase 4: Upload Page (`/upload`)

### Form Elements
- [ ] Product name input visible
- [ ] Description textarea visible
- [ ] Price input visible
- [ ] Image upload button visible
- [ ] Publish button visible

### Image Upload
- [ ] Click upload button → file picker opens
- [ ] Select image file → preview shows
- [ ] Preview image displays correctly
- [ ] Can remove preview & select another image
- [ ] File size validation works (< 5MB)

### Form Submission
- [ ] Fill all fields with valid data
- [ ] Click Publish → loading state
- [ ] Product inserted to database
- [ ] Redirected to marketplace
- [ ] New product visible in marketplace with image
- [ ] New product has guest user ID

### Error Handling
- [ ] Try submit empty form → shows error
- [ ] Try negative price → shows error
- [ ] Try file > 5MB → shows error
- [ ] Try submit with special chars → works fine

---

## Phase 5: Product Detail Page

### Page Load
- [ ] `/product/[valid-id]` loads product detail
- [ ] Shows product image, name, price, description
- [ ] Shows seller info (username, city, contact)
- [ ] Shows related products (optional)

### Product Information
- [ ] All product fields display correctly
- [ ] Price formatted in Rupiah
- [ ] Date formatted in Indonesian locale
- [ ] Seller username clickable (future: go to seller profile)

### Invalid Product ID
- [ ] `/product/invalid-uuid` shows error page
- [ ] Error message clear & helpful

---

## Phase 6: Guest Mode

### Guest User Creation
- [ ] First visit without login → guest user created
- [ ] Guest ID stored in localStorage
- [ ] Navbar shows "Tamu" badge
- [ ] Guest can access marketplace & upload

### Guest Persistence
- [ ] Refresh page → still logged in as guest
- [ ] Close & reopen browser → still logged in (localStorage)
- [ ] Guest products visible in marketplace

### Guest Limitations
- [ ] Can browse marketplace
- [ ] Can upload products
- [ ] Cannot access authenticated-only features (future)

---

## Phase 7: Navigation & UI

### Navbar
- [ ] Logo/brand visible
- [ ] Home link works
- [ ] Marketplace link works
- [ ] Dashboard link works
- [ ] User badge shows "Tamu" (for guests) or username
- [ ] Login button present
- [ ] Responsive on mobile (hamburger menu)

### Home Page (`/`)
- [ ] CTA buttons point to marketplace & upload
- [ ] Feature descriptions visible
- [ ] Responsive design works

### Dashboard (`/dashboard`)
- [ ] Shows "Your Products" section
- [ ] Lists products uploaded by current user
- [ ] Shows edit/delete options (optional)
- [ ] Shows product counts

---

## Phase 8: Performance & Optimization

### Load Times
- [ ] Marketplace loads within 2 seconds
- [ ] Search responds instantly (< 500ms)
- [ ] Image loads visible within 3 seconds
- [ ] No console errors on page load

### Responsive Design
- [ ] **Mobile (375px):**
  - [ ] Products displayed in 1 column
  - [ ] Navigation in hamburger menu
  - [ ] Images scale properly
  
- [ ] **Tablet (768px):**
  - [ ] Products displayed in 2 columns
  - [ ] Navigation visible
  
- [ ] **Desktop (1024px+):**
  - [ ] Products displayed in 3 columns
  - [ ] Full navigation visible

### Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

---

## Phase 9: Data Integrity

### Database Constraints
- [ ] Cannot create product with negative price
- [ ] Cannot create product without name
- [ ] Cannot create product without description
- [ ] Username must be unique
- [ ] Username minimum 3 characters

### RLS Policies
- [ ] Can read all active products (public)
- [ ] Can only update own products
- [ ] Can only delete own products
- [ ] Cannot delete other user's products

---

## Phase 10: Security

### Input Validation
- [ ] SQL Injection test: `'; DROP TABLE--` → safely handled
- [ ] XSS test: `<script>alert('xss')</script>` → escaped
- [ ] Large input: 10000 chars → handled gracefully

### Authentication
- [ ] Guest user cannot access admin pages (if any)
- [ ] Product images load without CORS errors
- [ ] API keys not exposed in frontend code
- [ ] Service role key not in client-side code

---

## Phase 11: Documentation

### README & Guides
- [ ] `README.md` exists and is readable
- [ ] `MARKETPLACE_IMPLEMENTATION_SUMMARY.md` readable
- [ ] `MARKETPLACE_SETUP_GUIDE.md` has code examples
- [ ] `scripts/README.md` has setup instructions
- [ ] `scripts/DATABASE_SCRIPTS_REFERENCE.md` detailed

### Code Comments
- [ ] Marketplace page has comments
- [ ] Upload page has comments
- [ ] Key functions documented
- [ ] Database schema documented

---

## Phase 12: Git & Version Control

### Commits
- [ ] All changes committed with meaningful messages
- [ ] Commit history is clean
- [ ] No node_modules committed
- [ ] .env files excluded from git

### Branch
- [ ] On correct branch (v0/marufsky39-2942-d367cff7)
- [ ] Ready to create PR to main if needed

---

## Final Verification

### Success Criteria

✅ **All of these must be true:**
- [ ] Marketplace page shows 8 products
- [ ] Search works correctly
- [ ] Sort works correctly
- [ ] Can upload new product
- [ ] Uploaded product appears in marketplace
- [ ] Product images display
- [ ] Seller info visible
- [ ] No console errors
- [ ] Works on mobile/tablet/desktop
- [ ] Guest mode working
- [ ] All documentation readable

---

## Troubleshooting Guide

### Issue: "Products not showing"
```
Check these in order:
1. [ ] Database migrated? SELECT COUNT(*) FROM waste_materials;
2. [ ] Products have status='active'?
3. [ ] RLS policy allows SELECT?
4. [ ] user_profiles exist? (FK constraint)
5. [ ] Page has no console errors? (F12)
```

### Issue: "Images not displaying"
```
Check:
1. [ ] image_url not null in database
2. [ ] URL valid (test in browser)
3. [ ] CORS enabled
4. [ ] Unsplash link still active
```

### Issue: "Upload fails"
```
Check:
1. [ ] Supabase Storage bucket exists
2. [ ] File < 5MB
3. [ ] Browser console error message (F12)
4. [ ] Supabase dashboard logs
5. [ ] API response in Network tab
```

### Issue: "Guest mode not working"
```
Check:
1. [ ] localStorage enabled in browser
2. [ ] guest-user.ts is imported
3. [ ] No auth errors in console
4. [ ] Guest ID persists after refresh
```

---

## Next Steps After Verification

Once all checkboxes are ✅:

1. **Test with Real Users**
   - Share marketplace URL
   - Get feedback
   - Identify UX improvements

2. **Deploy to Production**
   - Set up production database
   - Configure environment variables
   - Run migrations in production
   - Test thoroughly

3. **Monitor & Maintain**
   - Set up error tracking (Sentry)
   - Monitor performance (Vercel Analytics)
   - Regular backups
   - User feedback loop

4. **Add More Features**
   - Cart & checkout
   - Payment integration
   - User ratings & reviews
   - Messaging system
   - Admin dashboard

---

## Success! 🎉

If all checkboxes are checked, your marketplace is:
- ✅ Fully functional
- ✅ Well-documented
- ✅ Ready for users
- ✅ Secure
- ✅ Performant

**Time to share it with the world!**

---

**Checklist Version:** 1.0.0  
**Last Updated:** April 17, 2024  
**Created for:** WITARA Marketplace
