// ================================================================
//  ARGIRA · MAP EXPLORER · FASE 2D (con arranque robusto)
//  ================================================================
(function() {
  'use strict';

  // ------------------------------------------------------------------
  // 1. METADATOS DE OBRAS (mismo mapa que antes, con aliases)
  // ------------------------------------------------------------------
  const OBRA_META = { /* ... mantén aquí todo el objeto OBRA_META ... */ };
  const CATALOGUE_ALIASES = { /* ... igual que antes ... */ };

  function findMeta(catalogueId) { /* ... */ }

  // ------------------------------------------------------------------
  // 2. MODAL (FASE 1) – construcción y gestión
  // ------------------------------------------------------------------
  let overlay, modal, listenBtn, closeBtn, xBtn;
  let _currentAudio = null;
  let _lastFocused  = null;
  // ... todas las funciones del modal (buildModal, openModal, closeModal, etc.)
  // (pégalas aquí tal cual estaban, sin cambios)

  // ------------------------------------------------------------------
  // 3. UTILIDADES DE COORDENADAS
  // ------------------------------------------------------------------
  function getP1Range() { /* ... */ }
  function getP4Range() { /* ... */ }
  function clientToNearest(clientX, clientY) { /* ... */ }

  // ------------------------------------------------------------------
  // 4. OVERLAY Y NODOS DOM
  // ------------------------------------------------------------------
  let listenersAttached = false;

  function initOverlayAndNodes() {
    const canvas = document.getElementById('map');
    const mapWrap = document.getElementById('mapWrap');
    if (!canvas || !mapWrap) return false;

    let overlayDiv = document.getElementById('map-overlay');
    if (!overlayDiv) {
      overlayDiv = document.createElement('div');
      overlayDiv.id = 'map-overlay';
      canvas.insertAdjacentElement('afterend', overlayDiv);
    }

    function syncOverlaySize() {
      const rect = canvas.getBoundingClientRect();
      overlayDiv.style.width = rect.width + 'px';
      overlayDiv.style.height = rect.height + 'px';
    }

    function cleanup() {
      overlayDiv.querySelectorAll('.map-node').forEach(n => {
        n.removeEventListener('click', onNodeActivate);
        n.removeEventListener('keydown', onNodeKeydown);
      });
    }

    function onNodeActivate(e) {
      const id = e.currentTarget.dataset.id;
      const obra = window.CATALOGUE.find(o => o.id === id);
      if (!obra) return;
      openModal(findMeta(obra.id));
    }

    function onNodeKeydown(e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      const id = e.currentTarget.dataset.id;
      const obra = window.CATALOGUE.find(o => o.id === id);
      if (!obra) return;
      openModal(findMeta(obra.id));
    }

    function renderMapNodes() {
      if (!window.CATALOGUE) return;
      cleanup();
      const rect = canvas.getBoundingClientRect();
      const W = rect.width, H = rect.height;
      const PAD = 44;
      const { min: P1_lo, max: P1_hi } = getP1Range();
      const { min: P4_lo, max: P4_hi } = getP4Range();
      const normP1 = v => (v - P1_lo) / (P1_hi - P1_lo);
      const normP4 = v => (v - P4_lo) / (P4_hi - P4_lo);

      window.CATALOGUE.forEach(obra => {
        const btn = document.createElement('button');
        btn.className = 'map-node';
        btn.type = 'button';
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.dataset.id = obra.id;
        const meta = findMeta(obra.id);
        btn.setAttribute('aria-label', `${meta.titulo}, de ${meta.artista}. Abrir obra en el mapa perceptual`);
        const cx = PAD + normP1(obra.P1) * (W - PAD * 2);
        const cy = PAD + (1 - normP4(obra.P4)) * (H - PAD * 2);
        btn.style.cssText = `position:absolute; left:${cx}px; top:${cy}px; width:44px; height:44px; transform:translate(-50%,-50%); opacity:0; background:none; border:none; padding:0; cursor:pointer;`;
        btn.addEventListener('click', onNodeActivate);
        btn.addEventListener('keydown', onNodeKeydown);
        overlayDiv.appendChild(btn);
      });
    }

    syncOverlaySize();
    requestAnimationFrame(() => requestAnimationFrame(renderMapNodes));
    const ro = new ResizeObserver(() => { syncOverlaySize(); renderMapNodes(); });
    ro.observe(canvas);
    window.ArgiraMapOverlay = overlayDiv;
    window.ArgiraRenderMapNodes = renderMapNodes;
    return true;
  }

  // ------------------------------------------------------------------
  // 5. INTERACCIÓN UNIFICADA (pointerup)
  // ------------------------------------------------------------------
  let lastPointer = { time: 0, x: 0, y: 0, id: null };
  const POINTER_CONFIG = { DOUBLE_TAP_DELAY: 320, MOVE_TOLERANCE: 30 };

  function initPointerInteraction() {
    const mapWrap = document.getElementById('mapWrap');
    if (!mapWrap) return false;

    function handlePointerUp(e) {
      const rect = mapWrap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = Date.now();
      const timeDiff = now - lastPointer.time;
      const dist = Math.hypot(x - lastPointer.x, y - lastPointer.y);
      const obra = clientToNearest(e.clientX, e.clientY);
      if (!obra) return;
      const meta = findMeta(obra.id);

      const isDouble = (timeDiff < POINTER_CONFIG.DOUBLE_TAP_DELAY && dist < POINTER_CONFIG.MOVE_TOLERANCE);
      if (isDouble) {
        openModal(meta);
        lastPointer.time = 0;
        return;
      }
      if (typeof window.setAnchorFromHover === 'function') {
        window.setAnchorFromHover(e);
      }
      lastPointer = { time: now, x, y, id: obra.id };
    }

    if (!listenersAttached) {
      mapWrap.addEventListener('pointerup', handlePointerUp, { passive: true });
      listenersAttached = true;
    }
    return true;
  }

  // ------------------------------------------------------------------
  // 6. ARRANQUE SEGURO CON REQUESTANIMATIONFRAME (SIN setTimeout)
  // ------------------------------------------------------------------
  let bootAttempts = 0;
  const MAX_ATTEMPTS = 180; // ~3 segundos a 60fps

  function boot() {
    bootAttempts++;
    if (bootAttempts > MAX_ATTEMPTS) {
      console.error('❌ ARGIRA explorer: fallo definitivo de inicialización (CATALOGUE no disponible)');
      return;
    }

    const canvas = document.getElementById('map');
    const catalogue = window.CATALOGUE;

    if (!canvas || !catalogue || !catalogue.length) {
      // No está listo: reintentar en el siguiente frame (sin saturar)
      requestAnimationFrame(boot);
      return;
    }

    // Todo listo: iniciar
    initOverlayAndNodes();
    initPointerInteraction();
    console.log('✅ ARGIRA Map Explorer: inicializado correctamente');
  }

  // Exponer API pública
  window.ArgiraMapExplorer = {
    open: (meta) => openModal(meta),
    close: closeModal,
    findMeta,
    clientToNearest,
    syncNodes: () => window.ArgiraRenderMapNodes?.(),
    overlay: () => document.getElementById('map-overlay'),
  };

  // Iniciar el bootstrap
  boot();
})();