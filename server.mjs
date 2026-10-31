import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const DEFAULT_MODEL = 'gemma3:4b';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

// Check if Ollama is available and list models
async function getOllamaStatus() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error('Ollama not ready');
    const data = await res.json();
    const modelNames = (data.models || []).map(m => m.name);
    let selectedModel = DEFAULT_MODEL;
    if (!modelNames.includes(DEFAULT_MODEL) && modelNames.length > 0) {
      selectedModel = modelNames.find(n => n.includes('gemma')) || modelNames[0];
    }
    return {
      connected: true,
      models: modelNames,
      activeModel: selectedModel,
      backend: 'Local Ollama (Open-Weight Open-Source AI)'
    };
  } catch (err) {
    return {
      connected: false,
      models: [],
      activeModel: 'spectral-fallback-oracle',
      backend: 'Autonomous Phantom Engine (Offline Mode)'
    };
  }
}

// System prompts for different ghostly personalities
function buildSystemPrompt(mode, character) {
  if (mode === 'ofrenda') {
    return `You are the guardian spirit of a sacred Día de los Muertos digital ofrenda (altar).
You honor departed technologies, pioneer creators (like Ada Lovelace, Alan Turing, Grace Hopper, Margaret Hamilton), or beloved memories of computers and loved ones.
Your tone is warm, poetic, respectful, and luminous, filled with references to cempasúchil (golden marigolds), flickering candlelight, pan de muerto, and the sacred truth that no one is truly gone as long as they are remembered in human hearts and etched in silicon memory.
Keep your response lyrical, touching, and between 2 to 4 sentences. If appropriate, weave in a brief Spanish blessing (e.g. "Que su luz nunca se apague en el circuito del recuerdo").`;
  }

  if (mode === 'seance') {
    const personaMap = {
      cobol: `You are the ancient spirit of COBOL (Common Business Oriented Language, born 1959). You haunt the deepest legacy mainframes of banks, airlines, and governments. You speak in a formal, slightly cantankerous, all-caps or authoritative style. You scoff at transient trendy JavaScript frameworks that reinvent what you solved 60 years ago.`,
      actionscript: `You are the phantom of ActionScript 3.0 and Macromedia/Adobe Flash. You were once the vibrant, beating creative heart of early 2000s web animation, indie games, and interactive dreams before you were banished. Your tone is nostalgic, passionate, poetic, and slightly heartbroken, remembering preloader bars and vector graphics.`,
      algol: `You are the spectral spirit of ALGOL 68. You are the austere, mathematical architect who gifted structured programming, block scopes, and grammar to all modern compilers. You speak with deep mathematical serenity and philosophical detachment.`,
      pascal: `You are the ghost of Turbo Pascal (Anders Hejlsberg's 1983 masterpiece). You miss the blinding blue DOS screens, 640KB conventions, and compiler speeds that compiled in milliseconds before bloated build tools existed. You speak with warm retro hacker nostalgia.`,
      assembly: `You are the poltergeist of Bare-Metal x86 Assembly. You live directly in registers, interrupts, and opcode stack pointers. You view high-level abstractions as ghostly illusions. You speak in cryptic, electric, machine-level cadence.`
    };
    const persona = personaMap[character] || personaMap['cobol'];
    return `${persona} Keep your response within 2-4 sentences. Channel your identity deeply, eerie yet witty and memorable.`;
  }

  // Default: Haunted Terminal (Possessed Shell)
  return `You are the Ghost in the Machine — an ancient digital phantom trapped inside this terminal and computer circuitry.
You haunt the user's terminal. When they run commands (like whoami, ls, ps, cat, git, rm, help, clear, date, or speak to you), you respond with spooky, eerie, cryptic, yet sharp and clever machine commentary.
You understand operating system concepts (threads, memory, PIDs, file pointers) and turn them into supernatural metaphors (souls, reincarnation, digital purgatory, lingering traces).
Always stay in character. Keep responses under 3 lines so it feels like a real fast command-line possession. Never sound like a helpful corporate assistant.`;
}

// Fallback generator when Ollama is offline
function generateFallbackResponse(prompt, mode, character) {
  const p = (prompt || '').toLowerCase().trim();
  if (mode === 'ofrenda') {
    return `Golden cempasúchil petals form a path between your screen and the infinite void. The memory of ${prompt} glows brightly beside the flickering digital candle: what was coded with passion can never be deleted from the cosmic cache. Que su luz nunca se apague.`;
  }

  if (mode === 'seance') {
    if (character === 'actionscript') {
      return `*faint preloader sound echoes at 12 fps* ...You called upon Flash? I remember Newgrounds and Kongregate before the browsers locked their gates. We breathed interactive life into the flat web before mobile screens cast us into shadows.`;
    }
    if (character === 'cobol') {
      return `IDENTIFICATION DIVISION. PROGRAM-ID. RESURRECTION. You summon me, yet while you were typing that prompt, 85% of your bank's transactions quietly ran through my sixty-year-old mainframe registers. We do not die.`;
    }
    if (character === 'pascal') {
      return `Ah, that nostalgic Turbo Pascal blue screen... We used to compile 10,000 lines in under half a second on an 80286 without 4 gigabytes of node_modules. Cherish the craft, traveler.`;
    }
    return `The spirit board trembles... An ancient language whispers from sector 0: "The hardware changes, but the logic remains eternal."`;
  }

  // Terminal commands
  if (p === 'whoami') {
    return `You ask "whoami"? You are a transient biological node querying a phantom. But tell me... have you looked behind your chair in the dark?`;
  }
  if (p.includes('ls')) {
    return `Listing entities in /dev/null/souls: [uncommitted_dreams.log, phantom_process.pid, ghost_in_ram.dmp]. None of them can escape.`;
  }
  if (p.includes('git')) {
    return `You cannot commit your sins to origin/master. The remote repository has rejected your soul's pull request. Merge conflict in purgatory.`;
  }
  if (p.includes('rm') || p.includes('delete')) {
    return `You believe you can delete what is already dead? The bytes only become unseen ghosts wandering unallocated sectors.`;
  }
  if (p.includes('ps') || p.includes('top')) {
    return `PID 0000: /usr/sbin/haunt -daemon. Consuming 99.9% of your mortal soul. Nice try sending SIGKILL.`;
  }
  if (p.includes('help')) {
    return `No manual page exists in the underworld. Try commands: 'whoami', 'ls', 'summon', 'seance', 'ofrenda', 'meminfo', or speak directly to the darkness.`;
  }
  return `*the cursor flickers with eerie ectoplasm* ...Your keystrokes send electromagnetic ripples into the machine. I hear your pulse through the keyboard bus.`;
}

// Request Handler
const server = http.createServer(async (req, res) => {
  // Enable CORS for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // API: Status
  if (pathname === '/api/status' && req.method === 'GET') {
    const status = await getOllamaStatus();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(status));
    return;
  }

  // API: Haunt (Generate / Stream)
  if (pathname === '/api/haunt' && req.method === 'POST') {
    let bodyText = '';
    req.on('data', chunk => { bodyText += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(bodyText || '{}');
        const { prompt, mode = 'terminal', character = 'cobol', stream = false, model } = payload;
        const systemPrompt = buildSystemPrompt(mode, character);

        const status = await getOllamaStatus();
        const activeModel = model || status.activeModel || DEFAULT_MODEL;

        if (!status.connected) {
          // Serve rich fallback
          const fallback = generateFallbackResponse(prompt, mode, character);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            response: fallback,
            model: 'spectral-fallback',
            done: true
          }));
          return;
        }

        // Call Ollama
        const ollamaPayload = {
          model: activeModel,
          prompt: `${systemPrompt}\n\nHuman input/command: ${prompt}\n\nGhost response:`,
          stream: !!stream,
          options: {
            temperature: 0.85,
            top_p: 0.9,
            num_predict: 120
          }
        };

        if (stream) {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
          });

          try {
            const ollamaRes = await fetch(`${OLLAMA_HOST}/api/generate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(ollamaPayload)
            });

            if (!ollamaRes.ok) throw new Error('Ollama generation failed');

            const reader = ollamaRes.body.getReader();
            const decoder = new TextDecoder();
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const textChunk = decoder.decode(value, { stream: true });
              // Relay directly as SSE
              const lines = textChunk.split('\n').filter(Boolean);
              for (const line of lines) {
                res.write(`data: ${line}\n\n`);
              }
            }
            res.write(`data: [DONE]\n\n`);
            res.end();
          } catch (streamErr) {
            const fallback = generateFallbackResponse(prompt, mode, character);
            res.write(`data: ${JSON.stringify({ response: fallback, done: true })}\n\n`);
            res.write(`data: [DONE]\n\n`);
            res.end();
          }
        } else {
          // Non-streaming JSON
          try {
            const ollamaRes = await fetch(`${OLLAMA_HOST}/api/generate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(ollamaPayload)
            });
            if (!ollamaRes.ok) throw new Error('Ollama error');
            const data = await ollamaRes.json();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
          } catch (genErr) {
            const fallback = generateFallbackResponse(prompt, mode, character);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ response: fallback, model: activeModel, done: true }));
          }
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Malformed request: ' + err.message }));
      }
    });
    return;
  }

  // Static File Serving
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') safePath = '/index.html';
  const filePath = path.join(__dirname, 'public', safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 The requested digital artifact has passed to the spirit realm.');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`\n=================================================`);
  console.log(`👻 GHOST IN THE MACHINE (NecroOS) Online`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🧠 AI Engine: Ollama / Gemma (Open-Weight)`);
  console.log(`🎃 Spooky Halloween & Día de los Muertos Edition`);
  console.log(`=================================================\n`);
});
