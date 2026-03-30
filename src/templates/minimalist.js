import { formatAmount, formatDate } from '../utils/formatters.js';

export function renderMinimalist(data) {
  return `
    <div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; background:#fff; color:#222; padding:50px; height:100%; box-sizing:border-box; word-break:break-word; line-height:1.5;">
      <!-- Header -->
      <div style="border-bottom:2px solid #000; padding-bottom:30px; margin-bottom:40px; display:flex; justify-content:space-between; align-items:flex-end;">
        <div>
          ${data.logo ? `<img src="${data.logo}" style="max-height:50px; margin-bottom:20px;">` : `<h2 style="margin:0 0 10px; font-size:1.5rem; letter-spacing:1px; text-transform:uppercase;">${data.senderName || 'NAMA PERUSAHAAN'}</h2>`}
          <div style="font-size:0.8rem; line-height:1.5; color:#555; white-space:pre-wrap;">${data.senderAddress || ''}</div>
          <div style="font-size:0.8rem; line-height:1.5; color:#555;">${data.senderEmail || ''}</div>
        </div>
        <div style="text-align:right;">
          <h1 style="margin:0 0 10px; font-size:2rem; letter-spacing:4px; font-weight:300;">INVOICE</h1>
          <div style="font-size:1rem; font-weight:bold; margin-bottom:5px;">NO: ${data.number}</div>
          <div style="font-size:0.8rem; color:#555;">
            <div>Tanggal: ${formatDate(data.invoiceDate)}</div>
            <div>Jatuh Tempo: ${formatDate(data.dueDate)}</div>
          </div>
        </div>
      </div>

      <!-- Bill To -->
      <div style="margin-bottom:50px;">
        <div style="font-size:0.7rem; letter-spacing:2px; text-transform:uppercase; color:#888; margin-bottom:10px;">Ditagihkan Kepada</div>
        <div style="font-size:1.1rem; font-weight:bold; margin-bottom:5px;">${data.clientName || 'Nama Klien'}</div>
        ${data.clientEmail ? `<div style="font-size:0.85rem; color:#555; margin-bottom:2px;">${data.clientEmail}</div>` : ''}
        ${data.clientAddress ? `<div style="font-size:0.85rem; color:#555; white-space:pre-wrap;">${data.clientAddress}</div>` : ''}
      </div>

      <!-- Items -->
      <table style="width:100%; border-collapse:collapse; margin-bottom:40px;">
        <thead>
          <tr style="border-bottom:1px solid #000;">
            <th style="text-align:left; padding:10px 0; font-size:0.75rem; letter-spacing:1px; text-transform:uppercase;">Deskripsi</th>
            <th style="text-align:center; padding:10px 0; font-size:0.75rem; letter-spacing:1px; text-transform:uppercase; width:80px;">Qty</th>
            <th style="text-align:right; padding:10px 0; font-size:0.75rem; letter-spacing:1px; text-transform:uppercase; width:120px;">Harga</th>
            <th style="text-align:right; padding:10px 0; font-size:0.75rem; letter-spacing:1px; text-transform:uppercase; width:140px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${data.items.map(item => `
            <tr style="border-bottom:1px solid #eee;">
              <td style="padding:15px 0;">
                <div style="font-weight:bold; font-size:0.9rem;">${item.name || 'Item'}</div>
                ${item.description ? `<div style="font-size:0.8rem; color:#666; margin-top:4px;">${item.description}</div>` : ''}
              </td>
              <td style="text-align:center; padding:15px 0; font-size:0.9rem;">${item.qty}</td>
              <td style="text-align:right; padding:15px 0; font-size:0.9rem;">${formatAmount(item.price, data.currency)}</td>
              <td style="text-align:right; padding:15px 0; font-size:0.9rem; font-weight:bold;">${formatAmount((item.qty||0)*(item.price||0), data.currency)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Totals -->
      <div style="display:flex; justify-content:flex-end; margin-bottom:60px;">
        <div style="width:300px;">
          <div style="display:flex; justify-content:space-between; padding:5px 0; font-size:0.85rem;">
            <span>Subtotal</span>
            <span>${formatAmount(data.subtotal, data.currency)}</span>
          </div>
          ${data.discountValue > 0 ? `
            <div style="display:flex; justify-content:space-between; padding:5px 0; font-size:0.85rem;">
              <span>Diskon</span>
              <span>-${formatAmount(data.discountAmount, data.currency)}</span>
            </div>
          ` : ''}
          ${data.taxRate > 0 ? `
            <div style="display:flex; justify-content:space-between; padding:5px 0; font-size:0.85rem;">
              <span>Pajak (${data.taxRate}%)</span>
              <span>+${formatAmount(data.taxAmount, data.currency)}</span>
            </div>
          ` : ''}
          <div style="display:flex; justify-content:space-between; padding:15px 0 0; margin-top:10px; border-top:1px solid #000; font-size:1.2rem; font-weight:bold;">
            <span>Total Akhir</span>
            <span>${formatAmount(data.grandTotal, data.currency)}</span>
          </div>
        </div>
      </div>

      <!-- Notes -->
      ${data.notes ? `
        <div style="margin-top:auto; padding-top:20px; border-top:1px solid #eee;">
          <div style="font-size:0.7rem; letter-spacing:1px; text-transform:uppercase; color:#888; margin-bottom:8px;">Catatan</div>
          <p style="font-size:0.8rem; color:#444; line-height:1.5; margin:0; white-space:pre-wrap;">${data.notes}</p>
        </div>
      ` : ''}
    </div>
  `;
}
