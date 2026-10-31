# 👻 Ghost in the Machine (NecroOS)

> An interactive gothic-cyberpunk terminal and digital Día de los Muertos ofrenda powered entirely by local open-weight AI (**Gemma 3:4B** on Ollama). Built for Hacktoberfest Open-Source AI Challenge: Week 4.

---

## 🎃 Overview

**Ghost in the Machine (NecroOS)** brings together the eerie thrill of Halloween and the profound remembrance of Día de los Muertos (Nov 1–2). Operating inside a retro-futuristic curved CRT terminal with procedural Web Audio synthesis, the app features:

1. **💻 Haunted Shell (Terminal):** An interactive terminal possessed by an ancient digital phantom. Run commands like `whoami`, `ls -la /souls`, `git commit`, `kill -9 phantom`, or speak freely to the machine.
2. **🌼 Digital Ofrenda (Día de los Muertos Altar):** A cyber-altar honoring the pioneers who built modern computing (Ada Lovelace, Alan Turing, Grace Hopper, Dennis Ritchie) and departed software (Macromedia Flash, Netscape, GeoCities). Features interactive flickering candles, traditional offerings (*Cempasúchil*, *Pan de Muerto*, *Sugar Calaveras*, *Copal Incense*), and live AI blessings generated in real-time.
3. **🔮 Language Séance:** A digital spirit board channeling the lingering ghosts of retired programming languages:
   - 🏛️ **COBOL (1959)** — Mainframe titan balancing global ledgers.
   - ⚡ **ActionScript 3 / Flash** — The fallen creator of interactive web animation.
   - 📜 **ALGOL 68** — The father of modern block structures.
   - 🕹️ **Turbo Pascal** — 1980s lightning-fast compilation wizardry.
   - ⚙️ **x86 Assembly** — Bare-metal poltergeist speaking in registers and opcodes.

---

## ⚡ Why Open Innovation & Open-Weight AI (Gemma) Matter

In keeping with the Hacktoberfest prompt:
- **Zero Cloud Leakage & Total Privacy:** In the sacred spirit of Día de los Muertos, your personal remembrances, memories of loved ones, and shell commands never leave your machine.
- **Offline Resiliency:** Runs completely with the internet and lights switched off.
- **No SaaS Obsolescence:** Closed-source APIs can be deprecated or sunsetted overnight. Open-weight models like **Gemma** guarantee that your creative software remains immortal.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js** v18+ (tested on v24)
- **Ollama** with `gemma3:4b` (or `gemma4:e2b`):
  ```bash
  ollama run gemma3:4b
  ```

### 2. Launch the Application
```bash
# Clone and enter workspace
cd h:/hackweek4

# Launch the server (zero external dependencies required!)
node server.mjs
```

Open your browser to:
**[http://localhost:3000](http://localhost:3000)**

---

## 🛠️ Architecture & Tech Stack

- **Backend:** Native Node.js HTTP Server (`server.mjs`) proxying to Ollama's local REST API (`http://localhost:11434/api/generate`) with graceful offline fallback.
- **Frontend:** Vanilla HTML5, CSS3 with glassmorphism and scanline shaders, and ES6 JavaScript (`public/app.js`).
- **Sound Engine:** Web Audio API procedural synthesizer (`public/audio.js`) generating low ambient dark drones, mechanical keystrokes, EVP radio static, and sacred ofrenda bell harmonics with 0 external audio files.
- **AI Engine:** Google Gemma 3 (4B / open-weight) running on local GPU.

---

## 🏆 DEV Hacktoberfest Week 4 Submission

- **Tag:** `#hf26challenge`
- **Featured Category:** **Best Use of Gemma** ($200) & Overall Prize
- **Submission Title:** *Ghost in the Machine: NecroOS & The Digital Ofrenda Powered by Local Gemma*
- **License:** MIT License
