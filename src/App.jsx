import { useMemo, useState } from 'react';
import { Bed, Plus, Search, Trash2, RotateCcw, CheckCircle2, AlertTriangle, ClipboardList, CalendarDays } from 'lucide-react';
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

function App() {
  const [records, setRecords] = useState(loadRecords);
  const [form, setForm] = useState(appConfig.defaultValues);
  const [filters, setFilters] = useState({ query: '', status: '全部' });
  const [selected, setSelected] = useState(null);

  function persist(next) {
    setRecords(next);
    localStorage.setItem(appConfig.storage, JSON.stringify(next));
  }

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
          <button className="primary" type="submit"><Plus size={18} />新增</button>
          <p className="hint">{appConfig.note}</p>
        </form>

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
          </div>

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
              <p>{hasOverlap(item, records) ? '存在床位时间重叠，请调整安排' : '床位时间正常'}</p>
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
    </main>
  );
}

export default App;
