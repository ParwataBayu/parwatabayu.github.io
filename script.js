function tambahBaris(button) {
    const table = button.previousElementSibling.getElementsByTagName('tbody')[0];

    const nameRow = table.insertRow();
    const nameCell = nameRow.insertCell(0);
    nameCell.colSpan = 4;
    nameCell.contentEditable = true;
    nameCell.style.fontWeight = "bold";
    nameCell.innerText = "Nama Pemeriksa";

    insertActivityRow(table, "BA-2");
    insertActivityRow(table, "BA-1");
}

function insertActivityRow(table, activity) {
    const row = table.insertRow();

    row.insertCell(0); // Kosong, karena nama ada di atas
    row.insertCell(1).innerText = activity;

    const rentangCell = row.insertCell(2);
    const rentangInput = document.createElement('input');
    rentangInput.type = 'text';
    rentangInput.className = activity === "BA-1" ? 'rentang-waktu' : '';
    rentangCell.appendChild(rentangInput);

    const inputCell = row.insertCell(3);
    const inputMenit = document.createElement('input');
    inputMenit.type = 'number';
    inputMenit.className = 'inputMenit';
    inputMenit.addEventListener('input', updateTime);
    inputCell.appendChild(inputMenit);
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
    row.cells[2].querySelector('input').value = `${endTime}-${endTimeDate.toTimeString().substring(0, 5)}`;
}
