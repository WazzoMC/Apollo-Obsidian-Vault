<%*
const name = await tp.system.prompt("Name (tip: end it with an emoji)", "", true);
const showHome = (await tp.system.suggester(["🏠 Yes, show it on Home","No, only on the Areas page"], ["yes","no"], true, "Show this area on Home?")) || "no";
if (name) {
  const folder = "4 Areas 🌱/" + name;
  try { await app.vault.createFolder(folder); } catch (e) {}
  await tp.file.move(folder + "/" + name);
}
-%>
---
cssclasses:
  - wide
categories:
  - "[[🌱 Areas]]"
home: <% showHome %>
banner: "[[home.jpg]]"
cover: "[[home.jpg]]"
---
## 🎯 Now
- <% tp.file.cursor() %>

## 📄 Notes
![[Folder Notes.base]]
