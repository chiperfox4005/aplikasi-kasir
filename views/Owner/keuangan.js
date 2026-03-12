function loadGrafik(){

const ctx = document.getElementById("grafikPenjualan");

if(!ctx) return;

new Chart(ctx, {

type: "bar",

data: {

labels: ["Jan","Feb","Mar","Apr"],

datasets: [{

label: "Penjualan",

data: [1200000,1500000,900000,2000000],

backgroundColor: "#3b82f6"

}]

}

});

}

window.onload = () => {

loadGrafik();

};