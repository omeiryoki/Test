import { store } from './state.js';
import { renderHeaderNav, bindHeaderNavEvents } from './components/HeaderNav.js';
import { renderAuthView, bindAuthEvents } from './components/AuthView.js';
import { renderPetManagementView, bindPetManagementEvents } from './components/PetManagementView.js';
import { renderDailyLogView, bindDailyLogEvents } from './components/DailyLogView.js';
import { renderCalendarView, bindCalendarEvents } from './components/CalendarView.js';
import { renderProfileView, bindProfileEvents } from './components/ProfileView.js';
import {
  renderModalsHTML,
  bindModalEvents,
  openAddPetModal,
  openAddLogModal,
  openModal,
  openDateDetailsModal,
  openImageViewer
} from './components/Modals.js';

let currentTab = 'diary'; // 'diary' | 'pets' | 'calendar' | 'profile'

function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  // Check Auth & PIN status
  if (!store.currentUser || store.isPinLocked) {
    appContainer.innerHTML = renderAuthView();
    bindAuthEvents(renderApp);
    return;
  }

  // Active Tab View Content
  let viewContentHtml = '';
  if (currentTab === 'diary') {
    viewContentHtml = renderDailyLogView();
  } else if (currentTab === 'pets') {
    viewContentHtml = renderPetManagementView();
  } else if (currentTab === 'calendar') {
    viewContentHtml = `<div id="view-calendar">${renderCalendarView()}</div>`;
  } else if (currentTab === 'profile') {
    viewContentHtml = renderProfileView();
  }

  // Full Page HTML Assembly
  appContainer.innerHTML = `
    ${renderHeaderNav(currentTab, handleTabChange, openAddPetModal, openAddLogModal, () => openModal('modal-pet-switcher'))}

    <!-- Desktop Sidebar + Main Container -->
    <div style="display: flex; flex: 1;">
      <!-- Desktop Sidebar Nav -->
      <aside style="width: 240px; padding: 2rem 1rem; border-right: 1px solid var(--surface-border); display: none;" class="desktop-sidebar">
        <div style="display: flex; flex-direction: column; gap: 0.5rem; position: sticky; top: 90px;">
          <button class="desktop-nav-item ${currentTab === 'diary' ? 'active' : ''}" data-tab="diary">
            📖 บันทึกรายวัน
          </button>
          <button class="desktop-nav-item ${currentTab === 'pets' ? 'active' : ''}" data-tab="pets">
            🐾 สุนัขในดูแล (${store.pets.length})
          </button>
          <button class="desktop-nav-item ${currentTab === 'calendar' ? 'active' : ''}" data-tab="calendar">
            📅 ปฏิทินกิจกรรม
          </button>
          <button class="desktop-nav-item ${currentTab === 'profile' ? 'active' : ''}" data-tab="profile">
            👤 โปรไฟล์ & PIN
          </button>

          <hr style="margin: 1rem 0; border: none; border-top: 1px solid var(--surface-border);" />

          <button class="btn btn-primary" id="sidebar-add-log-btn" style="width: 100%;">
            ✍️ บันทึกกิจกรรมใหม่
          </button>
        </div>
      </aside>

      <main class="main-content" style="flex: 1;">
        ${viewContentHtml}
      </main>
    </div>

    <!-- Modals Container -->
    ${renderModalsHTML()}
  `;

  // Bind Events for Header, Nav, Active View, and Modals
  bindHeaderNavEvents(handleTabChange, openAddPetModal, openAddLogModal, () => openModal('modal-pet-switcher'));
  bindModalEvents(renderApp);

  // Desktop sidebar event bindings
  const sidebarAddLog = document.getElementById('sidebar-add-log-btn');
  if (sidebarAddLog) {
    sidebarAddLog.addEventListener('click', () => openAddLogModal());
  }

  const btnOpenAddPet = document.getElementById('btn-open-add-pet');
  if (btnOpenAddPet) {
    btnOpenAddPet.addEventListener('click', () => openAddPetModal());
  }

  const btnOpenAddLog = document.getElementById('btn-open-add-log');
  if (btnOpenAddLog) {
    btnOpenAddLog.addEventListener('click', () => openAddLogModal());
  }

  // Bind specific view events
  if (currentTab === 'diary') {
    bindDailyLogEvents(renderApp, openImageViewer);
  } else if (currentTab === 'pets') {
    bindPetManagementEvents(renderApp);

    // Edit pet buttons in PetManagementView
    document.querySelectorAll('.btn-edit-pet').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const petId = e.currentTarget.dataset.id;
        const pet = store.pets.find(p => p.id === petId);
        if (pet) {
          openAddPetModal(pet);
        }
      });
    });
  } else if (currentTab === 'calendar') {
    bindCalendarEvents((dateStr) => {
      openDateDetailsModal(dateStr, renderApp);
    });
  } else if (currentTab === 'profile') {
    bindProfileEvents(renderApp);
  }

  // Handle media query desktop sidebar visibility
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    @media (min-width: 900px) {
      .desktop-sidebar { display: block !important; }
    }
  `;
  document.head.appendChild(styleEl);
}

function handleTabChange(newTab) {
  currentTab = newTab;
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Subscribe to central store changes
store.subscribe(() => {
  renderApp();
});

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
