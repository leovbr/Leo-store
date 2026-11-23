(function(){
"use strict";
const selector='#pIconFile, input[data-product-icon-file]';
let activeInput=null,cropper=null,cropperReady=null,sourceUrl=null;
const $=id=>document.getElementById(id);
function loadCropper(){
 if(window.Cropper)return Promise.resolve();
 if(cropperReady)return cropperReady;
 cropperReady=new Promise((resolve,reject)=>{
  if(!$('leo-cropper-css')){const l=document.createElement('link');l.id='leo-cropper-css';l.rel='stylesheet';l.href='https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.css';document.head.appendChild(l);}
  const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.2/cropper.min.js';s.onload=resolve;s.onerror=()=>reject(new Error('Editor gambar gagal dimuat. Periksa koneksi internet.'));document.head.appendChild(s);
 });return cropperReady;
}
function ensureModal(){
 if($('leoImageEditor'))return;
 const st=document.createElement('style');st.textContent=`
 #leoImageEditor{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:12px;background:#02060edb;backdrop-filter:blur(8px)}
 #leoImageEditor.open{display:flex}#leoImageEditor .leo-dialog{width:min(1050px,100%);max-height:95dvh;overflow:auto;background:#101827;border:1px solid #344158;border-radius:18px;color:#f5f7fc;box-shadow:0 24px 80px #000b}
 #leoImageEditor .leo-head{position:sticky;top:0;z-index:4;display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:#101827;border-bottom:1px solid #29364a}
 #leoImageEditor h2{margin:0;font-size:17px}#leoImageEditor button{cursor:pointer;border:0;border-radius:9px;padding:9px 11px;font-weight:700}
 #leoImageEditor .leo-body{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(260px,.8fr);gap:14px;padding:14px}
 #leoImageEditor .leo-section{min-width:0;background:#0b1220;border:1px solid #29364a;border-radius:13px;padding:12px}
 #leoImageEditor .leo-label{display:block;margin-bottom:10px;color:#b7c3d6;font-size:12px;font-weight:700}
 #leoImageEditor .leo-stage{height:min(48vh,460px);min-height:240px;overflow:hidden;border-radius:10px;background-color:#111827;background-image:linear-gradient(45deg,#263348 25%,transparent 25%),linear-gradient(-45deg,#263348 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#263348 75%),linear-gradient(-45deg,transparent 75%,#263348 75%);background-size:20px 20px;background-position:0 0,0 10px,10px -10px,-10px 0}
 #leoImageEditor .leo-stage img{display:block;max-width:100%;max-height:100%}
 #leoImageEditor .leo-tools{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
 #leoImageEditor .leo-tools button{background:#263247;color:#edf2fb;border:1px solid #3a4962;font-size:12px}
 #leoImageEditor .leo-tools button.active{background:#6242bd;border-color:#9672ff}
 #leoImageEditor .leo-zoom{display:flex;align-items:center;gap:9px;margin-top:12px;color:#aebbd0;font-size:12px}
 #leoImageEditor .leo-zoom input{flex:1;min-width:0;accent-color:#8b5cf6}
 #leoImageEditor .leo-card{max-width:390px;margin:0 auto;background:#17263a;border:1px solid #29384c;border-radius:16px;padding:11px;min-height:126px;display:flex;flex-direction:column;color:#f5f7fc}
 #leoImageEditor .leo-card-title{font-size:14px;font-weight:800;line-height:1.3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 #leoImageEditor .leo-card-price-row{display:flex;align-items:center;gap:10px;margin-top:9px}
 #leoImageEditor .leo-card-icon{width:42px;height:42px;flex:0 0 42px;object-fit:contain;background:transparent}\n @media(min-width:601px){#leoImageEditor .leo-card-icon{width:48px;height:48px;flex-basis:48px}}
 #leoImageEditor .leo-card-price{font-size:14px;font-weight:800;color:#8b5cf6}
 #leoImageEditor .leo-card-divider{height:1px;background:#334155;margin:9px 0 7px}
 #leoImageEditor .leo-card-delivery{display:flex;justify-content:flex-end;margin-top:auto}
 #leoImageEditor .leo-card-delivery span{padding:6px 10px;border:1px solid #7250aa;border-radius:999px;background:#282044;color:#c8b4f5;font-size:10px;font-weight:700}
 #leoImageEditor .leo-note{margin:9px 0 0;color:#8f9db3;font-size:11px;line-height:1.5}
 #leoImageEditor .leo-foot{position:sticky;bottom:0;display:flex;justify-content:flex-end;gap:8px;padding:12px 14px;background:#101827;border-top:1px solid #29364a}
 #leoImageEditor .leo-cancel{background:#263247;color:white}#leoImageEditor .leo-apply{background:#7046e8;color:white}
 @media(max-width:760px){#leoImageEditor{padding:6px;align-items:flex-start}#leoImageEditor .leo-dialog{max-height:97dvh}#leoImageEditor .leo-body{grid-template-columns:1fr;padding:9px;gap:9px}#leoImageEditor .leo-stage{height:33dvh;min-height:205px}#leoImageEditor .leo-head{padding:11px}}
 `;
 document.head.appendChild(st);
 const m=document.createElement('div');m.id='leoImageEditor';m.innerHTML=`
 <div class="leo-dialog" role="dialog" aria-modal="true" aria-labelledby="leoEditorTitle">
  <div class="leo-head"><div><h2 id="leoEditorTitle">Edit ikon produk</h2><small style="color:#9caac0">Atur crop, zoom, dan posisi sebelum upload</small></div><button type="button" class="leo-cancel" id="leoEditorClose">Tutup</button></div>
  <div class="leo-body">
   <section class="leo-section"><span class="leo-label">1. Editor gambar</span><div class="leo-stage"><img id="leoCropImage" alt="Gambar yang diedit"></div>
    <div class="leo-tools" id="leoRatioTools"><button type="button" data-ratio="free" class="active">Bebas</button><button type="button" data-ratio="1">1:1</button><button type="button" data-ratio="1.333333">4:3</button><button type="button" data-ratio="1.777778">16:9</button><button type="button" data-ratio="0.75">3:4</button><button type="button" data-ratio="0.5625">9:16</button></div>
    <div class="leo-zoom"><span>Zoom</span><input id="leoCropZoom" type="range" min="0" max="100" value="0"><b id="leoZoomValue">0%</b></div>
    <div class="leo-tools"><button type="button" id="leoRotateLeft">↶ Putar</button><button type="button" id="leoRotateRight">Putar ↷</button><button type="button" id="leoCropReset">Reset</button></div>
    <p class="leo-note">Kotak-kotak menandakan area transparan. Geser gambar dan batas crop sesuai kebutuhan. Rasio bebas tidak menambahkan background.</p>
   </section>
   <section class="leo-section"><span class="leo-label">2. Preview card nominal checkout</span><div class="leo-card"><div class="leo-card-title" id="leoPreviewTitle">100 (50+50) Diamonds - First Top Up</div><div class="leo-card-price-row"><img id="leoPreviewIcon" class="leo-card-icon" alt=""><div class="leo-card-price" id="leoPreviewPrice">Rp 14.599</div></div><div class="leo-card-divider"></div><div class="leo-card-delivery"><span>⚡ Proses Cepat</span></div></div><p class="leo-note">Preview memakai area ikon card checkout: 42 px di mobile dan 48 px pada layar lebih lebar. Transparansi dipertahankan.</p></section>
  </div>
  <div class="leo-foot"><button type="button" class="leo-cancel" id="leoEditorCancel">Batal</button><button type="button" class="leo-apply" id="leoEditorApply">Gunakan hasil edit</button></div>
 </div>`;document.body.appendChild(m);
 $('leoEditorClose').onclick=closeEditor;$('leoEditorCancel').onclick=closeEditor;m.addEventListener('click',e=>{if(e.target===m)closeEditor();});
 $('leoRotateLeft').onclick=()=>cropper&&cropper.rotate(-90);$('leoRotateRight').onclick=()=>cropper&&cropper.rotate(90);
 $('leoCropReset').onclick=()=>{if(cropper){cropper.reset();$('leoCropZoom').value=0;$('leoZoomValue').textContent='0%';setRatio('free');}};
 $('leoRatioTools').addEventListener('click',e=>{const b=e.target.closest('button[data-ratio]');if(b&&cropper)setRatio(b.dataset.ratio);});
 $('leoCropZoom').oninput=()=>{if(cropper){const n=Number($('leoCropZoom').value);cropper.zoomTo(1+n/100);$('leoZoomValue').textContent=n+'%';}};
 $('leoEditorApply').onclick=applyCrop;
}
function setRatio(v){cropper.setAspectRatio(v==='free'?NaN:Number(v));document.querySelectorAll('#leoRatioTools button').forEach(b=>b.classList.toggle('active',b.dataset.ratio===String(v)));}
function getInfo(input){const row=input.closest('tr');if(row)return{title:row.querySelector('[data-field="amount"]')?.value||'Produk game',price:Number(row.querySelector('[data-field="price"]')?.value)||14599};return{title:$('pAmount')?.value||'100 (50+50) Diamonds - First Top Up',price:Number($('pPrice')?.value)||14599};}
function updatePreview(){if(!cropper)return;const info=getInfo(activeInput);$('leoPreviewTitle').textContent=info.title;$('leoPreviewPrice').textContent='Rp '+new Intl.NumberFormat('id-ID').format(info.price||14599);try{$('leoPreviewIcon').src=cropper.getCroppedCanvas({maxWidth:1000,maxHeight:1000,fillColor:null}).toDataURL('image/png');}catch(_){}}
function openEditor(input,file){
 activeInput=input;loadCropper().then(()=>{ensureModal();const info=getInfo(input);$('leoPreviewTitle').textContent=info.title;$('leoPreviewPrice').textContent='Rp '+new Intl.NumberFormat('id-ID').format(info.price||14599);
 const img=$('leoCropImage');if(cropper){cropper.destroy();cropper=null;}if(sourceUrl)URL.revokeObjectURL(sourceUrl);sourceUrl=URL.createObjectURL(file);
 img.onload=()=>{cropper=new Cropper(img,{viewMode:1,dragMode:'crop',autoCropArea:.82,aspectRatio:NaN,background:false,responsive:true,restore:false,checkOrientation:true,modal:true,guides:true,center:true,highlight:true,cropBoxMovable:true,cropBoxResizable:true,toggleDragModeOnDblclick:false,zoomable:true,zoomOnWheel:true,zoomOnTouch:true,movable:true,rotatable:true,crop(){updatePreview();}});$('leoCropZoom').value=0;$('leoZoomValue').textContent='0%';$('leoRatioTools').querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.ratio==='free'));$('leoImageEditor').classList.add('open');document.body.style.overflow='hidden';updatePreview();};img.src=sourceUrl;
 }).catch(err=>{alert(err.message||String(err));input.value='';});
}
function closeEditor(){const m=$('leoImageEditor');if(!m)return;m.classList.remove('open');document.body.style.overflow='';if(cropper){cropper.destroy();cropper=null;}if(sourceUrl){URL.revokeObjectURL(sourceUrl);sourceUrl=null;}activeInput=null;}
function applyCrop(){
 if(!cropper||!activeInput)return;const canvas=cropper.getCroppedCanvas({maxWidth:1024,maxHeight:1024,fillColor:null,imageSmoothingEnabled:true,imageSmoothingQuality:'high'});if(!canvas){alert('Gambar tidak dapat diproses.');return;}
 canvas.toBlob(blob=>{if(!blob){alert('Gagal menyiapkan gambar hasil edit.');return;}const old=activeInput.files?.[0],base=(old?.name||'ikon-produk').replace(/\.[^.]+$/,'').replace(/[^a-z0-9_-]/gi,'-')||'ikon-produk';const edited=new File([blob],base+'-edited.png',{type:'image/png',lastModified:Date.now()});const dt=new DataTransfer();dt.items.add(edited);activeInput.files=dt.files;activeInput.dataset.leoCropReady='1';
 if(activeInput.id==='pIconFile'){const preview=$('pIconPreview'),wrap=$('pIconPreviewWrap');if(preview&&wrap){preview.src=URL.createObjectURL(edited);wrap.classList.add('has-image');}}
 activeInput.dispatchEvent(new Event('change',{bubbles:true}));closeEditor();const status=$('authStatus');if(status)status.textContent='Hasil edit siap di-upload. Tekan tombol Upload ikon produk untuk menyimpan ke Supabase.';
 },'image/png');
}
document.addEventListener('change',e=>{const input=e.target;if(!input.matches?.(selector))return;if(input.dataset.leoCropReady==='1'){delete input.dataset.leoCropReady;return;}const file=input.files?.[0];if(!file)return;if(!/^image\/(jpeg|png|webp)$/.test(file.type)){alert('Pilih gambar JPG, PNG, atau WebP.');input.value='';return;}if(file.size>5*1024*1024){alert('Ukuran file maksimal 5 MB.');input.value='';return;}e.stopImmediatePropagation();openEditor(input,file);},true);
})();