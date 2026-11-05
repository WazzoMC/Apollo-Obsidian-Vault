<%*
const fm = f => app.metadataCache.getFileCache(f)?.frontmatter || {};
const is = (f, cat) => [].concat(fm(f).categories || []).some(x => String(x).includes(cat));
const isHub = f => f && f.parent && f.parent.name === f.basename && !f.path.startsWith("8 System ⚙️/");
// ── 1. Which course? The one you're on (or the course above the module/chapter you're on), else ask ──
let course = null;
for (let dir = tp.config.active_file?.parent; dir && !course; dir = dir.parent) {
  const h = app.vault.getAbstractFileByPath(dir.path + "/" + dir.name + ".md");
  if (h && is(h, "🎓 Courses")) course = h;
}
if (!course) {
  const courses = app.vault.getMarkdownFiles().filter(f => isHub(f) && is(f, "🎓 Courses"))
    .sort((a, b) => a.basename.localeCompare(b.basename));
  course = await tp.system.suggester(courses.map(c => "🎓 " + c.basename), courses, true, "Which course is this module part of?");
}
// ── 2. Module name ──
let name = await tp.system.prompt("Module name (e.g. Learn Python for Beginners by Boot.dev)", "", true);
name = (name || "").replace(/[\\\/:*?"<>|#^\[\]]/g, "").trim();
// ── 3. Next number + same topics as the course ──
const home = course.parent.path;
const nums = app.vault.getMarkdownFiles()
  .filter(f => is(f, "🧩 Modules") && isHub(f) && f.parent.parent && f.parent.parent.path === home)
  .map(f => Number(fm(f).order) || 0);
const order = nums.length ? Math.max(...nums) + 1 : 1;
const topics = [].concat(fm(course).topics || []).map(t => '  - "' + t + '"').join("\n");
// ── 4. Create <course folder>/<module>/<module>.md ──
if (name) {
  const folder = home + "/" + name;
  let file = name, n = 2;
  while (app.vault.getAbstractFileByPath(folder + "/" + file + ".md")) { file = name + " " + n++; }
  try { await app.vault.createFolder(folder); } catch (e) {}
  await tp.file.move(folder + "/" + file);
}
-%>
---
categories:
  - "[[🧩 Modules]]"
topics:
<% topics %>
banner:
icon:
status: 🟢 active
order: <% order %>
---
> [!buttons]
> `BUTTON[mb-new-chapter]` [[<% course.basename %>|⬆️ <% course.basename %>]]

## 📑 Course Chapters
![[Course Contents.base]]

## 📄 Notes
![[Folder Notes.base]]
