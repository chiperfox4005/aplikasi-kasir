const db = require('../../database/database');
// ===============================
// FUNGSI TAMBAH TRANSAKSI
// ===============================
function tambahTransaksi(items, callback) {
    /*
        items = [
            { produk_id: 1, jumlah: 2 },
            { produk_id: 3, jumlah: 1 }
        ]
    */

    db.serialize(() => {
        db.run("BEGIN TRANSACTION");

        let totalTransaksi = 0;

        // Buat transaksi dulu (sementara total 0)
        db.run(
            `INSERT INTO transaksi (total) VALUES (?)`,
            [0],
            function (err) {
                if (err) {
                    db.run("ROLLBACK");
                    return callback(err);
                }

                const transaksiId = this.lastID;

                items.forEach((item) => {
                    db.get(
                        `SELECT harga, stok FROM produk WHERE id = ?`,
                        [item.produk_id],
                        (err, produk) => {
                            if (err || !produk) {
                                db.run("ROLLBACK");
                                return callback(err || new Error("Produk tidak ditemukan"));
                            }

                            if (produk.stok < item.jumlah) {
                                db.run("ROLLBACK");
                                return callback(new Error("Stok tidak cukup"));
                            }

                            const subtotal = produk.harga * item.jumlah;
                            totalTransaksi += subtotal;

                            // Simpan detail transaksi
                            db.run(
                                `INSERT INTO detail_transaksi 
                                (transaksi_id, produk_id, jumlah, subtotal) 
                                VALUES (?, ?, ?, ?)`,
                                [transaksiId, item.produk_id, item.jumlah, subtotal]
                            );

                            // Kurangi stok
                            db.run(
                                `UPDATE produk SET stok = stok - ? WHERE id = ?`,
                                [item.jumlah, item.produk_id]
                            );
                        }
                    );
                });

                // Update total transaksi
                setTimeout(() => {
                    db.run(
                        `UPDATE transaksi SET total = ? WHERE id = ?`,
                        [totalTransaksi, transaksiId],
                        (err) => {
                            if (err) {
                                db.run("ROLLBACK");
                                return callback(err);
                            }

                            db.run("COMMIT");
                            callback(null, {
                                transaksi_id: transaksiId,
                                total: totalTransaksi
                            });
                        }
                    );
                }, 300);
            }
        );
    });
}

module.exports = {
    tambahTransaksi
};
