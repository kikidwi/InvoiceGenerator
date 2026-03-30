// ── Invoice List Page ────────────────────────────────────
import { invoiceService } from '../services/invoiceService.js';
import { profileService } from '../services/profileService.js';
import { renderSidebar, initSidebar } from '../components/sidebar.js';
import { renderNavbar } from '../components/navbar.js';
import { formatAmount, formatDate, statusBadge, debounce } from '../utils/formatters.js';
import { toast } from '../components/toast.js';
import { confirmModal } from '../components/modal.js';

const app = document.getElementById('app');
let currentFilter = 'all';
let searchQuery = '';

export function renderInvoiceList() {
  const profile = profileService.get();
  const currency = profile.defaultCurrency || 'USD';

  app.innerHTML = `
    <div class="app-layout">
      ${renderSidebar('/invoices')}
      <div class="page-content">
        ${renderNavbar({ title: 'Invoices', breadcrumb: [{ label: 'Invoices', path: '/invoices' }] })}
        <div class="content-area page-transition">
          <div class="page-header">
            <div class="page-header-left">
              <h1 class="page-header-title">All Invoices</h1>
              <p class="page-header-sub">Manage and track all your invoices</p>
            </div>
            <div class="page-header-actions">
              <a href="#/invoices/create" class="btn btn-primary" id="list-create-btn">+ New Invoice</a>
            </div>
          </div>

          <!-- Filters + Search -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
            <div class="filter-chips" id="filter-chips">
              ${['all', 'draft', 'sent', 'paid', 'overdue'].map(f => `
                <button class="chip${f === currentFilter ? ' active' : ''}" data-filter="${f}" id="chip-${f}">
                  ${f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              `).join('')}
            </div>
            <div class="search-wrap">
              <span class="search-icon">🔍</span>
              <input type="text" class="form-control search-input" id="invoice-search"
                placeholder="Search by client, number..." style="width:260px;" value="${searchQuery}">
            </div>
          </div>

          <!-- Table -->
          <div class="card" style="padding:0; overflow:hidden;" id="invoice-list-card">
            ${renderInvoiceTable(currency)}
          </div>
        </div>
      </div>
    </div>
  `;

  initSidebar();
  bindListEvents(currency);
}

function renderInvoiceTable(currency) {
  let invoices = invoiceService.getAll();

  if (currentFilter !== 'all') {
    invoices = invoices.filter(i => i.status === currentFilter);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    invoices = invoices.filter(i =>
      (i.clientName || '').toLowerCase().includes(q) ||
      (i.number || '').toLowerCase().includes(q) ||
      (i.clientEmail || '').toLowerCase().includes(q)
    );
  }

  if (invoices.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-icon">📄</div>
        <div class="empty-title">${searchQuery ? 'No results found' : 'No invoices yet'}</div>
        <div class="empty-desc">${searchQuery ? 'Try a different search term' : 'Create your first invoice to get started'}</div>
        ${!searchQuery ? `<a href="#/invoices/create" class="btn btn-primary mt-4" id="list-empty-create">+ Create Invoice</a>` : ''}
      </div>
    `;
  }

  return `
    <div class="table-wrap" style="border:none; border-radius:0;">
      <table>
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Client</th>
            <th>Issue Date</th>
            <th>Due Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th style="text-align:right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${invoices.map(inv => `
            <tr data-id="${inv.id}">
              <td>
                <a href="#/invoices/${inv.id}" style="font-family:monospace; font-size:0.82rem; color:var(--primary); font-weight:600;">${inv.number}</a>
              </td>
              <td>
                <div style="font-weight:500;">${inv.clientName || '—'}</div>
                <div style="font-size:0.78rem; color:var(--text-muted);">${inv.clientEmail || ''}</div>
              </td>
              <td style="color:var(--text-secondary); font-size:0.875rem;">${formatDate(inv.invoiceDate)}</td>
              <td style="color:var(--text-secondary); font-size:0.875rem;">${formatDate(inv.dueDate)}</td>
              <td><strong>${formatAmount(inv.grandTotal || 0, inv.currency || currency)}</strong></td>
              <td>
                <div class="dropdown" style="display:inline-block;">
                  <button class="badge badge-${inv.status} status-toggle" data-id="${inv.id}" data-status="${inv.status}" style="cursor:pointer; border:none; background:inherit;">
                    ${statusBadge(inv.status).match(/>([^<]+)<\/span>/)?.[1] || inv.status}
                  </button>
                </div>
              </td>
              <td>
                <div style="display:flex; gap:6px; justify-content:flex-end;">
                  <a href="#/invoices/${inv.id}" class="btn btn-ghost btn-sm" title="View">👁️</a>
                  <a href="#/invoices/${inv.id}/edit" class="btn btn-ghost btn-sm" title="Edit">✏️</a>
                  <button class="btn btn-ghost btn-sm btn-duplicate" data-id="${inv.id}" title="Duplicate">📋</button>
                  <button class="btn btn-ghost btn-sm btn-delete" data-id="${inv.id}" title="Delete" style="color:var(--danger);">🗑️</button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <div style="padding:14px 16px; border-top:1px solid var(--border); font-size:0.78rem; color:var(--text-muted);">
      Showing ${invoices.length} invoice${invoices.length !== 1 ? 's' : ''}
    </div>
  `;
}

function bindListEvents(currency) {
  // Filter chips
  document.getElementById('filter-chips')?.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    currentFilter = chip.dataset.filter;
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.filter === currentFilter));
    refreshTable(currency);
  });

  // Search
  const searchInput = document.getElementById('invoice-search');
  const doSearch = debounce(() => {
    searchQuery = searchInput?.value || '';
    refreshTable(currency);
  }, 250);
  searchInput?.addEventListener('input', doSearch);

  // Table actions (event delegation)
  document.getElementById('invoice-list-card')?.addEventListener('click', async (e) => {
    const deleteBtn = e.target.closest('.btn-delete');
    const dupBtn = e.target.closest('.btn-duplicate');
    const statusBtn = e.target.closest('.status-toggle');

    if (deleteBtn) {
      const confirmed = await confirmModal({
        title: 'Delete Invoice',
        message: 'Are you sure you want to delete this invoice? This action cannot be undone.',
        confirmText: 'Delete',
        dangerous: true,
      });
      if (confirmed) {
        invoiceService.delete(deleteBtn.dataset.id);
        toast.success('Invoice deleted');
        refreshTable(currency);
      }
    }

    if (dupBtn) {
      const dup = invoiceService.duplicate(dupBtn.dataset.id);
      if (dup) {
        toast.success('Invoice duplicated', `Created as ${dup.number}`);
        refreshTable(currency);
      }
    }

    if (statusBtn) {
      showStatusMenu(statusBtn, currency);
    }
  });
}

function showStatusMenu(btn, currency) {
  // Remove existing menus
  document.querySelectorAll('.status-menu').forEach(m => m.remove());

  const id = btn.dataset.id;
  const statuses = ['draft', 'sent', 'paid', 'overdue'];
  
  const menu = document.createElement('div');
  menu.className = 'dropdown-menu open status-menu';
  menu.style.cssText = 'position:absolute; z-index:500;';
  menu.innerHTML = statuses.map(s => `
    <div class="dropdown-item" data-status="${s}" data-id="${id}">
      <span class="badge badge-${s}">${s}</span>
    </div>
  `).join('');

  btn.style.position = 'relative';
  btn.appendChild(menu);

  menu.addEventListener('click', (e) => {
    const item = e.target.closest('[data-status]');
    if (item) {
      invoiceService.updateStatus(item.dataset.id, item.dataset.status);
      toast.success(`Status updated to ${item.dataset.status}`);
      menu.remove();
      refreshTable(currency);
    }
  });

  setTimeout(() => {
    document.addEventListener('click', () => menu.remove(), { once: true });
  }, 50);
}

function refreshTable(currency) {
  const card = document.getElementById('invoice-list-card');
  if (card) card.innerHTML = renderInvoiceTable(currency);
  // Re-bind events for table actions
  document.getElementById('invoice-list-card')?.addEventListener('click', async (e) => {
    const deleteBtn = e.target.closest('.btn-delete');
    const dupBtn = e.target.closest('.btn-duplicate');
    const statusBtn = e.target.closest('.status-toggle');

    if (deleteBtn) {
      const confirmed = await confirmModal({
        title: 'Delete Invoice',
        message: 'Are you sure you want to delete this invoice?',
        confirmText: 'Delete',
        dangerous: true,
      });
      if (confirmed) {
        invoiceService.delete(deleteBtn.dataset.id);
        toast.success('Invoice deleted');
        refreshTable(currency);
      }
    }
    if (dupBtn) {
      const dup = invoiceService.duplicate(dupBtn.dataset.id);
      if (dup) { toast.success('Invoice duplicated'); refreshTable(currency); }
    }
    if (statusBtn) showStatusMenu(statusBtn, currency);
  });
}
