</script>
  </head>
  <body class="hidden">
      <!-- Header -->
      <header class="dashboard-header">
  <!-- 1) Левая часть: бургер + заголовок -->
  <div class="d-flex align-items-center gap-3">
    <div class="hamburger-menu" id="hamburger-menu">
      <span style="font-size: 24px; cursor: pointer;">☰</span>
    </div>
    <h1 class="mb-0" style="font-size: 1.3rem;">
      Support Monitoring Dashboard
    </h1>
  </div>

  <!-- 2) Центральная часть: переключатели + таймер -->
  <div class="d-flex align-items-center flex-wrap header-gap flex-grow-1 justify-content-end">
    <!-- Do Not Disturb -->
    <div class="toggle-container" id="dnd-toggle-container">
      <span class="toggle-label">Do not Disturb</span>
      <label class="dnd-switch">
        <input type="checkbox" id="dnd-toggle" />
        <span class="slider"></span>
      </label>
    </div>

    <!-- Bell -->
    <div id="notification-bell" style="position:relative; cursor:pointer; margin-right:1rem;">
      <img
        src="https://www.svgrepo.com/show/525245/bell-off.svg"
        alt="Notifications"
        title="Notifications"
        style="width:24px; height:24px;"
      />
      <span
        id="notification-count"
        style="position:absolute; top:-4px; right:-4px; background:#dc3545;
               color:#fff; border-radius:50%; padding:2px 6px; font-size:0.7rem;
               display:none;"
      >0</span>
      <div id="notifications-panel" class="notifications-dropdown"></div>
    </div>
    <!-- Notifications dropdown panel -->

    <!-- Theme toggle -->
    <div class="d-flex align-items-center gap-2">
      <span>Theme:</span>
      <label class="theme-switch mb-0" style="margin-left: 8px;">
        <input type="checkbox" id="theme-checkbox" />
        <span class="slider"></span>
      </label>
    </div>

    <!-- Refresh -->
    <div class="refresh-section d-flex align-items-center gap-2 mr-3">
      <span id="timer-label">
        Refresh in: <span id="countdown">15</span>s
      </span>
      <img
        id="refresh-icon"
        src="https://www.svgrepo.com/show/168563/refresh.svg"
        alt="Refresh"
        title="Refresh now"
        style="width:24px; height:24px; cursor:pointer;"
        onclick="refreshNow()"
      />
    </div>
  </div>

  <!-- 3) Правая часть: имя + logout -->
  <div class="d-flex align-items-center gap-2">
    <span id="user-display-name" class="small text-muted"></span>
    <img
      id="logout-btn"
      src="./log-out.svg"
      alt="Log Out"
      title="Log Out"
      style="width:22px; height:22px; cursor:pointer; margin-left:8px;"
    />
  </div>
</header>

    <!-- Grid container -->
    <div class="dashboard-layout">

      <!-- Sidebar -->
      <aside class="sidebar">
        <div id="sidebar">
          <!-- новый close-btn с SVG-стрелкой -->
          <div class="close-btn" id="sidebar-close" title="Close sidebar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24" height="24"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 
                  5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 
                  1 0-.708l6-6a.5.5 0 0 1 .708 0z"
              />
            </svg>
          </div>
          <a href="https://mikhailgarayev.github.io/shldashboard/shifts.html">🗓️ Today`s Shifts by Platform</a>
          <a href="https://mikhailgarayev.github.io/shldashboard/allocations.html">📈 Allocation stats</a>
          <a href="https://my.yigim.az/login" target="_blank">📊 YIGIM Dashboard</a>
          <a href="https://wolt-prod.datadoghq.eu/dashboard/zpt-745-5da/city-health-dashboard-template-24h-aze?fromUser=false&refresh_mode=sliding&tpl_var_area_name%5B0%5D=baku&view=spans&from_ts=1745505436253&to_ts=1745507236253&live=true" target="_blank">📈 Datadog Dashboard</a>
          <a href="https://wolt-prod.datadoghq.eu/dashboard/y66-xdi-4xy/payments---authorizations?fromUser=false&fullscreen_end_ts=1745567771563&fullscreen_paused=false&fullscreen_refresh_mode=sliding&fullscreen_section=overview&fullscreen_start_ts=1745566871563&fullscreen_widget=2003408243236226&refresh_mode=sliding&view=spans&from_ts=1745556684337&to_ts=1745560284337&live=true" target="_blank">📈 Datadog Payment Dashboard</a>
          <a href="https://ops.wolt.com/city-states?country=AZE" target="_blank">🏙️ City States</a>
          <a href="https://ops.wolt.com/city-tools" target="_blank">🛠️ City Tools</a>
          <a href="https://ops.wolt.com/support/converse/admin/users" target="_blank">🧭 Converse Admin Panel</a>
          <a href="https://wo.lt/tracker" target="_blank">⚙️ Away employees tracker</a>
          <a href="https://dashboard.aircall.io" target="_blank">📞 Aircall Dashboard</a>
          <a href="https://app.getguru.com/dashboard" target="_blank">📚 Guru</a>
          <a href="https://wo.lt/dashboard" target="_blank">📩 Video dashboard</a>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Filters -->
     <!-- Центр: фильтры -->
     <div class="filters-wrapper d-flex flex-wrap align-items-center flex-grow-1 justify-content-center header-gap">
      <!-- Статус -->
      <select id="status-filter" class="filter-dropdown">
        <option value="both">Status</option>
        <option value="active">Active</option>
        <option value="away">Away</option>
      </select>
    
      <!-- Платформы (bootstrap-select) -->
      <select
        id="platform-dropdown"
        class="selectpicker"
        multiple
        data-live-search="true"
        title="Platform"
        data-width="auto"
        data-style="filter-dropdown"
      >
        <option value="all" selected>All platforms</option>
        <option value="CS">CS</option>
        <option value="CS/Post order">CS/Post order</option>
        <option value="PSR">PSR</option>
        <option value="SiMo">SiMo</option>
        <option value="Aircall">Aircall</option>
        <option value="Venue">Venue</option>
        <option value="Trainee">Trainee</option>
        <option value="ST">ST</option>
      </select>
    
      <!-- Reallocate фильтр -->
      <select id="realloc-filter" class="filter-dropdown">
        <option value="all">Reallocate: All</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    
      <!-- Language фильтр -->
      <select id="lang-filter" class="filter-dropdown">
        <option value="all">Language: All</option>
        <option value="two">Bilingual</option>
        <option value="three">Trilingual</option>
      </select>
    
      <!-- Breaks фильтр -->
      <select id="break-filter" class="filter-dropdown">
        <option value="upcoming">Breaks: Upcoming</option>
        <option value="all">Breaks: All</option>
      </select>
    
      <!-- Поиск по имени -->
      <input
        type="text"
        id="employee-search"
        placeholder="Search..."
        class="search-input"
      />
    
      <!-- Новый селект для Find Candidate -->
      <select id="target-platform" class="filter-dropdown">
        <option value="">→ Reallocate to..</option>
      </select>
      <button id="find-candidate" class="btn btn-outline-primary">Find candidate</button>
      <div id="candidate-result" style="margin:1rem 0;"></div>
    </div>

        <!-- Stats Cards -->
        <!-- 1) Общие карточки (On shift now, Should be, Not here, WNATS, Weather) -->
        <div id="summary-general"></div>

        <!-- 2) Только платформенные статы (CS, CS/Post Order, PSR, SiMo, Aircall, Venue, ST) -->
        <div id="summary-platforms"></div>

        <!-- 3) Платформенные platform-card -->
        <div id="platforms-container" class="platforms-row"></div>

      </main>

      <!-- Right Panel: Breaks & Shift-Overs -->
      <aside class="right-panel">
        <div id="shift-overs-section" class="alert-card"><h2>⏳ Upcoming Shift-Overs</h2><div id="shift-overs-app" class="alert-content">Loading...</div></div>
        <div id="breaks-section" class="alert-card"><h2>⏰ Breaks</h2><div id="breaks-app" class="alert-content">Loading...</div></div>
      </aside>

    </div> <!-- /.dashboard-layout -->

    <!-- Modals -->
  </div>
  <!-- Модальное окно сотрудника -->
  <div id="modal-overlay"></div>
  <div
    id="employee-modal">
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 20px 20px 0 20px;">
      <div style="display: flex; align-items: center;">
        <img 
        id="modal-emp-avatar" 
        src="https://i.ibb.co/YrbxqCn/favicon.jpg" 
        alt="Avatar" 
        style="width: 60px; height: 60px; border-radius: 50%; margin-right: 15px;"
      />
        <div>
          <h5 id="modal-emp-name" style="margin: 0; font-weight: 600;">Employee Name</h5>
          <small id="modal-emp-email" style="color: #888;">employee.email@wolt.com</small>
        </div>
      </div>
      <span class="close-btn" id="modal-close" style="cursor: pointer; font-size: 24px; color: #999;">&times;</span>
    </div>
    <!-- Информация -->
    <div style="padding: 15px 20px 0 20px; text-align: left;">
      <div style="margin-bottom: 10px;">
        <strong>Role:</strong>
        <span id="modal-emp-role">Support Associate</span>
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Prime platform:</strong>
        <span id="modal-emp-prime">CS</span>
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Preferred platform:</strong>
        <span id="modal-emp-pref">PSR</span>
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Can reallocate?:</strong>
        <span id="modal-emp-realloc">Yes</span>
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Language:</strong>
        <span id="modal-emp-languages">AZ RUGB</span>
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Capacity:</strong>
        <span id="modal-emp-capacity">—</span>
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Shift:</strong>
        <span id="modal-emp-shift">—</span>
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Break:</strong>
        <span id="modal-emp-break">—</span>
      </div>
      <div style="margin-bottom: 10px;">
        <strong>Platform changes today:</strong>
        <span id="modal-platform-count">–</span>
      </div>
      <ul id="modal-platform-list" style="margin-left: 20px; font-size:0.9rem;"></ul>

    </div>
    <!-- Кнопки -->
    <div style="padding: 20px; text-align: right;">
      <button id="modal-inbox-link" class="btn btn-primary" style="margin-right: 10px;">Open Inbox</button>
      <button id="modal-admin-link" class="btn btn-outline-primary">Admin Panel</button>
    </div>
  </div>


    <!-- Секция с двумя карточками: Shift-Overs и Breaks -->
    <div
  id="alerts-section"
  class="d-flex flex-wrap gap-4 justify-content-center my-4 px-3"
  style="align-items: stretch;"
>

    <div
      class="modal fade"
      id="candidateModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="candidateModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="candidateModalLabel">Recommended candidate</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" id="candidateModalBody">
            <!-- сюда JS вставляет результат -->
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    <!-- ================================================== -->
      
      
      <!-- Подключаем jQuery, Bootstrap JS и Bootstrap-Select JS -->
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.2/dist/js/bootstrap.bundle.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-select/1.13.18/js/bootstrap-select.min.js"></script>
      <script>
        // ========== Do Not Disturb ==========
        let doNotDisturb = localStorage.getItem('doNotDisturb') === 'true';

        function setDoNotDisturb(value) {
          doNotDisturb = value;
          localStorage.setItem('doNotDisturb', value);
        }

        // чтобы не спамить повторно
        // очередь для панели в интерфейсе
        const notificationQueue = [];


        // -------------- begin shift‐badge config --------------

        // map платформ → bootstrap‐класс бейджа

        // вместо platformBadgeClasses
        const shiftBadgeClasses = {
        "CS":      "badge-primary",
        "CS PO":   "badge-danger",
        "PSR":     "badge-success",
        "Simo":    "badge-info",
        "Aircall": "badge-warning",
        "Venue":   "badge-warning",
        "Trainee": "badge-light text-dark",
        "ST":      "badge-dark",
        "SUMO":    "badge-secondary",
      };

      const shiftDisplayNames = {
      "CS/Post order": "CS PO",
      "CS/Post Order": "CS PO",
      "CS / Post order": "CS PO",
      "CS / Post Order": "CS PO",
      "Special task": "ST",
      "SiMo/Aircall": "SUMO",
    };
        // возвращает строку вида "06:00-15:00" для имени
        // вместо "getEmployeeShift" — возвращаем название смены, а не время
        function getEmployeeShiftName(empName) {
          const rec = window.shiftsQuinyxData.find(r =>
            r.name.toLowerCase() === empName.toLowerCase()
          );
          return rec?.platform || "";
        }


        // -------------- end shift‐badge config --------------

        // ===============================
        // WEATHER SECTION WITH CACHING & EMOJI
        const OPENWEATHER_API_KEY = "f97220cfb6bcefa391405990e7b9825d";
        const STORAGE_KEY = "notifiedEmptyPlatforms";

        let notifiedEmpty = new Set(
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
);

/**
 * Универсальная функция: запрашивает погоду для произвольного города и кладёт
 * результат в указанные элементы.
 *
 * @param {string} city       — строка вида "Ganja,AZ"
 * @param {string} tempElemId — id блока для температуры (например "temp-ganja")
 * @param {string} windElemId — id блока для ветра       (например "wind-ganja")
 */
async function fetchWeatherFor(city, tempElemId, windElemId) {
  const cacheKey     = city + "_weatherData";
  const cacheTimeKey = city + "_weatherTimestamp";
  const now          = Date.now();
  const cacheTTL     = 15 * 60 * 1000; // 15 минут

  let data;
  const rawData      = localStorage.getItem(cacheKey);
  const rawTs        = localStorage.getItem(cacheTimeKey);

  if (rawData && rawTs && now - rawTs < cacheTTL) {
    data = JSON.parse(rawData);
  } else {
    const url = `https://api.openweathermap.org/data/2.5/weather` +
                `?q=${encodeURIComponent(city)}` +
                `&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Weather API error for", city, res.statusText);
      return;
    }
    data = await res.json();
    localStorage.setItem(cacheKey, JSON.stringify(data));
    localStorage.setItem(cacheTimeKey, now);
  }

  // Build display strings
  const tempRaw   = data.main?.temp;
  const windRaw   = data.wind?.speed;
  const emoji     = (() => {
    const cond = data.weather?.[0]?.main;
    switch(cond){
      case "Clear":       return "☀️";
      case "Clouds":      return "☁️";
      case "Rain": 
      case "Drizzle":     return "🌧️";
      case "Thunderstorm":return "⛈️";
      case "Snow":        return "❄️";
      default:            return "";
    }
  })();

  const tempText = (tempRaw != null)
    ? `${Math.round(tempRaw)} °C ${emoji}`
    : "-- °C";
  const windText = (typeof windRaw === "number")
    ? `${Math.round(windRaw*10)/10} m/s`
    : "-- m/s";

  // Вставляем в DOM
  document.getElementById(tempElemId).textContent = tempText;
  document.getElementById(windElemId).textContent = windText;
}

        
        // ===============================

        // Информация по платформам
        const platformInfo = {
          "CS":
            "Click on the link to open the CS platform.\nClick on employee name to open their profile.",
          "CS/Post order":
            "Click on the link to open the CS PO AZE platform.\nClick on employee name to open their profile.",
          PSR: "Click on the link to open the PSR platform.\nClick on employee name to open their profile.",
          SiMo: "Click on the link to open the Support Inbox.\nClick on employee name to open their profile.",
          Aircall:
            "Click on the link to open the CS platform.\nClick on employee name to open their profile.\n You can see employee's status in the Aircall.",
          Venue:
            "Click on the link to open the Venue platform.\nClick on employee name to open their profile.",
          Trainee: "Click on employee name to open their profile.",
          ST: "Click on employee name to open their profile."
        };

        let fetchedData = null;
        let currentSearchTerm = "";
        let currentStatusFilter = "both";
        let currentPlatformFilter = ["all"];
        let currentReallocFilter = "all";
        let currentLangFilter = "all";
        let currentBreakFilter = "upcoming";

        const SPREADSHEET_ID = "1dICKOxxz9R3x8MY3FKQ9I-IwR9fBUDfMOT9PFDLloAE";
        const SHIFT_RANGE = "list1!AT5:BH47";
        const RANGE = "list1!A1:BJ100";
        const RESPONSIBLES_RANGE = "list1!B5:C27";
        const BREAKS_RANGE = "prebreaks!A1:D80";
        const SHIFT_QUINYX_RANGE = "shiftsquinyx!B3:C"; 

        let employeeData = {};

        const platforms = [
          {
            name: "CS",
            url: "https://ops.wolt.com/support/converse/conversations?conversationListId=6643245bfadf62c6edc28feb",
            colIndexNames: 3,
            colIndexData: 4,
            rowActiveNamesStart: 4,
            rowActiveNamesEnd: 27,
            rowAwayNamesStart: 28,
            rowAwayNamesEnd: 47
          },
          {
            name: "CS/Post order",
            url: "https://ops.wolt.com/support/converse/conversations?conversationListId=664324a0510ac011feaa798c",
            colIndexNames: 5,
            colIndexData: 6,
            rowActiveNamesStart: 4,
            rowActiveNamesEnd: 27,
            rowAwayNamesStart: 28,
            rowAwayNamesEnd: 47
          },
          {
            name: "PSR",
            url: "https://ops.wolt.com/support/converse/conversations?conversationListId=6567a44af7d470550b11dc68",
            colIndexNames: 7,
            colIndexData: 8,
            rowActiveNamesStart: 4,
            rowActiveNamesEnd: 27,
            rowAwayNamesStart: 28,
            rowAwayNamesEnd: 47
          },
          {
            name: "SiMo",
            url: "https://ops.wolt.com/support/converse/conversations?conversationListId=6668088fc6d870f3cfd61653",
            colIndexNames: 9,
            colIndexData: 10,
            rowActiveNamesStart: 4,
            rowActiveNamesEnd: 27,
            rowAwayNamesStart: 28,
            rowAwayNamesEnd: 47
          },
          {
            name: "Aircall",
            url: "https://ops.wolt.com/support/converse/conversations?conversationListId=671a26a2a5b9ae4a2ca603fb",
            colIndexNames: 11,
            colIndexData: 12,
            rowActiveNamesStart: 4,
            rowActiveNamesEnd: 27,
            rowAwayNamesStart: 28,
            rowAwayNamesEnd: 47
          },
          {
            name: "Venue",
            url: "https://ops.wolt.com/support/converse/conversations?conversationListId=666807fc28b3f1231948f407",
            colIndexNames: 13,
            colIndexData: 14,
            rowActiveNamesStart: 4,
            rowActiveNamesEnd: 27,
            rowAwayNamesStart: 28,
            rowAwayNamesEnd: 47
          },
          {
            name: "Trainee",
            url: "https://wolt.com/",
            colIndexNames: 15,
            colIndexData: 16,
            rowActiveNamesStart: 4,
            rowActiveNamesEnd: 27,
            rowAwayNamesStart: 28,
            rowAwayNamesEnd: 47
          },
          {
            name: "ST",
            url: "https://wolt.com/",
            colIndexNames: 17,
            colIndexData: 18,
            rowActiveNamesStart: 4,
            rowActiveNamesEnd: 27,
            rowAwayNamesStart: 28,
            rowAwayNamesEnd: 47
          }
        ];

        let aircallActive = [];
        let aircallAway = [];

        function logDebug(message) {
          console.log(message);
        }

        async function fetchSheetData(range) {
          try {
            const res = await fetch("https://sheets-proxy.mikhail-garayev.workers.dev", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                secret: "superWoltKey42",
                range: range
              })
            });
            const data = await res.json();
            return data.values;
          } catch (e) {
            console.error("Sheets proxy error:", e);
            return null;
          }
        }

        async function fetchEmployeeList() {
  // подтягиваем столбцы A–H (A: Name, B: ID, C: Role, D: CanReallocate, E: Prime, F: Pref, G: Languages, H: Capacity, I: StartDate)
  // если у вас H — это capacity, а I — дата начала, нужно заменить диапазон на A1:I
  const data = await fetchSheetData("emplist!A1:I");
  if (!data || data.length < 2) return;

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue;  // если нет имени — пропускаем

    const empName           = row[0].trim();               // A
    const empId             = row[1]?.trim()     || "";     // B
    const role              = row[2]?.trim()     || "N/A";  // C
    const canRealloc        = row[3]?.trim()     || "N/A";  // D
    const primePlatform     = row[4]?.trim()     || "N/A";  // E
    const preferredPlatform = row[5]?.trim()     || "N/A";  // F
    const languages         = row[6]?.trim()     || "N/A";  // G
    const capacity          = row[7]?.trim()     || "N/A";  // H
    const startDateRaw      = row[8]?.trim()     || "";     // I

    employeeData[empName] = {
      id:            empId,
      role:          role,
      canReallocate: canRealloc,
      prime:         primePlatform,
      pref:          preferredPlatform,
      languages:     languages,
      capacity:      capacity,
      startDate:     startDateRaw
    };
  }
}


        function generateInboxLink(empId) {
          return (
            "https://ops.wolt.com/support/converse/users/conversations?assigneeIds=" +
            encodeURIComponent(empId)
          );
        }

        function generateAdminLink(empId) {
          return (
            "https://ops.wolt.com/support/converse/admin/users?userId=" +
            encodeURIComponent(empId)
          );
        }

        // Вставьте где-нибудь рядом с другими утилитами
function normalize(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/[\s\/-]+/g, ""); // убираем пробелы, косую черту, дефис
}
// парсит строки вида "DD.MM.YYYY HH:mm:ss" → JS Date
// парсит строки вида "DD.MM.YYYY HH:mm:ss" → JS Date,
// обрабатывает некорректные или неполные строки без падения
function parseDDMMYYYY(str) {
  if (typeof str !== 'string') {
    console.warn('parseDDMMYYYY got non-string:', str);
    return new Date(str);           // попробуем native-парсер
  }

  // разделяем по любому числу пробелов
  const parts = str.trim().split(/\s+/);
  if (parts.length < 2) {
    // нет времени — попытка native-парсера
    return new Date(str);
  }
  const [datePart, timePart] = parts;

  const dp = datePart.split('.');
  if (dp.length !== 3) {
    console.warn('parseDDMMYYYY got bad datePart:', datePart);
    return new Date(str);
  }
  let [day, month, year] = dp;

  // гарантируем по две цифры
  day   = String(day).padStart(2,'0');
  month = String(month).padStart(2,'0');

  // формируем ISO-строку
  const iso = `${year}-${month}-${day}T${timePart}`;
  const d = new Date(iso);
  if (isNaN(d.getTime())) {
    console.warn('parseDDMMYYYY failed to parse:', iso);
    return new Date(str);
  }
  return d;
}



async function openEmployeeModal(empName) {
  const info = employeeData[empName];
  if (!info) {
    logDebug("Данные о сотруднике не найдены: " + empName);
    return;
  }

  // 1) Смена
  const rec = window.shiftsQuinyxData.find(
    r => r.name.toLowerCase() === empName.toLowerCase()
  ) || {};
  const shiftName = rec.platform || "—";
  const shiftTime = rec.shift    || "—";
  document.getElementById("modal-emp-shift").textContent =
    `${shiftName} (${shiftTime})`;

  // 2) Перерыв
  let breakTime = "—";
  if (Array.isArray(window.allBreaksData)) {
    const br = window.allBreaksData.find(b =>
      b.Name?.trim().toLowerCase() === empName.trim().toLowerCase()
    );
    if (br) breakTime = br["Break Time"] || "—";
  }
  document.getElementById("modal-emp-break").textContent = breakTime;

  // 3) Общая инфа
  const parts = empName.trim().split(" ");
  const email = parts.length >= 2
    ? `${parts[0].toLowerCase()}.${parts[1].toLowerCase()}@wolt.com`
    : `${parts[0].toLowerCase()}@wolt.com`;

  document.getElementById("modal-emp-name").textContent      = empName;
  document.getElementById("modal-emp-email").textContent     = email;
  document.getElementById("modal-emp-realloc").textContent   = info.canReallocate || "N/A";
  document.getElementById("modal-emp-prime").textContent     = info.prime         || "N/A";
  document.getElementById("modal-emp-pref").textContent      = info.pref          || "N/A";
  document.getElementById("modal-emp-languages").textContent = info.languages     || "N/A";
  document.getElementById("modal-emp-capacity").textContent  = info.capacity      || "N/A";

  document.getElementById("modal-inbox-link").onclick = () => {
    window.open(generateInboxLink(info.id), "_blank");
  };
  document.getElementById("modal-admin-link").onclick = () => {
    window.open(generateAdminLink(info.id), "_blank");
  };

  // 4) Переходы по платформам за сегодня (отличные от основной)
  const today = new Date().toISOString().slice(0,10); // "YYYY-MM-DD"
  const shiftNorm = normalize(shiftName);

  const myChanges = (window.transfersData || []).filter(t => {
    // имя совпадает
    if (t.name.trim().toLowerCase() !== empName.trim().toLowerCase()) return false;
    // не считаем переходы на ту же смену
    if (normalize(t.toPlatform) === shiftNorm) return false;
    // дата из timestamp
    const dt = new Date(t.timestamp);
    if (isNaN(dt)) return false;
    return dt.toISOString().slice(0,10) === today;
  });

  // вставляем количество изменений
  document.getElementById("modal-platform-count").textContent = myChanges.length;

  // строим список
  const listEl = document.getElementById("modal-platform-list");
  if (myChanges.length > 0) {
    listEl.innerHTML = myChanges.map(t => {
      const timeOnly = new Date(t.timestamp)
                          .toTimeString()
                          .slice(0,8); // "HH:MM:SS"
      return `<li>${timeOnly} → <strong>${t.toPlatform}</strong> (${t.duration})</li>`;
    }).join("");
  } else {
    listEl.innerHTML = "<li>No platform changes today</li>";
  }

  // 5) Показываем модалку
  document.getElementById("modal-overlay").classList.add("show");
  document.getElementById("employee-modal").classList.add("show");
}





        function closeEmployeeModal() {
          document.getElementById("employee-modal").classList.remove("show");
          document.getElementById("modal-overlay").classList.remove("show");
        }


        async function getAircallUserId(email) {
          try {
            const res = await fetch("https://aircall-proxy.mikhail-garayev.workers.dev", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                secret: "superWoltKey42",
                email: email
              })
            });
        
            if (!res.ok) {
              logDebug(`Ошибка при проксированном запросе Aircall: ${res.statusText}`);
              return null;
            }
        
            const data = await res.json();
        
            if (!data?.user?.id) {
              logDebug("Aircall API вернул пустой результат");
              return null;
            }
        
            logDebug(`Получен Aircall ID: ${data.user.id}`);
            return data.user.id;
        
          } catch (err) {
            logDebug("Ошибка getAircallUserId через Worker: " + err.message);
            return null;
          }
        }


        async function getAircallAvailability(userId) {
          if (!userId) {
            logDebug("getAircallAvailability: userId не передан");
            return "No ID";
          }
        
          try {
            const res = await fetch("https://aircall-proxy.mikhail-garayev.workers.dev", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                secret: "superWoltKey42",
                userId: userId,
                action: "availability"
              })
            });
        
            if (!res.ok) {
              logDebug("Ошибка при получении статуса через Worker: " + res.statusText);
              return "Error";
            }
        
            const data = await res.json();
        
            const status =
              data?.user_availability?.availability_status || data?.availability;
        
            logDebug(`Статус через Worker: ${status}`);
            return status || "Unknown";
        
          } catch (err) {
            logDebug("Исключение в getAircallAvailability через Worker: " + err.message);
            return "Error";
          }
        }

        function passReallocAndLang(empName) {
          const info = employeeData[empName];
          if (!info) return false;
          if (currentReallocFilter !== "all") {
            if (info.canReallocate !== currentReallocFilter) return false;
          }
          if (currentLangFilter !== "all") {
            let lang = info.languages.replace(/\s+/g, "");
            if (currentLangFilter === "two") {
              if (!(lang.includes("🇦🇿") && lang.includes("🇬🇧")) || lang.includes("🇷🇺")) {
                return false;
              }
            } else if (currentLangFilter === "three") {
              if (!(lang.includes("🇦🇿") && lang.includes("🇬🇧") && lang.includes("🇷🇺"))) {
                return false;
              }
            }
          }
          return true;
        }

function applyFilters() {
  const container = document.getElementById("platforms-container");
  container.innerHTML = "";

  platforms.forEach((platform) => {
    if (
      !currentPlatformFilter.includes("all") &&
      !currentPlatformFilter.includes(platform.name)
    ) {
      return;
    }

    if (platform.name !== "Aircall") {
      // Собираем active и away
      let activeNames = [];
      for (
        let r = platform.rowActiveNamesStart;
        r <= platform.rowActiveNamesEnd;
        r++
      ) {
        const nm = fetchedData[r]?.[platform.colIndexNames]?.trim();
        if (nm) activeNames.push(nm);
      }
      let awayData = [];
      for (
        let r = platform.rowAwayNamesStart;
        r <= platform.rowAwayNamesEnd;
        r++
      ) {
        const nm = fetchedData[r]?.[platform.colIndexNames]?.trim();
        if (!nm) continue;
        const rsn = fetchedData[r]?.[platform.colIndexData]?.trim() || "";
        awayData.push({ name: nm, reason: rsn });
      }

      // Поиск
      if (currentSearchTerm) {
        const term = currentSearchTerm.toLowerCase();
        activeNames = activeNames.filter((n) =>
          n.toLowerCase().includes(term)
        );
        awayData = awayData.filter((a) =>
          a.name.toLowerCase().includes(term)
        );
      }

      // realloc/lang
      activeNames = activeNames.filter((n) => passReallocAndLang(n));
      awayData = awayData.filter((a) => passReallocAndLang(a.name));

      // Фильтр по статусу
      let showActive = true,
        showAway = true;
      if (currentStatusFilter === "active") showAway = false;
      else if (currentStatusFilter === "away") showActive = false;

      // Начало HTML карточки
      let html = `
        <div class="platform-card">
          <h5>
            <a href="${platform.url}" target="_blank" rel="noopener">${platform.name}</a>
            <span class="info-icon" data-toggle="tooltip" title="${
              platformInfo[platform.name] || ""
            }">
              <img src="https://www.svgrepo.com/show/474873/info.svg" width="16" height="16"/>
            </span>
          </h5>
      `;

      // — Active
      if (showActive) {
        if (activeNames.length === 0) {
          html += `<p class="text-center text-warning">⚠️ No active employees</p>`;
        } else {
          html += `<p><small>Active (${activeNames.length})</small></p><ul>`;
          activeNames.forEach((n) => {
            const name = n.trim();
            const isYou = name.toLowerCase() === "mikhail garayev";
            const isNaziya = name.toLowerCase() === "naziya orujova";
            const extraEmoji = isNaziya ? " 🎀" : "";
            const crown = isYou ? "👑" : "";

            const rawShift = getEmployeeShiftName(name);
            const shiftName = shiftDisplayNames[rawShift] || rawShift;
            const badgeClass =
              shiftBadgeClasses[shiftName] || "badge-secondary";

            html += `
              <li class="employee-item" data-employee="${name}">
                <span class="badge badge-pill ${badgeClass}">${shiftName}</span>
                <span class="employee-name">${name}${extraEmoji}</span>
                ${crown}
              </li>
            `;
          });
          html += `</ul>`;
        }
      }

// — Always render Away section, even if awayData.length === 0
if (showAway) {
  let brbCount = 0;
  html += `<p><small>Away (${awayData.length})</small></p><ul>`;
  awayData.forEach(({ name, reason }) => {
    const txt = reason || "";
    let reasonClass = "";
    // mark overdue breaks
    if (/(Break|BRB)/.test(txt) && /-\d{1,2}:\d{2}(?::\d{2})?/.test(txt)) {
      reasonClass = "break-overdue";
    }
    if (txt.includes("BRB")) brbCount++;

    const rawShift   = getEmployeeShiftName(name);
    const shiftName  = shiftDisplayNames[rawShift] || rawShift;
    const badgeClass = shiftBadgeClasses[shiftName] || "badge-secondary";

    html += `
      <li class="employee-item ${reasonClass}" data-employee="${name}">
        <span class="badge badge-pill ${badgeClass}">${shiftName}</span>
        <span class="employee-name">${name}</span>
        ${txt ? `<span class="text-muted">(${txt})</span>` : ""}
      </li>
    `;
  });
  html += `</ul>`;
  if (brbCount >= 2) {
    html += `
      <p style="text-align:center;color:red;font-size:0.95rem;">
        <span title="2 or more on BRB">&#9888;</span>
        <span style="margin-left:6px;">2 or more on BRB</span>
      </p>
    `;
      const msg = `⚠️ ${brbCount} or more on BRB on ${platform.name}`;
      if (!brbAlertSent[platform.name]) {
      showDesktopNotification('BRB Alert', msg);
      addInPageNotification(msg);
      brbAlertSent[platform.name] = true;
    }
  } else {
    // сбрасываем флаг, чтобы при следующем повторном выходе за порог оповещение снова ушло
    brbAlertSent[platform.name] = false;
  }
}

      html += `</div>`;
      container.innerHTML += html;
    } else {
      // Aircall остаётся как было
      let filteredActive = aircallActive.filter(
        (n) => n.toLowerCase() !== "away"
      );
      let filteredAway = aircallAway.filter(
        ({ name }) => name.toLowerCase() !== "away"
      );

      if (currentSearchTerm) {
        const term = currentSearchTerm.toLowerCase();
        filteredActive = filteredActive.filter((n) =>
          n.toLowerCase().includes(term)
        );
        filteredAway = filteredAway.filter(({ name }) =>
          name.toLowerCase().includes(term)
        );
      }
      filteredActive = filteredActive.filter((n) => passReallocAndLang(n));
      filteredAway = filteredAway.filter((a) => passReallocAndLang(a.name));

      const showActive = currentStatusFilter !== "away";
      const showAway = currentStatusFilter !== "active";

      renderAircallCardWithStatuses(
        filteredActive,
        filteredAway,
        showActive,
        showAway
      );
    }
  });

  // Навешиваем клик для модалки
  container.querySelectorAll(".employee-item").forEach((item) => {
    item.addEventListener("click", () =>
      openEmployeeModal(item.getAttribute("data-employee"))
    );
  });

  // Обновляем статусы Aircall
  setTimeout(() => fetchAircallStatuses().catch(console.error), 100);

  checkOverdueBRB();
}


function renderAircallCardWithStatuses(
  activeList,
  awayList,
  showActive = true,
  showAway = true
) {
  const aircallPlatform = platforms.find((p) => p.name === "Aircall");
  let html = `
    <div class="platform-card">
      <h5>
        <a href="${aircallPlatform.url}" target="_blank" rel="noopener">Aircall</a>
        <span class="info-icon" data-toggle="tooltip" title="${platformInfo["Aircall"]||""}">
          <img src="https://www.svgrepo.com/show/474873/info.svg" width="16" height="16"/>
        </span>
      </h5>`;

  // Active
    if (showActive) {
    if (activeList.length === 0) {
      html += `<p class="text-center text-warning">⚠️ No active employees</p>`;
    } else {
      html += `<p><small>Active (${activeList.length})</small></p><ul id="aircall-active-list">`;
      activeList.forEach((name, i) => {
        const rawShift   = getEmployeeShiftName(name);
        const shiftName  = shiftDisplayNames[rawShift] || rawShift;
        const badgeClass = shiftBadgeClasses[shiftName] || "badge-secondary";
        const safeId     = `aircall-active-${i}`;
        html += `
          <li id="${safeId}" class="employee-item d-flex align-items-center" data-employee="${name}">
            <span class="badge badge-pill ${badgeClass}" style="margin-right:6px;">
              ${shiftName}
            </span>
            <span class="employee-name" style="margin-right:6px;">${name}</span>
            &nbsp;–&nbsp;<span class="aircall-status">Checking...</span>
          </li>
        `;
      });
      html += `</ul>`;
    }
  }

  // Away
  if (showAway) {
    html += `<p><small>Away (${awayList.length})</small></p><ul>`;
    awayList.forEach(({ name, reason }) => {
      // Берём смену и бейдж
      const rawShift   = getEmployeeShiftName(name);
      const shiftName  = shiftDisplayNames[rawShift] || rawShift;
      const badgeClass = shiftBadgeClasses[shiftName] || "badge-secondary";

      // Логика покраски в красный, если есть BRB или Break
      const isOverdue =
      /(?:Break|BRB)/i.test(reason || "") &&
      /-([0-9]{2}:[0-9]{2})/.test(reason || "");
      const liClass   = isOverdue ? "break-overdue" : "";

      const extra = reason ? ` (${reason})` : "";

      html += `
      <li class="employee-item d-flex align-items-center ${liClass}" data-employee="${name}">
        <span class="badge badge-pill ${badgeClass}" style="margin-right:6px;">
          ${shiftName}
        </span>
        <span class="employee-name" style="margin-right:6px;">
          ${name}
        </span>
        <span class="text-muted">${extra}</span>
      </li>`;
  });
  html += `</ul>`;
}

  html += `</div>`;

  // Вставляем в DOM и пересобираем статусы
  document.getElementById("platforms-container").innerHTML += html;
    setTimeout(() => {
    fetchAircallStatuses().catch(console.error);
  }, 100);
}


  function renderShiftSummary(data) {
  // контейнер, где рендерятся все stats-card
  const generalContainer  = document.getElementById("summary-general");
const platformContainer = document.getElementById("summary-platforms");
generalContainer.innerHTML  = "";
platformContainer.innerHTML = "";

  // ваши карточки: title — заголовок, value — строка из ячейки (например "2, Alice, Bob"), away — опционально
  const summaryCards = [
    { title: "On shift now",  value: data[6][27] || "" },
    { title: "Should be",     value: data[6][29] || "" },
    { title: "CS",            value: data[6][31] || "", away: data[8][31] || "" },
    { title: "CS/Post Order", value: data[6][33] || "", away: data[8][33] || "" },
    { title: "PSR",           value: data[6][35] || "", away: data[8][35] || "" },
    { title: "SiMo",          value: data[6][41] || "", away: data[8][41] || "" },
    { title: "Aircall",       value: data[6][39] || "", away: data[8][39] || "" },
    { title: "Venue",         value: data[6][37] || "", away: data[8][37] || "" },
    { title: "Trainee",       value: data[11][41] || "", away: data[13][41] || "" },
    { title: "ST",            value: data[6][43] || "", away: data[8][43] || "" },
    // Special: Not here и WNATS тоже делают из столбца 29 и 27, плюс детали из колонки 10
    { 
      title: "Not here", 
      value: (data[8][29] || "") + (data[10][29] ? "," + data[10][29] : ""), 
      customClass: "small-font-card" 
    },
    { 
      title: "WNATS", 
      value: (data[8][27] || "") + (data[10][27] ? "," + data[10][27] : ""), 
      customClass: "small-font-card" 
    }
  ];

  summaryCards.forEach(card => {
    // если нет даже count — пропускаем
    if (!card.value) return;

    // создаём div.stats-card
    const div = document.createElement("div");
    div.className = `stats-card ${card.customClass || ""}`;

    // разбираем для специальных тултипов
    if (card.title === "Not here" || card.title === "WNATS") {
      // value = "count, detail1, detail2, …"
      const parts = card.value.split(",").map(s => s.trim()).filter(s => s !== "");
      const count = parts.shift();        // первое — число
      const details = parts;              // остаток — массив тултипов
      // если Not here и count ≠ 0, добавляем красный фон
      if (card.title === "Not here" && count !== "0") {
        div.classList.add("red-card");
      }
      // формируем HTML
      div.innerHTML = `
        <div class="stats-title">${card.title}</div>
        <div class="stats-value d-inline-flex align-items-center gap-1">
          ${count}
          <img
            src="https://www.svgrepo.com/show/474873/info.svg"
            data-toggle="tooltip"
            data-html="true"
            title="${details.join("<br/>")}"
            class="info-icon"
            style="width:16px; height:16px; cursor:pointer;"
          />
        </div>
      `;
    } else {
      // обычная карточка: title, value, away
      let html = `
        <div class="stats-title">${card.title}</div>
        <div class="stats-value">${card.value}</div>
      `;
      html += `
      <div class="stats-value" style="font-size:0.9rem; color:#666;">
      Away: ${card.away || 0}
      </div>`;

      div.innerHTML = html;
    }

    // список названий «платформенных» карточек
const platformTitles = [
  "CS",
  "CS/Post Order",
  "PSR",
  "SiMo",
  "Aircall",
  "Venue",
  "Trainee",
  "ST"
];

// если это карточка платформы — в платформенный грид,
// иначе — в общий контейнер
if (platformTitles.includes(card.title)) {
  platformContainer.appendChild(div);
} else {
  generalContainer.appendChild(div);
}
  });

  // вставляем погоду как последнюю карточку
  // новый код — в конце renderShiftSummary
    // вставляем карточки погоды для всех городов
    const weatherCities = [
    { city: "Baku,AZ",        title: "Baku Weather",       tempId: "temp-baku",  windId: "wind-baku" },
    { city: "Ganja,AZ",       title: "Ganja Weather",      tempId: "temp-ganja", windId: "wind-ganja" },
    { city: "Lankaran,AZ",    title: "Lankaran Weather",   tempId: "temp-lank",  windId: "wind-lank" },
    { city: "Nakhchivan,AZ",  title: "Nakhchivan Weather", tempId: "temp-nakh",  windId: "wind-nakh" },
    { city: "Mingachevir,AZ", title: "Mingachevir Weather",tempId: "temp-ming",  windId: "wind-ming" }
  ];

  weatherCities.forEach(({ city, title, tempId, windId }) => {
    const card = document.createElement("div");
    card.className = "stats-card";
    card.innerHTML = `
      <div class="stats-title">${title}</div>
      <div class="stats-value" id="${tempId}">--</div>
      <div class="stats-title" style="margin-top:.5rem;">Wind Speed</div>
      <div class="stats-value small" id="${windId}">--</div>
    `;
    generalContainer.appendChild(card);
    // запускаем запрос именно для этого города и этих id
    fetchWeatherFor(city, tempId, windId);
  });

}

function renderResponsiblePeople(data) {
  if (!Array.isArray(data) || data.length === 0) return;

  // Удаляем старую карточку, если она есть
  const existing = document.getElementById("responsible-card");
  if (existing) existing.remove();

  // Оставляем только роли "Shift Lead…" и "In charge…"
  const responsibleRows = data.filter(([name, role]) =>
  /shift\s+lead/i.test(role) || /in\s+charge/i.test(role)
);
  if (responsibleRows.length === 0) return;

  // Начало HTML
  let html = `
    <div class="shift-summary-card" id="responsible-card">
      <div class="shift-summary-title">👥 Responsible People</div>
      <table class="shift-summary-grid" style="max-width:500px; margin:0 auto;">
        <thead><tr><th>Name</th><th>Position</th></tr></thead>
        <tbody>`;

  // Заполняем строки
  responsibleRows.forEach(([rawName, rawRole]) => {
    const name = rawName.trim();
    const role = rawRole.trim();
    const lowerName = name.toLowerCase();

    // Специальные эмодзи для пользователей
    const isNaziya = lowerName === 'naziya orujova';
    const isRafig  = lowerName === 'rafig huseynov';
    let extraEmoji = '';
    if (isNaziya) extraEmoji = ' 🎀';
    else if (isRafig)  extraEmoji = ' (˵ ͡° ͜ʖ ͡°˵)';

    const nameClass = isNaziya ? 'pink-name' : '';

    html += `
      <tr>
        <td>
          <span class="${nameClass}" style="font-weight:bold;">
            ${name}${extraEmoji}
          </span>
        </td>
        <td>
          <span style="
            background: #e7f1ff;
            color: #0056b3;
            padding: 2px 6px;
            border-radius: 6px;
            font-size: 0.85rem;
          ">
            ${role}
          </span>
        </td>
      </tr>`;
  });

  // Закрываем таблицу и вставляем в DOM
  html += `
        </tbody>
      </table>
    </div>`;

  document
    .getElementById('shift-overs-section')
    .insertAdjacentHTML('beforebegin', html);
}


function renderShiftOvers() {
  const container = document.getElementById("shift-overs-app");
  container.innerHTML = ""; 
  if (!window.shiftsQuinyxData) {
    container.textContent = "No data";
    return;
  }

  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60*60*1000);

  // фильтрация сотрудников
  const upcoming = window.shiftsQuinyxData.filter(({name, shift}) => {
    const parts = shift.split("-");
    if (parts.length < 2) return false;
    const [ hh, mm ] = parts[1].split(":").map(Number);
    const endDate = new Date(now);
    endDate.setHours(hh, mm, 0, 0);
    return endDate > now && endDate <= oneHourLater;
  });

  if (upcoming.length === 0) {
    container.innerHTML = "<p style='text-align:center;color:#666;'>No shift-overs in the next hour</p>";
    return;
  }

  // список
  const ul = document.createElement("ul");
  upcoming.forEach(({name, shift}) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${name}</strong> — ${shift}`;
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

                // 1) Shift-Overs из листа shiftsquinyx!A:C
        async function fetchShiftOversData() {
  const raw = await fetchSheetData("shiftsquinyx!A:C"); // теперь A-C, а не B-C
  if (!raw) {
    document.getElementById("shift-overs-app").textContent = "Error";
    return;
  }

  // Преобразуем массив строк в объекты с полями Name, ShiftName и Shift
  const arr = raw.slice(1).map(row => ({
    ShiftName: row[0]?.trim(),   // A = название смены
    Name: row[1]?.trim(),        // B = имя сотрудника
    Shift: row[2]?.trim(),       // C = время смены
  }));

  const now = new Date();
  const next = new Date(now.getTime() + 60 * 60 * 1000);

  // Фильтрация: отбираем тех, у кого shift заканчивается в течение часа
  const upcoming = arr.filter(r => {
    if (!r.Shift) return false;
    const parts = r.Shift.split("-");
    if (parts.length !== 2) return false;

    const [h, m] = parts[1].split(":").map(Number);
    if (isNaN(h)) return false;

    const end = new Date(now);
    end.setHours(h, m, 0, 0);
    return end > now && end <= next;
  });

  const c = document.getElementById("shift-overs-app");

  if (!upcoming.length) {
    c.innerHTML = "<p>No shift-overs in the next hour</p>";
    return;
  }

  // Подсветка при совпадении shiftName + время
  const counts = {};
  upcoming.forEach(r => {
    const key = `${r.ShiftName}–${r.Shift}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  c.innerHTML = "<ul>" + upcoming.map(r => {
    const [start, end] = r.Shift.split("-").map(s => s.trim());
    const key = `${r.ShiftName}–${r.Shift}`;
    const conflictClass = counts[key] > 1 ? "break-conflict" : "";

    return `
      <li class="${conflictClass}">
        <strong>${r.Name}</strong><br/>
        Ends at ${end}<br/>
        Shift: ${start} | ${r.ShiftName}
      </li>`;
  }).join("") + "</ul>";
}



        
async function fetchBreaksData() {
  const raw = await fetchSheetData(BREAKS_RANGE);
  if (!raw) {
    document.getElementById("breaks-app").textContent = "Error";
    return;
  }

  const arr = arrayToObjects(raw);
  const now = new Date();
  const nextHour = new Date(now.getTime() + 3600 * 1000);
  window.allBreaksData = arr;

  // Фильтрация по режиму
  let list;
  if (currentBreakFilter === "upcoming") {
    list = arr.filter(r => {
      const [h, m] = (r["Break Time"] || "").split(":").map(Number);
      if (isNaN(h)) return false;
      const dt = new Date(now);
      dt.setHours(h, m, 0, 0);
      return dt > now && dt <= nextHour;
    });
  } else {
    list = arr.slice().sort((a, b) => {
      const pa = parseTimeToMinutes(a["Break Time"]),
            pb = parseTimeToMinutes(b["Break Time"]);
      return pa - pb;
    });
  }

  const c = document.getElementById("breaks-app");

  // Подсчёт совпадений
  const counts = {};
  list.forEach(r => {
    const key = `${r["Working Space"]}–${r["Break Time"]}`;
    counts[key] = (counts[key] || 0) + 1;
  });

  if (!list.length) {
    c.innerHTML = "<p>No breaks</p>";
  } else {
    // Генерация HTML списка
    c.innerHTML = "<ul>" + list.map(r => {
      const key = `${r["Working Space"]}–${r["Break Time"]}`;
      const conflictClass = counts[key] > 1 ? "break-conflict" : "";
      return `
        <li class="${conflictClass}">
          <strong>${r.Name}</strong><br/>
          Break at
            <span class="break-time"
                  data-name="${r.Name}"
                  data-time="${r["Break Time"]}"
            >${r["Break Time"]}</span>
          <button class="edit-btn"
                  title="Edit time"
                  style="border:none;background:none;cursor:pointer;">
            <img src="https://www.svgrepo.com/show/502640/edit-1.svg"
                 alt="edit" width="16" height="16">
          </button><br/>
          Shift: ${r["Shift Start Time"]} | ${r["Working Space"]}
        </li>
      `;
    }).join("") + "</ul>";

    // Редактирование времени
    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = btn.previousElementSibling.dataset.name;
        const timeSpan = btn.previousElementSibling;
        const oldTime = timeSpan.dataset.time;
        const newTime = prompt(`Enter new break time for ${name}:`, oldTime);
        if (!newTime || newTime === oldTime) return;
        fetch("https://breaks-proxy.mikhail-garayev.workers.dev/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            newBreakTime: newTime,
            secret: "superWoltKey42"
          })
        })
        .then(res => res.text())
        .then(response => {
          if (response === "Success") {
            timeSpan.textContent = newTime;
            timeSpan.dataset.time = newTime;
            alert("Break time updated successfully!");
          } else {
            alert("Server response:\n" + response);
          }
        })
        .catch(err => {
          alert("Request failed:\n" + err.message);
        });
      });
    });
  }

  // ===== Проверяем просроченные перерывы и уведомляем =====
  (function checkOverdueBreaks() {
  const ALLOWED_BREAK_MINUTES = 60;
  const now = new Date();

  // 1) Сотрудники, помеченные active по листу
  const activeSet = new Set();
  platforms.forEach(p => {
    for (let r = p.rowActiveNamesStart; r <= p.rowActiveNamesEnd; r++) {
      const nm = fetchedData[r]?.[p.colIndexNames]?.trim();
      if (nm) activeSet.add(nm.toLowerCase());
    }
  });

  // 2) Проходим по всем перерывам
  (window.allBreaksData || []).forEach(r => {
    const name = r.Name?.trim();
    if (!name) return;
    const key = name.toLowerCase();

    // Если человек снова active — очищаем флаг и не уведомляем
    if (activeSet.has(key)) {
      if (overdueBreakNotified[key]) {
        delete overdueBreakNotified[key];
        localStorage.setItem(BREAK_NOTIF_KEY, JSON.stringify(overdueBreakNotified));
      }
      return;
    }

    // **НОВЫЙ БЛОК**: проверяем, не закончилась ли у него смена
    // ищем в данных по сменам
    const shiftRec = (window.shiftsQuinyxData || [])
      .find(x => x.name.trim().toLowerCase() === key);
    if (shiftRec) {
      const [, endStr] = shiftRec.shift.split('-');
      const [eh, em] = endStr.split(':').map(Number);
      const endDate = new Date(now);
      endDate.setHours(eh, em, 0, 0);
      // если сейчас уже после конца смены — пропускаем
      if (now > endDate) {
        // и очищаем флаг в случае, если когда-то было уведомление
        if (overdueBreakNotified[key]) {
          delete overdueBreakNotified[key];
          localStorage.setItem(BREAK_NOTIF_KEY, JSON.stringify(overdueBreakNotified));
        }
        return;
      }
    }

    // 3) Проверяем длительность break-а
    const [h, m, s = 0] = (r["Break Time"] || "").split(":").map(Number);
    const breakDate = new Date(now);
    breakDate.setHours(h, m, s, 0);
    const durationMins = (now - breakDate) / 60000;

    if (durationMins > ALLOWED_BREAK_MINUTES) {
      if (!overdueBreakNotified[key]) {
        const lateMin = Math.floor(durationMins);
        const msg = `❗ ${name} is late from break for ${lateMin} min.`;
        showDesktopNotification("Break overdue", msg);
        addInPageNotification(msg);
        overdueBreakNotified[key] = true;
        localStorage.setItem(BREAK_NOTIF_KEY, JSON.stringify(overdueBreakNotified));
      }
    }
  });
})();
}

        function checkOverdueBRB() {
  // найдём все li, помеченные классом break-overdue и содержащие "BRB"
  const overdueBRB = Array.from(
    document.querySelectorAll('.employee-item.break-overdue')
  ).filter(li => /\bBRB\b/.test(li.textContent));

  // для каждого нового — шлём уведомление
  overdueBRB.forEach(li => {
    const name = li.dataset.employee;
    if (!brbOverdueNotified[name]) {
      const reason = li.querySelector('.text-muted')?.textContent || '';
      const msg = `⏰ ${name} is late from BRB ${reason}`;
      showDesktopNotification('BRB Overdue', msg);
      addInPageNotification(msg);
      brbOverdueNotified[name] = true;
    }
  });

  // сбросим флаг, если человек уже не просрочен
  Object.keys(brbOverdueNotified).forEach(name => {
    if (!overdueBRB.some(li => li.dataset.employee === name)) {
      delete brbOverdueNotified[name];
    }
  });
}
        
        // кладём в глобальную window.shiftsQuinyxData
        async function fetchShiftsQuinyxData() {
          const raw = await fetchSheetData("shiftsquinyx!A2:C");
          if (!raw || raw.length < 2) {
            window.shiftsQuinyxData = [];
            return;
          }
          // raw[0] — заголовки, raw[1..] — строки [name, "HH:mm-HH:mm"]
          window.shiftsQuinyxData = raw
          .filter(r => r[0] && r[1] && r[2])
          .map(r => ({
            platform: r[0].trim(), // A: SHIFT TYPE
            name: r[1].trim(),     // B: Name
            shift: r[2].trim()     // C: Shift time
          }));
        }


        function parseTimeToMinutes(timeStr) {
          timeStr = timeStr.trim();
          let parts = timeStr.split(":");
          if (parts.length < 2) return 0;
          let hours = parseInt(parts[0], 10);
          let minutes = parseInt(parts[1], 10);
          return hours * 60 + minutes;
        }

        function arrayToObjects(arr) {
          if (!arr.length) return [];
          const header = arr[0];
          return arr.slice(1).map((row) => {
            const obj = {};
            header.forEach((key, i) => {
              obj[key] = row[i] || "";
            });
            return obj;
          });
        }

        // ——— Функция для запроса и отрисовки статусов Aircall ———
        // ------------------
// Подтягиваем реальные статусы вместо Checking...
// ------------------
async function fetchAircallStatuses() {
  const spans = Array.from(document.querySelectorAll(".aircall-status"));
  if (!spans.length) return;

  // Помечаем все спаны как «Loading…»
  spans.forEach(span => {
    span.textContent = "Loading…";
  });

  // Собираем уникальные email
  const emails = [...new Set(spans.map(span => {
    const name = span.closest("li[data-employee]")?.dataset.employee || "";
    return generateWoltEmail(name);
  }))];

  let results = [];
  try {
    const res = await fetch("https://aircall-proxy.mikhail-garayev.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: "superWoltKey42",
        emails: emails
      })
    });
    const json = await res.json();
    results = Array.isArray(json.results) ? json.results : [];
  } catch (e) {
    console.error("Aircall batch error:", e);
  }

  // Составляем мапу email → статус
  const statusMap = results.reduce((acc, { email, status, error }) => {
    acc[email] = status ?? error ?? "Unknown";
    return acc;
  }, {});

  // Обновляем каждый span
  spans.forEach(span => {
    const li    = span.closest("li[data-employee]");
    const email = generateWoltEmail(li?.dataset.employee || "");
    const status = statusMap[email] || "Error";

    span.textContent = status;
    const safeClass = "status-" + status.toLowerCase().replace(/\s+/g, "-");
    span.className = `aircall-status ${safeClass}`;
  });
}


        let autoRefreshEnabled = true;
        let refreshInterval = 15;
        let refreshTimer = null;
        let countdownTimer = null;
        let countdownValue = refreshInterval;

        function resetAutoRefresh() {
  clearTimeout(refreshTimer);
  clearInterval(countdownTimer);
  countdownValue = refreshInterval;
  updateCountdownDisplay();

  // через лямбду, чтобы успеть добавить класс перед fetchData()
  refreshTimer = setTimeout(() => {
    const ico = document.getElementById("refresh-icon");
    ico.classList.add("rotating");  // старт анимации
    fetchData();
  }, refreshInterval * 1000);

  countdownTimer = setInterval(() => {
    countdownValue--;
    updateCountdownDisplay();
    if (countdownValue <= 0) clearInterval(countdownTimer);
  }, 1000);
}

        function updateCountdownDisplay() {
          const countdownElem = document.getElementById("countdown");
          if (countdownElem) {
            countdownElem.textContent = countdownValue;
          }
        }
        function toggleAutoRefresh() {
          autoRefreshEnabled = !autoRefreshEnabled;
          const btn = document.getElementById("toggle-autorefresh");
          if (autoRefreshEnabled) {
            btn.textContent = "Disable Auto Refresh";
            resetAutoRefresh();
          } else {
            btn.textContent = "Enable Auto Refresh";
            clearTimeout(refreshTimer);
            clearInterval(countdownTimer);
          }
        }
        // Кнопка Refresh Now и автообновление вызывают эту функцию
        function refreshNow() {
  const ico = document.getElementById('refresh-icon');
  // вешаем анимацию
  ico.classList.add('rotating');

  // запускаем обновление
  fetchData().finally(() => {
    // когда всё отработало — выключаем анимацию
    ico.classList.remove('rotating');
  });
}

        function showDesktopNotification(title, body) {
  if (doNotDisturb) return;       // 🛑 ничего не делаем
  if (Notification.permission === "granted") {
    new Notification(title, { body, icon: "favicon.png" });
  }
}

function addInPageNotification(message) {
  if (doNotDisturb) return;       // 🛑 ничего не делаем
  notificationQueue.push(message);
  const $cnt = document.getElementById("notification-count");
  $cnt.textContent = notificationQueue.length;
  $cnt.style.display = notificationQueue.length > 0 ? "block" : "none";
}

      // ───── Панель in-page уведомлений ─────

// загрузка/сохранение
function loadNotifications() {
  return JSON.parse(localStorage.getItem('notifications') || '[]');
}
function saveNotifications(arr) {
  localStorage.setItem('notifications', JSON.stringify(arr));
}

// пуш в очередь + бейдж
function pushNotification(text) {
  const arr = loadNotifications();
  arr.unshift({ text, timestamp: Date.now(), read: false });
  saveNotifications(arr);
  renderBadge(arr);
}

// рендер бейджа на колокольчике
function renderBadge(arr) {
  const unread = arr.filter(n => !n.read).length;
  const $cnt = document.getElementById('notification-count');
  if (unread > 0) {
    $cnt.textContent = unread;
    $cnt.style.display = 'block';
  } else {
    $cnt.style.display = 'none';
  }
}

// рендер панели
function renderPanel() {
  const arr = loadNotifications();
  const panel = document.getElementById('notifications-panel');
  if (!arr.length) {
    panel.innerHTML = '<p class="p-3 text-center text-muted">Нет уведомлений</p>';
    return;
  }
  panel.innerHTML = '<ul class="list-group">' +
    arr.map((n, i) => {
      const cls = n.read ? 'read' : 'unread';
      const time = new Date(n.timestamp).toLocaleTimeString();
      return `<li class="list-group-item ${cls}">${n.text}
                <br><small class="text-muted">${time}</small>
              </li>`;
    }).join('') +
    '</ul>';
}

// при открытии панели — помечаем «прочитанными»
function markAllRead() {
  const arr = loadNotifications().map(n => ({ ...n, read: true }));
  saveNotifications(arr);
  renderBadge(arr);
  renderPanel();
}

// перехват in-page уведомлений
function addInPageNotification(message) {
  if (doNotDisturb) return;
  pushNotification(message);
}

// клик по колокольчику
document.getElementById('notification-bell').addEventListener('click', () => {
  const panel = document.getElementById('notifications-panel');
  panel.classList.toggle('show');
  if (panel.classList.contains('show')) {
    renderPanel();
    markAllRead();
  }
});

// инициализация бейджа при загрузке
renderBadge(loadNotifications());



        async function fetchData() {
          const data = await fetchSheetData(RANGE);
          fetchedData = data;
          const shiftData = await fetchSheetData(SHIFT_RANGE);
          window.allShiftData = shiftData;

          await fetchEmployeeList();
          await fetchShiftsQuinyxData();     
          await fetchShiftOversData();

          // Переводим объект employeeData → массив для поиска кандидата
          window.empList = Object.entries(employeeData).map(([name, info]) => ({
            name,
            canReallocate: info.canReallocate,
            prime: info.prime,
            pref: info.pref,
            languages: info.languages,
            // capacity у вас хранится в info.capacity
            maxChats: parseInt(info.capacity, 10) || 0,
            // И если у вас есть дата начала работы — добавьте её в fetchEmployeeList()
            // и здесь возьмите её как info.startDate
            startDate: info.startDate 
          }));

          // Заполнение данных для Aircall
          const aircallConfig = platforms.find((p) => p.name === "Aircall");
          aircallActive = [];
          aircallAway = [];
          for (
            let r = aircallConfig.rowActiveNamesStart;
            r <= aircallConfig.rowActiveNamesEnd;
            r++
          ) {
            const name = data[r]?.[aircallConfig.colIndexNames]?.trim();
            if (name) aircallActive.push(name);
          }
          for (
            let r = aircallConfig.rowAwayNamesStart;
            r <= aircallConfig.rowAwayNamesEnd;
            r++
          ) {
            const name = data[r]?.[aircallConfig.colIndexNames]?.trim();
            const reason = data[r]?.[aircallConfig.colIndexData]?.trim() || "";
            if (name) aircallAway.push({ name, reason });
          }

          renderShiftSummary(data);
          const responsiblesData = await fetchSheetData(RESPONSIBLES_RANGE);
          renderResponsiblePeople(responsiblesData);
          await fetchBreaksData();
          await fetchShiftsQuinyxData();
          await fetchStatusChanges();
          fetchAircallStatuses();
          applyFilters();
          checkEmptyPlatforms(data);
          
          // подключаем кнопку
          document.getElementById('find-candidate')
          .addEventListener('click', findCandidate);
          
          document.getElementById("refresh-icon").classList.remove('rotating');
          if (autoRefreshEnabled) resetAutoRefresh();
        }

        function getPrimaryPlatform(empName) {
          if (!window.shiftsQuinyxData) return null;
        
          const found = window.shiftsQuinyxData.find(row =>
            row.name.toLowerCase() === empName.toLowerCase()
          );
        
          return found?.platform || null;
        }

        function saveNotifiedEmpty() {
          localStorage.setItem(STORAGE_KEY, JSON.stringify([...notifiedEmpty]));
        }
        // для каждой платформы смотрим, не стало ли 0 активных
function checkEmptyPlatforms(data) {
  // summaryCards в renderShiftSummary — в data[6] строчка «On shift now» в 6-м ряду, но нам проще руками перебрать
  const platformCols = {
    "CS": 31,
    "CS/Post Order": 33,
    "PSR": 35,
    "SiMo": 41,
    "Aircall": 39,
    "Venue": 37,
    "Trainee": 41,   // тут в вашем summaryCards они брали data[11][41]
    "ST": 43
  };
  Object.entries(platformCols).forEach(([name, colIdx]) => {
    const count = parseInt(data[6][colIdx] || "0", 10);

    // если 0 и ещё не уведомляли
    if (count === 0 && !notifiedEmpty.has(name)) {
      notifiedEmpty.add(name);
      saveNotifiedEmpty();              // сохраним сразу
      const msg = `⚠️ No active employees on ${name}`;
      showDesktopNotification("Empty platform", msg);
      addInPageNotification(msg);
    }

    // если снова появилось — сбросим, чтобы при повторном уходе в 0 можно было уведомить снова
    if (count > 0 && notifiedEmpty.has(name)) {
      notifiedEmpty.delete(name);
      saveNotifiedEmpty();              // и это сохраним
    }
  });
}

// …внутри fetchData(), сразу после renderShiftSummary(data):

        
        function generateWoltEmail(name) {
          if (!name) return "";
          const parts = name.split(" ");
          return parts.length < 2
            ? parts[0].toLowerCase() + "@wolt.com"
            : parts[0].toLowerCase() +
                "." +
                parts[1].toLowerCase() +
                "@wolt.com";
        }

        function getUpcomingShiftOvers() {
        if (!window.shiftsQuinyxData) return [];
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60*60*1000);

        return window.shiftsQuinyxData
          .filter(({name, shift}) => {
            // из "06:00-15:00" берём вторую часть – время конца
            const endStr = shift.split("-")[1];
            if (!endStr) return false;
            // составляем дату-объект: сегодня + endStr
            const [hh, mm] = endStr.split(":").map(Number);
            const endDate = new Date(now);
            endDate.setHours(hh, mm, 0, 0);

            return endDate > now && endDate <= oneHourLater;
          })
          .map(o => o.name);
      }

      function setLogoutIcon(isDark) {
        const logoutBtn = document.getElementById("logout-btn");
        if (!logoutBtn) return;
        // если в той же папке что и HTML:
        logoutBtn.src = isDark
          ? "log-out-white.svg"   // белая иконка
          : "log-out.svg";        // цветная, исходная
      }

      function loadThemePreference() {
  const isDark = localStorage.getItem("darkThemeEnabled") === "true";
  document.body.classList.toggle("dark-theme", isDark);

  const bellIcon = document.querySelector("#notification-bell img");
  bellIcon.src = isDark
    ? "https://www.svgrepo.com/show/526479/bell-off.svg"
    : "https://www.svgrepo.com/show/527618/bell-off.svg";

  const themeCheckbox = document.getElementById("theme-checkbox");
  if (themeCheckbox) themeCheckbox.checked = isDark;
  setLogoutIcon(isDark);
}



        
      function toggleTheme(e) {
  const isDark = e.target.checked;
  document.body.classList.toggle("dark-theme", isDark);

  // подменяем иконку:
  const bellIcon = document.querySelector("#notification-bell img");
  bellIcon.src = isDark
    ? "https://www.svgrepo.com/show/526479/bell-off.svg"
    : "https://www.svgrepo.com/show/527618/bell-off.svg";

  localStorage.setItem("darkThemeEnabled", isDark);
  setLogoutIcon(isDark);
}


function findCandidate() {
  const target = document.getElementById('target-platform').value;
  if (!target) {
    return alert('Select the platform first');
  }
  const now = new Date();

  // вспомогательная функция — приводим строку к единому ключу
  const canonical = str =>
    str.toLowerCase().replace(/[^a-z0-9]/g, '');

  const targetKey = canonical(target);

  // 1) только те, кто может перекомплектоваться
  const pool = window.empList.filter(e => e.canReallocate === 'Yes');
  if (!pool.length) {
    $('#candidateModalBody').html(
      '<div class="alert alert-warning">No employees to reallocate</div>'
    );
    return $('#candidateModal').modal('show');
  }

  const badStatuses = ['will not attend the shift', 'not attended the shift'];

  const candidates = pool.map(e => {
    // 1. Проверка «не будет/не пришёл»
    const rowIdx = fetchedData.findIndex(row =>
      row.some(cell =>
        typeof cell === 'string' &&
        cell.trim().toLowerCase() === e.name.toLowerCase()
      )
    );
    if (rowIdx < 0) return null;
    const shiftIdx = rowIdx - 4;
    const shifts   = window.allShiftData || [];
    if (shiftIdx >= 1 && shiftIdx < shifts.length) {
      if (shifts[shiftIdx].some(cell =>
        typeof cell === 'string' &&
        badStatuses.some(bs => cell.trim().toLowerCase().includes(bs))
      )) {
        return null;
      }
    }

    // 2. На смене?
    const rec = window.shiftsQuinyxData.find(r =>
      r.name.toLowerCase() === e.name.toLowerCase()
    ) || {};
    const parts = (rec.shift || '').split('-');
    if (parts.length < 2) return null;
    const [startStr, endStr] = parts;
    const [sh, sm] = startStr.split(':').map(Number);
    const [eh, em] = endStr.split(':').map(Number);
    const sd = new Date(now); sd.setHours(sh, sm, 0, 0);
    const ed = new Date(now); ed.setHours(eh, em, 0, 0);
    if (now < sd || now > ed) return null;

    // 3. Не на брейке?
    const br = (window.allBreaksData || []).find(b =>
      b.Name.trim().toLowerCase() === e.name.trim().toLowerCase()
    );
    if (br) {
      const [bh, bm] = (br['Break Time'] || '').split(':').map(Number);
      const bd = new Date(now); bd.setHours(bh, bm, 0, 0);
      if (now >= bd && now < new Date(bd.getTime() + 15*60*1000)) {
        return null;
      }
    }

    // 4. Расчёт опыта и скоринга
    // — опыт
    let startDateObj = new Date(e.startDate);
    if (isNaN(startDateObj)) {
      const pd = e.startDate.split(/[./]/);
      if (pd.length === 3) {
        const [d, m, y] = pd;
        startDateObj = new Date(`${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`);
      }
    }
    const tenure = isNaN(startDateObj)
      ? 0
      : Math.floor((now - startDateObj) / (1000*60*60*24*30));

    // — prime
    const primeMatch = e.prime === target ? 1 : 0;

    // — pref
    const prefList = (e.pref || '').split(',').map(s => canonical(s));
    const prefMatch = prefList.some(pk =>
      pk === targetKey || targetKey.includes(pk) || pk.includes(targetKey)
    ) ? 1 : 0;

    // — языки и capacity
    const langCount = e.languages.trim()
      ? e.languages.trim().split(/\s+/).length
      : 0;
    const cap = e.maxChats || 0;

    // — финальный score
    const w = { t:0.2, pr:0.3, pf:0.2, lg:0.2, cp:0.1 };
    const maxCap = Math.max(...pool.map(x => x.maxChats), 1);
    const score =
      w.t  * Math.min(tenure/24, 1) +
      w.pr * primeMatch +
      w.pf * prefMatch +
      w.lg * (langCount/3) +
      w.cp * (cap/maxCap);

    return { ...e, tenure, primeMatch, prefMatch, langCount, cap, score };
  }).filter(x => x);

  if (!candidates.length) {
    $('#candidateModalBody').html(
      '<div class="alert alert-warning">Нет доступных кандидатов</div>'
    );
    return $('#candidateModal').modal('show');
  }

  // выбираем лучшего
  const best = candidates.sort((a,b) => b.score - a.score)[0];

  // внутри findCandidate(), после const best = …
const rec = window.shiftsQuinyxData
  .find(r => r.name.toLowerCase() === best.name.toLowerCase()) || {};

const shiftInfo = `${rec.platform || '–'} (${rec.shift || '–'})`;

let breakTime = '–';
if (Array.isArray(window.allBreaksData)) {
  const br = window.allBreaksData.find(b =>
    b.Name?.trim().toLowerCase() === best.name.trim().toLowerCase()
  );
  if (br) breakTime = br['Break Time'] || '–';
}


  // собираем HTML для модалки
  const html = `
  <div class="text-center">
    <h4>${best.name}</h4>
    <p>Score <strong>${best.score.toFixed(2)}</strong></p>
    <ul class="list-unstyled text-left mx-auto" style="max-width:200px;">
      <li>Current Shift: <strong>${shiftInfo}</strong></li>
      <li>Break: <strong>${breakTime}</strong></li>
      <li>Total working time: <strong>${best.tenure}</strong> months</li>
      <li>Is this his prime platform: <strong>${best.primeMatch ? 'Yes' : 'No'}</strong></li>
      <li>Is this his preferrable platform: <strong>${best.prefMatch ? 'Yes' : 'No'}</strong></li>
      <li>Languages: <strong>${best.langCount}</strong></li>
      <li>Chat capacity: <strong>${best.cap}</strong></li>
    </ul>
  </div>
`;

  $('#candidateModalBody').html(html);
  $('#candidateModal').modal('show');
}


        // Инициализация Bootstrap-Select и обработка изменения выбора платформ
        $(document).ready(function () {
          $("#platform-dropdown").selectpicker();
          $("#platform-dropdown").on(
            "changed.bs.select",
            function (e, clickedIndex, isSelected, previousValue) {
              let selected = $(this).val();
              currentPlatformFilter = selected && selected.length ? selected : ["all"];
              applyFilters();
            }
          );
        });

        document.getElementById("theme-checkbox")
  .addEventListener("change", toggleTheme);
document.addEventListener("DOMContentLoaded", loadThemePreference);
document.addEventListener("DOMContentLoaded", () => {
  // Загрузка темы
  loadThemePreference();

  const dndCheckbox = document.getElementById('dnd-toggle');
  dndCheckbox.checked = doNotDisturb;
  dndCheckbox.addEventListener('change', e => {
    setDoNotDisturb(e.target.checked);
  })
  // … остальной ваш код инициализации


  // Сайдбар
  const layout    = document.querySelector(".dashboard-layout");
  const sidebar   = document.getElementById("sidebar");
  const hamburger = document.getElementById("hamburger-menu");
  const closeBtn  = document.getElementById("sidebar-close");

  // Открытие сайдбара по бургер-меню
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.add("active");
    layout.classList.add("sidebar-open");
  });

  // Закрытие по кнопке «×»
  closeBtn.addEventListener("click", () => {
    sidebar.classList.remove("active");
    layout.classList.remove("sidebar-open");
  });


  // Фильтры таблицы платформ
  document
    .getElementById("employee-search")
    .addEventListener("input", (e) => {
      currentSearchTerm = e.target.value;
      applyFilters();
    });

  document
    .getElementById("status-filter")
    .addEventListener("change", (e) => {
      currentStatusFilter = e.target.value;
      applyFilters();
    });

  document
    .getElementById("realloc-filter")
    .addEventListener("change", (e) => {
      currentReallocFilter = e.target.value;
      applyFilters();
    });

  document
    .getElementById("lang-filter")
    .addEventListener("change", (e) => {
      currentLangFilter = e.target.value;
      applyFilters();
    });

  // Фильтр перерывов
  document
    .getElementById("break-filter")
    .addEventListener("change", (e) => {
      currentBreakFilter = e.target.value; // "upcoming" или "all"
      fetchBreaksData();
    });

  // Селектор платформ (bootstrap-select)
  $('#platform-dropdown').selectpicker();
  $('#platform-dropdown').on('changed.bs.select', function () {
    const selected = $(this).val();
    currentPlatformFilter = selected && selected.length ? selected : ['all'];
    applyFilters();
  });

  // Модалка сотрудника
  const overlay = document.getElementById("modal-overlay");
  const modalClose = document.getElementById("modal-close");
  overlay.addEventListener("click", closeEmployeeModal);
  modalClose.addEventListener("click", closeEmployeeModal);

    // 1) Один раз заполняем dropdown платформ
  const sel = document.getElementById('target-platform');
  // очищаем (оставляем только заглушку)
  sel.innerHTML = '<option value="">→ Reallocate to..</option>';
  platforms.forEach(p => sel.add(new Option(p.name, p.name)));

  // Переключатель темы
  document.getElementById("theme-checkbox").addEventListener("change", toggleTheme);

  document.getElementById('find-candidate')
  .addEventListener('click', findCandidate);

  // Первичная загрузка данных
  if ("Notification" in window) {
  Notification.requestPermission().then(p => {
    console.log("Push permission:", p);
  });
}

  fetchData();
});
     
      
      </script>
