<%*
// ── Ask which area(s)/project(s) this note is about ──
// courses + modules are never topics (topics = what it's about)
const isCourseLike = f => [].concat(app.metadataCache.getFileCache(f)?.frontmatter?.categories || []).some(x => /🎓 Courses|🧩 Modules/.test(String(x)));
const hubs = app.vault.getMarkdownFiles()
  .filter(f => (f.path.startsWith("3 Projects 🎯/") || f.path.startsWith("4 Areas 🌱/")) && f.parent && f.parent.name === f.basename && !isCourseLike(f))
  .sort((a, b) => a.basename.localeCompare(b.basename));
let picked = [];
while (true) {
  const left = hubs.filter(h => !picked.includes(h));
  const labels = (picked.length ? ["✅ Done"] : ["⏭️ Skip (leave it in the Inbox)"]).concat(left.map(h => h.basename));
  const values = [null].concat(left);
  const choice = await tp.system.suggester(labels, values, true,
    picked.length ? "Add another topic, or ✅ Done" : "Which area or project is this about?");
  if (!choice) break;
  picked.push(choice);
}
const topics = picked.map(h => `  - "[[${h.basename}]]"`).join("\n");
// ── Give it a name if it's still "Untitled" ──
let title = tp.file.title;
if (title.startsWith("Untitled")) {
  const t = await tp.system.prompt("Meeting name (e.g. Kickoff with Sam)", "", true);
  if (t) title = t;
}
// ── File it in the first topic's folder ──
const here = tp.file.folder(true);
const home = picked.length ? picked[0].parent.path : null;
if (home && here !== home && !here.startsWith(home + "/")) { await tp.file.move(home + "/" + title); }
else if (title !== tp.file.title) { await tp.file.rename(title); }
-%>
---
categories:
  - "[[🤝 Meetings]]"
date: <% tp.date.now("YYYY-MM-DD") %>
people:
topics:
<% topics %>
---
## 🗒️ Notes
<% tp.file.cursor() %>

## ✅ Action items
- [ ] 
