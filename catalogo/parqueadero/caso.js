 
var CASO_SRC=(document.currentScript&&document.currentScript.src)||'';
 
var RAIZ=CASO_SRC.replace(/caso\.js(\?.*)?$/,'');
(function(){
  'use strict';
  var REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TACTIL = matchMedia('(pointer: coarse)').matches;
  function $(id){ return document.getElementById(id); }
  function pesos(n){ return '$ ' + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
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

   
  (function(){
    var cv=$('loteCv'); if(!cv) return;
    var L=lienzo(cv), x=L.x, yaw=-.62, yawT=-.62, pit=.58, pitT=.58, t0=performance.now(), vis=true, raf=0, ult=0;
    var COLS=7, FILAS=3, AN=1, FO=1.9;
    var puestos=[]; for(var f=0;f<FILAS;f++) for(var c=0;c<COLS;c++) puestos.push({c:c,f:f,ocu:Math.random()<.55,col:Math.random()<.18?'oro':'az'});
    function P(px,py,pz,k,cx,cy){ var cs=Math.cos(yaw), sn=Math.sin(yaw), X=px*cs-pz*sn, Z=px*sn+pz*cs;
      var cp=Math.cos(pit), sp=Math.sin(pit), Y=py*cp-Z*sp, Z2=py*sp+Z*cp; return [cx+X*k, cy-Y*k, Z2]; }
    function poly(pts,fill,stroke,lw){ x.beginPath(); x.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) x.lineTo(pts[i][0],pts[i][1]); x.closePath(); if(fill){ x.fillStyle=fill; x.fill(); } if(stroke){ x.strokeStyle=stroke; x.lineWidth=lw||1; x.stroke(); } }
    function caja(pr,bx,bz,a,b,h,col,y0){ y0=y0||0; var V=[],i; for(i=0;i<8;i++) V.push(pr(bx+(i&1?a:-a), y0+(i&2?h:0), bz+(i&4?b:-b)));
      var F=[[2,3,7,6,col[0]],[0,2,6,4,col[1]],[1,3,7,5,col[2]],[0,1,3,2,col[2]],[4,5,7,6,col[1]]];
      F.forEach(function(q){ q.z=(V[q[0]][2]+V[q[1]][2]+V[q[2]][2]+V[q[3]][2])/4; }); F.sort(function(p,q){ return q.z-p.z; });
      F.forEach(function(q){ poly([V[q[0]],V[q[1]],V[q[2]],V[q[3]]], q[4], 'rgba(255,255,255,.08)', 1); }); }
    var AZ=['#3F86C9','#1F4E79','#163A5C'], ORO=['#F2C76A','#9A6E1F','#6E4E14'], GR=['#3A3F49','#1C1F25','#14161A'], CAS=['#E9EDF3','#8C93A0','#5C6370'];
    function pinta(now){
      var W=L.W(), H=L.H(), t=(now-t0)/1000; yaw+=(yawT-yaw)*.06; pit+=(pitT-pit)*.06;
      x.clearRect(0,0,W,H);
      var x0=-COLS*AN/2, z0=-3.9, zc=z0+FILAS*FO+.75, gx=-x0-.35, gz=zc+1.05;
       
      var esq=[[x0-.6,0,z0-.4],[-x0+.9,0,z0-.4],[-x0+.9,0,gz+.7],[x0-.6,0,gz+.7],[gx+.75,1.6,gz],[gx,2.1,zc+.75]], mnx=1e9,mxx=-1e9,mny=1e9,mxy=-1e9;
      esq.forEach(function(q){ var v=P(q[0],q[1],q[2],1,0,0); mnx=Math.min(mnx,v[0]); mxx=Math.max(mxx,v[0]); mny=Math.min(mny,v[1]); mxy=Math.max(mxy,v[1]); });
      var k=Math.min(W*.9/(mxx-mnx), H*.84/(mxy-mny)), cx=W/2-k*(mnx+mxx)/2, cy=H/2-k*(mny+mxy)/2;
      function pr(a,b,c){ return P(a,b,c,k,cx,cy); }
       
      poly([pr(x0-.6,0,z0-.4),pr(-x0+.9,0,z0-.4),pr(-x0+.9,0,gz+.7),pr(x0-.6,0,gz+.7)],'rgba(74,147,214,.05)','rgba(156,201,242,.18)',1);
       
      for(var f=0;f<FILAS;f++) for(var c=0;c<=COLS;c++){ var zz=z0+f*FO; var a=pr(x0+c*AN,0,zz), b=pr(x0+c*AN,0,zz+FO*.78); x.beginPath(); x.moveTo(a[0],a[1]); x.lineTo(b[0],b[1]); x.strokeStyle='rgba(156,201,242,.22)'; x.lineWidth=1; x.stroke(); }
       
      var e1=pr(x0-.6,0,zc), e2=pr(-x0+.9,0,zc); x.setLineDash([6,8]); x.beginPath(); x.moveTo(e1[0],e1[1]); x.lineTo(e2[0],e2[1]); x.strokeStyle='rgba(242,184,75,.35)'; x.lineWidth=1; x.stroke(); x.setLineDash([]);
       
      puestos.forEach(function(p){ if(!p.ocu) return; var bx=x0+p.c*AN+AN/2, bz=z0+p.f*FO+FO*.39;
        var lev=REDUCE?0:Math.max(0,Math.sin(t*1.6+p.c*.9+p.f*1.7))*.04; caja(pr,bx,bz,.32,.62,.34+lev,p.col==='oro'?ORO:AZ); });
       
      var ciclo=REDUCE?.62:(t*.16)%1, carX=-x0+2.6-ciclo*(-x0*2+3.6);
      var dist=carX-gx, abre=Math.max(0,Math.min(1,(1.9-Math.abs(dist+.2))/.9));
      caja(pr,gx+.75,gz,.36,.36,.78,CAS);
      var ang=abre*1.35, piv=pr(gx,.55,zc+.75), fin=pr(gx,.55+Math.sin(ang)*1.5,zc+.75-Math.cos(ang)*1.5);
      x.beginPath(); x.moveTo(piv[0],piv[1]); x.lineTo(fin[0],fin[1]); x.strokeStyle='#F2B84B'; x.lineWidth=Math.max(3,k*.08); x.lineCap='round'; x.stroke();
      caja(pr,gx,zc+.75,.07,.07,.6,GR);
      caja(pr,carX,zc,.62,.32,.34,AZ);
       
      var av=pr(gx+.75,1.35,gz), pul=REDUCE?0:(dist<.2&&dist>-2.6?(.2-dist)/2.8:0);
      if(pul>0){ x.beginPath(); x.arc(av[0],av[1],6+pul*30,0,6.283); x.strokeStyle='rgba(242,184,75,'+(1-pul)*.85+')'; x.lineWidth=2; x.stroke(); }
      var gl=x.createRadialGradient(av[0],av[1],0,av[0],av[1],22); gl.addColorStop(0,'rgba(242,184,75,.55)'); gl.addColorStop(1,'rgba(242,184,75,0)'); x.fillStyle=gl; x.beginPath(); x.arc(av[0],av[1],22,0,6.283); x.fill(); x.beginPath(); x.arc(av[0],av[1],6.5,0,6.283); x.fillStyle='#F2C76A'; x.fill();
    }
    L.redibujar=function(){ pinta(performance.now()); };
     
    function paso(now){ raf=0; if(!vis||document.hidden) return; pinta(now); raf=requestAnimationFrame(paso); }
    function arranca(){ if(REDUCE){ pinta(t0+2000); return; } if(!raf&&vis&&!document.hidden) raf=requestAnimationFrame(paso); }
    aVista(cv,function(v){ vis=v; arranca(); },{threshold:0});
    document.addEventListener('visibilitychange',arranca);
    var zona=cv.parentNode;
    zona.addEventListener('pointermove',function(e){ var r=cv.getBoundingClientRect(); yawT=-.62+((e.clientX-r.left)/r.width-.5)*.9; pitT=.58+((e.clientY-r.top)/r.height-.5)*.35; if(REDUCE) pinta(performance.now()); },{passive:true});
    zona.addEventListener('pointerleave',function(){ yawT=-.62; pitT=.58; });
    zona.addEventListener('click',function(){ irA('escenas'); });
    arranca();
  })();

   
  var MEM={}, PIDIENDO={};
  function video(nombre){
    if(MEM[nombre]) return Promise.resolve(MEM[nombre]);
    if(PIDIENDO[nombre]) return PIDIENDO[nombre];
    if(!window.fetch||!window.URL||!URL.createObjectURL) return Promise.resolve(RAIZ+'media/'+nombre);
    PIDIENDO[nombre]=fetch(RAIZ+'media/'+nombre).then(function(r){ if(!r.ok) throw 0; return r.blob(); })
      .then(function(b){ MEM[nombre]=URL.createObjectURL(b); return MEM[nombre]; })
      .catch(function(){ delete PIDIENDO[nombre]; return RAIZ+'media/'+nombre; });
    return PIDIENDO[nombre];
  }
  function precargar(lista){ lista.reduce(function(p,n){ return p.then(function(){ return video(n); }); }, Promise.resolve()); }
   
  var PAGINA_DE={viaje:'como-funciona/',escenas:'como-funciona/',ciego:'como-funciona/',bot:'como-funciona/',cadena:'como-funciona/',proyeccion:'lote/',video:'',problema:''};
  function irA(id){ var d=$(id); if(d){ d.scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'start'}); return; }
    if(id in PAGINA_DE) location.href=RAIZ+PAGINA_DE[id]+'#'+id; }

   
  (function(){
    var v=document.querySelector('.cs-lapvid'); if(!v) return;
    video('escena-1.mp4').then(function(u){ if(v.src.indexOf('blob:')<0){ var t=v.currentTime, play=!v.paused; v.src=u; try{ v.currentTime=t; }catch(e){} if(play){ var p=v.play(); if(p&&p.catch) p.catch(function(){}); } } });
    var scr=document.querySelector('#lap .scr'), cel=$('cel');
    if(scr){ scr.style.cursor='pointer'; scr.addEventListener('click',function(){ irA('escenas'); }); }
    if(cel){ cel.style.cursor='pointer'; cel.addEventListener('click',function(){ irA('bot'); }); }
    aVista(v,function(si){ if(si && !REDUCE){ var p=v.play(); if(p&&p.catch) p.catch(function(){}); } else v.pause(); },{threshold:.15});
  })();

   
  (function(){
    var vid=$('escVid'), lista=$('escLista'); if(!vid||!lista) return;
    var ESC=[
      {t:'Apertura de turno y registro', s:'Ingreso, revisión de patio, entrada nueva', tiq:true,
       c:[[0,'Inicia sesión el operario, con su PIN'],[6,'Antes de abrir el turno, confirma los vehículos que ya estaban en el patio'],[15,'Registra la entrada de un vehículo nuevo: elige el tipo'],[21,'Escribe la placa y el sistema imprime el tiquete']]},
      {t:'Registrar un gasto de caja', s:'Papel de impresora, con su soporte', tiq:true, c:[[0,'Se registra un gasto menor de caja (papel de la impresora), con su soporte']]},
      {t:'Salida con pago mixto', s:'Efectivo + transferencia', tiq:true,
       c:[[0,'El operario escribe la placa del vehículo que sale'],[5,'Elige el tipo de pago: efectivo, transferencia o mixto'],[9,'Si es mixto, reparte el valor entre efectivo y transferencia'],[15,'Se cobra y el sistema queda listo para el siguiente vehículo']]},
      {t:'Cierre de turno (arqueo)', s:'Conteo a ciegas, diferencia en vivo', tiq:true,
       c:[[0,'Al cerrar el turno, el operario cuenta el efectivo SIN ver el valor esperado'],[3,'El sistema compara en vivo: aquí sobraron $ 300.000 sobre la base']]},
      {t:'Panel de administrador', s:'Reportes, operarios, mensualidades, transferencias', tiq:false,
       c:[[0,'El administrador entra con su PIN'],[6,'Reportes: movimientos y resumen de cada turno'],[18,'Operarios: quién puede operar el sistema'],[24,'Mensualidades: clientes con plan fijo'],[30,'Transferencias: confirmar los pagos que llegan por transferencia']]},
      {t:'Cierre forzado y nuevo operario', s:'El supervisor cierra, entra el siguiente', tiq:true,
       c:[[0,'El supervisor puede forzar el cierre de un turno abierto'],[6,'Con su PIN, entra el siguiente operario'],[15,'Abre su propio turno con la base de caja'],[20,'Y ya puede registrar entradas']]},
      {t:'Anular una factura', s:'Con PIN y motivo, autorizado', tiq:true,
       c:[[0,'El administrador puede anular una factura del turno'],[9,'Con su PIN y el motivo, autoriza la anulación'],[24,'Se corrige el pago y el sistema sigue funcionando sin perder el registro']]},
      {t:'Cargar un vehículo al patio', s:'Entrada retroactiva', tiq:true, c:[[0,'Carga inicial de patio: registrar un vehículo que ya estaba adentro antes de usar el sistema']]}
    ];
    var TIQ={1:'El tiquete de apertura y el de entrada, impresos',2:'El comprobante del gasto, línea por línea',3:'La factura de salida, desglosada',4:'El informe de cierre de turno, con el arqueo completo',6:'El comprobante del cierre forzado y la apertura del siguiente turno',7:'La factura anulada y la factura corregida',8:'El comprobante de apertura y la factura del vehículo cargado'};
    var cur=0, tiq=false, visto=false, sub=$('escSub'), prog=$('escProg'), tit=$('escTit'), bPlay=$('escPlay'), bTiq=$('escTiq');
    ESC.forEach(function(e,i){ var li=document.createElement('li'); li.innerHTML='<button type="button"><span class="n">0'+(i+1)+'</span><b></b><small></small></button>';
      li.querySelector('b').textContent=e.t; li.querySelector('small').textContent=e.s;
      li.firstChild.addEventListener('click',function(){ cargar(i,false,true); }); lista.appendChild(li); });
    function cargar(i,deTiq,usuario){
      cur=i; tiq=!!deTiq; var n=i+1;
      var nom=(tiq?'tiquete-':'escena-')+n+'.mp4', pedido=cur+'-'+tiq; vid.poster=tiq?'':RAIZ+'media/escena-'+n+'.jpg';
      video(nom).then(function(u){ if(cur+'-'+tiq!==pedido) return; vid.src=u; if(usuario||visto){ var p=vid.play(); if(p&&p.catch) p.catch(function(){}); } });
      if(ESC[i].tiq && !tiq) video('tiquete-'+n+'.mp4');
      tit.textContent=(tiq?'Tiquete de cerca · ':'')+ESC[i].t;
      [].forEach.call(lista.children,function(li,k){ li.classList.toggle('act',k===i); });
      bTiq.hidden=!ESC[i].tiq; bTiq.textContent=tiq?'Volver a la pantalla':'Ver el tiquete impreso';
      sub.classList.remove('ver'); sub.textContent='';
      if(usuario && innerWidth<960) $('escenas').querySelector('.cs-monitor').scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'start'});
    }
    vid.addEventListener('timeupdate',function(){
      var c=tiq?[[0,TIQ[cur+1]||'']]:ESC[cur].c, t=vid.currentTime, s='';
      for(var i=0;i<c.length;i++) if(t>=c[i][0]) s=c[i][1];
      if(s!==sub.textContent){ sub.textContent=s; } sub.classList.toggle('ver',!!s);
      if(vid.duration) prog.style.width=(t/vid.duration*100).toFixed(2)+'%';
    });
    vid.addEventListener('ended',function(){ if(tiq){ cargar(cur,false,false); } else cargar((cur+1)%ESC.length,false,false); });
    vid.addEventListener('play',function(){ bPlay.textContent='Pausar'; bPlay.setAttribute('aria-label','Pausar'); });
    vid.addEventListener('pause',function(){ bPlay.textContent='Reproducir'; bPlay.setAttribute('aria-label','Reproducir'); });
    bPlay.addEventListener('click',function(){ if(vid.paused){ var p=vid.play(); if(p&&p.catch) p.catch(function(){}); } else vid.pause(); });
    bTiq.addEventListener('click',function(){ cargar(cur,!tiq,true); });
    vid.style.cursor='pointer'; vid.addEventListener('click',function(){ bPlay.click(); });
    cargar(0,false,false);
     
    aVista($('escenas'),function(si){ if(si) precargar(['escena-1.mp4','escena-2.mp4','escena-3.mp4','escena-4.mp4','escena-5.mp4','escena-6.mp4','escena-7.mp4','escena-8.mp4']); },{rootMargin:'100% 0px'});
    aVista(vid,function(si){ if(si){ if(!visto && !REDUCE){ visto=true; var p=vid.play(); if(p&&p.catch) p.catch(function(){}); } } else if(!vid.paused){ vid.pause(); visto=false; } },{threshold:.4});
  })();

   
  (function(){
    var inp=$('ciegoIn'), btn=$('ciegoBtn'), res=$('ciegoRes'); if(!inp) return;
    var ESPERADO=460000;
    inp.addEventListener('input',function(){ var d=inp.value.replace(/\D/g,'').slice(0,9); inp.value=d?Number(d).toLocaleString('es-CO').replace(/,/g,'.'):''; });
    function cerrar(){
      var v=Number(inp.value.replace(/\D/g,'')); if(!inp.value){ inp.focus(); return; }
      var dif=v-ESPERADO; res.hidden=false; res.className='cs-res '+(dif===0?'ok':dif<0?'mal':'sobra');
      res.textContent = dif===0 ? 'Cuadró al peso. Al dueño le llega: «Cierre de turno: esperado $ 460.000, contado $ 460.000».'
        : (dif<0?'Faltan ':'Sobran ')+pesos(Math.abs(dif))+'. El aviso le llega al dueño en ese instante, no el viernes. Hoy mismo se pregunta y se resuelve.';
      var f=$('filaNueva'); f.hidden=false; $('fnCont').textContent=pesos(v);
      var r=$('fnRes'); r.textContent=dif===0?'Cuadró':(dif<0?'− ':'+ ')+pesos(Math.abs(dif)); r.className=dif===0?'ok':dif<0?'mal':'sobra';
      f.style.animation='none'; void f.offsetWidth; f.style.animation='';
    }
    btn.addEventListener('click',cerrar);
    inp.addEventListener('keydown',function(e){ if(e.key==='Enter') cerrar(); });
  })();

   
  (function(){
    var box=$('tgMsgs'), otra=$('tgReplay'); if(!box) return;
    var D=[
      ['Turno de día abierto · 10:00 a. m.\nOperario: Carlos · Base inicial confirmada: $ 200.000','10:00',''],
      ['Transferencia recibida: $ 12.000 (placa DEM-456)\n¿Llegó a su cuenta?','11:37','conf'],
      ['¿Cuánto va hoy?','1:05','yo'],
      ['Hoy: 47 vehículos · $ 391.500\nEfectivo: $ 344.500 · Transferencias: $ 47.000\nEn patio ahora: 12 vehículos','1:05',''],
      ['Anulación de factura: requiere su autorización\nMotivo del operario: «el cliente pagó dos veces»','3:22','aut'],
      ['Cierre de turno con arqueo · 7:00 p. m.\nEsperado: $ 512.000 · Contado: $ 512.000\nCuadró al peso','7:02','']
    ];
    var timers=[];
    function botones(tipo){ var c=document.createElement('div'); c.className='cs-botones';
      var si=document.createElement('button'), no=document.createElement('button'); si.type=no.type='button'; si.className='si';
      si.textContent=tipo==='conf'?'Sí llegó':'Autorizar'; no.textContent=tipo==='conf'?'No llegó':'Negar';
      function fin(txt){ c.innerHTML=''; var h=document.createElement('button'); h.type='button'; h.className='hecho'; h.textContent=txt; h.disabled=true; c.appendChild(h); }
      si.addEventListener('click',function(){ fin(tipo==='conf'?'Confirmada · queda registrado':'Autorizada · queda registrado'); });
      no.addEventListener('click',function(){ fin(tipo==='conf'?'Marcada «no llegó» · queda registrado':'Negada · queda registrado'); });
      c.appendChild(si); c.appendChild(no); return c; }
    function play(){ timers.forEach(clearTimeout); timers=[]; box.innerHTML='';
      D.forEach(function(m,i){ timers.push(setTimeout(function(){
        var d=document.createElement('div'); d.className='cs-msg'+(m[2]==='yo'?' yo':'')+(m[2]==='aut'||m[2]==='conf'?' alerta':'');
        var tx=document.createElement('div'); tx.textContent=m[0]; d.appendChild(tx);
        if(m[2]==='conf'||m[2]==='aut') d.appendChild(botones(m[2]));
        var h=document.createElement('span'); h.className='hora'; h.textContent=m[1]; d.appendChild(h);
        box.appendChild(d); box.scrollTop=box.scrollHeight;
        requestAnimationFrame(function(){ requestAnimationFrame(function(){ d.classList.add('ver'); }); });
      }, REDUCE?0:i*900)); }); }
    var hecho=false;
    aVista(box,function(si){ if(si&&!hecho){ hecho=true; play(); } },{threshold:.3});
    otra.addEventListener('click',play);
  })();

   
  (function(){
    var cont=$('eslabones'), cad=$('cad'), btn=$('cadAlterar'), est=$('cadEst'); if(!cont) return;
     
    function sello(s){ var h1=0x811c9dc5, h2=0x01000193; for(var i=0;i<s.length;i++){ h1^=s.charCodeAt(i); h1=Math.imul(h1,16777619)>>>0; h2=Math.imul(h2^h1,2246822507)>>>0; }
      return ('00000000'+h1.toString(16)).slice(-8)+('00000000'+h2.toString(16)).slice(-8); }
    var EV=['Apertura de turno · base $ 200.000','Entrada · placa DEM-123','Salida · $ 8.000 efectivo','Gasto · papel impresora $ 15.000','Transferencia · $ 12.000','Salida · $ 4.500 mixto','Cierre de turno · arqueo'];
    var alterado=false, cual=2;
    var CAMBIO=['Apertura de turno · base $ 150.000','Entrada · placa XXX-000','Salida · $ 3.000 efectivo','Gasto · papel impresora $ 45.000','Transferencia · $ 2.000','Salida · $ 500 mixto','Cierre de turno · sin arqueo'];
    function pintar(){
      cont.innerHTML=''; var orig=[], p2='00000000000000000';
      EV.forEach(function(ev){ var h=sello(p2+'|'+ev); orig.push(h); p2=h; });
      EV.forEach(function(ev,i){
        var txt=(alterado&&i===cual)?CAMBIO[i]:ev, h=alterado&&i===cual?sello((i?orig[i-1]:'00000000000000000')+'|'+txt):orig[i];
        var d=document.createElement('div'); d.className='cs-esl'+(alterado&&i===cual?' roto':'')+(alterado&&i>cual?' tras':'')+(i===EV.length-1&&!alterado?' sello':''); d.style.setProperty('--i',i);
        d.innerHTML='<div class="bl"><span class="num">REGISTRO '+String(i+1).padStart(2,'0')+'</span><span class="ev"></span><span class="h prev">← '+(i?orig[i-1].slice(0,10):'inicio')+'</span><span class="h">'+h.slice(0,16)+'</span></div><i class="link"></i>';
        d.querySelector('.ev').textContent=txt; d.querySelector('.bl').title='Intentar cambiar este registro'; d.addEventListener('click',function(){ cual=i; alterado=true; pintar(); cad.classList.add('in'); }); cont.appendChild(d);
      });
      est.className='cs-cad-est'+(alterado?' mal':''); est.lastChild.textContent=alterado?'Cadena rota en el registro '+String(cual+1).padStart(2,'0')+': el sistema lo delata':'Cadena íntegra';
      btn.textContent=alterado?'Volver a la cadena íntegra':'Intentar cambiar un registro';
    }
    est.innerHTML='<i></i>'; est.appendChild(document.createTextNode(''));
    btn.addEventListener('click',function(){ alterado=!alterado; pintar(); cad.classList.add('in'); if(alterado){ var r=cont.children[cual]; if(r) cont.scrollTo({left:Math.max(0,r.offsetLeft-20),behavior:REDUCE?'auto':'smooth'}); } });
    pintar();
    aVista(cad,function(si){ if(si) cad.classList.add('in'); },{threshold:.2});
  })();

   
  (function(){
    var sec=$('proyeccion'), fondo=$('fondo'), info=$('maqInfo'); if(!fondo||!sec) return;
    var pie=$('maq'); if(pie) sec.appendChild(pie);    
    var f=null, MAQ=null, cx=13.9, cupos=0, raf=0, t0=performance.now(), visible=false;
    var PARTES={
      piso2:['Piso 2','Salón corrido de 27,8 × 20 m (≈ 556 m²). Puede ser bar con mini-bolos, restaurante, trampolines o canchas de pádel.'],
      locales:['Locales del piso 1','6 locales al frente: 2 de 5,0 × 10 m y 4 de 3,0 × 10 m, contando el corresponsal de la esquina.'],
      corresponsal:['Corresponsal en la esquina','Local de 5,0 × 10 m en la esquina del lote.'],
      caseta:['Caseta del operario','A 6 m del acceso, que mide 5,80 m. Ahí está la caja, y una cámara mira la ventanilla.'],
      camaras:['Cámaras','5 cámaras: lectura de placas en el acceso, caja, 2 en el patio y lavadero.'],
      patio:['Patio','CUPOS cupos demarcados.'],
      lavadero:['Lavadero','2 bahías techadas al fondo del lote.'],
      columnas:['Columnas del piso 2','Sostienen el piso 2, bajan al patio y ocupan algunos cupos.']
    };
    var ORDEN=['piso2','locales','corresponsal','caseta','camaras','patio','lavadero','columnas'];
    var A={az:-3.0, alt:.6, dist:78, tz:22, ty:3}, B={az:-2.0, alt:.38, dist:62, tz:20, ty:4};
    var mx=0, my=0, tx=0, ty=0, giro=0, ult=0, dedo=null, arrastre=0, apuntada=null, tour=0, tourT=0, quietoHasta=0, enCursor=false;
    function suave(t){ return t*t*(3-2*t); }
    function mostrar(parte, x, y){
      if(!parte||!PARTES[parte]){ info.hidden=true; return; }
      info.querySelector('b').textContent=PARTES[parte][0];
      info.querySelector('span').textContent=PARTES[parte][1].replace('CUPOS', cupos?('~'+cupos):'Los');
      info.hidden=false;
      var w=info.offsetWidth, h=info.offsetHeight, W=sec.clientWidth, H=sec.clientHeight;
      var hd=sec.querySelector('.sec-head'), techo=hd? hd.getBoundingClientRect().bottom-sec.getBoundingClientRect().top+10 : 12;    
      info.style.left=Math.max(12,Math.min(W-w-12,x+18))+'px'; info.style.top=Math.max(techo,Math.min(H-h-12,y-h-18))+'px';
    }
    function cuadro(now){
      raf=0; if(!MAQ||!visible||document.hidden) return;
      var r=sec.getBoundingClientRect(), p=Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight+r.height))), t=suave(p), v={};
      for(var k in A) v[k]=A[k]+(B[k]-A[k])*t;
      mx+=(tx-mx)*.06; my+=(ty-my)*.06;
      var dt=ult?Math.min(.1,(now-ult)/1000):0; ult=now;
      if(!REDUCE && !enCursor && dedo===null) giro+=dt*.05;    
      v.az+=giro+arrastre+mx*Math.PI;     v.alt=Math.min(1.3,Math.max(.12,v.alt-my*.18));
      if(innerWidth<700) v.dist*=1.6;
      v.tx=cx; MAQ.ir(v);
       
      if(!enCursor && now>quietoHasta){
        if(now-tourT>3800 || !apuntada){ tourT=now; apuntada=ORDEN[tour++%ORDEN.length]; MAQ.resaltar(apuntada); }
        var a=MAQ.anclaDe(apuntada); if(a) mostrar(apuntada,a.x,a.y); else info.hidden=true;
      }
      raf=requestAnimationFrame(cuadro);
    }
    function arrancar(){ if(!raf&&visible&&MAQ) raf=requestAnimationFrame(cuadro); }
    function señalar(e){
      var r=sec.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top;
      tx=(x/r.width)*2-1; ty=(y/r.height)*2-1;
      if(!MAQ) return;
      var p=MAQ.apuntar(x,y); apuntada=p;
      if(p) mostrar(p,x,y); else info.hidden=true;
    }
    sec.addEventListener('pointermove',function(e){
      if(e.pointerType==='touch'){ if(dedo!==null){ arrastre+=(e.clientX-dedo)/sec.clientWidth*2*Math.PI; dedo=e.clientX; } return; }
      enCursor=true; señalar(e); },{passive:true});
     
    sec.addEventListener('pointerdown',function(e){ if(e.pointerType==='touch'){ dedo=e.clientX; quietoHasta=performance.now()+6000; } },{passive:true});
    ['pointerup','pointercancel'].forEach(function(t){ sec.addEventListener(t,function(e){ if(e.pointerType==='touch') dedo=null; },{passive:true}); });
    sec.addEventListener('pointerleave',function(){ enCursor=false; tx=ty=0; quietoHasta=performance.now()+1200; tourT=0; });
    sec.addEventListener('click',function(e){ if(e.target.closest('a,button')) return; señalar(e); quietoHasta=performance.now()+6000; enCursor=false; });
    addEventListener('message',function(e){ if(e.data&&e.data.maqueta==='lista'&&f){ try{ MAQ=f.contentWindow.MAQ; cx=MAQ.cx; cupos=MAQ.cupos; mideMaq(); }catch(_){} fondo.classList.add('lista'); arrancar(); } });
    function cargar(){ if(f) return; f=document.createElement('iframe'); f.title='Maqueta 3D del lote proyectado'; f.tabIndex=-1;
      f.addEventListener('load',function(){ mideMaq(); setTimeout(mideMaq,300); });
      f.src=RAIZ+'maqueta.html?fondo&v='+((/[?&]v=([^&]+)/.exec(CASO_SRC)||[])[1]||'1'); fondo.insertBefore(f, fondo.firstChild); }
     
    function mideMaq(){ if(f&&f.contentWindow) try{ f.contentWindow.dispatchEvent(new f.contentWindow.Event('resize')); }catch(_){} }
    if('ResizeObserver' in window) new ResizeObserver(mideMaq).observe(sec);
    aVista(sec,function(si){ if(si) cargar(); },{rootMargin:'100% 0px'});
    aVista(sec,function(si){ visible=si; if(si) arrancar(); },{threshold:0});
    document.addEventListener('visibilitychange',arrancar);
  })();

   
  (function(){
    [].forEach.call(document.querySelectorAll('[data-ir]'),function(el){ el.style.cursor='pointer';
      el.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); el.click(); } });
      el.addEventListener('click',function(e){ if(e.target.closest('a,button,input')&&e.target.closest('a,button,input')!==el) return; e.preventDefault(); var esc=el.getAttribute('data-escena'); irA(el.getAttribute('data-ir'));
        if(esc){ var b=document.querySelectorAll('#escLista button')[+esc-1]; if(b) setTimeout(function(){ b.click(); },REDUCE?0:500); } }); });
     
    var h=location.hash.slice(1); if(h && $(h)) addEventListener('load',function(){ setTimeout(function(){ var d=$(h); if(d) d.scrollIntoView({behavior:'instant',block:'start'}); },150); });
    var p2=document.querySelector('.cs-pasos li:nth-child(2)'); if(p2){ p2.style.cursor='pointer'; p2.addEventListener('click',function(){ var i=$('ciegoIn'); if(i) i.focus(); }); }
  })();
})();

 
(function(){
  var CUERPO = "Hola, JLA. Quiero cotizar el sistema para mi parqueadero.\n\n" +
    "Nombre del parqueadero:\nCiudad:\nCuántos cupos tiene:\nCuántos turnos y operarios:\nCómo controla hoy la caja:\nTeléfono de contacto:\n";
  var mailto = "mailto:jlautomatization@gmail.com?subject=" + encodeURIComponent("Cotización: sistema para parqueadero") + "&body=" + encodeURIComponent(CUERPO);
  function poner(){ document.querySelectorAll('[data-cotice], #contacto [data-correo]').forEach(function(el){ el.setAttribute('href', mailto); }); }
  poner(); document.addEventListener('DOMContentLoaded', poner);
})();

 
(function(){
  var V1_PERFILES = { dueno:'media/v1-provisional.mp4', ausente:'media/v1-provisional.mp4', funciona:'media/v1-provisional.mp4' };
  var vid=document.getElementById('v1Vid'), caja=document.getElementById('v1Perfil'), otro=document.getElementById('v1Otro');
  if(!vid||!caja) return;
  [].forEach.call(caja.querySelectorAll('[data-perfil]'),function(b){
    b.addEventListener('click',function(){
      vid.src=V1_PERFILES[b.getAttribute('data-perfil')]; caja.hidden=true; if(otro) otro.hidden=false;
      var p=vid.play(); if(p&&p.catch) p.catch(function(){});
    });
  });
  if(otro) otro.querySelector('button').addEventListener('click',function(){ vid.pause(); caja.hidden=false; otro.hidden=true; var f=caja.querySelector('button'); if(f) f.focus(); });
})();

 
(function(){
  var sec=document.getElementById('hx'), med=sec&&sec.querySelector('.hx-media'), v=document.getElementById('hxVid'); if(!v) return;
  var quieto=matchMedia('(prefers-reduced-motion: reduce)').matches, alto=matchMedia('(max-width: 899px)'), actual='';
  function pon(){ var n=alto.matches?'hero-1x1':'hero-16x9'; if(n===actual) return; actual=n;
    med.style.backgroundImage='url('+RAIZ+'media/'+n+'.jpg)';
    if(quieto) return; v.classList.remove('lista'); v.src=RAIZ+'media/'+n+'.mp4'; v.load(); var p=v.play(); if(p&&p.catch) p.catch(function(){}); }
  v.addEventListener('playing',function(){ v.classList.add('lista'); });
  pon(); if(alto.addEventListener) alto.addEventListener('change',pon);
  if(!quieto && 'IntersectionObserver' in window) new IntersectionObserver(function(e){ if(e[0].isIntersecting){ var p=v.play(); if(p&&p.catch) p.catch(function(){}); } else v.pause(); }).observe(sec);
  if(quieto) return; var pend=false;
  function mueve(){ pend=false; var p=Math.min(1,Math.max(0,scrollY/(sec.offsetHeight||1))); sec.style.setProperty('--p',p.toFixed(3)); }
  addEventListener('scroll',function(){ if(!pend){ pend=true; requestAnimationFrame(mueve); } },{passive:true}); mueve();
})();


 
(function(){
  var quieto=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function juega(v){ if(quieto) return; if(!v.src && v.dataset.src){ v.src=v.dataset.src; } var p=v.play(); if(p&&p.catch) p.catch(function(){}); }

   
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ var v=e.target;
      if(e.isIntersecting){ if(!v.closest('.nx')||v.classList.contains('on')) juega(v); } else if(!v.paused) v.pause(); }); },{rootMargin:'200px 0px'});
    [].forEach.call(document.querySelectorAll('.mx-vid video, .nx-vid'),function(v){ io.observe(v); });
  }

   
  var nx=document.getElementById('noche');
  if(nx){
    var pasos=nx.querySelectorAll('.nx-paso'), vids=nx.querySelectorAll('.nx-vid'), avisos=nx.querySelectorAll('.nx-aviso'), actual=0;
    var pon=function(i){ if(i===actual) return; actual=i;
      for(var k=0;k<3;k++){ var on=k===i; pasos[k].classList.toggle('on',on); vids[k].classList.toggle('on',on); avisos[k].classList.toggle('on',on);
        if(on) juega(vids[k]); else if(!vids[k].paused) vids[k].pause(); } };
    var mideNx=function(){ var r=nx.getBoundingClientRect(), largo=r.height-innerHeight, p=Math.min(1,Math.max(0,-r.top/(largo||1)));
      var i=Math.min(2,Math.floor(p*3)); pon(i);
      for(var k=0;k<3;k++){ var f=Math.min(1,Math.max(0,p*3-k)); pasos[k].querySelector('.nx-barra i').style.setProperty('--f',f.toFixed(3)); } };
  }

   
  var ruta=document.getElementById('pxRuta'), tramos=ruta?ruta.querySelectorAll('.px-tramo i'):[];
  var mideRuta=function(){ if(!ruta) return; var r=ruta.getBoundingClientRect(), alto=innerHeight;
     
    var y=alto*0.6-r.top;
    [].forEach.call(tramos,function(t){ var li=t.parentNode.parentNode, a=li.offsetTop, h=li.offsetHeight, f=Math.min(1,Math.max(0,(y-a)/h)); t.style.setProperty('--f',quieto?1:f.toFixed(3)); }); };

  var pend=false;
  function mide(){ pend=false; if(nx) mideNx(); mideRuta(); }
  addEventListener('scroll',function(){ if(!pend){ pend=true; requestAnimationFrame(mide); } },{passive:true});
  addEventListener('resize',mide); mide();
})();

 
(function(){
  'use strict';
  var quieto=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id){ return document.getElementById(id); }
  function pesos(n){ return '$ '+Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.'); }
  function juega(v){ if(quieto) return; var p=v.play(); if(p&&p.catch) p.catch(function(){}); }

   
  var vj=$('viaje');
  if(vj){
    var esc=vj.querySelector('.vj-escena'), pasos=vj.querySelectorAll('.vj-paso'), vids=vj.querySelectorAll('.vj-vid'), sub=vj.querySelector('.vj-sub'),
        mt=vj.querySelector('.vj-mt'), msgs=vj.querySelectorAll('.vj-msgs .cs-msg'), N=pasos.length, actual=-1, timers=[], cargados=false, enVista=false;
     
    var SUBS=[
      [[15,'Registra la entrada de un vehículo nuevo: elige el tipo'],[21,'Escribe la placa y el sistema imprime el tiquete']],
      [[0,'El operario escribe la placa del vehículo que sale'],[5,'Elige el tipo de pago: efectivo, transferencia o mixto'],[9,'Si es mixto, reparte el valor entre efectivo y transferencia'],[15,'Se cobra y el sistema queda listo para el siguiente vehículo']],
      [[0,'Al cerrar el turno, el operario cuenta el efectivo SIN ver el valor esperado'],[3,'El sistema compara en vivo: aquí sobraron $ 300.000 sobre la base']]
    ];
    var TIT=['Registrar entrada','Registrar salida','Cierre de turno'];
    function carga(){ if(cargados) return; cargados=true;
      [].forEach.call(vids,function(v){ var ini=+v.dataset.ini||0;
        v.addEventListener('loadedmetadata',function(){ if(ini) v.currentTime=ini; },{once:true});
        v.addEventListener('ended',function(){ v.currentTime=ini; if(v.classList.contains('on')&&enVista) juega(v); });
        v.preload='auto'; v.src=v.dataset.src; });
      if(actual>=0&&actual<3&&enVista) juega(vids[actual]); }
    function chat(on){ timers.forEach(clearTimeout); timers=[];
      [].forEach.call(msgs,function(m,k){ if(!on){ m.classList.remove('ver'); return; } timers.push(setTimeout(function(){ m.classList.add('ver'); },quieto?0:350+k*850)); }); }
    function pon(i){ if(i===actual) return; actual=i; esc.setAttribute('data-p',i);
      for(var k=0;k<N;k++) pasos[k].classList.toggle('on',k===i);
      [].forEach.call(vids,function(v,k){ var on=k===i; v.classList.toggle('on',on); if(on){ if(cargados&&enVista) juega(v); } else if(!v.paused) v.pause(); });
      if(i<TIT.length) mt.textContent=TIT[i];
      sub.classList.remove('ver'); sub.textContent='';
      chat(i===3);
      if(i===0&&!quieto){ esc.classList.remove('imprime'); void esc.offsetWidth; esc.classList.add('imprime'); }
    }
    [].forEach.call(vids,function(v,k){ v.addEventListener('timeupdate',function(){ if(k!==actual) return;
      var c=SUBS[k], t=v.currentTime, s=''; for(var j=0;j<c.length;j++) if(t>=c[j][0]) s=c[j][1];
      if(s!==sub.textContent) sub.textContent=s; sub.classList.toggle('ver',!!s); }); });
    function mide(){ var r=vj.getBoundingClientRect(), largo=r.height-innerHeight, p=Math.min(1,Math.max(0,-r.top/(largo||1)));
      pon(Math.min(N-1,Math.floor(p*N)));
      for(var k=0;k<N;k++){ var f=Math.min(1,Math.max(0,p*N-k)); pasos[k].querySelector('.vj-barra i').style.setProperty('--f',f.toFixed(3)); } }
     
    [].forEach.call(pasos,function(li,k){ li.addEventListener('click',function(){
      var top=vj.getBoundingClientRect().top+scrollY, largo=vj.offsetHeight-innerHeight;
      scrollTo({top:top+largo*(k+.5)/N,behavior:quieto?'auto':'smooth'}); }); });
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(e){ if(e[0].isIntersecting) carga(); },{rootMargin:'100% 0px'}).observe(vj);
      new IntersectionObserver(function(e){ enVista=e[0].isIntersecting;
        if(enVista){ if(cargados&&actual<3) juega(vids[actual]); } else [].forEach.call(vids,function(v){ if(!v.paused) v.pause(); }); }).observe(vj);
    } else { enVista=true; carga(); }
    var pend=false;
    addEventListener('scroll',function(){ if(!pend){ pend=true; requestAnimationFrame(function(){ pend=false; mide(); }); } },{passive:true});
    addEventListener('resize',mide); mide();
  }

   
  var inp=$('cgIn');
  if(inp){
    var ESPERADO=460000, esp=$('cgEsp'), res=$('cgRes'), av=$('cgAviso'), otra=$('cgOtra'), avT=0;
    function formato(){ var d=inp.value.replace(/\D/g,'').slice(0,9); inp.value=d?pesos(+d).slice(2):''; }
    function cerrar(){
      if(!inp.value){ inp.focus(); return; }
      var v=+inp.value.replace(/\D/g,''), dif=v-ESPERADO;
      $('cgBtn').parentNode.classList.add('cg-hecho');    
      [].forEach.call(document.querySelectorAll('.cg-rap button'),function(b){ b.classList.toggle('sel',+b.dataset.v===v); });
      esp.classList.remove('ver'); void esp.offsetWidth; esp.classList.add('ver');
      res.hidden=false; res.className='cg-res '+(dif===0?'ok':dif<0?'mal':'sobra'); res.style.animation='none'; void res.offsetWidth; res.style.animation='';
      $('cgDif').textContent=dif===0?'Cuadró al peso.':(dif<0?'Faltan ':'Sobran ')+pesos(Math.abs(dif))+'.';
      clearTimeout(avT); av.hidden=true;
      avT=setTimeout(function(){ av.hidden=false; av.style.animation='none'; void av.offsetWidth; av.style.animation='';
        $('cgAvTx').textContent='Cierre de turno: esperado '+pesos(ESPERADO)+' · contado '+pesos(v)+(dif===0?' · cuadró al peso':' · '+(dif<0?'faltan ':'sobran ')+pesos(Math.abs(dif)));
         
        var r=av.getBoundingClientRect(); if(r.bottom>innerHeight-20) scrollBy({top:r.bottom-innerHeight+90,behavior:quieto?'auto':'smooth'}); },quieto?0:700);
      otra.hidden=false;
    }
    inp.addEventListener('input',formato);
    inp.addEventListener('keydown',function(e){ if(e.key==='Enter') cerrar(); });
    $('cgBtn').addEventListener('click',cerrar);
    [].forEach.call(document.querySelectorAll('.cg-rap button'),function(b){ b.addEventListener('click',function(){ inp.value=pesos(+b.dataset.v).slice(2); cerrar(); }); });
    otra.addEventListener('click',function(){ clearTimeout(avT); esp.classList.remove('ver'); [].forEach.call(document.querySelectorAll('.cg-rap .sel'),function(b){ b.classList.remove('sel'); }); res.hidden=av.hidden=otra.hidden=true; inp.value=''; });
  }

   
  var lista=$('ibLista');
  if(lista){
    var cad=$('ibCad'), sello=$('ibSello'), cont=$('ibInt'), intentos=0;
    var REG=[['TURNO','Apertura de turno · base $ 200.000'],['ENTRADA','Entrada · placa DEM-123'],['FACTURA','Salida · $ 8.000 efectivo'],
             ['GASTO','Gasto · papel impresora $ 15.000'],['TURNO','Cierre de turno · arqueo']];
    var BORRAR={TURNO:'INVIOLABLE: no se puede borrar un turno',ENTRADA:'INVIOLABLE: no se puede borrar una entrada',
                FACTURA:'INVIOLABLE: no se puede borrar una factura',GASTO:'INVIOLABLE: no se puede borrar un gasto'};
    var BOTE='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>';
    REG.forEach(function(r,i){
      var li=document.createElement('li'); li.className='ib-reg'; li.style.setProperty('--i',i);
      li.innerHTML='<span class="ib-nodo"></span><span class="ib-ev"></span><button type="button" class="ib-b">'+BOTE+'</button>';
      li.querySelector('.ib-ev').textContent=r[1];
      var b=li.querySelector('.ib-b'); b.setAttribute('aria-label','Intentar borrar: '+r[1]);
      b.addEventListener('click',function(){ intenta(li,BORRAR[r[0]]); });
      lista.appendChild(li); });
    function intenta(li,msg){
      intentos++; cont.textContent=intentos; cad.classList.add('ib-hecho');    
      [].forEach.call(lista.querySelectorAll('.ib-resp'),function(x){ x.remove(); });
      [].forEach.call(lista.querySelectorAll('.pista'),function(x){ x.classList.remove('pista'); });
      [].forEach.call(lista.querySelectorAll('.resiste'),function(x){ x.classList.remove('resiste'); });
      void li.offsetWidth; li.classList.add('resiste');
      var d=document.createElement('code'); d.className='ib-resp'; d.setAttribute('role','status'); d.textContent=msg; li.appendChild(d);
       
      var r=li.getBoundingClientRect(); if(r.bottom>innerHeight*.62) scrollBy({top:r.bottom-innerHeight*.5,behavior:quieto?'auto':'smooth'});
      cad.classList.remove('ib-on'); sello.classList.remove('on'); void cad.offsetWidth;
      setTimeout(function(){ cad.classList.add('ib-on'); sello.classList.add('on'); },quieto?0:450);
    }
     
    if('IntersectionObserver' in window) new IntersectionObserver(function(e,o){ if(e[0].isIntersecting){ o.disconnect();
      var b=lista.children[2]&&lista.children[2].querySelector('.ib-b'); if(b&&!intentos) b.classList.add('pista'); } },{threshold:.5}).observe(lista);
  }
})();

 
(function(){
  'use strict';
  var quieto=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id){ return document.getElementById(id); }
  var mf=$('plano'); if(!mf) return;
  var esc=mf.querySelector('.mf-escena'), pasos=mf.querySelectorAll('.vj-paso'), N=pasos.length, actual=-1, enVista=false;
  var SELLO=['Plano 01 · Cámaras','Plano 02 · Patio lleno','Plano 03 · Cobro y panel'];
  var NS='http://www.w3.org/2000/svg';
  function el(tag,at,padre){ var e=document.createElementNS(NS,tag); for(var k in at) e.setAttribute(k,at[k]); if(padre) padre.appendChild(e); return e; }
  var semilla=7; function azar(){ semilla=(semilla*16807)%2147483647; return (semilla-1)/2147483646; }    

   
  var patio=$('mfPatio'), autos=[], X0=74, W=50, H=64, FILAS=[70,134,258,322], TOTAL=40;
  FILAS.forEach(function(y){
    var d='M'+X0+' '+y+' H'+(X0+W*10)+' M'+X0+' '+(y+H)+' H'+(X0+W*10);
    for(var c=0;c<=10;c++) d+=' M'+(X0+c*W)+' '+y+' V'+(y+H);
    el('path',{d:d,'class':'mf-l mf-tenue',pathLength:1},patio); });
  el('path',{d:'M30 228 H66 M56 219 L66 228 L56 237','class':'mf-l',pathLength:1},patio);    
  var orden=[]; for(var i=0;i<TOTAL;i++) orden.push(i);
  for(i=TOTAL-1;i>0;i--){ var j=Math.floor(azar()*(i+1)), t=orden[i]; orden[i]=orden[j]; orden[j]=t; }
  orden.forEach(function(p){ var f=Math.floor(p/10), c=p%10,
      g=el('g',{transform:'translate('+(X0+c*W+W/2)+' '+(FILAS[f]+H/2)+')'},patio), a=el('g',{'class':'mf-auto'},g);
    el('rect',{x:-15,y:-23,width:30,height:46,rx:7},a); el('path',{d:'M-11 -9 Q0 -14 11 -9 M-11 12 Q0 15 11 12'},a); autos.push(a); });
  var lleno=-1;
   
  function llena(f){ var n=f<.5?Math.round(f/.5*36):(f<.75?36:36+Math.round((f-.75)/.25*4)); if(n===lleno) return; lleno=n;
    for(var k=0;k<TOTAL;k++) autos[k].classList.toggle('on',k<n);
    $('mfNum').innerHTML=Math.round(n*100/TOTAL)+'&nbsp;%';
    var q=TOTAL-n; $('mfCupos').textContent=q===0?'sin cupos':(q===1?'queda 1 cupo':'quedan '+q+' cupos');
    $('mfOcuB').style.transform='scaleX('+(n/TOTAL)+')';
    esc.classList.toggle('al90',n>=TOTAL*.9); esc.classList.toggle('al100',n>=TOTAL);
    $('mfAv1').classList.toggle('ver',n===36||n===TOTAL); $('mfAv1T').textContent=n>=TOTAL?'Patio al 100 %: no quedan cupos.':'Patio al 90 %: quedan 4 cupos.'; $('mfLleno').classList.toggle('on',n>=TOTAL); }

   
  var qr=$('mfQr'), Q=21, M=8, QX=0, QY=0;    
  function esquina(r,c){ return (r<8&&c<8)||(r<8&&c>12)||(r>12&&c<8); }
  [[0,0],[0,14],[14,0]].forEach(function(p){ var x=QX+p[1]*M, y=QY+p[0]*M;
    el('path',{d:'M'+(x+1)+' '+(y+1)+' H'+(x+7*M-1)+' V'+(y+7*M-1)+' H'+(x+1)+' Z','class':'mf-l',pathLength:1},qr);
    el('rect',{'class':'mf-qm',x:x+2*M,y:y+2*M,width:3*M,height:3*M,rx:2,style:'--k:'+(p[0]+p[1]+3)},qr); });
  for(var r=0;r<Q;r++) for(var c=0;c<Q;c++){ if(esquina(r,c)||azar()>=.48) continue;
    el('rect',{'class':'mf-qm',x:QX+c*M+1,y:QY+r*M+1,width:M-2,height:M-2,rx:1.5,style:'--k:'+(r+c)},qr); }
  var barras=$('mfBarras'), defs=el('defs',{},barras), gr=el('linearGradient',{id:'mfGrad',x1:0,y1:1,x2:0,y2:0},defs);
  el('stop',{offset:0,'stop-color':'#1F4E79'},gr); el('stop',{offset:.6,'stop-color':'#4A93D6'},gr); el('stop',{offset:1,'stop-color':'#9CC9F2'},gr);
  [.42,.55,.48,.7,.62,.9,.66].forEach(function(h,k){
    el('rect',{'class':'mf-bar',x:330+k*38,y:330-h*190,width:22,height:h*190,rx:3,fill:'url(#mfGrad)',style:'--k:'+k},barras); });

   
  var c0=mf.querySelector('.mf-c0'), foto=$('mfFotoCam'), lee=$('mfLee'), leeP=$('mfLeeP'), leeR=$('mfLeeR'), av0=$('mfAv0'),
      pls=mf.querySelectorAll('.mf-pl'), TIQ='DEM-123', ultima=TIQ, tocado=false, t0=[];
  function camara(pl){
    t0.forEach(clearTimeout); t0=[];
    c0.classList.remove('lee','ok','mal'); av0.classList.remove('ver'); lee.className='mf-lee';
    [].forEach.call(pls,function(b){ b.classList.remove('sel','ok','mal'); });
    foto.classList.remove('llega'); void foto.offsetWidth; if(!quieto) foto.classList.add('llega');
    t0.push(setTimeout(function(){ c0.classList.add('lee'); },quieto?0:1700));
    t0.push(setTimeout(function(){ var ok=pl===TIQ;
      c0.classList.add(ok?'ok':'mal');
      leeP.textContent=pl; leeR.textContent=ok?'Coincide':'No coincide'; lee.className='mf-lee ver '+(ok?'ok':'mal');
      if(tocado) [].forEach.call(pls,function(b){ if(b.dataset.pl===pl) b.classList.add('sel',ok?'ok':'mal'); });
      if(!ok) t0.push(setTimeout(function(){ av0.classList.add('ver'); },quieto?0:500));
    },quieto?0:2600));
  }
  [].forEach.call(pls,function(b){ b.addEventListener('click',function(){
    tocado=true; esc.classList.add('tocado'); ultima=b.dataset.pl; if(actual===0) camara(ultima); }); });

  function pon(i){ if(i===actual) return; actual=i; esc.setAttribute('data-p',i);
    for(var k=0;k<N;k++) pasos[k].classList.toggle('on',k===i);
    $('mfSelloT').textContent=SELLO[i];
    if(i===0&&enVista) camara(ultima); else { t0.forEach(clearTimeout); t0=[]; } }
  function mide(){ var rc=mf.getBoundingClientRect(), largo=rc.height-innerHeight, p=Math.min(1,Math.max(0,-rc.top/(largo||1)));
    pon(Math.min(N-1,Math.floor(p*N)));
    for(var k=0;k<N;k++){ var f=Math.min(1,Math.max(0,p*N-k)); pasos[k].querySelector('.vj-barra i').style.setProperty('--f',f.toFixed(3)); }
    llena(Math.min(1,Math.max(0,(p*N-1)/.8))); }    
   
  [].forEach.call(pasos,function(li,k){ li.addEventListener('click',function(){
    var top=mf.getBoundingClientRect().top+scrollY, largo=mf.offsetHeight-innerHeight;
    scrollTo({top:top+largo*(k+(k===1?.85:.5))/N,behavior:quieto?'auto':'smooth'}); }); });
   
  function vista(v){ if(v===enVista) return; enVista=v; esc.classList.toggle('vivo',v);
    if(v&&actual===0) camara(ultima); if(!v){ t0.forEach(clearTimeout); t0=[]; } }
  if('IntersectionObserver' in window) new IntersectionObserver(function(e){ vista(e[0].isIntersecting); },{threshold:.15}).observe(esc);
  else vista(true);
  var pend=false;
  addEventListener('scroll',function(){ if(!pend){ pend=true; requestAnimationFrame(function(){ pend=false; mide(); }); } },{passive:true});
  addEventListener('resize',mide); mide();
})();

 
(function(){
  'use strict';
  var quieto=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(id){ return document.getElementById(id); }
  var sec=$('etapa'); if(!sec) return;
  var fijo=sec.querySelector('.lt-fijo'), caja=$('ltFondo'), pasos=sec.querySelectorAll('.vj-paso'), N=pasos.length;
  var cF=$('ltCF'), cL=$('ltCL'), cA=$('ltCA'), usos=sec.querySelectorAll('.lt-uso'), vuelta=$('ltVuelta');
  var SELLO=['Plano 01 · El terreno','Plano 02 · Piso 1','Plano 03 · Piso 2','Plano 04 · Acceso','Render · Terminado'];
  var foto=$('ltFoto'), fotoPedida=false, giroFin=0;
  var f=null, MAQ=null, q=0, actual=-1, giro=0, deriva=0, enVista=false, raf=0, ult=0, resaltada=null;
  function lim(x){ return Math.max(0,Math.min(1,x)); }
  function suave(t){ return t*t*(3-2*t); }

   
   
  var K=[{q:.5, az:2.72,alt:1.02,dist:86,ty:0,  tz:23,m:1.12},
         {q:1.5,az:3.55,alt:.30, dist:50,ty:2.4,tz:6, m:1.2},
         {q:2.5,az:3.98,alt:.72, dist:62,ty:4,  tz:12,m:1.15},
         {q:3.3,az:3.36,alt:.16, dist:40,ty:2.2,tz:6, m:1.9},
         {q:3.95,az:4.85,alt:.62,dist:76,ty:1.5,tz:25,m:1.15},
          
         {q:4.75,az:3.76,alt:.15,dist:54,ty:5,  tz:14,m:1.25}];
  function toma(){ var i=0; while(i<K.length-2&&q>K[i+1].q) i++;
    var a=K[i], b=K[i+1], t=suave(lim((q-a.q)/(b.q-a.q))), v={};
    for(var k in a) if(k!=='q') v[k]=a[k]+(b[k]-a[k])*t;
    var m=v.m, rk=real(); delete v.m;
     
    v.az+=(giro+deriva)*(1-rk)+giroFin+(quieto?0:Math.min(q,4)*.04); v.tx=MAQ.cx;
    if(caja.clientWidth<caja.clientHeight*1.1) v.dist*=m;    
    return v; }

  function pega(el, p, ver){ if(!p||p.atras){ el.classList.remove('ver'); return; }
    el.style.left=(caja.offsetLeft+p.x)+'px'; el.style.top=(caja.offsetTop+p.y)+'px'; el.classList.toggle('ver',!!ver); }

  function real(){ return suave(lim((q-4.05)/.65)); }
  function pinta(){
    if(!MAQ) return;
    MAQ.cotas(lim((q+.1)/.45));    
    MAQ.levantar('locales',lim((q-1)/.7));      MAQ.levantar('corresponsal',lim((q-1.1)/.7));
    MAQ.levantar('piso2',lim((q-2)/.7));        MAQ.levantar('columnas',lim((q-2.05)/.6));
    MAQ.levantar('caseta',lim((q-3)/.5));       MAQ.levantar('camaras',lim((q-3.15)/.5));   MAQ.levantar('lavadero',lim((q-3.3)/.5));
    var r=(q>=1.8&&q<2.7)?'corresponsal':null; if(r!==resaltada){ resaltada=r; MAQ.resaltar(r); }
    MAQ.ir(toma());
    pega(cF, MAQ.punto(MAQ.cx,.1,-1.7), q>=.3&&q<1.2);
    pega(cL, MAQ.punto(MAQ.W+1.7,.1,MAQ.D/2), q>=.3&&q<1.2);
    pega(cA, MAQ.punto(MAQ.cx,3,0), q>=3.25&&q<4.05);
    var rk=real(); MAQ.real(rk); fijo.style.setProperty('--real',rk.toFixed(3));
    if(q>3.6&&!fotoPedida) pideFoto();
    fijo.style.setProperty('--foto',(suave(lim((q-4.72)/.2))*Math.max(0,1-Math.abs(giroFin)*3)).toFixed(3));
  }
   
  function pideFoto(){ fotoPedida=true; if(!foto) return; var img=foto.querySelector('img'), src=foto.querySelector('source');
    if(src) src.srcset=src.getAttribute('data-srcset');
    img.onload=function(){ foto.classList.add('ok'); }; img.onerror=function(){ foto.classList.remove('ok'); };
    img.src=img.getAttribute('data-src'); }
  function pon(i){ if(i===actual) return; actual=i; fijo.setAttribute('data-p',i);
    for(var k=0;k<N;k++) pasos[k].classList.toggle('on',k===i);
    $('ltSelloT').textContent=SELLO[i]; }
  function mide(){ var rc=sec.getBoundingClientRect(), largo=rc.height-innerHeight, p=lim(-rc.top/(largo||1));
    q=p*N; pon(Math.min(N-1,Math.floor(q))); if(q<4.7) giroFin=0;
    for(var k=0;k<N;k++) pasos[k].querySelector('.vj-barra i').style.setProperty('--f',lim(q-k).toFixed(3));
    pide(); }

   
  var quietoHasta=0;
  function cuadro(now){ raf=0; var dt=ult?Math.min(.1,(now-ult)/1000):0; ult=now;
    if(!quieto&&enVista&&q>=3.2&&q<4&&now>quietoHasta){ deriva+=dt*.08; pinta(); raf=requestAnimationFrame(cuadro); return; }
    ult=0; pinta(); }
  function pide(){ if(!raf) raf=requestAnimationFrame(cuadro); }

   
  var dedo=null;
  fijo.addEventListener('pointerdown',function(e){ if(e.target.closest('a,button')) return; dedo=e.clientX; quietoHasta=performance.now()+5000; },{passive:true});
  addEventListener('pointermove',function(e){ if(dedo===null) return; var d=(e.clientX-dedo)/Math.max(320,fijo.clientWidth)*2*Math.PI; dedo=e.clientX;
    if(q>=4.7) giroFin+=d; else giro+=d; pide(); },{passive:true});
  ['pointerup','pointercancel'].forEach(function(t){ addEventListener(t,function(){ dedo=null; },{passive:true}); });

   
  [].forEach.call(usos,function(b,k){ b.style.setProperty('--k',k); b.addEventListener('click',function(){
    fijo.classList.add('tocado');
    [].forEach.call(usos,function(x){ x.classList.toggle('sel',x===b); x.setAttribute('aria-pressed',x===b?'true':'false'); });
    if(MAQ) MAQ.piso2(b.dataset.uso); }); });

   
  vuelta.addEventListener('click',function(){ fijo.classList.add('giro'); vuelta.classList.remove('gira'); void vuelta.offsetWidth; vuelta.classList.add('gira');
    quietoHasta=performance.now()+2600; var g0=giro, t0=performance.now(), D=quieto?0:2400;
    (function paso(now){ var k=D?lim((now-t0)/D):1; giro=g0+2*Math.PI*(k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2); pinta(); if(k<1) requestAnimationFrame(paso); })(t0); });

   
  [].forEach.call(pasos,function(li,k){ li.addEventListener('click',function(){
    var top=sec.getBoundingClientRect().top+scrollY, largo=sec.offsetHeight-innerHeight;
    scrollTo({top:top+largo*(k+.85)/N,behavior:quieto?'auto':'smooth'}); }); });

   
  addEventListener('message',function(e){ if(!(e.data&&e.data.maqueta==='lista'&&f&&e.source===f.contentWindow)) return;
    try{ MAQ=f.contentWindow.MAQ; mideMaq(); }catch(_){ return; }
    pinta(); fijo.classList.add('lista'); });
   
  function mideMaq(){ if(f&&f.contentWindow) try{ f.contentWindow.dispatchEvent(new f.contentWindow.Event('resize')); }catch(_){} pide(); }
  function cargar(){ if(f) return; f=document.createElement('iframe'); f.title='Maqueta 3D de la siguiente etapa del lote'; f.tabIndex=-1;
    f.addEventListener('load',function(){ mideMaq(); setTimeout(mideMaq,300); });
    f.src=RAIZ+'maqueta.html?fondo&v='+((/[?&]v=([^&]+)/.exec(CASO_SRC)||[])[1]||'1');     caja.appendChild(f); }
  if('ResizeObserver' in window) new ResizeObserver(mideMaq).observe(caja);
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(e){ if(e[0].isIntersecting) cargar(); },{rootMargin:'100% 0px'}).observe(sec);
    new IntersectionObserver(function(e){ enVista=e[0].isIntersecting; pide(); },{threshold:0}).observe(fijo);
  } else { cargar(); enVista=true; }
  var pend=false;
  addEventListener('scroll',function(){ if(!pend){ pend=true; requestAnimationFrame(function(){ pend=false; mide(); }); } },{passive:true});
  addEventListener('resize',mide); mide();
})();

 
(function(){
  'use strict';
  var quieto=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var secs=document.querySelectorAll('.cw'); if(!secs.length) return;
  var ops=document.querySelectorAll('.cw-op'), num=document.getElementById('cwNum'), mes=document.getElementById('cwMes');
  var kit=document.querySelector('.cw-kit'), comp=document.getElementById('cwComp'), linea=document.getElementById('cwLinea');
  var PRECIO={s:2000000,g:20000000}, MES={s:200000,g:300000};
  var plan='s', cuenta=0, valor=PRECIO.s;
  function pesos(n){ return '$ '+Math.round(n).toLocaleString('es-CO').replace(/,/g,'.'); }
  function lim(x){ return Math.max(0,Math.min(1,x)); }

   
  function contar(a,b){
    cancelAnimationFrame(cuenta);
    if(quieto){ valor=b; num.textContent=pesos(b); return; }
    var t0=performance.now(), D=750;
    (function paso(t){ var k=lim((t-t0)/D), e=1-Math.pow(1-k,3);
      valor=a+(b-a)*e; num.textContent=pesos(Math.round(valor/1000)*1000);
      if(k<1) cuenta=requestAnimationFrame(paso); else { valor=b; num.textContent=pesos(b); } })(t0);
  }

   
  function ordena(){
    var filas=[].slice.call(comp.querySelectorAll('.f[data-o]'));
    var antes=new Map(); filas.forEach(function(f){ antes.set(f,f.getBoundingClientRect().top); });
    filas.sort(function(a,b){ var oa=+a.dataset.o, ob=+b.dataset.o;
      if(plan==='g'){ var ga=a.classList.contains('g')&&oa>2, gb=b.classList.contains('g')&&ob>2;
        var pa=oa<=2?0:(ga?1:2), pb=ob<=2?0:(gb?1:2); if(pa!==pb) return pa-pb; }
      return oa-ob; });
    filas.forEach(function(f){ comp.appendChild(f); });
    var k=0;
    filas.forEach(function(f){ if(f.classList.contains('g')) f.style.setProperty('--k',(k++*.07)+'s'); });
    if(quieto) return;
    filas.forEach(function(f){ var d=antes.get(f)-f.getBoundingClientRect().top; if(!d) return;
      f.animate([{transform:'translateY('+d+'px)'},{transform:'none'}],{duration:650,easing:'cubic-bezier(.2,.8,.2,1)'}); });
  }

  function elige(p, tocado){
    if(tocado) document.body.classList.add('cw-tocado');
    if(p===plan) return;
    var de=PRECIO[plan]; plan=p;
    secs.forEach(function(s){ s.dataset.plan=p; });
    ops.forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.p===p?'true':'false'); });
    document.querySelectorAll('[data-s][data-g]').forEach(function(el){ el.innerHTML=el.getAttribute('data-'+p); });
    contar(de, PRECIO[p]);
    mes.textContent='+ '+pesos(MES[p]);
    if(kit&&p==='g'&&!quieto){ kit.classList.remove('barre'); void kit.offsetWidth; kit.classList.add('barre'); }
    ordena();
  }
  ops.forEach(function(b){ b.addEventListener('click', function(){ elige(b.dataset.p, true); }); });

   
  var pasos=linea?linea.querySelectorAll('li'):[], raf=0;
  function pinta(){ raf=0; if(!linea) return;
    var r=linea.getBoundingClientRect(), vh=innerHeight, vertical=getComputedStyle(linea).gridTemplateColumns.split(' ').length<2;
    var av=quieto?1:lim((vh*.82-r.top)/(vertical?Math.max(r.height,1):vh*.45));
    linea.style.setProperty('--av',av.toFixed(3));
    pasos.forEach(function(li,i){
      var punto=vertical?(li.offsetTop+10)/Math.max(r.height-10,1):i/(pasos.length-1);
      li.classList.toggle('on', av>=punto-.02); });
  }
  function pide(){ if(!raf) raf=requestAnimationFrame(pinta); }
  addEventListener('scroll',pide,{passive:true}); addEventListener('resize',pide); pinta();
})();
