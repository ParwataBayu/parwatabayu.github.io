function tambahBaris(button) {
  const table = button.previousElementSibling.getElementsByTagName('tbody')[0];

  // Ambil jumlah baris untuk menentukan apakah perlu menambah nama baru
  const rowCount = table.rows.length;
  let nama = '';

  if (rowCount === 0 || table.rows[rowCount - 1].cells[0].innerText !== '') {
    // Buat baris baru untuk nama pemeriksa
    const nameRow = table.insertRow();
    const nameCell = nameRow.insertCell(0);
    nameCell.colSpan = 4;
    nameCell.contentEditable = true; // Bisa diubah langsung
    nameCell.style.fontWeight = "bold";
    nama = "Pemeriksa Baru"; // Nama default, bisa diedit

    // Baris pertama BA-2
    insertActivityRow(table, "BA-2", nama);
    insertActivityRow(table, "BA-1", "");
  } else {
    // Jika sudah ada nama, cukup tambahkan baris aktivitas
    insertActivityRow(table, "BA-2", "");
    insertActivityRow(table, "BA-1", "");
  }
}

function insertActivityRow(table, activity, nama) {
  const row = table.insertRow();
  
  // Nama hanya diisi di baris pertama kegiatan
  const cell1 = row.insertCell(0);
  if (nama) {
    cell1.rowSpan = 2; 
    cell1.innerText = nama;
    cell1.style.fontWeight = "bold";
  }

  // Kolom kegiatan
  const cell2 = row.insertCell(1);
  cell2.innerText = activity;

  // Kolom rentang waktu
  const cell3 = row.insertCell(2);
  const timeInput = document.createElement('input');
  timeInput.type = 'text';
  timeInput.className = 'rentangWaktu';
  if (activity === "BA-1") {
    timeInput.classList.add("rentang-waktu"); // Beri warna kuning
  }
  cell3.appendChild(timeInput);

  // Kolom input menit
  const cell4 = row.insertCell(3);
  if (activity === "BA-2") {
    cell4.innerText = "-";
  } else {
    const inputMenit = document.createElement('input');
    inputMenit.type = 'number';
    inputMenit.className = 'inputMenit';
    inputMenit.addEventListener('input', updateTime);
    cell4.appendChild(inputMenit);
  }
}

function updateTime() {
  const inputMenit = this;
  const row = inputMenit.closest('tr');
  const prevRow = row.previousElementSibling;
  if (!prevRow) return;

  const prevTimeInput = prevRow.cells[2].querySelector('input');
  if (!prevTimeInput || !prevTimeInput.value.includes('-')) return;

  const [startTime, endTime] = prevTimeInput.value.split('-');
  const endTimeDate = new Date(`1970-01-01T${endTime}:00`);

  endTimeDate.setMinutes(endTimeDate.getMinutes() + parseInt(inputMenit.value));
  const newEndTime = endTimeDate.toTimeString().substring(0, 5);

  row.cells[2].querySelector('input').value = `${endTime}-${newEndTime}`;
}
