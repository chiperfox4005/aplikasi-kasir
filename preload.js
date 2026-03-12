const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {

  /* =========================
     NAVIGASI
  ========================= */

  bukaOwner: () => ipcRenderer.send('buka-owner'),

  bukaKasir: () => ipcRenderer.send('buka-kasir'),

  logout: () => ipcRenderer.send('logout'),


  /* =========================
     LOGIN
  ========================= */

  login: (data) => ipcRenderer.invoke('login-user', data),


  /* =========================
     PRODUK
  ========================= */

  tambahProduk: (data) =>
    ipcRenderer.send('tambah-produk', data),

  getProduk: () =>
    ipcRenderer.invoke('get-produk'),

  hapusProduk: (index) =>
    ipcRenderer.send('hapus-produk', index),


  /* =========================
     KASIR
  ========================= */

  cariBarang: (keyword) =>
    ipcRenderer.invoke('cari-barang', keyword),

  tambahTransaksi: (items, bayar) =>
    ipcRenderer.invoke('tambah-transaksi', { items, bayar })

});