/* =========================================
   LEO STORE
   ADMIN DASHBOARD ENGINE
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const searchInput =
    document.getElementById("adminSearch");

  const gameFilter =
    document.getElementById("gameFilter");

  const statusFilter =
    document.getElementById(
      "adminStatusFilter"
    );

  const refreshBtn =
    document.getElementById("refreshBtn");


  /*
   * ========================================
   * INITIAL LOAD
   * ========================================
   */

  renderDashboard();


  /*
   * ========================================
   * SEARCH
   * ========================================
   */

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      renderDashboard
    );

  }


  /*
   * ========================================
   * GAME FILTER
   * ========================================
   */

  if (gameFilter) {

    gameFilter.addEventListener(
      "change",
      renderDashboard
    );

  }


  /*
   * ========================================
   * STATUS FILTER
   * ========================================
   */

  if (statusFilter) {

    statusFilter.addEventListener(
      "change",
      renderDashboard
    );

  }


  /*
   * ========================================
   * REFRESH
   * ========================================
   */

  if (refreshBtn) {

    refreshBtn.addEventListener(
      "click",
      () => {

        refreshBtn.disabled =
          true;

        refreshBtn.textContent =
          "↻ Memuat...";


        setTimeout(
          () => {

            renderDashboard();

            refreshBtn.disabled =
              false;

            refreshBtn.textContent =
              "↻ Refresh";

          },
          350
        );

      }
    );

  }

});


/* =========================================
   RENDER DASHBOARD
   ========================================= */

function renderDashboard() {

  const orders =
    getOrders();


  updateStatistics(
    orders
  );


  renderOrders(
    orders
  );

}


/* =========================================
   GET ORDERS
   ========================================= */

function getOrders() {

  try {

    const data =
      localStorage.getItem(
        "fidelis_orders"
      );


    if (!data) {

      return [];

    }


    const orders =
      JSON.parse(data);


    if (!Array.isArray(orders)) {

      return [];

    }


    return orders;

  }

  catch (error) {

    console.error(
      "Gagal membaca transaksi:",
      error
    );

    return [];

  }

}


/* =========================================
   STATISTICS
   ========================================= */

function updateStatistics(
  orders
) {

  const totalOrders =
    document.getElementById(
      "totalOrders"
    );

  const totalRevenue =
    document.getElementById(
      "totalRevenue"
    );

  const successOrders =
    document.getElementById(
      "successOrders"
    );

  const pendingOrders =
    document.getElementById(
      "pendingOrders"
    );


  /*
   * Total semua transaksi
   */

  if (totalOrders) {

    totalOrders.textContent =
      orders.length;

  }


  /*
   * Omzet
   *
   * Untuk MVP:
   * transaksi yang tercatat
   * dianggap sebagai nilai transaksi.
   */

  const revenue =
    orders.reduce(
      (total, order) => {

        const price =
          Number(
            order.price
          ) || 0;


        return (
          total + price
        );

      },
      0
    );


  if (totalRevenue) {

    totalRevenue.textContent =
      formatPrice(
        revenue
      );

  }


  /*
   * Berhasil
   */

  const successful =
    orders.filter(
      order =>
        order.status ===
        "Top Up Berhasil"
    ).length;


  if (successOrders) {

    successOrders.textContent =
      successful;

  }


  /*
   * Pending / Processing
   */

  const pending =
    orders.filter(
      order => {

        return (
          order.status !==
          "Top Up Berhasil"
        );

      }
    ).length;


  if (pendingOrders) {

    pendingOrders.textContent =
      pending;

  }

}


/* =========================================
   RENDER ORDERS
   ========================================= */

function renderOrders(
  orders
) {

  const list =
    document.getElementById(
      "adminOrderList"
    );


  const count =
    document.getElementById(
      "orderCount"
    );


  if (!list) {

    return;

  }


  const searchInput =
    document.getElementById(
      "adminSearch"
    );


  const gameFilter =
    document.getElementById(
      "gameFilter"
    );


  const statusFilter =
    document.getElementById(
      "adminStatusFilter"
    );


  const keyword =
    searchInput
      ? searchInput.value
          .trim()
          .toLowerCase()
      : "";


  const selectedGame =
    gameFilter
      ? gameFilter.value
      : "all";


  const selectedStatus =
    statusFilter
      ? statusFilter.value
      : "all";


  /*
   * ========================================
   * FILTER
   * ========================================
   */

  const filtered =
    orders
      .filter(
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


          const matchesGame =
            selectedGame ===
              "all" ||
            order.game ===
              selectedGame;


          const currentStatus =
            order.status ||
            "Menunggu Pembayaran";


          const matchesStatus =
            selectedStatus ===
              "all" ||
            currentStatus ===
              selectedStatus;


          return (
            matchesSearch &&
            matchesGame &&
            matchesStatus
          );

        }
      )
      .sort(
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


  /*
   * ========================================
   * COUNT
   * ========================================
   */

  if (count) {

    count.textContent =
      `${filtered.length} transaksi`;

  }


  /*
   * ========================================
   * EMPTY
   * ========================================
   */

  if (!filtered.length) {

    list.innerHTML = `

      <div class="admin-empty">

        <div class="admin-empty-icon">
          📦
        </div>

        <h3>
          Tidak Ada Transaksi
        </h3>

        <p>
          Tidak ada pesanan yang
          cocok dengan pencarian
          atau filter kamu.
        </p>

      </div>

    `;

    return;

  }


  /*
   * ========================================
   * BUILD HTML
   * ========================================
   */

  let html = "";


  filtered.forEach(
    order => {

      const status =
        order.status ||
        "Menunggu Pembayaran";


      const statusClass =
        getStatusClass(
          status
        );


      const gameIcon =
        getGameIcon(
          order.game
        );


      const gameName =
        order.gameName ||
        getGameName(
          order.game
        );


      const player =
        order.playerId ||
        "-";


      const amount =
        order.amount ||
        "-";


      const price =
        formatPrice(
          Number(
            order.price
          ) || 0
        );


      const payment =
        getPaymentName(
          order.payment
        );


      const date =
        formatDate(
          order.createdAt
        );


      html += `

        <article
          class="admin-order"
        >


          <!-- GAME -->

          <div
            class="admin-order-game"
          >

            <div
              class="admin-game-icon"
            >
              ${gameIcon}
            </div>

            <div>

              <div
                class="admin-game-name"
              >
                ${escapeHTML(
                  gameName
                )}
              </div>

              <div
                class="admin-game-product"
              >
                ${escapeHTML(
                  amount
                )}
              </div>

            </div>

          </div>


          <!-- PLAYER -->

          <div
            class="admin-order-info"
          >

            <span
              class="admin-order-label"
            >
              Player
            </span>

            <span
              class="admin-order-value"
            >
              ${escapeHTML(
                player
              )}
            </span>

          </div>


          <!-- TOTAL -->

          <div
            class="admin-order-info"
          >

            <span
              class="admin-order-label"
            >
              Total
            </span>

            <span
              class="admin-order-value"
            >
              ${price}
            </span>

          </div>


          <!-- PAYMENT -->

          <div
            class="admin-order-info"
          >

            <span
              class="admin-order-label"
            >
              Pembayaran
            </span>

            <span
              class="admin-order-value"
            >
              ${escapeHTML(
                payment
              )}
            </span>

          </div>


          <!-- STATUS -->

          <div
            class="admin-order-info"
          >

            <span
              class="admin-order-label"
            >
              Status
            </span>

            <span
              class="
                admin-status
                ${statusClass}
              "
            >
              ${escapeHTML(
                status
              )}
            </span>

          </div>


          <!-- DETAIL -->

          <a
            href="order.html?id=${encodeURIComponent(
              order.orderId
            )}"
            class="admin-detail-btn"
          >
            Detail →
          </a>


          <!-- DATE -->

          <div
            class="admin-order-date"
          >
            ${escapeHTML(
              date
            )}
          </div>


        </article>

      `;

    }
  );


  list.innerHTML =
    html;

}


/* =========================================
   STATUS CLASS
   ========================================= */

function getStatusClass(
  status
) {

  if (
    status ===
    "Top Up Berhasil"
  ) {

    return "success";

  }


  if (
    status ===
    "Pesanan Diproses"
  ) {

    return "processing";

  }


  return "waiting";

}


/* =========================================
   GAME ICON
   ========================================= */

function getGameIcon(
  game
) {

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
   GAME NAME
   ========================================= */

function getGameName(
  game
) {

  const names = {

    "mobile-legends":
      "Mobile Legends",

    "free-fire":
      "Free Fire",

    "roblox":
      "Roblox",

    "pubg-mobile":
      "PUBG Mobile"

  };


  return (
    names[game] ||
    "Game"
  );

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


  return (
    payment ||
    "-"
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
  ).format(
    price
  );

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

  }

  catch (error) {

    return "-";

  }

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
