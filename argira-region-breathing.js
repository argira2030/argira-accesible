// ================================================================
//  ARGIRA · REGION BREATHING · Capa 4
//  Naturaleza: continuo autónomo — dinámica temporal de la región activa
//  ----------------------------------------------------------------
//  LFO de amplitud sobre portadora sub-perceptual.
//  Parámetros derivados de P4 (velocidad de respiración) y P6 (timbre).
//  Crossfade suave entre regiones al detectar argira:region-change.
//
//  Contrato:
//    MASTER_BUS: window.audioMasterGain — sin fallback a ctx.destination
//    GAIN_BASE = 0.16: subordinado a C1 — no compite en steady-state
//    C4 no toca C2 ni C3 — no hay estado compartido entre capas
//    Fuente única de cambio: argira:region-change emitido por C3
// ================================================================
(function () {
  'use strict';

  console.log('[ArgiraRegionBreathing] cargado — Capa 4');

  const FADE_IN_S  = 0.4;
  const FADE_OUT_S = 0.6;
  const GAIN_BASE  = 0.16;   // subordinado a C1 — no compite en loudness percibido
  const LFO_DEPTH  = 0.10;

  let _carrier   = null;
  let _lfo       = null;
  let _lfoGain   = null;
  let _gainNode  = null;
  let _active    = false;
  let _currentId = null;

  function _lfoParams(obra) {
    const P4_MIN = window.P4_MIN ?? 1.55;
    const P4_MAX = window.P4_MAX ?? 1.95;
    const nP4  = (obra.P4 - P4_MIN) / (P4_MAX - P4_MIN || 1);
    const lfoHz = 0.08 + nP4 * 0.27;   // [0.08, 0.35] Hz — respiración lenta ↔ rápida

    const nP6   = Math.max(0, Math.min(1, obra.P6 ?? 0.5));
    const cFreq = 55 + nP6 * 55;        // [55, 110] Hz — sub-bass

    return { lfoHz, cFreq };
  }

  function _getMaster() {
    if (!window.audioMasterGain) {
      console.error('[ArgiraRegionBreathing] audioMasterGain no existe — ¿bootstrap ejecutado?');
      window.__ARGIRA_AUDIO_READY__ = false;
      return null;
    }
    return window.audioMasterGain;
  }

  function _start(obra) {
    const ctx = window.audioCtx;
    if (!ctx || ctx.state !== 'running') return;
    const master = _getMaster();
    if (!master) return;

    const { lfoHz, cFreq } = _lfoParams(obra);
    const now = ctx.currentTime;

    _gainNode = ctx.createGain();
    _gainNode.gain.setValueAtTime(0, now);
    _gainNode.gain.linearRampToValueAtTime(GAIN_BASE, now + FADE_IN_S);
    _gainNode.connect(master);

    _lfoGain = ctx.createGain();
    _lfoGain.gain.setValueAtTime(LFO_DEPTH, now);

    _lfo = ctx.createOscillator();
    _lfo.type = 'sine';
    _lfo.frequency.setValueAtTime(lfoHz, now);

    _carrier = ctx.createOscillator();
    _carrier.type = 'sine';
    _carrier.frequency.setValueAtTime(cFreq, now);

    _carrier.connect(_gainNode);
    _lfo.connect(_lfoGain);
    _lfoGain.connect(_gainNode.gain);

    _carrier.start(now);
    _lfo.start(now);

    _active    = true;
    _currentId = obra.id;

    console.log('[ArgiraRegionBreathing] Capa 4 iniciada —',
      obra.id.slice(0, 20),
      `lfo=${lfoHz.toFixed(3)}Hz carrier=${cFreq.toFixed(1)}Hz`);
  }

  function _stop(onDone) {
    if (!_active) { onDone?.(); return; }
    const ctx = window.audioCtx;
    const now = ctx ? ctx.currentTime : 0;

    if (_gainNode && ctx) _gainNode.gain.setTargetAtTime(0, now, FADE_OUT_S / 3);

    const carrier = _carrier, lfo = _lfo;
    const lfoGain = _lfoGain, gainNode = _gainNode;
    _carrier = null; _lfo = null;
    _lfoGain = null; _gainNode = null;
    _active  = false; _currentId = null;

    const stopAt = ctx ? ctx.currentTime + FADE_OUT_S : 0;
    carrier?.stop(stopAt);
    lfo?.stop(stopAt);
    setTimeout(() => {
      try { gainNode?.disconnect(); } catch (_) {}
      try { lfoGain?.disconnect(); } catch (_) {}
      onDone?.();
    }, FADE_OUT_S * 1000 + 50);

    console.log('[ArgiraRegionBreathing] Capa 4 fadeout iniciado');
  }

  function _transition(to) {
    if (_currentId === to.id) return;
    _active ? _stop(() => _start(to)) : _start(to);
  }

  window.addEventListener('argira:region-change', (e) => {
    const { to } = e.detail ?? {};
    if (!to) return;
    _transition(to);
  });

  window.ArgiraRegionBreathing = { stop: _stop };
})();
