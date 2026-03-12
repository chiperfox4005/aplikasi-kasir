const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Lokasi database
const dbPath = path.join(__dirname, 'kasir.db');

// Buat / buka database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Gagal koneksi database:', err.message);
    } else {
        console.log('✅ Database terhubung.');
    }
});

// Aktifkan foreign key (penting!)
db.serialize(() => {
    db.run(`PRAGMA foreign_keys = ON`);

    // ========================
    // TABEL PRODUK
    // ========================
    db.run(`
        CREATE TABLE IF NOT EXISTS produk (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nama TEXT NOT NULL,
            harga INTEGER NOT NULL CHECK(harga >= 0),
            stok INTEGER NOT NULL CHECK(stok >= 0)
        )
    `);

    // ========================
    // TABEL TRANSAKSI
    // ========================
    db.run(`
        CREATE TABLE IF NOT EXISTS transaksi (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tanggal DATETIME DEFAULT CURRENT_TIMESTAMP,
            total INTEGER NOT NULL CHECK(total >= 0)
        )
    `);

    // ========================
    // TABEL DETAIL TRANSAKSI
    // ========================
    db.run(`
        CREATE TABLE IF NOT EXISTS detail_transaksi (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transaksi_id INTEGER NOT NULL,
            produk_id INTEGER NOT NULL,
            jumlah INTEGER NOT NULL CHECK(jumlah > 0),
            subtotal INTEGER NOT NULL CHECK(subtotal >= 0),
            FOREIGN KEY (transaksi_id) REFERENCES transaksi(id) ON DELETE CASCADE,
            FOREIGN KEY (produk_id) REFERENCES produk(id)
        )
    `);

});

module.exports = db;
