// ================================================================
//  ARGIRA · MAP EXPLORER · ARRANQUE POR EVENTOS (SIN POLLING)
//  ================================================================
(function() {
  'use strict';

  // ------------------------------------------------------------------
  // 1. METADATOS DE OBRAS (OBRA_META + ALIASES)
  // ------------------------------------------------------------------
  const OBRA_META = {
    'Malevich · Blanco sobre blanco': {
      titulo: 'Blanco sobre Blanco',
      artista: 'Kazimir Malevich',
      descripcion: 'Suprematismo en su estado más puro: dos cuadrados blancos, uno girado levemente sobre el otro. Ausencia total de color cromático. El silencio visual hecho pintura.',
      img: 'White_on_White_(Malevich,_1918).png',
      audio: 'White_on_White_(Malevich,_1918).wav',
    },
    'Malevich · Cuadrado negro': {
      titulo: 'Cuadrado Negro',
      artista: 'Kazimir Malevich',
      descripcion: 'Icono del Suprematismo. Un cuadrado negro sobre fondo blanco, sin representación de ningún objeto real. Simboliza la «sensación pura» liberada de toda referencia figurativa.',
      img: 'Malevich_Cuadrado_Negro_1915.jpg',
      audio: 'Malevich_Cuadrado_Negro_1915.wav',
    },
    'Goya · Saturno': {
      titulo: 'Saturno devorando a su hijo',
      artista: 'Francisco de Goya',
      descripcion: 'Una de las Pinturas Negras de Goya. Saturno, dios del tiempo, devora a uno de sus hijos para evitar ser destronado. Pincelada brutal, paleta oscura, figura grotesca y aterradora.',
      img: 'goya-saturno.jpg',
      audio: 'goya-saturno.wav',
    },
    'Rembrandt · Self-Portrait': {
      titulo: 'Autorretrato',
      artista: 'Rembrandt van Rijn',
      descripcion: 'Autorretrato tardío de Rembrandt. La luz emerge de la oscuridad con la técnica del claroscuro más depurada. El rostro envejecido mira directamente, sin idealización.',
      img: '500px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.jpg',
      audio: '500px-Rembrandt_van_Rijn_-_Self-Portrait_-_Google_Art_Project.wav',
    },
    'Hopper · Morning Sun': {
      titulo: 'Morning Sun',
      artista: 'Edward Hopper',
      descripcion: 'Una mujer sentada en la cama, bañada por la luz de la mañana. Soledad urbana norteamericana. Colores cálidos pero contenidos, composición geométrica, silencio palpable.',
      img: 'EdwardHopperMorningSun1952.jpg',
      audio: 'EdwardHopperMorningSun1952.wav',
    },
    'Vermeer · La lechera': {
      titulo: 'La Lechera',
      artista: 'Johannes Vermeer',
      descripcion: 'Una criada vierte leche con concentración absoluta. Luz de ventana difusa y precisa. Azules y amarillos en equilibrio casi musical. Una escena cotidiana convertida en eternidad.',
      img: 'Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.png',
      audio: 'Johannes_Vermeer_-_Het_melkmeisje_-_Google_Art_Project.wav',
    },
    'Dalí · Perfil del tiempo': {
      titulo: 'La Persistencia de la Memoria',
      artista: 'Salvador Dalí',
      descripcion: 'Relojes blandos se derriten sobre un paisaje de Cadaqués. El tiempo se disuelve. Precisión fotográfica al servicio de lo imposible. El inconsciente arquitecturado en aceite.',
      img: 'Dalí,_Perfil_del_tiempo,_Vroclavo,_7.jpeg',
      audio: 'Dalí,_Perfil_del_tiempo,_Vroclavo,_7.wav',
    },
    'Cézanne · Montaña Sainte-Victoire': {
      titulo: 'La Montagne Sainte-Victoire',
      artista: 'Paul Cézanne',
      descripcion: 'La montaña provenzal que Cézanne pintó más de sesenta veces. Pinceladas moduladas construyen el volumen sin perspectiva clásica. Puente entre el Impresionismo y el Cubismo.',
      img: 'Paul_Cézanne_-_Montagne_Saint-victoire_-_Google_Art_Project.jpg',
      audio: 'Paul_Cézanne_-_Montagne_Saint-victoire_-_Google_Art_Project.wav',
    },
    'Monet · Cliff Walk Pourville': {
      titulo: 'Acantilados de Pourville',
      artista: 'Claude Monet',
      descripcion: 'Dos figuras femeninas en lo alto del acantilado, bajo un cielo normando. Pinceladas vibrantes capturan el movimiento del viento y el brillo del mar. Impresionismo pleno.',
      img: 'Claude_Monet_-_Cliff_Walk_at_Pourville_-_Google_Art_Project.jpg',
      audio: 'Claude_Monet_-_Cliff_Walk_at_Pourville_-_Google_Art_Project.wav',
    },
    'Botticelli · El nacimiento de Venus': {
      titulo: 'El Nacimiento de Venus',
      artista: 'Sandro Botticelli',
      descripcion: 'Venus emerge del mar sobre una concha, impulsada por los vientos. Línea sinuosa, paleta de rosas y verdes delicados. El ideal de belleza renacentista florentino cristalizado.',
      img: 'Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg',
      audio: 'Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.wav',
    },
    'Degas · Dancers pink and green': {
      titulo: 'Bailarinas Azules',
      artista: 'Edgar Degas',
      descripcion: 'Cuatro bailarinas ajustan sus trajes en un momento de pausa. El azul domina el cuadro con intensidad. Composición fragmentada, vista desde un ángulo inusual, casi fotográfico.',
      img: 'Edgar_Germain_Hilaire_Degas_076.jpg',
      audio: 'Edgar_Germain_Hilaire_Degas_076.wav',
    },
    'Monet · Amapolas': {
      titulo: 'Campo de Amapolas',
      artista: 'Claude Monet',
      descripcion: 'Un campo de amapolas rojas bajo el cielo de verano francés. Manchas de color puro, sin contorno definido. La vibración del color sobre el lienzo recrea la sensación de la luz.',
      img: 'field-of-poppies.jpg!Large.jpg',
      audio: 'field-of-poppies.jpg!Large.wav',
    },
    '1280px-Korenveld_Van_Gogh': {
      titulo: 'Campo de Trigo con Cuervos',
      artista: 'Vincent van Gogh',
      descripcion: 'Una de las últimas obras de Van Gogh. Un camino se bifurca bajo un cielo turbulento y cuervos negros. Pinceladas en espiral expresan angustia y al mismo tiempo amor por la tierra.',
      img: '1280px-Korenveld_met_kraaien_-_s0149V1962_-_Van_Gogh_Museum.jpg',
      audio: '1280px-Korenveld_met_kraaien_-_s0149V1962_-_Van_Gogh_Museum.wav',
    },
    'Kandinsky · Several Circles': {
      titulo: 'Several Circles',
      artista: 'Wassily Kandinsky',
      descripcion: 'Círculos de colores puros flotan sobre fondo negro. Para Kandinsky, cada color tiene una resonancia espiritual y musical. Este cuadro es casi una partitura visual.',
      img: 'este.jpg',
      audio: 'este.wav',
    },
    'Matisse · La habitación roja': {
      titulo: 'La Mesa Roja',
      artista: 'Henri Matisse',
      descripcion: 'Una habitación donde el rojo lo invade todo: mesa, paredes, decoración. Los patrones arabescos vibran sobre el rojo intenso. Color liberado de la forma, música hecha pintura.',
      img: 'La_Desserte_rouge,_par_Henri_Matisse.jpg',
      audio: 'La_Desserte_rouge,_par_Henri_Matisse.wav',
    },
    'Kandinsky · Jaune Rouge Bleu': {
      titulo: 'Amarillo Rojo Azul',
      artista: 'Wassily Kandinsky',
      descripcion: 'Composición abstracta en la que los tres colores primarios organizan el espacio. Líneas, curvas y manchas interactúan como instrumentos en una sinfonía. El cuadro más cromático del catálogo.',
      img: '3840px-Kandinsky_-_Jaune_Rouge_Bleu.jpg',
      audio: '3840px-Kandinsky_-_Jaune_Rouge_Bleu.wav',
    },
  };

  // CATALOGUE_ALIASES eliminado — findMeta() devuelve datos puros (sin lógica de rutas)
  // La resolución de rutas ocurre en resolveImg(), cerca del punto de uso (img.src).

  function findMeta(id) {
    // 1. Override curado (OBRA_META) — solo si existe
    const override = OBRA_META[id];

    // 2. Base desde CATALOGUE — fuente única de verdad
    const base = window.CATALOGUE?.find(o => o.id === id);

    // 3. Sin base → error controlado, nunca UI rota
    if (!base) {
      if (override) return override;
      console.warn(`[ARGIRA] obra no encontrada en catálogo: "${id}"`);
      const parts = id.split('·');
      return {
        titulo:      parts.slice(1).join('·').trim() || id,
        artista:     parts[0]?.trim() || 'ARGIRA',
        descripcion: 'Obra no encontrada en el catálogo ARGIRA.',
        img:         null,
        audio:       null,
      };
    }

    // 4. Base derivada desde CATALOGUE
    const parts   = base.id.split('·');
    const derived = {
      titulo:      parts.slice(1).join('·').trim() || base.id,
      artista:     parts[0]?.trim() || 'ARGIRA',
      descripcion: 'Obra del catálogo ARGIRA. Explora su sonificación en el mapa perceptual.',
      img:         null,
      audio:       null,
      freq:        base.freq,
      tempo:       base.tempo,
    };

    // 5. Merge: override curado gana sobre base derivada
    if (!override) {
      console.warn(`[ARGIRA] sin metadatos curados para: "${id}"`);
      return derived;
    }
    return { ...derived, ...override };
  }

  // Resuelve src de imagen: assets locales → img/, URLs absolutas → tal cual.
  // Mantener aquí (capa de presentación), no en findMeta (capa de datos).
  function resolveImg(src) {
    if (!src) return '';
    if (/^https?:\/\//.test(src)) return src;
    return 'img/' + src;
  }

  // ------------------------------------------------------------------
  // 2. MODAL (TODAS LAS FUNCIONES)
  // ------------------------------------------------------------------
  let overlay, modal, listenBtn, closeBtn, xBtn;
  let _currentAudio = null;
  let _lastFocused  = null;

  function buildModal() {
    const overlayDiv = document.createElement('div');
    overlayDiv.id = 'argira-obra-overlay';
    overlayDiv.setAttribute('aria-hidden', 'true');
    overlayDiv.innerHTML = `
      <div id="argira-obra-modal" role="dialog" aria-modal="true" aria-labelledby="argira-obra-title" aria-describedby="argira-obra-desc" tabindex="-1">
        <button id="argira-obra-x-btn" aria-label="Cerrar panel de obra" type="button">✕</button>
        <div id="argira-obra-img-wrap" aria-hidden="true">
          <span id="argira-obra-img-placeholder">cargando imagen…</span>
          <img id="argira-obra-img" src="" alt="" />
        </div>
        <div id="argira-obra-body">
          <p id="argira-obra-artist"></p>
          <h2 id="argira-obra-title"></h2>
          <p id="argira-obra-desc"></p>
          <p id="argira-obra-nivel"></p>
          <div id="argira-obra-actions">
            <button id="argira-obra-listen-btn" class="argira-modal-btn" type="button" aria-pressed="false">🔊 Escuchar</button>
            <button id="argira-obra-close-btn" class="argira-modal-btn" type="button">Cerrar</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(overlayDiv);
    return overlayDiv;
  }

  function getFocusables() {
    return Array.from(modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter(el => !el.disabled && !el.closest('[hidden]'));
  }

  function trapFocus(e) {
    const els = getFocusables();
    if (!els.length) return;
    const first = els[0], last = els[els.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if (e.key === 'Escape') closeModal();
  }

  function openModal(meta) {
    if (!overlay) {
      overlay = document.getElementById('argira-obra-overlay') || buildModal();
      modal = document.getElementById('argira-obra-modal');
      listenBtn = document.getElementById('argira-obra-listen-btn');
      closeBtn = document.getElementById('argira-obra-close-btn');
      xBtn = document.getElementById('argira-obra-x-btn');

      closeBtn.addEventListener('click', closeModal);
      xBtn.addEventListener('click', closeModal);
      overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
      listenBtn.addEventListener('click', toggleListen);
    }

    document.getElementById('argira-obra-title').textContent = meta.titulo;
    document.getElementById('argira-obra-artist').textContent = meta.artista;
    document.getElementById('argira-obra-desc').textContent = meta.descripcion;

    const nivelEl = document.getElementById('argira-obra-nivel');
    if (meta.label) {
      const parts = meta.label.split('·');
      const nivel = parts[parts.length - 1]?.trim();
      nivelEl.textContent = nivel ? `Nivel cromático: ${nivel}` : '';
    } else nivelEl.textContent = '';

    const imgEl = document.getElementById('argira-obra-img');
    const phEl = document.getElementById('argira-obra-img-placeholder');
    imgEl.className = '';
    imgEl.alt = `${meta.titulo} — ${meta.artista}`;

    if (meta.img) {
      imgEl.src = '';
      phEl.textContent = 'cargando imagen…';
      imgEl.onload = () => { imgEl.classList.add('loaded'); phEl.style.display = 'none'; };
      imgEl.onerror = () => { phEl.textContent = 'imagen no disponible'; imgEl.style.display = 'none'; };
      imgEl.src = resolveImg(meta.img);
    } else {
      imgEl.src = '';
      imgEl.style.display = 'none';
      phEl.textContent = 'sin imagen';
    }

    resetListenBtn();
    listenBtn.disabled = !meta.audio && !meta.descripcion;
    listenBtn.dataset.audio = meta.audio || '';
    listenBtn.dataset.texto = meta.descripcion || '';
    listenBtn.dataset.titulo = meta.titulo;
    listenBtn.dataset.artista = meta.artista;

    _lastFocused = document.activeElement;
    overlay.removeAttribute('aria-hidden');
    overlay.classList.add('open');
    setTimeout(() => modal.focus(), 50);
    document.addEventListener('keydown', trapFocus);
    announceToSR(`Obra seleccionada: ${meta.titulo}, ${meta.artista}. Pulsa Escuchar para oír la descripción, o Cerrar para volver al mapa.`);
  }

  function closeModal() {
    if (!overlay) return;
    stopListen();
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', trapFocus);
    if (_lastFocused && typeof _lastFocused.focus === 'function') setTimeout(() => _lastFocused.focus(), 50);
  }

  function toggleListen() {
    if (listenBtn.getAttribute('aria-pressed') === 'true') stopListen();
    else startListen();
  }

  function startListen() {
    const audio = listenBtn.dataset.audio;
    const texto = listenBtn.dataset.texto;
    const titulo = listenBtn.dataset.titulo;
    const artista = listenBtn.dataset.artista;
    const textoCompleto = [titulo && artista ? `${titulo}, por ${artista}.` : titulo || artista, texto].filter(Boolean).join(' ');

    if (window.ArgiraSpeech) window.ArgiraSpeech.stop();
    if (_currentAudio) { _currentAudio.pause(); _currentAudio = null; }

    listenBtn.setAttribute('aria-pressed', 'true');
    listenBtn.classList.add('speaking');
    listenBtn.innerHTML = '⏹ Detener';

    if (window.ArgiraSpeech) {
      window.ArgiraSpeech.speak(textoCompleto, { rate: 0.92 }).then(() => {
        if (audio && listenBtn.getAttribute('aria-pressed') === 'true') playAudioFile(audio);
        else resetListenBtn();
      });
    }
  }

  function playAudioFile(src) {
    try {
      _currentAudio = new Audio(src);
      _currentAudio.volume = 0.75;
      _currentAudio.onended = () => { _currentAudio = null; resetListenBtn(); };
      _currentAudio.onerror = () => { _currentAudio = null; resetListenBtn(); };
      _currentAudio.play().catch(() => resetListenBtn());
    } catch (e) { resetListenBtn(); }
  }

  function stopListen() {
    if (window.ArgiraSpeech) window.ArgiraSpeech.stop();
    if (_currentAudio) { _currentAudio.pause(); _currentAudio.currentTime = 0; _currentAudio = null; }
    resetListenBtn();
  }

  function resetListenBtn() {
    if (!listenBtn) return;
    listenBtn.setAttribute('aria-pressed', 'false');
    listenBtn.classList.remove('speaking');
    listenBtn.innerHTML = '🔊 Escuchar';
  }

  let _srAnnouncer = null;
  function announceToSR(msg) {
    if (!_srAnnouncer) _srAnnouncer = document.getElementById('sr-announcer');
    if (!_srAnnouncer) {
      _srAnnouncer = document.createElement('div');
      _srAnnouncer.setAttribute('role', 'status');
      _srAnnouncer.setAttribute('aria-live', 'polite');
      _srAnnouncer.setAttribute('aria-atomic', 'true');
      _srAnnouncer.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
      document.body.appendChild(_srAnnouncer);
    }
    _srAnnouncer.textContent = '';
    void _srAnnouncer.offsetHeight;
    _srAnnouncer.textContent = msg;
  }

  // ------------------------------------------------------------------
  // 3. UTILIDADES DE COORDENADAS
  // ------------------------------------------------------------------
  function getP1Range() {
    if (typeof window.P1_MIN !== 'undefined') return { min: window.P1_MIN, max: window.P1_MAX };
    return { min: 1.0, max: 5.0 };
  }
  function getP4Range() {
    if (typeof window.P4_MIN !== 'undefined') return { min: window.P4_MIN, max: window.P4_MAX };
    return { min: 1.55, max: 1.95 };
  }

  function clientToNearest(clientX, clientY) {
    const canvas = document.getElementById('map');
    if (!canvas || !window.CATALOGUE) return null;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const { min: P1_lo, max: P1_hi } = getP1Range();
    const { min: P4_lo, max: P4_hi } = getP4Range();
    const normP1 = v => (v - P1_lo) / (P1_hi - P1_lo);
    const normP4 = v => (v - P4_lo) / (P4_hi - P4_lo);
    const W = rect.width, H = rect.height;
    const PAD = 44;
    let bestDist = Infinity, bestObra = null;
    window.CATALOGUE.forEach(obra => {
      const cx = PAD + normP1(obra.P1) * (W - PAD * 2);
      const cy = PAD + (1 - normP4(obra.P4)) * (H - PAD * 2);
      const dx = x - cx, dy = y - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < 18 && dist < bestDist) { bestDist = dist; bestObra = obra; }
    });
    return bestObra;
  }

  // ------------------------------------------------------------------
  // 4. OVERLAY Y NODOS DOM
  // ------------------------------------------------------------------
  let mapOverlay = null;
  let overlayListenersAttached = false;

  function initOverlayAndNodes() {
    const canvas = document.getElementById('map');
    const mapWrap = document.getElementById('mapWrap');
    if (!canvas || !mapWrap) return false;

    if (!mapOverlay) {
      mapOverlay = document.getElementById('map-overlay');
      if (!mapOverlay) {
        mapOverlay = document.createElement('div');
        mapOverlay.id = 'map-overlay';
        canvas.insertAdjacentElement('afterend', mapOverlay);
      }
    }

    function syncOverlaySize() {
      const rect = canvas.getBoundingClientRect();
      mapOverlay.style.width = rect.width + 'px';
      mapOverlay.style.height = rect.height + 'px';
    }

    function cleanup() {
      mapOverlay.querySelectorAll('.map-node').forEach(n => {
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
        mapOverlay.appendChild(btn);
      });
    }

    syncOverlaySize();
    requestAnimationFrame(() => requestAnimationFrame(renderMapNodes));
    const ro = new ResizeObserver(() => { syncOverlaySize(); renderMapNodes(); });
    ro.observe(canvas);
    window.ArgiraMapOverlay = mapOverlay;
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
      // Un solo toque → anclaje (si existe la función global)
      if (typeof window.setAnchorFromHover === 'function') {
        window.setAnchorFromHover(e);
      }
      lastPointer = { time: now, x, y, id: obra.id };
    }

    if (!overlayListenersAttached) {
      mapWrap.addEventListener('pointerup', handlePointerUp, { passive: true });
      overlayListenersAttached = true;
    }
    return true;
  }

  // ------------------------------------------------------------------
  // 6. ARRANQUE POR EVENTOS (SIN POLLING)
  // ------------------------------------------------------------------
  let isInitialized = false;

  function initialize() {
    if (isInitialized) return;
    const canvas = document.getElementById('map');
    const catalogue = window.CATALOGUE;
    if (!canvas || !catalogue || !catalogue.length) return;
    
    initOverlayAndNodes();
    initPointerInteraction();
    isInitialized = true;
    console.log('✅ ARGIRA Map Explorer: inicializado correctamente');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  window.addEventListener('argira:catalogue-ready', initialize);

  // ------------------------------------------------------------------
  // 7. API PÚBLICA
  // ------------------------------------------------------------------
  window.ArgiraMapExplorer = {
    open: openModal,
    close: closeModal,
    findMeta: findMeta,
    clientToNearest: clientToNearest,
    syncNodes: () => window.ArgiraRenderMapNodes?.(),
    overlay: () => document.getElementById('map-overlay'),
  };
})();