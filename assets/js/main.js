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

  document.addEventListener("DOMContentLoaded", () => {

    /* EMAIL */
    document.querySelectorAll(".magic-at").forEach(card => {
      card.addEventListener("click", () => {
  
        if (card.dataset.revealed === "true") return;
  
        const user   = card.dataset.emailUser;
        const domain = card.dataset.emailDomain;
        if (!user || !domain) return;
  
        const email = `${user}@${domain}`;
  
        const text = card.querySelector(".magic-text-at");
        if (text) text.textContent = email;
  
        // Mobile : ouvrir le mail si tap long / double tap
        card.addEventListener("dblclick", () => {
          window.location.href = `mailto:${email}`;
        }, { once: true });
  
        card.dataset.revealed = "true";
      });
    });
  
    /* TÉLÉPHONE */
    document.querySelectorAll(".magic-allo").forEach(card => {
      card.addEventListener("click", () => {
  
        if (card.dataset.revealed === "true") return;
  
        const phone = card.dataset.phone;
        const tel   = card.dataset.phoneTel;
        if (!phone || !tel) return;
  
        const text = card.querySelector(".phone-text");
        if (text) text.textContent = phone;
  
        // Mobile : appel direct après révélation
        card.addEventListener("dblclick", () => {
          window.location.href = `tel:${tel}`;
        }, { once: true });
  
        card.dataset.revealed = "true";
      });
    });
  
  });
  