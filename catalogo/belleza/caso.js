 
 
window.__ESCENAS_TIENDA=[
  {t:'Entrar y explorar', s:'Portada, rutina y categorías', c:[[0,'La tienda abierta como app, sin la barra del navegador'],[2,'La rutina de 4 pasos contra imperfecciones'],[7.5,'Categorías: cada una dice cuántos productos tiene'],[9.5,'Cremas & Sueros: solo los de esa categoría'],[12,'Cada producto con su referencia, su tipo y su presentación']]},
  {t:'Buscar aunque escriba mal', s:'«¿Quisiste decir…?»', c:[[0,'Buscar: se abre el buscador del catálogo'],[2.5,'Escribe «limpiadro», con un error'],[4,'No hay resultados, pero la tienda sugiere el producto correcto'],[7.5,'Un toque a la sugerencia y aparece'],[10.5,'La ficha completa: para qué sirve, ingredientes e instrucciones']]},
  {t:'La ficha completa', s:'Galería, ingredientes, instrucciones', c:[[0,'Categorías → Colágeno & Bienestar'],[5.5,'La ficha completa del producto'],[7.5,'La galería: un toque cambia la vista'],[11,'Ingredientes e instrucciones de uso, paso a paso'],[14,'En los suplementos, la advertencia va en la ficha'],[19,'Agregar a la cesta']]},
  {t:'El pedido, armado', s:'Rutina en un toque y mensaje listo', c:[[0,'La rutina de 4 pasos contra imperfecciones'],[3,'Un toque: los cuatro pasos a la cesta'],[6,'Uno más del limpiador: la cesta suma sola'],[9,'El mensaje ya está escrito, con la referencia de cada producto'],[13.5,'Copiar mensaje: listo para pegar en el chat de Instagram']]}
];
 
window.__PRODUCTOS_TIENDA=[["REF-01","Colágeno bebible en sobres · 30 sobres, durazno","Colágeno & Bienestar"],["REF-02","Mascarilla de noche · 75 ml","Mascarillas"],["REF-03","Parches de contorno de ojos con vitamina C y colágeno · 5 pares","Mascarillas"],["REF-04","Mascarilla en lámina para dispositivo facial · 5 unidades","Mascarillas"],["REF-05","Mascarilla cremosa hidratante · 100 ml","Mascarillas"],["REF-06","Mascarilla en polvo · 75 ml","Mascarillas"],["REF-07","Activador para mascarilla en polvo · 125 ml","Mascarillas"],["REF-08","Geles faciales para dispositivo · 2 cajas","Mascarillas"],["REF-09","Crema hidratante · 75 ml","Cremas & Sueros"],["REF-10","Crema protectora de día SPF 35 · 50 ml","Cremas & Sueros"],["REF-11","Crema iluminadora de contorno de ojos · 15 ml","Cremas & Sueros"],["REF-12","Crema de contorno de ojos sin fragancia · 15 ml","Cremas & Sueros"],["REF-13","Fluido reparador · 30 ml","Cremas & Sueros"],["REF-14","Corrector de líneas de expresión · 30 ml","Cremas & Sueros"],["REF-15","Esencia antiedad en cápsulas · 60 cápsulas","Cremas & Sueros"],["REF-16","Sérum para imperfecciones · 30 ml","Cremas & Sueros"],["REF-17","Tónico equilibrante de pH · 150 ml","Tónicos & Limpieza"],["REF-18","Tónico exfoliante · 175 ml","Tónicos & Limpieza"],["REF-19","Agua micelar · 250 ml","Tónicos & Limpieza"],["REF-20","Limpiador para imperfecciones · paso 1 · 75 ml","Tónicos & Limpieza"],["REF-21","Tónico para imperfecciones · paso 2 · 125 ml","Tónicos & Limpieza"],["REF-22","Sérum de noche para imperfecciones · paso 3 · 30 ml","Tónicos & Limpieza"],["REF-23","Exfoliante facial · 100 ml","Tónicos & Limpieza"],["REF-24","Gel limpiador facial · 125 ml","Tónicos & Limpieza"],["REF-25","Limpiador facial para dispositivo · 100 ml","Tónicos & Limpieza"],["REF-26","Champú para cuero cabelludo y cabello · 200 ml","Cabello"],["REF-27","Acondicionador · 175 ml","Cabello"],["REF-28","Mascarilla capilar · 100 g","Cabello"],["REF-29","Sérum para cuero cabelludo y cabello · 75 ml","Cabello"],["REF-30","Exfoliante corporal en gel · 250 ml","Corporal"],["REF-31","Gel corporal reafirmante · 150 ml","Corporal"],["REF-32","Barra limpiadora facial · 100 g","Corporal"],["REF-33","Desodorante roll-on · 75 ml","Corporal"],["REF-34","Suplemento antioxidante · 120 cápsulas","Colágeno & Bienestar"],["REF-35","Suplemento de cordyceps, granada y ginseng · 180 cápsulas","Colágeno & Bienestar"],["REF-36","Suplemento de extractos de frutos y té verde · 120 cápsulas","Colágeno & Bienestar"],["REF-37","Suplemento de cereza ácida · 90 cápsulas","Colágeno & Bienestar"],["REF-38","Cabezal de repuesto para dispositivo de limpieza · 1 unidad","Tecnología"]];
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
    var DPR = Math.min(devicePixelRatio||1, 2)    , W=1, H=1, x=cv.getContext('2d');
    var o={ x:x, W:function(){ return W; }, H:function(){ return H; }, redibujar:null };
     
    function medir(){ var r=cv.getBoundingClientRect(), w=Math.max(1,Math.round(r.width)), h=Math.max(1,Math.round(r.height));
      if(w===W && h===H) return; W=w; H=h; cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR); x.setTransform(DPR,0,0,DPR,0,0); if(o.redibujar) o.redibujar(); }
    medir();
    if('ResizeObserver' in window) new ResizeObserver(medir).observe(cv); else addEventListener('resize', medir);
    return o;
  }
  function irA(id){ var d=$(id); if(d) d.scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'start'}); }

   
  (function(){
    var cv=$('vitrinaCv'); if(!cv) return;
    var L=lienzo(cv), x=L.x, yaw=-.55, yawT=-.55, pit=.42, pitT=.42, t0=performance.now(), vis=true, raf=0, ult=0;
    var C=[['#F7E1DD','#E2B3AB','#B98880'],['#D3E5F2','#9DC0DD','#7097B9'],['#E5DEF3','#BDB1DE','#9285BC'],['#DBEBDF','#A6CDB0','#7AA585'],['#F8E4CF','#E5B98F','#BD9063']];
    var TAPA=[['#F15A63','#D5232D','#9E1820'],['#3A3436','#262224','#1A1718']];
    var FIL=3, COL=5, P=.78, fr=[];
    for(var f=0;f<FIL;f++) for(var c=0;c<COL;c++){ var k=(c*7+f*3)%5; fr.push({f:f,c:c,col:C[k],tapa:TAPA[(c+f)%3===0?0:1],h:.62+((c*13+f*29)%5)*.1,w:.17+((c+f)%3)*.03}); }
    var CES={x:0,z:2.0};
    function Pz(px,py,pz,k,cx,cy){ var cs=Math.cos(yaw), sn=Math.sin(yaw), X=px*cs-pz*sn, Z=px*sn+pz*cs;
      var cp=Math.cos(pit), sp=Math.sin(pit), Y=py*cp-Z*sp, Z2=py*sp+Z*cp; return [cx+X*k, cy-Y*k, Z2]; }
    function poly(pts,fill,stroke){ x.beginPath(); x.moveTo(pts[0][0],pts[0][1]); for(var i=1;i<pts.length;i++) x.lineTo(pts[i][0],pts[i][1]); x.closePath(); if(fill){ x.fillStyle=fill; x.fill(); } if(stroke){ x.strokeStyle=stroke; x.lineWidth=1; x.stroke(); } }
    function caja(pr,bx,by,bz,a,b,h,col,abierta){ var V=[],i; for(i=0;i<8;i++) V.push(pr(bx+(i&1?a:-a), by+(i&2?h:0), bz+(i&4?b:-b)));
      var F=[[0,2,6,4,col[1]],[1,3,7,5,col[2]],[0,1,3,2,col[2]],[4,5,7,6,col[1]]];
      if(!abierta) F.push([2,3,7,6,col[0]]);
      F.forEach(function(q){ q.z=(V[q[0]][2]+V[q[1]][2]+V[q[2]][2]+V[q[3]][2])/4; }); F.sort(function(p,q){ return q.z-p.z; });
      if(abierta) poly([V[2],V[3],V[7],V[6]],'#160A0C',null);
      F.forEach(function(q){ poly([V[q[0]],V[q[1]],V[q[2]],V[q[3]]], q[4], 'rgba(255,255,255,.07)'); }); }
    function frasco(pr,o,bx,by,bz,esc){ var w=o.w*esc, h=o.h*esc; caja(pr,bx,by,bz,w,w,h,o.col); caja(pr,bx,by+h,bz,w*.55,w*.55,.16*esc,o.tapa); }
    function pinta(now){
      var W=L.W(), H=L.H(), t=(now-t0)/1000; yaw+=(yawT-yaw)*.06; pit+=(pitT-pit)*.06; x.clearRect(0,0,W,H);
      var x0=-COL*P/2, esq=[[x0-.5,0,-1.4],[-x0+.5,0,-1.4],[-x0+.5,0,2.6],[x0-.5,0,2.6],[0,2.3,-1.4]], mnx=1e9,mxx=-1e9,mny=1e9,mxy=-1e9;
      esq.forEach(function(q){ var v=Pz(q[0],q[1],q[2],1,0,0); mnx=Math.min(mnx,v[0]); mxx=Math.max(mxx,v[0]); mny=Math.min(mny,v[1]); mxy=Math.max(mxy,v[1]); });
      var k=Math.min(W*.9/(mxx-mnx), H*.84/(mxy-mny)), cx=W/2-k*(mnx+mxx)/2, cy=H/2-k*(mny+mxy)/2;
      function pr(a,b,c){ return Pz(a,b,c,k,cx,cy); }
       
      poly([pr(x0-.5,0,-1.4),pr(-x0+.5,0,-1.4),pr(-x0+.5,0,2.6),pr(x0-.5,0,2.6)],'rgba(213,35,45,.05)','rgba(238,79,88,.18)');
      var cic=REDUCE?.5:(t/2.4)%1, sale=REDUCE?-1:Math.floor(t/2.4)%fr.length;
      function pos(o){ return [x0+o.c*P+P/2, o.f*.62, -.2-o.f*.55]; }
       
      var brillo=Math.max(0,1-Math.abs(cic-.78)*5), vuela=null;
      for(var f=FIL-1;f>=0;f--){
        var y=f*.62, z=-.2-f*.55; caja(pr,0,y-.06,z,-x0+.3,.32,.06,['#3A2D2F','#241B1C','#1A1314']);
        var deFila=[]; fr.forEach(function(o,i){ if(o.f===f) deFila.push({o:o,i:i,d:pr.apply(null,pos(o))[2]}); });
        deFila.sort(function(a,b){ return b.d-a.d; });
        deFila.forEach(function(it){
          var o=it.o, q=pos(o);
          if(it.i===sale){
            vuela=it;
             
            if(cic>=.8){ var g2=(cic-.8)/.2, s2=g2*g2*(3-2*g2); if(s2>.02) frasco(pr,o,q[0],q[1],q[2],s2); }
            return;
          }
          var lev=REDUCE?0:Math.max(0,Math.sin(t*1.3+o.c*.7+o.f*1.3))*.025;
          frasco(pr,o,q[0],q[1]+lev,q[2],1);
        });
      }
      caja(pr,CES.x,0,CES.z,.62,.42,.42,['#F15A63','#D5232D','#9E1820'],true);
      if(vuela && cic<.8){
        var o=vuela.o, q=pos(o), u=Math.min(1,cic/.75), e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2, arco=Math.sin(u*Math.PI)*1.1;
        var X=q[0]+(CES.x-q[0])*e, Y=q[1]+(.15-q[1])*e+arco, Z=q[2]+(CES.z-q[2])*e;
         
        x.globalAlpha=cic<.62?1:Math.max(0,1-(cic-.62)/.18); frasco(pr,o,X,Y,Z,1-.35*e); x.globalAlpha=1;
      }
       
      var cp=pr(CES.x,.55,CES.z), r=18+brillo*26;
      var gl=x.createRadialGradient(cp[0],cp[1],0,cp[0],cp[1],r*2.2); gl.addColorStop(0,'rgba(238,79,88,'+(.25+brillo*.45)+')'); gl.addColorStop(1,'rgba(238,79,88,0)');
      x.fillStyle=gl; x.beginPath(); x.arc(cp[0],cp[1],r*2.2,0,6.283); x.fill();
    }
    L.redibujar=function(){ pinta(performance.now()); };
     
    function paso(now){ raf=0; if(!vis||document.hidden) return; pinta(now); raf=requestAnimationFrame(paso); }
    function arranca(){ if(REDUCE){ pinta(t0+1200); return; } if(!raf&&vis&&!document.hidden) raf=requestAnimationFrame(paso); }
    aVista(cv,function(v){ vis=v; arranca(); },{threshold:0});
    document.addEventListener('visibilitychange',arranca);
    var zona=cv.parentNode;
    zona.addEventListener('pointermove',function(e){ var r=cv.getBoundingClientRect(); yawT=-.55+((e.clientX-r.left)/r.width-.5)*1.1; pitT=.42+((e.clientY-r.top)/r.height-.5)*.35; if(REDUCE) pinta(performance.now()); },{passive:true});
    zona.addEventListener('pointerleave',function(){ yawT=-.55; pitT=.42; });
    zona.addEventListener('click',function(){ irA('escenas'); });
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
  function play(v){ var p=v.play(); if(p&&p.catch) p.catch(function(){}); }

   
  (function(){
    [['.cs-lapvid','panel-1440.mp4'],['#cel video','cel-tienda.mp4']].forEach(function(par){
      var v=document.querySelector(par[0]); if(!v) return;
      video(par[1]).then(function(u){ if(v.src.indexOf('blob:')<0){ var t=v.currentTime, sigue=!v.paused; v.src=u; try{ v.currentTime=t; }catch(e){} if(sigue) play(v); } });
      aVista(v,function(si){ if(si && !REDUCE) play(v); else v.pause(); },{threshold:.15});
    });
    var scr=document.querySelector('#lap .scr'), cel=$('cel');
    if(scr){ scr.style.cursor='pointer'; scr.addEventListener('click',function(){ irA('escenas'); }); }
    if(cel){ cel.style.cursor='pointer'; cel.addEventListener('click',function(){ irA('escenas'); }); }
  })();

   
  var ESC=window.__ESCENAS_TIENDA||[];
  (function(){
    var vid=$('escVid'), lista=$('escLista'); if(!vid||!lista||!ESC.length) return;
    var cur=0, visto=false, sub=$('escSub'), prog=$('escProg'), tit=$('escTit'), bPlay=$('escPlay');
    ESC.forEach(function(e,i){ var li=document.createElement('li'); li.innerHTML='<button type="button"><span class="n">0'+(i+1)+'</span><b></b><small></small></button>';
      li.querySelector('b').textContent=e.t; li.querySelector('small').textContent=e.s;
      li.firstChild.addEventListener('click',function(){ cargar(i,true); }); lista.appendChild(li); });
    function cargar(i,usuario){
      cur=i; var nom='escena-'+(i+1)+'.mp4', pedido=i; vid.poster='media/escena-'+(i+1)+'.jpg';
      video(nom).then(function(u){ if(cur!==pedido) return; vid.src=u; if(usuario||visto) play(vid); });
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
    aVista($('escenas'),function(si){ if(si) precargar(ESC.map(function(e,i){ return 'escena-'+(i+1)+'.mp4'; })); },{rootMargin:'100% 0px'});
    aVista(vid,function(si){ if(si){ if(!visto && !REDUCE){ visto=true; play(vid); } } else if(!vid.paused){ vid.pause(); visto=false; } },{threshold:.4});
  })();

  var PROD=window.__PRODUCTOS_TIENDA||[], porRef={};
  PROD.forEach(function(p){ porRef[p[0]]=p; });

   
  (function(){
    var cont=$('pedProds'), msg=$('pedMsg'); if(!cont||!msg) return;
    var LISTA=['REF-16','REF-20','REF-21','REF-22','REF-01','REF-10','REF-19','REF-28'], RUTINA=['REF-20','REF-21','REF-22','REF-16'], cesta={}, orden=[];
    LISTA.forEach(function(ref){
      var p=porRef[ref], d=document.createElement('div'); d.className='cs-prod'; d.dataset.ref=ref;
      d.innerHTML='<img src="media/prod/'+ref+'-1.svg" alt="" width="44" height="44"><span class="tx"><small>'+ref+'</small><b></b></span><span class="cant"><button type="button" class="menos" aria-label="Quitar uno">−</button><output>0</output><button type="button" class="mas" aria-label="Agregar uno">+</button></span>';
      d.querySelector('b').textContent=p[1];
      d.querySelector('.mas').addEventListener('click',function(){ poner(ref,(cesta[ref]||0)+1); });
      d.querySelector('.menos').addEventListener('click',function(){ poner(ref,(cesta[ref]||0)-1); });
      cont.appendChild(d);
    });
    function poner(ref,n){ if(n<=0){ delete cesta[ref]; orden=orden.filter(function(r){ return r!==ref; }); } else { if(!cesta[ref]) orden.push(ref); cesta[ref]=n; } pintar(); }
    function texto(){
      if(!orden.length) return '';
      var u=0, lineas=orden.map(function(ref){ var n=cesta[ref]; u+=n; return ref+' · '+porRef[ref][1]+(n>1?' · x'+n:''); });
      return 'Hola, quiero este pedido:\n'+lineas.join('\n')+'\nTotal: '+u+(u===1?' unidad':' unidades');
    }
    function pintar(){
      [].forEach.call(cont.children,function(d){ var n=cesta[d.dataset.ref]||0; d.querySelector('output').textContent=n; d.classList.toggle('en',n>0); });
      var t=texto(); msg.value=t||'Tu cesta está vacía. Agrega lo que te gusta y el mensaje se escribe solo.'; msg.classList.toggle('vacio',!t);
      msg.rows=Math.max(4,Math.min(9,(t.match(/\n/g)||[]).length+2));
      $('pedCopiar').disabled=!t;
    }
    $('pedRutina').addEventListener('click',function(){ RUTINA.forEach(function(r){ poner(r,(cesta[r]||0)+1); }); });
    $('pedVaciar').addEventListener('click',function(){ cesta={}; orden=[]; pintar(); });
    $('pedCopiar').addEventListener('click',function(){
      var b=this, t=texto(); if(!t) return;
      function hecho(){ b.firstChild.textContent='Copiado ✓ listo para pegar '; b.classList.add('hecho'); setTimeout(function(){ b.firstChild.textContent='Copiar mensaje '; b.classList.remove('hecho'); },2200); }
      if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(hecho,hecho); else { msg.select(); hecho(); }
    });
    pintar();
  })();

   
  (function(){
    var q=$('busQ'), res=$('busRes'), ej=$('busEj'); if(!q||!res) return;
    function filtrar(texto){
      var t=texto.trim().toLowerCase(), sinGuion=t.replace(/-/g,'');
      if(t==='') return PROD.slice();
      return PROD.filter(function(p){ var ref=p[0].toLowerCase();
        return p[1].toLowerCase().indexOf(t)>-1 || p[2].toLowerCase().indexOf(t)>-1 || ref.indexOf(t)>-1 || ref.replace(/-/g,'').indexOf(sinGuion)>-1; });
    }
    function sugerir(texto){
      var t=texto.trim().toLowerCase(); if(t.length<3) return null;
      var mejor=null, puntos=0;
      PROD.forEach(function(p){ var nom=p[1].toLowerCase(), n=0; for(var i=0;i<=t.length-3;i++) if(nom.indexOf(t.slice(i,i+3))>-1) n++; if(n>puntos){ puntos=n; mejor=p; } });
      return puntos>=2?mejor:null;
    }
    function fila(p){ var d=document.createElement('div'); d.className='cs-bus-fila'; d.innerHTML='<small></small><b></b><span></span>';
      d.querySelector('small').textContent=p[0]; d.querySelector('b').textContent=p[1]; d.querySelector('span').textContent=p[2]; return d; }
    function pintar(){
      var v=q.value, lista=filtrar(v); res.innerHTML='';
      var c=document.createElement('p'); c.className='cs-bus-cuenta'; c.textContent=lista.length+' de '+PROD.length+' productos'; res.appendChild(c);
      if(!lista.length){
        var s=sugerir(v), d=document.createElement('div'); d.className='cs-bus-nada';
        d.innerHTML='<b></b><span>Prueba con otra palabra, con la referencia (REF-XX) o mira las categorías.</span>';
        d.querySelector('b').textContent='No encontramos resultados para «'+v+'».';
        if(s){ var b=document.createElement('button'); b.type='button'; b.className='cs-bus-sug'; b.innerHTML='¿Quisiste decir <u></u>?'; b.querySelector('u').textContent=s[1];
          b.addEventListener('click',function(){ q.value=s[1]; pintar(); }); d.appendChild(b); }
        var l=document.createElement('button'); l.type='button'; l.className='cs-bus-limpiar'; l.textContent='Limpiar búsqueda'; l.addEventListener('click',function(){ q.value=''; pintar(); q.focus(); });
        d.appendChild(l); res.appendChild(d); return;
      }
      lista.slice(0,v.trim()?8:5).forEach(function(p){ res.appendChild(fila(p)); });
      if(lista.length>(v.trim()?8:5)){ var m=document.createElement('p'); m.className='cs-bus-mas'; m.textContent='… y '+(lista.length-(v.trim()?8:5))+' más'; res.appendChild(m); }
    }
    ['limpiadro','colageno','REF16','mascarilla'].forEach(function(t){ var b=document.createElement('button'); b.type='button'; b.textContent=t; b.addEventListener('click',function(){ q.value=t; pintar(); }); ej.appendChild(b); });
    q.addEventListener('input',pintar);
    pintar();
  })();

   
  (function(){
    [].forEach.call(document.querySelectorAll('[data-ir]'),function(el){ el.style.cursor='pointer';
      el.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); el.click(); } });
      el.addEventListener('click',function(e){ var t=e.target.closest('a,button,input'); if(t&&t!==el) return; e.preventDefault(); irA(el.getAttribute('data-ir')); }); });
  })();
})();
