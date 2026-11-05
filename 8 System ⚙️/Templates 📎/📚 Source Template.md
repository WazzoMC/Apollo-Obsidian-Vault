<%*
// ── Ask which area(s)/project(s) this note is about ──
// courses + modules are never topics (topics = what it's about)
const isCourseLike = f => [].concat(app.metadataCache.getFileCache(f)?.frontmatter?.categories || []).some(x => /🎓 Courses|🧩 Modules/.test(String(x)));
const hubs = app.vault.getMarkdownFiles()
  .filter(f => (f.path.startsWith("3 Projects 🎯/") || f.path.startsWith("4 Areas 🌱/")) && f.parent && f.parent.name === f.basename && !isCourseLike(f))
  .sort((a, b) => a.basename.localeCompare(b.basename));
// ── …plus my games (notes with categories: 🎮 Games) ──
const isGame = f => {
  const c = (app.metadataCache.getFileCache(f)?.frontmatter?.categories) || [];
  return [].concat(c).some(x => String(x).includes("🎮 Games"));
};
const games = app.vault.getMarkdownFiles()
  .filter(f => f.path.startsWith("6 Bookshelf 📖/Games 🎮/") && isGame(f))
  .sort((a, b) => a.basename.localeCompare(b.basename));
hubs.push(...games);
const label = h => games.includes(h) ? "🎮 " + h.basename : h.basename;
let picked = [];
while (true) {
  const left = hubs.filter(h => !picked.includes(h));
  const labels = (picked.length ? ["✅ Done"] : ["⏭️ Skip (leave it in the Inbox)"]).concat(left.map(label));
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
  const t = await tp.system.prompt("Note title", "", true);
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
  - "[[📚 Sources]]"
topics:
<% topics %>
source:
author:
---
[[<% tp.date.now("YYYY-MM-DD") %>]]

<% tp.file.cursor() %>

## 💡 Takeaways → 🌲 / ⚛️
- 
