# ⚡ InvoiceFlow - Generator Invoice Kilat

InvoiceFlow adalah aplikasi pembuat invoice mandiri berbasis web (*Single Page Application*) yang dirancang khusus dengan workflow tercepat. Dikelola **100% di browser Anda (Client-side)** tanpa server, tanpa perlu mendaftar atau login, dan data tersimpan aman di perangkat Anda secara otomatis!

Aplikasi ini ditujukan bagi freelancer, agensi, dan perusahaan kecil di Indonesia yang membutuhkan *invoice* atau *faktur* profesional secara instan dengan desain premium hanya dalam hitungan detik.

## ✨ Fitur Utama

- **🚀 Tanpa Login / Pendaftaran:** Buka aplikasi dan lansung buat invoice Anda seketika.
- **🎨 5 Desain Template Premium:** Pilih gaya invoice sesuai identitas merek Anda (*Modern, Minimalis, Korporat, Kreatif, dan Mode Gelap*).
- **👁️ Live Preview Aktual (WYSIWYG):** Semua perubahan di form secara *real-time* terlihat pada preview dengan rasio presisi ukuran kertas A4.
- **💾 Auto-Save ke Browser:** Jika tab / browser tertutup secara tak sengaja, *draf* desain Anda belum hilang berkat integrasi penyimpanan di `localStorage`.
- **📥 Ekspor ke PDF Otomatis:** Fitur utama terintegrasi, cukup sekali klik dan invoice profesional otomatis terunduh (*kroping layout* telah disesuaikan tepat sesuai banyaknya item tagihan tanpa mengambakan ruang putih kosong).
- **🇮🇩 Diformat khusus Indonesia:** Default penomoran Rp (Rupiah Rupiah), perhitungan diskon serta PPN, dan antarmukanya sudah menggunakan *Bahasa Indonesia*.

## 🛠️ Stack Teknologi

- **Vanilla JavaScript (ES6+)**
- **Vite** (Build Tool super cepat)
- **Vanilla CSS** (Sistem UI Component dan variabel moduler)
- **html2pdf.js** (Sistem rendering untuk PDF ekspor beresolusi tinggi di sisi *client*)

## 💻 Panduan Instalasi & Menjalankan Lokal

Karena aplikasi ini sangat ringan, Anda bisa menjalankannya dengan mudah di direktori lokal Anda:

1. Pastikan Anda memiliki lingkungan [Node.js](https://nodejs.org/) yang terpasang.
2. Clone repository ini:
   \`\`\`bash
   git clone https://github.com/kikidwi/InvoiceGenerator.git
   cd InvoiceGenerator
   \`\`\`
3. Instal semua dependensi:
   \`\`\`bash
   npm install
   \`\`\`
4. Jalankan server pengembangan Vite:
   \`\`\`bash
   npm run dev
   \`\`\`
5. Buka tautan lokal yang disediakan (misal: \`http://localhost:5173\`) di browser kesayangan Anda.

## 📦 Build Produksi

Untuk mendeploy/mendistribusikannya ke lingkungan produksi mandiri (misal: GitHub Pages, Netlify, Vercel), silakan build project dengan:

\`\`\`bash
npm run build
\`\`\`

Aplikasi statik (*dist/*) bisa di-*host* di penyedia layanan manapun.

---

*Dibuat untuk mempercepat proses penagihan agar Anda dapat fokus pada apa yang penting—pekerjaan kreatif Anda.* ✨
