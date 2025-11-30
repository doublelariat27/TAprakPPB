-- Tabel Users untuk autentikasi sederhana (tanpa RLS)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tambahkan kolom user_id ke tabel competitions
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_competitions_user ON competitions(user_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Buat Storage Bucket untuk gambar (jalankan di Supabase Dashboard > Storage)
-- Nama bucket: competition-images
-- Public: true
