// ===============================
// DATA & STATE
// ===============================
let keranjang = [];

const produkList = [
    { nama: "Indomie", harga: 3000, stok: 5, deskripsi: "Mie instan goreng", gambar: "https://via.placeholder.com/300" },
    { nama: "Aqua", harga: 4000, stok: 5, deskripsi: "Air mineral 600ml", gambar: "https://via.placeholder.com/300" },
    { nama: "Roti", harga: 5000, stok: 5, deskripsi: "Roti tawar fresh", gambar: "https://via.placeholder.com/300" }
];

// ===============================
// DOM
// ===============================
const produkArea = document.getElementById("produkArea");
const keranjangDiv = document.getElementById("keranjang");
const totalDiv = document.getElementById("total");
const btnBayar = document.getElementById("btnBayar");
const modalBayar = document.getElementById("modalBayar");
const areaPembayaran = document.getElementById("areaPembayaran");
const totalBayarDiv = document.getElementById("totalBayar");
const areaStruk = document.getElementById("areaStruk");

// ===============================
// RENDER PRODUK
// ===============================
function renderProduk() {
    produkArea.innerHTML = "";

    produkList.forEach((p, i) => {
        produkArea.innerHTML += `
        <div class="produk-card" data-index="${i}">
            <img src="${p.gambar}">
            <div class="produk-info">
                <h4>${p.nama}</h4>
                <div class="deskripsi">${p.deskripsi}</div>
                <div class="bottom">
                    <span>Stok: ${p.stok}</span>
                    <span>Rp ${p.harga.toLocaleString()}</span>
                </div>
            </div>
        </div>`;
    });
}

// ===============================
// TAMBAH PRODUK
// ===============================
produkArea.addEventListener("click", (e) => {
    const card = e.target.closest(".produk-card");
    if (!card) return;

    const index = parseInt(card.dataset.index);
    tambahProduk(index);
});

function tambahProduk(i) {
    const produk = produkList[i];
    if (produk.stok <= 0) {
        alert("Stok habis!");
        return;
    }

    const existing = keranjang.find(item => item.index === i);

    if (existing) {
        existing.qty++;
    } else {
        keranjang.push({ index: i, qty: 1 });
    }

    produk.stok--;
    render();
}

// ===============================
// RENDER KERANJANG
// ===============================
function render() {
    keranjangDiv.innerHTML = "";
    let total = 0;

    keranjang.forEach((item, i) => {
        const produk = produkList[item.index];
        const subtotal = produk.harga * item.qty;
        total += subtotal;

        keranjangDiv.innerHTML += `
        <div class="item">
            <b>${produk.nama}</b>
            <div class="qty-control">
                <button onclick="kurang(${i})">-</button>
                ${item.qty}
                <button onclick="tambahQty(${i})">+</button>
            </div>
            <div>Rp ${subtotal.toLocaleString()}</div>
            <div class="hapus" onclick="hapusItem(${i})">Hapus</div>
        </div>`;
    });

    totalDiv.innerText = "TOTAL: Rp " + total.toLocaleString();
    btnBayar.disabled = keranjang.length === 0;

    renderProduk();
}

// ===============================
// QTY CONTROL
// ===============================
function tambahQty(i) {
    const produk = produkList[keranjang[i].index];
    if (produk.stok <= 0) {
        alert("Stok habis!");
        return;
    }

    keranjang[i].qty++;
    produk.stok--;
    render();
}

function kurang(i) {
    const produk = produkList[keranjang[i].index];
    keranjang[i].qty--;
    produk.stok++;

    if (keranjang[i].qty <= 0) {
        keranjang.splice(i, 1);
    }

    render();
}

function hapusItem(i) {
    const produk = produkList[keranjang[i].index];
    produk.stok += keranjang[i].qty;
    keranjang.splice(i, 1);
    render();
}

// ===============================
// BUKA MODAL
// ===============================
btnBayar.addEventListener("click", () => {
    modalBayar.style.display = "flex";
    totalBayarDiv.innerText = totalDiv.innerText;
    areaPembayaran.innerHTML = "";
});

// ===============================
// PILIH METODE
// ===============================
document.querySelectorAll("[data-metode]").forEach(btn => {
    btn.addEventListener("click", () => {
        pilihMetode(btn.dataset.metode);
    });
});

function pilihMetode(metode) {
    areaPembayaran.innerHTML = "";

    const total = keranjang.reduce((a, b) =>
        a + (produkList[b.index].harga * b.qty), 0);

    if (metode === "cash") {
        areaPembayaran.innerHTML = `
        <h3>💵 Pembayaran Cash</h3>
        <input type="number" id="uangBayar" placeholder="Masukkan uang">
        <div id="kembalian"></div>
        <button onclick="hitungCash(${total})">Hitung</button>
        <button onclick="konfirmasiPembayaran('cash', ${total})">Konfirmasi</button>
        `;
    }

    else if (metode === "qris") {
        areaPembayaran.innerHTML = `
        <h3>📱 QRIS</h3>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=POS${total}">
        <br><br>
        <button onclick="konfirmasiPembayaran('qris', ${total})">
            Pembayaran Selesai
        </button>
        `;
    }

    else if (metode === "bank") {
        areaPembayaran.innerHTML = `
        <h3>🏦 Transfer Bank</h3>
        <p><b>Bank BRI</b></p>
        <p>No Rek: 1234567890</p>
        <p>Atas Nama: POS FIKRY</p>
        <button onclick="konfirmasiPembayaran('bank', ${total})">
            Konfirmasi Pembayaran
        </button>
        `;
    }
}

// ===============================
// CASH VALIDATION
// ===============================
function hitungCash(total) {
    const uang = parseInt(document.getElementById("uangBayar").value || 0);
    const kembali = document.getElementById("kembalian");

    if (uang < total) {
        kembali.innerText = "Uang kurang!";
        return;
    }

    kembali.innerText = "Kembalian: Rp " + (uang - total).toLocaleString();
}

// ===============================
// KONFIRMASI + CETAK STRUK
// ===============================
function konfirmasiPembayaran(metode, total) {

    let uang = 0;
    let kembalian = 0;

    // Validasi cash
    if (metode === "cash") {
        uang = parseInt(document.getElementById("uangBayar").value || 0);

        if (uang < total) {
            alert("Uang tidak cukup!");
            return;
        }

        kembalian = uang - total;
    }

    // ========================
    // BUAT STRUK
    // ========================
    let isi = "";
    isi += "====== STRUK PEMBAYARAN ======\n\n";

    keranjang.forEach(item => {
        const p = produkList[item.index];
        const subtotal = p.harga * item.qty;

        isi += `${p.nama} x${item.qty} = Rp ${subtotal.toLocaleString()}\n`;
    });

    isi += "\n-----------------------------\n";
    isi += "TOTAL   : Rp " + total.toLocaleString() + "\n";
    isi += "METODE  : " + metode.toUpperCase() + "\n";

    if (metode === "cash") {
        isi += "BAYAR   : Rp " + uang.toLocaleString() + "\n";
        isi += "KEMBALI : Rp " + kembalian.toLocaleString() + "\n";
    }

    isi += "TANGGAL : " + new Date().toLocaleString() + "\n";
    isi += "\n===== TERIMA KASIH =====";

    areaStruk.innerText = isi;
    areaStruk.style.display = "block";

    // ========================
    // RESET TRANSAKSI
    // ========================
    keranjang = [];
    modalBayar.style.display = "none";
    render();
}

// =====================================
// TAMBAHAN FITUR CASH (FIX FINAL)
// TANPA MENGUBAH KODE LAMA
// =====================================

let uangDibayar = 0;
let uangKembalian = 0;
let metodeDipilih = "";

// Ambil total angka dari tampilan
function ambilTotalAngka() {
    const totalText = document.getElementById("totalBayar").innerText;
    return parseInt(totalText.replace(/[^\d]/g, "")) || 0;
}

// ===============================
// PERBAIKI TAMPILAN CASH (1 BUTTON)
// ===============================
function tampilkanCashCustom() {

    metodeDipilih = "CASH";

    const total = ambilTotalAngka();
    const area = document.getElementById("areaPembayaran");

    area.innerHTML = `
        <h3>💵 Pembayaran Cash</h3>
        <p>Total Bayar: <b>Rp ${total.toLocaleString()}</b></p>

        <input 
            type="number" 
            id="inputUang" 
            placeholder="Masukkan nominal (contoh: 50000)"
            oninput="hitungKembalianLive()"
            style="width:100%; padding:12px; font-size:18px; margin:10px 0;"
        >

        <div id="hasilCash" style="margin-top:15px;"></div>
    `;
}
// ===============================
// PROSES CASH (HITUNG + STRUK)
// ===============================
function prosesCash() {
    

    const total = ambilTotalAngka();
    const uang = parseInt(document.getElementById("inputUang").value);
    const hasil = document.getElementById("hasilCash");

    if (!uang || uang < total) {
        hasil.innerHTML = "<span style='color:red;'>❌ Uang tidak cukup!</span>";
        return;
    }

    uangDibayar = uang;
    uangKembalian = uang - total;

    cetakStrukFinal();
}

// ===============================
// CETAK STRUK FINAL (ONE TRANSAKSI)
// ===============================
// ===============================
// CETAK STRUK FORMAT ASLI (FIX)
// ===============================
function cetakStrukFinal() {

    const areaStruk = document.getElementById("areaStruk");
    const total = ambilTotalAngka();
    const waktu = new Date().toLocaleString("id-ID");

    areaStruk.style.display = "block";

    let isi = "";
    isi += "====== STRUK PEMBAYARAN ======\n\n";

    // LIST PRODUK
    keranjang.forEach(item => {
        const p = produkList[item.index];
        const subtotal = p.harga * item.qty;

        isi += `${p.nama} x${item.qty} = Rp ${subtotal.toLocaleString()}\n`;
    });

    isi += "\n-----------------------------\n";
    isi += "TOTAL   : Rp " + total.toLocaleString() + "\n";
    isi += "METODE  : CASH\n";
    isi += "BAYAR   : Rp " + uangDibayar.toLocaleString() + "\n";
    isi += "KEMBALI : Rp " + uangKembalian.toLocaleString() + "\n";
    isi += "TANGGAL : " + waktu + "\n";
    isi += "\n===== TERIMA KASIH =====";

    // ONE TRANSAKSI = ONE STRUK
    areaStruk.innerText = isi;

    // Tutup modal
    document.getElementById("modalBayar").style.display = "none";

    // Reset transaksi
    keranjang = [];
    render();

    uangDibayar = 0;
    uangKembalian = 0;
}
// ===============================
// OVERRIDE TOMBOL CASH SAJA
// TANPA MENGGANGGU METODE LAIN
// ===============================
document.querySelectorAll("[data-metode='cash']").forEach(btn => {
    btn.addEventListener("click", function () {
        tampilkanCashCustom();
    });
});
// ===============================
function tampilkanCashCustom() {

    metodeDipilih = "CASH";

    const total = ambilTotalAngka();
    const area = document.getElementById("areaPembayaran");

    area.innerHTML = `
        <h3>💵 Pembayaran Cash</h3>
        <p>Total Bayar: <b>Rp ${total.toLocaleString()}</b></p>

        <input 
            type="number" 
            id="inputUang" 
            placeholder="Masukkan nominal (contoh: 50000)"
            oninput="hitungKembalianLive()"
            style="width:100%; padding:12px; font-size:18px; margin:10px 0;"
        >

        <div id="hasilCash" style="margin-top:15px;"></div>
    `;
}

function hitungKembalianLive() {

    const total = ambilTotalAngka();
    const uang = parseInt(document.getElementById("inputUang").value);
    const hasil = document.getElementById("hasilCash");

    if (!uang || uang <= 0) {
        hasil.innerHTML = "";
        return;
    }

    if (uang < total) {
        hasil.innerHTML = "<span style='color:red;'>❌ Uang kurang!</span>";
        return;
    }

    uangDibayar = uang;
    uangKembalian = uang - total;

    hasil.innerHTML = `
        <p>💰 Kembalian: <b>Rp ${uangKembalian.toLocaleString()}</b></p>
        <button onclick="cetakStrukFinal()" 
            style="width:100%; padding:10px; margin-top:10px;">
            Konfirmasi Pembayaran
        </button>
    `;
}
renderProduk();