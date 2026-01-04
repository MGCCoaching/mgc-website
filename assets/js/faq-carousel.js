/**
 * FAQ Carousel - Gestion du carrousel responsive avec transition slide
 * Mobile: 1 FAQ par slide / Desktop: 2 FAQ par slide
 * Compatible Swup via window.MGC.initFaqCarousel()
 */
(function() {
  'use strict';

  function initFaqCarousel() {
    const container = document.querySelector('.faq-carousel-container');
    
    if (!container) return;
    
    let currentSlideMobile = 0;
    let currentSlideDesktop = 0;
    
    const trackMobile = document.querySelector('.faq-track-mobile');
    const trackDesktop = document.querySelector('.faq-track-desktop');
    const slidesMobile = document.querySelectorAll('.faq-slide-mobile');
    const slidesDesktop = document.querySelectorAll('.faq-slide-desktop');
    
    // Fonction pour récupérer les éléments dynamiquement (après clonage)
    function getElements() {
      return {
        dotsMobile: document.querySelectorAll('.faq-dots-mobile .faq-dot'),
        dotsDesktop: document.querySelectorAll('.faq-dots-desktop .faq-dot'),
        prevBtnMobile: document.querySelector('.faq-nav-mobile .faq-prev'),
        nextBtnMobile: document.querySelector('.faq-nav-mobile .faq-next'),
        prevBtnDesktop: document.querySelector('.faq-nav-desktop .faq-prev'),
        nextBtnDesktop: document.querySelector('.faq-nav-desktop .faq-next')
      };
    }
    
    function isMobile() {
      return window.innerWidth < 640;
    }
    
    function updateTrack(track, currentSlide) {
      if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
      }
    }
    
    function updateDots(dots, currentSlide) {
      dots.forEach((dot, index) => {
        if (index === currentSlide) {
          dot.classList.remove('bg-text-tertiary/40');
          dot.classList.add('bg-accent-primary', 'scale-125');
        } else {
          dot.classList.add('bg-text-tertiary/40');
          dot.classList.remove('bg-accent-primary', 'scale-125');
        }
      });
    }
    
    function updateButtons(prevBtn, nextBtn, currentSlide, totalSlides) {
      if (prevBtn) prevBtn.disabled = currentSlide === 0;
      if (nextBtn) nextBtn.disabled = currentSlide === totalSlides - 1;
    }
    
    function updateCarousel() {
      const els = getElements();
      if (isMobile()) {
        updateTrack(trackMobile, currentSlideMobile);
        updateDots(els.dotsMobile, currentSlideMobile);
        updateButtons(els.prevBtnMobile, els.nextBtnMobile, currentSlideMobile, slidesMobile.length);
      } else {
        updateTrack(trackDesktop, currentSlideDesktop);
        updateDots(els.dotsDesktop, currentSlideDesktop);
        updateButtons(els.prevBtnDesktop, els.nextBtnDesktop, currentSlideDesktop, slidesDesktop.length);
      }
    }
    
    function goToSlide(index) {
      if (isMobile()) {
        currentSlideMobile = Math.max(0, Math.min(index, slidesMobile.length - 1));
      } else {
        currentSlideDesktop = Math.max(0, Math.min(index, slidesDesktop.length - 1));
      }
      updateCarousel();
    }
    
    function nextSlide() {
      if (isMobile()) {
        goToSlide(currentSlideMobile + 1);
      } else {
        goToSlide(currentSlideDesktop + 1);
      }
    }
    
    function prevSlide() {
      if (isMobile()) {
        goToSlide(currentSlideMobile - 1);
      } else {
        goToSlide(currentSlideDesktop - 1);
      }
    }
    
    // Récupérer les éléments actuels
    let els = getElements();
    
    // Clone buttons pour nettoyer les listeners existants
    const buttonsToClone = [els.prevBtnMobile, els.nextBtnMobile, els.prevBtnDesktop, els.nextBtnDesktop];
    buttonsToClone.forEach(btn => {
      if (btn) {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
      }
    });

    // Re-récupérer les éléments après clonage
    els = getElements();
    
    // Ajouter les listeners sur les nouveaux boutons
    if (els.prevBtnMobile) els.prevBtnMobile.addEventListener('click', prevSlide);
    if (els.nextBtnMobile) els.nextBtnMobile.addEventListener('click', nextSlide);
    if (els.prevBtnDesktop) els.prevBtnDesktop.addEventListener('click', prevSlide);
    if (els.nextBtnDesktop) els.nextBtnDesktop.addEventListener('click', nextSlide);
    
    // Dots listeners (cloner aussi pour éviter les doublons)
    els.dotsMobile.forEach((dot) => {
      const newDot = dot.cloneNode(true);
      dot.parentNode.replaceChild(newDot, dot);
    });
    els.dotsDesktop.forEach((dot) => {
      const newDot = dot.cloneNode(true);
      dot.parentNode.replaceChild(newDot, dot);
    });
    
    // Re-récupérer et ajouter listeners aux dots
    els = getElements();
    els.dotsMobile.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlideMobile = index;
        updateCarousel();
      });
    });
    
    els.dotsDesktop.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentSlideDesktop = index;
        updateCarousel();
      });
    });
    
    // Swipe support
    let touchStartX = 0;
    
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    container.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }, { passive: true });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const rect = container.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
      }
    });
    
    // Resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateCarousel, 100);
    });
    
    // Init
    updateCarousel();
  }

  // Exposer via window.MGC
  window.MGC = window.MGC || {};
  window.MGC.initFaqCarousel = initFaqCarousel;

})();
