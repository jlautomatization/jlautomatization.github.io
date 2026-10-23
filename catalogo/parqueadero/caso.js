 
var CASO_SRC=(document.currentScript&&document.currentScript.src)||'';
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
    zona.addEventListener('click',function(){ var d=$('escenas'); if(d) d.scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'start'}); });
    arranca();
  })();

   
  var MEM={}, PIDIENDO={};
  function video(nombre){
    if(MEM[nombre]) return Promise.resolve(MEM[nombre]);
    if(PIDIENDO[nombre]) return PIDIENDO[nombre];
    if(!window.fetch||!window.URL||!URL.createObjectURL) return Promise.resolve('media/'+nombre);
    PIDIENDO[nombre]=fetch('media/'+nombre).then(function(r){ if(!r.ok) throw 0; return r.blob(); })
      .then(function(b){ MEM[nombre]=URL.createObjectURL(b); return MEM[nombre]; })
      .catch(function(){ delete PIDIENDO[nombre]; return 'media/'+nombre; });
    return PIDIENDO[nombre];
  }
  function precargar(lista){ lista.reduce(function(p,n){ return p.then(function(){ return video(n); }); }, Promise.resolve()); }
  function irA(id){ var d=$(id); if(d) d.scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'start'}); }

   
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
      var nom=(tiq?'tiquete-':'escena-')+n+'.mp4', pedido=cur+'-'+tiq; vid.poster=tiq?'':'media/escena-'+n+'.jpg';
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
    addEventListener('message',function(e){ if(e.data&&e.data.maqueta==='lista'&&f){ try{ MAQ=f.contentWindow.MAQ; cx=MAQ.cx; cupos=MAQ.cupos; f.contentWindow.dispatchEvent(new Event('resize')); }catch(_){} fondo.classList.add('lista'); arrancar(); } });
    function cargar(){ if(f) return; f=document.createElement('iframe'); f.title='Maqueta 3D del lote proyectado'; f.tabIndex=-1;
      f.src='maqueta.html?fondo&v='+((/[?&]v=([^&]+)/.exec(CASO_SRC)||[])[1]||'1'); fondo.insertBefore(f, fondo.firstChild); }
    if('ResizeObserver' in window) new ResizeObserver(function(){ if(f&&f.contentWindow) try{ f.contentWindow.dispatchEvent(new Event('resize')); }catch(_){} }).observe(sec);
    aVista(sec,function(si){ if(si) cargar(); },{rootMargin:'100% 0px'});
    aVista(sec,function(si){ visible=si; if(si) arrancar(); },{threshold:0});
    document.addEventListener('visibilitychange',arrancar);
  })();

   
  (function(){
    [].forEach.call(document.querySelectorAll('[data-ir]'),function(el){ el.style.cursor='pointer';
      el.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); el.click(); } });
      el.addEventListener('click',function(e){ if(e.target.closest('a,button,input')&&e.target.closest('a,button,input')!==el) return; e.preventDefault(); var esc=el.getAttribute('data-escena'); irA(el.getAttribute('data-ir'));
        if(esc){ var b=document.querySelectorAll('#escLista button')[+esc-1]; if(b) setTimeout(function(){ b.click(); },REDUCE?0:500); } }); });
    var p2=document.querySelector('.cs-pasos li:nth-child(2)'); if(p2){ p2.style.cursor='pointer'; p2.addEventListener('click',function(){ var i=$('ciegoIn'); if(i) i.focus(); }); }
  })();
})();
