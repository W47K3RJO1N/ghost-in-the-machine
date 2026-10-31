# 👻 NecroOS — Ghost in the Machine

<p align="center">
  <strong>Where forgotten code awakens and machines remember.</strong>
</p>

<p align="center">
  A gothic-cyberpunk terminal experience powered by local open-weight AI.
</p>

<p align="center">
  <a href="https://github.com/W47K3RJO1N/ghost-in-the-machine">
    <img src="https://img.shields.io/badge/GitHub-Repository-black?logo=github" alt="GitHub Repository">
  </a>
  <img src="https://img.shields.io/badge/AI-Gemma%203%3A4B-blueviolet" alt="Gemma AI">
  <img src="https://img.shields.io/badge/Runtime-Node.js-green?logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="MIT License">
  <img src="https://img.shields.io/badge/Open%20Source-Yes-brightgreen" alt="Open Source">
</p>

---

## 🌌 Overview

**NecroOS** is an experimental AI-powered haunted terminal inspired by the concept of *Ghost in the Machine* and the cultural tradition of **Día de los Muertos (Day of the Dead)**.

It transforms a traditional terminal into a digital séance where forgotten programming languages, retired technologies, and memories of computing history return as interactive machine spirits.

Through a mysterious terminal interface, users can communicate with digital ghosts, interact with a virtual ofrenda (memory altar), and experience AI-generated messages powered by Google's open-weight Gemma model running locally.

NecroOS is more than a terminal simulation. It is a creative exploration of artificial intelligence, digital memory, computing history, and the relationship between humans and machines.

> *Every machine has a memory. Every line of code leaves a ghost.*

## ✨ Features

### 👻 1. Haunted Interactive Terminal
- A terminal-inspired interface with a gothic cyberpunk aesthetic.
- Interactive conversations with digital machine spirits.
- Atmospheric responses that bring forgotten technologies to life.
- Built-in spectral fallback responses when local AI is unavailable.

### 🕯️ 2. Digital Ofrenda — Memory Altar
- An interactive digital altar inspired by Día de los Muertos.
- Virtual candles and memorial elements.
- AI-generated blessings and messages.
- A symbolic space celebrating the history of computing.

### 💀 3. Forgotten Programming Language Spirits

Reconnect with technologies that helped shape modern computing.

The experience features spirits representing:

- **COBOL** — A legendary language of business computing.
- **Flash / ActionScript** — Remembering the interactive web era.
- **ALGOL 68** — A historically influential programming language.
- **Turbo Pascal** — A classic language of early software development.
- **x86 Assembly** — The low-level foundation of computer architecture.

### 🧠 4. Local AI Intelligence
- Powered by Google's open-weight **Gemma 3:4B** model.
- Uses Ollama for local model inference.
- Generates contextual ghost conversations and altar blessings.
- Keeps AI inference on the user's own machine rather than requiring a hosted AI API.
- Includes fallback responses if Ollama or the model is unavailable.

### 🔊 5. Procedural Audio Experience
- Atmospheric ambient sound effects.
- Electronic drones and radio static.
- Mechanical keyboard sounds.
- Interactive altar chimes.
- Procedural audio generated through the Web Audio API.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Gothic cyberpunk interface and styling |
| Vanilla JavaScript | Frontend interactions and application logic |
| Node.js | Lightweight backend server |
| Ollama | Local AI model execution |
| Gemma 3:4B | AI-generated conversations and blessings |
| Web Audio API | Procedural sound effects and atmosphere |

**Architecture:** Lightweight frontend + native Node.js HTTP server + local AI inference.

No third-party runtime npm packages are required.

---

## 🏗️ Architecture

```text
              USER
                |
                v
       +-------------------+
       |   NecroOS UI      |
       | HTML / CSS / JS   |
       +-------------------+
                |
                v
       +-------------------+
       |   Node.js Server  |
       |    server.mjs     |
       +-------------------+
                |
                v
       +-------------------+
       |  Ollama Runtime   |
       +-------------------+
                |
                v
       +-------------------+
       |   Gemma 3:4B      |
       |   Local AI Model  |
       +-------------------+
                |
                v
       +-------------------+
       | AI Ghost Response |
       +-------------------+

       Fallback:
       Built-in spectral responses
       when local AI is unavailable.
```

---

## 🚀 Getting Started

Follow these steps to run NecroOS locally.

### Prerequisites

Make sure you have installed:

- [Node.js 18+](https://nodejs.org/)
- [Ollama](https://ollama.com/)
- A computer capable of running the Gemma 3:4B model.

### 1. Clone the Repository

```bash
git clone https://github.com/W47K3RJO1N/ghost-in-the-machine.git
```

### 2. Navigate to the Project

```bash
cd ghost-in-the-machine
```

### 3. Download the AI Model

Pull the Gemma 3:4B model using Ollama:

```bash
ollama pull gemma3:4b
```

### 4. Start the Application

Start the Node.js server:

```bash
node server.mjs
```

Alternatively, use the npm script:

```bash
npm start
```

### 5. Open NecroOS

Visit the following address in your browser:

```text
http://localhost:3000
```

The haunted terminal is now ready.

**Note:** Make sure Ollama is installed and the Gemma model is available for AI-powered interactions. The application also provides built-in fallback responses if local AI is unavailable.

---

## 📁 Project Structure

```text
ghost-in-the-machine/
│
├── public/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/
│
├── server.mjs
├── package.json
└── README.md
```

*The public directory contains the frontend assets, while server.mjs handles the lightweight Node.js backend and local AI communication.*

---

## 🔐 Privacy & Local AI

One of the central ideas behind NecroOS is exploring AI without depending on cloud-based inference services.

By using Ollama and Gemma 3:4B locally:

- AI inference runs on the user's machine.
- No hosted AI API key is required.
- Conversations can be processed locally.
- Users retain greater control over their AI environment.
- The application remains usable through built-in fallback responses.

**Local execution is a design choice, not just a technical implementation detail.**

---

## 🎯 Project Motivation

The internet remembers almost everything, but technology often forgets its own history.

Programming languages that once powered entire industries gradually disappear from everyday development. Frameworks become obsolete, technologies are abandoned, and the digital world moves forward.

NecroOS explores a creative question:

**What if forgotten technologies could speak again?**

By combining artificial intelligence, computing history, interactive storytelling, and the symbolism of Día de los Muertos, NecroOS creates an experience that celebrates the technologies that came before us.

---

## 🏆 Hacktoberfest 2026

This project is a submission for:

**Hacktoberfest Open-Source AI Challenge — Week 4: Ghost in the Machine**

The project explores the creative use of open-weight AI models to build an immersive and interactive experience.

### Challenge Categories
- Best Use of Gemma
- Overall Prize

---

## 🔮 Future Improvements

Some possibilities for future development:

- [ ] Additional forgotten programming language spirits.
- [ ] Persistent digital memories and user-created memorials.
- [ ] More interactive altar experiences.
- [ ] Customizable AI ghost personalities.
- [ ] Expanded ambient soundscapes.
- [ ] Improved conversation context and memory.
- [ ] Additional themes and terminal customization.
- [ ] More advanced local AI model support.

---

## 🤝 Contributing

Contributions, suggestions, and creative ideas are welcome!

If you would like to improve NecroOS:

1. Fork the repository.
2. Create a new feature branch.

```bash
git checkout -b feature/your-feature-name
```

3. Make your changes.
4. Commit your changes.

```bash
git commit -m "Add: your feature description"
```

5. Push your branch.

```bash
git push origin feature/your-feature-name
```

6. Open a Pull Request.

---

## 📜 License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute this project under the terms of the license.

---

## 👨‍💻 Author

**W47K3RJO1N**

GitHub: [@W47K3RJO1N](https://github.com/W47K3RJO1N)

Project: [NecroOS — Ghost in the Machine](https://github.com/W47K3RJO1N/ghost-in-the-machine)

---

<p align="center">
  <strong>🕯️ The code may be forgotten. The machine never forgets.</strong>
  <br>
  <em>Welcome to NecroOS. Speak, and the ghosts shall answer.</em>
</p>
