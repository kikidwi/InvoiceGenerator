import { renderMinimalist } from './minimalist.js';
import { renderModern } from './modern.js';
import { renderCorporate } from './corporate.js';
import { renderDark } from './dark.js';
import { renderCreative } from './creative.js';

export const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    preview: '✨',
    tags: ['Bersih', 'Terbaru'],
    description: 'Tata letak yang bersih dengan typografi tebal. Cocok untuk freelancer dan agensi digital.',
    render: renderModern,
  },
  {
    id: 'minimalist',
    name: 'Minimalis',
    preview: '📐',
    tags: ['Simpel', 'Klasik'],
    description: 'Elegan dan klasik tanpa banyak ornamen pernak-pernik dekorasi.',
    render: renderMinimalist,
  },
  {
    id: 'corporate',
    name: 'Korporat',
    preview: '🏢',
    tags: ['Resmi', 'Profesional'],
    description: 'Desain tradisional berbasis tabel yang sangat cocok untuk B2B dan perusahaan resmi.',
    render: renderCorporate,
  },
  {
    id: 'creative',
    name: 'Kreatif',
    preview: '🎨',
    tags: ['Berwarna', 'Unik'],
    description: 'Tampil beda dengan header tebal dan blok warna yang sangat kontras.',
    render: renderCreative,
  },
  {
    id: 'dark',
    name: 'Mode Gelap',
    preview: '🌙',
    tags: ['Sleek', 'Mewah'],
    description: 'Invoice bertema gelap. Sangat cocok untuk developer, tim esports, atau kreator malam.',
    render: renderDark,
  },
];

export function renderTemplate(templateId, invoiceData, profileData) {
  const tpl = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
  // Menggabungkan data profil pengirim (dari state UI atau profile)
  // Profil data saat ini dilempar inline di page, tapi kita merge di sini untuk amannya
  const payload = { ...invoiceData, ...profileData };
  return tpl.render(payload);
}
