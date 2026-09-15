/* V36 · Sincronización pública Agenda ↔ Supabase.
   Si Supabase no responde, la agenda local aprobada sigue funcionando como respaldo. */
(async function(){
  const cfg=window.NA_SUPABASE;
  if(!cfg?.url||!cfg?.anonKey||typeof ACTIVIDADES_RECURRENTES==='undefined'||!Array.isArray(ACTIVIDADES_RECURRENTES)) return;
  const headers={apikey:cfg.anonKey};
  const get=async path=>{
    const r=await fetch(`${cfg.url}/rest/v1/${path}`,{headers,cache:'no-store'});
    if(!r.ok) throw new Error(`Supabase ${r.status}`);
    return r.json();
  };
  try{
    const [acts,canc,links,virtudes,excepciones]=await Promise.all([
      get('actividades?select=id,slug,nombre,dias,hora,sede,desde,hasta,encargado,whatsapp,foto,frase,activo&activo=eq.true&order=nombre.asc'),
      get('actividades_canceladas?select=actividad_id,fecha'),
      get('actividades_virtudes?select=actividad_id,virtud_id'),
      get('virtudes?select=id,nombre&activo=eq.true'),
      get('actividad_excepciones?select=actividad_id,fecha,hora')
    ]);
    const vn=new Map(virtudes.map(v=>[v.id,v.nombre]));
    const cc=new Map(); canc.forEach(c=>{if(!cc.has(c.actividad_id))cc.set(c.actividad_id,[]);cc.get(c.actividad_id).push(c.fecha)});
    const ee=new Map(); (excepciones||[]).forEach(x=>{if(!ee.has(x.actividad_id))ee.set(x.actividad_id,{});ee.get(x.actividad_id)[x.fecha]={hora:(x.hora||'').slice(0,5)}});
    const vv=new Map(); links.forEach(x=>{if(!vv.has(x.actividad_id))vv.set(x.actividad_id,[]);const n=vn.get(x.virtud_id);if(n)vv.get(x.actividad_id).push(n)});
    const localBySlug=new Map(ACTIVIDADES_RECURRENTES.map(a=>[a.id,a]));
    const mapped=acts.map(a=>{
      const old=localBySlug.get(a.slug)||{};
      return {...old,id:a.slug,_dbid:a.id,nombre:a.nombre,dias:a.dias||[],hora:(a.hora||'').slice(0,5),sede:a.sede,desde:a.desde,hasta:a.hasta||'2099-12-31',encargado:a.encargado||'',whatsapp:a.whatsapp||'',foto:a.foto||old.foto||'',_fotoRespaldo:old.foto||'',frase:a.frase||old.frase||'',canceladas:cc.get(a.id)||[],excepciones:ee.get(a.id)||{},virtudes:vv.get(a.id)||[]};
    });
    ACTIVIDADES_RECURRENTES.splice(0,ACTIVIDADES_RECURRENTES.length,...mapped);
    window.NA_SUPABASE_CONNECTED=true; window.NA_PUBLIC_AGENDA_UPDATED_AT=Date.now();
    if(typeof renderWeek==='function')renderWeek();
    if(typeof renderSpaces==='function')renderSpaces();
    if(typeof renderVirtues==='function')renderVirtues();
    console.info('Nueva Acrópolis: agenda sincronizada con Supabase.');
  }catch(err){
    window.NA_SUPABASE_CONNECTED=false;
    console.warn('Nueva Acrópolis: usando agenda local de respaldo.',err);
  }
})();
