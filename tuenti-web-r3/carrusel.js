/* Carrusel de categorías (celular): se desliza solo, despacio, de derecha a izquierda, en bucle.
   - Si se toca o se arrastra, se detiene; retoma a los REANUDAR_MS sin tocar.
   - prefers-reduced-motion: no se mueve solo (la fila se sigue pudiendo deslizar con el dedo).
   - Bucle sin salto: se duplica el juego de tarjetas (copias aria-hidden, sin foco) y al pasar el largo de un juego se resta. */
(function () {
  'use strict';
  var VELOCIDAD = 28;      // px por segundo (≈ una tarjeta cada 5,6 s)
  var REANUDAR_MS = 4000;  // ms sin tocar antes de retomar solo
  var ESPERA_INICIAL = 1500; // ms quieto al cargar: la primera impresión es la fila alineada, sin moverse
  var cont = document.getElementById('cats');
  if (!cont) return;
  var mqCel = window.matchMedia('(max-width:720px)');
  var mqRed = window.matchMedia('(prefers-reduced-motion: reduce)');
  var clones = [], raf = 0, ultimo = 0, pos = 0, ultimaAccion = 0, tocando = false, visible = true;
  var largoJuego = 0, escribio = -1;

  function limpiar() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    clones.forEach(function (c) { c.remove(); });
    clones = [];
    cont.classList.remove('cats--auto');
  }
  function activo() {
    return mqCel.matches && !mqRed.matches && visible && !document.hidden && !tocando &&
      (performance.now() - ultimaAccion) > REANUDAR_MS;
  }
  function envolver() {
    if (!largoJuego) return;
    if (cont.scrollLeft >= largoJuego) { cont.scrollLeft -= largoJuego; pos = cont.scrollLeft; }
    else if (cont.scrollLeft <= 0 && clones.length) { cont.scrollLeft += largoJuego; pos = cont.scrollLeft; }
  }
  function paso(t) {
    raf = requestAnimationFrame(paso);
    var dt = Math.min(64, t - (ultimo || t)); ultimo = t;
    if (!activo()) { pos = cont.scrollLeft; return; }
    pos += VELOCIDAD * dt / 1000;
    if (pos >= largoJuego) pos -= largoJuego;
    escribio = pos; cont.scrollLeft = pos;
  }
  function accion() { ultimaAccion = performance.now(); pos = cont.scrollLeft; }

  function armar() {
    limpiar();
    var orig = [].slice.call(cont.querySelectorAll('.cat'));
    if (!mqCel.matches || orig.length < 2) return;
    cont.classList.add('cats--auto');
    if (!mqRed.matches) {
      orig.forEach(function (c) {
        var k = c.cloneNode(true);
        k.setAttribute('aria-hidden', 'true'); k.setAttribute('tabindex', '-1'); k.classList.add('cat--clon');
        cont.appendChild(k); clones.push(k);
      });
      largoJuego = clones[0].offsetLeft - orig[0].offsetLeft;
    }
    cont.scrollLeft = 0; pos = 0; ultimaAccion = performance.now() - REANUDAR_MS + ESPERA_INICIAL;
    if (!mqRed.matches) { ultimo = 0; raf = requestAnimationFrame(paso); }
  }

  ['touchstart', 'pointerdown', 'mousedown'].forEach(function (e) {
    cont.addEventListener(e, function () { tocando = true; accion(); envolver(); }, { passive: true });
  });
  ['touchend', 'touchcancel', 'pointerup', 'pointercancel', 'mouseup'].forEach(function (e) {
    window.addEventListener(e, function () { if (tocando) { tocando = false; accion(); } }, { passive: true });
  });
  cont.addEventListener('wheel', accion, { passive: true });
  cont.addEventListener('focusin', accion);
  cont.addEventListener('scroll', function () {
    if (escribio >= 0 && Math.abs(cont.scrollLeft - escribio) <= 1.5) return; // lo movió el propio carrusel
    accion(); envolver();                                                       // lo movió Jose (dedo o inercia)
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.1 }).observe(cont);
  }
  var rearmar = function () { armar(); };
  if (mqCel.addEventListener) { mqCel.addEventListener('change', rearmar); mqRed.addEventListener('change', rearmar); }
  window.addEventListener('resize', function () {
    if (clones.length) { var o = cont.querySelector('.cat'); largoJuego = clones[0].offsetLeft - o.offsetLeft; }
  });

  // las tarjetas las pinta app.js después de leer marca.json: se arma cuando aparecen
  function esperar() {
    if (cont.querySelector('.cat') && !cont.querySelector('.cat--clon') && !cont.classList.contains('cats--auto')) { armar(); }
  }
  new MutationObserver(function () {
    if (!cont.classList.contains('cats--auto') && cont.querySelector('.cat')) armar();
  }).observe(cont, { childList: true });
  esperar();
})();
