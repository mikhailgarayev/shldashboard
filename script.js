// Укажите здесь URL опубликованного CSV
const csvUrl = 'https://docs.google.com/spreadsheets/d/1dICKOxxz9R3x8MY3FKQ9I-IwR9fBUDfMOT9PFDLloAE/pub?output=csv';

// Глобальная переменная для хранения данных из таблицы
window.sheetEmployees = [];

// Функция для загрузки и парсинга CSV
async function loadSheetData() {
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) throw new Error('Ошибка загрузки таблицы');
    const csvText = await response.text();

    // Простой парсер CSV: предполагаем, что данные разделены запятыми, а первая строка – заголовки
    const rows = csvText.trim().split('\n').map(line => line.split(','));
    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Преобразуем строки в объекты, например:
    // Предположим, что у вас в таблице есть столбцы: Name, Platform, OnShift
    const employees = dataRows.map(row => {
      return {
        name: row[0].trim(),
        platform: row[1].trim(),
        onShift: row[2].trim().toLowerCase() === 'yes'  // предоположим, здесь "Yes" обозначает, что сотрудник на смене
      };
    });

    window.sheetEmployees = employees;
    renderSheetEmployees(employees);
    // После загрузки таблицы можно попробовать сравнить с данными из PDF (если они уже загружены)
    compareData();
  } catch (error) {
    document.getElementById('sheetData').innerText = 'Ошибка загрузки данных: ' + error.message;
  }
}

// Функция для отображения данных из таблицы
function renderSheetEmployees(employees) {
  const sheetDataDiv = document.getElementById('sheetData');
  sheetDataDiv.innerHTML = employees.map(e => 
    `<div class="employee">${e.name} (Платформа: ${e.platform}), OnShift: ${e.onShift ? 'Yes' : 'No'}</div>`
  ).join('');
}

loadSheetData();

// Глобальная переменная для хранения данных из PDF
window.pdfEmployees = [];

// Обработчик кнопки загрузки PDF
document.getElementById('uploadPdfBtn').addEventListener('click', () => {
  document.getElementById('pdfFileInput').click();
});

// Обработчик выбора файла
document.getElementById('pdfFileInput').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Загружаем PDF через PDF.js
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let extractedText = "";
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        extractedText += "\n" + pageText;
      }
      
      processPdfText(extractedText);
    } catch (error) {
      document.getElementById('pdfData').innerText = 'Ошибка при обработке PDF: ' + error.message;
    }
  }
});

function compareData() {
  // Если данные из таблицы или PDF ещё не загружены – выходим
  if (!window.sheetEmployees.length || !window.pdfEmployees.length) return;

  const conflicts = [];

  // Фильтруем сотрудников из таблицы, которые отмечены как на смене (onShift === true)
  const onShiftEmployees = window.sheetEmployees.filter(emp => emp.onShift);

  // Для каждого сотрудника из таблицы ищем совпадение в PDF по имени.
  // Здесь простое сопоставление: проверяем, содержится ли имя из таблицы (в нижнем регистре) в полном имени из PDF.
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
  if (conflicts.length === 0) {
    conflictsDiv.innerHTML = `<p>Нет сотрудников, у которых конфликт (на смене, но статус Away).</p>`;
    return;
  }
  conflictsDiv.innerHTML = conflicts.map(c => 
    `<div class="employee"><strong>${c.name}</strong> (Платформа: ${c.platform}) — PDF: ${c.pdfName} (${c.pdfStatus})</div>`
  ).join('');
}

