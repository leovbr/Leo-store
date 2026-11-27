/* LEOOSTORE customer order reviews */
(function () {
  "use strict";
  const API = "https://spring-surf-a6a7.leovbriansyh791.workers.dev";
  const paidStatuses = ["Pembayaran Berhasil", "Pesanan Diproses", "Top Up Berhasil"];
  const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
  function showReview(order) {
    const area = document.getElementById("orderReviewArea");
    if (!area || !paidStatuses.includes(String(order.status || ""))) return;
    if (order.review && Number(order.review.rating) >= 1 && Number(order.review.rating) <= 5) {
      const n = Number(order.review.rating);
      area.innerHTML = '<section class="leo-review-card"><strong>Ulasan Kamu</strong><span class="leo-review-gold">' + "★".repeat(n) + "☆".repeat(5-n) + '</span><p>' + (order.review.comment ? esc(order.review.comment) : "Tanpa komentar tertulis.") + '</p><small>Terima kasih atas ulasanmu.</small></section>';
      return;
    }
    area.innerHTML = '<section class="leo-review-card"><strong>Bagaimana pengalaman top up kamu?</strong><p>Bantu kami meningkatkan layanan LEOOSTORE.</p><button type="button" class="order-detail-button order-primary-button" id="leoOpenReview">Beri Ulasan</button></section>';
    document.getElementById("leoOpenReview").addEventListener("click", () => openModal(order));
    if (order._backendVerified) {
      let dismissed = false;
      try { dismissed = sessionStorage.getItem("LEOOSTORE_review_dismissed_" + order.orderId) === "1"; } catch (_) {}
      if (!dismissed) openModal(order);
    }
  }
  function openModal(order) {
    if (document.getElementById("leo-order-review-modal")) return;
    let rating = 0;
    if (!document.getElementById("leo-review-css")) {
      const style = document.createElement("style");
      style.id = "leo-review-css";
      style.textContent = "#leo-order-review-modal{position:fixed;inset:0;z-index:2147483646;display:grid;place-items:center;padding:18px;background:#030712cc;backdrop-filter:blur(9px)}#leo-order-review-modal .dialog{box-sizing:border-box;width:min(100%,420px);padding:23px 20px;border:1px solid #7056a8;border-radius:21px;background:linear-gradient(145deg,#17152b,#0c1424);color:#f5f3ff;font-family:inherit;box-shadow:0 24px 80px #0009}#leo-order-review-modal h2{margin:0 0 8px;font-size:19px}#leo-order-review-modal p{color:#aeb8cb;font-size:12px;line-height:1.6}#leo-order-review-modal .stars{display:flex;justify-content:center;gap:8px;margin:12px 0}#leo-order-review-modal .star{border:0;background:none;color:#596277;font-size:37px;padding:2px}#leo-order-review-modal .star.active{color:#f6c453}#leo-order-review-modal .rating-label{text-align:center;color:#d7c6ff;font-weight:700}#leo-order-review-modal label{display:block;margin:12px 0 6px;font-size:12px}#leo-order-review-modal textarea{box-sizing:border-box;width:100%;min-height:105px;padding:12px;border:1px solid #344158;border-radius:12px;background:#080f1d;color:#fff;font:13px/1.6 inherit}#leo-order-review-modal .error{min-height:18px;color:#fca5a5}#leo-order-review-modal .actions{display:flex;gap:9px}#leo-order-review-modal .actions button{flex:1;padding:12px;border:1px solid #514078;border-radius:10px;background:#1b2940;color:#fff;font-weight:800}#leo-order-review-modal .actions button[type=submit]{background:#713bd2}.leo-review-card{margin:16px 0;padding:15px;border:1px solid #514078;border-radius:15px;background:#17152b;color:#f5f3ff}.leo-review-card p{color:#cbd5e1;overflow-wrap:anywhere}.leo-review-card small{color:#9caac0}.leo-review-gold{float:right;color:#f6c453;letter-spacing:2px}";
      document.head.appendChild(style);
    }
    const modal = document.createElement("div");
    modal.id = "leo-order-review-modal";
    const starButtons = [1,2,3,4,5].map(n => '<button type="button" class="star" data-rating="' + n + '" aria-label="' + n + ' bintang">★</button>').join("");
    modal.innerHTML = '<form class="dialog" id="leoReviewForm"><h2>Bagaimana pengalaman kamu?</h2><p>Pembayaran <strong>' + esc(order.orderId) + '</strong> berhasil. Berikan rating dan ceritakan pengalamanmu.</p><div class="stars">' + starButtons + '</div><p class="rating-label" id="leoReviewLabel">Pilih 1–5 bintang</p><label for="leoReviewText">Tulis ulasan</label><textarea id="leoReviewText" maxlength="1000" placeholder="Ceritakan pengalaman top up kamu... (opsional)"></textarea><p class="error" id="leoReviewError" aria-live="polite"></p><div class="actions"><button type="button" id="leoReviewLater">Nanti</button><button type="submit" id="leoReviewSend">Kirim Ulasan</button></div></form>';
    document.body.appendChild(modal);
    const labels = ["","Sangat buruk","Kurang baik","Cukup","Memuaskan","Sangat memuaskan"];
    const stars = Array.from(modal.querySelectorAll("[data-rating]"));
    stars.forEach(b => b.addEventListener("click", () => {
      rating = Number(b.dataset.rating);
      stars.forEach(x => x.classList.toggle("active", Number(x.dataset.rating) <= rating));
      modal.querySelector("#leoReviewLabel").textContent = labels[rating];
    }));
    const close = () => {
      try { sessionStorage.setItem("LEOOSTORE_review_dismissed_" + order.orderId, "1"); } catch (_) {}
      modal.remove();
    };
    modal.querySelector("#leoReviewLater").addEventListener("click", close);
    modal.addEventListener("click", e => { if (e.target === modal) close(); });
    modal.querySelector("#leoReviewForm").addEventListener("submit", async e => {
      e.preventDefault();
      const send = modal.querySelector("#leoReviewSend"), err = modal.querySelector("#leoReviewError");
      if (!rating) { err.textContent = "Pilih rating bintang terlebih dahulu."; return; }
      send.disabled = true; send.textContent = "Mengirim...";
      try {
        const response = await fetch(API + "/api/orders/" + encodeURIComponent(order.orderId) + "/review", {
          method: "POST", headers: {"Content-Type":"application/json"},
          body: JSON.stringify({rating, comment: modal.querySelector("#leoReviewText").value.trim(), email: order.email || "", whatsapp: order.whatsapp || ""})
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.ok) throw new Error(result.error || "Ulasan gagal dikirim.");
        order.review = result.review;
        const key = "LEOOSTORE_orders";
        try {
          const list = JSON.parse(localStorage.getItem(key) || "[]");
          const i = list.findIndex(x => String(x.orderId) === String(order.orderId));
          if (i >= 0) { list[i] = Object.assign({}, list[i], {review:result.review}); localStorage.setItem(key, JSON.stringify(list)); }
          const last = JSON.parse(localStorage.getItem("LEOOSTORE_last_order") || "null");
          if (last && String(last.orderId) === String(order.orderId)) localStorage.setItem("LEOOSTORE_last_order", JSON.stringify(Object.assign({}, last, {review:result.review})));
        } catch (_) {}
        modal.remove();
        if (typeof window.renderCurrentPage === "function") window.renderCurrentPage(order);
        else showReview(order);
      } catch (error) {
        err.textContent = error.message || "Gagal mengirim ulasan.";
        send.disabled = false; send.textContent = "Kirim Ulasan";
      }
    });
  }
  window.LEOOrderReview = showReview;
})();