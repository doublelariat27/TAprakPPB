-- Menambah user_id ke competitions table jika belum ada
ALTER TABLE competitions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_competitions_user ON competitions(user_id);
