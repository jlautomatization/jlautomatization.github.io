 
 
window.__ESCENAS_GYM=[
  {t:'El socio abre su app', s:'Su membresía, su semana y su próxima clase', c:[[0,'La socia entra con su PIN de 4 números'],[4,'Ve cuántos días le quedan para renovar y que cumple 3 meses'],[7.5,'Su semana: 4 de 5 entrenamientos, su fase y su racha'],[10,'El muro de sus últimas 12 semanas y su próxima clase']]},
  {t:'Agendar una clase', s:'Horario de la semana, con cupos', c:[[0,'En Clases ve el horario de cada día, con los cupos libres'],[3,'Elige el lunes y toca la clase de Funcional de las 6 p. m.'],[6,'Agendar: el sistema revisa cupo, cruces y lo que incluye su plan'],[8,'Queda agendada y aparece en su lista']]},
  {t:'Progreso y nutrición', s:'Sus medidas en gráficas y su plan', c:[[0,'Progreso: su peso medición a medición'],[3,'Grasa y cintura, comparadas con la primera medición'],[6,'Cada perímetro: gris la primera, verde hoy'],[10,'Nutrición: el plan que le asignó el gimnasio']]},
  {t:'El entrenador registra', s:'Un toque por entreno; la vencida no pasa', c:[[0,'Ahora entra la entrenadora, con su usuario y su clave'],[10,'Ve solo a sus atletas, con su semana y su membresía'],[13,'Abre la ficha de Mariana: 4 de 5 esta semana'],[16,'Un toque: entrenamiento registrado, 5 de 5. Queda en el registro'],[22,'Busca por cédula o por nombre'],[26,'Membresía vencida: el sistema no deja registrar hasta que renueve'],[30,'Mi semana: sus clases y quién viene']]},
  {t:'El panel del dueño', s:'Cifras, socios, mensajes, reporte, asistente', c:[[0,'El dueño entra a su panel con su PIN'],[4,'Lo importante de un vistazo: vencimientos, cumplimiento, riesgo de irse'],[6,'Entrenamientos por día, estado de la cartera y cada entrenador'],[14,'Socios: filtra los vencidos y abre la ficha de cada uno'],[22,'Mensajes: los que salen hoy y el interruptor de cada tipo'],[27,'La felicitación de permanencia, con el texto exacto'],[31,'Reporte semanal: quién cumplió y quién no'],[38,'Asistente: el dueño pregunta y el sistema responde'],[48,'Registro: cada movimiento queda guardado y nadie lo cambia']]}
];
 
window.__FOTO_GYM={preguntas:[
  ['¿Quién vence esta semana?','Esta semana vencen <b>5</b>:\n• Manuela Salcedo — mañana\n• Sebastián Cruz — en 2 días\n• Martín Rojas — en 3 días\n• Mauricio Quintero — en 4 días\n• Luisa Fernanda — en 6 días\nEl sistema ya les escribe solo.'],
  ['¿Cómo van los entrenadores?','Cumplimiento de esta semana:\n• Camila Torres — <b>69%</b> (7 socios)\n• Julián Ríos — <b>51%</b> (7 socios)\n• Laura Mejía — <b>57%</b> (6 socios)'],
  ['¿Quién no ha venido esta semana?','<b>3</b> socios con la membresía vigente no han entrenado esta semana:\n• Sebastián Cruz\n• Isabel Moreno\n• Juan Pablo Ríos'],
  ['¿Quién cumple meses?','Cumplen meses con ustedes:\n• Mariana Sepúlveda — 3 meses\n• Santiago Molano — 6 meses\n• Natalia Cárdenas — 12 meses\n• Camila Duarte — 3 meses\n• Tomás Herrera — 3 meses\nLes llega la felicitación a las 8:00 a. m.']
]};
var CASO_SRC=(document.currentScript&&document.currentScript.src)||'';
 
var CASO_BASE=CASO_SRC?CASO_SRC.replace(/caso\.js[^\/]*$/,''):'';
(function(){
  'use strict';
  var REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
   
  var tope=document.querySelector('main > .hx-tope'); if(tope) document.body.insertBefore(tope,document.body.firstChild);
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
  var PAG={escenas:'como-funciona/',semana:'como-funciona/',cadena:'como-funciona/',panel:'dueno/',mensajes:'dueno/',bot:'dueno/',todos:'funciones/',cuentas:'funciones/',suma:'funciones/'};
  function irA(id,tipo){ var d=$(id); if(d){ d.scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'start'}); return true; }
    if(PAG[id]&&CASO_BASE) location.href=CASO_BASE+PAG[id]+(tipo?'?m='+tipo:'')+'#'+id; return false; }

   
  (function(){
    var cv=$('muroCv'); if(!cv) return;
    var L=lienzo(cv), x=L.x, yaw=-.7, yawT=-.7, pit=.62, pitT=.62, t0=performance.now(), vis=true, raf=0, ult=0;
    var FIL=7, COL=12, P=1.05;
    var CONS=[.9,.7,.95,.45,.8,.3,.85], celdas=[];
    for(var f=0;f<FIL;f++) for(var c=0;c<COL;c++){ var r=((c*37+f*13)%100)/100; celdas.push({f:f,c:c,si:c<COL-1 && r<CONS[f]}); }
    function Pz(px,py,pz,k,cx,cy){ var cs=Math.cos(yaw), sn=Math.sin(yaw), X=px*cs-pz*sn, Z=px*sn+pz*cs;
      var cp=Math.cos(pit), sp=Math.sin(pit), Y=py*cp-Z*sp, Z2=py*sp+Z*cp; return [cx+X*k, cy-Y*k, Z2]; }
    function poly(pts,fill,stroke){ x.beginPath(); x.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) x.lineTo(pts[i][0],pts[i][1]); x.closePath(); if(fill){ x.fillStyle=fill; x.fill(); } if(stroke){ x.strokeStyle=stroke; x.lineWidth=1; x.stroke(); } }
    function caja(pr,bx,bz,a,b,h,col){ var V=[],i; for(i=0;i<8;i++) V.push(pr(bx+(i&1?a:-a), (i&2?h:0), bz+(i&4?b:-b)));
      var F=[[2,3,7,6,col[0]],[0,2,6,4,col[1]],[1,3,7,5,col[2]],[0,1,3,2,col[2]],[4,5,7,6,col[1]]];
      F.forEach(function(q){ q.z=(V[q[0]][2]+V[q[1]][2]+V[q[2]][2]+V[q[3]][2])/4; }); F.sort(function(p,q){ return q.z-p.z; });
      F.forEach(function(q){ poly([V[q[0]],V[q[1]],V[q[2]],V[q[3]]], q[4], 'rgba(255,255,255,.07)'); }); }
    var VE=['#5BE38E','#1E9E4B','#14733A'], VC=['#A7F3C4','#3FCB78','#2A9A57'], GR=['#2A2F2B','#1A1E1B','#121513'];
    function pinta(now){
      var W=L.W(), H=L.H(), t=(now-t0)/1000; yaw+=(yawT-yaw)*.06; pit+=(pitT-pit)*.06; x.clearRect(0,0,W,H);
      var x0=-COL*P/2, z0=-FIL*P/2, esq=[[x0-.4,0,z0-.4],[-x0+.4,0,z0-.4],[-x0+.4,0,-z0+.4],[x0-.4,0,-z0+.4],[0,1.6,0]], mnx=1e9,mxx=-1e9,mny=1e9,mxy=-1e9;
      esq.forEach(function(q){ var v=Pz(q[0],q[1],q[2],1,0,0); mnx=Math.min(mnx,v[0]); mxx=Math.max(mxx,v[0]); mny=Math.min(mny,v[1]); mxy=Math.max(mxy,v[1]); });
      var k=Math.min(W*.9/(mxx-mnx), H*.8/(mxy-mny)), cx=W/2-k*(mnx+mxx)/2, cy=H/2-k*(mny+mxy)/2;
      function pr(a,b,c){ return Pz(a,b,c,k,cx,cy); }
      poly([pr(x0-.4,0,z0-.4),pr(-x0+.4,0,z0-.4),pr(-x0+.4,0,-z0+.4),pr(x0-.4,0,-z0+.4)],'rgba(34,197,94,.05)','rgba(74,222,128,.18)');
      var ciclo=REDUCE?.7:(t*.12)%1, llenas=Math.floor(ciclo*6);
      var orden=celdas.slice().sort(function(a,b){ var A=pr(x0+a.c*P+P/2,0,z0+a.f*P+P/2)[2], B=pr(x0+b.c*P+P/2,0,z0+b.f*P+P/2)[2]; return B-A; });
      orden.forEach(function(e){
        var bx=x0+e.c*P+P/2, bz=z0+e.f*P+P/2, ahora=e.c===COL-1;
        if(ahora){ var h=Math.min(5,(llenas+(e.f%3)))*.17+.04; caja(pr,bx,bz,.3,.3,h,e.f===5?['#F2C76A','#9A6E1F','#6E4E14']:VC); return; }
        if(e.si){ var lev=REDUCE?0:Math.max(0,Math.sin(t*1.4+e.c*.6+e.f*1.1))*.05; caja(pr,bx,bz,.3,.3,.85+lev,VE); }
        else caja(pr,bx,bz,.3,.3,.03,GR);
      });
      var av=pr(x0+(COL-1)*P+P/2,1.15,z0+5*P+P/2), pul=REDUCE?0:(t*.8)%1;
      x.beginPath(); x.arc(av[0],av[1],6+pul*28,0,6.283); x.strokeStyle='rgba(242,184,75,'+(1-pul)*.8+')'; x.lineWidth=2; x.stroke();
      var gl=x.createRadialGradient(av[0],av[1],0,av[0],av[1],20); gl.addColorStop(0,'rgba(242,184,75,.55)'); gl.addColorStop(1,'rgba(242,184,75,0)'); x.fillStyle=gl; x.beginPath(); x.arc(av[0],av[1],20,0,6.283); x.fill(); x.beginPath(); x.arc(av[0],av[1],6,0,6.283); x.fillStyle='#F2C76A'; x.fill();
    }
    L.redibujar=function(){ pinta(performance.now()); };
     
    function paso(now){ raf=0; if(!vis||document.hidden) return; pinta(now); raf=requestAnimationFrame(paso); }
    function arranca(){ if(REDUCE){ pinta(t0+2000); return; } if(!raf&&vis&&!document.hidden) raf=requestAnimationFrame(paso); }
    aVista(cv,function(v){ vis=v; arranca(); },{threshold:0});
    document.addEventListener('visibilitychange',arranca);
    var zona=cv.parentNode;
    zona.addEventListener('pointermove',function(e){ var r=cv.getBoundingClientRect(); yawT=-.7+((e.clientX-r.left)/r.width-.5)*1.1; pitT=.62+((e.clientY-r.top)/r.height-.5)*.4; if(REDUCE) pinta(performance.now()); },{passive:true});
    zona.addEventListener('pointerleave',function(){ yawT=-.7; pitT=.62; });
    zona.addEventListener('click',function(){ irA('escenas'); });
    arranca();
  })();

   
  var MEM={}, PIDIENDO={};
  function video(nombre){
    if(MEM[nombre]) return Promise.resolve(MEM[nombre]);
    if(PIDIENDO[nombre]) return PIDIENDO[nombre];
    var url=CASO_BASE+'media/'+nombre;
    if(!window.fetch||!window.URL||!URL.createObjectURL) return Promise.resolve(url);
    PIDIENDO[nombre]=fetch(url).then(function(r){ if(!r.ok) throw 0; return r.blob(); })
      .then(function(b){ MEM[nombre]=URL.createObjectURL(b); return MEM[nombre]; })
      .catch(function(){ delete PIDIENDO[nombre]; return url; });
    return PIDIENDO[nombre];
  }
  function precargar(lista){ lista.reduce(function(p,n){ return p.then(function(){ return video(n); }); }, Promise.resolve()); }
  function play(v){ var p=v.play(); if(p&&p.catch) p.catch(function(){}); }

   
  function ponVideo(v){ if(v.getAttribute('src')) return Promise.resolve(); return video(v.getAttribute('data-video')).then(function(u){ if(!v.getAttribute('src')) v.src=u; }); }
  (function(){
    [].forEach.call(document.querySelectorAll('#lap video[data-video]'),function(v){
      aVista(v,function(si){ v._ver=si; if(si && !REDUCE) ponVideo(v).then(function(){ if(v._ver) play(v); }); else v.pause(); },{threshold:.15});
    });
    var scr=document.querySelector('#lap .scr'), cel=$('cel');
    if(scr){ scr.style.cursor='pointer'; scr.addEventListener('click',function(){ irA('panel'); }); }
    if(cel){ cel.style.cursor='pointer'; cel.addEventListener('click',function(){ irA('escenas'); }); }
  })();

   
  var ESC=window.__ESCENAS_GYM||[];
  (function(){
    var vid=$('escVid'), lista=$('escLista'); if(!vid||!lista||!ESC.length) return;
    var cur=0, visto=false, sub=$('escSub'), prog=$('escProg'), tit=$('escTit'), bPlay=$('escPlay');
    ESC.forEach(function(e,i){ var li=document.createElement('li'); li.innerHTML='<button type="button"><span class="n"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span><b></b><small></small></button>';
      li.querySelector('b').textContent=e.t; li.querySelector('small').textContent=e.s;
      li.firstChild.addEventListener('click',function(){ cargar(i,true); }); lista.appendChild(li); });
    function cargar(i,usuario){
      cur=i; var nom='escena-'+(i+1)+'.mp4', pedido=i; vid.poster=CASO_BASE+'media/escena-'+(i+1)+'.jpg';
       
      video(nom).then(function(u){ if(cur!==pedido) return; vid.src=u; if(usuario||visto) play(vid); video('escena-'+((i+1)%ESC.length+1)+'.mp4'); });
      tit.textContent=ESC[i].t;
      [].forEach.call(lista.children,function(li,k){ li.classList.toggle('act',k===i); });
      sub.classList.remove('ver'); sub.textContent='';
      if(usuario && innerWidth<960) document.querySelector('.cs-telvid').scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'start'});
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
    bPlay.addEventListener('click',function(){ if(vid.paused) play(vid); else vid.pause(); });
    vid.addEventListener('click',function(){ bPlay.click(); });
    cargar(0,false);
    aVista(vid,function(si){ if(si){ if(!visto && !REDUCE){ visto=true; play(vid); } } else if(!vid.paused){ vid.pause(); visto=false; } },{threshold:.4});
  })();

   
  (function(){
    var btn=$('semBtn'); if(!btn) return;
    var DIAS=['lunes','martes','miércoles','jueves','viernes','sábado'], REQ=5, hechos=2, dia=2, ultimo=1, cumplidas=9;
    var MURO=[1,1,0,1,1,1,1,0,1,1,1];
    var arco=$('semArco'), C=2*Math.PI*50, res=$('semRes'), venc=$('semVencida');
    function fase(n){ return n>=12?'Mantenimiento':n>=4?'Progreso':'Adaptación'; }
    function pintar(){
      $('semNum').textContent=hechos+'/'+REQ; arco.style.strokeDashoffset=(C*(1-Math.min(1,hechos/REQ))).toFixed(1);
      $('semAnillo').classList.toggle('bad',venc.checked);
      $('semTit').textContent=venc.checked?'Membresía vencida':hechos>=REQ?'Cumplió la semana':'Le falta'+(REQ-hechos===1?'':'n')+' '+(REQ-hechos)+' esta semana';
      $('semDia').textContent='Hoy es '+DIAS[dia];
      $('semFase').textContent='Fase · '+fase(cumplidas+(hechos>=REQ?1:0));
      $('semMuro').innerHTML=MURO.map(function(s){ return '<i class="'+(s?'si':'')+'"></i>'; }).join('')+'<i class="ahora'+(hechos>=REQ?' si':'')+'"></i>';
      btn.disabled=dia>5;
      btn.firstChild.textContent=dia>5?'Semana cerrada ':'Registrar entrenamiento de hoy ';
    }
    function aviso(cls,txt){ res.hidden=false; res.className='cs-res '+cls; res.textContent=txt; res.style.animation='none'; void res.offsetWidth; res.style.animation=''; }
    btn.addEventListener('click',function(){
      if(venc.checked){ aviso('mal','El sistema responde: «La membresía está vencida — no se puede registrar entrenamiento hasta que renueve.»'); return; }
      if(ultimo===dia){ aviso('sobra','El sistema responde: «Ya se registró un entrenamiento hoy.» Pase al día siguiente para registrar otro.'); dia++; pintar(); return; }
      if(hechos<REQ) hechos++; ultimo=dia;
      aviso('ok',hechos>=REQ?'Registrado. '+hechos+' de '+REQ+': cumplió la semana y suma una semana cumplida a su fase.':'Registrado el '+DIAS[dia]+'. Va '+hechos+' de '+REQ+' esta semana. Queda en el registro, con quién lo hizo y a qué hora.');
      pintar();
    });
    venc.addEventListener('change',function(){ res.hidden=true; pintar(); });
    aVista(btn,function(si){ if(si) setTimeout(pintar,200); },{threshold:.3});
    arco.style.strokeDashoffset=C; pintar();
  })();

   
  (function(){
    var caja=$('msgCaja'), ctl=$('msgControl'), tabs=$('msgTabs'); if(!caja) return;
    var tipo='venc', dias=3, meses=3, faltan=2, nombre='Valentina';
    function texto(){
      if(tipo==='venc'){ if(dias<-7||dias>5) return null; return dias<0?'Hola '+nombre+', tu mensualidad venció hace '+Math.abs(dias)+' día(s). Cuéntanos si sigues con nosotros o si quieres renovar.':'Hola '+nombre+', tu mensualidad vence en '+dias+' día(s). ¿Seguimos? Escríbenos para renovar cuando quieras.'; }
      if(tipo==='perm'){ if([3,6,12].indexOf(meses)<0) return null; return '¡'+nombre+', ya llevas '+meses+' meses con nosotros! Gracias por sostener el proceso.'; }
      if(faltan<=0) return null; return 'Hola '+nombre+', vimos que esta semana te faltaron '+faltan+' entrenamiento(s). ¿Todo bien? Te esperamos, aquí estamos para acompañarte.';
    }
    function control(){
      if(tipo==='venc') ctl.innerHTML='<label for="msgR"><span>Su mensualidad '+(dias<0?'venció hace '+(-dias):'vence en '+dias)+' día(s)</span></label><input id="msgR" type="range" min="-10" max="10" value="'+dias+'">';
      else if(tipo==='perm') ctl.innerHTML='<label for="msgR"><span>Lleva '+meses+' meses en el gimnasio</span></label><input id="msgR" type="range" min="1" max="13" value="'+meses+'">';
      else ctl.innerHTML='<label for="msgR"><span>Esta semana hizo '+(5-faltan)+' de 5</span></label><input id="msgR" type="range" min="0" max="5" value="'+(5-faltan)+'">';
      $('msgR').addEventListener('input',function(){ var v=+this.value; if(tipo==='venc') dias=v; else if(tipo==='perm') meses=v; else faltan=5-v; control(); pintar(); var r=$('msgR'); r.focus(); });
    }
    function pintar(){
      var t=texto(); caja.innerHTML='';
      var d=document.createElement('div');
      if(t){ d.className='cs-msg gym ver'; d.textContent=t; var h=document.createElement('span'); h.className='hora'; h.textContent='8:00'; d.appendChild(h); }
      else { d.className='cs-msg ver cs-nada'; d.textContent=tipo==='venc'?'Hoy no le llega nada: el aviso sale de 5 días antes a 7 días después del vencimiento.':tipo==='perm'?'Hoy no le llega nada: la felicitación sale al cumplir 3, 6 y 12 meses.':'Hoy no le llega nada: cumplió su semana.'; }
      caja.appendChild(d);
    }
    [].forEach.call(tabs.querySelectorAll('button'),function(b){ b.addEventListener('click',function(){ tipo=b.getAttribute('data-t'); [].forEach.call(tabs.children,function(x){ x.classList.toggle('act',x===b); }); control(); pintar(); }); });
    control(); pintar();
    window.__msgTipo=function(t){ var b=tabs.querySelector('[data-t="'+t+'"]'); if(b) b.click(); };
    var q=(location.search.match(/[?&]m=(venc|perm|segui)\b/)||[])[1]; if(q) window.__msgTipo(q);    
  })();

   
  (function(){
    var vid=$('panVid'), lista=$('panCaps'); if(!vid||!lista) return;
    var CAP=[[1.5,'Inicio','Lo importante de un vistazo: vencimientos, cumplimiento, riesgo de irse'],[12,'Socios','Filtra los vencidos y abre la ficha de cada uno'],
      [22,'Mensajes','Los que salen hoy y el interruptor de cada tipo'],[30,'Reporte','Quién cumplió la semana y quién no'],
      [36,'Asistente','El dueño pregunta y el sistema responde'],[46,'Registro','Cada movimiento queda guardado y nadie lo cambia']];
    var tit=$('panTit'), prog=$('panProg'), cur=-1, listo=null, ver=false;
    function cargar(){ if(!listo) listo=video('panel-1440.mp4').then(function(u){ vid.src=u; }); return listo; }
    function salta(t){ if(vid.readyState>=1){ try{ vid.currentTime=t; }catch(e){} return; }
      vid.addEventListener('loadedmetadata',function f(){ vid.removeEventListener('loadedmetadata',f); try{ vid.currentTime=t; }catch(e){} }); }
    function marca(i){ if(i===cur) return; cur=i; tit.innerHTML='<span class="gp-pre">Panel del dueño · </span>'; tit.appendChild(document.createTextNode(CAP[i][1]));
      [].forEach.call(lista.children,function(li,k){ li.classList.toggle('act',k===i); var b=li.firstChild; if(k===i) b.setAttribute('aria-current','true'); else b.removeAttribute('aria-current'); }); }
    CAP.forEach(function(c,i){ var li=document.createElement('li');
      li.innerHTML='<button type="button"><span class="n"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span><span class="tx"><b></b><small></small></span></button>';
      li.querySelector('b').textContent=c[1]; li.querySelector('small').textContent=c[2];
      li.firstChild.addEventListener('click',function(){ marca(i); cargar().then(function(){ salta(c[0]); play(vid); });
        if(innerWidth<960) vid.closest('.gp-mon').scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'start'}); });
      lista.appendChild(li); });
    vid.addEventListener('timeupdate',function(){ var t=vid.currentTime, k=0; for(var i=0;i<CAP.length;i++) if(t>=CAP[i][0]-.3) k=i; marca(k);
      if(vid.duration) prog.style.width=(t/vid.duration*100).toFixed(2)+'%'; });
    vid.addEventListener('click',function(){ if(vid.paused) play(vid); else vid.pause(); });
    aVista(vid,function(si){ if(si) cargar(); },{rootMargin:'100% 0px'});
    aVista(vid,function(si){ ver=si; if(si && !REDUCE) cargar().then(function(){ if(ver) play(vid); }); else vid.pause(); },{threshold:.3});
    marca(0);
  })();

   
  (function(){
    var box=$('tgMsgs'), preg=$('tgPreg'), F=window.__FOTO_GYM; if(!box||!F) return;
    function burbuja(txt,yo){ var d=document.createElement('div'); d.className='cs-msg'+(yo?' yo':' gym'); d.innerHTML=txt; box.appendChild(d); box.scrollTop=box.scrollHeight; requestAnimationFrame(function(){ requestAnimationFrame(function(){ d.classList.add('ver'); }); }); }
    burbuja('Hola. Elija una pregunta y le respondo con lo que hay registrado.',false);
    F.preguntas.forEach(function(p){ var b=document.createElement('button'); b.type='button'; b.textContent=p[0]; b.addEventListener('click',function(){ b.disabled=true; burbuja(p[0],true); setTimeout(function(){ burbuja(p[1],false); },REDUCE?0:650); }); preg.appendChild(b); });
  })();

   
  (function(){
    var cont=$('eslabones'), cad=$('cad'), btn=$('cadAlterar'), est=$('cadEst'); if(!cont) return;
    function sello(s){ var h1=0x811c9dc5, h2=0x01000193; for(var i=0;i<s.length;i++){ h1^=s.charCodeAt(i); h1=Math.imul(h1,16777619)>>>0; h2=Math.imul(h2^h1,2246822507)>>>0; }
      return ('00000000'+h1.toString(16)).slice(-8)+('00000000'+h2.toString(16)).slice(-8); }
    var EV=['Socio nuevo · plan trimestral','Clase agendada · lunes 6 p. m.','Entrenamiento registrado · 3 de 5','Medida · 63,7 kg','Membresía renovada','Mensajes automáticos encendidos','Entrenamiento registrado · 5 de 5'];
    var CAMBIO=['Socio nuevo · plan mensual','Clase agendada · martes 7 a. m.','Entrenamiento registrado · 5 de 5','Medida · 58,0 kg','Membresía sin renovar','Mensajes automáticos apagados','Entrenamiento registrado · 0 de 5'];
    var alterado=false, cual=2;
    function pintar(){
      cont.innerHTML=''; var orig=[], p2='0000000000000000';
      EV.forEach(function(ev){ var h=sello(p2+'|'+ev); orig.push(h); p2=h; });
      EV.forEach(function(ev,i){
        var txt=(alterado&&i===cual)?CAMBIO[i]:ev, h=alterado&&i===cual?sello((i?orig[i-1]:'0000000000000000')+'|'+txt):orig[i];
        var d=document.createElement('div'); d.className='cs-esl'+(alterado&&i===cual?' roto':'')+(alterado&&i>cual?' tras':'')+(i===EV.length-1&&!alterado?' sello':''); d.style.setProperty('--i',i);
        d.innerHTML='<div class="bl"><span class="num">REGISTRO '+(i+1)+'</span><span class="ev"></span><span class="h prev">← '+(i?orig[i-1].slice(0,10):'inicio')+'</span><span class="h">'+h.slice(0,16)+'</span></div><i class="link"></i>';
        d.querySelector('.ev').textContent=txt; d.querySelector('.bl').title='Intentar cambiar este registro';
        d.addEventListener('click',function(){ cual=i; alterado=true; pintar(); cad.classList.add('in'); }); cont.appendChild(d);
      });
      est.className='cs-cad-est'+(alterado?' mal':''); est.lastChild.textContent=alterado?'Registro '+(cual+1)+' cambiado: el sistema lo muestra':'Todo en orden';
      btn.textContent=alterado?'Dejarlo como estaba':'Intentar cambiar un registro';
    }
    est.innerHTML='<i></i>'; est.appendChild(document.createTextNode(''));
    btn.addEventListener('click',function(){ alterado=!alterado; pintar(); cad.classList.add('in'); if(alterado){ var r=cont.children[cual]; if(r) cont.scrollTo({left:Math.max(0,r.offsetLeft-20),behavior:REDUCE?'auto':'smooth'}); } });
    pintar();
    aVista(cad,function(si){ if(si) cad.classList.add('in'); },{threshold:.2});
  })();

   
   
  (function(){
    [].forEach.call(document.querySelectorAll('[data-ir]'),function(el){ el.style.cursor='pointer';
      el.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); el.click(); } });
      el.addEventListener('click',function(e){ var t=e.target.closest('a,button,input'); if(t&&t!==el) return; e.preventDefault();
        var tp=el.getAttribute('data-tipo'); if(irA(el.getAttribute('data-ir'),tp) && tp && window.__msgTipo) setTimeout(function(){ window.__msgTipo(tp); },REDUCE?0:400); }); });
  })();
})();
