import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
    const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No has iniciado sesión.");

    const userClient = createClient(url, anon, { global: { headers: { Authorization: authHeader } } });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) throw new Error("No se pudo verificar tu sesión.");

    const { data: esAdmin, error: adminError } = await userClient.rpc("es_admin_actual");
    if (adminError) throw new Error("No se pudo comprobar tu permiso de administrador: " + adminError.message);
    if (esAdmin !== true) throw new Error("Solo un administrador puede enviar accesos.");

    const body = await req.json();
    const correo = String(body.correo || body.email || "").trim().toLowerCase();
    const nombre = String(body.nombre_apellido || "").trim();
    const personaId = body.persona_id ?? null;
    const roles = Array.isArray(body.roles) ? [...new Set(body.roles.map((x:any)=>String(x).trim()).filter(Boolean))] : [];
    if (!correo) throw new Error("La persona no tiene correo registrado.");
    if (!roles.length) throw new Error("Primero debes asignarle al menos una responsabilidad.");

    const permitidos = new Set(["administrador","instructor","jefe_taller","encargado_lecturas","encargado_donaciones","responsable_asesorias"]);
    if (roles.some((r:string)=>!permitidos.has(r))) throw new Error("Hay un permiso no válido.");

    const admin = createClient(url, service);
    const redirectTo = "https://nuevaacropolis.github.io/Integraci-n-Nueva-Acr-polis/admin.html";
    const { data: inviteData, error: inviteError } = await admin.auth.admin.inviteUserByEmail(correo, {
      redirectTo,
      data: { nombre, persona_id: personaId },
    });
    if (inviteError) throw new Error("Supabase no pudo enviar la invitación: " + inviteError.message);
    const uid = inviteData.user?.id;
    if (!uid) throw new Error("La invitación se creó, pero no se obtuvo el usuario.");

    // Vinculación: no bloquea la invitación si el id local no coincide; intenta por id y luego por correo.
    if (personaId !== null) {
      const up = await admin.from("personas").update({ usuario_id: uid }).eq("id", personaId);
      if (up.error) console.error("Vinculación por id:", up.error.message);
    }
    const upMail = await admin.from("personas").update({ usuario_id: uid }).ilike("correo", correo);
    if (upMail.error) console.error("Vinculación por correo:", upMail.error.message);

    const del = await admin.from("roles_usuario").delete().eq("usuario_id", uid);
    if (del.error) throw new Error("No se pudieron preparar los permisos: " + del.error.message);
    const ins = await admin.from("roles_usuario").insert(roles.map((rol:string)=>({ usuario_id: uid, rol })));
    if (ins.error) throw new Error("El correo se envió, pero no se pudieron asignar los permisos: " + ins.error.message);

    return new Response(JSON.stringify({ ok:true, message:`Acceso enviado correctamente a ${correo}` }), {
      status:200, headers:{...corsHeaders,"Content-Type":"application/json"}
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok:false, error:e instanceof Error ? e.message : String(e) }), {
      status:400, headers:{...corsHeaders,"Content-Type":"application/json"}
    });
  }
});
