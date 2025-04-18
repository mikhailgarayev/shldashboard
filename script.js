// Пример ссылки на CSV (должна заканчиваться на pub?output=csv):
const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSmaCLCDgsSsk-HY4qtkZteI60f1NxMCO4IYrFjeXoCbQRjAh0IeK0tJ4fMSScZqbS1troISgXNvssJ/pub?output=csv';

window.sheetEmployees = [];
window.pdfEmployees = [];

// Функция для загрузки и парсинга CSV из Google Sheets
async function loadSheetData() {
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error('Ошибка загрузки таблицы. Статус: ' + response.status);
    }

    // Считываем весь CSV-текст
    const csvText = await response.text();
    // Разбиваем на строки
    const rows = csvText.trim().split('\n').map(line => line.split(','));
    // Первая строка — это заголовки столбцов
    const headers = rows[0].map(h => h.trim());
    // Остальные строки — данные
    const dataRows = rows.slice(1);

    const employees = [];

    // Проходим по каждой строке
    dataRows.forEach(row => {
      // row — это массив ячеек текущей строки
      row.forEach((cellValue, colIndex) => {
        const trimmedCell = cellValue.trim();
        // 1) Пропускаем пустые ячейки
        // 2) Пропускаем ячейки, где написано "away" (или иным образом помечены)
        if (trimmedCell && !trimmedCell.toLowerCase().includes('away')) {
          // Имя сотрудника
          const name = trimmedCell;
          // Платформа/роль — это заголовок столбца
          const platform = headers[colIndex] || 'Unknown';

          // Добавляем в массив
          employees.push({ name, platform });
        }
      });
    });

    window.sheetEmployees = employees;
    renderSheetEmployees(employees);
    compareData(); // Попробуем сразу сравнить с PDF (если он уже загружен)
  } catch (error) {
    document.getElementById('sheetData').innerText = 'Ошибка загрузки данных: ' + error.message;
    console.error('loadSheetData error:', error);
  }
}

function renderSheetEmployees(employees) {
  const sheetDataDiv = document.getElementById('sheetData');
  if (!employees.length) {
    sheetDataDiv.innerHTML = 'Нет данных для отображения.';
    return;
  }
  // Выводим каждый элемент в виде: "Имя (Платформа: X)"
  sheetDataDiv.innerHTML = employees.map(e => 
    `<div class="employee">${e.name} (Платформа: ${e.platform})</div>`
  ).join('');
}

// ---------------------------
// Работа с PDF
// ---------------------------
document.getElementById('uploadPdfBtn').addEventListener('click', () => {
  document.getElementById('pdfFileInput').click();
});

document.getElementById('pdfFileInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let extractedText = "";
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        // Собираем текст со страницы
        const pageText = textContent.items.map(item => item.str).join(" ");
        extractedText += "\n" + pageText;
      }
      processPdfText(extractedText);
    } catch (error) {
      document.getElementById('pdfData').innerText = 'Ошибка при обработке PDF: ' + error.message;
      console.error('PDF processing error:', error);
    }
  }
});

// Извлекаем из текста PDF сотрудников со статусами
function processPdfText(pdfText) {
  const lines = pdfText.split(/\n/);
  const employees = [];

  lines.forEach(line => {
    const cleanLine = line.trim();
    if (cleanLine.includes('Active') || cleanLine.includes('Away')) {
      let status = '';
      if (cleanLine.includes('Active')) status = 'Active';
      if (cleanLine.includes('Away')) status = 'Away';
      // Предположим, имя — всё, что перед словом "Active" или "Away"
      const parts = cleanLine.split(status);
      const fullName = parts[0].trim();
      if (fullName) {
        employees.push({ fullName, status });
      }
    }
  });

  window.pdfEmployees = employees;
  renderPdfEmployees(employees);
  compareData();
}

function renderPdfEmployees(employees) {
  const pdfDataDiv = document.getElementById('pdfData');
  if (!employees.length) {
    pdfDataDiv.innerHTML = 'Не найдены сотрудники в PDF.';
    return;
  }
  pdfDataDiv.innerHTML = employees.map(e => 
    `<div class="employee">${e.fullName} — Статус: ${e.status}</div>`
  ).join('');
}

// ---------------------------
// Сопоставление данных
// ---------------------------
function compareData() {
  // Не сравниваем, если один из массивов ещё пуст
  if (!window.sheetEmployees.length || !window.pdfEmployees.length) return;

  const conflicts = [];

  // Перебираем всех из таблицы (они считаются "на смене")
  window.sheetEmployees.forEach(sheetEmp => {
    // Ищем в pdfEmployees
    const foundPdfEmp = window.pdfEmployees.find(pdfEmp => {
      // Простейшее сравнение: проверяем, входит ли часть имени из таблицы в fullname из PDF
      return pdfEmp.fullName.toLowerCase().includes(sheetEmp.name.toLowerCase());
    });
    // Если человек найден и у него статус "Away" — конфликт
    if (foundPdfEmp && foundPdfEmp.status === 'Away') {
      conflicts.push({
        name: sheetEmp.name,
        platform: sheetEmp.platform,
        pdfName: foundPdfEmp.fullName,
        pdfStatus: foundPdfEmp.status
      });
    }
  });

  renderConflicts(conflicts);
}

function renderConflicts(conflicts) {
  const conflictsDiv = document.getElementById('conflicts');
  if (!conflicts.length) {
    conflictsDiv.innerHTML = 'Нет сотрудников, у которых конфликт (на смене, но статус Away).';
    return;
  }
  conflictsDiv.innerHTML = conflicts.map(c => 
    `<div class="employee"><strong>${c.name}</strong> (Платформа: ${c.platform}) — PDF: ${c.pdfName} (${c.pdfStatus})</div>`
  ).join('');
}

// ---------------------------
// Запуск: подгружаем таблицу
// ---------------------------
loadSheetData();
