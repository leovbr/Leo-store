(() => {
"use strict";
const API="https://spring-surf-a6a7.leovbriansyh791.workers.dev";
const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const date=value=>{const d=new Date(value);return Number.isNaN(d.getTime())?"":new Intl.DateTimeFormat("id-ID",{day:"numeric",month:"long",year:"numeric",timeZone:"Asia/Jakarta"}).format(d);};
const time=value=>{const d=new Date(value);return Number.isNaN(d.getTime())?"":new Intl.DateTimeFormat("id-ID",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Jakarta"}).format(d)+" WIB";};
async function load(){
 const list=document.getElementById("leoPublicReviewList"),average=document.getElementById("leoPublicAverage"),count=document.getElementById("leoPublicCount");
 if(!list)return;
 const button=document.getElementById("leoPublicLoadMore");
 let offset=0,loading=false,finished=false;
 const batchSize=10;
 const full=new URLSearchParams(location.search).get("all")==="1";
 async function loadBatch(reset=false){
  if(loading||finished)return;loading=true;if(button){button.disabled=true;button.textContent="Memuat…";}
  try{
   const response=await fetch(API+"/api/reviews?limit="+batchSize+"&offset="+offset,{cache:"no-store"});
   const data=await response.json();if(!response.ok||!data.ok)throw new Error(data.error||"Ulasan belum tersedia.");
   if(average)average.textContent=Number(data.average||0).toFixed(1);
   if(count)count.textContent=Number(data.count||0)+" ulasan pelanggan";
   const items=Array.isArray(data.items)?data.items:[];
   const cards=items.map(item=>'<article class="leo-public-review-card"><div class="review-card-top"><div class="review-card-identity"><strong>'+esc(String((item.displayName==="Pelanggan LEOOSTORE"?"Pelanggan LEOOSTORE.id":(item.displayName||"Pelanggan LEOOSTORE.id"))).replace(/ #\d{3,}$/,""))+'</strong>'+(Number(item.reviewNumber)>0?'<span class="leo-review-number">#'+String(item.reviewNumber).padStart(3,"0")+'</span>':'')+'</div><span class="review-stars" aria-label="'+Number(item.rating)+' dari 5 bintang">'+"★".repeat(Math.max(0,Math.min(5,Number(item.rating)||0)))+'</span></div>'+(item.comment?'<p>'+esc(item.comment)+'</p>':'<p class="leo-public-review-loading">Pelanggan memberikan rating tanpa komentar.</p>')+'<div class="leo-review-purchase-meta"><div><small>GAME</small><strong>'+esc(item.productName||"—")+'</strong></div><div><small>NOMINAL</small><strong>'+esc(item.denomination||"—")+'</strong></div><div class="leo-review-purchase-time"><small>WAKTU TRANSAKSI</small><strong>'+esc(date(item.transactionCreatedAt))+' · '+esc(time(item.transactionCreatedAt))+'</strong></div></div><time>Ulasan dikirim '+esc(date(item.createdAt))+'</time></article>').join("");
   if(offset===0)list.innerHTML=cards||'<p class="leo-public-review-loading">Belum ada ulasan pelanggan. Jadilah yang pertama memberikan ulasan setelah transaksi berhasil.</p>';
   else if(cards)list.insertAdjacentHTML("beforeend",cards);
   offset+=items.length;finished=items.length<batchSize||offset>=Number(data.count||0);
   if(button){button.hidden=finished;button.disabled=false;button.textContent="Lihat Ulasan Lainnya";}
  }catch(error){if(offset===0)list.innerHTML='<p class="leo-public-review-loading">Ulasan belum dapat dimuat. Coba refresh halaman beberapa saat lagi.</p>';if(button){button.hidden=false;button.disabled=false;button.textContent="Coba Muat Ulang";}console.warn("Public reviews:",error);}
  finally{loading=false;}
 }
 if(button)button.addEventListener("click",()=>{if(finished){finished=false;}loadBatch();});
 await loadBatch();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",load,{once:true});else load();
})();
