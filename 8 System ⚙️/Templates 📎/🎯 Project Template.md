<%*
const name = await tp.system.prompt("Name (tip: end it with an emoji)", "", true);
if (name) {
  const folder = "3 Projects 🎯/" + name;
  try { await app.vault.createFolder(folder); } catch (e) {}
  await tp.file.move(folder + "/" + name);
}
-%>
---
cssclasses:
  - wide
categories:
  - "[[🎯 Projects]]"
icon: "[[ef-folder-green.png]]"
status: 🟢 active
deadline:
---
## 🎯 Goal
What does "done" look like?

## ➡️ Next step
- [ ] <% tp.file.cursor() %>

## 📄 Notes
![[Folder Notes.base]]
