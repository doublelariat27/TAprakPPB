-- Tabel Kategori Lomba
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50) DEFAULT 'trophy',
  color VARCHAR(20) DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Lomba/Kompetisi
CREATE TABLE IF NOT EXISTS competitions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  organizer VARCHAR(255),
  registration_start DATE,
  registration_end DATE,
  event_start DATE,
  event_end DATE,
  location VARCHAR(255),
  is_online BOOLEAN DEFAULT false,
  registration_link VARCHAR(500),
  prize VARCHAR(255),
  requirements TEXT,
  contact_info VARCHAR(255),
  image_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Bookmark/Saved (optional untuk fitur save)
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
  user_identifier VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(competition_id, user_identifier)
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_competitions_category ON competitions(category_id);
CREATE INDEX IF NOT EXISTS idx_competitions_featured ON competitions(is_featured);
CREATE INDEX IF NOT EXISTS idx_competitions_event_start ON competitions(event_start);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_identifier);
