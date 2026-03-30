import { formatAmount, formatDate } from '../utils/formatters.js';

export function renderModern(data) {
  const c = data.accentColor || '#6366f1';
  return `
    <div style="font-family:'Inter',sans-serif; background:#fff; color:#333; padding:40px; height:100%; box-sizing:border-box; word-break:break-word; line-height:1.5;">
      <!-- Header -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:50px;">
        <div>
          ${data.logo ? `<img src="${data.logo}" style="max-height:60px; margin-bottom:16px;">` : `<div style="width:48px; height:48px; background:${c}; border-radius:8px; margin-bottom:16px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:1.5rem; font-weight:bold;">${(data.senderName || 'B').charAt(0)}</div>`}
          <h2 style="margin:0; font-size:1.2rem; color:#111;">${data.senderName || 'Nama Usaha Anda'}</h2>
          <p style="margin:4px 0 0; font-size:0.85rem; color:#666; white-space:pre-wrap;">${data.senderAddress || ''}</p>
          <p style="margin:4px 0 0; font-size:0.85rem; color:#666;">${data.senderEmail || ''}</p>
        </div>
        <div style="text-align:right;">
          <h1 style="margin:0; font-size:2.5rem; color:${c}; letter-spacing:-1px;">INVOICE</h1>
          <p style="margin:8px 0 0; font-size:1rem; color:#111; font-weight:600;">#${data.number}</p>
          <div style="display:flex; gap:20px; justify-content:flex-end; margin-top:16px;">
            <div style="text-align:right;">
              <div style="font-size:0.75rem; color:#888; text-transform:uppercase; font-weight:700;">Tanggal</div>
              <div style="font-size:0.9rem; font-weight:500;">${formatDate(data.invoiceDate)}</div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:0.75rem; color:#888; text-transform:uppercase; font-weight:700;">Jatuh Tempo</div>
              <div style="font-size:0.9rem; font-weight:500;">${formatDate(data.dueDate)}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bill To -->
      <div style="margin-bottom:40px; padding:20px; background:#f8fafc; border-radius:8px; border-left:4px solid ${c};">
        <div style="font-size:0.75rem; color:#64748b; text-transform:uppercase; font-weight:700; margin-bottom:8px;">Ditagihkan Kepada:</div>
        <h3 style="margin:0; font-size:1.1rem; color:#0f172a;">${data.clientName || 'Nama Klien'}</h3>
        ${data.clientEmail ? `<p style="margin:4px 0 0; font-size:0.85rem; color:#475569;">${data.clientEmail}</p>` : ''}
        ${data.clientAddress ? `<p style="margin:4px 0 0; font-size:0.85rem; color:#475569; white-space:pre-wrap;">${data.clientAddress}</p>` : ''}
      </div>

      <!-- Items Table -->
      <table style="width:100%; border-collapse:collapse; margin-bottom:30px;">
        <thead>
          <tr>
            <th style="text-align:left; padding:12px; border-bottom:2px solid #e2e8f0; font-size:0.8rem; color:#64748b; text-transform:uppercase;">Deskripsi</th>
            <th style="text-align:center; padding:12px; border-bottom:2px solid #e2e8f0; font-size:0.8rem; color:#64748b; text-transform:uppercase; width:80px;">Qty</th>
            <th style="text-align:right; padding:12px; border-bottom:2px solid #e2e8f0; font-size:0.8rem; color:#64748b; text-transform:uppercase; width:120px;">Harga</th>
            <th style="text-align:right; padding:12px; border-bottom:2px solid #e2e8f0; font-size:0.8rem; color:#64748b; text-transform:uppercase; width:140px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr>
              <td style="padding:16px 12px; border-bottom:1px solid #f1f5f9;">
                <div style="font-weight:600; color:#0f172a; font-size:0.95rem;">${item.name || 'Item'}</div>
                ${item.description ? `<div style="font-size:0.8rem; color:#64748b; margin-top:4px;">${item.description}</div>` : ''}
              </td>
              <td style="text-align:center; padding:16px 12px; border-bottom:1px solid #f1f5f9; color:#475569;">${item.qty}</td>
              <td style="text-align:right; padding:16px 12px; border-bottom:1px solid #f1f5f9; color:#475569;">${formatAmount(item.price, data.currency)}</td>
              <td style="text-align:right; padding:16px 12px; border-bottom:1px solid #f1f5f9; font-weight:600; color:#0f172a;">${formatAmount((item.qty||0)*(item.price||0), data.currency)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="display:flex; justify-content:flex-end; margin-bottom:50px;">
        <div style="width:320px;">
          <div style="display:flex; justify-content:space-between; padding:8px 0; color:#475569; font-size:0.9rem;">
            <span>Subtotal</span>
            <span style="font-weight:600;">${formatAmount(data.subtotal, data.currency)}</span>
          </div>
          ${data.discountValue > 0 ? `
            <div style="display:flex; justify-content:space-between; padding:8px 0; color:#ef4444; font-size:0.9rem;">
              <span>Diskon ${data.discountType === 'percent' ? `(${data.discountValue}%)` : ''}</span>
              <span>-${formatAmount(data.discountAmount, data.currency)}</span>
            </div>
          ` : ''}
          ${data.taxRate > 0 ? `
            <div style="display:flex; justify-content:space-between; padding:8px 0; color:#475569; font-size:0.9rem;">
              <span>Pajak (${data.taxRate}%)</span>
              <span>+${formatAmount(data.taxAmount, data.currency)}</span>
            </div>
          ` : ''}
          <div style="display:flex; justify-content:space-between; padding:16px 0 0; margin-top:8px; border-top:2px solid #e2e8f0; font-size:1.2rem; font-weight:800; color:${c};">
            <span>Total Akhir</span>
            <span>${formatAmount(data.grandTotal, data.currency)}</span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      ${data.notes ? `
        <div style="margin-top:auto;">
          <div style="font-size:0.8rem; font-weight:700; color:#64748b; text-transform:uppercase; margin-bottom:8px;">Catatan Tambahan</div>
          <p style="font-size:0.85rem; color:#475569; line-height:1.6; white-space:pre-wrap; margin:0;">${data.notes}</p>
        </div>
      ` : ''}
    </div>
  `;
}
