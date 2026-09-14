// V33 · módulos de integración
(function(){
 const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
 function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

 // Definición visible de la virtud seleccionada
 const oldSearch=window.searchVirtue;
 if(typeof oldSearch==="function"){
   window.searchVirtue=function(q){
     oldSearch(q);
     q=(q||$("#virtueInput")?.value||"").trim(); if(!q)return;
     const key=Object.keys(SIGNIFICADO_VIRTUDES||{}).find(v=>normalize(v)===normalize(q));
     const meaning=key?SIGNIFICADO_VIRTUDES[key]:"Una cualidad que podemos cultivar conscientemente a través de nuestras elecciones y acciones.";
     const box=$("#virtueResults"); if(!box)return;
     box.insertAdjacentHTML("afterbegin",`<div class="virtue-definition"><span class="eyebrow">VIRTUD PARA CULTIVAR</span><h3>${esc(key||q)}</h3><p>${esc(meaning)}</p><small>Espacios donde puedes cultivarla ↓</small></div>`);
   };
   $$("[data-v]").forEach(b=>b.onclick=()=>{$("#virtueInput").value=b.dataset.v;window.searchVirtue(b.dataset.v)});
   $("#virtueBtn").onclick=()=>window.searchVirtue();
   $("#virtueInput").oninput=e=>window.searchVirtue(e.target.value);
 }

 // Agenda descargable como PNG — generador propio, funciona también desde file://
 const download=$("#downloadAgenda");
 function wrapCanvas(ctx,text,maxWidth){const words=String(text||"").split(/\s+/),lines=[];let line="";for(const w of words){const test=line?line+" "+w:w;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=w}else line=test}if(line)lines.push(line);return lines}
 function rounded(ctx,x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();ctx.stroke()}
 function loadDataImage(src){return new Promise(resolve=>{if(!src)return resolve(null);const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=src})}
 if(download) download.onclick=async()=>{
   const original=download.textContent;download.disabled=true;download.textContent="Preparando imagen…";
   try{
     const monday=mondayOf(addDays(new Date(),weekOffset*7)), sunday=addDays(monday,6), days=Array.from({length:7},(_,i)=>addDays(monday,i));
     const occ=generate(monday,sunday); const W=1500, pad=55, gap=14, col=(W-pad*2-gap*6)/7;
     const perDay=days.map(d=>occ.filter(a=>a.fecha===iso(d))); const maxN=Math.max(1,...perDay.map(x=>x.length));
     const cardH=190, headerH=205, H=headerH+maxN*(cardH+14)+75;
     const canvas=document.createElement('canvas');canvas.width=W;canvas.height=H;const ctx=canvas.getContext('2d');
     ctx.fillStyle='#f7f3eb';ctx.fillRect(0,0,W,H);
     ctx.fillStyle='#173f34';ctx.font='700 18px Inter, Arial';ctx.fillText('NUEVA ACRÓPOLIS · HUANCAYO',pad,48);
     ctx.font='500 50px Georgia, serif';ctx.fillText('Agenda semanal',pad,105);
     ctx.font='400 20px Inter, Arial';ctx.fillStyle='#6f685d';ctx.fillText(`${monday.getDate()} – ${sunday.getDate()} de ${MONTHS[sunday.getMonth()]} de ${sunday.getFullYear()}`,pad,143);
     ctx.strokeStyle='#cdbb92';ctx.beginPath();ctx.moveTo(pad,165);ctx.lineTo(W-pad,165);ctx.stroke();
     const exportImages=window.NA_AGENDA_EXPORT_IMAGES||{};
     for(let di=0;di<7;di++){
       const d=days[di], x=pad+di*(col+gap), items=perDay[di];
       ctx.fillStyle='#173f34';ctx.font='700 16px Georgia, serif';ctx.fillText(['LUNES','MARTES','MIÉRCOLES','JUEVES','VIERNES','SÁBADO','DOMINGO'][di],x,195);
       ctx.fillStyle='#8b8171';ctx.font='400 12px Inter, Arial';ctx.fillText(`${d.getDate()} de ${MONTHS[d.getMonth()]}`,x,216);
       for(let j=0;j<items.length;j++){
         const a=items[j], y=235+j*(cardH+14);
         ctx.fillStyle='#fffdf8';ctx.strokeStyle='#ded3c0';rounded(ctx,x,y,col,cardH,12);
         let src=''; try{const raw=activityImg(a)||'';const name=raw.split(/[?#]/)[0].replace(/\\/g,'/').split('/').pop();src=exportImages[name]||raw}catch(e){}
         const im=await loadDataImage(src);
         if(im){ctx.save();ctx.beginPath();ctx.roundRect(x+1,y+1,col-2,78,[11,11,0,0]);ctx.clip();const sc=Math.max(col/im.width,78/im.height),dw=im.width*sc,dh=im.height*sc;ctx.drawImage(im,x+(col-dw)/2,y+(78-dh)/2,dw,dh);ctx.restore()}
         else {ctx.fillStyle='#e8e1d3';ctx.fillRect(x+1,y+1,col-2,78)}
         ctx.fillStyle='#173f34';ctx.font='600 13px Inter, Arial';ctx.fillText(fmtTime(a.hora),x+12,y+101);
         ctx.font='600 20px Georgia, serif';const lines=wrapCanvas(ctx,a.nombre,col-24).slice(0,3);lines.forEach((ln,k)=>ctx.fillText(ln,x+12,y+128+k*22));
         ctx.fillStyle='#557164';ctx.font='500 11px Inter, Arial';ctx.fillText(`● ${a.sede}`,x+12,y+cardH-12);
       }
       if(!items.length){ctx.fillStyle='#aaa095';ctx.font='italic 14px Georgia, serif';ctx.fillText('Sin actividades',x,260)}
     }
     ctx.fillStyle='#9a742b';ctx.font='600 12px Inter, Arial';ctx.textAlign='center';ctx.fillText('FILOSOFÍA · CULTURA · VOLUNTARIADO',W/2,H-28);ctx.textAlign='left';
     const a=document.createElement('a');a.download=`agenda-nueva-acropolis-${iso(monday)}.png`;a.href=canvas.toDataURL('image/png');document.body.appendChild(a);a.click();a.remove();
   }catch(err){alert('No pude generar la imagen. Inténtalo nuevamente.');console.error('Agenda PNG:',err)}
   finally{download.disabled=false;download.textContent=original}
 };

 // Lecturas tipo pequeño libro — preparado para textos largos
 const readings=Array.isArray(window.LECTURAS_FALLBACK)?window.LECTURAS_FALLBACK:(typeof LECTURAS_FALLBACK!=="undefined"?LECTURAS_FALLBACK:[]);
 function renderReadings(list=readings){const g=$("#readingGrid");if(!g)return;g.innerHTML=list.map(r=>`<button class="reading-card" data-reading="${esc(r.id)}"><span class="book-spine"></span><span class="eyebrow">${esc(r.virtud||r.tema||"LECTURA")}</span><h3>${esc(r.titulo)}</h3><p>${esc(r.autor||"Nueva Acrópolis")}</p><small>Leer · ${Math.max(1,Math.ceil((r.contenido||"").split(/\s+/).length/180))} min →</small></button>`).join(""); $$('[data-reading]').forEach(b=>b.onclick=()=>openReading(b.dataset.reading))}
 function paginateReading(text,targetWords=300){
   const paras=String(text||"").split(/\n\s*\n/).map(x=>x.trim()).filter(Boolean), pages=[]; let current=[], count=0;
   paras.forEach(par=>{
     const words=par.split(/\s+/);
     if(words.length>targetWords){
       if(current.length){pages.push(current);current=[];count=0}
       for(let i=0;i<words.length;i+=targetWords) pages.push([words.slice(i,i+targetWords).join(" ")]);
     } else {
       if(count && count+words.length>targetWords){pages.push(current);current=[];count=0}
       current.push(par);count+=words.length;
     }
   });
   if(current.length)pages.push(current); return pages.length?pages:[[""]];
 }
 function openReading(id){const r=readings.find(x=>String(x.id)===String(id));if(!r)return;const pages=paginateReading(r.contenido,300);let page=0;
   show(`<div class="mini-book"><div class="book-cover"><span>PEQUEÑA LECTURA</span><h2>${esc(r.titulo)}</h2><p>${esc(r.autor||"")}</p><div class="book-meta">${esc(r.tema||r.virtud||"Filosofía para la vida")}</div></div><div class="book-progress"><i id="bookProgress"></i></div><div class="book-page" id="bookPage"></div><div class="book-controls"><button id="bookPrev" aria-label="Página anterior">‹</button><span id="bookCount"></span><button id="bookNext" aria-label="Página siguiente">›</button></div></div>`);
   const paint=()=>{const el=$("#bookPage");el.innerHTML=pages[page].map(p=>`<p>${esc(p)}</p>`).join("")+(page===pages.length-1&&r.pregunta_final?`<div class="reflection"><span>PARA LLEVAR CONTIGO</span><p>${esc(r.pregunta_final)}</p></div>`:"");$("#bookCount").textContent=`${page+1} / ${pages.length}`;$("#bookPrev").disabled=page===0;$("#bookNext").disabled=page===pages.length-1;$("#bookProgress").style.width=`${((page+1)/pages.length)*100}%`;el.scrollTop=0};
   $("#bookPrev").onclick=()=>{if(page>0){page--;paint()}};$("#bookNext").onclick=()=>{if(page<pages.length-1){page++;paint()}};paint();
 }
 renderReadings();
 const rs=$("#readingSearch");if(rs)rs.oninput=e=>{const q=normalize(e.target.value);renderReadings(readings.filter(r=>normalize([r.titulo,r.autor,r.tema,r.virtud,r.contenido].join(" ")).includes(q)))};

 // Donaciones — tarjetas visuales e interactivas; luego se alimentarán desde Supabase
 const donations=typeof DONACIONES_FALLBACK!=="undefined"?DONACIONES_FALLBACK:[];
 const donationIcon=name=>{const n=normalize(name);if(/jabon|desinfect|lejia|deterg|lavavaj|cera|limpia/.test(n))return "✦";if(/escoba|recogedor|trapeador|franela|secador/.test(n))return "⌁";if(/papel|hojas/.test(n))return "▤";if(/cinta/.test(n))return "◇";if(/bolsa/.test(n))return "◌";return "✧"};
 const dg=$("#donationGrid");if(dg){const groups=[...new Set(donations.map(x=>x.categoria))];dg.innerHTML=groups.map(cat=>`<article class="donation-card"><div class="donation-card-head"><span class="eyebrow">${esc(cat)}</span><small>${donations.filter(x=>x.categoria===cat&&!x.conseguido).length} por conseguir</small></div><div class="donation-items">${donations.filter(x=>x.categoria===cat).map(x=>{const msg=encodeURIComponent(`Hola Michael, vi en la página de Nueva Acrópolis que necesitan ${x.nombre} y me gustaría colaborar con esta donación. ¿Cómo podemos coordinar la entrega?`);return `<a target="_blank" rel="noopener" href="https://wa.me/51964212747?text=${msg}" class="donation-item ${x.conseguido?'done':''}"><span class="donation-icon">${donationIcon(x.nombre)}</span><span class="donation-copy"><b>${esc(x.nombre)}</b><small>${x.conseguido?'Gracias, ya fue conseguido':'Toca para colaborar'}</small></span><span class="donation-status">${x.conseguido?'✓':'→'}</span></a>`}).join("")}</div></article>`).join("")}
})();
