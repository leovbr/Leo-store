/* =========================================
   FIDELIS TOPUP
   ORDER TRACKING
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const container =
    document.getElementById(
      "orderContainer"
    );

  if (!container) return;


  /* =======================================
     GET ORDER
     ======================================= */

  const params =
    new URLSearchParams(
      window.location.search
    );

  const requestedId =
    params.get("id");


  const lastOrder =
    JSON.parse(
      localStorage.getItem(
        "fidelis_last_order"
      )
    );


  let order = null;


  /* =======================================
     FIND ORDER
     ======================================= */

  if (
    requestedId &&
    lastOrder &&
    lastOrder.orderId === requestedId
  ) {

    order = lastOrder;

  } else if (!requestedId) {

    order = lastOrder;

  }


  /* =======================================
     NO ORDER
     ======================================= */

  if (!order) {

    container.innerHTML = `

      <div class="order-empty">

        <h3>Belum Ada Pesanan</h3>

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


  /* =======================================
     FORMAT DATE
     ======================================= */

  let dateText = "-";

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


  /* =======================================
     STATUS
     ======================================= */

  const status =
    order.status ||
    "Menunggu Pembayaran";


  /* =======================================
     RENDER
     ======================================= */

  container.innerHTML = `

    <div class="order-header">

      <p>Order ID</p>

      <h3>
        ${escapeHTML(order.orderId)}
      </h3>

      <p>
        ${escapeHTML(dateText)}
      </p>

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
        <strong>Player:</strong>
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
        <strong>Total:</strong>
        ${formatPrice(
          Number(order.price)
        )}
      </p>

      <p>
        <strong>Pembayaran:</strong>
        ${escapeHTML(
          order.payment
        )}
      </p>

    </div>


    <hr>


    <div class="order-status">

      <h3>Status Pesanan</h3>

      <p>
        ${escapeHTML(status)}
      </p>

    </div>


    <div class="order-progress">

      <ol>

        <li class="active">
          Pesanan dibuat
        </li>

        <li>
          Menunggu pembayaran
        </li>

        <li>
          Pesanan diproses
        </li>

        <li>
          Top Up berhasil
        </li>

      </ol>

    </div>


    <br>


    <a href="shop.html">
      <button>
        Top Up Lagi
      </button>
    </a>

  `;

});


/* =========================================
   SECURITY HELPER
   ========================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}
