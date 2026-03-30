import { formatAmount, formatDate } from '../utils/formatters.js';

export function renderCorporate(data) {
  const c = data.accentColor || '#1e293b';
  return `
    <div style="font-family:'Roboto',Arial,sans-serif; background:#fff; color:#333; height:100%; box-sizing:border-box; word-break:break-word; position:relative; line-height:1.5;">
      <!-- Top Bar -->
      <div style="height:12px; background:${c}; width:100%;"></div>

      <div style="padding:40px 50px;">
        <!-- Header -->
        <table style="width:100%; margin-bottom:40px;">
          <tr>
            <td style="vertical-align:top; width:50%;">
              ${data.logo ? `<img src="${data.logo}" style="max-height:70px;">` : `<h2 style="margin:0; font-size:1.8rem; color:${c};">${data.senderName || 'PERUSAHAAN'}</h2>`}
              <div style="margin-top:10px; font-size:0.85rem; color:#555; line-height:1.5; white-space:pre-wrap;">${data.senderAddress || ''}</div>
              <div style="font-size:0.85rem; color:#555;">${data.senderEmail || ''}</div>
            </td>
            <td style="vertical-align:top; text-align:right;">
              <h1 style="margin:0; font-size:2.5rem; color:#1e293b; text-transform:uppercase; letter-spacing:1px;">Faktur</h1>
              <table style="width:200px; margin-left:auto; margin-top:20px; border-collapse:collapse;">
                <tr>
                  <td style="padding:4px 0; font-size:0.8rem; font-weight:bold; color:#555;">No. Faktur</td>
                  <td style="padding:4px 0; font-size:0.85rem; text-align:right;">${data.number}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0; font-size:0.8rem; font-weight:bold; color:#555;">Tanggal</td>
                  <td style="padding:4px 0; font-size:0.85rem; text-align:right;">${formatDate(data.invoiceDate)}</td>
                </tr>
                <tr style="background:#f1f5f9;">
                  <td style="padding:6px; font-size:0.8rem; font-weight:bold; color:#1e293b;">Jatuh Tempo</td>
                  <td style="padding:6px; font-size:0.85rem; text-align:right; font-weight:bold; color:${c};">${formatDate(data.dueDate)}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Bill To -->
        <div style="margin-bottom:40px; border-top:2px solid #e2e8f0; border-bottom:2px solid #e2e8f0; padding:20px 0;">
          <table style="width:100%;">
            <tr>
              <td style="width:50%; vertical-align:top;">
                <div style="font-size:0.75rem; text-transform:uppercase; color:#64748b; font-weight:bold; margin-bottom:8px;">Ditagihkan Ke:</div>
                <div style="font-size:1.1rem; font-weight:bold; color:#1e293b;">${data.clientName || 'Nama Klien/Perusahaan'}</div>
                <div style="font-size:0.85rem; color:#475569; margin-top:4px;">${data.clientEmail || ''}</div>
              </td>
              <td style="width:50%; vertical-align:top; border-left:1px solid #e2e8f0; padding-left:20px;">
                <div style="font-size:0.75rem; text-transform:uppercase; color:#64748b; font-weight:bold; margin-bottom:8px;">Kirim Ke:</div>
                <div style="font-size:0.85rem; color:#475569; white-space:pre-wrap; line-height:1.5;">${data.clientAddress || 'Sama dengan penagihan'}</div>
              </td>
            </tr>
          </table>
        </div>

        <!-- Items Table -->
        <table style="width:100%; border-collapse:collapse; margin-bottom:30px;">
          <thead>
            <tr style="background:${c}; color:#fff;">
              <th style="text-align:left; padding:12px 15px; font-size:0.85rem; font-weight:bold;">Deskripsi Jasa / Barang</th>
              <th style="text-align:center; padding:12px 15px; font-size:0.85rem; font-weight:bold; width:80px;">Jml</th>
              <th style="text-align:right; padding:12px 15px; font-size:0.85rem; font-weight:bold; width:120px;">Harga Satuan</th>
              <th style="text-align:right; padding:12px 15px; font-size:0.85rem; font-weight:bold; width:140px;">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map((item, i) => `
              <tr style="background:${i%2===0?'#fff':'#f8fafc'};">
                <td style="padding:15px; border-bottom:1px solid #e2e8f0;">
                  <div style="font-weight:bold; font-size:0.9rem; color:#1e293b;">${item.name || 'Item'}</div>
                  ${item.description ? `<div style="font-size:0.8rem; color:#64748b; margin-top:4px;">${item.description}</div>` : ''}
                </td>
                <td style="text-align:center; padding:15px; border-bottom:1px solid #e2e8f0; font-size:0.9rem;">${item.qty}</td>
                <td style="text-align:right; padding:15px; border-bottom:1px solid #e2e8f0; font-size:0.9rem;">${formatAmount(item.price, data.currency)}</td>
                <td style="text-align:right; padding:15px; border-bottom:1px solid #e2e8f0; font-size:0.9rem; font-weight:bold;">${formatAmount((item.qty||0)*(item.price||0), data.currency)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Totals & Notes -->
        <table style="width:100%;">
          <tr>
            <td style="width:60%; vertical-align:top; padding-right:40px;">
              ${data.notes ? `
                <div style="background:#f8fafc; padding:20px; border-radius:4px; border-left:4px solid #cbd5e1;">
                  <div style="font-size:0.75rem; text-transform:uppercase; color:#64748b; font-weight:bold; margin-bottom:8px;">Catatan Order:</div>
                  <p style="font-size:0.85rem; color:#475569; margin:0; line-height:1.5; white-space:pre-wrap;">${data.notes}</p>
                </div>
              ` : ''}
            </td>
            <td style="width:40%; vertical-align:top;">
              <table style="width:100%; border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 15px; font-size:0.9rem; color:#475569;">Subtotal:</td>
                  <td style="padding:8px 15px; text-align:right; font-size:0.9rem; font-weight:bold;">${formatAmount(data.subtotal, data.currency)}</td>
                </tr>
                ${data.discountValue > 0 ? `
                  <tr>
                    <td style="padding:8px 15px; font-size:0.9rem; color:#475569;">Diskon:</td>
                    <td style="padding:8px 15px; text-align:right; font-size:0.9rem; color:#ef4444;">-${formatAmount(data.discountAmount, data.currency)}</td>
                  </tr>
                ` : ''}
                ${data.taxRate > 0 ? `
                  <tr>
                    <td style="padding:8px 15px; font-size:0.9rem; color:#475569;">Pajak (${data.taxRate}%):</td>
                    <td style="padding:8px 15px; text-align:right; font-size:0.9rem;">+${formatAmount(data.taxAmount, data.currency)}</td>
                  </tr>
                ` : ''}
                <tr style="background:${c}; color:#fff;">
                  <td style="padding:15px; font-size:1.1rem; font-weight:bold; text-transform:uppercase;">Total Tagihan:</td>
                  <td style="padding:15px; text-align:right; font-size:1.1rem; font-weight:bold;">${formatAmount(data.grandTotal, data.currency)}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
      
      <!-- Footer Bar -->
      <div style="position:absolute; bottom:0; left:0; right:0; height:6px; background:${c};"></div>
    </div>
  `;
}
