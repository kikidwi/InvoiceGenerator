export const CURRENCIES = {
  IDR: { symbol: 'Rp', name: 'Indonesian Rupiah', locale: 'id-ID' },
  USD: { symbol: '$', name: 'US Dollar', locale: 'en-US' },
  EUR: { symbol: '€', name: 'Euro', locale: 'de-DE' },
  GBP: { symbol: '£', name: 'British Pound', locale: 'en-GB' },
  SGD: { symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
  MYR: { symbol: 'RM', name: 'Malaysian Ringgit', locale: 'ms-MY' },
  AUD: { symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  JPY: { symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  CHF: { symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH' },
  CNY: { symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  INR: { symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  NZD: { symbol: 'NZ$', name: 'New Zealand Dollar', locale: 'en-NZ' },
  ZAR: { symbol: 'R', name: 'South African Rand', locale: 'en-ZA' },
  BRL: { symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
};

export function formatCurrency(amount, currencyCode = 'IDR') {
  const code = CURRENCIES[currencyCode] ? currencyCode : 'IDR';
  const c = CURRENCIES[code];
  try {
    return new Intl.NumberFormat(c.locale, {
      style: 'currency',
      currency: code,
      minimumFractionDigits: code === 'IDR' ? 0 : 2,
      maximumFractionDigits: code === 'IDR' ? 0 : 2
    }).format(amount || 0);
  } catch (e) {
    return `${c.symbol} ${(amount||0).toFixed(2)}`;
  }
}

export function currencyOptions() {
  return Object.keys(CURRENCIES).map(code => 
    `<option value="${code}">${code} - ${CURRENCIES[code].name}</option>`
  ).join('');
}
