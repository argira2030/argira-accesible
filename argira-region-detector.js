// ================================================================
//  ARGIRA · REGION DETECTOR · Capa 3 (parte discreta)
//  Naturaleza: discreto — único mecanismo de frontera del sistema
//  ----------------------------------------------------------------
//  Detecta cruces de célula Voronoi (1-NN en P-space normalizado).
//  Emite argira:region-change con { from, to, crossType, t }.
//
//  Contrato con otras capas:
//    No usa audioMasterGain — no produce audio directamente
//    C3 es el único lugar donde "región" tiene identidad discreta
//    C2 (HarmonicBlend) no afecta ni comparte estado con C3
//
//  Parámetros:
//    MIN_INTERVAL = 400ms — throttle de emisión
//    DEBOUNCE_MS  = 60ms  — estabilidad en fronteras ruidosas
//
//  API: window.ArgiraRegionDetector
// ================================================================
(function () {
  'use strict';

  console.log('[ArgiraRegionDetector] cargado — Capa 3 discreta');

  const MIN_INTERVAL = 400;
  const DEBOUNCE_MS  = 60;

  let _lastObra    = null;
  let _lastEmit    = 0;
  let _pendingObra = null;
  let _debounceId  = null;

  function _nearest(nx, ny) {
    const cat = window.CATALOGUE;
    if (!cat || !cat.length) return null;

    const P1_MIN = window.P1_MIN ?? 1.0;
    const P1_MAX = window.P1_MAX ?? 5.0;
    const P4_MIN = window.P4_MIN ?? 1.55;
    const P4_MAX = window.P4_MAX ?? 1.95;
    const p1r = P1_MAX - P1_MIN || 1;
    const p4r = P4_MAX - P4_MIN || 1;

    let bestD2 = Infinity, best = null;
    for (const obra of cat) {
      const dx = nx - (obra.P1 - P1_MIN) / p1r;
      const dy = ny - (obra.P4 - P4_MIN) / p4r;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestD2) { bestD2 = d2; best = obra; }
    }
    return best;
  }

  function _crossType(from, to) {
    const P1_MIN = window.P1_MIN ?? 1.0;
    const P1_MAX = window.P1_MAX ?? 5.0;
    const P4_MIN = window.P4_MIN ?? 1.55;
    const P4_MAX = window.P4_MAX ?? 1.95;
    const p1r = P1_MAX - P1_MIN || 1;
    const p4r = P4_MAX - P4_MIN || 1;
    const dx = (to.P1 - from.P1) / p1r;
    const dy = (to.P4 - from.P4) / p4r;
    const d  = Math.sqrt(dx * dx + dy * dy);
    if (d < 0.15) return 'proximal';
    if (d < 0.40) return 'medial';
    return 'distal';
  }

  function _emitCross(from, to) {
    const now = performance.now();
    if (now - _lastEmit < MIN_INTERVAL) return;
    _lastEmit = now;
    const detail = { from, to, crossType: _crossType(from, to), t: now };
    console.log('[ArgiraRegionDetector] cruce →', detail.crossType,
      from.id.slice(0, 18), '→', to.id.slice(0, 18));
    window.dispatchEvent(new CustomEvent('argira:region-change', { detail }));
  }

  function onTick(nx, ny) {
    const obra = _nearest(nx, ny);
    if (!obra) return;
    if (!_lastObra) { _lastObra = obra; return; }
    if (obra.id === _lastObra.id) {
      if (_pendingObra && _pendingObra.id !== obra.id) {
        clearTimeout(_debounceId);
        _pendingObra = null; _debounceId = null;
      }
      return;
    }
    if (_pendingObra && _pendingObra.id === obra.id) return;
    clearTimeout(_debounceId);
    _pendingObra = obra;
    _debounceId  = setTimeout(() => {
      if (!_pendingObra) return;
      const from = _lastObra, to = _pendingObra;
      _lastObra = to; _pendingObra = null; _debounceId = null;
      _emitCross(from, to);
    }, DEBOUNCE_MS);
  }

  function reset() {
    clearTimeout(_debounceId);
    _lastObra = null; _lastEmit = 0;
    _pendingObra = null; _debounceId = null;
  }

  window.ArgiraRegionDetector = { onTick, reset };
})();
