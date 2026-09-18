/* =========================================================
   LEOOSTORE — CHECKOUT ENGINE
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);
  const products = typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS)
    ? PRODUCTS
    : (Array.isArray(window.PRODUCTS) ? window.PRODUCTS : []);

  // Load the latest checkout fixes without relying on cached HTML/CSS.
  const fixStyles = document.createElement("link");
  fixStyles.rel = "stylesheet";
  fixStyles.href = "css/checkout-fixes.css?v=20260918-14";
  document.head.appendChild(fixStyles);

  const gameSelect = $("game");
  const playerIdInput = $("playerId");
  const serverInput = $("server");
  const serverField = $("serverField");
  const denominationList = $("denominationList");
  const nominalInput = $("nominal");
  const paymentInput = $("payment");
  const quantityInput = $("quantity");
  const quantityMinus = $("quantityMinus");
  const quantityPlus = $("quantityPlus");
  const gameName = $("gameName");
  const gameDescription = $("gameDescription");
  const gameImage = $("gameImage");
  const gameHeroBanner = $("gameHeroBanner");
  const gameIconFallback = $("gameIconFallback");
  const summaryImage = $("summaryProductImage");
  const summaryName = $("summaryProductName");
  const summaryDenomination = $("summaryProductDenomination");
  const summaryQuantity = $("summaryQuantity");
  const summaryFee = $("summaryAdminFee");
  const summaryPrice = $("summaryProductPrice");
  const summaryTotal = $("summaryTotal");
  const promoButton = $("promoButton");
  const promoInput = $("promoCode");
  const promoMessage = $("promoMessage");
  const contactEmail = $("contactEmail");
  const contactWhatsapp = $("contactWhatsapp");
  const countryCode = $("countryCode");
  const checkoutButton = $("checkoutButton");
  const robloxLoginNotice = $("robloxLoginNotice");

  const ORDERS_KEY = "LEOOSTORE_orders";
  const LAST_ORDER_KEY = "LEOOSTORE_last_order";

  let selectedProduct = null;
  let selectedDenomination = null;
  let selectedPayment = null;
  let promoApplied = false;

  const rupiah = (value) => new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));

  const escapeHTML = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  const getProduct = (id) => products.find((p) =>
    String(p.id) === String(id) || String(p.slug) === String(id)
  ) || null;

  const getQuantity = () => {
    let value = Number(quantityInput?.value || 1);
    if (!Number.isFinite(value)) value = 1;
    value = Math.max(1, Math.min(99, Math.floor(value)));
    if (quantityInput) quantityInput.value = value;
    return value;
  };

  function populateGames() {
    if (!gameSelect) return;
    gameSelect.innerHTML = '<option value="">Pilih Game</option>';
    products.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.slug || product.id;
      option.textContent = product.name || product.id;
      gameSelect.appendChild(option);
    });
  }

  function updateHero(product) {
    if (!product) {
      if (gameName) gameName.textContent = "Pilih Game";
      if (gameDescription) gameDescription.textContent = "Pilih publisher";
      if (gameImage) {
        gameImage.removeAttribute("src");
        gameImage.style.display = "none";
      }
      if (gameHeroBanner) gameHeroBanner.style.backgroundImage = "";
      if (gameIconFallback) {
        gameIconFallback.textContent = "🎮";
        gameIconFallback.style.display = "flex";
      }
      return;
    }

    const image = product.image || "";
    if (gameName) gameName.textContent = product.name || "Game";
    if (gameDescription) gameDescription.textContent = product.description || product.publisher || "Publisher";
    if (gameImage) {
      gameImage.src = image;
      gameImage.alt = product.name || "Game";
      gameImage.style.display = image ? "block" : "none";
    }
    if (gameHeroBanner) {
      gameHeroBanner.style.backgroundImage = image ? `url("${image}")` : "";
    }
    if (gameIconFallback) {
      gameIconFallback.textContent = product.icon || "🎮";
      gameIconFallback.style.display = image ? "none" : "flex";
    }
  }

  function updateAccountFields(product) {
    const id = String(product?.id || "");
    const isRoblox = id === "roblox-via-login" || id === "roblox-via-username";

    if (serverField) serverField.style.display = isRoblox ? "none" : "";
    if (serverInput && isRoblox) serverInput.value = "";
    if (robloxLoginNotice) {
      robloxLoginNotice.style.display = id === "roblox-via-login" ? "block" : "none";
    }
    if (playerIdInput) {
      playerIdInput.placeholder = id === "roblox-via-login" || id === "roblox-via-username"
        ? "Masukkan Username Roblox"
        : "Masukkan Player ID";
    }
  }

  function renderDenominations(product) {
    if (!denominationList) return;
    selectedDenomination = null;
    if (nominalInput) nominalInput.value = "";

    if (!product?.denominations?.length) {
      denominationList.innerHTML = '<div class="checkout-loading">Pilih game terlebih dahulu.</div>';
      updateSummary();
      return;
    }

    const groups = {};
    product.denominations.forEach((item) => {
      const category = item.category || "Top Up";
      (groups[category] ||= []).push(item);
    });

    denominationList.innerHTML = "";
    Object.entries(groups).forEach(([category, items]) => {
      const group = document.createElement("div");
      group.className = "denomination-group";
      group.innerHTML = `<div class="denomination-category-title">${escapeHTML(category)}</div>`;

      const grid = document.createElement("div");
      grid.className = "denomination-group-grid";

      items.forEach((item) => {
        const option = document.createElement("div");
        option.className = "denomination-option";
        option.dataset.id = item.id;
        option.setAttribute("role", "button");
        option.setAttribute("tabindex", "0");
        option.innerHTML = `
          <div class="denomination-main">
            <div class="denomination-title">${escapeHTML(item.amount)}</div>
            <div class="denomination-price-box"><span>${rupiah(item.price)}</span></div>
          </div>
          <div class="denomination-divider"></div>
          <div class="denomination-delivery">
            <div class="denomination-delivery-text"><span class="delivery-icon">⚡</span><span>Proses Cepat</span></div>
          </div>`;

        const choose = () => {
          selectedDenomination = item;
          document.querySelectorAll(".denomination-option").forEach((el) => el.classList.remove("selected"));
          option.classList.add("selected");
          if (nominalInput) nominalInput.value = item.id;
          updateSummary();
        };
        option.addEventListener("click", choose);
        option.addEventListener("keydown", (event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            choose();
          }
        });
        grid.appendChild(option);
      });

      group.appendChild(grid);
      denominationList.appendChild(group);
    });
  }

  function selectPayment(element) {
    document.querySelectorAll(".payment-option").forEach((item) => item.classList.remove("selected"));
    element.classList.add("selected");
    selectedPayment = {
      id: element.dataset.paymentId,
      name: element.dataset.paymentName,
      fee: Number(element.dataset.fee || 0),
      feeType: element.dataset.feeType || "fixed"
    };
    if (paymentInput) paymentInput.value = selectedPayment.id;
    updateSummary();
  }

  function getBaseTotal() {
    return selectedDenomination ? Number(selectedDenomination.price || 0) * getQuantity() : 0;
  }

  function getPaymentFee() {
    if (!selectedDenomination || !selectedPayment) return 0;
    const fee = Number(selectedPayment.fee || 0);
    return selectedPayment.feeType === "percent" ? Math.round(getBaseTotal() * fee / 100) : fee;
  }

  function getTotal() {
    const total = getBaseTotal() + getPaymentFee();
    return promoApplied ? Math.max(0, total - 1000) : total;
  }

  function updateSummary() {
    const quantity = getQuantity();
    if (summaryQuantity) summaryQuantity.textContent = quantity;
    if (summaryName) summaryName.textContent = selectedProduct?.name || "Pilih Game";
    if (summaryDenomination) summaryDenomination.textContent = selectedDenomination?.amount || "Pilih nominal";
    if (summaryFee) summaryFee.textContent = rupiah(getPaymentFee());
    if (summaryPrice) summaryPrice.textContent = rupiah(getBaseTotal());
    if (summaryTotal) summaryTotal.textContent = rupiah(getTotal());

    if (summaryImage) {
      if (selectedProduct?.image) {
        summaryImage.src = selectedProduct.image;
        summaryImage.alt = selectedProduct.name || "Produk";
      } else {
        summaryImage.removeAttribute("src");
      }
    }
  }

  function selectGame(gameId) {
    selectedProduct = getProduct(gameId);
    selectedDenomination = null;
    selectedPayment = null;
    if (paymentInput) paymentInput.value = "";
    document.querySelectorAll(".payment-option").forEach((option) => option.classList.remove("selected"));
    updateHero(selectedProduct);
    updateAccountFields(selectedProduct);
    renderDenominations(selectedProduct);
    updateSummary();
  }

  function setupPayments() {
    document.querySelectorAll(".payment-option").forEach((option) => {
      option.addEventListener("click", () => selectPayment(option));
    });
    document.querySelectorAll(".payment-category-header").forEach((header) => {
      header.addEventListener("click", () => {
        header.closest(".payment-category")?.classList.toggle("open");
      });
    });
  }

  function applyPromo() {
    const code = String(promoInput?.value || "").trim().toUpperCase();
    if (!code) {
      promoApplied = false;
      if (promoMessage) promoMessage.textContent = "Masukkan kode promo.";
    } else if (code === "LEO1000") {
      promoApplied = true;
      if (promoMessage) promoMessage.textContent = "Promo berhasil digunakan — diskon Rp1.000.";
    } else {
      promoApplied = false;
      if (promoMessage) promoMessage.textContent = "Kode promo tidak ditemukan.";
    }
    updateSummary();
  }

  function createOrder() {
    if (!selectedProduct) return alert("Silakan pilih game terlebih dahulu.");
    if (!selectedDenomination) return alert("Silakan pilih nominal terlebih dahulu.");

    const isRoblox = selectedProduct.id === "roblox-via-login" || selectedProduct.id === "roblox-via-username";
    if (!playerIdInput?.value.trim()) {
      alert(isRoblox ? "Silakan masukkan Username Roblox." : "Silakan masukkan Player ID.");
      playerIdInput?.focus();
      return;
    }
    if (!isRoblox && !serverInput?.value.trim()) {
      alert("Silakan masukkan Server.");
      serverInput?.focus();
      return;
    }
    if (!selectedPayment) return alert("Silakan pilih metode pembayaran.");
    if (!contactEmail?.value.trim()) {
      alert("Silakan masukkan email.");
      contactEmail?.focus();
      return;
    }
    if (!contactWhatsapp?.value.trim()) {
      alert("Silakan masukkan nomor WhatsApp.");
      contactWhatsapp?.focus();
      return;
    }

    const orderId = "LEO-" + Date.now().toString(36).toUpperCase();
    const order = {
      id: orderId,
      orderId,
      gameId: selectedProduct.id,
      game: selectedProduct.name,
      gameName: selectedProduct.name,
      playerId: playerIdInput.value.trim(),
      server: serverInput?.value.trim() || "",
      denominationId: selectedDenomination.id,
      denomination: selectedDenomination.amount,
      amount: selectedDenomination.amount,
      quantity: getQuantity(),
      paymentId: selectedPayment.id,
      payment: selectedPayment.name,
      paymentName: selectedPayment.name,
      email: contactEmail.value.trim(),
      whatsapp: (countryCode?.value || "+62") + contactWhatsapp.value.trim(),
      subtotal: getBaseTotal(),
      price: getTotal(),
      fee: getPaymentFee(),
      total: getTotal(),
      promo: promoApplied ? "LEO1000" : "",
      status: "Menunggu Pembayaran",
      createdAt: new Date().toISOString()
    };

    let orders = [];
    try {
      orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
      if (!Array.isArray(orders)) orders = [];
    } catch (_) {
      orders = [];
    }
    orders.unshift(order);

    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    localStorage.setItem("fidelis_orders", JSON.stringify(orders));
    localStorage.setItem("fidelis_last_order", JSON.stringify(order));

    window.location.href = "payment.html?id=" + encodeURIComponent(orderId);
  }

  gameSelect?.addEventListener("change", () => selectGame(gameSelect.value));
  quantityMinus?.addEventListener("click", () => {
    quantityInput.value = Math.max(1, getQuantity() - 1);
    updateSummary();
  });
  quantityPlus?.addEventListener("click", () => {
    quantityInput.value = Math.min(99, getQuantity() + 1);
    updateSummary();
  });
  quantityInput?.addEventListener("input", updateSummary);
  promoButton?.addEventListener("click", applyPromo);
  checkoutButton?.addEventListener("click", createOrder);

  populateGames();
  setupPayments();

  const queryGame = new URLSearchParams(window.location.search).get("game");
  if (queryGame && getProduct(queryGame)) {
    gameSelect.value = getProduct(queryGame).slug || getProduct(queryGame).id;
    selectGame(gameSelect.value);
  } else {
    updateHero(null);
    updateAccountFields(null);
    renderDenominations(null);
    updateSummary();
  }
});
