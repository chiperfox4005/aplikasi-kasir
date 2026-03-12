const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const kasir = require('./views/kasir/kasir');

let mainWindow;

/* =========================
   CREATE WINDOW
========================= */
function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,

    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  // buka login
  const loginPath = path.join(__dirname, 'views/public/login.html');

  mainWindow.loadFile(loginPath).catch(err=>{
    console.error("Gagal load login:", err);
  });

  // buka devtools untuk debug
  mainWindow.webContents.openDevTools();
}

/* =========================
   APP READY
========================= */

app.whenReady().then(() => {

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


/* =========================
   PINDAH HALAMAN
========================= */

ipcMain.on("buka-owner", () => {

mainWindow.loadFile(
path.join(__dirname,"views/Owner/dashboard.html")
);

});
ipcMain.on('buka-kasir', () => {

  if (!mainWindow) return;

  mainWindow.loadFile(
    path.join(__dirname, 'views/kasir/pos.html')
  );

});

ipcMain.on('logout', () => {

  if (!mainWindow) return;

  mainWindow.loadFile(
    path.join(__dirname, 'views/public/login.html')
  );

});


/* =========================
   KASIR IPC
========================= */

// cari barang
ipcMain.handle('cari-barang', async (event, keyword) => {
  return kasir.cariBarang(keyword);
});

// tambah transaksi
ipcMain.handle('tambah-transaksi', async (event, data) => {
  return kasir.tambahTransaksi(data.items, data.bayar);
});


/* =========================
   DATA PRODUK (sementara)
========================= */

let produkList = [];

// tambah produk
ipcMain.on('tambah-produk', (event, data) => {
  produkList.push(data);
});

// ambil semua produk
ipcMain.handle('get-produk', () => {
  return produkList;
});

// hapus produk
ipcMain.on('hapus-produk', (event, index) => {

  if (produkList[index]) {
    produkList.splice(index, 1);
  }

});


/* =========================
   DATA USER
========================= */

let userList = [

  {
    username: "admin",
    password: "admin123",
    role: "Owner"
  },

  {
    username: "kasir",
    password: "123",
    role: "Kasir"
  }

];


/* =========================
   LOGIN SYSTEM
========================= */

ipcMain.handle('login-user', (event, data) => {

  const user = userList.find(u =>
    u.username === data.username &&
    u.password === data.password
  );

  return user || null;

});