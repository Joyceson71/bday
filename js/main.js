/* ============================================================
   MAIN.JS  —  Continuous Music Engine, Progress, Transitions,
   Ambient FX, Toast, Confetti, 13 Rooms Architecture
   ============================================================ */

// ─── PAGE DEFINITIONS (14 ROOMS) ─────────────────────────────
const PAGES = [
  { id: 0,  file: 'index.html',          icon: '🎪', label: 'Gate' },
  { id: 1,  file: 'lobby.html',          icon: '🎈', label: 'Lobby' },
  { id: 2,  file: 'memories.html',       icon: '📸', label: 'Memories' },
  { id: 3,  file: 'questions.html',      icon: '💬', label: 'Questions' },
  { id: 4,  file: 'videos.html',         icon: '🎥', label: 'Wishes' },
  { id: 5,  file: 'cake.html',           icon: '🎂', label: 'Cake' },
  { id: 6,  file: 'photo-haul.html',     icon: '📸', label: 'Photo Haul' },
  { id: 7,  file: 'party-corner.html',   icon: '🪔', label: 'Party' },
  { id: 8,  file: 'dares.html',          icon: '🎯', label: 'Dares' },
  { id: 9,  file: 'kids-challenge.html', icon: '🧸', label: 'Kids' },
  { id: 10, file: 'appa.html',           icon: '💙', label: 'Appa' },
  { id: 11, file: 'letter.html',         icon: '💌', label: 'Letter' },
  { id: 12, file: 'hug.html',            icon: '🤗', label: 'Hug' },
  { id: 13, file: 'jd.html',             icon: '💜', label: 'Wish from JD' },
];

// ─── PROGRESS HELPERS ────────────────────────────────────────
const Progress = {
  KEY: 'bday_progress',

  get() {
    try { return parseInt(localStorage.getItem(this.KEY) || '0', 10); }
    catch { return 0; }
  },

  set(val) {
    try { localStorage.setItem(this.KEY, String(val)); }
    catch {}
  },

  unlock(pageId) {
    const current = this.get();
    if (pageId > current) this.set(pageId);
  },

  isUnlocked(pageId) { return pageId <= this.get(); },

  reset() { try { localStorage.removeItem(this.KEY); } catch {} },
};

// Guest name helpers
const Guest = {
  KEY: 'bday_guest',
  get() { try { return localStorage.getItem(this.KEY) || ''; } catch { return ''; } },
  set(name) { try { localStorage.setItem(this.KEY, name); } catch {} },
};

// ─── PAGE GUARD ───────────────────────────────────────────────
function guardPage(pageIndex) {
  if (pageIndex === 0) return; // index always open
  if (Progress.isUnlocked(pageIndex)) return; // OK
  sessionStorage.setItem('locked_redirect', '1');
  window.location.href = 'index.html';
}

// ─── PROGRESS BAR RENDER (A ROW OF GOLD HEARTS) ───────────────
function renderProgressBar(currentPageIndex) {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  const unlocked = Progress.get();
  bar.innerHTML = PAGES.map((p, i) => {
    let cls = 'progress-step';
    const isUnlocked = i <= unlocked;
    const isCurrent  = i === currentPageIndex;
    if (i < unlocked) cls += ' unlocked';
    if (isCurrent) cls += ' current';
    const heart = isUnlocked ? '💛' : '🤍';
    return `<div class="${cls}" title="Room ${i + 1}: ${p.label} ${isUnlocked ? '(Unlocked)' : '(Locked)'}" aria-label="${p.label} room, ${isUnlocked ? 'unlocked' : 'locked'}">
      <span class="heart-symbol ${isCurrent ? 'heart-pulse' : ''}">${heart}</span>
    </div>`;
  }).join('');
}

// ─── CONTINUOUS MUSIC ENGINE (SECTION 5) ──────────────────────
const Music = {
  audio: null,
  synthCtx: null,
  synthTimer: null,
  started: false,
  muted: false,
  sfxMuted: false,
  currentVol: 0.25,
  targetVol: 0.25,
  currentTrack: '',
  trackLabel: 'Warm Instrumental',
  savedBeforeVideo: null,
  savedBeforeJukebox: null,
  saveInterval: null,

  init(currentFile) {
    // Read saved user preferences
    this.muted = localStorage.getItem('bday_muted') === '1';
    this.sfxMuted = localStorage.getItem('bday_sfx_muted') === '1';

    const savedVol = parseFloat(localStorage.getItem('bday_volume'));
    if (!isNaN(savedVol)) {
      this.currentVol = savedVol;
    }

    // Determine track and recommended volume for this page
    const pageCfg = (CONFIG.music && CONFIG.music.pages && CONFIG.music.pages[currentFile]) || {};
    const trackSrc = pageCfg.src || 'assets/audio/background/gate-lobby.mp3';
    const pageVol  = typeof pageCfg.volume === 'number' ? pageCfg.volume : 0.25;
    this.trackLabel = pageCfg.label || 'Soft Instrumental';
    this.targetVol = this.currentVol !== 0.25 ? this.currentVol : pageVol;

    // Check last played track & position from previous page
    const lastTrack = localStorage.getItem('bday_music_track');
    const lastPos   = parseFloat(localStorage.getItem('bday_music_pos') || '0');
    const wasPlaying = localStorage.getItem('bday_music_playing') !== '0';

    this.audio = new Audio();
    this.audio.loop = true;
    this.audio.src = trackSrc;
    this.audio.preload = 'auto';
    this.currentTrack = trackSrc;

    if (lastTrack === trackSrc && lastPos > 0) {
      try { this.audio.currentTime = lastPos; } catch {}
    }

    this.audio.volume = Math.max(0.01, Math.min(1.0, this.targetVol));
    this.audio.muted = this.muted;

    // Save playback position periodically
    if (this.saveInterval) clearInterval(this.saveInterval);
    this.saveInterval = setInterval(() => {
      if (this.audio && !this.audio.paused) {
        try {
          localStorage.setItem('bday_music_pos', String(this.audio.currentTime));
          localStorage.setItem('bday_music_track', this.currentTrack);
          localStorage.setItem('bday_music_playing', '1');
        } catch {}
      }
    }, 1000);

    // Save right before leaving page
    window.addEventListener('beforeunload', () => {
      if (this.audio) {
        try {
          localStorage.setItem('bday_music_pos', String(this.audio.currentTime));
          localStorage.setItem('bday_music_track', this.currentTrack);
        } catch {}
      }
    });

    // Create / enhance music UI panel
    this._renderControlPanel();

    // Auto-start if user was already playing on previous page
    if (wasPlaying && !this.muted) {
      this.start();
    }
  },

  start() {
    this.started = true;
    if (this.muted) return;

    if (this.audio && this.audio.src) {
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            localStorage.setItem('bday_music_playing', '1');
            this._fadeIn(this.targetVol, 1500);
          })
          .catch(() => {
            // Autoplay blocked until user interaction or audio file issue -> synth fallback
            this._startAmbientSynth();
          });
      }
    } else {
      this._startAmbientSynth();
    }
  },

  _fadeIn(target, duration = 1500) {
    if (!this.audio || this.muted) return;
    this.audio.volume = 0.01;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      if (this.audio) this.audio.volume = 0.01 + progress * (target - 0.01);
      if (progress < 1 && !this.muted) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },

  fadeTo(target, duration = 1200) {
    if (!this.audio) return;
    const initial = this.audio.volume;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      if (this.audio) this.audio.volume = initial + progress * (target - initial);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },

  setVolume(v) {
    v = Math.max(0, Math.min(1.0, v));
    this.currentVol = v;
    this.targetVol = v;
    localStorage.setItem('bday_volume', String(v));
    if (this.audio) this.audio.volume = v;
    const slider = document.getElementById('music-vol-slider');
    if (slider) slider.value = v;
  },

  toggle() {
    this.muted = !this.muted;
    localStorage.setItem('bday_muted', this.muted ? '1' : '0');
    if (this.audio) this.audio.muted = this.muted;

    if (this.muted) {
      this._stopAmbientSynth();
      localStorage.setItem('bday_music_playing', '0');
    } else {
      localStorage.setItem('bday_music_playing', '1');
      if (this.audio && this.audio.src) {
        this.audio.play().catch(() => this._startAmbientSynth());
      } else {
        this._startAmbientSynth();
      }
    }
    this._updateUI();
  },

  toggleSFX() {
    this.sfxMuted = !this.sfxMuted;
    localStorage.setItem('bday_sfx_muted', this.sfxMuted ? '1' : '0');
    const btn = document.getElementById('sfx-toggle-btn');
    if (btn) {
      btn.innerHTML = this.sfxMuted ? '🔕' : '🔔';
      btn.title = this.sfxMuted ? 'Unmute sound effects' : 'Mute sound effects';
    }
  },

  nextTrack() {
    const tracks = [
      { src: 'assets/audio/background/gate-lobby.mp3', label: 'Warm Welcome' },
      { src: 'assets/audio/background/memories-piano.mp3', label: 'Memory Piano' },
      { src: 'assets/audio/background/questions-acoustic.mp3', label: 'Calm Acoustic' },
      { src: 'assets/audio/background/cake-festive.mp3', label: 'Festive Joy' },
      { src: 'assets/audio/background/playful-corner.mp3', label: 'Playful Melody' },
      { src: 'assets/audio/background/lullaby-kids.mp3', label: 'Tender Lullaby' },
      { src: 'assets/audio/background/letter-hug.mp3', label: 'Gunda Love' },
    ];
    let nextIdx = 0;
    const current = tracks.findIndex(t => t.src === this.currentTrack);
    if (current >= 0) nextIdx = (current + 1) % tracks.length;

    const next = tracks[nextIdx];
    this.currentTrack = next.src;
    this.trackLabel = next.label;

    if (this.audio) {
      this.audio.src = next.src;
      this.audio.currentTime = 0;
      if (!this.muted) this.audio.play().catch(() => {});
    }
    this._updateUI();
    showToast(`🎵 Now playing: ${next.label}`);
  },

  pauseForVideo() {
    if (this.audio && !this.audio.paused) {
      this.savedBeforeVideo = this.audio.volume;
      this.fadeTo(0.01, 800);
      setTimeout(() => { if (this.audio) this.audio.pause(); }, 850);
    }
  },

  resumeAfterVideo() {
    if (this.audio && !this.muted) {
      this.audio.play().catch(() => {});
      this.fadeTo(this.savedBeforeVideo || this.targetVol, 1500);
    }
  },

  pauseForJukebox() {
    if (this.audio && !this.audio.paused) {
      this.savedBeforeJukebox = this.audio.volume;
      this.fadeTo(0.01, 600);
      setTimeout(() => { if (this.audio) this.audio.pause(); }, 650);
    }
  },

  resumeAfterJukebox() {
    if (this.audio && !this.muted) {
      this.audio.play().catch(() => {});
      this.fadeTo(this.savedBeforeJukebox || this.targetVol, 1500);
    }
  },

  _startAmbientSynth() {
    if (this.synthCtx || this.muted) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.synthCtx = new AudioCtx();
      const notes = [
        [261.63, 329.63, 392.00],
        [220.00, 261.63, 329.63],
        [174.61, 220.00, 261.63],
        [196.00, 246.94, 293.66],
      ];
      let chordIndex = 0;
      const playChord = () => {
        if (!this.synthCtx || this.muted) return;
        const now = this.synthCtx.currentTime;
        const chord = notes[chordIndex % notes.length];
        chordIndex++;
        chord.forEach((freq, idx) => {
          const osc = this.synthCtx.createOscillator();
          const gain = this.synthCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          const targetGain = (this.currentVol * 0.10) / (idx + 1);
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(targetGain, now + 1.5);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);
          osc.connect(gain);
          gain.connect(this.synthCtx.destination);
          osc.start(now);
          osc.stop(now + 5.2);
        });
      };
      playChord();
      this.synthTimer = setInterval(playChord, 4800);
    } catch {}
  },

  _stopAmbientSynth() {
    if (this.synthTimer) { clearInterval(this.synthTimer); this.synthTimer = null; }
    if (this.synthCtx) {
      try { this.synthCtx.close(); } catch {}
      this.synthCtx = null;
    }
  },

  _renderControlPanel() {
    let panel = document.getElementById('music-panel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'music-panel';
      panel.className = 'music-panel';
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-label', 'Continuous music controls');
      panel.innerHTML = `
        <button class="music-btn-circle" id="music-main-btn" aria-label="Toggle background music">🎵</button>
        <span class="music-track-name" id="music-track-label" title="${this.trackLabel}">${this.trackLabel}</span>
        <div class="music-ctrl-item">
          <input type="range" class="music-vol-slider" id="music-vol-slider" min="0" max="0.6" step="0.02" value="${this.targetVol}" aria-label="Music volume slider"/>
        </div>
        <button class="music-icon-btn" id="next-song-btn" title="Next song" aria-label="Next song">⏭️</button>
        <button class="music-icon-btn" id="sfx-toggle-btn" title="Mute/unmute sound effects" aria-label="Toggle sound effects">🔔</button>
      `;
      document.body.appendChild(panel);

      // Hide simple legacy button if present
      const oldBtn = document.getElementById('music-toggle');
      if (oldBtn) oldBtn.style.display = 'none';

      // Event Listeners
      document.getElementById('music-main-btn').addEventListener('click', () => this.toggle());
      document.getElementById('next-song-btn').addEventListener('click', () => this.nextTrack());
      document.getElementById('sfx-toggle-btn').addEventListener('click', () => this.toggleSFX());
      document.getElementById('music-vol-slider').addEventListener('input', (e) => {
        this.setVolume(parseFloat(e.target.value));
      });
    }
    this._updateUI();
  },

  _updateUI() {
    const mainBtn = document.getElementById('music-main-btn');
    if (mainBtn) {
      mainBtn.innerHTML = this.muted ? '🔇' : '🎵';
      mainBtn.classList.toggle('muted', this.muted);
      mainBtn.title = this.muted ? 'Unmute music' : 'Mute music';
    }
    const label = document.getElementById('music-track-label');
    if (label) {
      label.textContent = this.trackLabel;
      label.title = this.trackLabel;
    }
    const sfxBtn = document.getElementById('sfx-toggle-btn');
    if (sfxBtn) {
      sfxBtn.innerHTML = this.sfxMuted ? '🔕' : '🔔';
    }
  }
};

// ─── SOUND EFFECTS ENGINE ─────────────────────────────────────
const Sounds = {};
function loadSounds() {
  const SFX = {
    pop:       'assets/audio/effects/pop.mp3',
    chime:     'assets/audio/effects/chime.mp3',
    bell:      'assets/audio/effects/bell.mp3',
    heartbeat: 'assets/audio/effects/heartbeat.mp3',
    success:   'assets/audio/effects/success.mp3',
  };
  Object.entries(SFX).forEach(([k, v]) => {
    const a = new Audio(v);
    a.preload = 'auto';
    a.volume = 0.35; // gentle, non-jarring volume
    Sounds[k] = a;
  });
}

function playSound(name) {
  if (Music.sfxMuted) return;
  const a = Sounds[name];
  if (!a) return;
  try {
    a.currentTime = 0;
    a.play().catch(() => {});
  } catch {}
}

// ─── PAGE TRANSITION WITH VIEW TRANSITION API / CSS FALLBACK ──
function navigateTo(href, delay = 600) {
  const doNavigation = () => {
    const overlay = document.getElementById('page-transition');
    if (overlay) {
      overlay.style.transition = 'none';
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'all';
      const left  = overlay.querySelector('.curtain-left');
      const right = overlay.querySelector('.curtain-right');
      if (left && right) {
        left.style.transform  = 'translateX(-100%)';
        right.style.transform = 'translateX(100%)';
        left.style.transition  = `transform ${delay}ms cubic-bezier(0.77,0,0.18,1)`;
        right.style.transition = `transform ${delay}ms cubic-bezier(0.77,0,0.18,1)`;
        requestAnimationFrame(() => {
          left.style.transform  = 'translateX(0)';
          right.style.transform = 'translateX(0)';
        });
      }
    }
    setTimeout(() => { window.location.href = href; }, delay + 50);
  };

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      doNavigation();
    });
  } else {
    doNavigation();
  }
}

// ─── AMBIENT PARTICLES ───────────────────────────────────────
function initParticles(options = {}) {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const {
    count   = 40,
    colors  = ['#D4AF37', '#FFD700', '#B388EB', '#F48FB1', '#E6D5FF', '#4DD0E1'],
    speed   = 0.4,
    minSize = 2,
    maxSize = 5,
  } = options;

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    size: minSize + Math.random() * (maxSize - minSize),
    color: colors[Math.floor(Math.random() * colors.length)],
    type: Math.random() > 0.5 ? 'sparkle' : 'circle',
    vx: (Math.random() - 0.5) * speed,
    vy: -Math.random() * speed * 0.8 - 0.1,
    alpha: 0.2 + Math.random() * 0.6,
    phase: Math.random() * Math.PI * 2,
    rate: 0.01 + Math.random() * 0.015,
  }));

  let frame;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.phase += p.rate;
      const a = p.alpha * (0.6 + 0.4 * Math.sin(p.phase));
      ctx.globalAlpha = a;
      ctx.fillStyle   = p.color;

      if (p.type === 'sparkle') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.phase);
        const s = p.size;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          ctx.lineTo(0, -s * 2);
          ctx.rotate(Math.PI / 4);
          ctx.lineTo(0, -s * 0.5);
          ctx.rotate(Math.PI / 4);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W; }
      if (p.y > H + 20) p.y = -20;
    });
    ctx.globalAlpha = 1;
    frame = requestAnimationFrame(draw);
  }

  draw();
  return () => cancelAnimationFrame(frame);
}

// ─── CONFETTI ────────────────────────────────────────────────
function launchConfetti(count = 100) {
  const colors = ['#D4AF37','#FFD700','#B388EB','#F48FB1','#E6D5FF','#4DD0E1','#fff'];
  for (let i = 0; i < count; i++) {
    const div = document.createElement('div');
    div.style.cssText = `
      position: fixed;
      top: -10px;
      left: ${Math.random() * 100}vw;
      width: ${6 + Math.random() * 8}px;
      height: ${6 + Math.random() * 8}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      pointer-events: none;
      z-index: 99990;
      animation: confettiFall ${2 + Math.random() * 2}s ease-in ${Math.random() * 0.5}s forwards;
    `;
    document.body.appendChild(div);
    div.addEventListener('animationend', () => div.remove());
  }
}

// ─── FLOATING BALLOONS ────────────────────────────────────────
function spawnBalloons(count = 6) {
  const colors = ['#B388EB','#F48FB1','#D4AF37','#E6D5FF','#6A1B9A','#4DD0E1'];
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.innerHTML = '🎈';
      el.style.cssText = `
        position: fixed;
        bottom: -80px;
        left: ${10 + Math.random() * 80}%;
        font-size: ${2 + Math.random() * 1.5}rem;
        pointer-events: none;
        z-index: 2;
        animation: balloonRise ${5 + Math.random() * 4}s ease-in forwards;
      `;
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 400);
  }
}

// ─── PETALS ──────────────────────────────────────────────────
function initPetals(count = 12) {
  const colors = ['#B388EB','#F48FB1','#E6D5FF','#D4AF37','#fff'];
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('div');
    const col = colors[Math.floor(Math.random() * colors.length)];
    petal.style.cssText = `
      position: fixed;
      left: ${Math.random() * 100}vw;
      top: -30px;
      width: ${8 + Math.random() * 6}px;
      height: ${8 + Math.random() * 6}px;
      background: ${col};
      border-radius: 50% 0 50% 0;
      pointer-events: none;
      z-index: 1;
      opacity: 0.7;
      animation: petalDrift ${8 + Math.random() * 8}s linear ${Math.random() * 6}s infinite;
    `;
    document.body.appendChild(petal);
  }
}

// ─── FAIRY LIGHTS ────────────────────────────────────────────
function initFairyLights() {
  const container = document.querySelector('.fairy-lights');
  if (!container) return;
  const colors = ['#FFD700','#F48FB1','#B388EB','#4DD0E1','#E6D5FF','#FF6B6B'];
  const count = Math.floor(window.innerWidth / 55);
  for (let i = 0; i < count; i++) {
    const light = document.createElement('div');
    light.className = 'fairy-light';
    const col = colors[i % colors.length];
    light.style.cssText = `
      background: ${col};
      box-shadow: 0 0 6px 2px ${col};
      animation-delay: ${Math.random() * 2}s;
      animation-duration: ${1 + Math.random()}s;
    `;
    container.appendChild(light);
  }
}

// ─── TOAST NOTIFICATION ───────────────────────────────────────
function showToast(msg, duration = 3000) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ─── SUCCESS CELEBRATION ──────────────────────────────────────
function celebrate(cb) {
  launchConfetti(120);
  spawnBalloons(8);
  const ring = document.createElement('div');
  ring.className = 'success-ring';
  document.body.appendChild(ring);
  ring.addEventListener('animationend', () => ring.remove());
  playSound('success');
  if (cb) setTimeout(cb, 1800);
}

// ─── AMMA'S ANSWERS & EXCEL / GOOGLE SHEETS ENGINE ───────────
const AnswersSync = {
  KEY: 'amma_all_responses',

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY) || '[]');
    } catch {
      return [];
    }
  },

  record({ room, section, questionId, question, answer }) {
    if (!answer || !answer.trim()) return;
    const cleanAnswer = answer.trim();
    const timestamp = new Date().toLocaleString('en-IN', { timeZoneName: 'short' });

    const all = this.getAll();
    const existingIdx = all.findIndex(item => item.questionId === questionId);
    const recordObj = {
      timestamp,
      room: room || 'Questions',
      section: section || 'General',
      questionId: questionId || 'q_' + Date.now(),
      question: question || '',
      answer: cleanAnswer
    };

    if (existingIdx >= 0) {
      all[existingIdx] = recordObj;
    } else {
      all.push(recordObj);
    }

    try {
      localStorage.setItem(this.KEY, JSON.stringify(all));
    } catch {}

    // Dispatch to Google Sheets Webhook (if configured)
    const webhookUrl = (typeof CONFIG !== 'undefined' && CONFIG.sheetsWebhookUrl) ? CONFIG.sheetsWebhookUrl : '';
    if (webhookUrl && webhookUrl.trim()) {
      try {
        fetch(webhookUrl.trim(), {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(recordObj)
        }).catch(err => console.warn('Background sheet sync notice:', err));
      } catch (e) {
        console.warn('Background sheet sync notice:', e);
      }
    }

    return recordObj;
  },

  exportToExcel() {
    const all = this.getAll();
    if (all.length === 0) {
      showToast("No answers recorded yet, Amma! 🌸");
      return;
    }

    const headers = ['Timestamp', 'Room', 'Chapter / Section', 'Question', "Amma's Answer"];
    const rows = all.map(item => [
      `"${(item.timestamp || '').replace(/"/g, '""')}"`,
      `"${(item.room || '').replace(/"/g, '""')}"`,
      `"${(item.section || '').replace(/"/g, '""')}"`,
      `"${(item.question || '').replace(/"/g, '""')}"`,
      `"${(item.answer || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Amma_Birthday_Answers_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("📊 Amma's answers exported to Excel (.csv) successfully! ✨", 4500);
  }
};

// ─── SKIP SHORTCUT (Shift+S), RESET (Shift+R) & EXCEL (Shift+E) ──
document.addEventListener('keydown', (e) => {
  if (e.shiftKey && e.key === 'S') {
    const current = Progress.get();
    if (current < PAGES.length - 1) {
      Progress.unlock(current + 1);
      showToast(`🔓 Unlocked for Amma: ${PAGES[current + 1].label} 💛`);
      renderProgressBar(current + 1);
    } else {
      showToast('🎉 All rooms are already open for Amma!');
    }
  }
  if (e.shiftKey && e.key === 'R') {
    if (confirm('Reset all room progress for Amma?')) {
      Progress.reset();
      Guest.set('');
      localStorage.removeItem('bday_music_track');
      localStorage.removeItem('bday_music_pos');
      window.location.href = 'index.html';
    }
  }
  if (e.shiftKey && (e.key === 'E' || e.key === 'A')) {
    AnswersSync.exportToExcel();
  }
});

// ─── SHARED INIT (CALLED ON EVERY PAGE) ───────────────────────
function sharedInit(currentPageIndex) {
  // Show locked redirect message if needed
  if (sessionStorage.getItem('locked_redirect')) {
    sessionStorage.removeItem('locked_redirect');
    showToast("This room isn't open yet 🎈 Finish the little game to come in, Amma.", 4000);
  }

  // Progress bar
  renderProgressBar(currentPageIndex);

  // Get current page file
  const pageFile = PAGES[currentPageIndex] ? PAGES[currentPageIndex].file : 'index.html';

  // Initialize continuous music engine
  Music.init(pageFile);

  // Start music on first tap if not yet started
  const startMusic = () => {
    Music.start();
    document.removeEventListener('click', startMusic);
    document.removeEventListener('keydown', startMusic);
    document.removeEventListener('touchstart', startMusic);
  };
  document.addEventListener('click', startMusic);
  document.addEventListener('keydown', startMusic);
  document.addEventListener('touchstart', startMusic);

  // Ambient effects:
  // Appa room (10) is quiet, sacred and serene — no balloons or fairy lights
  // Hug room (12) has soft floating hearts
  if (currentPageIndex === 10) {
    initPetals(8);
  } else {
    initParticles();
    initFairyLights();
    initPetals(10);
  }

  loadSounds();
  injectFooterCredit();
}

// ─── FOOTER CREDIT (ON EVERY PAGE) ───────────────────────────
function injectFooterCredit() {
  if (document.getElementById('jd-footer-credit')) return;
  const footer = document.createElement('footer');
  footer.id = 'jd-footer-credit';
  footer.className = 'not-print';
  footer.style.cssText = `
    text-align: center;
    padding: 1.8rem 1rem 3.5rem;
    font-size: 0.8rem;
    font-family: var(--font-heading, serif);
    color: var(--purple-lavender, #D1C4E9);
    opacity: 0.65;
    letter-spacing: 0.08em;
    user-select: none;
    transition: opacity 0.3s;
  `;
  footer.innerHTML = `Built with love by JD ✦ for Amma 💜`;
  footer.addEventListener('mouseenter', () => footer.style.opacity = '1');
  footer.addEventListener('mouseleave', () => footer.style.opacity = '0.65');
  document.body.appendChild(footer);
}

// ─── SERVICE WORKER REGISTRATION ─────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration failed (e.g. file:// protocol) — ignore silently
    });
  });
}

// ─── LAZY LOADING FOR ALL IMAGES ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img:not([loading])').forEach(img => {
    img.setAttribute('loading', 'lazy');
  });
});

