/* =========================================
   LEO STORE — ADMIN DASHBOARD
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const orderList = document.getElementById("adminOrderList");
  const searchInput = document.getElementById("adminSearch");
  const gameFilter = document.getElementById("gameFilter");
  const statusFilter = document.getElementById("adminStatusFilter");
  const refreshBtn = document.getElementById("refreshBtn");

  const totalOrdersEl = document.getElementById("totalOrders");
  const totalRevenueEl = document.getElementById("totalRevenue");
  const successOrdersEl = document.getElementById("successOrders");
  const pendingOrdersEl = document.getElementById("pendingOrders");
  const orderCountEl = document.getElementById("orderCount");

  let orders = [];

  /* =========================================
     STORAGE
     ========================================= */

  function loadOrders() {
    try {
      const saved = localStorage.getItem("fidelis_orders");

      if (!saved) {
        orders = [];
        return;
      }

      const parsed = JSON.parse(saved);

      orders = Array.isArray(parsed)
        ? parsed
        : [];
    } catch (error) {
      console.error(
        "Gagal membaca transaksi:",
        error
      );

      orders = [];
    }
  }

  function saveOrders() {
    localStorage.setItem(
      "fidelis_orders",
      JSON.stringify(orders)
    );

    /*
     * Sinkronkan order terakhir juga.
     * Ini menjaga kompatibilitas dengan sistem
     * checkout/payment/order yang sekarang.
     */
    const lastOrder = localStorage.getItem(
      "fidelis_last_order"
    );

    if (!lastOrder) return;

    try {
      const parsedLastOrder =
        JSON.parse(lastOrder);

      const updatedLastOrder =
        orders.find(
          order =>
            order.id === parsedLastOrder.id
        );

      if (updatedLastOrder) {
        localStorage.setItem(
          "fidelis_last_order",
          JSON.stringify(
            updatedLastOrder
          )
        );
      }
    } catch (error) {
      console.error(
        "Gagal sinkronisasi last order:",
        error
      );
    }
  }

  /* =========================================
     FORMAT
     ========================================= */

  function formatPrice(price) {
    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }
    ).format(Number(price) || 0);
  }

  function formatDate(date) {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleString(
      "id-ID",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getGameIcon(game) {
    const icons = {
      "mobile-legends": "⚔️",
      "free-fire": "🔥",
      "roblox": "🧱",
      "pubg-mobile": "🎯"
    };

    return icons[game] || "🎮";
  }

  function getPaymentName(payment) {
    const names = {
      qris: "QRIS",
      ewallet: "E-Wallet",
      bank: "Virtual Account"
    };

    return names[payment] || payment || "-";
  }

  function getStatusClass(status) {
    if (status === "Top Up Berhasil") {
      return "success";
    }

    if (
      status === "Pesanan Diproses" ||
      status === "Pembayaran Berhasil"
    ) {
      return "processing";
    }

    return "waiting";
  }

  /* =========================================
     STATUS OPTIONS
     ========================================= */

  const statusOptions = [
    "Menunggu Pembayaran",
    "Pembayaran Berhasil",
    "Pesanan Diproses",
    "Top Up Berhasil"
  ];

  function createStatusSelect(order) {
    const currentStatus =
      order.status ||
      "Menunggu Pembayaran";

    return `
      <select
        class="admin-status-select"
        data-status-id="${escapeHTML(order.id)}"
      >
        ${statusOptions
          .map(status => `
            <option
              value="${escapeHTML(status)}"
              ${
                currentStatus === status
                  ? "selected"
                  : ""
              }
            >
              ${escapeHTML(status)}
            </option>
          `)
          .join("")}
      </select>
    `;
  }

  /* =========================================
     UPDATE STATUS
     ========================================= */

  function updateOrderStatus(
    orderId,
    newStatus
  ) {
    const order = orders.find(
      item => item.id === orderId
    );

    if (!order) return;

    const oldStatus = order.status;

    order.status = newStatus;

    const now =
      new Date().toISOString();

    /*
     * Simpan timestamp sesuai status.
     */

    if (
      newStatus ===
      "Pembayaran Berhasil"
    ) {
      order.paidAt =
        order.paidAt || now;
    }

    if (
      newStatus ===
      "Pesanan Diproses"
    ) {
      order.processingAt =
        order.processingAt || now;
    }

    if (
      newStatus ===
      "Top Up Berhasil"
    ) {
      order.processingAt =
        order.processingAt || now;

      order.completedAt =
        order.completedAt || now;
    }

    /*
     * Kalau admin mengembalikan status
     * ke pembayaran / menunggu,
     * timestamp proses tidak perlu
     * dihapus agar histori tetap ada.
     */

    saveOrders();

    renderStats();
    renderOrders();

    console.log(
      `Status ${orderId}: ${oldStatus} → ${newStatus}`
    );
  }

  /* =========================================
     STATS
     ========================================= */

  function renderStats() {
    const totalOrders =
      orders.length;

    const totalRevenue =
      orders.reduce(
        (total, order) =>
          total +
          (Number(order.price) || 0),
        0
      );

    const successOrders =
      orders.filter(
        order =>
          order.status ===
          "Top Up Berhasil"
      ).length;

    const pendingOrders =
      orders.filter(
        order =>
          order.status !==
          "Top Up Berhasil"
      ).length;

    if (totalOrdersEl) {
      totalOrdersEl.textContent =
        totalOrders;
    }

    if (totalRevenueEl) {
      totalRevenueEl.textContent =
        formatPrice(totalRevenue);
    }

    if (successOrdersEl) {
      successOrdersEl.textContent =
        successOrders;
    }

    if (pendingOrdersEl) {
      pendingOrdersEl.textContent =
        pendingOrders;
    }
  }

  /* =========================================
     FILTER
     ========================================= */

  function getFilteredOrders() {
    const search =
      searchInput?.value
        .trim()
        .toLowerCase() || "";

    const selectedGame =
      gameFilter?.value || "all";

    const selectedStatus =
      statusFilter?.value || "all";

    return [...orders]
      .sort((a, b) => {
        const dateA =
          new Date(
            a.createdAt || 0
          ).getTime();

        const dateB =
          new Date(
            b.createdAt || 0
          ).getTime();

        return dateB - dateA;
      })
      .filter(order => {
        if (
          selectedGame !== "all" &&
          order.game !== selectedGame
        ) {
          return false;
        }

        if (
          selectedStatus !== "all" &&
          order.status !== selectedStatus
        ) {
          return false;
        }

        if (!search) {
          return true;
        }

        const orderId =
          String(
            order.id || ""
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

        const amount =
          String(
            order.amount || ""
          ).toLowerCase();

        return (
          orderId.includes(search) ||
          playerId.includes(search) ||
          gameName.includes(search) ||
          amount.includes(search)
        );
      });
  }

  /* =========================================
     RENDER ORDERS
     ========================================= */

  function renderOrders() {
    if (!orderList) return;

    const filteredOrders =
      getFilteredOrders();

    if (orderCountEl) {
      orderCountEl.textContent =
        `${filteredOrders.length} transaksi`;
    }

    if (
      filteredOrders.length === 0
    ) {
      orderList.innerHTML = `
        <div class="admin-empty">
          <div class="admin-empty-icon">
            📭
          </div>

          <h3>
            Tidak ada transaksi
          </h3>

          <p>
            Belum ada pesanan yang
            cocok dengan pencarian
            atau filter.
          </p>
        </div>
      `;

      return;
    }

    orderList.innerHTML =
      filteredOrders
        .map(order => {
          const gameName =
            order.gameName ||
            getGameName(order.game);

          const status =
            order.status ||
            "Menunggu Pembayaran";

          const statusClass =
            getStatusClass(status);

          return `
            <div
              class="admin-order"
              data-order-id="${escapeHTML(order.id)}"
            >

              <div class="admin-order-game">

                <div class="admin-game-icon">
                  ${getGameIcon(order.game)}
                </div>

                <div>
                  <div class="admin-game-name">
                    ${escapeHTML(gameName)}
                  </div>

                  <div class="admin-game-type">
                    ${escapeHTML(
                      order.amount || "-"
                    )}
                  </div>
                </div>

              </div>


              <div class="admin-detail">

                <span class="admin-detail-label">
                  Player
                </span>

                <span class="admin-detail-value">
                  ${escapeHTML(
                    order.playerId || "-"
                  )}
                </span>

              </div>


              <div class="admin-detail">

                <span class="admin-detail-label">
                  Total
                </span>

                <span class="admin-detail-value">
                  ${formatPrice(
                    order.price
                  )}
                </span>

              </div>


              <div class="admin-detail">

                <span class="admin-detail-label">
                  Pembayaran
                </span>

                <span class="admin-detail-value">
                  ${escapeHTML(
                    getPaymentName(
                      order.payment
                    )
                  )}
                </span>

              </div>


              <div class="admin-detail">

                <span class="admin-detail-label">
                  Status
                </span>

                <div class="admin-status ${statusClass}">
                  ${escapeHTML(status)}
                </div>

              </div>


              <div class="admin-detail admin-status-control">

                <span class="admin-detail-label">
                  Ubah Status
                </span>

                ${createStatusSelect(order)}

              </div>


              <a
                href="order.html?id=${encodeURIComponent(order.id)}"
                class="admin-detail-btn"
              >
                Lihat Detail →
              </a>


              <div class="admin-order-date">

                Tanggal:
                ${escapeHTML(
                  formatDate(
                    order.createdAt
                  )
                )}

                <br>

                ID:
                ${escapeHTML(
                  order.id || "-"
                )}

              </div>

            </div>
          `;
        })
        .join("");

    bindStatusControls();
  }

  /* =========================================
     STATUS CONTROL EVENTS
     ========================================= */

  function bindStatusControls() {
    const selects =
      document.querySelectorAll(
        ".admin-status-select"
      );

    selects.forEach(select => {
      select.addEventListener(
        "change",
        event => {
          const orderId =
            event.target.dataset.statusId;

          const newStatus =
            event.target.value;

          updateOrderStatus(
            orderId,
            newStatus
          );
        }
      );
    });
  }

  /* =========================================
     GAME NAME
     ========================================= */

  function getGameName(gameSlug) {
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
      names[gameSlug] ||
      gameSlug ||
      "Game"
    );
  }

  /* =========================================
     EVENTS
     ========================================= */

  if (searchInput) {
    searchInput.addEventListener(
      "input",
      renderOrders
    );
  }

  if (gameFilter) {
    gameFilter.addEventListener(
      "change",
      renderOrders
    );
  }

  if (statusFilter) {
    statusFilter.addEventListener(
      "change",
      renderOrders
    );
  }

  if (refreshBtn) {
    refreshBtn.addEventListener(
      "click",
      () => {
        refreshBtn.disabled = true;

        refreshBtn.textContent =
          "Memuat...";

        setTimeout(() => {
          loadOrders();
          renderStats();
          renderOrders();

          refreshBtn.disabled =
            false;

          refreshBtn.textContent =
            "↻ Refresh";
        }, 350);
      }
    );
  }

  /* =========================================
     INITIALIZE
     ========================================= */

  loadOrders();
  renderStats();
  renderOrders();
});
