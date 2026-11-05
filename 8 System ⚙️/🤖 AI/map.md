---
cssclasses:
  - wide
---
# 🗺️ map.md: how the vault is built

_Last updated: 2026-11-05 (Apollo template: import.md recipe for old vaults, habits read from the ✏️ My habits table, Clippings moved to 8 System, book folders merged, ☀️ Today button via Meta Bind). AI: update this (and the date) in the same turn as any structural change (see CLAUDE.md → 🔄)._

## 1. Folders (1–9, numbered so they always sort in order)
| Folder | What lives there |
|---|---|
| `1 Inbox 📥` | New notes land here (`Cmd+N`, Templater, Meta Bind buttons). Sorted weekly |
| `2 Journal ☁️` | `Daily ☁️` (`YYYY-MM-DD`, habit tracker) and `Weekly 🗓️` (`gggg-[W]ww` via the Calendar plugin, weekly review) |
| `3 Projects 🎯` | Things with a finish line. One folder per project with a **hub note of the same name** |
| `4 Areas 🌱` | Ongoing areas, same hub-note pattern. Source, Atomic and Writing notes live **inside the area/project they're about** (no Library folder) |
| `5 Evergreen 🌲` | Flat. The owner's own ideas; title = the idea |
| `6 Bookshelf 📖` | `Books & Manga 📚🗯️`, `Movies, Shows & Anime 🎬`, `Games 🎮`, plus the `Bookshelf 📖` note |
| `7 People 👥` | One note per person/organisation |
| `8 System ⚙️` | `MOC ⚙️` (`🔁 Habits`), `Templates 📎`, `Attachments 📎` (`Banners 🖼️`, `Icons 🗂️`), `Bases 🗃️`, `Categories 🗂️`, `Scripts 🧩` (`habits/view.js` + `view.css`), `Clippings 📰` (Web Clipper target), `🤖 AI` (these files + `import.md`, the recipe for importing an old vault), `📌 How this vault works.md` |
| `9 Archive 📦` | Finished projects and old stuff |
| root | `🏠 Home.md` (opens on startup), `🚀 Start Here.md` (first-run setup), `CLAUDE.md`, `README.md` (GitHub) |

Sample content shipped with the template: project `Startup Club 🚀` (with `Startup School 🚀` source notes), areas `Coding 💻` (with the `Boot.Dev Backend-Path ⚙️` course → 1 module → 2 chapters), `Productivity 🧠` (incl. `Routines 📆/My Daily Routine`, linked from Home), `Python 🐍` (`home: no`), a few evergreen notes, 3 people, and some books/manga/movies/anime/games.

## 2. Note model: three questions, three answers
| Property | Question | Example |
|---|---|---|
| `categories` | What **kind** of note? (Kepano-style, link to a category page) | `[[⚛️ Atomic]]` |
| `topics` | What is it **about**? (links to area/project hubs, several allowed) | `[[Coding 💻]]`, `[[Productivity 🧠]]` |
| folder | Where does it **live**? (one home = first topic) | `4 Areas 🌱/Coding 💻` |

A hub page lists a note if it is **in its folder**, **links to the hub**, or **has the hub in `topics`** (`Folder Notes.base`, using `this.file`).

### Categories (pages in `8 System ⚙️/Categories 🗂️`, sorted by `order`)
1 🎯 Projects · 2 🌱 Areas · 3 🤝 Meetings · 4 👥 People · 5 🌲 Evergreen · 6 ⚛️ Atomic · 7 ✍️ Writing · 8 📚 Sources · 9 📰 Clippings · 10 🎓 Courses · 11 🧩 Modules · 12 📑 Course Chapters · 13 📖 Books · 14 🎬 Movies & Shows · 15 🍥 Anime · 16 🗯️ Manga · 17 🎮 Games

### Property values (keep these lists short)
- Projects/courses `status`: `🟢 active` · `⏸️ paused` · `✅ done`; plus `deadline`, `icon` (folder tile), `cssclasses: wide`. Courses also have `banner`, `source`
- 🧩 Modules: `topics` (copied from course), `banner`, `icon`, `status`, `order` (auto). 📑 Course Chapters: `topics` + `banner` (copied at creation), `status`, `order` (auto), `source`
- Atomic notes made from a chapter: `from` (multitext, link to the chapter)
- Areas: `home` (`yes` = on Home, `no` = Areas page only), `cover` (card), `banner` (header), `cssclasses: wide`
- Shelf media `status`: `🔖 want` · `▶️ on it` · `✅ done` · `❌ dropped`; `rating` 1–5; `cover`; movies/anime: `series`, `order`, `format` (Movie/TV), `director`, `creator`; books/manga: `author`, `series`; games: `developer`, `platform`, `released`
- Writing: `kind` (`essay` · `script` · `article` · `other`), `stage` (`💡 idea` · `✏️ draft` · `🔁 revising` · `✅ final`)
- Meetings: `date`, `people`, `topics`
- Daily notes: one property per habit, written by the tracker (keys come from the ✏️ My habits table, see §8)
- Weekly notes: `week_of` (Monday of the reviewed week, filled automatically on first open)
- Category pages: `order`

## 2b. 🎓 Course system
- Hierarchy lives in **folders**: `<area>/<Course>/<Course>.md` → `<Course>/<Module>/<Module>.md` → chapters inside the module folder (or directly in the course folder if there are no modules). Chapter names: `<chapter> – <module or course>`.
- **`topics` never holds a course or module** (pickers in Course/Source/Atomic/Writing/Evergreen templates filter out 🎓/🧩 hubs). Topics = subject (`Coding 💻`, `Python 🐍`).
- Templates use `tp.config.active_file` (the note you were on when Templater started) to skip pickers: Module finds the course above, Course Chapter uses the module/course you're on, Atomic detects a chapter → starts with its topics, saves next to it, adds `from`.
- Buttons = Meta Bind **button templates** in `.obsidian/plugins/obsidian-meta-bind-plugin/data.json`: `mb-today` (command `daily-notes`, used on Home), `mb-new-module`, `mb-new-chapter`, `mb-new-atomic` (`templaterCreateNote` into `1 Inbox 📥`; the template moves the note). Used inline as `` `BUTTON[id]` `` inside a `[!buttons]` callout.

## 3. Bases (`8 System ⚙️/Bases 🗃️`)
- One per category (Projects, Areas, Meetings, People, Evergreen, Atomic, Writing, Sources, Clippings, Courses, Modules, Course Chapters, Books, Movies & Shows, Anime, Manga, Games). All exclude the Templates folder. `Clippings.base` also includes everything in `8 System ⚙️/Clippings 📰` (Web Clipper notes have no `categories` by default).
- **Folder Notes.base**: embedded in every hub. Tabs Notes · 📚 Sources · 🎬 Videos · ⚛️ Atomic · ✍️ Writing · 🌲 Evergreen · Recent. **🎬 Videos** = 16:9 cards of notes whose `source` is a YouTube link; formulas `ytid` (11-char ID from `youtu.be/ID` or `…v=ID`) and `thumb` (`https://img.youtube.com/vi/<ID>/hqdefault.jpg`) feed `image: formula.thumb`.
- **Now.base** (`status == 🟢 active` → folder-icon tiles on Home; skips Templates, Archive, modules and chapters), **Areas.base** (all areas, cover cards), **Home Areas.base** (`home == "yes"`), **On My Shelf.base** (`▶️ on it` across all media), **Course Contents.base** (modules/chapters inside, sorted by `order`), **Made From.base** (on chapters: `list(from).contains(this)`), **Categories.base**, **Quick Views.base** (Inbox, Recent), **Backlinks.base** (people/games/daily), **Related.base** (evergreen).
- Shelf bases sort by **status first**; Books/Manga then author → series → year; Movies/Anime then series → order → maker → release date; Games then developer → date. Card views use `cardSize: 150`. Cards show title · maker · `formula.shelf` (status + yellow ★ via `html()` + `.shelf-stars`).

## 4. Templates (`8 System ⚙️/Templates 📎`), all named "<emoji> <Name> Template"
Daily, Weekly, Project, Area, Course, Module, Course Chapter, Source, Atomic, Writing, Evergreen, Meeting, Person, Book, Movie or Show, Anime, Manga, Game, Game Guide.
- **Project/Area** ask for a name, create the folder + hub and move the note there. **Course** asks for a name + an area/project and creates `<hub folder>/<course>/<course>.md` with `topics` set.
- **Source/Atomic/Writing/Evergreen** run a **picker** (areas/projects; Source/Atomic also list 🎮 games) → `topics`. Source/Atomic/Writing move the note into the first pick's folder **unless it's already inside it**. Evergreen always moves to `5 Evergreen 🌲`. All ask for a title if "Untitled". Writing also asks the `kind`.
- **Daily** = tracker (`mode: "today"`) + 🌙 Tomorrow's Top 3 (numbered list; parsed by view.js under any heading containing "tomorrow") + Notes + To-do + Backlinks. No habit properties: the tracker adds them on first tick. **Weekly** = tracker (`mode: "week"`) + review + reset checklist.
- **Templater folder templates** (exact paths): `5 Evergreen 🌲`, `6 Bookshelf 📖/Books & Manga 📚🗯️`, `6 Bookshelf 📖/Movies, Shows & Anime 🎬`, `6 Bookshelf 📖/Games 🎮`, `7 People 👥`. ⚠️ Exact paths break when folders are renamed.
- Core "Templates" plugin is **off** (it pasted Templater code raw). Hotkeys: new note from template = `Cmd+Option+Shift+N` and `Cmd+Option+N`; insert template = `Cmd+Option+T`.

## 5. Look & CSS
- Theme **Minimal** (default) + Minimal Settings + Style Settings. Also installed: **Omarchy**, **Shiba Inu**. Minimal schemes: light `minimal-everforest-light`, dark `minimal-default-dark`.
- **Accent plumbing** (top of `bookshelf.css`): `--ui-accent-a: var(--accent-h), var(--accent-s), var(--accent-l)` and `--ui-accent: hsl(var(--ui-accent-a))` on `body`. Minimal Settings redefines `--accent-h/s/l` per scheme and mode, so every pill, rim, glow and arrow recolours itself. **Deliberately fixed:** `--stream-glow` (Crunchyroll orange / Netflix red), `--game-glow` (neon purple), and the habit tracker's red/green in `view.css`.
- Snippets: `bookshelf.css` (all custom looks) and `wide-page.css`.
- Labels (full table in the guide → 🎨 Look and themes): callouts `[!tiles]`, `[!gallery]`, `[!bookshelf]`, `[!buttons]`, `[!more]`; cssclasses `bookshelf`, `gameshelf`, `mangashelf`, `animeshelf`, `movieshelf`, `postershelf`, `dashboard`, `wide`/`max`.
- Home: `cssclasses: [dashboard, max]`, banner, `[!buttons]` (☀️ Today · 📖 Bookshelf · 🔁 Habits · 📆 Routine · 📌 Vault Guide · 🚀 Start Here), habit tracker (`mode: "home"`), 🎯 Projects Now tiles, 🌱 Home Areas gallery, `[!more]` → 🌱 Areas, 📖 On my shelf, 🗂️ Categories, ⚡ Quick views.
- Folder icons in `Attachments 📎/Icons 🗂️`: `ef-folder-<green|aqua|blue|purple|red|orange|yellow>.png`, `folder-<purple|orange|pink|green|blue|yellow|red>.png`, `ef-notebook.png` / `notebook.png` for courses.

## 6. Plugins & settings
Templater · Meta Bind (needs Obsidian ≥ 1.13.1) · Dataview (*Enable JavaScript queries* on; only the habit tracker uses it) · Homepage (opens 🏠 Home in Reading view, refreshes Dataview) · Simple Banner (`banner`; icon feature off) · Book Search + Covers (note template lives in its settings, `noteFolder` = `Books & Manga 📚🗯️`) · Movie Search (TMDB key; saves to `Movies, Shows & Anime 🎬`) · IGDB Game Search (Twitch Client ID + Secret; box-art `coverLargeUrl`) · Calendar (weekly notes) · Omnisearch (`Cmd+O`) · Force note view mode (`2 Journal ☁️` opens in Reading view) · Git (manual only, all auto-intervals 0) · Better Word Count · Image Toolkit (desktop only) · Minimal Settings · Style Settings.
- Obsidian: default view **Reading**, new notes → `1 Inbox 📥`, attachments → `8 System ⚙️/Attachments 📎`.
- **API keys ship empty.** Each owner adds their own (guide → 🔑). Never store keys in notes.
- Per device (not saved in the vault): Templater **Trigger on new file creation**.

## 7. Known gotchas
- Plugins rewrite their `data.json` when the owner saves settings. Re-read it after they change plugin settings.
- Embedding a single base view with `![[X.base#View]]` doesn't work. Make a separate small base instead.
- Bases card covers only round at the top. Round the **card** (`.bases-cards-item` + `overflow:hidden`), not the cover.
- Callout wrappers clip shadows/hover. Add `overflow: visible` + padding on `.bases-cards-group`.
- Same-name notes (template vs category) make links open the wrong one, hence the "Template" suffix rule.
- Simple Banner's default `icon` property clashes with the folder-tile `icon`. If its icon feature is ever re-enabled, rename the property (e.g. `bannerIcon`).
- Reading view washes out cards inside callouts (callout `mix-blend-mode` + Minimal's dark-mode image dimming). Fixed in bookshelf.css.
- The week grid is a **CSS grid** (`.hb-wk`), not a `<table>`: Minimal's table rules made it overflow. view.css also overrides Minimal's `div:has(table)` margin for `div:has(.hb)`.
- Weekly note names depend on the locale's first weekday, so the tracker saves the reviewed week as `week_of`. Wrong week? Fix `week_of` by hand.
- `obsidian://daily?vault=<name>` links break when the vault is renamed or downloaded. Use the Meta Bind `mb-today` button.
- `tp.file.cursor()` is left as literal text when a note opens in Reading view (Meta Bind `templaterCreateNote` buttons do that). Templates launched by buttons have no cursor marker.
- Mac `Option+N` types "~". Use `Cmd+Option` combos.
- ⚠️ **Obsidian Sync:** a new device with Restricted mode ON can sync an empty `community-plugins.json` and disable plugins everywhere. Turn Restricted mode off and set Sync toggles before the first sync. `Sync all other types` must be ON (view.js/view.css aren't Obsidian file types). Files over 5 MB don't sync.
- Rewriting a note's frontmatter via script resets its modified date (Recent tabs reorder). Save and restore mtimes (`os.utime`) after bulk edits.

## 8. 🔁 Habit tracker
- One Dataview view: `8 System ⚙️/Scripts 🧩/habits/view.js` (+ `view.css`, loaded automatically).
- **Habits come from the `## ✏️ My habits` table on `8 System ⚙️/MOC ⚙️/🔁 Habits.md`** (`HABITS_PAGE`), parsed on every render. Columns matched by name: **Habit** (emoji = icon), **Property** (daily-note key; optional, else slug of the name; reserved keys refused, duplicates flagged), **Goal** (`≥ 6000`, `≤ 3h`, `5 km`, `at least 8`, `max 2h` → number habit with `better: more|less` and a unit; empty = checkbox), **Days** (`Mon Wed Fri`, `Mon-Fri`, `weekdays`, `weekends`; empty = daily), **Minimum** (✅ → Minimum Day; none marked → all count). Problems show as ✏️ warnings at the top; no habits → a "No habits yet" card.
- Modes: `home` (status + streak, warning, Today's Top 3, week grid without number habits), `today` (daily note: chips + Top 3), `week` (weekly note: summary + grid + number bars), `habits` (chips, week grid + bars, 20-week heatmap, all-time table).
- Minimum Day counts only the minimum habits scheduled that day; a day with none scheduled is "off" (🌴 rest day).
- Tapping a chip writes the daily note's frontmatter (`processFrontMatter`) and creates the note from the Daily Template if missing. Week-grid squares are clickable for checkbox habits.
- Tracking starts at the first daily note with any habit property; older days never count as misses.
- Hidden extra: `weightTrend()` shows a weight line if weekly notes have a `weight` number.
