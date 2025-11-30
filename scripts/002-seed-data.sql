-- Seed Kategori
INSERT INTO categories (name, description, icon, color) VALUES
('Teknologi', 'Lomba pemrograman, hackathon, UI/UX, dan teknologi lainnya', 'code', '#3B82F6'),
('Bisnis', 'Business plan, startup pitch, dan kompetisi bisnis', 'briefcase', '#10B981'),
('Seni & Desain', 'Lomba desain grafis, fotografi, videografi, dan seni', 'palette', '#F59E0B'),
('Sains', 'Olimpiade sains, penelitian, dan karya ilmiah', 'flask', '#8B5CF6'),
('Olahraga', 'Kompetisi esports, olahraga, dan kebugaran', 'trophy', '#EF4444'),
('Penulisan', 'Lomba menulis, essay, puisi, dan jurnalistik', 'pen-tool', '#EC4899');

-- Seed Kompetisi
INSERT INTO competitions (
  title, description, category_id, organizer, 
  registration_start, registration_end, event_start, event_end,
  location, is_online, registration_link, prize, requirements, contact_info, image_url, is_featured
) VALUES
(
  'Hackathon Indonesia 2025',
  'Kompetisi hackathon terbesar di Indonesia dengan tema Smart City dan Sustainable Development. Peserta akan membuat solusi inovatif dalam 48 jam.',
  (SELECT id FROM categories WHERE name = 'Teknologi'),
  'Kementerian Kominfo',
  '2025-01-01', '2025-02-15', '2025-03-01', '2025-03-02',
  'Jakarta Convention Center', false,
  'https://hackathon.id/register', 'Total Rp 500 Juta',
  'Mahasiswa aktif S1/D3, Tim 3-5 orang, Membawa laptop sendiri',
  'info@hackathon.id', '/placeholder.svg?height=400&width=600',
  true
),
(
  'UI/UX Design Challenge',
  'Kompetisi desain antarmuka dan pengalaman pengguna untuk aplikasi kesehatan digital. Tunjukkan kreativitas dan kemampuan problem solving Anda.',
  (SELECT id FROM categories WHERE name = 'Teknologi'),
  'Tokopedia',
  '2025-01-10', '2025-02-28', '2025-03-15', '2025-03-20',
  'Online', true,
  'https://tokopedia.design/challenge', 'Rp 75 Juta + Internship',
  'Terbuka untuk umum, Portfolio wajib dilampirkan',
  'design@tokopedia.com', '/placeholder.svg?height=400&width=600',
  true
),
(
  'National Business Case Competition',
  'Kompetisi studi kasus bisnis tingkat nasional. Analisis permasalahan nyata perusahaan dan berikan solusi strategis.',
  (SELECT id FROM categories WHERE name = 'Bisnis'),
  'Universitas Indonesia',
  '2025-01-05', '2025-02-10', '2025-02-25', '2025-02-27',
  'Kampus UI Depok', false,
  'https://feb.ui.ac.id/nbcc', 'Rp 50 Juta',
  'Mahasiswa S1 aktif, Tim 3 orang dari universitas yang sama',
  'nbcc@ui.ac.id', '/placeholder.svg?height=400&width=600',
  true
),
(
  'Startup Pitch Competition',
  'Pitching ide startup Anda di depan investor ternama. Kesempatan mendapat pendanaan dan mentorship.',
  (SELECT id FROM categories WHERE name = 'Bisnis'),
  'IDX Incubator',
  '2025-02-01', '2025-03-15', '2025-04-01', '2025-04-01',
  'Bursa Efek Indonesia', false,
  'https://idx.co.id/startup-pitch', 'Pendanaan hingga Rp 1 Miliar',
  'Startup tahap early-stage, Sudah memiliki MVP',
  'incubator@idx.co.id', '/placeholder.svg?height=400&width=600',
  false
),
(
  'National Photography Contest',
  'Lomba fotografi nasional dengan tema "Indonesia Heritage". Abadikan keindahan warisan budaya Indonesia.',
  (SELECT id FROM categories WHERE name = 'Seni & Desain'),
  'National Geographic Indonesia',
  '2025-01-15', '2025-03-31', '2025-04-15', '2025-04-15',
  'Online', true,
  'https://natgeo.id/photo-contest', 'Rp 100 Juta + Trip',
  'Terbuka untuk umum, Foto original, Maksimal 5 karya',
  'contest@natgeo.id', '/placeholder.svg?height=400&width=600',
  false
),
(
  'Olimpiade Sains Nasional',
  'Kompetisi sains bergengsi untuk siswa SMA. Meliputi bidang Matematika, Fisika, Kimia, Biologi, Informatika, Astronomi, dan Ekonomi.',
  (SELECT id FROM categories WHERE name = 'Sains'),
  'Kementerian Pendidikan',
  '2025-01-01', '2025-01-31', '2025-05-01', '2025-05-07',
  'Yogyakarta', false,
  'https://pusatprestasinasional.kemdikbud.go.id', 'Medali + Beasiswa',
  'Siswa SMA/sederajat, Melalui seleksi tingkat sekolah dan provinsi',
  'osn@kemdikbud.go.id', '/placeholder.svg?height=400&width=600',
  true
),
(
  'Mobile Legends Bang Bang Pro League',
  'Turnamen esports Mobile Legends tingkat nasional dengan total hadiah fantastis.',
  (SELECT id FROM categories WHERE name = 'Olahraga'),
  'Moonton',
  '2025-02-01', '2025-02-28', '2025-03-15', '2025-06-30',
  'Jakarta', false,
  'https://mpl.id/register', 'Rp 7 Miliar',
  'Tim 5 orang + 1 coach, Rank minimal Mythic',
  'mpl@moonton.com', '/placeholder.svg?height=400&width=600',
  false
),
(
  'Lomba Esai Nasional',
  'Kompetisi menulis esai ilmiah dengan tema "Pendidikan Indonesia di Era Digital".',
  (SELECT id FROM categories WHERE name = 'Penulisan'),
  'LPDP',
  '2025-01-20', '2025-03-20', '2025-04-10', '2025-04-10',
  'Online', true,
  'https://lpdp.kemenkeu.go.id/esai', 'Rp 30 Juta + Sertifikat',
  'WNI, Mahasiswa/Alumni, Esai 1500-3000 kata',
  'esai@lpdp.kemenkeu.go.id', '/placeholder.svg?height=400&width=600',
  false
);
