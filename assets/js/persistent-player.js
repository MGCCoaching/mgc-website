/**
 * Persistent Podcast Player - MGC Coaching
 * ==========================================
 * Player audio persistant pendant navigation Swup
 * 
 * Fonctionnalités :
 * - Play/pause synchronisé avec trigger
 * - Skip -10s / +30s
 * - Navigation chapitres
 * - Volume avec slider
 * - Vitesse 0.5x-2x
 * - Mode mini (rétracté en width)
 * - Barre progression avec marqueurs chapitres
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════
  // ÉTAT GLOBAL
  // ═══════════════════════════════════════════════════════════════════════════
  
  const state = {
    isOpen: false,
    isMinimized: false,
    isPlaying: false,
    hasStarted: false, // Pour savoir si l'épisode a déjà commencé
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
    currentEpisode: null, // { audioUrl, title, subtitle, cover, duration, chapters }
    chapters: [],
    isDragging: false
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // ÉLÉMENTS DOM (récupérés dynamiquement)
  // ═══════════════════════════════════════════════════════════════════════════
  
  function getPlayerElements() {
    return {
      player: document.querySelector('[data-persistent-player]'),
      audio: document.getElementById('persistent-audio'),
      
      // Progress bar
      progressBar: document.querySelector('[data-persistent-progress-bar]'),
      progressFill: document.querySelector('[data-persistent-progress-fill]'),
      progressHandle: document.querySelector('[data-persistent-progress-handle]'),
      previewLine: document.querySelector('[data-persistent-preview-line]'),
      hoverTime: document.querySelector('[data-persistent-hover-time]'),
      chapterMarkers: document.querySelector('[data-persistent-chapter-markers]'),
      
      // Modes
      expanded: document.querySelector('[data-player-expanded]'),
      minimized: document.querySelector('[data-player-minimized]'),
      
      // Infos
      cover: document.querySelector('[data-persistent-cover]'),
      miniCover: document.querySelector('[data-persistent-mini-cover]'),
      title: document.querySelector('[data-persistent-title]'),
      chapter: document.querySelector('[data-persistent-chapter]'),
      currentTimeEl: document.querySelector('[data-persistent-current-time]'),
      durationEl: document.querySelector('[data-persistent-duration]'),
      playingIndicator: document.querySelector('[data-persistent-playing-indicator]'),
      
      // Boutons expanded
      playBtn: document.querySelector('[data-persistent-play-btn]'),
      playIcon: document.querySelector('[data-persistent-play-icon]'),
      pauseIcon: document.querySelector('[data-persistent-pause-icon]'),
      skipBack: document.querySelector('[data-persistent-skip-back]'),
      skipForward: document.querySelector('[data-persistent-skip-forward]'),
      prevChapter: document.querySelector('[data-persistent-prev-chapter]'),
      nextChapter: document.querySelector('[data-persistent-next-chapter]'),
      minimizeBtn: document.querySelector('[data-persistent-minimize-btn]'),
      closeBtn: document.querySelector('[data-persistent-close-btn]'),
      
      // Boutons mini
      miniPlayBtn: document.querySelector('[data-persistent-mini-play-btn]'),
      miniPlayIcon: document.querySelector('[data-persistent-mini-play-icon]'),
      miniPauseIcon: document.querySelector('[data-persistent-mini-pause-icon]'),
      expandBtn: document.querySelector('[data-persistent-expand-btn]'),
      miniCloseBtn: document.querySelector('[data-persistent-mini-close-btn]'),
      
      // Volume
      volumeContainer: document.querySelector('[data-volume-container]'),
      volumeBtn: document.querySelector('[data-persistent-volume-btn]'),
      volumeIcon: document.querySelector('[data-volume-icon]'),
      volumeSliderContainer: document.querySelector('[data-volume-slider-container]'),
      volumeSlider: document.querySelector('[data-persistent-volume-slider]'),
      volumePercent: document.querySelector('[data-volume-percent]'),
      
      // Chapitres
      chaptersBtn: document.querySelector('[data-persistent-chapters-btn]'),
      chaptersPanel: document.querySelector('[data-persistent-chapters-panel]'),
      chaptersClose: document.querySelector('[data-persistent-chapters-close]'),
      chaptersList: document.querySelector('[data-persistent-chapters-list]'),
      
      // Vitesse
      speedContainer: document.querySelector('[data-persistent-speed-container]'),
      speedBtn: document.querySelector('[data-persistent-speed-btn]'),
      speedLabel: document.querySelector('[data-persistent-speed-label]'),
      speedMenu: document.querySelector('[data-persistent-speed-menu]'),
      speedOptions: document.querySelectorAll('[data-persistent-speed-option]')
    };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // UTILITAIRES
  // ═══════════════════════════════════════════════════════════════════════════
  
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) seconds = 0;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function getProgressPercent(e, progressBar) {
    const rect = progressBar.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PLAYER - AFFICHAGE
  // ═══════════════════════════════════════════════════════════════════════════
  
  function showPlayer() {
    const els = getPlayerElements();
    if (!els.player) return;
    
    state.isOpen = true;
    els.player.classList.remove('translate-y-full');
  }

  function hidePlayer() {
    const els = getPlayerElements();
    if (!els.player) return;
    
    state.isOpen = false;
    els.player.classList.add('translate-y-full');
  }

  function minimize() {
    const els = getPlayerElements();
    if (!els.expanded || !els.minimized) return;
    
    state.isMinimized = true;
    els.expanded.classList.add('hidden');
    els.minimized.classList.remove('hidden');
    
    // Fermer les panels ouverts
    closeChaptersPanel();
    closeSpeedMenu();
    closeVolumeSlider();
  }

  function expand() {
    const els = getPlayerElements();
    if (!els.expanded || !els.minimized) return;
    
    state.isMinimized = false;
    els.minimized.classList.add('hidden');
    els.expanded.classList.remove('hidden');
  }

  function closePlayer() {
    const els = getPlayerElements();
    if (!els.audio) return;
    
    // Stop audio
    els.audio.pause();
    els.audio.currentTime = 0;
    els.audio.src = '';
    
    // Reset state
    state.isPlaying = false;
    state.hasStarted = false;
    state.currentEpisode = null;
    state.chapters = [];
    
    // Hide player
    hidePlayer();
    
    // Sync trigger
    syncTrigger();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PLAYER - LECTURE
  // ═══════════════════════════════════════════════════════════════════════════
  
  function togglePlay() {
    const els = getPlayerElements();
    if (!els.audio || !els.audio.src) return;
    
    if (els.audio.paused) {
      els.audio.play();
    } else {
      els.audio.pause();
    }
  }

  function updatePlayButtons() {
    // On récupère les éléments FRAIS du DOM (très important pour Swup)
    const audio = document.querySelector('audio');
    const playIcons = document.querySelectorAll('[data-persistent-play-icon]');
    const pauseIcons = document.querySelectorAll('[data-persistent-pause-icon]');
  
    if (!audio) return;
  
    const isPlaying = !audio.paused;
  
    // On boucle sur tous les boutons (au cas où il y en a plusieurs : mini + main)
    playIcons.forEach(icon => {
      if (isPlaying) {
        icon.classList.add('hidden');
      } else {
        icon.classList.remove('hidden');
      }
    });
  
    pauseIcons.forEach(icon => {
      if (isPlaying) {
        icon.classList.remove('hidden');
      } else {
        icon.classList.add('hidden');
      }
    });
  
    
    // Sync trigger
    syncTrigger();
  }

  function skip(seconds) {
    const els = getPlayerElements();
    if (!els.audio) return;
    
    els.audio.currentTime = Math.max(0, Math.min(state.duration, els.audio.currentTime + seconds));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PLAYER - PROGRESSION
  // ═══════════════════════════════════════════════════════════════════════════
  
  function updateProgress(percent) {
    const els = getPlayerElements();
    if (!els.progressFill || !els.progressHandle) return;
    
    const percentStr = `${percent * 100}%`;
    els.progressFill.style.width = percentStr;
    els.progressHandle.style.left = percentStr;
  }

  function onTimeUpdate() {
    const els = getPlayerElements();
    if (!els.audio || state.isDragging) return;
    
    state.currentTime = els.audio.currentTime;
    
    if (state.duration > 0) {
      const percent = state.currentTime / state.duration;
      updateProgress(percent);
    }
    
    if (els.currentTimeEl) {
      els.currentTimeEl.textContent = formatTime(state.currentTime);
    }
    
    updateCurrentChapter();
  }

  function onLoadedMetadata() {
    const els = getPlayerElements();
    if (!els.audio) return;
    
    state.duration = els.audio.duration;
    
    if (els.durationEl) {
      els.durationEl.textContent = formatTime(state.duration);
    }
    
    // Render chapter markers après metadata chargées
    renderChapterMarkers();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PLAYER - CHAPITRES
  // ═══════════════════════════════════════════════════════════════════════════
  
  function getCurrentChapterIndex() {
    if (!state.chapters.length) return -1;
    
    let index = 0;
    for (let i = 0; i < state.chapters.length; i++) {
      if (state.currentTime >= state.chapters[i].startSeconds) {
        index = i;
      }
    }
    return index;
  }

  function updateCurrentChapter() {
    const els = getPlayerElements();
    const index = getCurrentChapterIndex();
    
    if (index >= 0 && state.chapters[index] && els.chapter) {
      els.chapter.textContent = state.chapters[index].title;
    }
    
    // Update chapter list highlighting
    const chapterItems = document.querySelectorAll('[data-chapter-item]');
    chapterItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add('bg-accent-primary/20', 'text-accent-primary');
      } else {
        item.classList.remove('bg-accent-primary/20', 'text-accent-primary');
      }
    });
  }

  function goToChapter(index) {
    const els = getPlayerElements();
    if (index < 0 || index >= state.chapters.length || !els.audio) return;
    
    els.audio.currentTime = state.chapters[index].startSeconds;
  }

  function goToPrevChapter() {
    const currentIdx = getCurrentChapterIndex();
    const currentChapter = state.chapters[currentIdx];
    
    // Si on est au début du chapitre (< 3s), aller au précédent
    if (currentChapter && state.currentTime - currentChapter.startSeconds < 3 && currentIdx > 0) {
      goToChapter(currentIdx - 1);
    } else {
      goToChapter(currentIdx);
    }
  }

  function goToNextChapter() {
    const currentIdx = getCurrentChapterIndex();
    if (currentIdx < state.chapters.length - 1) {
      goToChapter(currentIdx + 1);
    }
  }

  function renderChapterMarkers() {
    const els = getPlayerElements();
    if (!els.chapterMarkers || !state.chapters.length || state.duration <= 0) return;
    
    els.chapterMarkers.innerHTML = '';
    
    state.chapters.forEach((chapter, idx) => {
      if (idx === 0) return; // Skip first chapter (starts at 0)
      
      const percent = (chapter.startSeconds / state.duration) * 100;
      const marker = document.createElement('div');
      marker.className = 'absolute top-0 bottom-0 w-0.5 bg-white/50 hover:bg-white cursor-pointer z-10';
      marker.style.left = `${percent}%`;
      marker.title = chapter.title;
      marker.addEventListener('click', (e) => {
        e.stopPropagation();
        goToChapter(idx);
      });
      
      els.chapterMarkers.appendChild(marker);
    });
  }

  function renderChaptersList() {
    const els = getPlayerElements();
    if (!els.chaptersList) return;
    
    if (!state.chapters.length) {
      els.chaptersList.innerHTML = '<p class="text-text-tertiary text-sm">Aucun chapitre</p>';
      return;
    }
    
    els.chaptersList.innerHTML = state.chapters.map((chapter, idx) => `
      <button 
        data-chapter-item
        data-chapter-index="${idx}"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left 
               text-text-primary hover:bg-bg-tertiary transition-all"
      >
        <span class="font-mono text-xs px-2 py-1 rounded bg-bg-tertiary shrink-0">
          ${chapter.time}
        </span>
        <span class="flex-1 text-sm truncate">${chapter.title}</span>
      </button>
    `).join('');
    
    // Event listeners
    els.chaptersList.querySelectorAll('[data-chapter-item]').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.dataset.chapterIndex);
        goToChapter(idx);
        closeChaptersPanel();
      });
    });
  }

  function toggleChaptersPanel() {
    const els = getPlayerElements();
    if (!els.chaptersPanel) return;
    
    const isOpen = els.chaptersPanel.style.maxHeight && els.chaptersPanel.style.maxHeight !== '0px';
    
    if (isOpen) {
      closeChaptersPanel();
    } else {
      renderChaptersList();
      els.chaptersPanel.style.maxHeight = '320px';
    }
  }

  function closeChaptersPanel() {
    const els = getPlayerElements();
    if (els.chaptersPanel) {
      els.chaptersPanel.style.maxHeight = '0px';
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PLAYER - VOLUME
  // ═══════════════════════════════════════════════════════════════════════════
  
  function setVolume(value) {
    const els = getPlayerElements();
    if (!els.audio) return;
    
    state.volume = value;
    els.audio.volume = value;
    
    // Update icon
    if (els.volumeIcon) {
      if (value === 0) {
        els.volumeIcon.textContent = 'volume_off';
      } else if (value < 0.5) {
        els.volumeIcon.textContent = 'volume_down';
      } else {
        els.volumeIcon.textContent = 'volume_up';
      }
    }
    
    // Update percent
    if (els.volumePercent) {
      els.volumePercent.textContent = `${Math.round(value * 100)}%`;
    }
  }

  function toggleVolumeSlider() {
    const els = getPlayerElements();
    if (!els.volumeSliderContainer) return;
    
    const isVisible = !els.volumeSliderContainer.classList.contains('invisible');
    
    if (isVisible) {
      closeVolumeSlider();
    } else {
      els.volumeSliderContainer.classList.remove('invisible', 'opacity-0');
      els.volumeSliderContainer.classList.add('opacity-100');
    }
  }

  function closeVolumeSlider() {
    const els = getPlayerElements();
    if (els.volumeSliderContainer) {
      els.volumeSliderContainer.classList.add('invisible', 'opacity-0');
      els.volumeSliderContainer.classList.remove('opacity-100');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PLAYER - VITESSE
  // ═══════════════════════════════════════════════════════════════════════════
  
  function setSpeed(value) {
    const els = getPlayerElements();
    if (!els.audio) return;
    
    state.playbackRate = parseFloat(value);
    els.audio.playbackRate = state.playbackRate;
    
    if (els.speedLabel) {
      els.speedLabel.textContent = state.playbackRate === 1 ? '1x' : `${state.playbackRate}x`;
    }
    
    // Update options styling
    if (els.speedOptions) {
      els.speedOptions.forEach(opt => {
        const optValue = parseFloat(opt.dataset.persistentSpeedOption);
        if (optValue === state.playbackRate) {
          opt.classList.add('text-accent-primary', 'font-bold');
        } else {
          opt.classList.remove('text-accent-primary', 'font-bold');
        }
      });
    }
  }

  function toggleSpeedMenu() {
    const els = getPlayerElements();
    if (els.speedMenu) {
      els.speedMenu.classList.toggle('hidden');
    }
  }

  function closeSpeedMenu() {
    const els = getPlayerElements();
    if (els.speedMenu) {
      els.speedMenu.classList.add('hidden');
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PLAYER - CHARGER UN ÉPISODE
  // ═══════════════════════════════════════════════════════════════════════════
  
  function loadEpisode(episodeData) {
    const els = getPlayerElements();
    if (!els.audio) return;
    
    // Si même épisode, juste toggle play
    if (state.currentEpisode && state.currentEpisode.audioUrl === episodeData.audioUrl) {
      togglePlay();
      return;
    }
    
    // Nouveau épisode
    state.currentEpisode = episodeData;
    state.chapters = episodeData.chapters || [];
    state.hasStarted = false;
    state.currentTime = 0;
    
    // Set audio source
    els.audio.src = episodeData.audioUrl;
    els.audio.load();
    
    // Update UI
    if (els.cover) els.cover.src = episodeData.cover || '/img/fallback-podcast.png';
    if (els.miniCover) els.miniCover.src = episodeData.cover || '/img/fallback-podcast.png';
    if (els.title) els.title.textContent = episodeData.title || 'Podcast';
    if (els.chapter) els.chapter.textContent = state.chapters.length ? state.chapters[0].title : episodeData.subtitle || '—';
    if (els.durationEl) els.durationEl.textContent = episodeData.duration || '0:00';
    
    // Show player in expanded mode
    expand();
    showPlayer();
    
    // Render chapter markers (sera re-appelé après loadedmetadata)
    if (episodeData.durationSeconds) {
      state.duration = episodeData.durationSeconds;
      renderChapterMarkers();
    }
    
    // Auto-play
    els.audio.play().then(() => {
      state.hasStarted = true;
    }).catch(() => {});
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TRIGGER - SYNCHRONISATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  function syncTrigger() {
    const trigger = document.querySelector('[data-podcast-trigger]');
    if (!trigger) return;
    
    const triggerAudioUrl = trigger.dataset.audioUrl;
    const playIcon = trigger.querySelector('[data-trigger-play-icon]');
    const pauseIcon = trigger.querySelector('[data-trigger-pause-icon]');
    const label = trigger.querySelector('[data-trigger-label]');
    
    // Vérifier si c'est le même épisode
    const isSameEpisode = state.currentEpisode && state.currentEpisode.audioUrl === triggerAudioUrl;
    
    if (isSameEpisode && state.isPlaying) {
      // En lecture : afficher pause
      if (playIcon) playIcon.classList.add('hidden');
      if (pauseIcon) pauseIcon.classList.remove('hidden');
      if (label) label.textContent = 'Pause';
    } else if (isSameEpisode && state.hasStarted && !state.isPlaying) {
      // En pause (déjà commencé) : afficher play + "Reprendre"
      if (playIcon) playIcon.classList.remove('hidden');
      if (pauseIcon) pauseIcon.classList.add('hidden');
      if (label) label.textContent = 'Reprendre';
    } else {
      // Pas commencé ou autre épisode : afficher play + "Écouter"
      if (playIcon) playIcon.classList.remove('hidden');
      if (pauseIcon) pauseIcon.classList.add('hidden');
      if (label) label.textContent = 'Écouter';
    }
  }

  function initTrigger() {
    const trigger = document.querySelector('[data-podcast-trigger]');
    if (!trigger) return;
    
    const playBtn = trigger.querySelector('[data-trigger-play-btn]');
    if (!playBtn) return;
    
    // Remove old listeners (for Swup)
    const newBtn = playBtn.cloneNode(true);
    playBtn.parentNode.replaceChild(newBtn, playBtn);
    
    newBtn.addEventListener('click', () => {
      const episodeData = {
        audioUrl: trigger.dataset.audioUrl,
        audioFormat: trigger.dataset.audioFormat,
        title: trigger.dataset.title,
        subtitle: trigger.dataset.subtitle,
        cover: trigger.dataset.cover,
        duration: trigger.dataset.duration,
        durationSeconds: parseInt(trigger.dataset.durationSeconds) || 0,
        chapters: []
      };
      
      // Parse chapters
      try {
        episodeData.chapters = JSON.parse(trigger.dataset.chapters || '[]');
      } catch (e) {
        episodeData.chapters = [];
      }
      
      loadEpisode(episodeData);
    });
    
    // Sync initial state
    syncTrigger();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EVENT LISTENERS
  // ═══════════════════════════════════════════════════════════════════════════
  
  function setupEventListeners() {
    const els = getPlayerElements();
    if (!els.audio) return;
    
    // Audio events
    els.audio.addEventListener('play', () => {
      state.hasStarted = true;
      updatePlayButtons();
    });
    els.audio.addEventListener('pause', updatePlayButtons);
    els.audio.addEventListener('timeupdate', onTimeUpdate);
    els.audio.addEventListener('loadedmetadata', onLoadedMetadata);
    els.audio.addEventListener('ended', () => {
      state.isPlaying = false;
      updatePlayButtons();
    });
    
    
    // Play buttons
    if (els.playBtn) els.playBtn.addEventListener('click', togglePlay);
    if (els.miniPlayBtn) els.miniPlayBtn.addEventListener('click', togglePlay);
    
    // Skip buttons
    if (els.skipBack) els.skipBack.addEventListener('click', () => skip(-10));
    if (els.skipForward) els.skipForward.addEventListener('click', () => skip(30));
    
    // Chapter navigation
    if (els.prevChapter) els.prevChapter.addEventListener('click', goToPrevChapter);
    if (els.nextChapter) els.nextChapter.addEventListener('click', goToNextChapter);
    
    // Minimize/Expand/Close
    if (els.minimizeBtn) els.minimizeBtn.addEventListener('click', minimize);
    if (els.expandBtn) els.expandBtn.addEventListener('click', expand);
    if (els.closeBtn) els.closeBtn.addEventListener('click', closePlayer);
    if (els.miniCloseBtn) els.miniCloseBtn.addEventListener('click', closePlayer);
    
    // Volume
    if (els.volumeBtn) els.volumeBtn.addEventListener('click', toggleVolumeSlider);
    if (els.volumeSlider) {
      els.volumeSlider.addEventListener('input', (e) => setVolume(parseFloat(e.target.value)));
    }
    
    // Chapters
    if (els.chaptersBtn) els.chaptersBtn.addEventListener('click', toggleChaptersPanel);
    if (els.chaptersClose) els.chaptersClose.addEventListener('click', closeChaptersPanel);
    
    // Speed
    if (els.speedBtn) els.speedBtn.addEventListener('click', toggleSpeedMenu);
    if (els.speedOptions) {
      els.speedOptions.forEach(opt => {
        opt.addEventListener('click', () => {
          setSpeed(opt.dataset.persistentSpeedOption);
          closeSpeedMenu();
        });
      });
    }
    
    // Progress bar interactions
    if (els.progressBar) {
      // Click to seek
      els.progressBar.addEventListener('click', (e) => {
        if (state.duration > 0) {
          const percent = getProgressPercent(e, els.progressBar);
          els.audio.currentTime = percent * state.duration;
        }
      });
      
      // Hover preview
      els.progressBar.addEventListener('mousemove', (e) => {
        if (state.duration > 0 && !state.isDragging) {
          const percent = getProgressPercent(e, els.progressBar);
          const time = percent * state.duration;
          
          if (els.previewLine) {
            els.previewLine.style.left = `${percent * 100}%`;
            els.previewLine.classList.remove('hidden');
          }
          
          if (els.hoverTime) {
            els.hoverTime.textContent = formatTime(time);
            els.hoverTime.style.left = `${percent * 100}%`;
            els.hoverTime.classList.remove('hidden');
          }
        }
      });
      
      els.progressBar.addEventListener('mouseleave', () => {
        if (!state.isDragging) {
          if (els.previewLine) els.previewLine.classList.add('hidden');
          if (els.hoverTime) els.hoverTime.classList.add('hidden');
        }
      });
      
      // Drag to seek
      const startDrag = (e) => {
        state.isDragging = true;
        if (els.progressHandle) els.progressHandle.classList.add('opacity-100');
        updateDrag(e);
      };
      
      const updateDrag = (e) => {
        if (!state.isDragging || state.duration <= 0) return;
        const percent = getProgressPercent(e, els.progressBar);
        updateProgress(percent);
        if (els.currentTimeEl) {
          els.currentTimeEl.textContent = formatTime(percent * state.duration);
        }
      };
      
      const endDrag = (e) => {
        if (!state.isDragging) return;
        state.isDragging = false;
        if (els.progressHandle) els.progressHandle.classList.remove('opacity-100');
        
        if (state.duration > 0) {
          const percent = getProgressPercent(e, els.progressBar);
          els.audio.currentTime = percent * state.duration;
        }
      };
      
      els.progressBar.addEventListener('mousedown', startDrag);
      document.addEventListener('mousemove', updateDrag);
      document.addEventListener('mouseup', endDrag);
      
      // Touch support
      els.progressBar.addEventListener('touchstart', startDrag, { passive: true });
      document.addEventListener('touchmove', updateDrag, { passive: true });
      document.addEventListener('touchend', endDrag);
    }
    
    // Close menus on outside click
    document.addEventListener('click', (e) => {
      // Speed menu
      if (els.speedContainer && !els.speedContainer.contains(e.target)) {
        closeSpeedMenu();
      }
      // Volume slider
      if (els.volumeContainer && !els.volumeContainer.contains(e.target)) {
        closeVolumeSlider();
      }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (!state.isOpen) return;
      
      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skip(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(30);
          break;
        case 'KeyM':
          e.preventDefault();
          setVolume(state.volume > 0 ? 0 : 1);
          if (els.volumeSlider) els.volumeSlider.value = state.volume;
          break;
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MEDIA SESSION API
  // ═══════════════════════════════════════════════════════════════════════════
  
  function updateMediaSession() {
    if (!('mediaSession' in navigator) || !state.currentEpisode) return;
    
    navigator.mediaSession.metadata = new MediaMetadata({
      title: state.currentEpisode.title,
      artist: 'MGC Coaching',
      album: 'Podcast',
      artwork: state.currentEpisode.cover ? [{ src: state.currentEpisode.cover, sizes: '512x512', type: 'image/jpeg' }] : []
    });
    
    navigator.mediaSession.setActionHandler('play', togglePlay);
    navigator.mediaSession.setActionHandler('pause', togglePlay);
    navigator.mediaSession.setActionHandler('seekbackward', () => skip(-10));
    navigator.mediaSession.setActionHandler('seekforward', () => skip(30));
    navigator.mediaSession.setActionHandler('previoustrack', goToPrevChapter);
    navigator.mediaSession.setActionHandler('nexttrack', goToNextChapter);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // INITIALISATION
  // ═══════════════════════════════════════════════════════════════════════════
  
  let isInitialized = false;
  
  function init() {
    // Setup event listeners une seule fois
    if (!isInitialized) {
      setupEventListeners();
      isInitialized = true;
    }
    
    // Init trigger (à chaque navigation Swup)
    initTrigger();
    
    // Update media session
    if (state.currentEpisode) {
      updateMediaSession();
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // API PUBLIQUE
  // ═══════════════════════════════════════════════════════════════════════════
  
  window.MGC = window.MGC || {};
  
  window.MGC.PersistentPlayer = {
    init,
    loadEpisode,
    togglePlay,
    skip,
    setVolume,
    setSpeed,
    getState: () => ({ ...state }),
    isPlaying: () => state.isPlaying,
    getCurrentEpisode: () => state.currentEpisode
  };
  
  window.MGC.syncTrigger = syncTrigger;
  window.MGC.initPersistentPlayer = init;

  // Init au chargement
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
