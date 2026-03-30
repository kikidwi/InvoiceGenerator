import { formatAmount, formatDate } from '../utils/formatters.js';

export function renderCreative(data) {
  const c = data.accentColor || '#f59e0b';
  // Lighter version of accent for backgrounds
  const lightBgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="${c}" opacity="0.05"/></svg>`;
  const bg = `data:image/svg+xml;base64,${btoa(lightBgStr)}`;

  return `
    <div style="font-family:'Outfit',sans-serif; background:#fff; color:#1f2937; height:100%; box-sizing:border-box; word-break:break-word; background-image:url('${bg}'); background-size:800px; padding:0; position:relative; overflow:hidden; line-height:1.5;">
      <!-- Giant Header Area -->
      <div style="background:${c}; color:#fff; padding:60px 50px 80px; clip-path:polygon(0 0, 100% 0, 100% 85%, 0% 100%); margin-bottom:-40px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div>
            ${data.logo ? `<img src="${data.logo}" style="max-height:80px; background:#fff; padding:8px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">` : `<div style="font-size:2.5rem; font-weight:900; letter-spacing:-1px;">${data.senderName || 'Studio Kreatif'}</div>`}
            <div style="margin-top:16px; font-size:0.9rem; opacity:0.9;">${data.senderEmail || ''}</div>
            <div style="font-size:0.9rem; opacity:0.9; white-space:pre-wrap; max-width:250px;">${data.senderAddress || ''}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:4rem; font-weight:900; line-height:1; letter-spacing:-2px; opacity:0.9;">INVOICE</div>
            <div style="font-size:1.2rem; font-weight:600; font-family:monospace; margin-top:8px; opacity:0.8;">#${data.number}</div>
          </div>
        </div>
      </div>

      <div style="padding:0 50px 50px;">
        <!-- Info Cards -->
        <div style="display:grid; grid-template-columns:1.5fr 1fr; gap:24px; position:relative; z-index:10;">
          <div style="background:#fff; padding:30px; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.05); border:1px solid #f3f4f6; border-top:4px solid ${c};">
            <div style="font-size:0.75rem; color:#9ca3af; text-transform:uppercase; font-weight:800; letter-spacing:1px; margin-bottom:12px;">Penagihan Kepada:</div>
            <h3 style="margin:0; font-size:1.3rem; color:#111827;">${data.clientName || 'Nama Klien'}</h3>
            <div style="font-size:0.9rem; color:#6b7280; margin-top:8px;">${data.clientEmail || ''}</div>
            <div style="font-size:0.9rem; color:#6b7280; margin-top:4px; white-space:pre-wrap;">${data.clientAddress || ''}</div>
          </div>
          
          <div style="background:#111827; color:#fff; padding:30px; border-radius:16px; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
            <div style="margin-bottom:20px;">
              <div style="font-size:0.75rem; color:#9ca3af; text-transform:uppercase; font-weight:800; letter-spacing:1px; margin-bottom:4px;">Terbit</div>
              <div style="font-size:1.1rem; font-weight:600;">${formatDate(data.invoiceDate)}</div>
            </div>
            <div>
              <div style="font-size:0.75rem; color:#9ca3af; text-transform:uppercase; font-weight:800; letter-spacing:1px; margin-bottom:4px;">Jatuh Tempo</div>
              <div style="font-size:1.1rem; font-weight:600; color:${c};">${formatDate(data.dueDate)}</div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div style="margin-top:50px; background:#fff; border-radius:16px; padding:10px; box-shadow:0 4px 6px rgba(0,0,0,0.02); border:1px solid #f3f4f6;">
          <table style="width:100%; border-collapse:collapse;">
            <thead>
              <tr>
                <th style="text-align:left; padding:16px 20px; font-size:0.8rem; color:#6b7280; text-transform:uppercase; font-weight:800; letter-spacing:1px; border-bottom:2px solid #f3f4f6;">Deskripsi Jasa</th>
                <th style="text-align:center; padding:16px 20px; font-size:0.8rem; color:#6b7280; text-transform:uppercase; font-weight:800; letter-spacing:1px; border-bottom:2px solid #f3f4f6; width:80px;">Qty</th>
                <th style="text-align:right; padding:16px 20px; font-size:0.8rem; color:#6b7280; text-transform:uppercase; font-weight:800; letter-spacing:1px; border-bottom:2px solid #f3f4f6; width:140px;">Tarif</th>
                <th style="text-align:right; padding:16px 20px; font-size:0.8rem; color:#6b7280; text-transform:uppercase; font-weight:800; letter-spacing:1px; border-bottom:2px solid #f3f4f6; width:160px;">Nilai</th>
              </tr>
            </thead>
            <tbody>
              ${data.items.map((item, i) => `
                <tr style="border-bottom:${i === data.items.length - 1 ? 'none' : '1px solid #f3f4f6'};">
                  <td style="padding:20px; vertical-align:top;">
                    <div style="font-weight:700; color:#111827; font-size:1.05rem;">${item.name || 'Jasa Utama'}</div>
                    ${item.description ? `<div style="font-size:0.85rem; color:#6b7280; margin-top:6px; line-height:1.5;">${item.description}</div>` : ''}
                  </td>
                  <td style="text-align:center; padding:20px; color:#4b5563; font-weight:600; vertical-align:top;">${item.qty}</td>
                  <td style="text-align:right; padding:20px; color:#4b5563; font-weight:600; vertical-align:top;">${formatAmount(item.price, data.currency)}</td>
                  <td style="text-align:right; padding:20px; color:#111827; font-weight:800; vertical-align:top;">${formatAmount((item.qty||0)*(item.price||0), data.currency)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- summary area -->
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-top:40px;">
          <!-- Notes -->
          <div style="flex:1; max-width:400px; background:#f9fafb; padding:24px; border-radius:12px; border:1px dashed #e5e7eb;">
            <div style="font-size:0.75rem; color:#9ca3af; text-transform:uppercase; font-weight:800; letter-spacing:1px; margin-bottom:8px;">Ucapan & Catatan:</div>
            <p style="font-size:0.85rem; color:#4b5563; line-height:1.6; margin:0; white-space:pre-wrap;">${data.notes || 'Terima kasih atas kolaborasi yang luar biasa ini!'}</p>
          </div>

          <!-- Totals -->
          <div style="width:360px; margin-left:40px;">
            <div style="background:#fff; padding:24px; border-radius:16px; border:1px solid #f3f4f6; position:relative; overflow:hidden;">
              <div style="position:absolute; left:0; top:0; bottom:0; width:6px; background:${c};"></div>
              
              <div style="display:flex; justify-content:space-between; padding:8px 0; color:#4b5563; font-size:0.95rem;">
                <span style="font-weight:500;">Subtotal</span>
                <span style="font-weight:700;">${formatAmount(data.subtotal, data.currency)}</span>
              </div>
              
              ${data.discountValue > 0 ? `
                <div style="display:flex; justify-content:space-between; padding:8px 0; color:#ef4444; font-size:0.95rem;">
                  <span style="font-weight:500;">Diskon Khusus</span>
                  <span style="font-weight:700;">-${formatAmount(data.discountAmount, data.currency)}</span>
                </div>
              ` : ''}
              
              ${data.taxRate > 0 ? `
                <div style="display:flex; justify-content:space-between; padding:8px 0; color:#4b5563; font-size:0.95rem;">
                  <span style="font-weight:500;">Pajak (${data.taxRate}%)</span>
                  <span style="font-weight:700;">+${formatAmount(data.taxAmount, data.currency)}</span>
                </div>
              ` : ''}
              
              <div style="height:2px; background:#f3f4f6; margin:16px 0;"></div>
              
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:1.1rem; font-weight:800; color:#111827; text-transform:uppercase;">TOTAL DIBAYAR</span>
                <span style="font-size:1.6rem; font-weight:900; color:${c}; letter-spacing:-0.5px;">${formatAmount(data.grandTotal, data.currency)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Bottom Decor -->
        <div style="text-align:center; position:absolute; bottom:30px; left:0; right:0;">
          <div style="display:inline-flex; align-items:center; gap:16px; background:#f9fafb; padding:8px 24px; border-radius:50px;">
            <div style="width:8px; height:8px; border-radius:50%; background:${c};"></div>
            <div style="width:8px; height:8px; border-radius:50%; background:${c}; opacity:0.5;"></div>
            <div style="width:8px; height:8px; border-radius:50%; background:${c}; opacity:0.2;"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}
