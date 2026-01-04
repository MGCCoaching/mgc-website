// =============================================================================
// Main JavaScript - MGC Coaching
// =============================================================================
// Point d'entrée qui orchestre les modules séparés
// Compatible Swup via window.MGC.initAll()
// =============================================================================

(function() {
  'use strict';

  // ===========================================================================
  // Mobile Menu
  // ===========================================================================
  function initMobileMenu() {
    const menuToggle = document.querySelector('#menu-toggle');
    const menuClose = document.querySelector('#menu-close');
    const mobileNav = document.querySelector('#mobile-nav');
    const menuLinks = mobileNav?.querySelectorAll('a');

    if (!menuToggle || !mobileNav) return;

    // Nettoyer les anciens listeners (important pour Swup)
    const newMenuToggle = menuToggle.cloneNode(true);
    menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
    
    const newMenuClose = menuClose?.cloneNode(true);
    if (menuClose && newMenuClose) {
      menuClose.parentNode.replaceChild(newMenuClose, menuClose);
    }

    // Open menu
    newMenuToggle.addEventListener('click', () => {
      mobileNav.classList.remove('-translate-y-full');
      mobileNav.classList.add('translate-y-0');
      document.body.style.overflow = 'hidden';
    });

    // Close menu
    const closeMenu = () => {
      mobileNav.classList.add('-translate-y-full');
      mobileNav.classList.remove('translate-y-0');
      document.body.style.overflow = '';
    };

    newMenuClose?.addEventListener('click', closeMenu);

    // Close on link click
    menuLinks?.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileNav.classList.contains('-translate-y-full')) {
        closeMenu();
      }
    });

    // Close on backdrop click
    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) {
        closeMenu();
      }
    });
  }

  // ===========================================================================
  // Dark Mode Toggle
  // ===========================================================================
  function initDarkMode() {
    const darkModeToggles = document.querySelectorAll('.dark-mode-toggle');
    const htmlElement = document.documentElement;
    
    if (darkModeToggles.length === 0) return;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      htmlElement.classList.add('dark');
      updateToggleIcons(true);
    } else {
      htmlElement.classList.remove('dark');
      updateToggleIcons(false);
    }

    // Add click listener to all toggle buttons
    darkModeToggles.forEach(toggle => {
      const newToggle = toggle.cloneNode(true);
      toggle.parentNode.replaceChild(newToggle, toggle);
      
      newToggle.addEventListener('click', () => {
        const isDark = htmlElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateToggleIcons(isDark);
      });
    });

    function updateToggleIcons(isDark) {
      document.querySelectorAll('.dark-mode-toggle').forEach(toggle => {
        const icon = toggle.querySelector('.material-symbols-outlined');
        if (icon) {
          icon.textContent = isDark ? 'light_mode' : 'dark_mode';
        }
      });
    }
  }

  // ===========================================================================
  // Scroll Animations (IntersectionObserver)
  // ===========================================================================
  let scrollObserver = null;

  function initScrollAnimations() {
    if (scrollObserver) {
      scrollObserver.disconnect();
    }

    const animatedElements = document.querySelectorAll('[class*="animate-on-scroll"]');
    
    if (animatedElements.length === 0) return;

    // Reset pour permettre la réanimation après navigation Swup
    animatedElements.forEach(el => {
      el.classList.remove('animate-visible');
    });

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
        }
      });
    }, observerOptions);

    animatedElements.forEach(element => {
      scrollObserver.observe(element);
    });
  }

  // ===========================================================================
  // Expose Global API for Swup
  // ===========================================================================
  window.MGC = window.MGC || {};
  
  // Fonctions de ce fichier
  window.MGC.initMobileMenu = initMobileMenu;
  window.MGC.initDarkMode = initDarkMode;
  window.MGC.initScrollAnimations = initScrollAnimations;

  // Fonction principale qui appelle tous les modules
  window.MGC.initAll = function() {
    // Modules de main.js
    initMobileMenu();
    initDarkMode();
    initScrollAnimations();
    
    // Modules externes (s'ils existent)
    if (typeof window.MGC.initFaqCarousel === 'function') {
      window.MGC.initFaqCarousel();
    }
    if (typeof window.MGC.initPodcastPlayer === 'function') {
      window.MGC.initPodcastPlayer();
    }
  };

  // Fonction d'init unique (premier chargement seulement)
  window.MGC.initOnce = function() {
    if (typeof window.MGC.initCookieConsent === 'function') {
      window.MGC.initCookieConsent();
    }
  };

  // ===========================================================================
  // Initial Load
  // ===========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    window.MGC.initAll();
    window.MGC.initOnce();
  });

})();
