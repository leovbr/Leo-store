// ================================
// LEO STORE — ADMIN DASHBOARD
// ================================

const ORDERS_KEY = "fidelis_orders";
const LAST_ORDER_KEY = "fidelis_last_order";

const STATUS_OPTIONS = [
  "Menunggu Pembayaran",
  "Pembayaran Berhasil",
  "Pesanan Diproses",
  "Top Up Berhasil"
];

// ================================
// ELEMENTS
// ================================

const totalOrdersEl = document.getElementById("totalOrders");
const totalRevenueEl = document.getElementById("totalRevenue");
const successOrdersEl = document.getElementById("successOrders");
const pendingOrdersEl = document.getElementById("pendingOrders");

const orderCountEl = document.getElementById("orderCount");
const adminSearchEl = document.getElementById("adminSearch");
const gameFilterEl = document.getElementById("gameFilter");
const adminStatusFilterEl = document.getElementById("adminStatusFilter");
const adminOrderListEl = document.getElementById("adminOrderList");
const refreshBtnEl = document.getElementById("refreshBtn");

// ================================
// STORAGE
// ================================

function getOrders() {
  try {
    const orders = JSON.parse(
      localStorage.getItem(ORDERS_KEY) || "[]"
    );

    return Array.isArray(orders) ? orders : [];
  } catch (error) {
    console.error("Gagal membaca orders:", error);
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(
    ORDERS_KEY,
    JSON.stringify(orders)
  );

  // Sync last order
  if (orders.length > 0) {
    localStorage.setItem(
      LAST_ORDER_KEY,
      JSON.stringify(orders[orders.length - 1])
    );
  }
}

// ================================
// HELPERS
// ================================

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatPrice(value) {
  const number = Number(value) || 0;

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number);
}

function formatDate(date) {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getGameSlug(order) {
  return String(
    order.gameSlug ||
    order.game ||
    ""
  ).toLowerCase();
}

function getGameName(order) {
  return (
    order.gameName ||
    order.game ||
    "Game"
  );
}

function getOrderId(order) {
  // Prioritaskan orderId karena seluruh sistem utama memakai ini.
  return (
    order.orderId ||
    order.id ||
    ""
  );
}

function getStatusClass(status) {
  switch (status) {
    case "Top Up Berhasil":
      return "success";

    case "Pesanan Diproses":
      return "processing";

    case "Pembayaran Berhasil":
    case "Menunggu Pembayaran":
    default:
      return "waiting";
  }
}

// ================================
// STATS
// ================================

function updateStats(orders) {
  const total = orders.length;

  const revenue = orders.reduce((sum, order) => {
    return sum + (Number(order.price) || 0);
  }, 0);

  const success = orders.filter(
    order => order.status === "Top Up Berhasil"
  ).length;

  const pending = orders.filter(
    order => order.status !== "Top Up Berhasil"
  ).length;

  if (totalOrdersEl) {
    totalOrdersEl.textContent = total;
  }

  if (totalRevenueEl) {
    totalRevenueEl.textContent = formatPrice(revenue);
  }

  if (successOrdersEl) {
    successOrdersEl.textContent = success;
  }

  if (pendingOrdersEl) {
    pendingOrdersEl.textContent = pending;
  }
}

// ================================
// FILTER
// ================================

function getFilteredOrders() {
  const orders = getOrders();

  const search = (
    adminSearchEl?.value || ""
  ).trim().toLowerCase();

  const gameFilter = (
    gameFilterEl?.value || "all"
  ).toLowerCase();

  const statusFilter = (
    adminStatusFilterEl?.value || "all"
  );

  return orders.filter(order => {
    const orderId = getOrderId(order).toLowerCase();

    const playerId = String(
      order.playerId || ""
    ).toLowerCase();

    const gameName = String(
      getGameName(order)
    ).toLowerCase();

    const amount = String(
      order.amount || ""
    ).toLowerCase();

    const gameSlug = getGameSlug(order);

    const matchesSearch =
      !search ||
      orderId.includes(search) ||
      playerId.includes(search) ||
      gameName.includes(search) ||
      amount.includes(search);

    const matchesGame =
      gameFilter === "all" ||
      gameSlug === gameFilter;

    const matchesStatus =
      statusFilter === "all" ||
      order.status === statusFilter;

    return (
      matchesSearch &&
      matchesGame &&
      matchesStatus
    );
  });
}

// ================================
// STATUS UPDATE
// ================================

function updateOrderStatus(orderId, newStatus) {
  const orders = getOrders();

  const index = orders.findIndex(
    order => getOrderId(order) === orderId
  );

  if (index === -1) {
    console.error(
      "Order tidak ditemukan:",
      orderId
    );
    return;
  }

  const order = orders[index];

  order.status = newStatus;

  if (newStatus === "Pembayaran Berhasil") {
    order.paidAt =
      order.paidAt || new Date().toISOString();
  }

  if (newStatus === "Pesanan Diproses") {
    order.processingAt =
      order.processingAt || new Date().toISOString();
  }

  if (newStatus === "Top Up Berhasil") {
    order.completedAt =
      order.completedAt || new Date().toISOString();
  }

  orders[index] = order;

  saveOrders(orders);

  render();
}

// ================================
// STATUS SELECT
// ================================

function createStatusSelect(order) {
  const orderId = getOrderId(order);
  const currentStatus = order.status || "Menunggu Pembayaran";

  return `
    <div class="admin-status-control">
      <select
        class="admin-status-select"
        data-status-id="${escapeHTML(orderId)}"
      >
        ${STATUS_OPTIONS.map(status => `
          <option
            value="${escapeHTML(status)}"
            ${status === currentStatus ? "selected" : ""}
          >
            ${escapeHTML(status)}
          </option>
        `).join("")}
      </select>
    </div>
  `;
}

// ================================
// ORDER CARD
// ================================

function createOrderCard(order) {
  const orderId = getOrderId(order);

  const gameName = getGameName(order);

  const gameSlug = getGameSlug(order);

  const playerId =
    order.playerId || "-";

  const amount =
    order.amount || "-";

  const price =
    Number(order.price) || 0;

  const payment =
    order.payment || "-";

  const status =
    order.status || "Menunggu Pembayaran";

  const statusClass =
    getStatusClass(status);

  const safeOrderId =
    escapeHTML(orderId);

  const detailUrl =
    `order.html?id=${encodeURIComponent(orderId)}`;

  return `
    <article class="admin-order">

      <div class="admin-order-game">

        <div class="admin-game-icon">
          ${gameSlug === "free-fire" ? "🔥" :
            gameSlug === "mobile-legends" ? "⚔️" :
            gameSlug === "roblox" ? "🧱" :
            gameSlug === "pubg-mobile" ? "🔫" :
            "🎮"}
        </div>

        <div>
          <div class="admin-game-name">
            ${escapeHTML(gameName)}
          </div>

          <div class="admin-game-type">
            ${escapeHTML(amount)}
          </div>
        </div>

      </div>

      <div class="admin-detail">

        <span class="admin-detail-label">
          Order ID
        </span>

        <span class="admin-detail-value">
          ${safeOrderId || "-"}
        </span>

      </div>

      <div class="admin-detail">

        <span class="admin-detail-label">
          Player ID
        </span>

        <span class="admin-detail-value">
          ${escapeHTML(playerId)}
        </span>

      </div>

      <div class="admin-detail">

        <span class="admin-detail-label">
          Total
        </span>

        <span class="admin-detail-value">
          ${formatPrice(price)}
        </span>

      </div>

      <div class="admin-detail">

        <span class="admin-detail-label">
          Pembayaran
        </span>

        <span class="admin-detail-value">
          ${escapeHTML(payment)}
        </span>

      </div>

      <div class="admin-detail">

        <span class="admin-detail-label">
          Status
        </span>

        <span class="admin-status ${statusClass}">
          ${escapeHTML(status)}
        </span>

      </div>

      ${createStatusSelect(order)}

      <a
        class="admin-detail-btn"
        href="${detailUrl}"
      >
        Lihat Detail →
      </a>

      <div class="admin-order-date">
        Tanggal: ${formatDate(order.createdAt)}
      </div>

    </article>
  `;
}

// ================================
// RENDER
// ================================

function render() {
  const orders = getOrders();

  updateStats(orders);

  const filteredOrders =
    getFilteredOrders();

  if (orderCountEl) {
    orderCountEl.textContent =
      `${filteredOrders.length} transaksi`;
  }

  if (!adminOrderListEl) {
    return;
  }

  if (filteredOrders.length === 0) {
    adminOrderListEl.innerHTML = `
      <div class="admin-empty">
        <div>📭</div>
        <p>Tidak ada transaksi ditemukan.</p>
      </div>
    `;

    return;
  }

  adminOrderListEl.innerHTML =
    filteredOrders
      .slice()
      .reverse()
      .map(createOrderCard)
      .join("");

  bindStatusEvents();
}

// ================================
// EVENTS
// ================================

function bindStatusEvents() {
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

        if (!orderId) {
          console.error(
            "Order ID kosong."
          );
          return;
        }

        updateOrderStatus(
          orderId,
          newStatus
        );
      }
    );
  });
}

if (adminSearchEl) {
  adminSearchEl.addEventListener(
    "input",
    render
  );
}

if (gameFilterEl) {
  gameFilterEl.addEventListener(
    "change",
    render
  );
}

if (adminStatusFilterEl) {
  adminStatusFilterEl.addEventListener(
    "change",
    render
  );
}

if (refreshBtnEl) {
  refreshBtnEl.addEventListener(
    "click",
    render
  );
}

// ================================
// INITIAL LOAD
// ================================

render();
