// ── Invoice Detail Page ──────────────────────────────────
import { invoiceService } from '../services/invoiceService.js';
import { profileService } from '../services/profileService.js';
import { renderSidebar, initSidebar } from '../components/sidebar.js';
import { renderNavbar } from '../components/navbar.js';
import { renderTemplate } from '../templates/index.js';
import { statusBadge, formatDate, formatAmount, copyToClipboard, generateShareLink, calcInvoiceTotals } from '../utils/formatters.js';
import { toast } from '../components/toast.js';
import { confirmModal } from '../components/modal.js';

const app = document.getElementById('app');

export async function renderInvoiceDetail(id) {
  const invoice = invoiceService.getById(id);
  if (!invoice) {
    app.innerHTML = `<div style="padding:48px; text-align:center;">
      <div style="font-size:3rem;">🔍</div>
      <h2 style="margin-top:16px;">Invoice not found</h2>
      <a href="#/invoices" class="btn btn-primary" style="margin-top:16px;">← Back to Invoices</a>
    </div>`;
    return;
  }

  const profile = profileService.get();
  const currency = invoice.currency || 'USD';
  const totals = calcInvoiceTotals(invoice);
  const fullInvoice = { ...invoice, ...totals };

  app.innerHTML = `
    <div class="app-layout">
      ${renderSidebar('/invoices')}
      <div class="page-content">
        ${renderNavbar({ title: invoice.number, breadcrumb: [
          { label: 'Invoices', path: '/invoices' },
          { label: invoice.number, path: `/invoices/${id}` }
        ]})}
        <div class="content-area page-transition">
          <!-- Actions Bar -->
          <div style="
            display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;
            margin-bottom:24px; background:var(--bg-card); border:1px solid var(--border);
            border-radius:var(--radius-lg); padding:16px 20px;
          ">
            <div style="display:flex; align-items:center; gap:12px;">
              ${statusBadge(invoice.status)}
              <span style="color:var(--text-muted); font-size:0.82rem;">Due: ${formatDate(invoice.dueDate)}</span>
              <span style="color:var(--text-muted); font-size:0.82rem;">|</span>
              <strong>${formatAmount(totals.grandTotal, currency)}</strong>
            </div>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <a href="#/invoices/${id}/edit" class="btn btn-secondary btn-sm" id="detail-edit-btn">✏️ Edit</a>
              <button class="btn btn-secondary btn-sm" id="detail-duplicate-btn">📋 Duplicate</button>
              <button class="btn btn-secondary btn-sm" id="detail-share-btn">🔗 Share</button>
              <button class="btn btn-secondary btn-sm" id="detail-print-btn">🖨️ Print</button>
              <button class="btn btn-primary btn-sm" id="detail-pdf-btn">📥 Download PDF</button>
              <button class="btn btn-danger btn-sm" id="detail-delete-btn">🗑️ Delete</button>
            </div>
          </div>

          <!-- Status changer -->
          <div style="display:flex; gap:8px; margin-bottom:24px; flex-wrap:wrap;">
            <span style="font-size:0.78rem; color:var(--text-muted); line-height:32px;">Set status:</span>
            ${['draft','sent','paid','overdue'].map(s => `
              <button class="btn btn-sm ${invoice.status === s ? 'btn-primary' : 'btn-secondary'} status-btn" data-status="${s}">
                ${s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            `).join('')}
          </div>

          <!-- Invoice Preview -->
          <div id="printable-invoice" style="
            border-radius:var(--radius-xl); overflow:hidden;
            box-shadow:var(--shadow-lg); border:1px solid var(--border);
          ">
            ${renderTemplate(invoice.template || 'modern', fullInvoice, profile)}
          </div>
        </div>
      </div>
    </div>
  `;

  initSidebar();
  bindDetailEvents(id, invoice, fullInvoice, profile);
}

function bindDetailEvents(id, invoice, fullInvoice, profile) {
  // Status buttons
  document.querySelectorAll('.status-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      invoiceService.updateStatus(id, btn.dataset.status);
      toast.success(`Status updated to ${btn.dataset.status}`);
      renderInvoiceDetail(id);
    });
  });

  // Duplicate
  document.getElementById('detail-duplicate-btn')?.addEventListener('click', () => {
    const dup = invoiceService.duplicate(id);
    if (dup) {
      toast.success('Duplicated!', `Created ${dup.number}`);
      window.location.hash = `#/invoices/${dup.id}`;
    }
  });

  // Share
  document.getElementById('detail-share-btn')?.addEventListener('click', async () => {
    const link = generateShareLink(fullInvoice);
    await copyToClipboard(link);
    toast.success('Link copied!', 'Shareable link copied to clipboard');
  });

  // Print
  document.getElementById('detail-print-btn')?.addEventListener('click', () => {
    const content = document.getElementById('printable-invoice')?.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html><html><head>
        <title>${invoice.number}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>* { margin:0; padding:0; box-sizing:border-box; } body { font-family: 'Inter', sans-serif; }</style>
      </head><body>
        ${content}
        <script>window.onload = () => { window.print(); window.close(); }<\/script>
      </body></html>
    `);
    win.document.close();
  });

  // PDF
  document.getElementById('detail-pdf-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('detail-pdf-btn');
    btn.textContent = '⏳ Generating...';
    btn.disabled = true;
    try {
      const { default: html2pdf } = await import('html2pdf.js');
      const el = document.getElementById('printable-invoice');
      await html2pdf().set({
        margin: 0,
        filename: `${invoice.number}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      }).from(el).save();
      toast.success('PDF downloaded!');
    } catch (err) {
      toast.error('PDF export failed', err.message);
    } finally {
      btn.textContent = '📥 Download PDF';
      btn.disabled = false;
    }
  });

  // Delete
  document.getElementById('detail-delete-btn')?.addEventListener('click', async () => {
    const confirmed = await confirmModal({
      title: 'Delete Invoice',
      message: `Are you sure you want to delete invoice ${invoice.number}? This cannot be undone.`,
      confirmText: 'Delete',
      dangerous: true,
    });
    if (confirmed) {
      invoiceService.delete(id);
      toast.success('Invoice deleted');
      window.location.hash = '#/invoices';
    }
  });
}
