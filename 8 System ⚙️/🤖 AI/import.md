---
cssclasses:
  - wide
---
# 🧳 import.md: bring an existing vault into Apollo

_For AI helpers. Use this when the owner asks you to import, sort or "Apollo-ify" old notes, or when there are notes in `1 Inbox 📥/📦 Import/`. Read `map.md` first: it has the folders, note types and property values you'll use here._

**Default mode: one go.** Sort and move everything without stopping for approval. That's safe because you only touch the imported copy, never delete or overwrite anything, and log every move so it can be undone.
**Plan-first mode:** if the owner says "plan first" or "show me before you move", do steps 1–3, write the plan into the log (§6) and wait for "go".

## 0. Before you start
1. The old notes must be a **copy** inside `1 Inbox 📥/📦 Import/`. If the owner points you at another folder or vault instead, **copy** it (never move it) into `1 Inbox 📥/📦 Import/<old vault name>/`, leaving out `.obsidian`, `.trash`, `.git`, `.DS_Store`.
2. If the vault uses Git, suggest a commit first ("so we can roll back"). Don't wait if they say go.
3. Read the templates of the types you'll create (`8 System ⚙️/Templates 📎`). New hubs must have **exactly** their frontmatter and body shape.
4. Count every file under `📦 Import` (notes and others) and write the totals at the top of the log. You'll check against them at the end.

## 1. Scan (read only)
Build a picture of the old vault before deciding anything:
- **Folder tree** with note counts. Folders usually mean something: decide per folder first, then per note.
- **Properties and tags** in use (a `status`, `type` or `tags: [lecture]` often tells you the note type).
- **Date-named notes** (journal): `2024-01-05`, `05-01-2024`, `2024-01-05 Friday`, `January 5, 2024`, `2024-W01`…
- **Attachments**: images, PDFs, audio, `.canvas`, `.excalidraw`.
- **Link style**: wikilinks by name (survive moves), path wikilinks `[[folder/note]]` and markdown links `[x](folder/note.md)` (break when moved, fix them in §4).
- **Name clashes**: imported notes with the same name as an existing Apollo note (especially `Home`, category names like `📚 Sources`, anything ending in `Template`, or the sample notes).
- **The old vault's own templates folder, scripts and settings notes**: don't sort these. Leave them in `📦 Import/_old system/`.
- Write down the unresolved links that already exist, so you only fix the ones you caused.

## 2. Decide where each thing goes
Go through these in order, and stop at the first match. When you're **not reasonably sure, leave the note where it is** in `📦 Import`. A note left for the owner beats a note filed wrong.

| It looks like… | It becomes | It goes to |
|---|---|---|
| A group of notes with a finish line or deadline (assignment, exam, thesis, launch, trip, application) | 🎯 Project hub + its notes | `3 Projects 🎯/<Name>/` |
| An ongoing subject or responsibility (University, Work, Health, Money, a hobby) | 🌱 Area hub | `4 Areas 🌱/<Name>/` |
| A class, course or subject with lectures/lessons | 🎓 Course inside the area it belongs to (create the area if needed, e.g. `University 🏫`) | `4 Areas 🌱/<Area>/<Course>/` |
| A course's parts (units, semesters with sub-lectures, big topics) | 🧩 Module, only if the old vault already grouped them like that | `<Course>/<Module>/` |
| A lecture, lesson, class session, chapter of a course | 📑 Course Chapter | inside its course (or module) |
| Notes on someone else's content (book chapter, article, video, podcast, talk, reading) | 📚 Source | inside the area/project it's about |
| A short practical fact: a definition, formula, command, setting, how-to | ⚛️ Atomic | inside the area/project/chapter it's about |
| The owner's own idea, opinion or conclusion | 🌲 Evergreen | `5 Evergreen 🌲/` (flat) |
| The owner's own writing (essay, report, draft, script, article) | ✍️ Writing (`kind`, `stage`) | inside the area/project it's for |
| Meeting notes (a date + people + notes/actions) | 🤝 Meeting | inside the area/project it's about |
| A person, creator, company | 👥 People | `7 People 👥/` |
| A book, manga, movie, show, anime or game log | 📖 Books / 🗯️ Manga / 🎬 Movies & Shows / 🍥 Anime / 🎮 Games | `6 Bookshelf 📖/Books & Manga 📚🗯️/`, `…/Movies, Shows & Anime 🎬/`, `…/Games 🎮/` |
| A daily journal note | ☀️ Daily note | `2 Journal ☁️/Daily ☁️/YYYY-MM-DD.md` |
| A weekly note | 🗓️ Weekly note | `2 Journal ☁️/Weekly 🗓️/` named like `2026-W45` (week number) |
| A saved web article | 📰 Clipping | `8 System ⚙️/Clippings 📰/` |
| Finished or clearly old material (an old semester, a done project) | Its normal type, with `status: ✅ done` | Projects: `9 Archive 📦/`. Courses and areas: keep them in place, marked done |
| An image, PDF or other attachment | Attachment | `8 System ⚙️/Attachments 📎/Imported 📦/` (keep its name) |
| Empty notes, unclear notes, anything that fits nothing | Leave it | stays in `1 Inbox 📥/📦 Import/` |

**Example: a university vault.** `Semester 3/Linear Algebra/Lecture 04.md` → Area `University 🏫`, Course `Linear Algebra 📐` (status ✅ done if the semester is over), Chapter `Lecture 04 – Linear Algebra 📐` (order 4). `Exam prep LA.md` → Project `Linear Algebra Exam 📝`, or a note inside the course if the exam is past. `Eigenvalues.md` (a definition) → ⚛️ Atomic inside the course folder. `Prof. Ionescu.md` → 👥 People.

**Hubs**
- **Reuse** an existing hub when the subject already exists (e.g. imported coding notes → the existing `Coding 💻`). Don't create `Coding 2`.
- New hub names follow the vault style: the owner's own words + one fitting emoji at the end (`Linear Algebra 📐`). Keep the owner's language.
- Hubs = `<folder>/<Name>/<Name>.md` with the template's frontmatter and body, including `![[Folder Notes.base]]` (and the `[!buttons]` + `![[Course Contents.base]]` blocks for courses/modules). Areas: `home: yes` only for the 3–4 biggest ones, else `no`. Projects: `status` from the content (`🟢 active` / `⏸️ paused` / `✅ done`), `deadline` if one is clear, `icon: "[[ef-folder-green.png]]"` (vary the colours). Areas: use `cover`/`banner` `"[[home.jpg]]"` unless the old note had images.
- Course chapters: the name pattern `<chapter> – <module or course>`, `order` from the lecture number or date, and `topics` = the course's topics (the subject area, **never the course itself**).

## 3. Properties (add, never destroy)
- Add `categories` (always) and `topics` (for Source, Atomic, Writing, Evergreen, Meeting, Course, Module, Chapter: links to the area/project hubs it's about, never a course or module).
- **Keep every existing property and tag.** Never overwrite a value that's already there. Only translate values that clash with the vault's own lists:
  - `status` on projects/courses: in progress/doing/active → `🟢 active` · on hold/paused/someday → `⏸️ paused` · done/complete/finished → `✅ done`
  - `status` on shelf media: to read/watch/want → `🔖 want` · reading/watching/playing → `▶️ on it` · read/watched/finished → `✅ done` · dropped/abandoned → `❌ dropped`
  - ratings out of 10 or 100 → `rating` 1–5 (round)
- **Don't change note bodies**, except to fix links (§4) and when merging a daily note into one that already exists (append under `## 📥 Imported`).
- Media notes: don't call the search plugins. Keep the owner's text, set `categories` + `status`, and keep any cover URL they had as `cover`.
- Preserve each file's modified date when you rewrite frontmatter (scripts: save and restore mtime).

## 4. Move
- If your tools can move notes **through Obsidian** (plugin agent tools that "update links"), use them. If you move files on disk, wikilinks by name keep working, but **path wikilinks and markdown links break**: rewrite them to the new paths (or plain `[[Name]]`) right after.
- Create folders as needed. **Never overwrite.** On a name clash, add ` (imported)` to the imported note's name and update the links inside the imported notes that pointed to it.
- Daily notes: rename to `YYYY-MM-DD`. If that day already exists, append the old note's content under `## 📥 Imported` and log it as a merge.
- **Log every action** as you go, one row each, in `1 Inbox 📥/📦 Import/📦 Import log.md` (§6). Undo works by playing the log backwards.
- Leave the `📦 Import` folder in place. Whatever wasn't moved stays there, in its original subfolders.

## 5. Check
1. **Nothing lost**: moved + merged + left in `📦 Import` = the start totals.
2. **Links**: no new unresolved links compared with §1. Fix the ones you caused.
3. **YAML**: every frontmatter you touched still parses.
4. **Hubs work**: every new hub has its base embed. Every course chapter has `order`. Daily notes match `YYYY-MM-DD`.
5. **No clash** with templates or category pages (two notes with the same name make links open the wrong one).

## 6. The log and report
Create `1 Inbox 📥/📦 Import/📦 Import log.md`:

```markdown
# 📦 Import log
Imported on YYYY-MM-DD from "<old vault name>" · start: N notes, M other files

## ✅ Summary
| | Count |
|---|---|
| New areas / projects / courses | … |
| Notes filed | … (📚 … · ⚛️ … · 🌲 … · 📑 … · ☀️ …) |
| Left in 📦 Import | … |
| Renamed because of a name clash | … |

**Have a look at:** <3–5 things the owner should check, e.g. "I guessed Statistics is finished (✅ done)", "12 untitled notes left in 📦 Import">
**Next:** open 🏠 Home · sort what's left in 📦 Import · give new areas a `cover` and projects an `icon` · fill in `me.md`

## 🧺 Left in 📦 Import (and why)
- `path/note.md`: <one-line reason>

## 🔁 Every change (newest last; undo = play it backwards)
| # | Action | From | To |
|---|---|---|---|
| 1 | create hub | | 4 Areas 🌱/University 🏫/University 🏫.md |
| 2 | move | 📦 Import/Sem 3/Linear Algebra/Lecture 04.md | 4 Areas 🌱/University 🏫/Linear Algebra 📐/Lecture 04 – Linear Algebra 📐.md |
| 3 | properties | …/Lecture 04 – Linear Algebra 📐.md | + categories, topics, order |
```

In plan-first mode, the same file holds a `## 🗺️ Plan` table (from → to → type) instead of "Every change", and you stop there.

Finish with a short chat message: what you did in 3–4 lines, what to check, and where the log is.

## 7. Undo
"Undo the import": go through the log from the last row to the first. Move each note back to its `From` path, remove the properties you added (only those), and split merged daily notes back out. Hubs you created can be **deleted only with the owner's permission** (rules.md 13): otherwise move them to `9 Archive 📦`. Then delete the log rows you undid, and check the counts again.

## 8. Afterwards
- Update `me.md` with anything you learned about how the owner works (their subjects, their naming style).
- Don't update the Vault Guide or map.md for an import: their content changed, not the vault's structure. Do it only if you added something new (a new category, a new property).
