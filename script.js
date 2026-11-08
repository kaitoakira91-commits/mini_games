let score = 0;
let activeId = null;
let foundStatus = {};

// TIMER CONFIG (180 detik = 3 Menit)
let timeLeft = 180;
let timerInterval = null;
let currentPlayerName = "Player";
let gameStarted = false;

const heuristicData = {
    1: {
        title: "1. Tidak Ada Indikator Progres / Status",
        principle: "1. Visibility of System Status",
        desc: "Ikon notifikasi hanya menampilkan indikator samar tanpa jumlah notifikasi riil atau indikator progres sinkronisasi data yang jelas.",
        fix: "Menampilkan badge angka merah jumlah notifikasi aktif secara realtime.",
        repairedUI: `🔔 <span style="background:#f3545d; color:white; font-size:10px; border-radius:50%; padding:2px 6px; font-weight:bold;">3</span>`
    },
    2: {
        title: "2. Penggunaan Singkatan / Kode Mesin",
        principle: "2. Match Between System & Real World",
        desc: "Avatar profil hanya menampilkan singkatan abstrak 'ADM' tanpa nama jelas pengguna atau peran sosialnya.",
        fix: "Menampilkan foto avatar resmi atau inisial nama 'Hizrian Administrator'.",
        repairedUI: `<span style="font-size:11px; font-weight:bold;">HZ</span>`
    },
    3: {
        title: "3. Kurangnya Kontrol Filter / Keluar",
        principle: "3. User Control & Freedom",
        desc: "Widget User Statistics mengunci area chart tanpa memberikan kontrol rentang tanggal (filter date) atau tombol tutup/minimalisasi.",
        fix: "Menyediakan opsi pilihan filter tanggal (Weekly/Monthly) dan tombol kontrol.",
        repairedUI: `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <div class="card-header-title">User Statistics</div>
                    <div class="card-sub" style="margin-bottom:0;">Filter: Last 7 Days</div>
                </div>
                <select style="font-size:10px; border:1px solid #ccc; padding:2px 6px; border-radius:4px;"><option>Weekly</option><option>Monthly</option></select>
            </div>
            <div style="height:80px; background:#e0f2fe; border:1px solid #0284c7; margin-top:15px; border-radius:6px; display:flex; align-items:center; justify-content:center; color:#0369a1; font-size:12px; font-weight:bold;">
                📈 [ Live Interactive Chart Active ]
            </div>`
    },
    4: {
        title: "4. Ketidakseragaman Style Tombol",
        principle: "4. Consistency & Standards",
        desc: "Tombol 'Manage' dan 'ADD CUSTOMER' memiliki gaya huruf, warna latar, border-radius, dan ukuran yang bertabrakan.",
        fix: "Menyelaraskan bentuk dan gaya visual tombol aksi sesuai Design System Atlantis.",
        repairedUI: `
            <button class="btn-hero" style="border-radius:20px;">Manage</button>
            <button class="btn-hero" style="background:white; color:#1572e8; font-weight:bold; border-radius:20px;">Add Customer</button>`
    },
    5: {
        title: "5. Aksi Fatal Tanpa Konfirmasi Peringatan",
        principle: "5. Error Prevention",
        desc: "Tombol 'Reset All Sales Data' dipasang di kartu Daily Sales yang dapat tertekan tidak sengaja tanpa adanya dialog konfirmasi.",
        fix: "Menghapus tombol berbahaya dari widget utama atau memberikan dialog verifikasi keamanan.",
        repairedUI: `
            <div>
                <div style="font-size:14px; font-weight:bold;">Daily Sales</div>
                <small style="opacity:0.8; font-size:11px;">March 25 - April 02</small>
            </div>
            <h2 style="font-size:24px; margin:15px 0;">$4,578.58</h2>
            <span style="font-size:10px; opacity:0.9;">🔒 Sales record secured & auto-backed up.</span>`
    },
    6: {
        title: "6. Memaksa Pengguna Menghafal Kode ID",
        principle: "6. Recognition Rather Than Recall",
        desc: "Menu sidebar menampilkan kode teknis 'TBL_MDL_901' bukannya nama menu yang mudah dikenali seperti 'Tables Data'.",
        fix: "Mengganti kode ID dengan nama menu berbahasa manusia yang ramah.",
        repairedUI: `📋 Tables Data`
    },
    7: {
        title: "7. Pencarian Tanpa Shortcut / Fleksibilitas",
        principle: "7. Flexibility & Efficiency of Use",
        desc: "Kolom pencarian tidak menyediakan indikator pintasan keyboard (misal: 'Ctrl + K') untuk pengguna mahir.",
        fix: "Menambahkan indikator shortcut keyboard cepat 'Ctrl + K'.",
        repairedUI: `
            <span style="font-size:12px; margin-right:6px;">🔍</span>
            <input type="text" placeholder="Search (Ctrl + K) ...">`
    },
    8: {
        title: "8. Visual Clutter & Teks Distraksi",
        principle: "8. Aesthetic & Minimalist Design",
        desc: "Terdapat teks promosi yang tidak relevan ('★ PROMO PREMIUM ACTIVE ★') di dalam kartu statistik utama yang merusak konsentrasi.",
        fix: "Menghapus elemen dekoratif mengganggu agar tata letak tetap bersih dan minimalis.",
        repairedUI: `
            <div class="card-header-title">Overall statistics</div>
            <div class="card-sub">Daily information about statistics in system</div>
            <div class="circles-row">
                <div class="circle-item"><div class="circle-val c-orange">5</div><div class="circle-label">New Users</div></div>
                <div class="circle-item"><div class="circle-val c-green">36</div><div class="circle-label">Sales</div></div>
                <div class="circle-item"><div class="circle-val c-red">12</div><div class="circle-label">Subscribers</div></div>
            </div>`
    },
    9: {
        title: "9. Kode Error Kaku Tanpa Solusi",
        principle: "9. Help Users Recognize & Recover from Errors",
        desc: "Sistem menampilkan kode error 'ERR_DATA_FETCH_FAILED_0x009' tanpa memberikan penjelasan tombol 'Refresh/Coba Lagi'.",
        fix: "Menjelaskan pesan kesalahan dengan bahasa ramah serta tombol 'Muat Ulang'.",
        repairedUI: `
            <div class="card-header-title">Total income & spend statistics</div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span style="font-size:11px; color:#2bbd7e; font-weight:bold;">TOTAL INCOME: $9,782</span>
                <button style="background:#1572e8; color:white; border:none; padding:3px 8px; border-radius:4px; font-size:10px; cursor:pointer;">🔄 Refresh Data</button>
            </div>`
    },
    10: {
        title: "10. Tidak Ada Link Bantuan / FAQ",
        principle: "10. Help & Documentation",
        desc: "Halaman dashboard tidak menyediakan tautan Pusat Bantuan (*Help Center*), FAQ, atau dokumentasi panduan sistem.",
        fix: "Menambahkan tautan Help Center & Documentation di bagian footer.",
        repairedUI: `
            2026 © Atlantis Admin Template — <a href="#" style="color:#1572e8; text-decoration:none; font-weight:bold;">❓ Help Center & FAQ</a>`
    }
};

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('sidebarBackdrop').classList.toggle('show');
}

// MULAI GAME & TIMER
function startGame() {
    const inputVal = document.getElementById('player-name-input').value.trim();
    if (inputVal !== "") {
        currentPlayerName = inputVal;
    }
    
    document.getElementById('instructionOverlay').style.display = 'none';
    gameStarted = true;
    startTimer();
}

function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            finishGame(false); // Game over (waktu habis)
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    document.getElementById('timer-display').innerText = `${formattedMinutes}:${formattedSeconds}`;
}

function triggerError(id) {
    if (!gameStarted || foundStatus[id]) return;

    activeId = id;
    document.getElementById('m-title').innerText = heuristicData[id].title;
    document.getElementById('m-principle').innerText = heuristicData[id].principle;
    document.getElementById('m-desc').innerText = heuristicData[id].desc;
    document.getElementById('m-fix').innerHTML = "💡 <b>Solusi Perbaikan:</b> " + heuristicData[id].fix;

    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';

    if (activeId && !foundStatus[activeId]) {
        foundStatus[activeId] = true;
        score++;
        document.getElementById('score').innerText = score + " / 10";

        // DYNAMIC REALTIME UI REPAIR
        const itemElem = document.getElementById('item-' + activeId);
        const uiElem = document.getElementById('ui-' + activeId);

        uiElem.innerHTML = heuristicData[activeId].repairedUI;
        itemElem.classList.add('repaired-pulse');

        if (score === 10) {
            clearInterval(timerInterval);
            setTimeout(() => {
                finishGame(true); // Player berhasil selesaikan semua
            }, 600);
        }
    }
}

// SELESAI GAME & DAFTAR DASHBOARD LEADERBOARD
function finishGame(isWin) {
    savePlayerData(currentPlayerName, score, timeLeft, isWin);
    renderLeaderboard();

    const titleEl = document.getElementById('congrats-title');
    const subEl = document.getElementById('congrats-subtitle');

    if (isWin) {
        titleEl.innerText = "🏆 AUDIT SELESAI! 🏆";
        titleEl.style.color = "#2bbd7e";
        subEl.innerText = `Selamat ${currentPlayerName}! Kamu berhasil menemukan seluruh 10 kesalahan heuristic!`;
    } else {
        titleEl.innerText = "⏳ WAKTU HABIS! ⏰";
        titleEl.style.color = "#f3545d";
        subEl.innerText = `Waktu habis, ${currentPlayerName}! Kamu berhasil mengidentifikasi ${score} dari 10 kesalahan.`;
    }

    document.getElementById('congratsOverlay').style.display = 'flex';
}

// LOCALSTORAGE LEADERBOARD MANAGEMENT
function savePlayerData(name, score, timeRemaining, isWin) {
    let players = JSON.parse(localStorage.getItem('heuristic_game_players') || '[]');
    
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    players.push({
        name: name,
        score: score,
        time: formattedTime,
        status: isWin ? 'Complete' : 'Time Out',
        timestamp: new Date().getTime()
    });

    // Urutkan: Skor tertinggi dulu, lalu sisa waktu terbanyak
    players.sort((a, b) => b.score - a.score);

    localStorage.setItem('heuristic_game_players', JSON.stringify(players));
}

function renderLeaderboard() {
    const players = JSON.parse(localStorage.getItem('heuristic_game_players') || '[]');
    const tbody = document.getElementById('leaderboard-body');
    tbody.innerHTML = '';

    if (players.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748b;">Belum ada player yang join.</td></tr>`;
        return;
    }

    players.forEach((p, idx) => {
        const badgeClass = p.status === 'Complete' ? 'badge-complete' : 'badge-timeout';
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><b>${idx + 1}</b></td>
            <td style="font-weight:bold; color:#f8fafc;">${p.name}</td>
            <td><span style="color:#ffa534; font-weight:bold;">${p.score}</span> / 10</td>
            <td>${p.time}</td>
            <td><span class="badge-status ${badgeClass}">${p.status}</span></td>
        `;
        tbody.appendChild(tr);
    });
}

function clearLeaderboard() {
    if (confirm("Apakah kamu yakin ingin menghapus seluruh data player di dashboard?")) {
        localStorage.removeItem('heuristic_game_players');
        renderLeaderboard();
    }
}

document.querySelectorAll('.sidebar .nav-item').forEach(el => {
    el.addEventListener('click', () => {
        if (document.getElementById('sidebar').classList.contains('open')) toggleSidebar();
    });
});