import { formatAmount, formatDate } from '../utils/formatters.js';

export function renderDark(data) {
  const c = data.accentColor || '#818cf8';
  return `
    <div style="font-family:'Outfit',sans-serif; background:#0f172a; color:#e2e8f0; padding:40px; height:100%; box-sizing:border-box; word-break:break-word; line-height:1.5;">
      <!-- Header -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:50px; border-bottom:1px solid #1e293b; padding-bottom:30px;">
        <div style="display:flex; align-items:center; gap:20px;">
          ${data.logo ? `<img src="${data.logo}" style="max-height:80px; border-radius:8px;">` : `<div style="width:64px; height:64px; background:linear-gradient(135deg, ${c}, #334155); border-radius:12px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:2rem; font-weight:900;">${(data.senderName || 'P').charAt(0)}</div>`}
          <div>
            <h2 style="margin:0; font-size:1.5rem; color:#f8fafc;">${data.senderName || 'PERUSAHAAN'}</h2>
            <div style="font-size:0.85rem; color:#94a3b8; margin-top:4px;">${data.senderEmail || ''}</div>
            <div style="font-size:0.85rem; color:#94a3b8; white-space:pre-wrap; margin-top:2px;">${data.senderAddress || ''}</div>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="background:#1e293b; padding:10px 20px; border-radius:8px; display:inline-block; border:1px solid #334155;">
            <h1 style="margin:0; font-size:1.5rem; color:${c}; letter-spacing:2px; text-transform:uppercase;">TAGIHAN</h1>
            <div style="font-size:1rem; font-weight:700; color:#cbd5e1; margin-top:4px;">#${data.number}</div>
          </div>
        </div>
      </div>

      <!-- Detail Klien & Tanggal -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; margin-bottom:40px;">
        <div style="background:#1e293b; padding:24px; border-radius:12px; border:1px solid #334155;">
          <div style="font-size:0.75rem; color:#64748b; text-transform:uppercase; font-weight:800; letter-spacing:1px; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
            <div style="width:8px; height:8px; border-radius:50%; background:${c};"></div> KEPADA YTH:
          </div>
          <h3 style="margin:0; font-size:1.2rem; color:#f8fafc;">${data.clientName || 'Nama Klien'}</h3>
          <div style="font-size:0.9rem; color:#94a3b8; margin-top:6px;">${data.clientEmail || ''}</div>
          <div style="font-size:0.9rem; color:#94a3b8; white-space:pre-wrap; margin-top:6px;">${data.clientAddress || ''}</div>
        </div>
        <div style="display:flex; flex-direction:column; justify-content:space-between; padding:10px 0;">
          <div>
            <div style="font-size:0.75rem; color:#64748b; text-transform:uppercase; font-weight:800; letter-spacing:1px; margin-bottom:4px;">TGL TERBIT</div>
            <div style="font-size:1.1rem; color:#f8fafc; font-weight:600;">${formatDate(data.invoiceDate)}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:#64748b; text-transform:uppercase; font-weight:800; letter-spacing:1px; margin-bottom:4px;">TGL JATUH TEMPO</div>
            <div style="font-size:1.1rem; color:${c}; font-weight:600;">${formatDate(data.dueDate)}</div>
          </div>
        </div>
      </div>

      <!-- Items -->
      <div style="background:#1e293b; border-radius:12px; border:1px solid #334155; overflow:hidden; margin-bottom:40px;">
        <table style="width:100%; border-collapse:collapse;">
          <thead>
            <tr style="background:#0f172a; border-bottom:1px solid #334155;">
              <th style="text-align:left; padding:15px 20px; font-size:0.8rem; color:#94a3b8; text-transform:uppercase; letter-spacing:1px;">Layanan / Barang</th>
              <th style="text-align:center; padding:15px 20px; font-size:0.8rem; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; width:80px;">Jml</th>
              <th style="text-align:right; padding:15px 20px; font-size:0.8rem; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; width:140px;">Harga</th>
              <th style="text-align:right; padding:15px 20px; font-size:0.8rem; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; width:160px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map((item, i) => `
              <tr style="border-bottom:${i === data.items.length - 1 ? 'none' : '1px solid #334155'};">
                <td style="padding:20px; vertical-align:top;">
                  <div style="font-weight:700; color:#f8fafc; font-size:1rem;">${item.name || 'Item'}</div>
                  ${item.description ? `<div style="font-size:0.85rem; color:#94a3b8; margin-top:6px;">${item.description}</div>` : ''}
                </td>
                <td style="text-align:center; padding:20px; color:#cbd5e1; font-weight:500; vertical-align:top;">${item.qty}</td>
                <td style="text-align:right; padding:20px; color:#cbd5e1; font-weight:500; vertical-align:top;">${formatAmount(item.price, data.currency)}</td>
                <td style="text-align:right; padding:20px; color:#f8fafc; font-weight:700; vertical-align:top;">${formatAmount((item.qty||0)*(item.price||0), data.currency)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Bottom -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div style="flex:1; max-width:400px; padding-right:40px;">
          ${data.notes ? `
            <div style="font-size:0.75rem; color:#64748b; text-transform:uppercase; font-weight:800; letter-spacing:1px; margin-bottom:8px;">CATATAN:</div>
            <p style="font-size:0.85rem; color:#94a3b8; line-height:1.6; margin:0; white-space:pre-wrap;">${data.notes}</p>
          ` : ''}
        </div>
        <div style="width:350px; background:#1e293b; padding:24px; border-radius:12px; border:1px solid ${c}; box-shadow:0 0 20px ${c}22;">
          <div style="display:flex; justify-content:space-between; padding:8px 0; color:#cbd5e1; font-size:0.95rem;">
            <span>Subtotal</span>
            <span style="font-weight:600;">${formatAmount(data.subtotal, data.currency)}</span>
          </div>
          ${data.discountValue > 0 ? `
            <div style="display:flex; justify-content:space-between; padding:8px 0; color:#ef4444; font-size:0.95rem;">
              <span>Diskon</span>
              <span>-${formatAmount(data.discountAmount, data.currency)}</span>
            </div>
          ` : ''}
          ${data.taxRate > 0 ? `
            <div style="display:flex; justify-content:space-between; padding:8px 0; color:#cbd5e1; font-size:0.95rem;">
              <span>Pajak (${data.taxRate}%)</span>
              <span>+${formatAmount(data.taxAmount, data.currency)}</span>
            </div>
          ` : ''}
          <div style="height:1px; background:#334155; margin:16px 0;"></div>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:1.4rem; font-weight:900; color:${c};">
            <span>TOTAL Tagihan</span>
            <span>${formatAmount(data.grandTotal, data.currency)}</span>
          </div>
        </div>
      </div>
      
      <!-- Footer Design Element -->
      <div style="margin-top:auto; padding-top:50px; text-align:center; position:relative;">
        <div style="position:absolute; top:50%; left:0; right:0; height:1px; background:linear-gradient(90deg, transparent, #334155, transparent);"></div>
        <span style="background:#0f172a; padding:0 20px; position:relative; z-index:1; font-size:1.5rem;">⚡</span>
      </div>
    </div>
  `;
}
