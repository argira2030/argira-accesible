// ============================================================================
// argira-zoom-explore.js — Exploración sonora de la imagen ampliada
// ----------------------------------------------------------------------------
// Adaptado de initCanvasTouch() / initCanvasTour() (página Subir imagen /
// Galería, script__44_.js:3197 y :3344). Ver plan-tour-touch-integracion.md.
//
// Diferencias deliberadas respecto al original:
//   - Recibe el contenedor y la imagen por parámetro (no busca #tu-panel).
//     Pensado para insertarse dentro de #argira-zoom-dynamic-host
//     (dynamic host contract, ver map-explorer.js/buildZoom()), nunca
//     directo en #argira-zoom-content ni #argira-zoom-main.
//   - Estilos con las variables de explorer.css/index.html (--accent, --text,
//     --muted, --mono), no las de la página de origen (--gold, --text-dim,
//     tipografía Cinzel).
//   - SIN el guard de `argira-accessibility-mode`: en la página de origen el
//     canvas táctil se desactiva cuando el modo lector de pantalla está
//     activo, para no competir con los gestos de TalkBack/VoiceOver. Acá,
//     por decisión explícita para el modal de zoom, el touch queda siempre
//     disponible. Si en el futuro se reporta interferencia con un lector de
//     pantalla dentro del modal ampliado, este es el punto a revisar.
//   - [ACTUALIZADO] El original usaba window.ArgiraAudio.resume()
//     (script__44_.js), que no existe en este paquete. Aquí se usa
//     window.ensureAudio() + window.audioCtx, el mecanismo real de
//     index.html — ver fix de publicación de window.audioCtx en
//     index.html (antes documentado como bug en auditoria-propia-
//     4-puntos.md, sección 2).
// ============================================================================

(function () {
  'use strict';

  // Estas tres funciones ya existen en index.html / map-explorer.js con el
  // mismo comportamiento que las de script__44_.js. Se reimplementan acá,
  // sin dependencia externa, para que este archivo sea autocontenido y no
  // dependa de que script__44_.js esté cargado (no lo está en index.html).

  function rgbToHsv(r, g, b) {
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let h = 0;
    if (d > 0) {
      if (max === r) h = ((g - b) / d + 6) % 6;
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return [h, max > 0 ? d / max : 0, max];
  }

  function hueToName(h, s, v) {
    if (s < 0.12) {
      if (v > 0.85) return 'blanco';
      if (v < 0.20) return 'negro';
      return 'gris';
    }
    const deg = h * 360;
    if (deg < 15 || deg >= 345) return 'rojo';
    if (deg < 45) return 'naranja';
    if (deg < 70) return 'amarillo';
    if (deg < 150) return 'verde';
    if (deg < 200) return 'cian';
    if (deg < 260) return 'azul';
    if (deg < 320) return 'violeta';
    return 'magenta';
  }

  const BG_REGEX = /oc[eé]ano|mar(\s|$)|agua(\s|$)|cielo|nube|arena|campo(\s|$)|vegetaci[oó]n|paisaje|fondo|hierba|prado|playa|horizonte|suelo/i;

  function normalizeBoxes(boxes) {
    if (!Array.isArray(boxes)) return [];
    return boxes
      .map(b => ({
        label: String(b.label || '').trim(),
        x1: Number(b.x1), y1: Number(b.y1),
        x2: Number(b.x2), y2: Number(b.y2)
      }))
      .filter(b => b.label && Number.isFinite(b.x1) && Number.isFinite(b.y1) && Number.isFinite(b.x2) && Number.isFinite(b.y2))
      .map(b => ({
        ...b,
        x1: Math.max(0, Math.min(1, b.x1)), y1: Math.max(0, Math.min(1, b.y1)),
        x2: Math.max(0, Math.min(1, b.x2)), y2: Math.max(0, Math.min(1, b.y2))
      }))
      .filter(b => b.x2 > b.x1 && b.y2 > b.y1);
  }

  function findObjectAtPoint(px, py, canvasW, canvasH, objects) {
    const boxes = normalizeBoxes(objects);
    if (!boxes.length) return null;

    function isFondo(obj) {
      const w = obj.x2 - obj.x1, h = obj.y2 - obj.y1, area = w * h;
      if (area > 0.50) return true;
      if (area > 0.30 && BG_REGEX.test(obj.label)) return true;
      if (w > 0.95 && h > 0.40) return true;
      return false;
    }

    const SHRINK = 0.03;
    let best = null, bestArea = Infinity;
    for (const obj of boxes) {
      if (isFondo(obj)) continue;
      const w = obj.x2 - obj.x1, h = obj.y2 - obj.y1;
      const sx = w * SHRINK, sy = h * SHRINK;
      const x1 = (obj.x1 + sx) * canvasW, y1 = (obj.y1 + sy) * canvasH;
      const x2 = (obj.x2 - sx) * canvasW, y2 = (obj.y2 - sy) * canvasH;
      if (x2 <= x1 || y2 <= y1) continue;
      if (px >= x1 && px <= x2 && py >= y1 && py <= y2) {
        const area = (x2 - x1) * (y2 - y1);
        if (area < bestArea) { bestArea = area; best = obj; }
      }
    }

    if (!best) {
      const RADIUS_PX = canvasW <= 1 ? 0.03 : Math.max(30, Math.round(canvasW * 0.10));
      let bestDist = RADIUS_PX;
      for (const obj of boxes) {
        if (isFondo(obj)) continue;
        const bx1 = obj.x1 * canvasW, by1 = obj.y1 * canvasH;
        const bx2 = obj.x2 * canvasW, by2 = obj.y2 * canvasH;
        const dx = Math.max(bx1 - px, 0, px - bx2);
        const dy = Math.max(by1 - py, 0, py - by2);
        const dist = Math.hypot(dx, dy);
        if (dist < bestDist) { bestDist = dist; best = obj; }
      }
    }
    return best ? best.label : null;
  }

  // --------------------------------------------------------------------------
  // initZoomTouch(container, imageElement) — construye el canvas de toque
  // dentro de `container` (pensado para #argira-zoom-dynamic-host, ver
  // "Dynamic host contract" en map-explorer.js/buildZoom() — cualquier
  // UI temporal del zoom monta ahí, nunca directo en #argira-zoom-content
  // ni #argira-zoom-main) usando `imageElement` (pensado para
  // #argira-zoom-img, ya cargada en pantalla).
  //
  // Devuelve un objeto { destroy() } para que quien la invoque (map-explorer.js,
  // en closeZoom()) pueda limpiar listeners y DOM al cerrar el modal.
  // --------------------------------------------------------------------------
  window.initZoomTouch = function (container, imageElement) {
    if (!container || !imageElement) return null;

    const wrap = document.createElement('div');
    wrap.className = 'argira-zoom-touch-wrap';

    const touchCanvas = document.createElement('canvas');
    touchCanvas.className = 'argira-zoom-touch-canvas';
    touchCanvas.setAttribute('aria-label', 'Toca cualquier punto de la imagen para oír su color');

    const dot = document.createElement('div');
    dot.className = 'argira-zoom-touch-dot';

    wrap.appendChild(touchCanvas);
    wrap.appendChild(dot);

    const hint = document.createElement('p');
    hint.className = 'argira-zoom-touch-hint';
    hint.textContent = '👆 Toca la imagen para oír el color de ese punto';

    const colorLabel = document.createElement('div');
    colorLabel.className = 'argira-zoom-touch-label';

    container.appendChild(wrap);
    container.appendChild(hint);
    container.appendChild(colorLabel);

    let objectMap = null;

    // Análisis de color pixel a pixel: se hace una sola vez sobre la imagen
    // ya visible en el modal, no se vuelve a pedir la imagen por red.
    const SIZE = 1024;
    const ratio = imageElement.naturalWidth / imageElement.naturalHeight;
    touchCanvas.width  = ratio >= 1 ? SIZE : Math.round(SIZE * ratio);
    touchCanvas.height = ratio >= 1 ? Math.round(SIZE / ratio) : SIZE;
    const ctx = touchCanvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0, touchCanvas.width, touchCanvas.height);

    // Mapa de objetos: opcional. Si quien invoca ya tiene una promesa en
    // curso (ver initZoomTour más abajo / fetchSharedObjectMap adaptado),
    // se puede pasar como tercer parámetro informal vía window temporal —
    // por ahora, initZoomTouch funciona sola con color+posición, y se
    // enriquece con objectMap si initZoomTour ya la resolvió antes.
    if (window._argiraZoomObjectMapPromise) {
      window._argiraZoomObjectMapPromise.then(data => { objectMap = data; }).catch(() => {});
    }

    function playColorTone(h, s, v) {
      // FIX: window.ArgiraAudio no existe en este paquete (era de
      // script__44_.js, página distinta). Se usa window.ensureAudio(),
      // el mecanismo real de este proyecto (index.html), que crea/resume
      // audioCtx y lo publica en window.audioCtx.
      if (!window.ensureAudio) return;
      window.ensureAudio().then(function () {
        try {
          const audioCtx = window.audioCtx;
          if (!audioCtx) return;
          const freq = 200 + h * 800;
          const volume = 0.15 + s * 0.55;
          const dur = 0.32;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = s < 0.12 ? 'sine' : 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(volume, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + dur);
        } catch (e) {}
      }).catch(function () {});
    }

    // Token de invalidación: si el modal se cierra mientras un speak()
    // diferido (setTimeout 500ms) está pendiente, no debe hablar igual.
    let destroyed = false;
    let pendingTimeouts = [];

    function handleTouch(e) {
      const rect = touchCanvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const imgW = touchCanvas.width, imgH = touchCanvas.height;
      const imgAspect = imgW / imgH;
      const boxAspect = rect.width / rect.height;
      let drawWidth, drawHeight, offsetX, offsetY;
      if (imgAspect > boxAspect) {
        drawWidth = rect.width;
        drawHeight = rect.width / imgAspect;
        offsetX = 0;
        offsetY = (rect.height - drawHeight) / 2;
      } else {
        drawHeight = rect.height;
        drawWidth = rect.height * imgAspect;
        offsetX = (rect.width - drawWidth) / 2;
        offsetY = 0;
      }

      const x = clientX - rect.left - offsetX;
      const y = clientY - rect.top - offsetY;
      if (x < 0 || x > drawWidth || y < 0 || y > drawHeight) return;

      const px = Math.round(x / drawWidth * imgW);
      const py = Math.round(y / drawHeight * imgH);
      if (px < 0 || px >= imgW || py < 0 || py >= imgH) return;

      const pixel = ctx.getImageData(px, py, 1, 1).data;
      const r = pixel[0] / 255, g = pixel[1] / 255, b = pixel[2] / 255;
      const [h, s, v] = rgbToHsv(r, g, b);
      const nombre = hueToName(h, s, v);
      const freqMostrar = Math.round(200 + h * 800);
      colorLabel.textContent = `${nombre}  ·  ${freqMostrar} Hz`;
      dot.style.left = (x + offsetX) + 'px';
      dot.style.top = (y + offsetY) + 'px';
      dot.style.background = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
      dot.style.display = 'block';
      pendingTimeouts.push(setTimeout(() => { if (!destroyed) dot.style.display = 'none'; }, 1100));

      const relX = x / drawWidth, relY = y / drawHeight;
      const colPos = relX < 0.33 ? 'izquierda' : relX < 0.66 ? 'centro' : 'derecha';
      const rowPos = relY < 0.33 ? 'arriba' : relY < 0.66 ? 'centro' : 'abajo';
      const posicion = (rowPos === 'centro' && colPos === 'centro') ? 'centro' : rowPos === 'centro' ? colPos : colPos === 'centro' ? rowPos : `${rowPos} ${colPos}`;
      const panSide = relX < 0.40 ? 'a la izquierda' : relX > 0.60 ? 'a la derecha' : 'al centro';
      const panArrow = `el color se concentra ${panSide}`;

      playColorTone(h, s, v);
      pendingTimeouts.push(setTimeout(() => {
        if (destroyed) return;
        const objeto = findObjectAtPoint(px, py, touchCanvas.width, touchCanvas.height, Array.isArray(objectMap) ? objectMap : null);
        const texto = objeto ? `${posicion}, ${nombre}, ${freqMostrar} hercios, ${panArrow}, ${objeto}` : `${posicion}, ${nombre}, ${freqMostrar} hercios, ${panArrow}`;
        if (window.ArgiraSpeech) window.ArgiraSpeech.speak(texto, { rate: 0.92 });
      }, 500));
    }

    let isTouchDevice = false;
    let touchStartY = 0;

    function onClick(e) { if (!isTouchDevice) handleTouch(e); }
    function onTouchStart(e) { isTouchDevice = true; touchStartY = e.touches[0].clientY; window.ensureAudio?.(); }
    function onTouchEnd(e) {
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
      if (dy < 10) {
        const t = e.changedTouches[0];
        handleTouch({ touches: [{ clientX: t.clientX, clientY: t.clientY }], clientX: t.clientX, clientY: t.clientY });
      }
    }

    touchCanvas.addEventListener('click', onClick);
    touchCanvas.addEventListener('touchstart', onTouchStart, { passive: true });
    touchCanvas.addEventListener('touchend', onTouchEnd);

    return {
      destroy() {
        destroyed = true;
        pendingTimeouts.forEach(clearTimeout);
        pendingTimeouts = [];
        touchCanvas.removeEventListener('click', onClick);
        touchCanvas.removeEventListener('touchstart', onTouchStart);
        touchCanvas.removeEventListener('touchend', onTouchEnd);
        wrap.remove();
        hint.remove();
        colorLabel.remove();
      }
    };
  };

})();
