function simpanProduk(){
    let id = document.getElementById("idProduk")?.value || "";
    let nama = document.getElementById("namaProduk")?.value || "";
    
    // ✅ FIX ID SESUAI HTML - minStokProduk
    let stokInput = document.getElementById("stokProduk");
    let hargaInput = document.getElementById("hargaProduk");
    let minimumStokInput = document.getElementById("minStokProduk"); // ✅ FIX ID!
    
    // ✅ SAFE PARSING - cek null dulu
    let stok = stokInput ? parseInt(stokInput.value) || 0 : 0;
    let harga = hargaInput ? parseInt(hargaInput.value) || 0 : 0;
    let minimumStok = minimumStokInput ? parseInt(minimumStokInput.value) || 1 : 1;

    // ✅ FIX ID previewFoto (sesuai HTML)
    let previewFoto = document.getElementById("previewFoto");
    let gambar = previewFoto ? previewFoto.src : "";

    // validasi
    if(!id || !nama){
        alert("ID dan Nama produk wajib diisi");
        return;
    }

    let data = JSON.parse(localStorage.getItem("produk")) || [];

    let produkBaru = {
        id:id,
        nama:nama,
        keterangan: document.getElementById("keteranganProduk")?.value || "",
        kategori: document.getElementById("kategoriProduk")?.value || "",
        stok:stok,
        harga:harga,
        minimumStok:minimumStok,
        gambar:gambar
    };

    data.push(produkBaru);
    localStorage.setItem("produk",JSON.stringify(data));
    alert("Produk berhasil disimpan");
    clearForm();
}

function clearForm(){
    // ✅ SAFE CLEAR - cek element ada dulu
    let idInput = document.getElementById("idProduk");
    let namaInput = document.getElementById("namaProduk");
    let keteranganInput = document.getElementById("keteranganProduk");
    let hargaInput = document.getElementById("hargaProduk");
    let stokInput = document.getElementById("stokProduk");
    let minStokInput = document.getElementById("minStokProduk");
    let kategoriInput = document.getElementById("kategoriProduk");
    let jenisInput = document.getElementById("jenisProduk");
    let previewFoto = document.getElementById("previewFoto");

    if(idInput) idInput.value = "";
    if(namaInput) namaInput.value = "";
    if(keteranganInput) keteranganInput.value = "";
    if(hargaInput) hargaInput.value = "";
    if(stokInput) stokInput.value = "";
    if(minStokInput) minStokInput.value = "2";
    if(kategoriInput) kategoriInput.value = "";
    if(jenisInput) jenisInput.value = "";
    if(previewFoto) previewFoto.src = "";
}

// ================= SATU-SATUNYA FUNGSI TEST YANG TERSISA =================
function bukaKategori(){
    window.open('kategori.html', '_blank');
}

// ================= PREVIEW FOTO =================
document.addEventListener("DOMContentLoaded", function(){
    let fotoInput = document.getElementById("fotoProduk");
    if(fotoInput){
        fotoInput.addEventListener("change", function(){
            let file = this.files[0];
            if(!file) return;
            
            let reader = new FileReader();
            reader.onload = function(e){
                document.getElementById("previewFoto").src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }
});

// ================= LOAD KATEGORI & JENIS =================
function loadKategori(){
    try {
        let data = JSON.parse(localStorage.getItem("kategori")) || [];
        let select = document.getElementById("kategoriProduk");
        
        if(!select) return;
        
        select.innerHTML = `<option value="">Pilih Kategori</option>`;
        
        if(data.length === 0){
            select.innerHTML += `<option value="" disabled>Tidak ada kategori</option>`;
        } else {
            data.forEach(k => {
                select.innerHTML += `<option value="${k}">${k}</option>`;
            });
        }
    } catch(e) {
        console.error("Error load kategori:", e);
    }
}

function loadJenis(){
    try {
        let data = JSON.parse(localStorage.getItem("jenis")) || [];
        let select = document.getElementById("jenisProduk");
        
        if(!select) return;
        
        select.innerHTML = `<option value="">Pilih Jenis</option>`;
        
        if(data.length === 0){
            select.innerHTML += `<option value="" disabled>Tidak ada jenis</option>`;
        } else {
            data.forEach(j => {
                select.innerHTML += `<option value="${j}">${j}</option>`;
            });
        }
    } catch(e) {
        console.error("Error load jenis:", e);
    }
}

// ================= AUTO LOAD =================
window.addEventListener('DOMContentLoaded', function() {
    loadKategori();
    loadJenis();
});
