// ================================
// LEO STORE — ADMIN DASHBOARD
// ================================

const ORDERS_KEY = "LEOOSTORE_orders";
const LAST_ORDER_KEY = "LEOOSTORE_last_orders";
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
const adminApiTokenEl = document.getElementById("adminApiToken");
const connectAdminApiEl = document.getElementById("connectAdminApi");
const adminApiStatusEl = document.getElementById("adminApiStatus");
const ADMIN_API_URL = "https://spring-surf-a6a7.leovbriansyh791.workers.dev/api/admin/orders";
let remoteOrders = null;

// ================================
// STORAGE
// ================================

function getOrders() {
  if (Array.isArray(remoteOrders)) return remoteOrders;
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
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

function formatDate(date) {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return parsed.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getOrderId(order) {
  return order.orderId || "";
}

function getGameSlug(order) {
  return String(
    order.gameSlug ||
    order.productId ||
    order.game ||
    ""
  ).toLowerCase();
}

function getGameName(order) {
  return (
    order.gameName ||
    order.productName ||
    order.game ||
    "Game"
  );
}

function getStatusClass(status) {
  switch (status) {
    case "Top Up Berhasil":
      return "success";

    case "Pesanan Diproses":
      return "processing";

    case "Pembayaran Berhasil":
      return "paid";

    case "Menunggu Pembayaran":
    default:
      return "waiting";
  }
}

function getGameIcon(order) {
  const slug = getGameSlug(order);
  const imageSlug = slug.startsWith("roblox-") ? "roblox" : slug;
  const knownGames = new Set([
    "mobile-legends", "free-fire", "pubg-mobile", "valorant", "roblox",
    "genshin-impact", "honkai-star-rail", "honkai-impact-3",
    "arena-of-valor", "call-of-duty-mobile", "honor-of-kings",
    "wuthering-waves", "blood-strike", "efootball", "ea-sports-fc-mobile",
    "league-of-legends-wild-rift", "marvel-rivals", "lifeafter",
    "point-blank", "delta-force", "black-clover-m", "speed-drifters",
    "zenless-zone-zero"
  ]);
  if (knownGames.has(imageSlug)) {
    return '<img src="assets/icons/' + escapeHTML(imageSlug) + '.webp" alt="' + escapeHTML(getGameName(order)) + '" loading="lazy" onerror="this.style.display=\'none\'">';
  }
  return '<span class="admin-game-icon-fallback">🎮</span>';
}

// ================================
// STATS
// ================================

function updateStats(orders) {
  const total = orders.length;

  const revenue = orders.reduce(
    (sum, order) =>
      sum + (Number(order.total ?? order.price) || 0),
    0
  );

  const success = orders.filter(
    order =>
      ["Top Up Berhasil", "Pembayaran Berhasil"].includes(order.status)
  ).length;

  const pending = orders.filter(
    order =>
      !["Top Up Berhasil", "Pembayaran Berhasil"].includes(order.status)
  ).length;

  if (totalOrdersEl) {
    totalOrdersEl.textContent = total;
  }

  if (totalRevenueEl) {
    totalRevenueEl.textContent =
      formatPrice(revenue);
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
  )
    .trim()
    .toLowerCase();

  const gameFilter =
    gameFilterEl?.value || "all";

  const statusFilter =
    adminStatusFilterEl?.value || "all";

  return orders.filter(order => {

    const searchableText = [
      getOrderId(order),
      order.playerId,
      order.server,
      getGameName(order),
      order.amount,
      order.denominationId,
      order.payment
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !search ||
      searchableText.includes(search);

    const matchesGame =
      gameFilter === "all" ||
      getGameSlug(order) === gameFilter;

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
// STATUS
// ================================

function updateOrderStatus(
  orderId,
  newStatus
) {
  const orders = getOrders();

  const index = orders.findIndex(
    order =>
      getOrderId(order) === orderId
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

  const now =
    new Date().toISOString();

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
    order.completedAt =
      order.completedAt || now;
  }

  orders[index] = order;

  saveOrders(orders);

  render();
}

// ================================
// STATUS SELECT
// ================================

function createStatusSelect(order) {
  if (order._remote) return `<div class="admin-status-control"><span class="status-control-label">Status dari database pusat · ${escapeHTML(order.rawStatus || order.status || "-")}</span></div>`;
  const orderId =
    getOrderId(order);

  const currentStatus =
    order.status ||
    "Menunggu Pembayaran";

  return `
    <div class="admin-status-control">
      <span class="status-control-label">
        Ubah Status
      </span>

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

  const orderId =
    getOrderId(order);

  const gameName =
    getGameName(order);

  const gameIcon =
    getGameIcon(order);

  const playerId =
    order.playerId || "-";

  const server =
    order.server || "-";

  const amount =
    order.amount || order.denomination || order.denominationName || "-";

  const payment =
    order.payment || order.paymentId || order.paymentMethod || "-";

  // Prefer the amount recorded by the payment backend; never use the current catalog price.
  const price =
    Number(order.total ?? order.price ?? order.paidAmount) || 0;

  const status =
    order.status ||
    "Menunggu Pembayaran";

  const statusClass =
    getStatusClass(status);

  const detailUrl =
    `order.html?id=${encodeURIComponent(orderId)}`;

  return `
    <article class="admin-order">

      <div class="admin-order-top">

        <div class="admin-order-game">

          <div class="admin-game-icon">
            ${gameIcon}
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

        <span class="admin-status ${statusClass}">
          <span class="status-dot"></span>
          ${escapeHTML(status)}
        </span>

      </div>

      <div class="admin-details-grid">

        <div class="admin-detail">
          <span class="admin-detail-label">
            Order ID
          </span>

          <span class="admin-detail-value order-id-value">
            ${escapeHTML(orderId || "-")}
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
            Server
          </span>

          <span class="admin-detail-value">
            ${escapeHTML(server)}
          </span>
        </div>

        <div class="admin-detail">
          <span class="admin-detail-label">
            Nominal
          </span>

          <span class="admin-detail-value">
            ${escapeHTML(amount)}
          </span>
        </div>

        <div class="admin-detail">
          <span class="admin-detail-label">
            Harga
          </span>

          <span class="admin-detail-value price-value">
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
            Dibuat
          </span>

          <span class="admin-detail-value">
            ${formatDate(order.createdAt)}
          </span>
        </div>

        <div class="admin-detail">
          <span class="admin-detail-label">
            Dibayar
          </span>

          <span class="admin-detail-value">
            ${formatDate(order.paidAt || (order.status === "Pembayaran Berhasil" ? order.updatedAt : ""))}
          </span>
        </div>

        <div class="admin-detail">
          <span class="admin-detail-label">
            Diproses
          </span>

          <span class="admin-detail-value">
            ${formatDate(order.processingAt)}
          </span>
        </div>

        <div class="admin-detail">
          <span class="admin-detail-label">
            Selesai
          </span>

          <span class="admin-detail-value">
            ${formatDate(order.completedAt)}
          </span>
        </div>

      </div>

      ${createStatusSelect(order)}

      <div class="admin-order-bottom">

        <a
          class="admin-detail-btn"
          href="${detailUrl}"
        >
          Lihat Detail →
        </a>

        <div class="admin-order-date">
          ID: ${escapeHTML(orderId || "-")}
        </div>

      </div>

    </article>
  `;
}

// ================================
// RENDER
// ================================

function render() {

  const orders =
    getOrders();

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

  if (
    filteredOrders.length === 0
  ) {

    adminOrderListEl.innerHTML = `
      <div class="admin-empty">
        <div class="empty-icon">📭</div>
        <p>Tidak ada transaksi ditemukan.</p>
        <span>Coba ubah kata pencarian atau filter.</span>
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
// STATUS EVENTS
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

// ================================
// LIVE SEARCH
// ================================

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
    () => { if (Array.isArray(remoteOrders)) loadRemoteOrders(); else render(); }
  );
}

// ================================
// AUTO REFRESH
// ================================

window.addEventListener(
  "storage",
  event => {

    if (
      event.key === ORDERS_KEY ||
      event.key === LAST_ORDER_KEY
    ) {
      render();
    }
  }
);


async function loadRemoteOrders(){
  const token=String(adminApiTokenEl?.value || sessionStorage.getItem("LEOOSTORE_admin_api_token") || "").trim();
  if(!token){if(adminApiStatusEl)adminApiStatusEl.textContent="Masukkan token admin untuk mengambil transaksi pusat.";return;}
  if(adminApiStatusEl)adminApiStatusEl.textContent="Mengambil transaksi dari database...";
  try{
    const response=await fetch(ADMIN_API_URL+"?limit=100",{method:"GET",headers:{Authorization:"Bearer "+token,Accept:"application/json"},cache:"no-store"});
    const data=await response.json().catch(()=>({}));
    if(!response.ok||!data.ok)throw new Error(data.error||("HTTP "+response.status));
    remoteOrders=(Array.isArray(data.orders)?data.orders:[]).map(order=>({...order,_remote:true,gameSlug:order.productId,amount:order.denomination,price:order.total,paidAt:order.status==="Pembayaran Berhasil"?order.updatedAt:""}));
    sessionStorage.setItem("LEOOSTORE_admin_api_token",token);
    if(adminApiStatusEl)adminApiStatusEl.textContent="Terhubung · "+remoteOrders.length+" transaksi dari database pusat";
    render();
  }catch(error){
    remoteOrders=null;
    if(adminApiStatusEl)adminApiStatusEl.textContent="Gagal: "+(error.message||"Gagal menghubungkan database");
    render();
  }
}
if(connectAdminApiEl)connectAdminApiEl.addEventListener("click",loadRemoteOrders);
if(adminApiTokenEl){
  adminApiTokenEl.value=sessionStorage.getItem("LEOOSTORE_admin_api_token")||"";
  adminApiTokenEl.addEventListener("keydown",event=>{if(event.key==="Enter")loadRemoteOrders();});
}

// ================================
// INITIAL
// ================================

render();
