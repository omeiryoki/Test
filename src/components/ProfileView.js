import { store } from '../state.js';

export function renderProfileView() {
  const user = store.currentUser;
  const petsCount = store.pets.length;
  const logsCount = store.logs.length;

  return `
    <div class="glass-card" style="max-width: 550px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="font-size: 4rem; margin-bottom: 0.5rem;">👤</div>
        <h2>${user ? user.name : 'ผู้ใช้งาน'}</h2>
        <p class="text-muted text-sm">@${user ? user.username : 'user'}</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 gap-2" style="margin-bottom: 1.5rem;">
        <div style="background: var(--primary-light); padding: 1rem; border-radius: var(--radius-md); text-align: center;">
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--primary);">${petsCount}</div>
          <div class="text-sm text-muted">จำนวนสุนัขในดูแล</div>
        </div>
        <div style="background: #EEF2FF; padding: 1rem; border-radius: var(--radius-md); text-align: center;">
          <div style="font-size: 1.8rem; font-weight: 700; color: var(--secondary);">${logsCount}</div>
          <div class="text-sm text-muted">รายการบันทึกทั้งหมด</div>
        </div>
      </div>

      <!-- PIN 4-Digit Security Settings -->
      <div style="background: #FFFFFF; padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--surface-border); margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">🔒 ตั้งค่าความปลอดภัย PIN 4 หลัก</h3>
        <p class="text-muted text-sm" style="margin-bottom: 1rem;">
          ${user && user.pin ? `คุณได้ตั้งค่ารหัส PIN แล้ว (<strong>${user.pin}</strong>)` : 'ยังไม่ได้ตั้งค่ารหัส PIN ด่วน'}
        </p>

        <form id="form-set-pin" class="flex gap-2">
          <input type="password" id="input-new-pin" class="form-control" maxlength="4" pattern="[0-9]*" placeholder="กรอก PIN 4 หลักใหม่" style="flex: 1;" required />
          <button type="submit" class="btn btn-primary btn-sm">
            บันทึก PIN ✨
          </button>
        </form>
        <div id="pin-set-alert" class="hidden text-xs" style="margin-top: 0.5rem; color: #10B981;"></div>
      </div>

      <!-- Lock & Logout buttons -->
      <div class="flex flex-col gap-2">
        <button class="btn btn-secondary" id="btn-profile-lock" style="width: 100%;">
          🔒 ล็อกหน้าจอด้วย PIN ด่วน
        </button>
        <button class="btn btn-danger" id="btn-profile-logout" style="width: 100%;">
          🚪 ออกจากระบบ (Logout)
        </button>
      </div>
    </div>
  `;
}

export function bindProfileEvents(onRefresh) {
  const formPin = document.getElementById('form-set-pin');
  if (formPin) {
    formPin.addEventListener('submit', (e) => {
      e.preventDefault();
      const newPin = document.getElementById('input-new-pin').value;
      if (newPin.length === 4) {
        store.setPin(newPin);
        const alert = document.getElementById('pin-set-alert');
        alert.textContent = '✅ บันทึกรหัส PIN 4 หลักเรียบร้อยแล้ว';
        alert.classList.remove('hidden');
        setTimeout(() => {
          onRefresh();
        }, 1200);
      } else {
        alert('กรุณากรอกตัวเลข 4 หลัก');
      }
    });
  }

  const btnLock = document.getElementById('btn-profile-lock');
  if (btnLock) {
    btnLock.addEventListener('click', () => {
      store.lockApp();
    });
  }

  const btnLogout = document.getElementById('btn-profile-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
        store.logout();
      }
    });
  }
}
