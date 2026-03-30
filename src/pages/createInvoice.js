// ── Halaman Utama: Buat Invoice ─────────────────────────
import { profileService } from '../services/profileService.js';
import { renderTemplate, TEMPLATES } from '../templates/index.js';
import { formatAmount, calcInvoiceTotals, debounce } from '../utils/formatters.js';
import { currencyOptions } from '../services/currencyService.js';
import { toast } from '../components/toast.js';

const app = document.getElementById('app');

const COLORS = ['#6366f1','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316','#1e293b'];

let invoiceData = null;

function freshInvoice(profile) {
  return {
    number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    invoiceDate: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    
    // Sender info (Profile inline)
    senderName: profile.businessName || '',
    senderEmail: profile.businessEmail || '',
    senderAddress: profile.businessAddress || '',

    clientName: '', clientEmail: '', clientAddress: '',
    currency: profile.defaultCurrency || 'IDR',
    taxRate: 0, discountType: 'percent', discountValue: 0,
    notes: 'Terima kasih atas kerjasamanya. Pembayaran dapat ditransfer ke rekening BCA 1234567890 a.n Perusahaan,',
    items: [{ name: '', description: '', qty: 1, price: 0 }],
    template: 'modern',
    accentColor: '#6366f1',
    status: 'draft',
  };
}

export function renderCreateInvoice() {
  const profile = profileService.get();

  // Load draft from localStorage if any, else fresh
  const draftStr = localStorage.getItem('invoiceflow_draft');
  const draft = draftStr ? JSON.parse(draftStr) : null;
  
  invoiceData = draft ? { ...freshInvoice(profile), ...draft } : freshInvoice(profile);

  app.innerHTML = buildLayout();
  initEvents();
  debouncedUpdate();
}

function buildLayout() {
  return `
    <!-- Top Header Navbar -->
    <header style="
      background: rgba(22, 22, 42, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border);
      padding: 12px 32px;
      position: sticky; top: 0; z-index: 100;
      display: flex; justify-content: space-between; align-items: center;
    ">
      <div style="display:flex; align-items:center; gap:10px;">
        <div style="width:36px; height:36px; background:var(--primary); border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; box-shadow:0 4px 12px rgba(99,102,241,0.4);">⚡</div>
        <span style="font-family:var(--font-display); font-size:1.2rem; font-weight:800; color:#fff;">Invoice Generator</span>
      </div>
      <div style="display:flex; gap:12px; align-items:center;">
        <button class="btn btn-secondary btn-sm" id="reset-btn" title="Hapus semua isian form">🔄 Reset Baru</button>
        <button class="btn btn-primary btn-sm" id="download-pdf-btn">📥 Download PDF</button>
      </div>
    </header>

    <div style="max-width: var(--content-max); margin: 0 auto; padding: 24px;">

      <!-- ── Template Picker strip ───────────────── -->
      <div class="card" style="margin-bottom:24px; padding:20px 24px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; flex-wrap:wrap; gap:12px;">
          <div>
            <div style="font-family:var(--font-display); font-size:1.1rem; font-weight:700; color:var(--text-primary);">🎨 Pilih Desain Template</div>
            <div style="font-size:0.82rem; color:var(--text-muted); margin-top:2px;">Klik template untuk mengubah tampilan invoice. Update secara realtime tanpa loading.</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:0.75rem; color:var(--text-muted);">Warna Aksen:</span>
            <div class="color-picker-row" id="color-picker" style="margin:0;">
              ${COLORS.map(c => `
                <div class="color-swatch${invoiceData.accentColor === c ? ' active' : ''}"
                  style="background:${c}; width:24px; height:24px;" data-color="${c}" title="${c}"></div>
              `).join('')}
              <input type="color" id="custom-color" value="${invoiceData.accentColor}"
                style="width:24px; height:24px; border-radius:50%; border:2px solid transparent; cursor:pointer; padding:0; background:none; transform:translateY(2px)">
            </div>
          </div>
        </div>
        <div style="display:flex; gap:10px; overflow-x:auto; padding-bottom:8px;" id="template-strip">
          ${TEMPLATES.map(t => `
            <div class="template-strip-card${invoiceData.template === t.id ? ' selected' : ''}"
              data-template="${t.id}"
              style="
                flex-shrink:0; width:140px;
                border:2px solid ${invoiceData.template === t.id ? 'var(--primary)' : 'var(--border)'};
                border-radius:var(--radius-md); overflow:hidden; cursor:pointer;
                transition:all 0.2s; background:var(--bg-elevated);
                ${invoiceData.template === t.id ? 'box-shadow: 0 0 0 3px var(--primary-alpha);' : ''}
              ">
              <div style="height:90px; overflow:hidden; background:#f8fafc; position:relative; pointer-events:none;">
                <!-- Thumbnail A4 scale (140px / 794px ~ 0.176) -->
                <div style="transform:scale(0.176); transform-origin:top left; width:794px; position:absolute; top:0; left:0;">
                  ${renderTemplate(t.id, SAMPLE_PREVIEW, { businessName: 'Perusahaan Saya', accentColor: getDefaultColor(t.id), logo: null })}
                </div>
              </div>
              <div style="padding:10px; border-top:1px solid var(--border);">
                <div style="font-size:0.75rem; font-weight:700; color:var(--text-primary); text-align:center;">${t.preview} ${t.name}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ── Main Layout (Form & Preview) ──────────────── -->
      <div style="display:grid; grid-template-columns:1fr 1.1fr; gap:32px; align-items:start;">

        <!-- LEFT: Form -->
        <div style="display:flex; flex-direction:column; gap:16px;">

          <!-- Sender Info -->
          <div class="card" style="padding:24px; border-top:4px solid var(--primary);">
            <div style="font-size:0.85rem; font-weight:800; color:var(--text-primary); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
              <span>🏢</span> Info Pengirim (Anda)
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label class="form-label">Nama Perusahaan / Freelancer</label>
              <input type="text" class="form-control" id="f-sender-name" value="${invoiceData.senderName}" placeholder="Misal: PT Karya Mandiri">
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label class="form-label">Email Pengirim</label>
              <input type="email" class="form-control" id="f-sender-email" value="${invoiceData.senderEmail}" placeholder="info@perusahaan.com">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">Alamat Pengirim</label>
              <textarea class="form-control" id="f-sender-address" rows="2" placeholder="Jl. Sudirman No 123...">${invoiceData.senderAddress}</textarea>
            </div>
          </div>

          <!-- Invoice Info -->
          <div class="card" style="padding:24px;">
            <div style="font-size:0.85rem; font-weight:800; color:var(--text-primary); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
              <span>📄</span> Detail Tagihan
            </div>
            <div class="grid-2">
              <div class="form-group" style="margin-bottom:12px;">
                <label class="form-label">Nomor Invoice</label>
                <input type="text" class="form-control" id="f-number" value="${invoiceData.number}" placeholder="INV-2026-0001">
              </div>
              <div class="form-group" style="margin-bottom:12px;">
                <label class="form-label">Mata Uang</label>
                <select class="form-control" id="f-currency">
                  ${currencyOptions().replace(`value="${invoiceData.currency}"`, `value="${invoiceData.currency}" selected`)}
                </select>
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label">Tanggal Terbit</label>
                <input type="date" class="form-control" id="f-date" value="${invoiceData.invoiceDate}">
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label">Jatuh Tempo</label>
                <input type="date" class="form-control" id="f-due" value="${invoiceData.dueDate}">
              </div>
            </div>
          </div>

          <!-- Client Info -->
          <div class="card" style="padding:24px;">
            <div style="font-size:0.85rem; font-weight:800; color:var(--text-primary); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
              <span>👤</span> Kepada (Klien)
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label class="form-label">Nama Klien / Perusahaan</label>
              <input type="text" class="form-control" id="f-client-name" value="${invoiceData.clientName}" placeholder="Misal: PT Pelanggan Setia">
            </div>
            <div class="form-group" style="margin-bottom:12px;">
              <label class="form-label">Email Klien</label>
              <input type="email" class="form-control" id="f-client-email" value="${invoiceData.clientEmail}" placeholder="klien@example.com">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">Alamat Klien</label>
              <textarea class="form-control" id="f-client-address" rows="2" placeholder="Jl. Pelanggan No 45...">${invoiceData.clientAddress}</textarea>
            </div>
          </div>

          <!-- Line Items -->
          <div class="card" style="padding:24px;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
              <div style="font-size:0.85rem; font-weight:800; color:var(--text-primary); text-transform:uppercase; letter-spacing:0.06em; display:flex; align-items:center; gap:8px;">
                <span>📦</span> Daftar Item / Jasa
              </div>
              <button class="btn btn-secondary btn-sm" id="add-item-btn">+ Tambah Item</button>
            </div>
            <div id="items-container">
              ${renderItemRows()}
            </div>
          </div>

          <!-- Calculations -->
          <div class="card" style="padding:24px;">
             <div style="font-size:0.85rem; font-weight:800; color:var(--text-primary); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
              <span>🧮</span> Diskon & Pajak
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:16px;">
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label">Pajak (%)</label>
                <input type="number" class="form-control" id="f-tax" value="${invoiceData.taxRate}" min="0" max="100" step="0.1" placeholder="0">
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label">Tipe Diskon</label>
                <select class="form-control" id="f-discount-type">
                  <option value="percent" ${invoiceData.discountType === 'percent' ? 'selected' : ''}>Persentase (%)</option>
                  <option value="fixed" ${invoiceData.discountType === 'fixed' ? 'selected' : ''}>Nominal Fix</option>
                </select>
              </div>
              <div class="form-group" style="margin-bottom:0;">
                <label class="form-label">Diskon</label>
                <input type="number" class="form-control" id="f-discount" value="${invoiceData.discountValue}" min="0" step="0.01" placeholder="0">
              </div>
            </div>
            <div id="totals-panel" style="background:var(--bg-elevated); border-radius:var(--radius-md); padding:16px;"><!-- totals --></div>
          </div>

          <!-- Notes -->
          <div class="card" style="padding:24px;">
            <div style="font-size:0.85rem; font-weight:800; color:var(--text-primary); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
              <span>📝</span> Catatan Tambahan
            </div>
            <textarea class="form-control" id="f-notes" rows="3" placeholder="Informasi pembayaran, nomor rekening, atau ucapan terima kasih...">${invoiceData.notes}</textarea>
          </div>

        </div>

        <!-- RIGHT: Live Preview (Sticky) -->
        <div style="position:sticky; top:calc(40px + 70px);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding:0 10px;">
            <span style="font-size:0.85rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.1em; display:flex; align-items:center; gap:6px;">
              <span>👁️</span> Live Preview
            </span>
            <div style="display:flex; gap:8px; align-items:center;">
              <span style="animation: pulse 2s infinite; font-size:0.68rem; background:var(--success-alpha); color:var(--success); padding:3px 10px; border-radius:var(--radius-full); font-weight:800; border:1px solid var(--success-alpha);">● UPDATE OTOMATIS</span>
            </div>
          </div>
          <div id="preview-outer" style="
            border-radius:var(--radius-lg); overflow-y:auto; overflow-x:hidden;
            box-shadow:var(--shadow-lg); border:1px solid var(--border);
            background:#f8fafc; max-height:calc(100vh - 160px);
            padding:32px 0; display:flex; justify-content:center;
          ">
            <!-- Container dinamis: Lebar pas A4, tinggi auto-fit konten -->
            <div id="preview-scale-wrapper" style="width:794px; transform:scale(0.6); transform-origin:top center; margin-bottom:0;">
              <div id="printable-invoice" style="
                width:794px; background:#fff; 
                box-shadow:0 10px 30px rgba(0,0,0,0.1); position:relative; overflow:hidden;
              "></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

const SAMPLE_PREVIEW = {
  number: 'INV-2026-1001',
  invoiceDate: new Date().toISOString().slice(0,10),
  dueDate: new Date(Date.now()+14*86400000).toISOString().slice(0,10),
  clientName: 'PT Contoh Klien',
  clientEmail: 'klien@contoh.com',
  clientAddress: 'Jl. Contoh 1, Jakarta',
  currency: 'IDR',
  taxRate: 11, discountType: 'percent', discountValue: 0,
  notes: 'Terima Kasih!',
  items: [
    { name: 'Pembuatan Website', description: 'Company Profile', qty: 1, price: 3500000 },
    { name: 'Maintenance SEO', description: 'Bulanan', qty: 1, price: 500000 },
  ]
};

function getDefaultColor(id) {
  return { modern:'#6366f1', minimalist:'#10b981', corporate:'#1e293b', dark:'#818cf8', creative:'#f59e0b' }[id] || '#6366f1';
}

function renderItemRows() {
  return invoiceData.items.map((item, i) => `
    <div class="item-row" data-index="${i}" style="
      background:var(--bg-elevated); border-radius:var(--radius-md);
      padding:16px; margin-bottom:12px; border:1px solid var(--border);
    ">
      <div style="display:grid; grid-template-columns:1fr auto; gap:12px; margin-bottom:12px;">
        <input type="text" class="form-control item-field" data-index="${i}" data-field="name"
          value="${item.name || ''}" placeholder="Nama Produk / Jasa *" style="font-weight:600; font-size:0.95rem;">
        <button class="btn btn-ghost btn-sm btn-icon remove-item" data-index="${i}"
          style="color:var(--danger); width:36px; height:36px; font-size:1rem; background:var(--danger-alpha);" title="Hapus">✕</button>
      </div>
      <input type="text" class="form-control item-field" data-index="${i}" data-field="description"
        value="${item.description || ''}" placeholder="Deskripsi atau keterangan (Opsional)"
        style="font-size:0.85rem; margin-bottom:12px;">
      <div style="display:grid; grid-template-columns:80px 1fr 1.2fr; gap:12px; align-items:center;">
        <div>
          <div style="font-size:0.7rem; color:var(--text-muted); font-weight:700; margin-bottom:4px; text-transform:uppercase;">Jumlah</div>
          <input type="number" class="form-control item-field" data-index="${i}" data-field="qty"
            value="${item.qty || 1}" min="0" step="1" style="text-align:center;">
        </div>
        <div>
          <div style="font-size:0.7rem; color:var(--text-muted); font-weight:700; margin-bottom:4px; text-transform:uppercase;">Harga Satuan</div>
          <div style="position:relative;">
            <span style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--text-muted); font-size:0.8rem;">Rp</span>
            <input type="number" class="form-control item-field" data-index="${i}" data-field="price"
              value="${item.price || 0}" min="0" step="0.01" style="padding-left:32px;">
          </div>
        </div>
        <div>
          <div style="font-size:0.7rem; color:var(--text-muted); font-weight:700; margin-bottom:4px; text-transform:uppercase;">Total Harga</div>
          <div style="
            padding:10px 14px; background:var(--bg-card); border-radius:var(--radius-md);
            font-weight:800; color:var(--text-primary); font-size:0.95rem; text-align:right; border:1px solid transparent;
          " class="item-total">
            ${formatAmount((item.qty||0)*(item.price||0), invoiceData.currency)}
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function updateTotals() {
  const { subtotal, taxAmount, discountAmount, grandTotal } = calcInvoiceTotals(invoiceData);
  const c = invoiceData.currency;
  const panel = document.getElementById('totals-panel');
  if (!panel) return;
  panel.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:8px;">
      <div style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--text-secondary); padding-bottom:6px; border-bottom:1px solid var(--border);">
        <span>Subtotal (Sebelumm Pajak/Diskon)</span><span style="font-weight:600;">${formatAmount(subtotal,c)}</span>
      </div>
      ${invoiceData.discountValue>0?`<div style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--text-secondary); padding-bottom:6px; border-bottom:1px solid var(--border);">
        <span>Potongan / Diskon${invoiceData.discountType==='percent'?` (${invoiceData.discountValue}%)`:''}
        </span><span style="color:var(--danger); font-weight:600;">-${formatAmount(discountAmount,c)}</span>
      </div>`:''}
      ${invoiceData.taxRate>0?`<div style="display:flex; justify-content:space-between; font-size:0.85rem; color:var(--text-secondary); padding-bottom:6px; border-bottom:1px solid var(--border);">
        <span>Pajak PPN (${invoiceData.taxRate}%)</span><span style="font-weight:600;">+${formatAmount(taxAmount,c)}</span>
      </div>`:''}
      <div style="height:2px; background:var(--primary-alpha); margin:4px 0;"></div>
      <div style="display:flex; justify-content:space-between; font-size:1.1rem; font-weight:900; color:var(--text-primary); padding-top:4px;">
        <span>Total Akhir</span>
        <span style="color:${invoiceData.accentColor||'var(--primary)'};">${formatAmount(grandTotal,c)}</span>
      </div>
    </div>
  `;
  document.querySelectorAll('.item-total').forEach((el, i) => {
    const item = invoiceData.items[i];
    if (item) el.textContent = formatAmount((item.qty||0)*(item.price||0), c);
  });
}

const debouncedUpdate = debounce(() => {
  const profile = { businessName: invoiceData.senderName, businessEmail: invoiceData.senderEmail, businessAddress: invoiceData.senderAddress, logo: null };
  const preview = document.getElementById('printable-invoice');
  if (preview) {
    const totals = calcInvoiceTotals(invoiceData);
    preview.innerHTML = renderTemplate(invoiceData.template, { ...invoiceData, ...totals }, profile);
    
    // Perbarui margin-bottom dari parent scale wrapper agar jarak scroll pas
    const h = preview.offsetHeight;
    const wrapper = document.getElementById('preview-scale-wrapper');
    if (wrapper) wrapper.style.marginBottom = `calc(-${h}px * 0.4)`;
  }
  updateTotals();
  
  // Auto-save silently to localStorage so user doesn't lose work on refresh
  localStorage.setItem('invoiceflow_draft', JSON.stringify(invoiceData));
}, 120);

function collectForm() {
  invoiceData.senderName       = document.getElementById('f-sender-name')?.value  ?? '';
  invoiceData.senderEmail      = document.getElementById('f-sender-email')?.value ?? '';
  invoiceData.senderAddress    = document.getElementById('f-sender-address')?.value ?? '';

  invoiceData.number           = document.getElementById('f-number')?.value       ?? invoiceData.number;
  invoiceData.currency         = document.getElementById('f-currency')?.value     ?? invoiceData.currency;
  invoiceData.invoiceDate      = document.getElementById('f-date')?.value         ?? invoiceData.invoiceDate;
  invoiceData.dueDate          = document.getElementById('f-due')?.value          ?? invoiceData.dueDate;
  invoiceData.clientName       = document.getElementById('f-client-name')?.value  ?? '';
  invoiceData.clientEmail      = document.getElementById('f-client-email')?.value ?? '';
  invoiceData.clientAddress    = document.getElementById('f-client-address')?.value ?? '';
  invoiceData.taxRate          = parseFloat(document.getElementById('f-tax')?.value)          || 0;
  invoiceData.discountType     = document.getElementById('f-discount-type')?.value            ?? 'percent';
  invoiceData.discountValue    = parseFloat(document.getElementById('f-discount')?.value)     || 0;
  invoiceData.notes            = document.getElementById('f-notes')?.value        ?? '';
}

function initEvents() {
  ['f-sender-name','f-sender-email','f-sender-address','f-number','f-currency','f-date','f-due',
   'f-client-name','f-client-email','f-client-address','f-tax','f-discount-type','f-discount','f-notes']
  .forEach(id => {
    document.getElementById(id)?.addEventListener('input', () => { collectForm(); debouncedUpdate(); });
    document.getElementById(id)?.addEventListener('change', () => { collectForm(); debouncedUpdate(); });
  });

  document.getElementById('items-container')?.addEventListener('input', (e) => {
    const el = e.target.closest('.item-field');
    if (!el) return;
    const idx = parseInt(el.dataset.index), field = el.dataset.field;
    if (isNaN(idx) || !field) return;
    invoiceData.items[idx][field] = (field==='qty'||field==='price') ? parseFloat(el.value)||0 : el.value;
    debouncedUpdate();
  });

  document.getElementById('items-container')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.remove-item');
    if (!btn) return;
    const idx = parseInt(btn.dataset.index);
    if (invoiceData.items.length > 1) invoiceData.items.splice(idx, 1);
    else invoiceData.items = [{ name:'', description:'', qty:1, price:0 }];
    document.getElementById('items-container').innerHTML = renderItemRows();
    debouncedUpdate();
  });

  document.getElementById('add-item-btn')?.addEventListener('click', () => {
    invoiceData.items.push({ name:'', description:'', qty:1, price:0 });
    document.getElementById('items-container').innerHTML = renderItemRows();
    debouncedUpdate();
    document.querySelectorAll('.item-row').at(-1)?.scrollIntoView({ behavior:'smooth', block:'nearest' });
  });

  document.getElementById('template-strip')?.addEventListener('click', (e) => {
    const card = e.target.closest('.template-strip-card');
    if (!card) return;
    invoiceData.template = card.dataset.template;
    document.querySelectorAll('.template-strip-card').forEach(c => {
      const sel = c.dataset.template === invoiceData.template;
      c.style.borderColor = sel ? 'var(--primary)' : 'var(--border)';
      c.style.boxShadow = sel ? '0 0 0 3px var(--primary-alpha)' : 'none';
      if(c.style.borderColor === 'var(--primary)'){
         c.style.background = 'var(--primary-alpha)';
      }else{
        c.style.background = 'var(--bg-elevated)';
      }
    });
    debouncedUpdate();
  });

  document.getElementById('color-picker')?.addEventListener('click', (e) => {
    const swatch = e.target.closest('.color-swatch');
    if (!swatch) return;
    invoiceData.accentColor = swatch.dataset.color;
    document.querySelectorAll('#color-picker .color-swatch').forEach(s =>
      s.classList.toggle('active', s.dataset.color === invoiceData.accentColor)
    );
    document.getElementById('custom-color').value = invoiceData.accentColor;
    debouncedUpdate();
  });

  document.getElementById('custom-color')?.addEventListener('input', (e) => {
    invoiceData.accentColor = e.target.value;
    document.querySelectorAll('#color-picker .color-swatch').forEach(s => s.classList.remove('active'));
    debouncedUpdate();
  });

  document.getElementById('reset-btn')?.addEventListener('click', () => {
    if(confirm("Apakah Anda yakin ingin menghapus seluruh isian dan memulai dari awal?")) {
      localStorage.removeItem('invoiceflow_draft');
      window.location.reload();
    }
  });

  document.getElementById('download-pdf-btn')?.addEventListener('click', async () => {
    collectForm();
    if (!invoiceData.clientName?.trim()) {
      toast.error('Nama Klien Harus Diisi', 'Mohon isi nama kepada siapa invoicenya ditujukan.');
      document.getElementById('f-client-name')?.focus();
      return;
    }
    
    // Process download
    const btn = document.getElementById('download-pdf-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Mere-render PDF...';
    btn.disabled = true;

    try {
      const { default: html2pdf } = await import('html2pdf.js');
      const el = document.getElementById('printable-invoice');
      
      // Mengukur tinggi presisi elemen konten dan membuat pdf pas dengan batas konten
      const contentHeight = Math.max(el.scrollHeight, el.offsetHeight);
      
      await html2pdf().set({
        margin: 0,
        filename: `${invoiceData.number}_${invoiceData.clientName}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { scale: 3, useCORS: true, logging: false },
        jsPDF: { unit: 'px', format: [794, contentHeight], orientation: 'portrait' }
      }).from(el).save();
      
      toast.success('PDF Berhasil Diunduh!', 'Silakan periksa folder Download Anda.');
    } catch (err) {
      toast.error('Gagal membuat PDF', err.message);
      console.error(err);
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  });
}
