import { storage } from './storageService.js';

const KEY = 'invoices';

function getAll() {
  return storage.get(KEY) || [];
}

function save(invoices) {
  storage.set(KEY, invoices);
}

function generateId() {
  return 'inv_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

function generateNumber() {
  const invoices = getAll();
  const year = new Date().getFullYear();
  const count = invoices.filter(i => i.number && i.number.includes(String(year))).length + 1;
  return `INV-${year}-${String(count).padStart(4, '0')}`;
}

export const invoiceService = {
  getAll,

  getById(id) {
    return getAll().find(i => i.id === id) || null;
  },

  create(data) {
    const invoices = getAll();
    const invoice = {
      id: generateId(),
      number: data.number || generateNumber(),
      status: data.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };
    invoices.unshift(invoice);
    save(invoices);
    return invoice;
  },

  update(id, data) {
    const invoices = getAll();
    const idx = invoices.findIndex(i => i.id === id);
    if (idx === -1) return null;
    invoices[idx] = { ...invoices[idx], ...data, updatedAt: new Date().toISOString() };
    save(invoices);
    return invoices[idx];
  },

  delete(id) {
    const invoices = getAll().filter(i => i.id !== id);
    save(invoices);
  },

  duplicate(id) {
    const original = this.getById(id);
    if (!original) return null;
    const { id: _id, number: _num, createdAt: _c, updatedAt: _u, ...rest } = original;
    return this.create({ ...rest, status: 'draft', number: generateNumber() });
  },

  updateStatus(id, status) {
    return this.update(id, { status });
  },

  getStats() {
    const all = getAll();
    const total = all.length;
    const paid = all.filter(i => i.status === 'paid');
    const unpaid = all.filter(i => i.status === 'sent');
    const overdue = all.filter(i => i.status === 'overdue');
    const draft = all.filter(i => i.status === 'draft');

    const revenue = paid.reduce((s, i) => s + (i.grandTotal || 0), 0);
    const unpaidTotal = [...unpaid, ...overdue].reduce((s, i) => s + (i.grandTotal || 0), 0);

    return { total, paid: paid.length, unpaid: unpaid.length, overdue: overdue.length, draft: draft.length, revenue, unpaidTotal };
  },

  getRecentMonthlyRevenue() {
    const all = getAll();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      const y = d.getFullYear(), m = d.getMonth();
      const revenue = all
        .filter(inv => {
          if (inv.status !== 'paid') return false;
          const id = new Date(inv.invoiceDate || inv.createdAt);
          return id.getFullYear() === y && id.getMonth() === m;
        })
        .reduce((s, i) => s + (i.grandTotal || 0), 0);
      months.push({ label, revenue });
    }
    return months;
  },

  generateNumber,

  saveDraft(data) {
    storage.set('draft_invoice', data);
  },

  getDraft() {
    return storage.get('draft_invoice');
  },

  clearDraft() {
    storage.remove('draft_invoice');
  }
};
