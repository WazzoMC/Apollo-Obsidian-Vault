---
categories:
  - "[[📚 Sources]]"
topics:
  - "[[Productivity 🧠]]"
source: https://www.youtube.com/watch?v=4Hvkv_I8QDE
author:
  - "[[Tina Huang]]"
---
2026-10-02

> [!tldr] In one line
> Obsidian is just a folder of plain markdown files, so any AI can read it, write to it, or run it. Three levels: **AI reads your notes → AI writes your notes → AI does both.**

## 🧱 Why Obsidian fits AI
- **Local folder of `.md` files**: readable by you *and* by any AI or app
- **Links `[[ ]]` + graph**: notes connect, so AI can follow the trail
- **Properties / metadata**: structure AI can filter and sort
- Bonus: free, private, plugins, Sync (paid, end-to-end encrypted)

## 🪜 The 3 levels
| Level | Who writes | Who reads | Example |
|---|---|---|---|
| 1️⃣ **AI second brain** | 🧑 you | 🤖 AI | Point Claude Cowork / Claude Code / Codex at the vault and chat with your notes |
| 2️⃣ **AI database** | 🤖 AI | 🧑 you + 🤖 | Bots log food, docs, pomodoros, to-dos into the vault; later you ask for insights |
| 3️⃣ **LLM wiki** (Karpathy) | 🤖 AI | 🤖 AI | You only drop in sources and ask questions; the AI builds and maintains everything |

### 1️⃣ AI second brain
- Classic second brain (Tiago Forte): your brain is for thinking, not storing → write it down, find it later
- AI version: you still write, but AI **finds, connects and interprets** it for you
- Tools: Claude Cowork (simple chat), Claude Code / Codex (build apps or dashboards from notes), local models for full privacy, or plugins like **Smart Connections** and **Copilot**

### 2️⃣ AI database
- Good for people who **don't like taking notes**: agents do the logging
- Vault synced across machines, so many agents can write to it at once
- Payoff: personal data → specific advice (e.g. when you focus best, which tasks are hardest)

### 3️⃣ LLM wiki
*"Obsidian is the IDE, the LLM is the programmer, the vault is the codebase."*

**3 layers**
1. **Raw sources**: articles, papers, transcripts. AI reads them but **never edits** them
2. **Wiki**: AI-written summaries, concept and entity pages. **AI owns this**
3. **Schema**: a `CLAUDE.md` / `AGENTS.md` explaining how the wiki is structured

**3 operations**
- **Ingest**: new source in → AI files and cross-links it
- **Query**: ask a question → AI reads the relevant pages and answers
- **Lint**: health check → fix contradictions, stale claims, orphan pages

**2 special files**
- `index.md`: catalog of every page (link + one-line summary), updated on each ingest
- `log.md`: append-only timeline of every ingest, query and lint

Setup is quick: Karpathy's gist is deliberately vague, so you can hand it to any AI agent (Claude Code has the most ready-made repos).

## 💡 Takeaways → 🌲 / ⚛️
- My vault is already halfway to level 3: `CLAUDE.md` + `🤖 AI/` files = the **schema** layer
- Raw sources vs. my own conclusions maps onto 📚 Sources vs. 🌲 Evergreen
- Idea: an `index.md` + `log.md` pair could help AI navigate the vault as it grows
- Related: [[Second Brain Organisation by Ali Abdaal]] · [[PARA Method]]
  - "AI 🤖"
  - "Obsidian 💎"
