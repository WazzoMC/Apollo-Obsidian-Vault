<%*
// Name it, then file it in 7 People 👥 (made with the shortcut, it'd otherwise stay in the Inbox)
let title = tp.file.title;
if (title.startsWith("Untitled")) {
  const t = await tp.system.prompt("Who is it? (person, creator or organisation)", "", true);
  if (t) title = t;
}
const PEOPLE = "7 People 👥";
if (tp.file.folder(true) !== PEOPLE) { await tp.file.move(PEOPLE + "/" + title); }
else if (title !== tp.file.title) { await tp.file.rename(title); }
-%>
---
categories:
  - "[[👥 People]]"
---
<% tp.file.cursor() %>

## 🔗 Mentioned in
![[Backlinks.base]]
