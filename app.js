// MedIntellect Academy - FON Exam Prep Platform
// Created by Sen. Chima Chimdindu Macdonald (DAVINTODIGITAL)

document.addEventListener('DOMContentLoaded', () => {
  // PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(console.error);
  }

  // Navigation
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const menuBtn = document.getElementById('menu-btn');

  function openSidebar() { sidebar.classList.add('open'); overlay.classList.add('show'); }
  function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('show'); }

  menuBtn?.addEventListener('click', () => sidebar.classList.contains('open') ? closeSidebar() : openSidebar());
  overlay?.addEventListener('click', closeSidebar);

  window.showSection = function(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) {
      target.classList.add('active');
      const link = document.querySelector(`.nav-link[data-section="${id}"]`);
      if (link) link.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    closeSidebar();
  };

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('data-section');
      if (id) showSection(id);
    });
  });

  // Topic accordion
  document.querySelectorAll('.topic-header').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const body = hdr.nextElementSibling;
      const isOpen = body.classList.contains('open');
      // Close others in same parent optionally
      body.classList.toggle('open', !isOpen);
      hdr.classList.toggle('open', !isOpen);
      hdr.querySelector('.chev') && (hdr.querySelector('.chev').textContent = isOpen ? '▼' : '▲');
    });
  });

  // Toggle answers
  document.querySelectorAll('.toggle-ans').forEach(btn => {
    btn.addEventListener('click', () => {
      const box = btn.nextElementSibling;
      if (box && box.classList.contains('answer-box')) {
        box.classList.toggle('show');
        btn.textContent = box.classList.contains('show') ? 'Hide Answer' : 'Show Answer';
        btn.classList.toggle('revealed', box.classList.contains('show'));
      }
    });
  });

  // MCQ click
  document.querySelectorAll('.mcq-options').forEach(list => {
    const correct = list.dataset.correct;
    list.querySelectorAll('li').forEach((li, idx) => {
      li.addEventListener('click', () => {
        if (list.classList.contains('answered')) return;
        list.classList.add('answered');
        const letter = String.fromCharCode(65 + idx);
        if (letter === correct) {
          li.classList.add('correct');
        } else {
          li.classList.add('wrong');
          list.querySelectorAll('li').forEach((opt, i) => {
            if (String.fromCharCode(65 + i) === correct) opt.classList.add('correct');
          });
        }
        const ans = list.parentElement.querySelector('.answer-box');
        if (ans) ans.classList.add('show');
      });
    });
  });

  // Search
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      document.querySelectorAll('.question-card, .topic-item').forEach(el => {
        el.style.display = !q || el.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  }

  // Flashcards
  const flashData = [
    { front: "Define Nursing (Nightingale)", back: "Putting the patient in the best condition for nature to act upon him." },
    { front: "Define Nursing (Henderson)", back: "Assist the individual in activities contributing to health or recovery that they would perform unaided if they had the strength, will or knowledge." },
    { front: "Four Metaparadigm Concepts", back: "Person • Environment • Health • Nursing" },
    { front: "Maslow's Hierarchy (lowest → highest)", back: "Physiological → Safety → Love/Belonging → Esteem → Self-Actualization" },
    { front: "Five Steps of Nursing Process", back: "Assessment → Diagnosis → Planning → Implementation → Evaluation" },
    { front: "Six Links in Chain of Infection", back: "Infectious agent → Reservoir → Portal of exit → Mode of transmission → Portal of entry → Susceptible host" },
    { front: "WHO Five Moments for Hand Hygiene", back: "1. Before patient 2. Before clean/aseptic 3. After body fluid 4. After patient 5. After surroundings" },
    { front: "Normal Adult Vital Signs", back: "Temp 36.2–37.2°C • Pulse 60–100 • Resp 12–20 • BP ≈120/80 • SpO₂ 95–100%" },
    { front: "COPD Oxygen Target", back: "SpO₂ 88–92% (to avoid suppressing hypoxic drive)" },
    { front: "Three Common IM Injection Sites", back: "1. Upper outer quadrant of buttock 2. Outer aspect of thigh 3. Deltoid\nAvoid sciatic nerve in gluteal site." },
    { front: "Orem's Three Nursing Systems", back: "Wholly compensatory • Partly compensatory • Supportive-educative" },
    { front: "Peplau's Four Phases", back: "Orientation → Identification → Exploitation/Working → Resolution" },
    { front: "Medical vs Surgical Asepsis", back: "Medical = Clean technique (reduce microbes)\nSurgical = Sterile technique (eliminate all microbes including spores)" },
    { front: "PQRST Pain Assessment", back: "P – Provoking/Relieving\nQ – Quality\nR – Region/Radiation\nS – Severity\nT – Timing" },
    { front: "Oxygen Safety Rules", back: "No flames/smoking/petroleum products • Humidify ≥4 L/min • Monitor toxicity • COPD target 88–92%" },
    { front: "Dangerous Drugs Control", back: "Locked cupboard • Controlled key custody • Accurate register • Check at change of shift" },
    { front: "Room Air Oxygen Concentration", back: "Approximately 21%" },
    { front: "Nasal Cannula Flow & FiO₂", back: "1–6 L/min → approx FiO₂ 24–44%" },
    { front: "Venturi Mask Advantage", back: "Provides relatively precise, controlled FiO₂ (ideal for COPD)" },
    { front: "Ethical Principles (key ones)", back: "Autonomy • Beneficence • Non-maleficence • Justice • Veracity • Confidentiality • Accountability" }
  ];

  let flashIndex = 0;
  const flashCard = document.getElementById('flashcard');
  const flashFront = document.getElementById('flash-front');
  const flashBack = document.getElementById('flash-back');
  const flashCounter = document.getElementById('flash-counter');

  function renderFlash() {
    if (!flashFront) return;
    const item = flashData[flashIndex];
    flashFront.textContent = item.front;
    flashBack.textContent = item.back;
    if (flashCounter) flashCounter.textContent = `${flashIndex + 1} / ${flashData.length}`;
    flashCard?.classList.remove('flipped');
  }

  flashCard?.addEventListener('click', () => flashCard.classList.toggle('flipped'));
  document.getElementById('flash-prev')?.addEventListener('click', () => {
    flashIndex = (flashIndex - 1 + flashData.length) % flashData.length;
    renderFlash();
  });
  document.getElementById('flash-next')?.addEventListener('click', () => {
    flashIndex = (flashIndex + 1) % flashData.length;
    renderFlash();
  });
  renderFlash();

  // Install prompt
  let deferredPrompt;
  const installBanner = document.getElementById('install-banner');
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredPrompt = e;
    installBanner?.classList.add('show');
  });
  document.getElementById('install-btn')?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBanner?.classList.remove('show');
  });
  document.getElementById('dismiss-install')?.addEventListener('click', () => {
    installBanner?.classList.remove('show');
  });

  // Progress (simple localStorage)
  const PROGRESS_KEY = 'fon_academy_progress_v1';
  function loadProgress() {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || { quizzes: [], flashDone: 0 }; }
    catch { return { quizzes: [], flashDone: 0 }; }
  }
  function saveProgress(data) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
    updateProgressUI();
  }
  function updateProgressUI() {
    const p = loadProgress();
    const el = document.getElementById('progress-stats');
    if (!el) return;
    const attempts = p.quizzes.length;
    const avg = attempts ? Math.round(p.quizzes.reduce((s, q) => s + q.score, 0) / attempts) : 0;
    const best = attempts ? Math.max(...p.quizzes.map(q => q.score)) : 0;
    el.innerHTML = `
      <div class="stat-box"><div class="val">${attempts}</div><div class="lbl">Quiz Attempts</div></div>
      <div class="stat-box"><div class="val">${avg}%</div><div class="lbl">Average Score</div></div>
      <div class="stat-box"><div class="val">${best}%</div><div class="lbl">Best Score</div></div>
      <div class="stat-box"><div class="val">${p.flashDone || 0}</div><div class="lbl">Flashcards Reviewed</div></div>
    `;
  }
  updateProgressUI();

  // Simple practice score saver (called from quiz section if needed)
  window.recordQuizScore = function(score) {
    const p = loadProgress();
    p.quizzes.unshift({ score, date: new Date().toLocaleString() });
    p.quizzes = p.quizzes.slice(0, 15);
    saveProgress(p);
  };

  // Default section
  showSection('home');
});
