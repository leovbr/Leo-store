/* =========================================
   LEO STORE
   PAYMENT ENGINE
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const container =
    document.getElementById("paymentContainer");

  if (!container) return;


  /* =========================================
     AMBIL ORDER ID DARI URL
     ========================================= */

  const params =
    new URLSearchParams(
      window.location.search
    );

  const orderId =
    params.get("id");


  /* =========================================
     AMBIL DATA ORDER
     ========================================= */

  const orders =
    JSON.parse(
      localStorage.getItem(
        "fidelis_orders"
      )
    ) || [];

  let order =
    orders.find(
      item =>
        item.orderId === orderId
    );


  /* fallback ke last order */

  if (!order) {

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

      order = lastOrder;

    }

  }


  /* =========================================
     ORDER TIDAK DITEMUKAN
     ========================================= */

  if (!order) {

    container.innerHTML = `

      <div class="order-empty">

        <h3>
          Pesanan Tidak Ditemukan
        </h3>

        <p>
          Order ID tidak valid atau
          data pesanan sudah tidak tersedia.
        </p>

        <br>

        <a href="shop.html">
          <button>
            Kembali ke Top Up
          </button>
        </a>

      </div>

    `;

    return;

  }


  /* =========================================
     CEK STATUS
     ========================================= */

  if (
    order.status !==
    "Menunggu Pembayaran"
  ) {

    container.innerHTML = `

      <div class="order-empty">

        <h3>
          Pesanan Sudah Diproses
        </h3>

        <p>
          Status pesanan:
          <strong>
            ${escapeHTML(order.status)}
          </strong>
        </p>

        <br>

        <a href="order.html?id=${encodeURIComponent(order.orderId)}">
          <button>
            Lihat Pesanan
          </button>
        </a>

      </div>

    `;

    return;

  }


  /* =========================================
     PAYMENT METHOD
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
     RENDER PAYMENT PAGE
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
        <strong>Produk:</strong>
        ${escapeHTML(order.amount)}
      </p>

      <p>
        <strong>Pembayaran:</strong>
        ${escapeHTML(paymentName)}
      </p>

      <p>
        <strong>Total:</strong>
        ${formatPrice(
          Number(order.price)
        )}
      </p>

    </div>

    <hr>


    <div class="payment-box">

      <h3>
        Menunggu Pembayaran
      </h3>

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
              Silakan lakukan pembayaran
              melalui E-Wallet yang tersedia.
            </p>
          `
          : ""
      }


      ${
        order.payment === "bank"
          ? `
            <p>
              Silakan lakukan pembayaran
              melalui Virtual Account.
            </p>
          `
          : ""
      }


      <h2>
        ${formatPrice(
          Number(order.price)
        )}
      </h2>


      <button
        id="paidButton"
        type="button"
      >
        Saya Sudah Bayar
      </button>

    </div>

  `;


  /* =========================================
     BUTTON SUDAH BAYAR
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
        "Memverifikasi Pembayaran...";


      setTimeout(
        () => {

          /* update order */

          order.status =
            "Pembayaran Berhasil";


          /* update array */

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

            orders.push(order);

          }


          /* simpan */

          localStorage.setItem(
            "fidelis_orders",
            JSON.stringify(
              orders
            )
          );


          localStorage.setItem(
            "fidelis_last_order",
            JSON.stringify(
              order
            )
          );


          /* lanjut ke order */

          window.location.href =
            `order.html?id=${encodeURIComponent(
              order.orderId
            )}`;

        },
        1500
      );

    }
  );

});


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
