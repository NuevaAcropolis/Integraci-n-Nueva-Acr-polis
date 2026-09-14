(function(){
  const cfg=window.NA_SUPABASE||{};
  const msg=document.querySelector('#authMsg');
  const form=document.querySelector('#loginForm');
  const passwordForm=document.querySelector('#passwordForm');
  const panel=document.querySelector('#adminPanel');
  const login=document.querySelector('.admin-login');
  const recoverBtn=document.querySelector('#recoverBtn');
  const title=document.querySelector('#authTitle');
  const intro=document.querySelector('#authIntro');
  const sessionLabel=document.querySelector('#sessionLabel');
  let settingPassword=false;

  function say(text,type){msg.textContent=text||'';msg.className='auth-msg'+(type?' '+type:'');}
  function urlAuthType(){
    const all=(location.search+' '+location.hash).toLowerCase();
    if(all.includes('type=invite')) return 'invite';
    if(all.includes('type=recovery')) return 'recovery';
    return '';
  }
  function showPasswordMode(kind){
    settingPassword=true;
    login.hidden=false; panel.hidden=true; form.hidden=true; recoverBtn.hidden=true; passwordForm.hidden=false;
    title.textContent=kind==='recovery'?'Crea una nueva contraseña':'Completa tu acceso';
    intro.textContent=kind==='recovery'?'Elige una nueva contraseña para volver a ingresar al panel.':'Tu invitación fue aceptada. Solo falta crear tu contraseña personal.';
    say('');
  }
  function showLoginMode(){
    settingPassword=false;
    login.hidden=false; panel.hidden=true; form.hidden=false; recoverBtn.hidden=false; passwordForm.hidden=true;
    title.textContent='Panel de gestión'; intro.textContent='Acceso para personas autorizadas de Nueva Acrópolis Huancayo.';
  }
  async function showSession(){
    const {data}=await sb.auth.getSession();
    if(settingPassword) return;
    if(data.session){
      login.hidden=true; panel.hidden=false;
      if(sessionLabel) sessionLabel.textContent=data.session.user.email||'';
      await initPrivateModules(data.session.user);
    } else showLoginMode();
  }

  if(!cfg.url||!cfg.anonKey||cfg.anonKey.includes('PEGAR_AQUI')){say('Falta conectar Supabase para activar el acceso.','error');return;}
  const sb=supabase.createClient(cfg.url,cfg.anonKey);

  form.onsubmit=async e=>{
    e.preventDefault(); say('Ingresando…');
    const {error}=await sb.auth.signInWithPassword({email:loginEmail.value.trim(),password:loginPassword.value});
    if(error){say('No pudimos iniciar sesión. Revisa tu correo y contraseña.','error');return;}
    say(''); await showSession();
  };

  passwordForm.onsubmit=async e=>{
    e.preventDefault();
    const p=newPassword.value, r=repeatPassword.value;
    if(p.length<8){say('La contraseña debe tener al menos 8 caracteres.','error');return;}
    if(p!==r){say('Las contraseñas no coinciden.','error');return;}
    say('Guardando tu contraseña…');
    const {error}=await sb.auth.updateUser({password:p});
    if(error){say('No pudimos guardar la contraseña: '+error.message,'error');return;}
    settingPassword=false;
    history.replaceState({},document.title,location.pathname);
    say('Contraseña guardada correctamente.','success');
    await showSession();
  };

  recoverBtn.onclick=async()=>{
    const email=loginEmail.value.trim();
    if(!email){say('Escribe primero tu correo.','error');return;}
    const redirectTo='https://nuevaacropolis.github.io/Integraci-n-Nueva-Acr-polis/admin.html';
    const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo});
    say(error?'No pudimos enviar el correo: '+error.message:'Revisa tu correo para continuar.',error?'error':'success');
  };


  const ROLE_LABELS={
    administrador:'Administrador/a', instructor:'Instructor/a', jefe_taller:'Jefe de taller',
    encargado_lecturas:'Encargado/a de lecturas', encargado_donaciones:'Encargado/a de donaciones',
    responsable_asesorias:'Responsable de asesorías'
  };
  const ROLE_KEYS=Object.keys(ROLE_LABELS);
  const peopleModule=document.querySelector('#peopleModule'), peopleList=document.querySelector('#peopleList');
  const personModal=document.querySelector('#personModal'), personForm=document.querySelector('#personForm');
  const roleGrid=document.querySelector('#roleGrid');
  let canManagePeople=false, peopleCache=[], respCache=[];

  function esc(v){return String(v??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));}
  function roleInputs(selected=[]){
    roleGrid.innerHTML=ROLE_KEYS.map(k=>`<label class="role-option"><input type="checkbox" name="roles" value="${k}" ${selected.includes(k)?'checked':''}> <span>${ROLE_LABELS[k]}</span></label>`).join('');
  }
  function openPerson(person=null){
    personForm.reset(); document.querySelector('#personActive').checked=true; document.querySelector('#personMsg').textContent='';
    document.querySelector('#personId').value=person?.id||'';
    document.querySelector('#personTitle').textContent=person?'Editar persona':'Agregar persona';
    document.querySelector('#personName').value=person?.nombre_apellido||'';
    document.querySelector('#personEmail').value=person?.correo||'';
    document.querySelector('#personWhatsapp').value=person?.whatsapp||'';
    document.querySelector('#personActive').checked=person?person.activo!==false:true;
    const selected=person?respCache.filter(r=>r.persona_id===person.id).map(r=>r.responsabilidad):[];
    roleInputs(selected); personModal.hidden=false;
  }
  function closePerson(){personModal.hidden=true;}
  function renderPeople(){
    if(!peopleCache.length){peopleList.innerHTML='<div class="empty-people"><strong>Aún no hay personas registradas.</strong><br>Pulsa “+ Agregar persona” para hacer nuestra primera prueba.</div>';return;}
    peopleList.innerHTML=peopleCache.map(p=>{
      const roles=respCache.filter(r=>r.persona_id===p.id).map(r=>r.responsabilidad);
      return `<div class="person-row">
        <div><div class="person-name">${esc(p.nombre_apellido)}</div><span class="status-chip ${p.activo?'':'off'}">${p.activo?'Activa':'Inactiva'}</span></div>
        <div class="person-contact">${p.correo?esc(p.correo):'<em>Sin correo todavía</em>'}<br>${p.whatsapp?'WhatsApp: '+esc(p.whatsapp):''}</div>
        <div class="role-chips">${roles.length?roles.map(r=>`<span class="role-chip">${esc(ROLE_LABELS[r]||r)}</span>`).join(''):'<span class="role-chip">Sin responsabilidades</span>'}</div>
        <div class="person-row-actions"><button class="mini-btn" data-edit="${p.id}">Editar</button><button class="mini-btn" title="Se activará cuando conectemos la invitación segura" disabled>Enviar acceso</button></div>
      </div>`;
    }).join('');
    peopleList.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>openPerson(peopleCache.find(p=>p.id===Number(b.dataset.edit))));
  }
  async function loadPeople(){
    peopleList.innerHTML='<p class="admin-dev-note">Cargando personas…</p>';
    const [a,b]=await Promise.all([
      sb.from('personas').select('id,nombre_apellido,correo,whatsapp,activo,usuario_id,created_at').order('nombre_apellido'),
      sb.from('responsabilidades_persona').select('id,persona_id,responsabilidad')
    ]);
    if(a.error||b.error){peopleList.innerHTML=`<div class="empty-people">No pudimos cargar Personas y permisos.<br><small>${esc(a.error?.message||b.error?.message||'')}</small></div>`;return;}
    peopleCache=a.data||[];respCache=b.data||[];renderPeople();
  }
  async function initPrivateModules(user){
    const {data,error}=await sb.from('roles_usuario').select('rol').eq('usuario_id',user.id);
    const roles=(data||[]).map(x=>x.rol);
    canManagePeople=!error && roles.includes('administrador');
    if(peopleModule) peopleModule.hidden=!canManagePeople;
    if(canManagePeople) await loadPeople();
  }
  document.querySelector('#addPersonBtn').onclick=()=>openPerson();
  document.querySelector('#personClose').onclick=closePerson;
  document.querySelector('#cancelPerson').onclick=closePerson;
  personModal.addEventListener('click',e=>{if(e.target===personModal)closePerson();});
  personForm.onsubmit=async e=>{
    e.preventDefault(); if(!canManagePeople)return;
    const pm=document.querySelector('#personMsg'); pm.textContent='Guardando…'; pm.className='auth-msg';
    const id=Number(document.querySelector('#personId').value)||null;
    const payload={
      nombre_apellido:document.querySelector('#personName').value.trim(),
      correo:document.querySelector('#personEmail').value.trim()||null,
      whatsapp:document.querySelector('#personWhatsapp').value.trim()||null,
      activo:document.querySelector('#personActive').checked,
      updated_at:new Date().toISOString()
    };
    const selected=[...personForm.querySelectorAll('input[name=roles]:checked')].map(x=>x.value);
    let personId=id, res;
    if(id) res=await sb.from('personas').update(payload).eq('id',id).select('id').single();
    else res=await sb.from('personas').insert(payload).select('id').single();
    if(res.error){pm.textContent='No pudimos guardar: '+res.error.message;pm.className='auth-msg error';return;}
    personId=res.data.id;
    const del=await sb.from('responsabilidades_persona').delete().eq('persona_id',personId);
    if(del.error){pm.textContent='La persona se guardó, pero no pudimos actualizar sus responsabilidades: '+del.error.message;pm.className='auth-msg error';return;}
    if(selected.length){
      const ins=await sb.from('responsabilidades_persona').insert(selected.map(responsabilidad=>({persona_id:personId,responsabilidad})));
      if(ins.error){pm.textContent='La persona se guardó, pero faltaron responsabilidades: '+ins.error.message;pm.className='auth-msg error';return;}
    }
    pm.textContent='Guardado correctamente ✓';pm.className='auth-msg success';
    await loadPeople(); setTimeout(closePerson,650);
  };
  document.querySelector('#peopleShortcut').onclick=()=>{if(canManagePeople)peopleModule.scrollIntoView({behavior:'smooth'});};

  document.querySelector('#logoutBtn').onclick=async()=>{await sb.auth.signOut();showLoginMode();say('Sesión cerrada.','success');};

  const initialType=urlAuthType();
  if(initialType) showPasswordMode(initialType);

  sb.auth.onAuthStateChange(async(event)=>{
    if(event==='PASSWORD_RECOVERY') showPasswordMode('recovery');
    else if(event==='SIGNED_IN' && urlAuthType()==='invite') showPasswordMode('invite');
    else if(!settingPassword) await showSession();
  });

  setTimeout(async()=>{
    const t=urlAuthType();
    if(t) showPasswordMode(t); else await showSession();
  },150);
})();
