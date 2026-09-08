/* =========================================
   LEO STORE
   ORDER TRACKING + HISTORY + SEARCH
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


  /*
   * ========================================
   * SINGLE ORDER DETAIL
   * ========================================
   */

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


  /*
   * ========================================
   * HISTORY MODE
   * ========================================
   */

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


  /*
   * Check transaksi berjalan.
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


  const processingDuration =
    4000;


  const remaining =
    processingDuration -
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
        ← Riwayat Pesanan
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
   HISTORY PAGE
   ========================================= */

function renderHistoryPage(
  container,
  orders
) {

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


  container.innerHTML = `

    <div class="history-page">

      <div
        class="history-section-header"
      >

        <div>

          <h3>
            Riwayat Pesanan
          </h3>

          <p
            style="
              margin: 4px 0 0;
              opacity: .5;
              font-size: 12px;
            "
          >
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


      <div
        class="history-tools"
      >

        <div
          class="history-search"
        >

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


      <div
        id="historyList"
      ></div>

    </div>

    <br>

    <a href="shop.html">

      <button>
        + Top Up Lagi
      </button>

    </a>

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


          const gameName =
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
            gameName.includes(
              keyword
            );


          const matchesStatus =
            selectedStatus ===
              "all" ||
            (
              order.status ||
              "Menunggu Pembayaran"
            ) ===
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


  searchInput.addEventListener(
    "input",
    updateHistory
  );


  statusFilter.addEventListener(
    "change",
    updateHistory
  );


  updateHistory();

}


/* =========================================
   HISTORY LIST
   ========================================= */

function renderHistoryList(
  orders
) {

  const list =
    document.getElementById(
      "historyList"
    );


  if (!list) {
    return;
  }


  if (!orders.length) {

    list.innerHTML = `

      <div
        class="history-no-result"
      >

        <div>
          🔎
        </div>

        <h3>
          Pesanan Tidak Ditemukan
        </h3>

        <p>
          Coba gunakan Order ID,
          Player ID, atau filter lain.
        </p>

      </div>

    `;

    return;

  }


  let html = "";


  orders.forEach(
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


      const gameIcon =
        getGameIcon(
          order.game
        );


      html += `

        <article
          class="order-history-card"
        >

          <div
            class="history-top"
          >

            <div
              class="history-game"
            >

              <div
                class="history-game-icon"
              >
                ${gameIcon}
              </div>

              <div>

                <h4
                  class="history-game-name"
                >
                  ${escapeHTML(
                    order.gameName ||
                    order.game
                  )}
                </h4>

                <p
                  class="history-game-type"
                >
                  ${escapeHTML(
                    order.amount
                  )}
                </p>

              </div>

            </div>


            <span
              class="
                history-status
                ${statusClass}
              "
            >
              ${escapeHTML(
                status
              )}
            </span>

          </div>


          <div
            class="history-body"
          >

            <div
              class="history-info"
            >

              <span
                class="history-label"
              >
                Player
              </span>

              <span
                class="history-value"
              >
                ${escapeHTML(
                  order.playerId
                )}
              </span>

            </div>


            <div
              class="history-info"
            >

              <span
                class="history-label"
              >
                Total
              </span>

              <span
                class="history-value"
              >
                ${formatPrice(
                  Number(order.price)
                )}
              </span>

            </div>


            <div
              class="history-info"
            >

              <span
                class="history-label"
              >
                Pembayaran
              </span>

              <span
                class="history-value"
              >
                ${escapeHTML(
                  getPaymentName(
                    order.payment
                  )
                )}
              </span>

            </div>


            <div
              class="history-info"
            >

              <span
                class="history-label"
              >
                Tanggal
              </span>

              <span
                class="history-value"
              >
                ${escapeHTML(
                  formatDate(
                    order.createdAt
                  )
                )}
              </span>

            </div>

          </div>


          <div
            class="history-bottom"
          >

            <span
              class="history-order-id"
            >

              ID:
              ${escapeHTML(
                order.orderId
              )}

            </span>


            <a
              class="history-detail-btn"
              href="order.html?id=${encodeURIComponent(
                order.orderId
              )}"
            >

              Lihat Detail →

            </a>

          </div>

        </article>

      `;

    }
  );


  list.innerHTML =
    html;

}


/* =========================================
   GAME ICON
   ========================================= */

function getGameIcon(game) {

  const icons = {

    "mobile-legends":
      "⚔️",

    "free-fire":
      "🔥",

    "roblox":
      "🧱",

    "pubg-mobile":
      "🎯"

  };


  return (
    icons[game] ||
    "🎮"
  );

}


/* =========================================
   EMPTY STATE
   ========================================= */

function renderEmpty(
  container,
  message
) {

  container.innerHTML = `

    <div
      class="order-empty"
    >

      <div
        style="
          font-size: 42px;
          margin-bottom: 12px;
        "
      >
        📦
      </div>

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

function getPaymentName(payment) {

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

function formatDate(date) {

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


function saveOrders(orders) {

  localStorage.setItem(
    "fidelis_orders",
    JSON.stringify(
      orders
    )
  );

}


function saveLastOrder(order) {

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
