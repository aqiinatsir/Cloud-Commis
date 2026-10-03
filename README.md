# Cloud Commis

Website portofolio dan komisi layanan digital bertema awan neon. Dibangun dengan HTML5, CSS3, dan JavaScript murni, siap di-deploy ke Vercel.

## File

- `index.html` — struktur halaman
- `style.css` — tema cloud, glassmorphism, neon
- `script.js` — galeri, layanan, tim, ulasan, dashboard admin
- `vercel.json` — header security untuk Vercel

## Menjalankan lokal

Buka `index.html` di browser, atau:

```bash
python -m http.server 3000
```

Lalu kunjungi `http://localhost:3000`.

## Deploy Vercel

Unggah folder ini sebagai proyek static (tanpa build command).

## Admin

Tombol **Login Admin** membuka dashboard setelah autentikasi. Dari dashboard Anda dapat:

1. Mengunggah foto portofolio dari file lokal
2. Menambah / mengedit / menghapus paket layanan
3. Menambah / mengedit / menghapus anggota tim (foto file lokal)
4. Menghapus ulasan spam

Data tersimpan di LocalStorage dan IndexedDB browser pengunjung/admin.

## Ulasan pengunjung

Setiap perangkat hanya dapat mengirim satu ulasan. Setelah terkirim, formulir terkunci permanen di browser tersebut.
