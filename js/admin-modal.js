/* LEOOSTORE Global Admin Modal */
(()=>{"use strict";
const style=`
#leo-global-modal{position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(3,8,20,.68);backdrop-filter:blur(7px)}
#leo-global-modal.open{display:flex}
#leo-global-modal .leo-modal-card{width:min(100%,440px);background:var(--admin-card,#101827);color:var(--admin-text,#f4f7fb);border:1px solid rgba(148,163,184,.22);border-radius:20px;box-shadow:0 24px 80px rgba(0,0,0,.4);padding:22px;font:inherit;animation:leoModalIn .18s ease-out}
#leo-global-modal .leo-modal-title{font-size:18px;font-weight:750;margin:0 0 10px}
#leo-global-modal .leo-modal-message{font-size:14px;line-height:1.6;color:var(--admin-muted,#aab6c8);white-space:pre-wrap;overflow-wrap:anywhere;margin:0 0 18px}
#leo-global-modal .leo-modal-input{box-sizing:border-box;width:100%;padding:12px 13px;border-radius:11px;border:1px solid rgba(148,163,184,.35);background:var(--admin-input,#0b1220);color:inherit;font:inherit;margin:0 0 16px}
#leo-global-modal .leo-modal-actions{display:flex;justify-content:flex-end;gap:9px;flex-wrap:wrap}
#leo-global-modal button{border:0;border-radius:11px;padding:10px 16px;font:inherit;font-size:13px;font-weight:700;cursor:pointer}
#leo-global-modal .leo-modal-cancel{background:rgba(148,163,184,.16);color:inherit}
#leo-global-modal .leo-modal-ok{background:#2563eb;color:#fff}
#leo-global-modal .leo-modal-ok.danger{background:#dc3545}
@keyframes leoModalIn{from{opacity:0;transform:translateY(8px) scale(.985)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){#leo-global-modal .leo-modal-card{animation:none}}
`;
const mount=()=>{if(document.getElementById("leo-global-modal"))return;const st=document.createElement("style");st.textContent=style;document.head.appendChild(st);const root=document.createElement("div");root.id="leo-global-modal";root.innerHTML='<section class="leo-modal-card" role="dialog" aria-modal="true" aria-labelledby="leo-modal-title"><h2 class="leo-modal-title" id="leo-modal-title"></h2><p class="leo-modal-message" id="leo-modal-message"></p><input class="leo-modal-input" id="leo-modal-input" hidden><div class="leo-modal-actions"><button type="button" class="leo-modal-cancel" id="leo-modal-cancel">Batal</button><button type="button" class="leo-modal-ok" id="leo-modal-ok">Mengerti</button></div></section>';document.body.appendChild(root);};
function show({title="LEOOSTORE",message="",kind="alert",value="",placeholder="",confirmText,cancelText="Batal",danger=false}={}){mount();const root=document.getElementById("leo-global-modal"),msg=root.querySelector("#leo-modal-message"),input=root.querySelector("#leo-modal-input"),ok=root.querySelector("#leo-modal-ok"),cancel=root.querySelector("#leo-modal-cancel");root.querySelector("#leo-modal-title").textContent=title;msg.textContent=message;input.hidden=kind!=="prompt";input.value=value;input.placeholder=placeholder;ok.textContent=confirmText||(kind==="confirm"?"Lanjutkan":kind==="prompt"?"Simpan":"Mengerti");cancel.textContent=cancelText;cancel.hidden=kind==="alert";ok.classList.toggle("danger",danger);root.classList.add("open");if(kind==="prompt")input.focus();else ok.focus();return new Promise(resolve=>{let done=false;const finish=result=>{if(done)return;done=true;root.classList.remove("open");ok.removeEventListener("click",yes);cancel.removeEventListener("click",no);root.removeEventListener("keydown",key);resolve(result);};const yes=()=>finish(kind==="prompt"?input.value:kind==="confirm");const no=()=>finish(kind==="confirm"?false:null);const key=e=>{if(e.key==="Escape"){e.preventDefault();no();}if(e.key==="Enter"&&kind!=="alert"){e.preventDefault();yes();}};ok.addEventListener("click",yes);cancel.addEventListener("click",no);root.addEventListener("keydown",key);});}
window.leoModal={
alert:(message,opts={})=>show({message:String(message??""),...opts,kind:"alert"}),
confirm:(message,opts={})=>show({message:String(message??""),...opts,kind:"confirm",confirmText:opts.confirmText||"Ya, lanjutkan"}),
prompt:(message,value="",opts={})=>show({message:String(message??""),value:String(value??""),...opts,kind:"prompt"}),
password:(password,opts={})=>new Promise(resolve=>{
 mount();const root=document.getElementById("leo-global-modal"),msg=root.querySelector("#leo-modal-message"),input=root.querySelector("#leo-modal-input"),ok=root.querySelector("#leo-modal-ok"),cancel=root.querySelector("#leo-modal-cancel");
 root.querySelector("#leo-modal-title").textContent=opts.title||"Password Roblox";msg.textContent=opts.message||"Salin password sekarang.";input.hidden=false;input.type="password";input.value=String(password??"");input.readOnly=true;input.autocomplete="off";input.style.marginBottom="12px";cancel.hidden=false;cancel.textContent="Tutup";ok.textContent="Salin Password";ok.classList.remove("danger");root.classList.add("open");
 let eye=root.querySelector("#leo-password-eye");if(!eye){eye=document.createElement("button");eye.type="button";eye.id="leo-password-eye";eye.className="leo-modal-cancel";eye.style.marginBottom="12px";eye.textContent="Tampilkan password";input.insertAdjacentElement("afterend",eye);}
 eye.hidden=false;eye.onclick=()=>{input.type=input.type==="password"?"text":"password";eye.textContent=input.type==="password"?"Tampilkan password":"Sembunyikan password";};
 input.focus();let done=false;const finish=()=>{if(done)return;done=true;root.classList.remove("open");ok.removeEventListener("click",copy);cancel.removeEventListener("click",close);root.removeEventListener("keydown",key);input.value="";input.type="password";eye.hidden=true;resolve();};
 const copy=async()=>{try{await navigator.clipboard.writeText(input.value);ok.textContent="Tersalin ✓";setTimeout(()=>{if(!done)ok.textContent="Salin Password";},1100);}catch{input.type="text";input.select();document.execCommand("copy");ok.textContent="Salin manual";}};
 const close=()=>finish(),key=e=>{if(e.key==="Escape"){e.preventDefault();finish();}};
 ok.addEventListener("click",copy);cancel.addEventListener("click",close);root.addEventListener("keydown",key);
})
};
})();