(function(){
"use strict";
const API="https://spring-surf-a6a7.leovbriansyh791.workers.dev";
const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const date=value=>{const d=new Date(value);return Number.isNaN(d.getTime())?"":new Intl.DateTimeFormat("id-ID",{day:"numeric",month:"long",year:"numeric",timeZone:"Asia/Jakarta"}).format(d);};
const time=value=>{const d=new Date(value);return Number.isNaN(d.getTime())?"":new Intl.DateTimeFormat("id-ID",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Jakarta"}).format(d)+" WIB";};
async function load(){
 const list=document.getElementById("leoPublicReviewList"),average=document.getElementById("leoPublicAverage"),count=document.getElementById("leoPublicCount");
 if(!list)return;
 try{
  const full=new URLSearchParams(location.search).get("all")==="1";
  const response=await fetch(API+"/api/reviews?limit="+(full?50:6),{cache:"no-store"});
  const data=await response.json();
  if(!response.ok||!data.ok)throw new Error(data.error||"Ulasan belum tersedia.");
  if(average)average.textContent=Number(data.average||0).toFixed(1);
  if(count)count.textContent=Number(data.count||0)+" ulasan pelanggan";
  if(!data.items?.length){list.innerHTML='<p class="leo-public-review-loading">Belum ada ulasan pelanggan. Jadilah yang pertama memberikan ulasan setelah transaksi berhasil.</p>';return;}
  list.innerHTML=data.items.map(item=>'<article class="leo-public-review-card"><div class="review-card-top"><div class="review-card-identity"><strong>'+esc(String((item.displayName==="Pelanggan LEOOSTORE"?"Pelanggan LEOOSTORE.id":(item.displayName||"Pelanggan LEOOSTORE.id"))).replace(/ #\d{3,}$/,""))+'</strong>'+(Number(item.reviewNumber)>0?'<span class="leo-review-number">#'+String(item.reviewNumber).padStart(3,"0")+'</span>':'')+'</div><span class="review-stars" aria-label="'+Number(item.rating)+' dari 5 bintang">'+"★".repeat(Math.max(0,Math.min(5,Number(item.rating)||0)))+'</span></div>'+(item.comment?'<p>'+esc(item.comment)+'</p>':'<p class="leo-public-review-loading">Pelanggan memberikan rating tanpa komentar.</p>')+'<div class="leo-review-purchase-meta"><div><small>GAME</small><strong>'+esc(item.productName||"—")+'</strong></div><div><small>NOMINAL</small><strong>'+esc(item.denomination||"—")+'</strong></div><div class="leo-review-purchase-time"><small>WAKTU TRANSAKSI</small><strong>'+esc(date(item.transactionCreatedAt))+' · '+esc(time(item.transactionCreatedAt))+'</strong></div></div><time>Ulasan dikirim '+esc(date(item.createdAt))+'</time></article>').join("");
 }catch(error){list.innerHTML='<p class="leo-public-review-loading">Ulasan belum dapat dimuat. Coba refresh halaman beberapa saat lagi.</p>';console.warn("Public reviews:",error);}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",load,{once:true});else load();
})();