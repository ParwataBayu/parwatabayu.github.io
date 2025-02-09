function tambahBaris(button) {
  // Ambil tabel yang terkait dengan tombol yang diklik
  const table = button.previousElementSibling.getElementsByTagName('tbody')[0];
  const newRow = table.insertRow(table.rows.length);

  // Kolom Nama
  const cell1 = newRow.insertCell(0);
  cell1.innerHTML = '<input type="text" class="nama">';

  // Kolom BA-2
  const cell2 = newRow.insertCell(1);
  const ba2Input = document.createElement('input');
  ba2Input.type = 'text';
  ba2Input.className = 'ba2';
  cell2.appendChild(ba2Input);

  // Kolom BA-1
  const cell3 = newRow.insertCell(2);
  const ba1Input = document.createElement('input');
  ba1Input.type = 'text';
  ba1Input.className = 'ba1';
  cell3.appendChild(ba1Input);

  // Kolom Input Data (menit)
  const cell4 = newRow.insertCell(3);
  const inputMenit = document.createElement('input');
  inputMenit.type = 'number';
  inputMenit.className = 'inputMenit';
  cell4.appendChild(inputMenit);

  // Event listener untuk otomatisasi waktu
  inputMenit.addEventListener('input', function () {
    const prevRow = newRow.previousElementSibling;
    if (prevRow) {
      const prevBA1 = prevRow.querySelector('.ba1').value;
      if (prevBA1) {
        // Ambil waktu akhir dari BA-1 di baris sebelumnya
        const [startTime, endTime] = prevBA1.split('-');
        const endTimeDate = new Date(`1970-01-01T${endTime}:00`);

        // Tambahkan menit dari input
        endTimeDate.setMinutes(endTimeDate.getMinutes() + parseInt(inputMenit.value));
        const newEndTime = endTimeDate.toTimeString().substring(0, 5);

        // Set nilai BA-2 dan BA-1 di baris baru
        ba2Input.value = `${endTime}-${newEndTime}`;
        ba1Input.value = `${endTime}-${newEndTime}`;
      }
    }
  });
}
