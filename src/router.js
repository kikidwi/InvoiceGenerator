// ── Hash-based SPA Router ────────────────────────────────
import { renderCreateInvoice } from './pages/createInvoice.js';

const app = document.getElementById('app');

const ROUTES = [
  { pattern: /.*/, render: () => renderCreateInvoice() }, // All routes point to the main creator
];

export function navigate(path) {
  window.location.hash = path;
}

export function getHash() {
  return window.location.hash || '/';
}

async function handleRoute() {
  const hash = window.location.hash || '/';
  
  for (const route of ROUTES) {
    const match = hash.match(route.pattern);
    if (match) {
      try {
        await route.render(match);
      } catch (err) {
        console.error('Route error:', err);
        app.innerHTML = `<div style="padding:32px; color:#ef4444; font-family:monospace;">
          <h2>Halaman Error</h2><pre>${err.message}</pre>
        </div>`;
      }
      return;
    }
  }
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
