<%*
// ── 1. Course name ──
let name = await tp.system.prompt("Course name (tip: end it with an emoji, e.g. CS50 🎓)", "", true);
name = (name || "").replace(/[\\\/:*?"<>|#^\[\]]/g, "").trim();
// ── 2. Which area or project is it part of? (courses + modules are left out) ──
const cats = f => [].concat(app.metadataCache.getFileCache(f)?.frontmatter?.categories || []).map(String).join(" ");
const isCourseLike = f => /🎓 Courses|🧩 Modules/.test(cats(f));
const hubs = app.vault.getMarkdownFiles()
  .filter(f => (f.path.startsWith("3 Projects 🎯/") || f.path.startsWith("4 Areas 🌱/")) && f.parent && f.parent.name === f.basename && !isCourseLike(f))
  .sort((a, b) => a.basename.localeCompare(b.basename));
const label = h => (h.path.startsWith("3 Projects 🎯/") ? "🎯 " : "🌱 ") + h.basename;
const hub = await tp.system.suggester(hubs.map(label), hubs, true, "Which area or project is this course part of?");
// ── 3. Create <hub folder>/<course>/<course>.md and move the note there ──
if (name && hub) {
  const folder = hub.parent.path + "/" + name;
  let file = name, n = 2;
  while (app.vault.getAbstractFileByPath(folder + "/" + file + ".md")) { file = name + " " + n++; }
  try { await app.vault.createFolder(folder); } catch (e) {}
  await tp.file.move(folder + "/" + file);
}
-%>
---
categories:
  - "[[🎓 Courses]]"
topics:
<% hub ? '  - "[[' + hub.basename + ']]"' : "" %>
banner:
icon: "[[ef-notebook.png]]"
status: 🟢 active
deadline:
source:
---
> [!buttons]
> `BUTTON[mb-new-module]` `BUTTON[mb-new-chapter]`

## 🧩 Contents
![[Course Contents.base]]

## 📄 Notes
![[Folder Notes.base]]
