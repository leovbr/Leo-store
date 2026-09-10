/* =========================================================
   LEOOSTORE — ORDER TRACKING
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const container =
      document.getElementById(
        "orderContainer"
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


    const requestedId =
      params.get("id");


    let orders =
      getOrders();


    const lastOrder =
      getLastOrder();


    /* =====================================================
       DETAIL MODE
    ===================================================== */

    if (requestedId) {

      let order =
        orders.find(
          item =>
            String(item.orderId) ===
            String(requestedId)
        );


      if (
        !order &&
        lastOrder &&
        String(lastOrder.orderId) ===
        String(requestedId)
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


    /* =====================================================
       HISTORY MODE
    ===================================================== */

    if (
      !orders.length &&
      lastOrder
    ) {

      orders = [
        lastOrder
      ];

    }


    renderHistoryPage(
      container,
      orders
    );


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

  }
);


/* =========================================================
   STORAGE
========================================================= */

function getOrders() {

  try {

    const orders =
      JSON.parse(
        localStorage.getItem(
          "fidelis_orders"
        )
      ) || [];


    return Array.isArray(
      orders
    )
      ? orders
      : [];

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


/* =========================================================
   PROCESSING
========================================================= */

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


function startProcessing(orderId) {

  const orders =
    getOrders();


  const index =
    orders.findIndex(
      item =>
        item.orderId ===
        orderId
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


function completeTransaction(
  orderId
) {

  const orders =
    getOrders();


  const index =
    orders.findIndex(
      item =>
        item.orderId ===
        orderId
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


/* =========================================================
   CURRENT PAGE
========================================================= */

function renderCurrentPage(order) {

  const container =
    document.getElementById(
      "orderContainer"
    );


  if (!container) return;


  renderOrder(
    container,
    order
  );

}


/* =========================================================
   ORDER DETAIL
========================================================= */

function renderOrder(
  container,
  order
) {

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

      <a
        href="payment.html?id=${encodeURIComponent(
          order.orderId
        )}"
      >

        <button type="button">
          Lanjut Pembayaran
        </button>

      </a>

    `;

  }


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
            formatDate(
              order.createdAt
            )
          )}
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
            order.paymentName ||
            getPaymentName(
              order.payment
            )
          )}
        </p>

        <p>
          <strong>Total:</strong>
          ${formatPrice(
            order.price
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


      <a href="order.html">

        <button
          type="button"
          class="secondary-button"
        >
          ← Riwayat Pesanan
        </button>

      </a>


      <a href="shop.html">

        <button type="button">
          Top Up Lagi
        </button>

      </a>

    </div>

  `;

}


/* =========================================================
   HISTORY
========================================================= */

function renderHistoryPage(
  container,
  orders
) {

  const sortedOrders =
    [...orders].sort(
      (a, b) =>
        new Date(
          b.createdAt || 0
        ) -
        new Date(
          a.createdAt || 0
        )
    );


  container.innerHTML = `

    <div class="history-page">

      <div class="history-section-header">

        <div>

          <h2>
            Riwayat Pesanan
          </h2>

          <p>
            Kelola dan cari transaksi kamu
          </p>

        </div>


        <span
          class="history-count"
          id="historyCount"
        >
          ${sortedOrders.length} Pesanan
        </span>

      </div>


      <div class="history-tools">

        <div class="history-search">

          <span>
            🔎
          </span>

          <input
            type="text"
            id="orderSearch"
            placeholder="Cari Order ID atau Player ID..."
            autocomplete="off"
          >

        </div>


        <select
          id="statusFilter"
          class="history-filter"
        >

          <option value="all">
            Semua Status
          </option>

          <option value="Top Up Berhasil">
            Berhasil
          </option>

          <option value="Pesanan Diproses">
            Diproses
          </option>

          <option value="Pembayaran Berhasil">
            Pembayaran Berhasil
          </option>

          <option value="Menunggu Pembayaran">
            Menunggu Pembayaran
          </option>

        </select>

      </div>


      <div id="historyList"></div>

    </div>


    <div class="history-actions">

      <a href="shop.html">

        <button type="button">
          + Top Up Lagi
        </button>

      </a>

    </div>

  `;


  const searchInput =
    document.getElementById(
      "orderSearch"
    );


  const statusFilter =
    document.getElementById(
      "statusFilter"
    );


  function updateHistory() {

    const keyword =
      searchInput.value
        .trim()
        .toLowerCase();


    const selectedStatus =
      statusFilter.value;


    const filtered =
      sortedOrders.filter(
        order => {

          const orderId =
            String(
              order.orderId || ""
            ).toLowerCase();


          const playerId =
            String(
              order.playerId || ""
            ).toLowerCase();


          const game =
            String(
              order.gameName ||
              order.game ||
              ""
            ).toLowerCase();


          const matchesSearch =
            !keyword ||
            orderId.includes(
              keyword
            ) ||
            playerId.includes(
              keyword
            ) ||
            game.includes(
              keyword
            );


          const status =
            order.status ||
            "Menunggu Pembayaran";


          const matchesStatus =
            selectedStatus ===
              "all" ||
            status ===
              selectedStatus;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );


    renderHistoryList(
      filtered
    );


    const count =
      document.getElementById(
        "historyCount"
      );


    if (count) {

      count.textContent =
        `${filtered.length} Pesanan`;

    }

  }


  searchInput?.addEventListener(
    "input",
    updateHistory
  );


  statusFilter?.addEventListener(
    "change",
    updateHistory
  );


  updateHistory();

}


/* =========================================================
   HISTORY LIST
========================================================= */

function renderHistoryList(
  orders
) {

  const list =
    document.getElementById(
      "historyList"
    );


  if (!list) return;


  if (!orders.length) {

    list.innerHTML = `

      <div class="history-no-result">

        <div>
          🔎
        </div>

        <h3>
          Pesanan Tidak Ditemukan
        </h3>

        <p>
          Belum ada transaksi yang sesuai.
        </p>

      </div>

    `;

    return;

  }


  list.innerHTML =
    orders.map(
      order => {

        const status =
          order.status ||
          "Menunggu Pembayaran";


        let statusClass =
          "waiting";


        if (
          status ===
          "Pesanan Diproses"
        ) {

          statusClass =
            "processing";

        }


        if (
          status ===
          "Top Up Berhasil"
        ) {

          statusClass =
            "success";

        }


        if (
          status ===
          "Pembayaran Berhasil"
        ) {

          statusClass =
            "paid";

        }


        return `

          <article
            class="order-history-card"
          >

            <div class="history-top">

              <div class="history-game">

                <div
                  class="history-game-icon"
                >
                  ${getGameIcon(
                    order.game
                  )}
                </div>


                <div>

                  <h3
                    class="history-game-name"
                  >
                    ${escapeHTML(
                      order.gameName ||
                      order.game
                    )}
                  </h3>

                  <p>
                    ${escapeHTML(
                      order.amount
                    )}
                  </p>

                </div>

              </div>


              <span
                class="order-status-badge ${statusClass}"
              >
                ${escapeHTML(
                  status
                )}
              </span>

            </div>


            <div class="history-details">

              <div>

                <span>
                  Order ID
                </span>

                <strong>
                  ${escapeHTML(
                    order.orderId
                  )}
                </strong>

              </div>


              <div>

                <span>
                  Player ID
                </span>

                <strong>
                  ${escapeHTML(
                    order.playerId
                  )}
                </strong>

              </div>


              <div>

                <span>
                  Total
                </span>

                <strong>
                  ${formatPrice(
                    order.price
                  )}
                </strong>

              </div>

            </div>


            <div class="history-actions">

              <a
                href="order.html?id=${encodeURIComponent(
                  order.orderId
                )}"
              >

                <button type="button">
                  Lihat Detail
                </button>

              </a>

            </div>

          </article>

        `;

      }
    ).join("");

}


/* =========================================================
   EMPTY
========================================================= */

function renderEmpty(
  container,
  message
) {

  container.innerHTML = `

    <div class="order-empty">

      <div>
        📦
      </div>

      <h3>
        ${escapeHTML(
          message
        )}
      </h3>

      <p>
        Periksa kembali Order ID kamu.
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
   GAME ICON
========================================================= */

function getGameIcon(game) {

  const icons = {

    "mobile-legends":
      "⚔️",

    "free-fire":
      "🔥",

    "roblox":
      "🧱",

    "pubg-mobile":
      "🔫"

  };


  return (
    icons[game] ||
    "🎮"
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


function formatDate(date) {

  if (!date) {
    return "Tanggal tidak tersedia";
  }


  const parsed =
    new Date(date);


  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {

    return "Tanggal tidak tersedia";

  }


  return new Intl.DateTimeFormat(
    "id-ID",
    {
      dateStyle: "medium",
      timeStyle: "short"
    }
  ).format(parsed);

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
