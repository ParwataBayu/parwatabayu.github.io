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

  // Kolom jenis
  const cell2 = newRow.insertCell(1);
  const jenisInput = document.createElement('input');
  jenisInput.type = 'text';
  jenisInput.className = 'jenis';
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

  // Tentukan jenis (BA-2 atau BA-1)
  const prevRow = newRow.previousElementSibling;
  if (prevRow) {
    const prevjenis = prevRow.querySelector('.jenis').value;
    jenisInput.value = prevjenis === 'BA-2' ? 'BA-1' : 'BA-2';
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
