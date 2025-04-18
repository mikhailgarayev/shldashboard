// ======================
// 1) Глобальные переменные
// ======================
const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSmaCLCDgsSsk-HY4qtkZteI60f1NxMCO4IYrFjeXoCbQRjAh0IeK0tJ4fMSScZqbS1troISgXNvssJ/pub?output=csv';

window.sheetEmployees = [];
window.pdfEmployees = [];

// ======================
// 2) Функция загрузки данных из Google Sheets
// ======================
async function loadSheetData() {
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error('Ошибка загрузки таблицы. Статус: ' + response.status);
    }
    const csvText = await response.text();

    // Парсинг CSV (предположим, что данные разделены запятыми, а первая строка – заголовки)
    const rows = csvText.trim().split('\n').map(line => line.split(','));
    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Например, если структура таблицы: Name, Platform, OnShift
    const employees = dataRows.map(row => {
      return {
        name: row[0].trim(),
        platform: row[1].trim(),
        // Предполагаем, что в третьем столбце написано "Yes" если сотрудник на смене, иначе что-то другое.
        onShift: row[2].trim().toLowerCase() === 'yes'
      };
    });

    window.sheetEmployees = employees;
    renderSheetEmployees(employees);
    // Если данные из PDF уже загружены, выполняем сравнение
    compareData();
  } catch (error) {
    document.getElementById('sheetData').innerText = 'Ошибка загрузки данных: ' + error.message;
    console.error('Ошибка loadSheetData:', error);
  }
}

function renderSheetEmployees(employees) {
  const sheetDataDiv = document.getElementById('sheetData');
  if (!employees.length) {
    sheetDataDiv.innerHTML = 'Нет данных для отображения.';
    return;
  }
  sheetDataDiv.innerHTML = employees.map(e => 
    `<div class="employee">${e.name} (Платформа: ${e.platform}), OnShift: ${e.onShift ? 'Yes' : 'No'}</div>`
  ).join('');
}

// ======================
// 3) Логика работы с PDF
// ======================
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
        const pageText = textContent.items.map(item => item.str).join(" ");
        extractedText += "\n" + pageText;
      }
      // Вызов функции для парсинга текста PDF
      processPdfText(extractedText);
    } catch (error) {
      document.getElementById('pdfData').innerText = 'Ошибка при обработке PDF: ' + error.message;
      console.error('Ошибка при загрузке PDF:', error);
    }
  }
});

// Функция парсинга текста из PDF для извлечения списка сотрудников и их статуса
function processPdfText(pdfText) {
  const lines = pdfText.split(/\n/);
  const employees = [];

  lines.forEach(line => {
    const cleanLine = line.trim();
    if (cleanLine.includes('Active') || cleanLine.includes('Away')) {
      let status = '';
      if (cleanLine.includes('Active')) status = 'Active';
      if (cleanLine.includes('Away')) status = 'Away';
      
      // Предположим, что имя сотрудника располагается перед словом со статусом
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
    pdfDataDiv.innerHTML = 'Сотрудники не найдены в PDF.';
    return;
  }
  pdfDataDiv.innerHTML = employees.map(e => 
    `<div class="employee">${e.fullName} — Статус: ${e.status}</div>`
  ).join('');
}

// ======================
// 4) Сопоставление данных
// ======================
function compareData() {
  if (!window.sheetEmployees.length || !window.pdfEmployees.length) return;

  const conflicts = [];
  const onShiftEmployees = window.sheetEmployees.filter(emp => emp.onShift);

  onShiftEmployees.forEach(sheetEmp => {
    const foundPdfEmp = window.pdfEmployees.find(pdfEmp => {
      return pdfEmp.fullName.toLowerCase().includes(sheetEmp.name.toLowerCase());
    });
    if (foundPdfEmp && foundPdfEmp.status === 'Away') {
      conflicts.push({
        name: sheetEmp.name,
        platform: sheetEmp.platform,
        pdfStatus: foundPdfEmp.status,
        pdfName: foundPdfEmp.fullName
      });
    }
  });

  renderConflicts(conflicts);
}

function renderConflicts(conflicts) {
  const conflictsDiv = document.getElementById('conflicts');
  if (!conflicts.length) {
    conflictsDiv.innerHTML = 'Нет сотрудников с конфликтом (OnShift, но статус Away).';
    return;
  }
  conflictsDiv.innerHTML = conflicts.map(c => 
    `<div class="employee"><strong>${c.name}</strong> (Платформа: ${c.platform}) — PDF: ${c.pdfName} (${c.pdfStatus})</div>`
  ).join('');
}

// ======================
// 5) Инициализация: загрузка данных из Google Sheets
// ======================
loadSheetData();
