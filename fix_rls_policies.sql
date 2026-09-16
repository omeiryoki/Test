-- ==========================================================================
-- Dog Diary - Fix Supabase RLS Policies & Insert Nong Muffin
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ==========================================================================

-- 1. Disable Row Level Security (RLS) on all 3 tables so Anon API Key can read/write
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.pets DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.daily_logs DISABLE ROW LEVEL SECURITY;

-- 2. Drop existing restrictive policies if any
DROP POLICY IF EXISTS "Allow public all pets" ON public.pets;
DROP POLICY IF EXISTS "Allow public all daily_logs" ON public.daily_logs;
DROP POLICY IF EXISTS "Allow public all users" ON public.users;

-- 3. Create full permission policies for anon public key
CREATE POLICY "Allow public all pets" ON public.pets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all daily_logs" ON public.daily_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all users" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- 4. Insert Demo Pets (including Nong Muffin) into Supabase
INSERT INTO public.pets (id, name, breed, birthdate, gender, bio, avatar_url)
VALUES 
  ('pet-1', 'น้องโคล่า (Cola)', 'โกลเด้น รีทรีฟเวอร์ (Golden Retriever)', '2023-05-15', 'ผู้ (ทำหมันแล้ว)', 'สุนัขโกลเด้นอารมณ์ดี ขี้อ้อน ชอบว่ายน้ำ และเล่นลูกบอลเป็นชีวิตจิตใจ 🎾', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'),
  ('pet-2', 'น้องโมจิ (Moji)', 'คอร์กี้ (Pembroke Welsh Corgi)', '2024-02-10', 'เมีย', 'คอร์กี้ขาสั้น ก้นเด้ง ชอบวิ่งเล่นในสวน และแต่งตัวชุดน่ารักๆ 🎀', 'https://images.unsplash.com/photo-1612536057832-2ff7ead7819c?auto=format&fit=crop&w=600&q=80'),
  ('pet-3', 'Nong Muffin (Muffin)', 'พูเดิล (Poodle)', '2024-05-20', 'เมีย', 'Fluffy cute Poodle dog, friendly and happy', 'https://images.unsplash.com/photo-1591769225440-811ad7d6eab2?auto=format&fit=crop&w=600&q=80')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  breed = EXCLUDED.breed,
  birthdate = EXCLUDED.birthdate,
  gender = EXCLUDED.gender,
  bio = EXCLUDED.bio,
  avatar_url = EXCLUDED.avatar_url;

-- 5. Insert Daily Logs into Supabase
INSERT INTO public.daily_logs (id, pet_id, category, date, time, title, details, food_brand, food_amount, hunger_rating, location_name, walk_duration, walk_distance, gdrive_url)
VALUES
  ('log-1', 'pet-1', 'feeding', '2026-09-16', '08:30', 'อาหารเช้าเม็ดโฮลิสติก + อกไก่ต้ม', 'ทานหมดเกลียดด้วยความรวดเร็ว ใส่ผงบำรุงขนและข้อสะโพก 1 ช้อน', 'Royal Canin Max Adult', '250 กรัม', 5, NULL, NULL, NULL, 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80'),
  ('log-2', 'pet-1', 'walk', '2026-09-16', '17:00', 'เดินเล่นสวนสาธารณะประจำหมู่บ้าน', 'อากาศดี อารมณ์แจ่มใส ได้เจอเพื่อนสุนัขพันธุ์ลาบราดอร์และวิ่งแข่งกัน', NULL, NULL, NULL, 'สวนหมู่บ้านกฤษดา', '45 นาที', '2.5 กม.', 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80'),
  ('log-3', 'pet-2', 'outfit', '2026-09-15', '11:00', 'ชุดเอี๊ยมไดโนเสาร์สีเขียวสุดคิวท์', 'ใส่ออกไปคาเฟ่สัตว์เลี้ยง มีแต่คนขอถ่ายรูป 🦕✨', NULL, NULL, NULL, NULL, NULL, NULL, 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80'),
  ('log-4', 'pet-3', 'walk', '2026-09-16', '08:00', 'Evening walk in the park', 'Muffin was very cheerful, loved smelling flowers', NULL, NULL, NULL, 'Bangkok Park', '20 mins', '1 km', '')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  details = EXCLUDED.details;

-- 6. Insert Users into Supabase
INSERT INTO public.users (username, password, name, pin)
VALUES ('demo', '123', 'คุณเจ้าของสุนัข (Dog Parent)', '1234')
ON CONFLICT (username) DO NOTHING;
