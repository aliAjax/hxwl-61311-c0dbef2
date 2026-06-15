import { useMemo, useState, useCallback, useRef } from 'react';
import { Bed, Plus, Search, Trash2, RotateCcw, CheckCircle2, AlertTriangle, ClipboardList, CalendarDays, Upload, FileText, X, AlertCircle, CheckCheck, LayoutGrid, List, ClipboardCopy, Clock, GitBranch, User, Calendar, Filter, ArrowRightLeft, AlertOctagon, History, Sparkles, Wand2, Save, Edit2, Activity, ChevronRight, ArrowLeft, Download, Database, HardDriveUpload } from 'lucide-react';
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
      "date": "2026-06-10",
      "shift": "上午",
      "bed": "B02",
      "start": "08:00",
      "end": "12:00",
      "status": "已完成"
    },
    {
      "patient": "吴阿姨",
      "date": "2026-06-12",
      "shift": "上午",
      "bed": "B03",
      "start": "08:00",
      "end": "12:00",
      "status": "已完成"
    },
    {
      "patient": "吴阿姨",
      "date": "2026-06-14",
      "shift": "上午",
      "bed": "B03",
      "start": "08:00",
      "end": "12:00",
      "status": "透析中"
    },
    {
      "patient": "吴阿姨",
      "date": "2026-06-16",
      "shift": "上午",
      "bed": "B03",
      "start": "08:00",
      "end": "12:00",
      "status": "待到达"
    },
    {
      "patient": "赵先生",
      "date": "2026-06-09",
      "shift": "下午",
      "bed": "B01",
      "start": "13:00",
      "end": "17:00",
      "status": "已完成"
    },
    {
      "patient": "赵先生",
      "date": "2026-06-11",
      "shift": "下午",
      "bed": "B02",
      "start": "12:30",
      "end": "16:30",
      "status": "已完成"
    },
    {
      "patient": "赵先生",
      "date": "2026-06-14",
      "shift": "下午",
      "bed": "B03",
      "start": "12:30",
      "end": "16:30",
      "status": "待到达"
    },
    {
      "patient": "赵先生",
      "date": "2026-06-15",
      "shift": "下午",
      "bed": "B04",
      "start": "13:00",
      "end": "17:00",
      "status": "待到达"
    },
    {
      "patient": "陈叔叔",
      "date": "2026-06-08",
      "shift": "上午",
      "bed": "B01",
      "start": "08:30",
      "end": "12:30",
      "status": "已完成"
    },
    {
      "patient": "陈叔叔",
      "date": "2026-06-10",
      "shift": "上午",
      "bed": "B01",
      "start": "08:30",
      "end": "12:30",
      "status": "已完成"
    },
    {
      "patient": "陈叔叔",
      "date": "2026-06-12",
      "shift": "上午",
      "bed": "B02",
      "start": "09:00",
      "end": "13:00",
      "status": "已完成"
    },
    {
      "patient": "陈叔叔",
      "date": "2026-06-14",
      "shift": "上午",
      "bed": "B01",
      "start": "08:30",
      "end": "12:30",
      "status": "清洁中"
    },
    {
      "patient": "刘奶奶",
      "date": "2026-06-11",
      "shift": "上午",
      "bed": "B04",
      "start": "09:00",
      "end": "13:00",
      "status": "已完成"
    },
    {
      "patient": "刘奶奶",
      "date": "2026-06-13",
      "shift": "上午",
      "bed": "B05",
      "start": "10:00",
      "end": "14:00",
      "status": "已完成"
    },
    {
      "patient": "刘奶奶",
      "date": "2026-06-14",
      "shift": "上午",
      "bed": "B03",
      "start": "10:00",
      "end": "14:00",
      "status": "待到达"
    },
    {
      "patient": "周大爷",
      "date": "2026-06-09",
      "shift": "夜间",
      "bed": "B02",
      "start": "19:00",
      "end": "23:00",
      "status": "已完成"
    },
    {
      "patient": "周大爷",
      "date": "2026-06-11",
      "shift": "夜间",
      "bed": "B02",
      "start": "19:00",
      "end": "23:00",
      "status": "已完成"
    },
    {
      "patient": "周大爷",
      "date": "2026-06-13",
      "shift": "夜间",
      "bed": "B03",
      "start": "18:30",
      "end": "22:30",
      "status": "已完成"
    },
    {
      "patient": "周大爷",
      "date": "2026-06-14",
      "shift": "夜间",
      "bed": "B02",
      "start": "19:00",
      "end": "23:00",
      "status": "待到达"
    },
    {
      "patient": "孙大娘",
      "date": "2026-06-10",
      "shift": "下午",
      "bed": "B04",
      "start": "14:00",
      "end": "18:00",
      "status": "已完成"
    },
    {
      "patient": "孙大娘",
      "date": "2026-06-12",
      "shift": "下午",
      "bed": "B05",
      "start": "14:00",
      "end": "18:00",
      "status": "已完成"
    },
    {
      "patient": "孙大娘",
      "date": "2026-06-14",
      "shift": "下午",
      "bed": "B04",
      "start": "14:00",
      "end": "18:00",
      "status": "待到达"
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

function getLocalDateString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const today = getLocalDateString();

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function normalizeStoredRecords(items, by = '系统') {
  if (!Array.isArray(items)) return [];
  const seenIds = new Set();
  return items.map((item) => {
    const safeItem = item && typeof item === 'object' ? item : {};
    const existingId = safeItem.id ? String(safeItem.id) : '';
    const id = existingId && !seenIds.has(existingId) ? existingId : uid();
    seenIds.add(id);
    const status = safeItem.status || appConfig.primaryStatus;
    const timeline = Array.isArray(safeItem.timeline) && safeItem.timeline.length > 0
      ? safeItem.timeline
      : [{ status, at: today, by }];
    return { ...safeItem, id, status, timeline };
  });
}

function withIds(items) {
  return normalizeStoredRecords(items);
}

function loadRecords() {
  const raw = localStorage.getItem(appConfig.storage);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      const normalized = normalizeStoredRecords(parsed, '历史数据');
      if (normalized.length > 0 && JSON.stringify(normalized) !== JSON.stringify(parsed)) {
        localStorage.setItem(appConfig.storage, JSON.stringify(normalized));
      }
      return normalized.length > 0 ? normalized : withIds(appConfig.seed);
    } catch {
      return withIds(appConfig.seed);
    }
  }
  return withIds(appConfig.seed);
}

const BACKUP_VERSION = 1;
const BACKUP_META = { appId: appConfig.id, domain: appConfig.domain };

const REQUIRED_FIELDS = ['patient', 'date', 'shift', 'bed', 'start', 'end'];

function exportBackup(records) {
  const payload = {
    version: BACKUP_VERSION,
    meta: { ...BACKUP_META, exportedAt: new Date().toISOString(), recordCount: records.length },
    records
  };
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  a.href = url;
  a.download = `${appConfig.id}-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function validateBackupRecord(record, index) {
  const errors = [];
  const warnings = [];

  if (!record || typeof record !== 'object') {
    return { valid: false, errors: [`第 ${index + 1} 条记录不是有效对象`], warnings: [], normalized: null, index };
  }

  for (const key of REQUIRED_FIELDS) {
    const val = record[key];
    if (val === undefined || val === null || String(val).trim() === '') {
      errors.push(`缺少必要字段「${appConfig.fields.find(f => f.key === key)?.label || key}」`);
    }
  }

  if (record.date && !DATE_REGEX.test(normalizeDate(record.date))) {
    errors.push('日期格式错误，应为 YYYY-MM-DD');
  }
  if (record.start && !isValidTime(record.start)) {
    errors.push('开始时间格式错误，应为 HH:MM');
  }
  if (record.end && !isValidTime(record.end)) {
    errors.push('结束时间格式错误，应为 HH:MM');
  }
  if (record.start && record.end && isValidTime(record.start) && isValidTime(record.end) && !(normalizeTime(record.start) < normalizeTime(record.end))) {
    if (String(record.shift || '').trim() !== '夜间') {
      errors.push('开始时间须早于结束时间（非夜间班次不允许跨日）');
    } else {
      warnings.push('夜间班跨日安排，系统按当日日期处理');
    }
  }
  if (record.status && !appConfig.statuses.includes(record.status)) {
    warnings.push(`状态「${record.status}」不在允许列表中，将使用默认状态「${appConfig.primaryStatus}」`);
  }

  const normalized = {
    ...record,
    date: record.date ? normalizeDate(record.date) : '',
    start: record.start ? normalizeTime(record.start) : '',
    end: record.end ? normalizeTime(record.end) : '',
    status: appConfig.statuses.includes(record.status) ? record.status : appConfig.primaryStatus,
    patient: String(record.patient || '').trim(),
    shift: String(record.shift || '').trim(),
    bed: String(record.bed || '').trim()
  };

  if (!normalized.id) {
    warnings.push('缺少 id，将自动生成');
  }
  if (!normalized.timeline || !Array.isArray(normalized.timeline) || normalized.timeline.length === 0) {
    warnings.push('缺少 timeline 历史，将自动补齐');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    normalized,
    index
  };
}

function normalizeBackupRecords(rawRecords) {
  if (!Array.isArray(rawRecords)) {
    return { validRecords: [], validationResults: [], fatal: '备份文件中 records 字段不是数组' };
  }

  const existingIds = new Set();
  const validationResults = rawRecords.map((r, idx) => {
    const result = validateBackupRecord(r, idx);
    if (result.valid && result.normalized) {
      const hadId = !!result.normalized.id;
      const originalId = result.normalized.id || null;
      if (!result.normalized.id || existingIds.has(result.normalized.id)) {
        const newId = uid();
        result.normalized.id = newId;
      }
      existingIds.add(result.normalized.id);
      result.normalized._originalId = originalId;
      result.normalized._hadIdInBackup = hadId;
      if (!result.normalized.timeline || !Array.isArray(result.normalized.timeline) || result.normalized.timeline.length === 0) {
        result.normalized.timeline = [{ status: result.normalized.status, at: today, by: '备份恢复' }];
      }
      result.normalized.createdAt = result.normalized.createdAt || new Date().toISOString();
    }
    return result;
  });

  const validRecords = validationResults.filter(r => r.valid).map(r => r.normalized);
  return { validRecords, validationResults, fatal: null };
}

function contentKey(rec) {
  return `${rec.patient}∣${rec.date}∣${rec.shift}∣${rec.bed}∣${rec.start}∣${rec.end}`;
}

function computeDiffSummary(currentRecords, importedRecords) {
  const currentMap = new Map(currentRecords.map(r => [r.id, r]));
  const importedMap = new Map(importedRecords.map(r => [r.id, r]));

  const added = [];
  const updated = [];
  const unchanged = [];
  const removedIds = [];
  const matchedCurrentIds = new Set();

  const idUnmatched = [];

  for (const rec of importedRecords) {
    if (currentMap.has(rec.id) && rec._hadIdInBackup) {
      const current = currentMap.get(rec.id);
      matchedCurrentIds.add(rec.id);
      const changed = REQUIRED_FIELDS.some(k => String(current[k] || '') !== String(rec[k] || ''))
        || current.status !== rec.status;
      if (changed) {
        updated.push({ old: current, new: rec });
      } else {
        unchanged.push(rec);
      }
    } else {
      idUnmatched.push(rec);
    }
  }

  if (idUnmatched.length > 0) {
    const currentByContent = new Map();
    for (const cr of currentRecords) {
      if (matchedCurrentIds.has(cr.id)) continue;
      const key = contentKey(cr);
      if (!currentByContent.has(key)) currentByContent.set(key, []);
      currentByContent.get(key).push(cr);
    }

    const usedCurrentIds = new Set();
    for (const rec of idUnmatched) {
      const key = contentKey(rec);
      const candidates = currentByContent.get(key);
      if (candidates) {
        const match = candidates.find(c => !usedCurrentIds.has(c.id) && recordsEqualIgnoringId(c, rec));
        if (match) {
          usedCurrentIds.add(match.id);
          matchedCurrentIds.add(match.id);
          const changed = REQUIRED_FIELDS.some(k => String(match[k] || '') !== String(rec[k] || ''))
            || match.status !== rec.status;
          if (changed) {
            updated.push({ old: match, new: rec });
          } else {
            unchanged.push(rec);
          }
          continue;
        }
      }
      added.push(rec);
    }
  }

  for (const id of currentMap.keys()) {
    if (!matchedCurrentIds.has(id)) {
      removedIds.push(id);
    }
  }

  return { added, updated, unchanged, removedIds };
}

function recordsEqualIgnoringId(a, b) {
  return REQUIRED_FIELDS.every(k => String(a[k] || '') === String(b[k] || ''));
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

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function isCrossDay(start, end) {
  if (!isValidTime(start) || !isValidTime(end)) return false;
  return timeToMinutes(end) <= timeToMinutes(start);
}

function timeRangeOverlaps(aStart, aEnd, bStart, bEnd) {
  const aS = timeToMinutes(aStart);
  const aE = timeToMinutes(aEnd);
  const bS = timeToMinutes(bStart);
  const bE = timeToMinutes(bEnd);

  const aCross = aE <= aS;
  const bCross = bE <= bS;

  if (!aCross && !bCross) {
    return aS < bE && aE > bS;
  }

  if (aCross && bCross) {
    return true;
  }

  if (aCross) {
    return aS < bE || aE > bS;
  }

  return bS < aE || bE > aS;
}

function hasOverlap(target, records) {
  if (!target.bed || !target.date || !target.start || !target.end) return false;
  return records.some((item) => item.id !== target.id && item.bed === target.bed && item.date === target.date && timeRangeOverlaps(target.start, target.end, item.start, item.end));
}

const RULE_SEVERITY = {
  ERROR: 'error',
  WARNING: 'warning'
};

const RULE_IDS = {
  BED_TIME_OVERLAP: 'bed_time_overlap',
  END_BEFORE_START: 'end_before_start',
  PATIENT_SAME_DAY_DUPLICATE: 'patient_same_day_duplicate',
  CLEANING_BED_REASSIGNED: 'cleaning_bed_reassigned',
  NIGHT_SHIFT_CROSS_DATE: 'night_shift_cross_date'
};

const SCHEDULING_RULES = [
  {
    id: RULE_IDS.BED_TIME_OVERLAP,
    title: '同床位时间重叠',
    description: '同一床位同一日期，两个安排的时间段不得重叠（含跨日情况）',
    severity: RULE_SEVERITY.ERROR,
    enabled: true,
    check: (target, records) => {
      if (!target.bed || !target.date || !target.start || !target.end) return null;
      const overlapped = records.filter((item) =>
        item.id !== target.id &&
        item.bed === target.bed &&
        item.date === target.date &&
        timeRangeOverlaps(target.start, target.end, item.start, item.end)
      );
      if (overlapped.length === 0) return null;
      const names = overlapped.map((o) => `${o.patient}(${o.start}-${o.end})`).join('、');
      return {
        message: `与 ${names} 的时间段重叠`,
        detail: `床位 ${target.bed} 在 ${target.date} 的 ${target.start}-${target.end} 已被占用`
      };
    }
  },
  {
    id: RULE_IDS.END_BEFORE_START,
    title: '结束时间早于开始时间',
    description: '结束时间早于开始时间可能表示跨日透析（警告），或录入错误（错误）',
    severity: RULE_SEVERITY.ERROR,
    enabled: true,
    check: (target) => {
      if (!target.start || !target.end) return null;
      if (!isValidTime(target.start) || !isValidTime(target.end)) return null;
      const startMin = timeToMinutes(target.start);
      const endMin = timeToMinutes(target.end);
      if (endMin <= startMin) {
        if (target.shift === '夜间') {
          return {
            _severity: RULE_SEVERITY.WARNING,
            message: `夜间班 ${target.start}-${target.end} 为跨日安排`,
            detail: '系统按当日日期处理，实际透析跨越至次日，请确认时间录入无误'
          };
        }
        return {
          message: `结束时间 ${target.end} 不晚于开始时间 ${target.start}`,
          detail: '非夜间班次的时间段不应跨日，请检查是否录入错误'
        };
      }
      return null;
    }
  },
  {
    id: RULE_IDS.PATIENT_SAME_DAY_DUPLICATE,
    title: '同一患者同日重复安排',
    description: '同一患者同一日期不应安排多次透析',
    severity: RULE_SEVERITY.WARNING,
    enabled: true,
    check: (target, records) => {
      if (!target.patient || !target.date) return null;
      const patient = String(target.patient).trim();
      const duplicates = records.filter((item) =>
        item.id !== target.id &&
        String(item.patient).trim() === patient &&
        item.date === target.date
      );
      if (duplicates.length === 0) return null;
      const shifts = duplicates.map((d) => `${d.shift} ${d.bed}(${d.start}-${d.end})`).join('、');
      return {
        message: `${patient} 在 ${target.date} 已有安排：${shifts}`,
        detail: '同一天内同一患者通常只需安排一次透析，请确认是否需要重复安排'
      };
    }
  },
  {
    id: RULE_IDS.CLEANING_BED_REASSIGNED,
    title: '清洁中床位被继续安排',
    description: '状态为「清洁中」的床位在下一安排开始前应有足够清洁时间',
    severity: RULE_SEVERITY.WARNING,
    enabled: true,
    check: (target, records) => {
      if (!target.bed || !target.date || !target.start) return null;
      const cleaningRecords = records.filter((item) =>
        item.id !== target.id &&
        item.bed === target.bed &&
        item.date === target.date &&
        item.status === '清洁中'
      );
      if (cleaningRecords.length === 0) return null;
      const targetStart = timeToMinutes(target.start);
      const conflicts = cleaningRecords.filter((cr) => {
        if (!cr.end) return true;
        const crEnd = timeToMinutes(cr.end);
        if (isCrossDay(cr.start, cr.end)) {
          return targetStart >= timeToMinutes(cr.start) || targetStart < crEnd + 30;
        }
        return targetStart < crEnd + 30;
      });
      if (conflicts.length === 0) return null;
      const info = conflicts.map((c) => `${c.patient}(结束${c.end})`).join('、');
      return {
        message: `床位 ${target.bed} 正在由 ${info} 清洁，距下次安排清洁时间不足 30 分钟`,
        detail: '建议为床位清洁预留至少 30 分钟缓冲时间'
      };
    }
  },
  {
    id: RULE_IDS.NIGHT_SHIFT_CROSS_DATE,
    title: '夜间班跨日期',
    description: '夜间班若结束时间早于开始时间表示跨日，需特别标注',
    severity: RULE_SEVERITY.WARNING,
    enabled: true,
    check: (target) => {
      if (target.shift !== '夜间') return null;
      if (!target.start || !target.end) return null;
      if (!isValidTime(target.start) || !isValidTime(target.end)) return null;
      const startMin = timeToMinutes(target.start);
      const endMin = timeToMinutes(target.end);
      if (endMin <= startMin) {
        return {
          message: `夜间班 ${target.start}-${target.end} 跨越至次日`,
          detail: '系统按当日处理，实际跨日透析请注意日期记录'
        };
      }
      if (startMin < timeToMinutes('18:00')) {
        return {
          message: `夜间班开始时间 ${target.start} 早于 18:00`,
          detail: '夜间班通常从 18:00 开始，请确认班次与时间是否匹配'
        };
      }
      return null;
    }
  }
];

function evaluateRules(target, records, options = {}) {
  const { excludeRules = [], onlyEnabled = true } = options;
  const violations = [];
  for (const rule of SCHEDULING_RULES) {
    if (onlyEnabled && !rule.enabled) continue;
    if (excludeRules.includes(rule.id)) continue;
    const result = rule.check(target, records);
    if (result) {
      violations.push({
        ruleId: rule.id,
        severity: result._severity || rule.severity,
        title: rule.title,
        message: result.message,
        detail: result.detail || ''
      });
    }
  }
  return violations;
}

function hasRuleViolations(target, records, severityFilter) {
  const violations = evaluateRules(target, records);
  if (severityFilter) {
    return violations.some((v) => v.severity === severityFilter);
  }
  return violations.length > 0;
}

function hasSevereViolations(target, records) {
  return hasRuleViolations(target, records, RULE_SEVERITY.ERROR);
}

function getViolationSummary(violations) {
  if (!violations || violations.length === 0) return { errors: 0, warnings: 0, titles: [] };
  const errors = violations.filter((v) => v.severity === RULE_SEVERITY.ERROR).length;
  const warnings = violations.filter((v) => v.severity === RULE_SEVERITY.WARNING).length;
  const titles = violations.map((v) => v.title);
  return { errors, warnings, titles };
}

function aggregateRecordsViolations(records) {
  const map = new Map();
  for (const rec of records) {
    const violations = evaluateRules(rec, records);
    if (violations.length > 0) map.set(rec.id, violations);
  }
  return map;
}

const SHIFT_TIME_RANGES = {
  '上午': { start: '06:00', end: '12:00' },
  '下午': { start: '12:00', end: '18:00' },
  '夜间': { start: '18:00', end: '24:00' },
  '全部': { start: '06:00', end: '24:00' }
};

function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function getBedOccupancies(bed, date, records, excludeId) {
  return records
    .filter((item) => item.bed === bed && item.date === date && item.id !== excludeId)
    .map((item) => ({ start: timeToMinutes(item.start), end: timeToMinutes(item.end), patient: item.patient, id: item.id }))
    .sort((a, b) => a.start - b.start);
}

function findGapsOnBed(bed, date, records, durationMin, excludeId) {
  const occupancies = getBedOccupancies(bed, date, records, excludeId);
  const gaps = [];
  const dayStart = timeToMinutes('06:00');
  const dayEnd = timeToMinutes('24:00');

  let cursor = dayStart;
  for (const occ of occupancies) {
    if (occ.start > cursor && occ.start - cursor >= durationMin) {
      gaps.push({ start: cursor, end: occ.start });
    }
    cursor = Math.max(cursor, occ.end);
  }
  if (dayEnd > cursor && dayEnd - cursor >= durationMin) {
    gaps.push({ start: cursor, end: dayEnd });
  }
  return gaps;
}

const RECOMMEND_TYPES = {
  SAME_SHIFT_FREE_BED: 'same_shift_free_bed',
  TIME_SLOT_FREE_BED: 'time_slot_free_bed',
  ADJUST_START_TIME: 'adjust_start_time',
  ADJACENT_SHIFT_BED: 'adjacent_shift_bed'
};

function generateBedRecommendations(target, records, violations = []) {
  if (!target.date || !target.start || !target.end || !target.shift) return [];

  const allBeds = [];
  const bedField = appConfig.fields.find((f) => f.key === 'bed');
  if (bedField?.options) allBeds.push(...bedField.options);
  records.forEach((r) => { if (r.bed && !allBeds.includes(r.bed)) allBeds.push(r.bed); });

  const durationMin = timeToMinutes(target.end) - timeToMinutes(target.start);
  if (durationMin <= 0) return [];

  const targetStart = timeToMinutes(target.start);
  const targetEnd = timeToMinutes(target.end);
  const shiftRange = SHIFT_TIME_RANGES[target.shift];
  const shiftStart = timeToMinutes(shiftRange.start);
  const shiftEnd = timeToMinutes(shiftRange.end);

  const hasCleaningViolation = violations.some((v) => v.ruleId === RULE_IDS.CLEANING_BED_REASSIGNED);
  const hasOverlapViolation = violations.some((v) => v.ruleId === RULE_IDS.BED_TIME_OVERLAP);

  const recs = [];

  if (hasCleaningViolation && !hasOverlapViolation) {
    const cleaningRecords = records.filter((item) =>
      item.bed === target.bed &&
      item.date === target.date &&
      item.id !== target.id &&
      item.status === '清洁中'
    );
    for (const cr of cleaningRecords) {
      if (!cr.end) continue;
      const crEnd = timeToMinutes(cr.end);
      const minStartAfterCleaning = crEnd + 30;
      if (minStartAfterCleaning > targetStart && minStartAfterCleaning + durationMin <= shiftEnd) {
        const delayMinutes = minStartAfterCleaning - targetStart;
        const adjustedStart = minStartAfterCleaning;
        const adjustedEnd = adjustedStart + durationMin;
        recs.push({
          type: RECOMMEND_TYPES.ADJUST_START_TIME,
          bed: target.bed,
          start: minutesToTime(adjustedStart),
          end: minutesToTime(adjustedEnd),
          shift: target.shift,
          reason: `床位 ${target.bed} 需延后 ${delayMinutes} 分钟开始（${minutesToTime(adjustedStart)}），确保 ${cr.patient} 结束后有 30 分钟清洁缓冲时间`,
          score: 90
        });
      }
    }
  }

  for (const bed of allBeds) {
    const sameDateRecords = records.filter((r) => r.date === target.date && r.bed === bed && r.id !== target.id);
    const sameShiftRecords = sameDateRecords.filter((r) => r.shift === target.shift);

    if (sameShiftRecords.length === 0) {
      const bedOccupied = sameDateRecords.some((r) =>
        target.start < r.end && target.end > r.start
      );
      if (!bedOccupied) {
        recs.push({
          type: RECOMMEND_TYPES.SAME_SHIFT_FREE_BED,
          bed,
          start: target.start,
          end: target.end,
          shift: target.shift,
          reason: `同日期同班次「${target.shift}」空闲，时间段 ${target.start}-${target.end} 完全可用`,
          score: 100
        });
      }
    }

    const hasOverlapOnBed = sameDateRecords.some((r) =>
      target.start < r.end && target.end > r.start
    );
    if (!hasOverlapOnBed && !recs.find((r) => r.type === RECOMMEND_TYPES.SAME_SHIFT_FREE_BED && r.bed === bed)) {
      recs.push({
        type: RECOMMEND_TYPES.TIME_SLOT_FREE_BED,
        bed,
        start: target.start,
        end: target.end,
        shift: target.shift,
        reason: `${target.date} 时间段 ${target.start}-${target.end} 不重叠，床位 ${bed} 可用`,
        score: 85
      });
    }

    const gaps = findGapsOnBed(bed, target.date, records, durationMin, target.id);
    for (const gap of gaps) {
      const gapWithinShift = gap.start >= shiftStart && gap.end <= shiftEnd;
      const adjustedStart = Math.max(gap.start, targetStart);
      const adjustedEnd = adjustedStart + durationMin;
      if (adjustedEnd <= gap.end && adjustedEnd <= shiftEnd) {
        const startDiff = adjustedStart - targetStart;
        if (startDiff > 0 && startDiff <= 120) {
          recs.push({
            type: RECOMMEND_TYPES.ADJUST_START_TIME,
            bed,
            start: minutesToTime(adjustedStart),
            end: minutesToTime(adjustedEnd),
            shift: target.shift,
            reason: `${bed} 只需将开始时间从 ${target.start} 调整至 ${minutesToTime(adjustedStart)}（延后 ${startDiff} 分钟），即可避开冲突`,
            score: 70 - startDiff
          });
        } else if (startDiff < 0 && Math.abs(startDiff) <= 60) {
          recs.push({
            type: RECOMMEND_TYPES.ADJUST_START_TIME,
            bed,
            start: minutesToTime(adjustedStart),
            end: minutesToTime(adjustedEnd),
            shift: target.shift,
            reason: `${bed} 只需将开始时间从 ${target.start} 调整至 ${minutesToTime(adjustedStart)}（提前 ${Math.abs(startDiff)} 分钟），即可避开冲突`,
            score: 70 - Math.abs(startDiff)
          });
        }
      }
    }
  }

  for (const bed of allBeds) {
    for (const otherShift of ['上午', '下午', '夜间']) {
      if (otherShift === target.shift) continue;
      const otherRange = SHIFT_TIME_RANGES[otherShift];
      const otherStart = timeToMinutes(otherRange.start);
      const otherEnd = timeToMinutes(otherRange.end);
      if (otherEnd - otherStart < durationMin) continue;

      const allGapsOnBed = findGapsOnBed(bed, target.date, records, durationMin, target.id);
      for (const gap of allGapsOnBed) {
        const gapIntersectStart = Math.max(gap.start, otherStart);
        const gapIntersectEnd = Math.min(gap.end, otherEnd);
        if (gapIntersectEnd - gapIntersectStart < durationMin) continue;

        const suggestedStart = gapIntersectStart;
        const suggestedEnd = suggestedStart + durationMin;
        if (suggestedEnd > otherEnd) continue;

        const allSameBedRecords = records.filter(
          (r) => r.date === target.date && r.bed === bed && r.id !== target.id
        );
        const hasConflict = allSameBedRecords.some(
          (r) => suggestedStart < timeToMinutes(r.end) && suggestedEnd > timeToMinutes(r.start)
        );
        if (!hasConflict) {
          recs.push({
            type: RECOMMEND_TYPES.ADJACENT_SHIFT_BED,
            bed,
            start: minutesToTime(suggestedStart),
            end: minutesToTime(suggestedEnd),
            shift: otherShift,
            reason: `${bed} 可调整至「${otherShift}」班次，时间段 ${minutesToTime(suggestedStart)}-${minutesToTime(suggestedEnd)} 空闲`,
            score: 55
          });
          break;
        }
      }
    }
  }

  return recs
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

function statusClass(status) {
  const index = appConfig.statuses.indexOf(status);
  return ['status-a', 'status-b', 'status-c', 'status-d'][index] || 'status-a';
}

const STATUS_ORDER = { '待到达': 0, '透析中': 1, '清洁中': 2, '已完成': 3 };
const ABNORMAL_TYPES = {
  REGRESSION: 'regression',
  REPEATED: 'repeated',
  SKIP_CLEANING: 'skip_cleaning'
};

function analyzeTimeline(timeline) {
  if (!timeline || timeline.length === 0) {
    return { steps: [], abnormalities: [] };
  }

  const normalizedTimeline = timeline.map((step, index) => ({
    ...step,
    index,
    statusOrder: STATUS_ORDER[step.status] ?? -1,
    abnormalities: []
  }));

  const abnormalities = [];

  for (let i = 1; i < normalizedTimeline.length; i++) {
    const current = normalizedTimeline[i];
    const previous = normalizedTimeline[i - 1];

    if (current.status === previous.status) {
      const abnormality = {
        type: ABNORMAL_TYPES.REPEATED,
        label: '重复点击',
        description: `重复点击「${current.status}」状态`,
        stepIndex: i,
        severity: 'warning'
      };
      abnormalities.push(abnormality);
      current.abnormalities.push(abnormality);
    }

    if (current.statusOrder < previous.statusOrder && current.statusOrder !== -1 && previous.statusOrder !== -1) {
      const abnormality = {
        type: ABNORMAL_TYPES.REGRESSION,
        label: '状态倒退',
        description: `从「${previous.status}」倒退至「${current.status}」`,
        stepIndex: i,
        severity: 'error'
      };
      abnormalities.push(abnormality);
      current.abnormalities.push(abnormality);
    }

    if (previous.status === '透析中' && current.status === '已完成') {
      const abnormality = {
        type: ABNORMAL_TYPES.SKIP_CLEANING,
        label: '跳过清洁',
        description: '从「透析中」直接变为「已完成」，跳过了「清洁中」',
        stepIndex: i,
        severity: 'error'
      };
      abnormalities.push(abnormality);
      current.abnormalities.push(abnormality);
    }
  }

  return { steps: normalizedTimeline, abnormalities };
}

function getOperators(records) {
  const operators = new Set();
  records.forEach((item) => {
    (item.timeline || []).forEach((step) => {
      if (step.by) operators.add(step.by);
    });
  });
  return Array.from(operators).sort();
}

function filterAuditRecords(records, filters) {
  return records.filter((item) => {
    if (filters.operator && filters.operator !== '全部') {
      const hasOperator = (item.timeline || []).some((step) => step.by === filters.operator);
      if (!hasOperator) return false;
    }

    if (filters.status && filters.status !== '全部') {
      const hasStatus = (item.timeline || []).some((step) => step.status === filters.status);
      if (!hasStatus) return false;
    }

    if (filters.startDate && item.date && item.date < filters.startDate) {
      return false;
    }
    if (filters.endDate && item.date && item.date > filters.endDate) {
      return false;
    }

    if (filters.abnormalOnly) {
      const { abnormalities } = analyzeTimeline(item.timeline);
      if (abnormalities.length === 0) return false;
    }

    return true;
  });
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

function validateSingleRow(row, allRows, existingRecords, currentIndex) {
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
    if (String(row.shift || '').trim() !== '夜间') {
      errors.push('开始时间须早于结束时间（非夜间班次不允许跨日）');
    }
  }

  const normalized = {
    ...row,
    date: normalizeDate(row.date),
    start: normalizeTime(row.start),
    end: normalizeTime(row.end),
    status: row.status || appConfig.primaryStatus
  };

  if (errors.length === 0) {
    const overlapExisting = existingRecords.some((item) =>
      item.bed === normalized.bed &&
      item.date === normalized.date &&
      timeRangeOverlaps(normalized.start, normalized.end, item.start, item.end)
    );
    const overlapInBatch = allRows.some((other, idx) => {
      if (idx === currentIndex) return false;
      const od = normalizeDate(other.date);
      const os = normalizeTime(other.start);
      const oe = normalizeTime(other.end);
      const ob = String(other.bed || '').trim();
      if (!ob || !od || !os || !oe) return false;
      return ob === normalized.bed && od === normalized.date && timeRangeOverlaps(normalized.start, normalized.end, os, oe);
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
      if (String(row.shift || '').trim() !== '夜间') {
        errors.push('开始时间须早于结束时间（非夜间班次不允许跨日）');
      }
    }

    const normalized = {
      ...row,
      date: normalizeDate(row.date),
      start: normalizeTime(row.start),
      end: normalizeTime(row.end),
      status: row.status || appConfig.primaryStatus
    };

    if (errors.length === 0) {
      const overlapExisting = existingRecords.some((item) =>
        item.bed === normalized.bed &&
        item.date === normalized.date &&
        timeRangeOverlaps(normalized.start, normalized.end, item.start, item.end)
      );
      const overlapInBatch = parsed.some((other, idx) => {
        if (other === row) return false;
        const od = normalizeDate(other.date);
        const os = normalizeTime(other.start);
        const oe = normalizeTime(other.end);
        const ob = String(other.bed || '').trim();
        if (!ob || !od || !os || !oe) return false;
        return ob === normalized.bed && od === normalized.date && timeRangeOverlaps(normalized.start, normalized.end, os, oe);
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
  const [filters, setFilters] = useState({ query: '', status: '全部', date: '', shift: '全部', bed: '' });
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [timelineShift, setTimelineShift] = useState('全部');
  const [handoverShift, setHandoverShift] = useState('全部');
  const [editing, setEditing] = useState(null);

  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [parsedPreview, setParsedPreview] = useState([]);

  const [auditViewMode, setAuditViewMode] = useState(false);
  const [auditFilters, setAuditFilters] = useState({
    operator: '全部',
    status: '全部',
    startDate: '',
    endDate: '',
    abnormalOnly: false
  });
  const [selectedAuditRecord, setSelectedAuditRecord] = useState(null);

  const [patientTrackView, setPatientTrackView] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');

  const [backupOpen, setBackupOpen] = useState(false);
  const [backupFileName, setBackupFileName] = useState('');
  const [backupValidationResults, setBackupValidationResults] = useState([]);
  const [backupValidRecords, setBackupValidRecords] = useState([]);
  const [backupDiff, setBackupDiff] = useState(null);
  const [backupFatalError, setBackupFatalError] = useState('');
  const [backupMeta, setBackupMeta] = useState(null);
  const backupFileInputRef = useRef(null);

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

  function handlePreviewFieldChange(index, field, value) {
    setParsedPreview((prev) => {
      const newPreview = [...prev];
      const currentRow = { ...newPreview[index].row, [field]: value };
      const allRows = newPreview.map((p, i) => (i === index ? currentRow : p.row));
      const validatedRow = validateSingleRow(currentRow, allRows, records, index);
      newPreview[index] = validatedRow;

      const revalidatedPreview = newPreview.map((p, i) => {
        if (i === index) return p;
        const otherRow = p.row;
        const otherAllRows = newPreview.map((np, ni) => (ni === i ? otherRow : (ni === index ? currentRow : np.row)));
        const revalidated = validateSingleRow(otherRow, otherAllRows, records, i);
        return revalidated;
      });

      return revalidatedPreview;
    });
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

    const combinedRecords = [...newRecords, ...records];
    const allViolations = [];
    for (const nr of newRecords) {
      const vs = evaluateRules(nr, combinedRecords);
      if (vs.length > 0) {
        allViolations.push({ record: nr, violations: vs });
      }
    }

    if (allViolations.length > 0) {
      const errors = allViolations.filter((av) => av.violations.some((v) => v.severity === RULE_SEVERITY.ERROR));
      const warnings = allViolations.filter((av) => av.violations.every((v) => v.severity === RULE_SEVERITY.WARNING));

      if (errors.length > 0) {
        const msg = errors.slice(0, 5).map((av, i) => {
          const errList = av.violations.filter(v => v.severity === RULE_SEVERITY.ERROR).map(v => v.message).join('；');
          return `${i + 1}. ${av.record.bed} · ${av.record.patient}（${av.record.date} ${av.record.shift}）：${errList}`;
        }).join('\n');
        const more = errors.length > 5 ? `\n...还有 ${errors.length - 5} 条错误` : '';
        alert(`批量导入中 ${errors.length} 条记录存在规则错误，无法导入：\n\n${msg}${more}\n\n请修正后重新导入。`);
        return;
      }

      if (warnings.length > 0) {
        const msg = warnings.slice(0, 5).map((av, i) => {
          const warnList = av.violations.filter(v => v.severity === RULE_SEVERITY.WARNING).map(v => v.message).join('；');
          return `${i + 1}. ${av.record.bed} · ${av.record.patient}（${av.record.date} ${av.record.shift}）：${warnList}`;
        }).join('\n');
        const more = warnings.length > 5 ? `\n...还有 ${warnings.length - 5} 条警告` : '';
        const ok = confirm(`批量导入中 ${warnings.length} 条记录存在合规警告：\n\n${msg}${more}\n\n是否仍然继续导入？`);
        if (!ok) return;
      }
    }

    persist(combinedRecords);
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

  function handleBackupOpen() {
    setBackupOpen(true);
    setBackupFileName('');
    setBackupValidationResults([]);
    setBackupValidRecords([]);
    setBackupDiff(null);
    setBackupFatalError('');
    setBackupMeta(null);
  }

  function handleBackupClose() {
    setBackupOpen(false);
    setBackupFileName('');
    setBackupValidationResults([]);
    setBackupValidRecords([]);
    setBackupDiff(null);
    setBackupFatalError('');
    setBackupMeta(null);
    if (backupFileInputRef.current) backupFileInputRef.current.value = '';
  }

  function handleExportBackup() {
    exportBackup(records);
  }

  function handleBackupFileSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setBackupFileName(file.name);
    setBackupValidationResults([]);
    setBackupValidRecords([]);
    setBackupDiff(null);
    setBackupFatalError('');
    setBackupMeta(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (!text || typeof text !== 'string') {
          setBackupFatalError('文件内容为空或无法读取');
          return;
        }
        const parsed = JSON.parse(text);

        if (!parsed || typeof parsed !== 'object') {
          setBackupFatalError('文件内容不是有效的 JSON 对象');
          return;
        }

        if (parsed.meta && parsed.meta.appId && parsed.meta.appId !== appConfig.id) {
          setBackupFatalError(`备份文件来源不匹配：预期「${appConfig.id}」，实际「${parsed.meta.appId}」`);
          return;
        }

        setBackupMeta(parsed.meta || null);

        const rawRecords = parsed.records || parsed;
        const { validRecords, validationResults, fatal } = normalizeBackupRecords(rawRecords);
        if (fatal) {
          setBackupFatalError(fatal);
          return;
        }

        setBackupValidationResults(validationResults);
        setBackupValidRecords(validRecords);

        if (validRecords.length > 0) {
          const diff = computeDiffSummary(records, validRecords);
          setBackupDiff(diff);
        }
      } catch (err) {
        console.error(err);
        setBackupFatalError('JSON 解析失败：' + (err instanceof Error ? err.message : String(err)));
      }
    };
    reader.onerror = () => {
      setBackupFatalError('文件读取失败');
    };
    reader.readAsText(file);
  }

  function handleConfirmRestore() {
    if (backupValidRecords.length === 0) return;
    const hasInvalid = backupValidationResults.some((r) => !r.valid);
    if (hasInvalid) {
      alert(`存在 ${backupValidationResults.filter((r) => !r.valid).length} 条无效记录，请先修正或移除后再恢复。`);
      return;
    }

    const allViolations = [];
    for (const rec of backupValidRecords) {
      const vs = evaluateRules(rec, backupValidRecords);
      if (vs.length > 0) {
        allViolations.push({ record: rec, violations: vs });
      }
    }

    if (allViolations.length > 0) {
      const errors = allViolations.filter((av) => av.violations.some((v) => v.severity === RULE_SEVERITY.ERROR));
      const warnings = allViolations.filter((av) => av.violations.every((v) => v.severity === RULE_SEVERITY.WARNING));

      if (errors.length > 0) {
        const msg = errors.slice(0, 5).map((av, i) => {
          const errList = av.violations.filter(v => v.severity === RULE_SEVERITY.ERROR).map(v => v.message).join('；');
          return `${i + 1}. ${av.record.bed} · ${av.record.patient}（${av.record.date} ${av.record.shift}）：${errList}`;
        }).join('\n');
        const more = errors.length > 5 ? `\n...还有 ${errors.length - 5} 条错误` : '';
        alert(`备份数据中 ${errors.length} 条记录存在规则错误，无法恢复：\n\n${msg}${more}\n\n请修正备份文件后再恢复。`);
        return;
      }

      if (warnings.length > 0) {
        const msg = warnings.slice(0, 5).map((av, i) => {
          const warnList = av.violations.filter(v => v.severity === RULE_SEVERITY.WARNING).map(v => v.message).join('；');
          return `${i + 1}. ${av.record.bed} · ${av.record.patient}（${av.record.date} ${av.record.shift}）：${warnList}`;
        }).join('\n');
        const more = warnings.length > 5 ? `\n...还有 ${warnings.length - 5} 条警告` : '';
        const ok = confirm(`备份数据中 ${warnings.length} 条记录存在合规警告：\n\n${msg}${more}\n\n是否仍然继续恢复？`);
        if (!ok) return;
      }
    }

    persist(backupValidRecords);
    handleBackupClose();
  }

  const backupStats = useMemo(() => {
    const total = backupValidationResults.length;
    const valid = backupValidationResults.filter((r) => r.valid).length;
    const invalid = total - valid;
    const withWarnings = backupValidationResults.filter((r) => r.warnings.length > 0).length;
    return { total, valid, invalid, withWarnings };
  }, [backupValidationResults]);

  function addRecord(event) {
    event.preventDefault();
    if (!form.patient || !form.date || !form.shift || !form.bed || !form.start || !form.end) {
      alert('请填写患者、日期、班次、床位、开始时间和结束时间');
      return;
    }
    if (!DATE_REGEX.test(normalizeDate(form.date))) {
      alert('日期格式错误，应为 YYYY-MM-DD');
      return;
    }
    if (!isValidTime(form.start) || !isValidTime(form.end)) {
      alert('时间格式错误，应为 HH:MM');
      return;
    }
    if (!(normalizeTime(form.start) < normalizeTime(form.end))) {
      if (form.shift !== '夜间') {
        alert('开始时间须早于结束时间（非夜间班次不允许跨日）');
        return;
      }
    }

    const target = editing ? { ...form, id: editing.id } : { ...form, id: uid() };
    const violations = evaluateRules(target, records);
    const errors = violations.filter((v) => v.severity === RULE_SEVERITY.ERROR);
    const warnings = violations.filter((v) => v.severity === RULE_SEVERITY.WARNING);

    if (errors.length > 0) {
      const msg = errors.map((e, i) => `${i + 1}. ${e.title}：${e.message}`).join('\n');
      alert(`存在 ${errors.length} 项规则错误，无法保存：\n\n${msg}\n\n请修正后再提交。`);
      return;
    }
    if (warnings.length > 0) {
      const msg = warnings.map((w, i) => `${i + 1}. ${w.title}：${w.message}`).join('\n');
      const ok = confirm(`存在 ${warnings.length} 项合规警告：\n\n${msg}\n\n是否仍然继续保存？`);
      if (!ok) return;
    }

    if (editing) {
      const updated = records.map((item) => item.id === editing.id ? {
        ...item,
        ...form,
        status: form.status || item.status,
        timeline: [...(item.timeline || []), { status: form.status || item.status, at: today, by: '编辑' }]
      } : item);
      persist(updated);
      const edited = updated.find((r) => r.id === editing.id);
      setSelected(edited);
      setEditing(null);
      setForm(appConfig.defaultValues);
    } else {
      const nextRecord = {
        id: uid(),
        ...form,
        status: form.status || appConfig.primaryStatus,
        createdAt: new Date().toISOString(),
        timeline: [{ status: form.status || appConfig.primaryStatus, at: today, by: '录入' }]
      };

      const recViolations = evaluateRules(nextRecord, records);
      if (recViolations.some((v) => v.severity === RULE_SEVERITY.ERROR)) {
        nextRecord.conflict = true;
      }
      if (appConfig.conflict === 'date-slot' && records.some((item) => item.date === nextRecord.date && item.slot === nextRecord.slot)) {
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
  }

  function startEdit(item) {
    setEditing(item);
    setForm({
      patient: item.patient,
      date: item.date,
      shift: item.shift,
      bed: item.bed,
      start: item.start,
      end: item.end,
      status: item.status
    });
    setSelected(null);
  }

  function cancelEdit() {
    setEditing(null);
    setForm(appConfig.defaultValues);
  }

  const [adoptedRecommendation, setAdoptedRecommendation] = useState(null);

  function applyRecommendation(rec) {
    setForm({
      ...form,
      bed: rec.bed,
      shift: rec.shift,
      start: rec.start,
      end: rec.end
    });
    setAdoptedRecommendation({
      ...rec,
      adoptedAt: Date.now()
    });
    setTimeout(() => setAdoptedRecommendation(null), 2000);
  }

  const recordViolationsMap = useMemo(() => aggregateRecordsViolations(records), [records]);

  function getRecordViolations(item) {
    if (!item || !item.id) return [];
    return recordViolationsMap.get(item.id) || evaluateRules(item, records);
  }

  function recordHasErrors(item) {
    const v = getRecordViolations(item);
    return v.some((x) => x.severity === RULE_SEVERITY.ERROR);
  }

  function recordHasAnyViolation(item) {
    return getRecordViolations(item).length > 0;
  }

  function violationSummaryText(item) {
    const vs = getRecordViolations(item);
    if (vs.length === 0) return '排班合规';
    return vs.map((v) => `[${v.severity === RULE_SEVERITY.ERROR ? '错误' : '警告'}] ${v.message}`).join('；');
  }

  const formViolations = useMemo(() => {
    if (!form.bed || !form.date || !form.start || !form.end) return [];
    const target = editing ? { ...form, id: editing.id } : { ...form, id: '_new_' };
    return evaluateRules(target, records);
  }, [form, records, editing]);

  const formHasConflict = useMemo(() => {
    if (!form.bed || !form.date || !form.start || !form.end) return false;
    const target = editing ? { ...form, id: editing.id } : { ...form, id: '_new_' };
    return hasOverlap(target, records);
  }, [form, records, editing]);

  const formHasCleaningWarning = useMemo(() => {
    return formViolations.some((v) => v.ruleId === RULE_IDS.CLEANING_BED_REASSIGNED);
  }, [formViolations]);

  const shouldShowRecommendations = useMemo(() => {
    return formHasConflict || formHasCleaningWarning;
  }, [formHasConflict, formHasCleaningWarning]);

  const formHasSevereViolation = useMemo(() => formViolations.some((v) => v.severity === RULE_SEVERITY.ERROR), [formViolations]);
  const formHasWarning = useMemo(() => formViolations.some((v) => v.severity === RULE_SEVERITY.WARNING), [formViolations]);

  const smartRecommendations = useMemo(() => {
    if (!shouldShowRecommendations) return [];
    const target = editing ? { ...form, id: editing.id } : { ...form, id: '_new_' };
    const violations = formViolations;
    return generateBedRecommendations(target, records, violations);
  }, [form, records, editing, shouldShowRecommendations, formViolations]);

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
    const violations = evaluateRules(copied, [copied, ...records]);
    const errors = violations.filter((v) => v.severity === RULE_SEVERITY.ERROR);
    const warnings = violations.filter((v) => v.severity === RULE_SEVERITY.WARNING);
    if (errors.length > 0) {
      const msg = errors.map((e, i) => `${i + 1}. ${e.title}：${e.message}`).join('\n');
      alert(`复制记录将产生 ${errors.length} 项规则错误：\n\n${msg}\n\n请调整后再操作。`);
      return;
    }
    if (warnings.length > 0) {
      const msg = warnings.map((w, i) => `${i + 1}. ${w.title}：${w.message}`).join('\n');
      const ok = confirm(`复制记录将产生 ${warnings.length} 项合规警告：\n\n${msg}\n\n是否仍然继续？`);
      if (!ok) return;
    }
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
      .filter((item) => !filters.date || item.date === filters.date)
      .filter((item) => filters.shift === '全部' || item.shift === filters.shift)
      .filter((item) => !filters.bed || item.bed === filters.bed)
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

  const filterOptions = useMemo(() => {
    const dates = [...new Set(records.map((item) => item.date).filter(Boolean))].sort();
    const beds = [...new Set(records.map((item) => item.bed).filter(Boolean))].sort();
    const shifts = appConfig.fields.find((f) => f.key === 'shift')?.options || ['上午', '下午', '夜间'];
    return { dates, beds, shifts };
  }, [records]);

  const hasActiveFilters = useMemo(() => {
    return filters.query || filters.status !== '全部' || filters.date || filters.shift !== '全部' || filters.bed;
  }, [filters]);

  const todayRecords = useMemo(() => records.filter((item) => item.date === today), [records]);

  const handoverScopeRecords = useMemo(() => {
    return todayRecords.filter((item) => handoverShift === '全部' || item.shift === handoverShift);
  }, [todayRecords, handoverShift]);

  const handoverSummary = useMemo(() => {
    const counts = {};
    for (const status of appConfig.statuses) {
      counts[status] = handoverScopeRecords.filter((item) => item.status === status).length;
    }
    const conflictRecords = handoverScopeRecords.filter((item) => recordHasAnyViolation(item) || item.conflict);
    const conflictBeds = new Set(conflictRecords.map((item) => item.bed));
    counts['存在冲突'] = conflictBeds.size;

    const ruleErrorCount = handoverScopeRecords.filter((item) => recordHasErrors(item)).length;
    const ruleWarningCount = handoverScopeRecords.filter((item) => {
      const vs = getRecordViolations(item);
      return vs.some((v) => v.severity === RULE_SEVERITY.WARNING) && !vs.some((v) => v.severity === RULE_SEVERITY.ERROR);
    }).length;
    counts['规则错误'] = ruleErrorCount;
    counts['规则警告'] = ruleWarningCount;

    const focusRecords = handoverScopeRecords.filter((item) => {
      if (recordHasAnyViolation(item) || item.conflict) return true;
      if (item.status === '透析中') return true;
      if (item.status === '清洁中') return true;
      return false;
    });

    return { counts, conflictRecords, focusRecords, conflictBeds: Array.from(conflictBeds) };
  }, [handoverScopeRecords, records, recordViolationsMap]);

  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const handleCopySummary = useCallback(() => {
    const { counts, focusRecords } = handoverSummary;
    const lines = [];
    const shiftLabel = handoverShift === '全部' ? '全天' : handoverShift;
    lines.push(`【${shiftLabel}交接摘要】 ${today}`);
    lines.push('');
    lines.push('— 床位状态汇总 —');
    for (const status of appConfig.statuses) {
      lines.push(`${status}：${counts[status]} 床`);
    }
    lines.push(`存在冲突：${counts['存在冲突']} 床（规则错误 ${counts['规则错误'] || 0}、规则警告 ${counts['规则警告'] || 0}）`);
    lines.push('');
    if (focusRecords.length > 0) {
      lines.push('— 需重点交接 —');
      focusRecords.forEach((item, i) => {
        const vs = getRecordViolations(item);
        const tag = vs.length > 0
          ? ` [${vs.filter(v => v.severity === RULE_SEVERITY.ERROR).length}错${vs.filter(v => v.severity === RULE_SEVERITY.WARNING).length}警]`
          : (item.conflict ? ' [冲突]' : '');
        lines.push(`${i + 1}. ${item.bed} · ${item.patient} · ${item.shift} ${item.start}-${item.end} · ${item.status}${tag}`);
      });
    } else {
      lines.push('— 无需重点交接记录 —');
    }
    const text = lines.join('\n');

    const handleSuccess = () => {
      setCopied(true);
      setCopyError(false);
      setTimeout(() => setCopied(false), 2000);
    };

    const handleFailure = (err) => {
      console.warn('复制失败:', err);
      setCopyError(true);
      setTimeout(() => setCopyError(false), 3000);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(handleSuccess).catch(handleFailure);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        const success = document.execCommand('copy');
        if (success) {
          handleSuccess();
        } else {
          handleFailure(new Error('execCommand failed'));
        }
      } catch (err) {
        handleFailure(err);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }, [handoverSummary, records, handoverShift]);

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

  function overlapsTimelineRange(item, range) {
    if (!item.start || !item.end) return false;
    const startMin = timeToMinutes(item.start);
    const endMin = timeToMinutes(item.end);
    const rangeStart = timeToMinutes(range.start);
    const rangeEnd = timeToMinutes(range.end);
    return startMin < rangeEnd && endMin > rangeStart;
  }

  const timelineDate = filters.date || today;

  const effectiveTimelineShift = filters.shift !== '全部' ? filters.shift : timelineShift;

  const timelineRange = useMemo(() => {
    return SHIFT_TIME_RANGES[effectiveTimelineShift] || SHIFT_TIME_RANGES['全部'];
  }, [effectiveTimelineShift]);

  const timelineTotalMinutes = useMemo(() => {
    const startMin = timeToMinutes(timelineRange.start);
    const endMin = timeToMinutes(timelineRange.end);
    return endMin - startMin;
  }, [timelineRange]);

  const timelineBeds = useMemo(() => {
    const bedField = appConfig.fields.find((f) => f.key === 'bed');
    const configBeds = bedField?.options || [];
    const recordBeds = filteredRecords
      .filter((item) => item.date === timelineDate)
      .map((item) => item.bed)
      .filter(Boolean);
    return Array.from(new Set([...configBeds, ...recordBeds])).sort();
  }, [filteredRecords, timelineDate]);

  const timelineRecords = useMemo(() => {
    return filteredRecords.filter((item) => item.date === timelineDate && overlapsTimelineRange(item, timelineRange));
  }, [filteredRecords, timelineDate, timelineRange]);

  const timelineConflictRecords = useMemo(() => {
    return timelineRecords.filter((item) => recordHasAnyViolation(item));
  }, [timelineRecords, recordViolationsMap]);

  const timelineHours = useMemo(() => {
    const hours = [];
    const startHour = parseInt(timelineRange.start.split(':')[0], 10);
    const endHour = parseInt(timelineRange.end.split(':')[0], 10);
    for (let h = startHour; h <= endHour; h++) {
      hours.push(`${String(h).padStart(2, '0')}:00`);
    }
    return hours;
  }, [timelineRange]);

  const timelineData = useMemo(() => {
    const data = {};
    for (const bed of timelineBeds) {
      const bedRecords = timelineRecords
        .filter((item) => item.bed === bed)
        .sort((a, b) => (a.start || '').localeCompare(b.start || ''));

      const itemsWithPosition = bedRecords.map((item) => {
        const startMin = Math.max(timeToMinutes(item.start), timeToMinutes(timelineRange.start));
        const endMin = Math.min(timeToMinutes(item.end), timeToMinutes(timelineRange.end));
        const rangeStart = timeToMinutes(timelineRange.start);
        const left = ((startMin - rangeStart) / timelineTotalMinutes) * 100;
        const width = Math.max(0, ((endMin - startMin) / timelineTotalMinutes) * 100);
        const violations = getRecordViolations(item);
        const hasSevere = violations.some((v) => v.severity === RULE_SEVERITY.ERROR);
        const hasWarning = violations.some((v) => v.severity === RULE_SEVERITY.WARNING);
        return {
          ...item,
          left,
          width,
          hasOverlap: hasSevere || hasWarning,
          hasSevereViolation: hasSevere,
          hasWarningViolation: hasWarning,
          violations,
          row: 0
        };
      });

      const rows = [];
      itemsWithPosition.forEach((item) => {
        const itemStart = item.left;
        const itemEnd = item.left + item.width;
        let placed = false;
        for (let i = 0; i < rows.length; i++) {
          const rowItems = rows[i];
          const canFit = rowItems.every((ri) => {
            const riEnd = ri.left + ri.width;
            return itemEnd <= ri.left || itemStart >= riEnd;
          });
          if (canFit) {
            item.row = i;
            rowItems.push(item);
            placed = true;
            break;
          }
        }
        if (!placed) {
          item.row = rows.length;
          rows.push([item]);
        }
      });

      data[bed] = {
        items: itemsWithPosition,
        maxRows: rows.length
      };
    }
    return data;
  }, [timelineBeds, timelineRecords, timelineRange, timelineTotalMinutes, records]);

  const directory = useMemo(() => {
    return records.reduce((acc, item) => {
      const key = item.issue || '未分类';
      (acc[key] ||= []).push(item);
      return acc;
    }, {});
  }, [records]);

  const operators = useMemo(() => getOperators(records), [records]);

  const auditRecords = useMemo(() => {
    return filterAuditRecords(records, auditFilters).map((item) => {
      const { steps, abnormalities } = analyzeTimeline(item.timeline);
      return {
        ...item,
        analyzedSteps: steps,
        abnormalities,
        hasAbnormalities: abnormalities.length > 0,
        abnormalityCount: abnormalities.length,
        regressionCount: abnormalities.filter((a) => a.type === ABNORMAL_TYPES.REGRESSION).length,
        repeatedCount: abnormalities.filter((a) => a.type === ABNORMAL_TYPES.REPEATED).length,
        skipCleaningCount: abnormalities.filter((a) => a.type === ABNORMAL_TYPES.SKIP_CLEANING).length
      };
    }).sort((a, b) => {
      if (b.hasAbnormalities !== a.hasAbnormalities) {
        return b.hasAbnormalities - a.hasAbnormalities;
      }
      return (b.date || '').localeCompare(a.date || '');
    });
  }, [records, auditFilters]);

  const patientGroups = useMemo(() => {
    const groups = {};
    records.forEach((item) => {
      const name = item.patient || '未知';
      (groups[name] ||= []).push(item);
    });
    return Object.entries(groups).map(([name, items]) => {
      const sorted = [...items].sort((a, b) => {
        const dateDiff = String(a.date).localeCompare(String(b.date));
        if (dateDiff !== 0) return dateDiff;
        return (a.start || '').localeCompare(b.start || '');
      });
      const beds = [...new Set(sorted.map((r) => r.bed).filter(Boolean))];
      const completedCount = sorted.filter((r) => r.status === '已完成').length;
      const incompleteRecords = sorted.filter((r) => r.status !== '已完成');
      const recentItem = sorted.length > 0 ? sorted[sorted.length - 1] : null;
      const bedChangePoints = [];
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].bed && sorted[i - 1].bed && sorted[i].bed !== sorted[i - 1].bed) {
          bedChangePoints.push({
            date: sorted[i].date,
            from: sorted[i - 1].bed,
            to: sorted[i].bed,
          });
        }
      }
      return {
        name,
        records: sorted,
        totalSessions: sorted.length,
        completedSessions: completedCount,
        incompleteSessions: incompleteRecords.length,
        incompleteRecords,
        beds,
        bedChanges: bedChangePoints,
        recentSchedule: recentItem,
      };
    }).sort((a, b) => b.totalSessions - a.totalSessions);
  }, [records]);

  const filteredPatientGroups = useMemo(() => {
    if (!patientSearchQuery.trim()) return patientGroups;
    const query = patientSearchQuery.trim().toLowerCase();
    return patientGroups.filter((g) => g.name.toLowerCase().includes(query));
  }, [patientGroups, patientSearchQuery]);

  const selectedPatientDetail = useMemo(() => {
    if (!selectedPatient) return null;
    return patientGroups.find((g) => g.name === selectedPatient) || null;
  }, [patientGroups, selectedPatient]);

  const auditStats = useMemo(() => {
    const total = auditRecords.length;
    const withAbnormalities = auditRecords.filter((r) => r.hasAbnormalities).length;
    const regressionCount = auditRecords.reduce((sum, r) => sum + r.regressionCount, 0);
    const repeatedCount = auditRecords.reduce((sum, r) => sum + r.repeatedCount, 0);
    const skipCleaningCount = auditRecords.reduce((sum, r) => sum + r.skipCleaningCount, 0);
    return { total, withAbnormalities, regressionCount, repeatedCount, skipCleaningCount };
  }, [auditRecords]);

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

      <section className="handover-section">
        <div className="panel handover-panel">
          <div className="handover-header">
            <div className="panel-title">
              <ClipboardCopy size={18} />
              <h2>{handoverShift === '全部' ? '今日交接摘要' : `${handoverShift}交接摘要`}</h2>
            </div>
            <div className="handover-shift-tabs">
              {['全部', '上午', '下午', '夜间'].map((shift) => (
                <button
                  key={shift}
                  type="button"
                  className={'shift-tab ' + (handoverShift === shift ? 'active' : '')}
                  onClick={() => setHandoverShift(shift)}
                >
                  {shift}
                </button>
              ))}
            </div>
            <button
              type="button"
              className={'copy-btn' + (copied ? ' copied' : '') + (copyError ? ' error' : '')}
              onClick={handleCopySummary}
              title={copyError ? '复制失败，请手动复制' : ''}
            >
              {copyError ? <AlertCircle size={15} /> : <ClipboardCopy size={15} />}
              {copyError ? '复制失败' : copied ? '已复制' : '复制摘要'}
            </button>
          </div>
          <div className="handover-counts">
            {appConfig.statuses.map((status) => (
              <div className={'handover-count-item ' + statusClass(status)} key={status}>
                <span className="handover-count-value">{handoverSummary.counts[status]}</span>
                <span className="handover-count-label">{status}</span>
              </div>
            ))}
            <div className="handover-count-item status-conflict">
              <span className="handover-count-value">{handoverSummary.counts['存在冲突']}</span>
              <span className="handover-count-label">存在冲突</span>
            </div>
          </div>
          {handoverSummary.focusRecords.length > 0 && (
            <div className="handover-focus">
              <h4>需重点交接</h4>
              <div className="handover-focus-list">
                {handoverSummary.focusRecords.map((item) => {
                  const violations = getRecordViolations(item);
                  const hasErrors = violations.some((v) => v.severity === RULE_SEVERITY.ERROR);
                  const hasWarnings = violations.some((v) => v.severity === RULE_SEVERITY.WARNING);
                  const isConflict = item.conflict || violations.length > 0;
                  return (
                    <div className={'handover-focus-item' + (hasErrors ? ' conflict' : '') + (hasWarnings && !hasErrors ? ' warn' : '')} key={item.id} onClick={() => setSelected(item)}>
                      <div className="handover-focus-main">
                        <span className="handover-focus-bed">{item.bed}</span>
                        <span className="handover-focus-patient">{item.patient}</span>
                        <span className={'status ' + statusClass(item.status)}>{item.status}</span>
                      </div>
                      <div className="handover-focus-meta">
                        <span>{item.shift} {item.start}-{item.end}</span>
                        {hasErrors && <span className="handover-conflict-tag error"><AlertCircle size={12} />{violations.filter(v => v.severity === RULE_SEVERITY.ERROR).length} 错误</span>}
                        {hasWarnings && <span className="handover-conflict-tag warn"><AlertTriangle size={12} />{violations.filter(v => v.severity === RULE_SEVERITY.WARNING).length} 警告</span>}
                        {item.conflict && !violations.length && <span className="handover-conflict-tag"><AlertTriangle size={12} />冲突</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {handoverSummary.focusRecords.length === 0 && (
            <p className="empty">{handoverShift === '全部' ? '今日无重点交接事项。' : `本${handoverShift}无重点交接事项。`}</p>
          )}
        </div>
      </section>

      <section className="workspace">
        <div className="form-stack">
          <form className="panel form-panel" onSubmit={addRecord}>
            <div className="panel-title">
              {editing ? <><Edit2 size={18} /><h2>编辑排班</h2></> : <><ClipboardList size={18} /><h2>新增记录</h2></>}
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

            {formViolations.length > 0 && (
              <div className="form-rule-hints">
                {formHasSevereViolation && (
                  <div className="rule-hint-group error">
                    <div className="rule-hint-head">
                      <AlertCircle size={14} />
                      <span>规则错误（{formViolations.filter(v => v.severity === RULE_SEVERITY.ERROR).length}）</span>
                    </div>
                    <ul>
                      {formViolations.filter(v => v.severity === RULE_SEVERITY.ERROR).map((v, i) => (
                        <li key={i}>
                          <strong>{v.title}：</strong>{v.message}
                          {v.detail && <em>{v.detail}</em>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {formHasWarning && (
                  <div className="rule-hint-group warn">
                    <div className="rule-hint-head">
                      <AlertTriangle size={14} />
                      <span>合规警告（{formViolations.filter(v => v.severity === RULE_SEVERITY.WARNING).length}）</span>
                    </div>
                    <ul>
                      {formViolations.filter(v => v.severity === RULE_SEVERITY.WARNING).map((v, i) => (
                        <li key={i}>
                          <strong>{v.title}：</strong>{v.message}
                          {v.detail && <em>{v.detail}</em>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <div className="form-actions">
              <button className="primary" type="submit">{editing ? <><Save size={18} />保存</> : <><Plus size={18} />新增</>}</button>
              {editing ? (
                <button type="button" className="secondary" onClick={cancelEdit}><X size={18} />取消编辑</button>
              ) : (
                <button type="button" className="secondary" onClick={handleImportOpen}><Upload size={18} />批量导入</button>
              )}
            </div>
            {!editing && (
              <div className="backup-actions">
                <button type="button" className="backup-btn" onClick={handleExportBackup}>
                  <Download size={15} />导出备份
                </button>
                <button type="button" className="backup-btn" onClick={handleBackupOpen}>
                  <HardDriveUpload size={15} />导入恢复
                </button>
              </div>
            )}
            <p className="hint">{appConfig.note}</p>

            {shouldShowRecommendations && (
              <div className="smart-suggestion-panel">
                <div className="suggestion-header">
                  <div className="suggestion-title">
                    <Sparkles size={16} />
                    <h3>
                      {formHasConflict && formHasCleaningWarning
                        ? '检测到床位冲突与清洁缓冲不足 · 智能调整方案'
                        : formHasConflict
                          ? '检测到床位重叠 · 智能改床建议'
                          : '检测到清洁缓冲不足 · 智能时间调整建议'}
                    </h3>
                  </div>
                  <span className="suggestion-count">{smartRecommendations.length} 条方案</span>
                </div>
                {smartRecommendations.length > 0 ? (
                  <div className="suggestion-list">
                    {smartRecommendations.map((rec, idx) => (
                      <div key={idx} className={'suggestion-card type-' + rec.type}>
                        <div className="suggestion-card-head">
                          <div className="suggestion-badge">
                            {rec.type === RECOMMEND_TYPES.SAME_SHIFT_FREE_BED && <><Bed size={12} />同班次空闲</>}
                            {rec.type === RECOMMEND_TYPES.TIME_SLOT_FREE_BED && <><Wand2 size={12} />时段可用</>}
                            {rec.type === RECOMMEND_TYPES.ADJUST_START_TIME && <><Clock size={12} />调整时间</>}
                            {rec.type === RECOMMEND_TYPES.ADJACENT_SHIFT_BED && <><ArrowRightLeft size={12} />相邻班次</>}
                          </div>
                          <div className="suggestion-score">推荐度 {Math.round(rec.score)}</div>
                        </div>
                        <div className="suggestion-content">
                          <div className="suggestion-main">
                            <span className="suggestion-bed">{rec.bed}</span>
                            <span className="suggestion-shift">{rec.shift}</span>
                            <span className="suggestion-time">{rec.start} - {rec.end}</span>
                          </div>
                          <p className="suggestion-reason">{rec.reason}</p>
                        </div>
                        <button
                          type="button"
                          className={'apply-suggestion-btn' + (adoptedRecommendation && adoptedRecommendation.bed === rec.bed && adoptedRecommendation.start === rec.start ? ' adopted' : '')}
                          onClick={() => applyRecommendation(rec)}
                        >
                          {adoptedRecommendation && adoptedRecommendation.bed === rec.bed && adoptedRecommendation.start === rec.start ? (
                            <><CheckCircle2 size={14} />已采纳，正在校验...</>
                          ) : (
                            <><CheckCheck size={14} />采用此方案</>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-suggestion">
                    <AlertTriangle size={16} />
                    <span>暂未找到合适的替代方案，请手动调整班次、时间段或床位。</span>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        <section className="panel list-panel">
          <div className="toolbar">
            <div className="search">
              <Search size={16} />
              <input value={filters.query} onChange={(event) => setFilters({ ...filters, query: event.target.value })} placeholder={appConfig.filters[0]?.label || '搜索患者/床位'} />
            </div>
            <div className="filter-group">
              <Filter size={14} className="filter-icon" />
              <input
                type="date"
                value={filters.date}
                onChange={(event) => setFilters({ ...filters, date: event.target.value })}
                placeholder="透析日期"
                className="filter-input date-filter"
              />
              <select
                value={filters.shift}
                onChange={(event) => setFilters({ ...filters, shift: event.target.value })}
                className="filter-select"
              >
                <option value="全部">全部班次</option>
                {filterOptions.shifts.map((shift) => <option key={shift}>{shift}</option>)}
              </select>
              <select
                value={filters.bed}
                onChange={(event) => setFilters({ ...filters, bed: event.target.value })}
                className="filter-select"
              >
                <option value="">全部床位</option>
                {filterOptions.beds.map((bed) => <option key={bed}>{bed}</option>)}
              </select>
              <select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} className="filter-select">
                <option value="全部">全部状态</option>
                {appConfig.statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="clear-filter-btn"
                  onClick={() => setFilters({ query: '', status: '全部', date: '', shift: '全部', bed: '' })}
                  title="清除所有筛选"
                >
                  <X size={14} />
                  清除
                </button>
              )}
            </div>
            <div className="view-toggle">
              <button type="button" className={'toggle-btn ' + (!auditViewMode && !patientTrackView && viewMode === 'list' ? 'active' : '')} onClick={() => { setAuditViewMode(false); setPatientTrackView(false); setSelectedPatient(null); setViewMode('list'); }} title="列表视图">
                <List size={16} />
              </button>
              <button type="button" className={'toggle-btn ' + (!auditViewMode && !patientTrackView && viewMode === 'calendar' ? 'active' : '')} onClick={() => { setAuditViewMode(false); setPatientTrackView(false); setSelectedPatient(null); setViewMode('calendar'); }} title="日历视图">
                <LayoutGrid size={16} />
              </button>
              <button type="button" className={'toggle-btn ' + (!auditViewMode && !patientTrackView && viewMode === 'timeline' ? 'active' : '')} onClick={() => { setAuditViewMode(false); setPatientTrackView(false); setSelectedPatient(null); setViewMode('timeline'); }} title="时间轴视图">
                <Clock size={16} />
              </button>
              <button type="button" className={'toggle-btn audit-toggle ' + (auditViewMode ? 'active' : '')} onClick={() => { setAuditViewMode(!auditViewMode); if (!auditViewMode) { setPatientTrackView(false); setSelectedPatient(null); setPatientSearchQuery(''); } }} title="状态流转审计">
                <GitBranch size={16} />
              </button>
              <button type="button" className={'toggle-btn patient-track-toggle ' + (patientTrackView ? 'active' : '')} onClick={() => { setPatientTrackView(!patientTrackView); if (patientTrackView) { setSelectedPatient(null); setPatientSearchQuery(''); } else { setAuditViewMode(false); } }} title="患者连续排班追踪">
                <Activity size={16} />
              </button>
            </div>
          </div>

          {patientTrackView ? (
            <div className="patient-track-panel">
              {selectedPatient && selectedPatientDetail ? (
                <div className="patient-detail-view">
                  <div className="patient-detail-header">
                    <button type="button" className="patient-back-btn" onClick={() => setSelectedPatient(null)}>
                      <ArrowLeft size={16} />
                      <span>返回患者列表</span>
                    </button>
                    <div className="patient-detail-title">
                      <User size={20} />
                      <h2>{selectedPatientDetail.name}</h2>
                    </div>
                  </div>

                  <div className="patient-detail-stats">
                    <div className="patient-stat-card">
                      <span className="patient-stat-label">总透析次数</span>
                      <span className="patient-stat-value">{selectedPatientDetail.totalSessions}</span>
                    </div>
                    <div className="patient-stat-card completed">
                      <span className="patient-stat-label">已完成</span>
                      <span className="patient-stat-value">{selectedPatientDetail.completedSessions}</span>
                    </div>
                    <div className="patient-stat-card incomplete">
                      <span className="patient-stat-label">未完成</span>
                      <span className="patient-stat-value">{selectedPatientDetail.incompleteSessions}</span>
                    </div>
                    <div className="patient-stat-card beds">
                      <span className="patient-stat-label">使用床位</span>
                      <span className="patient-stat-value">{selectedPatientDetail.beds.length}</span>
                    </div>
                  </div>

                  {selectedPatientDetail.recentSchedule && (
                    <div className="patient-recent-section">
                      <h4 className="patient-section-title"><Clock size={16} />最近安排</h4>
                      <div className="patient-recent-card">
                        <div className="patient-recent-main">
                          <span className="patient-recent-date">{selectedPatientDetail.recentSchedule.date}</span>
                          <span className="patient-recent-shift">{selectedPatientDetail.recentSchedule.shift}</span>
                          <span className="patient-recent-bed">{selectedPatientDetail.recentSchedule.bed}</span>
                        </div>
                        <div className="patient-recent-meta">
                          <span>{selectedPatientDetail.recentSchedule.start} - {selectedPatientDetail.recentSchedule.end}</span>
                          <span className={'status ' + statusClass(selectedPatientDetail.recentSchedule.status)}>{selectedPatientDetail.recentSchedule.status}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPatientDetail.bedChanges.length > 0 && (
                    <div className="patient-bed-changes-section">
                      <h4 className="patient-section-title"><ArrowRightLeft size={16} />床位变化</h4>
                      <div className="patient-bed-changes-list">
                        {selectedPatientDetail.bedChanges.map((change, idx) => (
                          <div key={idx} className="patient-bed-change-item">
                            <span className="bed-change-date">{change.date}</span>
                            <span className="bed-change-from">{change.from}</span>
                            <ArrowRightLeft size={14} className="bed-change-arrow" />
                            <span className="bed-change-to">{change.to}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPatientDetail.incompleteRecords.length > 0 && (
                    <div className="patient-incomplete-section">
                      <h4 className="patient-section-title"><AlertCircle size={16} />未完成记录</h4>
                      <div className="patient-incomplete-list">
                        {selectedPatientDetail.incompleteRecords.map((item) => (
                          <div key={item.id} className="patient-incomplete-item" onClick={() => setSelected(item)}>
                            <div className="patient-incomplete-main">
                              <span className="patient-incomplete-date">{item.date}</span>
                              <span className="patient-incomplete-shift">{item.shift}</span>
                              <span className="patient-incomplete-bed">{item.bed}</span>
                            </div>
                            <div className="patient-incomplete-meta">
                              <span>{item.start}-{item.end}</span>
                              <span className={'status ' + statusClass(item.status)}>{item.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="patient-timeline-section">
                    <h4 className="patient-section-title"><History size={16} />透析时间线</h4>
                    <div className="patient-timeline-list">
                      {selectedPatientDetail.records.map((item, idx) => (
                        <div key={item.id} className="patient-timeline-item" onClick={() => setSelected(item)}>
                          <div className="patient-timeline-dot-wrapper">
                            <div className={'patient-timeline-dot ' + statusClass(item.status)}></div>
                            {idx < selectedPatientDetail.records.length - 1 && <div className="patient-timeline-line"></div>}
                          </div>
                          <div className="patient-timeline-content">
                            <div className="patient-timeline-head">
                              <span className="patient-timeline-date">{item.date}</span>
                              <span className="patient-timeline-shift">{item.shift}</span>
                              <span className={'status ' + statusClass(item.status)}>{item.status}</span>
                            </div>
                            <div className="patient-timeline-meta">
                              <span className="patient-timeline-bed"><Bed size={12} />{item.bed}</span>
                              <span className="patient-timeline-time">{item.start}-{item.end}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="patient-track-search">
                    <Search size={16} />
                    <input
                      value={patientSearchQuery}
                      onChange={(e) => setPatientSearchQuery(e.target.value)}
                      placeholder="按患者姓名搜索"
                    />
                  </div>
                  {filteredPatientGroups.length === 0 ? (
                    <p className="empty">{patientSearchQuery ? '未找到匹配的患者' : '暂无患者排班数据'}</p>
                  ) : (
                    <div className="patient-track-list">
                      {filteredPatientGroups.map((group) => (
                        <article className="patient-track-card" key={group.name} onClick={() => setSelectedPatient(group.name)}>
                          <div className="patient-track-card-head">
                            <div className="patient-track-avatar">
                              <User size={18} />
                            </div>
                            <div className="patient-track-info">
                              <h3>{group.name}</h3>
                              <p>{group.totalSessions} 次透析 · {group.beds.length} 个床位</p>
                            </div>
                            <ChevronRight size={18} className="patient-track-chevron" />
                          </div>
                          <div className="patient-track-card-stats">
                            <div className="patient-track-mini-stat">
                              <span className="mini-stat-label">已完成</span>
                              <span className="mini-stat-value completed">{group.completedSessions}</span>
                            </div>
                            <div className="patient-track-mini-stat">
                              <span className="mini-stat-label">未完成</span>
                              <span className="mini-stat-value incomplete">{group.incompleteSessions}</span>
                            </div>
                            <div className="patient-track-mini-stat">
                              <span className="mini-stat-label">床位变化</span>
                              <span className="mini-stat-value">{group.bedChanges.length}</span>
                            </div>
                          </div>
                          {group.recentSchedule && (
                            <div className="patient-track-recent">
                              <span className="recent-label">最近</span>
                              <span className="recent-date">{group.recentSchedule.date}</span>
                              <span className="recent-shift">{group.recentSchedule.shift}</span>
                              <span className="recent-bed">{group.recentSchedule.bed}</span>
                              <span className={'status ' + statusClass(group.recentSchedule.status)}>{group.recentSchedule.status}</span>
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ) : auditViewMode ? (
            <div className="audit-panel">
              <div className="audit-toolbar">
                <div className="audit-filters">
                  <div className="audit-filter-item">
                    <label><User size={14} />操作员</label>
                    <select
                      value={auditFilters.operator}
                      onChange={(e) => setAuditFilters({ ...auditFilters, operator: e.target.value })}
                    >
                      <option>全部</option>
                      {operators.map((op) => <option key={op}>{op}</option>)}
                    </select>
                  </div>
                  <div className="audit-filter-item">
                    <label><Filter size={14} />状态</label>
                    <select
                      value={auditFilters.status}
                      onChange={(e) => setAuditFilters({ ...auditFilters, status: e.target.value })}
                    >
                      <option>全部</option>
                      {appConfig.statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </div>
                  <div className="audit-filter-item">
                    <label><Calendar size={14} />开始日期</label>
                    <input
                      type="date"
                      value={auditFilters.startDate}
                      onChange={(e) => setAuditFilters({ ...auditFilters, startDate: e.target.value })}
                    />
                  </div>
                  <div className="audit-filter-item">
                    <label><Calendar size={14} />结束日期</label>
                    <input
                      type="date"
                      value={auditFilters.endDate}
                      onChange={(e) => setAuditFilters({ ...auditFilters, endDate: e.target.value })}
                    />
                  </div>
                  <div className="audit-filter-item audit-abnormal-toggle">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={auditFilters.abnormalOnly}
                        onChange={(e) => setAuditFilters({ ...auditFilters, abnormalOnly: e.target.checked })}
                      />
                      <AlertOctagon size={14} />仅显示异常
                    </label>
                  </div>
                </div>
              </div>

              <div className="audit-stats">
                <div className="audit-stat-card">
                  <span className="audit-stat-label">总记录数</span>
                  <span className="audit-stat-value">{auditStats.total}</span>
                </div>
                <div className="audit-stat-card abnormal">
                  <span className="audit-stat-label">含异常记录</span>
                  <span className="audit-stat-value">{auditStats.withAbnormalities}</span>
                </div>
                <div className="audit-stat-card error">
                  <span className="audit-stat-label">状态倒退</span>
                  <span className="audit-stat-value">{auditStats.regressionCount}</span>
                </div>
                <div className="audit-stat-card warning">
                  <span className="audit-stat-label">重复点击</span>
                  <span className="audit-stat-value">{auditStats.repeatedCount}</span>
                </div>
                <div className="audit-stat-card error">
                  <span className="audit-stat-label">跳过清洁</span>
                  <span className="audit-stat-value">{auditStats.skipCleaningCount}</span>
                </div>
              </div>

              <div className="audit-list">
                {auditRecords.length === 0 ? (
                  <p className="empty">暂无符合条件的记录</p>
                ) : (
                  auditRecords.map((item) => (
                    <article
                      className={'audit-record ' + (item.hasAbnormalities ? 'has-abnormal' : '')}
                      key={item.id}
                      onClick={() => setSelectedAuditRecord(item)}
                    >
                      <div className="audit-record-head">
                        <div className="audit-record-main">
                          <h3>{`${item.bed} · ${item.patient}`}</h3>
                          <p>{`${item.date} ${item.shift} · ${item.start}-${item.end}`}</p>
                        </div>
                        <div className="audit-record-status">
                          <span className={'status ' + statusClass(item.status)}>{item.status}</span>
                          {item.hasAbnormalities && (
                            <span className="abnormal-badge">
                              <AlertTriangle size={12} />
                              {item.abnormalityCount} 处异常
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="audit-timeline-preview">
                        {item.analyzedSteps.length === 0 ? (
                          <span className="no-timeline">历史数据：无完整timeline记录</span>
                        ) : (
                          item.analyzedSteps.map((step, idx) => (
                            <div key={idx} className={'timeline-preview-step ' + (step.abnormalities.length > 0 ? 'abnormal' : '')}>
                              <span className={'step-status ' + statusClass(step.status)}>{step.status}</span>
                              {idx < item.analyzedSteps.length - 1 && (
                                <ArrowRightLeft size={12} className="step-arrow" />
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          ) : viewMode === 'list' ? (
            <div className="records">
              {filteredRecords.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <Search size={48} strokeWidth={1} />
                  </div>
                  <h3>{hasActiveFilters ? '没有找到匹配的记录' : '暂无排班记录'}</h3>
                  <p>{hasActiveFilters ? '请尝试调整筛选条件，或点击「清除」按钮重置所有筛选' : '点击右上角「添加」按钮创建第一条排班记录'}</p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="primary"
                      onClick={() => setFilters({ query: '', status: '全部', date: '', shift: '全部', bed: '' })}
                    >
                      清除所有筛选条件
                    </button>
                  )}
                </div>
              ) : (
                filteredRecords.map((item) => {
                  const violations = getRecordViolations(item);
                  const hasErrors = violations.some((v) => v.severity === RULE_SEVERITY.ERROR);
                  const hasWarnings = violations.some((v) => v.severity === RULE_SEVERITY.WARNING);
                  const isBad = hasErrors || item.conflict;
                  return (
                    <article className={'record ' + (isBad ? 'conflict' : '') + (hasWarnings && !isBad ? 'warning' : '')} key={item.id} onClick={() => setSelected(item)}>
                      <div className="record-head">
                        <div>
                          <h3>{`${item.bed} · ${item.patient}`}</h3>
                          <p>{`${item.date} ${item.shift} · ${item.start}-${item.end}`}</p>
                        </div>
                        <span className={'status ' + statusClass(item.status)}>{item.status}</span>
                      </div>
                      <p className="record-detail">{violationSummaryText(item)}</p>
                      {(isBad || hasWarnings) && (
                        <div className="warning">
                          {hasErrors ? <AlertCircle size={15} /> : <AlertTriangle size={15} />}
                          {hasErrors ? `发现 ${violations.filter(v => v.severity === RULE_SEVERITY.ERROR).length} 项规则错误` : `发现 ${violations.filter(v => v.severity === RULE_SEVERITY.WARNING).length} 项合规警告`}
                        </div>
                      )}
                      <div className="actions" onClick={(event) => event.stopPropagation()}>
                        <button type="button" onClick={() => startEdit(item)}><Edit2 size={14} />编辑</button>
                        {appConfig.statuses.map((status) => (
                          <button key={status} type="button" onClick={() => updateStatus(item.id, status)}>{status}</button>
                        ))}
                        {appConfig.action === 'copyRecipe' && <button type="button" onClick={() => duplicateRecord(item)}><RotateCcw size={14} />复制</button>}
                        {appConfig.chart && <button type="button" onClick={() => addTemperature(item)}>加温度</button>}
                        <button className="ghost-danger" type="button" onClick={() => removeRecord(item.id)}><Trash2 size={14} /></button>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          ) : viewMode === 'calendar' ? (
            <div className="calendar-wrap">
              {calendarDates.length === 0 || calendarBeds.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <LayoutGrid size={48} strokeWidth={1} />
                  </div>
                  <h3>{hasActiveFilters ? '没有找到匹配的排班' : '暂无排班数据'}</h3>
                  <p>{hasActiveFilters ? '当前筛选条件下没有找到排班记录，请调整筛选条件' : '添加排班记录后即可在日历视图中查看'}</p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="primary"
                      onClick={() => setFilters({ query: '', status: '全部', date: '', shift: '全部', bed: '' })}
                    >
                      清除所有筛选条件
                    </button>
                  )}
                </div>
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
                              const violations = getRecordViolations(item);
                              const hasErrors = violations.some((v) => v.severity === RULE_SEVERITY.ERROR);
                              const hasWarnings = violations.some((v) => v.severity === RULE_SEVERITY.WARNING);
                              const isConflict = hasErrors || item.conflict;
                              return (
                                <div
                                  key={item.id}
                                  className={'cal-item ' + (isConflict ? 'conflict' : '') + (hasWarnings && !isConflict ? ' warning' : '')}
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
                                  {isConflict && <div className="cal-warning"><AlertCircle size={12} />{violations.filter(v => v.severity === RULE_SEVERITY.ERROR).length} 错</div>}
                                  {hasWarnings && !isConflict && <div className="cal-warning warn"><AlertTriangle size={12} />{violations.filter(v => v.severity === RULE_SEVERITY.WARNING).length} 警</div>}
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
          ) : (
            <div className="timeline-wrap">
              <div className="timeline-toolbar">
                <div className="timeline-shift-tabs">
                  {['全部', '上午', '下午', '夜间'].map((shift) => (
                    <button
                      key={shift}
                      type="button"
                      className={'shift-tab ' + (effectiveTimelineShift === shift ? 'active' : '')}
                      onClick={() => { setTimelineShift(shift); setFilters({ ...filters, shift }); }}
                    >
                      {shift}
                    </button>
                  ))}
                </div>
                <div className="timeline-date-info">
                  <span>{filters.date ? '筛选日期：' + timelineDate : '今日：' + timelineDate}</span>
                </div>
              </div>
              {(hasActiveFilters ? timelineRecords.length === 0 : timelineBeds.length === 0) ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <Clock size={48} strokeWidth={1} />
                  </div>
                  <h3>{hasActiveFilters ? '没有找到匹配的排班' : '暂无床位数据'}</h3>
                  <p>{hasActiveFilters ? '当前筛选条件下没有找到排班记录，请调整筛选条件' : '添加排班记录后即可在时间轴视图中查看'}</p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="primary"
                      onClick={() => setFilters({ query: '', status: '全部', date: '', shift: '全部', bed: '' })}
                    >
                      清除所有筛选条件
                    </button>
                  )}
                </div>
              ) : (
                <div className="timeline-container">
                  <div className="timeline-header">
                    <div className="timeline-bed-col">床位</div>
                    <div className="timeline-time-col">
                      <div className="timeline-time-scale">
                        {timelineHours.map((hour) => (
                          <div key={hour} className="timeline-hour-mark">
                            <span>{hour}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="timeline-body">
                    {timelineBeds.map((bed) => {
                      const bedData = timelineData[bed] || { items: [], maxRows: 0 };
                      const rowHeight = Math.max(44, 36 + bedData.maxRows * 28);
                      return (
                        <div className="timeline-row" key={bed} style={{ minHeight: rowHeight }}>
                          <div className="timeline-bed-col">
                            <Bed size={14} />
                            <span>{bed}</span>
                          </div>
                          <div className="timeline-time-col">
                            <div className="timeline-grid-lines">
                              {timelineHours.map((hour, idx) => (
                                <div key={hour} className={'timeline-grid-line ' + (idx === 0 ? 'first' : '')}></div>
                              ))}
                            </div>
                            <div className="timeline-items">
                              {bedData.items.map((item) => {
                                const vs = item.violations || [];
                                const errCount = vs.filter((v) => v.severity === RULE_SEVERITY.ERROR).length;
                                const warnCount = vs.filter((v) => v.severity === RULE_SEVERITY.WARNING).length;
                                const titleParts = [`${item.patient} · ${item.start}-${item.end}`];
                                if (errCount) titleParts.push(`· ${errCount} 错`);
                                if (warnCount) titleParts.push(`· ${warnCount} 警`);
                                return (
                                  <div
                                    key={item.id}
                                    className={'timeline-block ' + statusClass(item.status)
                                      + (item.hasSevereViolation ? ' conflict' : '')
                                      + (item.hasWarningViolation && !item.hasSevereViolation ? ' warning' : '')}
                                    style={{
                                      left: `${item.left}%`,
                                      width: `${item.width}%`,
                                      top: `${item.row * 28 + 4}px`
                                    }}
                                    onClick={() => setSelected(item)}
                                    title={titleParts.join(' ')}
                                  >
                                    <span className="timeline-block-patient">{item.patient}</span>
                                    <span className="timeline-block-time">{item.start}-${item.end}</span>
                                    {item.hasSevereViolation && (
                                      <span className="timeline-conflict-badge error">
                                        <AlertCircle size={10} />
                                      </span>
                                    )}
                                    {item.hasWarningViolation && !item.hasSevereViolation && (
                                      <span className="timeline-conflict-badge warn">
                                        <AlertTriangle size={10} />
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {timelineConflictRecords.length > 0 && (
                <div className="timeline-conflict-summary">
                  <AlertTriangle size={16} />
                  <span>共发现 {timelineConflictRecords.length} 条排班违规（{timelineConflictRecords.filter(r => recordHasErrors(r)).length} 错 / {timelineConflictRecords.filter(r => { const vs = getRecordViolations(r); return vs.some(v => v.severity === RULE_SEVERITY.WARNING) && !vs.some(v => v.severity === RULE_SEVERITY.ERROR); }).length} 警），请点击色块查看详情并调整安排。</span>
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
            {auditViewMode ? (
              <>
                <GitBranch size={18} />
                <h2>流转审计详情</h2>
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                <h2>详情</h2>
              </>
            )}
          </div>
          {auditViewMode && selectedAuditRecord ? (
            <div className="detail audit-detail">
              <h3>{`${selectedAuditRecord.bed} · ${selectedAuditRecord.patient}`}</h3>
              <p>{`${selectedAuditRecord.date} ${selectedAuditRecord.shift} · ${selectedAuditRecord.start}-${selectedAuditRecord.end}`}</p>
              <p>当前状态：<span className={'status ' + statusClass(selectedAuditRecord.status)}>{selectedAuditRecord.status}</span></p>

              {selectedAuditRecord.hasAbnormalities && (
                <div className="audit-abnormalities">
                  <h4 className="abnormal-title">
                    <AlertOctagon size={16} />
                    异常流转 ({selectedAuditRecord.abnormalityCount} 处)
                  </h4>
                  <div className="abnormal-list">
                    {selectedAuditRecord.abnormalities.map((ab, idx) => (
                      <div key={idx} className={'abnormal-item severity-' + ab.severity}>
                        <span className="abnormal-type">{ab.label}</span>
                        <span className="abnormal-desc">{ab.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="timeline audit-timeline">
                <h4 className="timeline-title">
                  <History size={16} />
                  状态流转轨迹
                </h4>
                {selectedAuditRecord.analyzedSteps.length === 0 ? (
                  <div className="no-timeline-history">
                    <AlertCircle size={16} />
                    <span>历史数据：无完整timeline记录，仅显示当前状态</span>
                  </div>
                ) : (
                  selectedAuditRecord.analyzedSteps.map((step, index) => (
                    <div key={index} className={'timeline-step ' + (step.abnormalities.length > 0 ? 'has-abnormality' : '')}>
                      <div className="timeline-step-header">
                        <span className={'status ' + statusClass(step.status)}>{step.status}</span>
                        <span className="timeline-step-meta">{step.at} · {step.by}</span>
                      </div>
                      {step.abnormalities.length > 0 && (
                        <div className="step-abnormalities">
                          {step.abnormalities.map((ab, abIdx) => (
                            <span key={abIdx} className={'step-abnormal-tag severity-' + ab.severity}>
                              <AlertTriangle size={10} />
                              {ab.label}
                            </span>
                          ))}
                        </div>
                      )}
                      {index < selectedAuditRecord.analyzedSteps.length - 1 && (
                        <div className="timeline-step-connector">
                          <ArrowRightLeft size={12} />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : selected ? (
            <div className="detail">
              <h3>{`${selected.bed} · ${selected.patient}`}</h3>
              <p>{`${selected.date} ${selected.shift} · ${selected.start}-${selected.end}`}</p>
              {(() => {
                const vs = getRecordViolations(selected);
                if (vs.length === 0) {
                  return <p className="detail-ok"><CheckCircle2 size={14} />排班合规，无违规项</p>;
                }
                const errors = vs.filter(v => v.severity === RULE_SEVERITY.ERROR);
                const warnings = vs.filter(v => v.severity === RULE_SEVERITY.WARNING);
                return (
                  <div className="detail-violations">
                    {errors.length > 0 && (
                      <div className="violation-group error">
                        <div className="violation-group-head">
                          <AlertCircle size={14} />
                          <span>规则错误（{errors.length}）</span>
                        </div>
                        <ul>
                          {errors.map((e, i) => (
                            <li key={i}>
                              <strong>{e.title}：</strong>{e.message}
                              {e.detail && <em>{e.detail}</em>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {warnings.length > 0 && (
                      <div className="violation-group warn">
                        <div className="violation-group-head">
                          <AlertTriangle size={14} />
                          <span>合规警告（{warnings.length}）</span>
                        </div>
                        <ul>
                          {warnings.map((w, i) => (
                            <li key={i}>
                              <strong>{w.title}：</strong>{w.message}
                              {w.detail && <em>{w.detail}</em>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })()}
              
              <button
                type="button"
                className="view-patient-track-btn"
                onClick={() => {
                  setPatientTrackView(true);
                  setSelectedPatient(selected.patient);
                  setAuditViewMode(false);
                }}
              >
                <Activity size={14} />
                查看患者连续排班
              </button>
              
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
            <p className="empty">{auditViewMode ? '点击任意记录查看流转审计详情。' : '点击任意记录查看详情和状态流转。'}</p>
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
                            <td className={!String(p.row.patient || '').trim() ? 'cell-bad' : ''}>
                              <input
                                type="text"
                                className="preview-input"
                                value={p.row.patient || ''}
                                onChange={(e) => handlePreviewFieldChange(idx, 'patient', e.target.value)}
                                placeholder="患者姓名"
                              />
                            </td>
                            <td className={!String(p.row.date || '').trim() || !DATE_REGEX.test(p.row.date) ? 'cell-bad' : ''}>
                              <input
                                type="date"
                                className="preview-input"
                                value={p.row.date || ''}
                                onChange={(e) => handlePreviewFieldChange(idx, 'date', e.target.value)}
                              />
                            </td>
                            <td className={!String(p.row.shift || '').trim() ? 'cell-bad' : ''}>
                              <select
                                className="preview-input"
                                value={p.row.shift || ''}
                                onChange={(e) => handlePreviewFieldChange(idx, 'shift', e.target.value)}
                              >
                                <option value="">选择班次</option>
                                {appConfig.fields.find(f => f.key === 'shift').options.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </td>
                            <td className={!String(p.row.bed || '').trim() ? 'cell-bad' : ''}>
                              <select
                                className="preview-input"
                                value={p.row.bed || ''}
                                onChange={(e) => handlePreviewFieldChange(idx, 'bed', e.target.value)}
                              >
                                <option value="">选择床位</option>
                                {appConfig.fields.find(f => f.key === 'bed').options.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </td>
                            <td className={!String(p.row.start || '').trim() || !isValidTime(p.row.start) ? 'cell-bad' : ''}>
                              <input
                                type="time"
                                className="preview-input"
                                value={p.row.start || ''}
                                onChange={(e) => handlePreviewFieldChange(idx, 'start', e.target.value)}
                              />
                            </td>
                            <td className={!String(p.row.end || '').trim() || !isValidTime(p.row.end) || (isValidTime(p.row.start) && isValidTime(p.row.end) && !(p.row.start < p.row.end)) ? 'cell-bad' : ''}>
                              <input
                                type="time"
                                className="preview-input"
                                value={p.row.end || ''}
                                onChange={(e) => handlePreviewFieldChange(idx, 'end', e.target.value)}
                              />
                            </td>
                            <td>
                              <select
                                className="preview-input"
                                value={p.row.status || appConfig.primaryStatus}
                                onChange={(e) => handlePreviewFieldChange(idx, 'status', e.target.value)}
                              >
                                {appConfig.statuses.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            </td>
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

      {backupOpen && (
        <div className="modal-overlay" onClick={handleBackupClose}>
          <div className="modal backup-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="panel-title">
                <Database size={18} />
                <h2>本地数据备份与恢复</h2>
              </div>
              <button type="button" className="icon-btn" onClick={handleBackupClose}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="backup-section">
                <div className="backup-export-card">
                  <div className="backup-card-head">
                    <Download size={22} />
                    <div>
                      <h3>导出当前数据</h3>
                      <p>将当前 {records.length} 条透析排班记录导出为 JSON 备份文件，保存到本地。</p>
                    </div>
                  </div>
                  <button type="button" className="primary" onClick={handleExportBackup}>
                    <Download size={16} />下载备份文件
                  </button>
                </div>
              </div>

              <div className="backup-divider">
                <span>或</span>
              </div>

              <div className="backup-section">
                <div className="backup-import-card">
                  <div className="backup-card-head">
                    <HardDriveUpload size={22} />
                    <div>
                      <h3>从备份文件恢复</h3>
                      <p>选择之前导出的 JSON 备份文件，系统将校验数据并展示差异摘要，确认无误后再覆盖当前数据。</p>
                    </div>
                  </div>
                  <label className="backup-file-label">
                    <input
                      ref={backupFileInputRef}
                      type="file"
                      accept="application/json,.json"
                      onChange={handleBackupFileSelect}
                      style={{ display: 'none' }}
                    />
                    <Upload size={16} />
                    {backupFileName ? backupFileName : '选择 JSON 备份文件'}
                  </label>
                </div>

                {backupFatalError && (
                  <div className="backup-error-banner">
                    <AlertOctagon size={18} />
                    <span>{backupFatalError}</span>
                  </div>
                )}

                {backupMeta && !backupFatalError && (
                  <div className="backup-meta">
                    <span className="backup-meta-label">备份来源：</span>
                    <span>{backupMeta.domain || appConfig.domain}</span>
                    {backupMeta.exportedAt && (
                      <>
                        <span className="backup-meta-sep">·</span>
                        <span className="backup-meta-label">导出时间：</span>
                        <span>{new Date(backupMeta.exportedAt).toLocaleString('zh-CN')}</span>
                      </>
                    )}
                    {typeof backupMeta.recordCount === 'number' && (
                      <>
                        <span className="backup-meta-sep">·</span>
                        <span className="backup-meta-label">记录数：</span>
                        <span>{backupMeta.recordCount}</span>
                      </>
                    )}
                  </div>
                )}

                {backupValidationResults.length > 0 && (
                  <div className="backup-stats">
                    <div className="backup-stat-card ok">
                      <span className="backup-stat-label">有效记录</span>
                      <span className="backup-stat-value">{backupStats.valid}</span>
                    </div>
                    <div className="backup-stat-card error">
                      <span className="backup-stat-label">无效记录</span>
                      <span className="backup-stat-value">{backupStats.invalid}</span>
                    </div>
                    <div className="backup-stat-card warning">
                      <span className="backup-stat-label">含警告</span>
                      <span className="backup-stat-value">{backupStats.withWarnings}</span>
                    </div>
                    <div className="backup-stat-card info">
                      <span className="backup-stat-label">当前数据</span>
                      <span className="backup-stat-value">{records.length}</span>
                    </div>
                  </div>
                )}

                {backupDiff && (
                  <div className="backup-diff-section">
                    <div className="backup-diff-header">
                      <CheckCheck size={16} />
                      <h3>差异摘要</h3>
                    </div>
                    <div className="backup-diff-grid">
                      <div className="backup-diff-card added">
                        <div className="diff-icon">
                          <Plus size={18} />
                        </div>
                        <div className="diff-content">
                          <span className="diff-label">新增记录</span>
                          <span className="diff-count">{backupDiff.added.length}</span>
                        </div>
                      </div>
                      <div className="backup-diff-card updated">
                        <div className="diff-icon">
                          <Edit2 size={18} />
                        </div>
                        <div className="diff-content">
                          <span className="diff-label">变更记录</span>
                          <span className="diff-count">{backupDiff.updated.length}</span>
                        </div>
                      </div>
                      <div className="backup-diff-card unchanged">
                        <div className="diff-icon">
                          <CheckCircle2 size={18} />
                        </div>
                        <div className="diff-content">
                          <span className="diff-label">无变化</span>
                          <span className="diff-count">{backupDiff.unchanged.length}</span>
                        </div>
                      </div>
                      <div className="backup-diff-card removed">
                        <div className="diff-icon">
                          <Trash2 size={18} />
                        </div>
                        <div className="diff-content">
                          <span className="diff-label">将删除</span>
                          <span className="diff-count">{backupDiff.removedIds.length}</span>
                        </div>
                      </div>
                    </div>

                    {(backupDiff.added.length > 0 || backupDiff.updated.length > 0 || backupDiff.removedIds.length > 0) && (
                      <div className="backup-diff-details">
                        {backupDiff.added.length > 0 && (
                          <div className="diff-detail-group">
                            <h4>新增（{backupDiff.added.length}）</h4>
                            <div className="diff-detail-list">
                              {backupDiff.added.slice(0, 5).map((r) => (
                                <div key={r.id} className="diff-detail-item added">
                                  <span className="diff-bed">{r.bed}</span>
                                  <span className="diff-patient">{r.patient}</span>
                                  <span className="diff-meta">{r.date} {r.shift} {r.start}-{r.end}</span>
                                </div>
                              ))}
                              {backupDiff.added.length > 5 && (
                                <div className="diff-more">还有 {backupDiff.added.length - 5} 条新增...</div>
                              )}
                            </div>
                          </div>
                        )}

                        {backupDiff.updated.length > 0 && (
                          <div className="diff-detail-group">
                            <h4>变更（{backupDiff.updated.length}）</h4>
                            <div className="diff-detail-list">
                              {backupDiff.updated.slice(0, 3).map(({ old: o, new: n }) => (
                                <div key={n.id} className="diff-detail-item updated">
                                  <div className="diff-row">
                                    <span className="diff-bed">{o.bed}</span>
                                    <span className="diff-patient">{o.patient}</span>
                                    <span className="diff-meta">{o.date} {o.shift} {o.start}-{o.end}</span>
                                    <span className={'status diff-status ' + statusClass(o.status)}>{o.status}</span>
                                  </div>
                                  <ArrowRightLeft size={14} className="diff-arrow" />
                                  <div className="diff-row">
                                    <span className="diff-bed">{n.bed}</span>
                                    <span className="diff-patient">{n.patient}</span>
                                    <span className="diff-meta">{n.date} {n.shift} {n.start}-{n.end}</span>
                                    <span className={'status diff-status ' + statusClass(n.status)}>{n.status}</span>
                                  </div>
                                </div>
                              ))}
                              {backupDiff.updated.length > 3 && (
                                <div className="diff-more">还有 {backupDiff.updated.length - 3} 条变更...</div>
                              )}
                            </div>
                          </div>
                        )}

                        {backupDiff.removedIds.length > 0 && (
                          <div className="diff-detail-group">
                            <h4>将被删除（{backupDiff.removedIds.length}）</h4>
                            <div className="diff-detail-list">
                              {records
                                .filter(r => backupDiff.removedIds.includes(r.id))
                                .slice(0, 5)
                                .map((r) => (
                                  <div key={r.id} className="diff-detail-item removed">
                                    <span className="diff-bed">{r.bed}</span>
                                    <span className="diff-patient">{r.patient}</span>
                                    <span className="diff-meta">{r.date} {r.shift} {r.start}-{r.end}</span>
                                    <span className={'status diff-status ' + statusClass(r.status)}>{r.status}</span>
                                  </div>
                                ))}
                              {backupDiff.removedIds.length > 5 && (
                                <div className="diff-more">还有 {backupDiff.removedIds.length - 5} 条将被删除...</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {backupValidationResults.length > 0 && (
                  <div className="backup-validation-section">
                    <div className="backup-validation-header">
                      <AlertCircle size={16} />
                      <h3>校验详情</h3>
                    </div>
                    <div className="preview-wrap validation-preview">
                      <div className="preview-table">
                        <table>
                          <thead>
                            <tr>
                              <th>序号</th>
                              <th>患者</th>
                              <th>日期</th>
                              <th>班次</th>
                              <th>床位</th>
                              <th>开始</th>
                              <th>结束</th>
                              <th>状态</th>
                              <th>校验结果</th>
                            </tr>
                          </thead>
                          <tbody>
                            {backupValidationResults.map((r, idx) => (
                              <tr key={idx} className={!r.valid ? 'row-error' : (r.warnings.length > 0 ? 'row-warning' : 'row-ok')}>
                                <td>{idx + 1}</td>
                                <td className={!String(r.normalized?.patient || '').trim() ? 'cell-bad' : ''}>{r.normalized?.patient || '-'}</td>
                                <td className={!String(r.normalized?.date || '').trim() || !DATE_REGEX.test(r.normalized?.date || '') ? 'cell-bad' : ''}>{r.normalized?.date || '-'}</td>
                                <td className={!String(r.normalized?.shift || '').trim() ? 'cell-bad' : ''}>{r.normalized?.shift || '-'}</td>
                                <td className={!String(r.normalized?.bed || '').trim() ? 'cell-bad' : ''}>{r.normalized?.bed || '-'}</td>
                                <td className={!String(r.normalized?.start || '').trim() || !isValidTime(r.normalized?.start || '') ? 'cell-bad' : ''}>{r.normalized?.start || '-'}</td>
                                <td className={!String(r.normalized?.end || '').trim() || !isValidTime(r.normalized?.end || '') || (isValidTime(r.normalized?.start || '') && isValidTime(r.normalized?.end || '') && !((r.normalized?.start || '') < (r.normalized?.end || ''))) ? 'cell-bad' : ''}>{r.normalized?.end || '-'}</td>
                                <td>{r.normalized?.status || '-'}</td>
                                <td className="validate-cell">
                                  {r.errors.map((e, i) => <span key={'e' + i} className="tag tag-error"><AlertCircle size={12} />{e}</span>)}
                                  {r.warnings.map((w, i) => <span key={'w' + i} className="tag tag-warn"><AlertTriangle size={12} />{w}</span>)}
                                  {r.valid && r.warnings.length === 0 && <span className="tag tag-ok"><CheckCircle2 size={12} />有效</span>}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="secondary" onClick={handleBackupClose}>取消</button>
              <button
                type="button"
                className="primary"
                onClick={handleConfirmRestore}
                disabled={backupValidRecords.length === 0 || backupStats.invalid > 0}
                title={backupStats.invalid > 0 ? '存在无效记录，无法恢复' : ''}
              >
                <Save size={16} />确认恢复并覆盖 {backupValidRecords.length} 条
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
