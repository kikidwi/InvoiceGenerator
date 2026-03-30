import { storage } from './storageService.js';

const KEY = 'profile';

const DEFAULT = {
  businessName: 'Nama Perusahaan',
  businessEmail: 'halo@contoh.com',
  businessPhone: '',
  businessAddress: '',
  businessCity: '',
  businessCountry: '',
  businessWebsite: '',
  taxId: '',
  logo: null,
  defaultCurrency: 'IDR',
  defaultTemplate: 'modern',
  accentColor: '#6366f1',
};

export const profileService = {
  get() {
    return { ...DEFAULT, ...(storage.get(KEY) || {}) };
  },
  save(data) {
    const current = this.get();
    const updated = { ...current, ...data };
    storage.set(KEY, updated);
    return updated;
  },
  update(key, value) {
    const p = this.get();
    p[key] = value;
    storage.set(KEY, p);
    return p;
  },
  reset() {
    storage.set(KEY, DEFAULT);
    return DEFAULT;
  }
};
