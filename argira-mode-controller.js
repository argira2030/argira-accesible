// ================================================================
//  ARGIRA · MODE CONTROLLER
//  Fuente de verdad del modo activo ('scalar' | 'vector').
//  Dispatcher único de onTick → C2 (HarmonicBlend) + C3 (RegionDetector).
//
//  Contrato:
//    - Una sola llamada desde rafLoop: ArgiraModeController.onTick(nx, ny)
//    - No duplica lógica de ninguna capa
//    - No toca audioMasterGain — eso es responsabilidad del bootstrap
//
//  API: window.ArgiraModeController
// ================================================================
(function () {
  'use strict';

  console.log('[ArgiraModeController] cargado');

  let _mode = 'scalar';   // Por defecto: solo C1 activa

  function onTick(nx, ny) {
    // C2: activa solo en modo vector. stop() se llama en setMode(), no aquí.
    // onTick en modo scalar no toca C2 — evita llamar stop() en cada frame.
    if (_mode === 'vector') {
      window.ArgiraHarmonicBlend?.onTick(nx, ny);
    }

    // C3: siempre activo — frontera perceptual independiente del modo.
    // "Siempre activo" es diseño explícito, no omisión de guard.
    // Resolución temporal acoplada al RAF por elección: la frontera
    // se muestrea al ritmo del cursor, no de un timer independiente.
    window.ArgiraRegionDetector?.onTick(nx, ny);
  }

  function setMode(mode) {
    if (mode !== 'scalar' && mode !== 'vector') {
      console.warn('[ArgiraModeController] modo inválido:', mode);
      return;
    }
    if (_mode === mode) return;
    const prev = _mode;
    _mode = mode;
    console.log('[ArgiraModeController] modo →', prev, '→', _mode);
    // stop() de C2 solo en la transición vector→scalar, nunca en onTick.
    // El oscilador se destruye exactamente una vez por transición.
    if (_mode === 'scalar') window.ArgiraHarmonicBlend?.stop();
    window.dispatchEvent(new CustomEvent('argira:mode-change', { detail: { mode: _mode } }));
  }

  function getMode() { return _mode; }

  window.ArgiraModeController = { onTick, setMode, getMode };
})();
