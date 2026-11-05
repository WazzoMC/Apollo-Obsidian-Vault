---
cssclasses:
  - wide
---
# 🛠️ skills.md: recipes for common changes

_AI: when you learn a new way to do something, or a trick fails, add or fix the recipe here (see CLAUDE.md → 🔄)._

Each recipe ends with **"update docs"**: the guide (`📌 How this vault works`) plus map.md / rules.md as relevant (see rules.md 1–5).

## Import an old vault
Follow `import.md` (one go by default; "plan first" if the owner asks). Copy in, never move the original; log every action in `📦 Import log.md`; leave unsure notes in `1 Inbox 📥/📦 Import`.

## Change, add or remove a habit
1. Edit the `## ✏️ My habits` table on `8 System ⚙️/MOC ⚙️/🔁 Habits.md`: one row per habit (Habit · Property · Goal · Days · Minimum). No code, no template change needed.
2. Never change an existing **Property** without warning the owner: old daily notes keep the old key, so history stops counting. Renaming the **Habit** text is safe.
3. Optional: add the new key to `.obsidian/types.json` (`checkbox` or `number`) so the property shows the right widget. Obsidian infers it otherwise.
4. Update docs only if the table format itself changes.
5. Test `view.js` changes outside Obsidian: run it in node with `moment` and a fake `dv` (`container` with createDiv/createEl/createSpan/setAttr/addClass/addEventListener/empty, `pages()`, `current()`, `app.vault` with `getAbstractFileByPath`/`cachedRead`/`read`/`create`, `app.fileManager.processFrontMatter`) for all 4 modes, then ask for a screenshot.

## Add a new note type (category)
1. Pick an emoji name, e.g. `🎙️ Podcasts`, and an `order` slot. Shift every category page with `order >= slot` up by 1.
2. Create `8 System ⚙️/Categories 🗂️/<name>.md` with `order:` (+ `cssclasses`) and `![[<Base>.base]]`.
3. Create `8 System ⚙️/Bases 🗃️/<Base>.base`: filter `categories.contains(link("<name>"))` + `'!file.inFolder("8 System ⚙️/Templates 📎")'`.
4. Create `<emoji> <Name> Template.md` with `categories:` pre-filled (copy the picker block from `⚛️ Atomic Template` if it belongs to areas/projects). Add it to Templater `enabled_templates_hotkeys`.
5. Add any new properties to `.obsidian/types.json`.
6. If it belongs to areas/projects, add a tab to `Folder Notes.base`.
7. Update docs: note types table, "Where does a note go?", property cheat sheet, category order in map.md.

## Add a new bookshelf media type
1. Folder in `6 Bookshelf 📖` (or reuse one), plus a category page with `cssclasses: [max, bookshelf, <shelf-class>]`.
2. Base: copy `Books.base` (author/series) or `Movies & Shows.base` (director/creator/format). Change the category filter. Keep **status-first sort**, `cardSize: 150`, `formula.shelf`.
3. Template + Templater folder rule. Add the category to the `or:` list in `On My Shelf.base`, and a button in `Bookshelf 📖.md`'s `[!buttons]` row.
4. Optional own look: new section in `bookshelf.css` scoped to `.bookshelf.<shelf-class>`. Record it in the guide's Style labels.
5. Update docs (📖 Bookshelf section).

## Add an area or project
- Normally: `Cmd+Option+Shift+N` → `🌱 Area Template` / `🎯 Project Template` → type the name (it creates the folder + hub).
- By hand: folder `4 Areas 🌱/<Name>/` + hub `<Name>.md` with `categories`, `cssclasses: [wide]`, `home: yes|no`, `cover`, `banner` (areas) or `status`, `deadline`, `icon` (projects), and `## 📄 Notes` + `![[Folder Notes.base]]`.

## Add a course / module / chapter
- Course: `Cmd+Option+Shift+N` → `🎓 Course Template` → name → pick the area/project. Same name already there → `<name> 2`.
- Module / chapter / atomic: the Meta Bind buttons on the course/module/chapter page, or the templates. See map.md 2b.
- Test template changes outside Obsidian: dump the vault's frontmatter to JSON with python, run the `<%* %>` block in node with a fake `tp`/`app` (`getMarkdownFiles`, `getAbstractFileByPath`, `metadataCache.getFileCache`, `tp.config.active_file`), render the `<% %>` tags, and yaml-parse the result.

## Add a Meta Bind button
Add an object to `buttonTemplates` in `.obsidian/plugins/obsidian-meta-bind-plugin/data.json` (e.g. `{"id": "mb-x", "label": "➕ X", "style": "default", "actions": [{"type": "command", "command": "<command-id>"}]}` or a `templaterCreateNote` action), restart Obsidian, and use `` `BUTTON[mb-x]` `` inside a `[!buttons]` callout (it gets the pill look).

## Add a writing kind or stage
- Kind: edit **both** arrays on the `suggester` line in `✍️ Writing Template`.
- Stage: just use it. For its own tab, add a view to `Writing.base`.
- Update docs (property cheat sheet).

## Add or change a CSS look
1. Back up `bookshelf.css` first if the change is risky.
2. Append a commented section. Scope it with a cssclass (`.bookshelf.<x>`) or a callout (`.callout[data-callout="<x>"]`). Hide callout chrome: `background:none; border:none; padding:0`, title `display:none`.
3. Card tips: round `.bases-cards-item` with `overflow:hidden` (not the cover). Give `.bases-cards-group` padding + `overflow: visible` so shadows don't clip. `white-space:nowrap; text-overflow:ellipsis` for long lines. Add `.theme-light` overrides.
4. **Never hard-code a colour.** Use `var(--ui-accent)` for solids and `hsla(var(--ui-accent-a), <alpha>)` for translucent rims/glows. Only fix a hex when the colour means something.
5. Record the label in the guide's Style labels table.

## Show YouTube thumbnails from a `source` link
Done in `Folder Notes.base` (tab 🎬 Videos). No plugin: formula `ytid` pulls the 11-char ID out of `youtu.be/ID` or `…v=ID` (`split` + `slice`, no regex), formula `thumb` builds `https://img.youtube.com/vi/<ID>/hqdefault.jpg`, and the cards view sets `image: formula.thumb`, `imageFit: cover`, `imageAspectRatio: 0.5625`. View filter `formula.ytid != ""` hides non-YouTube sources. To reuse, copy the two formulas + view into another base.

## Rename a top-level folder
Find-and-replace the old path across `.obsidian/*.json`, `.obsidian/plugins/*/data.json`, `*.base`, `*.md` (templates + guide), `view.js` constants and `*.canvas`. Then rename the folder. Links by name keep working. Tell the owner to restart Obsidian.

## Set up / fix a media plugin
- **Book Search + Covers**: the note template is inside its settings (`noteTemplate`) and must keep `categories`, `status`, `rating`, `series`. `noteFolder` = `6 Bookshelf 📖/Books & Manga 📚🗯️`.
- **Movie Search**: `use_default_frontmatter: false`. Custom `frontmatter`/`content` with `{{title}}`, `{{director}}`, `{{poster_path}}`, `{{backdrop_path}}`… Folder `6 Bookshelf 📖/Movies, Shows & Anime 🎬`. Needs a TMDB key.
- **IGDB Game Search**: `useDefaultFrontmatter: false`, `{{coverLargeUrl}}`, `{{developer}}`, `{{platform}}`, `{{firstReleaseDate}}`. Needs a Twitch Client ID + Secret.
- After the owner saves plugin settings, re-read `data.json`. Plugins can overwrite your fields. **Never print or copy key values.**

## Back up with Git (if the owner uses it)
- The **Git** plugin is installed, manual only (all auto-intervals 0; don't switch them on without asking). Command palette → **Git: Commit-and-sync**.
- The repo must be **private**: API keys live in plugin `data.json`.
- An AI shell usually has no GitHub credentials: it can stage and commit (with an inline identity, `git -c user.name=… -c user.email=… commit`), the owner pushes.
- Check drift any time: `git status --porcelain | wc -l`.

## Revert an experiment
Restore the `.bak` file (or `git checkout <commit> -- <path>`), delete the appended CSS section, put back `%% … %%` originals, remove the related guide rows, and confirm nothing else changed.

## Health check (run after big changes)
- Count `.md` files before/after.
- Find unresolved `[[links]]` (compare against all file basenames; ignore templates and book-author links, which are unresolved on purpose).
- `yaml.safe_load` every `.base`; `json.load` every settings file.
- No duplicate note names (templates vs categories).
