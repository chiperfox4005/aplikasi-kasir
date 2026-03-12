/* ========================================
   MANAJEMEN PRODUK - PT SYSTEM
   12 KOLOM + PILIH SEMUA + PDF BARCODE
======================================== */

/* ================= GLOBAL VARIABLES ================= */

let produkTerpilih = [];
let sedangEdit = false;


/* ================= DOWNLOAD BARCODE PDF ================= */

async function downloadBarcodeFile() {

    try {

        if (typeof window.jspdf === 'undefined') {
            alert('❌ jsPDF belum load');
            return;
        }

        const { jsPDF } = window.jspdf;

        let data = JSON.parse(localStorage.getItem("produk")) || [];

        let ukuran = document.getElementById("ukuranLabel")?.value || "medium";
        let namaToko = document.getElementById("namaToko")?.value || "PT SYSTEM";


        const config = {

            small: { w:40, h:30, bw:24, bh:13, ft:6, x:34 },
            medium:{ w:69, h:42, bw:50, bh:22, ft:11, x:27 },
            large: { w:112,h:62, bw:88, bh:38, ft:16, x:20 }

        }[ukuran];


        let pdf = new jsPDF('p', 'mm', 'a4');

        let x = config.x;
        let y = 20;


        for (let i = 0; i < produkTerpilih.length; i++) {

            if (y > 270) {
                pdf.addPage();
                y = 20;
            }

            let idx = produkTerpilih[i];
            let p = data[idx] || {};


            /* ====== BARCODE CANVAS ====== */

            let scale = ukuran === 'small' ? 9 : 7;

            let canvas = document.createElement("canvas");

            canvas.width = config.bw * scale;
            canvas.height = config.bh * scale;

            JsBarcode(canvas, p.id || '000', {
                format: "CODE128",
                width: 2.6,
                height: config.bh * scale,
                displayValue: false
            });

            let img = canvas.toDataURL("image/png");


            /* ====== FRAME ====== */

            pdf.setDrawColor(150);
            pdf.setLineWidth(0.2);
            pdf.rect(x-2, y-2, config.w, config.h, 'S');


            /* ====== NAMA TOKO ====== */

            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(config.ft);

            pdf.text(
                namaToko.toUpperCase(),
                x + config.w/2,
                y + 4,
                { align:"center" }
            );


            /* ====== BARCODE ====== */

            pdf.addImage(
                img,
                "PNG",
                x + (config.w - config.bw)/2,
                y + 12,
                config.bw,
                config.bh
            );


            /* ====== NAMA PRODUK ====== */

            pdf.setFontSize(9);

            pdf.text(
                p.nama?.substring(0,25) || 'Unnamed',
                x + 3,
                y + config.h - 6
            );


            /* ====== HARGA ====== */

            pdf.setTextColor(0,120,0);
            pdf.setFont("helvetica","bold");

            pdf.text(
                "Rp" + Number(p.harga || 0).toLocaleString("id-ID"),
                x + config.w - 3,
                y + config.h - 6,
                { align:"right" }
            );


            y += config.h + 5;

        }


        pdf.save(`barcode-${ukuran}-${Date.now()}.pdf`);

        tutupForm();

    }
    catch (e) {

        alert("❌ Error: " + e.message);

    }

}



/* ================= DOWNLOAD BARCODE SATUAN ================= */

function downloadBarcodeSatuan(){

    let data = JSON.parse(localStorage.getItem("produk")) || [];

    if(!produkTerpilih.length){
        alert("Pilih produk dulu!");
        return;
    }

    produkTerpilih.forEach(idx => {

        let p = data[idx];

        let canvas = document.createElement("canvas");

        JsBarcode(canvas, p.id || "000", {
            format:"CODE128",
            width:3,
            height:80
        });

        let link = document.createElement("a");

        link.download = `barcode-${p.id}.png`;

        link.href = canvas.toDataURL("image/png");

        link.click();

    });

}



/* ================= PILIH SEMUA ================= */

function pilihSemua(){

    let checkboxes = document.querySelectorAll(".produkCheck");

    let btn = document.getElementById("btnPilihSemua");

    let semuaTerpilih = Array.from(checkboxes).every(cb => cb.checked);

    if(semuaTerpilih){

        checkboxes.forEach(cb => cb.checked = false);

        btn.textContent = "✅ Pilih Semua";
        btn.className = "btn btn-secondary";

    }
    else{

        checkboxes.forEach(cb => cb.checked = true);

        btn.textContent = "❌ Hapus Semua";
        btn.className = "btn btn-warning";

    }

}



/* ================= RENDER TABEL ================= */

function renderTabel(){

    if(sedangEdit) return;

    let data = JSON.parse(localStorage.getItem("produk")) || [];

    let tabel = document.getElementById("tabelProduk");

    if(!tabel) return;


    let html = data.map((p, i) => {

        let status = p.minimumStok && p.stok <= p.minimumStok

        ? `<span style="background:#fee2e2;color:#dc2626;padding:3px 8px;border-radius:12px;font-size:11px;">Menipis</span>`

        : `<span style="background:#d1fae5;color:#059669;padding:3px 8px;border-radius:12px;font-size:11px;">Aman</span>`;


        let harga = Number(p.harga || 0).toLocaleString("id-ID");


        return `
        <tr data-index="${i}">

        <td style="text-align:center">
        <input type="checkbox" class="produkCheck" value="${i}">
        </td>

        <td style="text-align:center">
        <img src="${p.gambar || ''}" width="50" height="50"
        style="border-radius:6px;object-fit:cover;">
        </td>

        <td style="color:#1e40af;font-weight:600;">
        ${p.id || '-'}
        </td>

        <td style="min-width:150px;font-weight:500;">
        ${p.nama || '-'}
        </td>

        <td style="color:#6b7280;font-size:13px;min-width:120px;">
        ${p.keterangan || '-'}
        </td>

        <td style="color:#059669;">
        ${p.kategori || '-'}
        </td>

        <td style="color:#7c3aed;">
        ${p.jenis || '-'}
        </td>

        <td style="color:#dc2626;font-weight:700;">
        ${p.stok || 0}
        </td>

        <td style="color:#16a34a;font-weight:700;">
        Rp ${harga}
        </td>

        <td style="text-align:center">
        ${status}
        </td>

        <td style="text-align:center">
        <div style="width:160px;height:50px;margin:0 auto;">
        <svg id="barcode-${i}" style="width:100%;height:100%;"></svg>
        </div>
        </td>

        <td>

        <div style="display:flex;gap:4px;">

        <button class="btn-edit"
        data-index="${i}"
        style="padding:4px 8px;font-size:12px;background:#3b82f6;color:white;border:none;border-radius:4px;cursor:pointer;">
        ✏️
        </button>

        <button onclick="resetStok(${i})"
        style="padding:4px 8px;font-size:12px;background:#fee2e2;color:#dc2626;border:none;border-radius:4px;cursor:pointer;">
        ⟳
        </button>

        <button onclick="hapusProduk(${i})"
        style="padding:4px 8px;font-size:12px;background:#fee2e2;color:#dc2626;border:none;border-radius:4px;cursor:pointer;">
        🗑️
        </button>

        </div>

        </td>

        </tr>

        `;

    }).join('');



    tabel.innerHTML = html;

    document.getElementById("totalProduk").textContent = data.length;

    generateBarcode(data);

    bindEventListeners();

}



/* ================= EDIT PRODUK ================= */

function editProduk(indexStr){

    sedangEdit = true;

    let i = Number(indexStr);

    let data = JSON.parse(localStorage.getItem("produk")) || [];

    let row = document.querySelector(`tr[data-index="${i}"]`);

    if(!data[i] || !row){

        sedangEdit = false;

        return alert("❌ Data tidak ditemukan");

    }

    let cells = row.children;

    cells[3].innerHTML = `<input id="editNama${i}" value="${data[i].nama||''}" style="width:100%;padding:4px;border:1px solid #d1d5db;border-radius:4px;">`;

    cells[4].innerHTML = `<input id="editKeter${i}" value="${data[i].keterangan||''}" style="width:100%;padding:4px;border:1px solid #d1d5db;border-radius:4px;">`;

    cells[7].innerHTML = `<input type="number" id="editStok${i}" value="${data[i].stok||0}" min="0" style="width:100%;padding:4px;border:1px solid #d1d5db;border-radius:4px;">`;

    cells[8].innerHTML = `<input type="number" id="editHarga${i}" value="${data[i].harga||0}" min="0" style="width:100%;padding:4px;border:1px solid #d1d5db;border-radius:4px;">`;

    cells[11].innerHTML = `
    <div style="display:flex;gap:4px;">
    <button onclick="simpanEdit(${i})" style="padding:6px 10px;background:#10b981;color:white;border:none;border-radius:4px;cursor:pointer;">💾</button>
    <button onclick="cancelEdit()" style="padding:6px 10px;background:#6b7280;color:white;border:none;border-radius:4px;cursor:pointer;">❌</button>
    </div>`;

}



/* ================= SIMPAN EDIT ================= */

function simpanEdit(i){

    let data = JSON.parse(localStorage.getItem("produk")) || [];

    data[i].nama =
    document.getElementById(`editNama${i}`)?.value.trim()
    || data[i].nama;

    data[i].keterangan =
    document.getElementById(`editKeter${i}`)?.value.trim()
    || data[i].keterangan;

    data[i].stok =
    parseInt(document.getElementById(`editStok${i}`)?.value)
    || data[i].stok;

    data[i].harga =
    parseInt(document.getElementById(`editHarga${i}`)?.value)
    || data[i].harga;

    localStorage.setItem("produk", JSON.stringify(data));

    sedangEdit = false;

    renderTabel();

}



/* ================= CANCEL EDIT ================= */

function cancelEdit(){

    sedangEdit = false;

    renderTabel();

}



/* ================= RESET & HAPUS ================= */

function resetStok(i){

    if(confirm("Reset stok ke 0?")){

        let data = JSON.parse(localStorage.getItem("produk")) || [];

        data[i].stok = 0;

        localStorage.setItem("produk", JSON.stringify(data));

        renderTabel();

    }

}


function hapusProduk(i){

    if(confirm("Hapus permanen?")){

        let data = JSON.parse(localStorage.getItem("produk")) || [];

        data.splice(i, 1);

        localStorage.setItem("produk", JSON.stringify(data));

        renderTabel();

    }

}



/* ================= HAPUS TERPILIH ================= */

function hapusTerpilih(){

    let checked = document.querySelectorAll(".produkCheck:checked");

    if(!checked.length) return alert("Pilih produk dulu!");

    if(confirm(`Hapus ${checked.length} produk?`)){

        let data = JSON.parse(localStorage.getItem("produk")) || [];

        Array.from(checked)

        .map(cb => parseInt(cb.value))

        .sort((a,b)=>b-a)

        .forEach(idx => data.splice(idx,1));

        localStorage.setItem("produk", JSON.stringify(data));

        renderTabel();

    }

}



/* ================= BARCODE ================= */

function generateBarcode(data){

    data.forEach((p,i)=>{

        try{

            let svg = document.getElementById(`barcode-${i}`);

            if(svg && p.id){

                JsBarcode(`#barcode-${i}`, p.id,{
                    format:"CODE128",
                    width:2,
                    height:50,
                    displayValue:false
                });

            }

        }catch(e){}

    });

}



/* ================= GENERATE SELECTED ================= */

function generateSelected(){

    produkTerpilih = Array.from(
        document.querySelectorAll(".produkCheck:checked")
    ).map(cb=>cb.value);

    if(!produkTerpilih.length){

        alert("Pilih produk dulu!");

        return;

    }

    bukaForm();

}



/* ================= MODAL ================= */

function bukaForm(){

    let modal = document.getElementById("barcodeForm");

    let overlay = document.getElementById("overlay");

    modal.style.display = "block";

    overlay.style.display = "block";

}

function tutupForm(){

    let modal = document.getElementById("barcodeForm");

    let overlay = document.getElementById("overlay");

    modal.style.display = "none";

    overlay.style.display = "none";

}



/* ================= EVENT LISTENER ================= */

function bindEventListeners(){

    document.querySelectorAll(".btn-edit").forEach(btn => {

        btn.onclick = () => editProduk(btn.dataset.index);

    });

}



/* ================= EXPORT ================= */

window.downloadBarcodeFile = downloadBarcodeFile;
window.downloadBarcodeSatuan = downloadBarcodeSatuan;

window.pilihSemua = pilihSemua;
window.renderTabel = renderTabel;

window.editProduk = editProduk;
window.simpanEdit = simpanEdit;
window.cancelEdit = cancelEdit;

window.resetStok = resetStok;
window.hapusProduk = hapusProduk;
window.hapusTerpilih = hapusTerpilih;

window.generateSelected = generateSelected;
window.bukaForm = bukaForm;
window.tutupForm = tutupForm;



/* ================= INIT ================= */

window.addEventListener('DOMContentLoaded', renderTabel);