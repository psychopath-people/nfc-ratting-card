# Setup Guide NFC Rating

## 1. Buat Google Sheet

1. Buka [Google Sheets](https://sheets.google.com) → buat spreadsheet baru
2. Rename sheet pertama jadi: **Cards**
3. Isi baris pertama (header):

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| card_id | cafe_name | maps_url | tap_count | created_at | updated_at |

4. Copy **Spreadsheet ID** dari URL:
   `https://docs.google.com/spreadsheets/d/**SPREADSHEET_ID**/edit`

---

## 2. Buat Google Service Account

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Buat project baru (atau pakai yang ada)
3. Enable **Google Sheets API**: APIs & Services → Enable APIs → cari "Google Sheets API"
4. Buat Service Account: IAM & Admin → Service Accounts → Create
   - Nama: `nfc-rating`
   - Role: tidak perlu (skip)
5. Klik service account → tab **Keys** → Add Key → JSON → Download
6. Share Google Sheet ke email service account (lihat di JSON: `client_email`)
   - Klik Share di Google Sheet → paste email → role: Editor

---

## 3. Setup Environment Variables

Copy file `.env.local.example` → `.env.local` dan isi:

```
GOOGLE_SHEET_ID=           # dari URL spreadsheet
GOOGLE_SERVICE_ACCOUNT_EMAIL=   # client_email dari JSON
GOOGLE_PRIVATE_KEY=        # private_key dari JSON (dengan tanda kutip)
```

---

## 4. Deploy ke Vercel

```bash
npx vercel
```

Tambahkan env variables yang sama di Vercel Dashboard → Settings → Environment Variables.

---

## 5. Cara Pakai (Per Kartu)

### Tulis ke NFC Tag
- App: **NFC Tools** (Android/iOS)
- Jenis record: **URL**
- Value: `https://your-app.vercel.app/r/CARD_ID`
- Contoh card ID: `abc123`, `kafe01`, `sudirman01`

### Setup kartu sebelum kasih ke cafe
1. Buka: `https://your-app.vercel.app/setup/CARD_ID`
2. Isi nama cafe + paste Google Maps review URL
3. Save → kartu aktif!

### Cara dapat Google Maps Review URL
1. Search nama cafe di Google
2. Klik **"Tulis ulasan"** / **"Write a review"**
3. Copy URL dari browser
   Format: `https://search.google.com/local/writereview?placeid=...`

---

## Struktur Folder

```
/r/[card-id]      → redirect ke Google Maps (ditulis ke NFC tag)
/setup/[card-id]  → halaman setup per kartu (hanya kamu yang pakai)
```
