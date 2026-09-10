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
    "fidelis_orders";

  const LAST_ORDER_KEY =
    "fidelis_last_order";


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
    () => {

      paidButton.disabled =
        true;

      paidButton.textContent =
        "Memverifikasi...";


      setTimeout(
        () => {

          order.status =
            "Pembayaran Berhasil";

          order.paidAt =
            new Date().toISOString();


          saveOrder(
            order
          );


          window.location.replace(
            `order.html?id=${encodeURIComponent(
              order.orderId
            )}`
          );

        },
        1200
      );

    }
  );

});


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
          Saya Sudah Bayar
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
    "fidelis_orders";

  const LAST_ORDER_KEY =
    "fidelis_last_order";


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
