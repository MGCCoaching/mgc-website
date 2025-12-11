// =============================================================================
// Main JavaScript
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initDarkMode();
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