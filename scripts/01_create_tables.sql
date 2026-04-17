-- Disable RLS untuk development
ALTER ROLE authenticated SET statement_timeout = '30s';

-- Create waste_materials table
CREATE TABLE IF NOT EXISTS waste_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create user profiles table (optional, for storing additional user info)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Disable RLS on waste_materials table
ALTER TABLE waste_materials DISABLE ROW LEVEL SECURITY;

-- Disable RLS on user_profiles table
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_waste_materials_user_id ON waste_materials(user_id);
CREATE INDEX idx_waste_materials_created_at ON waste_materials(created_at DESC);
