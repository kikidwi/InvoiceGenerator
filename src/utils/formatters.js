import { formatCurrency } from '../services/currencyService.js';

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return dateStr; }
}

export function formatAmount(amount, currency = 'IDR') {
  return formatCurrency(amount, currency);
}

export function debounce(fn, delay = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

export function calcInvoiceTotals({ items = [], taxRate = 0, discountType = 'percent', discountValue = 0 }) {
  const subtotal = items.reduce((s, item) => s + (Number(item.qty) || 0) * (Number(item.price) || 0), 0);
  const taxAmount = subtotal * (Number(taxRate) / 100);
  const discountAmount = discountType === 'percent'
    ? subtotal * (Number(discountValue) / 100)
    : Number(discountValue) || 0;
  const grandTotal = Math.max(0, subtotal + taxAmount - discountAmount);
  return { subtotal, taxAmount, discountAmount, grandTotal };
}
