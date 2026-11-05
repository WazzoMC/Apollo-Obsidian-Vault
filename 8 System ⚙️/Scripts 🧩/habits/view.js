/* 🔁 Habit tracker: one shared Dataview view (needs Dataview with "Enable JavaScript queries" on).
 *
 * Used by
 *   🏠 Home ............ await dv.view("8 System ⚙️/Scripts 🧩/habits", {mode: "home"})
 *   ☀️ daily notes ..... {mode: "today"}   (via ☀️ Daily Template)
 *   🗓️ weekly notes .... {mode: "week"}    (via 🗓️ Weekly Template)
 *   🔁 Habits page ..... {mode: "habits"}
 *
 * ✏️ YOUR HABITS ARE NOT IN THIS FILE. They come from the "✏️ My habits" table on the
 * 🔁 Habits page (8 System ⚙️/MOC ⚙️/🔁 Habits.md). Edit the table, not this code.
 *
 * Table columns (order doesn't matter, matched by name):
 *   Habit    → "🌅 Wake up early" (emoji first = its icon)
 *   Property → name of the property saved in daily notes. Optional: made from the name if empty.
 *              Keep it the same forever, or old days stop counting.
 *   Goal     → only for number habits: "≥ 6000", "≤ 3h", "at least 8", "max 2h". Empty = tick box.
 *   Days     → "Mon Wed Fri", "Mon-Fri", "weekdays", "weekends". Empty = every day.
 *   Minimum  → ✅ = part of the Minimum Day. None marked → every habit counts.
 */
const DAILY = "2 Journal ☁️/Daily ☁️";
const DAILY_TEMPLATE = "8 System ⚙️/Templates 📎/☀️ Daily Template.md";
const WEEKLY = "2 Journal ☁️/Weekly 🗓️";
const TEMPLATES = "8 System ⚙️/Templates 📎";
const HABITS_PAGE = "8 System ⚙️/MOC ⚙️/🔁 Habits.md";

// ───────────────────────── setup ─────────────────────────
const mode = (typeof input !== "undefined" && input && input.mode) || "home";
const M = window.moment;
const app = dv.app;
const today = M().startOf("day");
const key = (d) => d.format("YYYY-MM-DD");
const here = dv.current();
const inTemplates = !!(here && here.file.path.startsWith(TEMPLATES));
const root = dv.container.createDiv({ cls: "hb hb-mode-" + mode });

// ───────────────────────── habits from the 🔁 Habits page ─────────────────────────
const DAYS = { mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6, sun: 7 };
const RESERVED = ["tags", "aliases", "cssclasses", "banner", "categories", "topics", "date"];
const slug = (t) => t.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const clean = (t) => String(t || "").replace(/[`*_]/g, "").replace(/<br\s*\/?>/g, " ").trim();

function parseGoal(raw, bad) {
  let t = clean(raw).toLowerCase();
  if (!t) return null;
  let better = "more";
  const lessRe = /^(≤|<=|<|max(imum)?|at most|up to|under)\s*/;
  const moreRe = /^(≥|>=|>|at least|over)\s*/;
  if (lessRe.test(t)) { better = "less"; t = t.replace(lessRe, ""); }
  else t = t.replace(moreRe, "");
  if (/\s*(or less|max)$/.test(t)) { better = "less"; t = t.replace(/\s*(or less|max)$/, ""); }
  t = t.replace(/\s*(or more|\+)$/, "");
  const m = t.match(/^(\d+(?:[.,]\d+)?)\s*(k(?![a-z]))?\s*([^\d\s].*)?$/);
  if (!m) { bad(`Goal "${raw}" isn't a number. Try "≥ 6000" or "≤ 3h".`); return null; }
  const goal = parseFloat(m[1].replace(",", ".")) * (m[2] ? 1000 : 1);
  return { type: "number", goal, better, unit: (m[3] || "").trim(), big: goal >= 1000 };
}

function parseDays(raw, bad) {
  let t = clean(raw).toLowerCase();
  if (!t || /^(every ?day|daily|all|-|–)$/.test(t)) return null;
  t = t.replace(/weekdays?/g, "mon-fri").replace(/weekends?/g, "sat-sun").replace(/\s*[-–—]\s*/g, "-");
  const out = new Set();
  for (const tok of t.split(/[\s,/;+&]+|\band\b/).filter(Boolean)) {
    const [a, b] = tok.split("-").map((x) => DAYS[x.slice(0, 3)]);
    if (!a || (tok.includes("-") && !b)) { bad(`Couldn't read the day "${tok}". Use Mon, Tue … Sun.`); continue; }
    if (!b) { out.add(a); continue; }
    for (let d = a, i = 0; i < 7; i++, d = (d % 7) + 1) { out.add(d); if (d === b) break; }
  }
  return out.size && out.size < 7 ? [...out].sort() : null;
}

async function loadHabits() {
  const problems = [];
  const f = app.vault.getAbstractFileByPath(HABITS_PAGE);
  if (!f) return { list: [], problems: [`Couldn't find the 🔁 Habits page (${HABITS_PAGE}).`] };
  const lines = (await app.vault.cachedRead(f)).split("\n");
  let i = lines.findIndex((l) => /^#{1,6}\s.*my habits/i.test(l));
  if (i < 0) return { list: [], problems: ['The 🔁 Habits page needs a "## ✏️ My habits" heading with the habits table under it.'] };
  const rows = [];
  for (i++; i < lines.length; i++) {
    const l = lines[i].trim();
    if (/^#{1,6}\s/.test(l)) break;
    if (l.startsWith("|")) rows.push(l.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim()));
    else if (rows.length && l) break;
  }
  const body = rows.filter((r) => !r.every((c) => /^:?-{2,}:?$/.test(c) || c === ""));
  if (body.length < 2) return { list: [], problems };
  const head = body.shift().map((h) => h.toLowerCase().replace(/[^a-z]/g, ""));
  const col = (word) => head.findIndex((h) => h.startsWith(word));
  const C = { habit: col("habit"), prop: col("prop"), goal: col("goal"), days: col("day"), min: col("min") };
  if (C.habit < 0) return { list: [], problems: ['The habits table needs a "Habit" column.'] };
  const list = [], seen = new Set();
  for (const r of body) {
    const cell = (c) => (c >= 0 ? r[c] || "" : "");
    const full = clean(cell(C.habit));
    if (!full) continue;
    const bad = (msg) => problems.push(`${full}: ${msg}`);
    const m = full.match(/^((?:\p{Regional_Indicator}{2}|\p{Extended_Pictographic})[\u{FE0F}\u{200D}\u{20E3}\u{1F3FB}-\u{1F3FF}\p{Extended_Pictographic}]*)\s*(.*)$/u);
    const icon = m ? m[1] : "•", name = (m ? m[2] : full) || full;
    const key = clean(cell(C.prop)) || slug(name);
    if (!key) { bad("give it a Property name (letters/numbers)."); continue; }
    if (RESERVED.includes(key)) { bad(`"${key}" is already used by Obsidian. Pick another Property name.`); continue; }
    if (seen.has(key)) { bad(`two habits share the property "${key}". Give one a different Property.`); continue; }
    seen.add(key);
    const minRaw = clean(cell(C.min));
    const h = { key, icon, name, min: !!minRaw && !/^(no|n|-|–|❌|false|0)$/i.test(minRaw) };
    const days = parseDays(cell(C.days), bad);
    if (days) h.days = days;
    Object.assign(h, parseGoal(cell(C.goal), bad) || {});
    list.push(h);
  }
  return { list, problems };
}

const loaded = await loadHabits();
const HABITS = loaded.list;
const MIN = HABITS.some((h) => h.min) ? HABITS.filter((h) => h.min) : HABITS;

// Daily notes by date
const pages = new Map();
for (const p of dv.pages(`"${DAILY}"`)) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(p.file.name)) pages.set(p.file.name, p);
}
// Tracking starts at the first daily note that has any habit property (older notes don't count as misses)
let start = null;
for (const [k, p] of pages) {
  if (HABITS.some((h) => p[h.key] !== undefined) && (!start || k < start)) start = k;
}
const startM = start ? M(start) : today.clone();

// ───────────────────────── values & states ─────────────────────────
const local = {}; // values just tapped, shown before Dataview re-indexes
const val = (k, h) =>
  local[k] && h.key in local[k] ? local[k][h.key] : pages.has(k) ? pages.get(k)[h.key] : undefined;
const num = (v) => (v === null || v === undefined || v === "" || isNaN(Number(v)) ? null : Number(v));
const done = (k, h) => {
  const v = val(k, h);
  if (h.type === "number") {
    const n = num(v);
    return n !== null && (h.better === "less" ? n <= h.goal : n >= h.goal);
  }
  return v === true;
};
const scheduled = (h, d) => !h.days || h.days.includes(d.isoWeekday());
const minFor = (k) => MIN.filter((h) => scheduled(h, M(k)));
const minDone = (k) => minFor(k).filter((h) => done(k, h)).length;
const minHit = (k) => minDone(k) === minFor(k).length;

// "future" · "none" (before tracking) · "done" · "off" (not expected that day) · "today" (still open) · "miss"
function state(d, test, isScheduled) {
  if (d.isAfter(today)) return "future";
  if (d.isBefore(startM)) return "none";
  if (test(key(d))) return "done";
  if (isScheduled && !isScheduled(d)) return "off";
  if (d.isSame(today)) return "today";
  return "miss";
}
const hState = (h) => (d) => state(d, (k) => done(k, h), (x) => scheduled(h, x));
const mState = (d) => state(d, minHit, (x) => minFor(key(x)).length > 0);

// Streak: today counts once done; an unfinished today doesn't break it
function streakOf(st) {
  let n = 0;
  const d = today.clone();
  for (let i = 0; i < 3000; i++) {
    const s = st(d);
    if (s === "done") n++;
    else if (s !== "off" && s !== "today") break;
    d.subtract(1, "day");
  }
  return n;
}
function bestOf(st) {
  let best = 0, cur = 0;
  for (const d = startM.clone(); !d.isAfter(today); d.add(1, "day")) {
    const s = st(d);
    if (s === "done") best = Math.max(best, ++cur);
    else if (s === "miss") cur = 0;
  }
  return best;
}
// Share of expected days done (open today and days off don't count)
function rate(st, from, to) {
  let yes = 0, all = 0;
  for (const d = from.clone(); !d.isAfter(to); d.add(1, "day")) {
    const s = st(d);
    if (s === "done") { yes++; all++; } else if (s === "miss") all++;
  }
  return all ? yes / all : null;
}
const pct = (r) => (r === null ? "—" : Math.round(r * 100) + "%");

// ───────────────────────── saving ─────────────────────────
function say(msg) {
  if (window.Notice) new window.Notice(msg);
  else root.createDiv({ cls: "hb-warn", text: msg });
}
async function ensureFile(k) {
  const path = `${DAILY}/${k}.md`;
  const existing = app.vault.getAbstractFileByPath(path);
  if (existing) return existing;
  const t = app.vault.getAbstractFileByPath(DAILY_TEMPLATE);
  let text = t ? await app.vault.read(t) : "";
  text = text.replace(/{{\s*(date|title)(?::([^}]*))?\s*}}/g, (_, w, f) =>
    w === "title" ? k : M(k).format(f || "YYYY-MM-DD"));
  return await app.vault.create(path, text);
}
async function setVal(k, h, v) {
  (local[k] = local[k] || {})[h.key] = v;
  rerender();
  try {
    const f = await ensureFile(k);
    await app.fileManager.processFrontMatter(f, (fm) => { fm[h.key] = v; });
  } catch (e) {
    console.error(e);
    say("Habit tracker couldn't save: " + e.message);
  }
}
const toggle = (k, h) => setVal(k, h, !done(k, h));

// ───────────────────────── pieces ─────────────────────────
const fmtNum = (h, n) =>
  n === null ? "—" : h.big ? (n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, "") + "k" : String(n)) : String(Math.round(n * 10) / 10);
const goalText = (h) => (h.better === "less" ? `≤ ${h.goal}${h.unit}` : `≥ ${fmtNum(h, h.goal)}`);

function statusCard(parent, k, withStats) {
  const wrap = parent.createDiv({ cls: "hb-hero" });
  const card = wrap.createDiv({ cls: "hb-card hb-status" });
  const n = minDone(k), total = minFor(k).length;
  const isToday = k === key(today);
  card.createDiv({ cls: "hb-date", text: (isToday ? "Today · " : "") + M(k).format("dddd, D MMM") });
  card.createDiv({
    cls: "hb-big" + (total && n === total ? " hb-good" : ""),
    text: !total ? "🌴 Rest day" : n === total ? "✅ Minimum day" : `⬜ ${n}/${total} minimum`,
  });
  if (!withStats) return;
  const stats = wrap.createDiv({ cls: "hb-stats" });
  const mon = today.clone().startOf("isoWeek");
  let weekHits = 0;
  for (const d = mon.clone(); !d.isAfter(today); d.add(1, "day")) if (mState(d) === "done") weekHits++;
  const items = [
    ["🔥", streakOf(mState), "day streak"],
    ["🏆", bestOf(mState), "best"],
    ["✅", weekHits, "days this week"],
  ];
  for (const [icon, v, label] of items) {
    const s = stats.createDiv({ cls: "hb-card hb-stat" });
    s.createDiv({ cls: "hb-stat-n", text: `${icon} ${v}` });
    s.createDiv({ cls: "hb-stat-l", text: label });
  }
}

function neverMissTwice(parent) {
  const k = key(today);
  if (minHit(k)) return;
  const y = today.clone().subtract(1, "day");
  if (mState(y) !== "miss") return;
  const twice = mState(y.clone().subtract(1, "day")) === "miss";
  const w = parent.createDiv({ cls: "hb-warn" });
  w.createEl("b", { text: twice ? "🧯 Rescue day. " : "⚠️ Never miss twice. " });
  w.createSpan({
    text: twice
      ? "A couple of days slipped, and that's okay. Today only your minimum habits count. Start with the smallest one."
      : "Yesterday slipped. Today the only goal is the minimum day.",
  });
}

function chips(parent, k, list, label) {
  const row = parent.createDiv({ cls: "hb-row" });
  if (label) row.createDiv({ cls: "hb-label-sm", text: label });
  const box = row.createDiv({ cls: "hb-chips" });
  for (const h of list) {
    if (h.type === "number") {
      const c = box.createDiv({ cls: "hb-chip hb-num" + (done(k, h) ? " hb-on" : "") });
      c.setAttr("title", `${h.name} (${goalText(h)})`);
      c.createSpan({ text: h.icon });
      const inp = c.createEl("input", {
        type: "text",
        attr: { placeholder: `${h.name} · goal ${goalText(h)}`, inputmode: "decimal" },
      });
      const n = num(val(k, h));
      if (n !== null) inp.value = String(n);
      if (h.unit) c.createSpan({ cls: "hb-unit", text: h.unit });
      // accepts 5200, 5,200, 5.2k · 3.5 or 3h30
      const parse = (t) => {
        t = String(t).trim().toLowerCase().replace(/\s/g, "");
        if (!t) return null;
        let m = t.match(/^(\d+)h(\d{1,2})m?$/);
        if (m) return Math.round((+m[1] + +m[2] / 60) * 10) / 10;
        m = t.match(/^(\d+(?:[.,]\d+)?)k$/);
        if (m) return Math.round(parseFloat(m[1].replace(",", ".")) * 1000);
        t = h.big ? t.replace(/[.,](?=\d{3}$)/, "") : t.replace(",", ".");
        const n = parseFloat(t.replace(/h$/, ""));
        return isNaN(n) ? undefined : n;
      };
      inp.addEventListener("change", () => {
        const v = parse(inp.value);
        if (v === undefined) return say(`Couldn't read "${inp.value}". Try a number like 5200 or 5.2k.`);
        setVal(k, h, v);
      });
    } else {
      const b = box.createEl("button", { cls: "hb-chip" + (done(k, h) ? " hb-on" : ""), text: `${h.icon} ${h.name}` });
      b.addEventListener("click", () => toggle(k, h));
    }
  }
}

// Plan written last night under "Tomorrow's Top 3" in the previous daily note
async function topThree(parent, k) {
  const prev = [...pages.keys()].filter((x) => x < k).sort().pop();
  const box = parent.createDiv({ cls: "hb-card hb-top3" });
  const head = box.createDiv({ cls: "hb-sub", text: "🎯 Today's Top 3" });
  let items = [];
  if (prev) {
    const f = app.vault.getAbstractFileByPath(pages.get(prev).file.path);
    const text = f ? await app.vault.cachedRead(f) : "";
    let on = false;
    for (const line of text.split("\n")) {
      if (/^#{1,6}\s/.test(line)) { on = /tomorrow/i.test(line); continue; }
      if (!on || !/^\s*(?:[-*+]|\d+\.)\s/.test(line)) continue;
      const t = line.replace(/^\s*(?:[-*+]|\d+\.)\s+(?:\[.\]\s*)?/, "").trim();
      if (t && !/:\s*$/.test(t)) items.push(t);
    }
    if (prev !== key(M(k).subtract(1, "day")) && items.length)
      head.createSpan({ cls: "hb-faint", text: ` · from ${M(prev).format("D MMM")}` });
  }
  if (!items.length) {
    const t = box.createDiv({ cls: "hb-faint" });
    t.createSpan({ text: "Nothing planned last night. Tonight, open " });
    const a = t.createEl("a", { text: "today's note", cls: "internal-link" });
    a.addEventListener("click", async (e) => {
      e.preventDefault();
      const f = await ensureFile(key(today));
      app.workspace.getLeaf(false).openFile(f);
    });
    t.createSpan({ text: " and write tomorrow's 3 under 🌙 Tomorrow's Top 3. They'll show up here in the morning." });
    return;
  }
  const ol = box.createEl("ol");
  for (const t of items.slice(0, 3)) ol.createEl("li", { text: t });
}

const CELL = { done: "■", miss: "·", today: "○", off: "–", future: "", none: "" };
function weekGrid(parent, monday, clickable, numbers = true) {
  // CSS grid (not a <table>): always exactly as wide as its box, at any zoom
  const list = HABITS.filter((h) => numbers || h.type !== "number");
  const days = [...Array(7)].map((_, i) => monday.clone().add(i, "day"));
  const end = M.min(days[6], today);
  const prevMon = monday.clone().subtract(7, "day");
  const prevSun = monday.clone().subtract(1, "day");
  const isThisWeek = monday.isSame(today.clone().startOf("isoWeek"));
  const wrap = parent.createDiv({ cls: "hb-gridwrap" });
  const g = wrap.createDiv({ cls: "hb-wk" });
  g.createDiv({ cls: "hb-wk-h" });
  for (const d of days) g.createDiv({ cls: "hb-wk-h" + (d.isSame(today) ? " hb-now" : ""), text: d.format("dd").charAt(0) });
  for (const x of ["Rate", "Δ wk", "Streak"]) g.createDiv({ cls: "hb-wk-h", text: x });
  const rows = [
    { label: "✅ Minimum day", st: mState, cls: "hb-minrow" },
    ...list.map((h, i) => ({
      label: `${h.icon} ${h.name}`, st: hState(h), h,
      cls: !h.min && (i === 0 || list[i - 1].min) ? "hb-sep" : "",
    })),
  ];
  for (const r of rows) {
    const c = (cls, text) => g.createDiv({ cls: cls + (r.cls ? " " + r.cls : ""), text });
    c("hb-wk-label", r.label).setAttr("title", r.label);
    for (const d of days) {
      const s = r.st(d);
      const cell = c("hb-wk-cell");
      cell.createSpan({ cls: "hb-sq hb-" + s, text: CELL[s] });
      let tip = d.format("ddd D MMM");
      if (r.h && r.h.type === "number") tip += ` · ${fmtNum(r.h, num(val(key(d), r.h)))} (${goalText(r.h)})`;
      cell.setAttr("title", tip);
      if (clickable && r.h && r.h.type !== "number" && s !== "future" && s !== "none") {
        cell.addClass("hb-click");
        cell.addEventListener("click", () => toggle(key(d), r.h));
      }
    }
    const a = rate(r.st, monday, end);
    const b = rate(r.st, prevMon, prevSun);
    const rc = c("hb-wk-stat");
    rc.createSpan({
      cls: "hb-rate " + (a === null ? "" : a >= 0.8 ? "hb-r-good" : a >= 0.5 ? "hb-r-mid" : "hb-r-bad"),
      text: pct(a),
    });
    const diff = a === null || b === null ? null : Math.round((a - b) * 100);
    c("hb-wk-stat hb-delta " + (diff > 0 ? "hb-up" : diff < 0 ? "hb-down" : ""),
      diff === null ? "—" : (diff > 0 ? "+" : diff < 0 ? "−" : "±") + Math.abs(diff) + "%");
    c("hb-wk-stat hb-streak", isThisWeek ? streakOf(r.st) + "d" : "");
  }
}

function numberBars(parent, h, monday) {
  const box = parent.createDiv({ cls: "hb-card hb-bars" });
  box.createDiv({ cls: "hb-sub", text: `${h.icon} ${h.name}` + (h.unit ? ` (${h.unit})` : "") });
  const week = (m) => [...Array(7)].map((_, i) => m.clone().add(i, "day"));
  const days = week(monday);
  const vals = days.map((d) => num(val(key(d), h)));
  const prev = week(monday.clone().subtract(7, "day")).map((d) => num(val(key(d), h))).filter((v) => v !== null);
  const max = Math.max(h.goal * 1.5, ...vals.filter((v) => v !== null));
  days.forEach((d, i) => {
    const row = box.createDiv({ cls: "hb-bar-row" });
    row.createSpan({ cls: "hb-faint", text: d.format("dd").charAt(0) });
    row.createSpan({ text: vals[i] === null ? "" : fmtNum(h, vals[i]) });
    const track = row.createDiv({ cls: "hb-track" });
    if (vals[i] !== null)
      track.createDiv({
        cls: "hb-bar " + (done(key(d), h) ? "hb-bar-ok" : "hb-bar-bad"),
        attr: { style: `width:${Math.max(3, (vals[i] / max) * 100)}%` },
      });
  });
  const known = vals.filter((v) => v !== null);
  const avg = (a) => (a.length ? fmtNum(h, a.reduce((x, y) => x + y, 0) / a.length) : "—");
  box.createDiv({ cls: "hb-faint hb-bar-foot", text: `avg ${avg(known)} · last week ${avg(prev)} · goal ${goalText(h)}` });
}

function panels(parent, monday, clickable, full = true) {
  const p = parent.createDiv({ cls: "hb-panels" });
  weekGrid(p, monday, clickable, full);
  if (!full) return;
  const side = p.createDiv({ cls: "hb-side" });
  for (const h of HABITS.filter((x) => x.type === "number")) numberBars(side, h, monday);
}

function heatmap(parent) {
  const weeks = 20;
  const card = parent.createDiv({ cls: "hb-card" });
  card.createDiv({ cls: "hb-sub", text: `🗓️ Last ${weeks} weeks · darker = more of your minimum habits` });
  const grid = card.createDiv({ cls: "hb-heat" });
  const first = today.clone().startOf("isoWeek").subtract(weeks - 1, "week");
  for (let i = 0; i < weeks * 7; i++) {
    const d = first.clone().add(i, "day");
    const k = key(d);
    let cls = "hb-h";
    if (d.isAfter(today)) cls += " hb-h-future";
    else if (d.isBefore(startM) || !pages.has(k)) cls += d.isBefore(startM) || d.isSame(today) ? " hb-h-none" : " hb-h-l0";
    else { const t = minFor(k).length; cls += t ? " hb-h-l" + Math.round((minDone(k) / t) * 4) : " hb-h-none"; }
    if (d.isSame(today)) cls += " hb-h-today";
    grid.createDiv({ cls, attr: { title: `${d.format("ddd D MMM")} · ${d.isBefore(startM) ? "not tracked" : minDone(k) + "/" + minFor(k).length}` } });
  }
  const legend = card.createDiv({ cls: "hb-legend hb-faint" });
  legend.createSpan({ text: "missed " });
  for (const l of [0, 1, 2, 3, 4]) legend.createDiv({ cls: "hb-h hb-h-l" + l });
  legend.createSpan({ text: " ✅" });
}

function allTimeTable(parent) {
  const card = parent.createDiv({ cls: "hb-card" });
  const tracked = Math.max(0, today.diff(startM, "days") + 1);
  let hits = 0;
  for (const d = startM.clone(); !d.isAfter(today); d.add(1, "day")) if (mState(d) === "done") hits++;
  card.createDiv({ cls: "hb-sub", text: `📈 Since ${startM.format("D MMM YYYY")} · ✅ ${hits} minimum days out of ${tracked}` });
  const t = card.createEl("table", { cls: "hb-grid hb-alltime" });
  const hr = t.createEl("thead").createEl("tr");
  for (const x of ["", "All time", "Streak", "Best"]) hr.createEl("th", { text: x });
  const body = t.createEl("tbody");
  for (const r of [{ label: "✅ Minimum day", st: mState }, ...HABITS.map((h) => ({ label: `${h.icon} ${h.name}`, st: hState(h) }))]) {
    const tr = body.createEl("tr");
    tr.createEl("td", { cls: "hb-label", text: r.label });
    tr.createEl("td", { text: pct(rate(r.st, startM, today)) });
    tr.createEl("td", { text: streakOf(r.st) + "d" });
    tr.createEl("td", { text: bestOf(r.st) + "d" });
  }
}

// Weekly note → Monday of the week it reviews (saved as `week_of` the first time, so it never shifts)
async function reviewMonday() {
  const p = here;
  const raw = p && p.week_of;
  if (raw) {
    const s = typeof raw.toISODate === "function" ? raw.toISODate() : String(raw).slice(0, 10);
    const m = M(s, "YYYY-MM-DD", true);
    if (m.isValid()) return m.startOf("isoWeek");
  }
  const thisMon = today.clone().startOf("isoWeek");
  const parsed = p ? M(p.file.name, "gggg-[W]ww", true) : M.invalid();
  let m = parsed.isValid() ? parsed.add(3, "day").startOf("isoWeek") : thisMon.clone();
  if (m.isAfter(thisMon)) m.subtract(7, "day");
  if (p && !inTemplates && p.file.path.startsWith(WEEKLY)) {
    const f = app.vault.getAbstractFileByPath(p.file.path);
    if (f) app.fileManager.processFrontMatter(f, (fm) => { fm.week_of = key(m); }).catch(console.error);
  }
  return m;
}

function weightTrend(parent) {
  const rows = dv.pages(`"${WEEKLY}"`)
    .where((p) => num(p.weight) !== null)
    .sort((p) => (p.week_of ? String(p.week_of) : p.file.name))
    .array()
    .slice(-8);
  if (!rows.length) return;
  const card = parent.createDiv({ cls: "hb-card" });
  const w = rows.map((p) => num(p.weight));
  const diff = Math.round((w[w.length - 1] - w[0]) * 10) / 10;
  card.createDiv({ cls: "hb-sub", text: "⚖️ Weight (Sunday weigh-ins)" });
  card.createDiv({
    cls: "hb-weight",
    text: w.join(" → ") + " kg" + (w.length > 1 ? `   (${diff >= 0 ? "+" : "−"}${Math.abs(diff)} kg)` : ""),
  });
}

function weekSummary(parent, monday) {
  const end = M.min(monday.clone().add(6, "day"), today);
  let hits = 0, days = 0;
  for (const d = monday.clone(); !d.isAfter(end); d.add(1, "day")) {
    const s = mState(d);
    if (s === "done") hits++;
    if (s === "done" || s === "miss") days++;
  }
  const rated = HABITS.map((h) => ({ h, r: rate(hState(h), monday, end) })).filter((x) => x.r !== null);
  rated.sort((a, b) => b.r - a.r);
  const card = parent.createDiv({ cls: "hb-card hb-status" });
  card.createDiv({ cls: "hb-date", text: `Week of ${monday.format("D MMM")} – ${monday.clone().add(6, "day").format("D MMM")}` });
  card.createDiv({ cls: "hb-big" + (days && hits === days ? " hb-good" : ""), text: `✅ ${hits}/${days || 0} minimum days` });
  if (rated.length > 1) {
    const best = rated[0], worst = rated[rated.length - 1];
    card.createDiv({
      cls: "hb-faint",
      text: `💪 Best: ${best.h.icon} ${best.h.name} (${pct(best.r)}) · 🌱 Needs love: ${worst.h.icon} ${worst.h.name} (${pct(worst.r)})`,
    });
  }
}

// ───────────────────────── render ─────────────────────────
let busy = false;
function setupHints() {
  for (const p of loaded.problems) root.createDiv({ cls: "hb-warn", text: "✏️ " + p });
  if (HABITS.length) return true;
  const c = root.createDiv({ cls: "hb-card hb-status" });
  c.createDiv({ cls: "hb-big", text: "🔁 No habits yet" });
  const t = c.createDiv({ cls: "hb-faint" });
  t.createSpan({ text: "Add your habits to the ✏️ My habits table on the " });
  const a = t.createEl("a", { text: "🔁 Habits", cls: "internal-link" });
  a.addEventListener("click", (e) => { e.preventDefault(); app.workspace.openLinkText(HABITS_PAGE, "", false); });
  t.createSpan({ text: " page. They show up here right away." });
  return false;
}
async function render() {
  if (!setupHints()) return;
  if (mode === "home") {
    // Minimal: status, warning, Top 3, week grid (tick by clicking a square). Numbers + extras live on 🔁 Habits.
    const k = key(today);
    statusCard(root, k, true);
    neverMissTwice(root);
    await topThree(root, k);
    panels(root, today.clone().startOf("isoWeek"), true, false);
  } else if (mode === "today") {
    if (inTemplates || !here || !/^\d{4}-\d{2}-\d{2}$/.test(here.file.name)) {
      root.createDiv({ cls: "hb-faint", text: "🔁 The habit tracker shows here in each daily note (YYYY-MM-DD)." });
      return;
    }
    const k = here.file.name;
    statusCard(root, k, k === key(today));
    if (k === key(today)) neverMissTwice(root);
    chips(root, k, MIN, "Minimum");
    chips(root, k, HABITS.filter((h) => !h.min), "Bonus");
    await topThree(root, k);
  } else if (mode === "week") {
    if (inTemplates) {
      root.createDiv({ cls: "hb-faint", text: "🔁 The week's habit grid shows here in each weekly note." });
      return;
    }
    const monday = await reviewMonday();
    weekSummary(root, monday);
    panels(root, monday, true);
    weightTrend(root);
  } else if (mode === "habits") {
    const k = key(today);
    statusCard(root, k, true);
    neverMissTwice(root);
    chips(root, k, MIN, "Minimum");
    chips(root, k, HABITS.filter((h) => !h.min), "Bonus");
    root.createDiv({ cls: "hb-h2", text: "📅 This week" });
    panels(root, today.clone().startOf("isoWeek"), true, true);
    root.createDiv({ cls: "hb-h2", text: "📈 Long run" });
    heatmap(root);
    allTimeTable(root);
    weightTrend(root);
  }
}
async function rerender() {
  if (busy) return;
  busy = true;
  try { root.empty(); await render(); } finally { busy = false; }
}
await rerender();
