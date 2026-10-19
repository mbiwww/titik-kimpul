# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Membuat modul koneksi server Supabase di `lib/supabase/server.js` dan re-export di `lib/supabase/index.js` menggunakan `@supabase/supabase-js` dan kunci `SUPABASE_SECRET_KEY`.
- Mengubah `app/page.jsx` menjadi async Server Component untuk membaca data dari tabel `produk` di Supabase secara dinamis (`export const dynamic = "force-dynamic"`).
- Menampilkan produk dengan komponen `KartuProduk`, menangani error fetch data dengan pesan error yang jelas (`text-bahaya`), serta menampilkan `"Belum ada produk"` jika data kosong.
- Menghapus komponen `CatatanBelumAktif`.

**Perbaikan:**
- Nilai `SUPABASE_URL` di `.env.local` awalnya memiliki path `/rest/v1/` yang memicu error `Invalid path specified in request URL` pada SDK Supabase. Dilakukan pembersihan otomatis string URL di `lib/supabase/server.js` (dan merapikan `.env.local`) untuk membuang akhiran `/rest/v1` dan trailing slash.
- Menambahkan `export const dynamic = "force-dynamic"` agar katalog selalu mengambil data terbaru dari database setiap kali halaman dimuat ulang.

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
- Mengubah `app/produk/[id]/page.jsx` agar mengambil satu produk berdasarkan parameter dinamis `id` menggunakan `buatKoneksiServer()` dari `lib/supabase`.
- Memanggil fungsi `notFound()` ketika produk tidak ditemukan atau ID tidak valid sehingga Next.js menampilkan halaman 404 standar.
- Mempertahankan komponen `TombolWhatsApp` dan seluruh tampilan detail produk.
- Menghapus komponen `CatatanBelumAktif`.

**Perbaikan:**
- Menggunakan query `.maybeSingle()` alih-alih `.single()` agar saat ID tidak ada atau bertipe salah, Supabase mengembalikan data `null` dengan aman tanpa menimbulkan unhandled exception, lalu dialihkan ke `notFound()`.

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
- Mengubah `components/TombolWhatsApp.jsx` dari elemen `<button>` menjadi tautan `<a>` dengan link berformat `https://wa.me/<nomor>?text=<pesan>`.
- Mengambil nomor WhatsApp dari `lib/toko.js` dan mengisi pesan pemesanan otomatis dengan nama produk dan harga dalam format rupiah (`formatRupiah`).
- Pesan di-encode menggunakan `encodeURIComponent`.
- Menambahkan atribut `target="_blank"` dan `rel="noopener noreferrer"` agar tautan dibuka di tab baru.
- Mempertahankan kelas Tailwind tombol bawaan.
- Memastikan `CatatanBelumAktif` sudah bersih dari halaman detail produk.

**Perbaikan:**
- Nomor WhatsApp di `lib/toko.js` memiliki simbol `+` (`+6282171980929`). Dilakukan pembersihan dengan regex `.replace(/\D/g, "")` agar menghasilkan format nomor internasional murni (`6282171980929`) sesuai spesifikasi tautan `wa.me`.

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**
- Menambahkan helper `buatKoneksiAdmin()` di `lib/supabase/server.js` menggunakan `createServerClient` dari `@supabase/ssr` dan cookie store dari `next/headers`.
- Membuat file `app/admin/actions.js` dengan Server Action `login` dan `keluar`.
- Menyambungkan form di `app/admin/login/page.jsx` ke Server Action menggunakan hook `useActionState`.
- Menampilkan pesan error saat login gagal dan mengarahkan ke `/admin` saat berhasil.
- Mengaktifkan tombol "Keluar" di `components/NavAdmin.jsx` menggunakan form action yang memanggil Server Action `keluar`.
- Menghapus `CatatanBelumAktif` dari halaman login.

**Perbaikan:**
- Menaruh fungsi `redirect("/admin")` di luar blok `try...catch` agar exception internal pengalihan Next.js (`NEXT_REDIRECT`) tidak tertangkap sebagai error aplikasi.
- Menerjemahkan pesan error bawaan Supabase `Invalid login credentials` menjadi teks yang ramah pengguna: `"Email atau password salah."`.

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
- Menambahkan Server Action `gantiPassword` di `app/admin/actions.js`.
- Memvalidasi password baru di sisi server: panjang minimal 8 karakter dan harus cocok dengan konfirmasi password.
- Memeriksa sesi login admin dengan `supabase.auth.getUser()`, kemudian mengubah password menggunakan `supabase.auth.updateUser({ password })`.
- Menyambungkan form di `app/admin/password/page.jsx` menggunakan `useActionState`.
- Menampilkan pesan berhasil (`text-utama`) atau pesan error (`text-bahaya`).
- Menghapus `CatatanBelumAktif` dari halaman ganti password.

**Perbaikan:**
- Menambahkan pemeriksaan otentikasi server sebelum eksekusi pembaruan password untuk memenuhi aturan keamanan nomor 3 (setiap aksi yang memodifikasi data wajib memeriksa status login di server).

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
- Membuat file `proxy.js` di root proyek sesuai konvensi Next.js 16 (pengganti `middleware.js`).
- Membaca sesi dan cookie dengan `createServerClient` dari `@supabase/ssr` serta memanggil `getUser()`.
- Mengamankan seluruh rute `/admin` dan subrutenya melalui matcher `["/admin", "/admin/:path*"]`, mengalihkan pengguna yang belum login ke `/admin/login`.
- Mengecualikan rute `/admin/login` agar tidak terjadi redirect loop.
- Menghapus `CatatanBelumAktif` dari `app/admin/page.jsx`.

**Perbaikan:**
- Mengatur konfigurasi matcher pada `["/admin", "/admin/:path*"]` dan menyaring kondisi `!request.nextUrl.pathname.startsWith("/admin/login")` sehingga navigasi publik, aset statis, dan rute login tetap dapat diakses tanpa hambatan.

## US-07 List Produk (Bonus)

**Prompt:**
Project ini sudah ada (Next.js + Supabase). Sebelum menulis kode, baca dulu struktur project, middleware, helper Supabase server, dan skema tabel produk. Ikuti pola kode yang sudah ada.

Tugas US-07: List produk di halaman admin, datanya dari database.

Yang dibuat:
- Halaman `/admin/products` berupa Server Component yang mengambil data produk dari Supabase di sisi server.
- Tampilkan tabel: nama, kategori, harga, stok/status (jika kolomnya ada). Siapkan kolom aksi (tombol Ubah dan Hapus) sebagai placeholder, belum perlu berfungsi.
- State kosong ("Belum ada produk") dan state error yang ramah.

Aturan:
- Browser tidak boleh memanggil `supabase.co` langsung. Jangan pakai Supabase client di Client Component.
- Route `/admin/products` harus tetap terlindungi middleware (tanpa login diarahkan ke `/admin/login`, tanpa redirect loop).
- Jangan ubah RLS diam-diam. Kalau perlu policy baru, tulis sebagai file migrasi SQL terpisah dan jelaskan.

**Hasil:**
- Membuat Server Component di `app/admin/products/page.jsx` yang mengambil data produk langsung dari Supabase via `buatKoneksiAdmin()` (menggunakan `@supabase/ssr` dan cookie sesi admin).
- Menampilkan tabel produk menggunakan `TabelProduk` dengan kolom nama, kategori, harga (rupiah), dan kolom stok/status jika datanya ada.
- Menyediakan kolom aksi dengan tombol Ubah dan Hapus sebagai placeholder.
- Menangani state error dengan pesan yang ramah dan state kosong `"Belum ada produk"`.
- Memastikan rute `/admin/products` terproteksi oleh `proxy.js` tanpa redirect loop.
- Menyinkronkan rute `/admin` dan tautan navigasi `NavAdmin` ke halaman produk database.

**Perbaikan:**
- Mengembangkan `TabelProduk` agar dapat mendeteksi keberadaan kolom `stok` atau `status` secara dinamis tanpa merusak struktur tabel jika kolom tersebut belum ada di database.
- Menyediakan penanganan fallback jika koneksi sesi admin memerlukan refresh token, agar data produk tetap dapat dimuat di sisi server tanpa interupsi.


