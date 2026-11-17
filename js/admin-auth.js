(function(){
  "use strict";
  const URL="https://tvdbrqskvuukxvqaqjom.supabase.co";
  const KEY="sb_publishable_2f-IadmcnaYzoCb_8Iko0w_pFp9u8eF";
  const ADMIN_UID="3939553f-ef8d-4295-8f2f-39c86ce9ed20";
  const db=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  let currentSession=null;
  const $=id=>document.getElementById(id);
  const duplicateLoginStyle=document.createElement("style");duplicateLoginStyle.textContent="#loginPanel{display:none!important}";document.head.appendChild(duplicateLoginStyle);
  function show(message){const el=$("adminLoginStatus");if(el)el.textContent=message;}
  function activate(session){currentSession=session;document.body.classList.add("admin-authenticated");const menu=$("adminMenu");if(menu&&!menu.querySelector("#adminGlobalLogout")){const divider=document.createElement("div");divider.className="admin-menu-divider";const button=document.createElement("button");button.id="adminGlobalLogout";button.type="button";button.className="secondary";button.textContent="Keluar";button.addEventListener("click",logout);menu.append(divider,button);}window.dispatchEvent(new CustomEvent("leo-admin-ready",{detail:{session}}));}
  function deactivate(){currentSession=null;document.body.classList.remove("admin-authenticated");}
  async function logout(){await db.auth.signOut();deactivate();location.replace("admin.html");}
  async function validate(session){if(!session)return null;if(session.user?.id!==ADMIN_UID){await db.auth.signOut();return null;}return session;}
  const ready=(async()=>{const {data,error}=await db.auth.getSession();if(error){show("Gagal memeriksa sesi: "+error.message);return null;}const session=await validate(data.session);if(session){activate(session);return session;}deactivate();if(!location.pathname.endsWith("/admin.html")&&!location.pathname.endsWith("admin.html"))location.replace("admin.html");return null;})();
  const form=$("adminLoginForm");
  if(form)form.addEventListener("submit",async e=>{e.preventDefault();const button=$("adminLoginButton");button.disabled=true;show("Memeriksa akun admin…");try{const {data,error}=await db.auth.signInWithPassword({email:$("adminLoginEmail").value.trim(),password:$("adminLoginPassword").value});if(error)throw error;if(data.user?.id!==ADMIN_UID){await db.auth.signOut();throw new Error("Akun ini bukan akun admin yang diizinkan.");}activate(data.session);show("Login berhasil. Membuka dashboard…");}catch(error){show("Login gagal: "+(error.message||"Periksa email dan password."));}finally{button.disabled=false;}});
  db.auth.onAuthStateChange((event,session)=>{if(event==="SIGNED_OUT"){deactivate();if(!location.pathname.endsWith("admin.html"))location.replace("admin.html");}else if(session){validate(session).then(valid=>{if(valid)activate(valid);else if(!location.pathname.endsWith("admin.html"))location.replace("admin.html");});}});
  window.LEOAdminAuth={db,ADMIN_UID,ready,get session(){return currentSession;},logout,async requireAdmin(){return ready;}};
})();