# Invoice Generator

Aplikasi pembuat invoice / faktur berbasis web (Single Page Application) yang berjalan murni pada sisi klien (client-side) tanpa memerlukan database atau arsitektur server terpisah. Aplikasi ini dibuat agar pengguna dapat langsung membuat invoice tanpa harus melalui tahapan registrasi.

## Fitur Utama

- Tanpa Autentikasi: Aplikasi dapat langsung digunakan tanpa perlu membuat akun, login, atau terikat layanan backend.
- 5 Pilihan Template: Menyediakan lima gaya tata letak untuk invoice (Modern, Minimalis, Korporat, Kreatif, dan Mode Gelap).
- Live Preview Aktual: Tampilan fisik invoice otomatis disesuaikan di layar seiring dengan tiap data yang dimasukkan ke dalam form (ukuran presisi standar A4).
- Penyimpanan Lokal (Auto-Save): Draf invoice yang sedang dibuat secara berkala disimpan otomatis di dalam penyimpanan lokal (localStorage) browser pengguna untuk mencegah kehilangan data.
- Ekspor PDF: Menyediakan unduhan langsung untuk membuat file PDF berdasarkan tampilan preview akhir yang dihasilkan.
- Pelokalan Indonesia: Menggunakan format nilai tukar Rupiah (IDR) beserta terjemahan antarmuka Bahasa Indonesia sebagai standar awal.

## Cara Penggunaan

### Jika Mengakses Melalui Web / Link
1. Buka link ketersediaan aplikasi.
2. Masukkan seluruh informasi sesuai kebutuhan pada form (Data Pengirim, Klien, Nominal Item Invoice, dan Catatan Pajak/Diskon).
3. Anda bisa mengubah gaya template atau warna dasar sewaktu-waktu di bagian menu "Pilih Desain Template".
4. Periksa kecocokan data melalui panel "Live Preview" di sebelah kanan form.
5. Klik "Download PDF". File invoice otomatis terunduh di penyimpanan Anda dengan dimensi kertas proporsional dengan panjang konten.

### Jika Menjalankan Proyek Via Lokal / Clone
Pastikan Node.js sudah terinstal secara sistem dengan benar.

1. Clone repositori ini:
   ```bash
   git clone https://github.com/kikidwi/InvoiceGenerator.git
   ```
2. Arahkan terminal / command line masuk ke dalam folder proyek:
   ```bash
   cd InvoiceGenerator
   ```
3. Instal dependensi pengembangan pendukung:
   ```bash
   npm install
   ```
4. Jalankan *development server*:
   ```bash
   npm run dev
   ```
5. Aplikasi akan berjalan di environment lokal (seperti `http://localhost:5173`) dan dapat Anda uji langsung di dalam web browser Anda.

Untuk mendistribusikan kode ke web *hosting*, jalankan instruksi `npm run build` dan gunakan hasil keluaran yang berada dalam *folder* `dist`.
