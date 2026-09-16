import { store } from '../state.js';

let authMode = 'login'; // 'login' | 'register'
let enteredPin = '';

export function renderAuthView() {
  if (store.isPinLocked) {
    return renderPinUnlockScreen();
  }

  if (authMode === 'register') {
    return renderRegisterScreen();
  }

  return renderLoginScreen();
}

function renderLoginScreen() {
  return `
    <div class="flex items-center justify-between" style="min-height: 80vh;">
      <div class="glass-card" style="max-width: 420px; width: 100%; margin: 2rem auto; text-align: center;">
        <div style="font-size: 3.5rem; margin-bottom: 0.5rem;">🐶</div>
        <h1 style="font-size: 1.8rem; margin-bottom: 0.3rem;">Dog Diary</h1>
        <p class="text-muted text-sm" style="margin-bottom: 1.5rem;">สมุดบันทึกความทรงจำและสุขภาพน้องหมา 🐾</p>

        <div id="auth-alert" class="hidden" style="padding: 0.75rem; background: #FEE2E2; color: #DC2626; border-radius: var(--radius-md); font-size: 0.85rem; margin-bottom: 1rem;"></div>

        <form id="login-form">
          <div class="form-group" style="text-align: left;">
            <label class="form-label">ชื่อผู้ใช้ (Username)</label>
            <input type="text" id="login-username" class="form-control" placeholder="เช่น demo" value="demo" required />
          </div>

          <div class="form-group" style="text-align: left;">
            <label class="form-label">รหัสผ่าน (Password)</label>
            <input type="password" id="login-password" class="form-control" placeholder="รหัสผ่าน" value="123" required />
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem; margin-top: 0.5rem;">
            เข้าสู่ระบบ 🚀
          </button>
        </form>

        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--surface-border);" class="text-sm">
          ยังไม่มีบัญชีใช้งาน? 
          <a href="#" id="link-goto-register" class="text-primary font-bold">ลงทะเบียนสมัครสมาชิก</a>
        </div>

        <div style="margin-top: 1rem; background: var(--primary-light); padding: 0.75rem; border-radius: var(--radius-md);" class="text-xs text-muted">
          💡 <strong>Demo Quick Login:</strong> Username: <code>demo</code> | Password: <code>123</code> | PIN: <code>1234</code>
        </div>
      </div>
    </div>
  `;
}

function renderRegisterScreen() {
  return `
    <div class="flex items-center justify-between" style="min-height: 80vh;">
      <div class="glass-card" style="max-width: 450px; width: 100%; margin: 2rem auto; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🐾</div>
        <h2 style="font-size: 1.6rem; margin-bottom: 0.3rem;">ลงทะเบียนผู้ใช้ใหม่</h2>
        <p class="text-muted text-sm" style="margin-bottom: 1.5rem;">สร้างบัญชีเพื่อบันทึกเรื่องราวสุนัขของคุณ</p>

        <div id="auth-alert" class="hidden" style="padding: 0.75rem; background: #FEE2E2; color: #DC2626; border-radius: var(--radius-md); font-size: 0.85rem; margin-bottom: 1rem;"></div>

        <form id="register-form">
          <div class="form-group" style="text-align: left;">
            <label class="form-label">ชื่อเจ้าของ (Name)</label>
            <input type="text" id="reg-name" class="form-control" placeholder="เช่น คุณมิ่งขวัญ" required />
          </div>

          <div class="form-group" style="text-align: left;">
            <label class="form-label">ชื่อผู้ใช้ (Username)</label>
            <input type="text" id="reg-username" class="form-control" placeholder="สำหรับใช้ Login" required />
          </div>

          <div class="form-group" style="text-align: left;">
            <label class="form-label">รหัสผ่าน (Password)</label>
            <input type="password" id="reg-password" class="form-control" placeholder="กำหนดรหัสผ่าน" required />
          </div>

          <div class="form-group" style="text-align: left;">
            <label class="form-label">PIN 4 หลัก (สำหรับปลดล็อกด่วน - ถ้ามี)</label>
            <input type="password" id="reg-pin" class="form-control" maxlength="4" placeholder="เช่น 1234" pattern="[0-9]*" />
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.85rem; margin-top: 0.5rem;">
            ยืนยันการสมัครสมาชิก ✨
          </button>
        </form>

        <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--surface-border);" class="text-sm">
          มีบัญชีอยู่แล้ว? 
          <a href="#" id="link-goto-login" class="text-primary font-bold">กลับสู่หน้าเข้าสู่ระบบ</a>
        </div>
      </div>
    </div>
  `;
}

function renderPinUnlockScreen() {
  const user = store.currentUser;
  return `
    <div class="flex items-center justify-between" style="min-height: 80vh;">
      <div class="glass-card" style="max-width: 360px; width: 100%; margin: 2rem auto; text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 0.5rem;">🔒</div>
        <h2 style="font-size: 1.4rem; margin-bottom: 0.3rem;">ใส่ PIN 4 หลักเพื่อเข้าใช้งาน</h2>
        <p class="text-muted text-sm">สวัสดีคุณ ${user ? user.name : 'เจ้าของ'}</p>

        <div id="pin-alert" style="color: #DC2626; font-size: 0.85rem; height: 20px; margin-top: 0.5rem;"></div>

        <!-- Animated PIN dots -->
        <div class="pin-dots">
          <div class="pin-dot ${enteredPin.length >= 1 ? 'filled' : ''}"></div>
          <div class="pin-dot ${enteredPin.length >= 2 ? 'filled' : ''}"></div>
          <div class="pin-dot ${enteredPin.length >= 3 ? 'filled' : ''}"></div>
          <div class="pin-dot ${enteredPin.length >= 4 ? 'filled' : ''}"></div>
        </div>

        <!-- Numeric Keypad -->
        <div class="pin-keypad">
          <button class="pin-key" data-key="1">1</button>
          <button class="pin-key" data-key="2">2</button>
          <button class="pin-key" data-key="3">3</button>
          <button class="pin-key" data-key="4">4</button>
          <button class="pin-key" data-key="5">5</button>
          <button class="pin-key" data-key="6">6</button>
          <button class="pin-key" data-key="7">7</button>
          <button class="pin-key" data-key="8">8</button>
          <button class="pin-key" data-key="9">9</button>
          <button class="pin-key" data-key="clear" style="font-size: 0.9rem;">ล้าง</button>
          <button class="pin-key" data-key="0">0</button>
          <button class="pin-key" data-key="del">⌫</button>
        </div>

        <button id="btn-switch-account" class="btn btn-secondary btn-sm" style="margin-top: 1.5rem; width: 100%;">
          สลับบัญชีผู้ใช้ / ออกจากระบบ
        </button>
      </div>
    </div>
  `;
}

export function bindAuthEvents(onSuccess) {
  // Toggle screens
  const linkGotoRegister = document.getElementById('link-goto-register');
  if (linkGotoRegister) {
    linkGotoRegister.addEventListener('click', (e) => {
      e.preventDefault();
      authMode = 'register';
      onSuccess();
    });
  }

  const linkGotoLogin = document.getElementById('link-goto-login');
  if (linkGotoLogin) {
    linkGotoLogin.addEventListener('click', (e) => {
      e.preventDefault();
      authMode = 'login';
      onSuccess();
    });
  }

  // Login Form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
      const res = store.login(username, password);

      if (!res.success) {
        const alert = document.getElementById('auth-alert');
        alert.textContent = res.message;
        alert.classList.remove('hidden');
      } else {
        onSuccess();
      }
    });
  }

  // Register Form
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value;
      const username = document.getElementById('reg-username').value;
      const password = document.getElementById('reg-password').value;
      const pin = document.getElementById('reg-pin').value;

      const res = store.register(name, username, password, pin);
      if (!res.success) {
        const alert = document.getElementById('auth-alert');
        alert.textContent = res.message;
        alert.classList.remove('hidden');
      } else {
        authMode = 'login';
        onSuccess();
      }
    });
  }

  // PIN Keypad Events
  document.querySelectorAll('.pin-key').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const key = e.currentTarget.dataset.key;
      const alert = document.getElementById('pin-alert');
      if (alert) alert.textContent = '';

      if (key === 'del') {
        enteredPin = enteredPin.slice(0, -1);
      } else if (key === 'clear') {
        enteredPin = '';
      } else if (enteredPin.length < 4) {
        enteredPin += key;
      }

      // Re-render PIN screen dots
      if (store.isPinLocked) {
        if (enteredPin.length === 4) {
          const verified = store.verifyPin(enteredPin);
          if (!verified) {
            enteredPin = '';
            if (alert) alert.textContent = '❌ รหัส PIN ไม่ถูกต้อง ลองอีกครั้ง';
          } else {
            enteredPin = '';
            onSuccess();
            return;
          }
        }
        onSuccess();
      }
    });
  });

  const btnSwitchAccount = document.getElementById('btn-switch-account');
  if (btnSwitchAccount) {
    btnSwitchAccount.addEventListener('click', () => {
      enteredPin = '';
      store.logout();
    });
  }
}
