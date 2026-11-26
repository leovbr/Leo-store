/* =========================================================
   LEOOSTORE — PAYMENT ENGINE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const container =
    document.getElementById(
      "paymentContainer"
    );


  if (!container) return;


  const ORDERS_KEY =
  "LEOOSTORE_orders";

const LAST_ORDER_KEY =
  "LEOOSTORE_last_order";


  const params =
    new URLSearchParams(
      window.location.search
    );


  const orderId =
    params.get("id");


  if (!orderId) {

    showError(
      container,
      "Order ID tidak ditemukan."
    );

    return;

  }


  let orders = [];


  try {

    orders =
      JSON.parse(
        localStorage.getItem(
          ORDERS_KEY
        )
      ) || [];

  } catch (error) {

    orders = [];

  }


  let order =
    orders.find(
      item =>
        String(item.orderId) ===
        String(orderId)
    );


  if (!order) {

    try {

      const lastOrder =
        JSON.parse(
          localStorage.getItem(
            LAST_ORDER_KEY
          )
        );


      if (
        lastOrder &&
        String(lastOrder.orderId) ===
        String(orderId)
      ) {

        order =
          lastOrder;

      }

    } catch (error) {

      console.error(error);

    }

  }


  if (!order) {

    showError(
      container,
      "Pesanan tidak ditemukan."
    );

    return;

  }


  /* =========================================================
     ALREADY PAID
  ========================================================= */

  if (
    order.status ===
      "Pembayaran Berhasil" ||
    order.status ===
      "Pesanan Diproses" ||
    order.status ===
      "Top Up Berhasil"
  ) {

    renderAlreadyPaid(
      container,
      order
    );

    return;

  }


  renderPayment(
    container,
    order
  );


  const paidButton =
    document.getElementById(
      "paidButton"
    );

  paidButton?.addEventListener(
    "click",
    async () => {
      paidButton.disabled = true;
      paidButton.textContent = "Mengecek Status...";

      try {
        const response = await fetch(
          "https://spring-surf-a6a7.leovbriansyh791.workers.dev/api/orders/" +
          encodeURIComponent(order.orderId),
          { cache: "no-store" }
        );
        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.ok) {
          throw new Error(result.error || "Status pembayaran belum dapat dicek.");
        }

        order.status = result.order?.status || order.status;
        saveOrder(order);

        window.location.replace(
          "order.html?id=" + encodeURIComponent(order.orderId)
        );
      } catch (error) {
        paidButton.disabled = false;
        paidButton.textContent = "Cek Status Pembayaran";
        showPaymentAlert(error.message || "Gagal mengecek status pembayaran.");
      }
    }
  );

});

/* =========================================================
   CUSTOMER THEMED ALERT
========================================================= */

function showPaymentAlert(message) {
  const existing = document.getElementById("leo-payment-alert");
  if (existing) existing.remove();

  if (!document.getElementById("leo-payment-alert-style")) {
    const style = document.createElement("style");
    style.id = "leo-payment-alert-style";
    style.textContent = [
      "#leo-payment-alert{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(4,7,18,.76);backdrop-filter:blur(9px);-webkit-backdrop-filter:blur(9px);animation:leoPayFade .18s ease}",
      "#leo-payment-alert .leo-pay-dialog{width:min(100%,390px);padding:26px 22px 20px;border:1px solid rgba(167,139,250,.28);border-radius:22px;background:linear-gradient(145deg,#17152b,#0c1020 72%);color:#f5f3ff;box-shadow:0 24px 80px rgba(0,0,0,.48),0 0 35px rgba(124,58,237,.13);font-family:Plus Jakarta Sans,Arial,sans-serif;text-align:center}",
      "#leo-payment-alert .leo-pay-icon{width:52px;height:52px;margin:0 auto 15px;display:grid;place-items:center;border-radius:17px;background:rgba(139,92,246,.16);border:1px solid rgba(167,139,250,.28);color:#c4b5fd;font-size:25px;font-weight:800}",
      "#leo-payment-alert h2{margin:0 0 9px;font-size:18px;font-weight:800;letter-spacing:-.02em}",
      "#leo-payment-alert p{margin:0;color:#b8b5ca;font-size:13px;line-height:1.65;overflow-wrap:anywhere}",
      "#leo-payment-alert button{width:100%;margin-top:22px;padding:12px 16px;border:0;border-radius:12px;background:linear-gradient(100deg,#7c3aed,#a855f7);color:#fff;font:700 13px Plus Jakarta Sans,Arial,sans-serif;cursor:pointer;box-shadow:0 7px 22px rgba(124,58,237,.25)}",
      "#leo-payment-alert button:focus-visible{outline:2px solid #ddd6fe;outline-offset:3px}",
      "@keyframes leoPayFade{from{opacity:0}to{opacity:1}}",
      "@media(prefers-reduced-motion:reduce){#leo-payment-alert{animation:none}}"
    ].join("");
    document.head.appendChild(style);
  }

  const overlay = document.createElement("div");
  overlay.id = "leo-payment-alert";
  overlay.innerHTML = '<section class="leo-pay-dialog" role="alertdialog" aria-modal="true" aria-labelledby="leo-pay-alert-title" aria-describedby="leo-pay-alert-message"><div class="leo-pay-icon" aria-hidden="true">!</div><h2 id="leo-pay-alert-title">Status Belum Dapat Dicek</h2><p id="leo-pay-alert-message"></p><button type="button" id="leo-pay-alert-ok">Mengerti</button></section>';
  overlay.querySelector("#leo-pay-alert-message").textContent = String(message || "Terjadi kesalahan. Silakan coba kembali.");
  document.body.appendChild(overlay);

  const close = () => {
    overlay.remove();
    document.removeEventListener("keydown", onKeydown);
  };
  const onKeydown = event => {
    if (event.key === "Escape" || event.key === "Enter") {
      event.preventDefault();
      close();
    }
  };
  overlay.querySelector("#leo-pay-alert-ok").addEventListener("click", close);
  overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
  document.addEventListener("keydown", onKeydown);
  overlay.querySelector("#leo-pay-alert-ok").focus();
}
/* =========================================================
   RENDER PAYMENT
========================================================= */

function renderPayment(
  container,
  order
) {

  const paymentName =
    order.paymentName ||
    getPaymentName(
      order.payment
    );


  container.innerHTML = `

    <div class="order-card">

      <div class="order-header">

        <p>
          Order ID
        </p>

        <h1>
          ${escapeHTML(
            order.orderId
          )}
        </h1>

        <span>
          Menunggu Pembayaran
        </span>

      </div>


      <hr>


      <div class="order-info">

        <p>
          <strong>Game:</strong>
          ${escapeHTML(
            order.gameName ||
            order.game
          )}
        </p>

        <p>
          <strong>Player ID:</strong>
          ${escapeHTML(
            order.playerId
          )}
        </p>

        ${
          order.server
            ? `
              <p>
                <strong>Server:</strong>
                ${escapeHTML(
                  order.server
                )}
              </p>
            `
            : ""
        }

        <p>
          <strong>Produk:</strong>
          ${escapeHTML(
            order.amount
          )}
        </p>

        <p>
          <strong>Jumlah:</strong>
          ${Number(
            order.quantity || 1
          )}
        </p>

        <p>
          <strong>Pembayaran:</strong>
          ${escapeHTML(
            paymentName
          )}
        </p>

      </div>


      <hr>


      <div class="payment-box">

        <p>
          Total pembayaran
        </p>

        <h2>
          ${formatPrice(
            order.price
          )}
        </h2>


        ${
          order.payment === "qris"
            ? `
              <div class="fake-qris">

                <div class="fake-qris-pattern">
                  ▦ ▦ ▦ ▦ ▦
                  <br>
                  ▦ ▦ ▦ ▦ ▦
                  <br>
                  ▦ ▦ ▦ ▦ ▦
                  <br>
                  ▦ ▦ ▦ ▦ ▦
                  <br>
                  ▦ ▦ ▦ ▦ ▦
                </div>

                <p>
                  QRIS PAYMENT
                </p>

              </div>

              <p>
                Scan QRIS untuk melakukan pembayaran.
              </p>
            `
            : `
              <div class="payment-method-info">

                <strong>
                  ${escapeHTML(
                    paymentName
                  )}
                </strong>

                <p>
                  Lakukan pembayaran melalui
                  metode yang dipilih.
                </p>

              </div>
            `
        }


        <button
          id="paidButton"
          type="button"
        >
          Cek Status Pembayaran
        </button>


        <a
          href="order.html?id=${encodeURIComponent(
            order.orderId
          )}"
        >
          <button
            type="button"
            class="secondary-button"
          >
            Kembali ke Pesanan
          </button>
        </a>

      </div>

    </div>

  `;

}


/* =========================================================
   ALREADY PAID
========================================================= */

function renderAlreadyPaid(
  container,
  order
) {

  container.innerHTML = `

    <div class="order-card">

      <div class="order-header">

        <p>
          Order ID
        </p>

        <h1>
          ${escapeHTML(
            order.orderId
          )}
        </h1>

        <span>
          ${escapeHTML(
            order.status
          )}
        </span>

      </div>


      <hr>


      <div class="payment-box">

        <h2>
          Pembayaran Sudah Diproses
        </h2>

        <p>
          Pesanan ini sudah melewati tahap pembayaran.
        </p>


        <a
          href="order.html?id=${encodeURIComponent(
            order.orderId
          )}"
        >

          <button type="button">
            Lihat Status Pesanan
          </button>

        </a>

      </div>

    </div>

  `;

}


/* =========================================================
   SAVE ORDER
========================================================= */

function saveOrder(order) {

  const ORDERS_KEY =
    "LEOOSTORE_orders";

  const LAST_ORDER_KEY =
    "LEOOSTORE_last_order";


  let orders = [];


  try {

    orders =
      JSON.parse(
        localStorage.getItem(
          ORDERS_KEY
        )
      ) || [];

  } catch (error) {

    orders = [];

  }


  const index =
    orders.findIndex(
      item =>
        item.orderId ===
        order.orderId
    );


  if (index !== -1) {

    orders[index] =
      order;

  } else {

    orders.push(
      order
    );

  }


  localStorage.setItem(
    ORDERS_KEY,
    JSON.stringify(orders)
  );


  localStorage.setItem(
    LAST_ORDER_KEY,
    JSON.stringify(order)
  );

}


/* =========================================================
   PAYMENT NAME
========================================================= */

function getPaymentName(payment) {

  const names = {

    qris: "QRIS",

    dana: "DANA",

    ovo: "OVO",

    shopeepay: "ShopeePay",

    linkaja: "LinkAja",

    "bni-va": "BNI VA",

    "maybank-va": "Maybank VA",

    "danamon-va": "Danamon VA",

    "mandiri-va": "Mandiri VA",

    "btn-va": "BTN VA",

    "doku-va": "DOKU VA",

    "cimb-va": "CIMB Niaga VA"

  };


  return (
    names[payment] ||
    payment ||
    "Pembayaran"
  );

}


/* =========================================================
   FORMAT
========================================================= */

function formatPrice(price) {

  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }
  ).format(
    Number(price || 0)
  );

}


/* =========================================================
   ERROR
========================================================= */

function showError(
  container,
  message
) {

  container.innerHTML = `

    <div class="order-empty">

      <h3>
        Terjadi Kesalahan
      </h3>

      <p>
        ${escapeHTML(
          message
        )}
      </p>

      <a href="shop.html">

        <button type="button">
          Kembali ke Top Up
        </button>

      </a>

    </div>

  `;

}


/* =========================================================
   SECURITY
========================================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}
