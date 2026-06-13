import { useMemo, useState } from 'react';
import { Bed, Plus, Search, Trash2, RotateCcw, CheckCircle2, AlertTriangle, ClipboardList, CalendarDays, Upload, FileText, X, AlertCircle, CheckCheck, LayoutGrid, List } from 'lucide-react';
import './App.css';

const appConfig = {
  "id": "hxwl-61311",
  "port": 61311,
  "title": "透析中心床位周转看板",
  "subtitle": "床位时段、状态流转和时间重叠提示",
  "domain": "透析中心",
  "icon": "Bed",
  "storage": "hxwl-61311-dialysis-bed",
  "accent": "#16a34a",
  "statuses": [
    "待到达",
    "透析中",
    "清洁中",
    "已完成"
  ],
  "primaryStatus": "待到达",
  "fields": [
    {
      "key": "patient",
      "label": "患者",
      "type": "input",
      "placeholder": "吴阿姨",
      "options": []
    },
    {
      "key": "date",
      "label": "透析日期",
      "type": "date",
      "placeholder": "",
      "options": []
    },
    {
      "key": "shift",
      "label": "班次",
      "type": "select",
      "placeholder": "上午",
      "options": [
        "上午",
        "下午",
        "夜间"
      ]
    },
    {
      "key": "bed",
      "label": "床位号",
      "type": "select",
      "placeholder": "B03",
      "options": [
        "B01",
        "B02",
        "B03",
        "B04",
        "B05"
      ]
    },
    {
      "key": "start",
      "label": "预计开始时间",
      "type": "time",
      "placeholder": "08:00",
      "options": []
    },
    {
      "key": "end",
      "label": "预计结束时间",
      "type": "time",
      "placeholder": "12:00",
      "options": []
    }
  ],
  "seed": [
    {
      "patient": "吴阿姨",
      "date": "2026-06-13",
      "shift": "上午",
      "bed": "B03",
      "start": "08:00",
      "end": "12:00",
      "status": "透析中"
    },
    {
      "patient": "赵先生",
      "date": "2026-06-13",
      "shift": "下午",
      "bed": "B03",
      "start": "12:30",
      "end": "16:30",
      "status": "待到达"
    },
    {
      "patient": "陈叔叔",
      "date": "2026-06-13",
      "shift": "上午",
      "bed": "B01",
      "start": "08:30",
      "end": "12:30",
      "status": "清洁中"
    }
  ],
  "metrics": [
    [
      "今日安排",
      "records.filter((item) => item.date === today).length"
    ],
    [
      "透析中",
      "records.filter((item) => item.status === '透析中').length"
    ],
    [
      "床位数",
      "new Set(records.map((item) => item.bed)).size"
    ]
  ],
  "filters": [
    {
      "key": "query",
      "label": "患者/床位",
      "type": "search",
      "match": "`${item.patient}${item.bed}${item.shift}`.includes(filters.query)"
    },
    {
      "key": "status",
      "label": "床位状态",
      "type": "status"
    }
  ],
  "cardTitle": "`${item.bed} · ${item.patient}`",
  "cardMeta": "`${item.date} ${item.shift} · ${item.start}-${item.end}`",
  "cardDetail": "hasOverlap(item, records) ? '存在床位时间重叠，请调整安排' : '床位时间正常'",
  "dateKey": "date",
  "conflict": "bed-time",
  "board": true,
  "note": "先用前端模拟数据实现最小闭环。",
  "defaultValues": {
    "patient": "吴阿姨",
    "date": "",
    "shift": "上午",
    "bed": "B03",
    "start": "08:00",
    "end": "12:00",
    "status": "待到达"
  }
};

const today = new Date().toISOString().slice(0, 10);

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function withIds(items) {
  return items.map((item) => ({ id: uid(), timeline: item.timeline || [{ status: item.status, at: today, by: '系统' }], ...item }));
}

function loadRecords() {
  const raw = localStorage.getItem(appConfig.storage);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return withIds(appConfig.seed);
    }
  }
  return withIds(appConfig.seed);
}

function avg(numbers) {
  const valid = numbers.filter((value) => Number.isFinite(value));
  if (!valid.length) return 0;
  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function money(value) {
  return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 }).format(value || 0);
}

function inNextDays(dateText, days) {
  if (!dateText) return false;
  const date = new Date(dateText);
  const now = new Date(today);
  const diff = (date.getTime() - now.getTime()) / 86400000;
  return diff >= 0 && diff <= days;
}

function latestTemp(item) {
  const temps = item.temps || [Number(item.temperature)];
  return temps[temps.length - 1];
}

function hasHotTemp(item) {
  const temps = item.temps || [Number(item.temperature)];
  return temps.some((value) => Number(value) > 2);
}

function priorityRank(value) {
  return { 危急: 0, 加急: 1, 常规: 2, 高: 0, 中: 1, 低: 2 }[value] ?? 9;
}

function hasOverlap(target, records) {
  if (!target.bed || !target.date || !target.start || !target.end) return false;
  return records.some((item) => item.id !== target.id && item.bed === target.bed && item.date === target.date && target.start < item.end && target.end > item.start);
}

function statusClass(status) {
  const index = appConfig.statuses.indexOf(status);
  return ['status-a', 'status-b', 'status-c', 'status-d'][index] || 'status-a';
}

const TIME_REGEX = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
const DATE_REGEX = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/;

const FIELD_ALIASES = {
  patient: ['患者', '姓名', '病人', 'patient', 'name'],
  date: ['日期', '透析日期', '排班日期', 'date'],
  shift: ['班次', '时段', 'shift'],
  bed: ['床位', '床位号', '床号', 'bed'],
  start: ['开始时间', '开始', '预计开始', 'start'],
  end: ['结束时间', '结束', '预计结束', 'end'],
  status: ['状态', '当前状态', 'status']
};

function detectSeparator(line) {
  const counts = {
    ',': (line.match(/,/g) || []).length,
    '\t': (line.match(/\t/g) || []).length,
    '|': (line.match(/\|/g) || []).length,
    ';': (line.match(/;/g) || []).length
  };
  let best = ',';
  let max = -1;
  for (const [sep, count] of Object.entries(counts)) {
    if (count > max) {
      max = count;
      best = sep;
    }
  }
  return max > 0 ? best : null;
}

function matchField(header) {
  const h = String(header || '').trim().toLowerCase();
  for (const [key, aliases] of Object.entries(FIELD_ALIASES)) {
    if (aliases.some((a) => a.toLowerCase() === h || h.includes(a.toLowerCase()))) {
      return key;
    }
  }
  return null;
}

function normalizeDate(text) {
  if (!text) return '';
  const t = String(text).trim();
  const m = t.match(DATE_REGEX);
  if (m) {
    const y = m[1];
    const mo = String(m[2]).padStart(2, '0');
    const d = String(m[3]).padStart(2, '0');
    return `${y}-${mo}-${d}`;
  }
  return t;
}

function isValidTime(text) {
  if (!text) return false;
  return TIME_REGEX.test(String(text).trim());
}

function normalizeTime(text) {
  if (!text) return '';
  const t = String(text).trim();
  const m = t.match(TIME_REGEX);
  if (m) {
    return `${String(m[1]).padStart(2, '0')}:${m[2]}`;
  }
  return t;
}

function parsePasteText(text) {
  const rawLines = String(text || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (rawLines.length === 0) return [];

  const sep = detectSeparator(rawLines[0]) || /\s+/;
  const splitLine = (line) => {
    if (typeof sep === 'string') {
      return line.split(sep).map((s) => s.trim());
    }
    return line.split(sep).map((s) => s.trim());
  };

  let headerMap = null;
  let startIdx = 0;
  const firstParts = splitLine(rawLines[0]);
  const matchedCount = firstParts.filter((p) => matchField(p)).length;
  if (matchedCount >= 3) {
    headerMap = {};
    firstParts.forEach((p, i) => {
      const f = matchField(p);
      if (f) headerMap[i] = f;
    });
    startIdx = 1;
  }

  const requiredKeys = ['patient', 'date', 'shift', 'bed', 'start', 'end'];
  if (!headerMap) {
    const n = firstParts.length;
    headerMap = {};
    for (let i = 0; i < n && i < requiredKeys.length; i++) {
      headerMap[i] = requiredKeys[i];
    }
    if (n > requiredKeys.length) headerMap[requiredKeys.length] = 'status';
    startIdx = 0;
  }

  const result = [];
  for (let i = startIdx; i < rawLines.length; i++) {
    const parts = splitLine(rawLines[i]);
    if (parts.every((p) => !p)) continue;
    const row = { patient: '', date: '', shift: '', bed: '', start: '', end: '', status: '' };
    for (const [idx, key] of Object.entries(headerMap)) {
      row[key] = parts[Number(idx)] || '';
    }
    row.lineNo = i + 1;
    result.push(row);
  }
  return result;
}

function validateParsed(parsed, existingRecords) {
  return parsed.map((row) => {
    const errors = [];
    const warnings = [];

    if (!String(row.patient || '').trim()) errors.push('缺少患者');
    if (!String(row.date || '').trim()) errors.push('缺少日期');
    if (!String(row.shift || '').trim()) errors.push('缺少班次');
    if (!String(row.bed || '').trim()) errors.push('缺少床位');
    if (!String(row.start || '').trim()) errors.push('缺少开始时间');
    if (!String(row.end || '').trim()) errors.push('缺少结束时间');

    if (row.date && !DATE_REGEX.test(normalizeDate(row.date))) {
      errors.push('日期格式错误');
    }
    if (row.start && !isValidTime(row.start)) {
      errors.push('开始时间格式错误');
    }
    if (row.end && !isValidTime(row.end)) {
      errors.push('结束时间格式错误');
    }
    if (row.start && row.end && isValidTime(row.start) && isValidTime(row.end) && !(normalizeTime(row.start) < normalizeTime(row.end))) {
      errors.push('开始时间须早于结束时间');
    }

    const normalized = {
      ...row,
      date: normalizeDate(row.date),
      start: normalizeTime(row.start),
      end: normalizeTime(row.end),
      status: row.status || appConfig.primaryStatus
    };

    if (errors.length === 0) {
      const allForCheck = [...existingRecords, ...parsed.filter((r, i) => parsed.indexOf(row) > i).map((r) => ({ id: `_pre_${parsed.indexOf(r)}`, bed: normalizeDate(r.bed), date: normalizeDate(r.date), start: normalizeTime(r.start), end: normalizeTime(r.end) }))];
      const tempTarget = { id: `_cur_${parsed.indexOf(row)}`, ...normalized };
      const overlapExisting = existingRecords.some((item) =>
        item.bed === normalized.bed &&
        item.date === normalized.date &&
        normalized.start < item.end &&
        normalized.end > item.start
      );
      const overlapInBatch = parsed.some((other, idx) => {
        if (other === row) return false;
        const od = normalizeDate(other.date);
        const os = normalizeTime(other.start);
        const oe = normalizeTime(other.end);
        const ob = String(other.bed || '').trim();
        if (!ob || !od || !os || !oe) return false;
        return ob === normalized.bed && od === normalized.date && normalized.start < oe && normalized.end > os;
      });
      if (overlapExisting || overlapInBatch) {
        warnings.push('床位时间重叠');
      }
    }

    return {
      row: normalized,
      errors,
      warnings,
      valid: errors.length === 0
    };
  });
}

function App() {
  const [records, setRecords] = useState(loadRecords);
  const [form, setForm] = useState(appConfig.defaultValues);
  const [filters, setFilters] = useState({ query: '', status: '全部' });
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [parsedPreview, setParsedPreview] = useState([]);

  function persist(next) {
    setRecords(next);
    localStorage.setItem(appConfig.storage, JSON.stringify(next));
  }

  function handleImportOpen() {
    setImportOpen(true);
    setImportText('');
    setParsedPreview([]);
  }

  function handleImportClose() {
    setImportOpen(false);
    setImportText('');
    setParsedPreview([]);
  }

  function handleParse() {
    const parsed = parsePasteText(importText);
    const validated = validateParsed(parsed, records);
    setParsedPreview(validated);
  }

  function handleConfirmImport() {
    const validItems = parsedPreview.filter((p) => p.valid);
    if (validItems.length === 0) return;
    const newRecords = validItems.map((p) => ({
      id: uid(),
      patient: String(p.row.patient || '').trim(),
      date: p.row.date,
      shift: String(p.row.shift || '').trim(),
      bed: String(p.row.bed || '').trim(),
      start: p.row.start,
      end: p.row.end,
      status: appConfig.statuses.includes(p.row.status) ? p.row.status : appConfig.primaryStatus,
      createdAt: new Date().toISOString(),
      timeline: [{ status: appConfig.statuses.includes(p.row.status) ? p.row.status : appConfig.primaryStatus, at: today, by: '批量导入' }]
    }));
    persist([...newRecords, ...records]);
    setImportOpen(false);
    setImportText('');
    setParsedPreview([]);
  }

  const importStats = useMemo(() => {
    const total = parsedPreview.length;
    const valid = parsedPreview.filter((p) => p.valid).length;
    const withErrors = total - valid;
    const withWarnings = parsedPreview.filter((p) => p.warnings.length > 0).length;
    return { total, valid, withErrors, withWarnings };
  }, [parsedPreview]);

  function addRecord(event) {
    event.preventDefault();
    const nextRecord = {
      id: uid(),
      ...form,
      status: form.status || appConfig.primaryStatus,
      createdAt: new Date().toISOString(),
      timeline: [{ status: form.status || appConfig.primaryStatus, at: today, by: '录入' }]
    };

    if (appConfig.conflict === 'date-slot' && records.some((item) => item.date === nextRecord.date && item.slot === nextRecord.slot)) {
      nextRecord.conflict = true;
    }
    if (appConfig.conflict === 'bed-time' && hasOverlap(nextRecord, records)) {
      nextRecord.conflict = true;
    }
    if (appConfig.chart) {
      const temp = Number(nextRecord.temperature || 0);
      nextRecord.temps = [temp];
      if (temp > 2) nextRecord.status = '异常';
    }

    persist([nextRecord, ...records]);
    setForm(appConfig.defaultValues);
    setSelected(nextRecord);
  }

  function updateStatus(id, status) {
    const next = records.map((item) => item.id === id ? {
      ...item,
      status,
      timeline: [...(item.timeline || []), { status, at: today, by: '操作员' }]
    } : item);
    persist(next);
    if (selected?.id === id) setSelected(next.find((item) => item.id === id));
  }

  function removeRecord(id) {
    const next = records.filter((item) => item.id !== id);
    persist(next);
    if (selected?.id === id) setSelected(null);
  }

  function duplicateRecord(item) {
    const copied = { ...item, id: uid(), status: appConfig.primaryStatus, timeline: [{ status: appConfig.primaryStatus, at: today, by: '复制' }] };
    persist([copied, ...records]);
    setSelected(copied);
  }

  function addTemperature(item) {
    const value = Number(prompt('录入新的温度读数'));
    if (!Number.isFinite(value)) return;
    const next = records.map((record) => record.id === item.id ? {
      ...record,
      temps: [...(record.temps || []), value],
      temperature: String(value),
      status: value > 2 ? '异常' : record.status
    } : record);
    persist(next);
    setSelected(next.find((record) => record.id === item.id));
  }

  const filteredRecords = useMemo(() => {
    return records
      .filter((item) => !filters.query || `${item.patient}${item.bed}${item.shift}`.includes(filters.query))
      .filter((item) => filters.status === '全部' || item.status === filters.status)
      .sort((a, b) => {
        if (appConfig.sort === 'priority') {
          const rank = priorityRank(a.priority) - priorityRank(b.priority);
          if (rank !== 0) return rank;
        }
        const aDate = a[appConfig.dateKey] || a.sentAt || a.createdAt || '';
        const bDate = b[appConfig.dateKey] || b.sentAt || b.createdAt || '';
        return String(aDate).localeCompare(String(bDate));
      });
  }, [records, filters]);

  const metrics = [
    { label: "今日安排", value: records.filter((item) => item.date === today).length },
    { label: "透析中", value: records.filter((item) => item.status === '透析中').length },
    { label: "床位数", value: new Set(records.map((item) => item.bed)).size },
  ];

  const groupedByDate = useMemo(() => {
    return filteredRecords.reduce((acc, item) => {
      const key = item[appConfig.dateKey] || item.date || item.enrollDate || '未排期';
      (acc[key] ||= []).push(item);
      return acc;
    }, {});
  }, [filteredRecords]);

  const calendarDates = useMemo(() => {
    const dates = new Set(filteredRecords.map((item) => item.date).filter(Boolean));
    return Array.from(dates).sort();
  }, [filteredRecords]);

  const calendarBeds = useMemo(() => {
    const bedField = appConfig.fields.find((f) => f.key === 'bed');
    const configBeds = bedField?.options || [];
    const recordBeds = filteredRecords.map((item) => item.bed).filter(Boolean);
    return Array.from(new Set([...configBeds, ...recordBeds])).sort();
  }, [filteredRecords]);

  const calendarGrid = useMemo(() => {
    const grid = {};
    for (const date of calendarDates) {
      grid[date] = {};
      for (const bed of calendarBeds) {
        grid[date][bed] = filteredRecords
          .filter((item) => item.date === date && item.bed === bed)
          .sort((a, b) => (a.start || '').localeCompare(b.start || ''));
      }
    }
    return grid;
  }, [filteredRecords, calendarDates, calendarBeds]);

  const directory = useMemo(() => {
    return records.reduce((acc, item) => {
      const key = item.issue || '未分类';
      (acc[key] ||= []).push(item);
      return acc;
    }, {});
  }, [records]);

  return (
    <main className="shell" style={{ '--accent': appConfig.accent }}>
      <section className="hero">
        <div>
          <div className="eyebrow"><Bed size={18} />{appConfig.domain}</div>
          <h1>{appConfig.title}</h1>
          <p>{appConfig.subtitle}</p>
        </div>
        <div className="port-card">
          <span>Local Port</span>
          <strong>{appConfig.port}</strong>
        </div>
      </section>

      <section className="metrics">
        {metrics.map((metric) => (
          <article className="metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="form-stack">
          <form className="panel form-panel" onSubmit={addRecord}>
            <div className="panel-title">
              <ClipboardList size={18} />
              <h2>新增记录</h2>
            </div>
            <div className="form-grid">
              {appConfig.fields.map((field) => (
                <label key={field.key} className={field.type === 'textarea' ? 'wide' : ''}>
                  <span>{field.label}</span>
                  {field.type === 'textarea' ? (
                    <textarea value={form[field.key] || ''} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} placeholder={field.placeholder} />
                  ) : field.type === 'select' ? (
                    <select value={form[field.key] || ''} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })}>
                      {field.options.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  ) : (
                    <input type={field.type} value={form[field.key] || ''} onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} placeholder={field.placeholder} />
                  )}
                </label>
              ))}
              <label>
                <span>当前状态</span>
                <select value={form.status || appConfig.primaryStatus} onChange={(event) => setForm({ ...form, status: event.target.value })}>
                  {appConfig.statuses.map((status) => <option key={status}>{status}</option>)}
                </select>
              </label>
            </div>
            <div className="form-actions">
              <button className="primary" type="submit"><Plus size={18} />新增</button>
              <button type="button" className="secondary" onClick={handleImportOpen}><Upload size={18} />批量导入</button>
            </div>
            <p className="hint">{appConfig.note}</p>
          </form>
        </div>

        <section className="panel list-panel">
          <div className="toolbar">
            <div className="search">
              <Search size={16} />
              <input value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} placeholder={appConfig.filters[0]?.label || '搜索'} />
            </div>
            <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}>
              <option>全部</option>
              {appConfig.statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
            <div className="view-toggle">
              <button type="button" className={'toggle-btn ' + (viewMode === 'list' ? 'active' : '')} onClick={() => setViewMode('list')} title="列表视图">
                <List size={16} />
              </button>
              <button type="button" className={'toggle-btn ' + (viewMode === 'calendar' ? 'active' : '')} onClick={() => setViewMode('calendar')} title="日历视图">
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="records">
              {filteredRecords.map((item) => (
                <article className={'record ' + (item.conflict || hasOverlap(item, records) ? 'conflict' : '')} key={item.id} onClick={() => setSelected(item)}>
                  <div className="record-head">
                    <div>
                      <h3>{`${item.bed} · ${item.patient}`}</h3>
                      <p>{`${item.date} ${item.shift} · ${item.start}-${item.end}`}</p>
                    </div>
                    <span className={'status ' + statusClass(item.status)}>{item.status}</span>
                  </div>
                  <p className="record-detail">{hasOverlap(item, records) ? '存在床位时间重叠，请调整安排' : '床位时间正常'}</p>
                  {(item.conflict || hasOverlap(item, records)) && <div className="warning"><AlertTriangle size={15} />发现冲突</div>}
                  <div className="actions" onClick={(event) => event.stopPropagation()}>
                    {appConfig.statuses.map((status) => (
                      <button key={status} type="button" onClick={() => updateStatus(item.id, status)}>{status}</button>
                    ))}
                    {appConfig.action === 'copyRecipe' && <button type="button" onClick={() => duplicateRecord(item)}><RotateCcw size={14} />复制</button>}
                    {appConfig.chart && <button type="button" onClick={() => addTemperature(item)}>加温度</button>}
                    <button className="ghost-danger" type="button" onClick={() => removeRecord(item.id)}><Trash2 size={14} /></button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="calendar-wrap">
              {calendarDates.length === 0 || calendarBeds.length === 0 ? (
                <p className="empty">暂无排班数据</p>
              ) : (
                <div className="calendar-grid" style={{ gridTemplateColumns: `110px repeat(${calendarDates.length}, minmax(180px, 1fr))` }}>
                  <div className="calendar-corner"></div>
                  {calendarDates.map((date) => (
                    <div className="calendar-col-header" key={date}>
                      <strong>{date}</strong>
                      <span>{new Date(date).toLocaleDateString('zh-CN', { weekday: 'short' })}</span>
                    </div>
                  ))}
                  {calendarBeds.flatMap((bed) => {
                    const rowHeader = (
                      <div className="calendar-row-header" key={`row-${bed}`}>
                        <Bed size={14} />
                        <span>{bed}</span>
                      </div>
                    );
                    const cells = calendarDates.map((date) => {
                      const cellItems = calendarGrid[date]?.[bed] || [];
                      return (
                        <div className="calendar-cell" key={`${bed}-${date}`}>
                          {cellItems.length === 0 ? (
                            <span className="cell-empty">空闲</span>
                          ) : (
                            cellItems.map((item) => {
                              const isConflict = item.conflict || hasOverlap(item, records);
                              return (
                                <div
                                  key={item.id}
                                  className={'cal-item ' + (isConflict ? 'conflict' : '')}
                                  onClick={() => setSelected(item)}
                                >
                                  <div className="cal-item-head">
                                    <span className="cal-patient">{item.patient}</span>
                                    <span className={'status ' + statusClass(item.status)}>{item.status}</span>
                                  </div>
                                  <div className="cal-item-meta">
                                    <span className="cal-shift">{item.shift}</span>
                                    <span className="cal-time">{item.start}-{item.end}</span>
                                  </div>
                                  {isConflict && <div className="cal-warning"><AlertTriangle size={12} />冲突</div>}
                                </div>
                              );
                            })
                          )}
                        </div>
                      );
                    });
                    return [rowHeader, ...cells];
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      </section>

      <section className="insights">
        <div className="panel">
          <div className="panel-title">
            <CalendarDays size={18} />
            <h2>{appConfig.directory ? '证据目录预览' : appConfig.board ? '床位看板' : '分组视图'}</h2>
          </div>
          {appConfig.directory ? (
            <div className="directory">
              {Object.entries(directory).map(([issue, items]) => (
                <div key={issue} className="directory-group">
                  <strong>{issue}</strong>
                  {items.map((item, index) => <span key={item.id}>{index + 1}. {item.evidence}｜{item.purpose}</span>)}
                </div>
              ))}
            </div>
          ) : (
            <div className="date-groups">
              {Object.entries(groupedByDate).map(([date, items]) => (
                <div key={date} className="date-group">
                  <strong>{date}</strong>
                  <span>{items.length}条记录</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="panel detail-panel">
          <div className="panel-title">
            <CheckCircle2 size={18} />
            <h2>详情</h2>
          </div>
          {selected ? (
            <div className="detail">
              <h3>{`${selected.bed} · ${selected.patient}`}</h3>
              <p>{`${selected.date} ${selected.shift} · ${selected.start}-${selected.end}`}</p>
              <p>{hasOverlap(selected, records) ? '存在床位时间重叠，请调整安排' : '床位时间正常'}</p>
              {selected.temps && (
                <div className="temp-chart">
                  {selected.temps.map((value, index) => <i key={index} style={{ height: Math.max(10, 56 + Number(value) * 8) }} title={String(value)} />)}
                </div>
              )}
              <div className="timeline">
                {(selected.timeline || []).map((step, index) => (
                  <span key={index}>{step.at} · {step.status} · {step.by}</span>
                ))}
              </div>
            </div>
          ) : (
            <p className="empty">点击任意记录查看详情和状态流转。</p>
          )}
        </aside>
      </section>

      {importOpen && (
        <div className="modal-overlay" onClick={handleImportClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="panel-title">
                <FileText size={18} />
                <h2>批量排班导入预览</h2>
              </div>
              <button type="button" className="icon-btn" onClick={handleImportClose}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="import-hint">
                <p>粘贴排班文本或 CSV 内容，支持逗号、Tab、竖线或空格分隔，可含表头。字段顺序：患者、日期、班次、床位、开始时间、结束时间、状态（可选）。</p>
              </div>
              <textarea
                className="import-textarea"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={'示例（可含表头）：\n患者,日期,班次,床位,开始时间,结束时间,状态\n王阿姨,2026-06-14,上午,B02,08:00,12:00,待到达\n李大爷,2026-06-14,下午,B04,13:00,17:00,待到达'}
                rows={6}
              />
              <div className="import-actions">
                <button type="button" className="secondary" onClick={handleParse} disabled={!importText.trim()}><CheckCheck size={16} />解析预览</button>
                <span className="text-muted">
                  {importStats.total > 0 && `共 ${importStats.total} 行 · 有效 ${importStats.valid} 行 · 错误 ${importStats.withErrors} 行`}
                  {importStats.withWarnings > 0 && ` · 冲突警告 ${importStats.withWarnings} 行`}
                </span>
              </div>

              {parsedPreview.length > 0 && (
                <div className="preview-wrap">
                  <div className="preview-table">
                    <table>
                      <thead>
                        <tr>
                          <th>行</th>
                          <th>患者</th>
                          <th>日期</th>
                          <th>班次</th>
                          <th>床位</th>
                          <th>开始</th>
                          <th>结束</th>
                          <th>状态</th>
                          <th>校验</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedPreview.map((p, idx) => (
                          <tr key={idx} className={!p.valid ? 'row-error' : (p.warnings.length > 0 ? 'row-warning' : 'row-ok')}>
                            <td>{p.row.lineNo ?? idx + 1}</td>
                            <td className={!String(p.row.patient || '').trim() ? 'cell-bad' : ''}>{p.row.patient || '-'}</td>
                            <td className={!String(p.row.date || '').trim() || !DATE_REGEX.test(p.row.date) ? 'cell-bad' : ''}>{p.row.date || '-'}</td>
                            <td className={!String(p.row.shift || '').trim() ? 'cell-bad' : ''}>{p.row.shift || '-'}</td>
                            <td className={!String(p.row.bed || '').trim() ? 'cell-bad' : ''}>{p.row.bed || '-'}</td>
                            <td className={!String(p.row.start || '').trim() || !isValidTime(p.row.start) ? 'cell-bad' : ''}>{p.row.start || '-'}</td>
                            <td className={!String(p.row.end || '').trim() || !isValidTime(p.row.end) || (isValidTime(p.row.start) && isValidTime(p.row.end) && !(p.row.start < p.row.end)) ? 'cell-bad' : ''}>{p.row.end || '-'}</td>
                            <td>{p.row.status || '-'}</td>
                            <td className="validate-cell">
                              {p.errors.map((e, i) => <span key={i} className="tag tag-error"><AlertCircle size={12} />{e}</span>)}
                              {p.warnings.map((w, i) => <span key={i} className="tag tag-warn"><AlertTriangle size={12} />{w}</span>)}
                              {p.valid && p.warnings.length === 0 && <span className="tag tag-ok"><CheckCircle2 size={12} />正常</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="secondary" onClick={handleImportClose}>取消</button>
              <button type="button" className="primary" onClick={handleConfirmImport} disabled={importStats.valid === 0}>
                <Plus size={16} />确认导入 {importStats.valid} 条
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
