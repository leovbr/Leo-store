/* LEOOSTORE public catalog adapter. Public read only; never use this for trusted price validation. */
(function(){
  const SUPABASE_URL="https://tvdbrqskvuukxvqaqjom.supabase.co";
  const SUPABASE_KEY="sb_publishable_2f-IadmcnaYzoCb_8Iko0w_pFp9u8eF";
  let clientPromise;
  function client(){
    if(!clientPromise) clientPromise=new Promise((resolve,reject)=>{
      if(window.supabase&&window.supabase.createClient){resolve(window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY));return;}
      const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      s.onload=()=>window.supabase&&window.supabase.createClient?resolve(window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY)):reject(new Error("Supabase library unavailable"));
      s.onerror=()=>reject(new Error("Supabase library failed to load"));document.head.appendChild(s);
    });
    return clientPromise;
  }
  async function getCatalog(fallback){
    try{
      const db=await client();
      const [gr,pr,sr]=await Promise.all([
        db.from("store_games").select("slug,name,publisher,description,icon_url,currency_icon_url,banner_url,is_active,sort_order").eq("is_active",true).order("sort_order"),
        db.from("store_products").select("id,game_slug,amount,price,icon_url,category,is_active,sort_order").eq("is_active",true).order("sort_order"),
        db.from("store_image_scales").select("game_slug,category,product_id,scale,icon_url")
      ]);
      if(gr.error)throw gr.error;if(pr.error)throw pr.error;const scales=sr.error?[]:(sr.data||[]);const categoryScales=new Map(scales.filter(x=>!x.product_id).map(x=>[x.game_slug+"::"+x.category,x]));const productScales=new Map(scales.filter(x=>x.product_id).map(x=>[x.game_slug+"::"+x.category+"::"+x.product_id,x]));
      if(!gr.data||!gr.data.length)return [];
      const itemsByGame=new Map();
      (pr.data||[]).forEach(p=>{
        if(!itemsByGame.has(p.game_slug))itemsByGame.set(p.game_slug,[]);
        itemsByGame.get(p.game_slug).push({id:String(p.id),amount:String(p.amount||p.id),price:Number(p.price)||0,category:p.category||"Top Up",image:String(p.icon_url||""),imageScale:Number(productScales.get(p.game_slug+"::"+(p.category||"Top Up")+"::"+p.id)?.scale||categoryScales.get(p.game_slug+"::"+(p.category||"Top Up"))?.scale||100),image:String(productScales.get(p.game_slug+"::"+(p.category||"Top Up")+"::"+p.id)?.icon_url||categoryScales.get(p.game_slug+"::"+(p.category||"Top Up"))?.icon_url||p.icon_url||"")});
      });
      const catalog=gr.data.map(g=>{
        let description=String(g.description||"");
        let accountFields={useId:true,useServer:true,idLabel:"Player ID",idRequired:true,serverMode:null,serverOptions:[],serverRequired:true};
        const meta=description.match(/\n?\[\[LEO_CONFIG:(.*?)\]\]$/);
        if(meta){try{accountFields={...accountFields,...JSON.parse(meta[1])};}catch(_){}description=description.replace(/\n?\[\[LEO_CONFIG:.*?\]\]$/,"").trim();}
        return {id:String(g.slug),slug:String(g.slug),name:String(g.name||g.slug),publisher:g.publisher||"Publisher",description,image:g.icon_url||"",currencyIcon:g.currency_icon_url||"",banner:g.banner_url||"",icon:"🎮",useId:accountFields.useId!==false,useServer:accountFields.useServer!==false,accountConfig:{idLabel:String(accountFields.idLabel||"Player ID"),idRequired:accountFields.idRequired!==false,serverMode:["none","manual","select"].includes(accountFields.serverMode)?accountFields.serverMode:(accountFields.useServer===false?"none":"manual"),serverOptions:Array.isArray(accountFields.serverOptions)?accountFields.serverOptions.map(x=>String(x).trim()).filter(Boolean).slice(0,100):[],serverRequired:accountFields.serverRequired!==false},denominations:(itemsByGame.get(g.slug)||[]).map(item=>({...item,image:item.image||g.currency_icon_url||""}))};
      }).filter(g=>g.denominations.length);
      return catalog;
    }catch(e){console.error("[LEOOSTORE] Supabase catalog unavailable; hiding catalog to avoid showing stale/inactive products.",e);return [];}
  }
  window.LEOOSTORE_CATALOG={getCatalog};
})();