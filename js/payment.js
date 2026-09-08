/* =========================================
   LEO STORE
   PAYMENT ENGINE
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const container =
    document.getElementById("paymentContainer");

  if (!container) return;


  /* =========================================
     GET ORDER ID
     ========================================= */

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


  /* =========================================
     LOAD ORDER
     ========================================= */

  let orders = [];

  try {

    orders =
      JSON.parse(
        localStorage.getItem(
          "fidelis_orders"
        )
      ) || [];

  } catch (error) {

    orders = [];

  }


  let order =
    orders.find(
      item =>
        item.orderId === orderId
    );


  /* =========================================
     FALLBACK LAST ORDER
     ========================================= */

  if (!order) {

    try {

      const lastOrder =
        JSON.parse(
          localStorage.getItem(
            "fidelis_last_order"
          )
        );

      if (
        lastOrder &&
        lastOrder.orderId === orderId
      ) {

        order =
          lastOrder;

      }

    } catch (error) {

      console.error(
        "Gagal membaca last order:",
        error
      );

    }

  }


  /* =========================================
     ORDER NOT FOUND
     ========================================= */

  if (!order) {

    showError(
      container,
      "Pesanan tidak ditemukan."
    );

    return;

  }


  /* =========================================
     PAYMENT NAME
     ========================================= */

  let paymentName =
    order.payment;


  if (order.payment === "qris") {
    paymentName = "QRIS";
  }

  if (order.payment === "ewallet") {
    paymentName = "E-Wallet";
  }

  if (order.payment === "bank") {
    paymentName = "Virtual Account";
  }


  /* =========================================
     RENDER PAYMENT
     ========================================= */

  container.innerHTML = `

    <div class="order-header">

      <p>
        Order ID
      </p>

      <h3>
        ${escapeHTML(order.orderId)}
      </h3>

    </div>

    <hr>

    <div class="order-info">

      <p>
        <strong>Game:</strong>
        ${escapeHTML(order.gameName)}
      </p>

      <p>
        <strong>Player:</strong>
        ${escapeHTML(order.playerId)}
      </p>

      ${
        order.server
          ? `
            <p>
              <strong>Server:</strong>
              ${escapeHTML(order.server)}
            </p>
          `
          : ""
      }

      <p>
        <strong>Produk:</strong>
        ${escapeHTML(order.amount)}
      </p>

      <p>
        <strong>Pembayaran:</strong>
        ${escapeHTML(paymentName)}
      </p>

    </div>

    <hr>

    <div class="payment-box">

      <h3>
        Menunggu Pembayaran
      </h3>

      <p>
        Silakan lakukan pembayaran sebesar:
      </p>

      <h2>
        ${formatPrice(
          Number(order.price)
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
          : ""
      }

      ${
        order.payment === "ewallet"
          ? `
            <p>
              Lakukan pembayaran melalui
              E-Wallet yang dipilih.
            </p>
          `
          : ""
      }

      ${
        order.payment === "bank"
          ? `
            <p>
              Lakukan pembayaran melalui
              Virtual Account.
            </p>
          `
          : ""
      }

      <button
        id="paidButton"
        type="button"
      >
        Saya Sudah Bayar
      </button>

    </div>

  `;


  /* =========================================
     PAID BUTTON
     ========================================= */

  const paidButton =
    document.getElementById(
      "paidButton"
    );

  if (!paidButton) return;


  paidButton.addEventListener(
    "click",
    () => {

      paidButton.disabled =
        true;

      paidButton.textContent =
        "Memverifikasi...";


      /* =====================================
         SIMULATE PAYMENT VERIFICATION
         ===================================== */

      setTimeout(
        () => {

          order.status =
            "Pembayaran Berhasil";

          order.paidAt =
            new Date().toISOString();


          /* =================================
             UPDATE ORDER
             ================================= */

          let currentOrders = [];

          try {

            currentOrders =
              JSON.parse(
                localStorage.getItem(
                  "fidelis_orders"
                )
              ) || [];

          } catch (error) {

            currentOrders = [];

          }


          const index =
            currentOrders.findIndex(
              item =>
                item.orderId ===
                order.orderId
            );


          if (index !== -1) {

            currentOrders[index] =
              order;

          } else {

            currentOrders.push(
              order
            );

          }


          /* =================================
             SAVE
             ================================= */

          localStorage.setItem(
            "fidelis_orders",
            JSON.stringify(
              currentOrders
            )
          );

          localStorage.setItem(
            "fidelis_last_order",
            JSON.stringify(
              order
            )
          );


          /* =================================
             REDIRECT
             ================================= */

          window.location.replace(
            `order.html?id=${encodeURIComponent(
              order.orderId
            )}`
          );

        },
        1500
      );

    }
  );

});


/* =========================================
   ERROR
   ========================================= */

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
        ${escapeHTML(message)}
      </p>

      <br>

      <a href="shop.html">

        <button>
          Kembali ke Top Up
        </button>

      </a>

    </div>

  `;

}


/* =========================================
   FORMAT PRICE
   ========================================= */

function formatPrice(price) {

  return new Intl.NumberFormat(
    "id-ID",
    {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }
  ).format(price);

}


/* =========================================
   SECURITY
   ========================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}
