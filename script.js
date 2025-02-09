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

  // Kolom Kegiatan
  const cell2 = newRow.insertCell(1);
  const kegiatanInput = document.createElement('input');
  kegiatanInput.type = 'text';
  kegiatanInput.className = 'kegiatan';
  kegiatanInput.readOnly = true;
  cell2.appendChild(kegiatanInput);

  // Kolom Rentang Waktu
  const cell3 = newRow.insertCell(2);
  const rentangWaktuInput = document.createElement('input');
  rentangWaktuInput.type = 'text';
  rentangWaktuInput.className = 'rentang-waktu';
  rentangWaktuInput.readOnly = (table.rows.length > 1) ? true : false; // Baris pertama bisa diedit
  cell3.appendChild(rentangWaktuInput);

  // Kolom Input menit
  const cell4 = newRow.insertCell(3);
  const inputMenit = document.createElement('input');
  inputMenit.type = 'number';
  inputMenit.className = 'input-menit';
  cell4.appendChild(inputMenit);

  // Tentukan kegiatan (BA-2 atau BA-1)
  const prevRow = newRow.previousElementSibling;
  if (prevRow) {
    const prevKegiatan = prevRow.querySelector('.kegiatan').value;
    kegiatanInput.value = prevKegiatan === 'BA-2' ? 'BA-1' : 'BA-2';
  } else {
    kegiatanInput.value = 'BA-2';
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
    } else {
      // Jika ini adalah baris pertama, izinkan edit manual
      rentangWaktuInput.readOnly = false;
    }
  });

  // Jika rentang waktu baris pertama diubah, update semua baris berikutnya
  if (table.rows.length === 1) {
    rentangWaktuInput.addEventListener('input', function () {
      updateRentangWaktu(table);
    });
  }
}

// Fungsi untuk update semua rentang waktu berdasarkan baris pertama
function updateRentangWaktu(table) {
  let prevEndTime = table.rows[0].querySelector('.rentang-waktu').value.split('-')[1];

  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    const inputMenit = row.querySelector('.input-menit');
    const rentangWaktu = row.querySelector('.rentang-waktu');

    if (inputMenit.value) {
      let endTimeDate = new Date(`1970-01-01T${prevEndTime}:00`);
      endTimeDate.setMinutes(endTimeDate.getMinutes() + parseInt(inputMenit.value));
      let newEndTime = endTimeDate.toTimeString().substring(0, 5);

      rentangWaktu.value = `${prevEndTime}-${newEndTime}`;
      prevEndTime = newEndTime;
    }
  }
}
