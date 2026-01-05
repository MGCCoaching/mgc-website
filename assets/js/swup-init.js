// =============================================================================
// Swup Configuration - MGC Coaching
// =============================================================================
// Gestion des transitions de pages avec player audio persistant
// =============================================================================

import Swup from 'swup';
import SwupHeadPlugin from '@swup/head-plugin';
import SwupPreloadPlugin from '@swup/preload-plugin';
import SwupScrollPlugin from '@swup/scroll-plugin';

// ===========================================================================
// Configuration Swup avec Plugins
// ===========================================================================

const plugins = [
  // Head Plugin - Met à jour le <head> (title, meta, etc.)
  new SwupHeadPlugin({
    persistAssets: true,
    persistTags: 'link[rel="stylesheet"], script[src], style'
  }),
  
  // Preload Plugin - Précharge les pages au survol
  new SwupPreloadPlugin({
    throttle: 3
  }),
  
  // Scroll Plugin - Gère le scroll après navigation
  new SwupScrollPlugin({
    doScrollingRightAway: false,
    animateScroll: {
      betweenPages: true,
      samePageWithHash: true,
      samePage: true
    },
    scrollFriction: 0.3,
    scrollAcceleration: 0.04
  })
];

const swup = new Swup({
    // Containers à remplacer lors de la navigation
    containers: ['#swup-main'],
    
    // Sélecteur pour les éléments animés
    animationSelector: '[class*="swup-transition"]',
    
    // Cache des pages
    cache: true,
    
    // Liens à gérer (internes uniquement, pas admin, pas ancres, pas target blank)
    linkSelector: 'a[href^="/"]:not([data-no-swup]):not([href*="/admin"]):not([href^="#"]):not([target="_blank"])',
    
    // Plugins
    plugins: plugins,
    
    // Animation par défaut
    animationScope: 'html',
  });

  // ===========================================================================
  // Hooks Swup
  // ===========================================================================

  // Avant de quitter la page (début de transition)
  swup.hooks.on('visit:start', () => {
    // Ajouter classe pour animation de sortie
    document.documentElement.classList.add('is-leaving');
    
    // Sauvegarder l'état du player si actif
    savePersistentPlayerState();
  });

  // Contenu remplacé (nouvelle page chargée)
  swup.hooks.on('content:replace', () => {
    // Scroll to top
    window.scrollTo(0, 0);
  });

  // Après la transition (page visible)
  swup.hooks.on('page:view', () => {
    // Retirer classe de transition
    document.documentElement.classList.remove('is-leaving');
    
    // Réinitialiser tous les scripts
    if (window.MGC && typeof window.MGC.initAll === 'function') {
      window.MGC.initAll();
    }
    
    // Réinitialiser le player de page si nécessaire
    initPagePlayer();
    
    // Analytics (si activé)
    trackPageView();
  });

  // Erreur de chargement
  swup.hooks.on('fetch:error', (visit) => {
    console.error('Swup fetch error:', visit);
    // Fallback: navigation classique
    window.location.href = visit.to.url;
  });

  // ===========================================================================
  // Player Audio Persistant
  // ===========================================================================
  let persistentPlayerState = {
    isPlaying: false,
    currentTime: 0,
    src: null,
    playbackRate: 1
  };

  function savePersistentPlayerState() {
    const persistentPlayer = document.getElementById('persistent-player');
    const audio = persistentPlayer?.querySelector('audio');
    
    if (audio && audio.src) {
      persistentPlayerState = {
        isPlaying: !audio.paused,
        currentTime: audio.currentTime,
        src: audio.src,
        playbackRate: audio.playbackRate
      };
    }
  }

  function restorePersistentPlayerState() {
    const persistentPlayer = document.getElementById('persistent-player');
    const audio = persistentPlayer?.querySelector('audio');
    
    if (audio && persistentPlayerState.src) {
      if (audio.src === persistentPlayerState.src) {
        audio.currentTime = persistentPlayerState.currentTime;
        audio.playbackRate = persistentPlayerState.playbackRate;
        if (persistentPlayerState.isPlaying) {
          audio.play().catch(() => {});
        }
      }
    }
  }

  function initPagePlayer() {
    // Réinitialiser le trigger podcast si présent sur la nouvelle page
    if (typeof window.MGC?.initPersistentPlayer === 'function') {
      window.MGC.initPersistentPlayer();
    }
    
    // Synchroniser l'état du trigger avec le player persistant
    if (typeof window.MGC?.syncTrigger === 'function') {
      window.MGC.syncTrigger();
    }
  }

  function syncPlayers(pagePlayer, persistentPlayer) {
    // Géré par persistent-player.js via window.MGC.syncTrigger
  }

  // ===========================================================================
  // Analytics
  // ===========================================================================
  function trackPageView() {
    // Google Analytics 4
    if (typeof gtag === 'function') {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }
    
    // Autres analytics...
  }

  // ===========================================================================
  // Utilitaires
  // ===========================================================================
  
  // Note: Le préchargement au survol est géré par SwupPreloadPlugin

  // Exposer swup globalement si besoin
  window.swup = swup;
  
  console.log('Swup initialized with', plugins.length, 'plugins');

export default swup;
