



  // =============================================================================
// Cookie Consent Management
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initCookieConsent();
});

function initCookieConsent() {
  const banner = document.getElementById('cookie-consent');
  if (!banner) return;

  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');
  const settingsBtn = document.getElementById('cookie-settings-btn');
  const settingsPanel = document.getElementById('cookie-settings-panel');
  const savePreferencesBtn = document.getElementById('cookie-save-preferences');
  const analyticsCheckbox = document.getElementById('cookie-analytics');

  // Check if user has already made a choice
  const consent = getCookieConsent();
  
  if (consent === null) {
    // No choice made yet, show banner after a short delay
    setTimeout(() => {
      showBanner();
    }, 1000);
  } else {
    // User has made a choice, apply it
    applyConsent(consent);
  }

  // Accept all cookies
  acceptBtn?.addEventListener('click', () => {
    const consent = {
      necessary: true,
      analytics: true,
      timestamp: new Date().toISOString()
    };
    saveCookieConsent(consent);
    applyConsent(consent);
    hideBanner();
  });

  // Reject non-essential cookies
  rejectBtn?.addEventListener('click', () => {
    const consent = {
      necessary: true,
      analytics: false,
      timestamp: new Date().toISOString()
    };
    saveCookieConsent(consent);
    applyConsent(consent);
    hideBanner();
  });

  // Toggle settings panel
  settingsBtn?.addEventListener('click', () => {
    settingsPanel?.classList.toggle('hidden');
    
    // Update button text
    if (settingsPanel?.classList.contains('hidden')) {
      settingsBtn.textContent = 'Personnaliser';
    } else {
      settingsBtn.textContent = 'Masquer';
    }
  });

  // Save preferences
  savePreferencesBtn?.addEventListener('click', () => {
    const consent = {
      necessary: true,
      analytics: analyticsCheckbox?.checked ?? false,
      timestamp: new Date().toISOString()
    };
    saveCookieConsent(consent);
    applyConsent(consent);
    hideBanner();
  });

  // Helper functions
  function showBanner() {
    banner.classList.remove('translate-y-full');
    banner.classList.add('translate-y-0');
  }

  function hideBanner() {
    banner.classList.add('translate-y-full');
    banner.classList.remove('translate-y-0');
  }

  function getCookieConsent() {
    try {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent) return null;
      
      const parsed = JSON.parse(consent);
      
      // Check if consent is older than 12 months (RGPD requirement)
      const consentDate = new Date(parsed.timestamp);
      const now = new Date();
      const monthsDiff = (now - consentDate) / (1000 * 60 * 60 * 24 * 30);
      
      if (monthsDiff > 12) {
        localStorage.removeItem('cookie-consent');
        return null;
      }
      
      return parsed;
    } catch {
      return null;
    }
  }

  function saveCookieConsent(consent) {
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
  }

  function applyConsent(consent) {
    if (consent.analytics) {
      enableAnalytics();
    } else {
      disableAnalytics();
    }
    
    // Update checkbox state if visible
    if (analyticsCheckbox) {
      analyticsCheckbox.checked = consent.analytics;
    }
  }

  function enableAnalytics() {
    // Google Analytics example - uncomment and configure if needed
    // window['ga-disable-GA_MEASUREMENT_ID'] = false;
    
    // Or load GA script dynamically
    // loadGoogleAnalytics('G-XXXXXXXXXX');
    
    console.log('Analytics cookies enabled');
  }

  function disableAnalytics() {
    // Disable Google Analytics
    // window['ga-disable-GA_MEASUREMENT_ID'] = true;
    
    // Clear existing GA cookies
    deleteCookie('_ga');
    deleteCookie('_gid');
    deleteCookie('_gat');
    
    console.log('Analytics cookies disabled');
  }

  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  // Optional: Load Google Analytics dynamically
  function loadGoogleAnalytics(measurementId) {
    if (document.getElementById('ga-script')) return;
    
    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', measurementId);
  }
}

// Expose function to reopen cookie settings (for footer link)
window.openCookieSettings = function() {
  const banner = document.getElementById('cookie-consent');
  const settingsPanel = document.getElementById('cookie-settings-panel');
  
  if (banner) {
    banner.classList.remove('translate-y-full');
    banner.classList.add('translate-y-0');
  }
  
  if (settingsPanel) {
    settingsPanel.classList.remove('hidden');
  }
};