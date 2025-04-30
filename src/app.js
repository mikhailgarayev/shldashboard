// app.js

// ——————————————————————————————
// 1) КОНФИГУРАЦИЯ
// ——————————————————————————————

const SHEETS_PROXY_URL   = '/api/sheets-proxy';
const AIRCALL_PROXY_URL  = '/api/aircall-proxy';
const WEATHER_PROXY_URL  = '/api/weather';
const REFRESH_INTERVAL   = 15; // seconds

let doNotDisturb = localStorage.getItem('doNotDisturb') === 'true';
let notificationQueue = [];

// ваши константы Google Sheets
const RANGE               = 'list1!A1:BJ100';
const SHIFT_RANGE         = 'list1!AT5:BH47';
const RESPONSIBLES_RANGE  = 'list1!B5:C27';
const BREAKS_RANGE        = 'prebreaks!A1:D80';
const SHIFT_QUINYX_RANGE  = 'shiftsquinyx!A2:C';

let fetchedData = null;
let employeeData = {};
let shiftsQuinyxData = [];
let allBreaksData = [];
let aircallActive = [], aircallAway = [];

// фильтры
let currentSearchTerm     = '';
let currentStatusFilter   = 'both';
let currentPlatformFilter = ['all'];
let currentReallocFilter  = 'all';
let currentLangFilter     = 'all';
let currentBreakFilter    = 'upcoming';

const platforms = [
  { name: 'CS',            url: 'https://ops.wolt.com/.../6643245bfadf62c6edc28feb',  colNames:3,  colData:4,  activeStart:4,  activeEnd:27, awayStart:28, awayEnd:47 },
  { name: 'CS/Post order', url: 'https://ops.wolt.com/.../664324a0510ac011feaa798c', colNames:5,  colData:6,  activeStart:4,  activeEnd:27, awayStart:28, awayEnd:47 },
  { name: 'PSR',           url: 'https://ops.wolt.com/.../6567a44af7d470550b11dc68',  colNames:7,  colData:8,  activeStart:4,  activeEnd:27, awayStart:28, awayEnd:47 },
  { name: 'SiMo',          url: 'https://ops.wolt.com/.../6668088fc6d870f3cfd61653',  colNames:9,  colData:10, activeStart:4,  activeEnd:27, awayStart:28, awayEnd:47 },
  { name: 'Aircall',       url: 'https://ops.wolt.com/.../671a26a2a5b9ae4a2ca603fb', colNames:11, colData:12, activeStart:4,  activeEnd:27, awayStart:28, awayEnd:47 },
  { name: 'Venue',         url: 'https://ops.wolt.com/.../666807fc28b3f1231948f407', colNames:13, colData:14, activeStart:4,  activeEnd:27, awayStart:28, awayEnd:47 },
  { name: 'Trainee',       url: 'https://wolt.com/',                         colNames:15, colData:16, activeStart:4,  activeEnd:27, awayStart:28, awayEnd:47 },
  { name: 'ST',            url: 'https://wolt.com/',                         colNames:17, colData:18, activeStart:4,  activeEnd:27, awayStart:28, awayEnd:47 },
];

// для бейджей смен и отображения имён
const shiftBadgeClasses = {
  CS:      'badge-primary',
  'CS PO': 'badge-danger',
  PSR:     'badge-success',
  Simo:    'badge-info',
  Aircall: 'badge-warning',
  Venue:   'badge-warning',
  Trainee: 'badge-light text-dark',
  ST:      'badge-dark',
  SUMO:    'badge-secondary',
};
const shiftDisplayNames = {
  'CS/Post order': 'CS PO',
  'CS/Post Order': 'CS PO',
  'CS / Post order': 'CS PO',
  'CS / Post Order': 'CS PO',
  'Special task':   'ST',
  'SiMo/Aircall':   'SUMO',
};

// ——————————————————————————————
// 2) ПРОКСИ-ФУНКЦИИ
// ——————————————————————————————

async function fetchSheetData(range) {
  const res = await fetch(SHEETS_PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ range })
  });
  const json = await res.json();
  return json.values;
}

async function fetchAircallProxy(body) {
  const res = await fetch(AIRCALL_PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

async function fetchWeatherProxy(city) {
  const res = await fetch(`${WEATHER_PROXY_URL}?city=${encodeURIComponent(city)}`);
  return res.json();
}

// ——————————————————————————————
// 3) УТИЛИТЫ
// ——————————————————————————————

function setDoNotDisturb(v) {
  doNotDisturb = v;
  localStorage.setItem('doNotDisturb', v);
}

function normalize(str) {
  return String(str||'').toLowerCase().replace(/[\s\/-]+/g,'');
}

function getEmployeeShiftName(name) {
  const rec = shiftsQuinyxData.find(r=> normalize(r.name)===normalize(name));
  return rec?.platform||'';
}

function showDesktopNotification(title, body) {
  if (doNotDisturb) return;
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}
function pushInPageNotification(msg) {
  if (doNotDisturb) return;
  notificationQueue.unshift(msg);
  renderNotificationBadge();
}

function renderNotificationBadge() {
  const cnt = document.getElementById('notification-count');
  cnt.textContent = notificationQueue.length;
  cnt.style.display = notificationQueue.length? 'block':'none';
}

// ——————————————————————————————
// 4) РЕНДЕРИНГ КОМПОНЕНТОВ
// ——————————————————————————————

async function renderWeatherCards() {
  const general = document.getElementById('summary-general');
  const cities = [
    { city: 'Baku,AZ', title: 'Baku Weather',       tempId:'temp-baku', windId:'wind-baku' },
    { city: 'Ganja,AZ', title: 'Ganja Weather',      tempId:'temp-ganja',windId:'wind-ganja'},
    { city: 'Lankaran,AZ', title:'Lankaran Weather', tempId:'temp-lank', windId:'wind-lank'},
    { city: 'Nakhchivan,AZ', title:'Nakhchivan',     tempId:'temp-nakh', windId:'wind-nakh'},
    { city: 'Mingachevir,AZ', title:'Mingachevir',    tempId:'temp-ming', windId:'wind-ming'},
  ];
  for (let {city,title,tempId,windId} of cities) {
    const card = document.createElement('div');
    card.className = 'stats-card';
    card.innerHTML = `
      <div class="stats-title">${title}</div>
      <div id="${tempId}" class="stats-value">--</div>
      <div class="stats-title" style="margin-top:.5rem;">Wind</div>
      <div id="${windId}" class="stats-value small">--</div>
    `;
    general.appendChild(card);
    const data = await fetchWeatherProxy(city);
    const t = data.main?.temp!=null? `${Math.round(data.main.temp)}°C`: '--';
    const w = data.wind?.speed!=null? `${data.wind.speed.toFixed(1)} m/s`:'--';
    document.getElementById(tempId).textContent = t;
    document.getElementById(windId).textContent = w;
  }
}

function renderShiftSummary(data) {
  const general  = document.getElementById('summary-general');
  const platform = document.getElementById('summary-platforms');
  general.innerHTML = '';
  platform.innerHTML = '';
  const cards = [
    { title:'On shift now',  value:data[6][27] },
    { title:'Should be',     value:data[6][29] },
    { title:'CS',            value:data[6][31], away:data[8][31] },
    { title:'CS/Post Order', value:data[6][33], away:data[8][33] },
    { title:'PSR',           value:data[6][35], away:data[8][35] },
    { title:'SiMo',          value:data[6][41], away:data[8][41] },
    { title:'Aircall',       value:data[6][39], away:data[8][39] },
    { title:'Venue',         value:data[6][37], away:data[8][37] },
    { title:'Trainee',       value:data[11][41],away:data[13][41] },
    { title:'ST',            value:data[6][43], away:data[8][43] },
    { title:'Not here',      value:`${data[8][29]||0}`,   customClass:'small-font-card' },
    { title:'WNATS',         value:`${data[8][27]||0}`,   customClass:'small-font-card' },
  ];
  for (let c of cards) {
    if (!c.value) continue;
    const d = document.createElement('div');
    d.className = `stats-card ${c.customClass||''}`;
    d.innerHTML = `
      <div class="stats-title">${c.title}</div>
      <div class="stats-value">${c.value}</div>
      ${c.away!=null?`<div class="stats-value small">Away: ${c.away||0}</div>`:''}
    `;
    ['CS','CS/Post Order','PSR','SiMo','Aircall','Venue','Trainee','ST']
      .includes(c.title)
      ? platform.appendChild(d)
      : general.appendChild(d);
  }
}

function renderPlatforms() {
  const container = document.getElementById('platforms-container');
  container.innerHTML = '';
  platforms.forEach(pl => {
    if (!currentPlatformFilter.includes('all') && !currentPlatformFilter.includes(pl.name)) return;

    if (pl.name !== 'Aircall') {
      // собираем active / away списки
      let active = [];
      for (let r=pl.activeStart;r<=pl.activeEnd;r++){
        const n = fetchedData[r]?.[pl.colNames]?.trim();
        if (n) active.push(n);
      }
      let away = [];
      for (let r=pl.awayStart;r<=pl.awayEnd;r++){
        const n = fetchedData[r]?.[pl.colNames]?.trim();
        if (n) away.push({ name:n, reason:(fetchedData[r][pl.colData]||'').trim() });
      }
      // фильтры, поиск, DnD пропуск
      if (currentSearchTerm) {
        active = active.filter(n => n.toLowerCase().includes(currentSearchTerm.toLowerCase()));
        away   = away.filter(a=>a.name.toLowerCase().includes(currentSearchTerm.toLowerCase()));
      }
      active = active.filter(n=>{
        const info = employeeData[n]||{};
        if (currentReallocFilter!=='all' && info.canReallocate!==currentReallocFilter) return false;
        return true;
      });
      // отрисовка одной карточки
      const card = document.createElement('div');
      card.className = 'platform-card';
      let html = `<h5>
        <a href="${pl.url}" target="_blank">${pl.name}</a>
      </h5>`;
      html += `<p><small>Active (${active.length})</small></p><ul>`;
      active.forEach(n=>{
        const shift = shiftDisplayNames[getEmployeeShiftName(n)]||getEmployeeShiftName(n);
        const cls   = shiftBadgeClasses[shift]||'badge-secondary';
        html += `<li><span class="badge badge-pill ${cls}">${shift}</span> ${n}</li>`;
      });
      html += `</ul><p><small>Away (${away.length})</small></p><ul>`;
      away.forEach(({name,reason})=>{
        const shift = shiftDisplayNames[getEmployeeShiftName(name)]||getEmployeeShiftName(name);
        const cls   = shiftBadgeClasses[shift]||'badge-secondary';
        html += `<li><span class="badge badge-pill ${cls}">${shift}</span> ${name} ${reason?`<span class="text-muted">(${reason})</span>`:''}</li>`;
      });
      html += `</ul>`;
      card.innerHTML = html;
      container.appendChild(card);
    } else {
      // Aircall: используем отдельный рендер, аналогично
    }
  });
}

// ——————————————————————————————
// 5) FETCH & ИНИЦИАЛИЗАЦИЯ
// ——————————————————————————————

async function fetchData() {
  // 1) листы
  fetchedData = await fetchSheetData(RANGE);
  const shiftData = await fetchSheetData(SHIFT_RANGE);
  const respData  = await fetchSheetData(RESPONSIBLES_RANGE);
  allBreaksData   = await fetchSheetData(BREAKS_RANGE)
                       .then(rows=>{
                         // конвертируем A1:D в объекты {Name, Break Time, ...}
                         const [hdr, ...body] = rows;
                         return body.map(r=>{
                           const o = {};
                           hdr.forEach((k,i)=>o[k]=r[i]||'');
                           return o;
                         });
                       });
  shiftsQuinyxData = await fetchSheetData(SHIFT_QUINYX_RANGE)
                           .then(rows=>rows.slice(1).map(r=>({shiftName:r[0], name:r[1], shift:r[2]})));
  // 2) список сотрудников
  const rawEmpl = await fetchSheetData('emplist!A1:I');
  rawEmpl.slice(1).forEach(r=>{
    if (!r[0]) return;
    employeeData[r[0].trim()] = {
      id:            r[1]?.trim()||'',
      role:          r[2]?.trim()||'',
      canReallocate: r[3]?.trim()||'No',
      prime:         r[4]?.trim()||'',
      pref:          r[5]?.trim()||'',
      languages:     r[6]?.trim()||'',
      capacity:      r[7]?.trim()||'0',
      startDate:     r[8]?.trim()||''
    };
  });

  // 3) рендер всех блоков
  renderShiftSummary(fetchedData);
  await renderWeatherCards();
  renderPlatforms();

  // 4) запуск авто-обновления
  setTimeout(refreshNow, REFRESH_INTERVAL*1000);
}

function refreshNow(){
  fetchData();
  document.getElementById('refresh-icon').classList.add('rotating');
  setTimeout(()=>{
    document.getElementById('refresh-icon').classList.remove('rotating');
  }, 500);
}

// ——————————————————————————————
// 6) DOMContentLoaded + слушатели
// ——————————————————————————————

document.addEventListener('DOMContentLoaded',()=>{
  // темы, DnD, уведомления
  document.getElementById('dnd-toggle').checked = doNotDisturb;
  document.getElementById('dnd-toggle')
    .addEventListener('change', e=> setDoNotDisturb(e.target.checked));

  document.getElementById('notification-bell')
    .addEventListener('click',()=>{
      const panel = document.getElementById('notifications-panel');
      panel.classList.toggle('show');
      renderNotificationBadge();
    });

  // поиск и фильтры
  document.getElementById('employee-search')
    .addEventListener('input', e=>{
      currentSearchTerm = e.target.value;
      renderPlatforms();
    });
  document.getElementById('status-filter')
    .addEventListener('change',e=>{
      currentStatusFilter = e.target.value;
      renderPlatforms();
    });
  document.getElementById('realloc-filter')
    .addEventListener('change',e=>{
      currentReallocFilter = e.target.value;
      renderPlatforms();
    });
  document.getElementById('lang-filter')
    .addEventListener('change',e=>{
      currentLangFilter = e.target.value;
      renderPlatforms();
    });
  document.getElementById('break-filter')
    .addEventListener('change',e=>{
      currentBreakFilter = e.target.value;
      fetchData();
    });

  // разрешаем desktop-уведомления
  if (window.Notification) Notification.requestPermission();

  // стартуем
  fetchData();
});
