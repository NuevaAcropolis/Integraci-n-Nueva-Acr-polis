import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const url = Deno.env.get('SUPABASE_URL')!
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const authHeader = req.headers.get('Authorization') || ''
    const caller = createClient(url, anon, { global: { headers: { Authorization: authHeader } } })
    const { data: ud, error: ue } = await caller.auth.getUser()
    if (ue || !ud.user) throw new Error('Sesión no válida.')
    const admin = createClient(url, service, { auth: { persistSession: false } })
    const { data: roles } = await admin.from('roles_usuario').select('rol').eq('usuario_id', ud.user.id)
    if (!(roles||[]).some((r:any)=>r.rol==='administrador')) throw new Error('Solo un administrador puede enviar accesos.')
    const { persona_id } = await req.json()
    const { data: person, error: pe } = await admin.from('personas').select('id,nombre_apellido,correo,activo').eq('id', persona_id).single()
    if (pe || !person) throw new Error('Persona no encontrada.')
    if (!person.activo) throw new Error('La persona está inactiva.')
    if (!person.correo) throw new Error('La persona no tiene correo.')
    const redirectTo='https://nuevaacropolis.github.io/Integraci-n-Nueva-Acr-polis/admin.html'
    const { data: invited, error: ie } = await admin.auth.admin.inviteUserByEmail(person.correo,{redirectTo,data:{nombre:person.nombre_apellido,persona_id:person.id}})
    let userId=invited?.user?.id
    if(ie){
      // Si ya existe, localízalo y envíale recuperación para que pueda crear/restablecer acceso.
      const {data:list}=await admin.auth.admin.listUsers({page:1,perPage:1000})
      const existing=list?.users?.find((u:any)=>u.email?.toLowerCase()===person.correo.toLowerCase())
      if(!existing) throw ie
      userId=existing.id
      const {error:linkErr}=await admin.auth.admin.generateLink({type:'recovery',email:person.correo,options:{redirectTo}})
      if(linkErr) throw linkErr
      // generateLink no envía correo; para usuario existente indicamos usar recuperación del panel.
    }
    if(!userId) throw new Error('No se pudo crear el usuario.')
    await admin.from('personas').update({usuario_id:userId,updated_at:new Date().toISOString()}).eq('id',person.id)
    const {data: resp}=await admin.from('responsabilidades_persona').select('responsabilidad').eq('persona_id',person.id)
    await admin.from('roles_usuario').delete().eq('usuario_id',userId)
    if((resp||[]).length){
      const {error:re}=await admin.from('roles_usuario').insert((resp||[]).map((x:any)=>({usuario_id:userId,rol:x.responsabilidad})))
      if(re) throw re
    }
    return new Response(JSON.stringify({ok:true,message:ie?'La cuenta ya existía. Sus permisos fueron actualizados; usa “¿Olvidaste tu contraseña?” en el panel para recibir el correo.':'Invitación enviada por correo correctamente.'}),{headers:{...cors,'Content-Type':'application/json'}})
  } catch(e){ return new Response(JSON.stringify({error:e?.message||String(e)}),{status:400,headers:{...cors,'Content-Type':'application/json'}}) }
})
