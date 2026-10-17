(function(){
var langs={id:["🇮🇩","ID / IDR"],en:["🇬🇧","EN / IDR"],ms:["🇲🇾","MS / IDR"],"zh-CN":["🇨🇳","中文 / IDR"],ja:["🇯🇵","日本語 / IDR"],ko:["🇰🇷","한국어 / IDR"],es:["🇪🇸","ES / IDR"]};
function setup(){
 var btn=document.getElementById("leoLanguageButton"),menu=document.getElementById("leoLanguageMenu");
 if(!btn||!menu)return;
 function getLang(){try{return localStorage.getItem("leoostore-language")||"id"}catch(e){return"id"}}
 function paint(l){var v=langs[l]||langs.id;var f=document.getElementById("leoLanguageFlag"),t=document.getElementById("leoLanguageLabel");if(f)f.textContent=v[0];if(t)t.textContent=v[1];menu.querySelectorAll("[data-lang]").forEach(function(b){b.classList.toggle("selected",b.getAttribute("data-lang")===l)})}
 function choose(l){
  try{localStorage.setItem("leoostore-language",l)}catch(e){}
  var path=l==="id"?"":"/auto/"+l;
  ["","/Leo-store/"].forEach(function(p){document.cookie="googtrans="+(l==="id"?"":path)+";path="+(p||"/")+";max-age="+(l==="id"?"0":"31536000")+";SameSite=Lax"});
  paint(l);menu.hidden=true;btn.setAttribute("aria-expanded","false");
  var combo=document.querySelector(".goog-te-combo");
  if(combo){combo.value=l==="id"?"":l;combo.dispatchEvent(new Event("change"))}else{location.reload()}
 }
 btn.onclick=function(e){e.preventDefault();e.stopPropagation();menu.hidden=!menu.hidden;btn.setAttribute("aria-expanded",menu.hidden?"false":"true")};
 menu.querySelectorAll("[data-lang]").forEach(function(b){b.onclick=function(e){e.preventDefault();e.stopPropagation();choose(b.getAttribute("data-lang"))}});
 document.addEventListener("click",function(e){if(!e.target.closest(".leo-language-wrap")){menu.hidden=true;btn.setAttribute("aria-expanded","false")}});
 paint(getLang());
}
window.googleTranslateElementInit=function(){if(window.google&&google.translate)new google.translate.TranslateElement({pageLanguage:"id",includedLanguages:"id,en,ms,zh-CN,ja,ko,es",autoDisplay:false},"google_translate_element");var l="id";try{l=localStorage.getItem("leoostore-language")||"id"}catch(e){}if(l!=="id")setTimeout(function(){var c=document.querySelector(".goog-te-combo");if(c){c.value=l;c.dispatchEvent(new Event("change"))}},1000)};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup);else setup();
var s=document.createElement("script");s.src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";s.async=true;document.head.appendChild(s);
})();