// Пример ссылки на CSV, опубликованный из Google Sheets
const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSmaCLCDgsSsk-HY4qtkZteI60f1NxMCO4IYrFjeXoCbQRjAh0IeK0tJ4fMSScZqbS1troISgXNvssJ/pubhtml';

window.sheetEmployees = [];
window.pdfEmployees = [];

// ========== 1) ЗАГРУЗКА И ПАРСИНГ CSV ==========
async function loadSheetData() {
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error('Ошибка загрузки таблицы. Статус: ' + response.status);
    }

    // Считываем весь CSV-текст
    const csvText = await response.text();

    // Разбиваем на строки (по переводу строки), а каждую строку - на ячейки (по запятой)
    const rows = csvText.trim().split('\n').map(line => line.split(','));

    // Первая строка - это заголовки
    const headers = rows[0].map(h => h.trim());

    // Все остальные строки - данные
    const dataRows = rows.slice(1);

    // Парсим конкретно столбцы A..S (индексы 0..18)
    const colStart = 0;
    const colEnd = 18;  // включительно, если хотим именно 19 столбцов
    const employees = [];

    // Проходим по каждому столбцу
    for (let c = colStart; c <= colEnd && c < headers.length; c++) {
      // Название платформы (или роли) — это заголовок столбца
      const platform = headers[c];
      // Флаг, показывающий, что мы «дошли» до блока с Away
      let isAwaySection = false;

      // Проходим по строкам
      for (let r = 0; r < dataRows.length; r++) {
        // Значение в ячейке
        const cellValue = (dataRows[r][c] || '').trim();
        if (!cellValue) {
          // Пустая ячейка — пропускаем
          continue;
        }

        const lowerCellValue = cellValue.toLowerCase();

        // Если ячейка содержит «away», значит теперь все следующие имена — Away
        if (lowerCellValue.includes('away')) {
          isAwaySection = true;
          // Не добавляем "Away" как имя
          continue;
        }

        // Если ячейка содержит «break» или «brb» — пропускаем
        if (lowerCellValue.includes('break') || lowerCellValue.includes('brb')) {
          continue;
        }

        // В остальных случаях считаем, что это имя сотрудника
        // Статус зависит от флага isAwaySection
        employees.push({
          name: cellValue,
          platform: platform,
          status: isAwaySection ? 'Away' : 'Active'
        });
      }
    }

    window.sheetEmployees = employees;
    renderSheetEmployees(employees);
    compareData(); // Попробуем сравнить с PDF, если тот уже загружен
  } catch (error) {
    document.getElementById('sheetData').innerText =
      'Ошибка загрузки данных: ' + error.message;
    console.error('loadSheetData error:', error);
  }
}

// Показать сотрудников на странице
function renderSheetEmployees(employees) {
  const sheetDataDiv = document.getElementById('sheetData');
  if (!employees.length) {
    sheetDataDiv.innerHTML = 'Нет данных для отображения.';
    return;
  }
  sheetDataDiv.innerHTML = employees.map(e => 
    `<div class="employee">${e.name} (Платформа: ${e.platform}), статус: ${e.status}</div>`
  ).join('');
}

// ======================
// Логика с PDF остаётся той же,
// где мы парсим "Active"/"Away"
// и записываем в window.pdfEmployees
// ======================

// Пример функции сравнения: если в таблице человек Active, но в PDF Away — конфликт
function compareData() {
  if (!window.sheetEmployees.length || !window.pdfEmployees.length) return;

  const conflicts = [];

  // Берём только тех, кто по таблице "Active"
  const onShiftEmployees = window.sheetEmployees.filter(emp => emp.status === 'Active');

  onShiftEmployees.forEach(sheetEmp => {
    // Ищем в pdfEmployees
    const foundPdfEmp = window.pdfEmployees.find(pdfEmp =>
      pdfEmp.fullName.toLowerCase().includes(sheetEmp.name.toLowerCase())
    );
    // Если нашли и он в PDF "Away" => конфликт
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
    conflictsDiv.innerHTML = 'Нет сотрудников, у которых конфликт (Active vs Away).';
    return;
  }
  conflictsDiv.innerHTML = conflicts.map(c =>
    `<div class="employee">
       <strong>${c.name}</strong> (Платформа: ${c.platform})
       — PDF: ${c.pdfName} (${c.pdfStatus})
     </div>`
  ).join('');
}

// Запуск (загружаем таблицу сразу при старте)
loadSheetData();
