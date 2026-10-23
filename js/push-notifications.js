/* LEOOSTORE Web Push opt-in helper */
(() => {
  "use strict";
  const WORKER_URL = "https://spring-surf-a6a7.<YOUR_ACCOUNT_SUBDOMAIN>.workers.dev";
  const scriptUrl = document.currentScript?.src || location.href;
  const base = new URL("../", scriptUrl);
  const api = path => WORKER_URL + path;
  const b64ToBytes = value => {
    const raw = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
    return Uint8Array.from(raw, c => c.charCodeAt(0));
  };
  async function enable() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) throw new Error("Browser ini belum mendukung Web Push.");
    const keyResponse = await fetch(api("/api/push/public-key"), { cache: "no-store" });
    const keyData = await keyResponse.json();
    if (!keyResponse.ok || !keyData.publicKey) throw new Error(keyData.error || "Konfigurasi push belum siap.");
    if (await Notification.requestPermission() !== "granted") throw new Error("Izin notifikasi belum diberikan.");
    const registration = await navigator.serviceWorker.register(new URL("service-worker.js", base).href, { scope: base.pathname });
    await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(keyData.publicKey) });
    const response = await fetch(api("/api/push/subscribe"), {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription: subscription.toJSON(), customerKey: localStorage.getItem("leo_push_customer_key") || "" })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Gagal menyimpan perangkat.");
    return result;
  }
  window.LEOOSTOREPush = { enable };
  function mountButton() {
    if (document.getElementById("leo-push-enable")) return;
    const b = document.createElement("button"); b.id = "leo-push-enable"; b.type = "button"; b.textContent = "Aktifkan Notifikasi";
    b.setAttribute("aria-label", "Aktifkan notifikasi LEOOSTORE");
    Object.assign(b.style, {position:"fixed",right:"14px",bottom:"14px",zIndex:"9999",border:"1px solid #8b5cf6",borderRadius:"999px",padding:"11px 15px",background:"#17112b",color:"#fff",font:"600 13px system-ui",boxShadow:"0 5px 24px #0003"});
    b.addEventListener("click", async () => { b.disabled=true; const old=b.textContent; b.textContent="Mengaktifkan..."; try { await enable(); b.textContent="Notifikasi Aktif ✓"; } catch(e) { b.textContent=old; alert(e.message || "Notifikasi belum bisa diaktifkan."); } finally { b.disabled=false; } });
    document.body.appendChild(b);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountButton, {once:true}); else mountButton();
})();