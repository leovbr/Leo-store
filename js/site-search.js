/* LEOOSTORE shared live game search — all visitor pages */
(function(){
  "use strict";
  const esc=value=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const uniqueCatalog=games=>{
    const bySlug=new Map();
    (Array.isArray(games)?games:[]).forEach(game=>{
      if(!game||!game.slug||!game.name)return;
      const slug=String(game.slug).trim().toLowerCase();
      if(!bySlug.has(slug))bySlug.set(slug,game);
    });
    const byName=new Map();
    [...bySlug.values()].forEach(game=>{
      const name=String(game.name).trim().toLocaleLowerCase("id-ID");
      if(!byName.has(name))byName.set(name,game);
    });
    return [...byName.values()];
  };
  const highlight=(name,terms)=>{
    const source=String(name||""),lower=source.toLocaleLowerCase("id-ID"),ranges=[];
    terms.forEach(term=>{let at=0;while(term&&(at=lower.indexOf(term,at))!==-1){ranges.push([at,at+term.length]);at+=term.length;}});
    ranges.sort((a,b)=>a[0]-b[0]||b[1]-a[1]);
    const merged=[];
    ranges.forEach(range=>{const last=merged[merged.length-1];if(last&&range[0]<=last[1])last[1]=Math.max(last[1],range[1]);else merged.push(range.slice());});
    let html="",cursor=0;
    merged.forEach(([start,end])=>{html+=esc(source.slice(cursor,start))+'<mark class="site-search-highlight">'+esc(source.slice(start,end))+'</mark>';cursor=end;});
    return html+esc(source.slice(cursor));
  };
  function init(){
    const input=document.getElementById("siteSearch"),panel=document.getElementById("searchPanel");
    if(!input||!panel)return;
    const header=document.querySelector(".site-header");
    const positionPanel=()=>{
      if(!panel)return;
      const headerBottom=header?.getBoundingClientRect().bottom;
      const top=Number.isFinite(headerBottom)&&headerBottom>0?headerBottom:0;
      panel.style.setProperty("--leo-search-top",top+"px");
    };
    // Capture runs before each page's existing search-button toggle handler.
    document.addEventListener("click",event=>{
      if(event.target.closest("#searchButton"))positionPanel();
    },true);
    window.addEventListener("resize",()=>{if(panel.classList.contains("active"))positionPanel();},{passive:true});
    window.addEventListener("scroll",()=>{if(panel.classList.contains("active"))positionPanel();},{passive:true});
    positionPanel();
    const inner=input.closest(".search-panel-inner");
    if(!inner)return;
    let results=document.getElementById("siteSearchResults");
    if(!results){results=document.createElement("div");results.id="siteSearchResults";results.className="site-search-results";results.setAttribute("role","listbox");results.setAttribute("aria-label","Hasil pencarian game");inner.appendChild(results);}
    let games=[];
    const render=()=>{
      const query=input.value.trim().toLocaleLowerCase("id-ID").replace(/\s+/g," ");
      if(!query){results.classList.remove("is-visible");results.innerHTML="";return;}
      if(!games.length){results.classList.add("is-visible");results.innerHTML='<div class="site-search-empty">Memuat katalog game...</div>';return;}
      const terms=query.split(" ").filter(Boolean);
      const matches=games.filter(game=>{
        const name=String(game.name||"").toLocaleLowerCase("id-ID");
        return terms.every(term=>name.includes(term));
      }).sort((a,b)=>{
        const an=String(a.name).toLocaleLowerCase("id-ID"),bn=String(b.name).toLocaleLowerCase("id-ID");
        const score=name=>name===query?0:name.startsWith(query)?1:name.split(/\s+/).some(word=>word.startsWith(query))?2:3;
        return score(an)-score(bn)||an.localeCompare(bn,"id");
      });
      results.classList.add("is-visible");
      if(!matches.length){results.innerHTML='<div class="site-search-empty">Game tidak ditemukan. Coba kata kunci lain.</div>';return;}
      results.innerHTML='<div class="site-search-results-label">'+matches.length+' game ditemukan</div>'+matches.slice(0,30).map(game=>{
        const image=game.image||game.icon_url||"";
        return '<a class="site-search-result" role="option" href="checkout.html?game='+encodeURIComponent(game.slug)+'">'+(image?'<img src="'+esc(image)+'" alt="" loading="lazy" onerror="this.style.display=\'none\'">':'<span class="site-search-result-icon" aria-hidden="true">🎮</span>')+'<span class="site-search-result-copy"><span class="site-search-result-name">'+highlight(game.name,terms)+'</span><span class="site-search-result-publisher">'+esc(game.publisher||"Game")+'</span></span><span class="site-search-result-arrow" aria-hidden="true">›</span></a>';
      }).join("");
    };
    input.addEventListener("input",render);
    input.addEventListener("keydown",event=>{if(event.key==="Escape"){panel.classList.remove("active");results.classList.remove("is-visible");}});
    document.getElementById("searchClose")?.addEventListener("click",()=>{input.value="";results.classList.remove("is-visible");results.innerHTML="";panel.classList.remove("active");});
    const catalog=window.LEOOSTORE_CATALOG;
    if(catalog&&typeof catalog.getCatalog==="function"){
      catalog.getCatalog([]).then(data=>{games=uniqueCatalog(data);render();}).catch(error=>{console.error("[LEOOSTORE] Shared search catalog failed:",error);games=[];});
    }else{
      results.classList.add("is-visible");results.innerHTML='<div class="site-search-empty">Katalog game belum dapat dimuat. Coba refresh halaman.</div>';
    }
    input.addEventListener("focus",()=>{if(input.value.trim())render();});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();