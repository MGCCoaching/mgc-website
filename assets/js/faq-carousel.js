/**
 * FAQ Carousel - Gestion du carrousel responsive
 * Mobile: 1 FAQ par slide / Desktop: 2 FAQ par slide
 */
document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.faq-carousel-container');
  
  if (!container) return;
  
  let currentSlideMobile = 0;
  let currentSlideDesktop = 0;
  
  const slidesMobile = document.querySelectorAll('.faq-slide-mobile');
  const slidesDesktop = document.querySelectorAll('.faq-slide-desktop');
  const dotsMobile = document.querySelectorAll('.faq-dots-mobile .faq-dot');
  const dotsDesktop = document.querySelectorAll('.faq-dots-desktop .faq-dot');
  const prevBtnMobile = document.querySelector('.faq-nav-mobile .faq-prev');
  const nextBtnMobile = document.querySelector('.faq-nav-mobile .faq-next');
  const prevBtnDesktop = document.querySelector('.faq-nav-desktop .faq-prev');
  const nextBtnDesktop = document.querySelector('.faq-nav-desktop .faq-next');
  
  function isMobile() {
    return window.innerWidth < 640;
  }
  
  function updateSlides(slides, currentSlide) {
    slides.forEach((slide, index) => {
      if (index === currentSlide) {
        slide.classList.remove('opacity-0', 'pointer-events-none', 'absolute', 'inset-0');
        slide.classList.add('opacity-100');
      } else {
        slide.classList.add('opacity-0', 'pointer-events-none', 'absolute', 'inset-0');
        slide.classList.remove('opacity-100');
      }
    });
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
    if (isMobile()) {
      updateSlides(slidesMobile, currentSlideMobile);
      updateDots(dotsMobile, currentSlideMobile);
      updateButtons(prevBtnMobile, nextBtnMobile, currentSlideMobile, slidesMobile.length);
    } else {
      updateSlides(slidesDesktop, currentSlideDesktop);
      updateDots(dotsDesktop, currentSlideDesktop);
      updateButtons(prevBtnDesktop, nextBtnDesktop, currentSlideDesktop, slidesDesktop.length);
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
  
  // Event listeners boutons
  if (prevBtnMobile) prevBtnMobile.addEventListener('click', prevSlide);
  if (nextBtnMobile) nextBtnMobile.addEventListener('click', nextSlide);
  if (prevBtnDesktop) prevBtnDesktop.addEventListener('click', prevSlide);
  if (nextBtnDesktop) nextBtnDesktop.addEventListener('click', nextSlide);
  
  // Event listeners dots
  dotsMobile.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlideMobile = index;
      updateCarousel();
    });
  });
  
  dotsDesktop.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlideDesktop = index;
      updateCarousel();
    });
  });
  
  // Support du swipe sur mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }, { passive: true });
  
  // Navigation clavier
  document.addEventListener('keydown', (e) => {
    const rect = container.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    }
  });
  
  // Mise à jour au resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(updateCarousel, 100);
  });
  
  // Init
  updateCarousel();
});