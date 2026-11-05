<%*
const fm = f => app.metadataCache.getFileCache(f)?.frontmatter || {};
const is = (f, cat) => [].concat(fm(f).categories || []).some(x => String(x).includes(cat));
const isHub = f => f && f.parent && f.parent.name === f.basename && !f.path.startsWith("8 System ⚙️/");
const isParent = f => isHub(f) && (is(f, "🧩 Modules") || is(f, "🎓 Courses"));
// ── 1. Which module (or course, like CS50)? The one you're on, or the one the chapter you're on belongs to, else ask ──
const a = tp.config.active_file;
let parent = null;
if (a && isParent(a)) parent = a;
else if (a && is(a, "📑 Course Chapters")) {
  const h = app.vault.getAbstractFileByPath(a.parent.path + "/" + a.parent.name + ".md");
  if (h && isParent(h)) parent = h;
}
if (!parent) {
  const key = f => is(f, "🧩 Modules")
    ? f.parent.parent.path + "/" + String(Number(fm(f).order) || 0).padStart(3, "0")
    : f.parent.path;
  const list = app.vault.getMarkdownFiles().filter(isParent).sort((x, y) => key(x).localeCompare(key(y)));
  const label = f => is(f, "🧩 Modules") ? "      🧩 " + f.basename : "🎓 " + f.basename;
  parent = await tp.system.suggester(list.map(label), list, true, "Which module (or course) is this chapter part of?");
}
// ── 2. Chapter name → "<chapter> – <module>" ──
let name = await tp.system.prompt("Chapter name (e.g. Introduction)", "", true);
name = (name || "").replace(/[\\\/:*?"<>|#^\[\]]/g, "").trim();
// ── 3. Next number, banner + topics copied from the module/course ──
const home = parent.parent.path;
const nums = app.vault.getMarkdownFiles()
  .filter(f => is(f, "📑 Course Chapters") && f.parent && f.parent.path === home)
  .map(f => Number(fm(f).order) || 0);
const order = nums.length ? Math.max(...nums) + 1 : 1;
const pfm = fm(parent);
const banner = pfm.banner ? JSON.stringify(String(pfm.banner)) : "";
const topics = [].concat(pfm.topics || []).map(t => '  - "' + t + '"').join("\n");
// ── 4. Save it in the module's folder ──
if (name) {
  const base = name + " – " + parent.basename;
  let file = base, n = 2;
  while (app.vault.getAbstractFileByPath(home + "/" + file + ".md")) { file = base + " " + n++; }
  await tp.file.move(home + "/" + file);
}
-%>
---
categories:
  - "[[📑 Course Chapters]]"
topics:
<% topics %>
banner: <% banner %>
status: 🟢 active
order: <% order %>
source:
---
> [!buttons]
> `BUTTON[mb-new-atomic]` [[<% parent.basename %>|⬆️ <% parent.basename %>]]

[[<% tp.date.now("YYYY-MM-DD") %>]]

## 📝 Notes
- 

## ⚛️ Atomic notes from this chapter
![[Made From.base]]
