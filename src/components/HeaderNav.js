import { store } from '../state.js';

export function renderHeaderNav(activeTab, onTabChange, onOpenAddPet, onOpenAddLog, onOpenPinModal) {
  const activePet = store.getActivePet();
  const currentUser = store.currentUser;
  const pets = store.pets;

  const headerHtml = `
    <header class="header-bar">
      <div class="logo-group">
        <span class="logo-icon">🐶</span>
        <span>Dog Diary</span>
      </div>

      ${currentUser ? `
        <div class="flex items-center gap-2">
          <!-- Active Pet Switcher Dropdown -->
          <div class="pet-selector" id="btn-switch-pet" title="สลับสุนัข">
            <img class="pet-avatar-thumb" src="${activePet ? activePet.avatarUrl : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80'}" alt="${activePet ? activePet.name : 'Pet'}" />
            <span class="font-bold text-sm" style="max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${activePet ? activePet.name : 'ไม่มีสุนัข'}
            </span>
            <span class="text-xs">▼</span>
          </div>

          <!-- PIN Quick Lock Button -->
          <button class="btn btn-secondary btn-icon" id="btn-lock-app" title="ล็อกด้วย PIN 4 หลัก">
            🔒
          </button>

          <!-- User Menu / Logout -->
          <button class="btn btn-secondary btn-sm" id="btn-user-logout" title="ออกจากระบบ">
            🚪
          </button>
        </div>
      ` : ''}
    </header>

    <!-- Mobile Navigation Bar -->
    <nav class="mobile-nav">
      <button class="nav-item ${activeTab === 'diary' ? 'active' : ''}" data-tab="diary">
        <span class="nav-icon">📖</span>
        <span>บันทึก</span>
      </button>
      <button class="nav-item ${activeTab === 'pets' ? 'active' : ''}" data-tab="pets">
        <span class="nav-icon">🐾</span>
        <span>สุนัข</span>
      </button>
      <button class="nav-item" id="mobile-add-log-btn" style="color: var(--primary);">
        <span class="nav-icon" style="font-size: 1.8rem; line-height: 1;">➕</span>
        <span>บันทึกใหม่</span>
      </button>
      <button class="nav-item ${activeTab === 'calendar' ? 'active' : ''}" data-tab="calendar">
        <span class="nav-icon">📅</span>
        <span>ปฏิทิน</span>
      </button>
      <button class="nav-item ${activeTab === 'profile' ? 'active' : ''}" data-tab="profile">
        <span class="nav-icon">👤</span>
        <span>โปรไฟล์</span>
      </button>
    </nav>
  `;

  return headerHtml;
}

export function bindHeaderNavEvents(onTabChange, onOpenAddPet, onOpenAddLog, onOpenPetSwitcherModal) {
  // Navigation tabs
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.currentTarget.dataset.tab;
      onTabChange(tab);
    });
  });

  // Mobile add log button
  const mobileAddLog = document.getElementById('mobile-add-log-btn');
  if (mobileAddLog) {
    mobileAddLog.addEventListener('click', onOpenAddLog);
  }

  // Switch pet dropdown click
  const btnSwitchPet = document.getElementById('btn-switch-pet');
  if (btnSwitchPet) {
    btnSwitchPet.addEventListener('click', onOpenPetSwitcherModal);
  }

  // Lock App
  const btnLock = document.getElementById('btn-lock-app');
  if (btnLock) {
    btnLock.addEventListener('click', () => {
      store.lockApp();
    });
  }

  // Logout
  const btnLogout = document.getElementById('btn-user-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
        store.logout();
      }
    });
  }
}
