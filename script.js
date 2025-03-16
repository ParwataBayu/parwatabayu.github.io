// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-database.js";

// Konfigurasi Firebase Anda
const firebaseConfig = {
    apiKey: "AIzaSyAMKdi2qXvhxb_qIGpZpDM8VZ7aWqCa8Mk",
    authDomain: "waktu-pemeriksaan.firebaseapp.com",
    databaseURL: "https://waktu-pemeriksaan-default-rtdb.firebaseio.com",
    projectId: "waktu-pemeriksaan",
    storageBucket: "waktu-pemeriksaan.firebasestorage.app",
    messagingSenderId: "755312828558",
    appId: "1:755312828558:web:df27bd4d74fb30290869df",
    measurementId: "G-NHZNCXCM0D"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Fungsi untuk menyimpan data ke Firebase
function simpanData() {
    const tabels = document.querySelectorAll('.dataTable');
    tabels.forEach((tabel, index) => {
        const rows = tabel.querySelectorAll('tbody tr');
        const data = [];
        rows.forEach(row => {
            const nama = row.querySelector('.nama').value;
            const jenis = row.querySelector('.Jenis').value;
            const rentangWaktu = row.querySelector('.rentang-waktu').value;
            const inputMenit = row.querySelector('.input-menit').value;
            data.push({ nama, jenis, rentangWaktu, inputMenit });
        });
        // Simpan data ke Firebase
        set(ref(database, `tabelData/${index}`), data);
    });
}

// Fungsi untuk memuat data dari Firebase
function muatData() {
    const tabels = document.querySelectorAll('.dataTable');
    tabels.forEach((tabel, index) => {
        const dbRef = ref(database);
        get(child(dbRef, `tabelData/${index}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const tbody = tabel.querySelector('tbody');
                tbody.innerHTML = ''; // Kosongkan tbody sebelum mengisi
                data.forEach(item => {
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td><input type="text" class="nama" value="${item.nama}"></td>
                        <td><input type="text" class="Jenis" value="${item.jenis}" readonly></td>
                        <td><input type="text" class="rentang-waktu" value="${item.rentangWaktu}"></td>
                        <td><input type="number" class="input-menit" value="${item.inputMenit}" readonly></td>
                    `;
                    tbody.appendChild(newRow);
                });
            }
        }).catch((error) => {
            console.error("Error getting data: ", error);
        });
    });
}

// Panggil fungsi muatData saat halaman dimuat
window.onload = muatData;

// Tambahkan event listener untuk menyimpan data saat input berubah
document.addEventListener('input', (event) => {
    if (event.target.matches('.dataTable input')) {
        simpanData();
    }
});

// Fungsi untuk menambah baris baru
function tambahBaris(button) {
    const table = button.previousElementSibling.getElementsByTagName('tbody')[0];
    const newRow = table.insertRow(table.rows.length);

    // Kolom Nama
    const cell1 = newRow.insertCell(0);
    const namaInput = document.createElement('input');
    namaInput.type = 'text';
    namaInput.className = 'nama';
    cell1.appendChild(namaInput);

    // Jika ini bukan baris pertama, kunci input nama dan ambil nilai dari baris pertama
    const firstRow = table.rows[0];
    if (firstRow && newRow !== firstRow) {
        const firstNameInput = firstRow.querySelector('.nama');
        namaInput.value = firstNameInput.value;
        namaInput.readOnly = true;
    }

    // Kolom Jenis
    const cell2 = newRow.insertCell(1);
    const jenisInput = document.createElement('input');
    jenisInput.type = 'text';
    jenisInput.className = 'Jenis';
    jenisInput.readOnly = true;
    cell2.appendChild(jenisInput);

    // Kolom Rentang Waktu
    const cell3 = newRow.insertCell(2);
    const rentangWaktuInput = document.createElement('input');
    rentangWaktuInput.type = 'text';
    rentangWaktuInput.className = 'rentang-waktu';
    cell3.appendChild(rentangWaktuInput);

    // Jika ini bukan baris pertama, kunci input rentang waktu
    if (newRow !== firstRow) {
        rentangWaktuInput.readOnly = true;
    }

    // Kolom Input menit
    const cell4 = newRow.insertCell(3);
    const inputMenit = document.createElement('input');
    inputMenit.type = 'number';
    inputMenit.className = 'input-menit';
    cell4.appendChild(inputMenit);

    // Tentukan Jenis (BA-2 atau BA-1)
    const prevRow = newRow.previousElementSibling;
    if (prevRow) {
        const prevJenis = prevRow.querySelector('.Jenis').value;
        jenisInput.value = prevJenis === 'BA-2' ? 'BA-1' : 'BA-2';
    } else {
        jenisInput.value = 'BA-2';
    }

    // Event listener untuk otomatisasi rentang waktu
    inputMenit.addEventListener('input', function () {
        const prevRow = newRow.previousElementSibling;
        if (prevRow) {
            const prevRentangWaktu = prevRow.querySelector('.rentang-waktu').value;
            if (prevRentangWaktu) {
                const [startTime, endTime] = prevRentangWaktu.split('-');
                const endTimeDate = new Date(`1970-01-01T${endTime}:00`);

                // Tambahkan menit dari input
                const menit = parseInt(inputMenit.value);
                if (!isNaN(menit)) {
                    endTimeDate.setMinutes(endTimeDate.getMinutes() + menit);
                    const newEndTime = endTimeDate.toTimeString().substring(0, 5);

                    // Set nilai rentang waktu di baris baru
                    rentangWaktuInput.value = `${endTime}-${newEndTime}`;
                }
            }
        }
    });

    // Jika ini adalah baris pertama, hitung selisih waktu dan isi kolom Input menit
    if (newRow === firstRow) {
        const rentangWaktuInput = newRow.querySelector('.rentang-waktu');
        const inputMenit = newRow.querySelector('.input-menit');

        rentangWaktuInput.addEventListener('input', function () {
            const rentangWaktu = rentangWaktuInput.value;
            if (rentangWaktu && rentangWaktu.includes('-')) {
                const [startTime, endTime] = rentangWaktu.split('-');
                const startTimeDate = new Date(`1970-01-01T${startTime}:00`);
                const endTimeDate = new Date(`1970-01-01T${endTime}:00`);

                // Hitung selisih waktu dalam menit
                const selisihMenit = (endTimeDate - startTimeDate) / (1000 * 60);
                if (!isNaN(selisihMenit)) {
                    inputMenit.value = selisihMenit;
                }
            }
        });

        // Trigger input event untuk mengisi kolom Input menit saat pertama kali dimuat
        rentangWaktuInput.dispatchEvent(new Event('input'));
    }
}
