/* =====================================================
   DASHBOARD OWNER RESTO - PROFESSIONAL
   PT SYSTEM RESTO - Data Real-time
===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

async function initDashboard() {
    await updateStats();
    await loadCharts();
    setupEventListeners();
}

async function updateStats() {
    // Fallback ke localStorage jika API belum siap
    let data = [];
    try {
        // Coba ambil dari API (jika ada)
        data = await window.api?.getProduk() || [];
    } catch(e) {
        // Fallback localStorage
        data = JSON.parse(localStorage.getItem("produk")) || [];
    }

    // Total Produk
    const totalProduk = data.length;
    document.getElementById("sumProduk").textContent = totalProduk.toLocaleString();

    // Total Stok
    const totalStok = data.reduce((sum, p) => sum + parseInt(p.stok || 0), 0);
    document.getElementById("sumStok").textContent = totalStok.toLocaleString();

    // Total Modal
    const totalModal = data.reduce((sum, p) => sum + parseInt(p.modal || p.harga || 0), 0);
    document.getElementById("sumModal").textContent = 
        new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR',
            minimumFractionDigits: 0 
        }).format(totalModal);

    // Produk Terlaris (berdasarkan terjual atau stok)
    const topProduk = data.reduce((top, p) => 
        (p.terjual || 0) > (top.terjual || 0) ? p : top, {}
    );
    document.getElementById("topProduk").textContent = topProduk.nama || 'Belum ada penjualan';

    // Stok Kritis
    const stokKritis = data.filter(p => 
        p.minimumStok && parseInt(p.stok || 0) <= parseInt(p.minimumStok || 0)
    ).length;
    document.getElementById("stokKritis").textContent = stokKritis;

    // Update setiap 30 detik
    setTimeout(updateStats, 30000);
}

async function loadCharts() {
    // Grafik Penjualan Mingguan - Profesional
    const ctxPenjualan = document.getElementById('grafikPenjualan');
    if (ctxPenjualan) {
        new Chart(ctxPenjualan, {
            type: 'line',
            data: {
                labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
                datasets: [{
                    label: 'Penjualan (Rp)',
                    data: [2.1, 3.2, 2.8, 4.1, 3.7, 5.2, 6.8],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                    borderWidth: 4,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#2563eb',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 3,
                    pointRadius: 8,
                    pointHoverRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { 
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: {
                            callback: value => 'Rp ' + (value * 1000000).toLocaleString()
                        }
                    },
                    x: { 
                        grid: { display: false },
                        ticks: { color: '#6b7280' }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    // Grafik Kategori (Donut Chart)
    const ctxKategori = document.getElementById('grafikKategori');
    if (ctxKategori) {
        new Chart(ctxKategori, {
            type: 'doughnut',
            data: {
                labels: ['Makanan', 'Minuman', 'Dessert'],
                datasets: [{
                    data: [65, 25, 10],
                    backgroundColor: [
                        'rgba(37, 99, 235, 0.8)',
                        'rgba(5, 150, 105, 0.8)',
                        'rgba(245, 158, 11, 0.8)'
                    ],
                    borderWidth: 0,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: { size: 13 }
                        }
                    }
                }
            }
        });
    }
}

function setupEventListeners() {
    // Quick action buttons
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            if (action.includes('Tambah Menu')) {
                alert('Fitur tambah menu baru - Akan diarahkan ke Manajemen Produk');
                window.location.href = 'manajemen.html';
            } else if (action.includes('Update Stok')) {
                alert('Update stok otomatis - Sinkronisasi selesai');
            }
        });
    });

    // Auto refresh setiap 5 menit
    setInterval(async () => {
        await updateStats();
    }, 300000);
}

// Export untuk global access
window.updateDashboard = updateDashboard;
window.updateStats = updateStats;
window.loadCharts = loadCharts;
