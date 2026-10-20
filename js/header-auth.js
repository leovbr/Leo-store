(function(){
  "use strict";
  const SUPABASE_URL="https://tvdbrqskvuukxvqaqjom.supabase.co";
  const SUPABASE_KEY="sb_publishable_2f-IadmcnaYzoCb_8Iko0w_pFp9u8eF";
  function loadSupabase(){
    if(window.supabase&&window.supabase.createClient)return Promise.resolve();
    return new Promise((resolve,reject)=>{
      const script=document.createElement("script");
      script.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.onload=resolve;script.onerror=reject;document.head.appendChild(script);
    });
  }
  function init(){
    const links=[...document.querySelectorAll(".side-menu-login")];
    if(!links.length)return;
    let db;
    try{db=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);}catch(e){console.warn("Status login belum tersedia:",e);return;}
    function render(session){
      const loggedIn=!!(session&&session.user&&!session.user.is_anonymous);
      links.forEach(link=>{
        const label=link.querySelector("span:first-child");
        if(label)label.textContent=loggedIn?"Logout":"Login";
        link.href=loggedIn?"#logout":"chat-admin.html";
        link.setAttribute("aria-label",loggedIn?"Logout dari akun":"Login ke akun LEOOSTORE");
        link.dataset.authState=loggedIn?"logged-in":"logged-out";
      });
    }
    db.auth.getSession().then(({data,error})=>{
      if(error)console.warn("Gagal memeriksa sesi login:",error.message);
      render(data?.session||null);
    }).catch(()=>render(null));
    db.auth.onAuthStateChange((_event,session)=>render(session));
    links.forEach(link=>link.addEventListener("click",async event=>{
      if(link.dataset.authState!=="logged-in")return;
      event.preventDefault();
      link.style.pointerEvents="none";
      const label=link.querySelector("span:first-child");
      if(label)label.textContent="Keluar…";
      const {error}=await db.auth.signOut();
      link.style.pointerEvents="";
      if(error){if(label)label.textContent="Logout";console.warn("Gagal logout:",error.message);return;}
      render(null);
    }));
  }
  loadSupabase().then(()=>{
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
    else init();
  }).catch(e=>console.warn("Pemeriksaan login tidak dapat dimuat:",e));
})();