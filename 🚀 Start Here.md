---
aliases:
  - start here
  - setup
cssclasses:
  - wide
---
# 🚀 Start Here

Welcome to **Apollo**, an opinionated Obsidian vault that's already set up for you:
- **Folders** you can actually see, numbered 1–9 so they always stay in order
- **Notes that file themselves**: templates ask "what is this about?" and move the note to the right place
- A **habit tracker** on your Home page
- A **bookshelf** for books, movies, shows, anime, manga and games, with covers filled in automatically

> [!tip] ⭐ The one shortcut to remember: `Cmd+Option+Shift+N`
> (`Ctrl+Alt+Shift+N` on Windows/Linux.) **Every new note starts here**: pick what kind of note it is, pick the area or project it belongs to, done. The note files itself. You don't need `Cmd+N` or folders. See [[#⭐ How you make notes]] below.

This page gets you running in about **10 minutes**. After that, the [[📌 How this vault works|📌 Vault Guide]] explains everything in detail.

> [!warning] 🏠 Home shows code instead of a dashboard?
> That's normal before step 1. The plugins aren't switched on yet.

---

## ✅ Step 1: Switch on the plugins (2 min)
1. Open **Settings** (⚙️ bottom left, or `Cmd+,` on Mac / `Ctrl+,` on Windows).
2. Go to **Community plugins** and click **Turn on community plugins**. If Obsidian asks whether you trust the author of this vault, choose **Trust author and enable plugins**.
3. **Close Obsidian completely and open it again.**

🏠 Home should now look like a dashboard: a banner, buttons, the habit tracker and your shelves.

## ✅ Step 2: One setting per device (1 min)
Obsidian doesn't save this one inside the vault, so you set it once on **every** device (Mac, PC, phone):
- Settings → **Templater** → turn on **Trigger Templater on new file creation**

Without it, new notes show raw code like `<%* … %>` instead of asking you questions.

## ✅ Step 3: Check two things (30 sec)
They're already on, but worth a glance:
- Settings → **Dataview** → **Enable JavaScript queries** is on (the habit tracker needs it)
- Settings → **Appearance** → **CSS snippets**: `bookshelf` and `wide-page` are on (all the custom looks)

## ✅ Step 4: Free keys for movies and games (5 min, optional)
Book search works out of the box. Movie and game search need a free personal key. You can do this now or the first time you add a movie or game.

| To add… | Plugin | You need |
|---|---|---|
| 🎬 Movies, TV shows **and anime** | Movie Search | a **TMDB API key** |
| 🎮 Games | IGDB Game Search | a **Twitch Client ID + Client Secret** |
| 📖 Books and manga | Book Search | nothing 🎉 |

Step by step: [[📌 How this vault works#🔑 API keys (movies and games)|📌 Vault Guide → 🔑 API keys]].

> [!danger] Your keys are yours
> Keys are saved in `.obsidian/plugins/…/data.json`. If you ever put this vault on GitHub, make the repo **private**, or anyone can use your keys.

## ✅ Step 5: Make it yours (2 min)
- **Your habits**: open [[🔁 Habits]] and edit the **✏️ My habits** table (add rows, delete rows, change goals). Home updates on its own.
- **Your routine**: change [[My Daily Routine]] to fit your day.
- **Already have notes in another vault?** An AI can sort them in for you: [[📌 How this vault works#🧳 Bring your old vault|📌 Vault Guide → 🧳 Bring your old vault]].
- **The sample notes** (the Startup Club project, the Coding and Productivity areas, a few books, movies and games) are there to show you what things look like. Keep them while you learn and delete them whenever you like.

---

## ⭐ How you make notes
This is the whole workflow. Every time you want to write something down:

1. **Press `Cmd+Option+Shift+N`** (`Ctrl+Alt+Shift+N` on Windows/Linux).
2. **Pick what kind of note it is:**

| It's… | Pick |
|---|---|
| Notes on something from the internet or someone else (a video, article, podcast, lecture, book chapter) | 📚 **Source Template** |
| A small fact or how-to you'll want to find again | ⚛️ **Atomic Template** |
| Your own idea or conclusion | 🌲 **Evergreen Template** |
| Something you're writing (essay, script, article, or anything you just want to write down) | ✍️ **Writing Template** |
| A meeting | 🤝 **Meeting Template** |
| A person, creator or organisation | 👤 **Person Template** |
| Something with a finish line | 🎯 **Project Template** |
| Something you look after, no end date | 🌱 **Area Template** |
| A course or class | 🎓 **Course Template** |

3. **Pick the area or project it belongs to** (you can pick more than one), then **✅ Done**. Not sure yet? **⏭️ Skip** and it waits in 📥 Inbox.
4. **Type a title.** The note moves into the right folder and shows up on that area's or project's page.

Books, movies, anime, manga and games have their own buttons instead (the 📖+, ⭐ and 🎮 icons in the left ribbon). Daily notes come from **☀️ Today** on Home.

## 🧭 Your first 10 minutes
Try these in order. Each takes about a minute.

1. **Look around 🏠 Home.** Projects you're working on (🎯), your areas (🌱), what you're reading or watching (📖), and every note type (🗂️).
2. **Open today's note.** Click **☀️ Today** on Home (or press `Cmd+Shift+D`). Tick a habit, then write tomorrow's 3 most important things under **🌙 Tomorrow's Top 3**.
3. **Make a note that files itself.** Press `Cmd+Option+Shift+N` → pick **📚 Source Template** → pick an area (e.g. *Coding 💻*) → **✅ Done** → type a title. The note moves into that area and shows up on the area's page.
4. **Capture a quick thought.** `Cmd+Option+Shift+N` → **✍️ Writing Template** → **⏭️ Skip**. It waits in **📥 Inbox** until you give it a home (sort the Inbox once a week).
5. **Start a project.** `Cmd+Option+Shift+N` → **🎯 Project Template** → type a name. You get a folder and a project page, and it appears on Home under 🎯 Projects Now.
6. **Add a book.** Click the 📖+ icon in the left ribbon (or `Cmd+P` → "New book note"), search a title, and it lands on your shelf with its cover.
7. **Add a movie or anime** (needs the TMDB key). Click the ⭐ icon in the left ribbon, then search. Anime is in there too.

> [!tip] On Windows or Linux
> Read `Cmd` as `Ctrl` and `Option` as `Alt`. So `Cmd+Option+Shift+N` = `Ctrl+Alt+Shift+N`.

**Next →** [[📌 How this vault works|📌 Vault Guide]]: where every note goes, all the shortcuts, projects, areas, courses, habits, the bookshelf, and how to customize it.
