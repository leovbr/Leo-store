/* =========================================================
   LEOOSTORE — CHECKOUT ENGINE
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);
  const products = typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS)
    ? PRODUCTS
    : (Array.isArray(window.PRODUCTS) ? window.PRODUCTS : []);

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
  const checkoutSummary = $("checkoutSummary");
  const summaryToggle = $("summaryToggle");
  const summaryEmpty = $("summaryEmpty");
  const summaryEmptyButton = $("summaryEmptyButton");
  const summaryContent = $("summaryContent");
  const summaryPayment = $("summaryPayment");
  const accountTitle = $("accountTitle");
  const accountDescription = $("accountDescription");
  const standardAccountFields = $("standardAccountFields");
  const robloxLoginFields = $("robloxLoginFields");
  const robloxUsername = $("robloxUsername");
  const robloxPassword = $("robloxPassword");
  const robloxInfoButton = $("robloxInfoButton");
  const robloxInfoPanel = $("robloxInfoPanel");
  const robloxInfoOk = $("robloxInfoOk");
  const robloxPreorderModal = $("robloxPreorderModal");
  const robloxPreorderBody = $("robloxPreorderBody");
  const robloxPreorderOk = $("robloxPreorderOk");

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
      if (gameHeroBanner) {
        gameHeroBanner.style.backgroundImage = "";
        gameHeroBanner.style.setProperty("--hero-banner-image", "none");
      }
      if (gameIconFallback) {
        gameIconFallback.textContent = "🎮";
        gameIconFallback.style.display = "flex";
      }
      return;
    }

    const image = product.image || "";
    if (gameName) gameName.textContent = product.name || "Game";
    if (gameDescription) gameDescription.textContent = product.publisher || "Publisher";
    if (gameImage) {
      gameImage.src = image;
      gameImage.alt = product.name || "Game";
      gameImage.style.display = image ? "block" : "none";
    }
    if (gameHeroBanner) {
      gameHeroBanner.style.backgroundImage = "";
      gameHeroBanner.style.setProperty("--hero-banner-image", image ? `url("${new URL(image, document.baseURI).href}")` : "none");
    }
    if (gameIconFallback) {
      gameIconFallback.textContent = product.icon || "🎮";
      gameIconFallback.style.display = image ? "none" : "flex";
    }
  }

  function updateAccountFields(product) {
    const id = String(product?.id || "");
    const isRoblox = id === "roblox-via-login" || id === "roblox-via-username";
    const isRobloxLogin = id === "roblox-via-login";
    const isRobloxUsername = id === "roblox-via-username";
    const isPubg = id === "pubg-mobile";

    if (serverField) serverField.style.display = (isRoblox || isPubg) ? "none" : "";
    if (serverInput && (isRoblox || isPubg)) serverInput.value = "";
    if (accountTitle) accountTitle.textContent = "Data Akun";
    if (accountDescription) accountDescription.textContent = (isRobloxLogin || isRobloxUsername)
      ? "Masukkan username dan password."
      : "Masukkan data akun untuk proses top up.";
    if (standardAccountFields) standardAccountFields.hidden = isRobloxLogin || isRobloxUsername;
    if (robloxLoginFields) robloxLoginFields.hidden = !(isRobloxLogin || isRobloxUsername);
    if (robloxInfoButton) robloxInfoButton.hidden = !(isRobloxLogin || isRobloxUsername);
    if (!isRoblox) {
      if (robloxUsername) robloxUsername.value = "";
      if (robloxPassword) robloxPassword.value = "";
      if (robloxInfoPanel) robloxInfoPanel.hidden = true;
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
            <div class="denomination-copy">
              <div class="denomination-title">${escapeHTML(item.amount)}</div>
              <div class="denomination-price-box"><span>${item.logo ? `<img src="${escapeHTML(item.logo)}" alt="" class="denomination-logo">` : ""}${rupiah(item.price)}</span></div>
            </div>
          </div>
          <div class="denomination-divider"></div>
          <div class="denomination-delivery">
            <div class="denomination-delivery-text">
              <span class="delivery-icon" aria-hidden="true">⚡</span>
              <span>Proses Cepat</span>
            </div>
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
    const fee = selectedPayment.id === "qris" ? 0.8 : Number(selectedPayment.fee || 0);
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
    if (summaryPayment) summaryPayment.textContent = selectedPayment
      ? (selectedPayment.id === "qris" ? "QRIS (All Payment)" : selectedPayment.name)
      : "-";
    const hasProduct = Boolean(selectedProduct && selectedDenomination);
    if (summaryEmpty) summaryEmpty.hidden = hasProduct;
    if (summaryContent) summaryContent.hidden = !hasProduct;
    if (summaryToggle) {
      summaryToggle.hidden = !hasProduct;
      summaryToggle.setAttribute("aria-expanded", String(checkoutSummary?.classList.contains("expanded") || false));
      summaryToggle.setAttribute("aria-label", checkoutSummary?.classList.contains("expanded") ? "Tutup ringkasan" : "Buka ringkasan");
    }
    if (checkoutButton) checkoutButton.disabled = !hasProduct;

    if (summaryImage) {
      if (selectedProduct?.image) {
        summaryImage.src = selectedProduct.image;
        summaryImage.alt = selectedProduct.name || "Produk";
      } else {
        summaryImage.removeAttribute("src");
      }
    }
  }

  function showRobloxPreorderInfo(product) {
    if (!robloxPreorderModal || !product) return;
    const id = String(product.id || "");
    const isRobloxUsername = id === "roblox-via-username";
    const isRobloxLogin = id === "roblox-via-login";
    if (!isRobloxUsername && !isRobloxLogin) return;

    const formatText = 'Halo min, saya sudah order (nominal robux) dengan username LeoXXXX (tidak perlu mirip)';
    if (robloxPreorderBody) {
      robloxPreorderBody.innerHTML = isRobloxUsername
        ? '<ul><li>Pastikan akun Roblox berusia <strong>18+</strong>.</li><li>Pastikan <strong>V2L aktif</strong>.</li><li>Masukkan username Roblox dengan benar.</li><li>Pesanan yang sudah diproses tidak dapat dibatalkan karena kesalahan data.</li><li>Setelah melakukan pembayaran, hubungi WhatsApp admin <strong>LEOOSTORE 085823538473</strong> dan kirim format:</li></ul><div class="roblox-format">"' + escapeHTML(formatText) + '"</div>'
        : '<ul><li>Metode ini membutuhkan <strong>Username &amp; Password Roblox</strong>.</li><li>Data digunakan hanya untuk proses top up.</li><li>Jangan memberikan password akun selain melalui halaman checkout resmi.</li><li>Setelah melakukan pembayaran, hubungi WhatsApp admin <strong>LEOOSTORE 085823538473</strong> dan kirim format:</li></ul><div class="roblox-format">"' + escapeHTML(formatText) + '"</div>';
    }

    robloxPreorderModal.hidden = false;
    robloxPreorderModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("roblox-preorder-open");
    setTimeout(() => robloxPreorderOk?.focus(), 0);
  }

  function closeRobloxPreorderInfo() {
    if (!robloxPreorderModal) return;
    robloxPreorderModal.hidden = true;
    robloxPreorderModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("roblox-preorder-open");
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
    showRobloxPreorderInfo(selectedProduct);
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
    if (isRoblox) {
      if (!robloxUsername?.value.trim()) {
        alert("Silakan masukkan Username Roblox.");
        robloxUsername?.focus();
        return;
      }
      if (!robloxPassword?.value) {
        alert("Silakan masukkan Password Roblox.");
        robloxPassword?.focus();
        return;
      }
    } else if (!playerIdInput?.value.trim()) {
      alert("Silakan masukkan Player ID.");
      playerIdInput?.focus();
      return;
    }
    if (!isRoblox && selectedProduct.id !== "pubg-mobile" && !serverInput?.value.trim()) {
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
      playerId: isRoblox ? robloxUsername.value.trim() : playerIdInput.value.trim(),
      username: isRoblox ? robloxUsername.value.trim() : "",
      password: isRoblox ? robloxPassword.value : "",
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
  summaryToggle?.addEventListener("click", () => {
    if (!selectedProduct || !selectedDenomination || !checkoutSummary) return;
    checkoutSummary.classList.toggle("expanded");
    updateSummary();
  });
  summaryEmptyButton?.addEventListener("click", () => gameSelect?.focus());

  checkoutButton?.addEventListener("click", createOrder);
  robloxInfoButton?.addEventListener("click", () => {
    if (robloxInfoPanel) robloxInfoPanel.hidden = false;
  });
  robloxPreorderOk?.addEventListener("click", closeRobloxPreorderInfo);
  robloxPreorderModal?.querySelector(".roblox-preorder-backdrop")?.addEventListener("click", closeRobloxPreorderInfo);

  robloxInfoOk?.addEventListener("click", () => {
    if (robloxInfoPanel) robloxInfoPanel.hidden = true;
  });

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
