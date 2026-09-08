/* =========================================
   LEO STORE
   ORDER TRACKING
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const container =
    document.getElementById("orderContainer");

  if (!container) return;

  const params =
    new URLSearchParams(
      window.location.search
    );

  const requestedId =
    params.get("id");

  const orders =
    getOrders();

  const lastOrder =
    getLastOrder();

  let order = null;

  if (requestedId) {

    order =
      orders.find(
        item =>
          item.orderId === requestedId
      );

    if (
      !order &&
      lastOrder &&
      lastOrder.orderId === requestedId
    ) {
      order = lastOrder;
    }

  } else {

    order = lastOrder;

  }

  if (!order) {

    container.innerHTML = `

      <div class="order-empty">

        <h3>
          Belum Ada Pesanan
        </h3>

        <p>
          Belum ada pesanan yang tersimpan.
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

  renderOrder(
    container,
    order
  );


  /*
   * ================================
   * STATUS MACHINE
   * ================================
   */

  if (
    order.status ===
    "Pembayaran Berhasil"
  ) {

    startProcessing(
      order.orderId
    );

  }

  else if (
    order.status ===
    "Pesanan Diproses"
  ) {

    continueProcessing(
      order.orderId,
      order.processingAt
    );

  }

});


/*
 * ================================
 * MULAI PROSES TOP UP
 * ================================
 */

function startProcessing(orderId) {

  const orders =
    getOrders();

  const index =
    orders.findIndex(
      item =>
        item.orderId === orderId
    );

  if (index === -1) {
    return;
  }

  const order =
    orders[index];

  if (
    order.status !==
    "Pembayaran Berhasil"
  ) {
    return;
  }

  order.status =
    "Pesanan Diproses";

  order.processingAt =
    new Date().toISOString();

  orders[index] =
    order;

  saveOrders(
    orders
  );

  saveLastOrder(
    order
  );

  renderOrder(
    document.getElementById(
      "orderContainer"
    ),
    order
  );

  continueProcessing(
    order.orderId,
    order.processingAt
  );

}


/*
 * ================================
 * LANJUTKAN PROSES
 * ================================
 */

function continueProcessing(
  orderId,
  processingAt
) {

  if (!processingAt) {

    processingAt =
      new Date().toISOString();

  }

  const started =
    new Date(
      processingAt
    ).getTime();

  const now =
    Date.now();

  const processingDuration =
    4000;

  const elapsed =
    now - started;

  const remaining =
    processingDuration - elapsed;


  if (remaining <= 0) {

    completeTransaction(
      orderId
    );

    return;

  }


  setTimeout(
    () => {

      completeTransaction(
        orderId
      );

    },
    remaining
  );

}


/*
 * ================================
 * SELESAIKAN TRANSAKSI
 * ================================
 */

function completeTransaction(orderId) {

  const orders =
    getOrders();

  const index =
    orders.findIndex(
      item =>
        item.orderId === orderId
    );

  if (index === -1) {
    return;
  }

  const order =
    orders[index];

  if (
    order.status !==
    "Pesanan Diproses"
  ) {
    return;
  }

  order.status =
    "Top Up Berhasil";

  order.completedAt =
    new Date().toISOString();

  orders[index] =
    order;

  saveOrders(
    orders
  );

  saveLastOrder(
    order
  );

  renderOrder(
    document.getElementById(
      "orderContainer"
    ),
    order
  );

}


/*
 * ================================
 * RENDER ORDER
 * ================================
 */

function renderOrder(
  container,
  order
) {

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

  const status =
    order.status ||
    "Menunggu Pembayaran";

  const paymentDone =
    status === "Pembayaran Berhasil" ||
    status === "Pesanan Diproses" ||
    status === "Top Up Berhasil";

  const processing =
    status === "Pesanan Diproses" ||
    status === "Top Up Berhasil";

  const success =
    status === "Top Up Berhasil";

  let paymentButton = "";

  if (
    status ===
    "Menunggu Pembayaran"
  ) {

    paymentButton = `

      <br>

      <a
        href="payment.html?id=${encodeURIComponent(
          order.orderId
        )}"
      >

        <button>
          Lanjut Pembayaran
        </button>

      </a>

    `;

  }


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

        <li class="active">
          Pesanan dibuat
        </li>

        <li class="${
          paymentDone
            ? "active"
            : ""
        }">
          Pembayaran
        </li>

        <li class="${
          processing
            ? "active"
            : ""
        }">
          Pesanan diproses
        </li>

        <li class="${
          success
            ? "active"
            : ""
        }">
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

}


/*
 * ================================
 * STORAGE
 * ================================
 */

function getOrders() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "fidelis_orders"
      )
    ) || [];

  } catch (error) {

    return [];

  }

}


function getLastOrder() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "fidelis_last_order"
      )
    );

  } catch (error) {

    return null;

  }

}


function saveOrders(orders) {

  localStorage.setItem(
    "fidelis_orders",
    JSON.stringify(orders)
  );

}


function saveLastOrder(order) {

  localStorage.setItem(
    "fidelis_last_order",
    JSON.stringify(order)
  );

}


/*
 * ================================
 * FORMAT PRICE
 * ================================
 */

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


/*
 * ================================
 * SECURITY
 * ================================
 */

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}
