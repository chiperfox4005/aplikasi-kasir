// ==========================
// RENDER KATEGORI
// ==========================
function renderKategori(){

let data = JSON.parse(localStorage.getItem("kategori")) || [];

let tabel = document.getElementById("tabelKategori");

if(!tabel) return;

tabel.innerHTML = "";

data.forEach((k,index)=>{

tabel.innerHTML += `
<tr>
<td>${k}</td>
<td>
<button onclick="hapusKategori(${index})">Hapus</button>
</td>
</tr>
`;

});

}

// ==========================
// TAMBAH KATEGORI
// ==========================
function tambahKategori(){

let input = document.getElementById("inputKategori");
let nama = input.value.trim();

if(nama === ""){
alert("Kategori tidak boleh kosong");
return;
}

let data = JSON.parse(localStorage.getItem("kategori")) || [];

// cegah duplikat
if(data.includes(nama)){
alert("Kategori sudah ada");
return;
}

data.push(nama);

localStorage.setItem("kategori", JSON.stringify(data));

input.value = "";

renderKategori();

}

// ==========================
// HAPUS KATEGORI
// ==========================
function hapusKategori(index){

let data = JSON.parse(localStorage.getItem("kategori")) || [];

data.splice(index,1);

localStorage.setItem("kategori", JSON.stringify(data));

renderKategori();

}

// ==========================
// TAMBAH JENIS
// ==========================
function tambahJenis(){

let input = document.getElementById("inputJenis");
let nama = input.value.trim();

if(nama === ""){
alert("Jenis tidak boleh kosong");
return;
}

let data = JSON.parse(localStorage.getItem("jenis")) || [];

// cegah duplikat
if(data.includes(nama)){
alert("Jenis sudah ada");
return;
}

data.push(nama);

localStorage.setItem("jenis", JSON.stringify(data));

input.value = "";

renderJenis();

}

// ==========================
// RENDER JENIS
// ==========================
function renderJenis(){

let data = JSON.parse(localStorage.getItem("jenis")) || [];

let tabel = document.getElementById("tabelJenis");

if(!tabel) return;

tabel.innerHTML = "";

data.forEach((j,index)=>{

tabel.innerHTML += `
<tr>
<td>${j}</td>
<td>
<button onclick="hapusJenis(${index})">Hapus</button>
</td>
</tr>
`;

});

}

// ==========================
// HAPUS JENIS
// ==========================
function hapusJenis(index){

let data = JSON.parse(localStorage.getItem("jenis")) || [];

data.splice(index,1);

localStorage.setItem("jenis", JSON.stringify(data));

renderJenis();

}

// ==========================
// LOAD HALAMAN
// ==========================
window.onload = function(){

renderKategori();
renderJenis();

};