/**
 * Central State Store for Dog Diary Web Application
 * Handles authentication, pet profiles, daily log entries, PIN lock, LocalStorage persistence,
 * and Supabase cloud database synchronization.
 */

import { supabase } from './supabase.js';

const STORAGE_KEYS = {
  USERS: 'dog_diary_users',
  CURRENT_USER: 'dog_diary_current_user',
  PETS: 'dog_diary_pets',
  ACTIVE_PET_ID: 'dog_diary_active_pet_id',
  LOGS: 'dog_diary_logs',
  PIN_LOCKED: 'dog_diary_pin_locked'
};

// Initial Seed Data
const SEED_PETS = [
  {
    id: 'pet-1',
    name: 'น้องโคล่า (Cola)',
    breed: 'โกลเด้น รีทรีฟเวอร์ (Golden Retriever)',
    birthdate: '2023-05-15',
    gender: 'ผู้ (ทำหมันแล้ว)',
    bio: 'สุนัขโกลเด้นอารมณ์ดี ขี้อ้อน ชอบว่ายน้ำ และเล่นลูกบอลเป็นชีวิตจิตใจ 🎾',
    avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'pet-2',
    name: 'น้องโมจิ (Moji)',
    breed: 'คอร์กี้ (Pembroke Welsh Corgi)',
    birthdate: '2024-02-10',
    gender: 'เมีย',
    bio: 'คอร์กี้ขาสั้น ก้นเด้ง ชอบวิ่งเล่นในสวน และแต่งตัวชุดน่ารักๆ 🎀',
    avatarUrl: 'https://images.unsplash.com/photo-1612536057832-2ff7ead7819c?auto=format&fit=crop&w=600&q=80'
  }
];

const SEED_LOGS = [
  {
    id: 'log-1',
    petId: 'pet-1',
    category: 'feeding',
    date: '2026-09-16',
    time: '08:30',
    title: 'อาหารเช้าเม็ดโฮลิสติก + อกไก่ต้ม',
    details: 'ทานหมดเกลียดด้วยความรวดเร็ว ใส่ผงบำรุงขนและข้อสะโพก 1 ช้อน',
    foodBrand: 'Royal Canin Max Adult',
    foodAmount: '250 กรัม',
    hungerRating: 5,
    gdriveUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'log-2',
    petId: 'pet-1',
    category: 'walk',
    date: '2026-09-16',
    time: '17:00',
    title: 'เดินเล่นสวนสาธารณะประจำหมู่บ้าน',
    details: 'อากาศดี อารมณ์แจ่มใส ได้เจอเพื่อนสุนัขพันธุ์ลาบราดอร์และวิ่งแข่งกัน',
    walkDuration: '45 นาที',
    walkDistance: '2.5 กม.',
    bathroomStatus: 'อึ 1 ครั้ง (ปกติ) / ฉี่ 3 ครั้ง',
    locationName: 'สวนหมู่บ้านกฤษดา',
    gdriveUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'log-3',
    petId: 'pet-2',
    category: 'outfit',
    date: '2026-09-15',
    time: '11:00',
    title: 'ชุดเอี๊ยมไดโนเสาร์สีเขียวสุดคิวท์',
    details: 'ใส่ออกไปคาเฟ่สัตว์เลี้ยง มีแต่คนขอถ่ายรูป 🦕✨',
    outfitTheme: 'ชุดเอี๊ยมแฟนซีไดโนเสาร์',
    gdriveUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    createdAt: new Date().toISOString()
  }
];

class AppStore {
  constructor() {
    this.listeners = [];
    this.supabaseStatus = 'initializing';
    this.loadState();
    this.syncWithSupabase();
  }

  loadState() {
    const savedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    this.users = savedUsers ? JSON.parse(savedUsers) : [
      { username: 'demo', password: '123', pin: '1234', name: 'คุณเจ้าของสุนัข (Dog Parent)' }
    ];

    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    this.currentUser = savedUser ? JSON.parse(savedUser) : this.users[0];

    const savedPets = localStorage.getItem(STORAGE_KEYS.PETS);
    this.pets = savedPets ? JSON.parse(savedPets) : SEED_PETS;

    const savedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_PET_ID);
    this.activePetId = savedActiveId || (this.pets[0] ? this.pets[0].id : null);

    const savedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
    this.logs = savedLogs ? JSON.parse(savedLogs) : SEED_LOGS;

    const savedPinLocked = localStorage.getItem(STORAGE_KEYS.PIN_LOCKED);
    this.isPinLocked = savedPinLocked ? JSON.parse(savedPinLocked) : false;

    this.saveState();
  }

  saveState() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(this.pets));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PET_ID, this.activePetId || '');
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(this.logs));
    localStorage.setItem(STORAGE_KEYS.PIN_LOCKED, JSON.stringify(this.isPinLocked));
  }

  async syncWithSupabase() {
    try {
      // 1. Fetch Pets from Supabase
      const { data: dbPets, error: petsErr } = await supabase.from('pets').select('*');

      if (petsErr) {
        if (petsErr.code === '42501') {
          console.warn('⚠️ Supabase RLS Policy Error: Please run fix_rls_policies.sql in Supabase SQL Editor.');
        } else {
          console.warn('Supabase pets fetch notice:', petsErr.message);
        }
      } else if (dbPets && dbPets.length > 0) {
        this.pets = dbPets.map(p => ({
          id: p.id,
          name: p.name,
          breed: p.breed,
          birthdate: p.birthdate,
          gender: p.gender,
          bio: p.bio,
          avatarUrl: p.avatar_url
        }));
        if (!this.activePetId || !this.pets.some(p => p.id === this.activePetId)) {
          this.activePetId = this.pets[0].id;
        }
      }

      // 2. Fetch Logs from Supabase
      const { data: dbLogs, error: logsErr } = await supabase.from('daily_logs').select('*');

      if (!logsErr && dbLogs && dbLogs.length > 0) {
        this.logs = dbLogs.map(l => ({
          id: l.id,
          petId: l.pet_id,
          category: l.category,
          date: l.date,
          time: l.time,
          title: l.title,
          details: l.details,
          gdriveUrl: l.gdrive_url,
          foodBrand: l.food_brand,
          foodAmount: l.food_amount,
          hungerRating: l.hunger_rating,
          locationName: l.location_name,
          walkDuration: l.walk_duration,
          walkDistance: l.walk_distance,
          bathroomStatus: l.bathroom_status,
          eventType: l.event_type,
          outfitTheme: l.outfit_theme,
          medBrand: l.med_brand,
          vaccineName: l.vaccine_name,
          clinicName: l.clinic_name,
          nextDueDate: l.next_due_date,
          createdAt: l.created_at
        }));
      }

      this.supabaseStatus = 'online';
      this.notify();
    } catch (err) {
      console.warn('Supabase sync skipped:', err);
      this.supabaseStatus = 'offline';
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.saveState();
    this.listeners.forEach(listener => listener(this));
  }

  // --- Auth & PIN Actions ---
  login(username, password) {
    const found = this.users.find(u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password);
    if (found) {
      this.currentUser = found;
      this.isPinLocked = false;
      this.notify();
      return { success: true };
    }
    return { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
  }

  async register(name, username, password, pin = '') {
    if (!username || !password) {
      return { success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' };
    }
    const exists = this.users.some(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (exists) {
      return { success: false, message: 'ชื่อผู้ใช้นี้มีผู้ใช้งานแล้ว' };
    }

    const newUser = { name: name || username, username: username.trim(), password, pin: pin.trim() };
    this.users.push(newUser);
    this.currentUser = newUser;
    this.isPinLocked = false;
    this.notify();

    try {
      await supabase.from('users').insert([{
        username: newUser.username,
        password: newUser.password,
        name: newUser.name,
        pin: newUser.pin
      }]);
    } catch (e) {
      console.warn('User insert warning:', e);
    }

    return { success: true };
  }

  logout() {
    this.currentUser = null;
    this.isPinLocked = false;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    this.notify();
  }

  async setPin(newPin) {
    if (!this.currentUser) return { success: false };
    this.currentUser.pin = newPin;
    const idx = this.users.findIndex(u => u.username === this.currentUser.username);
    if (idx !== -1) {
      this.users[idx].pin = newPin;
    }
    this.notify();

    try {
      await supabase.from('users').update({ pin: newPin }).eq('username', this.currentUser.username);
    } catch (e) {
      console.warn('Set PIN warning:', e);
    }

    return { success: true };
  }

  verifyPin(enteredPin) {
    if (this.currentUser && this.currentUser.pin === enteredPin) {
      this.isPinLocked = false;
      this.notify();
      return true;
    }
    return false;
  }

  lockApp() {
    if (this.currentUser && this.currentUser.pin) {
      this.isPinLocked = true;
      this.notify();
    }
  }

  // --- Pet Actions ---
  setActivePetId(petId) {
    this.activePetId = petId;
    this.notify();
  }

  getActivePet() {
    return this.pets.find(p => p.id === this.activePetId) || this.pets[0] || null;
  }

  async addPet(petData) {
    const newPet = {
      id: 'pet-' + Date.now(),
      name: petData.name,
      breed: petData.breed || 'ไม่ระบุสายพันธุ์',
      birthdate: petData.birthdate,
      gender: petData.gender || 'ผู้',
      bio: petData.bio || '',
      avatarUrl: petData.avatarUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
    };
    this.pets.push(newPet);
    if (!this.activePetId) {
      this.activePetId = newPet.id;
    }
    this.notify();

    try {
      const { error } = await supabase.from('pets').insert([{
        id: newPet.id,
        name: newPet.name,
        breed: newPet.breed,
        birthdate: newPet.birthdate,
        gender: newPet.gender,
        bio: newPet.bio,
        avatar_url: newPet.avatarUrl
      }]);
      if (error) {
        console.warn('⚠️ Supabase Insert Pet Notice:', error.message);
        if (error.code === '42501') {
          console.warn('👉 Action needed: Please run fix_rls_policies.sql in Supabase SQL Editor to allow public access.');
        }
      } else {
        console.log('✅ Pet saved to Supabase:', newPet.name);
      }
    } catch (err) {
      console.warn('Supabase pet save error:', err);
    }

    return newPet;
  }

  async updatePet(petId, updatedFields) {
    const idx = this.pets.findIndex(p => p.id === petId);
    if (idx !== -1) {
      this.pets[idx] = { ...this.pets[idx], ...updatedFields };
      this.notify();

      try {
        await supabase.from('pets').update({
          name: updatedFields.name,
          breed: updatedFields.breed,
          birthdate: updatedFields.birthdate,
          gender: updatedFields.gender,
          bio: updatedFields.bio,
          avatar_url: updatedFields.avatarUrl
        }).eq('id', petId);
      } catch (err) {
        console.warn('Supabase pet update error:', err);
      }

      return true;
    }
    return false;
  }

  async deletePet(petId) {
    this.pets = this.pets.filter(p => p.id !== petId);
    this.logs = this.logs.filter(l => l.petId !== petId);
    if (this.activePetId === petId) {
      this.activePetId = this.pets[0] ? this.pets[0].id : null;
    }
    this.notify();

    try {
      await supabase.from('pets').delete().eq('id', petId);
      await supabase.from('daily_logs').delete().eq('pet_id', petId);
    } catch (err) {
      console.warn('Supabase pet delete error:', err);
    }
  }

  // --- Daily Log Actions ---
  async addLog(logData) {
    const newLog = {
      id: 'log-' + Date.now(),
      petId: logData.petId || this.activePetId,
      category: logData.category || 'feeding',
      date: logData.date || new Date().toISOString().split('T')[0],
      time: logData.time || new Date().toTimeString().slice(0, 5),
      title: logData.title || '',
      details: logData.details || '',
      gdriveUrl: logData.gdriveUrl || '',
      ...logData,
      createdAt: new Date().toISOString()
    };
    this.logs.unshift(newLog);
    this.notify();

    try {
      const { error } = await supabase.from('daily_logs').insert([{
        id: newLog.id,
        pet_id: newLog.petId,
        category: newLog.category,
        date: newLog.date,
        time: newLog.time,
        title: newLog.title,
        details: newLog.details,
        gdrive_url: newLog.gdriveUrl,
        food_brand: newLog.foodBrand || null,
        food_amount: newLog.foodAmount || null,
        hunger_rating: newLog.hungerRating || null,
        location_name: newLog.locationName || null,
        walk_duration: newLog.walkDuration || null,
        walk_distance: newLog.walkDistance || null,
        bathroom_status: newLog.bathroomStatus || null,
        event_type: newLog.eventType || null,
        outfit_theme: newLog.outfitTheme || null,
        med_brand: newLog.medBrand || null,
        vaccine_name: newLog.vaccineName || null,
        clinic_name: newLog.clinicName || null,
        next_due_date: newLog.nextDueDate || null
      }]);

      if (error) {
        console.warn('⚠️ Supabase Log Insert Notice:', error.message);
      } else {
        console.log('✅ Daily log saved to Supabase:', newLog.title);
      }
    } catch (err) {
      console.warn('Supabase log save error:', err);
    }

    return newLog;
  }

  async deleteLog(logId) {
    this.logs = this.logs.filter(l => l.id !== logId);
    this.notify();

    try {
      await supabase.from('daily_logs').delete().eq('id', logId);
    } catch (err) {
      console.warn('Supabase log delete error:', err);
    }
  }

  getLogsForPet(petId = this.activePetId, categoryFilter = 'all') {
    return this.logs.filter(log => {
      const matchPet = petId === 'all' ? true : log.petId === petId;
      const matchCategory = categoryFilter === 'all' ? true : log.category === categoryFilter;
      return matchPet && matchCategory;
    });
  }
}

export const store = new AppStore();
