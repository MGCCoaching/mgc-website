/**
 * Podcast Player - MGC Coaching
 * ==============================
 * Player audio custom avec chapitres, raccourcis clavier, drag & drop
 * 
 * Usage: Inclure ce script et utiliser le partial podcast-player.html
 */

(function() {
  'use strict';

  // Initialisation au chargement du DOM
  document.addEventListener('DOMContentLoaded', initPodcastPlayer);

  function initPodcastPlayer() {
    const player = document.querySelector('[data-podcast-player]');
    if (!player) return;

    // Éléments du DOM
    const audio = player.querySelector('[data-audio]');
    const playBtn = player.querySelector('[data-play-btn]');
    const playIcon = player.querySelector('[data-play-icon]');
    const pauseIcon = player.querySelector('[data-pause-icon]');
    const skipBackBtn = player.querySelector('[data-skip-back]');
    const skipBackIcon = player.querySelector('[data-skip-back-icon]');
    const skipForwardBtn = player.querySelector('[data-skip-forward]');
    const skipForwardIcon = player.querySelector('[data-skip-forward-icon]');
    const prevChapterBtn = player.querySelector('[data-prev-chapter]');
    const nextChapterBtn = player.querySelector('[data-next-chapter]');
    const speedBtn = player.querySelector('[data-speed-btn]');
    const speedLabel = player.querySelector('[data-speed-label]');
    const speedMenu = player.querySelector('[data-speed-menu]');
    const speedOptions = player.querySelectorAll('[data-speed-option]');
    const speedContainer = player.querySelector('[data-speed-container]');
    const progressBar = player.querySelector('[data-progress-bar]');
    const progressFill = player.querySelector('[data-progress-fill]');
    const progressHandle = player.querySelector('[data-progress-handle]');
    const previewLine = player.querySelector('[data-preview-line]');
    const hoverTime = player.querySelector('[data-hover-time]');
    const currentTimeEl = player.querySelector('[data-current-time]');
    const durationEl = player.querySelector('[data-duration]');
    const chaptersToggle = player.querySelector('[data-chapters-toggle]');
    const chaptersList = player.querySelector('[data-chapters-list]');
    const chaptersArrow = player.querySelector('[data-chapters-arrow]');
    const chapterItems = player.querySelectorAll('[data-chapter]');
    const chapterMarkers = player.querySelectorAll('[data-chapter-marker]');

    if (!audio) return;

    // État
    let isDragging = false;
    let duration = audio.duration || 0;
    let currentChapterIndex = 0;
    let currentSpeed = 1;

    // ═══════════════════════════════════════════════════════════════════
    // UTILITAIRES
    // ═══════════════════════════════════════════════════════════════════

    function formatTime(seconds) {
      if (isNaN(seconds) || seconds < 0) seconds = 0;
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function getProgressPercent(e) {
      const rect = progressBar.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    }

    function updateProgress(percent) {
      const percentStr = `${percent * 100}%`;
      progressFill.style.width = percentStr;
      progressHandle.style.left = `calc(${percentStr} - 10px)`;
    }

    function getCurrentChapterIndex() {
      const currentTime = audio.currentTime;
      let index = 0;
      chapterItems.forEach((item, idx) => {
        const startTime = parseFloat(item.dataset.startTime) || 0;
        if (currentTime >= startTime) {
          index = idx;
        }
      });
      return index;
    }

    function updateCurrentChapter() {
      const currentTime = audio.currentTime;
      currentChapterIndex = getCurrentChapterIndex();
      
      chapterItems.forEach((item, idx) => {
        const startTime = parseFloat(item.dataset.startTime) || 0;
        const endTime = parseFloat(item.dataset.endTime) || duration;
        const isActive = currentTime >= startTime && currentTime < endTime;
        
        if (isActive) {
          item.classList.add('bg-accent-primary/20', 'text-accent-primary');
          item.classList.remove('hover:bg-secondary');
          item.querySelector('[data-chapter-indicator]')?.classList.remove('hidden');
        } else {
          item.classList.remove('bg-accent-primary/20', 'text-accent-primary');
          item.classList.add('hover:bg-secondary');
          item.querySelector('[data-chapter-indicator]')?.classList.add('hidden');
        }
      });

      // Mettre à jour le label du chapitre actuel
      const currentChapterLabel = player.querySelector('[data-current-chapter]');
      if (currentChapterLabel) {
        chapterItems.forEach(item => {
          const startTime = parseFloat(item.dataset.startTime) || 0;
          const endTime = parseFloat(item.dataset.endTime) || duration;
          if (currentTime >= startTime && currentTime < endTime) {
            currentChapterLabel.textContent = item.dataset.chapterTitle || '';
          }
        });
      }
    }

    // ═══════════════════════════════════════════════════════════════════
    // PLAY / PAUSE
    // ═══════════════════════════════════════════════════════════════════

    function togglePlay() {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    }

    function updatePlayButton() {
      if (audio.paused) {
        playIcon.style.display = '';
        pauseIcon.style.display = 'none';
      } else {
        playIcon.style.display = 'none';
        pauseIcon.style.display = '';
      }
    }

    playBtn.addEventListener('click', togglePlay);
    audio.addEventListener('play', updatePlayButton);
    audio.addEventListener('pause', updatePlayButton);

    // ═══════════════════════════════════════════════════════════════════
    // SKIP -10s / +30s
    // ═══════════════════════════════════════════════════════════════════

    function skip(seconds) {
      audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
    }

    function animateSkipButton(btn, icon, direction) {
      btn.classList.add('scale-95');
      if (icon) {
        icon.classList.add(direction === 'back' ? '-rotate-45' : 'rotate-45');
      }
      
      setTimeout(() => {
        btn.classList.remove('scale-95');
        if (icon) {
          icon.classList.remove('-rotate-45', 'rotate-45');
        }
      }, 200);
    }

    skipBackBtn.addEventListener('click', () => {
      skip(-10);
      animateSkipButton(skipBackBtn, skipBackIcon, 'back');
    });

    skipForwardBtn.addEventListener('click', () => {
      skip(30);
      animateSkipButton(skipForwardBtn, skipForwardIcon, 'forward');
    });

    // ═══════════════════════════════════════════════════════════════════
    // CHAPITRES PRÉCÉDENT / SUIVANT
    // ═══════════════════════════════════════════════════════════════════

    function goToChapter(index) {
      if (index < 0 || index >= chapterItems.length) return;
      const chapter = chapterItems[index];
      const startTime = parseFloat(chapter.dataset.startTime) || 0;
      audio.currentTime = startTime;
      currentChapterIndex = index;
    }

    function goToPrevChapter() {
      // Si on est au début du chapitre (< 3s), aller au précédent
      // Sinon, revenir au début du chapitre actuel
      const currentIdx = getCurrentChapterIndex();
      const currentChapter = chapterItems[currentIdx];
      const chapterStart = parseFloat(currentChapter?.dataset.startTime) || 0;
      
      if (audio.currentTime - chapterStart < 3 && currentIdx > 0) {
        goToChapter(currentIdx - 1);
      } else {
        goToChapter(currentIdx);
      }
    }

    function goToNextChapter() {
      const currentIdx = getCurrentChapterIndex();
      if (currentIdx < chapterItems.length - 1) {
        goToChapter(currentIdx + 1);
      }
    }

    if (prevChapterBtn) {
      prevChapterBtn.addEventListener('click', goToPrevChapter);
    }

    if (nextChapterBtn) {
      nextChapterBtn.addEventListener('click', goToNextChapter);
    }

    // ═══════════════════════════════════════════════════════════════════
    // VITESSE DE LECTURE (Menu déroulant)
    // ═══════════════════════════════════════════════════════════════════

    function setSpeed(speed) {
      currentSpeed = parseFloat(speed);
      audio.playbackRate = currentSpeed;
      if (speedLabel) {
        speedLabel.textContent = currentSpeed === 1 ? '1x' : `${currentSpeed}x`;
      }
      // Mettre à jour les styles des options
      speedOptions.forEach(opt => {
        const optSpeed = parseFloat(opt.dataset.speedOption);
        if (optSpeed === currentSpeed) {
          opt.classList.add('text-accent-primary', 'font-bold');
          opt.classList.remove('text-primary');
        } else {
          opt.classList.remove('text-accent-primary', 'font-bold');
          opt.classList.add('text-primary');
        }
      });
    }

    function toggleSpeedMenu() {
      if (speedMenu) {
        speedMenu.classList.toggle('hidden');
      }
    }

    function closeSpeedMenu() {
      if (speedMenu) {
        speedMenu.classList.add('hidden');
      }
    }

    if (speedBtn) {
      speedBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSpeedMenu();
      });
    }

    // Clic sur une option de vitesse
    speedOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const speed = option.dataset.speedOption;
        setSpeed(speed);
        closeSpeedMenu();
      });
    });

    // Fermer le menu si clic en dehors
    document.addEventListener('click', (e) => {
      if (speedContainer && !speedContainer.contains(e.target)) {
        closeSpeedMenu();
      }
    });

    // ═══════════════════════════════════════════════════════════════════
    // BARRE DE PROGRESSION
    // ═══════════════════════════════════════════════════════════════════

    // Mise à jour pendant la lecture
    audio.addEventListener('timeupdate', () => {
      if (!isDragging && duration > 0) {
        const percent = audio.currentTime / duration;
        updateProgress(percent);
        currentTimeEl.textContent = formatTime(audio.currentTime);
        updateCurrentChapter();
      }
    });

    // Quand les métadonnées sont chargées
    audio.addEventListener('loadedmetadata', () => {
      duration = audio.duration;
      durationEl.textContent = formatTime(duration);
    });

    // Fallback si duration déjà disponible
    if (audio.duration) {
      duration = audio.duration;
      durationEl.textContent = formatTime(duration);
    }

    // ═══════════════════════════════════════════════════════════════════
    // HOVER & PREVIEW
    // ═══════════════════════════════════════════════════════════════════

    function showHoverPreview(e) {
      const percent = getProgressPercent(e);
      const time = percent * duration;
      
      // Ligne de preview
      previewLine.style.left = `${percent * 100}%`;
      previewLine.classList.remove('hidden');
      
      // Tooltip temps
      hoverTime.textContent = formatTime(time);
      hoverTime.classList.remove('hidden');
    }

    function hideHoverPreview() {
      if (!isDragging) {
        previewLine.classList.add('hidden');
        hoverTime.classList.add('hidden');
      }
    }

    progressBar.addEventListener('mousemove', showHoverPreview);
    progressBar.addEventListener('mouseleave', hideHoverPreview);

    // ═══════════════════════════════════════════════════════════════════
    // DRAG & DROP (SLIDE)
    // ═══════════════════════════════════════════════════════════════════

    function startDrag(e) {
      e.preventDefault();
      isDragging = true;
      progressHandle.classList.add('scale-125');
      currentTimeEl.classList.add('text-accent-primary', 'font-bold');
      updateDrag(e);
    }

    function updateDrag(e) {
      if (!isDragging) return;
      const percent = getProgressPercent(e);
      updateProgress(percent);
      currentTimeEl.textContent = formatTime(percent * duration);
      showHoverPreview(e);
    }

    function endDrag(e) {
      if (!isDragging) return;
      isDragging = false;
      progressHandle.classList.remove('scale-125');
      currentTimeEl.classList.remove('text-accent-primary', 'font-bold');
      
      const percent = getProgressPercent(e);
      audio.currentTime = percent * duration;
      hideHoverPreview();
    }

    // Mouse events
    progressBar.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', (e) => {
      if (isDragging) updateDrag(e);
    });
    document.addEventListener('mouseup', (e) => {
      if (isDragging) endDrag(e);
    });

    // Touch events
    progressBar.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', (e) => {
      if (isDragging) updateDrag(e);
    }, { passive: false });
    document.addEventListener('touchend', (e) => {
      if (isDragging) {
        const percent = parseFloat(progressFill.style.width) / 100 || 0;
        audio.currentTime = percent * duration;
        isDragging = false;
        progressHandle.classList.remove('scale-125');
        currentTimeEl.classList.remove('text-accent-primary', 'font-bold');
        hideHoverPreview();
      }
    });

    // ═══════════════════════════════════════════════════════════════════
    // CHAPITRES
    // ═══════════════════════════════════════════════════════════════════

    // Toggle liste des chapitres
    if (chaptersToggle) {
      chaptersToggle.addEventListener('click', () => {
        chaptersList.classList.toggle('hidden');
        chaptersArrow.classList.toggle('rotate-180');
      });
    }

    // Clic sur un chapitre
    chapterItems.forEach((item, idx) => {
      item.addEventListener('click', () => {
        const startTime = parseFloat(item.dataset.startTime) || 0;
        audio.currentTime = startTime;
      });
    });

    // Clic sur un marqueur de chapitre
    chapterMarkers.forEach(marker => {
      marker.addEventListener('click', (e) => {
        e.stopPropagation();
        const startTime = parseFloat(marker.dataset.startTime) || 0;
        audio.currentTime = startTime;
      });
    });

    // ═══════════════════════════════════════════════════════════════════
    // RACCOURCIS CLAVIER
    // ═══════════════════════════════════════════════════════════════════

    document.addEventListener('keydown', (e) => {
      // Ignorer si on est dans un input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skip(-10);
          animateSkipButton(skipBackBtn, skipBackIcon, 'back');
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(30);
          animateSkipButton(skipForwardBtn, skipForwardIcon, 'forward');
          break;
      }
    });

    // ═══════════════════════════════════════════════════════════════════
    // MEDIA SESSION API (contrôles système)
    // ═══════════════════════════════════════════════════════════════════

    if ('mediaSession' in navigator) {
      const title = player.dataset.title || 'Podcast';
      const artist = player.dataset.artist || 'MGC Coaching';
      const artwork = player.dataset.artwork || '';

      navigator.mediaSession.metadata = new MediaMetadata({
        title: title,
        artist: artist,
        album: 'Podcast MGC Coaching',
        artwork: artwork ? [{ src: artwork, sizes: '512x512', type: 'image/jpeg' }] : []
      });

      navigator.mediaSession.setActionHandler('play', () => audio.play());
      navigator.mediaSession.setActionHandler('pause', () => audio.pause());
      navigator.mediaSession.setActionHandler('seekbackward', () => skip(-10));
      navigator.mediaSession.setActionHandler('seekforward', () => skip(30));
      navigator.mediaSession.setActionHandler('previoustrack', goToPrevChapter);
      navigator.mediaSession.setActionHandler('nexttrack', goToNextChapter);
    }

    // ═══════════════════════════════════════════════════════════════════
    // INITIALISATION
    // ═══════════════════════════════════════════════════════════════════

    updatePlayButton();
    updateCurrentChapter();
    setSpeed(1);
  }

})();