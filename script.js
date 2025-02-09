document.addEventListener("DOMContentLoaded", function () {
  const tables = document.querySelectorAll(".dataTable");

  tables.forEach((table) => {
    table.addEventListener("input", function (event) {
      if (event.target.classList.contains("inputMenit")) {
        hitungRentangWaktu(event.target);
      }
    });
  });
});

function hitungRentangWaktu(inputField) {
  const row = inputField.closest("tr");
  const table = row.closest("table");

  const inputMenit = parseInt(inputField.value, 10) || 0;
  const prevRow = row.previousElementSibling;

  if (prevRow) {
    const prevRentang = prevRow.querySelector(".rentangWaktu").value;
    if (prevRentang) {
      const [startTime, endTime] = prevRentang.split("-");
      const endDate = new Date(`1970-01-01T${endTime}:00`);

      // Tambahkan waktu dari input (menit)
      endDate.setMinutes(endDate.getMinutes() + inputMenit);
      const newEndTime = endDate.toTimeString().substring(0, 5);

      // Set nilai pada kolom "Rentang Waktu" (hanya di sel kuning)
      const rentangWaktuCell = row.querySelector(".rentangWaktu");
      if (rentangWaktuCell) {
        rentangWaktuCell.value = `${endTime}-${newEndTime}`;
      }
    }
  }
}

function tambahBaris(button) {
  const table = button.previousElementSibling.getElementsByTagName("tbody")[0];
  const newRow = table.insertRow();

  // Kolom Nama (kosong, hanya ditampilkan pada baris pertama tiap orang)
  const cell1 = newRow.insertCell(0);
  cell1.innerHTML = "";

  // Kolom Kegiatan
  const cell2 = newRow.insertCell(1);
  cell2.innerHTML = `<select class="kegiatan">
                        <option value="BA-2">BA-2</option>
                        <option value="BA-1">BA-1</option>
                     </select>`;

  // Kolom Rentang Waktu (editable jika dikuningkan)
  const cell3 = newRow.insertCell(2);
  cell3.innerHTML = `<input type="text" class="rentangWaktu editable" readonly>`;

  // Kolom Input Menit
  const cell4 = newRow.insertCell(3);
  cell4.innerHTML = `<input type="number" class="inputMenit" min="1">`;
}
