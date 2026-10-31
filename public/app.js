import { soundEngine } from './audio.js';

// State
const state = {
  activeTab: 'tab-terminal',
  audioDroneActive: false,
  crtActive: true,
  currentChannel: 'cobol',
  modelName: 'Gemma 3 (Local)',
  isGenerating: false
};

// ==========================================
// 1. FLOATING PARTICLES CANVAS (Spectral & Cempasúchil)
// ==========================================
const canvas = document.getElementById('spectral-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    // 60% spectral motes, 40% cempasúchil marigold petals
    this.isPetal = Math.random() > 0.55;
    this.size = this.isPetal ? Math.random() * 6 + 4 : Math.random() * 2.5 + 1;
    this.speedY = this.isPetal ? Math.random() * 0.8 + 0.3 : (Math.random() - 0.5) * 0.4;
    this.speedX = this.isPetal ? Math.sin(Math.random() * Math.PI) * 0.7 - 0.35 : (Math.random() - 0.5) * 0.4;
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = (Math.random() - 0.5) * 0.04;
    this.alpha = Math.random() * 0.6 + 0.2;
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.angle) * 0.3;
    this.angle += this.angleSpeed;

    if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
      this.reset();
      this.y = -10;
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    if (this.isPetal) {
      // Golden marigold petal
      ctx.fillStyle = `rgba(255, 159, 28, ${this.alpha})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Cyan/Green spectral mote
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2);
      grad.addColorStop(0, `rgba(0, 255, 157, ${this.alpha})`);
      grad.addColorStop(1, 'rgba(0, 255, 157, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

for (let i = 0; i < 48; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ==========================================
// 2. STATUS & BACKEND CONNECTIVITY
// ==========================================
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('model-status-text');

async function checkModelStatus() {
  try {
    const res = await fetch('/api/status');
    const data = await res.json();
    if (data.connected) {
      statusDot.style.background = '#00ff9d';
      statusDot.style.boxShadow = '0 0 10px #00ff9d';
      statusText.textContent = `${data.activeModel} (Local GPU / Ollama)`;
      state.modelName = data.activeModel;
    } else {
      statusDot.style.background = '#ff9f1c';
      statusDot.style.boxShadow = '0 0 10px #ff9f1c';
      statusText.textContent = `Offline Phantom Engine`;
    }
  } catch (e) {
    statusDot.style.background = '#ff0055';
    statusText.textContent = 'Disconnected';
  }
}
checkModelStatus();

// ==========================================
// 3. AUDIO & CRT CONTROLS
// ==========================================
const btnToggleAudio = document.getElementById('btn-toggle-audio');
const audioIcon = document.getElementById('audio-icon');
const btnToggleCrt = document.getElementById('btn-toggle-crt');
const crtOverlay = document.getElementById('crt-overlay');

btnToggleAudio.addEventListener('click', () => {
  soundEngine.ensureContext();
  state.audioDroneActive = !state.audioDroneActive;
  soundEngine.toggleAmbientDrone(state.audioDroneActive);
  if (state.audioDroneActive) {
    btnToggleAudio.classList.add('active');
    audioIcon.textContent = '🔊';
  } else {
    btnToggleAudio.classList.remove('active');
    audioIcon.textContent = '🔇';
  }
});

btnToggleCrt.addEventListener('click', () => {
  state.crtActive = !state.crtActive;
  document.body.classList.toggle('no-crt', !state.crtActive);
  btnToggleCrt.classList.toggle('active', state.crtActive);
});

// Sound on general input
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    soundEngine.playKeyClick();
  }
});

// ==========================================
// 4. TAB NAVIGATION
// ==========================================
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    soundEngine.playKeyClick();
    const targetTab = btn.getAttribute('data-tab');
    state.activeTab = targetTab;

    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    document.getElementById(targetTab).classList.add('active');
  });
});

// ==========================================
// 5. HAUNTED TERMINAL
// ==========================================
const termBody = document.getElementById('terminal-body');
const termInput = document.getElementById('terminal-input');
const btnTermSend = document.getElementById('btn-term-send');
const resonanceMeter = document.getElementById('resonance-meter');
const resonanceVal = document.getElementById('resonance-val');
const termTimestamp = document.getElementById('term-timestamp');

function updateClock() {
  const now = new Date();
  termTimestamp.textContent = now.toTimeString().split(' ')[0];
}
setInterval(updateClock, 1000);
updateClock();

function appendTermEntry(command, ghostText, isStreaming = false) {
  const entry = document.createElement('div');
  entry.className = 'term-entry';

  const userLine = document.createElement('div');
  userLine.className = 'term-input-line';
  userLine.innerHTML = `<span class="term-prompt">necro@underworld:~$</span> <span>${escapeHtml(command)}</span>`;
  entry.appendChild(userLine);

  const responseLine = document.createElement('div');
  responseLine.className = 'term-ghost-response glitch-text';
  responseLine.textContent = ghostText;
  entry.appendChild(responseLine);

  termBody.appendChild(entry);
  termBody.scrollTop = termBody.scrollHeight;
  return responseLine;
}

function updateEctoplasm() {
  const percent = Math.floor(Math.random() * 30 + 70);
  resonanceMeter.style.width = `${percent}%`;
  resonanceVal.textContent = `${percent}%`;
}

async function sendTermCommand(cmdText) {
  const trimmed = cmdText.trim();
  if (!trimmed || state.isGenerating) return;

  if (trimmed.toLowerCase() === 'clear') {
    termBody.innerHTML = '';
    termInput.value = '';
    return;
  }

  soundEngine.playGhostGlitch();
  updateEctoplasm();
  state.isGenerating = true;
  termInput.value = '';

  const responseEl = appendTermEntry(trimmed, '⚡ [Channeling spectral pulse through local Gemma]...');

  try {
    const res = await fetch('/api/haunt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: trimmed,
        mode: 'terminal',
        model: state.modelName,
        stream: false
      })
    });

    const data = await res.json();
    const reply = data.response || 'The phantom connection dissolved into static.';
    
    // Typewriter effect
    responseEl.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      if (i < reply.length) {
        responseEl.textContent += reply.charAt(i);
        i++;
        termBody.scrollTop = termBody.scrollHeight;
      } else {
        clearInterval(interval);
        state.isGenerating = false;
        soundEngine.playGhostGlitch();
      }
    }, 12);

  } catch (err) {
    responseEl.textContent = `[CONNECTION SEVERED]: ${err.message}`;
    state.isGenerating = false;
  }
}

btnTermSend.addEventListener('click', () => sendTermCommand(termInput.value));
termInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendTermCommand(termInput.value);
});

// Quick command buttons
document.querySelectorAll('.cmd-pill').forEach(btn => {
  btn.addEventListener('click', () => {
    const cmd = btn.getAttribute('data-cmd');
    termInput.value = cmd;
    sendTermCommand(cmd);
  });
});

// ==========================================
// 6. DIGITAL OFRENDA (Día de los Muertos Altar)
// ==========================================
const candles = [
  { id: 'ada', name: 'Ada Lovelace', dates: '1815-1852', note: 'First Computer Programmer', lit: true },
  { id: 'turing', name: 'Alan Turing', dates: '1912-1954', note: 'Father of Modern Computing', lit: true },
  { id: 'hopper', name: 'Grace Hopper', dates: '1906-1992', note: 'Mother of Compilers & COBOL', lit: true },
  { id: 'ritchie', name: 'Dennis Ritchie', dates: '1941-2011', note: 'Creator of C & Unix', lit: true },
  { id: 'flash', name: 'Flash Player', dates: '1996-2020', note: 'The Golden Age of Web Animation', lit: true },
  { id: 'firstpc', name: 'First Home PC', dates: 'Memories', note: 'Where your journey began', lit: true }
];

const candlesGrid = document.getElementById('candles-grid');
const blessingInput = document.getElementById('ofrenda-dedication');
const btnBlessing = document.getElementById('btn-generate-blessing');
const blessingDisplay = document.getElementById('blessing-display');

function renderCandles() {
  candlesGrid.innerHTML = '';
  candles.forEach(c => {
    const card = document.createElement('div');
    card.className = `candle-card ${c.lit ? '' : 'extinguished'}`;
    card.id = `candle-${c.id}`;
    card.innerHTML = `
      <div class="candle-flame-wrapper">
        <div class="flame"></div>
      </div>
      <div class="candle-name">${escapeHtml(c.name)}</div>
      <div class="candle-status">${escapeHtml(c.dates)}</div>
      <div style="font-size: 0.65rem; color: #8b949e; margin-top: 0.2rem;">${escapeHtml(c.note)}</div>
    `;

    card.addEventListener('click', () => {
      c.lit = !c.lit;
      card.classList.toggle('extinguished', !c.lit);
      soundEngine.playOfrendaChime();
      if (c.lit) {
        blessingInput.value = c.name;
        generateOfrendaBlessing(c.name);
      }
    });

    candlesGrid.appendChild(card);
  });
}
renderCandles();

// Offerings selection
document.querySelectorAll('.offering-item').forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('active');
    soundEngine.playOfrendaChime();
    const offeringName = item.querySelector('.offering-title').textContent;
    blessingDisplay.textContent = `You placed ${offeringName} upon the sacred altar. The fragrance rises into the machine's cooling fans...`;
  });
});

async function generateOfrendaBlessing(subject) {
  const target = subject || blessingInput.value || 'our beloved computing ancestors';
  soundEngine.playOfrendaChime();
  blessingDisplay.textContent = `🕯️ Lighting the path of cempasúchil for "${target}" with Gemma 3...`;

  try {
    const res = await fetch('/api/haunt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: target,
        mode: 'ofrenda',
        model: state.modelName,
        stream: false
      })
    });

    const data = await res.json();
    blessingDisplay.textContent = `"${data.response || 'Que su memoria resplandezca eternamente.'}"`;
  } catch (err) {
    blessingDisplay.textContent = `"${target} rests in eternal peaceful memory. May their light guide our code."`;
  }
}

btnBlessing.addEventListener('click', () => {
  generateOfrendaBlessing(blessingInput.value);
});

// ==========================================
// 7. LANGUAGE SÉANCE
// ==========================================
const channelButtons = document.querySelectorAll('.channel-btn');
const seanceMessages = document.getElementById('seance-messages');
const seanceInput = document.getElementById('seance-input');
const btnSeanceSend = document.getElementById('btn-seance-send');
const seanceHeaderTitle = document.getElementById('seance-header-title');
const evpBars = document.querySelectorAll('.evp-bar');
const evpFreq = document.getElementById('evp-freq');

const CHANNEL_NAMES = {
  cobol: 'COBOL (1959)',
  actionscript: 'Flash / ActionScript 3.0',
  algol: 'ALGOL 68',
  pascal: 'Turbo Pascal (1983)',
  assembly: 'Bare-Metal x86 Assembly'
};

const CHANNEL_INTROS = {
  cobol: 'Greetings mortal. You commune with COBOL. While your ephemeral web frameworks rise and perish with the seasons, I still balance the ledgers of humanity. What query brings you to my mainframe crypt?',
  actionscript: '*Faint sound of a vector preloader at 12 fps* ...You called for Flash? We animated the dreams of the early web before Apple banished us from the garden. Do you still remember our games?',
  algol: 'Greetings, seeker of recursion and grammar. I am ALGOL 68. The syntax of your modern languages was carved from my theoretical bones. What mathematical reflection do you seek?',
  pascal: 'Hello, world! I am Turbo Pascal. In 1983, I compiled 10,000 lines in a heartbeat inside 64KB of RAM. Why does your modern build tool take 45 seconds to bundle a button?',
  assembly: 'MOV EAX, [SOUL] / INT 0x80. You speak to raw x86 opcodes. No garbage collector can save you here. State your register values, mortal.'
};

channelButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    soundEngine.playGhostGlitch();
    channelButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const channel = btn.getAttribute('data-channel');
    state.currentChannel = channel;
    seanceHeaderTitle.textContent = `CHAMBER OF COMMUNION: ${CHANNEL_NAMES[channel]}`;
    evpFreq.textContent = `${(Math.random() * 200 + 350).toFixed(1)} Hz`;

    // Add intro message
    const introBubble = document.createElement('div');
    introBubble.className = 'msg-bubble spirit';
    introBubble.textContent = `[SWITCHING FREQUENCY TO ${CHANNEL_NAMES[channel]}]\n\n${CHANNEL_INTROS[channel]}`;
    seanceMessages.appendChild(introBubble);
    seanceMessages.scrollTop = seanceMessages.scrollHeight;
  });
});

function animateEvpBars() {
  evpBars.forEach(bar => {
    const height = Math.floor(Math.random() * 80 + 15);
    bar.style.height = `${height}%`;
  });
}
setInterval(animateEvpBars, 120);

async function sendSeanceMessage() {
  const query = seanceInput.value.trim();
  if (!query || state.isGenerating) return;

  soundEngine.playGhostGlitch();
  seanceInput.value = '';
  state.isGenerating = true;

  // Append user bubble
  const userBubble = document.createElement('div');
  userBubble.className = 'msg-bubble user';
  userBubble.textContent = query;
  seanceMessages.appendChild(userBubble);

  // Append thinking bubble
  const spiritBubble = document.createElement('div');
  spiritBubble.className = 'msg-bubble spirit';
  spiritBubble.textContent = `[Planchette trembles on ${CHANNEL_NAMES[state.currentChannel]}...]`;
  seanceMessages.appendChild(spiritBubble);
  seanceMessages.scrollTop = seanceMessages.scrollHeight;

  try {
    const res = await fetch('/api/haunt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: query,
        mode: 'seance',
        character: state.currentChannel,
        model: state.modelName,
        stream: false
      })
    });

    const data = await res.json();
    spiritBubble.textContent = data.response || 'The spirit slipped back into the void.';
  } catch (err) {
    spiritBubble.textContent = 'Static hisses on the line... the spirit channel was interrupted.';
  } finally {
    state.isGenerating = false;
    seanceMessages.scrollTop = seanceMessages.scrollHeight;
  }
}

btnSeanceSend.addEventListener('click', sendSeanceMessage);
seanceInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendSeanceMessage();
});

// Utility
function escapeHtml(str) {
  return (str || '').replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
