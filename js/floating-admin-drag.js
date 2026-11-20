/* LEOOSTORE floating admin shortcut: drag-to-move with tap preserved. */
(function(){
  "use strict";
  const SELECTOR=".leo-floating-admin";
  const STORAGE_KEY="leo-floating-admin-position-v1";
  const THRESHOLD=15;
  const clamp=(value,min,max)=>Math.min(Math.max(value,min),Math.max(min,max));
  const readPosition=()=>{
    try{
      const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");
      return value&&Number.isFinite(value.x)&&Number.isFinite(value.y)?value:null;
    }catch(_){return null;}
  };
  const savePosition=(x,y)=>{
    try{localStorage.setItem(STORAGE_KEY,JSON.stringify({x:Math.round(x),y:Math.round(y)}));}catch(_){}
  };
  function init(button){
    if(button.dataset.dragReady==="1")return;
    button.dataset.dragReady="1";
    button.style.setProperty("touch-action","none","important");
    button.style.setProperty("user-select","none","important");
    button.style.setProperty("-webkit-user-select","none","important");
    button.style.setProperty("cursor","grab","important");
    button.draggable=false;

    let saved=readPosition();
    function place(x,y,persist){
      const rect=button.getBoundingClientRect();
      const left=clamp(x,8,window.innerWidth-rect.width-8);
      const top=clamp(y,8,window.innerHeight-rect.height-8);
      button.style.setProperty("left",left+"px","important");
      button.style.setProperty("top",top+"px","important");
      button.style.setProperty("right","auto","important");
      button.style.setProperty("bottom","auto","important");
      if(persist)savePosition(left,top);
      return {x:left,y:top};
    }
    if(saved){
      const pos=place(saved.x,saved.y,false);
      saved=pos;
      if(pos.x!==readPosition()?.x||pos.y!==readPosition()?.y)savePosition(pos.x,pos.y);
    }

    let pointer=null,dragged=false,startX=0,startY=0,startLeft=0,startTop=0;
    let suppressClick=false;
    button.addEventListener("pointerdown",event=>{
      if(event.pointerType==="mouse"&&event.button!==0)return;
      const rect=button.getBoundingClientRect();
      pointer=event.pointerId;
      dragged=false;
      startX=event.clientX;startY=event.clientY;
      startLeft=rect.left;startTop=rect.top;
      button.style.setProperty("cursor","grabbing","important");
    });
    button.addEventListener("pointermove",event=>{
      if(pointer!==event.pointerId)return;
      const dx=event.clientX-startX,dy=event.clientY-startY;
      if(!dragged&&Math.hypot(dx,dy)<THRESHOLD)return;
      if(!dragged){
        dragged=true;
        button.classList.add("leo-admin-dragging");
        button.style.setProperty("transition","none","important");
        try{button.setPointerCapture(event.pointerId);}catch(_){}
      }
      event.preventDefault();
      place(startLeft+dx,startTop+dy,false);
    });
    function finish(event){
      if(pointer!==event.pointerId)return;
      if(dragged){
        const rect=button.getBoundingClientRect();
        place(rect.left,rect.top,true);
        suppressClick=true;
        button.classList.remove("leo-admin-dragging");
        button.style.removeProperty("transition");
        try{button.releasePointerCapture(event.pointerId);}catch(_){}
        window.setTimeout(()=>{suppressClick=false;},450);
      }
      pointer=null;
      button.style.setProperty("cursor","grab","important");
    }
    button.addEventListener("pointerup",finish);
    button.addEventListener("pointercancel",finish);
    button.addEventListener("click",event=>{
      if(!suppressClick)return;
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressClick=false;
    },true);
    window.addEventListener("resize",()=>{
      const rect=button.getBoundingClientRect();
      const pos=place(rect.left,rect.top,false);
      if(readPosition())savePosition(pos.x,pos.y);
    },{passive:true});
  }
  function scan(){
    document.querySelectorAll(SELECTOR).forEach(init);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",scan,{once:true});
  else scan();
  new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});
})();