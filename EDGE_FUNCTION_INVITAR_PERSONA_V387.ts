import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const corsHeaders={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS") return new Response("ok",{headers:corsHeaders});
 try{
  const url=Deno.env.get("SUPABASE_URL")!, service=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, anon=Deno.env.get("SUPABASE_ANON_KEY")!;
  const auth=req.headers.get("Authorization"); if(!auth) throw new Error("No has iniciado sesión.");
  const userClient=createClient(url,anon,{global:{headers:{Authorization:auth}}});
  const {data:{user},error:ue}=await userClient.auth.getUser(); if(ue||!user) throw new Error("No se pudo verificar tu sesión.");
  const {data:ok,error:ae}=await userClient.rpc("es_admin_actual"); if(ae) throw new Error("No se pudo comprobar el permiso de administrador: "+ae.message); if(ok!==true) throw new Error("Solo un administrador puede enviar accesos.");
  const body=await req.json(); const persona_id=body?.persona_id, correoBody=String(body?.correo||'').trim().toLowerCase();
  const admin=createClient(url,service);
  let persona=null, pe=null;
  if(persona_id!==undefined && persona_id!==null && String(persona_id)!==''){
   const r=await admin.from("personas").select("id,nombre_apellido,correo,activo").eq("id",persona_id).maybeSingle(); persona=r.data; pe=r.error;
  }
  if(!persona && correoBody){ const r=await admin.from("personas").select("id,nombre_apellido,correo,activo").ilike("correo",correoBody).maybeSingle(); persona=r.data; pe=r.error; }
  if(pe) throw new Error("No se pudo buscar a la persona: "+pe.message); if(!persona) throw new Error("No se encontró a la persona ni por ID ni por correo.");
  if(!persona.correo) throw new Error("La persona no tiene correo registrado."); if(!persona.activo) throw new Error("La persona está inactiva.");
  const correo=persona.correo.trim().toLowerCase();
  const {data:resp,error:re}=await admin.from("responsabilidades_persona").select("responsabilidad").eq("persona_id",persona.id); if(re) throw new Error("No se pudieron leer sus permisos: "+re.message); if(!resp?.length) throw new Error("Primero debes asignarle al menos una responsabilidad.");
  const redirectTo="https://nuevaacropolis.github.io/Integraci-n-Nueva-Acr-polis/admin.html";
  const {data:invite,error:ie}=await admin.auth.admin.inviteUserByEmail(correo,{redirectTo,data:{nombre:persona.nombre_apellido,persona_id:persona.id}}); if(ie) throw new Error("Supabase no pudo enviar la invitación: "+ie.message);
  const uid=invite.user?.id; if(!uid) throw new Error("La invitación se creó pero no se obtuvo el usuario.");
  const {error:pu}=await admin.from("personas").update({usuario_id:uid}).eq("id",persona.id); if(pu) throw new Error("Se envió la invitación, pero no se pudo vincular la persona: "+pu.message);
  await admin.from("roles_usuario").delete().eq("usuario_id",uid);
  const {error:rr}=await admin.from("roles_usuario").insert(resp.map(r=>({usuario_id:uid,rol:r.responsabilidad}))); if(rr) throw new Error("Se envió la invitación, pero falló la asignación de permisos: "+rr.message);
  return new Response(JSON.stringify({ok:true,message:`Acceso enviado correctamente a ${correo}`}),{status:200,headers:{...corsHeaders,"Content-Type":"application/json"}});
 }catch(e){return new Response(JSON.stringify({ok:false,error:e instanceof Error?e.message:String(e)}),{status:400,headers:{...corsHeaders,"Content-Type":"application/json"}})}
});
