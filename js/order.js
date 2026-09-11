/* =========================================================
   LEOOSTORE — ORDER TRACKING
   FINAL VERSION
   ========================================================= */

const ORDERS_KEY = "LEOOSTORE_orders";
const LAST_ORDER_KEY = "LEOOSTORE_last_orders";


document.addEventListener("DOMContentLoaded", () => {

  const container =
    document.getElementById("orderContainer");

  if (!container) return;

  const params =
    new URLSearchParams(window.location.search);

  const requestedId =
    params.get("id");

  let orders =
    getOrders();

  const lastOrder =
    getLastOrder();


  /* =======================================================
     DETAIL MODE
  ======================================================= */

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


  /* =======================================================
     HISTORY MODE
  ======================================================= */

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

});


/* =========================================================
   STORAGE
   ========================================================= */

function getOrders() {

  try {

    const orders =
      JSON.parse(
        localStorage.getItem(
          ORDERS_KEY
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
        LAST_ORDER_KEY
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
    ORDERS_KEY,
    JSON.stringify(orders)
  );

}


function saveLastOrder(
  order
) {

  localStorage.setItem(
    LAST_ORDER_KEY,
    JSON.stringify(order)
  );

}


/* =========================================================
   PROCESSING
   ========================================================= */

function handleProcessing(
  order
) {

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


function startProcessing(
  orderId
) {

  const orders =
    getOrders();


  const index =
    orders.findIndex(
      item =>
        String(item.orderId) ===
        String(orderId)
    );


  if (
    index === -1
  ) {

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

  if (
    !processingAt
  ) {

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
        String(item.orderId) ===
        String(orderId)
    );


  if (
    index === -1
  ) {

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

function renderCurrentPage(
  order
) {

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
        class="order-detail-button order-primary-button"
      >
        Lanjut Pembayaran
      </a>

    `;

  }


  const gameName =
    order.gameName ||
    order.game ||
    "Game";


  const gameImage =
    getGameImage(
      order
    );


  const gameVisual =
    gameImage
      ? `

        <img
          src="${escapeHTML(gameImage)}"
          alt="${escapeHTML(gameName)}"
          class="order-detail-game-image"
          onerror="this.style.display='none'"
        >

      `
      : "";


  container.innerHTML = `

    <div class="order-detail-page">

      <div class="order-detail-card">


        <div class="order-detail-header">

          <span class="order-detail-label">
            Order ID
          </span>

          <h1>
            ${escapeHTML(
              order.orderId
            )}
          </h1>

          <span class="order-detail-date">
            ${escapeHTML(
              formatDate(
                order.createdAt
              )
            )}
          </span>

        </div>


        <div class="order-detail-divider"></div>


        <div class="order-detail-game">

          ${gameVisual}

          <div>

            <span>
              Game
            </span>

            <strong>
              ${escapeHTML(
                gameName
              )}
            </strong>

          </div>

        </div>


        <div class="order-detail-info">


          <div class="order-detail-info-item">

            <span>
              Player ID
            </span>

            <strong>
              ${escapeHTML(
                order.playerId || "-"
              )}
            </strong>

          </div>


          ${
            order.server
              ? `

                <div class="order-detail-info-item">

                  <span>
                    Server
                  </span>

                  <strong>
                    ${escapeHTML(
                      order.server
                    )}
                  </strong>

                </div>

              `
              : ""
          }


          <div class="order-detail-info-item">

            <span>
              Produk
            </span>

            <strong>
              ${escapeHTML(
                order.amount || "-"
              )}
            </strong>

          </div>


          <div class="order-detail-info-item">

            <span>
              Jumlah
            </span>

            <strong>
              ${Number(
                order.quantity || 1
              )}
            </strong>

          </div>


          <div class="order-detail-info-item">

            <span>
              Pembayaran
            </span>

            <strong>
              ${escapeHTML(
                order.paymentName ||
                getPaymentName(
                  order.payment
                )
              )}
            </strong>

          </div>


          <div class="order-detail-info-item total">

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


        <div class="order-detail-divider"></div>


        <div class="order-detail-status">

          <span>
            Status Pesanan
          </span>

          <strong
            class="${getStatusClass(status)}"
          >
            ${escapeHTML(
              status
            )}
          </strong>

        </div>


        <div class="order-detail-actions">

          ${paymentButton}


          <a
            href="order.html"
            class="order-detail-button order-secondary-button"
          >
            ← Riwayat Pesanan
          </a>


          <a
            href="shop.html"
            class="order-detail-button order-secondary-button"
          >
            Top Up Lagi
          </a>

        </div>


      </div>

    </div>

  `;

}


/* =========================================================
   HISTORY PAGE
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

    <div class="order-history-page">


      <section class="order-lookup-section">


        <div class="order-lookup-heading">

          <h1>
            Cek / Lihat Riwayat Pesanan
          </h1>

          <p>
            Lihat detail pembelian kamu menggunakan nomor order.
          </p>

        </div>


        <div class="order-lookup-card">

          <h2>
            Cari detail pesanan kamu disini
          </h2>


          <div class="order-search-box">

            <input
              type="text"
              id="orderSearch"
              placeholder="Masukkan Nomor Order Kamu (Contoh: LSXXXXX)"
              autocomplete="off"
              spellcheck="false"
            >


            <button
              type="button"
              id="orderPasteButton"
              class="order-paste-button"
              aria-label="Tempel nomor order"
              title="Tempel"
            >
              📋
            </button>

          </div>


          <button
            type="button"
            id="orderSearchButton"
            class="order-search-button"
          >
            🔍 Cari Order
          </button>

        </div>

      </section>


      <section class="order-transactions-section">


        <div class="order-transactions-heading">

          <h2>
            Transaksi Terakhir
          </h2>

          <p>
            Berikut ini adalah data pesanan masuk terbaru LEOOSTORE.
          </p>

        </div>


        <div class="order-transactions-divider"></div>


        <div class="order-table-wrap">

          <div class="order-table">


            <div class="order-table-head">

              <div>
                Tanggal
              </div>

              <div>
                Nomor Order
              </div>

              <div>
                No. Handphone
              </div>

              <div>
                Harga
              </div>

              <div>
                Status
              </div>

            </div>


            <div id="historyList"></div>


          </div>

        </div>


        <div class="order-transactions-divider bottom"></div>


        <div class="order-history-bottom-action">

          <a
            href="shop.html"
            class="order-topup-button"
          >
            + Top Up Lagi
          </a>

        </div>


      </section>

    </div>

  `;


  const searchInput =
    document.getElementById(
      "orderSearch"
    );


  const searchButton =
    document.getElementById(
      "orderSearchButton"
    );


  const pasteButton =
    document.getElementById(
      "orderPasteButton"
    );


  /* =======================================================
     PASTE
  ======================================================= */

  pasteButton?.addEventListener(
    "click",
    async () => {

      try {

        const text =
          await navigator.clipboard.readText();


        if (!text) {

          return;

        }


        searchInput.value =
          text.trim();


        searchInput.focus();

      }

      catch (error) {

        searchInput.focus();

      }

    }
  );


  /* =======================================================
     SEARCH
  ======================================================= */

  function performSearch() {

    const keyword =
      searchInput.value
        .trim()
        .toLowerCase();


    if (!keyword) {

      renderHistoryList(
        sortedOrders
      );

      return;

    }


    const exactOrder =
      sortedOrders.find(
        order =>
          String(
            order.orderId || ""
          ).toLowerCase() ===
          keyword
      );


    if (exactOrder) {

      window.location.href =
        `order.html?id=${encodeURIComponent(
          exactOrder.orderId
        )}`;

      return;

    }


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


          const phone =
            String(
              order.phone ||
              order.phoneNumber ||
              order.whatsapp ||
              order.customerPhone ||
              ""
            ).toLowerCase();


          const game =
            String(
              order.gameName ||
              order.game ||
              ""
            ).toLowerCase();


          return (
            orderId.includes(
              keyword
            ) ||
            playerId.includes(
              keyword
            ) ||
            phone.includes(
              keyword
            ) ||
            game.includes(
              keyword
            )
          );

        }
      );


    renderHistoryList(
      filtered
    );

  }


  searchButton?.addEventListener(
    "click",
    performSearch
  );


  searchInput?.addEventListener(
    "keydown",
    event => {

      if (
        event.key ===
        "Enter"
      ) {

        event.preventDefault();

        performSearch();

      }

    }
  );


  renderHistoryList(
    sortedOrders
  );

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


  if (!list) {

    return;

  }


  if (!orders.length) {

    list.innerHTML = `

      <div class="order-empty-state">

        <div class="order-empty-icon">
          📦
        </div>

        <h3>
          Data tidak ditemukan!
        </h3>

        <p>
          Tidak ada aktifitasi data.
        </p>

      </div>

    `;

    return;

  }


  list.innerHTML =
    orders
      .map(
        order => {

          const status =
            order.status ||
            "Menunggu Pembayaran";


          return `

            <div class="order-table-row">


              <div
                class="order-table-date"
                data-label="Tanggal"
              >
                ${escapeHTML(
                  formatShortDate(
                    order.createdAt
                  )
                )}
              </div>


              <div
                class="order-table-id"
                data-label="Nomor Order"
              >

                <a
                  href="order.html?id=${encodeURIComponent(
                    order.orderId
                  )}"
                >
                  ${escapeHTML(
                    order.orderId || "-"
                  )}
                </a>

              </div>


              <div
                class="order-table-phone"
                data-label="No. Handphone"
              >
                ${escapeHTML(
                  getOrderPhone(order)
                )}
              </div>


              <div
                class="order-table-price"
                data-label="Harga"
              >
                ${formatPrice(
                  order.price
                )}
              </div>


              <div
                class="order-table-status"
                data-label="Status"
              >

                <span
                  class="order-table-status-badge ${getStatusClass(
                    status
                  )}"
                >
                  ${escapeHTML(
                    status
                  )}
                </span>

              </div>


            </div>

          `;

        }
      )
      .join("");

}


/* =========================================================
   EMPTY
   ========================================================= */

function renderEmpty(
  container,
  message
) {

  container.innerHTML = `

    <div class="order-empty-state order-empty-page">

      <div class="order-empty-icon">
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

      <a
        href="shop.html"
        class="order-topup-button"
      >
        Kembali ke Top Up
      </a>

    </div>

  `;

}


/* =========================================================
   GAME IMAGE
   ========================================================= */

function getGameImage(
  order
) {

  if (
    order.gameImage
  ) {

    return order.gameImage;

  }


  if (
    order.image
  ) {

    return order.image;

  }


  if (
    order.gameImg
  ) {

    return order.gameImg;

  }


  if (
    order.gameLogo
  ) {

    return order.gameLogo;

  }


  /*
   * Jika tidak ada gambar,
   * jangan tampilkan sword / emoji.
   */

  return "";

}


/* =========================================================
   STATUS CLASS
   ========================================================= */

function getStatusClass(
  status
) {

  switch (status) {

    case "Top Up Berhasil":
      return "success";

    case "Pesanan Diproses":
      return "processing";

    case "Pembayaran Berhasil":
      return "paid";

    case "Menunggu Pembayaran":
      return "waiting";

    default:
      return "waiting";

  }

}


/* =========================================================
   PHONE
   ========================================================= */

function getOrderPhone(
  order
) {

  return (
    order.phone ||
    order.phoneNumber ||
    order.whatsapp ||
    order.customerPhone ||
    "-"
  );

}


/* =========================================================
   PAYMENT NAME
   ========================================================= */

function getPaymentName(
  payment
) {

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
   FORMAT PRICE
   ========================================================= */

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
  ).format(
    Number(price || 0)
  );

}


/* =========================================================
   FORMAT DATE
   ========================================================= */

function formatDate(
  date
) {

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
   SHORT DATE
   ========================================================= */

function formatShortDate(
  date
) {

  if (!date) {

    return "-";

  }


  const parsed =
    new Date(date);


  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {

    return "-";

  }


  return new Intl.DateTimeFormat(
    "id-ID",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(parsed);

}


/* =========================================================
   SECURITY
   ========================================================= */

function escapeHTML(
  value
) {

  return String(
    value ?? ""
  )
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}

