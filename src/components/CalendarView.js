import { store } from '../state.js';
import { formatDateThai } from '../utils/age.js';

let currentDate = new Date();
let selectedCatFilter = 'all';

export function renderCalendarView() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNamesTH = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const activePet = store.getActivePet();
  const allLogs = store.getLogsForPet(activePet ? activePet.id : 'all', selectedCatFilter);

  // Group logs by YYYY-MM-DD
  const logsByDate = {};
  allLogs.forEach(log => {
    if (!logsByDate[log.date]) {
      logsByDate[log.date] = [];
    }
    logsByDate[log.date].push(log);
  });

  // Calculate calendar days matrix
  const firstDayIndex = new Date(year, month, 1).getDay();
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate();
  const lastDateOfPrevMonth = new Date(year, month, 0).getDate();

  const todayStr = new Date().toISOString().split('T')[0];

  const daysArr = [];

  // Previous month padding days
  for (let i = firstDayIndex; i > 0; i--) {
    const dayNum = lastDateOfPrevMonth - i + 1;
    daysArr.push({
      day: dayNum,
      isCurrentMonth: false,
      dateStr: ''
    });
  }

  // Current month days
  for (let d = 1; d <= lastDateOfMonth; d++) {
    const monthFormatted = String(month + 1).padStart(2, '0');
    const dayFormatted = String(d).padStart(2, '0');
    const dateStr = `${year}-${monthFormatted}-${dayFormatted}`;
    daysArr.push({
      day: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      dateStr: dateStr,
      logs: logsByDate[dateStr] || []
    });
  }

  // Next month padding days to complete 35 or 42 grid cells
  const remainingCells = (7 - (daysArr.length % 7)) % 7;
  for (let n = 1; n <= remainingCells; n++) {
    daysArr.push({
      day: n,
      isCurrentMonth: false,
      dateStr: ''
    });
  }

  const categoryDots = {
    feeding: '#FF6B4A',
    walk: '#10B981',
    event: '#8B5CF6',
    outfit: '#EC4899',
    med: '#F59E0B',
    vaccine: '#06B6D4'
  };

  return `
    <div class="glass-card" style="margin-bottom: 1.5rem;">
      <div class="flex items-center justify-between" style="flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2>📅 ปฏิทินกิจกรรม</h2>
          <p class="text-muted text-sm">
            ${activePet ? `แสดงปฏิทินของ <strong>${activePet.name}</strong>` : 'แสดงปฏิทินสัตว์เลี้ยงทั้งหมด'}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn btn-secondary btn-sm" id="cal-prev-month">◄ เดือนก่อนหน้า</button>
          <button class="btn btn-primary btn-sm" id="cal-today">วันนี้</button>
          <button class="btn btn-secondary btn-sm" id="cal-next-month">เดือนถัดไป ►</button>
        </div>
      </div>
    </div>

    <div class="calendar-container">
      <div class="calendar-header">
        <h3 style="font-size: 1.3rem;">
          ${monthNamesTH[month]} ${year + 543}
        </h3>
        <div class="flex gap-2 text-xs">
          <span style="display: inline-flex; align-items: center; gap: 3px;"><span style="width: 8px; height: 8px; background: #FF6B4A; border-radius: 50%;"></span> อาหาร</span>
          <span style="display: inline-flex; align-items: center; gap: 3px;"><span style="width: 8px; height: 8px; background: #10B981; border-radius: 50%;"></span> เดินเล่น</span>
          <span style="display: inline-flex; align-items: center; gap: 3px;"><span style="width: 8px; height: 8px; background: #8B5CF6; border-radius: 50%;"></span> Event</span>
          <span style="display: inline-flex; align-items: center; gap: 3px;"><span style="width: 8px; height: 8px; background: #EC4899; border-radius: 50%;"></span> แต่งตัว</span>
          <span style="display: inline-flex; align-items: center; gap: 3px;"><span style="width: 8px; height: 8px; background: #F59E0B; border-radius: 50%;"></span> ยา</span>
          <span style="display: inline-flex; align-items: center; gap: 3px;"><span style="width: 8px; height: 8px; background: #06B6D4; border-radius: 50%;"></span> วัคซีน</span>
        </div>
      </div>

      <div class="calendar-grid">
        <!-- Day Headers -->
        <div class="calendar-day-header" style="color: #EF4444;">อา.</div>
        <div class="calendar-day-header">จ.</div>
        <div class="calendar-day-header">อ.</div>
        <div class="calendar-day-header">พ.</div>
        <div class="calendar-day-header">พฤ.</div>
        <div class="calendar-day-header">ศ.</div>
        <div class="calendar-day-header" style="color: #2563EB;">ส.</div>

        <!-- Cells -->
        ${daysArr.map(item => {
          if (!item.isCurrentMonth) {
            return `<div class="calendar-day-cell" style="opacity: 0.35;"><span class="calendar-day-number">${item.day}</span></div>`;
          }

          const hasLogs = item.logs && item.logs.length > 0;

          return `
            <div class="calendar-day-cell ${item.isCurrentMonth ? 'current-month' : ''} ${item.isToday ? 'today' : ''} btn-calendar-day" data-date="${item.dateStr}">
              <span class="calendar-day-number">${item.day}</span>
              ${hasLogs ? `
                <div class="calendar-events-dots">
                  ${item.logs.slice(0, 4).map(l => `
                    <span class="event-dot" style="background: ${categoryDots[l.category] || '#FF6B4A'};" title="${l.title}"></span>
                  `).join('')}
                  ${item.logs.length > 4 ? `<span class="text-xs" style="font-size: 0.65rem; color: var(--primary);">+${item.logs.length - 4}</span>` : ''}
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

export function bindCalendarEvents(onOpenDateDetailsModal) {
  // Previous month
  const prevBtn = document.getElementById('cal-prev-month');
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      const container = document.getElementById('view-calendar');
      if (container) container.innerHTML = renderCalendarView();
      bindCalendarEvents(onOpenDateDetailsModal);
    });
  }

  // Next month
  const nextBtn = document.getElementById('cal-next-month');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      const container = document.getElementById('view-calendar');
      if (container) container.innerHTML = renderCalendarView();
      bindCalendarEvents(onOpenDateDetailsModal);
    });
  }

  // Today button
  const todayBtn = document.getElementById('cal-today');
  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      currentDate = new Date();
      const container = document.getElementById('view-calendar');
      if (container) container.innerHTML = renderCalendarView();
      bindCalendarEvents(onOpenDateDetailsModal);
    });
  }

  // Click on date cell
  document.querySelectorAll('.btn-calendar-day').forEach(cell => {
    cell.addEventListener('click', (e) => {
      const dateStr = e.currentTarget.dataset.date;
      if (dateStr) {
        onOpenDateDetailsModal(dateStr);
      }
    });
  });
}
