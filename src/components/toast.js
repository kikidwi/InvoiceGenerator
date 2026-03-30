// ── Toast Notifications ──────────────────────────────────
const container = () => document.getElementById('toast-container');

const ICONS = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
const TITLES = { success: 'Success', error: 'Error', warning: 'Warning', info: 'Info' };

export function showToast(type = 'info', message = '', title = '') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `
    <span class="toast-icon">${ICONS[type] || 'ℹ️'}</span>
    <div class="toast-body">
      <div class="toast-title">${title || TITLES[type]}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Close">✕</button>
  `;

  const close = () => {
    el.classList.add('removing');
    el.addEventListener('animationend', () => el.remove(), { once: true });
  };

  el.querySelector('.toast-close').addEventListener('click', close);
  container().appendChild(el);
  setTimeout(close, 4500);
  return el;
}

export const toast = {
  success: (msg, title) => showToast('success', msg, title),
  error:   (msg, title) => showToast('error',   msg, title),
  warning: (msg, title) => showToast('warning', msg, title),
  info:    (msg, title) => showToast('info',    msg, title),
};
