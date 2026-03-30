import { profileService } from '../services/profileService.js';
import { invoiceService } from '../services/invoiceService.js';
import { navigate } from '../router.js';

const NAV_ITEMS = [
  { icon: '📊', label: 'Dashboard',       path: '/dashboard' },
  { icon: '✏️',  label: 'Create Invoice',  path: '/invoices/create' },
  { icon: '📄', label: 'All Invoices',     path: '/invoices' },
  { icon: '🎨', label: 'Templates',       path: '/templates' },
  { icon: '👤', label: 'Profile',         path: '/profile' },
];

export function renderSidebar(activePath = '') {
  const profile = profileService.get();
  const stats = invoiceService.getStats();
  const initial = (profile.businessName || 'Y').charAt(0).toUpperCase();

  return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <a class="sidebar-logo-mark" href="#/invoices/create" id="logo-link">
          <div class="logo-icon">⚡</div>
          <span class="logo-text">InvoiceFlow</span>
          <span class="logo-badge">FREE</span>
        </a>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section-label">Main Menu</div>
        ${NAV_ITEMS.map(item => {
          const isActive = activePath === item.path
            || (item.path === '/invoices' && activePath.startsWith('/invoices') && activePath !== '/invoices/create')
            || (item.path === '/invoices/create' && (activePath === '/invoices/create' || activePath === '/'))
            || (item.path !== '/invoices' && item.path !== '/invoices/create' && item.path !== '/dashboard' && activePath.startsWith(item.path));
          const badge = item.path === '/invoices' && stats.total > 0 ? `<span class="nav-badge">${stats.total}</span>` : '';
          return `
            <a class="nav-item${isActive ? ' active' : ''}" data-path="${item.path}" href="#${item.path}">
              <span class="nav-icon">${item.icon}</span>
              <span>${item.label}</span>
              ${badge}
            </a>
          `;
        }).join('')}
      </nav>

      <div class="sidebar-footer">
        <a class="sidebar-user" href="#/profile">
          <div class="user-avatar">${initial}</div>
          <div class="user-info">
            <div class="user-name">${profile.businessName}</div>
            <div class="user-role">Business Owner</div>
          </div>
        </a>
      </div>
    </aside>
    <div class="sidebar-overlay" id="sidebar-overlay"></div>
  `;
}

export function initSidebar() {
  const overlay = document.getElementById('sidebar-overlay');
  const sidebar = document.getElementById('sidebar');

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar?.classList.remove('open');
      overlay.classList.remove('open');
    });
  }

  // Hamburger button
  const hamburger = document.getElementById('hamburger-btn');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      sidebar?.classList.toggle('open');
      overlay?.classList.toggle('open');
    });
  }

  // Close sidebar on nav click (mobile)
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 640) {
        sidebar?.classList.remove('open');
        overlay?.classList.remove('open');
      }
    });
  });
}
