 

  document.documentElement.classList.add('js');
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

   
  (function(){
    var c=document.getElementById('stars'); if(!c) return; var x=c.getContext('2d'), S=[], W, H, t=0, raf;
    var DPRe=Math.min(devicePixelRatio||1, matchMedia('(pointer: coarse)').matches ? 1.5 : 2), anchoE=0, altoE=0;
    function size(){ var iw=innerWidth, ih=Math.max(innerHeight, document.documentElement.clientHeight);
      if(iw===anchoE && ih<=altoE) return;    
      var nuevoAncho=iw!==anchoE; anchoE=iw; altoE=Math.max(ih, nuevoAncho?0:altoE);
      W=c.width=Math.round(anchoE*DPRe); H=c.height=Math.round(altoE*DPRe); c.style.width=anchoE+'px'; c.style.height=altoE+'px';
      if(!nuevoAncho && S.length) return;
      S=[]; var n=Math.min(220,Math.floor(anchoE*altoE/9000)); for(var i=0;i<n;i++) S.push({x:Math.random()*W,y:Math.random()*H,r:(Math.random()*.9+.3)*DPRe,p:Math.random()*6.28,s:Math.random()*.6+.2,w:Math.random()<.12}); }
    var ult=0; function draw(now){ if(now && now-ult<32 && !REDUCE && !document.hidden){ raf=requestAnimationFrame(draw); return; } ult=now||0; x.clearRect(0,0,W,H); t=(now||performance.now())*.00096; for(var i=0;i<S.length;i++){ var s=S[i], a=.25+.45*(.5+.5*Math.sin(t*s.s+s.p)); x.beginPath(); x.arc(s.x,s.y,s.r,0,6.28); x.fillStyle=s.w?'rgba(242,184,75,'+a+')':'rgba(255,255,255,'+a+')'; x.fill(); } if(!REDUCE && !document.hidden) raf=requestAnimationFrame(draw); }
    size(); draw(); addEventListener('resize',function(){ size(); if(REDUCE) draw(); });
    document.addEventListener('visibilitychange',function(){ if(!document.hidden && !REDUCE){ cancelAnimationFrame(raf); draw(); } });
  })();

   
  (function(){
    var NS='http://www.w3.org/2000/svg';
    function cinta(id, d, grad, n, dx, dy){
      var g=document.getElementById(id); if(!g) return;
      var glow=document.createElementNS(NS,'path'); glow.setAttribute('d',d); glow.setAttribute('fill','none'); glow.setAttribute('stroke','url(#'+grad+')'); glow.setAttribute('stroke-width','120'); glow.setAttribute('opacity','.55'); glow.setAttribute('filter','url(#bl1)'); g.appendChild(glow);
      var glow2=document.createElementNS(NS,'path'); glow2.setAttribute('d',d); glow2.setAttribute('fill','none'); glow2.setAttribute('stroke','url(#'+grad+')'); glow2.setAttribute('stroke-width','26'); glow2.setAttribute('opacity','.5'); glow2.setAttribute('filter','url(#bl2)'); g.appendChild(glow2);
      for(var i=0;i<n;i++){ var p=document.createElementNS(NS,'path'); p.setAttribute('d',d); p.setAttribute('fill','none'); p.setAttribute('stroke','url(#'+grad+')'); p.setAttribute('stroke-width', i===0?'2.4':'1.1'); p.setAttribute('opacity',(0.9 - i*(0.82/n)).toFixed(2)); p.setAttribute('transform','translate('+(i*dx)+' '+(i*dy)+')'); g.appendChild(p); }
    }
    cinta('cinta-az','M-160 760 C 60 800, 260 560, 380 330 C 470 160, 580 40, 720 -60','gAz',15,22,8);
    cinta('cinta-am','M1660 700 C 1440 760, 1250 560, 1140 340 C 1060 180, 940 50, 790 -60','gAm',15,-22,8);
  })();

   
  (function(){ var k=document.getElementById('keys'), h=''; if(!k) return; for(var i=0;i<70;i++) h+='<i></i>'; k.innerHTML=h; })();

   
  var lapWrap=document.getElementById('lap'), lapSticky=document.getElementById('lapSticky'), scrIn=document.getElementById('scrIn');
  function ease(t){ return 1-Math.pow(1-t,3); }
  var LAP_TACTIL=matchMedia('(pointer: coarse)').matches;
  function lapTick(){
    if(!lapWrap) return;
    var p;
    if (LAP_TACTIL) { var rs=lapSticky.getBoundingClientRect(), vh=altoEstable(), sc=lapSticky.querySelector('.scene'), st=rs.top+(sc?sc.offsetTop:0);
      p=.04+.62*Math.min(1,Math.max(0,(vh*.95-st)/(vh*.6))); }    
    else { var r=lapWrap.getBoundingClientRect(), total=r.height-innerHeight; p=total>0?Math.min(1,Math.max(0,-r.top/total)):1; }
    var o=REDUCE?1:ease(Math.min(1,Math.max(0,(p-.04)/.62)));
    lapSticky.style.setProperty('--open',o.toFixed(3));
  }
  function altoEstable(){ return matchMedia('(pointer: coarse)').matches ? document.documentElement.clientHeight : innerHeight; }
  function lapSize(){ if(!scrIn) return; var lw=Math.min(820,innerWidth*.86,altoEstable()*.74); scrIn.style.setProperty('--sc',((lw-26)/1000).toFixed(4)); }
  lapSize();

   
  var CORREO_JLA = "jlautomatization@gmail.com";   
  var ASUNTO = "Solicitud de cotización";
  var CUERPO = "Buen día,\n\nEmpresa / sector: \nNecesidad: \nCómo lo resolvemos hoy: \n\nQuedo atento a su respuesta.";
  var pend = document.getElementById('pend-correo');
  if (CORREO_JLA) {
    var mailto = "mailto:" + CORREO_JLA + "?subject=" + encodeURIComponent(ASUNTO) + "&body=" + encodeURIComponent(CUERPO);
    document.querySelectorAll('[data-correo]').forEach(function(el){ if (el.closest('#contacto') || el.closest('#nomatch')) { el.setAttribute('href', mailto); } });
  } else if (pend) { pend.hidden = false; }

   
  var D = [
    { id:'parqueadero', real:true, nombre:'Parqueadero',
      claves:'parqueadero parqueaderos parking estacionamiento garaje garage cuadra',
      gancho:'Control total de caja y turnos, con alertas al propietario.', sub:'Implementado',
      mock:'<div class="mk"><div class="row"><span>06:00</span><span>Apertura de turno</span><span class="pl ok">sellado</span></div><div class="row"><span>09:41</span><span>Cobro registrado</span><span class="pl ok">sellado</span></div><div class="row"><span>11:08</span><span style="color:var(--warn)">Anulación: espera al dueño</span><span class="pl w">aviso</span></div><div class="row"><span>14:00</span><span>Cierre de turno</span><span class="pl ok">sellado</span></div><div class="row"><span>14:01</span><span>Aviso al dueño enviado</span><span class="pl b">bot</span></div></div>',
      items:['Caja y cierre de turno controlados','Registro inalterable: solo se agrega, nunca se borra','Alertas automáticas al propietario ante cualquier novedad','En operación en un negocio real desde agosto de 2026'] },
    { id:'ropa', nombre:'Tienda de ropa',
      claves:'ropa tienda boutique moda calzado zapatos zapateria accesorios comercio almacen vestidos joyeria',
      gancho:'Catálogo digital y pedidos directos por WhatsApp.', sub:'Propuesta',
      mock:'<div class="mk"><div class="col3"><div class="tile t1"></div><div class="tile t2"></div><div class="tile t3"></div><div class="tile t4"></div><div class="tile t5"></div><div class="tile t6"></div></div><div style="display:flex;justify-content:space-between;align-items:center"><span class="ln s" style="width:38%"></span><span class="pl ok">Pedir por WhatsApp</span></div></div>',
      items:['Página web con catálogo y pedido directo por WhatsApp','Tienda en línea con pagos','Notificación de cada pedido nuevo','Control básico de inventario'] },
    { id:'restaurante', nombre:'Restaurante',
      claves:'restaurante comida cafeteria cafe panaderia bar comidas rapidas domicilios cocina pizzeria hamburguesas heladeria asadero',
      gancho:'Pedidos ordenados y reportes diarios para el propietario.', sub:'Propuesta',
      mock:'<div class="mk"><div class="kanban"><div class="mini"><h5>Nuevo</h5><div class="ln b"></div><div class="ln s"></div><div class="ln b"></div></div><div class="mini"><h5>Cocina</h5><div class="ln o"></div><div class="ln s"></div></div><div class="mini"><h5>Listo</h5><div class="ln" style="background:rgba(61,214,140,.5)"></div></div></div><div class="row"><span class="av"></span><span>Pedido nuevo por WhatsApp</span><span class="pl b">bot</span></div></div>',
      items:['Chatbot de pedidos por WhatsApp o Instagram','Reporte diario de ventas y cierre','Tablero de productos más vendidos','Caja e inventario a la medida'] },
    { id:'consultorio', nombre:'Consultorio o dentista',
      claves:'consultorio dentista odontologia medico doctor clinica salud psicologo fisioterapia citas veterinaria peluqueria spa estetica',
      gancho:'Agendamiento automático y recordatorios a pacientes.', sub:'Propuesta',
      mock:'<div class="mk"><div class="cal"><b>L</b><b>M</b><b>X</b><b>J</b><b>V</b><span class="c"></span><span></span><span class="c"></span><span class="d"></span><span></span><span></span><span class="c"></span><span></span><span class="c"></span><span class="c"></span><span class="d"></span><span></span><span class="c"></span><span></span><span></span></div><div class="row"><span class="av"></span><span>Recordatorio enviado</span><span class="pl ok">listo</span></div></div>',
      items:['Agente de IA que atiende llamadas y agenda citas','Recordatorios automáticos de citas','Historial y seguimiento de pacientes','Página web con agenda en línea'] },
    { id:'gimnasio', nombre:'Gimnasio',
      claves:'gimnasio gym fitness entrenamiento crossfit box deporte socios',
      gancho:'Control de socios, pagos y asistencia.', sub:'Propuesta',
      mock:'<div class="mk"><div class="row"><span class="av"></span><span class="ln" style="width:70%"></span><span class="pl ok">Al día</span></div><div class="row"><span class="av"></span><span class="ln" style="width:55%"></span><span class="pl w">Vence pronto</span></div><div class="row"><span class="av"></span><span class="ln" style="width:62%"></span><span class="pl m">Atrasado</span></div><div class="row"><span class="av"></span><span class="ln" style="width:48%"></span><span class="pl ok">Al día</span></div></div>',
      items:['Gestión de socios, planes y pagos','Alertas por mora o inasistencia','Tablero de ingresos y asistencia','Página web para captación de socios'] },
    { id:'eventos', nombre:'Eventos y logística',
      claves:'eventos logistica evento produccion montaje agencia activaciones ferias',
      gancho:'Cotización, seguimiento y cierre de cada evento.', sub:'Propuesta',
      mock:'<div class="mk gantt"><div><span>Cotización</span><i style="width:34%"></i></div><div><span>Montaje</span><i class="o" style="width:48%;margin-left:22%"></i></div><div><span>Evento</span><i style="width:30%;margin-left:55%"></i></div><div><span>Cierre</span><i class="o" style="width:22%;margin-left:78%"></i></div></div>',
      items:['Cotizaciones y documentos automáticos','Estado de cada proyecto, de la cotización al cierre','Tablero de costos y avances','Videos y presentaciones comerciales'] }
  ];
  if (document.getElementById('designs') || document.getElementById('chipsInicio')) {
  var CHECK = '<svg viewBox="0 0 24 24"><use href="#i-check"/></svg>';
  var cont = document.getElementById('designs'), feat = document.getElementById('feat');
  var chips = document.getElementById('chips');
  var q = document.getElementById('buscar');
  var nomatch = document.getElementById('nomatch');

  function norm(s){ return (s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').trim(); }

  var chipsInicio = document.getElementById('chipsInicio');
  if (chipsInicio) D.forEach(function(d){ var a=document.createElement('a'); a.href='sectores.html?s='+d.id; a.textContent=d.nombre; chipsInicio.appendChild(a); });
  if (cont) D.forEach(function(d){
    var el;
    if (d.real) {
      el = feat; el.dataset.k = norm(d.nombre + ' ' + d.claves);
      el.innerHTML = '<div class="vis">' + d.mock + '</div><div class="txt"><span class="tag real"><i></i>Caso real</span><h3>' + d.nombre + '</h3><p class="gancho">' + d.gancho + '</p><div class="sub">' + d.sub + '</div><ul>' + d.items.map(function(i){return '<li>'+CHECK+i+'</li>';}).join('') + '</ul></div>';
    } else {
      el = document.createElement('article');
      el.className = 'card design'; el.dataset.k = norm(d.nombre + ' ' + d.claves);
      el.innerHTML = '<div class="vis">' + d.mock + '</div><div class="txt"><span class="tag idea">Propuesta</span><h3>' + d.nombre + '</h3><p class="gancho">' + d.gancho + '</p><div class="sub">' + d.sub + '</div><ul>' + d.items.map(function(i){return '<li>'+CHECK+i+'</li>';}).join('') + '</ul></div>';
      cont.appendChild(el);
    }
    var b = document.createElement('button');
    b.type = 'button'; b.textContent = d.nombre;
    b.addEventListener('click', function(){ q.value = d.nombre; filtrar(); });
    chips.appendChild(b);
  });

  function filtrar(){
    var t = norm(q.value), hay = 0;
    [feat].concat([].slice.call(cont.querySelectorAll('.design'))).forEach(function(el){
      var ok = !t || t.split(/\s+/).every(function(w){ return el.dataset.k.indexOf(w) > -1; });
      el.hidden = !ok; if (ok) hay++;
    });
    nomatch.classList.toggle('show', hay === 0);
    chips.querySelectorAll('button').forEach(function(b){ b.classList.toggle('on', norm(b.textContent) === t); });
  }
  if (q) {
  q.addEventListener('input', filtrar);
  var pre = new URLSearchParams(location.search).get('s');
  if (pre) { D.forEach(function(d){ if (d.id === pre) { q.value = d.nombre; } }); filtrar();
    setTimeout(function(){ var r=[feat].concat([].slice.call(cont.querySelectorAll('.design'))).filter(function(el){ return !el.hidden; })[0];
      if (r && r.getBoundingClientRect().top > innerHeight*.55) r.scrollIntoView({behavior:REDUCE?'auto':'smooth', block:'center'}); }, 650); }
  }
  }

   
  document.addEventListener('pointermove', function(e){
    var el = e.target.closest('.card,.item'); if(!el) return;
    var r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, {passive:true});

   
  var nav=document.getElementById('nav'), steps=document.getElementById('steps'), stepEls=steps?steps.querySelectorAll('.step'):[], railEl=document.getElementById('rail'), rail=railEl?railEl.querySelectorAll('a'):[];
  var secIds=[].map.call(rail,function(a){ return a.getAttribute('href').slice(1); }), tick=false;
  function onScroll(){
    nav.classList.toggle('scrolled', window.scrollY > 24);
    lapTick();
    if (steps) { var r=steps.getBoundingClientRect(), p=Math.min(1,Math.max(0,(innerHeight*.78 - r.top)/(innerHeight*.5)));
    steps.style.setProperty('--p', p.toFixed(3));
    stepEls.forEach(function(s,i){ s.classList.toggle('lit', p >= (i+.5)/5); }); }
    var cur=0; secIds.forEach(function(id,i){ var el=document.getElementById(id); if(el && el.getBoundingClientRect().top <= innerHeight*.45) cur=i; });
    rail.forEach(function(a,i){ a.classList.toggle('on', i===cur); });
    tick=false;
  }
  window.addEventListener('scroll', function(){ if(!tick){ tick=true; requestAnimationFrame(onScroll); } }, {passive:true});
  window.addEventListener('resize', function(){ lapSize(); onScroll(); }); onScroll();

   
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){ entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }); }, {threshold:0.1, rootMargin:'0px 0px -4% 0px'});
    items.forEach(function(el){ io.observe(el); });
  } else { items.forEach(function(el){ el.classList.add('in'); }); }

   
   
  (function(){ var h=document.getElementById('h1'); if(!h) return; var t=h.textContent.trim(), k=t.indexOf('. ')+1, n=0;
    function pal(s){ return s.trim().split(/\s+/).map(function(x){ return '<span class="w" style="--i:'+(n++)+'">'+x+'</span>'; }).join(' '); }
    h.innerHTML = k>0 ? '<span class="l1">'+pal(t.slice(0,k))+'</span> <span class="l2">'+pal(t.slice(k))+'</span>' : pal(t);
    var l2=h.querySelector('.l2'); if(!l2) return; var ws=l2.querySelectorAll('.w');
     
    function pinta(){ var a=1e9, b=-1e9; ws.forEach(function(w){ a=Math.min(a,w.offsetLeft); b=Math.max(b,w.offsetLeft+w.offsetWidth); });
      ws.forEach(function(w){ w.style.setProperty('--bw',(b-a)+'px'); w.style.setProperty('--bx',(w.offsetLeft-a)+'px'); }); }
    pinta(); addEventListener('resize', pinta); if (document.fonts && document.fonts.ready) document.fonts.ready.then(pinta);
  })();

   
  (function(){ var dg=document.querySelector('.dotgrid'), cu=document.querySelector('.cursor'), px=0, py=0, pend=false;
    function pon(){ pend=false; if(dg){ dg.style.transform='translate3d('+(px-300)+'px,'+(py-300)+'px,0)'; dg.style.backgroundPosition=(300-px)+'px '+(300-py)+'px'; dg.classList.add('vivo'); }
      if(cu){ cu.style.transform='translate3d('+(px-180)+'px,'+(py-180)+'px,0)'; cu.classList.add('vivo'); } }
    document.addEventListener('pointermove', function(e){ px=e.clientX; py=e.clientY; if(!pend){ pend=true; requestAnimationFrame(pon); } }, {passive:true}); })();

   
  document.addEventListener('pointermove', function(e){
    var el=e.target.closest('.card'); if(!el) return;
    var r=el.getBoundingClientRect(), px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
    el.style.setProperty('--ry',(px*6).toFixed(2)+'deg'); el.style.setProperty('--rx',(-py*6).toFixed(2)+'deg');
  }, {passive:true});
  document.addEventListener('pointerout', function(e){ var el=e.target.closest&&e.target.closest('.card'); if(el && !el.contains(e.relatedTarget)){ el.style.setProperty('--rx','0deg'); el.style.setProperty('--ry','0deg'); } }, {passive:true});

   
  document.querySelectorAll('.btn').forEach(function(b){
    b.addEventListener('pointermove', function(e){ var r=b.getBoundingClientRect(); b.style.setProperty('--mx2',((e.clientX-r.left-r.width/2)*.18).toFixed(1)+'px'); b.style.setProperty('--my2',((e.clientY-r.top-r.height/2)*.28).toFixed(1)+'px'); });
    b.addEventListener('pointerleave', function(){ b.style.setProperty('--mx2','0px'); b.style.setProperty('--my2','0px'); });
    b.addEventListener('click', function(e){ var r=b.getBoundingClientRect(), s=document.createElement('span'); s.className='ripple'; var d=Math.max(r.width,r.height); s.style.width=s.style.height=d+'px'; s.style.left=(e.clientX-r.left-d/2)+'px'; s.style.top=(e.clientY-r.top-d/2)+'px'; b.appendChild(s); setTimeout(function(){ s.remove(); },700); });
  });

   
  (function(){
    var done=false, chat=document.getElementById('lapChat'); if(!chat) return;
    function fmt(n){ return n.toLocaleString('es-CO'); }
    function run(){
      done=true; chat.classList.add('go');
      document.querySelectorAll('[data-count]').forEach(function(el){
        var to=+el.dataset.count, pre=el.dataset.pre||'', t0=performance.now(), dur=1400;
        (function f(now){ var p=Math.min(1,(now-t0)/dur), v=Math.round(to*(1-Math.pow(1-p,3))); el.innerHTML=pre+fmt(v); if(p<1) requestAnimationFrame(f); })(t0);
      });
    }
    var _lapTick=lapTick; lapTick=function(){ _lapTick(); if(!done && parseFloat(getComputedStyle(lapSticky).getPropertyValue('--open'))>.85) run(); };
    if(REDUCE) run();
  })();

   
  (function(){
    var b=document.getElementById('menuBtn'), n=document.getElementById('nav'); if(!b) return;
    b.addEventListener('click', function(){ var o=n.classList.toggle('open'); b.setAttribute('aria-expanded', o); b.setAttribute('aria-label', o?'Cerrar menú':'Abrir menú'); });
    document.querySelectorAll('#menu a').forEach(function(a){ a.addEventListener('click', function(){ n.classList.remove('open'); b.setAttribute('aria-expanded', false); }); });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape' && n.classList.contains('open')){ n.classList.remove('open'); b.setAttribute('aria-expanded', false); b.focus(); } });
  })();

   
  (function(){
    var hero=document.querySelector('body[data-page="inicio"] .hero'); if(!hero || REDUCE) return;
    ['cinta-az','cinta-am'].forEach(function(id){
      var g=document.getElementById(id); if(!g) return;
      g.querySelectorAll('path').forEach(function(p,i){ p.setAttribute('pathLength','1'); p.style.animationDelay=(i*0.035)+'s'; });
    });
    hero.classList.add('dibuja');
  })();

   
  (function(){
    var cel=document.getElementById('cel'); if(!cel || typeof lapTick!=='function') return;
    var _lt=lapTick; lapTick=function(){ _lt(); var o=parseFloat(lapSticky.style.getPropertyValue('--open'))||0; if(o>.8) cel.classList.add('go'); };
    lapTick();
  })();

   
  (function(){
    var artes=document.querySelectorAll('.arte[data-arte]'); if(!artes.length) return;
    var AZ='74,147,214', AZC='156,201,242', ORO='242,184,75', BL='245,246,248';
    function c(rgb,a){ return 'rgba('+rgb+','+a+')'; }
    function poly(x,pts,fill,stroke,lw){ x.beginPath(); x.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) x.lineTo(pts[i][0],pts[i][1]); x.closePath(); if(fill){ x.fillStyle=fill; x.fill(); } if(stroke){ x.strokeStyle=stroke; x.lineWidth=lw||1; x.stroke(); } }
    function linea(x,a,b,col,lw){ x.beginPath(); x.moveTo(a[0],a[1]); x.lineTo(b[0],b[1]); x.strokeStyle=col; x.lineWidth=lw||1; x.stroke(); }
    function punto(x,p,r,col,glow){ x.save(); if(glow){ x.shadowColor=col; x.shadowBlur=glow; } x.beginPath(); x.arc(p[0],p[1],r,0,6.283); x.fillStyle=col; x.fill(); x.restore(); }
    function texto(x,p,s,col,tam){ x.font='700 '+(tam||12)+'px Inter,system-ui,sans-serif'; x.textAlign='center'; x.textBaseline='middle'; x.fillStyle=col; x.fillText(s,p[0],p[1]); }
    function cerca(o,p){ var dx=o.px-p[0], dy=o.py-p[1]; return Math.sqrt(dx*dx+dy*dy); }
     
    function caja(x,P,bx,bz,a,b,y0,h,col,borde){
      var V=[], i; for(i=0;i<8;i++) V.push(P(bx+(i&1?a:-a), y0+(i&2?h:0), bz+(i&4?b:-b)));
      var F=[[2,3,7,6,col.top],[0,2,6,4,col.l],[1,3,7,5,col.r],[0,1,3,2,col.r],[4,5,7,6,col.l]];
      F.forEach(function(f){ f.z=(V[f[0]][2]+V[f[1]][2]+V[f[2]][2]+V[f[3]][2])/4; });
      F.sort(function(p,q){ return q.z-p.z; });
      F.forEach(function(f){ poly(x,[V[f[0]],V[f[1]],V[f[2]],V[f[3]]],f[4],borde,1); });
      return P(bx,y0+h,bz);
    }
    var AZUL={top:'#2C6296',l:'#163A5C',r:'#0E2741'}, AZUL2={top:'#4A93D6',l:'#1F4E79',r:'#163A5C'}, OROC={top:'#E9B850',l:'#9A6E1F',r:'#6E4E14'}, ORO2={top:'#FFD27A',l:'#B8862B',r:'#86601A'};

     
    var DESTINO={
      servicios:function(st){ return document.getElementById('fam-'+'abcde'.charAt(st.hl||0)); },
      como:function(st){ return document.querySelectorAll('#steps .step')[st.near||0]; },
      sectores:function(){ return document.querySelector('.finder'); },
      nosotros:function(){ return document.querySelector('.founder'); }
    };
    var ESCENAS={
       
      servicios:{pick:function(s,px,py,W,H){ return Math.max(0,Math.min(4,Math.round((1-py/H)*6-1))); },yaw:-.62,pitch:.6,k:.215,kc:.19,F:9,oy:.03,
        init:function(){ return {lift:[0,0,0,0,0]}; },
        draw:function(x,P,o){
          var n=5, gap=.6+o.hov*.38, L='ABCDE', s=o.st;
          var sel=s.sel!=null?s.sel:-1;
          var hl=o.dentro ? Math.max(0,Math.min(n-1,Math.round((1-o.py/o.H)*(n+1)-1))) : (sel>=0?sel:Math.floor(o.t*.5)%n); s.hl=hl;
          var golpe=s.flash!=null && o.t-s.flash<.6 ? 1-(o.t-s.flash)/.6 : 0;
          for(var k=0;k<n;k++){
            s.lift[k]+=((k===hl?.22+golpe*.35:0)+(k===sel&&k!==hl?.12:0)-s.lift[k])*.18;
            var y=(k-2)*gap+s.lift[k], on=k===(sel>=0?sel:hl), hov=k===hl&&!on;
            var q=[P(-1.6,y,-1.1),P(1.6,y,-1.1),P(1.6,y,1.1),P(-1.6,y,1.1)];
            var g=x.createLinearGradient(q[0][0],q[0][1],q[2][0],q[2][1]);
            g.addColorStop(0,on?'rgba(46,92,140,.92)':'rgba(30,58,92,.88)'); g.addColorStop(1,'rgba(8,12,18,.94)');
            x.save(); if(on){ x.shadowColor=c(ORO,.55); x.shadowBlur=28; } poly(x,q,g,on?c(ORO,.95):(hov?c(AZC,.95):c(AZC,.42)),on||hov?1.6:1); x.restore();
            texto(x,P(-1.35,y,-.85),L[k],on?c(ORO,1):c(AZC,.75),11);
            var a=on?1:.7;
            if(k===0){ var n1=P(-.9,y,.2),n2=P(0,y,.2),n3=P(.9,y,.2); linea(x,n1,n2,c(AZC,.5*a),1.5); linea(x,n2,n3,c(AZC,.5*a),1.5);
              [n1,n2,n3].forEach(function(p,i){ punto(x,p,4,i===2?c(ORO,a):c(BL,a)); }); var f=(o.t*.5)%1; punto(x,P(-.9+f*1.8,y,.2),2.5,c(ORO,1),10); }
            if(k===1){ poly(x,[P(-1.05,y,-.55),P(.15,y,-.55),P(.15,y,-.1),P(-1.05,y,-.1)],c(AZ,.35*a),c(AZC,.5*a)); poly(x,[P(-.15,y,.15),P(1.05,y,.15),P(1.05,y,.6),P(-.15,y,.6)],c(ORO,.28*a),c(ORO,.6*a)); }
            if(k===2){ for(var b=0;b<6;b++){ var hb=.12+.32*(.5+.5*Math.sin(o.t*1.6+b*.9)); caja(x,P,-1+b*.4,.2,.12,.12,y,hb,b===5?OROC:AZUL2,c(AZC,.25)); } }
            if(k===3){ var A1=P(-.55,y,.45),A2=P(0,y,-.45),A3=P(.55,y,.45); linea(x,A1,A2,c(BL,.55*a),2); linea(x,A2,A3,c(BL,.55*a),2); punto(x,A1,4.5,c(BL,a)); punto(x,A3,4.5,c(BL,a)); punto(x,A2,5,c(ORO,1),on?14:6); }
            if(k===4){ var R=[]; for(var r=0;r<20;r++){ var an=r/20*6.283; R.push(P(Math.cos(an)*.55,y,Math.sin(an)*.55)); } poly(x,R,null,c(AZC,.55*a),1.4); var ch=[P(-.25,y,0),P(-.05,y,.2),P(.3,y,-.22)]; x.beginPath(); x.moveTo(ch[0][0],ch[0][1]); x.lineTo(ch[1][0],ch[1][1]); x.lineTo(ch[2][0],ch[2][1]); x.strokeStyle=c(ORO,a); x.lineWidth=2.4; x.stroke(); }
          }
           
          if(sel>=0 && !s.toco && !o.dentro){ var kk=(sel+1)%n, yy=(kk-2)*gap+s.lift[kk], e=(o.t%1.8)/1.8, RR=[]; for(var r2=0;r2<24;r2++){ var a2=r2/24*6.283; RR.push(P(Math.cos(a2)*(.15+e*.9),yy,Math.sin(a2)*(.15+e*.9)*.75)); } poly(x,RR,null,c(ORO,.85*(1-e)),2); }
           
          var y0=-2*gap+s.lift[0], y4=2*gap+s.lift[4], b0=P(1.6,y0,1.1), b4=P(1.6,y4,1.1); linea(x,b0,b4,c(ORO,.35),1);
          var u=(o.t*.4)%1; punto(x,P(1.6,y0+(y4-y0)*u,1.1),3,c(ORO,1),12);
        }},

       
      como:{pick:function(s,px,py){ var k=-1, m=120; (s.mid||[]).forEach(function(p,i){ var dx=px-p[0], dy=py-p[1], d=Math.sqrt(dx*dx+dy*dy); if(d<m){ m=d; k=i; } }); return k; },yaw:-.38,pitch:.5,k:.18,F:10,oy:.2,
        init:function(){ return {lift:[0,0,0,0,0]}; },
        draw:function(x,P,o){
          var s=o.st, i;
          for(i=-5;i<=5;i++){ var al=.09*(1-Math.abs(i)/6); linea(x,P(i*.5,0,-2.6),P(i*.5,0,2.6),c(AZC,al)); linea(x,P(-2.6,0,i*.5),P(2.6,0,i*.5),c(AZC,al)); }
          var B=[]; for(i=0;i<5;i++) B.push({i:i,bx:(i-2)*1,bz:0,h:.4+i*.42,pay:i===2||i===4});
          var near=-1, mejor=110; s.mid=[]; B.forEach(function(b){ b.tp=P(b.bx,(b.h+s.lift[b.i])/2,b.bz); s.mid[b.i]=b.tp; if(o.dentro){ var d=cerca(o,b.tp); if(d<mejor){ mejor=d; near=b.i; } } });
          var auto=Math.floor(o.t*.7)%5; if(!o.dentro) near=s.sel!=null?s.sel:auto; s.near=near; var golpe=s.flash!=null && o.t-s.flash<.6 ? 1-(o.t-s.flash)/.6 : 0;
          B.forEach(function(b){ s.lift[b.i]+=((b.i===near?.32+golpe*.5:0)+(b.i===s.sel&&b.i!==near?.2:0)-s.lift[b.i])*.18; b.cz=P(b.bx,0,b.bz)[2]; });
          B.slice().sort(function(p,q){ return q.cz-p.cz; }).forEach(function(b){
            var on=b.i===near||b.i===s.sel, col=b.pay?(on?ORO2:OROC):(on?AZUL2:AZUL);
            x.save(); if(on){ x.shadowColor=b.pay?c(ORO,.7):c(AZ,.8); x.shadowBlur=26; }
            b.tp=caja(x,P,b.bx,b.bz,.34,.34,0,b.h+s.lift[b.i],col,on?c(BL,.5):c(AZC,.22)); x.restore();
          });
          var tops=B.map(function(b){ return P(b.bx,b.h+s.lift[b.i]+.02,b.bz); });
          x.setLineDash([4,5]); for(i=0;i<4;i++) linea(x,tops[i],tops[i+1],c(AZC,.4),1.2); x.setLineDash([]);
          var f=(o.t*.35)%1*4, k=Math.floor(f), u=f-k; punto(x,[tops[k][0]+(tops[k+1][0]-tops[k][0])*u, tops[k][1]+(tops[k+1][1]-tops[k][1])*u],3.2,c(ORO,1),14);
          if(s.sel!=null && !s.toco && !o.dentro){ var bb=B[(s.sel+1)%5], hh=bb.h+s.lift[bb.i]+.01, e=(o.t%1.8)/1.8, RR=[]; for(var r2=0;r2<24;r2++){ var a2=r2/24*6.283; RR.push(P(bb.bx+Math.cos(a2)*(.1+e*.55),hh,bb.bz+Math.sin(a2)*(.1+e*.55))); } poly(x,RR,null,c(ORO,.85*(1-e)),2); }
          B.forEach(function(b){ var p=P(b.bx,b.h+s.lift[b.i]+.42,b.bz); texto(x,p,'0'+(b.i+1),b.i===near?(b.pay?c(ORO,1):c(BL,1)):c(AZC,.7),b.i===near?14:12); });
        }},

       
      sectores:{init:function(){ return {}; },yaw:-.785,pitch:.6,k:.155,F:11,oy:.1,
        draw:function(x,P,o){
          var N=9, sp=.52, T=[], i, j;
          for(i=0;i<N;i++) for(j=0;j<N;j++){ var bx=(i-(N-1)/2)*sp, bz=(j-(N-1)/2)*sp, base=P(bx,0,bz);
            var h=.12+.46*(.5+.5*Math.sin(o.t*1.3-(i+j)*.55));
            if(o.dentro){ var d=cerca(o,base); h+=1.5*Math.exp(-(d*d)/(80*80)); }
            if(o.st.flash!=null && o.t-o.st.flash<1.4){ var e=o.t-o.st.flash, dx=base[0]-o.st.fx, dy=base[1]-o.st.fy, rr=Math.sqrt(dx*dx+dy*dy)-e*320; h+=1.1*(1-e/1.4)*Math.exp(-(rr*rr)/(45*45)); }
            T.push({bx:bx,bz:bz,h:h,z:base[2]}); }
          T.sort(function(p,q){ return q.z-p.z; });
          T.forEach(function(b){ var alto=b.h>1, medio=b.h>.55;
            caja(x,P,b.bx,b.bz,.2,.2,0,b.h,alto?OROC:(medio?AZUL2:AZUL),c(AZC,alto?.45:.16)); });
        }},

       
      nosotros:{yaw:0,pitch:.12,k:.225,F:8,oy:0,
        init:function(){ var p=[], n=120, g=Math.PI*(3-Math.sqrt(5)); for(var i=0;i<n;i++){ var y=1-(i/(n-1))*2, r=Math.sqrt(1-y*y), a=g*i; p.push([Math.cos(a)*r*1.75,y*1.75,Math.sin(a)*r*1.75]); }
          var par=[]; for(var a1=0;a1<n;a1++) for(var b1=a1+1;b1<n;b1++){ var dx=p[a1][0]-p[b1][0], dy=p[a1][1]-p[b1][1], dz=p[a1][2]-p[b1][2]; if(dx*dx+dy*dy+dz*dz<.42) par.push([a1,b1]); }
          return {p:p,par:par}; },
        draw:function(x,P,o){
          var s=o.st, rot=o.t*.12, cr=Math.cos(rot), sr=Math.sin(rot);
          var Q=s.p.map(function(v){ return P(v[0]*cr-v[2]*sr, v[1], v[0]*sr+v[2]*cr); });
          s.par.forEach(function(pr){ var a=Q[pr[0]], b=Q[pr[1]], dep=Math.max(.06,.55-((a[2]+b[2])/2+1.75)*.13); linea(x,a,b,c(AZC,dep),1); });
          var cima=P(0,.62,0), izq=P(-.55,-.45,0), der=P(.55,-.45,0);
          Q.forEach(function(q){ var dep=Math.max(.15,1-(q[2]+1.75)*.25), d=o.dentro?cerca(o,q):1e4, toca=d<95;
            if(toca){ linea(x,cima,q,c(ORO,.55*(1-d/95)),1.2); }
            punto(x,q,toca?3:1.2+dep*1.4,toca?c(ORO,1):c(BL,.25+dep*.6),toca?10:0); });
          linea(x,izq,cima,c(BL,.55),3); linea(x,cima,der,c(BL,.55),3);
          punto(x,izq,7,c(BL,1)); punto(x,der,7,c(BL,1));
          if(s.flash!=null && o.t-s.flash<1.2){ var e2=o.t-s.flash; Q.forEach(function(q){ linea(x,cima,q,c(ORO,.5*(1-e2/1.2)),1); }); x.beginPath(); x.arc(cima[0],cima[1],10+e2*260,0,6.283); x.strokeStyle=c(ORO,.7*(1-e2/1.2)); x.lineWidth=2; x.stroke(); }
          var pul=(o.t*.6)%1; x.beginPath(); x.arc(cima[0],cima[1],8+pul*16,0,6.283); x.strokeStyle=c(ORO,.6*(1-pul)); x.lineWidth=1.5; x.stroke();
          punto(x,cima,8,c(ORO,1),22);
        }}
    };

    artes.forEach(function(el){
      var E=ESCENAS[el.dataset.arte]; if(!E) return;
      var cv=el.querySelector('canvas'), x=cv.getContext('2d'), st=E.init?E.init():{};
      var W=1, H=1, yaw=E.yaw, pitch=E.pitch, tYaw=yaw, tPitch=pitch, px=-1e4, py=-1e4, dentro=false, ultimo=0, t=0, hov=0, visible=true, raf=0, cam={F:E.F||9,S:1};
      function size(){ var r=el.getBoundingClientRect(), d=Math.min(2,window.devicePixelRatio||1); W=Math.max(1,r.width); H=Math.max(1,r.height); cv.width=Math.round(W*d); cv.height=Math.round(H*d); x.setTransform(d,0,0,d,0,0); cam.S=Math.min(W,H)*(W<520 && E.kc ? E.kc : (E.k||.18)); }
      function P(X,Y,Z){ var cy=Math.cos(yaw), sy=Math.sin(yaw), cp=Math.cos(pitch), sp=Math.sin(pitch);
        var x1=X*cy-Z*sy, z1=X*sy+Z*cy, y2=Y*cp+z1*sp, z2=-Y*sp+z1*cp, k=cam.F/(cam.F+z2);
        return [W/2+x1*k*cam.S, H/2+(E.oy||0)*H-y2*k*cam.S, z2]; }
      function frame(){
        raf=0; t+=1/60;
        if(!dentro || performance.now()-ultimo>2500){ dentro=false; tYaw=E.yaw+Math.sin(t*.35)*.22; tPitch=E.pitch+Math.sin(t*.27)*.05; }
        yaw+=(tYaw-yaw)*.08; pitch+=(tPitch-pitch)*.08; hov+=((dentro?1:0)-hov)*.08;
        x.clearRect(0,0,W,H);
        E.draw(x,P,{t:t,W:W,H:H,px:px,py:py,dentro:dentro,hov:hov,st:st});
        if(!REDUCE && visible && !document.hidden) raf=requestAnimationFrame(frame);
      }
      function sigue(){ if(!REDUCE && !raf) raf=requestAnimationFrame(frame); }
      function mueve(e){ var r=el.getBoundingClientRect(); px=e.clientX-r.left; py=e.clientY-r.top;
        var mx=px/r.width*2-1, my=py/r.height*2-1;
        if(mx>-1.3 && mx<1.3 && my>-1.3 && my<1.3){ dentro=true; ultimo=performance.now(); tYaw=E.yaw+Math.max(-1,Math.min(1,mx))*.5; tPitch=E.pitch+Math.max(-1,Math.min(1,my))*.16; }
        else { dentro=false; px=py=-1e4; } }
      if(!REDUCE){ var zona=el.closest('section')||el; zona.addEventListener('pointermove',mueve,{passive:true}); zona.addEventListener('pointerdown',mueve,{passive:true}); zona.addEventListener('pointerleave',function(){ dentro=false; px=py=-1e4; }); }
      size();
      if('ResizeObserver' in window) new ResizeObserver(function(){ size(); if(REDUCE) frame(); }).observe(el); else addEventListener('resize',function(){ size(); if(REDUCE) frame(); });
      if('IntersectionObserver' in window) new IntersectionObserver(function(es){ visible=es[0].isIntersecting; if(visible) sigue(); }).observe(el);
      document.addEventListener('visibilitychange',sigue);
       
       
      el.elegir=function(i){ st.sel=i; st.flash=t; if(REDUCE) frame(); };
      el.addEventListener('click',function(e){
        if(el.dataset.modo==='elegir'){ mueve(e); if(REDUCE) frame(); var idx=E.pick?E.pick(st,px,py,W,H):-1; if(idx==null||idx<0) return;
          st.toco=true; st.sel=idx; st.flash=t; el.dispatchEvent(new CustomEvent('elige',{detail:idx})); if(REDUCE) frame(); return; }
        mueve(e); if(REDUCE) frame(); st.flash=t; st.fx=px; st.fy=py;
        var dest=DESTINO[el.dataset.arte] && DESTINO[el.dataset.arte](st); if(!dest) return;
        setTimeout(function(){
          dest.scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'center'});
          dest.classList.remove('destino'); void dest.offsetWidth; dest.classList.add('destino');
          setTimeout(function(){ dest.classList.remove('destino'); },2200);
          var q=dest.querySelector('input'); if(q) setTimeout(function(){ q.focus({preventScroll:true}); },REDUCE?0:600);
        },REDUCE?0:(el.dataset.arte==='nosotros'?700:420));
      });
      frame();
    });
  })();

   
  (function(){
    document.querySelectorAll('.escenario').forEach(function(es){
      var arte=es.querySelector('.arte'), serv=es.dataset.escena==='servicios';
      var items=[].slice.call(es.querySelectorAll(serv?'.bento .card':'.steps .step')); if(!items.length) return;
      var btns=items.map(function(it,i){
        var h=it.querySelector('h3'), b=document.createElement('button'); b.type='button'; b.className='abre';
        if(!it.id) it.id=(serv?'fam-':'paso-')+(i+1);
        b.setAttribute('aria-controls',it.id); b.innerHTML=(serv?'<span class="lt">'+'ABCDE'.charAt(i)+'</span>':'')+h.innerHTML; h.innerHTML=''; h.appendChild(b);
        it.addEventListener('click',function(){ if(!it.classList.contains('abierta')) elegir(i,true); });
        return b;
      });
      function elegir(i,desdeLista){
        items.forEach(function(it,k){ var on=k===i; it.classList.toggle('abierta',on); btns[k].setAttribute('aria-expanded',on); });
        if(arte && arte.elegir) arte.elegir(i);
        if(!desdeLista && window.matchMedia('(max-width:959px)').matches) items[i].scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'nearest'});
      }
      if(arte) arte.addEventListener('elige',function(e){ elegir(e.detail,false); });
      var h=location.hash.slice(1), ini=0; items.forEach(function(it,k){ if(it.id===h) ini=k; });
      es.classList.add('listo'); elegir(ini,true);
    });
  })();

   
  (function(){
    if(REDUCE) return;
    var CINTAS=[
      {id:'cinta-az', p:[-160,760, 60,800, 260,560, 380,330, 470,160, 580,40, 720,-60], dx:22, dy:8, chispa:'214,235,255',
       stops:[[0,'#9CC9F2'],[.55,'#3D86CF'],[1,'#1F4E79']], dir:[0,0,1,1], fl:function(t){ var f=(1-Math.cos(Math.PI*t/16))/2; return [-14+28*f,12*f]; }},
      {id:'cinta-am', p:[1660,700, 1440,760, 1250,560, 1140,340, 1060,180, 940,50, 790,-60], dx:-22, dy:8, chispa:'255,230,174',
       stops:[[0,'#FFE3A3'],[.5,'#F2A93B'],[1,'#A4560B']], dir:[1,0,0,1], fl:function(t){ var f=(1+Math.cos(Math.PI*t/20))/2; return [-14+28*f,12*f]; }}
    ];
    var AMP=[5,16,24,30,24,16,6], N=15, CHISPAS=[1,4,7,10,13];    
    var svg=null, cintas=[];
    CINTAS.forEach(function(C){
      var g=document.getElementById(C.id); if(!g) return;
      var ps=[].slice.call(g.querySelectorAll('path')); if(ps.length<3) return;    
      ps.slice(2).forEach(function(l){ l.parentNode.removeChild(l); });             
      svg=g.ownerSVGElement; cintas.push(C);
    });
    if(!cintas.length || !svg) return;
    var luz=svg.closest('.luz'); if(!luz) return;
    svg.classList.add('resplandor');
     
    var cv=document.createElement('canvas'); cv.className='rio'; cv.setAttribute('aria-hidden','true'); luz.parentNode.insertBefore(cv,luz.nextSibling);
    var interna=!!luz.closest('.page-first');
    var x=cv.getContext('2d'), W=0, H=0, dpr=1, esc=1, x0=0, y0=0, sw=0, sh=0;
     
    var hero=document.querySelector('.hero.dibuja'), te=0, prev=0;
    function medida(){
      var r=luz.getBoundingClientRect(), cs=getComputedStyle(svg); W=r.width; H=r.height;
      dpr=Math.min(window.devicePixelRatio||1, 1.5); cv.width=Math.max(1,Math.round(W*dpr)); cv.height=Math.max(1,Math.round(H*dpr));
      sw=parseFloat(cs.width); sh=parseFloat(cs.height); esc=Math.max(sw/1500, sh/1000);    
      x0=(W-sw)/2+(sw-1500*esc)/2; y0=parseFloat(cs.top)||0;
    }
    function bz(a,b,c,d,t){ var u=1-t; return u*u*u*a+3*u*u*t*b+3*u*t*t*c+t*t*t*d; }
    function puntos(C,i,t,fl){                                   
      var ab=1+0.16*Math.sin(t*0.55-i*0.22), ox=i*C.dx*ab+fl[0], oy=i*C.dy*ab+fl[1], P=C.p, q=[];
      for(var j=0;j<7;j++){ var f=t*0.9-i*0.3+j*0.85;
        q.push(x0+(P[j*2]+ox+AMP[j]*Math.sin(f))*esc, y0+(P[j*2+1]+oy+AMP[j]*0.45*Math.cos(f*0.8+i*0.1))*esc); }
      return q;
    }
    function medidaLinea(q){                                      
      var L=0, px=q[0], py=q[1], a=px, b=py, c=px, d=py;
      for(var s=0;s<2;s++) for(var k=1;k<=12;k++){ var t=k/12, o=s*6,
        X=bz(q[o],q[o+2],q[o+4],q[o+6],t), Y=bz(q[o+1],q[o+3],q[o+5],q[o+7],t);
        L+=Math.sqrt((X-px)*(X-px)+(Y-py)*(Y-py)); px=X; py=Y; if(X<a)a=X; if(X>c)c=X; if(Y<b)b=Y; if(Y>d)d=Y; }
      return {L:L, a:a, b:b, c:c, d:d};
    }
    function traza(q){ x.beginPath(); x.moveTo(q[0],q[1]); x.bezierCurveTo(q[2],q[3],q[4],q[5],q[6],q[7]); x.bezierCurveTo(q[8],q[9],q[10],q[11],q[12],q[13]); }
    function suave(t){ t=Math.min(1,Math.max(0,t)); return t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2; }
    function pinta(now){
      var t=now/1000; if(prev) te+=Math.min(now-prev,50)/1000; prev=now;
      x.setTransform(dpr,0,0,dpr,0,0); x.clearRect(0,0,W,H);
      x.save(); x.beginPath(); x.rect((W-sw)/2,y0,sw,sh); x.clip(); x.lineCap='round';
      cintas.forEach(function(C){
        var fl=C.fl(t);
        for(var i=0;i<N;i++){
          var q=puntos(C,i,t,fl), m=medidaLinea(q), w=m.c-m.a, h=m.d-m.b;
          var gr=x.createLinearGradient(m.a+C.dir[0]*w, m.b+C.dir[1]*h, m.a+C.dir[2]*w, m.b+C.dir[3]*h);
          C.stops.forEach(function(st){ gr.addColorStop(st[0],st[1]); });
          var e=hero ? suave((te-(i+2)*0.035)/1.8) : 1;
          if(e<=0) continue;
          x.setLineDash(e<1 ? [m.L*e, m.L+1] : []); x.lineDashOffset=0;
          x.globalAlpha=0.9-i*(0.82/N); x.strokeStyle=gr; x.lineWidth=(i===0?2.4:1.1)*esc; traza(q); x.stroke();
          var k=CHISPAS.indexOf(i);
          if(k>=0){ var dur=4.2+k*0.9, ph=(((t+k*1.3)/dur)%1+1)%1, ent=hero ? Math.min(1,Math.max(0,(te-1.6)/0.8)) : 1;
            if(ent>0){ x.setLineDash([m.L*0.045, m.L*0.955]); x.lineDashOffset=-ph*m.L; x.globalAlpha=0.85*ent;
              x.strokeStyle='rgb('+C.chispa+')'; x.lineWidth=2*esc; traza(q); x.stroke(); } }
        }
      });
      x.restore(); x.setLineDash([]); x.globalAlpha=1;
       
      x.globalCompositeOperation='destination-out'; x.save(); x.translate(W*.5,H*.4); x.scale(W*.46,H*.38);
      var rg=x.createRadialGradient(0,0,0,0,0,1); rg.addColorStop(0,'rgba(0,0,0,.62)'); rg.addColorStop(1,'rgba(0,0,0,0)'); x.fillStyle=rg; x.fillRect(-3,-3,6,6); x.restore();
      x.globalCompositeOperation='destination-in'; var lg=x.createLinearGradient(0,0,0,H);
      lg.addColorStop(interna?.15:.38,'#000'); lg.addColorStop(interna?.72:.96,'rgba(0,0,0,0)'); x.fillStyle=lg; x.fillRect(0,0,W,H);
      x.globalCompositeOperation='source-over';
    }
    var visible=true, raf=0, ult=0;
    function paso(now){
      raf=0; if(!visible || document.hidden) return;
      if(now-ult<32){ raf=requestAnimationFrame(paso); return; }    
      ult=now; pinta(now); raf=requestAnimationFrame(paso);
    }
    function arranca(){ if(!raf && visible && !document.hidden) raf=requestAnimationFrame(paso); }
    medida();
     
    function remide(){ medida(); pinta(performance.now()); }
    if('ResizeObserver' in window) new ResizeObserver(remide).observe(luz); else addEventListener('resize',remide);
    if('IntersectionObserver' in window) new IntersectionObserver(function(es){ visible=es[0].isIntersecting; arranca(); }).observe(luz);
    document.addEventListener('visibilitychange',arranca);
    arranca();
  })();

   
  (function(){
    var DPR=Math.min(window.devicePixelRatio||1,1.5);
    function prog(gl,vs,fs){
      function sh(t,s){ var h=gl.createShader(t); gl.shaderSource(h,s); gl.compileShader(h); if(!gl.getShaderParameter(h,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(h)); return h; }
      var p=gl.createProgram(); gl.attachShader(p,sh(gl.VERTEX_SHADER,vs)); gl.attachShader(p,sh(gl.FRAGMENT_SHADER,fs)); gl.linkProgram(p);
      if(!gl.getProgramParameter(p,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p)); return p;
    }
     
    function escena(cont, clase, vs, fs, datos, tam, zona){
      var cv=document.createElement('canvas'); cv.className='wow-gl '+clase; cv.setAttribute('aria-hidden','true');
      cont.insertBefore(cv,cont.firstChild);
      var gl=cv.getContext('webgl',{antialias:false,alpha:true,premultipliedAlpha:true,powerPreference:'low-power'});
      if(!gl){ cv.remove(); return; }
      var p; try{ p=prog(gl,vs,fs); }catch(e){ cv.remove(); return; }
      gl.useProgram(p);
      var b=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,b); gl.bufferData(gl.ARRAY_BUFFER,datos,gl.STATIC_DRAW);
      var a=gl.getAttribLocation(p,'a'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a,tam,gl.FLOAT,false,0,0);
      var U={}; ['t','m','asp','hov','dpr'].forEach(function(n){ U[n]=gl.getUniformLocation(p,n); });
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE,gl.ONE); gl.disable(gl.DEPTH_TEST); gl.clearColor(0,0,0,0);
      var n=datos.length/tam, W=1, H=1, mx=0, my=0, tx=0, ty=0, hov=0, th=0, vis=true, raf=0, ult=0, t0=performance.now();
      function medida(){ var r=cv.getBoundingClientRect(); W=Math.max(1,r.width); H=Math.max(1,r.height);
        cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR); gl.viewport(0,0,cv.width,cv.height); }
      function pinta(now){
        var t=(now-t0)/1000; mx+=(tx-mx)*.06; my+=(ty-my)*.06; hov+=(th-hov)*.05;
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(U.t,t); gl.uniform2f(U.m,mx,my); gl.uniform1f(U.asp,W/H); gl.uniform1f(U.hov,hov); gl.uniform1f(U.dpr,DPR);
        gl.drawArrays(gl.POINTS,0,n);
      }
      function paso(now){ raf=0; if(!vis || document.hidden) return;
        if(now-ult>=15){ ult=now; pinta(now); }           
        raf=requestAnimationFrame(paso); }
      function arranca(){ if(REDUCE){ pinta(t0+4000); return; } if(!raf && vis && !document.hidden) raf=requestAnimationFrame(paso); }
      medida();
      if('ResizeObserver' in window) new ResizeObserver(function(){ medida(); pinta(performance.now()); }).observe(cv); else addEventListener('resize',medida);
      if('IntersectionObserver' in window) new IntersectionObserver(function(es){ vis=es[0].isIntersecting; arranca(); }).observe(cv);
      document.addEventListener('visibilitychange',arranca);
      var z=zona||cont;
      if(!REDUCE){
        z.addEventListener('pointermove',function(e){ var r=cv.getBoundingClientRect(); tx=((e.clientX-r.left)/r.width)*2-1; ty=((e.clientY-r.top)/r.height)*2-1; th=1; },{passive:true});
        z.addEventListener('pointerleave',function(){ th=0; },{passive:true});
      }
      cv.addEventListener('webglcontextlost',function(e){ e.preventDefault(); cancelAnimationFrame(raf); raf=0; cv.style.display='none'; });
      arranca();
    }

     
    var hero=document.querySelector('body[data-page="inicio"] .hero');
    if(hero){
      var NX=230, NZ=110, d=new Float32Array(NX*NZ*2), k=0;
      for(var j=0;j<NZ;j++) for(var i=0;i<NX;i++){ d[k++]=i/(NX-1)*2-1; d[k++]=j/(NZ-1); }
      escena(hero,'wow-campo',[
        'attribute vec2 a; uniform float t; uniform vec2 m; uniform float asp; uniform float hov; uniform float dpr;',
        'varying float vA; varying float vX; varying float vC;',
        'void main(){',
        '  float x=a.x*7.0, z=1.15+a.y*a.y*15.0;',
        '  float y=0.22*sin(x*0.85+t*0.6+z*0.33)+0.15*sin(z*0.75-t*0.8+x*0.22)+0.07*sin((x-z)*1.6+t*1.25);',
        '  vec2 c=vec2(m.x*3.2, 1.6+(m.y*0.5+0.5)*2.2);',
        '  float dd=distance(vec2(x,z),c); y+=hov*0.55*exp(-dd*dd*0.22)*sin(dd*2.6-t*4.2);',
        '  vec2 p=vec2(x/z*1.55/asp, (y-1.2)/z*1.55+0.78);',
        '  gl_Position=vec4(p,0.0,1.0);',
        '  gl_PointSize=(1.1+3.6/z)*dpr;',
        '  float lejos=1.0-smoothstep(0.55,1.0,a.y), borde=smoothstep(-1.0,-0.55,p.y);',
        '  vC=smoothstep(0.18,0.46,y); vA=(0.18+0.55*smoothstep(-0.35,0.45,y))*lejos*borde*(0.45+0.55*smoothstep(0.0,0.12,a.y+0.02));',
        '  vX=x/z;',
        '}'].join('\n'),[
        'precision mediump float; varying float vA; varying float vX; varying float vC;',
        'void main(){ vec2 q=gl_PointCoord-0.5; float r=length(q); if(r>0.5) discard; float s=smoothstep(0.5,0.05,r);',
        '  vec3 az=vec3(0.29,0.58,0.84), oro=vec3(0.95,0.72,0.29);',
        '  vec3 col=mix(az,oro,smoothstep(-0.9,0.9,vX)); col=mix(col,vec3(1.0,0.96,0.88),vC*0.55);',
        '  float al=s*vA; gl_FragColor=vec4(col*al,al); }'].join('\n'), d, 2, hero);
    }

     
    var ct=document.querySelector('#contacto .contact');
    if(ct){
      var R=12, P=240, e=new Float32Array((R*P+450)*3), q=0;
      for(var r=0;r<R;r++) for(var s=0;s<P;s++){ e[q++]=r/(R-1); e[q++]=s/P*6.2831853; e[q++]=Math.random(); }
      for(var w=0;w<450;w++){ e[q++]=-1.0-Math.random(); e[q++]=Math.random()*6.2831853; e[q++]=Math.random(); }    
      escena(ct,'wow-portal',[
        'attribute vec3 a; uniform float t; uniform vec2 m; uniform float asp; uniform float hov; uniform float dpr;',
        'varying float vA; varying float vK; varying float vB;',
        'void main(){',
        '  float k=a.x, polvo=step(k,-0.5); float kk=max(k,0.0);',
        '  float rad=mix(1.15+kk*1.75, 1.0+(-k-1.0)*3.4, polvo);',
        '  float dir=mod(floor(kk*11.0+0.5),2.0)*2.0-1.0;',
        '  float ang=a.y+t*(0.05+0.035*kk)*dir*(1.0-polvo)+t*0.012*polvo;',
        '  vec3 p=vec3(cos(ang)*rad, sin(ang)*rad, (a.z-0.5)*0.08*(1.0+polvo*12.0)+0.1*sin(ang*3.0+t+kk*6.0));',
        '  float tx=1.05+m.y*0.22, ty=m.x*0.35;',
        '  p=vec3(p.x, p.y*cos(tx)-p.z*sin(tx), p.y*sin(tx)+p.z*cos(tx));',
        '  p=vec3(p.x*cos(ty)+p.z*sin(ty), p.y, -p.x*sin(ty)+p.z*cos(ty));',
        '  float zc=p.z+7.0; vec2 sp=vec2(p.x/zc*3.1/asp, p.y/zc*3.1-0.04);',
        '  gl_Position=vec4(sp,0.0,1.0);',
        '  float ola=fract(t*0.16)*1.25; float pul=exp(-pow((kk-ola)*7.0,2.0))*(1.0-polvo);',
        '  gl_PointSize=(1.0+2.4*(7.0/zc)+pul*2.5)*dpr*(1.0-polvo*0.4);',
        '  vK=kk; vB=pul+hov*0.25; vA=(0.22+0.5*(7.0/zc-0.7))*(1.0-polvo*0.55)*(0.55+0.45*sin(a.z*40.0+t*1.7)*0.5+0.5);',
        '}'].join('\n'),[
        'precision mediump float; varying float vA; varying float vK; varying float vB;',
        'void main(){ vec2 q=gl_PointCoord-0.5; float r=length(q); if(r>0.5) discard; float s=smoothstep(0.5,0.05,r);',
        '  vec3 oro=vec3(0.95,0.72,0.29), az=vec3(0.29,0.58,0.84);',
        '  vec3 col=mix(oro,az,smoothstep(0.1,0.7,vK)); col=mix(col,vec3(1.0,0.95,0.85),clamp(vB,0.0,1.0)*0.7);',
        '  float al=s*clamp(vA*(1.0+vB*1.6),0.0,1.0)*0.85; gl_FragColor=vec4(col*al,al); }'].join('\n'), e, 3, document.getElementById('contacto'));
    }

     
    function globo(franja){
      if(!franja) return;
      var NG=5200, NA=18, TR=44, g=new Float32Array((NG+NA*TR)*4), o=0, ga=Math.PI*(3-Math.sqrt(5));
      for(var i2=0;i2<NG;i2++){ var yy=1-(i2/(NG-1))*2; g[o++]=Math.atan2(Math.sin(i2*ga),Math.cos(i2*ga)); g[o++]=Math.asin(yy); g[o++]=Math.random(); g[o++]=0; }
      for(var a2=0;a2<NA;a2++) for(var t2=0;t2<TR;t2++){ g[o++]=a2+1; g[o++]=t2/TR; g[o++]=0; g[o++]=1; }
      escena(franja,'wow-globo',[
        'attribute vec4 a; uniform float t; uniform vec2 m; uniform float asp; uniform float hov; uniform float dpr;',
        'varying float vA; varying float vT;',
        'float h(float n){ return fract(sin(n)*43758.5453); }',
        'vec3 esf(float lo,float la){ return vec3(cos(la)*cos(lo), sin(la), cos(la)*sin(lo)); }',
        'void main(){',
        '  float giro=t*0.06+m.x*0.5, incl=0.42+m.y*0.12; vec3 p; float al;',
        '  if(a.w<0.5){ p=esf(a.x+giro,a.y); al=0.55+0.45*sin(a.z*30.0+t*1.3); vT=0.0; }',
        '  else { float ai=a.x; vec3 A=esf(h(ai*1.7)*6.2832+giro, (h(ai*2.3)-0.2)*1.3);',
        '    vec3 B=esf(h(ai*1.7)*6.2832+giro+(h(ai*3.1)-0.5)*2.6+0.6, (h(ai*4.7)-0.2)*1.3);',
        '    float f=fract(t*(0.09+0.07*h(ai*5.3))+h(ai*6.1))-a.y*0.32;',
        '    float ok=step(0.0,f)*step(f,1.0); f=clamp(f,0.0,1.0);',
        '    p=normalize(mix(A,B,f))*(1.0+0.22*sin(3.14159*f)); al=ok*pow(1.0-a.y,1.5)*1.8; vT=1.0; }',
        '  p=vec3(p.x, p.y*cos(incl)-p.z*sin(incl), p.y*sin(incl)+p.z*cos(incl));',
        '  float esc=min(4.6, 2.2*asp+0.6); float zc=3.4-p.z; vec2 sp=vec2(p.x/zc*esc/asp, p.y/zc*esc-1.0-esc*0.13);',
        '  gl_Position=vec4(sp,0.0,1.0);',
        '  float frente=smoothstep(-0.35,0.6,p.z);',
        '  gl_PointSize=(1.2+2.2*(3.4/zc)+vT*2.2*(1.0-a.y))*dpr;',
        '  vA=al*(0.10+0.9*frente)*(vT>0.5?1.0:1.05)*smoothstep(-1.0,-0.62,sp.y);',
        '}'].join('\n'),[
        'precision mediump float; varying float vA; varying float vT;',
        'void main(){ vec2 q=gl_PointCoord-0.5; float r=length(q); if(r>0.5) discard; float s=smoothstep(0.5,0.05,r);',
        '  vec3 col=mix(vec3(0.29,0.58,0.84),vec3(0.98,0.78,0.36),vT); float al=s*clamp(vA,0.0,1.0)*0.9; gl_FragColor=vec4(col*al,al); }'].join('\n'), g, 4, franja);
    }
    globo(document.getElementById('sectores-franja'));
    globo(document.querySelector('body[data-page="sectores"] .page-first'));    

     
    var FS_PUNTO=['precision mediump float; varying float vA; varying vec3 vCol;',
      'void main(){ vec2 q=gl_PointCoord-0.5; float r=length(q); if(r>0.5) discard; float s=smoothstep(0.5,0.05,r);',
      '  float al=s*clamp(vA,0.0,1.0); gl_FragColor=vec4(vCol*al,al); }'].join('\n');
    var PROY='vec3 rx(vec3 p,float a){ return vec3(p.x,p.y*cos(a)-p.z*sin(a),p.y*sin(a)+p.z*cos(a)); }\n'+
             'vec3 ry(vec3 p,float a){ return vec3(p.x*cos(a)+p.z*sin(a),p.y,-p.x*sin(a)+p.z*cos(a)); }\n'+
             'float h(float n){ return fract(sin(n)*43758.5453); }\n'+
             'const vec3 AZ=vec3(0.29,0.58,0.84); const vec3 ORO=vec3(0.95,0.72,0.29); const vec3 BL=vec3(1.0,0.96,0.88);\n';
    var cab=document.querySelector('.page-first'), pagina=document.body.getAttribute('data-page');

     
    if(cab && pagina==='servicios'){
      var NL=5, RAIL=170, PK=34, TRL=9, sv=new Float32Array((NL*RAIL+NL*PK*TRL)*4), u=0;
      for(var l=0;l<NL;l++){ for(var r1=0;r1<RAIL;r1++){ sv[u++]=l; sv[u++]=r1/RAIL; sv[u++]=Math.random(); sv[u++]=0; }
        for(var k1=0;k1<PK;k1++) for(var t1=0;t1<TRL;t1++){ sv[u++]=l; sv[u++]=t1/TRL; sv[u++]=Math.random(); sv[u++]=1; } }
      escena(cab,'wow-cab',[
        'attribute vec4 a; uniform float t; uniform vec2 m; uniform float asp; uniform float hov; uniform float dpr;',
        'varying float vA; varying vec3 vCol;', PROY,
        'void main(){ float k=a.x, ly=(k-2.0)*0.7; vec3 p; float al;',
        '  if(a.w<0.5){ p=vec3((a.y*2.0-1.0)*8.0, ly, (a.z-0.5)*1.4); al=0.34; }',
        '  else { float sp=0.05+0.035*h(k*3.1+a.z*1.3); float x=fract(a.z*7.31+t*sp)*2.0-1.0;',
        '    p=vec3(x*8.0-a.y*0.2, ly, (h(a.z*9.7)-0.5)*1.2); al=(1.0-a.y)*1.6; }',
        '  p.y+=0.09*sin(p.x*0.7+t*0.9+k);',
        '  p=ry(rx(p,0.62+m.y*0.12),-0.42+m.x*0.3);',
        '  float zc=p.z+8.5; vec2 s=vec2(p.x/zc*3.4/asp, p.y/zc*3.4+0.05);',
        '  gl_Position=vec4(s,0.0,1.0);',
        '  gl_PointSize=(1.3+2.6*(8.5/zc)+a.w*2.2*(1.0-a.y))*dpr;',
        '  vCol=mix(mix(AZ,ORO,k/4.0),BL,a.w*(1.0-a.y)*0.45); vA=al*smoothstep(-1.05,-0.55,s.y)*(1.0-smoothstep(0.75,1.05,abs(s.x)));',
        '}'].join('\n'), FS_PUNTO, sv, 4, cab);
    }
     
    if(cab && pagina==='como'){
      var NP=1400, NF=40, TF=12, cv2=new Float32Array((NP+NF*TF+5*6)*4), w2=0;
      for(var i3=0;i3<NP;i3++){ cv2[w2++]=Math.random(); cv2[w2++]=Math.random(); cv2[w2++]=0; cv2[w2++]=0; }
      for(var f3=0;f3<NF;f3++) for(var t3=0;t3<TF;t3++){ cv2[w2++]=f3/NF; cv2[w2++]=t3/TF; cv2[w2++]=0; cv2[w2++]=1; }
      for(var n3=0;n3<5;n3++) for(var c3=0;c3<6;c3++){ cv2[w2++]=(n3+0.5)/5; cv2[w2++]=c3/6; cv2[w2++]=n3; cv2[w2++]=2; }
      escena(cab,'wow-cab',[
        'attribute vec4 a; uniform float t; uniform vec2 m; uniform float asp; uniform float hov; uniform float dpr;',
        'varying float vA; varying vec3 vCol;', PROY,
        'vec3 hel(float u){ float an=u*6.2832*2.3+t*0.12; return vec3(cos(an)*1.5, (u-0.5)*3.2, sin(an)*1.5); }',
        'void main(){ vec3 p; float al, sz; vec3 col;',
        '  if(a.w<0.5){ p=hel(a.x)+vec3(h(a.y*7.0)-0.5,h(a.y*3.0)-0.5,h(a.y*5.0)-0.5)*0.22; al=0.42; sz=1.3; col=mix(AZ,ORO,a.x*0.6); }',
        '  else if(a.w<1.5){ float u=fract(a.x+t*0.035)-a.y*0.012; p=hel(u); al=(1.0-a.y)*0.9*step(0.0,u); sz=1.6*(1.0-a.y); col=mix(BL,ORO,a.y); }',
        '  else { p=hel(a.x); float oro=step(1.5,a.z)*step(a.z,2.5)+step(3.5,a.z); float pul=0.5+0.5*sin(t*2.0-a.z*1.3);',
        '    float ang=a.y*6.2832+t*0.6; p+=vec3(cos(ang),sin(ang),0.0)*0.16*step(0.01,a.y);',
        '    al=mix(1.0,0.7,step(0.01,a.y))*(0.7+0.3*pul); sz=mix(14.0,2.6,step(0.01,a.y))*(0.85+0.3*pul); col=mix(AZ,ORO,oro); }',
        '  p=ry(rx(p,0.32+m.y*0.15),0.5+m.x*0.4);',
        '  float zc=p.z+7.5; float ancho=step(1.1,asp); vec2 s=vec2(p.x/zc*mix(3.0,4.4,ancho)/asp+0.12*ancho, p.y/zc*mix(3.0,3.0,ancho)+mix(-0.05,0.12,ancho));',
        '  gl_Position=vec4(s,0.0,1.0); gl_PointSize=(sz+1.6*(7.5/zc))*dpr;',
        '  vCol=col; vA=al*(0.6+0.4*smoothstep(-1.2,1.2,p.z))*smoothstep(-1.05,-0.6,s.y)*1.9;',
        '}'].join('\n'), FS_PUNTO, cv2, 4, cab);
    }
     
    if(cab && pagina==='nosotros'){
      var NR=34, PR=120, nv=new Float32Array((NR*PR+600)*4), w4=0;
      for(var r4=0;r4<NR;r4++) for(var s4=0;s4<PR;s4++){ nv[w4++]=r4/NR; nv[w4++]=s4/PR; nv[w4++]=Math.random(); nv[w4++]=0; }
      for(var d4=0;d4<600;d4++){ nv[w4++]=Math.random(); nv[w4++]=Math.random(); nv[w4++]=Math.random(); nv[w4++]=1; }
      escena(cab,'wow-cab',[
        'attribute vec4 a; uniform float t; uniform vec2 m; uniform float asp; uniform float hov; uniform float dpr;',
        'varying float vA; varying vec3 vCol;', PROY,
        'vec2 puerta(float u){ float an=u*6.2832; vec2 c=vec2(cos(an),sin(an)); vec2 q=sign(c)*pow(abs(c),vec2(0.35)); return vec2(q.x*0.62,q.y); }',
        'void main(){ float f=fract(a.x-t*0.045); float z=1.0+f*22.0; vec3 p; float al;',
        '  if(a.w<0.5){ vec2 d=puerta(a.y)*1.25; p=vec3(d.x,d.y,z); al=smoothstep(0.0,0.12,f)*(1.0-f*0.55)*1.1; }',
        '  else { float an=a.y*6.2832; float rr=0.25+a.z*1.8; float zz=1.0+fract(a.x-t*0.09)*22.0; p=vec3(cos(an)*rr*0.7,sin(an)*rr,zz); f=(zz-1.0)/22.0; al=(1.0-f*0.6)*0.7; }',
        '  p.xy+=vec2(m.x,-m.y)*0.25*(1.0-f);',
        '  vec2 s=vec2(p.x/p.z*1.6/asp, p.y/p.z*1.6+0.02);',
        '  gl_Position=vec4(s,0.0,1.0); gl_PointSize=(1.1+8.0/p.z)*dpr;',
        '  vCol=mix(AZ,mix(ORO,BL,0.35),smoothstep(0.35,1.0,f)); vA=al*smoothstep(-1.05,-0.6,s.y);',
        '}'].join('\n'), FS_PUNTO, nv, 4, cab);
    }

     
    var pie=document.querySelector('.pie-gigante');
    if(pie && !REDUCE){
      pie.addEventListener('pointermove',function(ev){ var r=pie.getBoundingClientRect();
        pie.style.setProperty('--fx',((ev.clientX-r.left)/r.width*100).toFixed(1)+'%'); pie.style.setProperty('--fy',((ev.clientY-r.top)/r.height*100).toFixed(1)+'%'); pie.classList.add('sigue'); },{passive:true});
      pie.addEventListener('pointerleave',function(){ pie.classList.remove('sigue'); },{passive:true});
    }

     
    (function(){
      if(REDUCE) return;
      var SEL='.card, .item, .feat, .founder, .steps-card';
      var tarjetas=[].slice.call(document.querySelectorAll(SEL)).filter(function(el){ return !el.parentNode.closest(SEL); });
      if(!tarjetas.length) return;
      var MOVIL=matchMedia('(max-width: 760px), (pointer: coarse)').matches;
      var DPRt=Math.min(window.devicePixelRatio||1, MOVIL?2:2), MARGEN=MOVIL?70:130;
      var PASO_BORDE=MOVIL?3.2:2.4, PASO_SUP=MOVIL?36:28, PASO_LETRA=MOVIL?2.2:1.7, MAX_LETRA=MOVIL?420:700, MAX_BORDE=MOVIL?520:900;
      var TAU=MOVIL?0.12:0.16;     
      var of=document.createElement('canvas'), ox=of.getContext('2d',{willReadFrequently:true});
       
      var ESTRELLA='rgb(219,232,255)', BLANCO='rgb(255,248,232)', TONOS=[];
      for(var k=0;k<6;k++){ var u=k/5; TONOS.push('rgb('+Math.round(92+(250-92)*u)+','+Math.round(163+(196-163)*u)+','+Math.round(235+(87-235)*u)+')'); }

      function rnd(){ return Math.random(); }
       
      function destinos(el, r){
        var w=r.width, h=r.height, cs=getComputedStyle(el), A=[];
        if(w<20 || h<20) return A;
        var rad=Math.min(parseFloat(cs.borderTopLeftRadius)||0, w/2, h/2);
        var arco=Math.PI*rad/2, largo=2*(w-2*rad)+2*(h-2*rad)+4*arco, np=Math.min(MAX_BORDE,Math.round(largo/PASO_BORDE));
        var tramos=[[w-2*rad,function(u){ return [rad+u,0]; }],[arco,function(u){ var an=-Math.PI/2+u/rad; return [w-rad+Math.cos(an)*rad, rad+Math.sin(an)*rad]; }],
                    [h-2*rad,function(u){ return [w,rad+u]; }],[arco,function(u){ var an=u/rad; return [w-rad+Math.cos(an)*rad, h-rad+Math.sin(an)*rad]; }],
                    [w-2*rad,function(u){ return [w-rad-u,h]; }],[arco,function(u){ var an=Math.PI/2+u/rad; return [rad+Math.cos(an)*rad, h-rad+Math.sin(an)*rad]; }],
                    [h-2*rad,function(u){ return [0,h-rad-u]; }],[arco,function(u){ var an=Math.PI+u/rad; return [rad+Math.cos(an)*rad, rad+Math.sin(an)*rad]; }]];
        for(var i=0;i<np;i++){ var u=i/np*largo, s=0; while(s<7 && u>tramos[s][0]){ u-=tramos[s][0]; s++; } var xy=tramos[s][1](Math.min(u,tramos[s][0]));
          A.push(xy[0],xy[1],i/np*0.3,0); }
        for(var yy=16;yy<h-10;yy+=PASO_SUP) for(var xx=16;xx<w-10;xx+=PASO_SUP) A.push(xx+(rnd()-.5)*14, yy+(rnd()-.5)*14, 0.18+rnd()*0.22, 1);
        var tit=el.querySelector('h3, h4, h2');
        if(tit){
          var ts=getComputedStyle(tit), tw=document.createTreeWalker(tit,NodeFilter.SHOW_TEXT), nodo, gl=[];
          ox.font=ts.fontWeight+' '+ts.fontSize+' '+ts.fontFamily;
          var mt=ox.measureText('Hg'), fa=mt.fontBoundingBoxAscent||parseFloat(ts.fontSize)*0.93, fd=mt.fontBoundingBoxDescent||parseFloat(ts.fontSize)*0.24;
          while((nodo=tw.nextNode())){ var txt=nodo.textContent, re=/\S+/g, mm;
            if(nodo.parentNode.closest('[aria-hidden="true"]')) continue;
            var ps=getComputedStyle(nodo.parentNode);
            while((mm=re.exec(txt))){ var rg=document.createRange(); rg.setStart(nodo,mm.index); rg.setEnd(nodo,mm.index+mm[0].length);
              var wr=rg.getBoundingClientRect(); if(!wr.width) continue;
              var cw=Math.ceil(wr.width)+4, ch=Math.ceil(wr.height)+4; of.width=cw; of.height=ch;
              ox.font=ps.fontWeight+' '+ts.fontSize+' '+ts.fontFamily; try{ ox.letterSpacing=ts.letterSpacing; }catch(_){}
              ox.clearRect(0,0,cw,ch); ox.fillStyle='#fff'; ox.textBaseline='alphabetic'; ox.fillText(mm[0],2,2+(wr.height-(fa+fd))/2+fa);
              var px=ox.getImageData(0,0,cw,ch).data;
              for(var gy=0;gy<ch;gy+=PASO_LETRA) for(var gx=0;gx<cw;gx+=PASO_LETRA){ if(px[(Math.floor(gy)*cw+Math.floor(gx))*4+3]>140) gl.push(wr.left-r.left-2+gx, wr.top-r.top-2+gy); } } }
          var ng=gl.length/2, salto=Math.max(1,ng/MAX_LETRA);
          for(var g=0;g<ng;g+=salto){ var gi=Math.floor(g)*2; A.push(gl[gi],gl[gi+1],0.26+0.2*Math.min(1,Math.max(0,gl[gi]/w)),2); }
        }
        return A;
      }

      var T=tarjetas.map(function(el){ return {el:el, docTop:0, docLeft:0, w:0, h:0, meta:0, ve:0, sola:false, visto:false, armando:null, ultOp:-1, cv:null, n:0, sucio:true}; });
       
      function mide(){
        var sy=scrollY, sx=scrollX;
        T.forEach(function(o){ var r=o.el.getBoundingClientRect(), ty=o.armando ? (parseFloat(o.el.style.getPropertyValue('--ty'))||0) : 0;
          var nt=r.top+sy-ty, nl=r.left+sx, nw=r.width, nh=r.height;
          if(Math.abs(nt-o.docTop)>0.5 || Math.abs(nl-o.docLeft)>0.5 || Math.abs(nw-o.w)>0.5 || Math.abs(nh-o.h)>0.5){ o.docTop=nt; o.docLeft=nl; o.w=nw; o.h=nh; o.sucio=true; } });
        T.forEach(function(o){ o.fila=0; T.forEach(function(q){ if(q!==o && q.el.parentNode===o.el.parentNode && Math.abs(q.docTop-o.docTop)<8 && q.docLeft<o.docLeft-8) o.fila++; }); });
        altoPag=document.documentElement.scrollHeight; medido=true;
      }
      var altoPag=0, medido=false;

       
      function prepara(o){ var _t=performance.now(); prepara2(o); window.__jlaPrep=(window.__jlaPrep||0)+(performance.now()-_t); window.__jlaPrepN=(window.__jlaPrepN||0)+1; }
      function prepara2(o){
        var r=o.el.getBoundingClientRect(), P=destinos(o.el, r), n=P.length/4;
         
        var anchoPag=document.documentElement.clientWidth, x0=Math.max(0,o.docLeft-MARGEN), x1=Math.min(anchoPag,o.docLeft+o.w+MARGEN),
            y0=Math.max(0,o.docTop-MARGEN), y1=Math.min(Math.max(altoPag,o.docTop+o.h),o.docTop+o.h+MARGEN), W=Math.max(1,x1-x0), H=Math.max(1,y1-y0),
            ox0=o.docLeft-x0, oy0=o.docTop-y0;
        if(!o.cv){ o.cv=document.createElement('canvas'); o.cv.className='wow-tarjeta'; o.cv.setAttribute('aria-hidden','true'); document.body.appendChild(o.cv); o.x=o.cv.getContext('2d'); }
        o.cv.width=Math.round(W*DPRt); o.cv.height=Math.round(H*DPRt);
        o.cv.style.width=W+'px'; o.cv.style.height=H+'px'; o.cv.style.left=x0+'px'; o.cv.style.top=y0+'px';
         
        var idx=[]; for(var i=0;i<n;i++) idx.push(i);
        var tono=function(i){ return P[i*4+3]===2 ? 6 : Math.min(5,Math.max(0,Math.floor(P[i*4]/Math.max(1,o.w)*6))); };
        idx.sort(function(a,b){ return tono(a)-tono(b); });
        o.D=new Float32Array(n*8); o.n=n;
        idx.forEach(function(i,j){ var b=j*8, a=rnd()*Math.PI*2, d=(0.35+rnd()*0.65);
          o.D[b]=P[i*4]+ox0; o.D[b+1]=P[i*4+1]+oy0;
           
          o.D[b+2]=W/2+Math.cos(a)*W*0.5*d; o.D[b+3]=H/2+Math.sin(a)*H*0.5*d;
          o.D[b+4]=P[i*4+2]; o.D[b+5]=rnd(); o.D[b+6]=P[i*4+3]; o.D[b+7]=tono(i); });
        o.sucio=false;
      }
      function dibuja(o, t){
        var x=o.x, pa=o.ve, D=o.D, n=o.n, W=o.cv.width/DPRt, H=o.cv.height/DPRt;
        x.setTransform(DPRt,0,0,DPRt,0,0); x.clearRect(0,0,W,H);
        var desv=1-Math.min(1,Math.max(0,(pa-0.86)/0.14)), tonoAct=-1;
        for(var j=0;j<n;j++){
          var b=j*8, r=D[b+4], az=D[b+5], k=D[b+6];
          var nace=Math.min(1,Math.max(0,(pa-(r-0.16))/0.16)); if(nace<=0) continue;
          var e=Math.min(1,Math.max(0,(pa-r)/0.42)), f=e*e*(3-2*e);
          var sx=D[b+2], sy=D[b+3], dx=D[b], dy=D[b+1], vx=dx-sx, vy=dy-sy, L=Math.sqrt(vx*vx+vy*vy)||1;
          var curva=Math.sin(f*Math.PI)*(az-0.5)*Math.min(260,L*0.45);
          var px=sx+vx*f-vy/L*curva + Math.sin(t*2.7+az*41)*1.2*f, py=sy+vy*f+vx/L*curva + Math.cos(t*2.1+az*29)*1.2*f;
          var llega=Math.exp(-Math.pow((e-0.96)*8,2)), brilla=0.55+0.45*Math.sin(t*3.3+az*57);
          var al=nace*(f<0.02 ? brilla*0.75 : (k===1 ? 0.38 : 0.95))*desv; if(al<0.02) continue;
          var tam=(1.0+az*1.6)*(1-f)+(k===2?2.1:(k===1?1.5:1.9))*f; tam*=1+llega*0.9;
          var tn=f<0.5 ? -1 : D[b+7];
          if(tn!==tonoAct){ tonoAct=tn; x.fillStyle = tn<0 ? ESTRELLA : (tn===6 ? BLANCO : TONOS[tn]); }
          x.globalAlpha=al; x.fillRect(px-tam/2, py-tam/2, tam, tam);
        }
        x.globalAlpha=1;
      }

      var t0=performance.now(), ultT=0;
       
      function metas(now){
        var vh=innerHeight, sy=scrollY, intro=Math.min(1,Math.max(0,(now-t0-500)/2600)), falta=Math.max(0,altoPag-vh-sy);
        T.forEach(function(o){
          var top=o.docTop-sy;
          if(!o.visto){ o.visto=true; o.sola=top<vh*0.98; }
          var ini=vh*0.98, fin=Math.min(Math.max(vh*0.94-o.h, vh*0.40), ini-vh*0.16);
          fin=Math.max(fin, top-falta+2);
          var m=(ini-top)/Math.max(vh*0.12, ini-fin)*(1+o.fila*0.12)-o.fila*0.12; m=Math.min(1,Math.max(0,m));
          var nueva=o.sola ? Math.max(m,intro) : m;
          o.meta=top>=vh ? nueva : Math.max(nueva,o.meta);       
          o.top=top; });
        return intro<1;
      }
      function aplica(o){
        var op=Math.min(1,Math.max(0,(o.ve-0.35)/0.55)); op=op*op*(3-2*op);
        var armando=o.ve<0.999;
        if(armando!==o.armando){ o.armando=armando; o.el.classList.toggle('armando',armando); if(!armando) o.el.classList.add('in'); }
        if(armando && Math.abs(op-o.ultOp)>0.004){ o.ultOp=op; o.el.style.setProperty('--op',op.toFixed(3)); o.el.style.setProperty('--ty',((1-op)*22).toFixed(1)+'px'); }
      }
      var raf=0, cuadro=0;
      function paso(now){
        raf=0; if(document.hidden) return;
        if(!medido || (++cuadro%40===0)) mide();
        var dt=ultT ? Math.min(0.1,(now-ultT)/1000) : 0.016; ultT=now;
        var sigue=metas(now), mueve=false, a=1-Math.exp(-dt/TAU), vh=innerHeight;
        T.forEach(function(o){
          var d=o.meta-o.ve; if(Math.abs(d)>0.0008){ o.ve+=d*a; mueve=true; } else o.ve=o.meta;
          aplica(o);
          var activa=o.ve>0.001 && o.ve<0.999 && o.top<vh+MARGEN && o.top+o.h>-MARGEN;
          if(activa){ if(o.sucio || !o.cv) prepara(o); if(o.cv.style.display!=='block') o.cv.style.display='block'; dibuja(o,(now-t0)/1000); mueve=true; }
          else if(o.cv && o.cv.style.display!=='none') o.cv.style.display='none';
        });
        if(mueve || sigue) raf=requestAnimationFrame(paso); else ultT=0;
      }
      function arranca(){ if(!raf && !document.hidden) raf=requestAnimationFrame(paso); }
      function remide(){ medido=false; arranca(); }
      addEventListener('scroll',arranca,{passive:true});
      addEventListener('resize',remide);
      addEventListener('load',remide);
      document.addEventListener('visibilitychange',function(){ ultT=0; arranca(); });
      if('ResizeObserver' in window){ var ro=new ResizeObserver(remide); ro.observe(document.body); T.forEach(function(o){ ro.observe(o.el); }); }
      if(document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ T.forEach(function(o){ o.sucio=true; }); remide(); });
      mide(); metas(performance.now()); T.forEach(function(o){ o.ve=0; aplica(o); });
      arranca();
    })();

     
    if(/[?&]medir\b/.test(location.search)) (function(){
      var F=[], u=performance.now(), scr=0, pag=(document.body.getAttribute('data-page')||'?');
       
      var cssx=new URLSearchParams(location.search).get('css'); if(cssx){ var st2=document.createElement('style'); st2.textContent=cssx; document.head.appendChild(st2); pag+='-css'+(new URLSearchParams(location.search).get('etq')||''); }
      var oc=new URLSearchParams(location.search).get('ocultar'); if(oc){ var st=document.createElement('style'); st.textContent=oc.split('|').join(',')+'{display:none!important}'; document.head.appendChild(st); pag+='-sin'+oc.replace(/[^a-z0-9]+/gi,'_'); }
      addEventListener('scroll',function(){ scr++; },{passive:true});
      var _ti=performance.now(); (12345).toLocaleString('es-CO'); var tIntl=Math.round(performance.now()-_ti); _ti=performance.now(); (678).toLocaleString('es-CO'); var tIntl2=Math.round(performance.now()-_ti);
      var largos=[]; (function f(t){ var d=t-u; F.push(d); if(d>100) largos.push(Math.round(d)+'@'+Math.round(scrollY)); u=t; requestAnimationFrame(f); })(u);
      setInterval(function(){ if(!F.length) return; var n=F.length, s=0, l=0, ml=0, mx=0; F.forEach(function(d){ s+=d; if(d>34) l++; if(d>50) ml++; if(d>mx) mx=d; });
        new Image().src='medida.gif?p='+pag+'&fps='+(1000*n/s).toFixed(1)+'&cuadros='+n+'&lentos34='+l+'&lentos50='+ml+'&max='+Math.round(mx)+'&scroll='+scr+'&y='+Math.round(scrollY)+'&intl='+tIntl+'/'+tIntl2+'&prep='+Math.round(window.__jlaPrep||0)+'x'+(window.__jlaPrepN||0)+'&largos='+largos.join(',')+'&t='+Math.round(performance.now()); largos=[];
        F=[]; scr=0; },2000);
       
      var ir=new URLSearchParams(location.search).get('ir'); if(ir) setTimeout(function(){ scrollTo({top:+ir,behavior:'instant'}); },2500);
       
      if(/[?&]auto\b/.test(location.search)) setTimeout(function(){
        var fin=document.documentElement.scrollHeight-innerHeight, v=900, dir=1, y=0, u=performance.now();
        new Image().src='medida.gif?p='+pag+'&fase=baja&fin='+fin;
        (function m(t){ var dt=Math.min(50,t-u)/1000; u=t; y+=dir*v*dt;
          if(y>=fin){ y=fin; if(dir>0){ dir=-1; new Image().src='medida.gif?p='+pag+'&fase=sube'; } }
          if(y<=0 && dir<0){ scrollTo({top:0,behavior:'instant'}); new Image().src='medida.gif?p='+pag+'&fase=fin'; return; }
          scrollTo({top:y,behavior:'instant'}); requestAnimationFrame(m); })(u);
      },3000);
    })();
  })();
