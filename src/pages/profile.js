// ── Profile Page ─────────────────────────────────────────
import { profileService } from '../services/profileService.js';
import { renderSidebar, initSidebar } from '../components/sidebar.js';
import { renderNavbar } from '../components/navbar.js';
import { currencyOptions } from '../services/currencyService.js';
import { TEMPLATES } from '../templates/index.js';
import { toast } from '../components/toast.js';

const app = document.getElementById('app');
const COLORS = ['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316','#1e293b'];

export function renderProfile() {
  const profile = profileService.get();

  app.innerHTML = `
    <div class="app-layout">
      ${renderSidebar('/profile')}
      <div class="page-content">
        ${renderNavbar({ title: 'Profile', breadcrumb: [{ label: 'Profile', path: '/profile' }] })}
        <div class="content-area page-transition">
          <div class="page-header">
            <div class="page-header-left">
              <h1 class="page-header-title">Business Profile</h1>
              <p class="page-header-sub">Your information will appear on all invoices</p>
            </div>
            <div class="page-header-actions">
              <button class="btn btn-primary" id="save-profile-btn">💾 Save Profile</button>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:24px; align-items:start;">
            <!-- Left Column -->
            <div style="display:flex; flex-direction:column; gap:20px;">

              <!-- Logo Upload -->
              <div class="card">
                <div class="card-header"><span class="card-title">🖼️ Company Logo</span></div>
                <div style="display:flex; gap:20px; align-items:flex-start; flex-wrap:wrap;">
                  <div id="logo-preview-wrap" style="
                    width:120px; height:80px; background:var(--bg-elevated);
                    border:2px dashed var(--border); border-radius:var(--radius-md);
                    display:flex; align-items:center; justify-content:center;
                    overflow:hidden; flex-shrink:0; position:relative; cursor:pointer;
                    transition:border-color 0.2s;
                  " id="logo-drop-zone">
                    ${profile.logo
                      ? `<img id="logo-img" src="${profile.logo}" alt="Logo" style="max-width:100%; max-height:100%; object-fit:contain;">`
                      : `<span style="font-size:1.5rem; opacity:0.3;" id="logo-placeholder">🏢</span>`
                    }
                  </div>
                  <div style="flex:1;">
                    <p style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:12px; line-height:1.6;">
                      Upload your company logo. Supports JPG, PNG. Max 2MB.
                    </p>
                    <div style="display:flex; gap:8px;">
                      <label for="logo-input" class="btn btn-secondary btn-sm" style="cursor:pointer;">
                        📁 Choose File
                      </label>
                      <input type="file" id="logo-input" accept="image/jpeg,image/png,image/gif,image/svg+xml" style="display:none;">
                      ${profile.logo ? `<button class="btn btn-ghost btn-sm" id="remove-logo-btn" style="color:var(--danger);">✕ Remove</button>` : ''}
                    </div>
                    <div class="form-hint" id="logo-hint" style="margin-top:8px;">Drag & drop or click to upload</div>
                  </div>
                </div>
              </div>

              <!-- Business Info -->
              <div class="card">
                <div class="card-header"><span class="card-title">🏢 Business Information</span></div>
                <div class="form-group">
                  <label class="form-label">Business Name *</label>
                  <input type="text" class="form-control" id="p-name" value="${profile.businessName || ''}" placeholder="Your Company Name">
                </div>
                <div class="form-group">
                  <label class="form-label">Business Email</label>
                  <input type="email" class="form-control" id="p-email" value="${profile.businessEmail || ''}" placeholder="hello@yourcompany.com">
                </div>
                <div class="form-group">
                  <label class="form-label">Phone Number</label>
                  <input type="tel" class="form-control" id="p-phone" value="${profile.businessPhone || ''}" placeholder="+1 (555) 000-0000">
                </div>
                <div class="form-group">
                  <label class="form-label">Website</label>
                  <input type="url" class="form-control" id="p-website" value="${profile.businessWebsite || ''}" placeholder="https://yourcompany.com">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label">Business Address</label>
                  <textarea class="form-control" id="p-address" rows="3" placeholder="123 Main St, City, Country">${profile.businessAddress || ''}</textarea>
                </div>
              </div>

              <!-- Tax -->
              <div class="card">
                <div class="card-header"><span class="card-title">🧾 Tax & Legal</span></div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label">Tax ID / VAT Number</label>
                  <input type="text" class="form-control" id="p-tax-id" value="${profile.taxId || ''}" placeholder="e.g. VAT123456789">
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div style="display:flex; flex-direction:column; gap:20px;">

              <!-- Default Settings -->
              <div class="card">
                <div class="card-header"><span class="card-title">⚙️ Default Settings</span></div>
                <div class="form-group">
                  <label class="form-label">Default Currency</label>
                  <select class="form-control" id="p-currency">
                    ${currencyOptions().replace(`value="${profile.defaultCurrency}"`, `value="${profile.defaultCurrency}" selected`)}
                  </select>
                </div>
                <div class="form-group" style="margin-bottom:0;">
                  <label class="form-label">Default Template</label>
                  <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px;" id="profile-template-selector">
                    ${TEMPLATES.map(t => `
                      <div class="profile-template-thumb" data-template="${t.id}" style="
                        border:2px solid ${profile.defaultTemplate === t.id ? 'var(--primary)' : 'var(--border)'};
                        border-radius:var(--radius-md); padding:12px 8px; text-align:center;
                        cursor:pointer; transition:all 0.2s; background:var(--bg-elevated);
                      ">
                        <div style="font-size:1.5rem;">${t.preview}</div>
                        <div style="font-size:0.72rem; font-weight:600; margin-top:4px;">${t.name}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- Accent Color -->
              <div class="card">
                <div class="card-header"><span class="card-title">🎨 Brand Color</span></div>
                <p style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:12px;">
                  This color will be used as the default accent in all your invoice templates.
                </p>
                <div class="color-picker-row" id="profile-color-picker">
                  ${COLORS.map(c => `
                    <div class="color-swatch${profile.accentColor === c ? ' active' : ''}" style="background:${c};" data-color="${c}" title="${c}"></div>
                  `).join('')}
                  <input type="color" id="profile-custom-color" value="${profile.accentColor || '#6366f1'}"
                    style="width:28px; height:28px; border-radius:50%; border:3px solid transparent; cursor:pointer; padding:0;" title="Custom">
                </div>
                <div style="margin-top:16px; padding:12px 16px; border-radius:var(--radius-md); background:var(--primary-alpha); border:1px solid rgba(99,102,241,0.2);">
                  <span style="font-size:0.8rem; color:var(--text-secondary);">Current color:</span>
                  <span id="color-preview-swatch" style="
                    display:inline-block; width:18px; height:18px;
                    background:${profile.accentColor || '#6366f1'};
                    border-radius:50%; vertical-align:middle; margin:0 6px;
                  "></span>
                  <code id="color-code-display" style="font-size:0.8rem; color:var(--primary-light);">${profile.accentColor || '#6366f1'}</code>
                </div>
              </div>

              <!-- Danger Zone -->
              <div class="card" style="border-color:var(--danger-alpha);">
                <div class="card-header">
                  <span class="card-title" style="color:var(--danger);">⚠️ Data Management</span>
                </div>
                <p style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:16px; line-height:1.6;">
                  All your data is stored locally in your browser. Clearing it will permanently remove all invoices and settings.
                </p>
                <button class="btn btn-danger btn-sm" id="clear-data-btn">🗑️ Clear All Data</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  initSidebar();
  initProfileEvents(profile);
}

function initProfileEvents(profile) {
  let selectedTemplate = profile.defaultTemplate || 'modern';
  let selectedColor = profile.accentColor || '#6366f1';
  let logoData = profile.logo || null;

  // Logo upload
  const logoInput = document.getElementById('logo-input');
  const dropZone = document.getElementById('logo-drop-zone');

  logoInput?.addEventListener('change', (e) => handleLogoFile(e.target.files[0]));

  dropZone?.addEventListener('click', () => logoInput?.click());
  dropZone?.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--primary)'; });
  dropZone?.addEventListener('dragleave', () => { dropZone.style.borderColor = 'var(--border)'; });
  dropZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--border)';
    handleLogoFile(e.dataTransfer.files[0]);
  });

  document.getElementById('remove-logo-btn')?.addEventListener('click', () => {
    logoData = null;
    const wrap = document.getElementById('logo-drop-zone');
    if (wrap) wrap.innerHTML = `<span style="font-size:1.5rem; opacity:0.3;">🏢</span>`;
    document.getElementById('logo-hint').textContent = 'Drag & drop or click to upload';
  });

  function handleLogoFile(file) {
    if (!file) return;
    if (!['image/jpeg','image/png','image/gif','image/svg+xml'].includes(file.type)) {
      toast.error('Invalid file type', 'Please upload a JPG, PNG, GIF or SVG image');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File too large', 'Logo must be under 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      logoData = e.target.result;
      const wrap = document.getElementById('logo-drop-zone');
      if (wrap) wrap.innerHTML = `<img src="${logoData}" alt="Logo" style="max-width:100%; max-height:100%; object-fit:contain;">`;
      document.getElementById('logo-hint').textContent = `✅ ${file.name} uploaded`;
      toast.success('Logo uploaded!');
    };
    reader.readAsDataURL(file);
  }

  // Template selector
  document.getElementById('profile-template-selector')?.addEventListener('click', (e) => {
    const thumb = e.target.closest('.profile-template-thumb');
    if (!thumb) return;
    selectedTemplate = thumb.dataset.template;
    document.querySelectorAll('.profile-template-thumb').forEach(t => {
      t.style.borderColor = t.dataset.template === selectedTemplate ? 'var(--primary)' : 'var(--border)';
    });
  });

  // Color picker
  document.getElementById('profile-color-picker')?.addEventListener('click', (e) => {
    const swatch = e.target.closest('.color-swatch');
    if (!swatch) return;
    selectedColor = swatch.dataset.color;
    document.querySelectorAll('#profile-color-picker .color-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.color === selectedColor);
    });
    document.getElementById('profile-custom-color').value = selectedColor;
    document.getElementById('color-preview-swatch').style.background = selectedColor;
    document.getElementById('color-code-display').textContent = selectedColor;
  });

  document.getElementById('profile-custom-color')?.addEventListener('input', (e) => {
    selectedColor = e.target.value;
    document.querySelectorAll('#profile-color-picker .color-swatch').forEach(s => s.classList.remove('active'));
    document.getElementById('color-preview-swatch').style.background = selectedColor;
    document.getElementById('color-code-display').textContent = selectedColor;
  });

  // Save
  document.getElementById('save-profile-btn')?.addEventListener('click', () => {
    const name = document.getElementById('p-name')?.value?.trim();
    if (!name) {
      toast.error('Business name is required');
      return;
    }
    profileService.save({
      businessName: name,
      businessEmail: document.getElementById('p-email')?.value || '',
      businessPhone: document.getElementById('p-phone')?.value || '',
      businessWebsite: document.getElementById('p-website')?.value || '',
      businessAddress: document.getElementById('p-address')?.value || '',
      taxId: document.getElementById('p-tax-id')?.value || '',
      defaultCurrency: document.getElementById('p-currency')?.value || 'USD',
      defaultTemplate: selectedTemplate,
      accentColor: selectedColor,
      logo: logoData,
    });
    toast.success('Profile saved!', 'Your business info has been updated');
  });

  // Clear data
  document.getElementById('clear-data-btn')?.addEventListener('click', async () => {
    const { confirmModal } = await import('../components/modal.js');
    const confirmed = await confirmModal({
      title: '⚠️ Clear All Data',
      message: 'This will permanently delete ALL your invoices, settings, and profile data. This cannot be undone!',
      confirmText: 'Clear Everything',
      dangerous: true,
    });
    if (confirmed) {
      const { storage } = await import('../services/storageService.js');
      storage.clear();
      toast.success('All data cleared');
      window.location.hash = '#/';
      setTimeout(() => window.location.reload(), 1000);
    }
  });
}
