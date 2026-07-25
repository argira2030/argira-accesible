// ================================================================
//  ARGIRA · HARMONIC BLEND FIELD · Capa 2
//  Naturaleza: continuo derivado
//  ----------------------------------------------------------------
//  Mezcla gaussiana ponderada de propiedades armónicas del catálogo
//  en el punto cursor. No representa frontera — representa el
//  "color espectral del entorno" en cada posición del P-space.
//
//  Contrato con otras capas:
//    C1 (playAnchor)     → continuo perceptual directo — jerarquía superior
//    C2 (este módulo)    → continuo derivado — subordinado a C1
//    C3 (RegionDetector) → único mecanismo discreto — no compite con C2
//    C4 (Breathing)      → continuo autónomo — no compite con C2
//
//  GAIN_BASE = 0.15: C2 subordinada a C1 en prioridad atencional
//  MASTER_BUS: window.audioMasterGain — grafo explícito, sin fallback
//
//  API: window.ArgiraHarmonicBlend
// ================================================================
(function () {
  'use strict';

  console.log('[ArgiraHarmonicBlend] cargado — Capa 2 (WHB field)');

  // ── Parámetros ───────────────────────────────────────────────
  const SIGMA      = 0.18;   // radio de influencia gaussiana (espacio normalizado)
  const GAIN_BASE  = 0.15;   // subordinado a C1 — no compite en loudness percibido
  const FREQ_RATIO = 1.5;    // quinta armónica sobre freq del entorno
  const FADE_IN_S  = 0.12;
  const FADE_OUT_S = 0.20;

  // ── Estado ───────────────────────────────────────────────────
  let _osc    = null;
  let _gain   = null;
  let _active = false;

  // ── WHB field: mezcla gaussiana de propiedades armónicas ─────
  // Calcula el centroide armónico ponderado por distancia gaussiana.
  // No es Voronoi: no hay región discreta, solo densidad espectral.
  function _sampleHarmonicField(nx, ny) {
    const cat = window.CATALOGUE;
    if (!cat || !cat.length) return null;

    const P1_MIN = window.P1_MIN ?? 1.0;
    const P1_MAX = window.P1_MAX ?? 5.0;
    const P4_MIN = window.P4_MIN ?? 1.55;
    const P4_MAX = window.P4_MAX ?? 1.95;
    const p1r = P1_MAX - P1_MIN || 1;
    const p4r = P4_MAX - P4_MIN || 1;

    let totalW = 0, wFreq = 0, wTempo = 0;

    for (const obra of cat) {
      const ox = (obra.P1 - P1_MIN) / p1r;
      const oy = (obra.P4 - P4_MIN) / p4r;
      const dx = nx - ox, dy = ny - oy;
      const w  = Math.exp(-(dx * dx + dy * dy) / (2 * SIGMA * SIGMA));
      totalW += w;
      wFreq  += w * (obra.freq  ?? 220);
      wTempo += w * (obra.tempo ?? 1.0);
    }

    if (totalW < 1e-10) return null;
    return { freq: wFreq / totalW, tempo: wTempo / totalW };
  }

  // ── Verificar MASTER_BUS ─────────────────────────────────────
  function _getMaster() {
    if (!window.audioMasterGain) {
      console.error('[ArgiraHarmonicBlend] audioMasterGain no existe — ¿bootstrap ejecutado?');
      window.__ARGIRA_AUDIO_READY__ = false;
      return null;
    }
    return window.audioMasterGain;
  }

  // ── onTick ───────────────────────────────────────────────────
  function onTick(nx, ny) {
    const ctx = window.audioCtx;
    if (!ctx || ctx.state !== 'running') { if (_active) _stop(); return; }

    const field = _sampleHarmonicField(nx, ny);
    if (!field) return;

    const targetFreq = field.freq * FREQ_RATIO;

    if (!_active) {
      _start(ctx, targetFreq);
    } else {
      _osc.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.05);
    }
  }

  function _start(ctx, freq) {
    if (_active) return;
    const master = _getMaster();
    if (!master) return;

    _gain = ctx.createGain();
    _gain.gain.setValueAtTime(0, ctx.currentTime);
    _gain.gain.linearRampToValueAtTime(GAIN_BASE, ctx.currentTime + FADE_IN_S);
    _gain.connect(master);

    _osc = ctx.createOscillator();
    _osc.type = 'sine';
    _osc.frequency.setValueAtTime(freq, ctx.currentTime);
    _osc.connect(_gain);
    _osc.start();

    _active = true;
    console.log('[ArgiraHarmonicBlend] Capa 2 activa — freq entorno:', freq.toFixed(2), 'Hz');
  }

  function _stop() {
    if (!_active) return;
    const ctx = window.audioCtx;
    const now = ctx ? ctx.currentTime : 0;

    if (_gain && ctx) _gain.gain.setTargetAtTime(0, now, FADE_OUT_S / 3);

    const osc = _osc, gain = _gain;
    _osc = null; _gain = null; _active = false;

    if (ctx) {
      osc?.stop(now + FADE_OUT_S);
      setTimeout(() => { try { gain?.disconnect(); } catch (_) {} }, FADE_OUT_S * 1000 + 50);
    }
    console.log('[ArgiraHarmonicBlend] Capa 2 detenida');
  }

  window.ArgiraHarmonicBlend = { onTick, stop: _stop };
})();
