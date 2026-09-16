import { store } from '../state.js';
import { formatDateISO, formatDateThai } from '../utils/age.js';
import { formatImageUrl, isGDriveUrl } from '../utils/gdrive.js';

export function renderModalsHTML() {
  const activePet = store.getActivePet();
  const pets = store.pets;

  return `
    <!-- Modal 1: Add/Edit Pet -->
    <div class="modal-backdrop" id="modal-pet">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modal-pet-title">🐾 เพิ่มข้อมูลสุนัข</h3>
          <button class="modal-close" id="close-modal-pet">✕</button>
        </div>
        <form id="form-pet">
          <input type="hidden" id="pet-id" value="" />

          <div class="form-group">
            <label class="form-label">ชื่อสุนัข *</label>
            <input type="text" id="pet-name" class="form-control" placeholder="เช่น น้องโคล่า" required />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label">วันเกิด *</label>
              <input type="date" id="pet-birthdate" class="form-control" required />
            </div>

            <div class="form-group">
              <label class="form-label">เพศ *</label>
              <select id="pet-gender" class="form-select" required>
                <option value="ผู้">ผู้</option>
                <option value="ผู้ (ทำหมันแล้ว)">ผู้ (ทำหมันแล้ว)</option>
                <option value="เมีย">เมีย</option>
                <option value="เมีย (ทำหมันแล้ว)">เมีย (ทำหมันแล้ว)</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">สายพันธุ์</label>
            <input type="text" id="pet-breed" class="form-control" placeholder="เช่น โกลเด้น รีทรีฟเวอร์, คอร์กี้, ปอมเมอเรเนียน" />
          </div>

          <div class="form-group">
            <label class="form-label">URL รูปโปรไฟล์สุนัข (หรือ Google Drive Link)</label>
            <input type="url" id="pet-avatar" class="form-control" placeholder="https://..." />
          </div>

          <div class="form-group">
            <label class="form-label">คำอธิบายเพิ่มเติม / Bio</label>
            <textarea id="pet-bio" class="form-control" placeholder="นิสัย อุปนิสัย หรือสิ่งที่ชอบ..."></textarea>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">
            บันทึกข้อมูลสุนัข 🐶
          </button>
        </form>
      </div>
    </div>

    <!-- Modal 2: Add Daily Activity Log -->
    <div class="modal-backdrop" id="modal-log">
      <div class="modal-content" style="max-width: 550px;">
        <div class="modal-header">
          <h3>✍️ เพิ่มบันทึกกิจกรรมรายวัน</h3>
          <button class="modal-close" id="close-modal-log">✕</button>
        </div>
        <form id="form-log">
          <!-- Pet Selector in Log -->
          <div class="form-group">
            <label class="form-label">เลือกสุนัข *</label>
            <select id="log-pet-id" class="form-select" required>
              ${pets.map(p => `
                <option value="${p.id}" ${activePet && activePet.id === p.id ? 'selected' : ''}>${p.name}</option>
              `).join('')}
            </select>
          </div>

          <!-- Category Tabs Select -->
          <div class="form-group">
            <label class="form-label">หมวดหมู่กิจกรรม *</label>
            <select id="log-category" class="form-select" required>
              <option value="feeding">🍖 บันทึกการกินอาหาร (Feeding)</option>
              <option value="walk">🐕 บันทึกการเดินเล่น (Walk)</option>
              <option value="event">🎪 บันทึกกิจกรรมนอกสถานที่ / Event</option>
              <option value="outfit">👗 บันทึกการแต่งตัว / ชุดรายวัน</option>
              <option value="med">💊 บันทึกการทานยาเห็บหมัด (Flea & Tick Med)</option>
              <option value="vaccine">💉 บันทึกการฉีดวัคซีน (Vaccine)</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="form-group">
              <label class="form-label">วันที่ *</label>
              <input type="date" id="log-date" class="form-control" value="${formatDateISO()}" required />
            </div>
            <div class="form-group">
              <label class="form-label">เวลา</label>
              <input type="time" id="log-time" class="form-control" value="08:00" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">หัวข้อเรื่อง / Title *</label>
            <input type="text" id="log-title" class="form-control" placeholder="เช่น อาหารเช้าโฮลิสติก, เดินเล่นสวนหมู่บ้าน" required />
          </div>

          <!-- Dynamic Category Specific Inputs -->
          <div id="dynamic-log-fields"></div>

          <div class="form-group">
            <label class="form-label">รายละเอียดเพิ่มเติม / Note</label>
            <textarea id="log-details" class="form-control" placeholder="พิมพ์รายละเอียดกิจกรรม..."></textarea>
          </div>

          <!-- Google Drive Attachment Field -->
          <div class="form-group" style="background: #FFF9F2; padding: 0.85rem; border-radius: var(--radius-md); border: 1px dashed var(--primary);">
            <label class="form-label" style="color: var(--primary);">
              🖼️ แนบภาพประกอบด้วยภาพบน Google Drive
            </label>
            <input type="url" id="log-gdrive-url" class="form-control" placeholder="วางลิงก์ Google Drive หรือ URL ภาพ เช่น https://drive.google.com/file/d/.../view" />
            <span class="text-xs text-muted" style="margin-top: 0.25rem;">
              รองรับลิงก์แชร์จาก Google Drive (ตั้งค่าลิงก์เป็น "ทุกคนที่มีลิงก์สิทธิ์ดูได้")
            </span>
            <div id="gdrive-preview-container" class="hidden" style="margin-top: 0.5rem; text-align: center;">
              <img id="gdrive-preview-img" src="" alt="Preview" style="max-height: 120px; border-radius: var(--radius-sm);" />
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">
            บันทึกกิจกรรม 🚀
          </button>
        </form>
      </div>
    </div>

    <!-- Modal 3: Calendar Date Log Details -->
    <div class="modal-backdrop" id="modal-date-details">
      <div class="modal-content" style="max-width: 550px;">
        <div class="modal-header">
          <h3 id="modal-date-title">🗓️ บันทึกประจำวันที่...</h3>
          <button class="modal-close" id="close-modal-date-details">✕</button>
        </div>
        <div id="modal-date-content" class="flex flex-col gap-2" style="max-height: 60vh; overflow-y: auto;"></div>
        <div style="margin-top: 1rem; border-top: 1px solid var(--surface-border); padding-top: 0.75rem;">
          <button class="btn btn-primary" id="btn-add-log-on-date" style="width: 100%;">
            ➕ เพิ่มบันทึกในวันนี้
          </button>
        </div>
      </div>
    </div>

    <!-- Modal 4: Fullscreen Photo Viewer -->
    <div class="modal-backdrop" id="modal-image-view">
      <div class="modal-content" style="max-width: 800px; padding: 1rem; background: #000000; text-align: center;">
        <div style="display: flex; justify-content: flex-end;">
          <button class="modal-close" id="close-modal-image-view" style="background: #333333; color: #FFFFFF;">✕</button>
        </div>
        <img id="fullscreen-image-target" src="" alt="Full view" style="max-width: 100%; max-height: 80vh; object-fit: contain; margin-top: 0.5rem; border-radius: var(--radius-sm);" />
      </div>
    </div>

    <!-- Modal 5: Quick Pet Switcher Modal -->
    <div class="modal-backdrop" id="modal-pet-switcher">
      <div class="modal-content" style="max-width: 400px;">
        <div class="modal-header">
          <h3>🐾 สลับสุนัขที่ต้องการดู</h3>
          <button class="modal-close" id="close-modal-pet-switcher">✕</button>
        </div>
        <div class="flex flex-col gap-2">
          ${pets.map(p => `
            <div class="pet-selector-item ${activePet && activePet.id === p.id ? 'active' : ''}" data-petid="${p.id}" style="display: flex; align-items: center; gap: 0.85rem; padding: 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--surface-border); cursor: pointer; background: ${activePet && activePet.id === p.id ? 'var(--primary-light)' : '#FFFFFF'};">
              <img src="${p.avatarUrl}" style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover;" />
              <div style="flex: 1;">
                <div class="font-bold">${p.name}</div>
                <div class="text-xs text-muted">${p.breed}</div>
              </div>
              ${activePet && activePet.id === p.id ? '<span>✅</span>' : ''}
            </div>
          `).join('')}
          <button class="btn btn-secondary" id="btn-modal-add-pet" style="margin-top: 0.5rem;">
            ➕ เพิ่มสุนัขตัวใหม่
          </button>
        </div>
      </div>
    </div>
  `;
}

export function updateDynamicLogFields(category) {
  const container = document.getElementById('dynamic-log-fields');
  if (!container) return;

  if (category === 'feeding') {
    container.innerHTML = `
      <div class="grid grid-cols-2 gap-2">
        <div class="form-group">
          <label class="form-label">ยี่ห้อ/ชนิดอาหาร</label>
          <input type="text" id="log-food-brand" class="form-control" placeholder="เช่น Royal Canin" />
        </div>
        <div class="form-group">
          <label class="form-label">ปริมาณอาหาร</label>
          <input type="text" id="log-food-amount" class="form-control" placeholder="เช่น 200 กรัม / 1 ถ้วย" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">ระดับความอยากอาหาร (1-5 ดาว)</label>
        <select id="log-hunger-rating" class="form-select">
          <option value="5">⭐⭐⭐⭐⭐ ทานหมดเกลี้ยง อร่อยมาก</option>
          <option value="4">⭐⭐⭐⭐ ทานได้ดี</option>
          <option value="3">⭐⭐⭐ ทานปานกลาง</option>
          <option value="2">⭐⭐ ทานน้อย</option>
          <option value="1">⭐ ไม่ค่อยทาน / เบื่ออาหาร</option>
        </select>
      </div>
    `;
  } else if (category === 'walk') {
    container.innerHTML = `
      <div class="form-group">
        <label class="form-label">สถานที่เดินเล่น</label>
        <input type="text" id="log-location-name" class="form-control" placeholder="เช่น สวนสาธารณะ, รอบหมู่บ้าน" />
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div class="form-group">
          <label class="form-label">ระยะเวลาเดิน</label>
          <input type="text" id="log-walk-duration" class="form-control" placeholder="เช่น 30 นาที" />
        </div>
        <div class="form-group">
          <label class="form-label">ระยะทาง</label>
          <input type="text" id="log-walk-distance" class="form-control" placeholder="เช่น 1.5 กม." />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">บันทึกการขับถ่าย</label>
        <input type="text" id="log-bathroom-status" class="form-control" placeholder="เช่น อึ 1 ครั้ง (ปกติ) / ฉี่ 2 ครั้ง" />
      </div>
    `;
  } else if (category === 'event') {
    container.innerHTML = `
      <div class="form-group">
        <label class="form-label">ประเภทกิจกรรม/งาน</label>
        <input type="text" id="log-event-type" class="form-control" placeholder="เช่น คาเฟ่สัตว์เลี้ยง, Dog Park, งาน Pet Expo" />
      </div>
      <div class="form-group">
        <label class="form-label">สถานที่จัดงาน / ชื่อสถานที่</label>
        <input type="text" id="log-location-name" class="form-control" placeholder="เช่น Central Eastville" />
      </div>
    `;
  } else if (category === 'outfit') {
    container.innerHTML = `
      <div class="form-group">
        <label class="form-label">ธีมชุด / ชื่อชุดแต่งตัว</label>
        <input type="text" id="log-outfit-theme" class="form-control" placeholder="เช่น ชุดเอี๊ยมไดโนเสาร์, เสื้อเชิ้ตลายดอก" />
      </div>
    `;
  } else if (category === 'med') {
    container.innerHTML = `
      <div class="form-group">
        <label class="form-label">ยี่ห้อยาเห็บหมัด</label>
        <input type="text" id="log-med-brand" class="form-control" placeholder="เช่น NexGard Spectra, Simparica Trio, Bravecto" />
      </div>
      <div class="form-group">
        <label class="form-label">กำหนดทานเข็ม/รอบถัดไป (แจ้งเตือน)</label>
        <input type="date" id="log-next-due-date" class="form-control" />
      </div>
    `;
  } else if (category === 'vaccine') {
    container.innerHTML = `
      <div class="form-group">
        <label class="form-label">ชื่อวัคซีนที่ฉีด</label>
        <input type="text" id="log-vaccine-name" class="form-control" placeholder="เช่น วัคซีนรวม 6 โรค, วัคซีนพิษสุนัขบ้า" />
      </div>
      <div class="form-group">
        <label class="form-label">ชื่อสถานพยาบาล / คลินิก / รพ.สัตว์</label>
        <input type="text" id="log-clinic-name" class="form-control" placeholder="เช่น รพ.สัตว์ทองหล่อ" />
      </div>
      <div class="form-group">
        <label class="form-label">กำหนดนัดกระตุ้นวัคซีนรอบถัดไป</label>
        <input type="date" id="log-next-due-date" class="form-control" />
      </div>
    `;
  }
}

export function bindModalEvents(onRefresh) {
  // Category dropdown change in log form
  const logCatSelect = document.getElementById('log-category');
  if (logCatSelect) {
    logCatSelect.addEventListener('change', (e) => {
      updateDynamicLogFields(e.target.value);
    });
    updateDynamicLogFields(logCatSelect.value);
  }

  // Google Drive preview on input change
  const gdriveInput = document.getElementById('log-gdrive-url');
  if (gdriveInput) {
    gdriveInput.addEventListener('input', (e) => {
      const url = e.target.value;
      const formatted = formatImageUrl(url);
      const container = document.getElementById('gdrive-preview-container');
      const img = document.getElementById('gdrive-preview-img');
      if (formatted) {
        img.src = formatted;
        container.classList.remove('hidden');
      } else {
        container.classList.add('hidden');
      }
    });
  }

  // Pet form submission
  const formPet = document.getElementById('form-pet');
  if (formPet) {
    formPet.addEventListener('submit', (e) => {
      e.preventDefault();
      const petId = document.getElementById('pet-id').value;
      const name = document.getElementById('pet-name').value;
      const birthdate = document.getElementById('pet-birthdate').value;
      const gender = document.getElementById('pet-gender').value;
      const breed = document.getElementById('pet-breed').value;
      const avatarUrl = document.getElementById('pet-avatar').value;
      const bio = document.getElementById('pet-bio').value;

      if (petId) {
        store.updatePet(petId, { name, birthdate, gender, breed, avatarUrl, bio });
      } else {
        store.addPet({ name, birthdate, gender, breed, avatarUrl, bio });
      }

      closeModal('modal-pet');
      onRefresh();
    });
  }

  // Log form submission
  const formLog = document.getElementById('form-log');
  if (formLog) {
    formLog.addEventListener('submit', (e) => {
      e.preventDefault();
      const petId = document.getElementById('log-pet-id').value;
      const category = document.getElementById('log-category').value;
      const date = document.getElementById('log-date').value;
      const time = document.getElementById('log-time').value;
      const title = document.getElementById('log-title').value;
      const details = document.getElementById('log-details').value;
      const gdriveUrl = document.getElementById('log-gdrive-url').value;

      const extraData = {};
      if (category === 'feeding') {
        extraData.foodBrand = document.getElementById('log-food-brand')?.value || '';
        extraData.foodAmount = document.getElementById('log-food-amount')?.value || '';
        extraData.hungerRating = parseInt(document.getElementById('log-hunger-rating')?.value || '5');
      } else if (category === 'walk') {
        extraData.locationName = document.getElementById('log-location-name')?.value || '';
        extraData.walkDuration = document.getElementById('log-walk-duration')?.value || '';
        extraData.walkDistance = document.getElementById('log-walk-distance')?.value || '';
        extraData.bathroomStatus = document.getElementById('log-bathroom-status')?.value || '';
      } else if (category === 'event') {
        extraData.eventType = document.getElementById('log-event-type')?.value || '';
        extraData.locationName = document.getElementById('log-location-name')?.value || '';
      } else if (category === 'outfit') {
        extraData.outfitTheme = document.getElementById('log-outfit-theme')?.value || '';
      } else if (category === 'med') {
        extraData.medBrand = document.getElementById('log-med-brand')?.value || '';
        extraData.nextDueDate = document.getElementById('log-next-due-date')?.value || '';
      } else if (category === 'vaccine') {
        extraData.vaccineName = document.getElementById('log-vaccine-name')?.value || '';
        extraData.clinicName = document.getElementById('log-clinic-name')?.value || '';
        extraData.nextDueDate = document.getElementById('log-next-due-date')?.value || '';
      }

      store.addLog({
        petId,
        category,
        date,
        time,
        title,
        details,
        gdriveUrl,
        ...extraData
      });

      closeModal('modal-log');
      onRefresh();
    });
  }

  // Close buttons
  ['modal-pet', 'modal-log', 'modal-date-details', 'modal-image-view', 'modal-pet-switcher'].forEach(id => {
    const closeBtn = document.getElementById(`close-${id}`);
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(id));
    }
  });

  // Switch pet item click inside modal
  document.querySelectorAll('.pet-selector-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.petid;
      store.setActivePetId(id);
      closeModal('modal-pet-switcher');
      onRefresh();
    });
  });

  const btnModalAddPet = document.getElementById('btn-modal-add-pet');
  if (btnModalAddPet) {
    btnModalAddPet.addEventListener('click', () => {
      closeModal('modal-pet-switcher');
      openAddPetModal();
    });
  }
}

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

export function openAddPetModal(editPet = null) {
  document.getElementById('pet-id').value = editPet ? editPet.id : '';
  document.getElementById('pet-name').value = editPet ? editPet.name : '';
  document.getElementById('pet-birthdate').value = editPet ? editPet.birthdate : '';
  document.getElementById('pet-gender').value = editPet ? editPet.gender : 'ผู้';
  document.getElementById('pet-breed').value = editPet ? editPet.breed : '';
  document.getElementById('pet-avatar').value = editPet ? editPet.avatarUrl : '';
  document.getElementById('pet-bio').value = editPet ? editPet.bio : '';

  document.getElementById('modal-pet-title').textContent = editPet ? '✏️ แก้ไขข้อมูลสุนัข' : '🐾 เพิ่มข้อมูลสุนัข';
  openModal('modal-pet');
}

export function openAddLogModal(presetDate = null) {
  if (presetDate) {
    document.getElementById('log-date').value = presetDate;
  }
  openModal('modal-log');
}

export function openDateDetailsModal(dateStr, onRefresh) {
  const activePet = store.getActivePet();
  const logs = store.getLogsForPet(activePet ? activePet.id : 'all', 'all').filter(l => l.date === dateStr);

  document.getElementById('modal-date-title').textContent = `🗓️ บันทึกประจำวันที่ ${formatDateThai(dateStr)}`;

  const content = document.getElementById('modal-date-content');
  if (logs.length === 0) {
    content.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        ยังไม่มีรายการบันทึกในวันที่นี้
      </div>
    `;
  } else {
    content.innerHTML = logs.map(l => `
      <div style="background: #F8FAFC; padding: 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--surface-border);">
        <div class="flex items-center justify-between">
          <span class="font-bold">${l.title}</span>
          <span class="text-xs text-muted">${l.time || ''}</span>
        </div>
        <div class="text-sm text-muted" style="margin-top: 0.25rem;">${l.details || ''}</div>
      </div>
    `).join('');
  }

  const btnAdd = document.getElementById('btn-add-log-on-date');
  btnAdd.onclick = () => {
    closeModal('modal-date-details');
    openAddLogModal(dateStr);
  };

  openModal('modal-date-details');
}

export function openImageViewer(imgUrl) {
  const target = document.getElementById('fullscreen-image-target');
  if (target) {
    target.src = imgUrl;
    openModal('modal-image-view');
  }
}
