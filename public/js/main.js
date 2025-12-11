// =============================================================================
// Main JavaScript
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
  });
  
  // Mobile Menu Toggle
  // -----------------------------------------------------------------------------
  function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileNav = document.getElementById('mobile-nav');
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