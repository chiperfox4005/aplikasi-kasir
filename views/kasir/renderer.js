const products = [
    { id: 1, nama: "Sayur", harga: 10000 },
    { id: 2, nama: "Air", harga: 5000 },
    { id: 3, nama: "Pisang", harga: 8000 }
];
// =====================
// RENDER PRODUK
// =====================
function renderProduk() {
    const productGrid = document.getElementById("productGrid");
    productGrid.innerHTML = "";

    products.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.dataset.id = p.id;

        card.innerHTML = `
            <h4>${p.nama}</h4>
            <p>Rp ${p.harga.toLocaleString()}</p>
        `;

        card.addEventListener("click", () => tambahItem(p.id));

        productGrid.appendChild(card);
    });
}

// =====================
// TAMBAH ITEM
// =====================
function tambahItem(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        cart.splice(index, 1);
    } 
    else {
        const produk = products.find(p => p.id === id);
        cart.push({ ...produk, qty: 1 });
    }

    updateCart();
}

// =====================
// HIGHLIGHT PRODUK
// =====================
function highlightProduk() {
    document.querySelectorAll(".product-card").forEach(card => {
        const id = parseInt(card.dataset.id);
        const item = cart.find(i => i.id === id);

        if (item && item.qty > 0) {
            card.classList.add("active-product");
        } else {
            card.classList.remove("active-product");
        }
    });
}


// =====================
// UPDATE PANEL TRANSAKSI
// =====================
function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const totalHarga = document.getElementById("totalHarga");

    cartItems.innerHTML = "";
    let total = 0;
    let jumlahItem = 0;

    cart.forEach(item => {
        const subtotal = item.harga * item.qty;
        total += subtotal;
        jumlahItem += item.qty;

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
    <div>
        <strong>${item.nama}</strong><br>
        Qty: 
        <input type="number" min="0" value="${item.qty}" 
            oninput="ubahQty(${item.id}, this.value)">
    </div>
    <div>Rp ${subtotal.toLocaleString()}</div>
`;

        cartItems.appendChild(div);
    });

    cartCount.innerText = jumlahItem;
    totalHarga.innerText = total.toLocaleString();
    highlightProduk();

}

// =====================
// UBAH QTY MANUAL
// =====================
function ubahQty(id, qty) {
    qty = parseInt(qty);

    const index = cart.findIndex(i => i.id === id);
    if (index === -1) return;

    if (qty <= 0 || isNaN(qty)) {
        cart.splice(index, 1);
    } else {
        cart[index].qty = qty;
    }

    updateCart();
}


// =====================
// TOGGLE PANEL
// =====================
function toggleCart() {
    const panel = document.getElementById("cartPanel");
    panel.classList.toggle("active");
}

// =====================
// BAYAR
// =====================
function lanjutPembayaran() {
    if (cart.length === 0) {
        alert("Belum ada produk dipilih!");
        return;
    }

    alert("Transaksi berhasil!");
    cart = [];
    updateCart();
}

let cart = [];
let total = 0;

/* ===============================
   CARI PRODUK
================================= */
function cari() {
  const keyword = document.getElementById("search").value;

  window.apiKasir.cariBarang(keyword, (err, data) => {
    if (err) return alert("Error");

    const hasil = document.getElementById("hasil");
    hasil.innerHTML = "";

    data.forEach(p => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${p.nama} - Rp${p.harga}
        <button onclick="tambah(${p.id}, '${p.nama}', ${p.harga})">Tambah</button>
      `;
      hasil.appendChild(li);
    });
  });
}

/* ===============================
   TAMBAH KE CART
================================= */
function tambah(id, nama, harga) {

  let existing = cart.find(item => item.produk_id === id);

  if (existing) {
    existing.jumlah += 1;
  } else {
    cart.push({ produk_id: id, nama: nama, harga: harga, jumlah: 1 });
  }

  renderCart();
}

/* ===============================
   RENDER CART
================================= */
function renderCart() {

  const keranjang = document.getElementById("keranjang");
  keranjang.innerHTML = "";
  total = 0;

  cart.forEach((item, index) => {

    let subtotal = item.harga * item.jumlah;
    total += subtotal;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nama} x${item.jumlah}
      - Rp${subtotal}
      <button onclick="hapus(${index})">❌</button>
    `;
    keranjang.appendChild(li);
  });

  document.getElementById("total").innerText = total;
}

/* ===============================
   HAPUS ITEM
================================= */
function hapus(index) {
  cart.splice(index, 1);
  renderCart();
}

/* ===============================
   PROSES TRANSAKSI
================================= */
function proses() {

  if (cart.length === 0) return alert("Keranjang kosong!");

  const bayar = parseInt(document.getElementById("bayar").value) || 0;

  if (bayar < total) return alert("Uang kurang!");

  window.apiKasir.tambahTransaksi(cart, bayar, (err, result) => {
    if (err) return alert(err.message);

    document.getElementById("struk").innerText =
`=== STRUK ===
Total     : Rp${result.total}
Bayar     : Rp${result.bayar}
Kembalian : Rp${result.kembalian}
================`;

    cart = [];
    total = 0;
    renderCart();
  });
}
// INIT
renderProduk();
