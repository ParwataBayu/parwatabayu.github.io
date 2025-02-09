function tambahBaris(button) {
  const table = button.previousElementSibling.getElementsByTagName('tbody')[0];
  const newRow = table.insertRow(table.rows.length);

  // Kolom Nama
  const cell1 = newRow.insertCell(0);
  cell1.innerHTML = '<input type="text" class="nama">';

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
  rentangWaktuInput.readOnly = true;
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
      // Jika ini adalah baris pertama, set rentang waktu berdasarkan input menit
      const menit = parseInt(inputMenit.value);
      if (!isNaN(menit)) {
        const startTime = "10:00"; // Waktu awal default
        const startTimeDate = new Date(`1970-01-01T${startTime}:00`);
        startTimeDate.setMinutes(startTimeDate.getMinutes() + menit);
        const newEndTime = startTimeDate.toTimeString().substring(0, 5);

        rentangWaktuInput.value = `${startTime}-${newEndTime}`;
      }
    }
  });
}
