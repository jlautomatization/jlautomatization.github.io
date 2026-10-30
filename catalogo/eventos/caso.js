 
var CASO_SRC=(document.currentScript&&document.currentScript.src)||'';
(function(){
  'use strict';
  var REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id){ return document.getElementById(id); }
  function aVista(el, fn, opts){
    if(!el) return;
    if(!('IntersectionObserver' in window)){ fn(true); return; }
    new IntersectionObserver(function(es){ es.forEach(function(e){ fn(e.isIntersecting, e); }); }, opts||{threshold:.25}).observe(el);
  }
  function lienzo(cv){
    var DPR = Math.min(devicePixelRatio||1, 2), W=1, H=1, x=cv.getContext('2d');
    var o={ x:x, W:function(){ return W; }, H:function(){ return H; }, redibujar:null };
     
    function medir(){ var r=cv.getBoundingClientRect(), w=Math.max(1,Math.round(r.width)), h=Math.max(1,Math.round(r.height));
      if(w===W && h===H) return; W=w; H=h; cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR); x.setTransform(DPR,0,0,DPR,0,0); if(o.redibujar) o.redibujar(); }
    medir();
    if('ResizeObserver' in window) new ResizeObserver(medir).observe(cv); else addEventListener('resize', medir);
    return o;
  }
   
  var SUB=document.body.getAttribute('data-sub')||'', RAIZ=SUB?'../':'', MEDIA=RAIZ+'media/';
   
  var tope=document.querySelector('main > .hx-tope'); if(tope) document.body.insertBefore(tope,document.body.firstChild);
  var PAGINA_DE={escenas:'como-funciona/',ciego:'como-funciona/',cadena:'como-funciona/',panel:'dueno/',bot:'dueno/'};
  function irA(id,escena){ var d=$(id);
    if(d){ d.scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'start'}); return true; }
    if(PAGINA_DE[id]) location.href=RAIZ+PAGINA_DE[id]+(escena?'?escena='+escena:'')+'#'+id;
    return false; }
  function reproducir(v){ var p=v.play(); if(p&&p.catch) p.catch(function(){}); }

   
  (function(){
    var cv=$('bodegaCv'); if(!cv) return;
    var L=lienzo(cv), x=L.x, yaw=-.22, yawT=-.22, pit=.46, pitT=.46, t0=performance.now(), vis=true, raf=0, ult=0;
    var MAR=['#F5F1E8','#BDB7A9','#8C8679'], LIM=['#D6F54A','#94B800','#6A8500'], GR=['#3A4139','#1F251E','#151915'],
        CON=['#55663F','#34422C','#252F20'], CAB=['#E4E8DE','#9DA696','#6C7567'], RUE=['#2A2A2A','#111','#0A0A0A'];
    var EST=[], NIV=[0.08,0.78,1.48], CARGA=8;
    for(var n=0;n<3;n++) for(var c=0;c<4;c++) EST.push({x:-3.25+c*.5, y:NIV[n]+.04, lima:(n*4+c)%3===1});
    function P(px,py,pz,k,cx,cy){ var cs=Math.cos(yaw), sn=Math.sin(yaw), X=px*cs-pz*sn, Z=px*sn+pz*cs;
      var cp=Math.cos(pit), sp=Math.sin(pit), Y=py*cp-Z*sp, Z2=py*sp+Z*cp; return [cx+X*k, cy-Y*k, Z2]; }
    function poly(pts,fill,stroke,lw){ x.beginPath(); x.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) x.lineTo(pts[i][0],pts[i][1]); x.closePath(); if(fill){ x.fillStyle=fill; x.fill(); } if(stroke){ x.strokeStyle=stroke; x.lineWidth=lw||1; x.stroke(); } }
     
    function caja(pr,bx,bz,a,b,h,col,y0){ var V=[],i; for(i=0;i<8;i++) V.push(pr(bx+(i&1?a:-a), y0+(i&2?h:0), bz+(i&4?b:-b)));
      var F=[[2,3,7,6,col[0]],[0,2,6,4,col[1]],[1,3,7,5,col[2]],[0,1,3,2,col[2]],[4,5,7,6,col[1]]];
      F.forEach(function(q){ q.z=(V[q[0]][2]+V[q[1]][2]+V[q[2]][2]+V[q[3]][2])/4; }); F.sort(function(p,q){ return q.z-p.z; });
      F.forEach(function(q){ poly([V[q[0]],V[q[1]],V[q[2]],V[q[3]]], q[4], 'rgba(245,241,232,.08)', 1); }); return V; }
    function pinta(now){
      var W=L.W(), H=L.H(), t=Math.max(0,(now-t0)/1000); yaw+=(yawT-yaw)*.06; pit+=(pitT-pit)*.06;    
      x.clearRect(0,0,W,H);
       
      var esq=[[-3.7,0,-1.1],[4.1,0,-1.1],[4.1,0,1.1],[-3.7,0,1.1],[-3.5,2.2,-.5],[3,1.6,.7],[-2,2.2,.5]], mnx=1e9,mxx=-1e9,mny=1e9,mxy=-1e9;
      esq.forEach(function(q){ var v=P(q[0],q[1],q[2],1,0,0); mnx=Math.min(mnx,v[0]); mxx=Math.max(mxx,v[0]); mny=Math.min(mny,v[1]); mxy=Math.max(mxy,v[1]); });
      var k=Math.min(W*.96/(mxx-mnx), H*.9/(mxy-mny)), cx=W/2-k*(mnx+mxx)/2, cy=H/2-k*(mny+mxy)/2;
      function pr(a,b,c){ return P(a,b,c,k,cx,cy); }
       
      var porCaja=1.35, viaje=CARGA*porCaja, ciclo=viaje+3.2, tc=REDUCE?viaje*.62:t%ciclo, cargadas=Math.min(CARGA,Math.floor(tc/porCaja));
      var sale=tc>viaje ? (tc-viaje)/3.2 : 0, dx=sale<.5 ? Math.pow(sale/.5,2)*5.5 : Math.pow((1-sale)/.5,2)*5.5;
      if(sale>0 && sale>=.5) cargadas=0;    
       
      poly([pr(-3.7,0,-1.1),pr(4.1,0,-1.1),pr(4.1,0,1.1),pr(-3.7,0,1.1)],'rgba(185,226,0,.035)','rgba(245,241,232,.14)',1);
      for(var g=-3;g<=4;g++){ var a1=pr(g,0,-1.1), a2=pr(g,0,1.1); x.beginPath(); x.moveTo(a1[0],a1[1]); x.lineTo(a2[0],a2[1]); x.strokeStyle='rgba(245,241,232,.05)'; x.lineWidth=1; x.stroke(); }
      var c1=pr(-1.4,0,.1), c2=pr(.9,0,.1); x.setLineDash([6,8]); x.beginPath(); x.moveTo(c1[0],c1[1]); x.lineTo(c2[0],c2[1]); x.strokeStyle='rgba(185,226,0,.4)'; x.lineWidth=1.2; x.stroke(); x.setLineDash([]);
       
      var L2=[];
      function add(bx,by,bz,a,b,h,col){ var cz=P(bx,by+h/2,bz,1,0,0)[2]; L2.push({z:cz,f:function(){ return caja(pr,bx,bz,a,b,h,col,by); }}); }
       
      [-3.55,-1.45].forEach(function(px){ [-.45,.45].forEach(function(pz){ add(px,0,pz,.05,.05,2.15,GR); }); });
      NIV.forEach(function(y){ add(-2.5,y,0,1.1,.5,.06,GR); });
      var quedan=EST.length-cargadas;
      EST.forEach(function(e,i){ if(i>=quedan) return; add(e.x,e.y+.06,0,.2,.3,.42,e.lima?LIM:MAR); });
       
      var tx=1+dx, temb=REDUCE?0:(sale>0?Math.sin(t*40)*.01:0);
       
      L2.push({z:P(tx+1.1,.9,0,1,0,0)[2], f:function(){
        [[tx+.45,.5],[tx+1.75,.5],[tx+2.55,.48],[tx+.45,-.5],[tx+1.75,-.5],[tx+2.55,-.48]].forEach(function(r){ caja(pr,r[0],r[1],.16,.07,.27,RUE,0); });
        caja(pr,tx+1.1,0,1.1,.62,1.25,CON,.28+temb); caja(pr,tx+2.55,0,.35,.58,.85,CAB,.28+temb); }});
       
      var enViaje=null;
      if(!sale && cargadas<CARGA){ var u=(tc%porCaja)/porCaja, e=EST[EST.length-1-cargadas], ee=Math.min(1,u/.85), s=ee*ee*(3-2*ee);
        var px=e.x+(tx+.05-e.x)*s, py=e.y+.06+(.45-e.y)*s+Math.sin(Math.PI*s)*.55; enViaje={u:u,e:e};
        add(px,py,(1-s)*0+.0,.2,.3,.42,e.lima?LIM:MAR); }
      L2.sort(function(p,q){ return q.z-p.z; }).forEach(function(o){ o.f(); });
       
      for(var m=0;m<CARGA;m++){ var mx0=tx+.25+m*.24, q1=pr(mx0,1.05+temb,.63), q2=pr(mx0+.14,1.05+temb,.63), q3=pr(mx0+.14,1.2+temb,.63), q4=pr(mx0,1.2+temb,.63);
        poly([q1,q2,q3,q4], m<cargadas?'rgba(185,226,0,.9)':'rgba(245,241,232,.08)', m<cargadas?'rgba(214,245,74,1)':'rgba(245,241,232,.18)',1); }
       
      if(enViaje && enViaje.u>.78){ var pu=(enViaje.u-.78)/.22, d=pr(tx,.75,0);
        x.beginPath(); x.arc(d[0],d[1],6+pu*k*.55,0,6.283); x.strokeStyle='rgba(185,226,0,'+(1-pu)*.9+')'; x.lineWidth=2; x.stroke(); }
      var dp=pr(tx,.75,0), gl=x.createRadialGradient(dp[0],dp[1],0,dp[0],dp[1],k*.35); gl.addColorStop(0,'rgba(185,226,0,.35)'); gl.addColorStop(1,'rgba(185,226,0,0)');
      x.fillStyle=gl; x.beginPath(); x.arc(dp[0],dp[1],k*.35,0,6.283); x.fill();
    }
    L.redibujar=function(){ pinta(performance.now()); };
     
    function paso(now){ raf=0; if(!vis||document.hidden) return; pinta(now); raf=requestAnimationFrame(paso); }
    function arranca(){ if(REDUCE){ pinta(t0+2000); return; } if(!raf&&vis&&!document.hidden) raf=requestAnimationFrame(paso); }
    aVista(cv,function(v){ vis=v; arranca(); },{threshold:0});
    document.addEventListener('visibilitychange',arranca);
    var zona=cv.parentNode;
    zona.addEventListener('pointermove',function(e){ var r=cv.getBoundingClientRect(); yawT=-.22+((e.clientX-r.left)/r.width-.5)*1.3; pitT=.46+((e.clientY-r.top)/r.height-.5)*.4; if(REDUCE) pinta(performance.now()); },{passive:true});
    zona.addEventListener('pointerleave',function(){ yawT=-.22; pitT=.46; });
    zona.addEventListener('click',function(){ irA('escenas'); });
    arranca();
  })();

   
  var MEM={}, PIDIENDO={};
  function video(nombre){
    if(MEM[nombre]) return Promise.resolve(MEM[nombre]);
    if(PIDIENDO[nombre]) return PIDIENDO[nombre];
    if(!window.fetch||!window.URL||!URL.createObjectURL) return Promise.resolve(MEDIA+nombre);
    PIDIENDO[nombre]=fetch(MEDIA+nombre).then(function(r){ if(!r.ok) throw 0; return r.blob(); })
      .then(function(b){ MEM[nombre]=URL.createObjectURL(b); return MEM[nombre]; })
      .catch(function(){ delete PIDIENDO[nombre]; return MEDIA+nombre; });
    return PIDIENDO[nombre];
  }
  function precargar(lista){ lista.reduce(function(p,n){ return p.then(function(){ return video(n); }); }, Promise.resolve()); }
  function aMemoria(v,nombre){ video(nombre).then(function(u){ if(v.src.indexOf('blob:')<0){ var t=v.currentTime, play=!v.paused; v.src=u; try{ v.currentTime=t; }catch(e){} if(play) reproducir(v); } }); }

   
  (function(){
    var v=document.querySelector('.cs-lapvid'), vc=document.querySelector('#cel video'); if(!v) return;
     
    var pedidas=false; aVista($('lap')||v,function(si){ if(si&&!pedidas){ pedidas=true; aMemoria(v,'portatil.mp4'); if(vc) aMemoria(vc,'escena-3.mp4'); } },{threshold:0});
    var scr=document.querySelector('#lap .scr'), cel=$('cel');
    if(scr){ scr.style.cursor='pointer'; scr.addEventListener('click',function(){ irA('panel'); }); }
    if(cel){ cel.style.cursor='pointer'; cel.addEventListener('click',function(){ irA('ciego'); }); }
    aVista(v,function(si){ if(si && !REDUCE){ reproducir(v); if(vc) reproducir(vc); } else { v.pause(); if(vc) vc.pause(); } },{threshold:.15});
  })();

   
  (function(){
    var vid=$('escVid'), lista=$('escLista'), marco=$('escMarco'); if(!vid||!lista) return;
    var ESC=[
      {t:'Entrar con su PIN', s:'El operario abre su día', f:'cel',
       c:[[0,'El operario entra con su PIN de 4 dígitos'],[3,'«Hoy»: lo que toca hacer, evento por evento'],[5.5,'Cada evento muestra en qué va: salida, llegada o regreso']]},
      {t:'Salida de bodega', s:'«Cargar 90» y equipos con QR', f:'cel',
       c:[[0,'Salida de bodega: el operario abre el evento del día'],[2,'Un toque en «Cargar 90» y queda contado lo que pidió el evento'],[5,'Los equipos con código se leen con la cámara, QR por QR'],[9,'Revisa el resumen antes de cerrar: 92 unidades'],[12.5,'Al cerrar queda guardado. No se puede cambiar: solo anular, con el motivo']]},
      {t:'Llegada al evento', s:'Sin ver cuánto salió: faltan 2 Vallas', f:'cel',
       c:[[0,'En el evento, quien recibe confirma la llegada'],[1.2,'Cuenta lo que llegó sin ver cuánto salió'],[3.5,'Escribe lo que contó: 88 Vallas'],[6,'Revisa y cierra el registro'],[8,'El sistema compara: faltan 2 Vallas. Y se le avisa al dueño en ese momento']]},
      {t:'Regreso a bodega', s:'Otra vez sin ver, con QR', f:'cel',
       c:[[0,'De vuelta en la bodega: registrar el regreso'],[1.5,'Otra vez sin ver cuánto salió: cuenta lo que volvió'],[5.2,'Los equipos con código se leen uno por uno'],[10.5,'Se cierra y queda guardado. Lo que no volvió queda pendiente, a nombre del evento']]},
      {t:'Panel del dueño, en el celular', s:'Se abre en la misma app, con su PIN', f:'cel',
       c:[[0,'El dueño abre su panel en la misma app'],[3,'Entra con su propio PIN'],[5,'Inicio: cuánto material está afuera ahora y qué requiere atención'],[8,'El sistema mismo señala lo que lleva más de 7 días afuera'],[10,'Lo que sale y lo que vuelve, en los últimos 30 días'],[14,'Eventos: cuál tiene material afuera y desde hace cuántos días'],[16,'Cada evento con su recorrido: salió, llegó, volvió. Cada paso queda guardado'],[23,'Inventario: cuánto hay en bodega y cuánto afuera, por categoría'],[28,'Gráficas: movimientos por día y lo que queda pendiente por evento']]},
      {t:'Panel del dueño, en el computador', s:'Eventos, inventario y gráficas', f:'pc',
       c:[[0,'El mismo panel, en el computador de la oficina'],[3,'Inicio: material afuera, eventos del mes y lo que requiere atención'],[6,'Avisos que el sistema arma solo: lo que lleva días afuera y lo que falta para los próximos eventos'],[12,'Eventos con material afuera, del más viejo al más nuevo'],[14,'El recorrido de un evento: 90 salieron, 88 volvieron, 2 afuera'],[21,'Inventario por categoría: en bodega, afuera y en mantenimiento'],[26,'Gráficas de los últimos 30 días']]}
    ];
    var cur=0, visto=false, sub=$('escSub'), prog=$('escProg'), tit=$('escTit'), bPlay=$('escPlay');
    ESC.forEach(function(e,i){ var li=document.createElement('li'); li.innerHTML='<button type="button"><span class="n">'+(i+1)+'</span><b></b><small></small></button>';
      li.querySelector('b').textContent=e.t; li.querySelector('small').textContent=e.s;
      li.firstChild.addEventListener('click',function(){ cargar(i,true); }); lista.appendChild(li); });
    function nombre(i){ return i===5?'portatil':'escena-'+(i+1); }
    function cargar(i,usuario){
      cur=i; var nom=nombre(i), pedido=i; vid.poster=MEDIA+nom+'.jpg';
      marco.setAttribute('data-forma',ESC[i].f);
      video(nom+'.mp4').then(function(u){ if(cur!==pedido) return; vid.src=u; if(usuario||visto) reproducir(vid); });
      tit.textContent=ESC[i].t;
      [].forEach.call(lista.children,function(li,k){ li.classList.toggle('act',k===i); });
      sub.classList.remove('ver'); sub.textContent=''; prog.style.width='0';
      if(usuario && innerWidth<960) marco.scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'start'});
    }
    vid.addEventListener('timeupdate',function(){
      var c=ESC[cur].c, t=vid.currentTime, s='';
      for(var i=0;i<c.length;i++) if(t>=c[i][0]) s=c[i][1];
      if(s!==sub.textContent) sub.textContent=s; sub.classList.toggle('ver',!!s);
      if(vid.duration) prog.style.width=(t/vid.duration*100).toFixed(2)+'%';
    });
    vid.addEventListener('ended',function(){ cargar((cur+1)%ESC.length,false); });
    vid.addEventListener('play',function(){ bPlay.textContent='Pausar'; bPlay.setAttribute('aria-label','Pausar'); });
    vid.addEventListener('pause',function(){ bPlay.textContent='Reproducir'; bPlay.setAttribute('aria-label','Reproducir'); });
    bPlay.addEventListener('click',function(){ if(vid.paused) reproducir(vid); else vid.pause(); });
    vid.style.cursor='pointer'; vid.addEventListener('click',function(){ bPlay.click(); });
    var pedidaEsc=+(new URLSearchParams(location.search).get('escena')||0);    
    cargar(pedidaEsc>=1&&pedidaEsc<=ESC.length?pedidaEsc-1:0,false);
     
    var sigT=0; vid.addEventListener('playing',function(){ clearTimeout(sigT); var c=cur; sigT=setTimeout(function(){ if(c===cur) video(nombre((c+1)%ESC.length)+'.mp4'); },3000); });
    aVista(vid,function(si){ if(si){ if(!visto && !REDUCE){ visto=true; reproducir(vid); } } else if(!vid.paused){ vid.pause(); visto=false; } },{threshold:.4});
  })();

   
  (function(){
    var inp=$('ciegoIn'), btn=$('ciegoBtn'), res=$('ciegoRes'), av=$('ciegoAviso'), avTx=$('ciegoAvisoTx'); if(!inp) return;
    var SALIERON=90, EVENTO='Festival al parque';
    function valor(){ return Math.min(999,Number(String(inp.value).replace(/\D/g,''))||0); }
    function poner(n){ inp.value=String(Math.max(0,Math.min(999,n))); res.hidden=true; av.hidden=true; }
    inp.addEventListener('input',function(){ var d=inp.value.replace(/\D/g,'').slice(0,3); inp.value=d; res.hidden=true; av.hidden=true; });
    inp.addEventListener('focus',function(){ if(inp.value==='0') inp.select(); });
    $('ciegoMenos').addEventListener('pointerdown',function(e){ e.preventDefault(); poner(valor()-1); });
    $('ciegoMas').addEventListener('pointerdown',function(e){ e.preventDefault(); poner(valor()+1); });
    function cerrar(){
      var real=valor(), dif=SALIERON-real; res.hidden=false; res.innerHTML='';
      var sm=document.createElement('small'), tx=document.createElement('span');
      if(dif===0){ res.className='cs-res ok'; sm.textContent='Registro cerrado'; tx.textContent='Cuadró: llegaron las 90 Vallas. No hay nada que avisar.'; av.hidden=true; }
      else {
        res.className='cs-res '+(dif>0?'mal':'sobra'); sm.textContent='Se avisó al dueño';
        tx.textContent=dif>0?'Faltan '+dif+' Vallas (salieron '+SALIERON+', llegaron '+real+')':'Sobran '+(-dif)+' Vallas';
        avTx.textContent=(dif>0?'🔴 FALTAN '+dif:'🟡 SOBRAN '+(-dif))+' Vallas al llegar a '+EVENTO+'\nSe esperaban '+SALIERON+', llegaron '+real+'.\nRecibido por: usted.';
        av.hidden=false; av.style.animation='none'; void av.offsetWidth; av.style.animation='';
      }
      res.appendChild(sm); res.appendChild(tx);
    }
    btn.addEventListener('click',cerrar);
    inp.addEventListener('keydown',function(e){ if(e.key==='Enter') cerrar(); });
  })();

   
  (function(){
    var box=$('tgMsgs'), otra=$('tgReplay'); if(!box) return;
    var D=[
      ['📊 Resumen diario\nEventos: 5 con pendientes · 8 sin pendientes\nSalidas y regresos registrados: 25\nDiferencias de conteo: 4 · Camiones demorados: 0\n\n📌 Pendientes más viejos sin resolver:\n  • Concierto al aire libre lleva 24 día(s) con 4 Vallas sin resolver.\n  • Festival gastronómico lleva 16 día(s) con 2 Vallas sin resolver.\n  • Lanzamiento de producto lleva 8 día(s) con 5 Vallas sin resolver.\nRegistros: nadie los ha cambiado','10:00 p. m.','noche'],
      ['🔴 FALTAN 2 Vallas al llegar a Festival al parque\nSe esperaban 90, llegaron 88.\nRecibido por: Andrés Ramírez.','11:14 p. m.','alerta'],
      ['¿Dónde está la EQ-T-001?','11:20 p. m.','yo'],
      ['📍 EQ-T-001 (Truss cuadrado 3m) → Patio de truss\nEstado: bodega','11:20 p. m.',''],
      ['Historial de la EQ-T-001','11:21 p. m.','yo'],
      ['📜 Historial de EQ-T-001 (Truss cuadrado 3m) — 2 movimiento(s):\n22/10/2026 23:13 — Salida inicial · Festival al parque (Bodega → Festival al parque)\n22/10/2026 23:14 — Regreso a bodega · Festival al parque (Festival al parque → Bodega)','11:21 p. m.',''],
      ['¿Cuánto hay en bodega vs afuera?','11:22 p. m.','yo'],
      ['📊 Resumen bodega vs. afuera\nReflectores: 4 en bodega · 2 afuera · 1 en mantenimiento · 1 perdido(s)\nTruss: 2 en bodega · 2 afuera\nTarimas: 2 en bodega · 2 afuera\nPirotecnia: 1 en bodega · 1 afuera\nVallas: 340 unidades en bodega · 60 unidades afuera\nTubería de palco: 60 m en bodega · 12 m afuera','11:22 p. m.','']
    ];
    var timers=[];
    function play(){ timers.forEach(clearTimeout); timers=[]; box.innerHTML='';
      D.forEach(function(m,i){ timers.push(setTimeout(function(){
        var d=document.createElement('div'); d.className='cs-msg'+(m[2]?' '+m[2]:'');
        var tx=document.createElement('div'); tx.textContent=m[0]; d.appendChild(tx);
        var h=document.createElement('span'); h.className='hora'; h.textContent=m[1]; d.appendChild(h);
        box.appendChild(d); box.scrollTop=box.scrollHeight;
        requestAnimationFrame(function(){ requestAnimationFrame(function(){ d.classList.add('ver'); }); });
      }, REDUCE?0:i*1100)); }); }
    var hecho=false;
    aVista(box,function(si){ if(si&&!hecho){ hecho=true; play(); } },{threshold:.3});
    otra.addEventListener('click',play);
  })();

   
  var sha256=(function(){
    function frac(v){ return ((v-Math.floor(v))*4294967296)>>>0; }
    var K=[], H0=[], p=2, n=0;
    while(n<64){ var primo=true; for(var d=2;d*d<=p;d++) if(p%d===0){ primo=false; break; }
      if(primo){ if(n<8) H0[n]=frac(Math.pow(p,1/2)); K[n]=frac(Math.pow(p,1/3)); n++; } p++; }
    function utf8(s){ if(window.TextEncoder) return new TextEncoder().encode(s); var e=unescape(encodeURIComponent(s)), a=new Uint8Array(e.length); for(var i=0;i<e.length;i++) a[i]=e.charCodeAt(i); return a; }
    function r(x,k){ return (x>>>k)|(x<<(32-k)); }
    return function(str){
      var b=utf8(str), l=b.length, tam=((l+9+63)>>6)<<6, m=new Uint8Array(tam); m.set(b); m[l]=0x80;
      var dv=new DataView(m.buffer), bits=l*8; dv.setUint32(tam-4,bits>>>0); dv.setUint32(tam-8,Math.floor(bits/4294967296));
      var H=H0.slice(), w=new Array(64);
      for(var o=0;o<tam;o+=64){
        for(var t=0;t<16;t++) w[t]=dv.getUint32(o+t*4);
        for(t=16;t<64;t++){ var s0=r(w[t-15],7)^r(w[t-15],18)^(w[t-15]>>>3), s1=r(w[t-2],17)^r(w[t-2],19)^(w[t-2]>>>10); w[t]=(w[t-16]+s0+w[t-7]+s1)>>>0; }
        var a=H[0],bb=H[1],c=H[2],d2=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
        for(t=0;t<64;t++){ var S1=r(e,6)^r(e,11)^r(e,25), ch=(e&f)^(~e&g), t1=(h+S1+ch+K[t]+w[t])>>>0, S0=r(a,2)^r(a,13)^r(a,22), mj=(a&bb)^(a&c)^(bb&c), t2=(S0+mj)>>>0;
          h=g; g=f; f=e; e=(d2+t1)>>>0; d2=c; c=bb; bb=a; a=(t1+t2)>>>0; }
        H[0]=(H[0]+a)>>>0; H[1]=(H[1]+bb)>>>0; H[2]=(H[2]+c)>>>0; H[3]=(H[3]+d2)>>>0; H[4]=(H[4]+e)>>>0; H[5]=(H[5]+f)>>>0; H[6]=(H[6]+g)>>>0; H[7]=(H[7]+h)>>>0;
      }
      return H.map(function(v){ return ('00000000'+v.toString(16)).slice(-8); }).join('');
    };
  })();
  window.__sha256=sha256;    
  (function(){
    var cont=$('eslabones'), cad=$('cad'), btn=$('cadAlterar'), est=$('cadEst'); if(!cont) return;
    var G='0'.repeat(64);
    var EV=[
      {txt:'Salida al evento · 90 Vallas + 2 equipos con código', tipo:'manifiesto_evento_registrado', ts:'2026-10-23T04:13:05.000Z',
       p:{tipo:'inicial',eventoNombre:'Festival al parque',tramo:'Bodega → Festival al parque',referencias:[{categoria:'Vallas',cantidad:90}],items:['EQ-T-001','EQ-T-003']},
       alt:{txt:'Salida al evento · 80 Vallas + 2 equipos con código', k:function(p){ p.referencias[0].cantidad=80; }}},
      {txt:'Llegada al evento · llegaron 88 Vallas', tipo:'llegada_evento_registrada', ts:'2026-10-23T04:14:02.000Z',
       p:{eventoNombre:'Festival al parque',referencias:[{categoria:'Vallas',cantidad:88}],quienRecibe:'Andrés Ramírez'},
       alt:{txt:'Llegada al evento · llegaron 90 Vallas', k:function(p){ p.referencias[0].cantidad=90; }}},
      {txt:'Diferencia registrada · faltan 2 Vallas', tipo:'descargue_registrado', ts:'2026-10-23T04:14:02.100Z',
       p:{tramo:'Bodega → Festival al parque',categoria:'Vallas',esperado:90,real:88,diferencia:2,recibidoPor:'Andrés Ramírez'},
       alt:{txt:'Diferencia registrada · faltan 0 Vallas', k:function(p){ p.real=90; p.diferencia=0; }}},
      {txt:'Mensaje al celular del dueño · faltan 2 Vallas', tipo:'alerta_discrepancia_enviada', ts:'2026-10-23T04:14:02.400Z',
       p:{tramo:'Bodega → Festival al parque',categoria:'Vallas',diferencia:2,enviado:true},
       alt:{txt:'Mensaje al celular del dueño · no enviado', k:function(p){ p.enviado=false; }}},
      {txt:'Regreso a bodega · 88 Vallas + 2 equipos con código', tipo:'manifiesto_evento_registrado', ts:'2026-10-23T04:14:50.000Z',
       p:{tipo:'sobrante_a_bodega',eventoNombre:'Festival al parque',tramo:'Festival al parque → Bodega',referencias:[{categoria:'Vallas',cantidad:88}],items:['EQ-T-001','EQ-T-003']},
       alt:{txt:'Regreso a bodega · 90 Vallas + 2 equipos con código', k:function(p){ p.referencias[0].cantidad=90; }}}
    ];
    function huella(seq,e,payload,ant){ return sha256(seq+'|'+e.ts+'|'+e.tipo+'|'+JSON.stringify(payload)+'|'+ant); }
     
    var ORIG=[], ant=G; EV.forEach(function(e,i){ var h=huella(i+1,e,e.p,ant); ORIG.push({h:h,ant:ant}); ant=h; });
    var alterado=-1;
    function pintar(){
      cont.innerHTML='';
      EV.forEach(function(e,i){
        var roto=i===alterado, txt=roto?e.alt.txt:e.txt, h=ORIG[i].h;
        if(roto){ var p=JSON.parse(JSON.stringify(e.p)); e.alt.k(p); h=huella(i+1,e,p,ORIG[i].ant); }    
        var d=document.createElement('div'); d.className='cs-esl'+(roto?' roto':'')+(alterado>=0&&i>alterado?' tras':'')+(i===EV.length-1&&alterado<0?' sello':''); d.style.setProperty('--i',i);
        d.innerHTML='<div class="bl" role="button" tabindex="0"><span class="num">REGISTRO '+(i+1)+'</span><span class="ev"></span><span class="h">Sello '+h.slice(0,8)+'</span></div><i class="link"></i>';
        d.querySelector('.ev').textContent=txt; var bl=d.querySelector('.bl'); bl.title='Cambiar este registro';
        function alterar(){ alterado=(alterado===i)?-1:i; pintar(); cad.classList.add('in'); }
        bl.addEventListener('click',alterar); bl.addEventListener('keydown',function(ev){ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); alterar(); } });
        cont.appendChild(d);
      });
      est.className='cs-cad-est'+(alterado>=0?' mal':'');
      est.lastChild.textContent=alterado>=0?'Alguien cambió el registro '+(alterado+1)+': ya no coincide con su sello. El sistema lo delata.':'Todo cuadra: nadie ha cambiado ningún registro';
      btn.textContent=alterado>=0?'Dejarlo como estaba':'Cambiar el 88 por un 90';
    }
    est.innerHTML='<i></i>'; est.appendChild(document.createTextNode(''));
    btn.addEventListener('click',function(){ alterado=alterado>=0?-1:1; pintar(); cad.classList.add('in'); if(alterado>=0){ var r=cont.children[alterado]; if(r) cont.scrollTo({left:Math.max(0,r.offsetLeft-20),behavior:REDUCE?'auto':'smooth'}); } });
    pintar();
    aVista(cad,function(si){ if(si) cad.classList.add('in'); },{threshold:.2});
  })();

   
  (function(){
    [].forEach.call(document.querySelectorAll('[data-ir]'),function(el){ el.style.cursor='pointer';
      el.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); el.click(); } });
      el.addEventListener('click',function(e){ var t=e.target.closest('a,button,input'); if(t&&t!==el) return; e.preventDefault(); var esc=el.getAttribute('data-escena'), aqui=irA(el.getAttribute('data-ir'),esc);
        if(esc&&aqui){ var b=document.querySelectorAll('#escLista button')[+esc-1]; if(b) setTimeout(function(){ b.click(); },REDUCE?0:500); } }); });
    var p2=document.querySelector('.cs-pasos li:nth-child(2)'); if(p2){ p2.style.cursor='pointer'; p2.addEventListener('click',function(){ var i=$('ciegoIn'); if(i) i.focus(); }); }
  })();

   
  (function(){
    [].forEach.call(document.querySelectorAll('.ev-ir-vis'),function(caja){
      aVista(caja,function(si){ if(!si||caja._ok) return; caja._ok=true;
        [].forEach.call(caja.querySelectorAll('[data-srcset]'),function(s){ s.srcset=s.getAttribute('data-srcset'); });
        [].forEach.call(caja.querySelectorAll('img[data-src]'),function(i){ i.src=i.getAttribute('data-src'); });
        [].forEach.call(caja.querySelectorAll('video[data-poster]'),function(v){ v.poster=v.getAttribute('data-poster'); });
      },{rootMargin:'150% 0px'});
      var v=caja.querySelector('video[data-video]'); if(!v) return;
      aVista(v,function(si){ if(si&&!REDUCE){ aMemoria(v,v.getAttribute('data-video')); if(v.src) reproducir(v); } else if(!si) v.pause(); },{threshold:.3});
    });
  })();

   
  (function(){
    var tabs=$('visorTabs'), sub=$('visorSub'), img=$('visorImg'); if(!tabs||!img) return;
    var V=[
      ['Inicio','inicio','Lo primero que ve: cuánto material está afuera, los eventos del mes y lo que requiere atención.','Inicio del panel: unidades afuera, eventos con material afuera y lo que requiere atención.'],
      ['Eventos','eventos','Los eventos con material afuera, del más viejo al más nuevo, y cuántos días lleva cada uno.','Lista de eventos con material afuera y los días que lleva.'],
      ['Un evento','recorrido','El recorrido de un evento: salió, llegó, volvió. Cada paso guardado, con quién lo llevó.','Recorrido de un evento: salida, llegada confirmada y regreso.'],
      ['Inventario','inventario','Cuánto hay en bodega, cuánto afuera y cuánto en mantenimiento, por categoría.','Inventario por categoría: en bodega, afuera y en mantenimiento.'],
      ['Gráficas','operacion','Movimientos por día y unidades que salen contra las que regresan, en los últimos 30 días.','Gráficas de operación: movimientos por día y unidades que salen contra las que regresan.',[
        ['Operación','operacion','Movimientos por día y unidades que salen contra las que regresan, en los últimos 30 días.'],
        ['Calidad','calidad','Faltantes y sobrantes por categoría, y si las llegadas completas mejoran o empeoran.'],
        ['Planeación','planeacion','La carga de las próximas semanas contra lo que hay en bodega: lo que no va a alcanzar.'],
        ['Uso del sistema','uso','Cuánto se registró sin señal, cuánto se corrigió al subirlo y las entradas al panel y a la app.']]],
      ['Calendario','calendario','Qué hay programado, mes a mes.','Calendario del mes con los eventos programados.'],
      ['Diferencias','novedades','Lo que se salió de lo normal: cada diferencia de conteo, entre lo que debía llegar y lo que llegó.','Diferencias de conteo entre lo esperado y lo que llegó.'],
      ['Salidas','manifiestos','Cada salida y cada regreso, con lo que llevaba. Se imprime o se manda por WhatsApp.','Lista de salidas y regresos.']
    ];
    var cAvif=$('visorCelAvif'), cJpg=$('visorCelJpg'), pAvif=$('visorAvif'), cap=$('visorCap'), act=0;
    function poner(clave,texto,alt){
      cap.textContent=texto; if(alt) img.alt=alt;
      if(img.src.indexOf('p-'+clave+'.')>-1||img.currentSrc.indexOf('p-'+clave+'-cel.')>-1) return;
      img.classList.add('cambia');
      var listo=function(){ img.classList.remove('cambia'); img.removeEventListener('load',listo); img.removeEventListener('error',listo); }; img.addEventListener('load',listo); img.addEventListener('error',listo);
      cAvif.srcset=MEDIA+'p-'+clave+'-cel.avif'; cJpg.srcset=MEDIA+'p-'+clave+'-cel.jpg'; pAvif.srcset=MEDIA+'p-'+clave+'.avif'; img.src=MEDIA+'p-'+clave+'.jpg';
    }
    function boton(caja,txt,sel,fn){ var b=document.createElement('button'); b.type='button'; b.setAttribute('role','tab'); b.textContent=txt;
      b.setAttribute('aria-selected',sel?'true':'false'); b.addEventListener('click',fn); caja.appendChild(b); return b; }
    function marcar(caja,i){ [].forEach.call(caja.children,function(b,k){ b.setAttribute('aria-selected',k===i?'true':'false'); }); }
    function subtabs(lista,alt){ sub.innerHTML=''; sub.hidden=!lista; if(!lista) return;
      lista.forEach(function(g,k){ boton(sub,g[0],k===0,function(){ marcar(sub,k); poner(g[1],g[2],alt); }); }); }
    V.forEach(function(v,i){ boton(tabs,v[0],i===0,function(){ act=i; marcar(tabs,i); subtabs(v[4],v[3]); poner(v[1],v[2],v[3]);
      var b=tabs.children[i]; if(b.scrollIntoView&&innerWidth<=700) b.scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'nearest',inline:'center'}); }); });
     
    var celu=matchMedia('(max-width:700px)').matches, avif=null;
    aVista(img,function(si){ if(!si||avif!==null) return; avif=(img.currentSrc||'').indexOf('.avif')>-1;
      var claves=['eventos','recorrido','inventario','operacion','calendario','novedades','manifiestos','calidad','planeacion','uso'];
      claves.reduce(function(p,c){ return p.then(function(){ return new Promise(function(ok){ var i=new Image(); i.onload=i.onerror=ok;
        i.src=MEDIA+'p-'+c+(celu?'-cel':'')+(avif?'.avif':'.jpg'); }); }); }, Promise.resolve());
    },{threshold:.2});
  })();
})();

 
(function(){
  'use strict';
  var quieto=matchMedia('(prefers-reduced-motion: reduce)').matches, IO='IntersectionObserver' in window;
  var SUB=document.body.getAttribute('data-sub')||'', MEDIA=(SUB?'../':'')+'media/';
  function juega(v){ if(quieto) return; if(!v.src && v.dataset.src) v.src=v.dataset.src; var p=v.play(); if(p&&p.catch) p.catch(function(){}); }
  function mira(el,fn,opts){ if(!el) return; if(!IO){ fn(true); return; } new IntersectionObserver(function(es){ es.forEach(function(e){ fn(e.isIntersecting); }); },opts||{threshold:.25}).observe(el); }

   
  var sec=document.getElementById('hx');
  if(sec){
    var med=sec.querySelector('.hx-media'), v=document.getElementById('hxVid');
    if(v){
      var alto=matchMedia('(max-width: 899px)'), actual='';
      var pon=function(){ var n=alto.matches?'hero-1x1':'hero-16x9'; if(n===actual) return; actual=n;
         
        med.style.backgroundImage='url('+MEDIA+n+'.jpg)';
        med.style.backgroundImage='image-set(url('+MEDIA+n+'.avif) type("image/avif"), url('+MEDIA+n+'.jpg) type("image/jpeg"))';
        if(quieto) return; v.classList.remove('lista'); v.src=MEDIA+n+'.mp4'; v.load(); var p=v.play(); if(p&&p.catch) p.catch(function(){}); };
      v.addEventListener('playing',function(){ v.classList.add('lista'); });
      pon(); if(alto.addEventListener) alto.addEventListener('change',pon);
      if(!quieto) mira(sec,function(si){ if(si){ var p=v.play(); if(p&&p.catch) p.catch(function(){}); } else v.pause(); },{threshold:0});
    }
    if(!quieto){ var pend=false;
      var mueve=function(){ pend=false; var p=Math.min(1,Math.max(0,scrollY/(sec.offsetHeight||1))); sec.style.setProperty('--p',p.toFixed(3)); };
      addEventListener('scroll',function(){ if(!pend){ pend=true; requestAnimationFrame(mueve); } },{passive:true}); mueve(); }
  }

   
  var nx=document.getElementById('ciclo');
  if(nx){
    var pasos=nx.querySelectorAll('.nx-paso'), caps=nx.querySelectorAll('.nx-vid'), avisos=nx.querySelectorAll('.nx-aviso'), cur=0, enVista=false;
    var vid=nx.querySelector('video.nx-vid');
    var ponNx=function(i){ if(i===cur) return; cur=i;
      for(var k=0;k<3;k++){ var on=k===i; pasos[k].classList.toggle('on',on); caps[k].classList.toggle('on',on); avisos[k].classList.toggle('on',on); }
      if(i===2&&enVista) juega(vid); else if(!vid.paused) vid.pause(); };
    var mideNx=function(){ var r=nx.getBoundingClientRect(), largo=r.height-innerHeight, p=Math.min(1,Math.max(0,-r.top/(largo||1)));
      ponNx(Math.min(2,Math.floor(p*3)));
      for(var k=0;k<3;k++){ var f=Math.min(1,Math.max(0,p*3-k)); pasos[k].querySelector('.nx-barra i').style.setProperty('--f',quieto?(k<=cur?1:0):f.toFixed(3)); } };
     
    mira(nx,function(si){ if(si&&!vid.poster) vid.poster=vid.getAttribute('data-poster'); },{rootMargin:'150% 0px'});
    mira(nx,function(si){ enVista=si; if(si&&cur===2) juega(vid); else if(!si&&!vid.paused) vid.pause(); },{threshold:0});
    var pn=false; addEventListener('scroll',function(){ if(!pn){ pn=true; requestAnimationFrame(function(){ pn=false; mideNx(); }); } },{passive:true});
    addEventListener('resize',mideNx); mideNx();
  }

   
  var cu=document.getElementById('cuenta'), n=document.getElementById('cuentaN');
  if(cu&&n){
    var t=0, hecho=false;
    mira(cu,function(si){ if(!si||hecho) return; hecho=true; cu.classList.add('vivo');
      if(quieto){ n.textContent='88'; return; }
      var t0=performance.now();
      (function paso(now){ var f=Math.min(1,(now-t0)/3000); n.textContent=String(Math.round(88*(1-Math.pow(1-f,2)))); if(f<1) t=requestAnimationFrame(paso); })(t0);
    },{threshold:.45});
  }

   
  [].forEach.call(document.querySelectorAll('.mx-foto'),function(caja){
    mira(caja,function(si){ if(!si||caja._ok) return; caja._ok=true;
      [].forEach.call(caja.querySelectorAll('[data-srcset]'),function(s){ s.srcset=s.getAttribute('data-srcset'); });
      [].forEach.call(caja.querySelectorAll('img[data-src]'),function(i){ i.src=i.getAttribute('data-src'); });
    },{rootMargin:'150% 0px'});
    if(!quieto) mira(caja,function(si){ caja.classList.toggle('vivo',si); },{threshold:.2});
  });
})();

 
(function(){
  'use strict';
  var quieto=matchMedia('(prefers-reduced-motion: reduce)').matches, IO='IntersectionObserver' in window;
  function juega(v){ if(quieto) return; var p=v.play(); if(p&&p.catch) p.catch(function(){}); }
  function avance(sec){ var r=sec.getBoundingClientRect(), largo=r.height-innerHeight; return Math.min(1,Math.max(0,-r.top/(largo||1))); }
  function alScroll(fn){ var pend=false; addEventListener('scroll',function(){ if(!pend){ pend=true; requestAnimationFrame(function(){ pend=false; fn(); }); } },{passive:true}); addEventListener('resize',fn); fn(); }
  function barras(pasos,p,N,cur){ for(var k=0;k<N;k++){ var f=quieto?(k<=cur?1:0):Math.min(1,Math.max(0,p*N-k)); pasos[k].querySelector('.vj-barra i').style.setProperty('--f',f.toFixed(3)); } }
  function tocaParada(sec,pasos,N){ [].forEach.call(pasos,function(li,k){ li.addEventListener('click',function(){
    var top=sec.getBoundingClientRect().top+scrollY, largo=sec.offsetHeight-innerHeight; scrollTo({top:top+largo*(k+.5)/N,behavior:quieto?'auto':'smooth'}); }); }); }

   
  var vj=document.getElementById('viaje');
  if(vj){
    var esc=vj.querySelector('.vj-escena'), pasos=vj.querySelectorAll('.vj-paso'), cines=vj.querySelectorAll('.ev-cine-c'), vids=vj.querySelectorAll('.vj-vid'),
        sub=vj.querySelector('.ev-vj-sub'), cineV=vj.querySelector('video.ev-cine-c'), N=pasos.length, cur=-1, enVista=false, cargado=false, tT=0;
     
    var S2=[[0,'Salida de bodega: el operario abre el evento del día'],[2,'Un toque en «Cargar 90» y queda contado lo que pidió el evento'],[5,'Los equipos con código se leen con la cámara, QR por QR'],[9,'Revisa el resumen antes de cerrar: 92 unidades'],[12.5,'Al cerrar queda guardado. No se puede cambiar: solo anular, con el motivo']];
    var S3=[[0,'En el evento, quien recibe confirma la llegada'],[1.2,'Cuenta lo que llegó sin ver cuánto salió'],[3.5,'Escribe lo que contó: 88 Vallas'],[6,'Revisa y cierra el registro'],[8,'El sistema compara: faltan 2 Vallas. Y se le avisa al dueño en ese momento']];
    var S4=[[0,'De vuelta en la bodega: registrar el regreso'],[1.5,'Otra vez sin ver cuánto salió: cuenta lo que volvió'],[5.2,'Los equipos con código se leen uno por uno'],[10.5,'Se cierra y queda guardado. Lo que no volvió queda pendiente, a nombre del evento']];
    var S5=[[0,'El dueño abre su panel en la misma app'],[3,'Entra con su propio PIN'],[5,'Inicio: cuánto material está afuera ahora y qué requiere atención'],[8,'El sistema mismo señala lo que lleva más de 7 días afuera'],[10,'Lo que sale y lo que vuelve, en los últimos 30 días'],[14,'Eventos: cuál tiene material afuera y desde hace cuántos días'],[16,'Cada evento con su recorrido: salió, llegó, volvió. Cada paso queda guardado'],[23,'Inventario: cuánto hay en bodega y cuánto afuera, por categoría'],[28,'Gráficas: movimientos por día y lo que queda pendiente por evento']];
    var SUBS=[S2,S3,S5];
    [].forEach.call(vids,function(v,k){
      v.addEventListener('ended',function(){ var sig=v.getAttribute('data-sigue');
        if(sig&&!v._seg){ v._seg=true; v.src=sig; } else if(sig){ v._seg=false; v.src=v.getAttribute('data-src'); }
        v.currentTime=0; if(k===cur&&enVista) juega(v); });
      v.addEventListener('timeupdate',function(){ if(k!==cur) return; var c=(k===1&&v._seg)?S4:SUBS[k], t=v.currentTime, s='';
        for(var j=0;j<c.length;j++) if(t>=c[j][0]) s=c[j][1];
        if(s!==sub.textContent) sub.textContent=s; sub.classList.toggle('ver',!!s); });
    });
     
    var pide=function(i){ if(i>=N) return; var v=vids[i]; if(!v.getAttribute('src')){ v.preload='auto'; v.src=v.getAttribute('data-src'); }
      if(i===2&&!cineV.getAttribute('src')){ cineV.poster=cineV.getAttribute('data-poster'); if(!quieto) cineV.src=cineV.getAttribute('data-src'); } };
    var carga=function(){ if(cargado) return; cargado=true; pide(Math.max(cur,0)); pide(Math.max(cur,0)+1); };
    var ponVj=function(i){ if(i===cur) return; cur=i; esc.setAttribute('data-p',i);
      for(var k=0;k<N;k++){ pasos[k].classList.toggle('on',k===i); cines[k].classList.toggle('on',k===i); }
      [].forEach.call(vids,function(v,k){ v.classList.toggle('on',k===i); if(k!==i&&!v.paused) v.pause(); });
      if(i===2&&enVista) juega(cineV); else if(!cineV.paused) cineV.pause();
      sub.classList.remove('ver'); sub.textContent='';
      if(cargado){ pide(i); pide(i+1); }
      clearTimeout(tT); esc.classList.remove('tel');
      tT=setTimeout(function(){ esc.classList.add('tel'); if(enVista&&cargado){ var v=vids[cur]; try{ v.currentTime=0; }catch(e){} juega(v); } },quieto?0:900); };
    var mideVj=function(){ var p=avance(vj); ponVj(Math.min(N-1,Math.floor(p*N))); barras(pasos,p,N,cur); };
    tocaParada(vj,pasos,N);
    if(IO){
      new IntersectionObserver(function(e){ if(e[0].isIntersecting) carga(); },{rootMargin:'100% 0px'}).observe(vj);
      new IntersectionObserver(function(e){ enVista=e[0].isIntersecting;
        if(enVista){ if(cargado&&esc.classList.contains('tel')) juega(vids[cur]); if(cur===2) juega(cineV); }
        else { [].forEach.call(vids,function(v){ if(!v.paused) v.pause(); }); if(!cineV.paused) cineV.pause(); } }).observe(vj);
    } else { enVista=true; carga(); }
    alScroll(mideVj);
  }

   
  var av=document.getElementById('dhAviso');
  if(av){ var vino=false;
    var llega=function(){ if(vino) return; vino=true; av.classList.add('ver'); if(!quieto) av.classList.add('zumba'); };
    if(quieto) llega(); else setTimeout(llega,1200); }

   
  var mf=document.getElementById('plano');
  if(mf){
    var mesc=mf.querySelector('.mf-escena'), mpasos=mf.querySelectorAll('.vj-paso'), M=mpasos.length, mcur=-1, mVista=false, red=document.getElementById('evRed'), tr=0;
    var SELLO=['1 · Un código por equipo','2 · El estante también','3 · Sin señal'];
    var senal=function(){ clearTimeout(tr); red.className='ev-red'; if(mcur!==2||!mVista) return;
      if(quieto){ red.className='ev-red a b'; return; }
      tr=setTimeout(function(){ red.className='ev-red a'; tr=setTimeout(function(){ red.className='ev-red b'; },2400); },500); };
    var ponMf=function(i){ if(i===mcur) return; mcur=i; mesc.setAttribute('data-p',i);
      for(var k=0;k<M;k++) mpasos[k].classList.toggle('on',k===i);
      document.getElementById('mfSelloT').textContent=SELLO[i];
       
      if(mVista){ mesc.classList.remove('vivo'); void mesc.offsetWidth; mesc.classList.add('vivo'); }
      senal(); };
    var mideMf=function(){ var p=avance(mf); ponMf(Math.min(M-1,Math.floor(p*M))); barras(mpasos,p,M,mcur); };
    tocaParada(mf,mpasos,M);
    var vista=function(v){ if(v===mVista) return; mVista=v; mesc.classList.toggle('vivo',v); senal(); };
    if(IO) new IntersectionObserver(function(e){ vista(e[0].isIntersecting); },{threshold:.15}).observe(mesc); else vista(true);
    alScroll(mideMf);
  }
})();

 
(function(){
  [].forEach.call(document.querySelectorAll('a[data-parada]'),function(a){ a.addEventListener('click',function(e){
    var pasos=document.querySelectorAll('#plano .vj-paso'), k=+a.getAttribute('data-parada'); if(!pasos[k]) return;
    e.preventDefault(); pasos[k].click(); }); });
})();
