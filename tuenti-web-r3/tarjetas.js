/* Entrada de las tarjetas de categoría (inicio): una sola vez, cuando la sección entra en pantalla.
   Las copias del carrusel (cat--clon) no se animan: así nada se mueve ni parpadea al deslizar. */
(function () {
  'use strict';
  // iOS Safari solo activa :active (reacción al tocar) si la página tiene algún oyente táctil
  document.addEventListener('touchstart', function () {}, { passive: true });
  var cont = document.getElementById('cats');
  if (!cont) return;
  var red = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function listo() {
    [].forEach.call(cont.querySelectorAll('.cat:not(.cat--clon)'), function (c, i) { c.style.setProperty('--i', i); });
    cont.classList.add('en');
  }
  function preparar() {
    if (cont.classList.contains('tj-lista') || !cont.querySelector('.cat')) return;
    cont.classList.add('tj-lista');
    if (red || !('IntersectionObserver' in window)) { listo(); return; }
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { io.disconnect(); listo(); }
    }, { threshold: 0.2 });
    io.observe(cont);
    setTimeout(function () { if (!cont.classList.contains('en')) { io.disconnect(); listo(); } }, 6000); // seguro: nunca quedan ocultas
  }
  new MutationObserver(preparar).observe(cont, { childList: true });
  preparar();
})();
