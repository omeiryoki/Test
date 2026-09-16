import { store } from '../state.js';
import { formatDateThai } from '../utils/age.js';
import { formatImageUrl, isGDriveUrl } from '../utils/gdrive.js';

let currentCategoryFilter = 'all';

export function renderDailyLogView() {
  const activePet = store.getActivePet();
  const logs = store.getLogsForPet(activePet ? activePet.id : 'all', currentCategoryFilter);

  const categories = [
    { id: 'all', label: 'ทั้งหมด', icon: '🌟' },
    { id: 'feeding', label: 'อาหาร', icon: '🍖' },
    { id: 'walk', label: 'เดินเล่น', icon: '🐕' },
    { id: 'event', label: 'ออก Event', icon: '🎪' },
    { id: 'outfit', label: 'การแต่งตัว', icon: '👗' },
    { id: 'med', label: 'ยาเห็บหมัด', icon: '💊' },
    { id: 'vaccine', label: 'วัคซีน', icon: '💉' }
  ];

  return `
    <!-- Top Action & Pet Banner -->
    <div class="glass-card" style="margin-bottom: 1.5rem;">
      <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2>📖 บันทึกรายวันสุนัข</h2>
          <p class="text-muted text-sm">
            ${activePet ? `กำลังแสดงบันทึกของ <strong>${activePet.name}</strong> (${activePet.breed})` : 'เลือกสุนัขเพื่อดูบันทึก'}
          </p>
        </div>
        <button class="btn btn-primary" id="btn-open-add-log">
          ✍️ บันทึกกิจกรรมใหม่
        </button>
      </div>

      <!-- Category Filter Pills -->
      <div class="filter-pills" style="margin-top: 1.25rem;">
        ${categories.map(cat => `
          <button class="filter-pill ${currentCategoryFilter === cat.id ? 'active' : ''}" data-cat="${cat.id}">
            ${cat.icon} ${cat.label}
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Log Entries List -->
    <div class="flex flex-col gap-4">
      ${logs.length === 0 ? `
        <div class="glass-card" style="text-align: center; padding: 3rem;">
          <div style="font-size: 3rem; margin-bottom: 0.5rem;">📝</div>
          <h3>ยังไม่มีข้อมูลบันทึกในหมวดนี้</h3>
          <p class="text-muted text-sm" style="margin-bottom: 1rem;">กดปุ่ม "บันทึกกิจกรรมใหม่" เพื่อเริ่มบันทึกกิจกรรมแรก</p>
        </div>
      ` : logs.map(log => renderLogCard(log)).join('')}
    </div>
  `;
}

function renderLogCard(log) {
  const imgDisplayUrl = formatImageUrl(log.gdriveUrl);
  const isDrive = isGDriveUrl(log.gdriveUrl);

  const categoryBadges = {
    feeding: { label: 'การกินอาหาร 🍖', class: 'badge-feeding' },
    walk: { label: 'การเดินเล่น 🐕', class: 'badge-walk' },
    event: { label: 'กิจกรรมนอกสถานที่ 🎪', class: 'badge-event' },
    outfit: { label: 'ชุดแต่งตัวประจำวัน 👗', class: 'badge-outfit' },
    med: { label: 'ยาเห็บหมัด 💊', class: 'badge-med' },
    vaccine: { label: 'การฉีดวัคซีน 💉', class: 'badge-vaccine' }
  };

  const catMeta = categoryBadges[log.category] || { label: 'บันทึก general', class: 'badge-feeding' };

  return `
    <div class="log-card" id="log-card-${log.id}">
      <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 0.5rem;">
        <div class="flex items-center gap-2">
          <span class="badge ${catMeta.class}">${catMeta.label}</span>
          <span class="text-xs text-muted">🗓️ ${formatDateThai(log.date)} ${log.time ? `• ${log.time} น.` : ''}</span>
        </div>
        <button class="btn btn-secondary btn-sm btn-delete-log" data-id="${log.id}" title="ลบบันทึก" style="color: #DC2626;">
          🗑️ ลบ
        </button>
      </div>

      <h3 style="font-size: 1.15rem; margin-top: 0.25rem;">${log.title || 'ไม่มีชื่อบันทึก'}</h3>

      <!-- Specific Fields per Category -->
      ${renderCategorySpecificDetails(log)}

      ${log.details ? `
        <p style="font-size: 0.92rem; color: var(--text-main); white-space: pre-line;">${log.details}</p>
      ` : ''}

      <!-- Attached Photo / Google Drive Image -->
      ${imgDisplayUrl ? `
        <div style="margin-top: 0.5rem; position: relative;">
          ${isDrive ? `
            <span class="badge" style="position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); font-size: 0.72rem;">
              📁 Google Drive Photo
            </span>
          ` : ''}
          <img class="log-image-preview" src="${imgDisplayUrl}" alt="Photo Log" data-fullimg="${imgDisplayUrl}" />
        </div>
      ` : ''}
    </div>
  `;
}

function renderCategorySpecificDetails(log) {
  if (log.category === 'feeding') {
    return `
      <div style="background: #FFF7ED; padding: 0.75rem; border-radius: var(--radius-sm); border-left: 3px solid var(--cat-feeding);" class="text-sm">
        ${log.foodBrand ? `<div><strong>ยี่ห้อ/เมนู:</strong> ${log.foodBrand}</div>` : ''}
        ${log.foodAmount ? `<div><strong>ปริมาณ:</strong> ${log.foodAmount}</div>` : ''}
        ${log.hungerRating ? `<div><strong>ระดับความอยากอาหาร:</strong> ${'⭐'.repeat(log.hungerRating)}</div>` : ''}
      </div>
    `;
  }
  if (log.category === 'walk') {
    return `
      <div style="background: #ECFDF5; padding: 0.75rem; border-radius: var(--radius-sm); border-left: 3px solid var(--cat-walk);" class="text-sm">
        ${log.locationName ? `<div><strong>สถานที่:</strong> ${log.locationName}</div>` : ''}
        <div class="flex gap-4" style="margin-top: 0.2rem;">
          ${log.walkDuration ? `<div><strong>เวลาที่ใช้:</strong> ${log.walkDuration}</div>` : ''}
          ${log.walkDistance ? `<div><strong>ระยะทาง:</strong> ${log.walkDistance}</div>` : ''}
        </div>
        ${log.bathroomStatus ? `<div style="margin-top: 0.2rem;"><strong>การขับถ่าย:</strong> ${log.bathroomStatus}</div>` : ''}
      </div>
    `;
  }
  if (log.category === 'event') {
    return `
      <div style="background: #F5F3FF; padding: 0.75rem; border-radius: var(--radius-sm); border-left: 3px solid var(--cat-event);" class="text-sm">
        ${log.eventType ? `<div><strong>ประเภทกิจกรรม:</strong> ${log.eventType}</div>` : ''}
        ${log.locationName ? `<div><strong>สถานที่:</strong> ${log.locationName}</div>` : ''}
      </div>
    `;
  }
  if (log.category === 'outfit') {
    return `
      <div style="background: #FDF2F8; padding: 0.75rem; border-radius: var(--radius-sm); border-left: 3px solid var(--cat-outfit);" class="text-sm">
        ${log.outfitTheme ? `<div><strong>ธีม/ชุด:</strong> ${log.outfitTheme}</div>` : ''}
      </div>
    `;
  }
  if (log.category === 'med') {
    return `
      <div style="background: #FFFBEB; padding: 0.75rem; border-radius: var(--radius-sm); border-left: 3px solid var(--cat-med);" class="text-sm">
        ${log.medBrand ? `<div><strong>ยี่ห้อยา:</strong> ${log.medBrand}</div>` : ''}
        ${log.nextDueDate ? `<div><strong>🗓️ กำหนดทานเข็มถัดไป:</strong> <span class="font-bold text-primary">${formatDateThai(log.nextDueDate)}</span></div>` : ''}
      </div>
    `;
  }
  if (log.category === 'vaccine') {
    return `
      <div style="background: #ECFEFF; padding: 0.75rem; border-radius: var(--radius-sm); border-left: 3px solid var(--cat-vaccine);" class="text-sm">
        ${log.vaccineName ? `<div><strong>ชื่อวัคซีน:</strong> ${log.vaccineName}</div>` : ''}
        ${log.clinicName ? `<div><strong>คลินิก/รพ.:</strong> ${log.clinicName}</div>` : ''}
        ${log.nextDueDate ? `<div><strong>💉 นัดนัดฉีดรอบถัดไป:</strong> <span class="font-bold text-primary">${formatDateThai(log.nextDueDate)}</span></div>` : ''}
      </div>
    `;
  }
  return '';
}

export function bindDailyLogEvents(onRefresh, onOpenImageModal) {
  // Category filter pills click
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      currentCategoryFilter = e.currentTarget.dataset.cat;
      onRefresh();
    });
  });

  // Delete log button
  document.querySelectorAll('.btn-delete-log').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const logId = e.currentTarget.dataset.id;
      if (confirm('คุณต้องการลบบันทึกรายการนี้ใช่หรือไม่?')) {
        store.deleteLog(logId);
        onRefresh();
      }
    });
  });

  // Image preview click -> open full screen viewer
  document.querySelectorAll('.log-image-preview').forEach(img => {
    img.addEventListener('click', (e) => {
      const fullUrl = e.currentTarget.dataset.fullimg;
      onOpenImageModal(fullUrl);
    });
  });
}
