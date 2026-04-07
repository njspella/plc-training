const App = (function () {
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

  let currentRoute = '';
  let slideState = null; // { moduleId, lessonId, slides, currentSlide, direction }

  function init() {
    window.addEventListener('hashchange', route);
    window.addEventListener('keydown', handleKeydown);
    speechSynthesis.getVoices();
    route();
    updateNavProgress();
  }

  function navigate(hash) { window.location.hash = hash; }

  function handleKeydown(e) {
    if (!slideState) return;
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); slideNext(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); slidePrev(); }
    else if (e.key === 'Escape') { closeSlideShow(); }
  }

  function route() {
    const hash = window.location.hash.slice(1) || '/';
    currentRoute = hash;
    const main = $('#main-content');
    const sidebar = $('#sidebar');

    if (hash.startsWith('/module/') && hash.includes('/lesson/')) {
      const parts = hash.split('/');
      const moduleId = parseInt(parts[2]);
      const lessonId = parseInt(parts[4]);
      openSlideShow(moduleId, lessonId);
      return;
    }

    // Close slide deck if navigating away from lesson
    if (slideState) closeSlideShow(true);

    if (hash === '/') {
      renderDashboard(main);
      sidebar.classList.add('hidden');
      main.classList.add('full-width');
    } else if (hash.startsWith('/module/') && hash.endsWith('/quiz')) {
      const moduleId = parseInt(hash.split('/')[2]);
      renderQuiz(main, moduleId);
      renderLessonSidebar(sidebar, moduleId, null);
      sidebar.classList.remove('hidden');
      main.classList.remove('full-width');
    } else if (hash.startsWith('/module/')) {
      const moduleId = parseInt(hash.split('/')[2]);
      renderModule(main, moduleId);
      renderModuleSidebar(sidebar, moduleId);
      sidebar.classList.remove('hidden');
      main.classList.remove('full-width');
    } else if (hash === '/scenarios') {
      renderScenarios(main);
      sidebar.classList.add('hidden');
      main.classList.add('full-width');
    } else if (hash.startsWith('/scenario/')) {
      const scenarioId = parseInt(hash.split('/')[2]);
      renderScenarioDetail(main, scenarioId);
      sidebar.classList.add('hidden');
      main.classList.add('full-width');
    } else if (hash === '/handouts') {
      renderHandouts(main);
      sidebar.classList.add('hidden');
      main.classList.add('full-width');
    } else if (hash === '/escalation') {
      renderEscalation(main);
      sidebar.classList.add('hidden');
      main.classList.add('full-width');
    } else if (hash === '/knowledge-check') {
      renderKnowledgeCheck(main);
      sidebar.classList.add('hidden');
      main.classList.add('full-width');
    } else {
      renderDashboard(main);
      sidebar.classList.add('hidden');
      main.classList.add('full-width');
    }

    updateNavProgress();
    window.scrollTo(0, 0);
    const sidebarEl = $('#sidebar');
    if (sidebarEl.classList.contains('open')) sidebarEl.classList.remove('open');
  }

  function updateNavProgress() {
    const pct = Progress.getOverallProgress();
    const badge = $('#nav-progress');
    if (badge) {
      badge.innerHTML = `
        <svg class="progress-ring" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="3"/>
          <circle cx="10" cy="10" r="8" fill="none" stroke="${pct >= 100 ? '#22c55e' : '#e8a820'}" stroke-width="3"
            stroke-dasharray="${(pct / 100) * 50.27} 50.27" stroke-linecap="round"
            transform="rotate(-90 10 10)"/>
        </svg>
        ${pct}% Complete`;
    }
  }

  // ===== SVG ICONS =====
  function icon(name, size) {
    const s = size || 20;
    const icons = {
      shield: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
      cpu: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`,
      zap: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
      monitor: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
      search: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
      radar: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18H12.01"/><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"/><circle cx="12" cy="12" r="2"/></svg>`,
      layout: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
      wrench: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
      layers: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
      chevronRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`,
      chevronLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`,
      check: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`,
      arrowLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
      clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      fileText: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`,
      alertTriangle: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
      pause: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`,
      play: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
      stop: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`,
      volume: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
      x: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
      camera: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
    };
    return icons[name] || '';
  }

  // ===== PLACEHOLDER IMAGE =====
  function placeholderImage(alt, caption) {
    return `<div class="placeholder-img">
      <div class="ph-icon">${icon('camera')}</div>
      <div class="ph-label">${alt || caption || 'Equipment Photo'}</div>
      <div class="ph-hint">Replace with actual photo</div>
    </div>`;
  }

  // ===== TTS ENGINE =====
  const DWELL_TIME_MS = 10000; // ms for trainees to read after narration (not used after title slide)

  const TTS = {
    playing: false,
    autoPlaying: false,
    moduleAutoPlay: false, // full-module mode: pause between lessons
    utterance: null,
    dwellTimer: null,

    getVoice() {
      const voices = speechSynthesis.getVoices();
      // Prefer natural-sounding voices across platforms
      const prefs = [
        'Microsoft Jenny', 'Microsoft Aria', 'Google UK English Female',
        'Google US English', 'Samantha', 'Karen', 'Daniel',
        'Microsoft Zira', 'Moira', 'Fiona', 'Tessa'
      ];
      for (const pref of prefs) {
        const v = voices.find(v => v.name.includes(pref));
        if (v) return v;
      }
      const english = voices.filter(v => v.lang.startsWith('en'));
      return english[0] || voices[0];
    },

    stripHtml(html) {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    },

    cleanForSpeech(text) {
      let t = text;
      // SR ticket references: "SR-124812" -> "S R dash 124812"
      t = t.replace(/SR[-–](\d+)/g, 'S R dash $1');
      // Remove arrow characters and symbols
      t = t.replace(/[→←↑↓►▶◀▸▹▷▻►]/g, '');
      t = t.replace(/--\[.*?\]--/g, ''); // ladder logic symbols like --[ ]--
      t = t.replace(/-{2,}/g, ' '); // double dashes
      // Remove leftover HTML artifacts
      t = t.replace(/<[^>]*>/g, '');
      // Clean up whitespace and repeated periods
      t = t.replace(/\.\s*\./g, '.').replace(/\s+/g, ' ').trim();
      return t;
    },

    // Full slide narration (all readable text on the slide)
    getSlideText(slide) {
      if (slide.type === 'demo') {
        return 'Now it is time to do a walkthrough.';
      }

      let parts = [];

      if (slide.type === 'title') {
        if (slide.title) parts.push(slide.title);
        if (slide.subtitle) parts.push(slide.subtitle);
        return this.cleanForSpeech(parts.join('. '));
      }

      if (slide.heading) parts.push(slide.heading);

      if (slide.blocks) {
        for (const b of slide.blocks) {
          switch (b.type) {
            case 'paragraph':
              parts.push(this.stripHtml(b.text));
              break;
            case 'heading': case 'subheading':
              parts.push(b.text);
              break;
            case 'list': case 'numbered': case 'steps':
              parts.push(...b.items.map(i => this.stripHtml(i)));
              break;
            case 'callout':
              parts.push(b.title + '. ' + this.stripHtml(b.text));
              break;
            case 'image':
              if (b.caption) parts.push(b.caption);
              break;
            case 'table':
              parts.push('Table columns: ' + b.headers.join(', ') + '.');
              for (const row of b.rows) {
                parts.push(row.join(', '));
              }
              break;
          }
        }
      }

      return this.cleanForSpeech(parts.join('. ').replace(/\.\./g, '.'));
    },

    speak(text, onEnd) {
      speechSynthesis.cancel();
      if (this.dwellTimer) { clearTimeout(this.dwellTimer); this.dwellTimer = null; }
      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = this.getVoice();
      utter.rate = 0.95;
      utter.pitch = 1.0;
      utter.volume = 1;
      utter.onend = () => { this.playing = false; if (onEnd) onEnd(); };
      utter.onerror = () => { this.playing = false; if (onEnd) onEnd(); };
      speechSynthesis.speak(utter);
      this.playing = true;
      this.utterance = utter;
    },

    speakSlide(slide, onDone) {
      const text = this.getSlideText(slide);
      if (!text.trim()) { if (onDone) onDone(); return; }
      this.speak(text, onDone);
    },

    stop() {
      speechSynthesis.cancel();
      if (this.dwellTimer) { clearTimeout(this.dwellTimer); this.dwellTimer = null; }
      this.playing = false;
      this.autoPlaying = false;
      this.moduleAutoPlay = false;
    },

    pauseResume() {
      if (speechSynthesis.paused) speechSynthesis.resume();
      else if (speechSynthesis.speaking) speechSynthesis.pause();
    }
  };

  // ===== SLIDE DECK =====
  function buildSlides(mod, lesson) {
    const slides = [];

    // Title slide
    slides.push({
      type: 'title',
      moduleTag: mod.id === 0 ? 'Pre-Module' : 'Module ' + mod.id,
      title: lesson.title,
      subtitle: lesson.summary,
      icon: mod.icon
    });

    // Break content into slides by heading
    let current = null;
    for (const block of lesson.content) {
      if (block.type === 'heading' || block.type === 'subheading') {
        if (current && current.blocks.length > 0) slides.push(current);
        current = { type: 'content', heading: block.text, blocks: [] };
      } else {
        if (!current) current = { type: 'content', heading: '', blocks: [] };
        current.blocks.push(block);
        // Split if too many blocks for one slide
        if (current.blocks.length >= 5 && block.type !== 'image') {
          slides.push(current);
          current = { type: 'content', heading: '', blocks: [] };
        }
      }
    }
    if (current && current.blocks.length > 0) slides.push(current);

    // Demo break slide if applicable
    if (mod.demoBreaks) {
      const demo = mod.demoBreaks.find(d => d.after === lesson.title);
      if (demo) {
        slides.push({
          type: 'demo',
          title: demo.title,
          duration: demo.duration,
          demoDescription: demo.description,
          demoActivity: demo.activity
        });
      }
    }

    return slides;
  }

  function openSlideShow(moduleId, lessonId) {
    const mod = TrainingData.modules.find(m => m.id === moduleId);
    if (!mod) return;
    const lesson = mod.lessons.find(l => l.id === lessonId);
    if (!lesson) return;

    const slides = buildSlides(mod, lesson);
    slideState = {
      moduleId, lessonId, mod, lesson, slides,
      currentSlide: 0,
      direction: 'right'
    };

    let existing = $('#slide-deck');
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'slide-deck';
      existing.className = 'slide-deck';
      document.body.appendChild(existing);
    }

    renderSlideDeck();
  }

  function closeSlideShow(skipNav) {
    TTS.stop();
    const deck = $('#slide-deck');
    if (deck) deck.remove();

    if (slideState && !skipNav) {
      const { moduleId, lessonId } = slideState;
      Progress.setLessonComplete(moduleId, lessonId);
      updateNavProgress();
    }
    slideState = null;
    if (!skipNav) {
      const hash = window.location.hash.slice(1);
      const parts = hash.split('/');
      if (parts.length >= 3) {
        window.location.hash = '#/module/' + parts[2];
      }
    }
  }

  function slideNext() {
    if (!slideState || slideState.currentSlide >= slideState.slides.length - 1) return;
    slideState.currentSlide++;
    slideState.direction = 'right';
    renderSlideContent();
    if (TTS.autoPlaying) speakCurrentSlide();
  }

  function slidePrev() {
    if (!slideState || slideState.currentSlide <= 0) return;
    slideState.currentSlide--;
    slideState.direction = 'left';
    renderSlideContent();
    if (TTS.autoPlaying) speakCurrentSlide();
  }

  function slideGoTo(idx) {
    if (!slideState || idx < 0 || idx >= slideState.slides.length) return;
    slideState.direction = idx > slideState.currentSlide ? 'right' : 'left';
    slideState.currentSlide = idx;
    renderSlideContent();
    if (TTS.autoPlaying) speakCurrentSlide();
  }

  function speakCurrentSlide() {
    if (!slideState) return;
    const slide = slideState.slides[slideState.currentSlide];

    // Demo slide: say the walkthrough line, then STOP auto-play (trainer takes over)
    if (slide.type === 'demo') {
      TTS.speak('Now it is time to do a walkthrough.', () => {
        TTS.autoPlaying = false;
        updateTTSButton();
        // If in module-auto mode, we also stop and wait for trainer
        showContinueOverlay('Demo complete. Press Continue when ready.');
      });
      return;
    }

    TTS.speakSlide(slide, () => {
      if (TTS.autoPlaying && slideState) {
        if (slideState.currentSlide < slideState.slides.length - 1) {
          // No long dwell after the title slide; later slides get time to read
          const delayMs = slideState.currentSlide === 0 ? 600 : DWELL_TIME_MS;
          TTS.dwellTimer = setTimeout(slideNext, delayMs);
        } else {
          // End of this lesson's slides
          TTS.autoPlaying = false;
          updateTTSButton();
          if (TTS.moduleAutoPlay) {
            // In full-module mode: stop and show "Continue to next lesson" prompt
            const lessonIdx = slideState.mod.lessons.findIndex(l => l.id === slideState.lessonId);
            const nextLesson = slideState.mod.lessons[lessonIdx + 1];
            if (nextLesson) {
              Progress.setLessonComplete(slideState.moduleId, slideState.lessonId);
              showContinueOverlay('Lesson complete. Press Continue for: ' + nextLesson.title);
            } else {
              Progress.setLessonComplete(slideState.moduleId, slideState.lessonId);
              showContinueOverlay('All lessons in this module are complete.');
              TTS.moduleAutoPlay = false;
            }
          }
        }
      }
    });
  }

  function showContinueOverlay(message) {
    let overlay = $('#continue-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'continue-overlay';
      overlay.style.cssText = 'position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(11,22,40,0.85);z-index:10;';
      const vp = $('.slide-viewport');
      if (vp) { vp.style.position = 'relative'; vp.appendChild(overlay); }
    }
    overlay.innerHTML = `
      <div style="text-align:center;color:white">
        <p style="font-size:18px;margin-bottom:20px;opacity:0.9">${message}</p>
        <button onclick="App.continueFromOverlay()" style="
          padding:14px 40px;border-radius:10px;border:none;
          background:var(--color-accent);color:var(--color-primary-dark);
          font-size:16px;font-weight:600;cursor:pointer;
          transition:transform 0.15s ease;
        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
          Continue ${icon('chevronRight')}
        </button>
      </div>`;
  }

  function continueFromOverlay() {
    const overlay = $('#continue-overlay');
    if (overlay) overlay.remove();

    if (!slideState) return;

    if (TTS.moduleAutoPlay) {
      // Advance to the next lesson
      const lessonIdx = slideState.mod.lessons.findIndex(l => l.id === slideState.lessonId);
      const nextLesson = slideState.mod.lessons[lessonIdx + 1];
      if (nextLesson) {
        openSlideShow(slideState.moduleId, nextLesson.id);
        setTimeout(() => {
          TTS.autoPlaying = true;
          TTS.moduleAutoPlay = true;
          updateTTSButton();
          speakCurrentSlide();
        }, 500);
      } else {
        closeSlideShow();
      }
    } else {
      // Just a demo break pause: resume auto-play on the next slide
      TTS.autoPlaying = true;
      updateTTSButton();
      if (slideState.currentSlide < slideState.slides.length - 1) {
        slideNext();
      }
    }
  }

  function toggleAutoPlay() {
    if (TTS.autoPlaying) {
      TTS.stop();
      updateTTSButton();
    } else {
      TTS.autoPlaying = true;
      TTS.moduleAutoPlay = false;
      updateTTSButton();
      speakCurrentSlide();
    }
  }

  function speakCurrentOnly() {
    if (TTS.playing) {
      TTS.stop();
      updateTTSButton();
    } else {
      TTS.autoPlaying = false;
      if (!slideState) return;
      TTS.speakSlide(slideState.slides[slideState.currentSlide], () => {
        updateTTSButton();
      });
      updateTTSButton();
    }
  }

  function updateTTSButton() {
    const autoBtn = $('#tts-auto-btn');
    const speakBtn = $('#tts-speak-btn');
    if (autoBtn) {
      autoBtn.className = 'tts-btn' + (TTS.autoPlaying ? ' playing' : '');
      autoBtn.innerHTML = TTS.autoPlaying
        ? `${icon('stop')} Stop`
        : `${icon('play')} Auto-Play with Narration`;
    }
    if (speakBtn) {
      speakBtn.className = 'tts-btn' + (TTS.playing && !TTS.autoPlaying ? ' playing' : '');
    }
  }

  function renderSlideDeck() {
    const deck = $('#slide-deck');
    const s = slideState;
    const total = s.slides.length;
    const lessonIdx = s.mod.lessons.findIndex(l => l.id === s.lessonId);
    const hasNext = lessonIdx < s.mod.lessons.length - 1;
    const nextLesson = hasNext ? s.mod.lessons[lessonIdx + 1] : null;

    deck.innerHTML = `
      <div class="slide-toolbar">
        <div class="st-left">
          <span>${s.mod.id === 0 ? 'Pre-Module' : 'Module ' + s.mod.id}: ${s.mod.title}</span>
        </div>
        <div class="st-center">
          <span id="slide-counter">Slide <strong>${s.currentSlide + 1}</strong> of ${total}</span>
        </div>
        <div class="st-right">
          ${nextLesson ? `<button onclick="App.openSlideShow(${s.moduleId},${nextLesson.id})" title="Next lesson">Next: ${nextLesson.title} ${icon('chevronRight')}</button>` : ''}
          <button onclick="App.markAndClose(${s.moduleId},${s.lessonId})" title="Mark complete & close">${icon('check')} Complete</button>
          <button onclick="App.closeSlideShow()" title="Close">${icon('x')}</button>
        </div>
      </div>
      <div class="slide-viewport">
        <div class="slide-arrow left ${s.currentSlide === 0 ? 'disabled' : ''}" onclick="App.slidePrev()">${icon('chevronLeft', 24)}</div>
        <div id="slide-container"></div>
        <div class="slide-arrow right ${s.currentSlide >= total - 1 ? 'disabled' : ''}" onclick="App.slideNext()">${icon('chevronRight', 24)}</div>
      </div>
      <div class="slide-controls">
        <div class="slide-dots" id="slide-dots"></div>
        <div class="tts-controls">
          <button class="tts-btn" id="tts-speak-btn" onclick="App.speakCurrentOnly()" title="Read this slide">${icon('volume')} Read Slide</button>
          <button class="tts-btn" id="tts-auto-btn" onclick="App.toggleAutoPlay()">${icon('play')} Auto-Play with Narration</button>
        </div>
      </div>`;

    renderSlideContent();
  }

  function renderSlideContent() {
    const s = slideState;
    const slide = s.slides[s.currentSlide];
    const container = $('#slide-container');
    const dir = s.direction === 'right' ? 'enter-right' : 'enter-left';

    let html = '';

    if (slide.type === 'title') {
      html = `<div class="slide title-slide ${dir}">
        <div class="slide-accent-bar"></div>
        <div class="slide-inner">
          <div class="slide-icon">${icon(slide.icon, 40)}</div>
          <div class="slide-module-tag">${slide.moduleTag}</div>
          <h1>${slide.title}</h1>
          <p>${slide.subtitle}</p>
        </div>
      </div>`;
    } else if (slide.type === 'demo') {
      html = `<div class="slide demo-slide ${dir}">
        <div class="slide-inner">
          <div class="demo-badge">${icon('pause')} Physical Demo Break — ${slide.duration}</div>
          <h2>${slide.title}</h2>
          <p><strong>Take the class to the PLC bench.</strong></p>
          <p>${slide.demoDescription}</p>
          <div class="demo-activity"><strong>Student Activity:</strong> ${slide.demoActivity}</div>
        </div>
      </div>`;
    } else {
      html = `<div class="slide content-slide ${dir}">
        <div class="slide-accent-bar"></div>
        <div class="slide-inner">
          ${slide.heading ? `<h2>${slide.heading}</h2>` : ''}
          ${renderSlideBlocks(slide.blocks)}
        </div>
      </div>`;
    }

    container.innerHTML = html;

    // Update dots
    const dotsEl = $('#slide-dots');
    if (dotsEl) {
      let dots = '';
      for (let i = 0; i < s.slides.length; i++) {
        dots += `<div class="slide-dot ${i === s.currentSlide ? 'active' : i < s.currentSlide ? 'visited' : ''}" onclick="App.slideGoTo(${i})"></div>`;
      }
      dotsEl.innerHTML = dots;
    }

    // Update counter
    const counter = $('#slide-counter');
    if (counter) counter.innerHTML = `Slide <strong>${s.currentSlide + 1}</strong> of ${s.slides.length}`;

    // Update arrows
    const leftArrow = $('.slide-arrow.left');
    const rightArrow = $('.slide-arrow.right');
    if (leftArrow) leftArrow.classList.toggle('disabled', s.currentSlide === 0);
    if (rightArrow) rightArrow.classList.toggle('disabled', s.currentSlide >= s.slides.length - 1);
  }

  function renderSlideBlocks(blocks) {
    let html = '';
    for (const b of blocks) {
      switch (b.type) {
        case 'paragraph':
          html += `<p>${b.text}</p>`;
          break;
        case 'heading':
          html += `<h2>${b.text}</h2>`;
          break;
        case 'list':
          html += `<ul>${b.items.map(i => `<li>${i}</li>`).join('')}</ul>`;
          break;
        case 'numbered':
          html += `<ol>${b.items.map(i => `<li>${i}</li>`).join('')}</ol>`;
          break;
        case 'steps':
          html += `<ol class="steps-list">${b.items.map(i => `<li>${i}</li>`).join('')}</ol>`;
          break;
        case 'image':
          html += placeholderImage(b.alt, b.caption);
          if (b.caption) html += `<p class="image-caption">${b.caption}</p>`;
          break;
        case 'callout':
          html += `<div class="callout ${b.variant}">
            <div class="callout-title">${b.variant === 'danger' || b.variant === 'warning' ? icon('alertTriangle') : b.variant === 'info' ? icon('info') : icon('check')} ${b.title}</div>
            <div>${b.text}</div>
          </div>`;
          break;
        case 'table':
          html += `<table class="content-table"><thead><tr>${b.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>`;
          for (const row of b.rows) {
            html += `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`;
          }
          html += `</tbody></table>`;
          break;
      }
    }
    return html;
  }

  function markAndClose(moduleId, lessonId) {
    Progress.setLessonComplete(moduleId, lessonId);
    closeSlideShow();
  }

  // ============ DASHBOARD ============
  function renderDashboard(el) {
    const pct = Progress.getOverallProgress();
    let html = `<div class="animate-in">`;

    html += `
      <div class="dashboard-hero">
        <h1>${TrainingData.title}</h1>
        <p>${TrainingData.subtitle}</p>
        <div class="meta">
          <span class="meta-item">${icon('clock')} ${TrainingData.totalHours} hours over 3.5 days</span>
          <span class="meta-item">${icon('fileText')} ${TrainingData.modules.length} modules</span>
          <span class="meta-item">v${TrainingData.version} — ${TrainingData.revisionDate}</span>
        </div>
        <div class="overall-progress">
          <div class="progress-label"><span>Overall Progress</span><span>${pct}%</span></div>
          <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
        </div>
      </div>`;

    html += `
      <div class="info-cards" style="margin-bottom:32px">
        <div class="info-card" style="cursor:pointer" onclick="location.hash='#/scenarios'">
          <h4>${icon('wrench')} Hands-On Scenarios</h4>
          <p style="font-size:13px;color:var(--color-text-secondary)">5 fault scenarios for the trainer to walk through with the class on the tabletop PLC bench.</p>
        </div>
        <div class="info-card" style="cursor:pointer" onclick="location.hash='#/handouts'">
          <h4>${icon('fileText')} Handouts & Reference Cards</h4>
          <p style="font-size:13px;color:var(--color-text-secondary)">Printable materials: ladder logic reference, wiring diagrams, IP cheat sheet, escalation card.</p>
        </div>
        <div class="info-card" style="cursor:pointer" onclick="location.hash='#/knowledge-check'">
          <h4>${icon('search')} Written Knowledge Check</h4>
          <p style="font-size:13px;color:var(--color-text-secondary)">20-question written assessment. 80% passing score required.</p>
        </div>
        <div class="info-card" style="cursor:pointer" onclick="location.hash='#/escalation'">
          <h4>${icon('alertTriangle')} Escalation Procedures</h4>
          <p style="font-size:13px;color:var(--color-text-secondary)">3-level escalation decision tree and documentation requirements.</p>
        </div>
      </div>`;

    html += `<h2 class="section-title">Training Modules</h2><div class="module-grid">`;
    for (const mod of TrainingData.modules) {
      const modPct = Progress.getModuleProgress(mod.id);
      const complete = Progress.isModuleComplete(mod.id);
      html += `
        <div class="module-card ${complete ? 'completed' : ''}" onclick="location.hash='#/module/${mod.id}'">
          <div class="module-number">${mod.id === 0 ? 'Pre-Module' : 'Module ' + mod.id} — ${mod.hours} hrs</div>
          <h3>${mod.title}</h3>
          <div class="module-meta">
            <span>${icon('clock')} ${mod.format}</span>
            <span>${mod.lessons.length} lessons</span>
            ${mod.quiz.length ? `<span>${mod.quiz.length} quiz questions</span>` : ''}
          </div>
          <div class="module-progress">
            <div class="progress-bar-track"><div class="progress-bar-fill" style="width:${modPct}%"></div></div>
            <div class="progress-text">${complete ? 'Completed' : modPct + '% complete'}</div>
          </div>
        </div>`;
    }
    html += `</div>`;

    html += `<h2 class="section-title">Prerequisites & Required Access</h2><div class="info-cards">`;
    html += `<div class="info-card"><h4>Baseline Skills Required</h4><ul>`;
    for (const skill of TrainingData.prerequisites.skills) html += `<li>${skill}</li>`;
    html += `</ul></div><div class="info-card"><h4>Software Access (Request Before Training)</h4><ul>`;
    for (const sw of TrainingData.prerequisites.software) html += `<li><strong>${sw.name}</strong> — ${sw.notes} (Ref: ${sw.ref})</li>`;
    html += `</ul></div></div></div>`;
    el.innerHTML = html;
  }

  // ============ MODULE OVERVIEW ============
  function renderModule(el, moduleId) {
    const mod = TrainingData.modules.find(m => m.id === moduleId);
    if (!mod) { renderDashboard(el); return; }

    let html = `<div class="animate-in">
      <div class="module-header">
        <div class="breadcrumb"><a href="#/">Dashboard</a> / ${mod.id === 0 ? 'Pre-Module' : 'Module ' + mod.id}</div>
        <h1>${icon(mod.icon)} ${mod.title}</h1>
        <p class="module-description">${mod.description}</p>
        <div class="module-meta" style="font-size:14px;color:var(--color-text-secondary);margin-bottom:0">
          <span>${icon('clock')} ${mod.hours} hours</span><span>${mod.format}</span>
        </div>
      </div>`;

    if (mod.objectives.length) {
      html += `<div class="objectives-box"><h3>${icon('check')} Learning Objectives</h3><ul>`;
      for (const obj of mod.objectives) html += `<li>${obj}</li>`;
      html += `</ul></div>`;
    }

    // Auto-play entire module button
    html += `<div style="margin-bottom:24px">
      <button class="btn btn-primary" onclick="App.autoPlayModule(${mod.id})" style="display:inline-flex;align-items:center;gap:8px;padding:10px 24px;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;border:none;background:var(--color-primary);color:white">
        ${icon('play')} Present Entire Module with Narration
      </button>
    </div>`;

    html += `<h2 class="section-title">Lessons</h2><div class="lesson-list">`;
    for (const lesson of mod.lessons) {
      const done = Progress.isLessonComplete(mod.id, lesson.id);
      html += `
        <div class="lesson-list-item" onclick="location.hash='#/module/${mod.id}/lesson/${lesson.id}'">
          <div class="lesson-num ${done ? 'done' : ''}">${done ? icon('check') : lesson.id}</div>
          <div class="lesson-info"><h4>${lesson.title}</h4><p>${lesson.summary}</p></div>
          ${icon('chevronRight')}
        </div>`;
    }
    html += `</div>`;

    if (mod.demoBreaks && mod.demoBreaks.length) {
      html += `<h2 class="section-title" style="margin-top:32px">${icon('pause')} Physical Demonstration Breaks</h2>
        <p style="font-size:14px;color:var(--color-text-secondary);margin-bottom:16px">Trainer: Stop the classroom portion and take the class to the tabletop PLC bench at these points.</p>`;
      for (const demo of mod.demoBreaks) {
        html += `<div class="callout tip" style="margin-bottom:12px">
          <div class="callout-title">${icon('pause')} ${demo.title} (${demo.duration}) — After: "${demo.after}"</div>
          <p style="margin-bottom:8px"><strong>Demonstrate:</strong> ${demo.description}</p>
          <p><strong>Student Activity:</strong> ${demo.activity}</p>
        </div>`;
      }
    }

    if (mod.quiz && mod.quiz.length) {
      const quizResult = Progress.getQuizResult(mod.id);
      html += `<div style="margin-top:24px">`;
      if (quizResult) {
        html += `<div style="margin-bottom:12px"><span class="quiz-result-badge ${quizResult.passed ? 'passed' : 'failed'}">${quizResult.passed ? icon('check') + ' Passed' : 'Did not pass'} — ${quizResult.score}/${quizResult.total} (${Math.round(quizResult.score/quizResult.total*100)}%)</span></div>`;
      }
      html += `<div class="quiz-cta" onclick="location.hash='#/module/${mod.id}/quiz'">
        <div><h3>${quizResult ? 'Retake' : 'Take'} Module Quiz</h3><p>${mod.quiz.length} questions — 80% required to pass</p></div>
        <span class="arrow">${icon('chevronRight')}</span>
      </div></div>`;
    }

    html += `</div>`;
    el.innerHTML = html;
  }

  function autoPlayModule(moduleId) {
    const mod = TrainingData.modules.find(m => m.id === moduleId);
    if (!mod || mod.lessons.length === 0) return;
    openSlideShow(moduleId, mod.lessons[0].id);
    setTimeout(() => {
      TTS.autoPlaying = true;
      TTS.moduleAutoPlay = true;
      updateTTSButton();
      speakCurrentSlide();
    }, 500);
  }

  // ============ SIDEBARS ============
  function renderModuleSidebar(sidebar, moduleId) {
    const mod = TrainingData.modules.find(m => m.id === moduleId);
    if (!mod) return;
    let html = `<div class="sidebar-back" onclick="location.hash='#/'">${icon('arrowLeft')} All Modules</div>
      <div class="sidebar-section"><div class="sidebar-section-title">${mod.id === 0 ? 'Pre-Module' : 'Module ' + mod.id}</div>`;
    for (const lesson of mod.lessons) {
      const done = Progress.isLessonComplete(mod.id, lesson.id);
      html += `<div class="sidebar-item" onclick="location.hash='#/module/${mod.id}/lesson/${lesson.id}'">
        <span class="check ${done ? 'done' : ''}">${done ? icon('check') : ''}</span>
        <span class="item-label">${lesson.title}</span>
      </div>`;
    }
    if (mod.quiz && mod.quiz.length) {
      html += `<div class="sidebar-divider"></div>`;
      const qr = Progress.getQuizResult(mod.id);
      html += `<div class="sidebar-item" onclick="location.hash='#/module/${mod.id}/quiz'">
        <span class="check ${qr && qr.passed ? 'done' : ''}">${qr && qr.passed ? icon('check') : ''}</span>
        <span class="item-label">Module Quiz</span>
      </div>`;
    }
    html += `</div>`;
    sidebar.innerHTML = html;
  }

  function renderLessonSidebar(sidebar, moduleId, activeLessonId) {
    const mod = TrainingData.modules.find(m => m.id === moduleId);
    if (!mod) return;
    let html = `<div class="sidebar-back" onclick="location.hash='#/module/${mod.id}'">${icon('arrowLeft')} ${mod.title}</div>
      <div class="sidebar-section"><div class="sidebar-section-title">Lessons</div>`;
    for (const lesson of mod.lessons) {
      const done = Progress.isLessonComplete(mod.id, lesson.id);
      const active = lesson.id === activeLessonId;
      html += `<div class="sidebar-item ${active ? 'active' : ''}" onclick="location.hash='#/module/${mod.id}/lesson/${lesson.id}'">
        <span class="check ${done ? 'done' : ''}">${done ? icon('check') : ''}</span>
        <span class="item-label">${lesson.title}</span>
      </div>`;
    }
    if (mod.quiz && mod.quiz.length) {
      html += `<div class="sidebar-divider"></div>`;
      const qr = Progress.getQuizResult(mod.id);
      const activeQuiz = activeLessonId === null;
      html += `<div class="sidebar-item ${activeQuiz ? 'active' : ''}" onclick="location.hash='#/module/${mod.id}/quiz'">
        <span class="check ${qr && qr.passed ? 'done' : ''}">${qr && qr.passed ? icon('check') : ''}</span>
        <span class="item-label">Module Quiz</span>
      </div>`;
    }
    html += `</div>`;
    sidebar.innerHTML = html;
  }

  // ============ QUIZ ============
  function renderQuiz(el, moduleId) {
    const mod = TrainingData.modules.find(m => m.id === moduleId);
    if (!mod || !mod.quiz || !mod.quiz.length) { renderModule(el, moduleId); return; }

    let html = `<div class="quiz-container animate-in">
      <div class="quiz-header">
        <div class="breadcrumb" style="font-size:13px;color:var(--color-text-muted);margin-bottom:12px">
          <a href="#/" style="color:var(--color-primary);text-decoration:none">Dashboard</a> /
          <a href="#/module/${mod.id}" style="color:var(--color-primary);text-decoration:none">${mod.title}</a> / Quiz
        </div>
        <h1>${mod.title} — Quiz</h1>
        <p>${mod.quiz.length} questions. You need 80% (${Math.ceil(mod.quiz.length * 0.8)}/${mod.quiz.length}) to pass.</p>
      </div>`;

    for (let i = 0; i < mod.quiz.length; i++) {
      const q = mod.quiz[i];
      html += `<div class="quiz-question" data-q="${i}">
        <div class="q-number">Question ${i + 1} of ${mod.quiz.length}</div>
        <div class="q-text">${q.question}</div><div class="options">`;
      for (let j = 0; j < q.options.length; j++) {
        html += `<div class="quiz-option" data-q="${i}" data-opt="${j}" onclick="App.selectOption(${i},${j})">
          <span class="radio"></span><span>${q.options[j]}</span>
        </div>`;
      }
      html += `</div><div class="quiz-feedback" id="feedback-${i}"></div></div>`;
    }

    html += `<div class="quiz-actions">
      <button class="btn btn-primary" onclick="App.submitQuiz(${moduleId})">Submit Quiz</button>
      <button class="btn btn-secondary" onclick="location.hash='#/module/${moduleId}'">Back to Module</button>
    </div><div id="quiz-results-container"></div></div>`;
    el.innerHTML = html;
    window._quizAnswers = {};
  }

  function selectOption(qIdx, optIdx) {
    window._quizAnswers[qIdx] = optIdx;
    $$(`[data-q="${qIdx}"].quiz-option`).forEach(o => o.classList.remove('selected'));
    const sel = $(`.quiz-option[data-q="${qIdx}"][data-opt="${optIdx}"]`);
    if (sel) sel.classList.add('selected');
  }

  function submitQuiz(moduleId) {
    const mod = TrainingData.modules.find(m => m.id === moduleId);
    if (!mod) return;
    let correct = 0;
    for (let i = 0; i < mod.quiz.length; i++) {
      const q = mod.quiz[i];
      const answer = window._quizAnswers[i];
      const fb = $(`#feedback-${i}`);
      const opts = $$(`[data-q="${i}"].quiz-option`);
      opts.forEach(o => { o.style.pointerEvents = 'none'; o.classList.remove('selected'); });
      if (answer === q.correct) {
        correct++;
        opts[answer].classList.add('correct');
        if (fb) { fb.className = 'quiz-feedback show correct'; fb.textContent = 'Correct! ' + q.explanation; }
      } else {
        if (answer !== undefined) opts[answer].classList.add('incorrect');
        opts[q.correct].classList.add('correct');
        if (fb) { fb.className = 'quiz-feedback show incorrect'; fb.textContent = (answer === undefined ? 'Not answered. ' : 'Incorrect. ') + q.explanation; }
      }
    }
    Progress.setQuizScore(moduleId, correct, mod.quiz.length);
    const pct = Math.round((correct / mod.quiz.length) * 100);
    const passed = pct >= 80;
    const rc = $('#quiz-results-container');
    rc.innerHTML = `<div class="quiz-results" style="margin-top:32px">
      <div class="score-circle ${passed ? 'passed' : 'failed'}">${pct}%<span class="label">${correct}/${mod.quiz.length}</span></div>
      <h2>${passed ? 'Passed!' : 'Not Passed'}</h2>
      <p>${passed ? 'Great work! You met the 80% passing threshold.' : `You scored ${pct}%. You need 80% to pass. Review the material and try again.`}</p>
      <div style="display:flex;gap:12px;justify-content:center">
        ${!passed ? `<button class="btn btn-primary" onclick="location.hash='#/module/${moduleId}/quiz';App.renderQuiz(document.getElementById('main-content'),${moduleId})">Retake Quiz</button>` : ''}
        <button class="btn btn-secondary" onclick="location.hash='#/module/${moduleId}'">Back to Module</button>
      </div>
    </div>`;
    rc.scrollIntoView({ behavior: 'smooth' });
    $$('.quiz-actions').forEach(a => a.style.display = 'none');
    updateNavProgress();
  }

  // ============ SCENARIOS ============
  function renderScenarios(el) {
    let html = `<div class="animate-in" style="max-width:900px;margin:0 auto">
      <div class="module-header">
        <div class="breadcrumb"><a href="#/">Dashboard</a> / Hands-On Scenarios</div>
        <h1>${icon('wrench')} Hands-On Fault Scenarios</h1>
        <p class="module-description">Five realistic fault scenarios pre-staged on the tabletop PLC bench. Each follows a briefing / execution / debrief structure.</p>
      </div>
      <div class="callout info" style="margin-bottom:24px">
        <div class="callout-title">${icon('info')} For the Trainer</div>
        <div>Pre-stage each scenario on the bench before the exercise begins. Give students only the symptom description. Observe but do not assist unless there is a safety concern.</div>
      </div>`;
    for (const s of TrainingData.scenarios) {
      const done = Progress.isScenarioComplete(s.id);
      html += `<div class="scenario-card" style="cursor:pointer" onclick="location.hash='#/scenario/${s.id}'">
        <div style="display:flex;justify-content:space-between;align-items:start">
          <h3>Scenario ${s.id}: ${s.title}</h3>
          ${done ? '<span class="quiz-result-badge passed">' + icon('check') + ' Complete</span>' : ''}
        </div>
        <p class="scenario-objective">${s.objective}</p>
        <div class="scenario-meta"><span>${icon('clock')} Time limit: ${s.timeLimit}</span><span>${s.steps.length} steps</span></div>
      </div>`;
    }
    html += `</div>`;
    el.innerHTML = html;
  }

  function renderScenarioDetail(el, scenarioId) {
    const s = TrainingData.scenarios.find(sc => sc.id === scenarioId);
    if (!s) { renderScenarios(el); return; }
    const done = Progress.isScenarioComplete(s.id);
    let html = `<div class="animate-in" style="max-width:800px;margin:0 auto">
      <div class="module-header">
        <div class="breadcrumb"><a href="#/">Dashboard</a> / <a href="#/scenarios">Scenarios</a> / Scenario ${s.id}</div>
        <h1>Scenario ${s.id}: ${s.title}</h1>
        <p class="module-description">${s.objective}</p>
        <div class="module-meta" style="font-size:14px;color:var(--color-text-secondary)"><span>${icon('clock')} Time limit: ${s.timeLimit}</span></div>
      </div>
      <div class="callout warning" style="margin-bottom:24px">
        <div class="callout-title">${icon('alertTriangle')} Trainer Setup (do not show to students)</div>
        <div>${s.setup}</div>
      </div>
      <h2>Troubleshooting Steps</h2>
      <ul class="checklist" id="scenario-checklist">`;
    for (let i = 0; i < s.steps.length; i++) {
      html += `<li id="step-${i}"><span class="checklist-check" onclick="App.toggleScenarioStep(${i})" id="check-${i}"></span><span>${s.steps[i]}</span></li>`;
    }
    html += `</ul>
      <div class="callout info" style="margin-top:24px"><div class="callout-title">Success Criteria</div><div>${s.successCriteria}</div></div>
      <div style="margin-top:24px;display:flex;gap:12px">`;
    if (!done) html += `<button class="btn btn-primary" onclick="App.completeScenario(${s.id})">Mark Scenario Complete</button>`;
    else html += `<button class="btn-complete completed" disabled>${icon('check')} Scenario Complete</button>`;
    html += `<button class="btn btn-secondary" onclick="location.hash='#/scenarios'">Back to Scenarios</button></div></div>`;
    el.innerHTML = html;
  }

  function toggleScenarioStep(idx) {
    const li = $(`#step-${idx}`);
    const check = $(`#check-${idx}`);
    if (li.classList.contains('checked-item')) {
      li.classList.remove('checked-item');
      check.classList.remove('checked');
      check.innerHTML = '';
    } else {
      li.classList.add('checked-item');
      check.classList.add('checked');
      check.innerHTML = icon('check');
    }
  }

  function completeScenario(id) { Progress.setScenarioComplete(id); route(); }

  // ============ HANDOUTS ============
  function renderHandouts(el) {
    let html = `<div class="animate-in" style="max-width:900px;margin:0 auto">
      <div class="module-header">
        <div class="breadcrumb"><a href="#/">Dashboard</a> / Handouts</div>
        <h1>${icon('fileText')} Handouts & Reference Cards</h1>
        <p class="module-description">Printable reference materials for distribution during training sessions.</p>
      </div><div class="info-cards">`;
    for (const h of TrainingData.handouts) {
      html += `<div class="info-card"><h4>${h.title}</h4><p style="font-size:13px;color:var(--color-text-secondary);margin-top:8px">${h.description}</p></div>`;
    }
    html += `</div></div>`;
    el.innerHTML = html;
  }

  // ============ ESCALATION ============
  function renderEscalation(el) {
    const esc = TrainingData.escalation;
    let html = `<div class="animate-in" style="max-width:800px;margin:0 auto">
      <div class="module-header">
        <div class="breadcrumb"><a href="#/">Dashboard</a> / Escalation</div>
        <h1>${icon('alertTriangle')} Escalation Procedures</h1>
        <p class="module-description">When a fault exceeds your trained skills, prompt and accurate escalation prevents extended downtime and ensures safety.</p>
      </div>`;
    for (const level of esc.levels) {
      html += `<div class="escalation-level level-${level.level}"><h4>Level ${level.level}: ${level.title}</h4>
        <ul style="margin-top:8px;padding-left:20px">${level.items.map(i => `<li style="font-size:14px;margin-bottom:4px">${i}</li>`).join('')}</ul></div>`;
    }
    html += `<div class="callout danger" style="margin-top:24px"><div class="callout-title">${icon('alertTriangle')} Important</div>
      <div>Do not modify ladder logic or PLC program files on production machines without written authorization from Automation Engineering.</div></div>
      <h2 style="margin-top:32px">What to Document Before Escalating</h2>
      <ul class="checklist">${esc.documentation.map(item => `<li><span class="checklist-check"></span><span>${item}</span></li>`).join('')}</ul></div>`;
    el.innerHTML = html;
  }

  // ============ KNOWLEDGE CHECK ============
  function renderKnowledgeCheck(el) {
    let html = `<div class="animate-in" style="max-width:800px;margin:0 auto">
      <div class="module-header">
        <div class="breadcrumb"><a href="#/">Dashboard</a> / Knowledge Check</div>
        <h1>${icon('search')} Written Knowledge Check</h1>
        <p class="module-description">Representative questions from the 20-question written assessment. Passing score: 80% (16/20).</p>
      </div>
      <div class="callout info" style="margin-bottom:24px"><div class="callout-title">${icon('info')} For the Trainer</div>
        <div>Administer as a written test. Students answer independently without software or reference materials. Allow 30 minutes.</div></div>`;
    for (let i = 0; i < TrainingData.knowledgeCheck.length; i++) {
      html += `<div class="quiz-question"><div class="q-number">Question ${i + 1}</div><div class="q-text">${TrainingData.knowledgeCheck[i].question}</div></div>`;
    }
    html += `</div>`;
    el.innerHTML = html;
  }

  // ============ PUBLIC API ============
  return {
    init, navigate, route,
    openSlideShow, closeSlideShow, slideNext, slidePrev, slideGoTo,
    toggleAutoPlay, speakCurrentOnly, markAndClose, autoPlayModule,
    continueFromOverlay,
    selectOption, submitQuiz, renderQuiz,
    toggleScenarioStep, completeScenario,
  };
})();

document.addEventListener('DOMContentLoaded', App.init);
