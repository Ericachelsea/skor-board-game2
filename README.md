# Skor Board Game

Papan skor digital untuk permainan fisik dengan HTML, CSS, JavaScript, dan Apache Cordova. Desain memakai tema gelap dan menyesuaikan ukuran layar HP maupun desktop.

## Fitur

- Menambahkan pemain dengan nama sendiri.
- Mengubah skor dengan tombol `-5`, `-1`, `+1`, dan `+5`.
- Menampilkan total skor serta perubahan skor pada ronde saat ini.
- Menyelesaikan ronde dan menyimpan riwayat hasil tiap pemain.
- Menyimpan data pada perangkat menggunakan `localStorage`.
- Tombol penghapusan pemain dengan konfirmasi.
- Dukungan getaran melalui `cordova-plugin-vibration` jika perangkat mendukungnya.
- Tampilan responsif untuk ponsel, tablet, dan desktop.

## Persyaratan

- Node.js dan npm.
- Apache Cordova CLI (dapat dipasang lewat npm).
- Untuk membuat aplikasi Android: Android Studio, Android SDK, dan JDK yang kompatibel dengan versi `cordova-android` yang dipasang.

## Menjalankan di browser

Buka terminal di folder proyek ini, kemudian jalankan:

```bash
npm install
npx cordova serve
```

Buka alamat lokal yang ditampilkan di terminal. Data disimpan pada penyimpanan browser, sehingga data browser dan data aplikasi Android terpisah.

## Menyiapkan Android

Pasang plugin dan tambahkan platform Android:

```bash
npx cordova plugin add cordova-plugin-vibration
npx cordova platform add android
npx cordova requirements android
```

Jika pemeriksaan requirements menunjukkan komponen belum tersedia, pasang atau atur komponen Android yang disebutkan. Setelah siap, build aplikasi:

```bash
npx cordova build android
```

Untuk memasang dan menjalankan di perangkat/emulator Android:

```bash
npx cordova run android
```

## Struktur folder

```text
skor-board-game/
├── config.xml
├── package.json
├── README.md
└── www/
    ├── index.html
    ├── css/
    │   └── index.css
    └── js/
        └── index.js
```

## Catatan perilaku

- Skor boleh negatif jika tombol pengurangan ditekan.
- Saat ronde diselesaikan, skor ronde disimpan ke riwayat dan skor ronde setiap pemain kembali ke 0; total skor tetap berlanjut.
- Menghapus pemain tidak mengubah catatan pemain pada riwayat ronde yang sudah disimpan.
- `localStorage` cocok untuk versi tugas satu perangkat. Data tidak tersinkron otomatis ke perangkat lain.
