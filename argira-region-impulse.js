// ================================================================
//  ARGIRA · REGION IMPULSE · Capa 3 (audio)
//  Naturaleza: discreto — evento sonoro breve por cruce de frontera
//  ----------------------------------------------------------------
//  Escucha argira:region-change. Produce un ping perceptual modulado
//  por crossType y por P1 de la obra destino.
//
//  Contrato:
//    MASTER_BUS: window.audioMasterGain — sin fallback a ctx.destination
//    Si audioMasterGain no existe: error en consola, no dispara
//    No tiene estado persistente — cada cruce es evento discreto puro
//    GAIN_BASE no aplica aquí: el impulso es transitorio (no steady-state)
// ================================================================
(function () {
  'use strict';

  console.log('[ArgiraRegionImpulse] cargado — suscrito a argira:region-change');

  const IMPULSE_CONFIG = {
    proximal: { freq: 520,  gainPeak: 0.18, durationMs: 80,  oscType: 'sine'     },
    medial:   { freq: 380,  gainPeak: 0.22, durationMs: 120, oscType: 'triangle' },
    distal:   { freq: 260,  gainPeak: 0.28, durationMs: 180, oscType: 'triangle' },
  };

  function _getMaster() {
    if (!window.audioMasterGain) {
      console.error('[ArgiraRegionImpulse] audioMasterGain no existe — ¿bootstrap ejecutado?');
      window.__ARGIRA_AUDIO_READY__ = false;
      return null;
    }
    return window.audioMasterGain;
  }

  function _fireImpulse(crossType, to) {
    const ctx = window.audioCtx;
    if (!ctx || ctx.state !== 'running') return;
    const master = _getMaster();
    if (!master) return;

    const cfg  = IMPULSE_CONFIG[crossType] ?? IMPULSE_CONFIG.medial;
    const now  = ctx.currentTime;
    const dur  = cfg.durationMs / 1000;

    const P1_MIN = window.P1_MIN ?? 1.0;
    const P1_MAX = window.P1_MAX ?? 5.0;
    const nP1    = (to.P1 - P1_MIN) / (P1_MAX - P1_MIN || 1);
    const freq   = cfg.freq * (0.8 + nP1 * 0.4);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(cfg.gainPeak, now + dur * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    gain.connect(master);

    const osc = ctx.createOscillator();
    osc.type = cfg.oscType;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.85, now + dur);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + dur + 0.01);
    osc.onended = () => { try { gain.disconnect(); } catch (_) {} };

    console.log('[ArgiraRegionImpulse] Capa 3 —', crossType,
      `freq=${freq.toFixed(1)}Hz dur=${cfg.durationMs}ms`);
  }

  // FIX (bloque 1E-quater): C3 es evento discreto puro (sin estado
  // persistente), pero un ping de 80-180ms en mitad de la locución/
  // sonificación de "Escuchar" sigue siendo una interferencia perceptible.
  // Se suprime el disparo mientras se escucha, sin tocar su naturaleza
  // de "evento por cruce" — simplemente no dispara en esa ventana.
  let _isListeningNow = false;
  window.addEventListener('argira:listening-change', (e) => {
    _isListeningNow = !!e.detail?.listening;
  });

  window.addEventListener('argira:region-change', (e) => {
    if (_isListeningNow) return;
    const { crossType, to } = e.detail ?? {};
    if (!crossType || !to) return;
    _fireImpulse(crossType, to);
  });
})();
