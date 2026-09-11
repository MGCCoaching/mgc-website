// =============================================================================
// Cookie Consent Management
// =============================================================================
// Consent is stored in localStorage as { necessary, marketing, timestamp }.
// Third-party trackers (Meta Pixel) are only injected after marketing consent.

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
  const marketingCheckbox = document.getElementById('cookie-marketing');
  // Only rendered in production builds (see cookie-consent.html)
  const metaPixelId = banner.dataset.metaPixelId;

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
      marketing: true,
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
      marketing: false,
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
      marketing: marketingCheckbox?.checked ?? false,
      timestamp: new Date().toISOString()
    };
    saveCookieConsent(consent);
    applyConsent(consent);
    hideBanner();
  });

  // "Gérer les cookies" links (footer)
  document.querySelectorAll('[data-cookie-settings]').forEach((link) => {
    link.addEventListener('click', window.openCookieSettings);
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

      // Ignore choices saved before the marketing category existed
      if (typeof parsed.marketing !== 'boolean') return null;
      
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
    if (consent.marketing) {
      enableMarketing();
    } else {
      disableMarketing();
    }
    
    // Update checkbox state if visible
    if (marketingCheckbox) {
      marketingCheckbox.checked = consent.marketing;
    }
  }

  function enableMarketing() {
    if (!metaPixelId) return;

    // Pixel already loaded on this page (consent re-granted after a revoke)
    if (window.fbq) {
      window.fbq('consent', 'grant');
      return;
    }

    loadMetaPixel(metaPixelId);
  }

  function disableMarketing() {
    // Stop the pixel if it was loaded earlier on this page
    if (window.fbq) {
      window.fbq('consent', 'revoke');
    }

    deleteCookie('_fbp');
    deleteCookie('_fbc');
  }

  function deleteCookie(name) {
    const expired = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = expired;
    // Meta sets its cookies on the registrable domain (e.g. .mariegaetanecomte.fr)
    const rootDomain = location.hostname.split('.').slice(-2).join('.');
    document.cookie = `${expired} domain=.${rootDomain};`;
  }

  // Official Meta Pixel base code, kept as provided by Meta
  function loadMetaPixel(pixelId) {
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  }
}

// Expose function to reopen cookie settings (for footer link)
window.openCookieSettings = function() {
  const banner = document.getElementById('cookie-consent');
  const settingsPanel = document.getElementById('cookie-settings-panel');
  const settingsBtn = document.getElementById('cookie-settings-btn');
  
  if (banner) {
    banner.classList.remove('translate-y-full');
    banner.classList.add('translate-y-0');
  }
  
  if (settingsPanel) {
    settingsPanel.classList.remove('hidden');
  }

  if (settingsBtn) {
    settingsBtn.textContent = 'Masquer';
  }
};
