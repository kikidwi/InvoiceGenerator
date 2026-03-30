// ── Edit Invoice Page ────────────────────────────────────
import { invoiceService } from '../services/invoiceService.js';
import { profileService } from '../services/profileService.js';
import { renderSidebar, initSidebar } from '../components/sidebar.js';
import { renderNavbar } from '../components/navbar.js';
import { renderTemplate, TEMPLATES } from '../templates/index.js';
import { formatAmount, calcInvoiceTotals, debounce } from '../utils/formatters.js';
import { currencyOptions } from '../services/currencyService.js';
import { toast } from '../components/toast.js';

const app = document.getElementById('app');

const COLORS = ['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316','#1e293b'];

export function renderEditInvoice(id) {
  const invoice = invoiceService.getById(id);
  if (!invoice) {
    app.innerHTML = `<div style="padding:48px; text-align:center;">
      <h2>Invoice not found</h2>
      <a href="#/invoices" class="btn btn-primary" style="margin-top:16px;">← Back</a>
    </div>`;
    return;
  }

  const profile = profileService.get();
  // Deep copy for editing
  let editData = JSON.parse(JSON.stringify(invoice));
  if (!editData.items || editData.items.length === 0) {
    editData.items = [{ name: '', description: '', qty: 1, price: 0 }];
  }

  app.innerHTML = buildEditLayout(editData, profile);
  initSidebar();
  initEditEvents(id, editData, profile);
  updateEditPreview(editData, profile);
  updateEditTotals(editData);
}

function buildEditLayout(editData, profile) {
  return `
    <div class="app-layout">
      ${renderSidebar('/invoices')}
      <div class="page-content">
        ${renderNavbar({ title: 'Edit Invoice', breadcrumb: [
          { label: 'Invoices', path: '/invoices' },
          { label: editData.number, path: `/invoices/${editData.id}` },
          { label: 'Edit', path: `/invoices/${editData.id}/edit` },
        ]})}
        <div class="content-area page-transition" style="padding-bottom:40px;">
          <div class="page-header">
            <div class="page-header-left">
              <h1 class="page-header-title">Edit Invoice</h1>
              <p class="page-header-sub">Editing ${editData.number}</p>
            </div>
            <div class="page-header-actions">
              <a href="#/invoices/${editData.id}" class="btn btn-secondary">Cancel</a>
              <button class="btn btn-primary" id="update-invoice-btn">💾 Save Changes</button>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; align-items:start;">
            <!-- Form -->
            <div style="display:flex; flex-direction:column; gap:20px;">
              <div class="card">
                <div class="card-header"><span class="card-title">📋 Invoice Info</span></div>
                <div class="grid-2">
                  <div class="form-group">
                    <label class="form-label">Invoice Number</label>
                    <input type="text" class="form-control" id="ef-number" value="${editData.number}">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Currency</label>
                    <select class="form-control" id="ef-currency">
                      ${currencyOptions().replace(`value="${editData.currency}"`, `value="${editData.currency}" selected`)}
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Issue Date</label>
                    <input type="date" class="form-control" id="ef-date" value="${editData.invoiceDate || ''}">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Due Date</label>
                    <input type="date" class="form-control" id="ef-due" value="${editData.dueDate || ''}">
                  </div>
                </div>
              </div>

              <div class="card">
                <div class="card-header"><span class="card-title">👤 Client</span></div>
                <div class="form-group">
                  <label class="form-label">Client Name *</label>
                  <input type="text" class="form-control" id="ef-client-name" value="${editData.clientName || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">Client Email</label>
                  <input type="email" class="form-control" id="ef-client-email" value="${editData.clientEmail || ''}">
                </div>
                <div class="form-group">
                  <label class="form-label">Client Address</label>
                  <textarea class="form-control" id="ef-client-address" rows="3">${editData.clientAddress || ''}</textarea>
                </div>
              </div>

              <div class="card">
                <div class="card-header">
                  <span class="card-title">📦 Items</span>
                  <button class="btn btn-secondary btn-sm" id="edit-add-item-btn">+ Add</button>
                </div>
                <div id="edit-items-container">
                  ${renderEditItemRows(editData)}
                </div>
              </div>

              <div class="card">
                <div class="card-header"><span class="card-title">🧮 Calculations</span></div>
                <div class="grid-2">
                  <div class="form-group">
                    <label class="form-label">Tax (%)</label>
                    <input type="number" class="form-control" id="ef-tax" value="${editData.taxRate || 0}" min="0" max="100" step="0.1">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Discount Type</label>
                    <select class="form-control" id="ef-discount-type">
                      <option value="percent" ${editData.discountType === 'percent' ? 'selected' : ''}>Percentage (%)</option>
                      <option value="fixed" ${editData.discountType === 'fixed' ? 'selected' : ''}>Fixed</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Discount Value</label>
                    <input type="number" class="form-control" id="ef-discount" value="${editData.discountValue || 0}" min="0" step="0.01">
                  </div>
                </div>
                <div id="edit-totals-panel" style="background:var(--bg-elevated); border-radius:var(--radius-md); padding:16px; margin-top:8px;"></div>
              </div>

              <div class="card">
                <div class="card-header"><span class="card-title">📝 Notes</span></div>
                <textarea class="form-control" id="ef-notes" rows="3">${editData.notes || ''}</textarea>
              </div>

              <div class="card">
                <div class="card-header"><span class="card-title">🎨 Design</span></div>
                <div class="form-group">
                  <label class="form-label">Template</label>
                  <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px;" id="edit-template-selector">
                    ${TEMPLATES.map(t => `
                      <div class="edit-template-thumb" data-template="${t.id}" style="
                        border:2px solid ${editData.template === t.id ? 'var(--primary)' : 'var(--border)'};
                        border-radius:var(--radius-md); padding:12px 8px; text-align:center;
                        cursor:pointer; transition:all 0.2s; background:var(--bg-elevated);
                      ">
                        <div style="font-size:1.5rem;">${t.preview}</div>
                        <div style="font-size:0.72rem; font-weight:600; margin-top:4px;">${t.name}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label">Accent Color</label>
                  <div class="color-picker-row" id="edit-color-picker">
                    ${COLORS.map(c => `
                      <div class="color-swatch${editData.accentColor === c ? ' active' : ''}" style="background:${c};" data-color="${c}"></div>
                    `).join('')}
                    <input type="color" id="edit-custom-color" value="${editData.accentColor || '#6366f1'}" style="width:28px; height:28px; border-radius:50%; border:3px solid transparent; cursor:pointer; padding:0;">
                  </div>
                </div>
              </div>
            </div>

            <!-- Preview -->
            <div style="position:sticky; top:calc(var(--navbar-height) + 24px);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <span style="font-size:0.78rem; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em;">Live Preview</span>
                <span style="font-size:0.72rem; background:var(--success-alpha); color:var(--success); padding:2px 8px; border-radius:var(--radius-full); font-weight:600;">● LIVE</span>
              </div>
              <div style="border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-lg); border:1px solid var(--border); transform:scale(0.9); transform-origin:top center;">
                <div id="edit-invoice-preview" style="background:#fff; min-height:500px;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderEditItemRows(editData) {
  return editData.items.map((item, i) => `
    <div class="edit-item-row" data-index="${i}" style="background:var(--bg-elevated); border-radius:var(--radius-md); padding:14px; margin-bottom:10px; border:1px solid var(--border);">
      <div style="display:grid; grid-template-columns:1fr auto; gap:8px; align-items:start; margin-bottom:8px;">
        <input type="text" class="form-control" data-index="${i}" data-field="name" value="${item.name || ''}" placeholder="Item name *" style="font-weight:500;">
        <button class="btn btn-ghost btn-sm btn-icon remove-edit-item" data-index="${i}" style="color:var(--danger);">✕</button>
      </div>
      <input type="text" class="form-control" data-index="${i}" data-field="description" value="${item.description || ''}" placeholder="Description (optional)" style="margin-bottom:8px; font-size:0.85rem;">
      <div style="display:grid; grid-template-columns:80px 1fr 1fr; gap:8px;">
        <div>
          <label style="font-size:0.7rem; color:var(--text-muted); font-weight:600; display:block; margin-bottom:3px;">QTY</label>
          <input type="number" class="form-control" data-index="${i}" data-field="qty" value="${item.qty || 1}" min="0" step="1" style="text-align:center;">
        </div>
        <div>
          <label style="font-size:0.7rem; color:var(--text-muted); font-weight:600; display:block; margin-bottom:3px;">PRICE</label>
          <input type="number" class="form-control" data-index="${i}" data-field="price" value="${item.price || 0}" min="0" step="0.01">
        </div>
        <div>
          <label style="font-size:0.7rem; color:var(--text-muted); font-weight:600; display:block; margin-bottom:3px;">TOTAL</label>
          <div style="padding:10px 14px; background:var(--bg-card); border-radius:var(--radius-md); font-weight:600; font-size:0.9rem;" class="edit-item-total">
            ${formatAmount((item.qty || 0) * (item.price || 0), editData.currency)}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function updateEditTotals(editData) {
  const { subtotal, taxAmount, discountAmount, grandTotal } = calcInvoiceTotals(editData);
  const c = editData.currency;
  const panel = document.getElementById('edit-totals-panel');
  if (!panel) return;
  panel.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:6px;">
      <div style="display:flex; justify-content:space-between; font-size:0.875rem; color:var(--text-secondary);">
        <span>Subtotal</span><span>${formatAmount(subtotal, c)}</span>
      </div>
      ${editData.taxRate > 0 ? `<div style="display:flex; justify-content:space-between; font-size:0.875rem; color:var(--text-secondary);">
        <span>Tax (${editData.taxRate}%)</span><span>+${formatAmount(taxAmount, c)}</span>
      </div>` : ''}
      ${editData.discountValue > 0 ? `<div style="display:flex; justify-content:space-between; font-size:0.875rem; color:var(--text-secondary);">
        <span>Discount</span><span>-${formatAmount(discountAmount, c)}</span>
      </div>` : ''}
      <div style="height:1px; background:var(--border); margin:4px 0;"></div>
      <div style="display:flex; justify-content:space-between; font-size:1.1rem; font-weight:800; color:var(--text-primary);">
        <span>Grand Total</span><span style="color:var(--primary);">${formatAmount(grandTotal, c)}</span>
      </div>
    </div>
  `;
  document.querySelectorAll('.edit-item-total').forEach((el, i) => {
    const item = editData.items[i];
    if (item) el.textContent = formatAmount((item.qty || 0) * (item.price || 0), c);
  });
}

function updateEditPreview(editData, profile) {
  const preview = document.getElementById('edit-invoice-preview');
  if (!preview) return;
  const totals = calcInvoiceTotals(editData);
  preview.innerHTML = renderTemplate(editData.template || 'modern', { ...editData, ...totals }, profile);
}

function collectEditData(editData) {
  editData.number = document.getElementById('ef-number')?.value || editData.number;
  editData.currency = document.getElementById('ef-currency')?.value || editData.currency;
  editData.invoiceDate = document.getElementById('ef-date')?.value || editData.invoiceDate;
  editData.dueDate = document.getElementById('ef-due')?.value || editData.dueDate;
  editData.clientName = document.getElementById('ef-client-name')?.value || '';
  editData.clientEmail = document.getElementById('ef-client-email')?.value || '';
  editData.clientAddress = document.getElementById('ef-client-address')?.value || '';
  editData.taxRate = parseFloat(document.getElementById('ef-tax')?.value) || 0;
  editData.discountType = document.getElementById('ef-discount-type')?.value || 'percent';
  editData.discountValue = parseFloat(document.getElementById('ef-discount')?.value) || 0;
  editData.notes = document.getElementById('ef-notes')?.value || '';
}

function initEditEvents(id, editData, profile) {
  const debouncedPreview = debounce(() => {
    updateEditPreview(editData, profile);
    updateEditTotals(editData);
  }, 150);

  const fields = ['ef-number','ef-currency','ef-date','ef-due','ef-client-name','ef-client-email','ef-client-address','ef-tax','ef-discount-type','ef-discount','ef-notes'];
  fields.forEach(fid => {
    document.getElementById(fid)?.addEventListener('input', () => { collectEditData(editData); debouncedPreview(); });
    document.getElementById(fid)?.addEventListener('change', () => { collectEditData(editData); debouncedPreview(); });
  });

  document.getElementById('edit-items-container')?.addEventListener('input', (e) => {
    const el = e.target;
    const idx = parseInt(el.dataset.index);
    const field = el.dataset.field;
    if (isNaN(idx) || !field) return;
    editData.items[idx][field] = (field === 'qty' || field === 'price') ? (parseFloat(el.value) || 0) : el.value;
    debouncedPreview();
  });

  document.getElementById('edit-items-container')?.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.remove-edit-item');
    if (removeBtn) {
      const idx = parseInt(removeBtn.dataset.index);
      if (editData.items.length > 1) editData.items.splice(idx, 1);
      else editData.items = [{ name: '', description: '', qty: 1, price: 0 }];
      document.getElementById('edit-items-container').innerHTML = renderEditItemRows(editData);
      debouncedPreview();
    }
  });

  document.getElementById('edit-add-item-btn')?.addEventListener('click', () => {
    editData.items.push({ name: '', description: '', qty: 1, price: 0 });
    document.getElementById('edit-items-container').innerHTML = renderEditItemRows(editData);
    debouncedPreview();
  });

  document.getElementById('edit-template-selector')?.addEventListener('click', (e) => {
    const thumb = e.target.closest('.edit-template-thumb');
    if (!thumb) return;
    editData.template = thumb.dataset.template;
    document.querySelectorAll('.edit-template-thumb').forEach(t => {
      t.style.borderColor = t.dataset.template === editData.template ? 'var(--primary)' : 'var(--border)';
    });
    updateEditPreview(editData, profile);
  });

  document.getElementById('edit-color-picker')?.addEventListener('click', (e) => {
    const swatch = e.target.closest('.color-swatch');
    if (!swatch) return;
    editData.accentColor = swatch.dataset.color;
    document.querySelectorAll('#edit-color-picker .color-swatch').forEach(s => s.classList.toggle('active', s.dataset.color === editData.accentColor));
    document.getElementById('edit-custom-color').value = editData.accentColor;
    updateEditPreview(editData, profile);
  });

  document.getElementById('edit-custom-color')?.addEventListener('input', (e) => {
    editData.accentColor = e.target.value;
    document.querySelectorAll('#edit-color-picker .color-swatch').forEach(s => s.classList.remove('active'));
    updateEditPreview(editData, profile);
  });

  document.getElementById('update-invoice-btn')?.addEventListener('click', () => {
    collectEditData(editData);
    if (!editData.clientName) {
      toast.error('Client name is required');
      return;
    }
    const totals = calcInvoiceTotals(editData);
    invoiceService.update(id, { ...editData, ...totals });
    toast.success('Invoice updated!');
    window.location.hash = `#/invoices/${id}`;
  });
}
