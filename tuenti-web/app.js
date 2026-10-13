/* ================================================================
   TUENTI · app.js
   Carga marca.json y renderiza. Sirve tres páginas, detectadas por
   los contenedores presentes en el DOM:
     · index.html     → portada
     · catalogo.html  → grilla completa con filtro por categoría
     · producto.html  → ficha, con selector de color por hex

   Reglas duras:
   · Campo faltante o vacío → [[campo]] visible (.ds-missing).
   · Filtro de publicables  → fuera licenciado=true o publicable_web=false,
     PERO hoy desactivado: MODO_MAQUETA=true muestra los 131 (ver más abajo).
   · Fotos de producto a full: nada se superpone a la prenda.
   ================================================================ */
(function () {
  'use strict';

  /* ---------- utilidades ---------- */
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const falta = campo => '<span class="ds-missing">[[' + esc(campo) + ']]</span>';
  const vacio = v => v == null || (typeof v === 'string' && !v.trim()) ||
    (Array.isArray(v) && !v.length);

  function txt(el, valor, campo) {
    if (!el) return;
    if (vacio(valor)) el.innerHTML = falta(campo);
    else el.textContent = valor;
  }

  /* Formato de precio: "$ 45.000" — signo, espacio y punto de miles, sin
     decimales y sin mención de IVA en ninguna parte. El espacio es duro
     ( ) para que el signo nunca se separe de la cifra al saltar de línea. */
  const money = n => '$ ' + Number(n).toLocaleString('es-CO', { maximumFractionDigits: 0 });
  const waLink = (num, msg) => 'https://wa.me/' + String(num).replace(/[^0-9]/g, '') +
    (msg ? '?text=' + encodeURIComponent(msg) : '');
  const slug = s => String(s).toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const pagina = () => $('legal-docs') ? 'legal'
    : ($('catalogo-lista') ? 'catalogo' : ($('pdp') ? 'producto' : 'index'));

  /* En catálogo y ficha los anclas de la portada vuelven a index.html */
  function href(h) {
    if (!h) return '#';
    if (pagina() !== 'index' && h.charAt(0) === '#' && h !== '#top') return 'index.html' + h;
    return h;
  }

  const tocable = () => window.matchMedia &&
    matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------- pantalla de error ---------- */
  function mostrarError(archivo, err) {
    const detalle = err && err.message ? err.message : String(err);
    const box = document.createElement('div');
    box.setAttribute('role', 'alert');
    box.style.cssText = 'position:fixed;inset:0;z-index:999;display:grid;place-items:center;' +
      'padding:2rem;background:var(--c-bg)';
    box.innerHTML =
      '<div style="max-width:48ch;text-align:center;border:1px solid var(--c-alert);' +
      'padding:2rem 1.8rem;background:var(--c-surface)">' +
      '<p style="font-size:var(--fs-eyebrow);text-transform:uppercase;letter-spacing:var(--tr-eyebrow);' +
      'color:var(--c-alert);margin-bottom:1rem">Error de datos</p>' +
      '<h2 style="font-family:var(--font-display);font-weight:var(--w-bold);font-size:1.6rem;' +
      'line-height:var(--lh-tight);margin-bottom:.8rem">No se pudo cargar ' + esc(archivo) + '</h2>' +
      '<p style="font-size:.9rem;color:var(--c-muted)">Revisa que <b>' + esc(archivo) +
      '</b> exista junto a la página y que se abra desde un servidor (http://), no con doble clic.</p>' +
      '<p style="font-family:var(--font-mono);font-size:.72rem;color:var(--c-faint);' +
      'margin-top:1rem;word-break:break-word">Detalle: ' + esc(detalle) + '</p></div>';
    document.body.appendChild(box);
  }

  /* ---------- tokens de marca ---------- */
  function aplicarTokens(tokens) {
    if (!tokens) return;
    const r = document.documentElement;
    Object.keys(tokens).forEach(k => {
      if (k.indexOf('--') === 0 && tokens[k]) r.style.setProperty(k, tokens[k]);
    });
  }

  /* ---------- modo maqueta ----------
     El sitio es hoy una MAQUETA COMPLETA para revisión y aprobación: se
     muestran los 131 diseños, licenciados incluidos. Qué se publica se decide
     después, sobre la maqueta terminada.

     El campo `licenciado` de marca.json SÍ lleva ya la clasificación
     (true = licenciado · false = sin marca · null = dudoso, pendiente de ver
     la prenda). Está como DATO, no como filtro: sirve para el día que se
     decida. Poner MODO_MAQUETA en false reactiva el filtro real de una vez.

     ⚠ Mientras esto sea true, el sitio NO debe indexarse. Las tres páginas
     llevan <meta name="robots" content="noindex, nofollow">. */
  const MODO_MAQUETA = true;

  /* ---------- filtro de publicables (por código, no manual) ---------- */
  const filtroReal = p => p.licenciado !== true && p.publicable_web !== false;
  const publicables = ps => MODO_MAQUETA ? (ps || []).slice() : (ps || []).filter(filtroReal);

  /* Cuántos se ocultarían el día que se apague el modo maqueta. */
  const ocultablesCount = ps => (ps || []).length - (ps || []).filter(filtroReal).length;

  const variantesConFoto = p => (p.variantes || []).filter(v => (v.fotos || [])[0]);

  /* ---------- wordmark: TU + ENTI ----------
     La identidad juega con TU-EN-TI: «EN TI» va en el verde de acento y el
     resto en blanco. Es el uso principal del acento en toda la página.
     Se parte por posición, no por texto fijo: si marca.nombre cambia y deja
     de encajar, se pinta entero en blanco en vez de inventar un corte. */
  function wordmark(el, nombre) {
    if (!el) return;
    if (vacio(nombre)) { el.innerHTML = falta('marca.nombre'); return; }
    const n = String(nombre);
    /* El logo oficial (brief p.1) pinta de verde SOLO las dos letras «EN»:
       TU | EN | TI. Antes se pintaban cuatro («ENTI»), que es el doble. */
    const i = n.toUpperCase().indexOf('EN', 1);
    if (i < 1) { el.textContent = n; return; }
    el.innerHTML = esc(n.slice(0, i)) +
      '<span class="wm-acento">' + esc(n.slice(i, i + 2)) + '</span>' +
      esc(n.slice(i + 2));
  }

  /* ================================================================
     CARRITO Y PEDIDO

     Carrito propio, escrito aquí. NO se usa el del módulo `tienda.js`:
     ese guarda solo {nombre, precio, foto, qty} — descarta la talla y la
     referencia—, agrupa por el nombre visible, no tiene «vaciar» ni campo
     de cantidad ni subtotal por línea, y sus funciones internas (chQty,
     quitar) no están expuestas. Además su pie empuja a un checkout con
     formulario de envío, que es F4 y no va en esta fase.
     `tienda.js` queda intacto en disco y ya no se carga.

     ── ALCANCE ──────────────────────────────────────────────────────
     Envío y pasarela de pago son **F4**, no esta fase. El carrito cierra
     por WhatsApp. La costura para meter la pasarela después es
     `cerrarPedido()`: hoy abre WhatsApp; mañana decide entre eso y una
     pasarela sin que haya que rehacer el carrito ni las líneas.

     ── LO QUE EVITA EL FALLO DEL COLOR ──────────────────────────────
     Nada se congela en el marcado. Los botones no llevan data-nombre ni
     data-foto escritos en el render: reciben `activa()` y la llaman EN EL
     CLIC, así que leen la variante seleccionada en ese instante.
     ================================================================ */
  let DATOS = null;

  const ICONO_WA = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3C9 3 3.5 8.5 3.5 15.5c0 2.4.7 4.7 1.9 6.7L3 29l7-1.8c1.9 1 4 1.6 6 1.6 7 0 12.5-5.5 12.5-12.5S23 3 16 3zm0 22c-1.8 0-3.6-.5-5.1-1.4l-.4-.2-4.2 1.1 1.1-4.1-.2-.4C6.4 18.9 6 17.2 6 15.5 6 9.7 10.7 5 16 5s10 4.7 10 10.5S21.3 25 16 25z"/></svg>';

  /* ---------------- almacén ----------------
     Una línea = referencia + color + talla. Esa es la clave: agregar dos
     veces lo mismo suma cantidad; el mismo diseño en otro color o en otra
     talla es otra línea. Se guarda el id, no el nombre visible, para que
     dos diseños homónimos de categorías distintas no se confundan
     («Nirvana in utero» existe en cuatro categorías, con precios distintos). */
  const CAR_KEY = 'tuenti_carrito_v1';
  const claveLinea = it => [it.id, it.color || '', it.talla || ''].join('|');

  function carLeer() {
    try {
      const a = JSON.parse(localStorage.getItem(CAR_KEY) || '[]');
      return Array.isArray(a) ? a.filter(x => x && x.id) : [];
    } catch (e) { return []; }
  }
  function carGuardar(items) {
    try { localStorage.setItem(CAR_KEY, JSON.stringify(items)); } catch (e) { }
    carPintar();
  }
  const carTotal = () => carLeer().reduce((a, x) => a + (+x.precio || 0) * (+x.qty || 0), 0);
  const carUnidades = () => carLeer().reduce((a, x) => a + (+x.qty || 0), 0);

  function carAgregar(p, v, talla) {
    if (!p || !v) return;
    const it = {
      id: p.id, diseno: p.diseno, categoria: p.categoria,
      color: v.color || '', talla: talla || '',
      precio: +p.precio_unidad || 0, foto: 'img/' + v.fotos[0], qty: 1
    };
    const c = carLeer();
    const i = c.findIndex(x => claveLinea(x) === claveLinea(it));
    if (i >= 0) c[i].qty = (+c[i].qty || 0) + 1; else c.push(it);
    carGuardar(c);
    avisar(((DATOS.carrito || {}).aviso_agregado || 'Agregado al carrito') + ': ' +
      p.diseno + (v.color ? ' · ' + v.color : ''));
  }
  function carFijarQty(clave, n) {
    const c = carLeer();
    const i = c.findIndex(x => claveLinea(x) === clave);
    if (i < 0) return;
    const q = Math.max(0, Math.floor(Number(n) || 0));
    if (q === 0) c.splice(i, 1); else c[i].qty = q;
    carGuardar(c);
  }
  const carQuitar = clave => carGuardar(carLeer().filter(x => claveLinea(x) !== clave));
  const carVaciar = () => carGuardar([]);

  /* ---------------- avisos ---------------- */
  function avisar(msg) {
    let t = document.getElementById('aviso-pedido');
    if (!t) {
      t = document.createElement('div');
      t.id = 'aviso-pedido'; t.className = 'aviso-pedido';
      t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('ver');
    clearTimeout(avisar._t);
    avisar._t = setTimeout(() => t.classList.remove('ver'), 2200);
  }

  /* ---------------- mensajes de WhatsApp ---------------- */
  function waItem(p, v, talla) {
    const ped = (DATOS.pedido || {}), marca = (DATOS.marca || {}).nombre || '';
    const L = [];
    L.push((ped.wa_item_intro || 'Hola {marca}, me interesa esta referencia:').replace('{marca}', marca));
    L.push('');
    L.push('• ' + p.diseno + ' · ' + p.categoria);
    if (v && v.color) L.push('  ' + (ped.wa_label_color || 'Color') + ': ' + v.color);
    if (talla) L.push('  ' + (ped.wa_label_talla || 'Talla') + ': ' + talla);
    L.push('  ' + (ped.wa_label_ref || 'Referencia') + ': ' + p.id);
    if (!vacio(p.precio_unidad)) L.push('  ' + money(p.precio_unidad));
    return L.join('\n');
  }

  function waCarrito() {
    const ped = (DATOS.pedido || {}), marca = (DATOS.marca || {}).nombre || '';
    const items = carLeer();
    if (!items.length) return null;
    const L = [];
    L.push((ped.wa_lista_intro || 'Hola {marca}, quiero hacer este pedido:').replace('{marca}', marca));
    items.forEach(it => {
      L.push('');
      L.push('• ' + it.qty + '× ' + it.diseno + ' · ' + it.categoria);
      if (it.color) L.push('  ' + (ped.wa_label_color || 'Color') + ': ' + it.color);
      if (it.talla) L.push('  ' + (ped.wa_label_talla || 'Talla') + ': ' + it.talla);
      L.push('  ' + (ped.wa_label_ref || 'Referencia') + ': ' + it.id);
      L.push('  ' + money((+it.precio || 0) * (+it.qty || 0)));
    });
    L.push('');
    L.push((ped.wa_label_total || 'Total') + ': ' + money(carTotal()));
    return L.join('\n');
  }

  function abrirWa(texto) {
    const num = (DATOS.contacto || {}).whatsapp;
    if (!num) { avisar('Falta el número de WhatsApp'); return; }
    window.open('https://wa.me/' + String(num).replace(/[^0-9]/g, '') +
      '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
  }

  /* ── COSTURA F4 ──────────────────────────────────────────────────
     Único punto de cierre del pedido. Hoy: WhatsApp. Cuando entre la
     pasarela (F4), se decide aquí dentro y ni el carrito ni las líneas
     ni los botones cambian. */
  function cerrarPedido() {
    const texto = waCarrito();
    if (!texto) { avisar((DATOS.carrito || {}).vacio || 'El carrito está vacío.'); return; }
    abrirWa(texto);
  }

  /* ---------------- cajón del carrito ---------------- */
  function carMontar() {
    if (document.getElementById('car')) return;
    const c = (DATOS.carrito || {});
    const fondo = document.createElement('div');
    fondo.className = 'car-fondo'; fondo.id = 'car-fondo';
    const aside = document.createElement('aside');
    aside.className = 'car'; aside.id = 'car';
    aside.setAttribute('aria-label', c.titulo || 'Carrito');
    aside.innerHTML =
      '<header class="car__cab"><h2 class="car__t">' + esc(c.titulo || 'Tu carrito') + '</h2>' +
      '<button class="car__x" id="car-x" type="button" aria-label="' + esc(c.cerrar || 'Cerrar') + '">&times;</button></header>' +
      '<div class="car__cuerpo" id="car-cuerpo"></div>' +
      '<footer class="car__pie" id="car-pie"></footer>';
    document.body.appendChild(fondo);
    document.body.appendChild(aside);

    fondo.addEventListener('click', carCerrar);
    document.getElementById('car-x').addEventListener('click', carCerrar);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') carCerrar(); });

    /* delegación: +, −, campo editable, quitar, vaciar y enviar */
    aside.addEventListener('click', e => {
      const b = e.target.closest('[data-acc]');
      if (!b) return;
      const clave = b.dataset.k;
      const acc = b.dataset.acc;
      if (acc === 'mas' || acc === 'menos') {
        const it = carLeer().filter(x => claveLinea(x) === clave)[0];
        if (it) carFijarQty(clave, (+it.qty || 0) + (acc === 'mas' ? 1 : -1));
      } else if (acc === 'quitar') carQuitar(clave);
      else if (acc === 'vaciar') carVaciar();
      else if (acc === 'enviar') cerrarPedido();
    });
    aside.addEventListener('change', e => {
      const i = e.target.closest('input[data-qty]');
      if (i) carFijarQty(i.dataset.k, i.value);
    });
  }

  function carAbrir() { carMontar(); carPintar(); document.getElementById('car').classList.add('abierto'); document.getElementById('car-fondo').classList.add('abierto'); }
  function carCerrar() {
    const a = document.getElementById('car'), f = document.getElementById('car-fondo');
    if (a) a.classList.remove('abierto');
    if (f) f.classList.remove('abierto');
  }

  function carPintar() {
    /* el contador del nav vive en las tres páginas */
    const n = carUnidades();
    document.querySelectorAll('.t-count').forEach(e => { e.textContent = n; e.dataset.n = n; });

    const cuerpo = document.getElementById('car-cuerpo'), pie = document.getElementById('car-pie');
    if (!cuerpo || !pie) return;
    const c = (DATOS.carrito || {});
    const items = carLeer();

    if (!items.length) {
      cuerpo.innerHTML = '<p class="car-vacio">' + esc(c.vacio || 'Todavía no has agregado nada.') +
        '</p><a class="ds-btn ds-btn--acento-linea" href="catalogo.html">' +
        esc(c.vacio_boton || 'Ver el catálogo') + '</a>';
      pie.innerHTML = '';
      return;
    }

    cuerpo.innerHTML = items.map(it => {
      const k = claveLinea(it);
      const sub = (+it.precio || 0) * (+it.qty || 0);
      const meta = [it.color, it.talla ? (c.label_talla || 'Talla') + ' ' + it.talla : (c.sin_talla || 'Sin talla'), it.categoria]
        .filter(Boolean).map(esc).join(' · ');
      return '<div class="car-item">' +
        '<img class="car-item__foto" src="' + esc(it.foto) + '" alt="" loading="lazy">' +
        '<div class="car-item__in">' +
        '<span class="car-item__t">' + esc(it.diseno) + '</span>' +
        '<span class="car-item__m">' + meta + '</span>' +
        '<span class="car-item__ref">' + esc(it.id) + '</span>' +
        '<div class="car-qty" role="group" aria-label="' + esc(c.label_cantidad || 'Cantidad') + '">' +
        '<button type="button" data-acc="menos" data-k="' + esc(k) + '" aria-label="Quitar uno">&minus;</button>' +
        '<input type="number" min="0" step="1" value="' + (+it.qty || 0) + '" data-qty data-k="' + esc(k) + '" aria-label="' + esc(c.label_cantidad || 'Cantidad') + '">' +
        '<button type="button" data-acc="mas" data-k="' + esc(k) + '" aria-label="Añadir uno">+</button>' +
        '</div></div>' +
        '<div class="car-item__der">' +
        '<span class="car-item__sub">' + money(sub) + '</span>' +
        '<button class="car-item__quitar" type="button" data-acc="quitar" data-k="' + esc(k) + '">' +
        esc(c.quitar || 'Quitar') + '</button>' +
        '</div></div>';
    }).join('');

    pie.innerHTML =
      '<div class="car-total"><span>' + esc(c.label_total || 'Total') + '</span>' +
      '<span class="car-total__n">' + money(carTotal()) + '</span></div>' +
      '<button class="ds-btn ds-btn--acento car-enviar" type="button" data-acc="enviar">' +
      ICONO_WA + '<span>' + esc(c.boton_whatsapp || 'Enviar pedido por WhatsApp') + '</span></button>' +
      '<button class="car-vaciar" type="button" data-acc="vaciar">' + esc(c.vaciar || 'Vaciar carrito') + '</button>';
  }

  /* ---------------- botones de acción ----------------
     `activa()` devuelve la variante seleccionada AHORA.
     `tallaActiva()` la talla marcada AHORA (solo la ficha la tiene). */
  function accionesPedido(p, activa, opciones) {
    const o = opciones || {};
    const ped = (DATOS.pedido || {});
    const talla = () => (o.tallaActiva ? o.tallaActiva() : '');
    const caja = document.createElement('div');
    caja.className = 'pedido-acc' + (o.ficha ? ' pedido-acc--ficha' : '');

    const add = document.createElement('button');
    add.type = 'button';
    add.className = 'ds-btn ds-btn--acento-linea pedido-add';
    add.textContent = ped.boton_agregar || 'Agregar al carrito';
    add.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      carAgregar(p, activa(), talla());
    });
    caja.appendChild(add);

    const wa = document.createElement('button');
    wa.type = 'button';
    wa.className = o.ficha ? 'ds-btn ds-btn--acento pedido-wa' : 'pedido-wa pedido-wa--icono';
    wa.setAttribute('aria-label', ped.boton_whatsapp || 'Pedir por WhatsApp');
    wa.innerHTML = ICONO_WA + (o.ficha ? '<span>' + esc(ped.boton_whatsapp || 'Pedir por WhatsApp') + '</span>' : '');
    wa.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      abrirWa(waItem(p, activa(), talla()));
    });
    caja.appendChild(wa);
    return caja;
  }

  /* ================================================================
     TARJETA DE PRODUCTO
     Una tarjeta por DISEÑO. Las fotos de todas sus variantes de color
     se apilan y rotan: con el cursor en escritorio, con los círculos
     o deslizando en móvil. La foto va limpia, sin capa encima.
     ================================================================ */
  function tarjeta(p, i) {
    const vs = variantesConFoto(p);
    const art = document.createElement('article');
    art.className = 'ds-card';
    art.setAttribute('data-reveal', '');
    if (i % 3) art.setAttribute('data-delay', String(i % 3));

    const media = document.createElement('div');
    media.className = 'ds-card__media';
    vs.forEach((v, k) => {
      const im = new Image();
      im.className = 'ds-card__img' + (k === 0 ? ' is-on' : '');
      im.alt = p.diseno + ' · ' + (v.color || '');
      im.loading = 'lazy';
      im.src = 'img/' + v.fotos[0];
      im.onerror = () => { im.remove(); };
      media.appendChild(im);
    });

    const body = document.createElement('div');
    body.className = 'ds-card__body';

    const precioHTML = vacio(p.precio_unidad) ? falta('precio_unidad') : money(p.precio_unidad);
    const nombreColor = () => vs[idx] ? (vs[idx].color || '') : '';

    body.innerHTML =
      '<span class="ds-card__tag">' + esc(p.categoria || '') + '</span>' +
      '<h4 class="ds-card__title">' + esc(p.diseno || '') + '</h4>' +
      '<div class="ds-card__price">' + precioHTML + '</div>' +
      '<div class="ds-card__desc"><span class="ds-card__color"></span></div>';

    /* círculos de color: en móvil son el control, en escritorio el indicador */
    const dots = document.createElement('div');
    dots.className = 'ds-card__dots';
    vs.forEach((v, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ds-card__dot' + (k === 0 ? ' is-on' : '') + (v.hex ? '' : ' ds-card__dot--falta');
      if (v.hex) b.style.background = v.hex;
      b.title = v.color || '';
      b.setAttribute('aria-label', (p.diseno || '') + ' en ' + (v.color || ''));
      b.addEventListener('click', e => { e.stopPropagation(); parar(); ver(k); });
      dots.appendChild(b);
    });
    if (vs.length > 1) body.appendChild(dots);

    /* Acciones. Antes iban con data-nombre/data-foto ESCRITOS AQUÍ desde
       vs[0]: tienda.js los leía en el clic, pero ver() nunca los tocaba, así
       que el pedido salía siempre con la primera variante y sin color.
       Ahora se le pasa una función que lee `idx` en el momento del clic. */
    body.appendChild(accionesPedido(p, () => vs[idx]));

    art.appendChild(media); art.appendChild(body);

    /* --- rotación de color --- */
    let idx = 0, timer = null;
    const imgs = () => media.querySelectorAll('.ds-card__img');
    const puntos = dots.querySelectorAll('.ds-card__dot');
    const etiqueta = body.querySelector('.ds-card__color');

    function ver(k) {
      const n = imgs().length; if (!n) return;
      idx = (k + n) % n;
      imgs().forEach((im, j) => im.classList.toggle('is-on', j === idx));
      puntos.forEach((b, j) => b.classList.toggle('is-on', j === idx));
      if (etiqueta) etiqueta.textContent = nombreColor();
    }
    function arrancar() {
      if (vs.length < 2 || timer) return;
      timer = setInterval(() => ver(idx + 1), 900);
    }
    function parar() { clearInterval(timer); timer = null; }

    ver(0);

    if (!tocable()) {
      art.addEventListener('mouseenter', arrancar);
      art.addEventListener('mouseleave', () => { parar(); ver(0); });
    } else {
      /* móvil: deslizar sobre la foto cambia de color */
      let x0 = null;
      media.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
      media.addEventListener('touchend', e => {
        if (x0 == null) return;
        const dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 30) { ver(idx + (dx < 0 ? 1 : -1)); }
        x0 = null;
      }, { passive: true });
    }

    /* abrir la ficha del diseño */
    media.style.cursor = 'pointer';
    media.addEventListener('click', () => {
      location.href = 'producto.html?id=' + encodeURIComponent(p.id) + '&color=' + encodeURIComponent(vs[idx].color || '');
    });

    return art;
  }

  /* ---------- estado abierto/cerrado ---------- */
  function estadoApertura(hs) {
    if (!Array.isArray(hs) || !hs.length) return null;
    const mapa = { domingo: 0, lunes: 1, martes: 2, miercoles: 3, 'miércoles': 3, jueves: 4, viernes: 5, sabado: 6, 'sábado': 6 };
    const d = new Date(), hoy = d.getDay(), ahora = d.getHours() * 60 + d.getMinutes();
    const dias = t => {
      t = (t || '').toLowerCase();
      const f = Object.keys(mapa).filter(k => t.includes(k));
      if (t.includes(' a ') && f.length >= 2) {
        let a = mapa[f[0]], b = mapa[f[f.length - 1]], r = [];
        for (let i = a; ; i = (i + 1) % 7) { r.push(i); if (i === b) break; }
        return r;
      }
      return f.map(k => mapa[k]);
    };
    /* Lee «8:30 a.m. – 6:00 p.m.» y también «8:30 – 18:00».
       Sin entender a.m./p.m., «6:00 p.m.» se leía como las 6 de la mañana y el
       indicador de abierto/cerrado daba justo lo contrario media jornada. */
    const horas = t => {
      const m = (t || '').match(/(\d{1,2}):(\d{2})\s*(a\.?\s*m\.?|p\.?\s*m\.?)?/gi);
      if (!m || m.length < 2) return null;
      const p = s => {
        const x = s.match(/(\d{1,2}):(\d{2})/);
        let h = +x[1];
        const suf = (s.match(/([ap])\.?\s*m\.?/i) || [])[1];
        if (suf) {
          const pm = suf.toLowerCase() === 'p';
          if (pm && h < 12) h += 12;
          if (!pm && h === 12) h = 0;
        }
        return h * 60 + (+x[2]);
      };
      return [p(m[0]), p(m[1])];
    };
    const fmt = x => String(Math.floor(x / 60)).padStart(2, '0') + ':' + String(x % 60).padStart(2, '0');
    for (const f of hs) {
      if (!dias(f.dias).includes(hoy)) continue;
      const hr = horas(f.horas); if (!hr) return null;
      const ab = ahora >= hr[0] && ahora < hr[1];
      return { abierto: ab, texto: ab ? ('Abierto · cierra ' + fmt(hr[1])) : (ahora < hr[0] ? ('Cerrado · abre ' + fmt(hr[0])) : 'Cerrado') };
    }
    return { abierto: false, texto: 'Cerrado hoy' };
  }

  /* ---------- héroe rotativo ---------- */
  function heroBanner(fotos) {
    const cont = $('hero-foto'); if (!cont) return;
    const cands = (fotos || []).filter((v, i, a) => v && a.indexOf(v) === i);
    const A = document.createElement('div'), B = document.createElement('div');
    A.className = 'hero-capa'; B.className = 'hero-capa';
    cont.append(A, B);
    const L = [A, B]; let cur = 0, idx = 0; const ok = []; let pend = cands.length;
    if (!pend) return;
    cands.forEach(s => { const im = new Image(); im.onload = () => { ok.push(s); fin(); }; im.onerror = fin; im.src = s; });
    function fin() { if (--pend <= 0) go(); }
    function go() {
      if (!ok.length) return;
      ok.sort((a, b) => cands.indexOf(a) - cands.indexOf(b));
      L[0].style.backgroundImage = 'url("' + ok[0] + '")'; L[0].classList.add('on');
      const rm = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
      if (ok.length < 2 || rm) return;
      setInterval(() => {
        idx = (idx + 1) % ok.length;
        const nx = L[1 - cur];
        nx.style.backgroundImage = 'url("' + ok[idx] + '")';
        nx.classList.add('on'); L[cur].classList.remove('on'); cur = 1 - cur;
      }, 4500);
    }
  }

  /* ---------- menú móvil ---------- */
  function menuMovil() {
    const b = $('burger'), m = $('menu'), bd = $('menu-bd'), x = $('menu-x');
    if (!b || !m) return;
    const abrir = v => {
      m.classList.toggle('is-open', v);
      bd.classList.toggle('is-open', v);
      b.setAttribute('aria-expanded', String(v));
      document.body.style.overflow = v ? 'hidden' : '';
    };
    b.addEventListener('click', () => abrir(!m.classList.contains('is-open')));
    x.addEventListener('click', () => abrir(false));
    bd.addEventListener('click', () => abrir(false));
    m.addEventListener('click', e => { if (e.target.closest('a')) abrir(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') abrir(false); });
  }

  /* ---------- reveal por scroll ---------- */
  let io;
  function observarReveal() {
    const els = document.querySelectorAll('[data-reveal]:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    if (!io) io = new IntersectionObserver(es => {
      es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    els.forEach(e => io.observe(e));
  }

  /* ================================================================
     PARTES COMPARTIDAS
     ================================================================ */
  function pintarComunes(d) {
    aplicarTokens(d.tokens);
    const marca = d.marca || {}, nombre = marca.nombre || '';
    const wa = (d.contacto || {}).whatsapp;
    const red = d.redes || {};

    const md = document.querySelector('meta[name="description"]');
    if (md) md.content = marca.descripcion_seo || '';

    txt($('anuncio'), d.anuncio, 'anuncio');
    wordmark($('nav-logo'), nombre);
    wordmark($('menu-logo'), nombre);

    const nav = d.nav || {};
    const pintarEnlaces = (cont, arr) => {
      if (!cont) return;
      if (vacio(arr)) { cont.innerHTML = falta('nav.enlaces'); return; }
      cont.innerHTML = arr.map(l =>
        '<a href="' + esc(href(l.href)) + '">' + esc(l.texto || '') + '</a>').join('');
    };
    pintarEnlaces($('nav-links'), nav.enlaces);
    pintarEnlaces($('menu-links'), nav.enlaces);
    const cta = nav.cta || {};
    txt($('nav-cta'), cta.texto, 'nav.cta.texto');
    txt($('menu-cta'), cta.texto, 'nav.cta.texto');
    if (cta.href) { $('nav-cta').href = href(cta.href); $('menu-cta').href = href(cta.href); }
    menuMovil();

    /* pie */
    wordmark($('pie-logo'), nombre);
    const pie = d.pie || {}, cols = $('pie-cols');
    (pie.columnas || []).forEach(cl => {
      const div = document.createElement('div');
      div.className = 'ds-footer__col';
      div.innerHTML = '<b>' + esc(cl.titulo || '') + '</b>' +
        (cl.enlaces || []).map(l => '<a href="' + esc(href(l.href)) + '">' + esc(l.texto || '') + '</a>').join('');
      cols.appendChild(div);
    });
    const colRedes = document.createElement('div');
    colRedes.className = 'ds-footer__col';
    colRedes.innerHTML = '<b>' + esc(pie.titulo_redes || 'Síguenos') + '</b>';
    ['instagram', 'tiktok', 'facebook'].forEach(k => {
      if (red[k]) colRedes.insertAdjacentHTML('beforeend',
        '<a href="' + esc(red[k]) + '" target="_blank" rel="noopener">' +
        k.charAt(0).toUpperCase() + k.slice(1) + '</a>');
    });
    if (!red.instagram && !red.tiktok && !red.facebook) colRedes.insertAdjacentHTML('beforeend', falta('redes'));
    cols.appendChild(colRedes);
    txt($('pie-nombre'), [nombre, marca.ciudad].filter(Boolean).join(' · '), 'marca.nombre');
    txt($('pie-legal'), pie.linea_legal, 'pie.linea_legal');

    /* flotantes */
    const arr = $('arriba');
    if (arr) {
      arr.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
      const ref = document.querySelector('.hero') || document.querySelector('.ds-nav');
      if ('IntersectionObserver' in window && ref) {
        new IntersectionObserver(es => arr.classList.toggle('ver', !es[0].isIntersecting),
          { threshold: .02 }).observe(ref);
      }
    }
    const waf = $('wa-flota');
    if (waf) {
      if (wa) waf.href = waLink(wa, 'Hola ' + nombre + ', tengo una consulta.');
      else {
        waf.removeAttribute('href');
        waf.setAttribute('aria-disabled', 'true');
        waf.title = 'Falta contacto.whatsapp en marca.json';
      }
    }

    if (window.Tienda) {
      Tienda.init({
        nombre: nombre, whatsapp: wa || '',
        /* El módulo abre un overlay de registro a los 700 ms de cargar
           (tienda.js: cfg.registro por defecto true → mostrarReg()). Ocupa el
           viewport ENTERO y es lo primero que ve quien entra. En una maqueta
           para revisión estorba, y además el registro no lleva a ninguna parte:
           guarda en localStorage y no hay backend. Se apaga por su propia API,
           sin tocar tienda.js (que es módulo del export). */
        registro: false,
        regVideo: 'animaciones/registro-ilustracion.mp4',
        regPoster: 'animaciones/reg-poster.jpg'
      });
    }
  }

  /* ================================================================
     TEMPORIZADOR DEL PRÓXIMO LANZAMIENTO
     Se calcula solo desde la fecha actual: no hay fecha fija que expire.
     ================================================================ */
  function proximoLanzamiento(dias, hhmm) {
    const validos = (Array.isArray(dias) && dias.length ? dias : [3, 6])
      .map(Number).filter(n => n >= 0 && n <= 6);
    const partes = String(hhmm || '00:00').split(':');
    const H = Number(partes[0]) || 0, M = Number(partes[1]) || 0;
    const ahora = new Date();
    for (let i = 0; i <= 7; i++) {
      const c = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + i, H, M, 0, 0);
      if (validos.indexOf(c.getDay()) >= 0 && c.getTime() > ahora.getTime()) return c;
    }
    return null;
  }

  function pintarProximo(d) {
    const px = d.proximo || {};
    txt($('prox-titulo'), px.titulo, 'proximo.titulo');
    txt($('prox-label'), px.candado_texto, 'proximo.candado_texto');

    /* fotos borrosas */
    const cf = $('prox-fotos');
    if (vacio(px.fotos)) cf.innerHTML = '<div></div><div></div><div></div>';
    else px.fotos.slice(0, 3).forEach(src => {
      const div = document.createElement('div');
      const im = new Image(); im.alt = ''; im.src = src; im.loading = 'lazy';
      div.appendChild(im); cf.appendChild(div);
    });

    /* reloj */
    const reloj = $('prox-reloj'), capa = document.querySelector('.prox-capa');
    const et = px.etiquetas_tiempo || {};
    let objetivo = proximoLanzamiento(px.dias_lanzamiento, px.hora_lanzamiento);

    function llegaron() {
      capa.innerHTML =
        '<div class="prox-llego">' +
        '<h3>' + (vacio(px.llegaron_titulo) ? falta('proximo.llegaron_titulo') : esc(px.llegaron_titulo)) + '</h3>' +
        '<p>' + (vacio(px.llegaron_texto) ? falta('proximo.llegaron_texto') : esc(px.llegaron_texto)) + '</p>' +
        '<a class="ds-btn ds-btn--light" href="' + esc(px.llegaron_href || 'catalogo.html') + '">' +
        (vacio(px.llegaron_boton) ? falta('proximo.llegaron_boton') : esc(px.llegaron_boton)) + '</a></div>';
    }

    function tic() {
      if (!objetivo) { llegaron(); return; }
      let ms = objetivo.getTime() - Date.now();
      if (ms <= 0) {
        /* al llegar a cero no se muestra un contador en negativo:
           se pasa al estado «ya llegaron» y se recalcula el siguiente */
        llegaron();
        setTimeout(() => {
          objetivo = proximoLanzamiento(px.dias_lanzamiento, px.hora_lanzamiento);
        }, 60000);
        return;
      }
      const s = Math.floor(ms / 1000);
      const p = [[Math.floor(s / 86400), et.dias || 'días'],
                 [Math.floor(s / 3600) % 24, et.horas || 'horas'],
                 [Math.floor(s / 60) % 60, et.minutos || 'min'],
                 [s % 60, et.segundos || 'seg']];
      reloj.innerHTML = p.map(x =>
        '<div class="prox-caja"><b>' + String(x[0]).padStart(2, '0') + '</b><span>' + esc(x[1]) + '</span></div>'
      ).join('');
    }
    tic(); setInterval(tic, 1000);

    /* La rejilla de 6 huecos de «ropa puesta» se retiró: eran seis
       marcadores vacíos justo debajo del contador, que es lo que esta
       sección tiene que hacer protagonista. Ese contenido lo cubre ahora
       el bloque de redes con los reels reales. */
  }

  /* ================================================================
     PORTADA
     ================================================================ */
  function pintarIndex(d) {
    const marca = d.marca || {}, nombre = marca.nombre || '';
    const wa = (d.contacto || {}).whatsapp;
    document.title = [nombre, marca.tipo].filter(Boolean).join(' — ') || '—';

    const hero = d.hero || {};
    txt($('hero-titulo'), hero.titulo, 'hero.titulo');
    txt($('hero-baja'), hero.bajada, 'hero.bajada');
    txt($('hero-btn'), hero.boton, 'hero.boton');
    heroBanner(hero.fotos);
    /* rediseño 13/10/2026: antetítulo manuscrito, sello, botón de WhatsApp */
    const kick = $('hero-kicker'); if (kick) { if (hero.antetitulo) kick.textContent = hero.antetitulo; else kick.style.display = 'none'; }
    const sello = $('hero-sello'); if (sello) { if (hero.sello) sello.textContent = hero.sello; else sello.style.display = 'none'; }
    const heroWa = $('hero-wa'), flotaWa = $('wa-flota');
    if (heroWa) { txt(heroWa, (d.contacto || {}).boton_whatsapp, 'contacto.boton_whatsapp'); if (flotaWa && flotaWa.href) heroWa.href = flotaWa.href; else heroWa.style.display = 'none'; }

    const visibles = publicables(d.productos);
    const ocultos = (d.productos || []).length - visibles.length;
    if (MODO_MAQUETA) {
      console.info('[TUENTI] MODO MAQUETA: se muestran los ' + visibles.length +
        ' diseños, licenciados incluidos. Al apagarlo se ocultarían ' +
        ocultablesCount(d.productos) + '. No indexar todavía.');
    } else if (ocultos > 0) {
      console.info('[TUENTI] ' + ocultos + ' de ' + (d.productos || []).length +
        ' productos ocultos por licenciado=true o publicable_web=false.');
    }

    const grupos = {};
    visibles.forEach(p => { const c = p.categoria || 'Sin categoría'; (grupos[c] = grupos[c] || []).push(p); });
    const orden = (d.categorias || []).filter(c => grupos[c] && grupos[c].length);
    Object.keys(grupos).forEach(c => { if (orden.indexOf(c) < 0) orden.push(c); });

    /* franja: las seis categorías */
    const cats = $('cats');
    orden.forEach(cat => {
      const a = document.createElement('a');
      a.className = 'cat'; a.href = 'catalogo.html#' + encodeURIComponent(cat);
      const precioCat = grupos[cat][0] && !vacio(grupos[cat][0].precio_unidad) ? money(grupos[cat][0].precio_unidad) : '';
      a.innerHTML = '<span class="cat-n">' + esc(cat) + '</span>' + (precioCat ? '<span class="cat-p">' + precioCat + '</span>' : '');
      const fotoCat = (d.categorias_fotos || {})[cat];
      const v = variantesConFoto(grupos[cat][0])[0];
      if (fotoCat) {
        const im = new Image();
        im.alt = ''; im.loading = 'lazy';
        im.onerror = () => im.remove();
        a.insertBefore(im, a.firstChild);
        im.src = fotoCat;
      } else if (v) {
        /* la imagen se inserta YA y carga dentro del DOM: una imagen con
           loading="lazy" que aún no está en el documento nunca dispara onload. */
        const im = new Image();
        im.alt = ''; im.loading = 'lazy';
        im.onerror = () => im.remove();
        a.insertBefore(im, a.firstChild);
        im.src = 'img/' + v.fotos[0];
      }
      cats.appendChild(a);
    });

    /* destacado — SOLO LA PRENDA.
       Sin antetítulo, sin título, sin texto, sin precio y sin botón: la foto
       sola. Se elige la variante de color que fija destacado.color; si no
       existe, cae en la primera con foto. La foto enlaza a la ficha, que no
       añade ruido visual pero evita que sea un callejón sin salida. */
    const dest = d.destacado || {};
    const prodDest = visibles.filter(p => p.id === dest.producto_id)[0];
    const cajaDest = $('dest-prenda');
    if (cajaDest) {
      if (prodDest) {
        const vsD = variantesConFoto(prodDest);
        const vD = vsD.filter(v => v.color === dest.color)[0] || vsD[0];
        if (vD) {
          const im = new Image();
          im.alt = prodDest.diseno + ' · ' + (vD.color || '');
          im.loading = 'lazy';
          im.onerror = () => im.remove();
          cajaDest.appendChild(im);
          im.src = 'img/' + vD.fotos[0];
          cajaDest.href = 'producto.html?id=' + encodeURIComponent(prodDest.id) +
            (vD.color ? '&color=' + encodeURIComponent(vD.color) : '');
        }
      } else {
        cajaDest.innerHTML = falta('destacado.producto_id');
      }
    }

    /* próximo diseño */
    pintarProximo(d);

    /* historia */
    const h = d.historia || {};
    txt($('hist-eyebrow'), h.antetitulo, 'historia.antetitulo');
    txt($('hist-titulo'), h.titulo, 'historia.titulo');
    txt($('hist-texto'), h.texto, 'historia.texto');
    txt($('hist-btn'), h.boton, 'historia.boton');
    if (h.foto) { const im = new Image(); im.alt = ''; im.src = h.foto; im.onload = () => $('historia').insertBefore(im, $('historia').firstChild); }

    /* promesas */
    const pr = $('promesas');
    if (vacio(d.promesas)) pr.innerHTML = '<div class="promesa">' + falta('promesas') + '</div>';
    else pr.innerHTML = d.promesas.map(p =>
      '<div class="promesa"><b>' + esc(p.titulo || '') + '</b><span>' + esc(p.texto || '') + '</span></div>').join('');

    /* local */
    const loc = d.local || {};
    txt($('local-titulo'), loc.titulo, 'local.titulo');
    $('dir-label').textContent = 'Dirección';
    txt($('dir-val'), loc.direccion, 'local.direccion');
    txt($('como-llegar'), loc.boton_como_llegar, 'local.boton_como_llegar');
    const est = estadoApertura(loc.horario_semana);
    if (est) {
      const a = $('abre'); a.style.display = 'inline-flex';
      a.classList.add(est.abierto ? 'abierto' : 'cerrado');
      $('abre-txt').textContent = est.texto;
    }
    const hor = $('horario');
    if (vacio(loc.horario_semana)) hor.innerHTML = '<div class="hfila">' + falta('local.horario_semana') + '</div>';
    else loc.horario_semana.forEach(f => hor.insertAdjacentHTML('beforeend',
      '<div class="hfila"><span class="d">' + esc(f.dias) + '</span><span class="h">' + esc(f.horas) + '</span></div>'));
    if (loc.direccion) $('como-llegar').onclick = () => window.open(
      'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(loc.direccion), '_blank', 'noopener');
    else $('como-llegar').style.display = 'none';
    if (loc.mapa_embed) {
      const f = document.createElement('iframe');
      f.src = loc.mapa_embed; f.loading = 'lazy'; f.title = 'Mapa';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      $('mapa').appendChild(f);
    } else $('mapa').innerHTML = falta('local.mapa_embed');

    /* contacto */
    const c = d.contacto || {};
    txt($('cont-titulo'), c.titulo, 'contacto.titulo');
    txt($('cont-texto'), c.texto, 'contacto.texto');
    txt($('cont-wa-txt'), c.boton_whatsapp, 'contacto.boton_whatsapp');
    if (wa) $('contacto-wa').href = waLink(wa, 'Hola ' + nombre + ', tengo una consulta.');
    else { $('contacto-wa').removeAttribute('href'); $('contacto-wa').insertAdjacentHTML('afterend', falta('contacto.whatsapp')); }
    if (c.telefono) {
      $('contacto-tel').href = 'tel:' + String(c.telefono).replace(/[^0-9+]/g, '');
      $('contacto-tel').textContent = c.boton_telefono || 'Llamar';
    } else $('contacto-tel').innerHTML = falta('contacto.telefono');

    /* instagram: reels incrustados + perfil (rediseño 13/10/2026) */
    const red = d.redes || {};
    const kickR = $('red-kicker');
    if (kickR) { if (red.antetitulo) kickR.textContent = red.antetitulo; else kickR.style.display = 'none'; }
    txt($('red-titulo'), red.titulo, 'redes.titulo');
    const ru = $('red-usuario');
    if (ru) {
      if (red.usuario) { ru.textContent = red.usuario; ru.href = red.instagram || '#'; }
      else ru.innerHTML = falta('redes.usuario');
    }
    const reelsEl = $('reels');
    const idsReel = (red.reels_destacados || [])
      .map(u => (String(u).match(/\/reel\/([^\/?#]+)/) || [])[1]).filter(Boolean);
    if (reelsEl) {
      if (!idsReel.length) reelsEl.style.display = 'none';
      idsReel.forEach(id => {
        const f = document.createElement('div');
        f.className = 'reel';
        f.dataset.src = 'https://www.instagram.com/reel/' + id + '/embed/';
        f.innerHTML = '<a class="reel__ph" href="https://www.instagram.com/reel/' + id + '/" target="_blank" rel="noopener">Ver en Instagram</a>';
        reelsEl.appendChild(f);
      });
    }
    const pe = $('perfil-embed');
    if (pe) {
      if (red.usuario) pe.dataset.src = 'https://www.instagram.com/' + String(red.usuario).replace('@', '') + '/embed/';
      else pe.closest('.perfil-wrap').style.display = 'none';
    }
    /* los iframes de Instagram pesan: se montan al acercarse a la sección */
    const diferidos = Array.prototype.slice.call(document.querySelectorAll('.reel[data-src], #perfil-embed[data-src]'));
    const montar = el => {
      if (el.querySelector('iframe')) return;
      const fr = document.createElement('iframe');
      fr.src = el.dataset.src; fr.title = 'Publicación de Instagram';
      fr.setAttribute('scrolling', 'no'); fr.setAttribute('allowtransparency', 'true');
      const ph = el.querySelector('.reel__ph');
      fr.addEventListener('load', () => { if (ph) ph.style.display = 'none'; });
      el.appendChild(fr);
    };
    if ('IntersectionObserver' in window) {
      const ioIg = new IntersectionObserver(es => es.forEach(en => {
        if (en.isIntersecting) { montar(en.target); ioIg.unobserve(en.target); }
      }), { rootMargin: '500px 0px' });
      diferidos.forEach(e => ioIg.observe(e));
    } else diferidos.forEach(montar);

    const rc = $('redes-cta');
    const svgIg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>';
    const svgTk = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c.4 2.3 1.9 3.9 4 4.1v2.8c-1.5.1-2.9-.4-4-1.2v5.6a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v2.9a2.8 2.8 0 1 0 2 2.7V3h2.9z"/></svg>';
    const svgFb = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.6 22v-8.1h2.7l.5-3.3h-3.2V8.6c0-1 .4-1.7 1.8-1.7h1.5V4.1c-.3 0-1.2-.1-2.3-.1-2.5 0-4.1 1.5-4.1 4.2v2.4H7.3v3.3H10V22h3.6z"/></svg>';
    if (red.instagram) rc.insertAdjacentHTML('beforeend',
      '<a class="ds-btn ds-btn--solid-ig" href="' + esc(red.instagram) + '" target="_blank" rel="noopener">' + svgIg + esc(red.boton_perfil || 'Instagram') + '</a>');
    else rc.insertAdjacentHTML('beforeend', falta('redes.instagram'));
    if (red.tiktok) rc.insertAdjacentHTML('beforeend',
      '<a class="ds-btn ds-btn--outline" href="' + esc(red.tiktok) + '" target="_blank" rel="noopener">' + svgTk + 'TikTok</a>');
    else rc.insertAdjacentHTML('beforeend', falta('redes.tiktok'));
    if (red.facebook) rc.insertAdjacentHTML('beforeend',
      '<a class="ds-btn ds-btn--outline" href="' + esc(red.facebook) + '" target="_blank" rel="noopener">' + svgFb + 'Facebook</a>');
  }

  /* ================================================================
     CATÁLOGO
     ================================================================ */
  function pintarCatalogo(d) {
    const marca = d.marca || {}, nombre = marca.nombre || '';
    const cat = d.catalogo || {};
    document.title = [nombre, cat.titulo || 'Catálogo'].filter(Boolean).join(' — ');

    txt($('cat-titulo'), cat.titulo, 'catalogo.titulo');
    txt($('cat-buscar-label'), cat.buscador_label, 'catalogo.buscador_label');
    txt($('cat-toggle-txt'), cat.filtros_titulo, 'catalogo.filtros_titulo');
    txt($('cat-limpiar'), cat.filtros_limpiar, 'catalogo.filtros_limpiar');
    const inputBuscar = $('cat-buscar');
    if (inputBuscar) inputBuscar.placeholder = cat.buscador_placeholder || '';

    const visibles = publicables(d.productos);
    const ocultos = (d.productos || []).length - visibles.length;
    if (MODO_MAQUETA) {
      console.info('[TUENTI] MODO MAQUETA: se muestran los ' + visibles.length +
        ' diseños, licenciados incluidos. Al apagarlo se ocultarían ' +
        ocultablesCount(d.productos) + '. No indexar todavía.');
    } else if (ocultos > 0) {
      console.info('[TUENTI] ' + ocultos + ' de ' + (d.productos || []).length +
        ' productos ocultos por licenciado=true o publicable_web=false.');
    }

    /* El género no es un dato aparte: sale de la categoría. Todo lo que no
       es «Hombre» es «Mujer». Así no hay un campo más que mantener. */
    const genero = p => p.categoria === 'Hombre' ? 'Hombre' : 'Mujer';

    /* Búsqueda sin tildes ni mayúsculas, por coincidencia parcial:
       «nirvana» devuelve todo lo que contenga nirvana. Se busca en el
       nombre del diseño, la categoría, el tema y los colores. */
    const plano = t => String(t == null ? '' : t).toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '');
    const heno = p => plano([p.diseno, p.categoria, p.tema,
      (p.variantes || []).map(v => v.color).join(' ')].join(' '));
    const indice = new Map(visibles.map(p => [p, heno(p)]));

    const GRUPOS = [
      { id: 'genero',    label: cat.label_genero    || 'Género',    valores: cat.generos || ['Mujer', 'Hombre'], de: genero },
      { id: 'categoria', label: cat.label_categoria || 'Categoría', valores: d.categorias || [],                 de: p => p.categoria },
      { id: 'tema',      label: cat.label_tema      || 'Tema',      valores: cat.temas || [],                    de: p => p.tema }
    ];
    const sel = { genero: new Set(), categoria: new Set(), tema: new Set() };
    let texto = '';

    const lista = $('catalogo-lista'), conteo = $('cat-conteo');

    /* Los filtros se COMBINAN: dentro de un grupo suman (o), entre grupos
       restringen (y). Un grupo sin nada marcado no filtra. */
    function pasa(p, saltar) {
      for (const g of GRUPOS) {
        if (g.id === saltar) continue;
        const s = sel[g.id];
        if (s.size && !s.has(g.de(p))) return false;
      }
      if (texto && indice.get(p).indexOf(texto) < 0) return false;
      return true;
    }
    const filtrados = () => visibles.filter(p => pasa(p, null));

    /* Cuántos quedarían al marcar esa opción: el número de al lado de cada
       casilla. Se calcula ignorando su propio grupo, que es lo que evita
       que las opciones de un mismo grupo se anulen entre sí. */
    function cuantos(g, valor) {
      return visibles.filter(p => g.de(p) === valor && pasa(p, g.id)).length;
    }

    function pintarGrupos() {
      GRUPOS.forEach(g => {
        const caja = $('cat-g-' + g.id);
        if (!caja) return;
        caja.innerHTML = '<p class="ds-pdp__label">' + esc(g.label) + '</p>' +
          g.valores.map(v => {
            const n = cuantos(g, v);
            return '<label class="cat-op">' +
              '<input type="checkbox" data-g="' + esc(g.id) + '" value="' + esc(v) + '"' +
              (sel[g.id].has(v) ? ' checked' : '') + (n ? '' : ' disabled') + '>' +
              '<span class="cat-op__caja"></span>' +
              '<span class="cat-op__txt">' + esc(v) + '</span>' +
              '<span class="cat-op__n">' + String(n).padStart(2, '0') + '</span></label>';
          }).join('');
      });
      const n = sel.genero.size + sel.categoria.size + sel.tema.size + (texto ? 1 : 0);
      const badge = $('cat-activos'), limpiarBtn = $('cat-limpiar');
      if (badge) { badge.hidden = !n; badge.textContent = String(n); }
      if (limpiarBtn) limpiarBtn.hidden = !n;
    }

    function render() {
      const items = filtrados();
      const marcados = [].concat(
        Array.from(sel.genero), Array.from(sel.categoria), Array.from(sel.tema));
      $('cat-grupo-h').textContent = marcados.length ? marcados.join(' · ')
        : (texto ? '«' + inputBuscar.value.trim() + '»' : (cat.filtro_todas || 'Todas'));
      conteo.textContent = String(items.length).padStart(2, '0') + ' ' +
        (cat.conteo || 'diseños visibles');

      lista.innerHTML = '';
      if (!items.length) {
        lista.innerHTML =
          '<div class="cat-vacio">' +
          '<h3>' + (vacio(cat.vacio_titulo) ? falta('catalogo.vacio_titulo') : esc(cat.vacio_titulo)) + '</h3>' +
          '<p>' + (vacio(cat.vacio_texto) ? falta('catalogo.vacio_texto') : esc(cat.vacio_texto)) + '</p>' +
          '<button class="ds-btn ds-btn--outline" type="button" id="cat-vacio-limpiar">' +
          esc(cat.vacio_boton || 'Limpiar') + '</button></div>';
      } else {
        const g = document.createElement('div');
        g.className = 'ds-grid';
        items.forEach((p, i) => g.appendChild(tarjeta(p, i)));
        lista.appendChild(g);
      }
      pintarGrupos();
      observarReveal();
    }

    function limpiar() {
      sel.genero.clear(); sel.categoria.clear(); sel.tema.clear();
      texto = '';
      if (inputBuscar) inputBuscar.value = '';
      render();
    }

    /* Todo sin recargar: delegación sobre el panel. */
    const panel = $('cat-panel');
    if (panel) panel.addEventListener('change', e => {
      const el = e.target.closest('input[data-g]');
      if (!el) return;
      const s = sel[el.dataset.g];
      if (el.checked) s.add(el.value); else s.delete(el.value);
      render();
    });

    if (inputBuscar) {
      let t;
      inputBuscar.addEventListener('input', () => {
        clearTimeout(t);
        t = setTimeout(() => { texto = plano(inputBuscar.value.trim()); render(); }, 140);
      });
    }
    const btnLimpiar = $('cat-limpiar');
    if (btnLimpiar) btnLimpiar.addEventListener('click', limpiar);
    lista.addEventListener('click', e => {
      if (e.target.closest('#cat-vacio-limpiar')) { e.preventDefault(); limpiar(); }
    });

    /* Panel colapsable en móvil. En escritorio el CSS lo deja siempre abierto. */
    const tog = $('cat-toggle'), panelIn = $('cat-panel-in');
    if (tog && panelIn) tog.addEventListener('click', () => {
      const ab = panelIn.classList.toggle('abierto');
      tog.setAttribute('aria-expanded', String(ab));
    });

    /* La portada enlaza a #Categoría: se respeta como filtro de entrada. */
    if (location.hash) {
      const h = decodeURIComponent(location.hash.slice(1));
      if ((d.categorias || []).indexOf(h) >= 0) sel.categoria.add(h);
    }
    render();
  }

  /* ================================================================
     FICHA DE PRODUCTO  ·  selector de color por hex
     ================================================================ */
  function pintarProducto(d) {
    const marca = d.marca || {}, nombre = marca.nombre || '';
    const wa = (d.contacto || {}).whatsapp;
    const f = d.ficha || {};
    const par = new URLSearchParams(location.search);
    const visibles = publicables(d.productos);
    const p = visibles.filter(x => x.id === par.get('id'))[0];

    txt($('pdp-volver'), f.volver, 'ficha.volver');

    if (!p) {
      document.title = nombre + ' — ' + (f.no_encontrado_titulo || '');
      $('pdp').innerHTML =
        '<div class="cat-vacio" style="grid-column:1/-1">' +
        '<h3>' + (vacio(f.no_encontrado_titulo) ? falta('ficha.no_encontrado_titulo') : esc(f.no_encontrado_titulo)) + '</h3>' +
        '<p>' + (vacio(f.no_encontrado_texto) ? falta('ficha.no_encontrado_texto') : esc(f.no_encontrado_texto)) + '</p>' +
        '<a class="ds-btn ds-btn--outline" href="catalogo.html">' + esc(f.volver || 'Catálogo') + '</a></div>';
      return;
    }

    document.title = [nombre, p.diseno].filter(Boolean).join(' — ');
    const vs = variantesConFoto(p);
    let idx = Math.max(0, vs.findIndex(v => v.color === par.get('color')));

    $('pdp-cat').textContent = p.categoria || '';
    $('pdp-titulo').textContent = p.diseno || '';
    $('pdp-precio').innerHTML = vacio(p.precio_unidad) ? falta('precio_unidad') : money(p.precio_unidad);

    /* Precio mayorista — CARGADO COMO DATO, OCULTO EN PANTALLA.
       Ver docs/TRASPASO_WEB.md §0.5.

       El dato existe en marca.json (tarifa de 12+ unidades) pero NO se muestra:
       el mayorista es canal de WhatsApp y la regla dura nº2 de CLAUDE.md prohíbe
       venderlo desde la web. Que no se vea es una DECISIÓN, no una carencia, así
       que el interruptor es explícito y no depende de que el campo esté vacío:
       si dependiera del valor, cargar el dato lo destaparía solo. */
    const MOSTRAR_MAYORISTA = false;
    const pm = $('pdp-precio-mayor');
    if (pm) {
      const hay = !vacio(p.precio_mayor);
      pm.hidden = !(MOSTRAR_MAYORISTA && hay);
      pm.textContent = (MOSTRAR_MAYORISTA && hay)
        ? ((d.ficha || {}).label_precio_mayor || 'Al por mayor') + ' ' + money(p.precio_mayor)
        : '';
    }

    $('pdp-ref').textContent = p.id;
    txt($('pdp-label-color'), f.label_color, 'ficha.label_color');
    txt($('pdp-label-talla'), f.label_talla, 'ficha.label_talla');

    const main = $('pdp-main'), thumbs = $('pdp-thumbs'), colores = $('pdp-colores'), tallas = $('pdp-tallas');

    /* círculos de color: el color sale del hex de marca.json, no de la foto */
    vs.forEach((v, k) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ds-color' + (v.hex ? '' : ' ds-color--falta');
      if (v.hex) b.style.background = v.hex;
      b.title = v.color || '';
      b.setAttribute('aria-label', v.color || '');
      b.addEventListener('click', () => ver(k));
      colores.appendChild(b);
    });
    const nombreColor = document.createElement('span');
    nombreColor.className = 'ds-colors__nombre';
    colores.appendChild(nombreColor);

    function ver(k) {
      idx = k;
      const v = vs[idx];
      main.innerHTML = '<img src="img/' + esc(v.fotos[0]) + '" alt="' + esc(p.diseno + ' · ' + v.color) + '">';
      colores.querySelectorAll('.ds-color').forEach((b, j) => b.classList.toggle('is-on', j === idx));
      /* si a este color le falta el hex, se dice cuál falta */
      nombreColor.innerHTML = esc(v.color || '') + (v.hex ? '' : ' ' + falta('hex_color'));

      thumbs.innerHTML = '';
      (v.fotos || []).forEach((src, j) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'ds-gallery__thumb' + (j === 0 ? ' is-on' : '');
        b.innerHTML = '<img src="img/' + esc(src) + '" alt="">';
        b.addEventListener('click', () => {
          main.innerHTML = '<img src="img/' + esc(src) + '" alt="">';
          thumbs.querySelectorAll('.ds-gallery__thumb').forEach((t, q) => t.classList.toggle('is-on', q === j));
        });
        thumbs.appendChild(b);
      });

      tallas.innerHTML = vacio(v.tallas)
        ? falta('tallas')
        : v.tallas.map((t, j) => '<button class="ds-size' + (j === 0 ? ' is-on' : '') + '" type="button">' + esc(t) + '</button>').join('');

      const precio = vacio(p.precio_unidad) ? falta('precio_unidad') : money(p.precio_unidad);
      $('pdp-wa-precio').innerHTML = precio;
      /* Los botones NO se reconstruyen aquí: leen la variante en el clic. */
      history.replaceState(null, '', '?id=' + encodeURIComponent(p.id) + '&color=' + encodeURIComponent(v.color || ''));
    }

    tallas.addEventListener('click', e => {
      const b = e.target.closest('.ds-size'); if (!b) return;
      tallas.querySelectorAll('.ds-size').forEach(x => x.classList.toggle('is-on', x === b));
    });

    /* detalles */
    const dl = $('pdp-detalles');
    (f.detalles || []).forEach(row => {
      dl.insertAdjacentHTML('beforeend',
        '<div class="ds-pdp__row"><dt>' + esc(row.clave || '') + '</dt><dd>' +
        (vacio(row.valor) ? falta('ficha.detalles.' + slug(row.clave || '')) : esc(row.valor)) + '</dd></div>');

      /* La tela depende de la CATEGORÍA, no del diseño: Clásicas es algodón
         liviano y Oversize algodón pesado. Se inserta justo después de
         «Material», que es su sitio natural. Las categorías que no están en
         el mapa no pintan la fila: no hay dato que falte, es que no aplica. */
      if (slug(row.clave || '') === 'material') {
        const tela = (f.tela_por_categoria || {})[p.categoria];
        if (tela) {
          dl.insertAdjacentHTML('beforeend',
            '<div class="ds-pdp__row"><dt>' + esc(f.label_tela || 'Tela') +
            '</dt><dd>' + esc(tela) + '</dd></div>');
        }
      }
    });

    const host = $('pdp-acciones');
    if (host) {
      host.appendChild(accionesPedido(p, () => vs[idx], {
        ficha: true,
        /* la talla también se lee en el clic, no en el render */
        tallaActiva: () => {
          const b = tallas.querySelector('.ds-size.is-on');
          return b && !b.disabled ? b.textContent.trim() : '';
        }
      }));
      if (!wa) host.insertAdjacentHTML('beforeend', ' ' + falta('contacto.whatsapp'));
    }

    ver(idx);
  }

  /* ================================================================
     PÁGINA LEGAL
     El contenido vive en legal.json, no en el HTML. Son tres documentos
     BORRADOR pendientes de revisión por abogado.
     ================================================================ */
  async function pintarLegal(d) {
    const marca = d.marca || {}, nombre = marca.nombre || '';
    let L;
    try {
      const r = await fetch('legal.json', { cache: 'no-store' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      L = await r.json();
    } catch (err) { mostrarError('legal.json', err); return; }

    document.title = [nombre, L.titulo || 'Legal'].filter(Boolean).join(' — ');
    txt($('legal-titulo'), L.titulo, 'legal.titulo');
    txt($('legal-bajada'), L.bajada, 'legal.bajada');
    txt($('legal-aviso'), L.aviso_borrador, 'legal.aviso_borrador');
    txt($('legal-fecha'), L.actualizado_texto, 'legal.actualizado_texto');

    const docs = L.documentos || [];
    $('legal-indice').innerHTML = docs.map(x =>
      '<a href="#' + esc(x.id) + '">' + esc(x.titulo) + '</a>').join('');

    const cont = $('legal-docs');
    cont.innerHTML = docs.map(doc => {
      const secs = (doc.secciones || []).map(sec => {
        const p1 = (sec.parrafos || []).map(t => '<p>' + esc(t) + '</p>').join('');
        const lt = sec.lista_titulo ? '<p class="legal-lt">' + esc(sec.lista_titulo) + '</p>' : '';
        const li = (sec.lista || []).length
          ? '<ul>' + sec.lista.map(t => '<li>' + esc(t) + '</li>').join('') + '</ul>' : '';
        const p2 = (sec.parrafos_final || []).map(t => '<p>' + esc(t) + '</p>').join('');
        return '<div class="legal-sec' + (sec.destacado ? ' legal-sec--destacada' : '') + '">' +
          '<h3>' + esc(sec.titulo || '') + '</h3>' + p1 + lt + li + p2 + '</div>';
      }).join('');
      return '<article class="legal-doc" id="' + esc(doc.id) + '" data-reveal>' +
        '<h2 class="ds-title">' + esc(doc.titulo || '') + '</h2>' +
        (doc.intro ? '<p class="ds-intro">' + esc(doc.intro) + '</p>' : '') +
        secs + '</article>';
    }).join('');
    observarReveal();
  }

  /* ================================================================
     REGISTRO
     Reactivado el 2026-08-05: ahora tiene propósito (10% de la primera
     compra y aviso de diseños nuevos).

     Dos cosas deliberadas:
     · NO salta al cargar. El módulo del export lo hacía a los 700 ms y
       tapaba el viewport entero, que fue justo la queja. Aquí aparece
       una sola vez, y solo cuando la visitante ya pasó del 60% de la
       página: si llegó hasta ahí, el registro le puede interesar.
     · La casilla de datos NO viene premarcada y es obligatoria, como
       exige la Ley 1581 de 2012. Sin marcarla no se completa nada.

     ⚠ Guarda en localStorage. NO hay captura real de datos: para KPIs y
     mercadeo hace falta backend. Es F4/F5. Ver TRASPASO §0.16.
     ================================================================ */
  const REG_KEY = 'tuenti_registro_v1';
  const REG_VISTO = 'tuenti_registro_visto_v1';
  const registrado = () => { try { return !!localStorage.getItem(REG_KEY); } catch (e) { return false; } };

  function regMontar() {
    if (document.getElementById('reg') || !DATOS) return;
    const r = (DATOS.registro || {});
    const fondo = document.createElement('div');
    fondo.className = 'reg-fondo'; fondo.id = 'reg-fondo';
    const caja = document.createElement('div');
    caja.className = 'reg'; caja.id = 'reg';
    caja.setAttribute('role', 'dialog');
    caja.setAttribute('aria-modal', 'true');
    caja.setAttribute('aria-label', r.titulo || 'Registro');
    caja.innerHTML =
      '<button class="reg__x" id="reg-x" type="button" aria-label="' + esc(r.cerrar || 'Cerrar') + '">&times;</button>' +
      '<h2 class="reg__t">' + esc(r.titulo || '') + '</h2>' +
      '<p class="reg__p">' + esc(r.texto || '').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>') + '</p>' +
      '<form id="reg-form" novalidate>' +
      '<label class="reg-campo"><span>' + esc(r.label_nombre || 'Nombre') + '</span>' +
      '<input name="nombre" autocomplete="name" required></label>' +
      '<label class="reg-campo"><span>' + esc(r.label_whatsapp || 'WhatsApp') + '</span>' +
      '<input name="whatsapp" inputmode="tel" autocomplete="tel" required></label>' +
      '<label class="reg-campo"><span>' + esc(r.label_email || 'Correo') + '</span>' +
      '<input name="email" type="email" autocomplete="email"></label>' +
      /* casilla de datos: obligatoria y SIN premarcar */
      '<label class="reg-datos"><input type="checkbox" name="datos" id="reg-datos">' +
      '<span class="reg-datos__caja"></span>' +
      '<span class="reg-datos__txt">' + esc(r.label_datos || '') +
      ' <a href="' + esc(r.enlace_datos || 'legal.html#datos') + '" target="_blank" rel="noopener">' +
      esc(r.enlace_datos_texto || 'Leer la política') + '</a></span></label>' +
      '<p class="reg-error" id="reg-error" role="alert" hidden></p>' +
      '<button class="ds-btn ds-btn--acento reg-enviar" type="submit">' +
      esc(r.boton || 'Crear mi cuenta') + '</button>' +
      '<button class="reg-luego" id="reg-luego" type="button">' + esc(r.cerrar || 'Ahora no') + '</button>' +
      '</form>';
    document.body.appendChild(fondo);
    document.body.appendChild(caja);

    const cerrar = () => {
      caja.classList.remove('abierto'); fondo.classList.remove('abierto');
      try { localStorage.setItem(REG_VISTO, '1'); } catch (e) { }
    };
    fondo.addEventListener('click', cerrar);
    document.getElementById('reg-x').addEventListener('click', cerrar);
    document.getElementById('reg-luego').addEventListener('click', cerrar);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrar(); });

    document.getElementById('reg-form').addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target, err = document.getElementById('reg-error');
      const datos = Object.fromEntries(new FormData(f));
      const marcado = document.getElementById('reg-datos').checked;
      const mostrar = m => { err.textContent = m; err.hidden = false; };
      if (!String(datos.nombre || '').trim() || !String(datos.whatsapp || '').trim()) {
        mostrar(r.error_campos || 'Falta el nombre o el WhatsApp.'); return;
      }
      /* sin autorización expresa no se guarda nada */
      if (!marcado) { mostrar(r.error_datos || 'Necesitas autorizar el tratamiento de datos.'); return; }
      err.hidden = true;
      try {
        localStorage.setItem(REG_KEY, JSON.stringify({
          nombre: datos.nombre, whatsapp: datos.whatsapp, email: datos.email || '',
          autoriza_datos: true, fecha: new Date().toISOString()
        }));
      } catch (e) { }
      cerrar();
      avisar(r.exito || 'Listo.');
    });
  }

  function regAbrir() {
    regMontar();
    if (registrado()) { avisar((DATOS.registro || {}).ya_registrado || 'Ya tienes cuenta.'); return; }
    const c = document.getElementById('reg'), f = document.getElementById('reg-fondo');
    if (c) c.classList.add('abierto');
    if (f) f.classList.add('abierto');
  }

  /* Se ofrece una sola vez, y no al cargar: cuando pasa del 60% de la página. */
  function regVigilar() {
    let visto = false;
    try { visto = !!localStorage.getItem(REG_VISTO); } catch (e) { }
    if (visto || registrado()) return;
    const mirar = () => {
      const alto = document.documentElement.scrollHeight - window.innerHeight;
      if (alto > 0 && (window.scrollY / alto) > 0.6) {
        window.removeEventListener('scroll', mirar);
        regAbrir();
      }
    };
    window.addEventListener('scroll', mirar, { passive: true });
  }

  /* ---------- arranque ---------- */
  (async function () {
    let datos;
    try {
      const r = await fetch('marca.json', { cache: 'no-store' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      datos = await r.json();
    } catch (err) { mostrarError('marca.json', err); return; }
    DATOS = datos;

    /* El icono del carrito del nav abre el cajón, que es donde se edita.
       Va en fase de captura por si quedara algún otro escucha en burbuja. */
    carMontar();
    carPintar();
    document.addEventListener('click', e => {
      const cb = e.target.closest('.t-cart-btn');
      if (!cb) return;
      e.preventDefault();
      e.stopPropagation();
      carAbrir();
    }, true);

    try {
      pintarComunes(datos);
      const p = pagina();
      if (p === 'legal') pintarLegal(datos);
      else if (p === 'catalogo') pintarCatalogo(datos);
      else if (p === 'producto') pintarProducto(datos);
      else pintarIndex(datos);
      observarReveal();

      /* Registro: se monta siempre (para el botón del pie) pero solo se
         ofrece solo en la portada, y no al cargar. Ver el comentario del
         módulo: nunca al arrancar, nunca dos veces. */
      regMontar();
      if (p === 'index') regVigilar();
    } catch (err) { mostrarError('marca.json', err); }
  })();
})();
