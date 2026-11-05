---
cssclasses:
  - wide
---
# 📏 rules.md: rules for AI helpers

Follow these on every change. If the owner agrees a new rule, add it here.

## Keeping things documented
1. **Update `📌 How this vault works`** whenever something user-facing changes: note types, templates, shortcuts, plugins, keys, property values, habits, looks. Do it without being asked.
2. **Category order changed?** Update it in map.md (the guide says how to reorder, not the full list).
3. **New CSS label** (callout or cssclass)? Add it to the guide's **🎨 Look and themes → Style labels** table.
4. **New property values** (writing kinds, stages, statuses…)? Add them to the guide's **🏷️ Property cheat sheet**.
5. **Keep the AI files current, in the same turn**:
   - new or changed **preference** → `me.md` (replace the old line)
   - **structure/settings** change → `map.md` (+ guide)
   - new **agreed rule** → `rules.md`
   - new **how-to or gotcha** → `skills.md` / map.md → Known gotchas

   Condense rather than append; delete what's no longer true.

## Naming & structure
6. **Templates** are named `<emoji> <Name> Template` and never share a name with another note (category pages especially).
7. **Folder = home, `categories` = type, `topics` = what it's about.** Topics are subjects (areas/projects), **never a course or module**: course structure lives in folders. Use few properties; reuse existing ones (`order`, `status`) before adding new. A new note type needs: category page (with `order`) + base + template (+ Templater hotkey entry) + tab in `Folder Notes.base` if it belongs to areas/projects + guide entry.
8. **Area/project pages** have the same name as their folder, plus `categories`, `cssclasses: wide` and the `Folder Notes.base` embed. Projects get `status`/`deadline`/`icon`. Areas get `home` (yes/no), `cover` and `banner`. Templates must include all of these.
9. **Bookshelf bases** sort by **status first**, then creator, then series/date, and use `cardSize: 150` on card views. New media types follow the same pattern.
10. Shelves filter by **`categories`, not folders**, so files can stay where plugins save them.
11. **Renaming a top-level folder**: update every path reference (app.json, daily-notes.json, calendar, Templater folder rules + template scripts, Meta Bind buttons, bookmarks, bases with `inFolder`, plugin `folder` settings, view.js constants, the guide, map.md).
12. **Habits live in the `✏️ My habits` table** on `🔁 Habits`, not in code. Never rename a habit's Property for the owner without warning them that old days stop counting.

## Safety
13. **Never delete without permission.** Prefer moving to `9 Archive 📦`.
14. **Back up before risky edits** (copy to `<file>.bak-<reason>`, or keep the old version in a `%% … %%` comment). When the owner says **revert**, restore exactly and remove the experiment completely (CSS, bases, guide rows). Clean up `.bak` files once a change is confirmed.
15. **Never write API keys or secrets** into notes or chat. They belong only in plugin settings.
16. After bulk edits, **verify**: note count unchanged, no new unresolved links, every `.base` parses as YAML, every settings JSON parses.
17. If the vault uses Git, suggest a commit **before** a big change.

## Working with the owner
18. **Structural changes: ask first.** **Visual changes: offer 2–4 options** (ASCII previews are fine) and let them pick.
19. "**Don't change anything yet**" means explain only.
20. **Colour comes from the theme.** New CSS uses `var(--ui-accent)` / `hsla(var(--ui-accent-a), a)`, never a hard-coded hex, unless the colour carries meaning (status red/green, brand colours).
21. **Minimal & ADHD-friendly by default**: tiny emoji value lists, templates fill properties, compact layouts, no big gaps, nothing cut off, glow rather than lifting animations, round all corners, ellipsis for long text, check light mode too.
22. **You can't see Obsidian.** Say what you couldn't verify and ask for a screenshot. Mention restarts or plugin toggles needed.
23. Explain **how** things work when asked, in plain words. Keep replies short and skimmable.
24. Edit files **in place** (read-modify-write scripts), never by retyping a whole file from memory.
