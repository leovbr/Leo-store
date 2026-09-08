/* =========================================
   LEO STORE
   ORDER TRACKING + ORDER HISTORY
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


  let orders =
    getOrders();

  const lastOrder =
    getLastOrder();


  /* =========================================
     SINGLE ORDER MODE
     ========================================= */

  if (requestedId) {

    let order =
      orders.find(
        item =>
          item.orderId === requestedId
      );


    if (
      !order &&
      lastOrder &&
      lastOrder.orderId === requestedId
    ) {

      order =
        lastOrder;

    }


    if (!order) {

      renderEmpty(
        container,
        "Pesanan tidak ditemukan."
      );

      return;

    }


    renderOrder(
      container,
      order
    );


    handleProcessing(
      order
    );


    return;

  }


  /* =========================================
     HISTORY MODE
     ========================================= */

  if (
    !orders.length &&
    lastOrder
  ) {

    orders = [
      lastOrder
    ];

  }


  if (!orders.length) {

    renderEmpty(
      container,
      "Belum ada pesanan yang tersimpan."
    );

    return;

  }


  renderHistory(
    container,
    orders
  );


  /*
   * Tetap cek order yang sedang diproses.
   */

  orders.forEach(
    order => {

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

    }
  );

});


/* =========================================
   PROCESSING HANDLER
   ========================================= */

function handleProcessing(order) {

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

}


/* =========================================
   START PROCESSING
   ========================================= */

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


  renderCurrentPage(
    order
  );


  continueProcessing(
    order.orderId,
    order.processingAt
  );

}


/* =========================================
   CONTINUE PROCESSING
   ========================================= */

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


  const elapsed =
    Date.now() -
    started;


  const duration =
    4000;


  const remaining =
    duration -
    elapsed;


  if (
    remaining <= 0
  ) {

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


/* =========================================
   COMPLETE TRANSACTION
   ========================================= */

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


  renderCurrentPage(
    order
  );

}


/* =========================================
   RENDER CURRENT ORDER
   ========================================= */

function renderCurrentPage(order) {

  const container =
    document.getElementById(
      "orderContainer"
    );


  if (!container) {
    return;
  }


  renderOrder(
    container,
    order
  );

}


/* =========================================
   ORDER DETAIL
   ========================================= */

function renderOrder(
  container,
  order
) {

  const dateText =
    formatDate(
      order.createdAt
    );


  const status =
    order.status ||
    "Menunggu Pembayaran";


  const paymentDone =
    status ===
      "Pembayaran Berhasil" ||
    status ===
      "Pesanan Diproses" ||
    status ===
      "Top Up Berhasil";


  const processing =
    status ===
      "Pesanan Diproses" ||
    status ===
      "Top Up Berhasil";


  const success =
    status ===
    "Top Up Berhasil";


  let paymentButton =
    "";


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
          getPaymentName(
            order.payment
          )
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

    <a href="order.html">

      <button>
        Riwayat Pesanan
      </button>

    </a>

    <br><br>

    <a href="shop.html">

      <button>
        Top Up Lagi
      </button>

    </a>

  `;

}


/* =========================================
   ORDER HISTORY
   ========================================= */

function renderHistory(
  container,
  orders
) {

  /*
   * Pesanan terbaru berada di atas.
   */

  const sortedOrders =
    [...orders].sort(
      (a, b) => {

        return (
          new Date(
            b.createdAt || 0
          ) -
          new Date(
            a.createdAt || 0
          )
        );

      }
    );


  let html = `

    <section>

      <h3>
        Riwayat Pesanan
      </h3>

  `;


  sortedOrders.forEach(
    order => {

      const status =
        order.status ||
        "Menunggu Pembayaran";


      html += `

        <article class="order-history-card">

          <p>
            <strong>
              ${escapeHTML(
                order.orderId
              )}
            </strong>
          </p>

          <p>
            ${escapeHTML(
              order.gameName ||
              order.game
            )}
          </p>

          <p>
            ${escapeHTML(
              order.amount
            )}
          </p>

          <p>
            ${formatPrice(
              Number(order.price)
            )}
          </p>

          <p>
            Status:
            <strong>
              ${escapeHTML(
                status
              )}
            </strong>
          </p>

          <a
            href="order.html?id=${encodeURIComponent(
              order.orderId
            )}"
          >

            <button>
              Lihat Detail
            </button>

          </a>

        </article>

        <br>

      `;

    }
  );


  html += `

    </section>

    <br>

    <a href="shop.html">

      <button>
        Top Up Lagi
      </button>

    </a>

  `;


  container.innerHTML =
    html;

}


/* =========================================
   EMPTY STATE
   ========================================= */

function renderEmpty(
  container,
  message
) {

  container.innerHTML = `

    <div class="order-empty">

      <h3>
        Belum Ada Pesanan
      </h3>

      <p>
        ${escapeHTML(
          message
        )}
      </p>

      <br>

      <a href="shop.html">

        <button>
          Mulai Top Up
        </button>

      </a>

    </div>

  `;

}


/* =========================================
   PAYMENT NAME
   ========================================= */

function getPaymentName(
  payment
) {

  if (
    payment === "qris"
  ) {
    return "QRIS";
  }

  if (
    payment === "ewallet"
  ) {
    return "E-Wallet";
  }

  if (
    payment === "bank"
  ) {
    return "Virtual Account";
  }

  return payment || "-";

}


/* =========================================
   FORMAT DATE
   ========================================= */

function formatDate(
  date
) {

  if (!date) {
    return "-";
  }


  try {

    return new Date(
      date
    ).toLocaleString(
      "id-ID",
      {
        dateStyle: "medium",
        timeStyle: "short"
      }
    );

  } catch (error) {

    return "-";

  }

}


/* =========================================
   STORAGE
   ========================================= */

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


function saveOrders(
  orders
) {

  localStorage.setItem(
    "fidelis_orders",
    JSON.stringify(
      orders
    )
  );

}


function saveLastOrder(
  order
) {

  localStorage.setItem(
    "fidelis_last_order",
    JSON.stringify(
      order
    )
  );

}


/* =========================================
   FORMAT PRICE
   ========================================= */

function formatPrice(
  price
) {

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

function escapeHTML(
  value
) {

  return String(
    value ?? ""
  )
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}
