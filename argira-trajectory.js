// ══════════════════════════════════════════════════════════════════════
//  ARGIRA · C_T — Trajectory Memory Layer
//  Prototipo v0.3 · 2026-06-12
//  Jose Ranero García · argira.eus · DOI: 10.5281/zenodo.20651233
//
//  C_T describe cómo llegaste — no dónde estás.
//  Tres variables extraídas de T₅ₛ (últimos 5 segundos):
//    v  — velocidad media     → densidad de clicks
//    θ  — dirección dominante → panorama estéreo + pitch
//    b  — fronteras cruzadas  → impulso breve por cruce
//
//  OVERLAY VISUAL (v0.3)
//  ──────────────────────
//  Muestra v · θ · b en pantalla, estilo coords P1/P4.
//  Solo visible en modo 'extended'. Útil para tests A/B/C en móvil.
//
//  INVARIANTES
//  ────────────
//  CT1. No lee hoverState, anchorState ni anchorHistory.
//  CT2. No emite region-change. Solo escucha.
//  CT3. Gain por evento ≤ 0.05.
//  CT4. Silencio total en modo 'classic'.
//  CT5. pointerleave → purgar trail + silencio.
// ══════════════════════════════════════════════════════════════════════

(function ArgiraTrajectory() {

  // ── Configuración ────────────────────────────────────────────────────
  const T_WINDOW      = 5000;
  const CLICK_MIN_MS  = 120;
  const CLICK_MAX_MS  = 1800;
  const CLICK_GAIN    = 0.045;
  const BOUNDARY_GAIN = 0.038;

  // ── Estado ───────────────────────────────────────────────────────────
  let trail        = [];
  let _active      = false;
  let _mode        = 'classic';
  let _clickTimer  = null;
  let _pan         = 0;
  let _pitch       = 380;
  let _boundaryCount = 0;   // contador de fronteras en sesión

  // ── Overlay DOM ──────────────────────────────────────────────────────
  let _overlay = null;

  function _createOverlay() {
    if (_overlay) return;
    const el = document.createElement('div');
    el.id = 'ct-overlay';
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = [
      'position:absolute',
      'bottom:32px',          // justo encima del footer
      'left:12px',
      'font-size:9px',
      'font-family:var(--mono,"IBM Plex Mono",monospace)',
      'color:var(--muted,#767680)',
      'text-align:left',
      'pointer-events:none',
      'line-height:1.8',
      'display:none',
      'z-index:10',
    ].join(';');
    el.innerHTML =
      'C_T <span id="ct-status" style="color:var(--text,#c8c8d0)">—</span><br>' +
      'v &nbsp;<span id="ct-v"   style="color:var(--text,#c8c8d0)">—</span><br>' +
      '\u03b8 &nbsp;<span id="ct-theta" style="color:var(--text,#c8c8d0)">—</span><br>' +
      'b &nbsp;<span id="ct-b"   style="color:var(--text,#c8c8d0)">—</span>';

    // Insertar dentro de #mapWrap (mismo contenedor que #coords)
    const wrap = document.getElementById('mapWrap');
    if (wrap) wrap.appendChild(el);
    _overlay = el;
  }

  function _updateOverlay(v, theta, valid) {
    if (!_overlay) return;

    if (_mode !== 'extended') {
      _overlay.style.display = 'none';
      return;
    }

    _overlay.style.display = 'block';

    const elStatus = document.getElementById('ct-status');
    const elV      = document.getElementById('ct-v');
    const elTheta  = document.getElementById('ct-theta');
    const elB      = document.getElementById('ct-b');

    if (!valid || v < 0.01) {
      if (elStatus) elStatus.textContent = 'idle';
      if (elV)      elV.textContent      = '0.00';
      if (elTheta)  elTheta.textContent  = '—';
      if (elB)      elB.textContent      = String(_boundaryCount);
      return;
    }

    // Dirección en texto cardinal (8 direcciones)
    const deg  = (theta * 180 / Math.PI + 360) % 360;
    const dirs = ['E','NE','N','NW','W','SW','S','SE'];
    const dir  = dirs[Math.round(deg / 45) % 8];

    if (elStatus) elStatus.textContent = 'active';
    if (elV)      elV.textContent      = v.toFixed(2) + ' u/s';
    if (elTheta)  elTheta.textContent  = dir + ' ' + Math.round(deg) + '\u00b0';
    if (elB)      elB.textContent      = String(_boundaryCount);
  }

  // ── Análisis ─────────────────────────────────────────────────────────
  function _analyze() {
    const now = performance.now();
    trail = trail.filter(p => now - p.t <= T_WINDOW);
    if (trail.length < 2) return { v: 0, theta: 0, pan: 0, pitch: 380, valid: false };

    let dist = 0, dx = 0, dy = 0;
    for (let i = 1; i < trail.length; i++) {
      const ddx = trail[i].nx - trail[i-1].nx;
      const ddy = trail[i].ny - trail[i-1].ny;
      dist += Math.sqrt(ddx*ddx + ddy*ddy);
      dx += ddx; dy += ddy;
    }
    const elapsed = Math.max(0.01, (trail[trail.length-1].t - trail[0].t) / 1000);
    const v     = dist / elapsed;
    const theta = Math.atan2(dy, dx);
    const pan   = Math.max(-0.75, Math.min(0.75, dx / (dist + 0.001)));
    const pitch = 300 + (-dy / (dist + 0.001)) * 180;

    return { v, theta, pan, pitch, valid: true };
  }

  // ── Click de velocidad ────────────────────────────────────────────────
  function _emitClick() {
    const ac = window.audioCtx;
    if (!ac || ac.state !== 'running' || !window.audioMasterGain) return;
    try {
      const t   = ac.currentTime;
      const osc = ac.createOscillator();
      const env = ac.createGain();
      osc.type = 'sine';
      osc.frequency.value = _pitch;
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(CLICK_GAIN, t + 0.008);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 0.022);
      if (ac.createStereoPanner) {
        const pan = ac.createStereoPanner();
        pan.pan.value = _pan;
        osc.connect(env); env.connect(pan); pan.connect(window.audioMasterGain);
      } else {
        osc.connect(env); env.connect(window.audioMasterGain);
      }
      osc.start(t); osc.stop(t + 0.025);
    } catch(e) {}
  }

  // ── Loop de clicks ────────────────────────────────────────────────────
  function _scheduleClick() {
    if (!_active || _mode !== 'extended') return;
    const { v, pan, pitch, theta, valid } = _analyze();
    _pan   = pan;
    _pitch = Math.max(120, Math.min(480, pitch));

    _updateOverlay(v, theta, valid);

    if (valid && v > 0.02) _emitClick();

    const vNorm    = Math.min(v / 1.0, 1.0);
    const interval = CLICK_MAX_MS - vNorm * (CLICK_MAX_MS - CLICK_MIN_MS);
    _clickTimer = setTimeout(_scheduleClick, interval);
  }

  // ── Impulso de frontera ───────────────────────────────────────────────
  function _boundaryImpulse() {
    // ── Conteo: independiente del estado de audio (CT2/CT3) ──────────────
    _boundaryCount++;
    // Actualizar overlay inmediatamente
    const elB = document.getElementById('ct-b');
    if (elB) elB.textContent = String(_boundaryCount);

    // ── Audio: efecto secundario, condicionado a audioCtx disponible ─────
    const ac = window.audioCtx;
    if (!ac || ac.state !== 'running' || !window.audioMasterGain) return;
    if (_mode !== 'extended') return;
    try {
      const t   = ac.currentTime;
      const osc = ac.createOscillator();
      const env = ac.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 210;
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(BOUNDARY_GAIN, t + 0.012);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.connect(env); env.connect(window.audioMasterGain);
      osc.start(t); osc.stop(t + 0.20);
    } catch(e) {}
  }

  // ── Control ───────────────────────────────────────────────────────────
  function _start() {
    if (_active) return;
    _active = true;
    _createOverlay();
    if (_overlay) _overlay.style.display = 'block';
    _scheduleClick();
    console.log('[C_T] start');
  }

  function _stop() {
    if (!_active) return;
    _active = false;
    if (_clickTimer) { clearTimeout(_clickTimer); _clickTimer = null; }
    if (_overlay) _overlay.style.display = 'none';
    console.log('[C_T] stop');
  }

  // ── Eventos ───────────────────────────────────────────────────────────
  window.addEventListener('argira:cursor-move', function(e) {
    const { nx, ny, t } = e.detail;
    trail.push({ nx, ny, t: t || performance.now() });
    if (trail.length > 400) trail.shift();
  });

  window.addEventListener('argira:cursor-leave', function() {
    trail = [];
    if (_overlay) _overlay.style.display = 'none';
  });

  window.addEventListener('argira:region-change', function() {
    if (_active && _mode === 'extended') _boundaryImpulse();
  });

  window.addEventListener('argira-mode-change', function(e) {
    _mode = e.detail.mode;
    if (_mode === 'extended') {
      _boundaryCount = 0; // reset contador al entrar en extended
      _start();
    } else {
      _stop();
    }
  });

  setInterval(function() {
    const ac = window.audioCtx;
    if (!ac) return;
    if (ac.state !== 'running' && _active)                        _stop();
    if (ac.state === 'running' && !_active && _mode === 'extended') _start();
  }, 600);

  // ── API pública ───────────────────────────────────────────────────────
  window.ArgiraTrajectory = {
    start:        _start,
    stop:         _stop,
    analyze:      _analyze,
    testBoundary: _boundaryImpulse,
    testClick:    _emitClick,
    resetCount:   function() { _boundaryCount = 0; },
    status: function() {
      return { active: _active, mode: _mode, points: trail.length,
               boundaries: _boundaryCount, ..._analyze() };
    }
  };

  console.log('[C_T] ArgiraTrajectory v0.3 cargado');

})();
