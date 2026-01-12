// =============================================================================
// Main JavaScript
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initDarkMode();
    initScrollAnimations();
  });
  
  // Mobile Menu Toggle
  // -----------------------------------------------------------------------------
  function initMobileMenu() {
    const menuToggle = document.querySelector('#menu-toggle');
    const menuClose = document.querySelector('#menu-close');
    const mobileNav = document.querySelector('#mobile-nav');
    const menuLinks = mobileNav?.querySelectorAll('a');
  
    if (!menuToggle || !mobileNav) return;
  
    // Open menu
    menuToggle.addEventListener('click', () => {
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
  
    menuClose?.addEventListener('click', closeMenu);
  
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

  // Dark Mode Toggle
  // -----------------------------------------------------------------------------
  function initDarkMode() {
    const darkModeToggles = document.querySelectorAll('.dark-mode-toggle');
    const htmlElement = document.documentElement;
    
    if (darkModeToggles.length === 0) return;
  
    // Check for saved theme preference or default to light mode
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
      toggle.addEventListener('click', () => {
        const isDark = htmlElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateToggleIcons(isDark);
      });
    });
  
    // Update all toggle icons based on theme
    function updateToggleIcons(isDark) {
      darkModeToggles.forEach(toggle => {
        const icon = toggle.querySelector('.material-symbols-outlined');
        if (icon) {
          icon.textContent = isDark ? 'light_mode' : 'dark_mode';
        }
      });
    }
  }

  // Scroll Animations
  // -----------------------------------------------------------------------------
  function initScrollAnimations() {
    // Find all elements with animation classes
    const animatedElements = document.querySelectorAll('[class*="animate-on-scroll"]');
    
    if (animatedElements.length === 0) return;

    // Create intersection observer
    const observerOptions = {
      threshold: 0.1, // Trigger when 10% of element is visible
      rootMargin: '0px 0px -50px 0px' // Start animation slightly before element enters viewport
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add 'visible' class when element enters viewport
          entry.target.classList.add('animate-visible');
          
          // Optional: Stop observing after animation (one-time animation)
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }



  // Mail reveal 
  // -----------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
  
    const setupReveal = (selector, textSelector) => {
      const container = document.querySelector(selector);
      if (!container) return;
  
      const handleClick = (e) => {
        // On récupère la valeur encodée
        const encoded = container.getAttribute('data-v');
        if (!encoded) return;
  
        // On décode et on injecte dans le <p>
        const targetText = container.querySelector(textSelector);
        targetText.textContent = atob(encoded);
  
        // On retire le curseur pointer et l'événement pour éviter les bugs
        container.classList.remove('cursor-pointer');
        container.style.pointerEvents = 'none'; // Empêche tout bug de clic résiduel
        targetText.style.pointerEvents = 'auto'; // Permet quand même de sélectionner le texte
        
        container.removeEventListener('click', handleClick);
      };
  
      container.addEventListener('click', handleClick);
    };
  
    // Initialisation pour l'email et le téléphone de façon indépendante
    setupReveal('.magic-at', '.magic-text-at');
    setupReveal('.magic-allo', '.phone-text');
  });