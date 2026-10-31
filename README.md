# Ghost in the Machine (NecroOS)

*This is a submission for the [Hacktoberfest Open-Source AI Challenge Week 4: Ghost in the Machine](https://dev.to/challenges/hacktoberfest-week4-2026-10-26)*

## What I Built

Ghost in the Machine is a gothic-cyberpunk terminal and digital Día de los Muertos ofrenda. It reimagines the theme as a séance for the people, memories, and technologies that shaped computing.

The experience includes a haunted terminal, an interactive altar with candles and AI-generated blessings, and spirit channels for retired programming languages including COBOL, Flash/ActionScript, ALGOL 68, Turbo Pascal, and x86 Assembly. A procedural Web Audio soundscape adds ambient drones, keystrokes, radio static, and altar chimes.

## Demo

The project runs locally. Follow the setup below to open it at [http://localhost:3000](http://localhost:3000). There is no hosted demo.

## Code

Source code: [github.com/W47K3RJO1N/ghost-in-the-machine](https://github.com/W47K3RJO1N/ghost-in-the-machine)

## How I Built It

The frontend uses vanilla HTML, CSS, and JavaScript. A small native Node.js HTTP server serves the app and connects it to [Ollama](https://ollama.com/) on the same machine. Gemma 3:4B generates the ghost's replies and ofrenda blessings locally. If Ollama is unavailable, the app uses its built-in spectral fallback responses.

No third-party runtime packages are required. To run it:

1. Install Node.js 18 or newer.
2. Install Ollama and download the model:

   ```sh
   ollama pull gemma3:4b
   ```

3. Start the server from the project directory:

   ```sh
   node server.mjs
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Why Does Open Innovation Matter?

Running an open-weight model locally means personal remembrances and conversations can stay on the user's own machine instead of being sent to a hosted AI API. It also makes the experience available without depending on a commercial AI service; if Ollama or Gemma is unavailable, the built-in fallback keeps the app usable.

Open tools made it possible to build an AI experience around intimate memories while keeping the inference setup inspectable and locally controlled.

## Prize Categories

- Best Use of Gemma
- Overall prize
