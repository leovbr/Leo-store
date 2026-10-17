<div id="google_translate_element" style="display:none!important"></div>
<script>
(function(){
  var langs={id:{flag:"🇮🇩",label:"ID / IDR"},en:{flag:"🇬🇧",label:"EN / IDR"},ms:{flag:"🇲🇾",label:"MS / IDR"},"zh-CN":{flag:"🇨🇳",label:"中文 / IDR"},ja:{flag:"🇯🇵",label:"日本語 / IDR"},ko:{flag:"🇰🇷",label:"한국어 / IDR"},es:{flag:"🇪🇸",label:"ES / IDR"}};
  var btn=document.getElementById("leoLanguageButton"), menu=document.getElementById("leoLanguageMenu");
  if(!btn||!menu)return;
  function current(){try{return localStorage.getItem("leoostore-language")||"id"}catch(e){return "id"}}
  function paint(lang){var v=langs[lang]||langs.id;document.getElementById("leoLanguageFlag").textContent=v.flag;document.getElementById("leoLanguageLabel").textContent=v.label;menu.querySelectorAll("[data-lang]").forEach(function(b){b.classList.toggle("selected",b.dataset.lang===lang)})}
  function apply(lang){
    try{localStorage.setItem("leoostore-language",lang)}catch(e){}
    paint(lang);menu.hidden=true;btn.setAttribute("aria-expanded","false");
    var value=lang==="id"?"/auto/id":"/auto/"+lang;
    document.cookie="googtrans="+value+";path=/;max-age=31536000;SameSite=Lax";
    document.cookie="googtrans="+value+";path=/Leo-store/;max-age=31536000;SameSite=Lax";
    if(lang==="id"){document.cookie="googtrans=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";document.cookie="googtrans=;path=/Leo-store/;expires=Thu, 01 Jan 1970 00:00:00 GMT";}
    var select=document.querySelector(".goog-te-combo");
    if(select){select.value=lang==="id"?"":lang;select.dispatchEvent(new Event("change"));}
    else location.reload();
  }
  btn.addEventListener("click",function(){menu.hidden=!menu.hidden;btn.setAttribute("aria-expanded",String(!menu.hidden))});
  menu.querySelectorAll("[data-lang]").forEach(function(b){b.addEventListener("click",function(){apply(b.dataset.lang)})});
  document.addEventListener("click",function(e){if(!e.target.closest(".leo-language-wrap")){menu.hidden=true;btn.setAttribute("aria-expanded","false")}});
  paint(current());
  window.googleTranslateElementInit=function(){new google.translate.TranslateElement({pageLanguage:"id",includedLanguages:"id,en,ms,zh-CN,ja,ko,es",autoDisplay:false}, "google_translate_element");var l=current();if(l!=="id"){setTimeout(function(){var s=document.querySelector(".goog-te-combo");if(s){s.value=l;s.dispatchEvent(new Event("change"))}},700)}};
})();
</script>
<script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" async></script>