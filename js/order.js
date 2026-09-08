/* =========================================
   LEO STORE
   ORDER TRACKING
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const container =
    document.getElementById(
      "orderContainer"
    );

  if (!container) return;


  /* =========================================
     URL
     ========================================= */

  const params =
    new URLSearchParams(
      window.location.search
    );


  const requestedId =
    params.get("id");


  /* =========================================
     LOAD ORDERS
     ========================================= */

  const orders =
    JSON.parse(
      localStorage.getItem(
        "fidelis_orders"
      )
    ) || [];


  const lastOrder =
    JSON.parse(
      localStorage.getItem(
        "fidelis_last_order"
      )
    );


  /* =========================================
     FIND ORDER
     ========================================= */

  let order = null;


  if (requestedId) {

    order =
      orders.find(
        item =>
          item.orderId ===
          requestedId
      );


    if (
      !order &&
      lastOrder &&
      lastOrder.orderId === requestedId
    ) {

      order =
        lastOrder;

    }

  } else {

    order =
      lastOrder;

  }


  /* =========================================
     ORDER NOT FOUND
     ========================================= */

  if (!order) {

    container.innerHTML = `

      <div class="order-empty">

        <h3>
          Belum Ada Pesanan
        </h3>

        <p>
          Kamu belum memiliki pesanan
          yang tersimpan di perangkat ini.
        </p>

        <br>

        <a href="shop.html">

          <button>
            Mulai Top Up
          </button>

        </a>

      </div>

    `;

    return;

  }


  /* =========================================
     DATE
     ========================================= */

  let dateText =
    "-";


  if (order.createdAt) {

    dateText =
      new Date(
        order.createdAt
      ).toLocaleString(
        "id-ID",
        {
          dateStyle: "medium",
          timeStyle: "short"
        }
      );

  }


  /* =========================================
     STATUS
     ========================================= */

  const status =
    order.status ||
    "Menunggu Pembayaran";


  let paymentDone =
    false;


  let processing =
    false;


  let success =
    false;


  if (
    status ===
    "Pembayaran Berhasil"
  ) {

    paymentDone =
      true;

  }


  if (
    status ===
    "Pesanan Diproses"
  ) {

    paymentDone =
      true;

    processing =
      true;

  }


  if (
    status ===
    "Top Up Berhasil"
  ) {

    paymentDone =
      true;

    processing =
      true;

    success =
      true;

  }


  /* =========================================
     PAYMENT BUTTON
     ========================================= */

  let paymentButton = "";


  if (
    status ===
    "Menunggu Pembayaran"
  ) {

    paymentButton = `

      <br>

      <a href="payment.html?id=${encodeURIComponent(order.orderId)}">

        <button>
          Lanjut Pembayaran
        </button>

      </a>

    `;

  }


  /* =========================================
     PROGRESS CLASS
     ========================================= */

  const step1 =
    "active";


  const step2 =
    paymentDone
      ? "active"
      : "";


  const step3 =
    processing
      ? "active"
      : "";


  const step4 =
    success
      ? "active"
      : "";


  /* =========================================
     RENDER
     ========================================= */

  container.innerHTML = `

    <div class="order-header">

      <p>
        Order ID
      </p>

      <h3>
        ${escapeHTML(
          order.orderId
        )}
      </h3>

      <p>
        ${escapeHTML(
          dateText
        )}
      </p>

    </div>


    <hr>


    <div class="order-info">

      <p>

        <strong>
          Game:
        </strong>

        ${escapeHTML(
          order.gameName ||
          order.game
        )}

      </p>


      <p>

        <strong>
          Player:
        </strong>

        ${escapeHTML(
          order.playerId
        )}

      </p>


      ${
        order.server
          ? `

            <p>

              <strong>
                Server:
              </strong>

              ${escapeHTML(
                order.server
              )}

            </p>

          `
          : ""
      }


      <p>

        <strong>
          Produk:
        </strong>

        ${escapeHTML(
          order.amount
        )}

      </p>


      <p>

        <strong>
          Total:
        </strong>

        ${formatPrice(
          Number(order.price)
        )}

      </p>


      <p>

        <strong>
          Pembayaran:
        </strong>

        ${escapeHTML(
          order.payment
        )}

      </p>

    </div>


    <hr>


    <div class="order-status">

      <h3>
        Status Pesanan
      </h3>


      <p>
        ${escapeHTML(
          status
        )}
      </p>

    </div>


    <div class="order-progress">

      <ol>

        <li class="${step1}">
          Pesanan dibuat
        </li>


        <li class="${step2}">
          Pembayaran
        </li>


        <li class="${step3}">
          Pesanan diproses
        </li>


        <li class="${step4}">
          Top Up berhasil
        </li>

      </ol>

    </div>


    ${paymentButton}


    <br>


    <a href="shop.html">

      <button>
        Top Up Lagi
      </button>

    </a>

  `;

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
