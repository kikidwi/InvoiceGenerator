// ── Templates Page ───────────────────────────────────────
import { TEMPLATES, renderTemplate } from '../templates/index.js';
import { profileService } from '../services/profileService.js';
import { renderSidebar, initSidebar } from '../components/sidebar.js';
import { renderNavbar } from '../components/navbar.js';
import { openModal, closeModal } from '../components/modal.js';
import { toast } from '../components/toast.js';

const app = document.getElementById('app');

const SAMPLE_INVOICE = {
  number: 'INV-2026-0001',
  invoiceDate: new Date().toISOString().slice(0, 10),
  dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  clientName: 'Acme Corporation',
  clientEmail: 'billing@acme.com',
  clientAddress: '123 Business Ave\nNew York, NY 10001',
  currency: 'USD',
  taxRate: 10,
  discountType: 'percent',
  discountValue: 5,
  notes: 'Thank you for your business! Payment is due within 30 days.',
  items: [
    { name: 'Web Design', description: 'Full website redesign and development', qty: 1, price: 3500 },
    { name: 'SEO Optimization', description: 'On-page and technical SEO', qty: 1, price: 800 },
    { name: 'Monthly Maintenance', description: 'Hosting, updates, and support', qty: 3, price: 200 },
  ],
  subtotal: 4900,
  taxAmount: 490,
  discountAmount: 245,
  grandTotal: 5145,
};

const SAMPLE_PROFILE = {
  businessName: 'Creative Studio',
  businessEmail: 'hello@creativestudio.com',
  businessAddress: '456 Design District, San Francisco, CA',
  businessPhone: '+1 (555) 123-4567',
  businessWebsite: 'creativestudio.com',
  logo: null,
};

export function renderTemplatesPage() {
  const profile = profileService.get();

  app.innerHTML = `
    <div class="app-layout">
      ${renderSidebar('/templates')}
      <div class="page-content">
        ${renderNavbar({ title: 'Templates', breadcrumb: [{ label: 'Templates', path: '/templates' }] })}
        <div class="content-area page-transition">
          <div class="page-header">
            <div class="page-header-left">
              <h1 class="page-header-title">Invoice Templates</h1>
              <p class="page-header-sub">Choose from ${TEMPLATES.length} professionally designed templates</p>
            </div>
          </div>

          <div class="grid-3 stagger-children" id="template-cards">
            ${TEMPLATES.map(t => `
              <div class="card template-card" data-template="${t.id}" style="cursor:pointer; overflow:hidden; padding:0;">
                <!-- Mini preview -->
                <div style="
                  height:200px; overflow:hidden; background:#f8fafc;
                  display:flex; align-items:flex-start; justify-content:center;
                  position:relative;
                ">
                  <div style="transform:scale(0.28); transform-origin:top center; width:357%; pointer-events:none;">
                    ${renderTemplate(t.id, { ...SAMPLE_INVOICE, accentColor: getDefaultColor(t.id) }, SAMPLE_PROFILE)}
                  </div>
                  <div style="position:absolute; inset:0; background:linear-gradient(to bottom, transparent 60%, rgba(248,250,252,0.9));"></div>
                  <div style="position:absolute; top:12px; right:12px; display:flex; gap:6px; flex-wrap:wrap;">
                    ${t.tags.map(tag => `<span style="
                      background:rgba(99,102,241,0.9); color:#fff;
                      font-size:0.65rem; font-weight:700; padding:2px 8px;
                      border-radius:var(--radius-full); text-transform:uppercase; letter-spacing:0.06em;
                    ">${tag}</span>`).join('')}
                  </div>
                </div>
                <!-- Info -->
                <div style="padding:20px;">
                  <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
                    <span style="font-size:1.5rem;">${t.preview}</span>
                    <h3 style="font-family:var(--font-display); font-size:1rem; font-weight:700;">${t.name}</h3>
                    ${profile.defaultTemplate === t.id ? `<span class="badge badge-primary" style="margin-left:auto;">Default</span>` : ''}
                  </div>
                  <p style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:16px; line-height:1.6;">${t.description}</p>
                  <div style="display:flex; gap:8px;">
                    <button class="btn btn-secondary btn-sm preview-btn" data-template="${t.id}">👁️ Preview</button>
                    <button class="btn btn-primary btn-sm use-btn" data-template="${t.id}">Use Template</button>
                    ${profile.defaultTemplate !== t.id
                      ? `<button class="btn btn-ghost btn-sm set-default-btn" data-template="${t.id}" title="Set as default">⭐</button>`
                      : ''
                    }
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  initSidebar();
  bindTemplateEvents(profile);
}

function getDefaultColor(templateId) {
  const colors = { modern: '#6366f1', minimalist: '#10b981', corporate: '#1e293b', dark: '#818cf8', creative: '#f59e0b' };
  return colors[templateId] || '#6366f1';
}

function bindTemplateEvents(profile) {
  document.getElementById('template-cards')?.addEventListener('click', (e) => {
    const previewBtn = e.target.closest('.preview-btn');
    const useBtn = e.target.closest('.use-btn');
    const defaultBtn = e.target.closest('.set-default-btn');

    if (previewBtn) showTemplatePreview(previewBtn.dataset.template, profile);
    if (useBtn) useTemplate(useBtn.dataset.template);
    if (defaultBtn) setDefaultTemplate(defaultBtn.dataset.template);
  });
}

function showTemplatePreview(templateId, profile) {
  const template = TEMPLATES.find(t => t.id === templateId);
  const rendered = renderTemplate(templateId, {
    ...SAMPLE_INVOICE,
    accentColor: getDefaultColor(templateId)
  }, SAMPLE_PROFILE);

  openModal({
    title: `${template?.preview} ${template?.name} — Preview`,
    size: 'xl',
    content: `
      <div style="overflow:auto; max-height:70vh; border-radius:var(--radius-md); border:1px solid var(--border);">
        ${rendered}
      </div>
      <div style="display:flex; gap:12px; justify-content:flex-end; margin-top:20px;">
        <button class="btn btn-secondary" onclick="window.closeModal && window.closeModal()">Close</button>
        <a href="#/invoices/create" class="btn btn-primary" id="use-from-preview" data-template="${templateId}">Use This Template →</a>
      </div>
    `,
  });

  // Expose closeModal for inline onclick
  window.closeModal = closeModal;
}

function useTemplate(templateId) {
  // Navigate to create with this template pre-selected
  window.location.hash = '#/invoices/create';
  // We'll handle template pre-selection via draft
  const draft = { template: templateId };
  import('../services/invoiceService.js').then(({ invoiceService }) => {
    const existing = invoiceService.getDraft() || {};
    invoiceService.saveDraft({ ...existing, template: templateId });
  });
  toast.info(`${TEMPLATES.find(t => t.id === templateId)?.name} template selected`, 'Opening invoice creator...');
}

function setDefaultTemplate(templateId) {
  profileService.update('defaultTemplate', templateId);
  toast.success('Default template updated');
  renderTemplatesPage();
}
