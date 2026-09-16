import { store } from '../state.js';
import { calculateAge, formatDateThai } from '../utils/age.js';

export function renderPetManagementView() {
  const pets = store.pets;
  const activePet = store.getActivePet();

  return `
    <div class="glass-card" style="margin-bottom: 1.5rem;">
      <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2>🐾 จัดการสัตว์เลี้ยง (${pets.length} ตัว)</h2>
          <p class="text-muted text-sm">เพิ่มและจัดการโปรไฟล์สุนัขในความดูแลของคุณ</p>
        </div>
        <button class="btn btn-primary" id="btn-open-add-pet">
          ➕ เพิ่มสุนัขตัวใหม่
        </button>
      </div>
    </div>

    <!-- Pet Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.25rem;">
      ${pets.length === 0 ? `
        <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">🐕</div>
          <h3>ยังไม่มีข้อมูลสัตว์เลี้ยง</h3>
          <p class="text-muted text-sm" style="margin-bottom: 1rem;">กดปุ่ม "เพิ่มสุนัขตัวใหม่" ด้านบนเพื่อเริ่มบันทึกข้อมูล</p>
        </div>
      ` : pets.map(pet => {
        const ageObj = calculateAge(pet.birthdate);
        const isActive = activePet && activePet.id === pet.id;

        return `
          <div class="glass-card pet-card ${isActive ? 'active-pet-card' : ''}" style="${isActive ? 'border: 2px solid var(--primary);' : ''}">
            <div class="pet-card-header">
              <img class="pet-avatar-large" src="${pet.avatarUrl || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'}" alt="${pet.name}" />
              <div style="flex: 1; min-width: 0;">
                <div class="flex items-center justify-between">
                  <h3 style="font-size: 1.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${pet.name}</h3>
                  ${isActive ? '<span class="badge badge-feeding">กำลังเลือก</span>' : ''}
                </div>
                <div class="text-sm text-muted" style="margin-top: 0.1rem;">${pet.breed} (${pet.gender})</div>
                
                <!-- Auto-Calculated Age Display -->
                <div class="pet-age-badge">
                  🎂 อายุ: ${ageObj.text}
                </div>
              </div>
            </div>

            <div style="border-top: 1px solid var(--surface-border); padding-top: 0.85rem;" class="text-sm">
              <div class="text-muted" style="margin-bottom: 0.35rem;">
                <strong>วันเกิด:</strong> ${formatDateThai(pet.birthdate)}
              </div>
              ${pet.bio ? `
                <div style="background: #F8FAFC; padding: 0.6rem; border-radius: var(--radius-sm); font-size: 0.85rem; color: var(--text-main);">
                  "${pet.bio}"
                </div>
              ` : ''}
            </div>

            <div class="flex items-center justify-between" style="margin-top: 0.5rem; gap: 0.5rem;">
              ${!isActive ? `
                <button class="btn btn-secondary btn-sm btn-select-pet" data-id="${pet.id}" style="flex: 1;">
                  เลือกตัวนี้ 🐾
                </button>
              ` : `
                <span class="text-xs text-primary font-bold" style="flex: 1;">กำลังแสดงบันทึกของตัวนี้</span>
              `}
              <button class="btn btn-secondary btn-sm btn-edit-pet" data-id="${pet.id}" title="แก้ไข">
                ✏️ แก้ไข
              </button>
              <button class="btn btn-danger btn-sm btn-delete-pet" data-id="${pet.id}" title="ลบ">
                🗑️
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

export function bindPetManagementEvents(onRefresh) {
  // Select active pet
  document.querySelectorAll('.btn-select-pet').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const petId = e.currentTarget.dataset.id;
      store.setActivePetId(petId);
      onRefresh();
    });
  });

  // Delete pet
  document.querySelectorAll('.btn-delete-pet').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const petId = e.currentTarget.dataset.id;
      const pet = store.pets.find(p => p.id === petId);
      if (pet && confirm(`คุณต้องการลบสุนัข "${pet.name}" พร้อมบันทึกทั้งหมดหรือไม่?`)) {
        store.deletePet(petId);
        onRefresh();
      }
    });
  });
}
