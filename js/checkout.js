/* =========================================================
   LEOOSTORE — CHECKOUT ENGINE
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", async () => {
  const $ = (id) => document.getElementById(id);

  // Branded storefront notice replaces native browser alert dialogs.
  const checkoutNotice = $("checkoutNotice");
  const checkoutNoticeTitle = $("checkoutNoticeTitle");
  const checkoutNoticeMessage = $("checkoutNoticeMessage");
  const checkoutNoticeClose = $("checkoutNoticeClose");
  let checkoutNoticePreviousFocus = null;

  function showCheckoutNotice(message, title = "Periksa Pesanan") {
    if (!checkoutNotice || !checkoutNoticeMessage) {
      console.warn("[LEOOSTORE]", message);
      return;
    }
    checkoutNoticePreviousFocus = document.activeElement;
    checkoutNoticeTitle.textContent = title;
    checkoutNoticeMessage.textContent = String(message || "Terjadi kendala. Silakan coba lagi.");
    checkoutNotice.hidden = false;
    document.body.classList.add("checkout-notice-open");
    checkoutNoticeClose?.focus();
  }

  function closeCheckoutNotice() {
    if (!checkoutNotice || checkoutNotice.hidden) return;
    checkoutNotice.hidden = true;
    document.body.classList.remove("checkout-notice-open");
    checkoutNoticePreviousFocus?.focus?.();
  }

  checkoutNoticeClose?.addEventListener("click", closeCheckoutNotice);
  checkoutNotice?.querySelector(".checkout-notice-backdrop")?.addEventListener("click", closeCheckoutNotice);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && checkoutNotice && !checkoutNotice.hidden) closeCheckoutNotice();
  });

  const legacyProducts = typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS) ? PRODUCTS : (Array.isArray(window.PRODUCTS) ? window.PRODUCTS : []);
  const products = window.LEOOSTORE_CATALOG ? await window.LEOOSTORE_CATALOG.getCatalog(legacyProducts) : legacyProducts;

  const gameSelect = $("game");
  const playerIdInput = $("playerId");
  const serverInput = $("server");
  const serverSelect = $("serverSelect");
  const serverLabel = $("serverLabel");
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
  const summaryFeeRow = $("summaryFeeRow");
  const summaryDiscount = $("summaryDiscount");
  const summaryDiscountRow = $("summaryDiscountRow");
  const summaryPrice = $("summaryProductPrice");
  const summaryTotal = $("summaryTotal");
  const qrisTotalBox = $("qrisTotalBox");
  const qrisTotalLabel = $("qrisTotalLabel");
  const qrisTotalAmount = $("qrisTotalAmount");
  const qrisTotalNote = $("qrisTotalNote");
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
  const summarySpacer = document.querySelector(".checkout-scroll-spacer");
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
  let appliedPromo = null;

  // Keep the document's bottom clearance equal to the live sticky summary height.
  const syncSummarySpacer = () => {
    if (!checkoutSummary || !summarySpacer) return;
    const height = Math.ceil(checkoutSummary.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--checkout-summary-space", `${height}px`);
  };
  if (checkoutSummary && summarySpacer) {
    if ("ResizeObserver" in window) {
      const summaryResizeObserver = new ResizeObserver(syncSummarySpacer);
      summaryResizeObserver.observe(checkoutSummary);
    }
    window.addEventListener("resize", syncSummarySpacer, { passive: true });
    syncSummarySpacer();
  }


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
      const configuredBanner = String(product.banner || "").trim();
      if (configuredBanner) {
        const probe = new Image();
        probe.onload = () => gameHeroBanner.style.setProperty("--hero-banner-image", `url("${configuredBanner.replace(/["\\\\]/g, "")}")`);
        probe.onerror = () => {
          console.warn("[LEOOSTORE] Banner checkout dari admin gagal dimuat:", configuredBanner);
          gameHeroBanner.style.setProperty("--hero-banner-image", "none");
        };
        probe.src = configuredBanner;
      } else {
        // No Admin banner configured: keep the hero background empty.
        gameHeroBanner.style.setProperty("--hero-banner-image", "none");
      }
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
    const isFreeFire = id === "free-fire" || id === "freefire";
    const isValorant = id === "valorant";

    const cfg = product?.accountConfig || {};
    const useId = product?.useId !== false;
    const serverMode = ["none","manual","select"].includes(cfg.serverMode) ? cfg.serverMode : (product?.useServer !== false && !(isRoblox || isPubg || isFreeFire || isValorant) ? "manual" : "none");
    const useServer = serverMode !== "none";
    const playerField = playerIdInput?.closest(".form-group");
    if (playerField) playerField.style.display = (isRoblox || useId) ? "" : "none";
    if (serverField) serverField.style.display = useServer ? "" : "none";
    if (serverInput) { serverInput.hidden = serverMode === "select"; serverInput.required = useServer && serverMode === "manual" && cfg.serverRequired !== false; }
    if (serverSelect) {
      serverSelect.hidden = serverMode !== "select";
      serverSelect.required = useServer && serverMode === "select" && cfg.serverRequired !== false;
      // The shared-select enhancer wraps the native select; hide its wrapper too
      // so manual mode shows only the text input.
      const serverSelectWrapper = serverSelect.closest(".leo-shared-select") || serverSelect;
      serverSelectWrapper.style.display = serverMode === "select" ? "block" : "none";
      if (serverMode === "select") {
        const options = Array.isArray(cfg.serverOptions) ? cfg.serverOptions : [];
        serverSelect.innerHTML = '<option value="">Pilih Server</option>' + options.map(value => '<option value="' + escapeHTML(value) + '">' + escapeHTML(value) + '</option>').join("");
      } else serverSelect.value = "";
    }
    if (serverLabel) serverLabel.textContent = cfg.serverLabel || "Server";
    if (serverInput && !useServer) serverInput.value = "";
    if (playerIdInput && !useId && !isRoblox) playerIdInput.value = "";
    const playerLabel = playerIdInput?.closest(".form-group")?.querySelector("label");
    if (playerLabel) playerLabel.textContent = cfg.idLabel || "Player ID";
    if (playerIdInput) playerIdInput.required = useId && cfg.idRequired !== false;
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
      playerIdInput.placeholder = id === "roblox-via-login" || id === "roblox-via-username" ? "Masukkan Username Roblox" : "Masukkan " + (cfg.idLabel || (isValorant ? "Riot ID" : "Player ID"));
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
            <div class="denomination-title"><span>${escapeHTML(item.amount)}</span></div>
            <div class="denomination-price-row">
              ${item.image ? '<img src="' + escapeHTML(item.image) + '" alt="" class="denomination-product-icon" loading="lazy" style="transform:scale(' + (Math.max(25,Math.min(250,Number(item.imageScale)||100))/100) + ')">' : ""}
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

          // Setelah nominal dipilih, arahkan pelanggan ke metode pembayaran.
          const paymentSection = document.getElementById("paymentMethodsSection");
          if (paymentSection) {
            paymentSection.style.scrollMarginTop = "96px";
            requestAnimationFrame(() => {
              const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
              paymentSection.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
              });
            });
          }
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
      feeFixed: Number(element.dataset.feeFixed || 0),
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
    const base = getBaseTotal();
    const percent = Number(selectedPayment.fee || 0);
    const fixed = Number(selectedPayment.feeFixed || 0);
    if (selectedPayment.feeType === "percent") return Math.round(base * percent / 100);
    if (selectedPayment.feeType === "mixed") return Math.round(base * percent / 100) + fixed;
    return fixed || percent;
  }

  function getPromoDiscount() {
    if (!promoApplied || !appliedPromo) return 0;
    const base = getBaseTotal();
    return appliedPromo.discount_type === "percent"
      ? Math.round(base * Number(appliedPromo.discount_value || 0) / 100)
      : Math.min(base, Number(appliedPromo.discount_value || 0));
  }

  function getTotal() {
    return Math.max(0, getBaseTotal() - getPromoDiscount() + getPaymentFee());
  }

  // Animate displayed summary numbers only; all transaction calculations remain unchanged.
  const summaryNumberFrames = new WeakMap();
  const animateSummaryNumber = (element, targetValue, formatter) => {
    if (!element) return;
    const target = Number(targetValue || 0);
    const displayedText = element.textContent || "";
    const parsedCurrent = Number(displayedText.replace(/[^0-9-]/g, ""));
    const start = Number.isFinite(parsedCurrent) ? parsedCurrent : target;
    const previousFrame = summaryNumberFrames.get(element);
    if (previousFrame) cancelAnimationFrame(previousFrame);

    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduceMotion || start === target) {
      element.textContent = formatter(target);
      summaryNumberFrames.delete(element);
      return;
    }

    const duration = 360;
    const startedAt = performance.now();
    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + (target - start) * eased);
      element.textContent = formatter(value);
      if (progress < 1) {
        summaryNumberFrames.set(element, requestAnimationFrame(tick));
      } else {
        element.textContent = formatter(target);
        summaryNumberFrames.delete(element);
      }
    };
    summaryNumberFrames.set(element, requestAnimationFrame(tick));
  };

  function updateSummary() {
    const quantity = getQuantity();
    animateSummaryNumber(summaryQuantity, quantity, (value) => String(Math.max(0, value)));
    if (summaryName) summaryName.textContent = selectedProduct?.name || "Pilih Game";
    if (summaryDenomination) summaryDenomination.textContent = selectedDenomination?.amount || "Pilih nominal";
    const paymentFee = getPaymentFee();
    const promoDiscount = getPromoDiscount();
    animateSummaryNumber(summaryFee, paymentFee, rupiah);
    animateSummaryNumber(summaryPrice, getBaseTotal(), rupiah);
    animateSummaryNumber(summaryTotal, getTotal(), rupiah);
    if (summaryFeeRow) summaryFeeRow.hidden = !selectedPayment || paymentFee <= 0;
    animateSummaryNumber(summaryDiscount, -promoDiscount, (value) => "-" + rupiah(Math.abs(value)));
    if (summaryDiscountRow) summaryDiscountRow.hidden = !promoApplied || promoDiscount <= 0;
    if (summaryPayment) summaryPayment.textContent = selectedPayment
      ? (selectedPayment.id === "qris" ? "QRIS (All Payment)" : selectedPayment.name)
      : "-";
    const hasProduct = Boolean(selectedProduct && selectedDenomination);
    if (qrisTotalBox) qrisTotalBox.hidden = false;
    if (qrisTotalLabel) qrisTotalLabel.textContent = hasProduct ? "Total Pembayaran" : "Minimal Pembayaran QRIS";
    if (qrisTotalAmount) animateSummaryNumber(qrisTotalAmount, hasProduct ? getTotal() : 100, rupiah);
    if (qrisTotalNote) {
      qrisTotalNote.textContent = "Termasuk biaya layanan QRIS";
      qrisTotalNote.hidden = !hasProduct;
    }
    if (checkoutSummary) checkoutSummary.classList.toggle("has-product", hasProduct);
    if (summaryEmpty) summaryEmpty.hidden = hasProduct;
    if (summaryContent) summaryContent.hidden = !hasProduct;
    if (summaryToggle) {
      summaryToggle.hidden = !hasProduct;
      summaryToggle.setAttribute("aria-expanded", String(checkoutSummary?.classList.contains("expanded") || false));
      summaryToggle.setAttribute("aria-label", checkoutSummary?.classList.contains("expanded") ? "Tutup ringkasan" : "Buka ringkasan");
    }
    if (checkoutButton) checkoutButton.disabled = !hasProduct;
    syncSummarySpacer();

    updateEwalletCards();

    if (summaryImage) {
      if (selectedProduct?.image) {
        summaryImage.src = selectedProduct.image;
        summaryImage.alt = selectedProduct.name || "Produk";
      } else {
        summaryImage.removeAttribute("src");
      }
    }
  }

  function getFeeForPaymentOption(option) {
    const fee = Number(option.dataset.fee || 0);
    const fixed = Number(option.dataset.feeFixed || 0);
    const type = option.dataset.feeType || "fixed";
    const base = getBaseTotal();
    if (type === "percent") return Math.round(base * fee / 100);
    if (type === "mixed") return Math.round(base * fee / 100) + fixed;
    return fixed || fee;
  }

  function updateEwalletCards() {
    document.querySelectorAll(".payment-option-ewallet, .payment-option-va").forEach((option) => {
      const fee = getFeeForPaymentOption(option);
      const total = Math.max(0, getBaseTotal() - getPromoDiscount() + fee);
      const price = option.querySelector(".ewallet-price, .va-price");
      const service = option.querySelector(".ewallet-service-fee, .va-service-fee");
      if (price) price.textContent = selectedDenomination ? rupiah(total) : "Pilih nominal";
      if (service) service.textContent = "Biaya layanan " + rupiah(fee);
    });
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

  const gameInfoTabs = $("gameInfoTabs");
  const checkoutLayout = $("checkoutLayout");
  const gameTopupTab = $("gameTopupTab");
  const gameDescriptionTab = $("gameDescriptionTab");
  const gameDescriptionPanel = $("gameDescriptionPanel");
  const gameDescriptionTitle = $("gameDescriptionTitle");
  const gameDescriptionCopy = $("gameDescriptionCopy");
  const gameReviewAverage = $("gameReviewAverage");
  const gameReviewCount = $("gameReviewCount");
  const gameReviewBars = $("gameReviewBars");
  const gameReviewList = $("gameReviewList");
  let gameReviewRequest = 0;

  function setGameInfoTab(tab) {
    const description = tab === "description";
    if (checkoutLayout) checkoutLayout.hidden = description;
    if (gameDescriptionPanel) gameDescriptionPanel.hidden = !description;
    gameTopupTab?.classList.toggle("active", !description);
    gameDescriptionTab?.classList.toggle("active", description);
    gameTopupTab?.setAttribute("aria-selected", String(!description));
    gameDescriptionTab?.setAttribute("aria-selected", String(description));
  }

  function formatReviewDate(value, includeTime = false) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    const day = new Intl.DateTimeFormat("id-ID", {day:"numeric",month:"short",year:"numeric",timeZone:"Asia/Jakarta"}).format(date);
    if (!includeTime) return day;
    return day + " · " + new Intl.DateTimeFormat("id-ID", {hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"Asia/Jakarta"}).format(date) + " WIB";
  }

  async function renderGameDescriptionReviews(product) {
    if (!product) {
      if (gameInfoTabs) gameInfoTabs.hidden = true;
      if (gameDescriptionPanel) gameDescriptionPanel.hidden = true;
      if (checkoutLayout) checkoutLayout.hidden = false;
      return;
    }
    if (gameInfoTabs) gameInfoTabs.hidden = false;
    if (gameDescriptionTitle) gameDescriptionTitle.textContent = "Deskripsi " + (product.name || "Game");
    if (gameDescriptionCopy) gameDescriptionCopy.textContent = String(product.description || "").trim() || "Deskripsi game belum ditambahkan oleh admin.";
    if (gameReviewList) gameReviewList.innerHTML = '<div class="game-review-empty">Memuat ulasan pelanggan…</div>';
    if (gameReviewAverage) gameReviewAverage.textContent = "—";
    if (gameReviewCount) gameReviewCount.textContent = "Memuat ulasan…";
    if (gameReviewBars) gameReviewBars.innerHTML = "";
    const requestId = ++gameReviewRequest;
    try {
      const response = await fetch("https://spring-surf-a6a7.leovbriansyh791.workers.dev/api/reviews?limit=10&game=" + encodeURIComponent(product.name || ""), {cache:"no-store"});
      const data = await response.json();
      if (requestId !== gameReviewRequest) return;
      if (!response.ok || !data.ok) throw new Error(data.error || "Ulasan tidak tersedia");
      if (gameReviewAverage) gameReviewAverage.textContent = Number(data.average || 0).toFixed(1);
      if (gameReviewCount) gameReviewCount.textContent = Number(data.count || 0) + " ulasan untuk " + (product.name || "game ini");
      const distribution = data.ratingDistribution || {};
      if (gameReviewBars) gameReviewBars.innerHTML = [5,4,3,2,1].map(star => {
        const count = Number(distribution[star] || 0);
        const percent = Number(data.count) ? Math.round(count / Number(data.count) * 100) : 0;
        return '<div class="game-review-bar"><span>' + star + '</span><div class="game-review-bar-track"><div class="game-review-bar-fill" style="width:' + percent + '%"></div></div><span>' + count + '</span></div>';
      }).join("");
      if (!data.items?.length) {
        if (gameReviewList) gameReviewList.innerHTML = '<div class="game-review-empty">Belum ada ulasan untuk game ini. Ulasan pelanggan akan tampil setelah transaksi berhasil dan pelanggan mengirimkan ulasan.</div>';
        return;
      }
      if (gameReviewList) gameReviewList.innerHTML = data.items.slice(0,10).map(item =>
        '<article class="game-review-card"><div class="game-review-card-top"><strong>' + escapeHTML(item.displayName || "Pelanggan LEOOSTORE.id") + '</strong><span class="stars">' + "★".repeat(Math.max(0,Math.min(5,Number(item.rating)||0))) + '</span></div>' +
        '<p>' + (item.comment ? escapeHTML(item.comment) : 'Pelanggan memberikan rating tanpa komentar.') + '</p>' +
        '<div class="game-review-meta">' + escapeHTML(item.denomination || "Nominal tidak tersedia") + '<br>Transaksi: ' + escapeHTML(formatReviewDate(item.transactionCreatedAt,true)) + ' · Ulasan: ' + escapeHTML(formatReviewDate(item.createdAt)) + '</div></article>'
      ).join("");
    } catch (error) {
      if (requestId !== gameReviewRequest) return;
      if (gameReviewList) gameReviewList.innerHTML = '<div class="game-review-empty">Ulasan belum dapat dimuat. Silakan coba lagi nanti.</div>';
      if (gameReviewCount) gameReviewCount.textContent = "Ulasan belum tersedia";
      console.warn("[LEOOSTORE] Game reviews:", error);
    }
  }

  gameTopupTab?.addEventListener("click", () => setGameInfoTab("topup"));
  gameDescriptionTab?.addEventListener("click", () => setGameInfoTab("description"));

  function selectGame(gameId) {
    selectedProduct = getProduct(gameId);
    selectedDenomination = null;
    selectedPayment = null;
    if (paymentInput) paymentInput.value = "";
    document.querySelectorAll(".payment-option").forEach((option) => option.classList.remove("selected"));
    updateHero(selectedProduct);
    renderGameDescriptionReviews(selectedProduct);
    setGameInfoTab("topup");
    updateAccountFields(selectedProduct);
    renderDenominations(selectedProduct);
    updateSummary();
    showRobloxPreorderInfo(selectedProduct);
  }

  function setupPayments() {
    const paymentList = document.querySelector(".payment-list");
    if (!paymentList || paymentList.dataset.handlersReady) return;
    paymentList.dataset.handlersReady = "true";
    paymentList.addEventListener("click", (event) => {
      const header = event.target.closest(".payment-category-header");
      if (header) {
        const category = header.closest(".payment-category");
        if (category) {
          const willOpen = category.classList.contains("closing") || !category.classList.contains("open");
          category.classList.remove("closing");
          if (willOpen) category.classList.add("open");
          const body = category.querySelector(":scope > .payment-category-body");
          header.setAttribute("aria-expanded", String(willOpen));
          const arrow = header.querySelector("span:last-child");
          if (arrow) arrow.textContent = "⌄";

          if (body) {
            body.getAnimations().forEach((animation) => animation.cancel());
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (reduceMotion) {
              category.classList.toggle("open", willOpen);
              body.hidden = !willOpen;
              body.style.removeProperty("height");
              body.style.removeProperty("overflow");
            } else if (willOpen) {
              body.hidden = false;
              body.style.overflow = "hidden";
              const targetHeight = body.scrollHeight;
              const animation = body.animate(
                [{ height: "0px", opacity: 0 }, { height: targetHeight + "px", opacity: 1 }],
                { duration: 320, easing: "cubic-bezier(.22,.75,.25,1)", fill: "both" }
              );
              animation.onfinish = () => {
                if (category.classList.contains("open")) {
                  body.style.removeProperty("height");
                  body.style.removeProperty("overflow");
                }
              };
            } else {
              category.classList.add("closing");
              const currentHeight = body.getBoundingClientRect().height;
              body.style.overflow = "hidden";
              const animation = body.animate(
                [{ height: currentHeight + "px", opacity: 1 }, { height: "0px", opacity: 0 }],
                { duration: 280, easing: "cubic-bezier(.4,0,.2,1)", fill: "both" }
              );
              animation.onfinish = () => {
                if (category.classList.contains("closing")) {
                  category.classList.remove("open", "closing");
                  body.hidden = true;
                  body.style.removeProperty("height");
                  body.style.removeProperty("overflow");
                }
              };
            }
          }
        }
        return;
      }
      const option = event.target.closest(".payment-option");
      if (option) selectPayment(option);
    });
    paymentList.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && event.target.matches(".payment-option")) {
        event.preventDefault(); selectPayment(event.target);
      }
      if ((event.key === "Enter" || event.key === " ") && event.target.matches(".payment-category-header")) {
        event.preventDefault(); event.target.click();
      }
    });
  }

  async function loadQrisPaymentImage() {
    try {
      if (!window.supabase?.createClient) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
          script.onload = resolve; script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      const db = window.supabase.createClient(
        "https://tvdbrqskvuukxvqaqjom.supabase.co",
        "sb_publishable_2f-IadmcnaYzoCb_8Iko0w_pFp9u8eF"
      );
      const { data, error } = await db.from("store_payment_methods")
        .select("id,name,category,activation_status,is_enabled,sort_order,logo_url,fee_type,fee_value,fee_fixed,show_fee")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      const methods = data || [];
      const available = methods.filter((m) => m.is_enabled === true && m.activation_status === "active" && !["PayLater", "Kartu"].includes(m.category));
      const byId = new Map(available.map((m) => [m.id, m]));
      const setOptionData = (option, method) => {
        option.dataset.paymentName = method.name || method.id;
        option.dataset.fee = String(Number(method.fee_value || 0));
        option.dataset.feeFixed = String(Number(method.fee_fixed || 0));
        option.dataset.feeType = String(method.fee_type || "fixed");
        option.dataset.showFee = String(method.show_fee !== false);
        const img = option.querySelector("img");
        if (method.logo_url && img) img.src = method.logo_url;
      };

      const qrisCategory = document.querySelector(".payment-category-qris");
      const qris = byId.get("qris");
      if (qrisCategory) qrisCategory.hidden = !qris;
      const qrisOption = document.querySelector('.payment-option[data-payment-id="qris"]');
      if (qris && qrisOption) {
        setOptionData(qrisOption, qris);
        if (selectedPayment?.id === "qris") {
          selectedPayment.fee = Number(qrisOption.dataset.fee || 0);
          selectedPayment.feeFixed = Number(qrisOption.dataset.feeFixed || 0);
          selectedPayment.feeType = qrisOption.dataset.feeType;
        }
      } else if (selectedPayment?.id === "qris") {
        selectedPayment = null; if (paymentInput) paymentInput.value = "";
      }

      const ewalletMethods = available.filter((m) => m.category === "E-Wallet");
      const ewalletCategory = document.querySelector(".payment-category-ewallet");
      if (ewalletCategory) ewalletCategory.hidden = ewalletMethods.length === 0;
      document.querySelectorAll(".payment-category-ewallet .payment-option").forEach((option) => {
        const method = byId.get(option.dataset.paymentId);
        option.hidden = !method;
        if (!method) {
          if (selectedPayment?.id === option.dataset.paymentId) { selectedPayment = null; if (paymentInput) paymentInput.value = ""; }
          return;
        }
        setOptionData(option, method);
        const image = method.logo_url || option.querySelector("img")?.src || "";
        option.classList.add("payment-option-ewallet");
        option.setAttribute("aria-label", "Pilih pembayaran " + String(method.name || method.id).replace(/\s*virtual\s+account\s*$/i, "").trim());
        const showFee = method.show_fee !== false;
        option.innerHTML = '<span class="ewallet-logo-wrap"><img src="' + image + '" alt="" loading="lazy"></span><strong class="ewallet-price">Pilih nominal</strong><span class="ewallet-divider" aria-hidden="true" ' + (showFee ? "" : "hidden") + '></span><span class="ewallet-service-fee" ' + (showFee ? "" : "hidden") + '>Biaya layanan Rp0</span>';
      });
      document.querySelectorAll("[data-ewallet-preview]").forEach((preview) => {
        const method = byId.get(preview.dataset.ewalletPreview);
        preview.hidden = !method;
        if (method?.logo_url) preview.src = method.logo_url;
      });

      const dynamicHost = document.getElementById("paymentDynamicCategories");
      if (dynamicHost) {
        dynamicHost.innerHTML = "";
        const groups = [
          { key: "Virtual Account", title: "Virtual Account", methods: available.filter((m) => m.category === "Virtual Account") },
          { key: "Alfa Group", title: "Alfa Group", methods: available.filter((m) => m.id === "alfagroup") }
        ].filter((g) => g.methods.length);
        const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
        groups.forEach((group) => {
          const category = document.createElement("div");
          category.className = "payment-category payment-category-dynamic";
          if (group.key === "Virtual Account") category.classList.add("payment-category-virtual-account");
          category.dataset.category = group.key;
          const header = document.createElement("button");
          header.type = "button";
          header.className = "payment-category-header";
          header.setAttribute("aria-expanded", "false");
          const title = document.createElement("span"); title.textContent = group.title;
          const arrow = document.createElement("span"); arrow.textContent = "⌄";
          header.append(title, arrow);
          const body = document.createElement("div");
          body.className = "payment-category-body";
          body.hidden = true;
          body.id = "payment-category-body-" + group.key.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          header.setAttribute("aria-controls", body.id);

          let logoPreview = null;
          if (group.key === "Virtual Account") {
            logoPreview = document.createElement("div");
            logoPreview.className = "va-logo-preview";
            logoPreview.setAttribute("aria-label", "Bank Virtual Account tersedia");
            group.methods.forEach((method) => {
              if (!method.logo_url) return;
              const previewImg = document.createElement("img");
              previewImg.src = method.logo_url;
              previewImg.alt = String(method.name || method.id).replace(/\s*virtual\s+account\s*$/i, "").trim();
              previewImg.loading = "lazy";
              logoPreview.appendChild(previewImg);
            });
          }

          group.methods.forEach((method) => {
            const option = document.createElement("div");
            option.className = "payment-option payment-option-va";
            option.dataset.paymentId = method.id;
            option.dataset.paymentName = method.name;
            option.dataset.fee = String(Number(method.fee_value || 0));
            option.dataset.feeFixed = String(Number(method.fee_fixed || 0));
            option.dataset.feeType = method.fee_type || "fixed";
            option.setAttribute("role", "button"); option.tabIndex = 0;
            option.setAttribute("aria-label", "Pilih pembayaran " + method.name);

            const logoWrap = document.createElement("span");
            logoWrap.className = "va-logo-wrap";
            const img = document.createElement("img");
            img.src = method.logo_url || "";
            const displayName = String(method.name || method.id)
              .replace(/\s*virtual\s+account\s*$/i, "")
              .trim();
            img.alt = displayName + " logo";
            img.loading = "lazy";
            logoWrap.appendChild(img);

            const name = document.createElement("strong");
            name.className = "va-bank-name";
            name.textContent = displayName;
            const price = document.createElement("strong");
            price.className = "va-price";
            price.textContent = "Pilih nominal";
            const divider = document.createElement("span");
            divider.className = "va-divider";
            divider.setAttribute("aria-hidden", "true");
            const service = document.createElement("span");
            service.className = "va-service-fee";
            service.textContent = "Biaya layanan Rp0";
            if (method.show_fee === false) {
              divider.hidden = true;
              service.hidden = true;
            }
            option.append(logoWrap, name, price, divider, service);
            body.appendChild(option);
          });
          if (logoPreview && logoPreview.childElementCount) category.append(header, logoPreview, body);
          else category.append(header, body);
          dynamicHost.appendChild(category);
        });
      }
      updateSummary();
    } catch (error) {
      console.warn("Payment methods from Admin could not be loaded.", error);
    }
  }
  async function applyPromo() {
    const code = String(promoInput?.value || "").trim().toUpperCase();
    promoApplied = false; appliedPromo = null;
    if (!code) { if (promoMessage) promoMessage.textContent = "Masukkan kode promo."; updateSummary(); return; }
    try {
      if (!window.supabase?.createClient) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
          script.onload = resolve; script.onerror = reject; document.head.appendChild(script);
        });
      }
      const db = window.supabase.createClient("https://tvdbrqskvuukxvqaqjom.supabase.co", "sb_publishable_2f-IadmcnaYzoCb_8Iko0w_pFp9u8eF");
      const {data: promoRows, error} = await db.from("store_promos").select("id,code,discount_type,discount_value,is_active,starts_at,ends_at,usage_limit,usage_count,per_user_limit,min_purchase").eq("is_active", true);
      if (error) throw error;
      const data = (promoRows || []).find((row) => String(row.code || "").trim().toUpperCase() === code);
      if (!data) throw new Error("Kode promo tidak ditemukan atau nonaktif. Pastikan kode tersimpan dan statusnya Aktif.");
      const now = Date.now();
      if (data.starts_at && new Date(data.starts_at).getTime() > now) throw new Error("Kode promo belum berlaku.");
      if (data.ends_at && new Date(data.ends_at).getTime() < now) throw new Error("Masa berlaku promo sudah habis.");
      if (data.usage_limit != null && Number(data.usage_count || 0) >= Number(data.usage_limit)) throw new Error("Kuota promo sudah habis.");
      if (getBaseTotal() < Number(data.min_purchase || 0)) throw new Error("Minimum transaksi Rp" + Number(data.min_purchase).toLocaleString("id-ID") + ".");
      if (!["fixed","percent"].includes(data.discount_type) || Number(data.discount_value) <= 0 || (data.discount_type === "percent" && Number(data.discount_value) > 100)) throw new Error("Pengaturan diskon tidak valid.");
      appliedPromo = data; promoApplied = true;
      if (promoMessage) promoMessage.textContent = "Kode " + code + " berhasil digunakan.";
    } catch (err) {
      if (promoMessage) promoMessage.textContent = err.message || "Gagal memeriksa kode promo.";
    }
    updateSummary();
  }

  async function createOrder() {
    if (!selectedProduct) return showCheckoutNotice("Silakan pilih game terlebih dahulu.", "Game Belum Dipilih");
    if (!selectedDenomination) return showCheckoutNotice("Silakan pilih nominal terlebih dahulu.", "Nominal Belum Dipilih");

    const isRoblox = selectedProduct.id === "roblox-via-login" || selectedProduct.id === "roblox-via-username";
    if (isRoblox) {
      if (!robloxUsername?.value.trim()) {
        showCheckoutNotice("Silakan masukkan Username Roblox.", "Data Akun Belum Lengkap");
        robloxUsername?.focus();
        return;
      }
      if (!robloxPassword?.value) {
        showCheckoutNotice("Silakan masukkan Password Roblox.", "Data Akun Belum Lengkap");
        robloxPassword?.focus();
        return;
      }
    } else if (selectedProduct.useId !== false && selectedProduct.accountConfig?.idRequired !== false && !playerIdInput?.value.trim()) {
      showCheckoutNotice("Silakan masukkan " + (selectedProduct.accountConfig?.idLabel || "Player ID") + ".", "Data Akun Belum Lengkap");
      playerIdInput?.focus();
      return;
    }
    const activeServerMode = selectedProduct.accountConfig?.serverMode || (selectedProduct.useServer !== false && !isRoblox && !isPubg && !isFreeFire && !isValorant ? "manual" : "none");
    const selectedServerValue = activeServerMode === "select" ? serverSelect?.value.trim() : serverInput?.value.trim();
    if (!isRoblox && activeServerMode !== "none" && selectedProduct.accountConfig?.serverRequired !== false && !selectedServerValue) {
      showCheckoutNotice("Silakan pilih atau masukkan Server.", "Data Akun Belum Lengkap");
      (activeServerMode === "select" ? serverSelect : serverInput)?.focus();
      return;
    }
    if (!selectedPayment) return showCheckoutNotice("Silakan pilih metode pembayaran.", "Metode Pembayaran Belum Dipilih");
    const orderId = "LEO-" + Date.now().toString(36).toUpperCase();
    const order = {
      id: orderId,
      orderId,
      gameId: selectedProduct.id,
      game: selectedProduct.name,
      gameName: selectedProduct.name,
      playerId: isRoblox ? robloxUsername.value.trim() : playerIdInput.value.trim(),
      username: isRoblox ? robloxUsername.value.trim() : "",
      server: (serverSelect && !serverSelect.hidden ? serverSelect.value : serverInput?.value)?.trim() || "",
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
      promo: promoApplied && appliedPromo ? appliedPromo.code : "",
      status: "Menunggu Pembayaran",
      createdAt: new Date().toISOString()
    };

    if (checkoutButton) {
      checkoutButton.disabled = true;
      checkoutButton.textContent = "Membuat Pembayaran...";
    }

    try {
      const paymentPayload = JSON.stringify({
        orderId,
        productId: selectedProduct.id,
        denominationId: selectedDenomination.id,
        quantity: getQuantity(),
        paymentId: selectedPayment.id,
        email: order.email,
        whatsapp: order.whatsapp,
        playerId: order.playerId,
        server: order.server,
        promo: order.promo,
        robloxPassword: isRoblox ? robloxPassword.value : ""
      });

      let response;
      try {
        response = await fetch("https://spring-surf-a6a7.leovbriansyh791.workers.dev/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: paymentPayload,
          cache: "no-store"
        });
      } catch (networkError) {
        console.error("Payment API network error:", networkError);
        throw new Error("Payment server tidak dapat dihubungi. Coba refresh halaman dan ulangi.");
      }

      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        if (result.stage === "supabase-catalog") {
          const gamesCode = Number.isFinite(Number(result.gamesStatus)) ? result.gamesStatus : "tidak diketahui";
          const productsCode = Number.isFinite(Number(result.productsStatus)) ? result.productsStatus : "tidak diketahui";
          console.error("Checkout catalog verification failed:", {
            httpStatus: response.status,
            gamesStatus: result.gamesStatus,
            productsStatus: result.productsStatus,
            diagnostic: result.diagnostic
          });
          throw new Error(
            "Katalog belum dapat diverifikasi (HTTP " + response.status +
            "; store_games: " + gamesCode +
            "; store_products: " + productsCode +
            "). Kirim kode ini ke admin agar bisa diperbaiki."
          );
        }
        throw new Error(result.error || "Gagal membuat pembayaran.");
      }

      if (isRoblox && robloxPassword) robloxPassword.value = "";

      order.midtransToken = result.token || "";
      order.paymentUrl = result.redirectUrl || "";
      order.backendStatus = result.status || "Menunggu Pembayaran";

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

      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        window.location.href = "payment.html?id=" + encodeURIComponent(orderId);
      }
    } catch (error) {
      console.error("Payment creation failed:", error);
      if (checkoutButton) {
        checkoutButton.disabled = false;
        checkoutButton.textContent = "Bayar Sekarang";
      }
      showCheckoutNotice(error.message || "Gagal membuat pembayaran. Silakan coba lagi.", "Pembayaran Belum Berhasil");
    }
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
  loadQrisPaymentImage();

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

  // Reveal the hero only after catalog data and the requested game state are applied.
  document.body.classList.remove("checkout-catalog-loading");
});
