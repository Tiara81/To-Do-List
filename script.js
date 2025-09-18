// Ambil elemen input dan list tugas
const taskInput = document.getElementById('taskInput');
const list = document.getElementById('list-container');
const categorySelect = document.getElementById('categorySelect');
const filterSelect = document.getElementById('filterSelect');
let draggedItem = null;


// fungsi untuk menambahkan tugas baru
function addTask() {
  const category = categorySelect.value;
  const taskText = taskInput.value.trim();

  // Alert jika input kosong
  if (taskText === '') {
    alert('Please enter a task');
    return;
  }

  createTaskElement(taskText, false, category);
  taskInput.value = '';
  saveData();
}



// Membuat satu elemen tugas
function createTaskElement(text, isChecked, category) {
  let li = document.createElement('li');
  li.innerHTML =`<strong>[${category}]</strong> ${text}`;
  if (isChecked) li.classList.add('checked');
  li.setAttribute('data-category', category);

  // Tambahkan event untuk drag and drop
  li.setAttribute('draggable', 'true');

  //event saat mulai drag
  li.addEventListener('dragstart', function () {
    draggedItem = li;
    li.classList.add('dragging');
  });

  //event saat item di drop
  li.addEventListener('dragend', function () {
    li.classList.remove('dragging');
  });

  //event saat item di drag over li lain
  li.addEventListener('dragover', function (event) {
    event.preventDefault();
  });

  //event saat item di drop ke li lain
  li.addEventListener('drop', function (event) {
    event.preventDefault();
    // Jika draggedItem bukan li yang sedang di drop
    if (draggedItem !== li) {
      let siblings = Array.from(list.children);
      let draggedIndex = siblings.indexOf(draggedItem);
      let dropIndex = siblings.indexOf(li);

      // Jika draggedItem di atas li, tambahkan di bawah li
      // Jika draggedItem di bawah li, tambahkan di atas li
      if (draggedIndex < dropIndex) {
        list.insertBefore(draggedItem, li.nextSibling);
      } else {
        list.insertBefore(draggedItem, li);
      }
      saveData();
    }
  });

  // Tambahkan tombol close untuk menghapus tugas
  // Gunakan karakter × (U+00D7) untuk tombol close
  let span = document.createElement('span');
  span.innerHTML = '\u00d7';
  span.className = 'close';

  // Tambahkan event untuk menghapus tugas saat tombol close diklik
  span.onclick = function () {
    li.remove();
    saveData();
  };

  // Tambahkan event untuk menandai tugas sebagai selesai saat diklik
  // Toggle class 'checked' untuk menandai tugas selesai
  li.onclick = function () {
    li.classList.toggle('checked');
    saveData();
  };

  // Tambahkan elemen span ke li dan li ke list
  li.appendChild(span);
  list.appendChild(li);

// Simpan semua tugas ke Local Storage
function saveData() {
  const tasks = [];
  const items = list.getElementsByTagName('li');
  // Ambil semua item dari list
  for (let item of items) {
    const category = item.getAttribute('data-category') || 'General';

    // Ambil teks dari item, hapus karakter × dan trim
    const rawText = item.textContent.replace('\u00d7', '').trim();
    // Hapus teks dalam kurung siku (jika ada) dan trim
    // Misalnya, jika teksnya adalah "[Work] Task 1", akan menjadi "Task 1"
    // Regex untuk menghapus teks dalam kurung siku
    const cleanedText = rawText.replace(/\[.*?\]/, '').trim();

    // Tambahkan objek tugas ke array
    tasks.push({
      text: cleanedText,
      checked: item.classList.contains('checked'),
      category: category
    });
  }
  // Simpan array tugas ke Local Storage
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
  saveData();
} 

// Muat data dari Local Storage saat halaman dibuka
function loadData() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach(task => {
    createTaskElement(task.text, task.checked, task.category);
  });
}

// Muat data saat halaman dimuat
window.onload = loadData;

// fitur filter untuk kategori
filterSelect.addEventListener('change', function () {
  const selected = this.value;
  const items = list.getElementsByTagName('li');
  for (let item of items) {
    const category = item.getAttribute('data-category');
    item.style.display = (selected === 'All' || category === selected) ? 'flex' : 'none';
  }
});

// Tambah event Enter agar bisa submit langsung dari input pakai enter
taskInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    addTask();
  }
});
