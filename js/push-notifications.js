/* LEOOSTORE Web Push opt-in helper — uses the signed-in Supabase account email. */
(() => {
  "use strict";
  const WORKER_URL = "https://spring-surf-a6a7.leovbriansyh791.workers.dev";
  const SUPABASE_URL = "https://tvdbrqskvuukxvqaqjom.supabase.co";
  const SUPABASE_KEY = "sb_publishable_2f-IadmcnaYzoCb_8Iko0w_pFp9u8eF";
  const scriptUrl = document.currentScript?.src || location.href;
  const base = new URL("../", scriptUrl);
  const api = path => WORKER_URL + path;
  let authClientPromise;
  function loadSupabaseAuth() {
    if (authClientPromise) return authClientPromise;
    authClientPromise = new Promise((resolve, reject) => {
      const ready = () => {
        try {
          if (!window.supabase?.createClient) throw new Error("Komponen login belum tersedia.");
          resolve(window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
            auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
          }));
        } catch (e) { reject(e); }
      };
      if (window.supabase?.createClient) { ready(); return; }
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.onload = ready;
      script.onerror = () => reject(new Error("Gagal memuat layanan akun."));
      document.head.appendChild(script);
    });
    return authClientPromise;
  }
  const b64ToBytes = value => {
    const raw = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
    return Uint8Array.from(raw, c => c.charCodeAt(0));
  };
  async function saveSubscription(registration, customerKey) {
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) throw new Error("Langganan notifikasi belum terbentuk. Tekan Aktifkan Notifikasi lagi.");
    const response = await fetch(api("/api/push/subscribe"), {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription: subscription.toJSON(), customerKey: customerKey || "" })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Gagal menyimpan perangkat.");
    return result;
  }
  async function enable() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) throw new Error("Browser ini belum mendukung Web Push.");
    const auth = await loadSupabaseAuth();
    const { data: sessionData, error: sessionError } = await auth.auth.getSession();
    if (sessionError) throw new Error("Gagal memeriksa akun login: " + sessionError.message);
    const user = sessionData?.session?.user;
    if (!user || user.is_anonymous || !user.email) throw new Error("Login atau daftar dulu menggunakan email, lalu aktifkan notifikasi.");
    const keyResponse = await fetch(api("/api/push/public-key"), { cache: "no-store" });
    const keyData = await keyResponse.json();
    if (!keyResponse.ok || !keyData.publicKey) throw new Error(keyData.error || "Konfigurasi push belum siap.");
    if (Notification.permission !== "granted" && await Notification.requestPermission() !== "granted") throw new Error("Izin notifikasi belum diberikan.");
    const registration = await navigator.serviceWorker.register(new URL("service-worker.js", base).href, { scope: base.pathname });
    await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToBytes(keyData.publicKey) });
    const result = await saveSubscription(registration, user.email.trim().toLowerCase());
    return result;
  }
  window.LEOOSTOREPush = { enable, promptAfterLogin: user => showLoginPrompt(user, true) };
  function injectPromptStyles() {
    if (document.getElementById("leo-push-prompt-style")) return;
    const style = document.createElement("style");
    style.id = "leo-push-prompt-style";
    style.textContent = `
      #leo-push-prompt-overlay{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(3,6,18,.72);backdrop-filter:blur(7px)}
      #leo-push-prompt{width:min(100%,380px);box-sizing:border-box;border:1px solid rgba(167,139,250,.35);border-radius:22px;padding:24px;background:linear-gradient(145deg,#17152a,#0b1020);color:#f8fafc;box-shadow:0 24px 80px #0008;font-family:system-ui,-apple-system,sans-serif;text-align:center}
      #leo-push-prompt .leo-push-icon{width:54px;height:54px;display:grid;place-items:center;margin:0 auto 14px;border-radius:17px;background:rgba(139,92,246,.18);font-size:27px}
      #leo-push-prompt h2{font-size:20px;line-height:1.3;margin:0 0 9px;font-weight:800}
      #leo-push-prompt p{font-size:14px;line-height:1.6;color:#c4c8d6;margin:0 0 20px}
      #leo-push-prompt button{width:100%;border:0;border-radius:12px;padding:13px 16px;font-size:14px;font-weight:750;cursor:pointer}
      #leo-push-prompt .leo-push-primary{background:linear-gradient(100deg,#8b5cf6,#6d5dfc);color:white}
      #leo-push-prompt .leo-push-secondary{margin-top:8px;background:transparent;color:#c4c8d6}
      #leo-push-prompt button:disabled{opacity:.65;cursor:wait}
    `;
    document.head.appendChild(style);
  }
  async function showLoginPrompt(user, force = false) {
    if (!user || user.is_anonymous || !user.email || !document.body) return;
    // Always show the opt-in prompt after login; validate Web Push support only when the user enables it.
    if ("Notification" in window && Notification.permission === "denied") {
      // Keep the prompt visible so the user can see the setting and choose another time.
    }
    try {
      const registration = await navigator.serviceWorker?.getRegistration(base.pathname);
      if (registration && await registration.pushManager.getSubscription()) {
        await saveSubscription(registration, user.email.trim().toLowerCase());
        return;
      }
    } catch (_) {}
    try { if (!force && sessionStorage.getItem("leo-push-prompt-dismissed") === "1") return; } catch (_) {}
    if (document.getElementById("leo-push-prompt-overlay")) return;
    injectPromptStyles();
    const overlay = document.createElement("div");
    overlay.id = "leo-push-prompt-overlay";
    overlay.innerHTML = '<section id="leo-push-prompt" role="dialog" aria-modal="true" aria-labelledby="leo-push-prompt-title"><div class="leo-push-icon" aria-hidden="true">🔔</div><h2 id="leo-push-prompt-title">Aktifkan Notifikasi?</h2><p>Dapatkan kabar pesanan, balasan chat, dan promo LEOOSTORE. Email mengikuti akun yang sedang kamu gunakan.</p><button type="button" class="leo-push-primary" id="leo-push-prompt-enable">Aktifkan Notifikasi</button><button type="button" class="leo-push-secondary" id="leo-push-prompt-later">Nanti saja</button></section>';
    document.body.appendChild(overlay);
    const close = () => { try { sessionStorage.setItem("leo-push-prompt-dismissed", "1"); } catch (_) {} overlay.remove(); };
    overlay.querySelector("#leo-push-prompt-later").addEventListener("click", close);
    overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
    overlay.querySelector("#leo-push-prompt-enable").addEventListener("click", async event => {
      const button = event.currentTarget;
      button.disabled = true;
      button.textContent = "Mengaktifkan...";
      try {
        await enable();
        button.textContent = "Notifikasi Aktif ✓";
        try { sessionStorage.setItem("leo-push-prompt-dismissed", "1"); } catch (_) {}
        setTimeout(() => overlay.remove(), 900);
      } catch (error) {
        button.disabled = false;
        button.textContent = "Coba Lagi";
        alert(error.message || "Notifikasi belum bisa diaktifkan.");
      }
    });
  }
  function mountButton() {
    // No floating button: the opt-in prompt appears after login instead.
  }
  async function syncSignedInEmail() {
    try {
      const auth = await loadSupabaseAuth();
      const { data } = await auth.auth.getSession();
      if (data?.session?.user && !data.session.user.is_anonymous) {
        setTimeout(() => showLoginPrompt(data.session.user), 700);
      }
      auth.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session?.user && !session.user.is_anonymous) {
          setTimeout(() => showLoginPrompt(session.user), 700);
        }
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED" || event === "SIGNED_OUT") {
          setTimeout(async () => {
            try {
              const registration = await navigator.serviceWorker?.getRegistration(base.pathname);
              if (!registration || !(await registration.pushManager.getSubscription())) return;
              const email = session?.user && !session.user.is_anonymous ? (session.user.email || "").trim().toLowerCase() : "";
              await saveSubscription(registration, email);
            } catch (e) { console.warn("Gagal memperbarui akun notifikasi:", e); }
          }, 0);
        }
      });
    } catch (e) { console.warn("Sinkronisasi email akun untuk notifikasi belum tersedia:", e); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountButton, {once:true}); else mountButton();
  syncSignedInEmail();
})();