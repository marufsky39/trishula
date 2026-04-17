-- ============================================================================
-- WITARA Platform Database Schema
-- ============================================================================
-- Platform untuk menjual dan membeli limbah organik (waste materials)
-- Menggunakan Supabase untuk authentication dan storage
-- ============================================================================

-- Drop existing tables if they exist (for clean slate)
DROP TABLE IF EXISTS waste_materials CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- ============================================================================
-- TABLE: user_profiles
-- ============================================================================
-- Menyimpan informasi profil pengguna yang lebih lengkap
-- Setiap user dari auth.users akan memiliki satu profil
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  bio TEXT,
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(50),
  province VARCHAR(50),
  postal_code VARCHAR(10),
  avatar_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT username_length CHECK (LENGTH(username) >= 3)
);

-- Index untuk faster lookups
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_created_at ON user_profiles(created_at);

-- ============================================================================
-- TABLE: waste_materials
-- ============================================================================
-- Menyimpan data produk limbah organik yang dijual oleh pengguna
-- Setiap produk memiliki informasi detail tentang limbah organik tersebut
CREATE TABLE waste_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Product Information
  name VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  
  -- Image / Media
  image_url TEXT,
  
  -- Metadata
  status VARCHAR(20) DEFAULT 'active', -- active, sold, inactive
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT name_not_empty CHECK (LENGTH(name) > 0),
  CONSTRAINT description_not_empty CHECK (LENGTH(description) > 0),
  CONSTRAINT positive_price CHECK (price > 0)
);

-- Indexes untuk optimization
CREATE INDEX idx_waste_materials_user_id ON waste_materials(user_id);
CREATE INDEX idx_waste_materials_created_at ON waste_materials(created_at DESC);
CREATE INDEX idx_waste_materials_status ON waste_materials(status);
CREATE INDEX idx_waste_materials_name ON waste_materials USING GIN(to_tsvector('indonesian', name));
CREATE INDEX idx_waste_materials_description ON waste_materials USING GIN(to_tsvector('indonesian', description));

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy untuk user_profiles - READ: Semua orang bisa lihat profile
CREATE POLICY "Enable read access for all users" ON user_profiles
  FOR SELECT USING (true);

-- Policy untuk user_profiles - WRITE: Hanya user sendiri yang bisa edit profilnya
CREATE POLICY "Enable update for users based on id" ON user_profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Policy untuk user_profiles - INSERT: User baru bisa membuat profil sendiri
CREATE POLICY "Enable insert for authenticated users" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Enable RLS untuk waste_materials
ALTER TABLE waste_materials ENABLE ROW LEVEL SECURITY;

-- Policy untuk waste_materials - READ: Semua orang bisa lihat produk aktif
CREATE POLICY "Enable read access for all users" ON waste_materials
  FOR SELECT USING (status = 'active');

-- Policy untuk waste_materials - READ: User bisa lihat produk mereka sendiri
CREATE POLICY "Users can view their own products" ON waste_materials
  FOR SELECT USING (auth.uid() = user_id OR status = 'active');

-- Policy untuk waste_materials - INSERT: User bisa membuat produk baru
CREATE POLICY "Users can create their own products" ON waste_materials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy untuk waste_materials - UPDATE: User hanya bisa update produk sendiri
CREATE POLICY "Users can update their own products" ON waste_materials
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Policy untuk waste_materials - DELETE: User hanya bisa delete produk sendiri
CREATE POLICY "Users can delete their own products" ON waste_materials
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- VIEWS untuk memudahkan queries
-- ============================================================================

-- View untuk marketplace - tampilkan semua produk aktif dengan info penjual
CREATE OR REPLACE VIEW marketplace_products AS
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

-- View untuk user dashboard - tampilkan semua produk user dengan statistik
CREATE OR REPLACE VIEW user_products_summary AS
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

-- ============================================================================
-- FUNCTIONS untuk business logic
-- ============================================================================

-- Function untuk update 'updated_at' timestamp secara otomatis
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- ============================================================================
-- Comments untuk dokumentasi
-- ============================================================================

COMMENT ON TABLE user_profiles IS 'Profil pengguna WITARA platform. Menyimpan data lengkap pengguna termasuk username, alamat, dan kontak.';
COMMENT ON TABLE waste_materials IS 'Produk limbah organik yang dijual di WITARA marketplace. Setiap produk memiliki informasi detail dan image.';
COMMENT ON COLUMN waste_materials.status IS 'Status produk: active (dipasarkan), sold (terjual), inactive (dinonaktifkan)';
COMMENT ON VIEW marketplace_products IS 'View untuk marketplace - menampilkan semua produk aktif dengan informasi penjual';
COMMENT ON VIEW user_products_summary IS 'View untuk dashboard user - menampilkan ringkasan produk dan statistik user';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
