-- ==========================================================================
-- Dog Diary - Supabase Database Schema Creation Script
-- ==========================================================================

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  pin TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Pets Table
CREATE TABLE IF NOT EXISTS public.pets (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  breed TEXT,
  birthdate TEXT NOT NULL,
  gender TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Daily Logs Table
CREATE TABLE IF NOT EXISTS public.daily_logs (
  id TEXT PRIMARY KEY,
  pet_id TEXT REFERENCES public.pets(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT,
  title TEXT NOT NULL,
  details TEXT,
  gdrive_url TEXT,
  food_brand TEXT,
  food_amount TEXT,
  hunger_rating INTEGER,
  location_name TEXT,
  walk_duration TEXT,
  walk_distance TEXT,
  bathroom_status TEXT,
  event_type TEXT,
  outfit_theme TEXT,
  med_brand TEXT,
  vaccine_name TEXT,
  clinic_name TEXT,
  next_due_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Turn on Row Level Security (RLS) or public access for demo
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs DISABLE ROW LEVEL SECURITY;

-- Insert Mock Data
INSERT INTO public.pets (id, name, breed, birthdate, gender, bio, avatar_url)
VALUES 
  ('pet-1', 'น้องโคล่า (Cola)', 'โกลเด้น รีทรีฟเวอร์ (Golden Retriever)', '2023-05-15', 'ผู้ (ทำหมันแล้ว)', 'สุนัขโกลเด้นอารมณ์ดี ขี้อ้อน ชอบว่ายน้ำ และเล่นลูกบอลเป็นชีวิตจิตใจ 🎾', 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'),
  ('pet-2', 'น้องโมจิ (Moji)', 'คอร์กี้ (Pembroke Welsh Corgi)', '2024-02-10', 'เมีย', 'คอร์กี้ขาสั้น ก้นเด้ง ชอบวิ่งเล่นในสวน และแต่งตัวชุดน่ารักๆ 🎀', 'https://images.unsplash.com/photo-1612536057832-2ff7ead7819c?auto=format&fit=crop&w=600&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.daily_logs (id, pet_id, category, date, time, title, details, food_brand, food_amount, hunger_rating, gdrive_url)
VALUES
  ('log-1', 'pet-1', 'feeding', '2026-09-16', '08:30', 'อาหารเช้าเม็ดโฮลิสติก + อกไก่ต้ม', 'ทานหมดเกลียดด้วยความรวดเร็ว ใส่ผงบำรุงขนและข้อสะโพก 1 ช้อน', 'Royal Canin Max Adult', '250 กรัม', 5, 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80'),
  ('log-2', 'pet-1', 'walk', '2026-09-16', '17:00', 'เดินเล่นสวนสาธารณะประจำหมู่บ้าน', 'อากาศดี อารมณ์แจ่มใส ได้เจอเพื่อนสุนัขพันธุ์ลาบราดอร์และวิ่งแข่งกัน', NULL, NULL, NULL, 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;
