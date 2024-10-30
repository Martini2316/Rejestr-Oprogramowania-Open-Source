
// Przełączanie widoku między główną stroną a konsolą
document.getElementById('mainViewBtn').addEventListener('click', () => {
  document.getElementById('mainView').classList.remove('hidden');
  document.getElementById('consoleView').classList.add('hidden');
  refreshTable();
});

document.getElementById('consoleViewBtn').addEventListener('click', () => {
  document.getElementById('mainView').classList.add('hidden');
  document.getElementById('consoleView').classList.remove('hidden');
});

// Przełączanie między widokami Dodaj, Znajdź, Usuń
document.getElementById('addViewBtn').addEventListener('click', () => toggleForm('addFormContainer'));
document.getElementById('deleteViewBtn').addEventListener('click', () => toggleForm('deleteFormContainer'));
document.getElementById('findViewBtn').addEventListener('click', () => toggleForm('findFormContainer'));

function toggleForm(formId) {
  document.querySelectorAll('.form-content').forEach(form => form.classList.add('hidden'));
  document.getElementById(formId).classList.remove('hidden');
}

// AVL Node and AVL Tree classes
class AVLNode {
  constructor(id, data) {
    this.id = id;
    this.data = data;
    this.height = 1;
    this.left = null;
    this.right = null;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    return x;
  }

  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    return y;
  }

  insert(node, id, data) {
    if (!node) return new AVLNode(id, data);

    if (id < node.id) node.left = this.insert(node.left, id, data);
    else if (id > node.id) node.right = this.insert(node.right, id, data);
    else return node;

    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    const balance = this.getBalance(node);

    if (balance > 1 && id < node.left.id) return this.rotateRight(node);
    if (balance < -1 && id > node.right.id) return this.rotateLeft(node);
    if (balance > 1 && id > node.left.id) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    if (balance < -1 && id < node.right.id) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  remove(node, id) {
    if (!node) return node;

    if (id < node.id) node.left = this.remove(node.left, id);
    else if (id > node.id) node.right = this.remove(node.right, id);
    else {
      if (!node.left || !node.right) {
        node = node.left || node.right;
      } else {
        let temp = this.getMinValueNode(node.right);
        node.id = temp.id;
        node.data = temp.data;
        node.right = this.remove(node.right, temp.id);
      }
    }

    if (!node) return node;

    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    const balance = this.getBalance(node);

    if (balance > 1 && this.getBalance(node.left) >= 0) return this.rotateRight(node);
    if (balance < -1 && this.getBalance(node.right) <= 0) return this.rotateLeft(node);
    if (balance > 1 && this.getBalance(node.left) < 0) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    if (balance < -1 && this.getBalance(node.right) > 0) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }

    return node;
  }

  getMinValueNode(node) {
    while (node.left) node = node.left;
    return node;
  }

  searchById(node, id) {
    if (!node) return null;
    if (node.id === id) return node;
    return id < node.id ? this.searchById(node.left, id) : this.searchById(node.right, id);
  }

  searchByName(node, name, results = []) {
    if (!node) return results;
    if (node.data.name.toLowerCase() === name.toLowerCase()) results.push(node);
    this.searchByName(node.left, name, results);
    this.searchByName(node.right, name, results);
    return results;
  }

  add(id, data) {
    this.root = this.insert(this.root, id, data);
  }

  delete(id) {
    this.root = this.remove(this.root, id);
  }

  inOrderTraversal(node, callback) {
    if (node) {
      this.inOrderTraversal(node.left, callback);
      callback(node.id, node.data);
      this.inOrderTraversal(node.right, callback);
    }
  }
}

// Inicjalizacja drzewa AVL
const avlTree = new AVLTree();
let recordId = 1;

// Funkcja do wyświetlania rekordu w tabeli
function displayRecord(id, data) {
  const tableBody = document.getElementById('softwareTableBody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${id}</td>
    <td>${data.name}</td>
    <td>${data.version}</td>
    <td>${data.releaseDate}</td>
    <td>${data.licenseType}</td>
    <td>${data.language}</td>
    <td>${data.contributors}</td>
    <td>${data.isStable}</td>
  `;
  tableBody.appendChild(newRow);
}

// Funkcja do wyczyszczenia tabeli
function clearTable() {
  document.getElementById('softwareTableBody').innerHTML = '';
}

// Funkcja do odświeżenia tabeli na podstawie AVL Tree
function refreshTable() {
  clearTable();
  avlTree.inOrderTraversal(avlTree.root, displayRecord);
}

// Funkcja do dodania rekordu
function addRecord() {
  const name = document.getElementById('softwareName').value || "-";
  const version = document.getElementById('version').value || "-";
  const releaseDate = document.getElementById('releaseDate').value || "-";
  const licenseType = document.getElementById('licenseType').value || "-";
  const language = document.getElementById('language').value || "-";
  const contributors = document.getElementById('contributors').value || "-";
  const isStable = document.getElementById('isStable').value === "true" ? "Tak" : "Nie";

  const data = { name, version, releaseDate, licenseType, language, contributors, isStable };
  avlTree.add(recordId, data);
  refreshTable();
  recordId++;
}

// Obsługa przycisku "Dodaj"
document.getElementById('addButton').addEventListener('click', addRecord);

// Funkcja do usunięcia rekordu
function deleteRecord() {
  const id = parseInt(document.getElementById('deleteId').value);
  if (isNaN(id)) {
    alert("Proszę podać poprawne ID do usunięcia.");
    return;
  }
  avlTree.delete(id);
  refreshTable();
}

// Obsługa przycisku "Usuń"
document.getElementById('deleteButton').addEventListener('click', deleteRecord);

// Funkcja do wyszukiwania po ID lub nazwie
function findRecord() {
  const query = document.getElementById('searchQuery').value;
  const isNumeric = !isNaN(query);

  clearTable();

  if (isNumeric) {
    const id = parseInt(query);
    const resultNode = avlTree.searchById(avlTree.root, id);
    if (resultNode) displayRecord(resultNode.id, resultNode.data);
    else alert("Nie znaleziono rekordu o podanym ID.");
  } else {
    const results = avlTree.searchByName(avlTree.root, query);
    if (results.length > 0) results.forEach(node => displayRecord(node.id, node.data));
    else alert("Nie znaleziono rekordów o podanej nazwie.");
  }
}

// Obsługa przycisku "Szukaj"
document.getElementById('searchButton').addEventListener('click', findRecord);

// Tablice do losowania wartości
const names = ["GitHub", "VSCode", "Docker", "NodeJS", "React", "Angular", "Linux", "Python", "MySQL", "PostgreSQL"];
const versions = ["1.0", "2.1", "3.3", "4.5", "5.0", "6.2", "7.8", "8.0", "9.4", "10.1"];
const releaseDates = ["2021-01-10", "2020-04-15", "2019-11-23", "2018-05-30", "2017-08-21", "2022-03-10", "2016-12-05", "2015-07-12", "2023-09-01"];
const licenseTypes = ["MIT", "GPL", "Apache", "BSD", "CC0", "ISC", "MPL", "CDDL", "EPL", "Zlib"];
const languages = ["JavaScript", "Python", "Java", "Ruby", "C++", "Go", "Rust", "PHP", "Kotlin", "Swift"];
const contributors = ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50"];
const isStableOptions = ["Tak", "Nie"];

// Funkcja do losowego dodania rekordu
function addRandomRecord() {
  const randomName = names[Math.floor(Math.random() * names.length)];
  const randomVersion = versions[Math.floor(Math.random() * versions.length)];
  const randomDate = releaseDates[Math.floor(Math.random() * releaseDates.length)];
  const randomLicense = licenseTypes[Math.floor(Math.random() * licenseTypes.length)];
  const randomLanguage = languages[Math.floor(Math.random() * languages.length)];
  const randomContributors = contributors[Math.floor(Math.random() * contributors.length)];
  const randomIsStable = isStableOptions[Math.floor(Math.random() * isStableOptions.length)];

  const data = {
    name: randomName,
    version: randomVersion,
    releaseDate: randomDate,
    licenseType: randomLicense,
    language: randomLanguage,
    contributors: randomContributors,
    isStable: randomIsStable
  };

  avlTree.add(recordId, data);
  refreshTable();
  recordId++;
}

function handleAddCommand(command) {
  const args = command.split(" ").slice(1);

  // Przygotowanie wartości dla każdego pola, jeśli brakujące - uzupełniamy "-"
  const name = args[0] || "-";
  const version = args[1] || "-";
  const releaseDate = args[2] || "-";
  const licenseType = args[3] || "-";
  const language = args[4] || "-";
  const contributors = args[5] || "-";
  const isStable = args[6] === "true" ? "Tak" : args[6] === "false" ? "Nie" : "-";

  const data = { name, version, releaseDate, licenseType, language, contributors, isStable };

  // Dodajemy rekord do drzewa AVL i odświeżamy tabelę
  avlTree.add(recordId, data);
  refreshTable();
  recordId++;

  const consoleOutput = document.getElementById('consoleOutput');
  consoleOutput.innerHTML += `<p>Dodano rekord: ${name}</p>`;
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}



// Obsługa przycisku "Losuj"
document.getElementById('losuj').addEventListener('click', () => {
  const count = parseInt(document.getElementById('iloscLosow').value) || 1;
  for (let i = 0; i < count; i++) {
    addRandomRecord();
  }
});


// Obsługa komend w konsoli
document.getElementById('consoleInput').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const command = event.target.value.toLowerCase();
    handleConsoleCommand(command);
    event.target.value = '';  // Czyszczenie pola po wpisaniu komendy
  }
});

function displayHelpMessage() {
  const consoleOutput = document.getElementById('consoleOutput');
  consoleOutput.innerHTML += `<p>--------------------------------------</p>`;
  consoleOutput.innerHTML += `<p>Lista dostępnych komend:</p>`;
  consoleOutput.innerHTML += `<p>/mhelp - Wyświetla listę komend</p>`;
  consoleOutput.innerHTML += `<p>/mclear - Czyści ekran konsoli</p>`;
  consoleOutput.innerHTML += `<p>/madd arg1 arg2 arg3 arg4 arg5 arg6 arg7 - Dodaje rekord z argumentami, zaczynając od nazwy (puste to "-")</p>`;
  consoleOutput.innerHTML += `<p>/mfind arg1 - Wyszukuje rekord po ID lub nazwie</p>`;
  consoleOutput.innerHTML += `<p>/mdel arg1 - Usuwa rekord po ID</p>`;
  consoleOutput.innerHTML += `<p>/mimport - Importuje rekordy z pliku</p>`;
  consoleOutput.innerHTML += `<p>/mexport - Eksportuje bazę do pliku</p>`;
  consoleOutput.innerHTML += `<p>/mref - Odświeża tabelę</p>`;
  consoleOutput.innerHTML += `<p>--------------------------------------</p>`;
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// Szczegółowe opisy dla poszczególnych komend
function displayDetailedHelp(command) {
  const consoleOutput = document.getElementById('consoleOutput');
  
  const helpMessages = {
    madd: `<p>/madd arg1 arg2 arg3 arg4 arg5 arg6 arg7 - Dodaje rekord z argumentami:</p>
           <p>arg1: Nazwa</p>
           <p>arg2: Wersja</p>
           <p>arg3: Data Wydania</p>
           <p>arg4: Typ Licencji</p>
           <p>arg5: Język Programowania</p>
           <p>arg6: Liczba Współtwórców</p>
           <p>arg7: Stabilna Wersja ("true" lub "false")</p>`,
    mfind: `<p>/mfind arg1 - Wyszukuje rekord:</p>
            <p>arg1: ID lub nazwa rekordu do wyszukania</p>`,
    mdel: `<p>/mdel arg1 - Usuwa rekord:</p>
           <p>arg1: ID rekordu do usunięcia</p>`,
    mimport: `<p>/mimport - Importuje rekordy z pliku</p>`,
    mexport: `<p>/mexport - Eksportuje wszystkie rekordy do pliku</p>`,
    mref: `<p>/mref - Odświeża tabelę z danymi</p>`
  };
  
  const helpMessage = helpMessages[command];
  consoleOutput.innerHTML += `<p>--------------------------------------</p>`;
  if (helpMessage) {
    consoleOutput.innerHTML += helpMessage;
  } else {
    consoleOutput.innerHTML += `<p>Komenda "${command}" nie istnieje.</p>`;
  }
  consoleOutput.innerHTML += `<p>--------------------------------------</p>`;
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// Dodanie komendy /mexport do eksportu z konsoli
function handleExportCommand(command) {
  const args = command.split(" ");
  const fileName = args[1] || "baza_danych";
  const format = args[2];

  if (!avlTree.root) {
    alert("Baza danych jest pusta. Brak rekordów do eksportu.");
    const consoleOutput = document.getElementById('consoleOutput');
    consoleOutput.innerHTML += `<p>Baza danych jest pusta. Brak rekordów do eksportu.</p>`;
    return;
  }

  if (format !== "json" && format !== "txt") {
    const consoleOutput = document.getElementById('consoleOutput');
    consoleOutput.innerHTML += `<p>Niepoprawny format. Użyj "json" lub "txt".</p>`;
  } else {
    exportData(fileName, format);
  }
}

// Aktualizacja obsługi komend w konsoli
function handleConsoleCommand(command) {
  const consoleOutput = document.getElementById('consoleOutput');
  const args = command.split(" ");
  const baseCommand = args[0];
  const commandArgument = args[1];

  if (baseCommand === '/mhelp') {
    if (commandArgument) {
      displayDetailedHelp(commandArgument);
    } else {
      displayHelpMessage();
    }
  } else if (baseCommand === '/mclear') {
    consoleOutput.innerHTML = '';
  } else if (baseCommand === '/madd') {
    handleAddCommand(command);
  } else if (baseCommand === '/mdel') {
    handleDeleteCommand(command);
  } else if (baseCommand === '/mfind') {
    handleFindCommand(command);
  } else if (baseCommand === '/mexport') {
    handleExportCommand(command);
  } else if (baseCommand === '/mimport') {
    handleImportCommand();
  } else {
    consoleOutput.innerHTML += `<p>Nieznana komenda: ${command}</p>`;
  }

  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// Funkcja do importowania danych z pliku JSON lub TXT
function importFromFile(file, format) {
  const reader = new FileReader();

  reader.onload = (event) => {
    const content = event.target.result;

    // Czyszczenie AVL Tree i tabeli
    avlTree.root = null;
    clearTable();

    let data;
    if (format === 'json') {
      try {
        data = JSON.parse(content);
      } catch (error) {
        alert("Błąd w formacie JSON.");
        return;
      }
    } else if (format === 'txt') {
      const rows = content.trim().split('\n').slice(1); // Pomijamy nagłówek
      data = rows.map(row => {
        const [id, name, version, releaseDate, licenseType, language, contributors, isStable] = row.split(',');
        return {
          id: parseInt(id),
          name: name || "-",
          version: version || "-",
          releaseDate: releaseDate || "-",
          licenseType: licenseType || "-",
          language: language || "-",
          contributors: contributors || "-",
          isStable: isStable.trim() === "Tak" ? "Tak" : "Nie"
        };
      });
    }

    // Dodawanie rekordów do AVL Tree
    data.forEach(record => {
      avlTree.add(record.id, {
        name: record.name,
        version: record.version,
        releaseDate: record.releaseDate,
        licenseType: record.licenseType,
        language: record.language,
        contributors: record.contributors,
        isStable: record.isStable
      });
    });

    refreshTable();

    // Potwierdzenie importu w konsoli
    const consoleOutput = document.getElementById('consoleOutput');
    consoleOutput.innerHTML += `<p>Zaimportowano dane z pliku "${file.name}".</p>`;
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
  };

  reader.readAsText(file);
}

// Funkcja pokazująca okno dialogowe do wyboru pliku
function showImportDialog() {
  const consoleOutput = document.getElementById('consoleOutput');

  // Sprawdzenie, czy są już dane w AVL
  if (avlTree.root) {
    if (!confirm("Masz już wprowadzone dane. Wprowadzenie nowego pliku wyczyści obecną tabelę. Wyeksportuj obecne dane, aby ich nie utracić.")) {
      return;
    }
  }

  // Tworzenie okna dialogowego do wyboru pliku
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json, .txt';
  fileInput.style.display = 'none';

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (fileExtension === 'json') {
        importFromFile(file, 'json');
      } else if (fileExtension === 'txt') {
        importFromFile(file, 'txt');
      } else {
        alert("Nieobsługiwany format pliku. Wybierz plik JSON lub TXT.");
      }
    }
  });

  fileInput.click();
}

// Obsługa przycisku importu
document.getElementById('importBtn').addEventListener('click', showImportDialog);

// Dodanie komendy /mimport do importu z konsoli
function handleImportCommand() {
  if (avlTree.root && !confirm("Masz już wprowadzone dane. Wprowadzenie nowego pliku wyczyści obecną tabelę. Wyeksportuj obecne dane, aby ich nie utracić.")) {
    return;
  }
  showImportDialog();
}

// Funkcja obsługująca komendę /mdel do usuwania rekordu po ID
function handleDeleteCommand(command) {
  const args = command.split(" ");
  const id = parseInt(args[1]);

  if (isNaN(id)) {
    consoleOutput.innerHTML += `<p>Błąd: Podaj prawidłowy ID do usunięcia.</p>`;
  } else {
    avlTree.delete(id);
    refreshTable();
    consoleOutput.innerHTML += `<p>Usunięto rekord o ID: ${id}</p>`;
  }
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// Funkcja obsługująca komendę /mfind do wyszukiwania rekordu po ID lub nazwie
function handleFindCommand(command) {
  const args = command.split(" ").slice(1).join(" ");
  const consoleOutput = document.getElementById('consoleOutput');

  // Sprawdzenie, czy szukamy po ID (liczba) czy po nazwie (tekst)
  const isNumeric = !isNaN(args);
  
  if (isNumeric) {
    const id = parseInt(args);
    const resultNode = avlTree.searchById(avlTree.root, id);
    if (resultNode) {
      consoleOutput.innerHTML += `<p>Znaleziono rekord o ID: ${id}</p>`;
      consoleOutput.innerHTML += `<p>Nazwa: ${resultNode.data.name}, Wersja: ${resultNode.data.version}, Data Wydania: ${resultNode.data.releaseDate}</p>`;
      consoleOutput.innerHTML += `<p>Typ Licencji: ${resultNode.data.licenseType}, Język: ${resultNode.data.language}</p>`;
    } else {
      consoleOutput.innerHTML += `<p>Nie znaleziono rekordu o ID: ${id}</p>`;
    }
  } else {
    const results = avlTree.searchByName(avlTree.root, args);
    if (results.length > 0) {
      consoleOutput.innerHTML += `<p>Znaleziono ${results.length} rekord(y) o nazwie: ${args}</p>`;
      results.forEach(node => {
        consoleOutput.innerHTML += `<p>ID: ${node.id}, Wersja: ${node.data.version}, Data Wydania: ${node.data.releaseDate}</p>`;
        consoleOutput.innerHTML += `<p>Typ Licencji: ${node.data.licenseType}, Język: ${node.data.language}</p>`;
      });
    } else {
      consoleOutput.innerHTML += `<p>Nie znaleziono rekordów o nazwie: ${args}</p>`;
    }
  }

  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}



// Funkcja tworząca i wyświetlająca okno dialogowe eksportu
function showExportDialog() {
  const consoleOutput = document.getElementById('consoleOutput');

  // Sprawdzenie, czy jest co eksportować
  if (!avlTree.root) {
    alert("Baza danych jest pusta. Brak rekordów do eksportu.");
    consoleOutput.innerHTML += `<p>Baza danych jest pusta. Brak rekordów do eksportu.</p>`;
    return;
  }

  // Tworzenie okna dialogowego
  const dialogOverlay = document.createElement('div');
  dialogOverlay.style.position = 'fixed';
  dialogOverlay.style.top = '0';
  dialogOverlay.style.left = '0';
  dialogOverlay.style.width = '100%';
  dialogOverlay.style.height = '100%';
  dialogOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  dialogOverlay.style.display = 'flex';
  dialogOverlay.style.justifyContent = 'center';
  dialogOverlay.style.alignItems = 'center';
  dialogOverlay.style.zIndex = '1000';

  const dialogBox = document.createElement('div');
  dialogBox.style.width = '300px';
  dialogBox.style.padding = '20px';
  dialogBox.style.backgroundColor = '#fff';
  dialogBox.style.borderRadius = '8px';
  dialogBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  dialogBox.innerHTML = `
    <h3>Wybierz format eksportu</h3>
    <label for="fileNameInput">Nazwa pliku:</label>
    <input type="text" id="fileNameInput" placeholder="nazwa_pliku" style="width: 100%; margin-bottom: 10px;">
    <button id="exportJsonBtn">JSON</button>
    <button id="exportTxtBtn">TXT</button>
    <button id="cancelExportBtn" style="margin-top: 10px;">Anuluj</button>
  `;

  dialogOverlay.appendChild(dialogBox);
  document.body.appendChild(dialogOverlay);

  // Obsługa przycisków eksportu
  document.getElementById('exportJsonBtn').addEventListener('click', () => {
    const fileName = document.getElementById('fileNameInput').value || "baza_danych";
    exportData(fileName, 'json');
    document.body.removeChild(dialogOverlay);
  });

  document.getElementById('exportTxtBtn').addEventListener('click', () => {
    const fileName = document.getElementById('fileNameInput').value || "baza_danych";
    exportData(fileName, 'txt');
    document.body.removeChild(dialogOverlay);
  });

  document.getElementById('cancelExportBtn').addEventListener('click', () => {
    document.body.removeChild(dialogOverlay);
  });
}

// Funkcja do eksportu danych do pliku JSON lub TXT
function exportData(fileName, format) {
  let data = [];
  
  // Zbieranie danych z drzewa AVL w formie tablicy obiektów
  avlTree.inOrderTraversal(avlTree.root, (id, record) => {
    data.push({ id, ...record });
  });

  let blob;
  if (format === 'json') {
    const jsonData = JSON.stringify(data, null, 2); // Formatowanie JSON z wcięciem
    blob = new Blob([jsonData], { type: 'application/json' });
  } else if (format === 'txt') {
    let txtData = "id,name,version,releaseDate,licenseType,language,contributors,isStable\n";
    data.forEach(record => {
      txtData += `${record.id},${record.name},${record.version},${record.releaseDate},${record.licenseType},${record.language},${record.contributors},${record.isStable}\n`;
    });
    blob = new Blob([txtData], { type: 'text/plain' });
  }

  // Tworzenie linku do pobrania
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `${fileName}.${format}`;
  downloadLink.click();

  // Zwolnienie zasobów
  URL.revokeObjectURL(url);

  // Potwierdzenie eksportu w konsoli
  const consoleOutput = document.getElementById('consoleOutput');
  consoleOutput.innerHTML += `<p>Dane wyeksportowano do pliku "${fileName}.${format}".</p>`;
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// Obsługa przycisku eksportu
document.getElementById('exportBtn').addEventListener('click', showExportDialog);
